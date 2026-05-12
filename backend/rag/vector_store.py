"""
Qdrant vector store — runs in-memory (no Docker needed).
Index is rebuilt idempotently from the corpus on every startup.
"""

import logging
from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
)
from rag.embeddings import embedding_model

logger = logging.getLogger("lawwise.vector_store")

COLLECTION_NAME = "legal_sections"


class VectorStore:
    """In-memory Qdrant vector store for legal corpus."""

    def __init__(self):
        self._client: QdrantClient | None = None
        self._initialized = False

    def init(self):
        """Create in-memory Qdrant client and collection."""
        if self._initialized:
            return
        self._client = QdrantClient(":memory:")
        logger.info("Qdrant in-memory client created")
        self._initialized = True

    def _ensure_collection(self):
        """Create collection if it doesn't exist."""
        assert self._client is not None
        collections = [c.name for c in self._client.get_collections().collections]
        if COLLECTION_NAME not in collections:
            self._client.create_collection(
                collection_name=COLLECTION_NAME,
                vectors_config=VectorParams(
                    size=embedding_model.dimension,
                    distance=Distance.COSINE,
                ),
            )
            logger.info("Created collection '%s' (dim=%d)", COLLECTION_NAME, embedding_model.dimension)

    def add_documents(
        self,
        ids: list[str],
        vectors: list[list[float]],
        payloads: list[dict],
        batch_size: int = 100,
    ):
        """Batch upsert documents into the vector store."""
        assert self._client is not None
        self._ensure_collection()

        points = [
            PointStruct(id=idx, vector=vec, payload=pl)
            for idx, (vec, pl) in enumerate(zip(vectors, payloads))
        ]

        # Upsert in batches
        for i in range(0, len(points), batch_size):
            batch = points[i : i + batch_size]
            self._client.upsert(collection_name=COLLECTION_NAME, points=batch)

        logger.info("Indexed %d documents into '%s'", len(points), COLLECTION_NAME)

    def search(
        self,
        query_vector: list[float],
        top_k: int = 6,
        act_filter: str | None = None,
    ) -> list[dict]:
        """Search for similar vectors. Returns list of {id, score, payload}."""
        assert self._client is not None

        query_filter = None
        if act_filter:
            query_filter = Filter(
                must=[FieldCondition(key="act_name", match=MatchValue(value=act_filter))]
            )

        results = self._client.query_points(
            collection_name=COLLECTION_NAME,
            query=query_vector,
            limit=top_k,
            query_filter=query_filter,
            with_payload=True,
        )

        return [
            {
                "id": str(hit.id),
                "score": hit.score,
                "payload": hit.payload,
            }
            for hit in results.points
        ]

    def count(self) -> int:
        """Return the number of vectors in the collection."""
        if not self._initialized or self._client is None:
            return 0
        try:
            info = self._client.get_collection(COLLECTION_NAME)
            return info.points_count or 0
        except Exception:
            return 0

    def reset(self):
        """Delete and recreate the collection. Used for idempotent reindex."""
        if self._client is None:
            return
        try:
            self._client.delete_collection(COLLECTION_NAME)
            logger.info("Deleted collection '%s' for reindex", COLLECTION_NAME)
        except Exception:
            pass


# Singleton
vector_store = VectorStore()
