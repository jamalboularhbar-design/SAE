---
name: reference-repos
description: "The four GitHub repos in Jamal's account that relate to ARG-Builder, which one is canonical, and how they relate."
metadata: 
  node_type: memory
  type: reference
  originSessionId: ee5d7b67-b6ec-425f-85dc-32239b69176f
---

All under the GitHub account `jamalboularhbar-design`.

| Repo | Role | Canonical? | Notes |
|---|---|---|---|
| **[SAE](https://github.com/jamalboularhbar-design/SAE)** | Sovereign Automation Engine monorepo | **YES — this is production** | Contains `apps/playbooks` and `apps/nexus-os`. Railway deploys from this. All PR work goes here. |
| **[nexus-os](https://github.com/jamalboularhbar-design/nexus-os)** | Standalone publish of `apps/nexus-os` | Mirror | Published via `publish-nexus-os.yml` workflow in SAE. Don't edit directly — edit in SAE and the publish workflow updates this. |
| **[ARG-Builder](https://github.com/jamalboularhbar-design/ARG-Builder)** | Legacy Railway repo | Stale | Had its own LandingPage and railway.toml. PR #1 was merged here by accident before realizing SAE is the right repo. Inert; close stale PRs. |
| **[agent-reference-guide](https://github.com/jamalboularhbar-design/agent-reference-guide)** | Original Manus-built repo | Empty/abandoned | A single commit `b59d48d` deleted most of the contents. Effectively decommissioned. |

**Inside SAE:**

```
SAE/
├── apps/
│   ├── playbooks/              ← THE app served at argbuilder.io
│   │   ├── client/             vite + react frontend
│   │   ├── server/             express + tRPC server (esbuild bundles to dist/)
│   │   ├── shared/             brand.ts, caseStudies.ts, demoWorkspaces.ts, templateBundles.ts (these cascade through the UI)
│   │   ├── server/nexusOsMount.ts   mounts /os into the playbooks express app
│   │   └── package.json
│   └── nexus-os/               ← mirror of the standalone nexus-os repo
├── packages/                   shared core/ai/templates packages
├── docs/                       product strategy, positioning, roadmap
├── scripts/
│   └── sync-deploy-branch.sh   flattens apps/playbooks + apps/nexus-os into deploy/production for Railway
├── .github/workflows/
│   ├── sync-deploy-branch.yml  fires on push to main, flattens, pushes deploy/production
│   ├── ci-playbooks.yml        CI for playbooks
│   ├── publish-nexus-os.yml    publishes apps/nexus-os to the standalone repo
│   ├── railway-redeploy.yml    triggers Railway redeploy via GraphQL (CURRENTLY FAILING — see [[reference-railway-cloudflare]])
│   └── notion-sync.yml         Notion PPV Ops Hub sync
├── Dockerfile                  copies apps/nexus-os + apps/playbooks, runs pnpm build
└── railway.toml                builder=DOCKERFILE
```

**Brand strings live in `apps/playbooks/shared/brand.ts`.** Most UI components read from `BRAND.*`. Hardcoded exceptions to remember:
- `apps/playbooks/client/index.html` — static `<title>`, OG, Twitter meta tags
- `apps/playbooks/client/src/pages/LandingPage.tsx` `LogoMark` component (image path)
- Strings inside `templateBundles.ts` and `caseStudies.ts` may also have brand mentions

**How to apply:**
- Any "edit the live site" request → SAE repo.
- Any "edit Nexus OS" request → SAE repo's `apps/nexus-os` (NOT the standalone nexus-os repo).
- Don't clone SAE locally on Windows — the seed docs have filenames with colons (`Follow-Up 7: ...`) that Windows can't check out. Use the Git Data API via `gh api` for commits (see the Python scripts in the workspace root from this session: `sae-launch-ready.py`, `sae-unblock-deploy.py`, `sae-mount-and-title.py`).
