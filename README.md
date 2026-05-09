# Prelegal

A platform for drafting common legal agreements. Provides a library of standardised legal templates and a web app for generating completed documents.

## Repository structure

```
prelegal/
├── templates/          # Markdown legal templates (CommonPaper standards)
├── catalog.json        # Machine-readable index of all templates
└── frontend/           # Next.js web application
```

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

## Frontend — Mutual NDA Creator

A split-pane web app: fill in a form on the left, see the completed NDA highlighted live on the right, then download as Markdown or print to PDF.

### Requirements

- Node.js 18+
- npm 9+

### Setup

```bash
cd frontend
npm install
```

### Running locally

```bash
npm run dev       # starts dev server at http://localhost:3000
npm run build     # production build
npm start         # serve production build
```

### Testing

```bash
npm test              # Jest unit + component tests (78 tests)
npm run test:watch    # Jest in watch mode
npm run test:e2e      # Playwright end-to-end tests (15 tests, starts dev server automatically)
npm run test:e2e:ui   # Playwright with interactive UI
```

Playwright requires Chromium. Install it once with:

```bash
npx playwright install chromium
```
