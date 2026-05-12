import { useNavigate } from "react-router";
import {
  Scale,
  ShieldCheck,
  FileText,
  MapPin,
  Globe,
  ChevronRight,
  ArrowRight,
  BookOpen,
  Zap,
  Users,
  CheckCircle2,
  Phone,
  Star,
  AlertTriangle,
} from "lucide-react";

const trustItems = [
  { label: "Grounded in Indian legal sources", icon: BookOpen },
  { label: "State-aware guidance", icon: MapPin },
  { label: "Multilingual support", icon: Globe },
  { label: "Action plans with citations", icon: CheckCircle2 },
];

const features = [
  {
    icon: Scale,
    title: "Legal Q&A in Plain Language",
    desc: "Ask any legal question. Get clear, grounded answers with references to IPC, CrPC, and Indian constitutional law.",
    accent: "#2A6B7C",
  },
  {
    icon: FileText,
    title: "Document Intelligence",
    desc: "Upload FIRs, rental agreements, notices, or contracts. Receive clause-by-clause breakdowns and risk flags.",
    accent: "#C4974A",
  },
  {
    icon: MapPin,
    title: "Find Nearby Legal Help",
    desc: "Locate verified lawyers, district courts, legal aid centres, and police stations near you — filtered by case type.",
    accent: "#0F2040",
  },
  {
    icon: Zap,
    title: "Action Plans, Not Just Answers",
    desc: "Every response includes a prioritised step-by-step action plan, evidence checklist, and urgency assessment.",
    accent: "#1E6B47",
  },
  {
    icon: Globe,
    title: "12 Indian Languages",
    desc: "Use LawWise in Hindi, Tamil, Telugu, Kannada, Bengali, Marathi, and more. Your rights, in your language.",
    accent: "#7B3F9E",
  },
  {
    icon: Users,
    title: "Case Timeline & Memory",
    desc: "Track your legal journey — past advice, uploaded documents, action items, and upcoming deadlines, all in one place.",
    accent: "#C0392B",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Describe your situation",
    desc: "Type your legal question in plain language — no legalese required. LawWise understands context and nuance.",
  },
  {
    step: "02",
    title: "Receive structured guidance",
    desc: "Get a detailed answer with cited sections of Indian law, urgency level, recommended actions, and evidence to gather.",
  },
  {
    step: "03",
    title: "Take action with confidence",
    desc: "Use built-in tools to find nearby help, draft responses, track your case, or escalate to emergency support.",
  },
];

const situations = [
  { label: "Police stop or detention", icon: "🚔", tag: "Know your rights" },
  { label: "Tenant dispute or eviction", icon: "🏠", tag: "Rental law" },
  { label: "Workplace harassment", icon: "⚖️", tag: "POSH Act" },
  { label: "Traffic challan or fine", icon: "🚦", tag: "Motor Vehicles Act" },
  { label: "Consumer complaint", icon: "🛍️", tag: "Consumer Protection" },
  { label: "Domestic violence", icon: "🛡️", tag: "Protection of Women" },
  { label: "Property dispute", icon: "📋", tag: "Property law" },
  { label: "RTI filing", icon: "📂", tag: "Right to Information" },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: "#FAF8F4", fontFamily: "Inter, sans-serif" }}>
      {/* Navigation */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-8 py-4"
        style={{
          background: "rgba(250,248,244,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #E2D9CC",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ background: "#0F2040" }}
          >
            <Scale size={16} color="white" strokeWidth={1.8} />
          </div>
          <span
            className="font-playfair"
            style={{ fontSize: "1.2rem", fontWeight: 600, color: "#0F2040", letterSpacing: "-0.01em" }}
          >
            LawWise
          </span>
          <span
            className="text-xs px-1.5 py-0.5 rounded"
            style={{ background: "#F0F4F8", color: "#2A6B7C", border: "1px solid #C8DDE4", fontWeight: 500 }}
          >
            India
          </span>
        </div>

        <div className="hidden md:flex items-center gap-7">
          {["Features", "How it works", "For situations", "Pricing"].map((item) => (
            <a
              key={item}
              href="#"
              style={{ fontSize: "0.88rem", color: "#6B6560", fontWeight: 500, textDecoration: "none" }}
              className="hover:text-[#0F2040] transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            style={{
              fontSize: "0.88rem",
              color: "#0F2040",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Sign in
          </button>
          <button
            onClick={() => navigate("/app")}
            className="lw-btn-primary"
            style={{ padding: "8px 18px", fontSize: "0.88rem" }}
          >
            Get started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
        {/* Subtle background texture */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(42,107,124,0.08) 0%, transparent 60%),
              radial-gradient(circle at 80% 20%, rgba(196,151,74,0.06) 0%, transparent 50%)`,
          }}
        />

        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">
            {/* Left: Text */}
            <div className="lg:col-span-3">
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-8"
                style={{ background: "#EEF7F2", border: "1px solid #B8DECA" }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#1E6B47" }} />
                <span style={{ fontSize: "0.78rem", color: "#1E6B47", fontWeight: 600, letterSpacing: "0.04em" }}>
                  GROUNDED IN INDIAN LAW — IPC · CrPC · Constitution
                </span>
              </div>

              <h1
                className="font-playfair mb-6"
                style={{
                  fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
                  fontWeight: 600,
                  color: "#0D1117",
                  lineHeight: 1.18,
                  letterSpacing: "-0.025em",
                }}
              >
                Understand Your
                <br />
                <span style={{ color: "#0F2040" }}>Legal Rights,</span>
                <br />
                <em style={{ fontStyle: "italic", color: "#2A6B7C" }}>Clearly.</em>
              </h1>

              <p
                style={{
                  fontSize: "1.05rem",
                  color: "#6B6560",
                  lineHeight: 1.7,
                  maxWidth: "500px",
                  marginBottom: "36px",
                }}
              >
                LawWise gives every Indian citizen access to plain-language legal guidance — grounded in cited statutes, state-aware, and designed for real-life situations.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <button
                  onClick={() => navigate("/app")}
                  className="lw-btn-primary flex items-center gap-2"
                  style={{ fontSize: "0.95rem", padding: "12px 24px" }}
                >
                  Ask LawWise
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => navigate("/app/documents")}
                  className="lw-btn-secondary flex items-center gap-2"
                  style={{ fontSize: "0.95rem", padding: "12px 24px" }}
                >
                  <FileText size={16} />
                  Analyse a Document
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8">
                {[
                  { value: "48+", label: "Acts & codes covered" },
                  { value: "12", label: "Indian languages" },
                  { value: "28", label: "State-specific rules" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div
                      className="font-playfair"
                      style={{ fontSize: "1.6rem", fontWeight: 700, color: "#0F2040", letterSpacing: "-0.02em" }}
                    >
                      {stat.value}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#9E9590", marginTop: "2px" }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Visual card stack */}
            <div className="lg:col-span-2 hidden lg:block">
              <div className="relative">
                {/* Background card */}
                <div
                  className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl"
                  style={{ background: "#E8EFF5", border: "1px solid #C8D8E8" }}
                />
                <div
                  className="absolute -bottom-2 -right-2 w-full h-full rounded-2xl"
                  style={{ background: "#F0F4F8", border: "1px solid #D0DDE8" }}
                />

                {/* Main card */}
                <div
                  className="relative lw-card p-6 rounded-2xl"
                  style={{ zIndex: 2 }}
                >
                  {/* Urgency badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-mono"
                      style={{
                        background: "#FFF8E8",
                        color: "#B8780A",
                        border: "1px solid #F0DFA8",
                        fontWeight: 600,
                      }}
                    >
                      ⚠ MODERATE URGENCY
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "#9E9590" }}>IPC § 498A</span>
                  </div>

                  <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#0D1117", marginBottom: "8px" }}>
                    Your landlord cannot evict you without...
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "#6B6560", lineHeight: 1.6, marginBottom: "16px" }}>
                    Under the Transfer of Property Act, 1882 (§ 106), your landlord must provide 15 days notice for monthly tenancy and 6 months for yearly tenancy.
                  </p>

                  {/* Citation */}
                  <div
                    style={{
                      background: "#F0F4F8",
                      borderLeft: "3px solid #2A6B7C",
                      borderRadius: "0 6px 6px 0",
                      padding: "8px 12px",
                      marginBottom: "16px",
                    }}
                  >
                    <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.72rem", color: "#2A6B7C", fontWeight: 500 }}>
                      Transfer of Property Act, 1882 · § 106
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#0D1117", marginBottom: "8px" }}>
                    Recommended next steps
                  </div>
                  {["Send a legal notice via registered post", "File complaint with Rent Control Officer", "Document all communications"].map((step, i) => (
                    <div key={i} className="flex items-start gap-2 mb-2">
                      <div
                        className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5"
                        style={{ background: "#EEF7F2", border: "1px solid #B8DECA" }}
                      >
                        <span style={{ fontSize: "0.6rem", color: "#1E6B47", fontWeight: 700 }}>{i + 1}</span>
                      </div>
                      <span style={{ fontSize: "0.8rem", color: "#6B6560" }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section style={{ borderTop: "1px solid #E2D9CC", borderBottom: "1px solid #E2D9CC", background: "#F5F0E8" }}>
        <div className="max-w-6xl mx-auto px-8 py-5">
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            {trustItems.map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2.5">
                <Icon size={15} style={{ color: "#2A6B7C" }} />
                <span style={{ fontSize: "0.83rem", color: "#4A4540", fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <div className="mb-12">
          <div
            className="font-mono text-xs mb-3"
            style={{ color: "#2A6B7C", letterSpacing: "0.1em", textTransform: "uppercase" }}
          >
            Platform capabilities
          </div>
          <h2
            className="font-playfair"
            style={{ fontSize: "2.2rem", fontWeight: 600, color: "#0D1117", letterSpacing: "-0.02em", maxWidth: "500px", lineHeight: 1.25 }}
          >
            Built for real legal situations, not hypothetical ones.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc, accent }) => (
            <div key={title} className="lw-card p-6 group hover:shadow-md transition-shadow">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                style={{ background: `${accent}14`, border: `1px solid ${accent}26` }}
              >
                <Icon size={18} style={{ color: accent }} strokeWidth={1.8} />
              </div>
              <h3
                style={{ fontSize: "0.95rem", fontWeight: 600, color: "#0D1117", marginBottom: "8px" }}
              >
                {title}
              </h3>
              <p style={{ fontSize: "0.84rem", color: "#6B6560", lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: "#0F2040", padding: "80px 0" }}>
        <div className="max-w-6xl mx-auto px-8">
          <div className="mb-14 text-center">
            <div
              className="font-mono text-xs mb-3"
              style={{ color: "rgba(196,151,74,0.85)", letterSpacing: "0.1em", textTransform: "uppercase" }}
            >
              How LawWise works
            </div>
            <h2
              className="font-playfair"
              style={{ fontSize: "2.2rem", fontWeight: 600, color: "white", letterSpacing: "-0.02em" }}
            >
              From question to action in minutes.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map(({ step, title, desc }) => (
              <div key={step} className="relative">
                {/* Connector line */}
                <div className="hidden md:block absolute top-6 left-[calc(50%+40px)] right-0 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />

                <div
                  className="font-playfair mb-4"
                  style={{ fontSize: "3rem", fontWeight: 700, color: "rgba(196,151,74,0.25)", letterSpacing: "-0.04em", lineHeight: 1 }}
                >
                  {step}
                </div>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "white", marginBottom: "10px" }}>{title}</h3>
                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Situations */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <div className="mb-10">
          <div
            className="font-mono text-xs mb-3"
            style={{ color: "#2A6B7C", letterSpacing: "0.1em", textTransform: "uppercase" }}
          >
            For common situations
          </div>
          <h2
            className="font-playfair"
            style={{ fontSize: "2.2rem", fontWeight: 600, color: "#0D1117", letterSpacing: "-0.02em", lineHeight: 1.25 }}
          >
            What are you dealing with?
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {situations.map(({ label, icon, tag }) => (
            <button
              key={label}
              onClick={() => navigate("/app")}
              className="lw-card p-4 text-left group hover:border-[#2A6B7C] hover:shadow-md transition-all"
              style={{ cursor: "pointer", background: "white" }}
            >
              <div className="text-2xl mb-3">{icon}</div>
              <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#0D1117", marginBottom: "4px", lineHeight: 1.35 }}>
                {label}
              </div>
              <div
                className="inline-flex items-center gap-1"
                style={{ fontSize: "0.74rem", color: "#2A6B7C", fontWeight: 500 }}
              >
                {tag}
                <ChevronRight size={11} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Emergency CTA */}
      <section style={{ background: "#FFF8F6", borderTop: "1px solid #FACFC9", borderBottom: "1px solid #FACFC9" }}>
        <div className="max-w-6xl mx-auto px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "#FFF0EE", border: "1px solid #FACFC9" }}
            >
              <AlertTriangle size={20} style={{ color: "#C0392B" }} />
            </div>
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#0D1117" }}>
                Facing a legal emergency right now?
              </div>
              <div style={{ fontSize: "0.84rem", color: "#6B6560", marginTop: "2px" }}>
                Access helplines, nearest police station, and emergency legal aid instantly.
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate("/app/emergency")}
            className="lw-emergency flex items-center gap-2 flex-shrink-0"
            style={{ fontSize: "0.9rem", padding: "10px 20px" }}
          >
            <Phone size={14} />
            Emergency Help
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#0D1117", padding: "48px 0 32px" }}>
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                >
                  <Scale size={14} color="white" />
                </div>
                <span className="font-playfair" style={{ color: "white", fontWeight: 600 }}>LawWise</span>
              </div>
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>
                AI-powered legal guidance grounded in Indian law. For informational purposes only.
              </p>
            </div>
            {[
              { heading: "Product", items: ["Ask LawWise", "Document Analysis", "Find Nearby Help", "Emergency"] },
              { heading: "Legal", items: ["Disclaimer", "Privacy Policy", "Terms of Use", "Data Security"] },
              { heading: "Company", items: ["About", "Blog", "Careers", "Contact"] },
            ].map(({ heading, items }) => (
              <div key={heading}>
                <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>
                  {heading}
                </div>
                {items.map((item) => (
                  <div key={item} style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.5)", marginBottom: "8px", cursor: "pointer" }}>
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "20px", fontSize: "0.78rem", color: "rgba(255,255,255,0.25)" }}
            className="flex flex-col sm:flex-row items-center justify-between gap-3"
          >
            <span>© 2026 LawWise Technologies Pvt. Ltd. · CIN: U74999MH2026PTC000000</span>
            <span>Not a substitute for professional legal advice. For informational use only.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
