"""
LawWise backend configuration — reads from .env via pydantic-settings.
All secrets stay server-side; nothing is exposed to the frontend.
"""

from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

_BACKEND_DIR = Path(__file__).resolve().parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(_BACKEND_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ── LLM (required for /api/ask — server starts without it for health/ingestion)
    gemini_api_key: str = ""

    # ── Database ────────────────────────────────────────────────────────
    database_url: str = f"sqlite:///{_BACKEND_DIR / 'lawwise.db'}"

    # ── Models ──────────────────────────────────────────────────────────
    embedding_model: str = "all-MiniLM-L6-v2"
    llm_model: str = "gemini-2.0-flash"

    # ── CORS ────────────────────────────────────────────────────────────
    cors_origins: str = "http://localhost:5173"

    # ── Corpus / RAG ────────────────────────────────────────────────────
    chunk_size: int = 800
    chunk_overlap: int = 150
    retrieval_top_k: int = 6

    # ── Logging ─────────────────────────────────────────────────────────
    log_level: str = "info"

    # ── Derived paths (not from env) ────────────────────────────────────
    @property
    def corpus_raw_dir(self) -> Path:
        return _BACKEND_DIR / "corpus" / "raw"

    @property
    def corpus_metadata_path(self) -> Path:
        return _BACKEND_DIR / "corpus" / "metadata" / "laws_index.csv"

    @property
    def backend_dir(self) -> Path:
        return _BACKEND_DIR


settings = Settings()  # type: ignore[call-arg]
