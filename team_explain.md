# SURAKSHASETU — Team Presentation Document
> **Smart India Hackathon 2026 | Ministry of Home Affairs**
> AI + GIS Multi-Hazard Risk & Relocation Decision Support Platform

---

## 1. PROJECT OVERVIEW

### What is SurakshaSetu?
**SURAKSHASETU** ("Bridge of Safety") is a production-quality, GIS-powered decision-support platform for state and district disaster-management authorities. It solves a critical gap in India's disaster response: there is no unified, explainable system that tells disaster managers *who* is at risk, *where* they should go, and *why* that recommendation was made.

### Problem Statement
- **1,248+ habitations** across mountainous and coastal India face multi-hazard threats (floods, landslides, cloudbursts, coastal erosion).
- **2.84 lakh+ people** live in high-risk zones without a structured, data-backed relocation plan.
- Disaster managers currently rely on siloed datasets, paper maps, and expert opinion — no unified platform.
- Relocation decisions, if made incorrectly, are irreversible social and financial disasters.

### Our Solution
A 5-step **"Observe → Analyse → Recommend"** decision workflow:
```
Hazard Detection → Risk Assessment → Safety Filter → Site Sustainability → Authority Decision
```

### Target Users
- State Disaster Management Authorities (SDMA)
- District Collectors and Emergency Officers
- Ministry of Home Affairs (MHA) disaster cell
- National Disaster Management Authority (NDMA) analysts

---

## 2. SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                      SURAKSHASETU Platform                       │
├──────────────────────────┬──────────────────────────────────────┤
│     FRONTEND (React)     │         BACKEND (FastAPI)            │
│  TypeScript + Vite       │         Python 3.x                   │
│  MapLibre GL JS (GIS)    │         Open-Meteo API               │
│  Lucide React (Icons)    │         Scikit-learn (ML-ready)      │
│  Sonner (Toasts)         │         Pandas, SQLAlchemy           │
│  Shadcn/ui Components    │         Uvicorn (ASGI Server)        │
└──────────────────────────┴──────────────────────────────────────┘
                           │
                    REST API Layer
              GET /api/landslide/hazard/{lat}/{lon}
              GET /api/landslide/susceptibility/{lat}/{lon}
              GET /api/landslide/trigger/{lat}/{lon}
              GET /api/landslide/data-status
```

### Repository Structure
```
SIH26/
├── backend/                    ← Python FastAPI backend
│   ├── app/
│   │   ├── main.py             ← FastAPI app entry point
│   │   ├── api/routes/
│   │   │   ├── hazard.py       ← Combined hazard score endpoint
│   │   │   ├── susceptibility.py ← Terrain susceptibility model
│   │   │   ├── trigger.py      ← Live rainfall + soil moisture (Open-Meteo)
│   │   │   └── data_status.py  ← Data pipeline health check
│   │   ├── models/             ← Data models (Pydantic schemas)
│   │   ├── services/           ← Business logic layer
│   │   └── ml/                 ← ML model placeholder
│   └── requirements.txt
│
└── surakshasetu/               ← React + TypeScript frontend
    ├── client/
    │   ├── src/
    │   │   ├── App.tsx         ← All pages and UI logic (~3000 lines)
    │   │   ├── components/
    │   │   │   ├── GISMap.tsx  ← MapLibre GL interactive map
    │   │   │   └── Map.tsx     ← Maps integration proxy
    │   │   ├── lib/
    │   │   │   ├── demoData.ts ← All typed demo data (habitations, sites)
    │   │   │   └── utils.ts    ← Helper utilities
    │   │   └── index.css       ← Full design system tokens
    │   └── index.html
    └── package.json
```

---

## 3. COMPLETE USER FLOW

### Step-by-Step Decision Workflow

```
[01] HAZARD DETECTION      → Which habitations are exposed to which hazards?
         ↓
[02] RISK & VULNERABILITY  → How severe is the risk? Who is vulnerable?
         ↓
[03] HARD SAFETY FILTER    → Which relocation sites pass the non-negotiable gates?
         ↓
[04] SITE SUSTAINABILITY   → Can the site sustain the population for decades?
         ↓
[05] AUTHORITY DECISION    → Final human authority validation before action.
```

### Navigation Structure (Sidebar)

| Group | Pages |
|---|---|
| **Command Center** | Overview Dashboard, Multi-Hazard Map, Risk Assessment |
| **Relocation Planning** | Relocation Site Finder, Carrying Capacity Engine, Relocation Priority |
| **Intelligence** | Landslide Model (live API), Analytics, Alert Center, Data Sources |
| **System** | System Configuration |

---

## 4. UI DETAILS — PAGE BY PAGE

### 4.1 Overview Dashboard (`/overview`)
**Purpose:** Single command-center view of the entire situation.

**Key UI Elements:**
- **6 KPI Stat Cards** across the top:
  - *Habitations monitored* — 1,248 across 14 districts
  - *High-risk habitations* — 186 (15% of monitored), with "needs action" trend
  - *Population at risk* — 2.84 Lakh (from exposure model)
  - *Immediate priority* — 42 habitations requiring authority review
  - *Candidate safe sites* — 317 (after base filter)
  - *Capacity available* — 4.72 Lakh (modeled buffer)
- **Planning Extent Filter** — dropdown for State and District selection
- **Multi-Hazard Map Panel** (compact) — interactive satellite map with risk zone overlays
- **Risk Snapshot Card** — shows the currently selected habitation's risk score + population data
- **Decision Workflow Card** — Live 5-step progress indicator (steps 1–3 complete, step 4 active)
- **Priority Preview Table** — Top 4 high-risk habitations in a sortable table
- **Alert Preview** — 3 latest alerts with severity badges

### 4.2 Multi-Hazard Map (`/map`)
**Purpose:** Explore the full GIS operating picture.

**Key UI Elements:**
- **Full GISMap** — MapLibre GL JS satellite imagery centered on India (lat: 22°N, lon: 79°E)
- **India-Bounded Map** — `maxBounds: [[68.0, 6.5], [97.5, 36.0]]` — cannot scroll outside India
- **Risk Zone Overlays (GeoJSON polygons):**
  - 🔴 **Himalayan Region** — Very High risk (steep slopes + tectonic activity)
  - 🔴 **Chota Nagpur Plateau** — High risk (mining + terrain)
  - 🟡 **Western Ghats** — Moderate–High risk (monsoon-prone)
  - 🟢 **Central Plains** — Low risk (stable terrain)
- **Layer Control Panel** (top-right) — Toggle flood, landslide, multihazard, and other layers
- **Legend Panel** (bottom-left) — Color-coded habitation risk key
- **Selected Habitation Card** (bottom-right) — Live habitation details + risk badge
- **Click interaction** — Click any zone to get a popup with risk level + description

### 4.3 Risk Assessment (`/risk`)
**Purpose:** Transparent, explainable risk breakdown for a selected habitation.

**Key UI Elements:**
- **Habitation Selector** — dropdown to switch between all monitored habitations
- **Risk Score Display** — Large numeric score (e.g., 87/100) with Risk Badge (Critical/High/Moderate/Low)
- **Hazard Breakdown Bars** — Progress bars for each hazard type (flood, landslide, etc.) with color and value
- **"Why this score?" Panel** — Expandable panel with numbered explanations (explainable AI principle):
  - "Flood zone at 95% capacity"
  - "100% population exposed"
  - "No alternate road access"
  - "3 major events in 5 years"
- **Population & Vulnerability Panel** — Total, exposed, vulnerable populations + density
- **Emergency Accessibility Panel** — Distances to nearest hospital, road link, helipad
- **Historical Context** — Amber callout box with historical events and primary occupation

### 4.4 Relocation Site Finder (`/sites`)
**Purpose:** Find and rank the safest, most sustainable relocation sites.

**Key UI Elements:**
- **Pipeline Stats** (3 cards): Candidate Areas (100) → Passed Safety Filter (32) → Ranked Sites (N)
- **Source Habitation Selector** — Select which community to relocate
- **Filter Dropdown** — All modeled sites / Passed / Rejected
- **"Run Suitability Engine" Button** — Triggers ranking recalculation
- **Ranked Site List** — Each site row shows:
  - Rank badge (⭐ for #1)
  - Site name + Pass/Fail safety chip
  - Distance, Capacity, Water supply
  - Weighted suitability score (big number on right)
  - "Open detail →" button to Carrying Capacity
- **Adjustable Weight Sliders** (right panel) — 9 weight categories:
  - Safety (25%), Future Climate Resilience (15%), Water Availability (12%)
  - Carrying Capacity (12%), Infrastructure (10%), Economic/Livelihood (8%)
  - Environmental Sustainability (7%), Social Compatibility (6%), Relocation Cost (5%)
- **Two-Score Concept Display** — Safety Score vs Sustainability Score side-by-side
- **Hard Filter Warning Banner** — Non-negotiable safety gate explanation

**Ranking Algorithm:**
```typescript
weightedScore = Σ (site.metrics[factor] × weight[factor]) / totalWeight
```
Sites are sorted by weightedScore descending; safety filter is applied BEFORE ranking.

### 4.5 Carrying Capacity Engine (`/capacity`)
**Purpose:** Determine if the chosen site can physically sustain the relocated population.

**Key UI Elements:**
- **3 Score Cards** — Safety Score / Sustainability Score / Community Compatibility
- **Dynamic Feasibility Calculator:**
  - Input: Population to relocate (slider: 1,000 – 16,000)
  - Input: Sustainable water supply (slider: 0.5M – 2.2M L/day)
  - Outputs: Estimated capacity, Remaining capacity
  - Formula: `capacity = min(site.capacity, waterSupply / 142)`
  - Standard: 142 L/person/day (CPHEEO norms)
- **PASS / FAIL Status Card** — Green if `remaining ≥ 0 && waterSupply ≥ population * 142 && site.passedSafety`
- **Water Assessment Panel** — Supply vs Demand progress bars + water balance gauge
- **Infrastructure Accessibility** — Travel time to hospital, school, road, fire station, police
- **Terrain & Safeguards** — Slope, geology, buildable area, flood/seismic classification
- **Future Resilience Note** — `Climate score today (e.g., 82) → 2050 projection (e.g., 71)`
- **"Why this site?" Explanation** — Plain-language narrative (explainable recommendation)
- **Export Button** — Demo export of assessment report

### 4.6 Relocation Priority (`/priority`)
**Purpose:** Authority-facing planning queue across all habitations.

**Key UI Elements:**
- **Priority Queue Stats:** Immediate (42) / Short-term (86) / Medium-term (58)
- **Full Data Table** with sorting and filter:
  - Columns: Habitation | Risk Score | Population | Vulnerability | Priority | Recommended Site | Action
  - Priority Pills: 🔴 IMMEDIATE / 🟡 SHORT-TERM / 🟠 MEDIUM-TERM
  - Clicking a row selects the habitation and highlights the row
  - "Inspect →" button opens Risk Assessment for that habitation

### 4.7 Landslide Intelligence Engine (`/landslide`)
**Purpose:** Real-time landslide hazard detection using live backend API.

**Key UI Elements:**
- **Interactive GIS Map** — Click any location in India to query the backend
- **Live API Call Flow:**
  ```
  User clicks map
      → Frontend: GET http://localhost:8000/api/landslide/hazard/{lat}/{lon}
      → Backend computes: susceptibility + trigger + soil moisture + ground movement
      → Returns: hazard_score, level (LOW/MODERATE/ELEVATED/HIGH/CRITICAL), explanation[]
  ```
- **Hazard Score Display** — Big numeric score with color-coded level
- **Component Breakdown** — Individual scores for susceptibility, trigger, soil moisture, ground movement
- **Explanation List** — Auto-generated human-readable explanations
- **Recommendation Banner** — "Field verification recommended" / "Normal monitoring"
- **Fallback Mode** — If backend is down, uses hardcoded demo data with a warning banner
- **Simulating / Loading State** — Spinner while API call is in progress

### 4.8 Analytics (`/analytics`)
**Purpose:** Planning-grade charts with clear data labeling.

**Key UI Elements:**
- **District Dropdown Filter**
- **Risk Distribution Donut Chart** — Critical / High / Moderate / Low percentages
- **Future Risk Trend Bar Chart** — 2026 → 2030 → 2040 → 2050 projected scores (gradient bars)
- **Exposure by Hazard Type** — Horizontal bars for Flood (72%), Landslide (58%), Cloudburst (44%), Coastal (29%)
- **Readiness & Capacity Bars** — Relocation capacity available / Water pass rate / Infrastructure readiness

### 4.9 Alert Center (`/alerts`)
**Purpose:** Monitor incoming risk signals and link them to actionable assessments.

**Key UI Elements:**
- **Alert List** — Full alert cards with severity icons (🔴 Critical, 🟡 Warning, 🔵 Info)
- **Active Monitoring Rules Panel** — Risk score threshold (≥ 80), water threshold (< 1M L/day), etc.
- **Actionable Links** — Each alert has a "View assessment →" or "Check capacity →" button
- **Advisory Disclaimer** — "No automatic public warning is issued by this prototype"

### 4.10 Data Sources (`/sources`)
**Purpose:** Full transparency on what data the platform uses.

**Key UI Elements:**
- **Source Registry Table** — Category / Dataset / Type / Update Frequency / Coverage / Status
- **Data Pipeline Flowchart** — 8-step pipeline from raw data to dashboard
- **Domain Guardrail Panel** — Checklist of what the system is/isn't authorized to do

### 4.11 Settings (`/settings`)
**Purpose:** Configure planning extent and prototype controls.

**Key UI Elements:**
- **Default Geography Selectors** — State, District, Scenario Horizon (2030/2040/2050)
- **Safety Toggles** — Demo data watermark, authority validation note, weight adjustment permission

---

## 5. BACKEND DETAILS

### Technology Stack
| Component | Technology |
|---|---|
| **Framework** | FastAPI (Python) |
| **Server** | Uvicorn (ASGI) |
| **HTTP Client** | httpx (for Open-Meteo API) |
| **Data Layer** | SQLAlchemy + Pydantic |
| **ML Framework** | scikit-learn (plugged in, ready) |
| **Data Processing** | pandas |
| **Testing** | pytest |

### API Endpoints

#### `GET /api/landslide/susceptibility/{lat}/{lon}`
Returns terrain-based landslide susceptibility score.
```json
{
  "location": { "lat": 30.5, "lon": 78.2 },
  "susceptibility_score": 78,
  "class": "High",
  "features": {
    "slope": { "value": 34.5, "contribution": "High" },
    "elevation": { "value": 2100.0, "contribution": "Moderate" },
    "geology": { "value": "Fractured Schist", "contribution": "High" }
  },
  "mode": "DEMO"
}
```
- **Phase 1:** Simulated Random Forest model output (geospatially aware in Phase 2)
- **Score range:** 0–100 → Very Low / Low / Moderate / High / Very High

#### `GET /api/landslide/trigger/{lat}/{lon}`
Fetches **LIVE** rainfall and soil moisture data from Open-Meteo API.
```json
{
  "location": { "lat": 30.5, "lon": 78.2 },
  "trigger_score": 64,
  "soil_moisture_score": 81,
  "rainfall_data": {
    "1h": 12.4,
    "24h": 45.8,
    "7d": 312.5
  },
  "mode": "LIVE"
}
```
- **Open-Meteo fields used:** `current.precipitation`, `current.soil_moisture_0_to_7cm`, `daily.precipitation_sum`
- **Soil moisture conversion:** `score = min((raw_m3/m3 / 0.45) * 100, 100)`
- **Trigger formula:** `min((7d_rain × 0.4) + (24h_rain × 0.4) + (soil_moisture × 0.2), 100)`
- **Fallback:** If API fails → graceful fallback to demo data (mode: `FALLBACK-DEMO`)

#### `GET /api/landslide/hazard/{lat}/{lon}`
Combines all signals into a unified hazard score.
```json
{
  "location": { "lat": 30.5, "lon": 78.2 },
  "hazard_score": 73,
  "level": "HIGH",
  "components": {
    "susceptibility": 78,
    "trigger": 64,
    "soil_moisture": 81,
    "ground_movement": 67,
    "detection_confidence": 42
  },
  "explanation": [
    "High terrain susceptibility.",
    "Elevated rainfall conditions.",
    "High soil moisture.",
    "Stable ground deformation."
  ],
  "recommendation": "Field verification recommended."
}
```

**Hazard Score Formula:**
```python
hazard_score = (susceptibility × 0.30) + (trigger × 0.25) + (soil_moisture × 0.15)
             + (ground_movement × 0.20) + (detection_confidence × 0.10)
```

**Risk Level Classification:**
| Score | Level |
|---|---|
| 0–19 | LOW |
| 20–39 | MODERATE |
| 40–59 | ELEVATED |
| 60–79 | HIGH |
| 80–100 | CRITICAL |

#### `GET /api/landslide/data-status`
Returns pipeline health (data freshness, API connectivity status).

### CORS Configuration
```python
allow_origins=["*"]    # Restrict to specific origins in production
allow_methods=["*"]
allow_headers=["*"]
```

---

## 6. GIS MAP DETAILS

### Map Technology
- **Library:** MapLibre GL JS (open-source, no API key required)
- **Base Map:** ESRI World Imagery (satellite tiles)
- **Data Format:** GeoJSON for all vector overlays

### India Constraint
```javascript
maxBounds: [[68.0, 6.5], [97.5, 36.0]]  // Prevents panning outside India
minZoom: 4                                 // Prevents zooming out too far
center: [79.0, 22.0]                      // Centered on India
```

### Risk Zone Overlays
| Region | Risk Level | Color | Coverage |
|---|---|---|---|
| Himalayan Region | HIGH | 🔴 `#e74c3c` | J&K to Arunachal Pradesh |
| Chota Nagpur Plateau | HIGH | 🔴 `#e74c3c` | Jharkhand / Chhattisgarh |
| Western Ghats | MEDIUM | 🟡 `#f1c40f` | Kerala to Goa coast |
| Central Plains | LOW | 🟢 `#2ecc71` | MP / UP plains |

### India Mask
- Loads `india.geojson` to create an **inverted world mask** — everything outside India is darkened (80% opacity)
- Country borders rendered as faint grey lines (`#222222`)

### Click Interaction
```javascript
map.on("click", e => {
  onLocationClick({ lat: e.lngLat.lat, lon: e.lngLat.lng });
  // Adds red circle marker at clicked location
});
```

---

## 7. RISK & RELOCATION METHODOLOGY

### Habitation Risk Score
The risk score (0–100) is computed from:
| Factor | Contribution |
|---|---|
| Primary hazard exposure | High |
| Vulnerable population ratio | High |
| Population density | Moderate |
| Building/access constraints | Moderate |
| Historical event frequency | High |
| Future climate scenario delta | Moderate |

### Site Suitability Score
Configurable weighted scoring (defaults):
| Factor | Default Weight |
|---|---|
| Safety | 25% |
| Future climate resilience | 15% |
| Water availability | 12% |
| Carrying capacity | 12% |
| Infrastructure accessibility | 10% |
| Economic / livelihood potential | 8% |
| Environmental sustainability | 7% |
| Social compatibility | 6% |
| Relocation cost | 5% |

### Hard Safety Filter (Non-Negotiable)
A site is **automatically rejected** if it has:
- Extreme flood or landslide exposure
- Active erosion or slope instability
- Insufficient sustainable water supply
- Protected/ecologically critical conditions
- Inadequate carrying capacity

### Carrying Capacity Formula
```
capacity = min(site.buildable_capacity, waterSupply / 142)
remaining = capacity - population_to_relocate
PASS = remaining >= 0 AND water_balance >= 0 AND site.passedSafety == true
```
*(142 L/person/day = CPHEEO per-capita standard)*

---

## 8. DESIGN SYSTEM

### Color Palette
| Use | Color | Hex |
|---|---|---|
| Background | Deep Navy | `#08111f` |
| Sidebar | Dark Blue | `#0b1628` |
| Panel background | Card Dark | `#0d1a2d` |
| Primary accent | Cyan | `#22d3ee` / `cyan-300` |
| Critical risk | Rose Red | `#fb7185` |
| High risk | Orange | `#fb923c` |
| Warning | Amber | `#fbbf24` |
| Safe / Pass | Emerald | `#34d399` |
| Text primary | White | `#ffffff` |
| Text secondary | Slate-400 | `#94a3b8` |
| Text muted | Slate-600 | `#475569` |

### Typography
- **System font stack** via `font-display` (Inter/system)
- **Brand mark:** SURAKSHA**SETU** (cyan accent on SETU)
- **Eyebrows:** 10px UPPERCASE, tracking-[0.18em], slate-600
- **Section titles:** 14px semibold, white

### Risk Badge Classes
```css
.risk-critical → rose background  (score ≥ 80)
.risk-high     → orange background (score ≥ 65)
.risk-medium   → amber background  (score ≥ 45)
.risk-low      → emerald background (score < 45)
```

### Key Reusable Components
| Component | Purpose |
|---|---|
| `StatCard` | KPI metric with icon, trend arrows |
| `RiskBadge` | Color-coded risk level pill |
| `MapPanel` | GIS map with layers and legend |
| `SiteRow` | Ranked relocation site row |
| `ScoreCard` | Large score display (safety/sustainability) |
| `ProgressBar` | Colored progress indicator |
| `PipelineStat` | Pipeline funnel metrics |
| `AlertRow` | Alert card with severity icon |

---

## 9. KEY TECHNICAL DECISIONS

### Why FastAPI (backend)?
- Async-capable, perfect for real-time weather API calls
- Auto-generated OpenAPI/Swagger docs
- Type-safe via Pydantic
- ML model integration ready (scikit-learn)

### Why MapLibre GL JS?
- Open-source (no Google Maps billing)
- Full GeoJSON + vector tile support
- India-only bounds enforcement
- Custom layer compositing (satellite + risk overlays + country masks)

### Why React + TypeScript (frontend)?
- Strong typing across habitation/site data models
- Component reusability for 11 different pages
- `useMemo` for live ranking recalculation without re-renders

### Why Open-Meteo API?
- Free, no API key required
- Provides live precipitation and soil moisture data globally
- Graceful fallback to demo mode if unavailable

### Explainability Principle
Every recommendation in the system is:
1. **Transparent** — shows the factors and their weights
2. **Deterministic** — same inputs always give same outputs
3. **Labeled** — all demo data is clearly marked as demo
4. **Qualified** — every recommendation says "requires authority validation"

---

## 10. FUTURE ROADMAP (Production Integration Points)

### Planned Backend Endpoints
```
GET  /api/habitations                     → List all monitored habitations
GET  /api/risk/:habitationId              → Full risk breakdown for one habitation
GET  /api/red-zones                       → Declared legally no-go zones
GET  /api/relocation-sites                → Candidate sites with full datasets
POST /api/relocation/recommend            → Run full recommendation pipeline
POST /api/carrying-capacity/calculate     → Dynamic feasibility check
GET  /api/data-sources                    → Dataset health and freshness
```

### Phase 2 Upgrades
| Feature | Description |
|---|---|
| **Real Susceptibility Model** | Train Random Forest on ISRO BHUKOSH + NRSC DEM data |
| **PostGIS Repository** | Replace demoData.ts with spatial SQL queries |
| **User Authentication** | Role-based access (analyst / authority / field officer) |
| **Export to PDF** | Government-format assessment reports |
| **Real-time Alerts** | NDMA API + IMD API integration |
| **Mobile App** | Field officer companion app for ground verification |
| **Offline Mode** | Cached tile sets for flood-affected connectivity zones |

---

## 11. DEMO SCRIPT (For Live Presentation)

### 5-Minute Demo Flow
1. **Start at Overview** → Show the 6 KPI cards → "1,248 habitations, 2.84 lakh people at risk"
2. **Click "Multi-Hazard Map"** → Toggle flood/landslide layers → Click a risk zone → Show popup
3. **Select a habitation** (e.g., XYZ Village) → Click "View full assessment"
4. **Risk Assessment page** → Show the 87/100 score → Expand "Why this score?" panel
5. **Click "Find relocation sites"** → Show 100 → 32 → ranked sites pipeline
6. **Adjust weight sliders** → Watch ranking update in real-time
7. **Click "Open detail" on Site A** → Show carrying capacity PASS result
8. **Go to Landslide page** → Click on Uttarakhand → Show live API call → Show hazard score
9. **Go to Analytics** → Show risk distribution + 2026→2050 trend projection

---

## 12. TEAM HIGHLIGHTS

### What Makes Our Solution Stand Out?

| Feature | SurakshaSetu | Typical Approach |
|---|---|---|
| **Explainability** | Every score shows "Why?" | Black-box model |
| **Non-negotiable safety** | Hard filter before ranking | Rankings can ignore safety |
| **Live data** | Open-Meteo real-time rainfall | Static spreadsheets |
| **India-constrained GIS** | Restricted to India bounds | Generic world map |
| **Production-ready arch** | REST API + React + FastAPI | Static prototype |
| **Authority guardrail** | "Requires authority validation" built-in | Automated decisions |
| **Dual scoring** | Safety + Sustainability separate | Single composite score |
| **Water balance engine** | 142 L/day CPHEEO standard | Population count only |

---

*Document prepared for SIH 2026 Team Presentation.*
*All demo data is fictional and clearly labeled. SurakshaSetu is a planning-support tool and does not issue government orders.*
