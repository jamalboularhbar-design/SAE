# Cloud agent updates (post-export)

Supplements [SESSION-INVENTORY.md](../SESSION-INVENTORY.md) and [project_deploy_state.md](./project_deploy_state.md).  
Added: 2026-06-22 (Cursor Cloud Agent on SAE monorepo).

## Merged / shipped after SESSION-INVENTORY export

| PR / branch | Summary |
|-------------|---------|
| SAE #15 | fix: Nexus OS links use full-page nav (`/os/` not wouter SPA) |
| `cursor/brand-logo-0c61` | LogoMark component, favicon, logo-mark.png |
| `cursor/fix-logo-transparent-0c61` | Strip white/gray PNG background for dark UI embed |
| `cursor/arg-builder-memory-0c61` | This memory store in repo |

## Production fixes verified

- `https://argbuilder.io/os/` — Nexus OS UI + API live
- Header / product / login → `/os/` via full-page navigation
- Logo: transparent `logo-mark.png` (user's book+circuit mark — do not redraw)

## Deploy

- `deploy/production` force-synced from `main` after each fix
- Railway project: see [reference_railway_cloudflare.md](./reference_railway_cloudflare.md)

## Still open (carried forward)

- `og-image.png` not yet updated with new logo
- Railway GitHub secrets for auto-redeploy
- User's exact logo PNG — if regenerated, replace `apps/playbooks/client/public/logo-mark.png`
