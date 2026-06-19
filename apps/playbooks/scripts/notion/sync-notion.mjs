#!/usr/bin/env node
/**
 * Upsert sync: NexusAI PPV Ops Hub + curated docs-seed → Notion.
 *
 * Usage:
 *   NOTION_API_KEY=secret_xxx pnpm notion:sync
 *   NOTION_SYNC_DOCS=0 pnpm notion:sync   # structure only
 *
 * @see docs/notion/deployment-guide.md
 */
import fs from "fs";
import path from "path";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import {
  createNotionClient,
  pageUrl,
  selectProp,
  titleProp,
  richTextProp,
  numberProp,
  slugify,
  upsertDatabaseRow,
  sleep,
} from "./notion-client.mjs";
import { getCuratedDocs, summarizeMarkdown } from "./curate-docs.mjs";
import {
  PILLARS,
  PIPELINES,
  VAULTS,
  LAUNCH_TASKS,
  CONTENT_CALENDAR,
  WEEKLY_METRICS,
  CASE_STUDIES,
} from "./ppv-config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "../../.env") });

function mapPillar(p) {
  if (p === "Finance & Fundraising") return "Finance";
  return p;
}

function mapVaultCategory(c) {
  if (c === "Reference" || c === "Customer Success") return "Strategy";
  if (c === "Competitive") return "Competitive";
  return c;
}

const MANIFEST_PATH = path.join(__dirname, ".notion-sync-manifest.json");
const DEFAULT_MANIFEST = path.join(__dirname, "manifest.default.json");

function loadManifest() {
  if (fs.existsSync(MANIFEST_PATH)) {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  }
  const base = JSON.parse(fs.readFileSync(DEFAULT_MANIFEST, "utf8"));
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(base, null, 2));
  return base;
}

function saveManifest(manifest) {
  manifest.lastSync = new Date().toISOString();
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

async function ensureCaseStudiesDb(notion, manifest) {
  if (manifest.databases.caseStudies) return manifest.databases.caseStudies;

  const db = await notion.createDatabase({
    parent: { type: "page_id", page_id: manifest.hubPageId },
    icon: { type: "emoji", emoji: "🏆" },
    title: [{ type: "text", text: { content: "Case Study Tracker" } }],
    properties: {
      Workspace: { title: {} },
      Status: {
        select: {
          options: [
            { name: "Live" },
            { name: "Demo" },
            { name: "Needs Improvement" },
            { name: "Paused" },
          ],
        },
      },
      Vertical: {
        select: {
          options: [
            { name: "Travel & Concierge" },
            { name: "Creative Studio" },
            { name: "Agency" },
            { name: "Hospitality" },
            { name: "Platform" },
          ],
        },
      },
      Priority: {
        select: {
          options: [{ name: "Critical" }, { name: "High" }, { name: "Medium" }, { name: "Low" }],
        },
      },
      "Improvement Notes": { rich_text: {} },
      "Live URL": { rich_text: {} },
    },
  });
  manifest.databases.caseStudies = db.id;
  console.log(`  ✓ Created Case Study Tracker: ${pageUrl(db.id)}`);
  return db.id;
}

async function syncStructure(notion, manifest) {
  console.log("\n📐 Syncing PPV structure (upsert)…");
  const d = manifest.databases;

  for (const p of PILLARS) {
    const title = `${p.icon} ${p.name}`;
    await upsertDatabaseRow(notion, {
      databaseId: d.pillars,
      titleProperty: "Pillar",
      title,
      manifestKey: `pillar:${slugify(p.name)}`,
      manifest,
      properties: {
        Pillar: titleProp(title),
        "Pillar Group": selectProp(p.name.includes("Brand") ? "Growth" : "Business"),
        Status: selectProp("Active"),
        "Pillar Score": numberProp(p.score),
      },
    });
    await sleep(150);
  }

  for (const p of PIPELINES) {
    await upsertDatabaseRow(notion, {
      databaseId: d.pipelines,
      titleProperty: "Name",
      title: p.name,
      manifestKey: `pipeline:${slugify(p.name)}`,
      manifest,
      properties: {
        Name: titleProp(p.name),
        Pillar: selectProp(mapPillar(p.pillar)),
        Stage: selectProp(p.stage),
        Type: selectProp(p.type),
        Priority: selectProp(p.priority),
        Progress: numberProp(p.progress / 100),
      },
    });
    await sleep(150);
  }

  for (const t of LAUNCH_TASKS) {
    await upsertDatabaseRow(notion, {
      databaseId: d.launchTasks,
      titleProperty: "Task",
      title: t.task,
      manifestKey: `task:${slugify(t.task)}`,
      manifest,
      properties: {
        Task: titleProp(t.task),
        Status: selectProp(t.status),
        Phase: selectProp(t.phase),
        Pillar: selectProp(mapPillar(t.pillar)),
        Priority: selectProp(t.priority),
      },
    });
    await sleep(120);
  }

  for (const m of WEEKLY_METRICS) {
    await upsertDatabaseRow(notion, {
      databaseId: d.weeklyMetrics,
      titleProperty: "Metric",
      title: m.metric,
      manifestKey: `metric:${slugify(m.metric)}`,
      manifest,
      properties: {
        Metric: titleProp(m.metric),
        Quadrant: selectProp(m.quadrant),
        Target: numberProp(m.target),
        Status: selectProp("Watch"),
      },
    });
    await sleep(100);
  }

  for (const c of CONTENT_CALENDAR) {
    await upsertDatabaseRow(notion, {
      databaseId: d.contentCalendar,
      titleProperty: "Title",
      title: c.title,
      manifestKey: `content:${slugify(c.title)}`,
      manifest,
      properties: {
        Title: titleProp(c.title),
        Channel: selectProp(c.channel),
        Status: selectProp(c.status),
        Pillar: selectProp(c.pillar.replace("GTM & Sales", "GTM & Sales")),
      },
    });
    await sleep(100);
  }

  const caseDb = await ensureCaseStudiesDb(notion, manifest);
  for (const cs of CASE_STUDIES) {
    await upsertDatabaseRow(notion, {
      databaseId: caseDb,
      titleProperty: "Workspace",
      title: cs.workspace,
      manifestKey: `case:${slugify(cs.workspace)}`,
      manifest,
      properties: {
        Workspace: titleProp(cs.workspace),
        Status: selectProp(cs.status),
        Vertical: selectProp(cs.vertical),
        Priority: selectProp(cs.priority),
        "Improvement Notes": richTextProp(cs.improvements),
        "Live URL": richTextProp(cs.liveUrl ?? ""),
      },
    });
    await sleep(150);
  }

  // Sales pipeline — live case study prospects
  await upsertDatabaseRow(notion, {
    databaseId: d.salesPipeline,
    titleProperty: "Company",
    title: "Riad & Routes (live case study)",
    manifestKey: "sales:riad-routes",
    manifest,
    properties: {
      Company: titleProp("Riad & Routes (live case study)"),
      Stage: selectProp("Qualified"),
      "MRR Value": numberProp(599),
      "Lead Score": numberProp(95),
      Source: selectProp("Organic"),
    },
  });
  await upsertDatabaseRow(notion, {
    databaseId: d.salesPipeline,
    titleProperty: "Company",
    title: "ArtKech Design Studio (live case study)",
    manifestKey: "sales:artkech",
    manifest,
    properties: {
      Company: titleProp("ArtKech Design Studio (live case study)"),
      Stage: selectProp("Qualified"),
      "MRR Value": numberProp(599),
      "Lead Score": numberProp(92),
      Source: selectProp("Organic"),
    },
  });

  console.log("  ✓ Structure sync complete");
}

async function syncDocs(notion, manifest) {
  if (process.env.NOTION_SYNC_DOCS === "0") {
    console.log("\n📚 Skipping docs-seed (NOTION_SYNC_DOCS=0)");
    return;
  }

  console.log("\n📚 Syncing curated docs-seed (upsert)…");
  const docs = getCuratedDocs();
  console.log(`  ${docs.length} documents in curated set`);

  let created = 0;
  let updated = 0;

  for (const doc of docs) {
    const content = fs.readFileSync(doc.absPath, "utf8");
    const title = doc.file.replace(/\.md$/, "");
    const header = `# ${title}\n\n> **Workspace:** ${doc.workspace} · **Tier:** ${doc.tier}\n> **Source:** \`${doc.id}\`\n\n---\n\n`;
    const body = header + content;

    const result = await upsertDatabaseRow(notion, {
      databaseId: manifest.databases.vaults,
      titleProperty: "Name",
      title,
      manifestKey: `doc:${slugify(doc.id)}`,
      manifest,
      content: body,
      properties: {
        Name: titleProp(title),
        Category: selectProp(mapVaultCategory(doc.category)),
        Type: selectProp(doc.type),
        Status: selectProp("Current"),
      },
    });

    if (result.action === "created") created++;
    else updated++;

    if ((created + updated) % 10 === 0) {
      console.log(`  … ${created + updated}/${docs.length}`);
      saveManifest(manifest);
    }
    await sleep(250);
  }

  console.log(`  ✓ Docs sync: ${created} created, ${updated} updated`);
}

async function main() {
  const apiKey = (process.env.NOTION_API_KEY ?? "").trim();
  if (!apiKey) {
    console.error("NOTION_API_KEY required. See docs/notion/deployment-guide.md");
    process.exit(1);
  }
  if (apiKey.includes("...") || apiKey.length < 40) {
    console.error(
      "NOTION_API_KEY looks like a placeholder. Paste your full token into apps/playbooks/.env, then run: pnpm notion:verify"
    );
    process.exit(1);
  }

  const manifest = loadManifest();
  const notion = createNotionClient(apiKey);

  console.log("NexusAI → Notion upsert sync");
  console.log(`Hub: ${manifest.hubPageUrl ?? pageUrl(manifest.hubPageId)}`);

  await syncStructure(notion, manifest);
  await syncDocs(notion, manifest);

  saveManifest(manifest);
  console.log(`\n✅ Sync complete · manifest: ${MANIFEST_PATH}`);
}

main().catch((err) => {
  console.error("\n❌ Sync failed:", err.message);
  process.exit(1);
});
