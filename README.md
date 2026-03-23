# TruthLens — Fake News Detection Frontend

A production-grade React + Tailwind CSS SaaS frontend for the Explainable Multi-Modal Fake News Detection Platform.

## Stack
- **React 18** + **Vite**
- **Tailwind CSS v3** (custom design system)
- **Zustand** (state management + local persistence)
- **Recharts** (analytics charts)
- **Axios** (API client)
- **React Router v6**
- **Lucide React** (icons)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Project Structure
```
src/
├── components/
│   ├── common/        # Button, Card, Badge, Loader, Tooltip
│   ├── analyzer/      # InputBox, ResultCard, ExplanationPanel
│   ├── dashboard/     # KPIGrid, Charts, DataTable
│   └── layout/        # AppLayout, Sidebar, Navbar
├── pages/             # Home, Analyzer, Dashboard, History
├── hooks/             # useAnalyze, useDashboardStats
├── services/          # api.js (axios), analyzer.service.js
├── store/             # useAnalyzerStore (Zustand)
└── utils/             # helpers (cn, formatDate, getLabelConfig…)
```

## Environment Variables
```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=TruthLens
```

## API Integration
The frontend expects a backend at `VITE_API_BASE_URL` with:
- `POST /analyze` — `{ type: 'text'|'url', content: string }` → `AnalysisResult`
- `GET /history` — paginated history
- `GET /stats` — dashboard stats

If the backend is unavailable, a client-side mock kicks in automatically so the UI remains fully functional for development and demos.