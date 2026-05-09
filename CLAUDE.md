# Prelegal Project

## Overview

This is a SaaS product to allow users to draft legal agreements based on templates in the templates directory.
The user can carry out AI chat in order to establish what document they want and how to fill in the fields.
The available documents are covered in the catalog.json file in the project root, included here:

@catalog.json

The initial prototype was frontend-only, supporting Mutual NDA with no AI chat. PL-4 added the full V1 technical foundation. PL-5 replaced the static form with an AI chat interface (see Implementation Status below).

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

The entire project is packaged into a Docker container (multi-stage build: Node builds static frontend, Python/uv serves it via FastAPI).  
The backend is in `backend/` as a uv project using FastAPI; run with `uv run uvicorn app.main:app`.  
The database uses SQLite, created from scratch on each container start (`backend/app/database.py`). Users table exists; auth not yet implemented.  
The frontend is in `frontend/`, statically built (`output: 'export'`) and served by FastAPI at the root.  
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
Backend available at http://localhost:8000

## Implementation Status

### PL-3 — Mutual NDA Creator (done)
- `frontend/app/page.tsx` — NDA form + live preview, download .md, print to PDF
- `frontend/app/components/NDAForm.tsx`, `NDAPreview.tsx`
- `frontend/app/lib/types.ts`, `download.ts`

### PL-4 — V1 Technical Foundation (done, PR #4)
- `backend/` — FastAPI uv project; SQLite DB init on startup; static file serving
- `backend/app/main.py` — serves Next.js static output; `/api/health` endpoint
- `backend/app/database.py` — creates `users` table from scratch each container start
- `frontend/app/login/page.tsx` — fake login screen (no auth); Sign In navigates to `/`
- `frontend/next.config.mjs` — `output: 'export'` for static build
- `Dockerfile` — multi-stage: Node → static `out/`, Python/uv → FastAPI server
- `scripts/` — start/stop for Mac, Linux, Windows

### PL-5 — AI Chat Interface (done)
- `backend/app/chat.py` — `POST /api/chat`; LiteLLM + OpenRouter/Cerebras (`gpt-oss-120b`); structured output (`AIResponse`) extracts field updates from conversation
- `backend/app/main.py` — mounts chat router; loads `.env` via `python-dotenv`
- `frontend/app/components/ChatPanel.tsx` — freeform chat UI; AI sends opening message on load; each reply updates `NDAFormData` fields in real time
- `frontend/app/page.tsx` — Chat / Edit Fields tabs; warning dialog before download/print when required fields are blank
- `frontend/.env.local` — `NEXT_PUBLIC_API_URL` (configurable API base URL, default `http://localhost:8000`)
- `Dockerfile` — accepts `NEXT_PUBLIC_API_URL` as build ARG
- `scripts/start-mac.sh` — passes `--env-file .env` to `docker run`

### Not yet implemented
- User authentication (sign up / sign in endpoints)
- Support for documents beyond Mutual NDA

## Color Scheme
- Accent Yellow: `#ecad0a`
- Blue Primary: `#209dd7`
- Purple Secondary: `#753991` (submit buttons)
- Dark Navy: `#032147` (headings)
- Gray Text: `#888888`
