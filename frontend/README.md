# BuildVision — Construction Site Safety Monitoring Frontend

An AI-powered construction site safety dashboard, built with React, Vite, Tailwind CSS, and shadcn/ui-style components. It talks to a FastAPI backend (YOLO object detection + Gemini AI + SQLite) running at `http://127.0.0.1:8000`.

No fake or hardcoded data is used anywhere — every number on screen comes from the backend.

## Tech stack

- React 18 + Vite
- Tailwind CSS + shadcn/ui-style components (Radix primitives)
- Axios for API calls
- React Router v6
- lucide-react icons

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` and expects the FastAPI backend to be running at `http://127.0.0.1:8000`. To point at a different backend, copy `.env.example` to `.env` and change `VITE_API_BASE_URL`.

```bash
npm run build   # production build to /dist
npm run preview # preview the production build locally
```

## Project structure

```
src/
  assets/            static assets
  components/         reusable UI building blocks
    ui/               shadcn-style primitives (button, card, dialog, table, ...)
  hooks/               data-fetching hooks (useIncidents, useDashboardStats, useMonitoring)
  layouts/             DashboardLayout, Sidebar, Topbar
  lib/                 utils.js — cn(), formatters, normalizers
  pages/               route-level screens
  services/            Axios wrappers — one file per backend resource
  App.jsx              route table
  main.jsx             app entry point
```

## Backend contract

Confirmed endpoints used today:

- `GET /` — health check, surfaced as a connection indicator in the Topbar and Settings page.
- `GET /incidents` — the source of truth for the Dashboard, Incident History, and Incident Details. Dashboard stats (total incidents, risk counts, average safety score) are computed client-side from this list, so no separate stats endpoint is required.

Live Monitoring additionally expects (see `src/services/monitoringService.js` for the single place these are wired up):

- `POST /monitoring/start`
- `POST /monitoring/stop`
- `GET /monitoring/status` → `{ workers, helmet_compliance, vest_compliance, mask_compliance, safety_score, risk_level, recommendation, is_active }`
- `GET /monitoring/feed` → MJPEG/streamed image consumed directly by an `<img>` tag

If any of these aren't implemented yet, the UI degrades gracefully: it shows a clear "service unavailable" message and falls back to the most recent incident on record instead of fabricating numbers.

## Adding a new endpoint

1. Add a function to the relevant file in `src/services/` (or create a new one) that calls `api.get/post(...)` from `src/services/api.js`.
2. Wrap it in a hook under `src/hooks/` if a page needs loading/error state.
3. Consume the hook in a page or component.

Every request goes through the shared Axios instance in `src/services/api.js`, so base URL, timeouts, and error normalization stay consistent everywhere.
