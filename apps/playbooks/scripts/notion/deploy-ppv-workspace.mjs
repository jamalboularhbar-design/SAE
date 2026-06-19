#!/usr/bin/env node
/**
 * Deploy NexusAI PPV workspace to Notion (August Bradley model).
 *
 * Usage:
 *   NOTION_API_KEY=secret_xxx NOTION_PARENT_PAGE_ID=3548c474-... node scripts/notion/deploy-ppv-workspace.mjs
 *
 * @see docs/notion/deployment-guide.md
 */

import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import {
  createNotionClient,
  createDatabasePage,
  pageUrl,
  titleProp,
  richTextProp,
  selectProp,
  numberProp,
  callout,
  heading2,
  paragraph,
  bullet,
} from "./notion-client.mjs";
import {
  DB_SCHEMAS,
  PILLARS,
  PIPELINES,
  VAULTS,
  LAUNCH_TASKS,
  CONTENT_CALENDAR,
  WEEKLY_METRICS,
} from "./ppv-config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../.env") });

const API_KEY = process.env.NOTION_API_KEY;
const PARENT_PAGE_ID =
  process.env.NOTION_PPV_PAGE_ID ||
  process.env.NOTION_PARENT_PAGE_ID ||
  "3548c474-cdec-81ad-8401-fe7a629344d0";

async function createDatabase(notion, parentId, schema) {
  const db = await notion.createDatabase({
    parent: { type: "page_id", page_id: parentId },
    icon: { type: "emoji", emoji: schema.icon },
    title: [{ type: "text", text: { content: schema.title } }],
    properties: schema.properties,
  });
  console.log(`  ✓ ${schema.title}: ${pageUrl(db.id)}`);
  return db.id;
}

async function createCommandCenterPage(notion, parentId) {
  if (process.env.NOTION_PPV_PAGE_ID) {
    console.log(`Using existing PPV page: ${pageUrl(process.env.NOTION_PPV_PAGE_ID)}`);
    return process.env.NOTION_PPV_PAGE_ID;
  }

  const page = await notion.createPage({
    parent: { page_id: parentId },
    icon: { type: "emoji", emoji: "🧭" },
    properties: {
      title: titleProp("NexusAI PPV Command Center"),
    },
    children: [
      callout(
        "August Bradley PPV System — Pillars (domains) → Pipelines (active work) → Vaults (reference knowledge). Deployed from NexusAI Playbooks SAE monorepo.",
        "🏛️"
      ),
      heading2("Action Zone"),
      paragraph("Monday 9 AM: update Weekly Metrics. Daily: Founder's Launch Checklist (2.5h GTM block)."),
      bullet("Active Pipelines → filter Stage = Active"),
      bullet("Sales Pipeline → update after every demo or outreach batch"),
      bullet("Launch Tasks → sync with 90-day roadmap"),
      heading2("Quick Links"),
      bullet("Live app: https://argbuilder.io"),
      bullet("Admin growth dashboard: /admin/growth"),
      bullet("Intelligence Hub: /ai"),
      bullet("Repo blueprint: docs/notion/ppv-workspace-blueprint.md"),
    ],
  });

  console.log(`\n✓ Command Center: ${pageUrl(page.id)}`);
  return page.id;
}

async function seedPillars(notion, dbId) {
  for (const p of PILLARS) {
    await createDatabasePage(notion, dbId, {
      Name: titleProp(`${p.icon} ${p.name}`),
      Icon: richTextProp(p.icon),
      Vision: richTextProp(p.vision),
      Status: selectProp("Active"),
      "Pillar Score": numberProp(p.score),
      "Quarterly Focus": richTextProp(p.focus),
    });
  }
  console.log(`  ✓ Seeded ${PILLARS.length} pillars`);
}

async function seedPipelines(notion, dbId) {
  for (const p of PIPELINES) {
    await createDatabasePage(notion, dbId, {
      Name: titleProp(p.name),
      Pillar: richTextProp(p.pillar),
      Stage: selectProp(p.stage),
      Type: selectProp(p.type),
      Priority: selectProp(p.priority),
      Progress: numberProp(p.progress / 100),
      Notes: richTextProp(p.notes),
    });
  }
  console.log(`  ✓ Seeded ${PIPELINES.length} pipelines`);
}

async function seedVaults(notion, dbId) {
  for (const v of VAULTS) {
    await createDatabasePage(notion, dbId, {
      Name: titleProp(v.name),
      Category: selectProp(v.category),
      Type: selectProp(v.type),
      Source: richTextProp(`SAE repo: ${v.source}`),
      Status: selectProp("Current"),
    });
  }
  console.log(`  ✓ Seeded ${VAULTS.length} vault entries`);
}

async function seedLaunchTasks(notion, dbId) {
  for (const t of LAUNCH_TASKS) {
    await createDatabasePage(notion, dbId, {
      Task: titleProp(t.task),
      Status: selectProp(t.status),
      Phase: selectProp(t.phase),
      Pillar: richTextProp(t.pillar),
      Priority: selectProp(t.priority),
    });
  }
  console.log(`  ✓ Seeded ${LAUNCH_TASKS.length} launch tasks`);
}

async function seedContentCalendar(notion, dbId) {
  for (const c of CONTENT_CALENDAR) {
    await createDatabasePage(notion, dbId, {
      Title: titleProp(c.title),
      Channel: selectProp(c.channel),
      Status: selectProp(c.status),
      Pillar: richTextProp(c.pillar),
    });
  }
  console.log(`  ✓ Seeded ${CONTENT_CALENDAR.length} content items`);
}

async function seedWeeklyMetrics(notion, dbId) {
  for (const m of WEEKLY_METRICS) {
    await createDatabasePage(notion, dbId, {
      Metric: titleProp(m.metric),
      Quadrant: selectProp(m.quadrant),
      Target: numberProp(m.target),
      Status: selectProp("Watch"),
    });
  }
  console.log(`  ✓ Seeded ${WEEKLY_METRICS.length} metric rows`);
}

async function seedSampleSalesLead(notion, dbId) {
  await createDatabasePage(notion, dbId, {
    Company: titleProp("Example — Horizon Concierge (demo)"),
    Contact: richTextProp("ops@example.com"),
    Stage: selectProp("New"),
    "MRR Value": numberProp(599),
    "Lead Score": numberProp(72),
    Source: selectProp("Demo"),
    "Next Action": richTextProp("Send personalized demo follow-up with ROI calc"),
  });
  console.log("  ✓ Seeded sample sales pipeline row");
}

async function main() {
  console.log("NexusAI PPV → Notion Deployment\n");

  if (!API_KEY) {
    console.error("Missing NOTION_API_KEY. See docs/notion/deployment-guide.md");
    process.exit(1);
  }

  const notion = createNotionClient(API_KEY);
  const parentForHub = process.env.NOTION_PPV_PAGE_ID ? null : PARENT_PAGE_ID;

  let hubId;
  if (parentForHub) {
    hubId = await createCommandCenterPage(notion, parentForHub);
  } else {
    hubId = PARENT_PAGE_ID;
  }

  console.log("\nCreating databases...");
  const dbIds = {};
  for (const [key, schema] of Object.entries(DB_SCHEMAS)) {
    dbIds[key] = await createDatabase(notion, hubId, schema);
    await new Promise((r) => setTimeout(r, 350));
  }

  console.log("\nSeeding data...");
  await seedPillars(notion, dbIds.pillars);
  await seedPipelines(notion, dbIds.pipelines);
  await seedVaults(notion, dbIds.vaults);
  await seedLaunchTasks(notion, dbIds.launchTasks);
  await seedContentCalendar(notion, dbIds.contentCalendar);
  await seedWeeklyMetrics(notion, dbIds.weeklyMetrics);
  await seedSampleSalesLead(notion, dbIds.salesPipeline);

  console.log("\n✅ PPV workspace deployed successfully!");
  console.log(`\nOpen: ${pageUrl(hubId)}`);
  console.log("\nNext steps:");
  console.log("  1. Pin Command Center in Notion sidebar");
  console.log("  2. Link existing Investor Pipeline + Product Backlog from Master Hub");
  console.log("  3. Update Weekly Metrics every Monday");
  console.log("  4. Connect Cursor Notion MCP for live sync in future runs");
}

main().catch((err) => {
  console.error("\n❌ Deployment failed:", err.message);
  process.exit(1);
});
