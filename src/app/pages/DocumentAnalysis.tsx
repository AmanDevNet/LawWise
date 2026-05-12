import { useState } from "react";
import {
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock,
  File,
  Eye,
  Download,
  Wand2,
  Flag,
  MessageSquareDiff,
  Info,
  X,
} from "lucide-react";

const recentUploads = [
  { name: "Rental_Agreement_Mumbai_2024.pdf", type: "Rental Agreement", date: "Apr 18, 2026", status: "analysed", risk: "moderate" },
  { name: "Legal_Notice_from_Bank.pdf", type: "Legal Notice", date: "Apr 12, 2026", status: "analysed", risk: "high" },
  { name: "Employment_Contract.pdf", type: "Employment Contract", date: "Mar 30, 2026", status: "analysed", risk: "low" },
];

const riskFlags = [
  {
    severity: "high",
    clause: "Unilateral rent revision",
    excerpt: "The Landlord may revise the rent at any time without prior notice at their sole discretion.",
    section: "Clause 7.3",
    note: "Unilateral rent revision without notice is contrary to the Maharashtra Rent Control Act, 1999.",
  },
  {
    severity: "moderate",
    clause: "Security deposit forfeiture",
    excerpt: "Security deposit may be forfeited entirely if the tenant vacates before the lock-in period.",
    section: "Clause 4.1",
    note: "Excessive forfeiture provisions are challengeable if deemed unconscionable. Recommended: negotiate partial refund clause.",
  },
  {
    severity: "low",
    clause: "Maintenance responsibility",
    excerpt: "Tenant shall bear all maintenance costs exceeding ₹500 per incident.",
    section: "Clause 9.2",
    note: "Standard tenant maintenance clauses are acceptable but the ₹500 threshold is on the lower side.",
  },
];

const clauses = [
  { title: "Parties & Property", status: "ok", summary: "Parties clearly identified. Property description matches registration details." },
  { title: "Tenancy Duration & Lock-in", status: "ok", summary: "11-month tenancy with 6-month lock-in. Standard practice for Mumbai." },
  { title: "Rent & Escalation", status: "risk", summary: "Rent escalation clause gives landlord unilateral discretion — flag for negotiation." },
  { title: "Security Deposit", status: "moderate", summary: "3-month security deposit. Forfeiture clause is aggressive — see Risk #2." },
  { title: "Termination Notice", status: "ok", summary: "30-day mutual notice required. Compliant with § 106, TPA, 1882." },
  { title: "Maintenance & Repairs", status: "moderate", summary: "₹500 maintenance threshold may be burdensome over time." },
  { title: "Sub-letting", status: "ok", summary: "Sub-letting prohibited with written consent. Standard provision." },
  { title: "Dispute Resolution", status: "ok", summary: "Mumbai jurisdiction. Arbitration clause present — acceptable." },
];

const statusConfig = {
  ok: { color: "#1E6B47", bg: "#EEF7F2", border: "#B8DECA", label: "OK" },
  moderate: { color: "#B8780A", bg: "#FFF8E8", border: "#F0DFA8", label: "Review" },
  risk: { color: "#C0392B", bg: "#FFF0EE", border: "#FACFC9", label: "Risk" },
};

const severityConfig = {
  high: { color: "#C0392B", bg: "#FFF0EE", border: "#FACFC9", dot: "#C0392B" },
  moderate: { color: "#B8780A", bg: "#FFF8E8", border: "#F0DFA8", dot: "#C4974A" },
  low: { color: "#1E6B47", bg: "#EEF7F2", border: "#B8DECA", dot: "#2E8B57" },
};

export default function DocumentAnalysis() {
  const [activeDoc, setActiveDoc] = useState<string | null>("Rental_Agreement_Mumbai_2024.pdf");
  const [dragOver, setDragOver] = useState(false);
  const [activeClause, setActiveClause] = useState<number | null>(null);

  return (
    <div className="flex h-full">
      {/* Left panel: Upload + Recent */}
      <div
        className="hidden lg:flex flex-col w-72 flex-shrink-0 overflow-y-auto"
        style={{ borderRight: "1px solid #E2D9CC", background: "#FAF8F4" }}
      >
        <div className="p-5">
          <h2 className="font-playfair mb-1" style={{ fontSize: "1.05rem", fontWeight: 600, color: "#0D1117" }}>
            Document Analysis
          </h2>
          <p style={{ fontSize: "0.78rem", color: "#9E9590", marginBottom: "16px" }}>
            Upload legal documents for AI-powered review.
          </p>

          {/* Upload zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
            className="border-2 border-dashed rounded-xl p-5 text-center mb-4 transition-all cursor-pointer"
            style={{
              borderColor: dragOver ? "#2A6B7C" : "#D4C8BB",
              background: dragOver ? "#F0F7F9" : "white",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
              style={{ background: "#F0F4F8", border: "1px solid #C8DDE4" }}
            >
              <Upload size={18} style={{ color: "#2A6B7C" }} strokeWidth={1.8} />
            </div>
            <p style={{ fontSize: "0.83rem", fontWeight: 600, color: "#0D1117", marginBottom: "4px" }}>
              Drop file to upload
            </p>
            <p style={{ fontSize: "0.75rem", color: "#9E9590", marginBottom: "12px" }}>
              PDF, DOCX, JPG, PNG up to 20MB
            </p>
            <button
              className="lw-btn-teal w-full"
              style={{ padding: "8px 16px", fontSize: "0.82rem" }}
            >
              Browse files
            </button>
          </div>

          {/* Supported types */}
          <div className="mb-5">
            <p style={{ fontSize: "0.72rem", color: "#9E9590", marginBottom: "6px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Supported types
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["FIR", "Rental Agreement", "Legal Notice", "Employment Contract", "RTI Application", "Affidavit", "Decree"].map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded text-xs"
                  style={{ background: "#F0EDE7", color: "#6B6560", border: "1px solid #E2D9CC" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Recent uploads */}
          <div>
            <p style={{ fontSize: "0.72rem", color: "#9E9590", marginBottom: "8px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Recent
            </p>
            <div className="space-y-2">
              {recentUploads.map((doc) => {
                const isActive = activeDoc === doc.name;
                return (
                  <button
                    key={doc.name}
                    onClick={() => setActiveDoc(doc.name)}
                    className="w-full p-3 rounded-lg text-left transition-all"
                    style={{
                      background: isActive ? "#0F2040" : "white",
                      border: isActive ? "1px solid #0F2040" : "1px solid #E2D9CC",
                      cursor: "pointer",
                    }}
                  >
                    <div className="flex items-start gap-2.5">
                      <File
                        size={14}
                        style={{ color: isActive ? "rgba(196,151,74,0.9)" : "#9E9590", flexShrink: 0, marginTop: "2px" }}
                      />
                      <div className="flex-1 min-w-0">
                        <div
                          style={{
                            fontSize: "0.78rem",
                            fontWeight: 500,
                            color: isActive ? "white" : "#0D1117",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            marginBottom: "2px",
                          }}
                        >
                          {doc.name}
                        </div>
                        <div className="flex items-center justify-between">
                          <span style={{ fontSize: "0.7rem", color: isActive ? "rgba(255,255,255,0.4)" : "#9E9590" }}>
                            {doc.date}
                          </span>
                          <span
                            className="px-1.5 py-0.5 rounded text-xs"
                            style={{
                              fontSize: "0.67rem",
                              fontWeight: 600,
                              background: doc.risk === "high" ? "#FFF0EE" : doc.risk === "moderate" ? "#FFF8E8" : "#EEF7F2",
                              color: doc.risk === "high" ? "#C0392B" : doc.risk === "moderate" ? "#B8780A" : "#1E6B47",
                            }}
                          >
                            {doc.risk}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Centre: Document preview */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {activeDoc ? (
          <>
            {/* Doc header */}
            <div
              className="px-6 py-4 flex items-center justify-between flex-shrink-0"
              style={{ borderBottom: "1px solid #E2D9CC", background: "#FAF8F4" }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "#F0F4F8", border: "1px solid #C8DDE4" }}
                >
                  <FileText size={14} style={{ color: "#2A6B7C" }} />
                </div>
                <div className="min-w-0">
                  <div
                    style={{ fontSize: "0.88rem", fontWeight: 600, color: "#0D1117", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  >
                    {activeDoc}
                  </div>
                  <div style={{ fontSize: "0.74rem", color: "#9E9590" }}>Rental Agreement · 14 pages · Analysed Apr 18</div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                  style={{ background: "white", border: "1px solid #E2D9CC", fontSize: "0.8rem", color: "#6B6560", cursor: "pointer" }}
                >
                  <Eye size={12} /> View
                </button>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                  style={{ background: "white", border: "1px solid #E2D9CC", fontSize: "0.8rem", color: "#6B6560", cursor: "pointer" }}
                >
                  <Download size={12} /> Export
                </button>
              </div>
            </div>

            {/* Tabs with action buttons */}
            <div
              className="flex items-center gap-2 px-6 py-3 flex-shrink-0"
              style={{ borderBottom: "1px solid #E2D9CC", background: "#FAF8F4" }}
            >
              <div className="flex gap-1 flex-1">
                {["Summary", "Clause Breakdown", "Risk Flags"].map((tab, i) => (
                  <button
                    key={tab}
                    className="px-4 py-1.5 rounded-lg transition-all"
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: i === 0 ? 600 : 400,
                      background: i === 0 ? "#0F2040" : "transparent",
                      color: i === 0 ? "white" : "#6B6560",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                  style={{ background: "#F5F0E8", border: "1px solid #EDE5D8", fontSize: "0.79rem", color: "#4A3820", cursor: "pointer", fontWeight: 500 }}
                >
                  <Wand2 size={12} /> Simplify
                </button>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                  style={{ background: "#FFF0EE", border: "1px solid #FACFC9", fontSize: "0.79rem", color: "#C0392B", cursor: "pointer", fontWeight: 500 }}
                >
                  <Flag size={12} /> Flag Risky Terms
                </button>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                  style={{ background: "#0F2040", border: "none", fontSize: "0.79rem", color: "white", cursor: "pointer", fontWeight: 500 }}
                >
                  <MessageSquareDiff size={12} /> Draft Response
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* AI Summary */}
              <div
                className="p-5 rounded-xl mb-5"
                style={{ background: "#F5F0E8", border: "1px solid #EDE5D8" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center"
                    style={{ background: "#C4974A" }}
                  >
                    <span style={{ fontSize: "0.65rem", color: "white", fontWeight: 700 }}>AI</span>
                  </div>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#4A3820", letterSpacing: "0.02em" }}>
                    Document Summary
                  </span>
                </div>
                <p style={{ fontSize: "0.86rem", color: "#4A3820", lineHeight: 1.7 }}>
                  This is a standard 11-month residential rental agreement for a 2BHK flat in Bandra West, Mumbai. The agreement is largely compliant with the Maharashtra Rent Control Act, 1999, with <strong>3 notable concerns</strong>: a unilateral rent revision clause (high risk), an aggressive security deposit forfeiture provision (moderate), and a below-standard maintenance threshold. The document does not include a mandatory maintenance society disclosure. Overall risk level: <strong>Moderate</strong>.
                </p>
              </div>

              {/* Risk flags */}
              <div className="mb-5">
                <div
                  className="font-mono text-xs mb-3"
                  style={{ color: "#9E9590", letterSpacing: "0.06em", textTransform: "uppercase" }}
                >
                  Risk Flags · {riskFlags.length} found
                </div>
                <div className="space-y-3">
                  {riskFlags.map((flag, i) => {
                    const config = severityConfig[flag.severity as keyof typeof severityConfig];
                    return (
                      <div
                        key={i}
                        className="lw-card p-4"
                        style={{ borderLeft: `3px solid ${config.dot}` }}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <span
                              className="px-2 py-0.5 rounded-full font-mono"
                              style={{ fontSize: "0.68rem", fontWeight: 700, background: config.bg, color: config.color, border: `1px solid ${config.border}` }}
                            >
                              {flag.severity.toUpperCase()}
                            </span>
                            <span style={{ fontSize: "0.84rem", fontWeight: 600, color: "#0D1117" }}>{flag.clause}</span>
                          </div>
                          <span style={{ fontSize: "0.72rem", color: "#9E9590", fontFamily: "JetBrains Mono, monospace", flexShrink: 0 }}>
                            {flag.section}
                          </span>
                        </div>
                        <blockquote
                          className="px-3 py-2 rounded-lg mb-2"
                          style={{ background: "#F5F0E8", borderLeft: "2px solid #E2D9CC", fontSize: "0.8rem", color: "#6B6560", fontStyle: "italic" }}
                        >
                          "{flag.excerpt}"
                        </blockquote>
                        <p style={{ fontSize: "0.78rem", color: "#6B6560", lineHeight: 1.55 }}>{flag.note}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Clause breakdown */}
              <div>
                <div
                  className="font-mono text-xs mb-3"
                  style={{ color: "#9E9590", letterSpacing: "0.06em", textTransform: "uppercase" }}
                >
                  Clause Breakdown
                </div>
                <div className="space-y-2">
                  {clauses.map((clause, i) => {
                    const config = statusConfig[clause.status as keyof typeof statusConfig];
                    const isOpen = activeClause === i;
                    return (
                      <div
                        key={i}
                        className="lw-card overflow-hidden"
                      >
                        <button
                          onClick={() => setActiveClause(isOpen ? null : i)}
                          className="w-full flex items-center gap-3 px-4 py-3"
                          style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                        >
                          <span
                            className="px-2 py-0.5 rounded text-xs font-mono flex-shrink-0"
                            style={{ background: config.bg, color: config.color, border: `1px solid ${config.border}`, fontWeight: 700 }}
                          >
                            {config.label}
                          </span>
                          <span style={{ fontSize: "0.84rem", fontWeight: 500, color: "#0D1117", flex: 1 }}>{clause.title}</span>
                          <ChevronRight
                            size={14}
                            style={{ color: "#9E9590", flexShrink: 0, transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}
                          />
                        </button>
                        {isOpen && (
                          <div
                            className="px-4 pb-3"
                            style={{ borderTop: "1px solid #F0EDE7" }}
                          >
                            <p style={{ fontSize: "0.82rem", color: "#6B6560", lineHeight: 1.6, paddingTop: "10px" }}>{clause.summary}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-sm">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: "#F0F4F8", border: "1px solid #C8DDE4" }}
              >
                <FileText size={28} style={{ color: "#2A6B7C" }} strokeWidth={1.5} />
              </div>
              <h2 className="font-playfair mb-2" style={{ fontSize: "1.2rem", fontWeight: 600, color: "#0D1117" }}>
                No document selected
              </h2>
              <p style={{ fontSize: "0.85rem", color: "#9E9590", lineHeight: 1.6 }}>
                Upload a legal document or select a recent one from the sidebar to begin analysis.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
