"""
Pydantic models for API request / response contracts.
"""

from __future__ import annotations
from pydantic import BaseModel, Field
from typing import Optional


# ── Request ─────────────────────────────────────────────────────────────
class LegalQueryRequest(BaseModel):
    query: str = Field(..., min_length=3, max_length=2000)
    session_id: Optional[str] = None
    conversation_id: Optional[str] = None
    jurisdiction: Optional[str] = None
    state: Optional[str] = None


# ── Response sub-models ─────────────────────────────────────────────────
class Citation(BaseModel):
    ref: str          # e.g. "Bharatiya Nyaya Sanhita 2023 · § 103"
    note: str         # short explanation of relevance
    source_id: str    # internal ID for traceability


class LegalAnswer(BaseModel):
    summary: str
    explanation: str
    urgency: str                  # "critical" | "moderate" | "low"
    citations: list[Citation]
    actions: list[str]
    evidence: list[str]
    follow_ups: list[str]
    disclaimer: str


class ResponseMetadata(BaseModel):
    query_id: str
    session_id: str
    conversation_id: str
    sources_retrieved: int
    confidence: str               # "high" | "medium" | "low"
    model_used: str
    latency_ms: float


class LegalQueryResponse(BaseModel):
    answer: LegalAnswer
    metadata: ResponseMetadata


# ── Health ──────────────────────────────────────────────────────────────
class HealthResponse(BaseModel):
    status: str
    version: str
    components: dict[str, str]
