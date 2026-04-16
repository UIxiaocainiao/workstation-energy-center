# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"工位补能站" (Workstation Energy Center) — a web app for office workers providing emotional resonance and stress relief through status check-ins, workplace jargon translator, countdown timers, resonance cards, and comfort text features. No login system; users are identified by device ID stored in localStorage.

## Development Commands

### Prerequisites
```bash
docker compose up -d postgres    # Start PostgreSQL (port 5432)
```

### Backend (Express + Prisma + TypeScript)
```bash
cd backend
cp .env.example .env.local       # First time only
npm install
npm run prisma:generate          # Generate Prisma client
npm run prisma:migrate           # Run migrations (SQLite in dev despite .env.example showing PostgreSQL)
npm run prisma:seed              # Seed initial data
npm run dev                      # Start dev server on :3001
npm run build                    # TypeScript compile to dist/
```

### Frontend (Next.js 14 Pages Router + Tailwind + TanStack Query)
```bash
cd frontend
cp .env.example .env.local       # First time only
npm install
npm run dev                      # Start dev server on :3000
npm run build                    # Production build
npm run lint                     # ESLint via next lint
```

## Architecture

**Monorepo with two independent npm projects** — `frontend/` and `backend/` each have their own `package.json` and `node_modules`. No workspace tooling; run `npm install` in each directory separately.

### Backend
- **Entry**: `src/server.ts` → `src/app.ts` (Express app factory)
- **Routes**: `src/routes/` — REST endpoints under `/api/{status,cards,translator,comfort,config,admin}`
- **Controllers**: `src/controllers/` — request handlers, one file per domain
- **Services**: `src/services/` — business logic (e.g., translator keyword matching + template engine)
- **Database**: Prisma ORM with SQLite (`prisma/dev.db`). Schema at `prisma/schema.prisma`
- **Config**: `src/config/env.ts` reads from `.env.local`
- **Admin auth**: Token-based via `x-admin-token` header, checked in `src/middleware/adminAuth.ts`

### Frontend
- **Pages Router**: `pages/` — index, blackwords (translator), comfort, about, plus `admin/` pages
- **Components**: `components/features/` (domain), `components/layout/` (shell/header/footer), `components/ui/` (primitives)
- **Hooks**: `hooks/` — custom React hooks per feature (useStatus, useTranslator, useComfort, useCountdown)
- **API client**: `lib/apiClient.ts` — thin fetch wrapper, base URL from `NEXT_PUBLIC_API_BASE_URL`
- **Device ID**: `lib/device.ts` — generates and persists a UUID in localStorage for anonymous identity
- **Path alias**: `@/*` maps to project root (e.g., `@/components/...`)
- **Styling**: Tailwind CSS with `globals.css` and `tailwind.css`
- **Animations**: GSAP utilities in `lib/gsapUtils.ts`, React Bits in `lib/reactBitsUtils.ts`

### Translator Engine
The jargon translator (V1) uses keyword matching + template rules, not AI. Logic is in `backend/src/services/translatorService.ts`. Two modes: `boss_to_truth` and `truth_to_polite`. Falls back to a hardcoded pool when no keyword matches.

### Data Models (Prisma)
Key models: `StatusOption`, `StatusRecord`, `ResonanceCard`, `CardReaction`, `TranslatorTemplate`, `TranslatorExample`, `TranslatorLog`, `ComfortText`, `SiteConfig`. See `backend/prisma/schema.prisma`.

## Important Notes

- The Prisma schema uses **SQLite** (`prisma/dev.db`) despite `.env.example` showing a PostgreSQL URL. The actual datasource provider in `schema.prisma` is `sqlite`.
- The PRD is at `PRD/PRD-V1.0.0.md` — refer to it for product requirements and feature specifications.
- Admin routes all require the `x-admin-token` header matching `ADMIN_TOKEN` from env.
- No test framework is configured yet.
