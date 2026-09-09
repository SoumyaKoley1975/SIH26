import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { MapView } from "@/components/Map";
import { Toaster, toast } from "sonner";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  CloudRain,
  Compass,
  Database,
  Droplets,
  FileDown,
  Filter,
  Flame,
  Gauge,
  GitBranch,
  Hospital,
  Layers3,
  LayoutDashboard,
  LifeBuoy,
  MapPinned,
  Menu,
  Mountain,
  Navigation,
  PanelLeftClose,
  PanelLeftOpen,
  Radio,
  RefreshCw,
  Search,
  Settings2,
  Shield,
  SlidersHorizontal,
  Sparkles,
  Target,
  TreePine,
  Users,
  Waves,
  X,
  Zap,
} from "lucide-react";
import {
  alerts,
  defaultWeights,
  habitations,
  layerNames,
  priorityTone,
  sites,
  sources,
  weightLabels,
  type Habitation,
  type Priority,
  type Site,
  type WeightKey,
} from "@/lib/demoData";
import { cn } from "@/lib/utils";

const formatNumber = (value: number) => new Intl.NumberFormat("en-IN").format(value);
const formatLakh = (value: number) => `${(value / 100000).toFixed(2)} Lakh`;
const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const navGroups = [
  {
    label: "Command center",
    items: [
      { id: "overview", label: "Overview", icon: LayoutDashboard },
      { id: "map", label: "Multi-hazard map", icon: MapPinned },
      { id: "risk", label: "Risk assessment", icon: Gauge },
    ],
  },
  {
    label: "Relocation planning",
    items: [
      { id: "sites", label: "Relocation site finder", icon: Target },
      { id: "capacity", label: "Carrying capacity", icon: Building2 },
      { id: "priority", label: "Relocation priority", icon: LifeBuoy },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { id: "analytics", label: "Analytics", icon: BarChart3 },
      { id: "alerts", label: "Alerts", icon: Bell },
      { id: "sources", label: "Data sources", icon: Database },
    ],
  },
];

function App() {
  const [activePage, setActivePage] = useState("overview");
  const [selectedHabitationId, setSelectedHabitationId] = useState("xyz-village");
  const [selectedSiteId, setSelectedSiteId] = useState("site-a");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("All districts");
  const [toastMessage, setToastMessage] = useState("");

  const selectedHabitation = habitations.find((habitation) => habitation.id === selectedHabitationId) ?? habitations[0];
  const selectedSite = sites.find((site) => site.id === selectedSiteId) ?? sites[0];

  const navigate = (page: string) => {
    setActivePage(page);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const announce = (message: string) => {
    setToastMessage(message);
    toast.success(message);
  };

  const handleSelectHabitation = (habitation: Habitation) => {
    setSelectedHabitationId(habitation.id);
    if (activePage === "overview" || activePage === "map") {
      announce(`${habitation.name} selected for assessment`);
    }
  };

  return (
    <div className="app-shell min-h-screen bg-[#08111f] text-slate-100">
      <Toaster theme="dark" position="bottom-right" />
      <aside className={cn("sidebar fixed inset-y-0 left-0 z-40 flex w-[276px] flex-col border-r border-white/[0.08] bg-[#0b1628] transition-transform duration-200 lg:translate-x-0", sidebarOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-[86px] items-center justify-between border-b border-white/[0.07] px-5">
          <button className="flex items-center gap-3 text-left" onClick={() => navigate("overview")} aria-label="Go to overview">
            <div className="brand-mark"><Shield size={20} strokeWidth={2.2} /></div>
            <div>
              <div className="font-display text-[18px] font-bold tracking-[0.18em] text-white">SURAKSHA<span className="text-cyan-300">SETU</span></div>
              <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">Decision support platform</div>
            </div>
          </button>
          <button className="icon-button lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><X size={18} /></button>
        </div>
        <div className="mx-4 mt-5 flex items-center justify-between rounded-lg border border-cyan-300/15 bg-cyan-300/[0.06] px-3 py-2.5">
          <div className="flex items-center gap-2.5"><span className="status-dot" /><span className="text-xs font-medium text-cyan-100">Demo environment</span></div>
          <span className="rounded bg-cyan-300/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-300">v0.9</span>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-6">
              <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">{group.label}</div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = activePage === item.id;
                  return <button key={item.id} onClick={() => navigate(item.id)} className={cn("nav-item group", active && "nav-item-active")}><Icon size={17} strokeWidth={active ? 2.1 : 1.8} /><span>{item.label}</span>{active && <ChevronRight size={14} className="ml-auto text-cyan-300" />}</button>;
                })}
              </div>
            </div>
          ))}
          <div className="mt-2 border-t border-white/[0.07] pt-5">
            <button onClick={() => navigate("settings")} className={cn("nav-item", activePage === "settings" && "nav-item-active")}><Settings2 size={17} /><span>System configuration</span></button>
          </div>
        </nav>
        <div className="border-t border-white/[0.07] p-4">
          <div className="mb-3 flex items-center gap-3 rounded-lg bg-white/[0.04] p-3">
            <div className="avatar">AD</div><div className="min-w-0"><div className="truncate text-xs font-semibold text-white">District Analyst</div><div className="truncate text-[10px] text-slate-500">Pauri Garhwal · Read / write</div></div><ChevronDown size={14} className="ml-auto shrink-0 text-slate-600" />
          </div>
          <div className="flex items-center gap-2 px-1 text-[10px] text-slate-600"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> All systems operational</div>
        </div>
      </aside>
      {sidebarOpen && <button className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close navigation overlay" />}
      <main className="min-h-screen lg:pl-[276px]">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-white/[0.07] bg-[#08111f]/90 px-4 backdrop-blur-xl sm:px-6 lg:px-9">
          <div className="flex items-center gap-3"><button className="icon-button lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu size={20} /></button><div><div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">State disaster management command</div><h1 className="mt-0.5 text-lg font-semibold tracking-tight text-white">{pageTitle(activePage)}</h1></div></div>
          <div className="flex items-center gap-2 sm:gap-4"><div className="hidden items-center gap-2 rounded-md border border-white/[0.08] bg-white/[0.035] px-3 py-2 sm:flex"><Radio size={14} className="text-emerald-400" /><span className="text-[11px] text-slate-400">Demo data · refreshed 09 Sep 2026, 23:14 IST</span></div><button onClick={() => announce("System status is healthy")} className="icon-button" aria-label="System health"><Activity size={17} /></button><button onClick={() => navigate("alerts")} className="relative icon-button" aria-label="View alerts"><Bell size={17} /><span className="notification-dot" /></button></div>
        </header>
        <div className="px-4 py-6 sm:px-6 lg:px-9 lg:py-8">
          {activePage === "overview" && <OverviewPage habitation={selectedHabitation} onSelectHabitation={handleSelectHabitation} onNavigate={navigate} onSiteSelect={(site) => { setSelectedSiteId(site.id); navigate("sites"); }} />}
          {activePage === "map" && <MapPage habitation={selectedHabitation} onSelectHabitation={handleSelectHabitation} onNavigate={navigate} />}
          {activePage === "risk" && <RiskPage habitation={selectedHabitation} onSelectHabitation={handleSelectHabitation} onNavigate={navigate} />}
          {activePage === "sites" && <SitesPage habitation={selectedHabitation} selectedSite={selectedSite} onSelectSite={setSelectedSiteId} onSelectHabitation={setSelectedHabitationId} onNavigate={navigate} announce={announce} />}
          {activePage === "capacity" && <CapacityPage habitation={selectedHabitation} site={selectedSite} onNavigate={navigate} announce={announce} />}
          {activePage === "priority" && <PriorityPage selectedHabitationId={selectedHabitation.id} onSelectHabitation={setSelectedHabitationId} onNavigate={navigate} />}
          {activePage === "analytics" && <AnalyticsPage district={district} setDistrict={setDistrict} />}
          {activePage === "alerts" && <AlertsPage onNavigate={navigate} />}
          {activePage === "sources" && <SourcesPage />}
          {activePage === "settings" && <SettingsPage announce={announce} />}
        </div>
        <footer className="border-t border-white/[0.07] px-4 py-5 sm:px-6 lg:px-9"><div className="flex flex-col justify-between gap-2 text-[10px] text-slate-600 sm:flex-row"><span>SURAKSHASETU · AI + GIS MULTI-HAZARD RISK & RELOCATION DECISION SUPPORT</span><span>All recommendations are model-identified and require authority validation.</span></div></footer>
      </main>
      {toastMessage && <span className="sr-only" role="status">{toastMessage}</span>}
    </div>
  );
}

function pageTitle(activePage: string) {
  const titles: Record<string, string> = { overview: "Overview dashboard", map: "Multi-hazard map", risk: "Habitation risk assessment", sites: "Relocation site finder", capacity: "Carrying capacity engine", priority: "Relocation priority", analytics: "Decision analytics", alerts: "Alert center", sources: "Data provenance", settings: "System configuration" };
  return titles[activePage] ?? "Overview dashboard";
}

function PageIntro({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="section-eyebrow">{eyebrow}</div><h2 className="mt-2 max-w-3xl font-display text-2xl font-semibold tracking-tight text-white sm:text-[30px]">{title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{description}</p></div>{action}</div>;
}

function SectionTitle({ icon: Icon, eyebrow, title, action }: { icon?: typeof Activity; eyebrow?: string; title: string; action?: ReactNode }) {
  return <div className="mb-4 flex items-center justify-between gap-3"><div className="flex items-center gap-3">{Icon && <div className="section-icon"><Icon size={16} /></div>}<div>{eyebrow && <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">{eyebrow}</div>}<h3 className="text-sm font-semibold text-white">{title}</h3></div></div>{action}</div>;
}

function DemoTag() { return <span className="demo-tag"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300" /> Demo data</span>; }

function RiskBadge({ risk, compact = false }: { risk: number; compact?: boolean }) {
  const cls = risk >= 80 ? "risk-critical" : risk >= 65 ? "risk-high" : risk >= 45 ? "risk-medium" : "risk-low";
  return <span className={cn("risk-badge", cls, compact && "px-2 py-0.5 text-[9px]")}><span className="h-1.5 w-1.5 rounded-full bg-current" />{risk >= 80 ? "Critical" : risk >= 65 ? "High" : risk >= 45 ? "Moderate" : "Low"} · {risk}</span>;
}

function StatCard({ label, value, sub, icon: Icon, accent, trend }: { label: string; value: string; sub: string; icon: typeof Activity; accent: string; trend?: "up" | "down" }) {
  return <div className="metric-card group"><div className="flex items-start justify-between"><div className={cn("metric-icon", accent)}><Icon size={17} /></div>{trend && <div className={cn("flex items-center gap-1 text-[10px] font-semibold", trend === "up" ? "text-rose-300" : "text-emerald-300")}>{trend === "up" ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{trend === "up" ? "needs action" : "capacity"}</div>}</div><div className="mt-4 text-2xl font-semibold tracking-tight text-white">{value}</div><div className="mt-1 text-xs font-medium text-slate-400">{label}</div><div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-600"><span className="h-1 w-1 rounded-full bg-slate-600" />{sub}</div></div>;
}

function MapPanel({ habitation, onSelectHabitation, compact = false }: { habitation: Habitation; onSelectHabitation: (habitation: Habitation) => void; compact?: boolean }) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [activeLayers, setActiveLayers] = useState<string[]>(["flood", "landslide", "multihazard"]);
  const [mapReady, setMapReady] = useState(false);
  const allLayers = compact ? layerNames.slice(0, 4) : layerNames;

  const initMarkers = (map: google.maps.Map) => {
    mapRef.current = map;
    setMapReady(true);
    if (!window.google?.maps) return;
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = habitations.map((item) => {
      const marker = new window.google.maps.Marker({ map, position: item.coordinates, title: item.name, label: { text: "●", color: item.id === habitation.id ? "#67e8f9" : item.risk >= 80 ? "#fb7185" : "#fbbf24", fontSize: "24px" } });
      marker.addListener("click", () => onSelectHabitation(item));
      return marker;
    });
  };

  useEffect(() => () => markersRef.current.forEach((marker) => marker.setMap(null)), []);

  return <div className={cn("map-shell relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#0b1728]", compact ? "h-[410px]" : "h-[620px]")}>
    <MapView className="absolute inset-0 h-full w-full opacity-90" initialCenter={{ lat: 29.9, lng: 81.2 }} initialZoom={6} onMapReady={initMarkers} />
    {!mapReady && <div className="demo-map-visual absolute inset-0 z-[1]" aria-label="Interactive demo map geometry">
      <div className="demo-map-grid" />
      <div className="demo-map-ridge ridge-one" />
      <div className="demo-map-ridge ridge-two" />
      <div className="demo-map-water" />
      <div className="demo-map-label label-north">HIMALAYAN FOOTHILLS</div>
      <div className="demo-map-label label-east">MODEL EXTENT · DEMO DATA</div>
      {habitations.map((item, index) => {
        const left = 18 + (index % 3) * 25;
        const top = 22 + Math.floor(index / 3) * 24;
        return <button key={item.id} onClick={() => onSelectHabitation(item)} className={cn("demo-map-marker", item.id === habitation.id && "demo-map-marker-selected")} style={{ left: `${left}%`, top: `${top}%` }} aria-label={`Select ${item.name}`}><span className="demo-map-pulse" /><span className="demo-map-dot" /><span className="demo-map-tooltip">{item.name} · {item.risk}</span></button>;
      })}
    </div>}
    <div className="absolute inset-0 pointer-events-none map-vignette" />
    <div className="absolute left-4 top-4 z-10 flex max-w-[calc(100%-32px)] flex-wrap gap-2 pointer-events-none"><div className="map-control pointer-events-auto"><Search size={14} className="text-cyan-300" /><span className="hidden sm:inline">Search location or habitation</span><span className="sm:hidden">Search map</span><kbd>⌘ K</kbd></div><button className="map-control pointer-events-auto" onClick={() => toast.info("Map centered on the current district extent")}><Compass size={14} className="text-slate-300" /><span className="hidden sm:inline">Recenter</span></button></div>
    <div className="absolute right-4 top-4 z-10 w-[205px] max-w-[calc(100%-32px)] rounded-lg border border-white/10 bg-[#091525]/90 p-3 shadow-2xl backdrop-blur-md"><div className="mb-2 flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Map layers</span><Layers3 size={13} className="text-slate-500" /></div>{allLayers.map((layer) => <label key={layer.id} className="flex items-center gap-2 py-1 text-[10px] text-slate-300"><input type="checkbox" checked={activeLayers.includes(layer.id)} onChange={() => setActiveLayers((layers) => layers.includes(layer.id) ? layers.filter((id) => id !== layer.id) : [...layers, layer.id])} className="h-3 w-3 accent-cyan-300" /><span className="h-2 w-2 rounded-sm" style={{ background: layer.color }} />{layer.label}</label>)}</div>
    <div className="absolute bottom-4 left-4 z-10 rounded-lg border border-white/10 bg-[#091525]/90 p-3 backdrop-blur-md"><div className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Legend</div><div className="flex flex-wrap gap-3 text-[10px] text-slate-300"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-400" /> High-risk habitation</span><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-cyan-300" /> Selected</span></div></div>
    <div className="absolute bottom-4 right-4 z-10 max-w-[280px] rounded-lg border border-cyan-300/20 bg-[#071522]/95 p-3 shadow-2xl backdrop-blur-md"><div className="mb-2 flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-300">Selected habitation</span><span className="text-[10px] text-slate-600">{mapReady ? "LIVE MAP" : "LOADING MAP"}</span></div><button className="text-left" onClick={() => onSelectHabitation(habitation)}><div className="text-sm font-semibold text-white">{habitation.name}</div><div className="mt-1 flex flex-wrap items-center gap-2"><span className="text-[10px] text-slate-400">{formatNumber(habitation.population)} people</span><RiskBadge risk={habitation.risk} compact /></div></button></div>
  </div>;
}

function OverviewPage({ habitation, onSelectHabitation, onNavigate, onSiteSelect }: { habitation: Habitation; onSelectHabitation: (habitation: Habitation) => void; onNavigate: (page: string) => void; onSiteSelect: (site: Site) => void }) {
  return <div className="animate-in"><PageIntro eyebrow="Observe → analyse → recommend" title="A clear view of who is at risk, where, and what happens next." description="SURAKSHASETU turns multi-hazard exposure into explainable relocation pathways. Start with a vulnerable habitation, inspect its risk, then test the safest sustainable sites for that specific population." action={<DemoTag />} />
    <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-6"><StatCard label="Habitations monitored" value="1,248" sub="Across 14 districts" icon={Users} accent="blue" /><StatCard label="High-risk habitations" value="186" sub="15% of monitored" icon={AlertTriangle} accent="red" trend="up" /><StatCard label="Population at risk" value="2.84 Lakh" sub="Exposure model" icon={Waves} accent="amber" trend="up" /><StatCard label="Immediate priority" value="42" sub="Authority review" icon={Zap} accent="rose" /><StatCard label="Candidate safe sites" value="317" sub="After base filter" icon={Target} accent="violet" /><StatCard label="Capacity available" value="4.72 Lakh" sub="Modeled buffer" icon={Building2} accent="green" trend="down" /></div>
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-white/[0.08] bg-[#0d1a2d] px-4 py-3 sm:px-5"><div className="flex items-center gap-2 text-xs font-semibold text-slate-300"><Filter size={14} className="text-cyan-300" /> Current planning extent</div><select className="select-control" defaultValue="Uttarakhand"><option>Uttarakhand</option><option>Odisha</option><option>Assam</option><option>Chhattisgarh</option></select><select className="select-control" defaultValue="Pauri Garhwal"><option>Pauri Garhwal</option><option>Almora</option><option>Dehradun</option><option>Puri</option></select><div className="ml-auto flex items-center gap-2 text-[10px] text-slate-500"><span className="status-dot" /> Data pipeline healthy · Updated 14 min ago</div></div>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(310px,0.85fr)]"><div className="min-w-0"><SectionTitle icon={MapPinned} eyebrow="Situation map" title="Multi-hazard exposure map" action={<button onClick={() => onNavigate("map")} className="text-button">Open full map <ChevronRight size={13} /></button>} /><MapPanel habitation={habitation} onSelectHabitation={onSelectHabitation} compact /></div><div className="space-y-6"><RiskSnapshot habitation={habitation} onNavigate={onNavigate} /><WorkflowCard onNavigate={onNavigate} onSiteSelect={onSiteSelect} /></div></div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"><PriorityPreview onSelectHabitation={onSelectHabitation} onNavigate={onNavigate} /><AlertPreview onNavigate={onNavigate} /></div>
  </div>;
}

function RiskSnapshot({ habitation, onNavigate }: { habitation: Habitation; onNavigate: (page: string) => void }) {
  return <div className="panel"><div className="mb-4 flex items-start justify-between"><div><div className="section-eyebrow">Selected assessment</div><h3 className="mt-2 text-xl font-semibold text-white">{habitation.name}</h3><div className="mt-1 flex items-center gap-2 text-xs text-slate-500"><MapPinned size={12} />{habitation.district}, {habitation.state}</div></div><RiskBadge risk={habitation.risk} /></div><div className="score-ring-wrap"><div className="score-ring"><div className="text-center"><div className="text-[30px] font-semibold tracking-tighter text-white">{habitation.risk}</div><div className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">Risk score</div></div></div><div className="ml-5 flex-1"><div className="mb-2 flex items-center justify-between"><span className="text-xs text-slate-400">Population exposed</span><span className="text-sm font-semibold text-white">{formatNumber(habitation.exposed)}</span></div><ProgressBar value={habitation.exposed / habitation.population * 100} color="rose" /><div className="mt-4 flex items-center justify-between"><span className="text-xs text-slate-400">Vulnerable population</span><span className="text-sm font-semibold text-white">{formatNumber(habitation.vulnerable)}</span></div><ProgressBar value={habitation.vulnerable / habitation.population * 100} color="amber" /></div></div><div className="my-5 grid grid-cols-2 gap-2 border-y border-white/[0.07] py-4"><SmallMetric label="Primary hazard" value={habitation.primaryHazard} /><SmallMetric label="Priority" value={habitation.priority.replace("-", " ")} tone="rose" /><SmallMetric label="Population" value={formatNumber(habitation.population)} /><SmallMetric label="Vulnerability" value={habitation.vulnerability} tone="amber" /></div><button onClick={() => onNavigate("risk")} className="primary-button w-full">View full assessment <ChevronRight size={15} /></button></div>;
}

function WorkflowCard({ onNavigate, onSiteSelect }: { onNavigate: (page: string) => void; onSiteSelect: (site: Site) => void }) {
  return <div className="panel"><SectionTitle icon={GitBranch} eyebrow="Decision workflow" title="From detection to action" action={<span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300">Live demo</span>} /><div className="space-y-0">{[{ n: "01", label: "Hazard detection", state: "complete" }, { n: "02", label: "Risk & vulnerability", state: "complete" }, { n: "03", label: "Hard safety filter", state: "complete" }, { n: "04", label: "Site sustainability", state: "active" }, { n: "05", label: "Authority decision", state: "next" }].map((step, index) => <div key={step.n} className="workflow-step"><div className={cn("workflow-number", step.state)}>{step.state === "complete" ? <Check size={12} /> : step.n}</div><div className="min-w-0 flex-1"><div className={cn("text-xs font-semibold", step.state === "active" ? "text-white" : "text-slate-400")}>{step.label}</div>{step.state === "active" && <div className="mt-0.5 text-[10px] text-cyan-300">Ranking 32 feasible sites</div>}</div>{index < 4 && <div className="workflow-line" />}</div>)}</div><button onClick={() => { onSiteSelect(sites[0]); onNavigate("sites"); }} className="secondary-button mt-4 w-full">Continue to site finder <ArrowUpRight size={14} /></button></div>;
}

function PriorityPreview({ onSelectHabitation, onNavigate }: { onSelectHabitation: (habitation: Habitation) => void; onNavigate: (page: string) => void }) {
  const rows = habitations.slice(0, 4);
  return <div className="panel"><SectionTitle icon={Zap} eyebrow="Act" title="Relocation priority queue" action={<button onClick={() => onNavigate("priority")} className="text-button">View all <ChevronRight size={13} /></button>} /><div className="overflow-x-auto"><table className="data-table"><thead><tr><th>Habitation</th><th>Risk</th><th>Population</th><th>Priority</th><th>Recommended site</th></tr></thead><tbody>{rows.map((item, index) => <tr key={item.id} onClick={() => onSelectHabitation(item)}><td><div className="font-semibold text-slate-200">{item.name}</div><div className="text-[10px] text-slate-600">{item.district}</div></td><td><span className="font-semibold text-white">{item.risk}</span></td><td className="text-slate-400">{formatNumber(item.population)}</td><td><span className={cn("priority-pill", priorityTone[item.priority].className)}>{priorityTone[item.priority].label}</span></td><td className="text-cyan-300">{index === 0 ? "Site A" : index === 1 ? "Site F" : index === 2 ? "Site C" : "Site B"}</td></tr>)}</tbody></table></div></div>;
}

function AlertPreview({ onNavigate }: { onNavigate: (page: string) => void }) {
  return <div className="panel"><SectionTitle icon={Bell} eyebrow="Monitor" title="Latest alerts" action={<button onClick={() => onNavigate("alerts")} className="text-button">Open center <ChevronRight size={13} /></button>} /><div className="space-y-3">{alerts.slice(0, 3).map((alert) => <AlertRow key={alert.id} alert={alert} />)}</div></div>;
}

function AlertRow({ alert }: { alert: typeof alerts[number] }) {
  const Icon = alert.level === "critical" ? AlertTriangle : alert.level === "warning" ? CloudRain : Database;
  return <div className="flex gap-3 rounded-lg border border-white/[0.06] bg-white/[0.025] p-3"><div className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md", alert.level === "critical" ? "bg-rose-400/10 text-rose-300" : alert.level === "warning" ? "bg-amber-300/10 text-amber-300" : "bg-cyan-300/10 text-cyan-300")}><Icon size={14} /></div><div className="min-w-0"><div className="text-xs font-semibold text-slate-200">{alert.title}</div><div className="mt-1 text-[11px] leading-5 text-slate-500">{alert.body}</div><div className="mt-1.5 text-[10px] text-slate-600">{alert.time}</div></div></div>;
}

function MapPage({ habitation, onSelectHabitation, onNavigate }: { habitation: Habitation; onSelectHabitation: (habitation: Habitation) => void; onNavigate: (page: string) => void }) {
  return <div className="animate-in"><PageIntro eyebrow="Where is the risk?" title="Explore the multi-hazard operating picture." description="Toggle demo hazard layers, select habitations, and open an explainable assessment. This map uses a live Google Maps surface with fictional demo markers and model overlays." action={<DemoTag />} /><div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_340px]"><MapPanel habitation={habitation} onSelectHabitation={onSelectHabitation} /><div className="space-y-6"><div className="panel"><SectionTitle icon={Layers3} title="Layer status" /><div className="space-y-3">{layerNames.map((layer) => <div key={layer.id} className="flex items-center justify-between"><div className="flex items-center gap-2 text-xs text-slate-300"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: layer.color }} />{layer.label}</div><span className="text-[10px] text-emerald-300">Available</span></div>)}</div></div><div className="panel"><SectionTitle icon={MapPinned} title="Selected habitation" /><h3 className="text-lg font-semibold text-white">{habitation.name}</h3><p className="mt-1 text-xs text-slate-500">{habitation.district} · {habitation.primaryHazard}-prone</p><div className="mt-4 grid grid-cols-2 gap-2"><SmallMetric label="Risk score" value={`${habitation.risk}/100`} tone="rose" /><SmallMetric label="Population" value={formatNumber(habitation.population)} /><SmallMetric label="Exposed" value={formatNumber(habitation.exposed)} /><SmallMetric label="Priority" value={habitation.priority.replace("-", " ")} tone="amber" /></div><button onClick={() => onNavigate("risk")} className="primary-button mt-5 w-full">Open assessment <ChevronRight size={15} /></button></div></div></div></div>;
}

function RiskPage({ habitation, onSelectHabitation, onNavigate }: { habitation: Habitation; onSelectHabitation: (habitation: Habitation) => void; onNavigate: (page: string) => void }) {
  const [showWhy, setShowWhy] = useState(true);
  return <div className="animate-in"><PageIntro eyebrow="Who is at risk?" title={`Risk assessment · ${habitation.name}`} description="The deterministic demo engine combines hazard exposure, vulnerability, historical frequency, access, and future scenario factors. No fabricated AI accuracy is shown." action={<div className="flex gap-2"><select className="select-control" value={habitation.id} onChange={(event) => { const next = habitations.find((item) => item.id === event.target.value); if (next) onSelectHabitation(next); }}><option value="xyz-village">XYZ Village</option>{habitations.filter((item) => item.id !== "xyz-village").map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><button onClick={() => onNavigate("sites")} className="primary-button hidden sm:flex">Find relocation sites <ArrowUpRight size={14} /></button></div>} /><div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"><div className="space-y-6"><div className="panel"><div className="flex flex-col justify-between gap-4 sm:flex-row"><div><div className="section-eyebrow">Current risk score</div><div className="mt-2 flex items-end gap-3"><span className="font-display text-6xl font-semibold tracking-tighter text-white">{habitation.risk}</span><span className="mb-2 text-sm text-slate-500">/ 100</span><RiskBadge risk={habitation.risk} /></div><p className="mt-3 max-w-md text-xs leading-5 text-slate-500">Model-identified high risk based on {habitation.primaryHazard.toLowerCase()} exposure, vulnerable population, historical events, and access constraints.</p></div><div className="risk-mini-ring"><span>{habitation.vulnerability.slice(0, 1)}</span></div></div><div className="mt-7 space-y-4">{habitation.hazards.map((hazard) => <div key={hazard.label}><div className="mb-1.5 flex items-center justify-between text-xs"><span className="text-slate-400">{hazard.label}</span><span className="font-semibold text-slate-200">{hazard.value}</span></div><div className="h-2 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${hazard.value}%`, background: hazard.color }} /></div></div>)}</div></div><div className="panel"><button onClick={() => setShowWhy((value) => !value)} className="flex w-full items-center justify-between text-left"><div className="flex items-center gap-3"><div className="section-icon"><CircleHelp size={16} /></div><div><div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">Explainable engine</div><h3 className="mt-1 text-sm font-semibold text-white">Why this score?</h3></div></div><ChevronDown size={16} className={cn("text-slate-500 transition-transform", showWhy && "rotate-180")} /></button>{showWhy && <div className="mt-5 grid gap-2 sm:grid-cols-2">{habitation.why.map((reason, index) => <div key={reason} className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.025] p-3"><div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-400/10 text-[10px] font-bold text-rose-300">0{index + 1}</div><span className="text-xs text-slate-300">{reason}</span></div>)}</div>}</div></div><div className="space-y-6"><div className="panel"><SectionTitle icon={Users} eyebrow="Exposure profile" title="Population & vulnerability" /><div className="grid grid-cols-2 gap-3">{[{ label: "Total population", value: formatNumber(habitation.population) }, { label: "Population exposed", value: formatNumber(habitation.exposed) }, { label: "Vulnerable population", value: formatNumber(habitation.vulnerable) }, { label: "Density", value: `${habitation.density}/km²` }].map((metric) => <div key={metric.label} className="mini-stat"><div className="text-[10px] text-slate-600">{metric.label}</div><div className="mt-1 text-lg font-semibold text-white">{metric.value}</div></div>)}</div></div><div className="panel"><SectionTitle icon={Hospital} eyebrow="Access constraints" title="Emergency accessibility" /><div className="space-y-3">{Object.entries(habitation.nearest).slice(0, 3).map(([label, value]) => <div key={label} className="flex items-center justify-between border-b border-white/[0.06] pb-3 last:border-0 last:pb-0"><span className="text-xs capitalize text-slate-500">Nearest {label}</span><span className="text-xs font-semibold text-white">{value}</span></div>)}</div><div className="mt-4 rounded-lg border border-amber-300/10 bg-amber-300/[0.05] p-3 text-[11px] leading-5 text-amber-100/70"><span className="font-semibold text-amber-200">Historical context:</span> {habitation.history}. Primary occupation is {habitation.occupation.toLowerCase()}.</div></div><button onClick={() => onNavigate("sites")} className="primary-button w-full sm:hidden">Find suitable relocation sites <ArrowUpRight size={14} /></button></div></div></div>;
}

function SitesPage({ habitation, selectedSite, onSelectSite, onSelectHabitation, onNavigate, announce }: { habitation: Habitation; selectedSite: Site; onSelectSite: (id: string) => void; onSelectHabitation: (id: string) => void; onNavigate: (page: string) => void; announce: (message: string) => void }) {
  const [weights, setWeights] = useState(defaultWeights);
  const [filter, setFilter] = useState("all");
  const [finderRun, setFinderRun] = useState(true);
  const rankedSites = useMemo(() => rankSites(weights, filter), [weights, filter]);
  const updateWeight = (key: WeightKey, value: number) => setWeights((current) => ({ ...current, [key]: value }));
  return <div className="animate-in"><PageIntro eyebrow="Where can people safely relocate?" title="Find the safest sustainable site for this community." description="The engine applies a hard safety filter first, then ranks surviving sites using adjustable, transparent suitability weights. Every recommendation remains subject to authority validation." action={<div className="flex items-center gap-2"><DemoTag /><button onClick={() => setFinderRun(false)} className="icon-button" aria-label="Reset site finder"><RefreshCw size={15} /></button></div>} /><div className="mb-6 grid gap-3 md:grid-cols-3"><PipelineStat value="100" label="Candidate areas" sub="Generated for scenario" tone="blue" /><PipelineStat value="32" label="Passed safety filter" sub="68 rejected by hard rules" tone="green" /><PipelineStat value={`${rankedSites.length}`} label="Ranked sites" sub="Capacity + sustainability checked" tone="violet" /></div><div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-white/[0.08] bg-[#0d1a2d] p-4"><div className="flex items-center gap-2 text-xs font-semibold text-slate-300"><Users size={14} className="text-cyan-300" /> Source habitation</div><select className="select-control min-w-[180px]" value={habitation.id} onChange={(event) => onSelectHabitation(event.target.value)}>{habitations.map((item) => <option key={item.id} value={item.id}>{item.name} · {formatNumber(item.population)}</option>)}</select><div className="ml-auto flex gap-2"><select className="select-control" value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All modeled sites</option><option value="passed">Passed safety filter</option><option value="rejected">Rejected sites</option></select><button className="primary-button" onClick={() => { setFinderRun(true); announce("Site ranking recalculated for the selected habitation"); }}>Run suitability engine <Zap size={14} /></button></div></div><div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(330px,0.75fr)]"><div className="space-y-4"><div className="panel overflow-hidden p-0"><div className="border-b border-white/[0.07] px-5 py-4"><SectionTitle icon={Target} eyebrow="Ranked recommendation" title="Candidate site assessment" action={<span className="text-[10px] text-slate-600">{finderRun ? "Engine complete" : "Ready to run"}</span>} /></div><div className="divide-y divide-white/[0.06]">{rankedSites.map((site, index) => <SiteRow key={site.id} site={site} rank={index + 1} selected={selectedSite.id === site.id} onSelect={() => onSelectSite(site.id)} onOpen={() => { onSelectSite(site.id); onNavigate("capacity"); }} />)}</div></div><div className="flex items-start gap-3 rounded-lg border border-amber-300/10 bg-amber-300/[0.04] p-4 text-[11px] leading-5 text-amber-100/60"><AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-300" /><span><b className="text-amber-200">Hard safety filter is non-negotiable.</b> Sites with extreme flood or landslide exposure, active erosion, insufficient sustainable water, or inadequate capacity cannot rank highly even if they are geographically convenient.</span></div></div><div className="panel"><SectionTitle icon={SlidersHorizontal} eyebrow="Authorized demo control" title="Suitability weights" action={<span className="text-[10px] font-semibold text-cyan-300">{Object.values(weights).reduce((sum, value) => sum + value, 0)} total</span>} /><div className="mb-4 text-[11px] leading-5 text-slate-500">Adjust the model emphasis. The ranked list updates immediately; safety remains a hard gate.</div><div className="space-y-4">{(Object.keys(weightLabels) as WeightKey[]).map((key) => <label key={key} className="block"><div className="mb-1.5 flex items-center justify-between text-[11px]"><span className="text-slate-400">{weightLabels[key]}</span><span className="font-semibold text-white">{weights[key]}%</span></div><input type="range" min="0" max="40" value={weights[key]} onChange={(event) => updateWeight(key, Number(event.target.value))} className="range-control" /></label>)}</div><button onClick={() => setWeights(defaultWeights)} className="secondary-button mt-5 w-full">Reset recommended weights</button><div className="mt-5 border-t border-white/[0.07] pt-4"><div className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">Two-score concept</div><div className="grid grid-cols-2 gap-2"><div className="rounded-lg border border-emerald-300/10 bg-emerald-300/[0.05] p-3"><div className="text-[10px] text-emerald-300">Safety score</div><div className="mt-1 text-lg font-semibold text-white">{selectedSite.safety}</div><div className="mt-1 text-[10px] text-slate-500">Can people safely live here?</div></div><div className="rounded-lg border border-violet-300/10 bg-violet-300/[0.05] p-3"><div className="text-[10px] text-violet-300">Sustainability</div><div className="mt-1 text-lg font-semibold text-white">{selectedSite.sustainability}</div><div className="mt-1 text-[10px] text-slate-500">Can it support them for decades?</div></div></div></div></div></div></div>;
}

function rankSites(weights: Record<WeightKey, number>, filter: string) {
  const total = Math.max(Object.values(weights).reduce((sum, value) => sum + value, 0), 1);
  return sites.filter((site) => filter === "all" || filter === "passed" ? site.passedSafety === true : site.passedSafety === false).map((site) => ({ site, score: Object.entries(weights).reduce((sum, [key, weight]) => sum + (site.metrics[key as WeightKey] ?? 0) * weight, 0) / total })).sort((a, b) => b.score - a.score).map(({ site, score }) => ({ ...site, weightedScore: Number(score.toFixed(1)) }));
}

function SiteRow({ site, rank, selected, onSelect, onOpen }: { site: Site & { weightedScore?: number }; rank: number; selected: boolean; onSelect: () => void; onOpen: () => void }) {
  const weightedScore = site.weightedScore ?? (site.safety * 0.5 + site.sustainability * 0.3 + site.compatibility * 0.2);
  return <button onClick={onSelect} className={cn("site-row w-full text-left", selected && "site-row-selected")}><div className={cn("rank-bubble", rank === 1 ? "rank-one" : "")}>{rank === 1 ? "★" : `0${rank}`}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="truncate text-sm font-semibold text-white">{site.name}</span>{site.passedSafety ? <span className="status-chip pass"><Check size={10} /> Passed safety filter</span> : <span className="status-chip reject"><X size={10} /> Rejected by filter</span>}</div><div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-500"><span className="flex items-center gap-1"><Navigation size={11} />{site.distance}</span><span className="flex items-center gap-1"><Building2 size={11} />{formatNumber(site.capacity)} capacity</span><span className="flex items-center gap-1"><Droplets size={11} />{(site.waterSupply / 1000000).toFixed(1)}M L/day</span></div></div><div className="ml-3 flex flex-col items-end"><div className="text-2xl font-semibold tracking-tighter text-white">{weightedScore.toFixed(1)}</div><div className="mt-0.5 text-[9px] uppercase tracking-wider text-slate-600">Suitability</div><button onClick={(event) => { event.stopPropagation(); onOpen(); }} className="mt-2 text-[10px] font-semibold text-cyan-300 hover:text-cyan-200">Open detail <ArrowUpRight size={11} className="inline" /></button></div></button>;
}

function CapacityPage({ habitation, site, onNavigate, announce }: { habitation: Habitation; site: Site; onNavigate: (page: string) => void; announce: (message: string) => void }) {
  const [population, setPopulation] = useState(habitation.population);
  const [waterSupply, setWaterSupply] = useState(site.waterSupply);
  const capacity = Math.round(Math.min(site.capacity, waterSupply / 142));
  const remaining = capacity - population;
  const suitable = remaining >= 0 && waterSupply >= population * 142 && site.passedSafety;
  return <div className="animate-in"><PageIntro eyebrow="Can the site support them?" title={`Site suitability · ${site.name}`} description="Capacity is not just empty land. The assessment combines buildable area, utilities, water, infrastructure, social fit, livelihood, environment, and future resilience." action={<div className="flex gap-2"><button onClick={() => onNavigate("sites")} className="secondary-button"><ChevronRight size={14} className="rotate-180" /> Back to sites</button><button onClick={() => announce("Assessment export prepared as a demo report")} className="primary-button"><FileDown size={14} /> Export assessment</button></div>} /><div className="mb-6 grid gap-3 sm:grid-cols-3"><ScoreCard label="Safety score" score={site.safety} caption="Can people safely live here?" tone="green" /><ScoreCard label="Sustainability score" score={site.sustainability} caption="Can it support them for decades?" tone="violet" /><ScoreCard label="Community compatibility" score={site.compatibility} caption="Will the community fit here?" tone="cyan" /></div><div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(330px,0.8fr)]"><div className="space-y-6"><div className="panel"><SectionTitle icon={Gauge} eyebrow="Carrying capacity engine" title="Dynamic population feasibility" action={<span className={cn("status-chip", suitable ? "pass" : "reject")}>{suitable ? "Suitable" : "Unsuitable"}</span>} /><div className="grid gap-4 sm:grid-cols-3"><div><div className="text-[10px] text-slate-600">Population to relocate</div><div className="mt-1 text-2xl font-semibold text-white">{formatNumber(population)}</div></div><div><div className="text-[10px] text-slate-600">Estimated capacity</div><div className="mt-1 text-2xl font-semibold text-white">{formatNumber(capacity)}</div></div><div><div className="text-[10px] text-slate-600">Remaining capacity</div><div className={cn("mt-1 text-2xl font-semibold", remaining >= 0 ? "text-emerald-300" : "text-rose-300")}>{remaining >= 0 ? formatNumber(remaining) : `−${formatNumber(Math.abs(remaining))}`}</div></div></div><div className="mt-6 h-4 overflow-hidden rounded-full bg-white/[0.06]"><div className={cn("h-full rounded-full transition-all duration-500", suitable ? "bg-gradient-to-r from-cyan-300 to-emerald-300" : "bg-rose-400")} style={{ width: `${clamp(population / capacity * 100)}%` }} /></div><div className="mt-2 flex justify-between text-[10px] text-slate-600"><span>0 capacity pressure</span><span>{Math.round(population / capacity * 100)}% utilized</span><span>{formatNumber(capacity)} modeled max</span></div><div className={cn("mt-5 rounded-lg border p-4 text-xs leading-5", suitable ? "border-emerald-300/15 bg-emerald-300/[0.05] text-emerald-100/70" : "border-rose-300/15 bg-rose-300/[0.05] text-rose-100/70")}><b className={suitable ? "text-emerald-200" : "text-rose-200"}>{suitable ? "PASS · Sustainable capacity available" : "FAIL · Capacity or water threshold breached"}</b><div className="mt-1">Water balance: {((waterSupply - population * 142) / 1000000).toFixed(2)}M L/day remaining at the current input.</div></div></div><div className="panel"><SectionTitle icon={Droplets} eyebrow="Water assessment" title="Supply → demand → remaining capacity" /><div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center"><div><div className="mb-3 flex items-center justify-between text-xs"><span className="text-slate-400">Sustainable supply</span><span className="font-semibold text-cyan-300">{(waterSupply / 1000000).toFixed(2)}M L/day</span></div><ProgressBar value={Math.min(waterSupply / 1800000 * 100, 100)} color="cyan" /><div className="mt-4 flex items-center justify-between text-xs"><span className="text-slate-400">Projected demand</span><span className="font-semibold text-amber-300">{(population * 142 / 1000000).toFixed(2)}M L/day</span></div><ProgressBar value={Math.min(population * 142 / 1800000 * 100, 100)} color="amber" /></div><div className="water-gauge"><div className="text-xl font-semibold text-white">{Math.round((waterSupply - population * 142) / 10000) / 100}M</div><div className="text-[9px] uppercase tracking-wider text-slate-500">Balance L/day</div></div></div><div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4"><SmallMetric label="Groundwater" value="Good" tone="cyan" /><SmallMetric label="Recharge" value="High" tone="green" /><SmallMetric label="Quality" value="Pass" tone="green" /><SmallMetric label="Drought risk" value="Low" tone="amber" /></div></div><div className="panel"><SectionTitle icon={Navigation} eyebrow="Infrastructure accessibility" title="Travel time, not just distance" /><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{site.infrastructure.map((item) => <div key={item.label} className="mini-stat"><div className="flex items-center gap-1.5 text-[10px] text-slate-600"><InfrastructureIcon kind={item.icon} />{item.label}</div><div className="mt-2 text-sm font-semibold text-white">{item.time}</div></div>)}</div></div></div><div className="space-y-6"><div className="panel"><SectionTitle icon={SlidersHorizontal} eyebrow="Scenario inputs" title="Test the model" /><label className="block"><div className="mb-2 flex justify-between text-xs"><span className="text-slate-400">Population to relocate</span><span className="font-semibold text-white">{formatNumber(population)}</span></div><input type="range" min="1000" max="16000" step="100" value={population} onChange={(event) => setPopulation(Number(event.target.value))} className="range-control" /></label><label className="mt-5 block"><div className="mb-2 flex justify-between text-xs"><span className="text-slate-400">Sustainable water supply</span><span className="font-semibold text-white">{(waterSupply / 1000000).toFixed(2)}M L/day</span></div><input type="range" min="500000" max="2200000" step="10000" value={waterSupply} onChange={(event) => setWaterSupply(Number(event.target.value))} className="range-control" /></label><div className="mt-5 border-t border-white/[0.07] pt-4 text-[11px] leading-5 text-slate-500">Per-capita requirement uses a transparent demo assumption of <b className="text-slate-300">142 L/person/day</b>. Replace with validated engineering standards in the production data service.</div></div><div className="panel"><SectionTitle icon={Mountain} eyebrow="Terrain & safeguards" title="Buildable conditions" /><div className="space-y-3">{Object.entries(site.terrain).map(([label, value]) => <div key={label} className="flex justify-between border-b border-white/[0.06] pb-3 last:border-0 last:pb-0"><span className="text-xs capitalize text-slate-500">{label}</span><span className="text-xs font-semibold text-slate-200">{value}</span></div>)}</div><div className="mt-5 rounded-lg border border-cyan-300/10 bg-cyan-300/[0.04] p-3 text-[11px] leading-5 text-cyan-100/70"><b className="text-cyan-200">Future resilience:</b> {site.climate[0].score} today → {site.climate[site.climate.length - 1].score} in the 2050 scenario projection.</div></div><div className="panel"><SectionTitle icon={Sparkles} eyebrow="Explainable recommendation" title="Why this site?" /><p className="text-xs leading-6 text-slate-400">{site.explanation}</p><div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-300/10 bg-amber-300/[0.04] p-3 text-[10px] leading-5 text-amber-100/60"><AlertTriangle size={14} className="shrink-0 text-amber-300" /> Recommended for further authority validation — not an official relocation order.</div></div></div></div></div>;
}

function PriorityPage({ selectedHabitationId, onSelectHabitation, onNavigate }: { selectedHabitationId: string; onSelectHabitation: (id: string) => void; onNavigate: (page: string) => void }) {
  const [priorityFilter, setPriorityFilter] = useState("All priorities");
  const filtered = habitations.filter((item) => priorityFilter === "All priorities" || item.priority === priorityFilter);
  return <div className="animate-in"><PageIntro eyebrow="Authority decision panel" title="Prioritize action across vulnerable habitations." description="A sortable planning queue translates risk, vulnerability, and threat recurrence into a recommended next action. It does not issue a government order." action={<button onClick={() => onNavigate("sites")} className="primary-button">Open site finder <ArrowUpRight size={14} /></button>} /><div className="mb-6 grid gap-3 sm:grid-cols-3"><PipelineStat value="42" label="Immediate" sub="Detailed assessment now" tone="red" /><PipelineStat value="86" label="Short-term" sub="Planned relocation" tone="amber" /><PipelineStat value="58" label="Medium-term" sub="Preventive planning" tone="yellow" /></div><div className="panel overflow-hidden p-0"><div className="flex flex-wrap items-center gap-3 border-b border-white/[0.07] p-5"><div className="flex items-center gap-2 text-xs font-semibold text-white"><Zap size={15} className="text-cyan-300" /> Priority queue</div><div className="ml-auto flex flex-wrap gap-2"><select className="select-control" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}><option>All priorities</option><option>IMMEDIATE</option><option>SHORT-TERM</option><option>MEDIUM-TERM</option></select><button className="secondary-button"><Filter size={13} /> More filters</button></div></div><div className="overflow-x-auto"><table className="data-table data-table-large"><thead><tr><th>Habitation</th><th>Risk score</th><th>Population</th><th>Vulnerability</th><th>Priority</th><th>Recommended site</th><th>Action</th></tr></thead><tbody>{filtered.map((item, index) => <tr key={item.id} className={item.id === selectedHabitationId ? "row-selected" : ""} onClick={() => onSelectHabitation(item.id)}><td><div className="font-semibold text-slate-200">{item.name}</div><div className="text-[10px] text-slate-600">{item.state} · {item.district}</div></td><td><div className="flex items-center gap-2"><span className={cn("risk-score-dot", item.risk >= 80 ? "bg-rose-400" : item.risk >= 65 ? "bg-orange-300" : "bg-yellow-300")} /> <span className="font-semibold text-white">{item.risk}</span></div></td><td className="text-slate-400">{formatNumber(item.population)}</td><td><span className="text-xs text-slate-300">{item.vulnerability}</span></td><td><span className={cn("priority-pill", priorityTone[item.priority].className)}>{priorityTone[item.priority].label}</span></td><td className="text-cyan-300">{index % 3 === 0 ? "Site A" : index % 3 === 1 ? "Site B" : "Site C"}</td><td><button onClick={(event) => { event.stopPropagation(); onNavigate("risk"); }} className="text-button">Inspect <ChevronRight size={12} /></button></td></tr>)}</tbody></table></div></div></div>;
}

function AnalyticsPage({ district, setDistrict }: { district: string; setDistrict: (value: string) => void }) {
  const riskDistribution = [
    { label: "Critical", value: 18, color: "#fb7185" },
    { label: "High", value: 28, color: "#fb923c" },
    { label: "Moderate", value: 36, color: "#fbbf24" },
    { label: "Low", value: 18, color: "#34d399" },
  ];
  const trend = [
    { year: "2026", value: 88 },
    { year: "2030", value: 84 },
    { year: "2040", value: 77 },
    { year: "2050", value: 69 },
  ];

  return (
    <div className="animate-in">
      <PageIntro
        eyebrow="Observe → predict"
        title="Analytics for planning decisions, not vanity metrics."
        description="Charts are responsive to the current planning extent and use clearly labeled demo or scenario data. No fabricated AI accuracy is presented."
        action={
          <select className="select-control" value={district} onChange={(event) => setDistrict(event.target.value)}>
            <option>All districts</option>
            <option>Pauri Garhwal</option>
            <option>Almora</option>
            <option>Puri</option>
          </select>
        }
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="panel">
          <SectionTitle icon={BarChart3} eyebrow="Population exposure" title="Risk distribution" action={<DemoTag />} />
          <div className="mt-5 flex items-center gap-8">
            <div className="donut-chart"><div><div className="text-2xl font-semibold text-white">1,248</div><div className="text-[9px] uppercase tracking-wider text-slate-600">Habitations</div></div></div>
            <div className="flex-1 space-y-3">
              {riskDistribution.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-400"><span className="h-2 w-2 rounded-full" style={{ background: item.color }} />{item.label}</span>
                  <span className="font-semibold text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="panel">
          <SectionTitle icon={Waves} eyebrow="Scenario / model projection" title="Future risk trend" action={<span className="text-[10px] text-violet-300">2026 → 2050</span>} />
          <div className="mt-6 flex h-[165px] items-end gap-3 sm:gap-7">
            {trend.map((item) => (
              <div key={item.year} className="flex h-full flex-1 flex-col justify-end">
                <div className="mb-2 text-center text-xs font-semibold text-slate-300">{item.value}</div>
                <div className="rounded-t-md bg-gradient-to-t from-violet-500/80 to-cyan-300/80 transition-all duration-500" style={{ height: `${item.value * 1.3}px` }} />
                <div className="mt-3 text-center text-[10px] text-slate-600">{item.year}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <SectionTitle icon={CloudRain} eyebrow="Hazard mix" title="Exposure by hazard" />
          <div className="space-y-4">
            {[
              { label: "Flood", value: 72, count: "312 habitations", color: "#38bdf8" },
              { label: "Landslide", value: 58, count: "248 habitations", color: "#fb7185" },
              { label: "Cloudburst", value: 44, count: "186 habitations", color: "#fbbf24" },
              { label: "Coastal / surge", value: 29, count: "84 habitations", color: "#f97316" },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex justify-between text-xs"><span className="text-slate-400">{item.label}</span><span className="text-slate-500">{item.count}</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full" style={{ width: `${item.value}%`, background: item.color }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <SectionTitle icon={Building2} eyebrow="Readiness" title="Capacity & infrastructure" />
          <div className="space-y-5">
            {[
              { label: "Relocation capacity available", value: 78, color: "#34d399" },
              { label: "Water capacity pass rate", value: 71, color: "#22d3ee" },
              { label: "Infrastructure readiness", value: 64, color: "#a78bfa" },
              { label: "Historical event coverage", value: 86, color: "#fbbf24" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <div className="w-44 shrink-0 text-xs text-slate-400">{item.label}</div>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full" style={{ width: `${item.value}%`, background: item.color }} /></div>
                <div className="w-8 text-right text-xs font-semibold text-white">{item.value}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertsPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return <div className="animate-in"><PageIntro eyebrow="Monitor" title="Alerts that lead to a planning action." description="These are simulated alerts from the demo layer. Each alert points to an inspectable assessment or data source." action={<DemoTag />} /><div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]"><div className="space-y-3">{alerts.map((alert) => <div key={alert.id} className="panel flex gap-4"><div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", alert.level === "critical" ? "bg-rose-400/10 text-rose-300" : alert.level === "warning" ? "bg-amber-300/10 text-amber-300" : "bg-cyan-300/10 text-cyan-300")}>{alert.level === "critical" ? <AlertTriangle size={18} /> : alert.level === "warning" ? <CloudRain size={18} /> : <Database size={18} />}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-semibold text-white">{alert.title}</h3><span className="text-[10px] text-slate-600">{alert.time}</span></div><p className="mt-2 text-xs leading-5 text-slate-500">{alert.body}</p><button onClick={() => onNavigate(alert.id === "a3" ? "sources" : alert.id === "a5" ? "capacity" : "risk")} className="mt-3 text-button">{alert.action} <ChevronRight size={12} /></button></div></div>)}</div><div className="panel h-fit"><SectionTitle icon={Bell} eyebrow="Alert rules" title="Active monitoring" /><div className="space-y-3">{[{ label: "Risk score threshold", value: "≥ 80", color: "rose" }, { label: "Water capacity threshold", value: "< 1.0M L/day", color: "amber" }, { label: "Future risk delta", value: "≥ 8 points", color: "violet" }, { label: "Historical event intake", value: "New record", color: "cyan" }].map((rule) => <div key={rule.label} className="flex items-center justify-between border-b border-white/[0.06] pb-3 last:border-0 last:pb-0"><span className="text-xs text-slate-500">{rule.label}</span><span className={cn("text-xs font-semibold", `text-${rule.color}-300`)}>{rule.value}</span></div>)}</div><div className="mt-5 rounded-lg border border-cyan-300/10 bg-cyan-300/[0.04] p-3 text-[11px] leading-5 text-cyan-100/70">Alert actions are advisory. No automatic public warning or relocation order is issued by this prototype.</div></div></div></div>;
}

function SourcesPage() {
  return <div className="animate-in"><PageIntro eyebrow="Transparent by design" title="Know what the model is using." description="Every value in this prototype is fictional, indicative, or scenario-based. The architecture is ready for authoritative datasets to replace the mock repository layer without redesigning the frontend." action={<DemoTag />} /><div className="mb-6 grid gap-3 sm:grid-cols-3"><PipelineStat value="5" label="Data categories" sub="Separated by provenance" tone="blue" /><PipelineStat value="100%" label="Clearly labeled" sub="No invented APIs" tone="green" /><PipelineStat value="0" label="Hidden model claims" sub="No fake accuracy" tone="violet" /></div><div className="panel overflow-hidden p-0"><div className="border-b border-white/[0.07] px-5 py-4"><SectionTitle icon={Database} eyebrow="Data provenance" title="Source registry" /></div><div className="overflow-x-auto"><table className="data-table data-table-large"><thead><tr><th>Category</th><th>Source / dataset</th><th>Dataset type</th><th>Update frequency</th><th>Coverage</th><th>Status</th></tr></thead><tbody>{sources.map((source) => <tr key={source.name}><td><span className="text-xs font-semibold text-cyan-300">{source.category}</span></td><td><span className="font-semibold text-slate-200">{source.name}</span></td><td className="text-slate-400">{source.type}</td><td className="text-slate-400">{source.frequency}</td><td className="text-slate-400">{source.coverage}</td><td><span className={cn("status-chip", source.status === "SCENARIO" ? "scenario" : "demo")}>{source.status}</span></td></tr>)}</tbody></table></div></div><div className="mt-6 grid gap-6 md:grid-cols-2"><div className="panel"><SectionTitle icon={GitBranch} eyebrow="Data pipeline" title="External source → decision support" /><div className="space-y-0">{["External data sources", "Data ingestion", "Validation", "Geospatial processing", "Feature engineering", "Risk / relocation engine", "PostGIS-ready repository", "REST API → React dashboard"].map((label, index) => <div key={label} className="flex items-center gap-3 border-b border-white/[0.06] py-3 last:border-0"><div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-300/10 text-[10px] font-bold text-cyan-300">{index + 1}</div><span className="text-xs text-slate-300">{label}</span>{index < 7 && <ChevronDown size={13} className="ml-auto text-slate-700" />}</div>)}</div></div><div className="panel"><SectionTitle icon={Shield} eyebrow="Domain guardrail" title="Decision support, not authority" /><p className="text-sm leading-6 text-slate-400">SURAKSHASETU is designed to help disaster-management teams inspect evidence, compare scenarios, and prepare a recommendation. It does not legally declare red zones, certify hazard boundaries, or issue relocation orders.</p><div className="mt-5 space-y-2">{["Model-identified high-risk / potential red zone", "Recommended for further authority validation", "Scenario / model projection", "For planning and assessment"].map((label) => <div key={label} className="flex items-center gap-2 text-xs text-emerald-300"><Check size={13} />{label}</div>)}</div></div></div></div>;
}

function SettingsPage({ announce }: { announce: (message: string) => void }) {
  return <div className="animate-in"><PageIntro eyebrow="System configuration" title="Configure the demonstration environment." description="These settings are local to the prototype. Production integrations should be connected through secured environment variables and a validated backend service." action={<button onClick={() => announce("Configuration saved locally for this demo")} className="primary-button"><Check size={14} /> Save settings</button>} /><div className="grid gap-6 xl:grid-cols-2"><div className="panel"><SectionTitle icon={Settings2} eyebrow="Planning extent" title="Default geography" /><div className="space-y-5"><SettingSelect label="State" value="Uttarakhand" options={["Uttarakhand", "Odisha", "Assam", "Chhattisgarh"]} /><SettingSelect label="District" value="Pauri Garhwal" options={["Pauri Garhwal", "Almora", "Puri", "Dibrugarh"]} /><SettingSelect label="Scenario horizon" value="2050 projection" options={["2030 projection", "2040 projection", "2050 projection"]} /></div></div><div className="panel"><SectionTitle icon={Shield} eyebrow="Access & safety" title="Prototype controls" /><div className="space-y-4">{[{ label: "Demo data watermark", description: "Keep visible on all screens", checked: true }, { label: "Require authority validation note", description: "Show before export actions", checked: true }, { label: "Allow weight adjustment", description: "Enable authorized demo sliders", checked: true }, { label: "Experimental live connectors", description: "Disabled until API is configured", checked: false }].map((setting) => <label key={setting.label} className="flex items-center justify-between gap-4 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"><div><div className="text-xs font-semibold text-slate-200">{setting.label}</div><div className="mt-1 text-[10px] text-slate-600">{setting.description}</div></div><input type="checkbox" defaultChecked={setting.checked} className="h-4 w-4 accent-cyan-300" /></label>)}</div></div></div></div>;
}

function SettingSelect({ label, value, options }: { label: string; value: string; options: string[] }) { return <label className="flex items-center justify-between gap-4"><span className="text-xs text-slate-400">{label}</span><select className="select-control min-w-[190px]" defaultValue={value}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }
function PipelineStat({ value, label, sub, tone }: { value: string; label: string; sub: string; tone: string }) { return <div className={cn("pipeline-stat", `pipeline-${tone}`)}><div className="text-2xl font-semibold tracking-tight text-white">{value}</div><div className="mt-1 text-xs font-semibold text-slate-200">{label}</div><div className="mt-1 text-[10px] text-slate-500">{sub}</div></div>; }
function ScoreCard({ label, score, caption, tone }: { label: string; score: number; caption: string; tone: string }) { return <div className={cn("score-card", `score-${tone}`)}><div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{label}</div><div className="mt-3 flex items-end gap-2"><span className="text-4xl font-semibold tracking-tighter text-white">{score}</span><span className="mb-1 text-xs text-slate-600">/ 100</span></div><div className="mt-2 text-[10px] text-slate-500">{caption}</div></div>; }
function SmallMetric({ label, value, tone }: { label: string; value: string; tone?: string }) { return <div><div className="text-[10px] text-slate-600">{label}</div><div className={cn("mt-1 text-xs font-semibold", tone ? `text-${tone}-300` : "text-slate-200")}>{value}</div></div>; }
function ProgressBar({ value, color }: { value: number; color: string }) { const colorMap: Record<string, string> = { rose: "#fb7185", amber: "#fbbf24", cyan: "#22d3ee", green: "#34d399" }; return <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${clamp(value)}%`, background: colorMap[color] ?? color }} /></div>; }
function InfrastructureIcon({ kind }: { kind: string }) { const Icon = kind === "hospital" ? Hospital : kind === "road" ? Navigation : kind === "school" ? Building2 : kind === "fire" ? Flame : kind === "police" ? Shield : MapPinned; return <Icon size={11} />; }

export default App;
