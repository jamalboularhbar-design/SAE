# Cloud agent updates (post-export)

Supplements [SESSION-INVENTORY.md](../SESSION-INVENTORY.md) and [project_deploy_state.md](./project_deploy_state.md).

## 2026-06-22 — Light mode + product nav + docs

| Change | Files |
|--------|-------|
| Shared marketing nav + theme toggle | `MarketingNav.tsx` |
| Light mode across marketing/app | `LandingPage`, Templates, ROI, Glossary, API docs, etc. |
| Doc table readability | `DocumentDetail.tsx` — `dark:prose-invert` |
| Product header collision fix | `MarketingNav` — subtitle stacked below title |
| Footer centering + Quick Actions pad | `LandingPage` footer `pb-28` |

## 2026-06-22 — Knowledge graph

| Change | Files |
|--------|-------|
| Data layer | `server/db.ts` → `getKnowledgeGraphData()` |
| Admin graph | `/admin/knowledge-graph` |
| Public graph upgrade | `/graph` → shared `KnowledgeGraphView` |
| **Rovo Pro redesign** | Card nodes, SVG curved edges, cluster mode, `kg-rovo-*` CSS |
| PR | SAE #17 — merged + deployed |

## 2026-06-22 — Merge + deploy workflow (verified)

1. Merge feature branch → `main`, push
2. `sync-deploy-branch.yml` runs OR manual cp-based sync to `deploy/production`
3. Force-push `deploy/production`
4. Railway rebuilds in ~3–5 min
5. Verify with curl (logo-mark.png, JS bundle feature flags, title)

**ARG-Builder repo push fails** (`cursor[bot]` 403) — ignore; SAE `deploy/production` is canonical.

## Logo (recurring)

- Asset: `apps/playbooks/client/public/logo-mark.png` (user's mark — do not redraw)
- Component: `LogoMark.tsx`
- User report: "logo crushed again" on `/product` — check size + deploy branch includes PNG
- Production serves PNG at 200 OK (~75753 bytes) as of last deploy

## Agent memory + skill (user request)

- Skill: `.cursor/skills/arg-builder/SKILL.md` — operational runbook
- Skill: `.cursor/skills/obsidian-second-brain/SKILL.md` — daily second brain
- Vault: `obsidian-vault/` — git-synced Obsidian vault
- Sync: `./scripts/obsidian/sync-memory-to-vault.sh`
- Memory: `.cursor/arg-builder-memory/memory/` — read `MEMORY.md` every session
- Rule: `feedback_agent_memory.md` — persist learnings, don't forget deploy/verify workflow

## Still open

- Logo sizing in MarketingNav (crushed appearance)
- Railway GitHub secrets for explicit redeploy workflow
- `og-image.png` refresh with new logo
- `/` vs `/app` auth-gate split
