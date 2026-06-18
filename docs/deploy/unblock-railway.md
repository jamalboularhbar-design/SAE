# Unblock Railway Deploy (Failed / Blocking)

If Railway shows **Failed** with:

```
Railpack could not determine how to build the app
Detected: Cpp, Staticfile, Shell
Script start.sh not found
```

the build is running against the **wrong repo or directory** — not a Cloudflare cache issue.

---

## Fix in 3 steps (~5 minutes)

### Step 1 — Check Railway source (most common cause)

Railway dashboard → **pretty-nourishment** → **ARG-Builder** → **Settings** → **Source**

| Setting | Must be |
|---------|---------|
| **Repository** | `jamalboularhbar-design/ARG-Builder` **OR** `jamalboularhbar-design/SAE` |
| **Branch** | `main` |
| **Root Directory** | `/` if using **ARG-Builder**; **`apps/playbooks`** if using **SAE** |

**Wrong:** SAE repo with Root Directory = `/` (empty) → Railpack sees docs/scripts only → **Failed**

**Wrong:** Pushing to `agent-reference-guide` → Railway does not watch that repo.

---

### Step 2 — Push deploy fix

#### Option A — ARG-Builder (current Railway default)

On **your machine** (not the cloud agent — it cannot push to ARG-Builder):

```bash
git clone https://github.com/jamalboularhbar-design/SAE.git
cd SAE
DEPLOY_CONFIRM=y ./scripts/sync-to-production-repo.sh
```

This copies `apps/playbooks/` (with `Dockerfile` + `railway.toml`) into ARG-Builder and pushes to `main`.

Verify GitHub: https://github.com/jamalboularhbar-design/ARG-Builder/commits/main  
Latest commit should mention **NexusAI rebrand** or **Dockerfile deploy fix**.

#### Option B — SAE monorepo (no ARG-Builder push needed)

1. Pull latest SAE `main` (includes `apps/playbooks/Dockerfile` and `railway.toml`)
2. Railway → Settings → Source → change repo to **`jamalboularhbar-design/SAE`**
3. Set **Root Directory** = `apps/playbooks`
4. Save → **Redeploy**

---

### Step 3 — Redeploy and verify

1. Railway → **Deployments** → latest should show **Success** (Docker build ~3–5 min)
2. Terminal:

```bash
curl -s https://argbuilder.io/ | grep '<title>'
# Expected: NexusAI Playbooks — AI-Powered Operational Intelligence
```

3. Browser: hard refresh (`Ctrl+Shift+R`) if title still shows ARG Builder after curl succeeds.

---

## What the deploy fix includes

| File | Purpose |
|------|---------|
| `Dockerfile` | Forces Node 20 + pnpm build (bypasses Railpack auto-detect) |
| `railway.toml` | `builder = "DOCKERFILE"` |
| `nixpacks.toml` | Fallback if Dockerfile builder unavailable |

---

## Still failing?

1. **Details tab** → confirm commit SHA matches GitHub `main`
2. **Variables** → `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `LLM_API_KEY` set
3. **Build logs** → if Docker fails at `pnpm run build`, run locally: `cd apps/playbooks && pnpm install && pnpm build`
4. Share build log snippet if error persists after correct repo + root directory
