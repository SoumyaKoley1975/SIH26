export type Priority = "IMMEDIATE" | "SHORT-TERM" | "MEDIUM-TERM";
export type WeightKey =
  | "safety"
  | "climate"
  | "water"
  | "capacity"
  | "infrastructure"
  | "livelihood"
  | "environment"
  | "social"
  | "cost";

export interface Habitation {
  id: string;
  name: string;
  state: string;
  district: string;
  population: number;
  exposed: number;
  vulnerable: number;
  density: number;
  primaryHazard: string;
  risk: number;
  vulnerability: "High" | "Medium" | "Low";
  priority: Priority;
  coordinates: { lat: number; lng: number };
  hazards: { label: string; value: number; color: string }[];
  nearest: { hospital: string; school: string; road: string; travelTime: string };
  occupation: string;
  history: string;
  why: string[];
}

export interface Site {
  id: string;
  name: string;
  district: string;
  coordinates: { lat: number; lng: number };
  passedSafety: boolean;
  safety: number;
  sustainability: number;
  compatibility: number;
  capacity: number;
  waterSupply: number;
  waterDemand: number;
  remainingCapacity: number;
  distance: string;
  buildableArea: string;
  infrastructure: { label: string; time: string; icon: string }[];
  hazards: { label: string; status: string; score: number }[];
  metrics: Record<WeightKey, number>;
  terrain: { slope: string; elevation: string; soil: string; drainage: string };
  livelihood: string;
  environment: string;
  climate: { year: string; score: number }[];
  explanation: string;
}

export const weightLabels: Record<WeightKey, string> = {
  safety: "Safety",
  climate: "Future resilience",
  water: "Water availability",
  capacity: "Carrying capacity",
  infrastructure: "Infrastructure",
  livelihood: "Livelihood",
  environment: "Environment",
  social: "Social compatibility",
  cost: "Relocation cost",
};

export const defaultWeights: Record<WeightKey, number> = {
  safety: 25,
  climate: 15,
  water: 12,
  capacity: 12,
  infrastructure: 10,
  livelihood: 8,
  environment: 7,
  social: 6,
  cost: 5,
};

export const habitations: Habitation[] = [
  {
    id: "xyz-village",
    name: "XYZ Village",
    state: "Uttarakhand",
    district: "Pauri Garhwal",
    population: 8420,
    exposed: 7040,
    vulnerable: 3220,
    density: 418,
    primaryHazard: "Landslide",
    risk: 88,
    vulnerability: "High",
    priority: "IMMEDIATE",
    coordinates: { lat: 30.143, lng: 78.775 },
    hazards: [
      { label: "Flood", value: 72, color: "#2dd4bf" },
      { label: "Landslide", value: 91, color: "#fb7185" },
      { label: "Cloudburst", value: 64, color: "#fbbf24" },
      { label: "Historical", value: 83, color: "#fb923c" },
      { label: "Future risk", value: 79, color: "#a78bfa" },
    ],
    nearest: { hospital: "15 min", school: "8 min", road: "6 min", travelTime: "23 min to district HQ" },
    occupation: "Agriculture",
    history: "4 significant events in the last 10 years",
    why: ["High landslide exposure", "High population vulnerability", "Repeated historical events", "Poor emergency accessibility"],
  },
  {
    id: "kosi-bend",
    name: "Kosi Bend",
    state: "Uttarakhand",
    district: "Almora",
    population: 5680,
    exposed: 4920,
    vulnerable: 1840,
    density: 352,
    primaryHazard: "Flood",
    risk: 76,
    vulnerability: "High",
    priority: "SHORT-TERM",
    coordinates: { lat: 29.644, lng: 79.432 },
    hazards: [
      { label: "Flood", value: 88, color: "#38bdf8" },
      { label: "Landslide", value: 61, color: "#fb7185" },
      { label: "Cloudburst", value: 70, color: "#fbbf24" },
      { label: "Historical", value: 72, color: "#fb923c" },
      { label: "Future risk", value: 74, color: "#a78bfa" },
    ],
    nearest: { hospital: "18 min", school: "11 min", road: "4 min", travelTime: "31 min to district HQ" },
    occupation: "Horticulture",
    history: "3 significant events in the last 10 years",
    why: ["River-adjacent settlement", "Repeated seasonal inundation", "Vulnerable housing stock", "Limited all-weather road access"],
  },
  {
    id: "sundar-coast",
    name: "Sundar Coast",
    state: "Odisha",
    district: "Puri",
    population: 12750,
    exposed: 9820,
    vulnerable: 3960,
    density: 526,
    primaryHazard: "Coastal erosion",
    risk: 82,
    vulnerability: "High",
    priority: "IMMEDIATE",
    coordinates: { lat: 19.912, lng: 85.831 },
    hazards: [
      { label: "Flood", value: 69, color: "#38bdf8" },
      { label: "Landslide", value: 18, color: "#fb7185" },
      { label: "Storm surge", value: 94, color: "#f97316" },
      { label: "Historical", value: 86, color: "#fb923c" },
      { label: "Future risk", value: 91, color: "#a78bfa" },
    ],
    nearest: { hospital: "12 min", school: "7 min", road: "3 min", travelTime: "19 min to district HQ" },
    occupation: "Fishing & tourism",
    history: "5 significant events in the last 10 years",
    why: ["Active coastal erosion front", "Storm surge exposure", "High future sea-level scenario", "Critical livelihood transition required"],
  },
  {
    id: "narmada-lowlands",
    name: "Narmada Lowlands",
    state: "Madhya Pradesh",
    district: "Dhar",
    population: 4280,
    exposed: 2780,
    vulnerable: 960,
    density: 214,
    primaryHazard: "Flood",
    risk: 58,
    vulnerability: "Medium",
    priority: "MEDIUM-TERM",
    coordinates: { lat: 22.596, lng: 75.301 },
    hazards: [
      { label: "Flood", value: 66, color: "#38bdf8" },
      { label: "Landslide", value: 22, color: "#fb7185" },
      { label: "Heat stress", value: 73, color: "#fbbf24" },
      { label: "Historical", value: 48, color: "#fb923c" },
      { label: "Future risk", value: 64, color: "#a78bfa" },
    ],
    nearest: { hospital: "22 min", school: "10 min", road: "8 min", travelTime: "34 min to district HQ" },
    occupation: "Agriculture",
    history: "2 significant events in the last 10 years",
    why: ["Seasonal river overflow", "Moderate vulnerable population", "Heat exposure rising in scenario model"],
  },
  {
    id: "bastar-fringe",
    name: "Bastar Fringe",
    state: "Chhattisgarh",
    district: "Bastar",
    population: 3640,
    exposed: 1810,
    vulnerable: 1340,
    density: 146,
    primaryHazard: "Cloudburst",
    risk: 63,
    vulnerability: "High",
    priority: "SHORT-TERM",
    coordinates: { lat: 19.056, lng: 81.954 },
    hazards: [
      { label: "Flood", value: 51, color: "#38bdf8" },
      { label: "Landslide", value: 58, color: "#fb7185" },
      { label: "Cloudburst", value: 79, color: "#fbbf24" },
      { label: "Historical", value: 57, color: "#fb923c" },
      { label: "Future risk", value: 68, color: "#a78bfa" },
    ],
    nearest: { hospital: "29 min", school: "12 min", road: "14 min", travelTime: "41 min to district HQ" },
    occupation: "Forest produce",
    history: "3 significant events in the last 10 years",
    why: ["Cloudburst-triggered flash flood pathways", "Long emergency travel time", "Dispersed vulnerable households"],
  },
  {
    id: "brahmaputra-char",
    name: "Brahmaputra Char",
    state: "Assam",
    district: "Dibrugarh",
    population: 6890,
    exposed: 6010,
    vulnerable: 2680,
    density: 388,
    primaryHazard: "Flood",
    risk: 79,
    vulnerability: "High",
    priority: "IMMEDIATE",
    coordinates: { lat: 27.472, lng: 94.912 },
    hazards: [
      { label: "Flood", value: 96, color: "#38bdf8" },
      { label: "Landslide", value: 14, color: "#fb7185" },
      { label: "Cloudburst", value: 61, color: "#fbbf24" },
      { label: "Historical", value: 88, color: "#fb923c" },
      { label: "Future risk", value: 84, color: "#a78bfa" },
    ],
    nearest: { hospital: "26 min", school: "9 min", road: "17 min", travelTime: "38 min to district HQ" },
    occupation: "Agriculture",
    history: "6 significant events in the last 10 years",
    why: ["Extreme flood exposure", "Annual displacement pattern", "Insufficient raised shelter capacity", "Poor all-weather access"],
  },
];

export const sites: Site[] = [
  {
    id: "site-a",
    name: "Site A · Kandakhal Plateau",
    district: "Pauri Garhwal",
    coordinates: { lat: 30.207, lng: 78.684 },
    passedSafety: true,
    safety: 94,
    sustainability: 89,
    compatibility: 86,
    capacity: 10000,
    waterSupply: 1500000,
    waterDemand: 1200000,
    remainingCapacity: 1580,
    distance: "18.4 km",
    buildableArea: "42.6 ha",
    infrastructure: [
      { label: "Hospital", time: "15 min", icon: "hospital" },
      { label: "School", time: "8 min", icon: "school" },
      { label: "Main road", time: "6 min", icon: "road" },
      { label: "Market", time: "18 min", icon: "market" },
      { label: "Police", time: "20 min", icon: "police" },
      { label: "Fire station", time: "23 min", icon: "fire" },
    ],
    hazards: [
      { label: "Flood", status: "Low", score: 12 },
      { label: "Landslide", status: "Low", score: 9 },
      { label: "Cloudburst", status: "Moderate", score: 38 },
      { label: "Coastal", status: "Low", score: 0 },
    ],
    metrics: { safety: 94, climate: 86, water: 92, capacity: 91, infrastructure: 88, livelihood: 83, environment: 90, social: 86, cost: 78 },
    terrain: { slope: "4.2° average", elevation: "1,120 m", soil: "Stable loam", drainage: "High infiltration" },
    livelihood: "Agricultural land access: High · Market access: Good · Average commute: 18 min",
    environment: "LOW impact · outside mapped ecological sensitivity",
    climate: [{ year: "2026", score: 94 }, { year: "2030", score: 92 }, { year: "2040", score: 87 }, { year: "2050", score: 79 }],
    explanation: "Site A combines low multi-hazard exposure, sufficient carrying capacity, sustainable water availability, good healthcare and road accessibility, strong livelihood compatibility and lower projected future risk.",
  },
  {
    id: "site-b",
    name: "Site B · Dhanaulti East",
    district: "Pauri Garhwal",
    coordinates: { lat: 30.309, lng: 78.561 },
    passedSafety: true,
    safety: 91,
    sustainability: 88,
    compatibility: 84,
    capacity: 9200,
    waterSupply: 1380000,
    waterDemand: 1200000,
    remainingCapacity: 780,
    distance: "24.1 km",
    buildableArea: "36.2 ha",
    infrastructure: [
      { label: "Hospital", time: "19 min", icon: "hospital" },
      { label: "School", time: "11 min", icon: "school" },
      { label: "Main road", time: "8 min", icon: "road" },
      { label: "Market", time: "22 min", icon: "market" },
      { label: "Police", time: "23 min", icon: "police" },
      { label: "Fire station", time: "27 min", icon: "fire" },
    ],
    hazards: [
      { label: "Flood", status: "Low", score: 18 },
      { label: "Landslide", status: "Low", score: 16 },
      { label: "Cloudburst", status: "Moderate", score: 41 },
      { label: "Coastal", status: "Low", score: 0 },
    ],
    metrics: { safety: 91, climate: 87, water: 88, capacity: 86, infrastructure: 84, livelihood: 81, environment: 92, social: 84, cost: 82 },
    terrain: { slope: "6.8° average", elevation: "1,245 m", soil: "Sandy loam", drainage: "Moderate" },
    livelihood: "Agricultural land access: Medium · Market access: Good · Average commute: 22 min",
    environment: "LOW impact · minor agricultural conversion required",
    climate: [{ year: "2026", score: 91 }, { year: "2030", score: 89 }, { year: "2040", score: 84 }, { year: "2050", score: 81 }],
    explanation: "Site B offers strong safety and environmental performance with good road access, but its smaller capacity buffer makes it less flexible for population growth.",
  },
  {
    id: "site-c",
    name: "Site C · Devprayag North",
    district: "Pauri Garhwal",
    coordinates: { lat: 30.165, lng: 78.623 },
    passedSafety: true,
    safety: 88,
    sustainability: 84,
    compatibility: 82,
    capacity: 11800,
    waterSupply: 1460000,
    waterDemand: 1200000,
    remainingCapacity: 3380,
    distance: "21.8 km",
    buildableArea: "51.8 ha",
    infrastructure: [
      { label: "Hospital", time: "24 min", icon: "hospital" },
      { label: "School", time: "13 min", icon: "school" },
      { label: "Main road", time: "11 min", icon: "road" },
      { label: "Market", time: "21 min", icon: "market" },
      { label: "Police", time: "28 min", icon: "police" },
      { label: "Fire station", time: "31 min", icon: "fire" },
    ],
    hazards: [
      { label: "Flood", status: "Low", score: 22 },
      { label: "Landslide", status: "Moderate", score: 36 },
      { label: "Cloudburst", status: "Moderate", score: 44 },
      { label: "Coastal", status: "Low", score: 0 },
    ],
    metrics: { safety: 88, climate: 82, water: 90, capacity: 96, infrastructure: 78, livelihood: 76, environment: 86, social: 82, cost: 74 },
    terrain: { slope: "8.4° average", elevation: "985 m", soil: "Alluvial terrace", drainage: "High" },
    livelihood: "Agricultural land access: High · Market access: Moderate · Average commute: 24 min",
    environment: "LOW impact · existing settlement edge",
    climate: [{ year: "2026", score: 88 }, { year: "2030", score: 86 }, { year: "2040", score: 82 }, { year: "2050", score: 76 }],
    explanation: "Site C has the largest capacity buffer, but longer emergency travel times and moderate slope exposure reduce its suitability for immediate relocation.",
  },
  {
    id: "site-d",
    name: "Site D · Kotdwar West",
    district: "Pauri Garhwal",
    coordinates: { lat: 29.744, lng: 78.438 },
    passedSafety: false,
    safety: 69,
    sustainability: 73,
    compatibility: 72,
    capacity: 15200,
    waterSupply: 1580000,
    waterDemand: 1200000,
    remainingCapacity: 6780,
    distance: "68.2 km",
    buildableArea: "64.1 ha",
    infrastructure: [
      { label: "Hospital", time: "34 min", icon: "hospital" },
      { label: "School", time: "16 min", icon: "school" },
      { label: "Main road", time: "12 min", icon: "road" },
      { label: "Market", time: "26 min", icon: "market" },
      { label: "Police", time: "30 min", icon: "police" },
      { label: "Fire station", time: "36 min", icon: "fire" },
    ],
    hazards: [
      { label: "Flood", status: "High", score: 71 },
      { label: "Landslide", status: "Low", score: 12 },
      { label: "Cloudburst", status: "Moderate", score: 46 },
      { label: "Coastal", status: "Low", score: 0 },
    ],
    metrics: { safety: 69, climate: 71, water: 94, capacity: 98, infrastructure: 70, livelihood: 68, environment: 62, social: 72, cost: 81 },
    terrain: { slope: "3.2° average", elevation: "420 m", soil: "Alluvial", drainage: "Low in monsoon" },
    livelihood: "Agricultural land access: Medium · Market access: Good · Average commute: 35 min",
    environment: "MODERATE impact · floodplain conversion risk",
    climate: [{ year: "2026", score: 69 }, { year: "2030", score: 66 }, { year: "2040", score: 61 }, { year: "2050", score: 55 }],
    explanation: "Rejected by the hard safety filter due to floodplain exposure, despite strong capacity and water availability.",
  },
  {
    id: "site-e",
    name: "Site E · Lansdowne Ridge",
    district: "Pauri Garhwal",
    coordinates: { lat: 29.84, lng: 78.69 },
    passedSafety: false,
    safety: 62,
    sustainability: 70,
    compatibility: 74,
    capacity: 7600,
    waterSupply: 960000,
    waterDemand: 1200000,
    remainingCapacity: -820,
    distance: "41.5 km",
    buildableArea: "28.5 ha",
    infrastructure: [
      { label: "Hospital", time: "29 min", icon: "hospital" },
      { label: "School", time: "15 min", icon: "school" },
      { label: "Main road", time: "13 min", icon: "road" },
      { label: "Market", time: "31 min", icon: "market" },
      { label: "Police", time: "29 min", icon: "police" },
      { label: "Fire station", time: "39 min", icon: "fire" },
    ],
    hazards: [
      { label: "Flood", status: "Low", score: 8 },
      { label: "Landslide", status: "High", score: 74 },
      { label: "Cloudburst", status: "High", score: 68 },
      { label: "Coastal", status: "Low", score: 0 },
    ],
    metrics: { safety: 62, climate: 68, water: 48, capacity: 55, infrastructure: 73, livelihood: 75, environment: 78, social: 74, cost: 72 },
    terrain: { slope: "18.6° average", elevation: "1,780 m", soil: "Colluvial", drainage: "Rapid but unstable" },
    livelihood: "Agricultural land access: Low · Market access: Moderate · Average commute: 31 min",
    environment: "HIGH impact · unstable ridge and forest edge",
    climate: [{ year: "2026", score: 62 }, { year: "2030", score: 57 }, { year: "2040", score: 49 }, { year: "2050", score: 42 }],
    explanation: "Rejected due to high slope susceptibility and a negative water balance for the selected community.",
  },
  {
    id: "site-f",
    name: "Site F · Rishikesh Periphery",
    district: "Dehradun",
    coordinates: { lat: 30.06, lng: 78.25 },
    passedSafety: true,
    safety: 86,
    sustainability: 80,
    compatibility: 79,
    capacity: 13800,
    waterSupply: 1700000,
    waterDemand: 1200000,
    remainingCapacity: 5380,
    distance: "52.9 km",
    buildableArea: "59.2 ha",
    infrastructure: [
      { label: "Hospital", time: "11 min", icon: "hospital" },
      { label: "School", time: "6 min", icon: "school" },
      { label: "Main road", time: "4 min", icon: "road" },
      { label: "Market", time: "12 min", icon: "market" },
      { label: "Police", time: "15 min", icon: "police" },
      { label: "Fire station", time: "19 min", icon: "fire" },
    ],
    hazards: [
      { label: "Flood", status: "Moderate", score: 42 },
      { label: "Landslide", status: "Low", score: 11 },
      { label: "Cloudburst", status: "Moderate", score: 36 },
      { label: "Coastal", status: "Low", score: 0 },
    ],
    metrics: { safety: 86, climate: 76, water: 95, capacity: 98, infrastructure: 96, livelihood: 74, environment: 65, social: 77, cost: 66 },
    terrain: { slope: "2.9° average", elevation: "360 m", soil: "Sandy alluvium", drainage: "Moderate" },
    livelihood: "Agricultural land access: Medium · Market access: Excellent · Average commute: 15 min",
    environment: "MODERATE impact · higher land conversion pressure",
    climate: [{ year: "2026", score: 86 }, { year: "2030", score: 82 }, { year: "2040", score: 75 }, { year: "2050", score: 68 }],
    explanation: "Site F is operationally strong with the best infrastructure access, but its urban edge and land conversion pressure reduce long-horizon sustainability.",
  },
];

export const alerts = [
  { id: "a1", level: "critical", title: "High-risk habitation detected", body: "XYZ Village crossed the immediate relocation threshold at risk score 88.", time: "12 min ago", action: "Review risk assessment" },
  { id: "a2", level: "warning", title: "Candidate site capacity nearing threshold", body: "Site B has 780 people of modeled capacity buffer remaining.", time: "38 min ago", action: "Open site finder" },
  { id: "a3", level: "info", title: "Historical disaster event added", body: "A 2024 cloudburst event was added to the Pauri Garhwal demo timeline.", time: "2 hr ago", action: "View data sources" },
  { id: "a4", level: "critical", title: "Increasing landslide risk", body: "Scenario rainfall indicators increased the XYZ Village future risk contribution.", time: "4 hr ago", action: "Inspect risk engine" },
  { id: "a5", level: "warning", title: "Water capacity insufficient for projected population", body: "Site E fails the hard water balance check for this community.", time: "Yesterday", action: "Compare sites" },
];

export const sources = [
  { category: "Hazard data", name: "Multi-hazard demo index", type: "Raster-derived scores", frequency: "Scenario refresh", coverage: "6 sample districts", status: "DEMO DATA" },
  { category: "Geospatial", name: "Terrain & drainage model", type: "DEM / terrain", frequency: "Annual", coverage: "Indicative polygons", status: "DEMO DATA" },
  { category: "Demographic", name: "Habitation population register", type: "Population + vulnerability", frequency: "Census cycle", coverage: "6 sample habitations", status: "DEMO DATA" },
  { category: "Infrastructure", name: "Access network inventory", type: "Roads, hospitals, schools", frequency: "Quarterly", coverage: "Indicative travel times", status: "DEMO DATA" },
  { category: "Climate", name: "Future resilience scenarios", type: "2026–2050 projections", frequency: "Model scenario", coverage: "Community/site pairs", status: "SCENARIO" },
];

export const layerNames = [
  { id: "flood", label: "Flood risk", color: "#38bdf8" },
  { id: "landslide", label: "Landslide susceptibility", color: "#fb7185" },
  { id: "cloudburst", label: "Cloudburst risk", color: "#fbbf24" },
  { id: "coastal", label: "Coastal erosion", color: "#f97316" },
  { id: "events", label: "Historical events", color: "#a78bfa" },
  { id: "multihazard", label: "Multi-hazard risk", color: "#ef4444" },
];

export const priorityTone: Record<Priority, { label: string; className: string }> = {
  IMMEDIATE: { label: "Immediate", className: "risk-critical" },
  "SHORT-TERM": { label: "Short-term", className: "risk-high" },
  "MEDIUM-TERM": { label: "Medium-term", className: "risk-medium" },
};
