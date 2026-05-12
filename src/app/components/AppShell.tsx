import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import {
  Scale,
  MessageSquare,
  FileText,
  MapPin,
  Clock,
  AlertTriangle,
  Settings,
  Search,
  Globe,
  ChevronDown,
  Bell,
  Phone,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { path: "/app", label: "Ask LawWise", icon: MessageSquare, exact: true },
  { path: "/app/documents", label: "Document Analysis", icon: FileText },
  { path: "/app/find-help", label: "Find Help", icon: MapPin },
  { path: "/app/timeline", label: "My Timeline", icon: Clock },
  { path: "/app/emergency", label: "Emergency", icon: AlertTriangle, danger: true },
  { path: "/app/settings", label: "Settings", icon: Settings },
];

const languages = ["English", "हिन्दी", "தமிழ்", "తెలుగు", "ಕನ್ನಡ"];

export default function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");
  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#FAF8F4", fontFamily: "Inter, sans-serif" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-40 flex flex-col transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ width: "228px", background: "#0F2040", flexShrink: 0 }}
      >
        {/* Logo */}
        <div
          className="flex items-center justify-between px-5 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              <Scale size={15} color="white" strokeWidth={1.8} />
            </div>
            <span className="font-playfair" style={{ color: "white", fontSize: "1.1rem", fontWeight: 600, letterSpacing: "-0.01em" }}>
              LawWise
            </span>
          </div>
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Location pill */}
        <div className="px-4 py-3">
          <button
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg"
            style={{ background: "rgba(255,255,255,0.05)", border: "none", cursor: "pointer" }}
          >
            <MapPin size={12} style={{ color: "rgba(196,151,74,0.8)" }} />
            <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>Maharashtra · Mumbai</span>
            <ChevronDown size={10} style={{ color: "rgba(255,255,255,0.3)", marginLeft: "auto" }} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <div
            style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.25)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "8px 10px 6px" }}
          >
            Navigation
          </div>
          {navItems.map(({ path, label, icon: Icon, exact, danger }) => {
            const active = isActive({ path, label, icon: Icon, exact });
            return (
              <button
                key={path}
                onClick={() => { navigate(path); setSidebarOpen(false); }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg mb-0.5 transition-all"
                style={{
                  background: active ? (danger ? "rgba(192,57,43,0.2)" : "rgba(255,255,255,0.1)") : "transparent",
                  border: active ? (danger ? "1px solid rgba(192,57,43,0.3)" : "1px solid rgba(255,255,255,0.08)") : "1px solid transparent",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <Icon
                  size={15}
                  style={{
                    color: active
                      ? (danger ? "#F08070" : "white")
                      : danger
                        ? "rgba(240,128,112,0.7)"
                        : "rgba(255,255,255,0.45)",
                    flexShrink: 0,
                  }}
                  strokeWidth={active ? 2 : 1.7}
                />
                <span
                  style={{
                    fontSize: "0.86rem",
                    fontWeight: active ? 600 : 400,
                    color: active
                      ? (danger ? "#F08070" : "white")
                      : danger
                        ? "rgba(240,128,112,0.7)"
                        : "rgba(255,255,255,0.55)",
                  }}
                >
                  {label}
                </span>
                {label === "Emergency" && (
                  <div
                    className="ml-auto w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: "#F08070" }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Emergency quick button */}
        <div className="px-4 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button
            onClick={() => navigate("/app/emergency")}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-opacity hover:opacity-90"
            style={{ background: "rgba(192,57,43,0.85)", border: "none", cursor: "pointer" }}
          >
            <Phone size={14} color="white" />
            <span style={{ fontSize: "0.83rem", color: "white", fontWeight: 600 }}>Emergency Help</span>
          </button>
        </div>

        {/* User */}
        <div
          className="px-4 pb-4 flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/app/settings")}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(196,151,74,0.2)", border: "1px solid rgba(196,151,74,0.3)" }}
          >
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#C4974A" }}>A</span>
          </div>
          <div className="flex-1 min-w-0">
            <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "rgba(255,255,255,0.8)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Arjun Sharma
            </div>
            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>Free plan</div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header
          className="flex items-center gap-4 px-5 py-3 flex-shrink-0"
          style={{
            background: "rgba(250,248,244,0.95)",
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid #E2D9CC",
            height: "56px",
          }}
        >
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#6B6560" }}
          >
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md relative hidden sm:block">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9E9590" }} />
            <input
              type="text"
              placeholder="Search legal topics, acts, or past questions…"
              className="w-full pl-9 pr-4 py-2 rounded-lg outline-none"
              style={{
                background: "white",
                border: "1px solid #E2D9CC",
                fontSize: "0.84rem",
                color: "#0D1117",
              }}
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Language selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                style={{
                  background: "white",
                  border: "1px solid #E2D9CC",
                  fontSize: "0.82rem",
                  color: "#6B6560",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                <Globe size={13} />
                <span className="hidden sm:inline">{selectedLang}</span>
                <ChevronDown size={11} />
              </button>
              {langOpen && (
                <div
                  className="absolute right-0 top-full mt-1 rounded-lg py-1 z-50 min-w-[140px]"
                  style={{ background: "white", border: "1px solid #E2D9CC", boxShadow: "0 4px 16px rgba(15,32,64,0.12)" }}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setSelectedLang(lang); setLangOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-[#F5F0E8]"
                      style={{ fontSize: "0.84rem", color: selectedLang === lang ? "#0F2040" : "#6B6560", fontWeight: selectedLang === lang ? 600 : 400, background: "none", border: "none", cursor: "pointer" }}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            <button
              className="relative p-2 rounded-lg"
              style={{ background: "white", border: "1px solid #E2D9CC", cursor: "pointer" }}
            >
              <Bell size={15} style={{ color: "#6B6560" }} />
              <div
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                style={{ background: "#C4974A" }}
              />
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
                style={{ background: "white", border: "1px solid #E2D9CC", cursor: "pointer" }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: "#0F2040" }}
                >
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#C4974A" }}>A</span>
                </div>
                <ChevronDown size={11} style={{ color: "#9E9590" }} />
              </button>
              {profileOpen && (
                <div
                  className="absolute right-0 top-full mt-1 rounded-lg py-1 z-50 w-[180px]"
                  style={{ background: "white", border: "1px solid #E2D9CC", boxShadow: "0 4px 16px rgba(15,32,64,0.12)" }}
                >
                  <div className="px-4 py-2.5" style={{ borderBottom: "1px solid #F0EDE7" }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#0D1117" }}>Arjun Sharma</div>
                    <div style={{ fontSize: "0.75rem", color: "#9E9590" }}>arjun@example.com</div>
                  </div>
                  {[
                    { icon: User, label: "Profile" },
                    { icon: Settings, label: "Settings" },
                    { icon: LogOut, label: "Sign out" },
                  ].map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      onClick={() => {
                        setProfileOpen(false);
                        if (label === "Sign out") navigate("/login");
                        if (label === "Settings") navigate("/app/settings");
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-[#F5F0E8]"
                      style={{ fontSize: "0.84rem", color: label === "Sign out" ? "#C0392B" : "#6B6560", background: "none", border: "none", cursor: "pointer", fontWeight: 400 }}
                    >
                      <Icon size={13} />
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
