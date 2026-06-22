---
name: project-deploy-state
description: Live deploy state of argbuilder.io — updated 2026-06-22 after Rovo graph merge+deploy.
metadata:
  node_type: memory
  type: project
---

**As of 2026-06-22 ~16:46 UTC:**

## Live status ✓

- **URL:** https://argbuilder.io
- **Railway:** project `pretty-nourishment`, service `ARG-Builder`, edge `yyz1`/`cdg1`
- **Source:** SAE repo branch `deploy/production`
- **Title:** `ARG-Builder | Playbooks and the runtime that runs them`
- **Nexus OS:** https://argbuilder.io/os/ — live
- **Knowledge graph (Rovo):** https://argbuilder.io/graph — live (`kg-rovo` in JS bundle)

## Git SHAs

| Branch | SHA | Notes |
|--------|-----|-------|
| `main` | `e9f0be0` | Rovo Pro knowledge graph redesign |
| `deploy/production` | `9ff46b4` | Synced from main e9f0be0 |

## Recent merges (shipped)

| PR | Summary | Status |
|----|---------|--------|
| #17 | Rovo Pro-style knowledge graph | Merged + deployed |
| (prior) | Light mode UI, doc tables, product nav/footer | Merged + deployed |
| (prior) | Public `/graph` enhanced visualization | Merged + deployed |

## Deploy pipeline (working)

```
push main → sync-deploy-branch.yml → force-push deploy/production → Railway rebuild (~3–5 min)
```

**Verify after every ship:**

```bash
curl -sI https://argbuilder.io/logo-mark.png | grep HTTP    # 200
JS=$(curl -s https://argbuilder.io/graph | grep -oE 'index-[^"]+\.js' | head -1)
curl -s "https://argbuilder.io/assets/$JS" | grep -c 'kg-rovo'
```

## Known gaps

| Issue | Status |
|-------|--------|
| `railway-redeploy.yml` | Fails without `RAILWAY_TOKEN` secret — Railway still redeploys on `deploy/production` push (observed working) |
| `ARG-Builder` repo push | `cursor[bot]` denied — use SAE `deploy/production` only |
| `sync-deploy-branch.sh` | Needs `rsync` OR manual `cp` fallback on cloud VMs |
| Logo "crushed" on `/product` | Open — may need `LogoMark size="lg"` in MarketingNav + verify asset on deploy branch |
| `og-image.png` | Not updated with new logo mark |

## Do not assume

- Merge to `main` ≠ live until `deploy/production` pushed AND curl verification passes
- User dashboard (`/my-dashboard`) ≠ marketing pages — fix both when doing theme work
