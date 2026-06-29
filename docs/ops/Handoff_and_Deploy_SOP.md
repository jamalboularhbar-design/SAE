# Handoff & Deploy SOP — ARG-Builder / NexusAI Lab

**Last updated:** 2026-06-29  
**Owner:** Jamal  
**Production URL:** https://argbuilder.io

---

## Site map (read this first)

| Site | Host | Role | Touch production? |
|------|------|------|-------------------|
| **argbuilder.io** | **Railway** (`deploy/production` branch) | Full app: 570+ docs, graph, `/os`, admin, AI hub, auth | **Yes — this is production** |
| **Netlify #1** | Netlify | ARG-Builder v1 (first static/marketing version) | No — archive or redirect only |
| **Netlify #2** | Netlify | Lab / staging (e.g. `nexusai-argbuilder-staging`) | No — experiment here |
| **Netlify #3** | Netlify | Other brand site (e.g. Riad & Routes) | No |

**Rule:** Never point `argbuilder.io` DNS at Netlify unless you explicitly decide a cutover with rollback plan.

Verify production:

```bash
curl -sI https://argbuilder.io/ | grep -i railway
# Expect: x-railway-edge
```

---

## What lives where

### Railway production (SAE monorepo)

- **Source:** `apps/playbooks/` in https://github.com/jamalboularhbar-design/SAE  
- **Deploy branch:** `deploy/production` (auto-synced from `main`)  
- **Stack:** Vite + Express + MySQL + Docker  
- **Content:** `docs-seed/` → seeded into MySQL on deploy/maintenance  

### NexusAI Lab folder (local)

```
NexusAI Lab/
├── 01_Strategy/
├── 02_Brand/
├── 03_Content/
├── 04_Build/argbuilder-app/   ← Next.js static experiments
├── 05_Ops/                    ← this SOP, roundtable briefs
└── 07_Roundtable/
```

Lab builds do **not** auto-deploy to argbuilder.io. Merge to Railway only after validation gates (see automotive Phase 0).

---

## Auto-deploy pipeline (production)

```
merge to main (apps/playbooks/**)
    → GitHub: Sync deploy/production branch
    → push deploy/production
    → Railway builds & deploys
    → optional: Railway API redeploy (if RAILWAY_TOKEN set in GitHub)
```

**You do not need** `netlify deploy` for production updates.

### Manual triggers

- **GitHub Actions:** workflow_dispatch on "Sync deploy/production branch"  
- **Admin UI:** `/admin/cross-references` → maintenance (DB scripts, doc rebrand)  
- **Local DB script:** `node scripts/rebrand-opscanvas-docs.mjs --db` (with `DATABASE_URL`)

---

## Pre-merge checklist (Railway)

- [ ] Change is under `apps/playbooks/`  
- [ ] `pnpm check` and `pnpm build` pass locally if large change  
- [ ] No secrets in commit  
- [ ] Brand copy uses **ARG-Builder** (see `shared/brand.ts`)  
- [ ] If docs-seed changed: plan DB maintenance or re-seed after deploy  

---

## Post-deploy verification (5 min)

1. https://argbuilder.io/ — loads, correct title  
2. https://argbuilder.io/docs/brand-voice-messaging — glossary tooltips below terms  
3. https://argbuilder.io/graph — graph renders  
4. https://argbuilder.io/os — Nexus OS demo  
5. Admin login — Quick Edit visible for editors only  

---

## Rollback

1. **Railway:** Redeploy previous successful deployment in Railway dashboard  
2. **Git:** Revert commit on `main`, wait for sync workflow  
3. **DNS:** Do not change unless planned — Cloudflare → Railway CNAME  

---

## Secrets checklist (Railway)

| Variable | Required |
|----------|----------|
| `DATABASE_URL` | Yes |
| `JWT_SECRET` | Yes |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Yes |
| `LLM_API_KEY` / `LLM_API_URL` / `LLM_MODEL` | Yes |
| `S3_*` | Yes (R2 or S3) |
| `STRIPE_*` | Optional (billing) |

GitHub (optional, for API redeploy): `RAILWAY_TOKEN`, `RAILWAY_SERVICE_ID`, `RAILWAY_ENVIRONMENT_ID`

---

## Experiment → production merge gate

Before moving Netlify lab work to Railway:

1. Phase 0 discovery complete (automotive) OR equivalent validation  
2. Feature does not replace core hospitality/creative positioning  
3. Additive only: new workspace, routes behind feature flag, docs-seed  
4. One reference customer or LOI for vertical-specific claims  

See [automotive-morocco-discovery-guide.md](./automotive-morocco-discovery-guide.md).

---

## Related docs

- [roundtable-verdict-automotive-expansion.md](./roundtable-verdict-automotive-expansion.md)  
- `apps/playbooks/DEPLOY.md` — external/Railway env setup  
- `docs/deploy/railway.md` — Railway dashboard settings  
