# LawWise Setup Notes

LawWise currently includes the React frontend and Phase 1 FastAPI RAG backend.

## Frontend

```bash
npm install
npm run dev
```

## Backend

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

Create `backend/.env` from `backend/.env.example` before starting the backend.

## Verification

```bash
cd backend
.\.venv\Scripts\activate
python test_retrieval.py
```

The Phase 1 retrieval test should rank Transfer of Property Act, 1882, Section 106 as the top source for landlord notice queries.
