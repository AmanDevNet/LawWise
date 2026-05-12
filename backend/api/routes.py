"""
API route definitions for LawWise Phase 1.
"""

import time
import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session as DBSession

from api.schemas import (
    LegalQueryRequest,
    LegalQueryResponse,
    HealthResponse,
)
from db.database import get_db
from db.models import Session, Conversation, Message, QueryLog
from rag.pipeline import rag_pipeline

logger = logging.getLogger("lawwise.api")

router = APIRouter(prefix="/api")


# ── Health ──────────────────────────────────────────────────────────────
@router.get("/health", response_model=HealthResponse)
async def health():
    from rag.embeddings import embedding_model
    from rag.vector_store import vector_store

    return HealthResponse(
        status="ok",
        version="0.1.0",
        components={
            "database": "sqlite (connected)",
            "vector_store": f"qdrant (in-memory, {vector_store.count()} vectors)",
            "embeddings": f"{embedding_model.model_name} (loaded)",
            "llm": "gemini-2.0-flash",
        },
    )


# ── Ask LawWise ─────────────────────────────────────────────────────────
@router.post("/ask", response_model=LegalQueryResponse)
async def ask_lawwise(req: LegalQueryRequest, db: DBSession = Depends(get_db)):
    t0 = time.perf_counter()

    # ── Resolve or create session / conversation ────────────────────
    session = None
    if req.session_id:
        session = db.query(Session).filter_by(id=req.session_id).first()
    if session is None:
        session = Session()
        db.add(session)
        db.flush()

    conversation = None
    if req.conversation_id:
        conversation = db.query(Conversation).filter_by(id=req.conversation_id).first()
    if conversation is None:
        conversation = Conversation(
            session_id=session.id,
            title=req.query[:120],
        )
        db.add(conversation)
        db.flush()

    # ── Save user message ───────────────────────────────────────────
    user_msg = Message(
        conversation_id=conversation.id,
        role="user",
        content=req.query,
    )
    db.add(user_msg)
    db.flush()

    # ── Run RAG pipeline ────────────────────────────────────────────
    try:
        result = await rag_pipeline(
            query=req.query,
            session_id=session.id,
            conversation_id=conversation.id,
        )
    except Exception as e:
        logger.exception("RAG pipeline failed")
        raise HTTPException(status_code=500, detail=f"Failed to generate response: {e}")

    latency_ms = (time.perf_counter() - t0) * 1000

    # ── Build response ──────────────────────────────────────────────
    response = LegalQueryResponse(
        answer=result["answer"],
        metadata={
            "query_id": result["query_id"],
            "session_id": session.id,
            "conversation_id": conversation.id,
            "sources_retrieved": result["sources_retrieved"],
            "confidence": result["confidence"],
            "model_used": result["model_used"],
            "latency_ms": round(latency_ms, 1),
        },
    )

    # ── Save assistant message ──────────────────────────────────────
    assistant_msg = Message(
        conversation_id=conversation.id,
        role="assistant",
        content=result["answer"]["summary"],
        structured_response=response.model_dump(),
    )
    db.add(assistant_msg)

    # ── Query log ───────────────────────────────────────────────────
    log = QueryLog(
        query_text=req.query,
        retrieved_source_ids=result["retrieved_source_ids"],
        retrieval_scores=result["retrieval_scores"],
        generated_response=response.model_dump(),
        model_used=result["model_used"],
        latency_ms=round(latency_ms, 1),
        session_id=session.id,
    )
    db.add(log)
    db.commit()

    return response
