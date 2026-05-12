"""
RAG pipeline orchestrator — ties retrieval and generation together.
query → embed → retrieve → generate → format → return
"""

import logging
import uuid
import re

from rag.retriever import retrieve
from rag.generator import generate_answer
from config import settings

logger = logging.getLogger("lawwise.pipeline")


async def rag_pipeline(
    query: str,
    session_id: str | None = None,
    conversation_id: str | None = None,
) -> dict:
    """
    Full RAG pipeline:
    1. Retrieve relevant legal chunks from vector store
    2. Generate structured answer with Gemini
    3. Return formatted result with metadata

    Returns dict ready for LegalQueryResponse construction.
    """
    query_id = uuid.uuid4().hex

    logger.info("[%s] RAG pipeline started: %s", query_id[:8], query[:80])

    # ── 1. Retrieve ─────────────────────────────────────────────────
    retrieval = retrieve(query=query)
    chunks = retrieval["chunks"]
    confidence = retrieval["confidence"]

    logger.info(
        "[%s] Retrieved %d chunks (confidence=%s)",
        query_id[:8],
        len(chunks),
        confidence,
    )

    # ── 2. Generate ─────────────────────────────────────────────────
    answer = await generate_answer(
        query=query,
        chunks=chunks,
        confidence=confidence,
    )

    # Keep landlord/eviction questions from being understated by the model.
    eviction_terms = {"evict", "eviction", "vacate", "landlord", "tenant", "lease", "notice", "lockout"}
    if set(re.findall(r"[a-zA-Z]{3,}", query.lower())) & eviction_terms:
        if str(answer.get("urgency", "")).lower() == "low":
            answer["urgency"] = "moderate"

    logger.info("[%s] Answer generated (urgency=%s)", query_id[:8], answer.get("urgency"))

    # ── 3. Format result ────────────────────────────────────────────
    return {
        "query_id": query_id,
        "answer": answer,
        "confidence": confidence,
        "sources_retrieved": len(chunks),
        "retrieved_source_ids": retrieval["source_ids"],
        "retrieval_scores": retrieval["scores"],
        "model_used": settings.llm_model,
    }
