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
- Batch 2 (done): IndexedDB layer (Dexie schema v1: projects, settings), repositories, Jalali date helpers.
- Batch 3 (done): project management (create, edit, archive/restore, delete, list with search and filters, detail page with nine tabs).
- Next: content items + manual workflow, then tasks and generation, planner, calendar, real dashboard data.

The dashboard still shows clearly marked sample data until content and tasks exist.
