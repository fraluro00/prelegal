# Prelegal

A platform for drafting common legal agreements. Provides a library of standardised legal templates and a web app for generating completed documents.

**Live app:** https://prelegal-gamma.vercel.app

## Repository structure

```
prelegal/
├── templates/          # Markdown legal templates (CommonPaper standards)
├── catalog.json        # Machine-readable index of all templates
├── frontend/           # Next.js web application (deployed to Vercel)
└── backend/            # FastAPI backend (deployed to Render)
```

## Hosting

| Layer | Service | URL |
|-------|---------|-----|
| Frontend | Vercel | https://prelegal-gamma.vercel.app |
| Backend API | Render | https://prelegal-backend.onrender.com |
| Database | Supabase | PostgreSQL (free tier) |

## Legal templates

Stored in `templates/` and indexed in `catalog.json`. All templates use the [CommonPaper](https://commonpaper.com) open standards and are licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

| Template | File |
|---|---|
| Mutual NDA | `Mutual-NDA.md` + `Mutual-NDA-coverpage.md` |
| Cloud Service Agreement | `CSA.md` |
| Design Partner Agreement | `design-partner-agreement.md` |
| Service Level Agreement | `sla.md` |
| Professional Services Agreement | `psa.md` |
| Data Processing Agreement | `DPA.md` |
| Software License Agreement | `Software-License-Agreement.md` |
| Partnership Agreement | `Partnership-Agreement.md` |
| Pilot Agreement | `Pilot-Agreement.md` |
| Business Associate Agreement | `BAA.md` |
| AI Addendum | `AI-Addendum.md` |

## Local development

### Requirements

- Node.js 18+, npm 9+
- Python 3.11+, uv
- PostgreSQL (or use Supabase)

### Backend

```bash
cd backend
uv run uvicorn app.main:app --reload
```

Requires `DATABASE_URL`, `JWT_SECRET`, and `OPENROUTER_API_KEY` in `.env`.

### Frontend

```bash
cd frontend
npm install
npm run dev       # starts dev server at http://localhost:3000
```

Requires `NEXT_PUBLIC_API_URL` in `frontend/.env.local`.

### Docker (full stack)

```bash
scripts/start-mac.sh    # Mac
scripts/start-linux.sh  # Linux
```

Backend available at http://localhost:8000.
