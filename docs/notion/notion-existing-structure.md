# Notion Workspace Map (NexusAI PPV)

> **Deploy:** `cd apps/playbooks && pnpm notion:deploy-ppv` — see [deployment-guide.md](./deployment-guide.md)

## Existing Hub (pre-PPV)

| Element | ID |
|---------|-----|
| Master Hub | `3548c474-cdec-81ad-8401-fe7a629344d0` |
| Product Workspace | `35b8c474-cdec-816c-8b47-fa8e16e62047` |
| Investor Pipeline | `collection://0e57772c-1447-4c15-a7d1-7ad326c9f81c` |
| Product Backlog | `collection://043e77fc-db61-4284-8041-6c03090d498f` |

## PPV Command Center (August Bradley)

Created by `scripts/notion/deploy-ppv-workspace.mjs` under Master Hub:

| Database | Purpose |
|----------|---------|
| **Pillars** | 6 NexusAI life/business domains |
| **Pipelines** | Active projects & goals |
| **Vaults** | Reference playbooks (repo path index) |
| **Sales Pipeline** | CRM — mirrors `/admin/leads` |
| **Content Calendar** | GTM content — from LinkedIn calendar seed |
| **Meeting Tracker** | Demos, dinners, investor calls |
| **Launch Tasks** | 90-day roadmap tasks |
| **Weekly Metrics** | 4-quadrant dashboard template |

Full blueprint: [ppv-workspace-blueprint.md](./ppv-workspace-blueprint.md)
