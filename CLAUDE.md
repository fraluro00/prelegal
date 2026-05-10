# Prelegal Project

## Overview

This is a SaaS product to allow users to draft legal agreements based on templates in the templates directory.
The user can carry out AI chat in order to establish what document they want and how to fill in the fields.
The available documents are covered in the catalog.json file in the project root, included here:

@catalog.json

The initial prototype was frontend-only, supporting Mutual NDA with no AI chat. PL-4 added the full V1 technical foundation. PL-5 replaced the static form with an AI chat interface. PL-6 expanded to all 12 supported document types with a catalog landing page. PL-7 added real authentication, per-user document history, draft disclaimers, and UI polish. PL-8 migrated hosting to Render + Vercel + Supabase and hardened security.

## Development process

When instructed to build a feature:
1. Use your Atlassian tools to read the feature instructions from Jira
2. Develop the feature - do not skip any step from the feature-dev 7 step process
3. Thoroughly test the feature with unit tests and integration tests and fix any issues
4. Submit a PR using your github tools

## AI design

When writing code to make calls to LLMs, use your Cerebras skill to use LiteLLM via OpenRouter to the `openrouter/openai/gpt-oss-120b` model with Cerebras as the inference provider. You should use Structured Outputs so that you can interpret the results and populate fields in the legal document.

There is an OPENROUTER_API_KEY in the .env file in the project root.

## Technical design

### Hosting (production)
- Frontend: Vercel — https://prelegal-gamma.vercel.app (Next.js static export)
- Backend: Render free tier — Docker container (`backend/Dockerfile`), auto-deploys on push to `main`
- Database: Supabase PostgreSQL free tier — tables auto-created on startup via `init_db()`
- Rate limit state: Upstash Redis free tier — shared across restarts via `REDIS_URL` env var

### Local development
The root `Dockerfile` is a multi-stage build (Node builds static frontend, Python/uv serves it via FastAPI) for running the full stack locally.  
The backend is in `backend/` as a uv project using FastAPI; run with `uv run uvicorn app.main:app`.  
The database uses PostgreSQL via `DATABASE_URL` env var. Has `users` and `documents` tables. Auth uses bcrypt + PyJWT (Bearer tokens, 7-day expiry). JWT `sub` must be a string (PyJWT 2.12+ requirement).  
The frontend is in `frontend/`, statically built (`output: 'export'`).  
Scripts are in `scripts/` for:
```bash
# Mac
scripts/start-mac.sh    # Start
scripts/stop-mac.sh     # Stop

# Linux
scripts/start-linux.sh
scripts/stop-linux.sh

# Windows
scripts/start-windows.ps1
scripts/stop-windows.ps1
```

### Required env vars (Render)
- `DATABASE_URL` — Supabase PostgreSQL connection string (session pooler, port 5432)
- `JWT_SECRET` — random hex string for signing JWTs
- `OPENROUTER_API_KEY` — OpenRouter API key for LLM calls
- `ALLOWED_ORIGINS` — comma-separated allowed CORS origins (default: `https://prelegal-gamma.vercel.app`)
- `REDIS_URL` — Upstash Redis URL for rate limiting (falls back to in-memory if unset)

### Security
- CORS restricted to `ALLOWED_ORIGINS` env var
- Rate limiting: 10 req/min on `/api/auth/login`, 5 req/min on `/api/auth/register`
- Rate limit state stored in Redis (persistent across restarts); falls back to in-memory if Redis unavailable
- `backend/app/limiter.py` — `rate_limit(request, limit)` called explicitly at top of each auth handler

## Implementation Status

### PL-3 — Mutual NDA Creator (done)
- `frontend/app/components/NDAForm.tsx`, `NDAPreview.tsx` — NDA form + live preview (full Standard Terms prose)
- `frontend/app/lib/types.ts` — `NDAFormData` type + defaults
- `frontend/app/lib/download.ts` — NDA markdown generation + download

### PL-4 — V1 Technical Foundation (done, PR #4)
- `backend/` — FastAPI uv project; SQLite DB init on startup; static file serving
- `backend/app/main.py` — serves Next.js static output; `/api/health` endpoint
- `backend/app/database.py` — creates `users` table from scratch each container start
- `frontend/app/login/page.tsx` — fake login screen (no auth); Sign In navigates to `/`
- `frontend/next.config.mjs` — `output: 'export'` for static build
- `Dockerfile` — multi-stage: Node → static `out/`, Python/uv → FastAPI server
- `scripts/` — start/stop for Mac, Linux, Windows

### PL-5 — AI Chat Interface (done)
- `backend/app/chat.py` — `POST /api/chat`; LiteLLM + OpenRouter/Cerebras (`gpt-oss-120b`); structured output (`AIResponse`) with dynamic fields dict
- `backend/app/main.py` — mounts chat router; loads `.env` via `python-dotenv`
- `frontend/app/components/ChatPanel.tsx` — generic chat UI; AI sends opening message on load; replies update document fields in real time; input refocuses after each reply
- `frontend/.env.local` — `NEXT_PUBLIC_API_URL` (configurable API base URL, default `http://localhost:8000`)
- `Dockerfile` — accepts `NEXT_PUBLIC_API_URL` as build ARG
- `scripts/start-mac.sh` — passes `--env-file .env` to `docker run`

### PL-6 — All Document Types (done, PR #6)
- `frontend/app/page.tsx` — catalog landing page (doc picker grid); routes to NDA-specific or generic editor per selection; Back button returns to catalog
- `frontend/app/lib/documents.ts` — field definitions for all 12 document types (single source of truth for frontend)
- `frontend/app/components/DocumentCatalog.tsx` — responsive 3-column catalog grid
- `frontend/app/components/DocumentForm.tsx` — generic field form for non-NDA documents
- `frontend/app/components/DocumentPreview.tsx` — generic field preview with fill-progress bar for non-NDA documents
- `backend/app/chat.py` — `DOC_FIELDS` + `DOC_NAMES` per document; `build_system_prompt()` constructs dynamic prompts; `ChatRequest` now includes `document_type`; `AIResponse.fields` is a plain `dict` (not typed Pydantic model)
- AI handles unsupported document requests by explaining and suggesting the closest supported alternative
- NDA retains its rich custom preview (`NDAPreview`) and full markdown download; all other docs use the generic components

### PL-7 — Auth, Document History, Polish (done, PR #7)
- `backend/app/auth.py` — `POST /api/auth/register`, `POST /api/auth/login`; bcrypt hashing; PyJWT Bearer tokens; `get_current_user` FastAPI dependency
- `backend/app/documents_router.py` — `POST/GET/DELETE /api/documents`; documents scoped per user; `GET /api/documents/{id}` returns full fields JSON
- `backend/app/database.py` — added `documents` table (user_id, doc_type, fields_json, title, created_at)
- `backend/tests/` — 14 pytest tests covering auth endpoints and document CRUD
- `frontend/app/lib/auth.ts` — `getToken/setAuth/clearAuth/authHeaders` utilities (localStorage with SSR guard)
- `frontend/app/login/page.tsx` — real `POST /api/auth/login`; two-column brand layout (dark navy left, form right)
- `frontend/app/signup/page.tsx` — new sign-up page; `POST /api/auth/register`; same two-column layout
- `frontend/app/page.tsx` — auth guard (redirects to `/login` if no token); Save button with status feedback; loads saved doc fields when resuming from catalog
- `frontend/app/components/DocumentCatalog.tsx` — "My Documents" section at top (fetched on mount); user avatar + logout in header; saved doc rows open pre-filled editor
- `frontend/app/components/DocumentPreview.tsx`, `NDAPreview.tsx` — amber draft disclaimer banner
- `frontend/app/lib/download.ts` — legal disclaimer appended to all downloaded `.md` files

### PL-8 — Hosting Migration + Security Hardening (done)
- Migrated from Railway (trial) to Render (free tier, permanent)
- Database migrated from SQLite to Supabase PostgreSQL (`backend/app/database.py` uses `psycopg2` + `DATABASE_URL`)
- `backend/Dockerfile` — backend-only Docker build for Render (paths relative to repo root)
- `render.yaml` — Render service config
- `frontend/vercel.json` — Vercel deployment config
- `backend/app/main.py` — CORS middleware restricted to `ALLOWED_ORIGINS` env var
- `backend/app/limiter.py` — Redis-backed sliding window rate limiter with in-memory fallback
- `backend/app/auth.py` — rate limiting applied to `/api/auth/login` (10/min) and `/api/auth/register` (5/min)

### Not yet implemented
- Nothing — all planned features through PL-8 are complete

## Color Scheme
- Accent Yellow: `#ecad0a`
- Blue Primary: `#209dd7`
- Purple Secondary: `#753991` (submit buttons)
- Dark Navy: `#032147` (headings)
- Gray Text: `#888888`
