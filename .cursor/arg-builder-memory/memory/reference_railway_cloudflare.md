---
name: reference-railway-cloudflare
description: "Deploy pipeline mechanics for argbuilder.io — Cloudflare → Railway. Project names, deploy branch, the auto-redeploy gap."
metadata: 
  node_type: memory
  type: reference
  originSessionId: ee5d7b67-b6ec-425f-85dc-32239b69176f
---

**Routing:**
```
argbuilder.io (DNS via Cloudflare)
    → Railway (proxied/orange-cloud)
        → project "pretty-nourishment"
            → service "ARG-Builder" (display name only; sources from SAE repo)
                → builds from deploy/production branch
                → Nixpacks builder (NOT Dockerfile — despite railway.toml)
```

Confirmed by response headers: `X-Powered-By: Express`, `X-Railway-Request-Id: ...`, `X-Railway-Edge: cdg1` or `bcn1`, `Server: cloudflare`.

**The deploy pipeline:**

```
git push origin main (e.g. PR merge)
    ↓
.github/workflows/sync-deploy-branch.yml runs
    ↓ flattens apps/playbooks + apps/nexus-os → deploy/production branch
    ↓ force-pushes deploy/production
    ↓
.github/workflows/railway-redeploy.yml runs ← CURRENTLY FAILING (missing secrets)
    ↓ POST mutation to https://backboard.railway.app/graphql/v2
    ↓
Railway redeploys
    ↓ ~3–6 min: pnpm install + build:nexus-os + vite build + esbuild + drizzle-kit migrate
    ↓
argbuilder.io serves the new container
```

**The auto-redeploy gap (needs setup):**

In `https://github.com/jamalboularhbar-design/SAE/settings/secrets/actions`:

| Type | Name | Source |
|---|---|---|
| Secret | `RAILWAY_TOKEN` | Railway → top-right avatar → Account Settings → Tokens → New Token (No Team scope). The token is shown once — copy immediately. |
| Variable | `RAILWAY_SERVICE_ID` | Railway → pretty-nourishment → service → Settings → bottom of page, "Service ID" (UUID) |
| Variable | `RAILWAY_ENVIRONMENT_ID` | Railway → environment switcher → production → Settings → "Environment ID" |

After those exist, every push to deploy/production fires `railway-redeploy.yml` and the deploy is fully automatic.

**Until then:** manual Redeploy in Railway dashboard is the only path. From the project canvas → click the service → Deployments tab → ⋮ on top deployment → Redeploy.

**Build mechanics quirks:**
- The `Dockerfile` at SAE root exists but **Railway is using Nixpacks**, not the Dockerfile. The Nixpacks build runs from `/app` (the flattened deploy/production root). Don't waste time tuning the Dockerfile expecting it to be the path that runs — fixes need to live in `apps/playbooks/package.json` and `scripts/sync-deploy-branch.sh`.
- `apps/nexus-os` must be vendored into `./nexus-os` on deploy/production (the sync script does this after PR #13). Without it, `build:nexus-os` fails because `cd ../nexus-os` has nothing to cd into.
- After PR #14, `nexusOsMount.ts` tries multiple candidate paths and logs the chosen one — check Railway runtime logs for `⬡ Nexus OS: using mount module ...` to confirm /os is wired correctly.

**Cloudflare:** zone already exists for argbuilder.io. DNS already points at Railway (no cutover work needed). Cookie consent banner on dash.cloudflare.com can be dismissed with "Reject All" (per privacy default).

**How to apply:**
- After merging any SAE PR, check `gh api repos/jamalboularhbar-design/SAE/commits/deploy/production --jq '.sha'` to confirm Sync workflow updated the branch. If the SHA matches main's recent commit, the GitHub side worked.
- Then check Railway dashboard for the deploy. If status stays "in_progress → inactive" without ever building, the auto-redeploy didn't fire (missing secrets) — go click Redeploy manually.
- If the build log shows `cd ../nexus-os: No such file`, the sync workflow didn't vendor nexus-os correctly — check `scripts/sync-deploy-branch.sh`.
- The `railway-redeploy.yml` workflow being green is the canary that the auto-deploy is wired. If it's red on every push, the secrets aren't set.
