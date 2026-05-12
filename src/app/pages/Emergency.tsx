import { Phone, MapPin, Shield, Users, Baby, Heart, Scale, ChevronRight, AlertTriangle, Info } from "lucide-react";

const helplines = [
  {
    name: "National Emergency",
    number: "112",
    desc: "Police, fire, ambulance — single emergency number",
    color: "#C0392B",
    bg: "#FFF0EE",
    border: "#FACFC9",
    icon: Shield,
    priority: true,
  },
  {
    name: "Women's Helpline",
    number: "1091",
    desc: "Domestic violence, harassment, safety support",
    color: "#7B3F9E",
    bg: "#F8F0FF",
    border: "#DFC8F5",
    icon: Users,
    priority: true,
  },
  {
    name: "Police Control Room",
    number: "100",
    desc: "Direct to local police station",
    color: "#1E6B47",
    bg: "#EEF7F2",
    border: "#B8DECA",
    icon: Shield,
    priority: true,
  },
  {
    name: "Child Helpline",
    number: "1098",
    desc: "Child abuse, trafficking, missing children",
    color: "#B8780A",
    bg: "#FFF8E8",
    border: "#F0DFA8",
    icon: Baby,
    priority: false,
  },
  {
    name: "National Legal Services",
    number: "15100",
    desc: "Free legal aid & guidance — NALSA",
    color: "#0F2040",
    bg: "#EEF2FF",
    border: "#C8D0F0",
    icon: Scale,
    priority: false,
  },
  {
    name: "Ambulance",
    number: "108",
    desc: "Medical emergency — all states",
    color: "#C0392B",
    bg: "#FFF0EE",
    border: "#FACFC9",
    icon: Heart,
    priority: false,
  },
];

const quickActions = [
  {
    label: "Nearest Police Station",
    desc: "Bandra (W) Police Station · 2.4 km",
    sub: "022-26550151",
    icon: Shield,
    color: "#1E6B47",
  },
  {
    label: "Nearest Legal Aid Centre",
    desc: "MSLSA, Fort, Mumbai · 1.4 km",
    sub: "1800-12345-678 (Toll free)",
    icon: Scale,
    color: "#0F2040",
  },
  {
    label: "Nearest Hospital",
    desc: "Bandra Govt. Hospital · 1.8 km",
    sub: "022-26401000",
    icon: Heart,
    color: "#C0392B",
  },
];

const rights = [
  "You have the right to know why you are being detained (Article 22, Constitution of India).",
  "You cannot be held for more than 24 hours without being produced before a magistrate.",
  "You have the right to remain silent. Anything you say can be used against you.",
  "You have the right to contact a lawyer of your choice immediately upon arrest.",
  "You cannot be forced to be a witness against yourself (Article 20(3)).",
  "You are entitled to free legal aid if you cannot afford a lawyer (Article 39A).",
];

export default function Emergency() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div
        className="flex items-start gap-4 p-5 rounded-2xl mb-8"
        style={{ background: "#FFF0EE", border: "2px solid #FACFC9" }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#C0392B" }}
        >
          <AlertTriangle size={22} color="white" />
        </div>
        <div>
          <h1
            className="font-playfair mb-1"
            style={{ fontSize: "1.5rem", fontWeight: 700, color: "#8B0000", letterSpacing: "-0.02em" }}
          >
            Emergency Legal Help
          </h1>
          <p style={{ fontSize: "0.88rem", color: "#9B4040", lineHeight: 1.55 }}>
            If you are in immediate danger, call <strong>112</strong> first. Use this page to access helplines, locate nearby help, and know your rights.
          </p>
        </div>
      </div>

      {/* Priority helplines */}
      <div className="mb-6">
        <div
          className="font-mono text-xs mb-4"
          style={{ color: "#9E9590", letterSpacing: "0.1em", textTransform: "uppercase" }}
        >
          Emergency Helplines
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          {helplines.filter((h) => h.priority).map((line) => {
            const Icon = line.icon;
            return (
              <a
                key={line.number}
                href={`tel:${line.number}`}
                className="block p-4 rounded-xl transition-all hover:shadow-md"
                style={{
                  background: line.bg,
                  border: `1.5px solid ${line.border}`,
                  textDecoration: "none",
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: line.color }}
                  >
                    <Icon size={14} color="white" />
                  </div>
                  <div
                    className="font-playfair"
                    style={{ fontSize: "1.6rem", fontWeight: 700, color: line.color, letterSpacing: "-0.02em", lineHeight: 1 }}
                  >
                    {line.number}
                  </div>
                </div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: line.color, marginBottom: "3px" }}>
                  {line.name}
                </div>
                <div style={{ fontSize: "0.77rem", color: line.color, opacity: 0.75 }}>{line.desc}</div>
                <div className="mt-3 flex items-center gap-1.5">
                  <Phone size={11} style={{ color: line.color }} />
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: line.color, opacity: 0.85 }}>
                    TAP TO CALL
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        {/* Secondary helplines */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {helplines.filter((h) => !h.priority).map((line) => {
            const Icon = line.icon;
            return (
              <a
                key={line.number}
                href={`tel:${line.number}`}
                className="lw-card p-3.5 flex items-center gap-3 transition-all hover:shadow-sm"
                style={{ textDecoration: "none" }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: line.bg, border: `1px solid ${line.border}` }}
                >
                  <Icon size={15} style={{ color: line.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: "0.84rem", fontWeight: 600, color: "#0D1117" }}>{line.name}</div>
                  <div style={{ fontSize: "0.74rem", color: "#9E9590" }}>{line.desc}</div>
                </div>
                <div
                  className="font-playfair flex-shrink-0"
                  style={{ fontSize: "1.1rem", fontWeight: 700, color: line.color }}
                >
                  {line.number}
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Nearby help */}
      <div className="mb-8">
        <div
          className="font-mono text-xs mb-4"
          style={{ color: "#9E9590", letterSpacing: "0.1em", textTransform: "uppercase" }}
        >
          Nearest Help — Bandra West, Mumbai
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map(({ label, desc, sub, icon: Icon, color }) => (
            <div
              key={label}
              className="lw-card p-4 flex items-start gap-3"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "#F5F0E8" }}
              >
                <Icon size={16} style={{ color }} strokeWidth={1.8} />
              </div>
              <div className="flex-1">
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#0D1117", marginBottom: "2px" }}>{label}</div>
                <div style={{ fontSize: "0.76rem", color: "#6B6560", marginBottom: "4px" }}>{desc}</div>
                <a
                  href={`tel:${sub.replace(/[^0-9]/g, "")}`}
                  className="flex items-center gap-1.5"
                  style={{ fontSize: "0.78rem", color, fontWeight: 600, textDecoration: "none" }}
                >
                  <Phone size={11} />
                  {sub}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Know your rights */}
      <div className="mb-8">
        <div
          className="font-mono text-xs mb-4"
          style={{ color: "#9E9590", letterSpacing: "0.1em", textTransform: "uppercase" }}
        >
          Know Your Rights — If Detained or Arrested
        </div>
        <div
          className="p-5 rounded-xl"
          style={{ background: "#F0F4F8", border: "1px solid #C8DDE4" }}
        >
          <div className="space-y-3">
            {rights.map((right, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "#2A6B7C", flexShrink: 0 }}
                >
                  <span style={{ fontSize: "0.58rem", color: "white", fontWeight: 700 }}>{i + 1}</span>
                </div>
                <p style={{ fontSize: "0.86rem", color: "#2A3A4A", lineHeight: 1.6 }}>{right}</p>
              </div>
            ))}
          </div>
          <div
            className="flex items-start gap-2 mt-5 pt-4"
            style={{ borderTop: "1px solid #C8DDE4" }}
          >
            <Info size={13} style={{ color: "#9E9590", flexShrink: 0, marginTop: "2px" }} />
            <p style={{ fontSize: "0.76rem", color: "#9E9590", lineHeight: 1.55 }}>
              These rights are guaranteed under the Constitution of India and the Code of Criminal Procedure. If these rights are violated, you can file a writ petition in the High Court under Article 226.
            </p>
          </div>
        </div>
      </div>

      {/* Locate Help CTA */}
      <div
        className="flex items-center justify-between p-5 rounded-xl"
        style={{ background: "#0F2040", border: "1px solid #1A3460" }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(196,151,74,0.2)" }}
          >
            <MapPin size={18} style={{ color: "#C4974A" }} />
          </div>
          <div>
            <div style={{ fontSize: "0.92rem", fontWeight: 600, color: "white" }}>
              Need to find a nearby lawyer or legal aid centre?
            </div>
            <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>
              Use the Find Help screen for verified contacts near you.
            </div>
          </div>
        </div>
        <button
          className="flex items-center gap-2 flex-shrink-0 px-4 py-2 rounded-lg"
          style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "white", cursor: "pointer", fontSize: "0.84rem", fontWeight: 500 }}
        >
          Find Help
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Disclaimer */}
      <p
        className="text-center mt-6"
        style={{ fontSize: "0.76rem", color: "#9E9590", lineHeight: 1.6 }}
      >
        This page provides general information only and is not a substitute for professional legal advice.
        <br />
        In life-threatening situations, always call 112 immediately.
      </p>
    </div>
  );
}
