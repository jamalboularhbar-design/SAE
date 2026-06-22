# Session Inventory — 2026-06-22

Last updated: 2026-06-22. Source bundle: `C:\Users\G-shop\Downloads\arg-builder-memory-2026-06-22\`

## Repos

| Repo | URL | Role |
|------|-----|------|
| SAE (monorepo) | https://github.com/jamalboularhbar-design/SAE | Playbooks + Nexus OS source |
| nexus-os (standalone) | https://github.com/jamalboularhbar-design/nexus-os | Published standalone; default branch `publish/nexus-os-standalone` |
| Deploy branch | `deploy/production` on SAE | Railway production (flat layout: playbooks root + `nexus-os/` sibling) |

## Production

- **Domain:** https://argbuilder.io
- **Playbooks:** `/` (SPA), `/product`, `/login`, `/ai`
- **Nexus OS:** `/os/` (separate Express mount), API at `/os/api/*`
- **Host:** Railway (auto-deploy from `deploy/production`)

## PRs shipped (this arc)

| PR | Branch | Summary |
|----|--------|---------|
| #10 | nexus-os integration | Chip Nexus OS into SAE, mount at `/os` |
| #11–#14 | audit fixes | OS mount paths, deploy vendoring, ARG-Builder title |
| #15 | fix-nexus-os-nav | Full-page navigation to `/os/` (SPA was 404) |
| — | brand-logo | Book+circuit logo as favicon + LogoMark component |
| — | fix-logo-transparent | Strip white/gray PNG background for dark UI embed |

## MCP / skills available

- **Slack, Notion, GitLab, Granola, Vercel, Figma, Elastic-docs**
- Skills: GitLab CI, Next.js, Granola context, knowledge-capture, tasks-*, etc.

## Open items

1. **og-image.png** — still old; user may want logo on social preview
2. **Railway auto-redeploy** — `RAILWAY_TOKEN` / `RAILWAY_SERVICE_ID` secrets missing; CI workflow fails
3. **Merge `cursor/fix-nexus-os-deploy-0c61`** — tar fallback in sync script, rsync fix
4. **Launch audit P0s** — swap `/` ↔ `/product`, reconcile doc counts, single CTA, founder story
5. **Logo source file** — canonical asset is user's PNG (book+circuit, transparent); do not redraw as SVG
6. **Standalone nexus-os** — default branch rename cosmetic only

## Branch naming (cloud agents)

- Prefix: `cursor/`
- Suffix: `-0c61`
- Example: `cursor/fix-nexus-os-nav-0c61`

## Key files

| Path | Purpose |
|------|---------|
| `apps/playbooks/server/nexusOsMount.ts` | Mount Nexus OS in Playbooks |
| `apps/nexus-os/server/mount.ts` | Exportable `registerNexusOs()` |
| `apps/playbooks/client/src/components/LogoMark.tsx` | Shared brand mark |
| `apps/playbooks/client/public/logo-mark.png` | Canonical logo (transparent PNG) |
| `scripts/sync-deploy-branch.sh` | Build `deploy/production` for Railway |
