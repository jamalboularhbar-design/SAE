# Reference: Repositories

## SAE (monorepo)

- **GitHub:** https://github.com/jamalboularhbar-design/SAE
- **Default branch:** `main`
- **Structure:**
  - `apps/playbooks/` — Playbooks app
  - `apps/nexus-os/` — Nexus OS app
  - `scripts/sync-deploy-branch.sh`

## nexus-os (standalone)

- **GitHub:** https://github.com/jamalboularhbar-design/nexus-os
- **Default branch:** `publish/nexus-os-standalone` (user renamed from import)
- **Purpose:** Public standalone copy; separate from Railway deploy pipeline

## Deploy branch

- **Branch:** `deploy/production` on SAE
- **Not a dev branch** — production Railway source only

## Active agent branches (examples)

- `cursor/nexusai-argbuilder-strategy-0c61` — base branch for cloud task
- `cursor/fix-nexus-os-nav-0c61` — SPA nav fix
- `cursor/brand-logo-0c61` / `cursor/fix-logo-transparent-0c61` — logo work

## Remote note

Git remote may show move message → use `jamalboularhbar-design/SAE.git`
