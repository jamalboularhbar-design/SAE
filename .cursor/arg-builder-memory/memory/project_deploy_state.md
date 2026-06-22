---
name: project-deploy-state
description: Live deploy state of argbuilder.io as of session end (2026-06-22) — three merges sitting on main but not actually deployed.
metadata: 
  node_type: memory
  type: project
  originSessionId: ee5d7b67-b6ec-425f-85dc-32239b69176f
---

**As of 2026-06-22 ~02:30 UTC, end of session:**

- `argbuilder.io` is serving from Railway (project `pretty-nourishment`, service `ARG-Builder`).
- The live container is still on a build from **2026-06-19** (commit `e22c2d1`, the "Gumroad manual listing kit" commit). Title still shows *"NexusAI Playbooks — AI-Powered Operational Intelligence"* (the old em-dash version).
- `/os` returns 404.
- /product shows 4 NexusAI string hits, 0 ARG-Builder.

**Three SAE PRs are merged to main but none have shipped to the container:**
- [#11](https://github.com/jamalboularhbar-design/SAE/pull/11) — ARG-Builder rebrand + audit P0 fixes
- [#13](https://github.com/jamalboularhbar-design/SAE/pull/13) — Dockerfile + sync-deploy script unblock
- [#14](https://github.com/jamalboularhbar-design/SAE/pull/14) — /os mount path resolution + static index.html title

`main` HEAD: `d3e962a` · `deploy/production` HEAD: `f07da4f` (correctly synced).

**Why nothing has shipped:** Railway's auto-deploy on push to `deploy/production` isn't firing. The `railway-redeploy.yml` workflow that would call Railway's GraphQL is failing on every push because the secrets aren't set in the SAE repo settings. See [[reference-railway-cloudflare]] for the exact secrets needed.

**To ship the merged work:** manual Redeploy in Railway dashboard. Then set the three secrets/vars so future merges auto-deploy.

**What's expected once it ships:**

| Check | Expected after deploy |
|---|---|
| `<title>` | `ARG-Builder \| Playbooks and the runtime that runs them` |
| `/product` masthead | "ARG-Builder" |
| Founding cohort copy | "first 10 seats" |
| Demo verticals | labelled "Reference architecture" (was "Demo vertical") |
| `/os` | UI loads (assuming `build:nexus-os` finds the vendored source) |
| Railway runtime log | `⬡ Nexus OS: using mount module /app/nexus-os/dist/server/mount.js` |

If the rebrand strings land but `/os` still 404s, the diagnostic is in the build log — `build:nexus-os` either succeeded (mount module exists) or failed silently (the PR #14 verbose logging will say which paths were tried).

**Open code questions** (not part of this PR series):
- `/` vs `/app` split — the homepage still shows the app shell to anonymous visitors. Needs the auth-gate decision.
- Drop or keep the $39/mo Stripe tier on the public surface — audit synthesis recommends drop, Jamal hasn't decided.

**How to apply:** Don't assume code changes are live until verified against `curl -s https://argbuilder.io | grep title` (or similar). The merge-to-deploy gap is real and currently manual.
