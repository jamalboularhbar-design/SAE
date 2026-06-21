# Integrating Nexus OS with argbuilder.io

Nexus OS mounts inside **NexusAI Playbooks** at **`/os`** on argbuilder.io.

```
argbuilder.io/os/          → Nexus OS UI (React)
argbuilder.io/os/api/…     → Nexus OS Brain API (Express)
```

## Architecture

| Layer | Repo | Role |
|-------|------|------|
| **Playbooks** | `SAE` monorepo (`apps/playbooks`) | Document library, Intelligence Hub, billing |
| **Nexus OS** | This repo (also `apps/nexus-os` in SAE) | Ask-once operator — specialists, approvals, heartbeat |

Playbooks tells you **what** to do. Nexus OS **does** it.

## Production deploy (Railway / argbuilder.io)

From the SAE monorepo:

```bash
cd apps/playbooks
pnpm build          # builds Nexus OS with base /os/ then Playbooks
pnpm start
```

The Playbooks server calls `registerNexusOs()` from `server/mount.ts` before serving static files.

Set `NEXUS_OS_ENABLED=false` to disable the mount.

## Local development

**Option A — Integrated API + standalone UI (recommended)**

```bash
# Terminal 1 — Playbooks (API at /os/api)
cd apps/playbooks && pnpm dev

# Terminal 2 — Nexus OS UI
cd apps/nexus-os && pnpm dev
```

Visit Playbooks at `http://localhost:3000`. Click **Nexus OS** in the header → redirects to `http://localhost:5273` until you run a production build.

**Option B — Fully integrated**

```bash
cd apps/nexus-os && NEXUS_OS_BASE=/os/ pnpm build
cd apps/playbooks && pnpm dev
```

Visit `http://localhost:3000/os/`

## Standalone deploy (separate service)

This repo runs independently:

```bash
pnpm install
pnpm dev      # UI :5273 · API :8787
pnpm build && pnpm start
```

Use when hosting Nexus OS on its own subdomain (e.g. `os.nexusai.ma`).

## Submodule / copy in SAE

The SAE monorepo keeps a copy at `apps/nexus-os`. To sync from this repo:

```bash
git submodule add https://github.com/jamalboularhbar-design/nexus-os apps/nexus-os
# or pull latest from this repo into apps/nexus-os
```

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXUS_OS_BASE` | `/` | Vite base path (`/os/` when embedded) |
| `NEXUS_OS_ENABLED` | `true` | Set `false` to skip mount in Playbooks |
| `NEXUS_OS_DEV_URL` | `http://localhost:5273` | Dev redirect when UI not built |
| `LLM_API_KEY` | — | Live mode for specialists |
| `PORT` | `8787` | Standalone API port |

## Data storage

State and secrets live in `.data/` (gitignored):

- `state.json` — runs, memory, approvals, heartbeat
- `secrets.json` — model keys and integration tokens (UI-managed)

When embedded in Playbooks, data stays in `apps/nexus-os/.data/` on the server filesystem.
