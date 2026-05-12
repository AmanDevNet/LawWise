import { useState } from "react";
import {
  Clock,
  FileText,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Plus,
  Calendar,
  Bell,
  Tag,
  Paperclip,
} from "lucide-react";

type StatusType = "pending" | "action-needed" | "resolved" | "in-progress";

const statusConfig: Record<StatusType, { label: string; color: string; bg: string; border: string; dot: string }> = {
  "action-needed": { label: "Action Needed", color: "#C0392B", bg: "#FFF0EE", border: "#FACFC9", dot: "#C0392B" },
  pending: { label: "Pending", color: "#B8780A", bg: "#FFF8E8", border: "#F0DFA8", dot: "#C4974A" },
  "in-progress": { label: "In Progress", color: "#2A6B7C", bg: "#F0F7F9", border: "#C8DDE4", dot: "#2A6B7C" },
  resolved: { label: "Resolved", color: "#1E6B47", bg: "#EEF7F2", border: "#B8DECA", dot: "#2E8B57" },
};

const timeline = [
  {
    id: 1,
    date: "Apr 22, 2026",
    title: "Illegal eviction threat — Landlord",
    type: "question",
    status: "action-needed" as StatusType,
    summary: "Asked LawWise about legality of 3-day verbal eviction notice. Identified violation of § 106, TPA.",
    tags: ["Tenant Rights", "Property"],
    reminder: "Send registered legal notice by Apr 28, 2026",
    nextStep: "Draft and send legal notice to landlord via registered post",
    hasDocuments: false,
    hasAdvice: true,
    expanded: false,
    detail: `Landlord verbally demanded vacating in 3 days. LawWise confirmed this is illegal — minimum 15 days written notice required under Transfer of Property Act § 106. Drafted response letter. Risk level: Moderate.`,
  },
  {
    id: 2,
    date: "Apr 18, 2026",
    title: "Rental Agreement — Document Analysis",
    type: "document",
    status: "pending" as StatusType,
    summary: "Uploaded and analysed rental agreement. Found 3 risk flags including unilateral rent revision clause.",
    tags: ["Document", "Rental Agreement"],
    reminder: null,
    nextStep: "Negotiate Clause 7.3 with landlord before signing renewal",
    hasDocuments: true,
    hasAdvice: true,
    expanded: false,
    detail: `Document analysis complete. High risk: Unilateral rent revision clause (§ 7.3). Moderate risk: Aggressive security deposit forfeiture (§ 4.1). Low risk: Maintenance threshold (§ 9.2). Overall document risk: Moderate.`,
  },
  {
    id: 3,
    date: "Apr 10, 2026",
    title: "Traffic challan dispute — E-challan 44832",
    type: "question",
    status: "in-progress" as StatusType,
    summary: "Contested wrong signal violation challan. LawWise provided MV Act § 183 reference and online contest procedure.",
    tags: ["Traffic", "Consumer Rights"],
    reminder: "Check challan status on Parivahan portal",
    nextStep: "Follow up on online contest submission (submitted Apr 12)",
    hasDocuments: false,
    hasAdvice: true,
    expanded: false,
    detail: `Received e-challan for signal violation on Western Express Highway. Speed camera image was unclear. LawWise explained MVA § 183 and procedure for online objection. Submitted contest on Apr 12. Awaiting response from RTO.`,
  },
  {
    id: 4,
    date: "Mar 22, 2026",
    title: "Workplace notice period dispute",
    type: "question",
    status: "resolved" as StatusType,
    summary: "Employer refused to accept resignation with 30-day notice. Resolved after citing labour court precedent.",
    tags: ["Employment", "Labour"],
    reminder: null,
    nextStep: null,
    hasDocuments: false,
    hasAdvice: true,
    expanded: false,
    detail: `Employer claimed 90-day notice despite contract specifying 30 days. LawWise cited relevant Delhi High Court case and IDA provisions. Shared legal reference with employer via email. Employer accepted 30-day notice. Resolved Mar 28.`,
  },
  {
    id: 5,
    date: "Feb 14, 2026",
    title: "Consumer complaint — defective appliance",
    type: "question",
    status: "resolved" as StatusType,
    summary: "Filed complaint with National Consumer Disputes Redressal Commission. Refund received Feb 28.",
    tags: ["Consumer", "Refund"],
    reminder: null,
    nextStep: null,
    hasDocuments: true,
    hasAdvice: true,
    expanded: false,
    detail: `Refrigerator failed within 3 months of purchase. Manufacturer refused warranty claim. LawWise provided complaint procedure under Consumer Protection Act, 2019. Filed NCDRC complaint online. Manufacturer issued full refund on Feb 28.`,
  },
];

const typeIcons = {
  question: MessageSquare,
  document: FileText,
  reminder: Bell,
};

export default function MyTimeline() {
  const [items, setItems] = useState(timeline);
  const [filterStatus, setFilterStatus] = useState<StatusType | "all">("all");

  const toggleExpanded = (id: number) => {
    setItems(items.map((item) => item.id === id ? { ...item, expanded: !item.expanded } : item));
  };

  const filtered = filterStatus === "all" ? items : items.filter((i) => i.status === filterStatus);

  const counts = {
    all: items.length,
    "action-needed": items.filter((i) => i.status === "action-needed").length,
    pending: items.filter((i) => i.status === "pending").length,
    "in-progress": items.filter((i) => i.status === "in-progress").length,
    resolved: items.filter((i) => i.status === "resolved").length,
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-playfair mb-1" style={{ fontSize: "1.6rem", fontWeight: 600, color: "#0D1117", letterSpacing: "-0.02em" }}>
            My Timeline
          </h1>
          <p style={{ fontSize: "0.86rem", color: "#9E9590" }}>
            A record of your legal history, actions taken, and upcoming steps.
          </p>
        </div>
        <button
          className="lw-btn-primary flex items-center gap-2"
          style={{ padding: "9px 18px", fontSize: "0.86rem", flexShrink: 0 }}
        >
          <Plus size={14} />
          New entry
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { key: "action-needed", ...statusConfig["action-needed"] },
          { key: "pending", ...statusConfig["pending"] },
          { key: "in-progress", ...statusConfig["in-progress"] },
          { key: "resolved", ...statusConfig["resolved"] },
        ].map(({ key, label, color, bg, border }) => (
          <button
            key={key}
            onClick={() => setFilterStatus(filterStatus === key ? "all" : key as StatusType)}
            className="p-3.5 rounded-xl text-left transition-all"
            style={{
              background: filterStatus === key ? bg : "white",
              border: filterStatus === key ? `1.5px solid ${border}` : "1px solid #E2D9CC",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: "1.4rem", fontWeight: 700, color, marginBottom: "2px", fontFamily: "Playfair Display, serif" }}>
              {counts[key as keyof typeof counts]}
            </div>
            <div style={{ fontSize: "0.75rem", color: filterStatus === key ? color : "#9E9590", fontWeight: filterStatus === key ? 600 : 400 }}>
              {label}
            </div>
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-6">
        <span style={{ fontSize: "0.78rem", color: "#9E9590" }}>Showing:</span>
        <button
          onClick={() => setFilterStatus("all")}
          className="px-3 py-1.5 rounded-lg"
          style={{
            fontSize: "0.78rem",
            fontWeight: filterStatus === "all" ? 600 : 400,
            background: filterStatus === "all" ? "#0F2040" : "white",
            color: filterStatus === "all" ? "white" : "#6B6560",
            border: filterStatus === "all" ? "1px solid #0F2040" : "1px solid #E2D9CC",
            cursor: "pointer",
          }}
        >
          All ({counts.all})
        </button>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-[22px] top-0 bottom-0 w-px"
          style={{ background: "#E2D9CC" }}
        />

        <div className="space-y-4">
          {filtered.map((item) => {
            const status = statusConfig[item.status];
            const TypeIcon = typeIcons[item.type as keyof typeof typeIcons] || MessageSquare;

            return (
              <div key={item.id} className="relative pl-12">
                {/* Timeline dot */}
                <div
                  className="absolute left-[14px] top-5 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: "white", border: `2px solid ${status.dot}`, zIndex: 1 }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: status.dot }} />
                </div>

                {/* Card */}
                <div className="lw-card overflow-hidden">
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className="w-full p-4 text-left"
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "#F5F0E8", border: "1px solid #EDE5D8" }}
                      >
                        <TypeIcon size={14} style={{ color: "#C4974A" }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-1.5">
                          <div>
                            <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#0D1117", marginBottom: "2px" }}>
                              {item.title}
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Calendar size={11} style={{ color: "#9E9590" }} />
                                <span style={{ fontSize: "0.74rem", color: "#9E9590" }}>{item.date}</span>
                              </div>
                              <span
                                className="px-2 py-0.5 rounded-full"
                                style={{ fontSize: "0.68rem", fontWeight: 700, background: status.bg, color: status.color, border: `1px solid ${status.border}` }}
                              >
                                {status.label}
                              </span>
                            </div>
                          </div>
                          {item.expanded
                            ? <ChevronUp size={15} style={{ color: "#9E9590", flexShrink: 0 }} />
                            : <ChevronDown size={15} style={{ color: "#9E9590", flexShrink: 0 }} />
                          }
                        </div>

                        <p style={{ fontSize: "0.83rem", color: "#6B6560", lineHeight: 1.55 }}>{item.summary}</p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="flex items-center gap-1 px-2 py-0.5 rounded"
                              style={{ fontSize: "0.7rem", background: "#F0EDE7", color: "#6B6560", border: "1px solid #E2D9CC" }}
                            >
                              <Tag size={9} />
                              {tag}
                            </span>
                          ))}
                          {item.hasDocuments && (
                            <span
                              className="flex items-center gap-1 px-2 py-0.5 rounded"
                              style={{ fontSize: "0.7rem", background: "#F0F4F8", color: "#2A6B7C", border: "1px solid #C8DDE4" }}
                            >
                              <Paperclip size={9} />
                              Document
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Expanded content */}
                  {item.expanded && (
                    <div style={{ borderTop: "1px solid #F0EDE7" }}>
                      <div className="p-4 space-y-4">
                        {/* Detail */}
                        <p style={{ fontSize: "0.84rem", color: "#4A4540", lineHeight: 1.7 }}>{item.detail}</p>

                        {/* Next step */}
                        {item.nextStep && (
                          <div
                            className="flex items-start gap-2.5 p-3 rounded-lg"
                            style={{ background: "#F0F4F8", border: "1px solid #C8DDE4" }}
                          >
                            <AlertCircle size={14} style={{ color: "#2A6B7C", flexShrink: 0, marginTop: "1px" }} />
                            <div>
                              <div style={{ fontSize: "0.74rem", color: "#2A6B7C", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "2px" }}>
                                Next Step
                              </div>
                              <div style={{ fontSize: "0.83rem", color: "#2A6B7C" }}>{item.nextStep}</div>
                            </div>
                          </div>
                        )}

                        {/* Reminder */}
                        {item.reminder && (
                          <div
                            className="flex items-center gap-2.5 p-3 rounded-lg"
                            style={{ background: "#FFF8E8", border: "1px solid #F0DFA8" }}
                          >
                            <Bell size={13} style={{ color: "#C4974A", flexShrink: 0 }} />
                            <div style={{ fontSize: "0.82rem", color: "#8B5A00" }}>
                              <strong>Reminder:</strong> {item.reminder}
                            </div>
                          </div>
                        )}

                        {/* Resolved badge */}
                        {item.status === "resolved" && (
                          <div
                            className="flex items-center gap-2 p-3 rounded-lg"
                            style={{ background: "#EEF7F2", border: "1px solid #B8DECA" }}
                          >
                            <CheckCircle2 size={14} style={{ color: "#1E6B47" }} />
                            <span style={{ fontSize: "0.83rem", color: "#1E6B47", fontWeight: 500 }}>
                              This matter has been resolved.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Clock size={32} style={{ color: "#D4C8BB", margin: "0 auto 12px" }} strokeWidth={1.5} />
          <p style={{ fontSize: "0.9rem", color: "#9E9590" }}>No timeline entries match this filter.</p>
        </div>
      )}
    </div>
  );
}
