# Troubleshooting: Push succeeded but site unchanged

## Diagnosis (June 2026)

**This is NOT primarily a Cloudflare cache issue.**

Live headers from `argbuilder.io/product`:

```
server: cloudflare
cf-cache-status: DYNAMIC        ← HTML is NOT cached by Cloudflare
x-railway-edge: railway/us-east4-eqdc4a   ← Origin is Railway
```

The problem: **Railway deploys from `agent-reference-guide` on GitHub `main`**, and that branch **does not contain the NexusAI rebrand commit yet**.

| Check | Expected | Actual |
|-------|----------|--------|
| GitHub `agent-reference-guide` latest commit | `feat: NexusAI rebrand...` | Still `7ac3c33` (June 11) |
| Live `index.html` title | NexusAI Playbooks | ARG Builder |
| Live JS bundle | Contains `NexusAI` | Contains `ARG Builder` (103×) |

You likely pushed **SAE** successfully, but **not `agent-reference-guide`** — which is what Railway watches.

---

## Fix (2 minutes)

### Step 1 — Push the production repo

```bash
cd agent-reference-guide   # must be the production repo, NOT SAE/

git log --oneline -1
# Should show: feat: NexusAI rebrand, product page, and Intelligence Hub surfacing

git push origin main
```

If you don't have the commit locally:

```bash
git clone https://github.com/jamalboularhbar-design/SAE.git
cd SAE
DEPLOY_CONFIRM=y ./scripts/sync-to-production-repo.sh
```

### Step 2 — Confirm GitHub updated

Open: https://github.com/jamalboularhbar-design/agent-reference-guide/commits/main

Latest commit should be **"feat: NexusAI rebrand..."** — not June 11.

### Step 3 — Railway redeploy

Railway usually auto-deploys on push. If not:

1. Railway dashboard → your service → **Deployments**
2. Click **Redeploy** on latest, or **Deploy** from `main`

### Step 4 — Verify (not Cloudflare first)

```bash
curl -s https://argbuilder.io/ | grep '<title>'
# Should show: NexusAI Playbooks — AI-Powered Operational Intelligence
```

Hard refresh: `Ctrl+Shift+R` (or Safari: clear cache for site).

---

## Cloudflare (optional, after correct deploy)

Only needed if title updates on Railway URL but not on `argbuilder.io`:

1. Cloudflare dashboard → **Caching** → **Configuration**
2. **Purge Everything** (or Purge by URL: `argbuilder.io/product`)
3. Check **Page Rules** / **Cache Rules** — avoid caching `/*.js` or `/product` aggressively for now

Also verify DNS:

- `argbuilder.io` → CNAME to Railway (orange cloud = proxy on)
- Railway service → **Settings** → **Domains** shows `argbuilder.io` attached

---

## Which repo goes where

| Repo | Purpose | Railway? |
|------|---------|----------|
| `agent-reference-guide` | **Production app** (argbuilder.io) | ✅ Yes |
| `SAE` | Monorepo + strategy docs | ❌ Unless you reconfigure Railway root to `apps/playbooks` |

---

## Quick verification checklist

After push + deploy:

- [ ] https://github.com/jamalboularhbar-design/agent-reference-guide/commits/main shows NexusAI commit
- [ ] Railway deployment shows **Success** with that commit SHA
- [ ] `curl -s https://argbuilder.io/ | grep title` → NexusAI
- [ ] https://argbuilder.io/product → Intelligence section + comparison table
- [ ] https://argbuilder.io/ai → NexusAI Intelligence Hub
