import { useState } from "react";
import {
  Search,
  MapPin,
  Phone,
  Clock,
  Star,
  ExternalLink,
  Scale,
  Building2,
  Shield,
  Users,
  Filter,
  Navigation,
  CheckCircle2,
} from "lucide-react";

type CategoryType = "all" | "lawyer" | "court" | "police" | "legal-aid";

const categories: { key: CategoryType; label: string; icon: typeof Scale }[] = [
  { key: "all", label: "All", icon: Filter },
  { key: "lawyer", label: "Lawyers", icon: Scale },
  { key: "court", label: "Courts", icon: Building2 },
  { key: "police", label: "Police Stations", icon: Shield },
  { key: "legal-aid", label: "Legal Aid", icon: Users },
];

const caseTypes = ["Tenant Dispute", "Employment", "Consumer", "Family", "Criminal", "Property", "RTI", "Domestic Violence"];

const results = [
  {
    id: 1,
    type: "lawyer",
    name: "Adv. Sunita Rao",
    specialisation: "Tenant & Property Rights",
    address: "Chambers, 4th Floor, Bombay HC Complex, Fort, Mumbai",
    distance: "1.2 km",
    phone: "+91 98204 33210",
    hours: "Mon–Sat, 10am–6pm",
    rating: 4.8,
    reviews: 42,
    legalAid: false,
    verified: true,
    tags: ["Property", "Tenant Rights", "Civil"],
  },
  {
    id: 2,
    type: "legal-aid",
    name: "Maharashtra State Legal Services Authority",
    specialisation: "Free legal aid for eligible citizens",
    address: "Bombay High Court Campus, Mumbai 400001",
    distance: "1.4 km",
    phone: "1800-12345-678",
    hours: "Mon–Fri, 10am–5pm",
    rating: null,
    reviews: null,
    legalAid: true,
    verified: true,
    tags: ["Free Aid", "All matters", "Hindi/Marathi"],
  },
  {
    id: 3,
    type: "court",
    name: "Bandra (West) Civil Court",
    specialisation: "Small causes, civil disputes, rent matters",
    address: "Court Complex, Linking Rd, Bandra (W), Mumbai",
    distance: "2.1 km",
    phone: "+91 22 2655 0000",
    hours: "Mon–Fri, 10:30am–4:30pm",
    rating: null,
    reviews: null,
    legalAid: false,
    verified: true,
    tags: ["Civil", "Rent Control", "Family"],
  },
  {
    id: 4,
    type: "police",
    name: "Bandra (West) Police Station",
    specialisation: "First Information Reports, public order",
    address: "Turner Rd, Bandra (W), Mumbai 400050",
    distance: "2.4 km",
    phone: "022-26550151",
    hours: "24 × 7",
    rating: null,
    reviews: null,
    legalAid: false,
    verified: true,
    tags: ["FIR", "Criminal", "Emergency"],
  },
  {
    id: 5,
    type: "lawyer",
    name: "Adv. Rahul Mehra & Associates",
    specialisation: "Consumer, Employment, Corporate",
    address: "102 Nariman Point, Mumbai 400021",
    distance: "3.0 km",
    phone: "+91 98201 44870",
    hours: "Mon–Sat, 9am–7pm",
    rating: 4.6,
    reviews: 28,
    legalAid: false,
    verified: true,
    tags: ["Consumer", "Employment", "Corporate"],
  },
];

const typeConfig = {
  lawyer: { color: "#0F2040", bg: "#EEF2FF", icon: Scale },
  court: { color: "#2A6B7C", bg: "#F0F7F9", icon: Building2 },
  police: { color: "#1E6B47", bg: "#EEF7F2", icon: Shield },
  "legal-aid": { color: "#C4974A", bg: "#FFF8E8", icon: Users },
};

export default function FindHelp() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>("all");
  const [selectedResult, setSelectedResult] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = results.filter((r) => {
    if (activeCategory !== "all" && r.type !== activeCategory) return false;
    if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase()) && !r.specialisation.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const selected = results.find((r) => r.id === selectedResult);

  return (
    <div className="flex h-full">
      {/* Left: Filters + List */}
      <div
        className="flex flex-col w-[380px] flex-shrink-0 overflow-hidden"
        style={{ borderRight: "1px solid #E2D9CC" }}
      >
        {/* Search & filters */}
        <div className="p-4 space-y-3 flex-shrink-0" style={{ borderBottom: "1px solid #E2D9CC" }}>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9E9590" }} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, type, or case…"
              className="w-full pl-9 pr-4 py-2.5 rounded-lg outline-none"
              style={{ background: "white", border: "1px solid #E2D9CC", fontSize: "0.85rem", color: "#0D1117" }}
            />
          </div>

          {/* Location indicator */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: "#F5F0E8", border: "1px solid #EDE5D8" }}
          >
            <Navigation size={12} style={{ color: "#C4974A" }} />
            <span style={{ fontSize: "0.79rem", color: "#6B6560" }}>Showing results near <strong style={{ color: "#0D1117" }}>Bandra (W), Mumbai</strong></span>
          </div>

          {/* Case type chips */}
          <div>
            <p style={{ fontSize: "0.72rem", color: "#9E9590", marginBottom: "6px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Filter by case type
            </p>
            <div className="flex flex-wrap gap-1.5">
              {caseTypes.map((ct) => (
                <button
                  key={ct}
                  className="px-2.5 py-1 rounded-lg transition-all"
                  style={{ fontSize: "0.76rem", background: "#F0EDE7", color: "#6B6560", border: "1px solid #E2D9CC", cursor: "pointer" }}
                >
                  {ct}
                </button>
              ))}
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-1 overflow-x-auto">
            {categories.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex-shrink-0"
                style={{
                  fontSize: "0.78rem",
                  fontWeight: activeCategory === key ? 600 : 400,
                  background: activeCategory === key ? "#0F2040" : "white",
                  color: activeCategory === key ? "white" : "#6B6560",
                  border: activeCategory === key ? "1px solid #0F2040" : "1px solid #E2D9CC",
                  cursor: "pointer",
                }}
              >
                <Icon size={11} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Results list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <p style={{ fontSize: "0.72rem", color: "#9E9590", padding: "4px 8px", fontWeight: 500 }}>
            {filtered.length} results
          </p>
          {filtered.map((result) => {
            const config = typeConfig[result.type as keyof typeof typeConfig];
            const Icon = config.icon;
            const isSelected = selectedResult === result.id;
            return (
              <button
                key={result.id}
                onClick={() => setSelectedResult(result.id)}
                className="w-full p-3.5 rounded-xl text-left transition-all"
                style={{
                  background: isSelected ? "#0F2040" : "white",
                  border: isSelected ? "1px solid #0F2040" : "1px solid #E2D9CC",
                  cursor: "pointer",
                  boxShadow: isSelected ? "0 2px 8px rgba(15,32,64,0.18)" : "none",
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: isSelected ? "rgba(255,255,255,0.12)" : config.bg }}
                  >
                    <Icon size={15} style={{ color: isSelected ? "white" : config.color }} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div
                        style={{
                          fontSize: "0.86rem",
                          fontWeight: 600,
                          color: isSelected ? "white" : "#0D1117",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {result.name}
                      </div>
                      <span style={{ fontSize: "0.72rem", color: isSelected ? "rgba(255,255,255,0.5)" : "#9E9590", flexShrink: 0 }}>
                        {result.distance}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.78rem", color: isSelected ? "rgba(255,255,255,0.55)" : "#6B6560", marginBottom: "4px" }}>
                      {result.specialisation}
                    </div>
                    <div className="flex items-center gap-2">
                      {result.legalAid && (
                        <span
                          className="px-1.5 py-0.5 rounded text-xs"
                          style={{ fontSize: "0.68rem", fontWeight: 700, background: isSelected ? "rgba(196,151,74,0.2)" : "#FFF8E8", color: isSelected ? "#C4974A" : "#B8780A" }}
                        >
                          FREE AID
                        </span>
                      )}
                      {result.rating && (
                        <div className="flex items-center gap-1">
                          <Star size={10} fill="#C4974A" style={{ color: "#C4974A" }} />
                          <span style={{ fontSize: "0.72rem", color: isSelected ? "rgba(255,255,255,0.55)" : "#6B6560" }}>
                            {result.rating}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Map + Detail */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Map placeholder */}
        <div
          className="relative flex-shrink-0"
          style={{ height: "260px", background: "#E8EEF2", overflow: "hidden" }}
        >
          {/* Map grid pattern */}
          <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.35 }}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#9E9590" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          {/* Road lines */}
          <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
            <line x1="0" y1="130" x2="100%" y2="130" stroke="#C8D8E0" strokeWidth="4" />
            <line x1="0" y1="60" x2="100%" y2="200" stroke="#C8D8E0" strokeWidth="3" />
            <line x1="200" y1="0" x2="200" y2="100%" stroke="#C8D8E0" strokeWidth="3" />
            <line x1="500" y1="0" x2="450" y2="100%" stroke="#C8D8E0" strokeWidth="2" />
          </svg>
          {/* Map pins */}
          {filtered.slice(0, 5).map((r, i) => {
            const positions = [
              { x: "30%", y: "45%" },
              { x: "45%", y: "60%" },
              { x: "55%", y: "35%" },
              { x: "65%", y: "55%" },
              { x: "40%", y: "70%" },
            ];
            const pos = positions[i];
            const isSelected = r.id === selectedResult;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedResult(r.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-all"
                style={{ left: pos.x, top: pos.y, background: "none", border: "none", cursor: "pointer", zIndex: isSelected ? 10 : 5 }}
              >
                <div
                  className="flex items-center justify-center rounded-full shadow-md"
                  style={{
                    width: isSelected ? "32px" : "26px",
                    height: isSelected ? "32px" : "26px",
                    background: isSelected ? "#0F2040" : "white",
                    border: isSelected ? "2.5px solid white" : "1.5px solid #9E9590",
                    transition: "all 0.15s",
                  }}
                >
                  {(() => {
                    const config = typeConfig[r.type as keyof typeof typeConfig];
                    const Icon = config.icon;
                    return <Icon size={isSelected ? 14 : 11} style={{ color: isSelected ? "white" : config.color }} />;
                  })()}
                </div>
                {isSelected && (
                  <div
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded"
                    style={{ background: "#0F2040", fontSize: "0.66rem", color: "white", fontWeight: 600 }}
                  >
                    {r.name.split(" ").slice(0, 2).join(" ")}
                  </div>
                )}
              </button>
            );
          })}

          <div
            className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg"
            style={{ background: "rgba(255,255,255,0.9)", fontSize: "0.72rem", color: "#6B6560", border: "1px solid rgba(255,255,255,0.6)" }}
          >
            📍 Bandra West, Mumbai
          </div>
        </div>

        {/* Detail panel */}
        {selected ? (
          <div className="flex-1 overflow-y-auto p-6">
            {(() => {
              const config = typeConfig[selected.type as keyof typeof typeConfig];
              const Icon = config.icon;
              return (
                <div className="max-w-2xl">
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: config.bg, border: `1px solid ${config.color}22` }}
                    >
                      <Icon size={20} style={{ color: config.color }} strokeWidth={1.8} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h2 className="font-playfair" style={{ fontSize: "1.2rem", fontWeight: 600, color: "#0D1117" }}>
                              {selected.name}
                            </h2>
                            {selected.verified && (
                              <CheckCircle2 size={16} style={{ color: "#1E6B47" }} />
                            )}
                          </div>
                          <p style={{ fontSize: "0.85rem", color: "#6B6560" }}>{selected.specialisation}</p>
                        </div>
                        {selected.legalAid && (
                          <span
                            className="px-2.5 py-1 rounded-full flex-shrink-0"
                            style={{ fontSize: "0.75rem", fontWeight: 700, background: "#FFF8E8", color: "#B8780A", border: "1px solid #F0DFA8" }}
                          >
                            FREE LEGAL AID
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Info grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { icon: MapPin, label: "Address", value: selected.address },
                      { icon: Clock, label: "Hours", value: selected.hours },
                      { icon: Phone, label: "Contact", value: selected.phone },
                      { icon: Navigation, label: "Distance", value: `${selected.distance} from your location` },
                    ].map(({ icon: InfoIcon, label, value }) => (
                      <div key={label} className="lw-card p-3.5">
                        <div className="flex items-center gap-2 mb-1.5">
                          <InfoIcon size={13} style={{ color: "#9E9590" }} />
                          <span style={{ fontSize: "0.73rem", color: "#9E9590", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
                        </div>
                        <p style={{ fontSize: "0.84rem", color: "#0D1117", fontWeight: 500 }}>{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selected.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg"
                        style={{ fontSize: "0.78rem", background: "#F0EDE7", color: "#6B6560", border: "1px solid #E2D9CC" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Rating */}
                  {selected.rating && (
                    <div className="lw-card p-4 mb-5 flex items-center gap-3">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={14}
                            fill={s <= Math.floor(selected.rating!) ? "#C4974A" : "transparent"}
                            style={{ color: "#C4974A" }}
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#0D1117" }}>{selected.rating}</span>
                      <span style={{ fontSize: "0.82rem", color: "#9E9590" }}>({selected.reviews} reviews)</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      className="lw-btn-primary flex items-center gap-2"
                      style={{ flex: 1, justifyContent: "center" }}
                    >
                      <Phone size={14} />
                      Call Now
                    </button>
                    <button
                      className="lw-btn-secondary flex items-center gap-2"
                      style={{ flex: 1, justifyContent: "center" }}
                    >
                      <Navigation size={14} />
                      Get Directions
                    </button>
                    <button
                      className="px-4 py-2.5 rounded-lg flex items-center gap-2"
                      style={{ background: "#F5F0E8", border: "1px solid #EDE5D8", color: "#4A3820", cursor: "pointer", fontSize: "0.88rem", fontWeight: 500 }}
                    >
                      <ExternalLink size={14} />
                      Website
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p style={{ fontSize: "0.88rem", color: "#9E9590" }}>Select a result to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
