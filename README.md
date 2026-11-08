# MODARA (مدارا)

Persian (RTL), mobile-first content operations management app.
React + Vite + TypeScript, Zustand, local-first (IndexedDB via Dexie, added in Batch 2).

## Run
```
npm install
npm run dev
```

## Checks
```
npm run typecheck
npm run lint
npm run build
```

## Status
- Batch 1 (done): design system, RTL/Persian setup, app shell, sample-data dashboard.
- Batch 2 (done): IndexedDB layer (Dexie), repositories, Jalali date helpers.
- Batch 3 (done): project management.
- Batch 4 (done): content items, manual status workflow with history, list and production board, filters, duplicate, project content tab. Database schema v2.
- Next: tasks and production-task generation, daily planner, calendar, real dashboard data, first-run onboarding.

Workflow statuses change only when the user records a change; nothing moves automatically.
The dashboard still shows clearly marked sample data until tasks exist.
