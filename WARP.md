# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common commands

### Frontend (React + Vite)
- Install deps: `npm install`
- Start dev server (Vite on 5173): `npm run dev`
- Build production bundle (outputs to `dist/`): `npm run build`
- Preview local production build: `npm run preview`

### Backend (Node.js + PostgreSQL)
- Install deps: `cd server && npm install`
- Create database and tables: `npm run db:create`
- Seed data from JSON: `npm run db:seed`
- Start server (Express on 3001): `npm start`
- Start with auto-reload: `npm run dev`

Testing and linting
- There are currently no test or lint scripts/configs in this repo.

## Architecture overview
High-level
- SPA built with React 18 + Vite + TailwindCSS and Radix UI primitives wrapped in shadcn-style components.
- Backend: Node.js + Express + PostgreSQL for data persistence
- Frontend fetches data from REST API at `http://localhost:3001/api/contacts`
- Photos are in `public/photos/*` and referenced by filename.
- State and data fetching via TanStack React Query; app includes React Query Devtools in development.

Entrypoint and routing
- `index.html` bootstraps `src/main.jsx`, which mounts `<App />` under a `QueryClientProvider` and enables `<ReactQueryDevtools />`.
- No client-side router is used; the app is a single page.

Key modules and responsibilities
- `src/App.jsx`
  - Orchestrates fetching (`useQuery` for API endpoint `http://localhost:3001/api/contacts`), search, filter by industry/function, sort (name/company/industry/function), theme toggling (persists to `localStorage` and toggles the `dark` class on `<html>`), and incremental "load more" with an infinite-scroll trigger (near-bottom scroll handler).
  - Category helpers `getIndustryCategory` and `getFunctionCategory` derive tags from company/position strings.
- `src/components/ContactCard.jsx`
  - Renders a compact contact card with company/function badges and an affordance to open the modal.
- `src/components/ContactModal.jsx`
  - Radix Dialog-based modal showing full contact details and link formatting (e.g., Facebook username extraction for display).
- `src/components/ui/*`
  - Design system wrappers (button, input, select, dialog, badge) built on Radix + `class-variance-authority` with Tailwind utility classes.
  - `src/lib/utils.js` provides `cn()` for class merging via `clsx` + `tailwind-merge`.

Styling
- Tailwind configured with dark mode via `class`. Theme tokens are defined as CSS variables in `src/index.css` and consumed via Tailwind config extensions (colors, radii, shadow, etc.).
- Convenience utility classes defined in CSS: `.link`, `.card`, `.grid-cards`.

Build/dev config
- `vite.config.js`
  - Alias `@` → `./src` used across the codebase.
  - Dev server runs on port 5173.

Backend structure
- `server/index.js` - Express server with REST API endpoints
- `server/scripts/createDb.js` - Database initialization script
- `server/scripts/seedData.js` - Import contacts from JSON to PostgreSQL
- `server/.env` - Database connection configuration
- API endpoints: GET/POST/PUT/DELETE `/api/contacts`
- PostgreSQL database `contacts_db` with table `contacts`

Assets and data
- Data is stored in PostgreSQL and served via REST API
- Original data source: `public/contacts.json` (used for initial import)
- `public/photos/*` contains contact photos referenced by database entries.

## Deployment
- GitHub Actions workflow `.github/workflows/deploy.yml` builds on every push to `main` and syncs the `dist/` output to a Yandex Object Storage (S3-compatible) bucket using AWS CLI.
  - Required repository variables: `AWS_REGION`, `ENDPOINT_URL`, `BUCKET_NAME`, `BUILD_DIR` (defaults to `dist`).
  - Required repository secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`.
  - Non-HTML assets are uploaded with long immutable caching; HTML files are uploaded with `no-cache`.
