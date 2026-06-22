---
name: reference-playbooks-ui
description: UI patterns and recurring fixes for apps/playbooks — light mode, nav, logo, graph, footer.
metadata:
  node_type: memory
  type: reference
---

## Theme

- Provider: `client/src/contexts/ThemeContext.tsx`, default dark, switchable
- Marketing: `MarketingNav.tsx` has sun/moon toggle
- Tokens: `client/src/index.css` — use CSS vars (`--background`, `--foreground`, `--border`, `--accent`)

## MarketingNav layout (product header)

- Fixed `h-16`, brand block left, links centered `xl+`, actions right
- Brand: `LogoMark size="lg"` + title + subtitle **stacked** (subtitle `text-[11px]` below title)
- Subtitle on `/product`: `"Playbooks"` via `<MarketingNav subtitle="Playbooks" />`
- Collision fix: nav links hidden below `xl`; CTA text shortens on `lg`/`sm`

## Logo

- Component: `LogoMark.tsx` → `/logo-mark.png`
- Public assets: `client/public/logo-mark.png` (+ favicon-32, favicon.ico, apple-touch-icon, og-image)
- **All must be git-tracked on `main`** — deploy branch copies from playbooks
- Footer: `LandingPage.tsx` — centered, `LogoMark size="sm"`, `pb-28 sm:pb-32`

## Light mode fixes (done — don't regress)

| Area | Fix |
|------|-----|
| Marketing pages | `MarketingNav`, semantic tokens, no `#0B1120` |
| `LandingPage`, Templates, ROI | theme-aware backgrounds |
| `VerticalShowcase` | removed forced `variant="dark"` |
| `DocumentDetail` | `dark:prose-invert`, table cell colors |
| `AdminQuickActionToolbar`, `UserDashboardPage` | contrast fixes |
| `index.css` | `.card-premium` border uses `var(--border)` |
| `Header.tsx` | Intelligence/Nexus OS button contrast |

## Knowledge graph

- Component: `KnowledgeGraphView.tsx` — Rovo card style, not canvas dots
- CSS: `kg-rovo-*` classes in `index.css`
- Pages: `DocumentGraphPage.tsx` (`/graph`), `AdminKnowledgeGraphPage.tsx`
- Data: `server/db.ts` → `getKnowledgeGraphData()`

## Quick Actions overlap

- Bottom toolbars need `pb-28` (or similar) on pages with footers so content isn't hidden

## Verify after UI change

```bash
curl -sI https://argbuilder.io/logo-mark.png | head -3
curl -s https://argbuilder.io/product | grep -oE '<title>[^<]+</title>'
```
