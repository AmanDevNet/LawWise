import json
import logging
import sys
from pathlib import Path

from corpus.ingest import ingest_corpus
from db.database import init_db
from rag.embeddings import embedding_model
from rag.retriever import retrieve
from rag.vector_store import vector_store

logging.basicConfig(level=logging.INFO, format="%(levelname)-5s %(message)s", stream=sys.stdout)

EVALS_PATH = Path(__file__).resolve().parent / "evals" / "phase1_retrieval.json"


def load_queries() -> list[dict]:
    with open(EVALS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def initialize():
    init_db()
    embedding_model.load()
    vector_store.init()
    ingest_corpus()


def run_tests():
    queries = load_queries()

    if vector_store.count() == 0:
        logging.warning("Vector store is empty. Ingestion did not index any legal chunks.")
        return 1

    logging.info("Vector store has %d chunks. Running retrieval tests.\n", vector_store.count())

    passed = 0
    for item in queries:
        query_text = item["query"]
        expected_act = item["expected_act_contains"].lower()
        expected_sec = item["expected_section"].lower()

        logging.info("Query: %r", query_text)
        res = retrieve(query_text, top_k=5)
        chunks = res["chunks"]

        if not chunks:
            logging.error("  FAILED: no chunks retrieved.")
            continue

        top_chunk = chunks[0]
        payload = top_chunk["payload"]
        act_name = (payload.get("act_name") or "").lower()
        section = str(payload.get("section_number") or payload.get("section_hint") or "").lower()
        title = payload.get("section_title") or ""

        logging.info(
            "  Top match: %s | section=%s | title=%s | score=%.3f",
            payload.get("act_name"),
            section,
            title,
            top_chunk["score"],
        )

        if expected_act in act_name and expected_sec in section:
            logging.info("  PASSED")
            passed += 1
        else:
            logging.error("  FAILED: expected %s Section %s", expected_act, expected_sec)

        print("-" * 50)

    logging.info("Tests passed: %d/%d", passed, len(queries))
    return 0 if passed == len(queries) else 1


if __name__ == "__main__":
    initialize()
    raise SystemExit(run_tests())
