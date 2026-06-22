# Integration: Playbooks ↔ Nexus OS

## Architecture

```
argbuilder.io
├── /              → Playbooks SPA (Express + Vite static)
├── /api/*         → Playbooks tRPC/API
├── /os/           → Nexus OS UI (static from nexus-os build)
└── /os/api/*      → Nexus OS API router
```

## Key code

| File | Role |
|------|------|
| `apps/playbooks/server/nexusOsMount.ts` | Resolves nexus-os path (monorepo vs deploy flat layout) |
| `apps/nexus-os/server/mount.ts` | `registerNexusOs()`, `createNexusOsApiRouter()` |
| `apps/playbooks/server/_core/index.ts` | Calls `registerNexusOsIntegration(app)` before static |
| `apps/playbooks/server/_core/vite.ts` | Skips `/os` from SPA fallthrough in dev |

## Deploy layout (Railway)

`deploy/production` branch = flat copy of playbooks at repo root + `nexus-os/` sibling folder.

Build: `(pnpm build:nexus-os || echo continuing) && vite build` — **risk:** nexus-os build can fail silently.

## Sync script

`scripts/sync-deploy-branch.sh` — copies `apps/playbooks` + `apps/nexus-os` to orphan `deploy/production` branch.

## Dev

- Playbooks dev port varies; Nexus OS standalone dev ~5273
- Dev fallback redirect to Nexus OS dev server when UI not built
