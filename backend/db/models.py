"""
SQLAlchemy ORM models for LawWise Phase 1.
Schema is PostgreSQL-compatible; using SQLite-friendly types for dev.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    String,
    Text,
    DateTime,
    Float,
    Integer,
    ForeignKey,
    JSON,
)
from sqlalchemy.orm import relationship

from db.database import Base


def _uuid() -> str:
    return uuid.uuid4().hex


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


# ── Sessions ────────────────────────────────────────────────────────────
class Session(Base):
    __tablename__ = "sessions"

    id = Column(String(32), primary_key=True, default=_uuid)
    created_at = Column(DateTime, default=_utcnow, nullable=False)
    metadata_ = Column("metadata", JSON, default=dict)

    conversations = relationship("Conversation", back_populates="session")
    query_logs = relationship("QueryLog", back_populates="session")


# ── Conversations ───────────────────────────────────────────────────────
class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(String(32), primary_key=True, default=_uuid)
    session_id = Column(String(32), ForeignKey("sessions.id"), nullable=False)
    title = Column(String(512), default="")
    created_at = Column(DateTime, default=_utcnow, nullable=False)
    updated_at = Column(DateTime, default=_utcnow, onupdate=_utcnow, nullable=False)

    session = relationship("Session", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", order_by="Message.created_at")


# ── Messages ────────────────────────────────────────────────────────────
class Message(Base):
    __tablename__ = "messages"

    id = Column(String(32), primary_key=True, default=_uuid)
    conversation_id = Column(String(32), ForeignKey("conversations.id"), nullable=False)
    role = Column(String(16), nullable=False)  # "user" | "assistant"
    content = Column(Text, nullable=False)
    structured_response = Column(JSON, nullable=True)  # full LegalQueryResponse for assistant msgs
    created_at = Column(DateTime, default=_utcnow, nullable=False)
    metadata_ = Column("metadata", JSON, default=dict)

    conversation = relationship("Conversation", back_populates="messages")


# ── Legal Sources ───────────────────────────────────────────────────────
class LegalSource(Base):
    __tablename__ = "legal_sources"

    id = Column(String(32), primary_key=True, default=_uuid)
    act_name = Column(String(256), nullable=False, index=True)
    section_number = Column(String(64), nullable=True)
    section_title = Column(String(512), nullable=True)
    full_text = Column(Text, nullable=False)
    chunk_index = Column(Integer, nullable=False, default=0)
    jurisdiction = Column(String(32), default="central")  # "central" | "state"
    state = Column(String(64), nullable=True)
    language = Column(String(8), default="en")
    effective_date = Column(String(16), nullable=True)
    status = Column(String(16), default="active")  # "active" | "repealed" | "amended"
    source_url = Column(String(512), nullable=True)
    source_file = Column(String(256), nullable=True)
    metadata_ = Column("metadata", JSON, default=dict)


# ── Query Logs ──────────────────────────────────────────────────────────
class QueryLog(Base):
    __tablename__ = "query_logs"

    id = Column(String(32), primary_key=True, default=_uuid)
    query_text = Column(Text, nullable=False)
    retrieved_source_ids = Column(JSON, default=list)     # [source_id, ...]
    retrieval_scores = Column(JSON, default=list)         # [float, ...]
    generated_response = Column(JSON, nullable=True)      # full response JSON
    model_used = Column(String(64), nullable=True)
    latency_ms = Column(Float, nullable=True)
    created_at = Column(DateTime, default=_utcnow, nullable=False)
    session_id = Column(String(32), ForeignKey("sessions.id"), nullable=True)

    session = relationship("Session", back_populates="query_logs")
