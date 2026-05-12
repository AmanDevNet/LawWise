"""
Embedding model loader — uses sentence-transformers for local embeddings.
Model downloads ~80 MB on first run, then cached.
"""

import logging
from sentence_transformers import SentenceTransformer
from config import settings

logger = logging.getLogger("lawwise.embeddings")

_model: SentenceTransformer | None = None


class EmbeddingModel:
    """Thin wrapper around SentenceTransformer for LawWise."""

    def __init__(self):
        self.model_name = settings.embedding_model
        self._model: SentenceTransformer | None = None

    def load(self):
        if self._model is None:
            logger.info("Loading embedding model: %s", self.model_name)
            self._model = SentenceTransformer(self.model_name)
            logger.info("Embedding model loaded (dim=%d)", self.dimension)

    @property
    def dimension(self) -> int:
        assert self._model is not None, "Model not loaded — call .load() first"
        return self._model.get_sentence_embedding_dimension()

    def embed_text(self, text: str) -> list[float]:
        assert self._model is not None, "Model not loaded"
        return self._model.encode(text, normalize_embeddings=True).tolist()

    def embed_batch(self, texts: list[str], batch_size: int = 64) -> list[list[float]]:
        assert self._model is not None, "Model not loaded"
        embeddings = self._model.encode(
            texts,
            batch_size=batch_size,
            normalize_embeddings=True,
            show_progress_bar=len(texts) > 100,
        )
        return embeddings.tolist()


# Singleton
embedding_model = EmbeddingModel()
