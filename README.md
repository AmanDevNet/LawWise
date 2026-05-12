# LawWise

AI-powered legal information assistant for India, built to help users understand rights, retrieve relevant legal provisions, and receive structured next-step guidance grounded in official legal sources.

> Status: Phase 1 completed - core legal intelligence layer with RAG, citation retrieval, and a working React interface.

## Overview

LawWise is a legal-tech research and engineering project focused on making Indian legal information easier to understand. The system combines a polished React frontend with a FastAPI backend, official Indian legal corpus files, local embeddings, vector retrieval, and Gemini-based structured response generation.

The project is designed around three principles:

- Accuracy over speed
- Safety over creativity
- Explainability over confidence

LawWise is not a substitute for a qualified advocate. It provides legal information for educational and navigational purposes only.

## Key Capabilities

- Legal Q&A with citation-grounded answers
- RAG over official Indian legal corpus PDFs
- Structured responses with summary, analysis, citations, actions, evidence, follow-up questions, and disclaimer
- Current-law orientation using BNS, BNSS, and BSA where relevant
- Tenant and eviction retrieval fix for Transfer of Property Act, 1882, Section 106
- SQLite-backed conversation, message, source, and query logging models
- In-memory Qdrant vector index rebuilt from corpus on startup
- Professional app shell with pages for Ask LawWise, Document Analysis, Find Help, Timeline, Emergency, and Settings

## Current Phase

### Phase 1: Core Legal Intelligence

Implemented:

- FastAPI backend
- `/api/health` endpoint
- `/api/ask` endpoint
- Legal corpus ingestion from official PDFs
- Section-aware legal chunking
- Sentence-transformer embeddings
- Qdrant vector retrieval
- Gemini answer generation
- SQLite persistence layer
- Query logging
- Ask LawWise frontend integration
- Retrieval evaluation test for landlord notice queries

Next phases will expand document analysis, legal help discovery, timeline memory, emergency flows, multilingual support, and legislative updates.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| UI | Lucide React, Radix UI primitives |
| Backend | FastAPI, Pydantic |
| Database | SQLite for Phase 1, PostgreSQL-ready schema |
| Vector Store | Qdrant in-memory client |
| Embeddings | `sentence-transformers/all-MiniLM-L6-v2` |
| LLM | Google Gemini |
| Corpus Parsing | PyPDF |
| ORM | SQLAlchemy |

## Project Structure

```text
LawWise/
├── backend/
│   ├── api/                 # FastAPI routes and schemas
│   ├── corpus/              # Official legal corpus, metadata, ingestion
│   ├── db/                  # SQLAlchemy database setup and models
│   ├── evals/               # Retrieval evaluation cases
│   ├── rag/                 # Embeddings, vector store, retrieval, generation
│   ├── main.py              # FastAPI entry point
│   ├── config.py            # Environment-based settings
│   ├── requirements.txt     # Backend dependencies
│   └── test_retrieval.py    # Phase 1 retrieval test
├── src/
│   ├── app/
│   │   ├── components/      # App shell and reusable UI
│   │   ├── pages/           # LawWise product pages
│   │   ├── api.ts           # Frontend API client
│   │   └── routes.tsx       # App routes
│   ├── styles/              # Theme and design system styles
│   └── main.tsx             # React entry point
├── package.json
├── vite.config.ts
└── README.md
```

## Legal Corpus

The Phase 1 corpus is stored under:

```text
backend/corpus/raw/
```

Current official corpus files include:

- Bharatiya Nyaya Sanhita, 2023
- Bharatiya Nagarik Suraksha Sanhita, 2023
- Bharatiya Sakshya Adhiniyam, 2023
- Constitution of India
- Transfer of Property Act, 1882

Corpus metadata is tracked in:

```text
backend/corpus/metadata/laws_index.csv
```

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/AmanDevNet/LawWise.git
cd LawWise
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Configure backend environment

Create `backend/.env` from `backend/.env.example`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=sqlite:///./lawwise.db
LLM_MODEL=gemini-2.5-flash
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
LOG_LEVEL=info
```

### 4. Install backend dependencies

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

### 5. Run the backend

```bash
python -m uvicorn main:app --reload --port 8000
```

On first run, the backend loads the embedding model, ingests the legal corpus, creates the SQLite database, and rebuilds the in-memory vector index.

### 6. Run the frontend

In a second terminal:

```bash
npm run dev
```

Open the local Vite URL, usually:

```text
http://localhost:5173
```

## Verification

Run the Phase 1 retrieval check:

```bash
cd backend
.\.venv\Scripts\activate
python test_retrieval.py
```

Expected key result:

```text
Query: "Can my landlord evict me without notice?"
Top match: Transfer of Property Act 1882 | section=106
Tests passed: 1/1
```

If Hugging Face downloads are blocked by local proxy variables, clear them for the current PowerShell session:

```powershell
$env:HTTP_PROXY=''
$env:HTTPS_PROXY=''
$env:ALL_PROXY=''
$env:GIT_HTTP_PROXY=''
$env:GIT_HTTPS_PROXY=''
```

## API

### Health Check

```http
GET /api/health
```

### Ask LawWise

```http
POST /api/ask
Content-Type: application/json

{
  "query": "Can my landlord evict me without notice?"
}
```

Response includes:

- summary
- legal explanation
- urgency level
- citations
- action steps
- evidence checklist
- follow-up questions
- disclaimer
- metadata

## Roadmap

| Phase | Focus |
|---|---|
| Phase 1 | Core legal intelligence, RAG, citations, Ask LawWise |
| Phase 2 | Jurisdiction filtering, safety evaluation, stronger reliability |
| Phase 3 | Document analysis, help locator, timeline, emergency workflows |
| Phase 4 | Multilingual support, legislative updates, scenario analysis |

## Contributors

- Aman Sharma - project owner, engineering, product architecture
- Angel - project collaborator, research and product contribution

## Disclaimer

LawWise provides legal information for educational and navigational purposes only. It does not provide legal advice and does not replace consultation with a qualified advocate. Legal outcomes depend on facts, jurisdiction, documents, procedure, and applicable law.
