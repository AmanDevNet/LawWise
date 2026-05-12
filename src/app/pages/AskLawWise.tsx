import { useState, useRef, useEffect } from "react";
import {
  Send,
  BookOpen,
  AlertTriangle,
  SquareCheck,
  ChevronRight,
  MapPin,
  Info,
  Lightbulb,
  FileText,
  Scale,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { askLawWise, type LegalQueryResponse, type LegalAnswer } from "../api";

const starters = [
  { label: "Police stop or detention rights", icon: "🚔", tag: "Constitutional" },
  { label: "Landlord eviction without notice", icon: "🏠", tag: "Property" },
  { label: "Workplace sexual harassment", icon: "⚖️", tag: "POSH Act" },
  { label: "Consumer fraud or defective product", icon: "🛍️", tag: "Consumer" },
  { label: "RTI application filing process", icon: "📂", tag: "RTI Act" },
  { label: "Traffic challan — how to contest", icon: "🚦", tag: "MV Act" },
];

interface ConversationMessage {
  type: "user" | "assistant";
  text?: string;
  // Assistant fields
  summary?: string;
  explanation?: string;
  urgency?: string;
  citations?: { ref: string; note: string; source_id: string }[];
  actions?: string[];
  evidence?: string[];
  follow_ups?: string[];
  disclaimer?: string;
}

export default function AskLawWise() {
  const [inputValue, setInputValue] = useState("");
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [showCitations, setShowCitations] = useState(true);
  const [showEvidence, setShowEvidence] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [latestAnswer, setLatestAnswer] = useState<LegalAnswer | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, isLoading]);

  const handleSend = async (text?: string) => {
    const query = (text || inputValue).trim();
    if (!query || isLoading) return;

    setInputValue("");
    setError(null);

    // Add user message
    setConversation((prev) => [...prev, { type: "user", text: query }]);
    setIsLoading(true);

    try {
      const response: LegalQueryResponse = await askLawWise(query, sessionId, conversationId);

      // Store session/conversation IDs for continuity
      setSessionId(response.metadata.session_id);
      setConversationId(response.metadata.conversation_id);

      const answer = response.answer;
      setLatestAnswer(answer);

      // Add assistant message
      setConversation((prev) => [
        ...prev,
        {
          type: "assistant",
          summary: answer.summary,
          explanation: answer.explanation,
          urgency: answer.urgency,
          citations: answer.citations,
          actions: answer.actions,
          evidence: answer.evidence,
          follow_ups: answer.follow_ups,
          disclaimer: answer.disclaimer,
        },
      ]);
    } catch (err: any) {
      setError(err.message || "Failed to get a response. Please try again.");
      // Remove the user message if the API call failed entirely
    } finally {
      setIsLoading(false);
    }
  };

  const handleStarter = (label: string) => {
    handleSend(label);
  };

  const handleRetry = () => {
    // Find the last user message and retry
    const lastUserMsg = [...conversation].reverse().find((m) => m.type === "user");
    if (lastUserMsg?.text) {
      setError(null);
      handleSend(lastUserMsg.text);
    }
  };

  const urgencyConfig = {
    critical: { label: "CRITICAL URGENCY", color: "#C0392B", bg: "#FFF0EE", border: "#FACFC9" },
    moderate: { label: "MODERATE URGENCY", color: "#B8780A", bg: "#FFF8E8", border: "#F0DFA8" },
    low: { label: "LOW URGENCY", color: "#1E6B47", bg: "#EEF7F2", border: "#B8DECA" },
  };

  // Derive follow-ups and right-panel data from latest assistant response
  const lastAssistant = [...conversation].reverse().find((m) => m.type === "assistant");
  const followUps = lastAssistant?.follow_ups || latestAnswer?.follow_ups || [];
  const panelActions = lastAssistant?.actions || latestAnswer?.actions || [];
  const panelEvidence = lastAssistant?.evidence || latestAnswer?.evidence || [];
  const panelUrgency = lastAssistant?.urgency || latestAnswer?.urgency;

  return (
    <div className="flex h-full">
      {/* Main conversation area */}
      <div className="flex-1 flex flex-col min-w-0" style={{ maxWidth: "calc(100% - 320px)" }}>
        {/* Header */}
        <div
          className="px-8 py-5 flex-shrink-0"
          style={{ borderBottom: "1px solid #E2D9CC", background: "#FAF8F4" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "#0F2040" }}
            >
              <Scale size={15} color="white" strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="font-playfair" style={{ fontSize: "1.15rem", fontWeight: 600, color: "#0D1117", lineHeight: 1.2 }}>
                Ask LawWise
              </h1>
              <p style={{ fontSize: "0.78rem", color: "#9E9590" }}>Legal guidance grounded in Indian law · BNS, BNSS, BSA, Constitution</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* Starter prompts when empty */}
          {conversation.length === 0 && !isLoading && (
            <div>
              <div
                className="font-mono text-xs mb-6"
                style={{ color: "#9E9590", letterSpacing: "0.06em", textTransform: "uppercase" }}
              >
                Common legal situations
              </div>
              <div className="grid grid-cols-2 gap-3">
                {starters.map(({ label, icon, tag }) => (
                  <button
                    key={label}
                    onClick={() => handleStarter(label)}
                    className="lw-card p-4 text-left hover:border-[#2A6B7C] hover:shadow-sm transition-all"
                    style={{ cursor: "pointer" }}
                  >
                    <div className="text-xl mb-2">{icon}</div>
                    <div style={{ fontSize: "0.86rem", fontWeight: 500, color: "#0D1117", marginBottom: "4px", lineHeight: 1.4 }}>{label}</div>
                    <div
                      className="inline-block px-2 py-0.5 rounded-full"
                      style={{ fontSize: "0.72rem", color: "#2A6B7C", background: "#F0F4F8", border: "1px solid #C8DDE4", fontWeight: 500 }}
                    >
                      {tag}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conversation messages */}
          {conversation.map((msg, i) => (
            <div key={i}>
              {msg.type === "user" ? (
                <div className="flex justify-end">
                  <div
                    className="max-w-[78%] px-4 py-3 rounded-2xl rounded-tr-sm"
                    style={{ background: "#0F2040", color: "white" }}
                  >
                    <p style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>{msg.text}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Urgency badge */}
                  {msg.urgency && (
                    <div className="flex items-center gap-2">
                      <div
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                        style={{
                          background: urgencyConfig[msg.urgency as keyof typeof urgencyConfig]?.bg || urgencyConfig.moderate.bg,
                          border: `1px solid ${urgencyConfig[msg.urgency as keyof typeof urgencyConfig]?.border || urgencyConfig.moderate.border}`,
                        }}
                      >
                        <AlertTriangle size={11} style={{ color: urgencyConfig[msg.urgency as keyof typeof urgencyConfig]?.color || urgencyConfig.moderate.color }} />
                        <span
                          className="font-mono"
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: urgencyConfig[msg.urgency as keyof typeof urgencyConfig]?.color || urgencyConfig.moderate.color,
                            letterSpacing: "0.06em",
                          }}
                        >
                          {urgencyConfig[msg.urgency as keyof typeof urgencyConfig]?.label || urgencyConfig.moderate.label}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  <div
                    className="p-4 rounded-xl"
                    style={{ background: "#F5F0E8", border: "1px solid #EDE5D8" }}
                  >
                    <div className="flex items-start gap-2.5">
                      <Lightbulb size={15} style={{ color: "#C4974A", flexShrink: 0, marginTop: "2px" }} />
                      <p style={{ fontSize: "0.88rem", fontWeight: 500, color: "#4A3820", lineHeight: 1.6 }}>
                        {msg.summary}
                      </p>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="lw-card p-5">
                    <div
                      className="font-mono text-xs mb-3"
                      style={{ color: "#9E9590", letterSpacing: "0.06em", textTransform: "uppercase" }}
                    >
                      Legal Analysis
                    </div>
                    <p style={{ fontSize: "0.88rem", color: "#3A3530", lineHeight: 1.75, whiteSpace: "pre-line" }}>
                      {msg.explanation}
                    </p>
                  </div>

                  {/* Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="lw-card overflow-hidden">
                      <button
                        onClick={() => setShowCitations(!showCitations)}
                        className="w-full flex items-center justify-between px-5 py-3"
                        style={{ background: "none", border: "none", cursor: "pointer", borderBottom: showCitations ? "1px solid #F0EDE7" : "none" }}
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen size={13} style={{ color: "#2A6B7C" }} />
                          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#0D1117" }}>
                            Legal Sources · {msg.citations.length} citations
                          </span>
                        </div>
                        {showCitations ? <ChevronUp size={13} style={{ color: "#9E9590" }} /> : <ChevronDown size={13} style={{ color: "#9E9590" }} />}
                      </button>
                      {showCitations && (
                        <div className="px-5 py-4 space-y-2.5">
                          {msg.citations.map((c, ci) => (
                            <div
                              key={ci}
                              style={{
                                background: "#F0F4F8",
                                borderLeft: "3px solid #2A6B7C",
                                borderRadius: "0 6px 6px 0",
                                padding: "8px 12px",
                              }}
                            >
                              <div
                                className="font-mono"
                                style={{ fontSize: "0.74rem", color: "#2A6B7C", fontWeight: 600, marginBottom: "3px" }}
                              >
                                {c.ref}
                              </div>
                              <div style={{ fontSize: "0.78rem", color: "#6B6560" }}>{c.note}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div
                className="px-5 py-4 rounded-2xl rounded-tl-sm"
                style={{ background: "#F5F0E8", border: "1px solid #EDE5D8" }}
              >
                <div className="flex items-center gap-3">
                  <Loader2 size={16} style={{ color: "#C4974A" }} className="animate-spin" />
                  <span style={{ fontSize: "0.85rem", color: "#6B6560" }}>
                    Analyzing your question against Indian legal sources…
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div
              className="p-4 rounded-xl flex items-start gap-3"
              style={{ background: "#FFF0EE", border: "1px solid #FACFC9" }}
            >
              <AlertTriangle size={16} style={{ color: "#C0392B", flexShrink: 0, marginTop: "2px" }} />
              <div className="flex-1">
                <p style={{ fontSize: "0.85rem", color: "#8B2020", fontWeight: 500, marginBottom: "6px" }}>
                  Something went wrong
                </p>
                <p style={{ fontSize: "0.8rem", color: "#A04040", lineHeight: 1.5 }}>
                  {error}
                </p>
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                  style={{ background: "#0F2040", border: "none", cursor: "pointer" }}
                >
                  <RefreshCw size={12} color="white" />
                  <span style={{ fontSize: "0.8rem", color: "white", fontWeight: 500 }}>Retry</span>
                </button>
              </div>
            </div>
          )}

          {/* Follow-up suggestions */}
          {followUps.length > 0 && !isLoading && (
            <div>
              <div
                className="font-mono text-xs mb-3"
                style={{ color: "#9E9590", letterSpacing: "0.06em", textTransform: "uppercase" }}
              >
                Follow-up questions
              </div>
              <div className="flex flex-wrap gap-2">
                {followUps.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:border-[#2A6B7C]"
                    style={{
                      background: "white",
                      border: "1px solid #E2D9CC",
                      fontSize: "0.8rem",
                      color: "#6B6560",
                      cursor: "pointer",
                      fontWeight: 400,
                    }}
                  >
                    {q}
                    <ChevronRight size={11} />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          className="px-8 py-4 flex-shrink-0"
          style={{ borderTop: "1px solid #E2D9CC", background: "#FAF8F4" }}
        >
          <div
            className="flex items-end gap-3 p-3 rounded-xl"
            style={{ background: "white", border: "1.5px solid #E2D9CC" }}
          >
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Describe your legal situation in plain language…"
              rows={2}
              disabled={isLoading}
              className="flex-1 resize-none outline-none"
              style={{ fontSize: "0.9rem", color: "#0D1117", background: "transparent", lineHeight: 1.55, fontFamily: "Inter, sans-serif", opacity: isLoading ? 0.5 : 1 }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isLoading}
              className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all"
              style={{
                background: inputValue.trim() && !isLoading ? "#0F2040" : "#E2D9CC",
                border: "none",
                cursor: inputValue.trim() && !isLoading ? "pointer" : "default",
              }}
            >
              {isLoading ? (
                <Loader2 size={15} color="#9E9590" className="animate-spin" />
              ) : (
                <Send size={15} color={inputValue.trim() ? "white" : "#9E9590"} />
              )}
            </button>
          </div>
          <p style={{ fontSize: "0.72rem", color: "#9E9590", marginTop: "8px", textAlign: "center" }}>
            LawWise provides legal information, not advice. Consult a qualified advocate for your specific case. · Responses cite Indian law.
          </p>
        </div>
      </div>

      {/* Right panel — Insights */}
      <aside
        className="hidden xl:flex flex-col w-80 flex-shrink-0 overflow-y-auto"
        style={{ borderLeft: "1px solid #E2D9CC", background: "#FAF8F4" }}
      >
        <div className="p-5 space-y-5">
          {/* Urgency panel */}
          {panelUrgency ? (
            <div
              className="p-4 rounded-xl"
              style={{
                background: urgencyConfig[panelUrgency as keyof typeof urgencyConfig]?.bg || "#FFF8E8",
                border: `1px solid ${urgencyConfig[panelUrgency as keyof typeof urgencyConfig]?.border || "#F0DFA8"}`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={13} style={{ color: urgencyConfig[panelUrgency as keyof typeof urgencyConfig]?.color || "#B8780A" }} />
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: urgencyConfig[panelUrgency as keyof typeof urgencyConfig]?.color || "#B8780A", letterSpacing: "0.04em" }}>
                  URGENCY ASSESSMENT
                </span>
              </div>
              <div className="font-playfair" style={{ fontSize: "1.1rem", fontWeight: 600, color: urgencyConfig[panelUrgency as keyof typeof urgencyConfig]?.color || "#8B5A00", marginBottom: "4px", textTransform: "capitalize" }}>
                {panelUrgency}
              </div>
              <p style={{ fontSize: "0.78rem", color: urgencyConfig[panelUrgency as keyof typeof urgencyConfig]?.color || "#9A7020", lineHeight: 1.55, opacity: 0.85 }}>
                {panelUrgency === "critical"
                  ? "This situation requires immediate attention. Act promptly and consider contacting a lawyer today."
                  : panelUrgency === "moderate"
                    ? "You have time to respond properly. Do not make hasty decisions. Take action within 7–10 days."
                    : "This matter is not immediately urgent. You can take time to research and plan your response."
                }
              </p>
            </div>
          ) : (
            <div
              className="p-4 rounded-xl"
              style={{ background: "#F5F0E8", border: "1px solid #EDE5D8" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Scale size={13} style={{ color: "#9E9590" }} />
                <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#9E9590" }}>
                  AWAITING QUERY
                </span>
              </div>
              <p style={{ fontSize: "0.78rem", color: "#9E9590", lineHeight: 1.55 }}>
                Ask a legal question to see urgency assessment, action plan, and evidence checklist.
              </p>
            </div>
          )}

          {/* Action plan */}
          {panelActions.length > 0 && (
            <div className="lw-card overflow-hidden">
              <div className="px-4 py-3" style={{ borderBottom: "1px solid #F0EDE7" }}>
                <div className="flex items-center gap-2">
                  <SquareCheck size={13} style={{ color: "#0F2040" }} />
                  <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#0D1117" }}>Action Plan</span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {panelActions.map((action, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "#EEF7F2", border: "1px solid #B8DECA" }}
                    >
                      <span style={{ fontSize: "0.6rem", color: "#1E6B47", fontWeight: 700 }}>{i + 1}</span>
                    </div>
                    <span style={{ fontSize: "0.8rem", color: "#4A4540", lineHeight: 1.5 }}>{action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evidence checklist */}
          {panelEvidence.length > 0 && (
            <div className="lw-card overflow-hidden">
              <button
                onClick={() => setShowEvidence(!showEvidence)}
                className="w-full flex items-center justify-between px-4 py-3"
                style={{ background: "none", border: "none", cursor: "pointer", borderBottom: showEvidence ? "1px solid #F0EDE7" : "none" }}
              >
                <div className="flex items-center gap-2">
                  <FileText size={13} style={{ color: "#0F2040" }} />
                  <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#0D1117" }}>Evidence to Collect</span>
                </div>
                {showEvidence ? <ChevronUp size={12} style={{ color: "#9E9590" }} /> : <ChevronDown size={12} style={{ color: "#9E9590" }} />}
              </button>
              {showEvidence && (
                <div className="p-4 space-y-2">
                  {panelEvidence.map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div
                        className="w-4 h-4 rounded flex-shrink-0"
                        style={{ border: "1.5px solid #E2D9CC", background: "white" }}
                      />
                      <span style={{ fontSize: "0.79rem", color: "#6B6560" }}>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Nearby help */}
          <button
            className="w-full lw-card p-4 text-left flex items-center gap-3 hover:border-[#2A6B7C] transition-all group"
            style={{ cursor: "pointer" }}
            onClick={() => {}}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "#F0F4F8", border: "1px solid #C8DDE4" }}
            >
              <MapPin size={15} style={{ color: "#2A6B7C" }} />
            </div>
            <div>
              <div style={{ fontSize: "0.84rem", fontWeight: 600, color: "#0D1117" }}>Find Nearby Legal Help</div>
              <div style={{ fontSize: "0.76rem", color: "#9E9590", marginTop: "1px" }}>Lawyers, courts, legal aid centres</div>
            </div>
            <ChevronRight size={14} style={{ color: "#9E9590", marginLeft: "auto" }} className="group-hover:text-[#2A6B7C]" />
          </button>

          {/* Disclaimer */}
          <div
            className="p-3 rounded-lg flex items-start gap-2"
            style={{ background: "#F5F0E8", border: "1px solid #EDE5D8" }}
          >
            <Info size={12} style={{ color: "#9E9590", flexShrink: 0, marginTop: "2px" }} />
            <p style={{ fontSize: "0.72rem", color: "#9E9590", lineHeight: 1.55 }}>
              {latestAnswer?.disclaimer || "This analysis is for informational purposes only and does not constitute legal advice. For your specific situation, consult a qualified advocate."}
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}