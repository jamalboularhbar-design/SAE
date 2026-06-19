# Deploy NexusAI PPV Workspace to Notion

Two ways to deploy: **Cursor Notion MCP** (interactive) or **API script** (automated).

---

## Option A — Cursor Notion MCP (recommended for first run)

1. Open **Cursor Settings → MCP → Notion**
2. Click **Connect** and authorize your workspace
3. Re-run the cloud agent request: *"Deploy PPV workspace to Notion"*
4. The agent will create pages and databases via MCP tools

---

## Option B — Notion API script

### 1. Create a Notion integration

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Create integration: **NexusAI Playbooks Deploy**
3. Copy the **Internal Integration Secret** → `NOTION_API_KEY`

### 2. Share pages with the integration

In Notion, open your **Command Center / Master Hub** page and:

- Click **⋯ → Connections → Add connection**
- Select **NexusAI Playbooks Deploy**

Default parent page ID (Master Hub):

```
3548c474-cdec-81ad-8401-fe7a629344d0
```

### 3. Configure environment

Add to `apps/playbooks/.env`:

```bash
NOTION_API_KEY=secret_xxxxxxxx
NOTION_PARENT_PAGE_ID=3548c474-cdec-81ad-8401-fe7a629344d0
# Optional — skip structure creation, only seed data:
# NOTION_PPV_PAGE_ID=your-existing-ppv-page-id
```

### 4. Run deployment

```bash
cd apps/playbooks
pnpm notion:deploy-ppv
```

### 5. Verify

The script prints created page and database URLs. You should see:

- **NexusAI PPV Command Center** (top-level under Master Hub)
- Databases: Pillars, Pipelines, Vaults, Sales Pipeline, Content Calendar, Meeting Tracker, Launch Tasks, Weekly Metrics
- Seeded pillars, pipelines, vault references, LinkedIn posts, 90-day tasks, metric rows

---

## Re-running safely

- First run creates a new Command Center page
- Set `NOTION_PPV_PAGE_ID` to update/seed an existing workspace
- Databases are created fresh each run under the parent page — delete duplicates in Notion if you re-run without `NOTION_PPV_PAGE_ID`

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `401 Unauthorized` | Check `NOTION_API_KEY` |
| `404 object_not_found` | Share parent page with integration |
| `validation_error` on database | Notion API property limits — open issue in SAE repo |
| MCP `needsAuth` | Connect Notion in Cursor IDE settings |

---

## What gets deployed vs. what stays in the app

| Deployed to Notion | Stays in NexusAI Playbooks app |
|--------------------|--------------------------------|
| PPV structure + seed rows | Live leads, trials, analytics |
| Strategy doc references | 525 docs-seed blueprint (unchanged) |
| GTM calendars & checklists | Admin dashboards, crons, Close CRM |
| Weekly metric templates | Real-time KPI queries |

Future: bidirectional sync per `Follow-Up 6: External Tool Integrations.md`.
