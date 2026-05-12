import { useState } from "react";
import { useNavigate } from "react-router";
import { Scale, ArrowRight, Globe, MapPin, Mail, Eye, EyeOff, User } from "lucide-react";

const languages = ["English", "हिन्दी", "தமிழ்", "తెలుగు", "ಕನ್ನಡ", "বাংলা", "मराठी", "ਪੰਜਾਬੀ"];
const states = ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Uttar Pradesh", "West Bengal", "Gujarat", "Rajasthan"];

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [step, setStep] = useState<"auth" | "prefs">("auth");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");
  const [selectedState, setSelectedState] = useState("Maharashtra");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleContinue = () => {
    if (mode === "signup" && step === "auth") {
      setStep("prefs");
    } else {
      navigate("/app");
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "#FAF8F4", fontFamily: "Inter, sans-serif" }}
    >
      {/* Left panel - Brand */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 w-[44%] relative overflow-hidden"
        style={{ background: "#0F2040" }}
      >
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 70% 80%, rgba(42,107,124,0.4) 0%, transparent 60%),
              radial-gradient(circle at 20% 20%, rgba(196,151,74,0.2) 0%, transparent 50%)`,
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-16">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.12)" }}
            >
              <Scale size={18} color="white" strokeWidth={1.8} />
            </div>
            <span
              className="font-playfair"
              style={{ color: "white", fontSize: "1.3rem", fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              LawWise
            </span>
          </div>

          <h2
            className="font-playfair mb-5"
            style={{ fontSize: "2rem", fontWeight: 600, color: "white", lineHeight: 1.25, letterSpacing: "-0.02em" }}
          >
            Your legal rights
            <br />
            <em style={{ fontStyle: "italic", color: "rgba(196,151,74,0.9)" }}>clearly explained.</em>
          </h2>

          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: "320px" }}>
            Save your case timeline, upload documents securely, and access your legal history across devices.
          </p>
        </div>

        {/* Testimonial-style card */}
        <div
          className="relative z-10 p-5 rounded-xl"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div className="flex items-start gap-3 mb-4">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
              style={{ background: "rgba(196,151,74,0.2)" }}
            >
              🧑‍💼
            </div>
            <div>
              <div style={{ fontSize: "0.82rem", color: "white", lineHeight: 1.55 }}>
                "LawWise helped me understand my rights when my landlord tried to evict me illegally. The citations were spot-on."
              </div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: "6px" }}>
                Priya M., Bengaluru
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{ color: "#C4974A", fontSize: "0.75rem" }}>★</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - Auth form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "#0F2040" }}
            >
              <Scale size={15} color="white" />
            </div>
            <span className="font-playfair" style={{ fontSize: "1.1rem", fontWeight: 600, color: "#0F2040" }}>
              LawWise
            </span>
          </div>

          {step === "auth" ? (
            <>
              {/* Tab switcher */}
              <div
                className="flex rounded-lg p-1 mb-8"
                style={{ background: "#F0EDE7", border: "1px solid #E2D9CC" }}
              >
                {(["signin", "signup"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className="flex-1 py-2 rounded-md transition-all"
                    style={{
                      fontSize: "0.88rem",
                      fontWeight: 500,
                      background: mode === m ? "white" : "transparent",
                      color: mode === m ? "#0F2040" : "#9E9590",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: mode === m ? "0 1px 3px rgba(15,32,64,0.08)" : "none",
                    }}
                  >
                    {m === "signin" ? "Sign in" : "Create account"}
                  </button>
                ))}
              </div>

              <h1
                className="font-playfair mb-2"
                style={{ fontSize: "1.65rem", fontWeight: 600, color: "#0D1117", letterSpacing: "-0.02em" }}
              >
                {mode === "signin" ? "Welcome back" : "Join LawWise"}
              </h1>
              <p style={{ fontSize: "0.86rem", color: "#9E9590", marginBottom: "28px", lineHeight: 1.55 }}>
                {mode === "signin"
                  ? "Sign in to access your case history, documents, and saved guidance."
                  : "Create an account to save your timeline, documents, and get personalised guidance."}
              </p>

              {/* Google sign-in */}
              <button
                className="w-full flex items-center justify-center gap-3 py-3 rounded-lg mb-4 transition-all"
                style={{
                  background: "white",
                  border: "1.5px solid #E2D9CC",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: "#0D1117",
                  cursor: "pointer",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div style={{ flex: 1, height: "1px", background: "#E2D9CC" }} />
                <span style={{ fontSize: "0.78rem", color: "#9E9590" }}>or with email</span>
                <div style={{ flex: 1, height: "1px", background: "#E2D9CC" }} />
              </div>

              {/* Email & password */}
              <div className="space-y-3 mb-5">
                {mode === "signup" && (
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9E9590" }} />
                    <input
                      type="text"
                      placeholder="Full name"
                      className="w-full pl-9 pr-4 py-3 rounded-lg outline-none transition-all"
                      style={{
                        background: "white",
                        border: "1.5px solid #E2D9CC",
                        fontSize: "0.9rem",
                        color: "#0D1117",
                      }}
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9E9590" }} />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-lg outline-none transition-all"
                    style={{
                      background: "white",
                      border: "1.5px solid #E2D9CC",
                      fontSize: "0.9rem",
                      color: "#0D1117",
                    }}
                  />
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg outline-none"
                    style={{
                      background: "white",
                      border: "1.5px solid #E2D9CC",
                      fontSize: "0.9rem",
                      color: "#0D1117",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#9E9590" }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="w-full lw-btn-primary flex items-center justify-center gap-2 mb-4"
                style={{ padding: "12px", fontSize: "0.93rem" }}
              >
                {mode === "signin" ? "Sign in" : "Continue"}
                <ArrowRight size={15} />
              </button>

              <div className="text-center">
                <button
                  onClick={() => navigate("/app")}
                  style={{ fontSize: "0.84rem", color: "#9E9590", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textDecorationStyle: "dotted" }}
                >
                  Continue as guest (no account needed)
                </button>
              </div>
            </>
          ) : (
            /* Preferences step */
            <>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mb-6"
                style={{ background: "#EEF7F2", border: "1px solid #B8DECA" }}
              >
                <span style={{ fontSize: "0.72rem", color: "#1E6B47", fontWeight: 700 }}>2/2</span>
              </div>
              <h1
                className="font-playfair mb-2"
                style={{ fontSize: "1.65rem", fontWeight: 600, color: "#0D1117", letterSpacing: "-0.02em" }}
              >
                Quick preferences
              </h1>
              <p style={{ fontSize: "0.86rem", color: "#9E9590", marginBottom: "28px" }}>
                Helps LawWise give you more relevant, state-specific guidance.
              </p>

              {/* Language */}
              <div className="mb-5">
                <label className="flex items-center gap-2 mb-2.5" style={{ fontSize: "0.84rem", fontWeight: 600, color: "#0D1117" }}>
                  <Globe size={14} style={{ color: "#2A6B7C" }} />
                  Preferred language
                </label>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLang(lang)}
                      className="px-3 py-1.5 rounded-lg transition-all"
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: selectedLang === lang ? 600 : 400,
                        background: selectedLang === lang ? "#0F2040" : "white",
                        color: selectedLang === lang ? "white" : "#6B6560",
                        border: selectedLang === lang ? "1.5px solid #0F2040" : "1.5px solid #E2D9CC",
                        cursor: "pointer",
                      }}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* State */}
              <div className="mb-8">
                <label className="flex items-center gap-2 mb-2.5" style={{ fontSize: "0.84rem", fontWeight: 600, color: "#0D1117" }}>
                  <MapPin size={14} style={{ color: "#2A6B7C" }} />
                  Your state
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg outline-none"
                  style={{
                    background: "white",
                    border: "1.5px solid #E2D9CC",
                    fontSize: "0.9rem",
                    color: "#0D1117",
                    cursor: "pointer",
                  }}
                >
                  {states.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => navigate("/app")}
                className="w-full lw-btn-primary flex items-center justify-center gap-2"
                style={{ padding: "12px", fontSize: "0.93rem" }}
              >
                Open LawWise
                <ArrowRight size={15} />
              </button>
            </>
          )}

          <p
            className="text-center mt-8"
            style={{ fontSize: "0.75rem", color: "#9E9590", lineHeight: 1.6 }}
          >
            LawWise is for informational purposes only and does not constitute legal advice.
            <br />
            Not a substitute for a qualified advocate.
          </p>
        </div>
      </div>
    </div>
  );
}
