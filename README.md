# Application Tracker

A local applicant tracking system for your own job search: **Applied → Interview Scheduled → Interviewed → Accepted / Rejected.**

- **Backend**: Express API, data persisted to a plain JSON file (`server/data/applications.json`) — no database setup required.
- **Frontend**: React (Vite) Kanban board. Drag cards between stages, click a card to edit it, log interviews (supports multiple rounds), and add offer/rejection notes.
- A **funnel metrics bar** (Response Rate, Interview Rate, Offer Rate, Win Rate) turns raw application records into the conversion numbers a job search actually runs on.
- Everything runs on your machine — nothing is hosted or sent anywhere.

## Why I built this

Most job-search tracking happens in a spreadsheet that nobody re-opens after row 15. The problem isn't storage, it's that a spreadsheet doesn't tell you anything — it's a list, not a funnel. I wanted something that would surface the same question a product manager asks about any pipeline: **where are applications actually dying, and is that a top-of-funnel problem (not enough responses) or a bottom-of-funnel one (interviewing fine, not closing)?**

**Who it's for:** an individual job seeker tracking their own applications — not a recruiting team managing candidates across many open reqs. That distinction drove most of the scope decisions below.

**Success metric:** if a user can glance at the stats bar and immediately say "my response rate is fine but my interview-to-offer conversion is weak, so I should work on later-round prep, not on sending more applications" — the tool did its job. Raw card counts don't do that; conversion rates do.

### Key scope decisions

- **Manual status entry, not auto-scraping.** Most ATS portals (Greenhouse, Lever, Workday) don't expose a public status API to candidates, and scraping a logged-in candidate portal is brittle and often against terms of service. Rather than ship a feature that silently breaks, I scoped it out and kept a one-click link back to the posting instead. For an individual-use tool, the cost of one manual click per status change is low; the cost of a flaky scraper that gives false confidence is high.
- **A JSON file, not a database.** At the scale of one person's job search (dozens, not millions, of records), a database adds setup friction with no real benefit. The tradeoff only flips if this became multi-user — which it isn't designed to be.
- **Stage-derived metrics, not an event log.** The funnel numbers are computed from each application's *current* stage rather than a full history of every transition. That's simpler to build and reason about, and accurate for the questions this tool answers (rates, not velocity). If "time spent per stage" became a priority metric, that would require logging transitions with timestamps — a deliberate v2, not a v1 requirement.

### What's next (if I kept building)

- Track *time in stage* (e.g. median days from Applied → first response) to diagnose pace, not just conversion.
- Segment metrics by source (referral vs. cold apply vs. recruiter outreach) to see which channel actually converts.
- A "stale application" flag — anything sitting in Applied past some threshold with no response, since that's a different problem than a low response rate.

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

## Deploying (Render)

This repo includes a `render.yaml` for deploying to [Render](https://render.com) as a single web service (one URL serves both the API and the built UI):

1. Push this repo to GitHub.
2. On Render: **New** → **Blueprint** → connect the repo. Render reads `render.yaml` automatically.
3. Deploy. Render builds the client and starts the Express server, which also serves the built frontend.

`render.yaml` ships with `DEMO_MODE=false` — a fresh deploy uses real persisted storage, not fake sample data.

### Storage: why you need `DATABASE_URL`

Render's free web service plan has an **ephemeral filesystem** — anything written to disk (including the `server/data/applications.json` file used in local dev) is wiped on every redeploy and likely on every restart. That's fine for a throwaway demo; it's not fine for real data you want to keep.

To persist real data, this app talks to Postgres whenever a `DATABASE_URL` env var is set (falls back to the local JSON file when it isn't, which is what local dev uses). A free Postgres instance is enough for personal-scale use:

1. Create a free Postgres database — [Neon](https://neon.tech) or [Supabase](https://supabase.com) both have a free tier. Copy the connection string they give you (it looks like `postgresql://user:pass@host/dbname?sslmode=require`).
2. On your Render service: **Environment** tab → add `DATABASE_URL` with that connection string. (It's deliberately left out of `render.yaml` so the secret never lands in git.)
3. Redeploy (or just restart the service) so it picks up the new env var. The server creates its own table on first boot — no manual schema setup needed.

From then on, your data survives redeploys, restarts, and the free tier spinning down from inactivity.

### Privacy note

This app ships with **no login**. If you're using it for your own real job search on a public Render URL, anyone who has that URL can view and edit your data. Don't share the link, and don't link to it from anything public (portfolio site, resume, etc.) unless you've added an auth layer in front of it.

### Demo mode (optional, for a public portfolio link)

Setting `DEMO_MODE=true` makes the server **reseed itself with fake sample applications on every boot**, and enables a "Reset Demo Data" button in the UI — safe to share publicly, since nothing typed in persists or matters. Use this only on a *separate* deployment meant to showcase the project, not on the one holding your real data — demo mode wipes whatever's stored on every restart.

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
