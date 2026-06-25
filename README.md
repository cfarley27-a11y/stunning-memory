# Application Tracker

A local applicant tracking system for your own job search: **Applied → Interview Scheduled → Interviewed → Accepted / Rejected.**

- **Backend**: Express API, data persisted to a plain JSON file (`server/data/applications.json`) — no database setup required.
- **Frontend**: React (Vite) Kanban board. Drag cards between stages, click a card to edit it, log interviews (supports multiple rounds), and add offer/rejection notes.
- Everything runs on your machine — nothing is hosted or sent anywhere.

## Setup

```bash
npm run install:all
```

## Run

```bash
npm run dev
```

This starts the API on `http://localhost:4000` and the UI on `http://localhost:5173` (Vite proxies `/api` requests to the server). Open the UI URL in your browser.

## How data gets in

There's a manual "Add Application" form (company, role, job posting URL, applied date, notes). The job URL is stored as a clickable link back to the posting.

**On automatic status checking:** most company application portals (Greenhouse, Lever, Workday, etc.) don't expose a public API for candidates to poll status, and scraping a logged-in candidate portal reliably — without breaking on layout changes or violating a site's terms — isn't a sound approach. So this tool intentionally keeps status manual: you move the card yourself when you hear back, and the saved URL is there for a one-click check. If a specific platform you use *does* have a documented public API (e.g. you're polling your own Greenhouse job board), that could be added as a per-platform integration later.

## Deploying a public demo (e.g. for a portfolio)

This repo includes a `render.yaml` for deploying to [Render](https://render.com) as a single web service (one URL serves both the API and the built UI):

1. Push this repo to GitHub.
2. On Render: **New** → **Blueprint** → connect the repo. Render reads `render.yaml` automatically.
3. Deploy. Render builds the client and starts the Express server, which also serves the built frontend.

The `render.yaml` sets `DEMO_MODE=true`, which makes the server **reseed itself with fake sample applications on every boot** instead of using real data — safe to share publicly. It also enables a **"Reset Demo Data"** button in the UI so anyone using the live demo can put it back to a clean state.

Don't set `DEMO_MODE=true` for a deployment with your real data — it wipes whatever's stored every time the service restarts.

Render's free tier spins the service down after inactivity; the first request after a while takes ~30s to wake it back up.

## Project structure

```
server/   Express API + JSON file storage
client/   React (Vite) Kanban UI
```

## API

| Method | Path | Description |
|---|---|---|
| GET | `/api/applications` | List all applications |
| POST | `/api/applications` | Create an application |
| PATCH | `/api/applications/:id` | Update fields / change stage |
| DELETE | `/api/applications/:id` | Delete an application |
| POST | `/api/applications/:id/interviews` | Add an interview round |
| DELETE | `/api/applications/:id/interviews/:interviewId` | Remove an interview round |
