"""
LLM answer generation using Google Gemini.
Produces structured legal responses grounded in retrieved context.
API key never leaves the server.
"""

import json
import logging
from google import genai
from google.genai import types
from config import settings

logger = logging.getLogger("lawwise.generator")

_client: genai.Client | None = None


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        if not settings.gemini_api_key:
            raise RuntimeError(
                "GEMINI_API_KEY is not set. Add it to backend/.env — "
                "get a free key at https://aistudio.google.com/apikey"
            )
        _client = genai.Client(api_key=settings.gemini_api_key)
    return _client


SYSTEM_PROMPT = """You are LawWise, an AI legal information assistant specializing in Indian law. You provide clear, accurate, citation-grounded legal information to help ordinary Indian citizens understand their legal rights and options.

IMPORTANT RULES:
1. Use only the legal context provided below to support your answer. Do NOT invent legal sections, acts, or provisions that are not in the provided context.
2. If the context is insufficient to answer the query, say so honestly. State what you can infer and what remains uncertain.
3. Reference the current criminal law framework: Bharatiya Nyaya Sanhita (BNS) 2023, Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023, and Bharatiya Sakshya Adhiniyam (BSA) 2023. Reference IPC/CrPC/Evidence Act only if discussing historical context or if those are the only sources in the provided context.
4. Never provide specific legal advice. Always clarify you provide legal information, not advice.
5. Be empathetic, clear, and use plain language that a non-lawyer can understand.
6. If the situation involves immediate danger, recommend contacting emergency services first.
7. Eviction/Landlord Notice Rules: If the query is about eviction, notice periods, or landlord-tenant disputes, set urgency to at least "moderate" (or "critical" if forced removal/threats are mentioned). If TPA Section 106 is in the context, explicitly state:
   - Notice is generally required for lease termination under TPA Section 106.
   - Month-to-month leases generally require 15 days' notice.
   - Agricultural/manufacturing leases generally require 6 months' notice.
   - Contract terms, local/state rent laws, or court orders may change this.

You MUST respond with valid JSON matching this exact structure:
{
  "summary": "One-paragraph plain-language summary of the legal position",
  "explanation": "Detailed legal analysis (2-4 paragraphs) with references to specific sections from the provided context",
  "urgency": "critical|moderate|low",
  "citations": [
    {"ref": "Act Name, Year · § Section", "note": "Brief explanation of relevance"}
  ],
  "actions": ["Step 1...", "Step 2...", "Step 3...", "Step 4...", "Step 5..."],
  "evidence": ["Document or evidence item to collect..."],
  "follow_ups": ["Follow-up question 1?", "Follow-up question 2?", "Follow-up question 3?", "Follow-up question 4?"],
  "disclaimer": "This is legal information for educational purposes only. For advice specific to your situation, consult a qualified advocate."
}

Respond ONLY with the JSON object. No markdown, no code fences, no extra text."""


def _build_context(chunks: list[dict]) -> str:
    """Format retrieved chunks into context for the LLM."""
    if not chunks:
        return "NO LEGAL CONTEXT AVAILABLE — answer based on general legal knowledge and clearly state that specific provisions could not be retrieved."

    parts = []
    for i, chunk in enumerate(chunks, 1):
        payload = chunk.get("payload", {})
        act = payload.get("act_name", "Unknown")
        section = payload.get("section_hint", "")
        section_title = payload.get("section_title", "")
        text = payload.get("text", "")
        score = chunk.get("score", 0)

        section_str = f" · {section}" if section else ""
        title_str = f" ({section_title})" if section_title else ""
        parts.append(
            f"[Source {i}] {act}{section_str}{title_str} (relevance: {score:.2f})\n{text}"
        )

    return "\n\n---\n\n".join(parts)


LOW_CONFIDENCE_ADDENDUM = """

NOTE: The retrieval confidence for this query is LOW. The provided legal context may not be directly relevant. Be extra cautious:
- Clearly state what is uncertain
- Do not make strong legal claims
- Recommend consulting a qualified advocate
- Set urgency to at least "moderate"
"""


async def generate_answer(
    query: str,
    chunks: list[dict],
    confidence: str,
) -> dict:
    """
    Generate a structured legal answer using Gemini.

    Returns parsed dict with: summary, explanation, urgency, citations, actions, evidence, follow_ups, disclaimer
    """
    context = _build_context(chunks)
    user_content = f"LEGAL CONTEXT:\n{context}\n\nUSER QUESTION:\n{query}"

    if confidence == "low":
        user_content += LOW_CONFIDENCE_ADDENDUM

    client = _get_client()

    try:
        response = client.models.generate_content(
            model=settings.llm_model,
            contents=user_content,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                temperature=0.3,
                max_output_tokens=4096,
            ),
        )

        raw_text = response.text.strip()

        # Strip markdown code fences if the model wraps the JSON
        if raw_text.startswith("```"):
            # Remove ```json or ``` at start and ``` at end
            lines = raw_text.split("\n")
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            raw_text = "\n".join(lines)

        parsed = json.loads(raw_text)

        # Validate required fields
        required = ["summary", "explanation", "urgency", "citations", "actions", "evidence", "follow_ups"]
        for field in required:
            if field not in parsed:
                parsed[field] = _default_for_field(field)

        # Ensure disclaimer is always present
        if "disclaimer" not in parsed or not parsed["disclaimer"]:
            parsed["disclaimer"] = (
                "This is legal information for educational purposes only. "
                "For advice specific to your situation, consult a qualified advocate."
            )

        # Attach source_id to citations for traceability
        for i, citation in enumerate(parsed.get("citations", [])):
            if "source_id" not in citation and i < len(chunks):
                citation["source_id"] = chunks[i].get("payload", {}).get("source_id", "")
            elif "source_id" not in citation:
                citation["source_id"] = ""

        logger.info("Generated answer (urgency=%s, citations=%d)", parsed["urgency"], len(parsed["citations"]))
        return parsed

    except json.JSONDecodeError as e:
        logger.error("Failed to parse LLM response as JSON: %s", e)
        return _fallback_response(query, confidence)
    except Exception as e:
        logger.exception("Gemini API call failed: %s", e)
        raise


def _default_for_field(field: str):
    defaults = {
        "summary": "Unable to generate a complete summary for this query.",
        "explanation": "The legal analysis could not be fully completed. Please try rephrasing your question.",
        "urgency": "moderate",
        "citations": [],
        "actions": ["Consult a qualified legal advocate for advice specific to your situation."],
        "evidence": [],
        "follow_ups": [],
    }
    return defaults.get(field, "")


def _fallback_response(query: str, confidence: str) -> dict:
    """Return a safe fallback when LLM response can't be parsed."""
    return {
        "summary": "I was unable to fully process your legal query. Please try rephrasing or providing more details.",
        "explanation": (
            "The AI model returned a response that could not be properly parsed. "
            "This does not reflect the validity of your legal concern. "
            "Please try asking your question in a different way, or consult a qualified advocate."
        ),
        "urgency": "moderate",
        "citations": [],
        "actions": [
            "Try rephrasing your question with more specific details",
            "Mention the specific law or situation you are concerned about",
            "Consult a qualified legal advocate for personalized advice",
        ],
        "evidence": [],
        "follow_ups": [
            "Can you describe your situation in more detail?",
            "Which specific legal area does your question relate to?",
        ],
        "disclaimer": (
            "This is legal information for educational purposes only. "
            "For advice specific to your situation, consult a qualified advocate."
        ),
    }
