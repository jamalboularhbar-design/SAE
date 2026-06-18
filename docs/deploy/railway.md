# Railway Deployment — NexusAI Playbooks

## Production repo (IMPORTANT)

Railway service **ARG-Builder** deploys from:

**`https://github.com/jamalboularhbar-design/ARG-Builder`** — branch `main`

| Repo | Railway? | Notes |
|------|----------|-------|
| **`ARG-Builder`** | ✅ **YES** | Production — argbuilder.io |
| `agent-reference-guide` | ❌ No | Older mirror; pushes here do nothing |
| `SAE` (root) | ❌ **Breaks build** | No `package.json` at root → Railpack fails |

---

## Why deploy failed (Railpack error)

If you see:

```
Railpack could not determine how to build the app
Detected: Cpp, Staticfile, Shell
Script start.sh not found
```

**Cause:** Railway built the **wrong directory** — usually `SAE` repo root (docs + `apps/` folder) instead of the Node app.

**Fix:** Deploy from **`ARG-Builder`** OR set Railway **Root Directory** = `apps/playbooks` if using SAE.

---

## Deploy (correct repo)

```bash
git clone https://github.com/jamalboularhbar-design/SAE.git
cd SAE
DEPLOY_CONFIRM=y ./scripts/sync-to-production-repo.sh
```

This syncs `apps/playbooks/` → `ARG-Builder` and pushes to `main`.

---

## Railway dashboard settings

| Setting | Value |
|---------|-------|
| **Repository** | `jamalboularhbar-design/ARG-Builder` |
| **Branch** | `main` |
| **Root directory** | `/` (leave empty) |
| **Builder** | Dockerfile (via `railway.toml`) |

Do **not** connect the SAE monorepo unless Root Directory = `apps/playbooks`.

---

## After push

1. Railway → **ARG-Builder** → Deployments → wait for **Success**
2. Verify:

```bash
curl -s https://argbuilder.io/ | grep '<title>'
# NexusAI Playbooks — AI-Powered Operational Intelligence
```

3. Cloudflare: only purge cache if `curl` shows NexusAI but browser doesn't (`cf-cache-status: DYNAMIC` usually means no HTML cache).

---

## Custom domain

Railway → ARG-Builder → Settings → Networking → `argbuilder.io`  
Cloudflare → DNS → CNAME to Railway (proxy on is fine)
