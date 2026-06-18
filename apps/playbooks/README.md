# Playbooks App

> **NexusAI Playbooks** — Multi-brand operational documentation platform.
> Imported from ARG Builder (argbuilder.io).

## Status

⏳ **Awaiting GitHub import** — ARG Builder source code will be linked here.

## Expected Stack (from live app audit)

- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS
- **Icons:** Lucide
- **Content:** Markdown rendering
- **Features:** Full-text search, analytics, admin CMS, dual/multi-persona workspaces

## Setup (after import)

```bash
cd apps/playbooks
cp .env.example .env.local
npm install
npm run dev
```

## Import Instructions

When GitHub access is granted:

```bash
# Option A: Git submodule
git submodule add <argbuilder-repo-url> apps/playbooks

# Option B: Monorepo merge
git remote add playbooks <argbuilder-repo-url>
git fetch playbooks
git merge playbooks/main --allow-unrelated-histories
# Move files to apps/playbooks/
```

## Phase 0 Tasks

See [90-Day Roadmap](../../docs/roadmap/90-day-plan.md#phase-0-foundation-weeks-12).
