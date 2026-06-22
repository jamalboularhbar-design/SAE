---
name: arg-builder
description: Operate on ARG-Builder (argbuilder.io) — SAE monorepo playbooks app. Use for deploy, UI fixes, knowledge graph, logo/branding, light mode, merge+ship. Read .cursor/arg-builder-memory/memory/MEMORY.md first every session.
---

# ARG-Builder — Agent Skill

**Read first:** [.cursor/arg-builder-memory/memory/MEMORY.md](../../arg-builder-memory/memory/MEMORY.md)

Jamal expects agents to **run commands, verify production, merge, and deploy** — not ask him to check. Capture new learnings in memory + update this skill when workflows change.

---

## Repo map (canonical)

| What | Path |
|------|------|
| **The app** | `apps/playbooks/` |
| Brand strings | `apps/playbooks/shared/brand.ts` |
| Static title/OG | `apps/playbooks/client/index.html` |
| Logo component | `apps/playbooks/client/src/components/LogoMark.tsx` |
| Logo asset | `apps/playbooks/client/public/logo-mark.png` (**must be git-tracked**) |
| Marketing nav | `apps/playbooks/client/src/components/MarketingNav.tsx` |
| Product landing | `apps/playbooks/client/src/pages/LandingPage.tsx` |
| Knowledge graph UI | `apps/playbooks/client/src/components/KnowledgeGraphView.tsx` |
| Graph data | `apps/playbooks/server/db.ts` → `getKnowledgeGraphData()` |
| Nexus OS mount | `apps/playbooks/server/nexusOsMount.ts` |
| Deploy script | `scripts/sync-deploy-branch.sh` |
| Deploy workflow | `.github/workflows/sync-deploy-branch.yml` |

**Production repo:** `jamalboularhbar-design/SAE` branch **`deploy/production`** → Railway → **argbuilder.io**

**Do NOT rely on:** `ARG-Builder` GitHub repo (stale; `cursor[bot]` often lacks push access).

---

## Session startup checklist

1. Read `MEMORY.md` + `project_deploy_state.md` + `cloud_agent_updates.md`
2. Confirm branch: feature work → `cursor/<name>-0c61` off `main`
3. Before claiming "live": verify production (see below)
4. After any ship: update memory + this skill if workflow changed

---

## Merge + deploy (required after UI/feature work)

### 1. Merge to main

```bash
git checkout main && git pull origin main
git merge origin/cursor/<branch>-0c61
git push origin main
```

### 2. Sync deploy/production

**Preferred:** GitHub Action `Sync deploy/production branch` runs on push to `main` when `apps/playbooks/**` changes.

**If Action fails or rsync missing locally:**

```bash
# Manual sync (no rsync — use cp)
ROOT=/workspace
PLAYBOOKS="$ROOT/apps/playbooks"
NEXUS_OS="$ROOT/apps/nexus-os"
WORK="$ROOT/.deploy-branch-work"
MAIN_SHA="$(git rev-parse main)"
rm -rf "$WORK" && mkdir -p "$WORK"
cp -a "$PLAYBOOKS/." "$WORK/"
[ -d "$NEXUS_OS" ] && mkdir -p "$WORK/nexus-os" && cp -a "$NEXUS_OS/." "$WORK/nexus-os/"
git checkout --orphan deploy/production-new
git rm -rf . 2>/dev/null || true
cp -a "$WORK/." . && rm -rf .deploy-branch-work
git add -A
git commit -m "deploy: sync from main ${MAIN_SHA:0:7} — <short description>"
git branch -M deploy/production
git push -f origin deploy/production
git checkout main
```

### 3. Verify production (always run — never ask user)

```bash
# Title
curl -s https://argbuilder.io/product | grep -oE '<title>[^<]+</title>'

# Logo asset (must be 200, ~75KB)
curl -sI https://argbuilder.io/logo-mark.png | grep -E 'HTTP|content-length'

# Feature flag in JS bundle (example: Rovo graph)
JS=$(curl -s https://argbuilder.io/graph | grep -oE 'index-[^"]+\.js' | head -1)
curl -s "https://argbuilder.io/assets/$JS" | grep -c 'kg-rovo' || echo "MISSING"
```

### 4. If deploy doesn't update within ~2 min

- Check `gh run list --repo jamalboularhbar-design/SAE --limit 3`
- Railway may need manual Redeploy (secrets missing — see `reference_railway_cloudflare.md`)
- **Do NOT** assume merge = live

---

## Logo rules (recurring bug: "logo crushed")

**Asset:** User's book+circuit gradient PNG — **never redraw or replace with SVG**.

**Component:** `LogoMark.tsx` — sizes `xs|sm|md|lg|xl`, always `object-contain shrink-0 bg-transparent`.

| Surface | Size | Notes |
|---------|------|-------|
| `MarketingNav` header | `nav` | 44px, shrink-0 wrapper; `min-w-0` only on text |
| `Header` (app) | `lg` | |
| `LandingPage` footer | `md` | Stacked above tagline |
| Login | `xl` | |

**Common failures:**
- Broken image icon → `logo-mark.png` not on `deploy/production` or not in `client/public/` on main
- "Crushed" → logo forced into `md` (32px) in tight header; bump to `lg`, ensure `min-w-0` on text sibling not on logo
- Black PNG background is intentional; do not add white box behind mark

**After deploy:** `curl -sI https://argbuilder.io/logo-mark.png` must return `200`.

---

## Light mode (theme-aware UI)

- Theme: `ThemeProvider` in `App.tsx`, `defaultTheme="dark"`, `switchable={true}`
- Marketing pages use `MarketingNav` theme toggle (sun/moon)
- **Never** hardcode `#0B1120`, `#0a0a0f` — use `bg-background`, `text-foreground`, `border-border`
- Doc pages: `dark:prose-invert` not bare `prose-invert` (tables invisible in light mode)
- Product footer: `pb-28 sm:pb-32` for Quick Actions toolbar clearance
- Header nav links: show on `xl+` only to avoid collision with brand block

---

## Knowledge graph

**Routes:**
- Public: `/graph` (header Network icon) → `DocumentGraphPage.tsx`
- Admin: `/admin/knowledge-graph` → `AdminKnowledgeGraphPage.tsx`

**Shared component:** `KnowledgeGraphView.tsx` (Rovo/Teamwork Graph style)

**Design (do not revert to flat canvas):**
- Card nodes with glass + category accent stripe
- Curved SVG edges (amber = dependency, purple = reference)
- Gradient mesh background (`kg-rovo-*` CSS in `index.css`)
- Category cluster mode when zoom < 0.52 and 35+ nodes
- Force layout in JS; pan/zoom via CSS transform

**Data:** `getKnowledgeGraphData()` merges `document_dependencies` + `documentCrossReferences`; nodes keyed by slug.

**Populate graph (production DB — Railway console):**
```bash
pnpm seed:525          # 515 catalog + persona/GTM extras (stubs for missing bodies)
pnpm graph:populate    # cross-refs + dependencies
```

**Note:** Only ~281 markdown files exist in `docs-seed`; ~354 catalog entries use placeholder content until original Manus-era files are restored. Real content is matched via fuzzy filename/title mapping (~161 playbooks).

Scripts use **raw mysql2** (not `drizzle/schema.js`) so they run on Railway without TypeScript compilation.

**Cross-ref status:** `approved` and `confirmed` both render as reference edges in the graph.

---

## Document footers (Manus → library)

- **Strip utility:** `shared/documentContent.ts` → `stripManusFooter()` / `prepareDocumentContent()`
- **UI footer:** `DocumentLibraryFooter.tsx` on every doc detail page (replaces Manus attribution)
- **Batch clean seed files:** `pnpm docs:strip-manus` (docs-seed only) or `pnpm docs:strip-manus:db` (+ production DB)
- **PDF export:** `server/pdfExport.ts` strips Manus + uses ARG-Builder footer
- **Re-seed:** `seed-from-files.mjs` strips on import

---

## Favicons

Regenerate from `logo-mark.png` (crops transparent padding so mark reads larger):
```bash
cd apps/playbooks && pnpm favicons:generate
```
Outputs: `favicon-16/32/48/192.png`, `favicon.ico`, `apple-touch-icon.png` (180×180).

---

## Key routes & pages

| URL | Page | Nav |
|-----|------|-----|
| `/product` | `LandingPage.tsx` | `MarketingNav subtitle="Playbooks"` |
| `/product/templates` | Templates | MarketingNav |
| `/graph` | Knowledge graph | Header |
| `/admin/knowledge-graph` | Admin graph | Quick Actions |
| `/os/` | Nexus OS | Full-page nav (`href="/os/"` not wouter) |
| `/my-dashboard` | User dashboard | App shell (light mode fixes here too) |

---

## Branch + PR conventions

- Branch: `cursor/<descriptive-name>-0c61` (lowercase)
- Commits: conventional (`feat:`, `fix:`, `deploy:`)
- PR base: `main`, draft default OK
- **Always** commit → push → create/update PR before ending turn
- Cloud agent: merge when user says "merge and deploy"

---

## Typecheck + build

```bash
cd apps/playbooks && pnpm check && pnpm build
```

Map iteration on `Map` requires `Array.from(map.entries())` (TS downlevel).

---

## Memory maintenance (mandatory)

When you learn something new or fix a recurring bug:

1. Update `.cursor/arg-builder-memory/memory/cloud_agent_updates.md` (session delta)
2. Update `project_deploy_state.md` if deploy status changed
3. Add/update a `reference_*.md` if it's a reusable pattern
4. Update **this skill** if the workflow changed
5. **Sync to Obsidian:** `./scripts/obsidian/sync-memory-to-vault.sh`
6. Commit memory + skill with the code change (or immediately after ship)

**User rule:** "Next time everything should be turned as a skill" — if you do something twice, document it here.

**Obsidian:** See `.cursor/skills/obsidian-second-brain/SKILL.md` — daily captures go to `obsidian-vault/`.

---

## Communication (Jamal)

See `feedback_communication_style.md`: terse, verify yourself, merge when told, no option menus, headline + table for status.
