import { useState } from "react";
import {
  Globe,
  MapPin,
  Lock,
  FileText,
  Trash2,
  Bell,
  Moon,
  ChevronRight,
  Check,
  User,
  Shield,
  Eye,
  EyeOff,
  Info,
} from "lucide-react";

const languages = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
];

const states = [
  "Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Uttar Pradesh",
  "West Bengal", "Gujarat", "Rajasthan", "Kerala", "Andhra Pradesh",
];

function SectionHeader({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-5">
      <h2 className="font-playfair" style={{ fontSize: "1.05rem", fontWeight: 600, color: "#0D1117", marginBottom: "4px" }}>
        {title}
      </h2>
      {desc && <p style={{ fontSize: "0.82rem", color: "#9E9590" }}>{desc}</p>}
    </div>
  );
}

function ToggleRow({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid #F0EDE7" }}>
      <div>
        <div style={{ fontSize: "0.88rem", fontWeight: 500, color: "#0D1117" }}>{label}</div>
        {desc && <div style={{ fontSize: "0.78rem", color: "#9E9590", marginTop: "1px" }}>{desc}</div>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className="relative w-10 h-5 rounded-full transition-all flex-shrink-0 ml-6"
        style={{ background: checked ? "#0F2040" : "#D4C8BB", border: "none", cursor: "pointer" }}
      >
        <div
          className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
          style={{ background: "white", left: checked ? "calc(100% - 18px)" : "2px", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
        />
      </button>
    </div>
  );
}

const savedDocs = [
  { name: "Rental_Agreement_Mumbai_2024.pdf", size: "1.2 MB", date: "Apr 18" },
  { name: "Legal_Notice_from_Bank.pdf", size: "340 KB", date: "Apr 12" },
  { name: "Employment_Contract.pdf", size: "840 KB", date: "Mar 30" },
];

export default function Settings() {
  const [selectedLang, setSelectedLang] = useState("en");
  const [selectedState, setSelectedState] = useState("Maharashtra");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    reminders: true,
    updates: true,
    legal: false,
  });
  const [privacy, setPrivacy] = useState({
    saveHistory: true,
    shareAnalytics: false,
    locationAccess: true,
  });
  const [showHistory, setShowHistory] = useState(true);

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="font-playfair mb-1" style={{ fontSize: "1.6rem", fontWeight: 600, color: "#0D1117", letterSpacing: "-0.02em" }}>
          Settings
        </h1>
        <p style={{ fontSize: "0.86rem", color: "#9E9590" }}>
          Manage your language, location, privacy, and account preferences.
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile */}
        <div>
          <SectionHeader title="Profile" desc="Your account information" />
          <div className="lw-card p-5">
            <div className="flex items-center gap-4 mb-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "#0F2040" }}
              >
                <span className="font-playfair" style={{ fontSize: "1.4rem", fontWeight: 700, color: "#C4974A" }}>A</span>
              </div>
              <div>
                <div style={{ fontSize: "1rem", fontWeight: 600, color: "#0D1117" }}>Arjun Sharma</div>
                <div style={{ fontSize: "0.84rem", color: "#9E9590" }}>arjun.sharma@example.com</div>
                <div
                  className="inline-block mt-1 px-2 py-0.5 rounded"
                  style={{ fontSize: "0.72rem", background: "#F0EDE7", color: "#6B6560", border: "1px solid #E2D9CC" }}
                >
                  Free plan
                </div>
              </div>
              <button
                className="ml-auto lw-btn-secondary"
                style={{ padding: "7px 14px", fontSize: "0.82rem" }}
              >
                Edit profile
              </button>
            </div>
          </div>
        </div>

        {/* Language preferences */}
        <div>
          <SectionHeader title="Language" desc="Choose the language LawWise responds in" />
          <div className="lw-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Globe size={15} style={{ color: "#2A6B7C" }} />
              <span style={{ fontSize: "0.84rem", fontWeight: 600, color: "#0D1117" }}>Interface language</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {languages.map(({ code, label, native }) => (
                <button
                  key={code}
                  onClick={() => setSelectedLang(code)}
                  className="p-3 rounded-xl text-left transition-all relative"
                  style={{
                    background: selectedLang === code ? "#0F2040" : "white",
                    border: selectedLang === code ? "1.5px solid #0F2040" : "1.5px solid #E2D9CC",
                    cursor: "pointer",
                  }}
                >
                  {selectedLang === code && (
                    <Check size={12} className="absolute top-2 right-2" style={{ color: "#C4974A" }} />
                  )}
                  <div style={{ fontSize: "0.9rem", fontWeight: 600, color: selectedLang === code ? "white" : "#0D1117", marginBottom: "1px" }}>
                    {native}
                  </div>
                  <div style={{ fontSize: "0.74rem", color: selectedLang === code ? "rgba(255,255,255,0.5)" : "#9E9590" }}>
                    {label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <SectionHeader title="Location" desc="Affects state-specific legal guidance and nearby services" />
          <div className="lw-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={15} style={{ color: "#2A6B7C" }} />
              <span style={{ fontSize: "0.84rem", fontWeight: 600, color: "#0D1117" }}>Your state</span>
            </div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg outline-none"
              style={{ background: "white", border: "1.5px solid #E2D9CC", fontSize: "0.9rem", color: "#0D1117", cursor: "pointer" }}
            >
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <p style={{ fontSize: "0.76rem", color: "#9E9590", marginTop: "8px" }}>
              State-specific rent control, consumer, and labour laws differ. This helps LawWise give you relevant guidance.
            </p>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <SectionHeader title="Notifications" desc="Control when and how LawWise alerts you" />
          <div className="lw-card p-5">
            <ToggleRow
              label="Case reminders"
              desc="Upcoming deadlines and action items from your timeline"
              checked={notifications.reminders}
              onChange={(v) => setNotifications({ ...notifications, reminders: v })}
            />
            <ToggleRow
              label="Platform updates"
              desc="New features and improvements to LawWise"
              checked={notifications.updates}
              onChange={(v) => setNotifications({ ...notifications, updates: v })}
            />
            <ToggleRow
              label="Legal news alerts"
              desc="Relevant Supreme Court judgements and legal updates"
              checked={notifications.legal}
              onChange={(v) => setNotifications({ ...notifications, legal: v })}
            />
          </div>
        </div>

        {/* Privacy */}
        <div>
          <SectionHeader title="Privacy & Data" desc="Control how your data is used" />
          <div className="lw-card p-5">
            <div
              className="flex items-start gap-2 p-3 rounded-lg mb-4"
              style={{ background: "#F0F4F8", border: "1px solid #C8DDE4" }}
            >
              <Shield size={13} style={{ color: "#2A6B7C", flexShrink: 0, marginTop: "2px" }} />
              <p style={{ fontSize: "0.78rem", color: "#4A6A7A", lineHeight: 1.6 }}>
                LawWise stores your queries and documents only to personalise your experience. We do not share identifiable information with third parties. All documents are encrypted at rest.
              </p>
            </div>
            <ToggleRow
              label="Save conversation history"
              desc="Required for timeline and follow-up features"
              checked={privacy.saveHistory}
              onChange={(v) => setPrivacy({ ...privacy, saveHistory: v })}
            />
            <ToggleRow
              label="Share anonymous analytics"
              desc="Helps us improve LawWise — no personal data included"
              checked={privacy.shareAnalytics}
              onChange={(v) => setPrivacy({ ...privacy, shareAnalytics: v })}
            />
            <ToggleRow
              label="Location access"
              desc="Used to find nearby lawyers, courts, and legal aid"
              checked={privacy.locationAccess}
              onChange={(v) => setPrivacy({ ...privacy, locationAccess: v })}
            />
          </div>
        </div>

        {/* Saved documents */}
        <div>
          <SectionHeader title="Saved Documents" desc="Documents you've uploaded for analysis" />
          <div className="lw-card overflow-hidden">
            {savedDocs.map((doc, i) => (
              <div
                key={doc.name}
                className="flex items-center gap-3 px-5 py-3.5"
                style={{ borderBottom: i < savedDocs.length - 1 ? "1px solid #F0EDE7" : "none" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "#F0F4F8", border: "1px solid #C8DDE4" }}
                >
                  <FileText size={13} style={{ color: "#2A6B7C" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    style={{ fontSize: "0.84rem", fontWeight: 500, color: "#0D1117", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  >
                    {doc.name}
                  </div>
                  <div style={{ fontSize: "0.74rem", color: "#9E9590" }}>{doc.size} · Uploaded {doc.date}</div>
                </div>
                <button
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#9E9590" }}
                  className="hover:text-[#C0392B] transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <div className="px-5 py-3" style={{ borderTop: "1px solid #F0EDE7" }}>
              <button
                style={{ fontSize: "0.82rem", color: "#C0392B", fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}
              >
                Delete all saved documents
              </button>
            </div>
          </div>
        </div>

        {/* Memory & History */}
        <div>
          <SectionHeader title="Memory & History" desc="Manage your conversation and case history" />
          <div className="lw-card p-5">
            <ToggleRow
              label="Show conversation history"
              desc="Display past questions and answers in Ask LawWise"
              checked={showHistory}
              onChange={setShowHistory}
            />
            <div className="pt-3">
              <button
                className="flex items-center gap-2"
                style={{ fontSize: "0.84rem", color: "#C0392B", fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}
              >
                <Trash2 size={13} />
                Clear all conversation history
              </button>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div>
          <SectionHeader title="Appearance" />
          <div className="lw-card p-5">
            <ToggleRow
              label="Dark mode"
              desc="Experimental — some screens may look different"
              checked={darkMode}
              onChange={setDarkMode}
            />
          </div>
        </div>

        {/* Danger zone */}
        <div>
          <SectionHeader title="Account" />
          <div className="lw-card p-5 flex items-center justify-between">
            <div>
              <div style={{ fontSize: "0.88rem", fontWeight: 500, color: "#C0392B" }}>Delete account</div>
              <div style={{ fontSize: "0.78rem", color: "#9E9590", marginTop: "2px" }}>Permanently delete your account and all data. This cannot be undone.</div>
            </div>
            <button
              style={{ fontSize: "0.82rem", color: "#C0392B", fontWeight: 600, background: "#FFF0EE", border: "1px solid #FACFC9", padding: "7px 14px", borderRadius: "7px", cursor: "pointer", flexShrink: 0, marginLeft: "16px" }}
            >
              Delete account
            </button>
          </div>
        </div>

        <div style={{ height: "32px" }} />
      </div>
    </div>
  );
}
