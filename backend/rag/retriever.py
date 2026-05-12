"""
Retriever: vector search plus lightweight legal-domain reranking.
"""

from __future__ import annotations

import logging
import re

from config import settings
from db.database import SessionLocal
from db.models import LegalSource
from rag.embeddings import embedding_model
from rag.vector_store import vector_store

logger = logging.getLogger("lawwise.retriever")

HIGH_CONFIDENCE_THRESHOLD = 0.45
LOW_CONFIDENCE_THRESHOLD = 0.25

LANDLORD_NOTICE_TERMS = {
    "evict",
    "eviction",
    "notice",
    "landlord",
    "tenant",
    "tenancy",
    "lease",
    "leased",
    "vacate",
    "rent",
    "rented",
}


def _query_terms(query: str) -> set[str]:
    return set(re.findall(r"[a-zA-Z]{3,}", query.lower()))


def _payload_from_source(source: LegalSource, score: float, reason: str) -> dict:
    section_hint = f"Section {source.section_number}" if source.section_number else ""
    payload = {
        "source_id": source.id,
        "act_name": source.act_name,
        "section_number": source.section_number,
        "section_title": source.section_title,
        "section_hint": section_hint,
        "chunk_index": source.chunk_index,
        "jurisdiction": source.jurisdiction,
        "source_file": source.source_file,
        "text": source.full_text,
        "retrieval_reason": reason,
    }
    return {"id": source.id, "score": score, "payload": payload}


def _lexical_fallback(query: str) -> list[dict]:
    """Pull direct statutory matches from SQLite when dense retrieval misses them."""
    query_lower = query.lower()
    terms = _query_terms(query)
    results: list[dict] = []

    db = SessionLocal()
    try:
        if terms & LANDLORD_NOTICE_TERMS:
            section_106 = (
                db.query(LegalSource)
                .filter(LegalSource.act_name.ilike("%Transfer of Property%"))
                .filter(
                    (LegalSource.section_number == "106")
                    | (LegalSource.full_text.ilike("%Duration of certain leases%"))
                    | (LegalSource.full_text.ilike("%fifteen days%"))
                )
                .order_by(LegalSource.section_number.desc())
                .first()
            )
            if section_106:
                results.append(_payload_from_source(section_106, 0.98, "landlord_notice_section_106"))

        explicit_sections = re.findall(r"(?:section|sec\.?|s\.)\s*(\d+[a-z]?)", query_lower)
        for section in explicit_sections:
            matches = (
                db.query(LegalSource)
                .filter(LegalSource.section_number == section.upper())
                .limit(5)
                .all()
            )
            for match in matches:
                results.append(_payload_from_source(match, 0.92, "explicit_section_match"))

        if not results and terms:
            like_terms = [term for term in terms if term not in {"what", "when", "where", "can", "does", "have"}][:5]
            for term in like_terms:
                matches = db.query(LegalSource).filter(LegalSource.full_text.ilike(f"%{term}%")).limit(3).all()
                for match in matches:
                    results.append(_payload_from_source(match, 0.35, "keyword_match"))
    finally:
        db.close()

    return results


def _rerank_score(result: dict, query: str) -> float:
    payload = result.get("payload", {})
    score = float(result.get("score", 0.0))
    query_lower = query.lower()
    terms = _query_terms(query)

    act = (payload.get("act_name") or "").lower()
    section = str(payload.get("section_number") or payload.get("section_hint") or "").lower()
    title = (payload.get("section_title") or "").lower()
    text = (payload.get("text") or "").lower()

    if "transfer of property" in act and terms & LANDLORD_NOTICE_TERMS:
        score += 0.18
    if "106" in section and terms & LANDLORD_NOTICE_TERMS:
        score += 0.45
    if "duration of certain leases" in title:
        score += 0.35
    if "fifteen days" in text and "six months" in text and terms & LANDLORD_NOTICE_TERMS:
        score += 0.35
    if "notice to quit" in text and "notice" in terms:
        score += 0.08

    explicit_sections = re.findall(r"(?:section|sec\.?|s\.)\s*(\d+[a-z]?)", query_lower)
    if explicit_sections and any(explicit in section for explicit in explicit_sections):
        score += 0.3

    return score


def retrieve(
    query: str,
    top_k: int | None = None,
    act_filter: str | None = None,
) -> dict:
    """
    Embed query, retrieve vector matches, add direct statutory fallbacks, and rerank.
    """
    k = top_k or settings.retrieval_top_k
    query_vector = embedding_model.embed_text(query)

    results = vector_store.search(
        query_vector=query_vector,
        top_k=max(k * 4, 20),
        act_filter=act_filter,
    )
    results.extend(_lexical_fallback(query))

    if not results:
        logger.warning("No results found for query: %s", query[:100])
        return {"chunks": [], "confidence": "low", "source_ids": [], "scores": []}

    deduped: dict[str, dict] = {}
    for result in results:
        payload = result.get("payload", {})
        source_id = payload.get("source_id") or result.get("id")
        reranked = dict(result)
        reranked["score"] = _rerank_score(result, query)
        if source_id not in deduped or reranked["score"] > deduped[source_id]["score"]:
            deduped[source_id] = reranked

    ranked = sorted(deduped.values(), key=lambda item: item["score"], reverse=True)[:k]
    top_score = ranked[0]["score"]

    if top_score >= HIGH_CONFIDENCE_THRESHOLD:
        confidence = "high"
    elif top_score >= LOW_CONFIDENCE_THRESHOLD:
        confidence = "medium"
    else:
        confidence = "low"

    logger.info(
        "Retrieved %d chunks (top_score=%.3f, confidence=%s) for: %s",
        len(ranked),
        top_score,
        confidence,
        query[:80],
    )

    return {
        "chunks": ranked,
        "confidence": confidence,
        "source_ids": [r["payload"].get("source_id", r["id"]) for r in ranked],
        "scores": [round(r["score"], 4) for r in ranked],
    }
