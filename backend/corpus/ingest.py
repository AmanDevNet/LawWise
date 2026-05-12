"""
Corpus ingestion pipeline.

Reads official PDFs from corpus/raw/, extracts text, chunks primarily by
statutory section, attaches metadata from laws_index.csv, and indexes chunks.
"""

from __future__ import annotations

import csv
import logging
import re
import uuid
from pathlib import Path

from pypdf import PdfReader

from config import settings
from db.database import SessionLocal
from db.models import LegalSource
from rag.embeddings import embedding_model
from rag.vector_store import vector_store

logger = logging.getLogger("lawwise.ingest")

SECTION_BODY_RE = re.compile(
    r"(?m)^\s*(?:\d{1,3}\s+)?(?:\d+\[)?(?P<num>\d{1,4}[A-Z]?)\.\]?\s+"
    r"(?P<title>[^\n]{3,180}?)(?:\s*[.—-]\s*|\.\s*[—-]\s*)",
)

SECTION_TOC_RE = re.compile(
    r"(?m)^\s*(?:\d{1,3}\s+)?(?:\d+\[)?(?P<num>\d{1,4}[A-Z]?)\.\]?\s+"
    r"(?P<title>[A-Z][^\n]{3,160}?)(?:\.|\s*$)",
)

FOOTNOTE_TITLE_PREFIXES = (
    "subs.",
    "ins.",
    "rep.",
    "omitted",
    "the words",
    "chapter",
)


def _load_metadata_index() -> dict[str, dict]:
    """Load laws_index.csv into a filename-keyed metadata map."""
    index_path = settings.corpus_metadata_path
    if not index_path.exists():
        logger.warning("Metadata index not found: %s", index_path)
        return {}

    metadata: dict[str, dict] = {}
    with open(index_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            metadata[row["file_name"].strip()] = {
                "act_name": row.get("act_name", "").strip(),
                "jurisdiction": row.get("jurisdiction", "central").strip(),
                "state": row.get("state", "").strip() or None,
                "language": row.get("language", "en").strip(),
                "effective_date": row.get("effective_date", "").strip() or None,
                "status": row.get("status", "active").strip(),
                "source_url": row.get("source_url", "").strip() or None,
            }
    logger.info("Loaded metadata for %d files", len(metadata))
    return metadata


def _extract_pdf_text(pdf_path: Path) -> str:
    """Extract full text from a PDF file."""
    try:
        reader = PdfReader(str(pdf_path))
        pages = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                pages.append(text)
        full_text = "\n\n".join(pages)
        logger.info("Extracted %d chars from %s (%d pages)", len(full_text), pdf_path.name, len(reader.pages))
        return full_text
    except Exception as exc:
        logger.error("Failed to extract PDF %s: %s", pdf_path.name, exc)
        return ""


def _clean_text(text: str) -> str:
    """Normalize whitespace while preserving line breaks for heading detection."""
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[^\S\n]+", " ", text)
    text = re.sub(r"(?i)\bpage\s+\d+\s*(of\s+\d+)?\b", "", text)
    lines = [line.strip() for line in text.split("\n")]
    return "\n".join(lines).strip()


def _normalize_section_title(title: str) -> str:
    return re.sub(r"\s+", " ", title).strip(" .—-[]")


def _is_footnote_heading(title: str) -> bool:
    title_lower = title.lower().strip()
    return any(title_lower.startswith(prefix) for prefix in FOOTNOTE_TITLE_PREFIXES)


def _extract_section_info(chunk_text: str) -> tuple[str | None, str | None]:
    """
    Extract section identity from a chunk.

    Body headings with a dash are preferred because table-of-contents and
    footnotes often contain section-like numbers without the legal text.
    """
    for pattern in (SECTION_BODY_RE, SECTION_TOC_RE):
        for match in pattern.finditer(chunk_text):
            title = _normalize_section_title(match.group("title"))
            if _is_footnote_heading(title):
                continue
            return match.group("num"), title

    article = re.search(r"(?:Article|ARTICLE|Art\.)\s*(\d+[A-Za-z]*)", chunk_text)
    if article:
        return article.group(1), f"Article {article.group(1)}"

    section = re.search(r"(?:Section|SECTION|Sec\.|S\.)\s*(\d+[A-Za-z]*)", chunk_text)
    if section:
        return section.group(1), f"Section {section.group(1)}"

    return None, None


def _split_large_section(section_text: str, max_chars: int) -> list[str]:
    """Split very large sections while keeping the section header on each part."""
    if len(section_text) <= max_chars:
        return [section_text]

    header = section_text[: min(len(section_text), 260)].strip()
    paragraphs = [p.strip() for p in section_text.split("\n\n") if p.strip()]
    chunks: list[str] = []
    current = ""

    for paragraph in paragraphs:
        next_text = f"{current}\n\n{paragraph}".strip() if current else paragraph
        if len(next_text) <= max_chars:
            current = next_text
            continue

        if current:
            chunks.append(current if current.startswith(header[:40]) else f"{header}\n\n{current}")
        current = paragraph

    if current:
        chunks.append(current if current.startswith(header[:40]) else f"{header}\n\n{current}")

    return chunks


def _chunk_text(text: str, chunk_size: int, overlap: int) -> list[str]:
    """Split text into chunks, preferring real section bodies over windows."""
    if not text:
        return []

    body_matches = list(SECTION_BODY_RE.finditer(text))
    if len(body_matches) >= 3:
        chunks: list[str] = []
        max_section_chars = max(chunk_size * 4, 3200)
        for index, match in enumerate(body_matches):
            start = match.start()
            end = body_matches[index + 1].start() if index + 1 < len(body_matches) else len(text)
            section_text = text[start:end].strip()
            if len(section_text) < 80:
                continue
            chunks.extend(_split_large_section(section_text, max_section_chars))
        if chunks:
            return chunks

    # Fallback for PDFs whose headings do not expose body-style markers.
    sections = re.split(
        r"\n(?=(?:\d{1,3}\s+)?(?:\d{1,2}\[)?\d{1,4}[A-Z]?\.\]?\s+[A-Z])",
        text,
    )
    if len(sections) < 3:
        sections = [p.strip() for p in text.split("\n\n") if p.strip()]

    chunks = []
    current_chunk = ""
    for section in sections:
        section = section.strip()
        if not section:
            continue

        next_chunk = f"{current_chunk}\n\n{section}".strip() if current_chunk else section
        if len(next_chunk) <= chunk_size:
            current_chunk = next_chunk
            continue

        if current_chunk:
            chunks.append(current_chunk)
        current_chunk = section

    if current_chunk:
        chunks.append(current_chunk)

    return [chunk for chunk in chunks if len(chunk) >= 50]


def ingest_corpus():
    """
    Rebuild DB legal_sources and the in-memory vector index from official PDFs.
    """
    logger.info("=== Starting corpus ingestion ===")

    metadata_index = _load_metadata_index()
    raw_dir = settings.corpus_raw_dir

    if not raw_dir.exists():
        logger.error("Corpus raw directory not found: %s", raw_dir)
        return

    pdf_files = sorted(raw_dir.glob("*.pdf"))
    if not pdf_files:
        logger.warning("No PDF files found in %s", raw_dir)
        return

    vector_store.reset()
    vector_store._ensure_collection()

    db = SessionLocal()
    try:
        db.query(LegalSource).delete()
        db.commit()
    except Exception:
        db.rollback()
        logger.exception("Failed to clear existing legal_sources")
    finally:
        db.close()

    all_chunks_data = []

    for pdf_path in pdf_files:
        file_name = pdf_path.name
        file_meta = metadata_index.get(file_name, {})
        if not file_meta:
            logger.warning("No metadata for %s; using defaults", file_name)
            file_meta = {
                "act_name": file_name.replace(".pdf", "").replace("_", " ").title(),
                "jurisdiction": "central",
                "state": None,
                "language": "en",
                "effective_date": None,
                "status": "active",
                "source_url": None,
            }

        act_name = file_meta["act_name"]
        logger.info("Processing: %s (%s)", file_name, act_name)

        raw_text = _extract_pdf_text(pdf_path)
        if not raw_text:
            logger.warning("No text extracted from %s; skipping", file_name)
            continue

        chunks = _chunk_text(_clean_text(raw_text), settings.chunk_size, settings.chunk_overlap)
        logger.info("  -> %d chunks from %s", len(chunks), file_name)

        db = SessionLocal()
        try:
            for idx, chunk_text in enumerate(chunks):
                source_id = uuid.uuid4().hex
                section_number, section_title = _extract_section_info(chunk_text)
                section_hint = f"Section {section_number}" if section_number else ""

                source = LegalSource(
                    id=source_id,
                    act_name=act_name,
                    section_number=section_number,
                    section_title=section_title,
                    full_text=chunk_text,
                    chunk_index=idx,
                    jurisdiction=file_meta["jurisdiction"],
                    state=file_meta["state"],
                    language=file_meta["language"],
                    effective_date=file_meta["effective_date"],
                    status=file_meta["status"],
                    source_url=file_meta["source_url"],
                    source_file=file_name,
                )
                db.add(source)

                all_chunks_data.append(
                    (
                        source_id,
                        chunk_text,
                        {
                            "source_id": source_id,
                            "act_name": act_name,
                            "section_number": section_number,
                            "section_title": section_title,
                            "section_hint": section_hint,
                            "chunk_index": idx,
                            "jurisdiction": file_meta["jurisdiction"],
                            "source_file": file_name,
                            "text": chunk_text,
                        },
                    )
                )

            db.commit()
            logger.info("  -> Saved %d chunks to DB", len(chunks))
        except Exception:
            db.rollback()
            logger.exception("Failed to save chunks for %s", file_name)
        finally:
            db.close()

    if not all_chunks_data:
        logger.warning("No chunks to index; corpus is empty")
        return

    logger.info("Embedding %d chunks...", len(all_chunks_data))
    texts = [chunk[1] for chunk in all_chunks_data]
    vectors = embedding_model.embed_batch(texts)

    ids = [chunk[0] for chunk in all_chunks_data]
    payloads = [chunk[2] for chunk in all_chunks_data]
    vector_store.add_documents(ids=ids, vectors=vectors, payloads=payloads)

    logger.info("=== Corpus ingestion complete: %d chunks indexed ===", len(all_chunks_data))
