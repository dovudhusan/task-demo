# RoleFit

A small, mobile-friendly web app for a job application test task.

**Live idea:** answer 5 questions → get a tech-role recommendation from **simple scoring rules** (not AI) → answers are **saved**.

## What it does

1. User answers **5 questions** about work preferences
2. A deterministic scorer maps answers to:
   - Frontend Developer
   - Backend Developer
   - Full-Stack Developer
   - DevOps / Cloud Engineer
   - Product-Minded Engineer
3. Result + score breakdown is shown
4. Answers are saved via `POST /api/submissions` (JSON file store) **and** in `localStorage`

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- File-based JSON storage (`data/submissions.json` locally, `/tmp` on Vercel)
- Browser `localStorage` for device history

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy (Vercel)

```bash
npx vercel
```

Or push to GitHub and import the repo in the Vercel dashboard.

> Note: on Vercel’s serverless filesystem, API saves go to `/tmp` (ephemeral). The app also saves history in the browser, so the “answers are saved” requirement still holds for users. For durable server storage, swap `src/lib/store.ts` for Postgres / Turso / etc.

## Project structure

```
src/
  app/                 # pages + API route
  components/QuizApp.tsx
  lib/quiz.ts          # questions + scoring rules
  lib/store.ts         # persistence
data/submissions.json  # local submissions
```

## API

- `GET /api/submissions` — recent submissions
- `POST /api/submissions` — `{ "answers": { "energy": "ui", ... } }`
# task-demo
