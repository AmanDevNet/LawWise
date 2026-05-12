"""
SQLAlchemy engine and session factory for LawWise.
Uses SQLite for Phase 1; swap DATABASE_URL for PostgreSQL later.
"""

from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from config import settings

# ── Engine ──────────────────────────────────────────────────────────────
_connect_args = {}
if settings.database_url.startswith("sqlite"):
    _connect_args["check_same_thread"] = False

engine = create_engine(
    settings.database_url,
    connect_args=_connect_args,
    echo=False,
)

# Enable WAL mode and foreign keys for SQLite
if settings.database_url.startswith("sqlite"):
    @event.listens_for(engine, "connect")
    def _set_sqlite_pragma(dbapi_conn, _connection_record):
        cursor = dbapi_conn.cursor()
        cursor.execute("PRAGMA journal_mode=WAL;")
        cursor.execute("PRAGMA foreign_keys=ON;")
        cursor.close()

# ── Session factory ─────────────────────────────────────────────────────
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


# ── Base class for ORM models ──────────────────────────────────────────
class Base(DeclarativeBase):
    pass


def get_db():
    """FastAPI dependency — yields a session, auto-closes after request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables. Idempotent — safe to call on every startup."""
    from db import models  # noqa: F401  — ensure models are imported so Base sees them
    Base.metadata.create_all(bind=engine)
