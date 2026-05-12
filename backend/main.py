"""
LawWise FastAPI backend — Phase 1 entry point.

Startup sequence:
1. Initialize SQLite database (create tables)
2. Load embedding model
3. Initialize Qdrant in-memory vector store
4. Ingest corpus (idempotent — rebuilds index from PDFs every startup)
5. Mount API routes
"""

import logging
import sys
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings

# ── Logging ─────────────────────────────────────────────────────────────
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper(), logging.INFO),
    format="%(asctime)s  %(name)-24s  %(levelname)-5s  %(message)s",
    datefmt="%H:%M:%S",
    stream=sys.stdout,
)
logger = logging.getLogger("lawwise")


# ── Lifespan (startup / shutdown) ───────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Run heavy init once at startup, not per-request."""
    logger.info("LawWise backend starting up...")

    # 1. Database
    from db.database import init_db
    init_db()
    logger.info("Database initialized")

    # 2. Embeddings
    from rag.embeddings import embedding_model
    embedding_model.load()

    # 3. Vector store
    from rag.vector_store import vector_store
    vector_store.init()

    # 4. Corpus ingestion (idempotent rebuild)
    from corpus.ingest import ingest_corpus
    ingest_corpus()

    logger.info("LawWise backend ready — serving on port 8000")
    yield  # ── App is running ──
    logger.info("LawWise backend shutting down")


# ── App ─────────────────────────────────────────────────────────────────
app = FastAPI(
    title="LawWise API",
    description="AI legal information assistant for India — Phase 1",
    version="0.1.0",
    lifespan=lifespan,
)

# ── CORS ────────────────────────────────────────────────────────────────
origins = [o.strip() for o in settings.cors_origins.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ──────────────────────────────────────────────────────────────
from api.routes import router  # noqa: E402
app.include_router(router)
