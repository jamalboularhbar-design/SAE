# Notion Deploy & Sync

## Hub

**NexusAI Playbooks — PPV Ops Hub**  
https://app.notion.com/p/3848c474cdec8159b5e0c721055944cf

Scoped to product/GTM ops only (not full life PPV). Your personal Pillar ⇒ Pipeline Pyramid stays separate.

## Commands

```bash
cd apps/playbooks

# First-time: create hub + databases (once)
pnpm notion:deploy-ppv

# Verify token + hub access
pnpm notion:verify

# Repeatable upsert (structure + curated docs-seed)
pnpm notion:sync

# Full content refresh (~30+ min — rewrites all Vault page bodies)
NOTION_SYNC_LIGHT=0 pnpm notion:sync

# Structure only (skip docs)
NOTION_SYNC_DOCS=0 pnpm notion:sync
```

## Auth

1. Create integration at https://www.notion.so/my-integrations
2. Share **PPV Ops Hub** page with the integration
3. Add to `apps/playbooks/.env` (paste the **full** token — `secret_` or `ntn_` prefix, no quotes):

```bash
NOTION_API_KEY=ntn_paste_your_full_token_here
```

4. Verify before syncing:

```bash
pnpm notion:verify
```

5. For GitHub Actions: add repo secret `NOTION_API_KEY`

## Upsert behavior

- Uses `scripts/notion/.notion-sync-manifest.json` (local) + title matching in Notion
- Updates existing rows; creates new ones; never deletes the hub
- **CI default: light mode** — metadata only (~2–3 min). Skips slow block-by-block body refresh.
- **Full sync:** `NOTION_SYNC_LIGHT=0 pnpm notion:sync` or GitHub Actions manual run with **full_sync** checked
- Curated docs: ~82 files (all RR/AK vertical ops + GTM/sales/strategy tier)
- Full markdown body synced into Vault pages when not in light mode (truncated at ~80 blocks)

## Curated tiers

| Tier | Contents |
|------|----------|
| 1 | All `ARG-Builder-RR-*` and `ARG-Builder-AK-*` + agent specs |
| 2 | GTM, launch, metrics, sales playbooks + monorepo `docs/` |
| 3 | Strategy, product, finance reference patterns |

## Case studies

**Case Study Tracker** database (auto-created on sync):

- Riad & Routes — Live, Needs Improvement
- ArtKech Design Studio — Live, Needs Improvement
- Atlas Collective Agency — Demo vertical
- Maison Voyager Hospitality — Demo vertical

## Automation

| Trigger | Workflow |
|---------|----------|
| `pnpm notion:sync` | Manual |
| Push to `main` (notion/docs paths) | `.github/workflows/notion-sync.yml` |
| Weekly Monday 10:00 UTC | Same workflow (cron) |

## Live brands in app

Demo workspaces restored:

- **Riad & Routes** (`riad-routes`) — travel & concierge case study
- **ArtKech Design Studio** (`artkech`) — creative studio case study
- **Atlas Collective Agency** — multi-brand agency demo
- **Maison Voyager Hospitality** — hospitality/compliance demo
