# SURAKSHASETU

**AI + GIS Multi-Hazard Risk & Relocation Decision Support Platform**

SURAKSHASETU is a production-quality frontend prototype for the Smart India Hackathon 2026 disaster-management brief. It is designed as a decision-support system for state and district disaster-management teams: users select a vulnerable habitation, inspect transparent risk drivers, filter unsafe candidate sites, evaluate carrying capacity and water balance, and receive a ranked recommendation that still requires authority validation.

## Prototype status

This build is intentionally labeled **Demo Data**. The repository uses fictional, illustrative habitations, hazard values, infrastructure travel times, relocation sites, and scenario projections. It does not claim live government data, a trained ML model, legal red-zone declarations, certified hazard boundaries, or an official relocation order.

## Run locally

```bash
pnpm install
pnpm run dev
```

Validate and build for production:

```bash
pnpm run check
pnpm run build
```

The optional configuration keys are documented in `.env.example`. No API key is required for the demo experience; when live map tiles do not resolve, the frontend presents an interactive demo geometry layer instead of a static image or fabricated authority dataset.

## Architecture

The current project is a React + TypeScript + Tailwind frontend with client-side navigation and a separated mock-data layer. The primary modules are:

| Module | Responsibility |
| --- | --- |
| `client/src/App.tsx` | App shell, navigation, responsive layout, pages, and interaction state |
| `client/src/lib/demoData.ts` | Typed demo repository for habitations, hazards, relocation sites, alerts, and provenance |
| `client/src/components/Map.tsx` | Google Maps proxy integration supplied by the WebDev scaffold |
| `client/src/index.css` | Command-center design system, responsive rules, map fallback, and motion |

The UI is ready for a repository/service boundary to replace `demoData.ts` with API calls. A future full-stack deployment can add Node/Express routes, PostgreSQL/PostGIS repositories, geospatial processing, a Python risk service, and validated external dataset ingestion without redesigning the screens.

## Demo workflow

1. Open **Overview** and select a habitation from the map or queue.
2. Open **Risk assessment** to inspect hazard breakdown, exposure, vulnerability, historical context, and the expandable “Why this score?” explanation.
3. Open **Relocation site finder** to see the visible candidate → safety filter → ranked site pipeline.
4. Adjust suitability weights; the ranking recalculates immediately while the hard safety gate remains non-negotiable.
5. Open **Site A · Kandakhal Plateau** to inspect safety, sustainability, social compatibility, water, infrastructure, terrain, climate scenario, and explainable recommendation details.
6. Adjust relocation population or sustainable water supply in **Carrying capacity**; PASS/FAIL status and remaining capacity recalculate immediately.
7. Use **Relocation priority**, **Analytics**, **Alerts**, and **Data sources** for authority-facing planning context.

## Risk and suitability methodology

The demo risk score is deterministic and explainable. It combines hazard exposure, vulnerable population, density, building/access constraints, historical event frequency, and future scenario contribution. The site ranking uses configurable weights with the default distribution below:

| Factor | Default weight |
| --- | ---: |
| Safety | 25% |
| Future climate resilience | 15% |
| Water availability | 12% |
| Carrying capacity | 12% |
| Infrastructure accessibility | 10% |
| Economic / livelihood potential | 8% |
| Environmental sustainability | 7% |
| Social compatibility | 6% |
| Relocation cost | 5% |

The suitability score is a weighted normalized score across these factors. A candidate site can be rejected before ranking for extreme hazard exposure, insufficient water, unstable terrain, protected/ecologically critical conditions, or inadequate capacity.

## Future integration points

The planned backend contract can expose endpoints such as `GET /api/habitations`, `GET /api/risk/:habitationId`, `GET /api/red-zones`, `GET /api/relocation-sites`, `POST /api/relocation/recommend`, `POST /api/carrying-capacity/calculate`, and `GET /api/data-sources`. A PostGIS repository can replace the mock repository while preserving the typed frontend contract. The future ML service should expose deterministic feature inputs and explainable outputs before a validated model is introduced.

## Domain guardrail

Every recommendation is phrased as model-identified, recommended, scenario-based, or requiring authority validation. SURAKSHASETU is a planning and assessment tool, not an autonomous authority.
