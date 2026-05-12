/**
 * LawWise API client.
 * All backend communication goes through here.
 * API key stays server-side — this client never handles secrets.
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ── Types matching backend schemas ──────────────────────────────────────

export interface Citation {
  ref: string;
  note: string;
  source_id: string;
}

export interface LegalAnswer {
  summary: string;
  explanation: string;
  urgency: "critical" | "moderate" | "low";
  citations: Citation[];
  actions: string[];
  evidence: string[];
  follow_ups: string[];
  disclaimer: string;
}

export interface ResponseMetadata {
  query_id: string;
  session_id: string;
  conversation_id: string;
  sources_retrieved: number;
  confidence: "high" | "medium" | "low";
  model_used: string;
  latency_ms: number;
}

export interface LegalQueryResponse {
  answer: LegalAnswer;
  metadata: ResponseMetadata;
}

export interface HealthResponse {
  status: string;
  version: string;
  components: Record<string, string>;
}

// ── API functions ───────────────────────────────────────────────────────

export async function askLawWise(
  query: string,
  sessionId?: string,
  conversationId?: string,
): Promise<LegalQueryResponse> {
  const res = await fetch(`${BASE_URL}/api/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      session_id: sessionId || undefined,
      conversation_id: conversationId || undefined,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || `API error: ${res.status}`);
  }

  return res.json();
}

export async function checkHealth(): Promise<HealthResponse> {
  const res = await fetch(`${BASE_URL}/api/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json();
}
