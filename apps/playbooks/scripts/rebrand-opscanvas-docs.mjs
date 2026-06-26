/**
 * Replace legacy OpsCanvas branding with ARG-Builder in docs-seed and (optionally) MySQL.
 *
 * Usage:
 *   node scripts/rebrand-opscanvas-docs.mjs              # docs-seed only
 *   node scripts/rebrand-opscanvas-docs.mjs --db         # docs-seed + database
 *   node scripts/rebrand-opscanvas-docs.mjs --db --dry-run
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.join(__dirname, "../docs-seed");

/** Files where OpsCanvas must stay (rejected name in brand table). */
const SKIP_CONTENT_REPLACE = new Set([
  "ARG-Builder: Brand Identity & Messaging Framework.md",
  "ARG-Builder-Brand-Voice-Messaging.md",
]);

const FILE_RENAMES = [
  ["OpsCanvas LinkedIn Content Calendar.md", "ARG-Builder LinkedIn Content Calendar.md"],
  ["OpsCanvas Product Hunt Launch Guide.md", "ARG-Builder Product Hunt Launch Guide.md"],
  ["OpsCanvas Ops Leader Dinner Invitations.md", "ARG-Builder Ops Leader Dinner Invitations.md"],
  ["OpsCanvas Email Automation Setup Guide.md", "ARG-Builder Email Automation Setup Guide.md"],
  ["OpsCanvas-One-Pager.md", "ARG-Builder-One-Pager.md"],
  ["OpsCanvas Stripe Integration Guide.md", "ARG-Builder Stripe Integration Guide.md"],
  ["Go-to-Market Strategy: OpsCanvas by ARG Builder.md", "Go-to-Market Strategy by ARG-Builder.md"],
  ["1 - OpsCanvas.md", "1 - ARG-Builder.md"],
];

function slugify(input) {
  return String(input)
    .replace(/\.md$/i, "")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 200);
}

function rebrandText(text) {
  return text
    .replace(/#OpsCanvas\b/g, "#ARGBuilder")
    .replace(/OpsCanvas/g, "ARG-Builder")
    .replace(/opscanvas\.io/gi, "argbuilder.io")
    .replace(/hello@argbuilder\.io/gi, "hello@argbuilder.io");
}

function rebrandDocsSeed() {
  let filesUpdated = 0;
  for (const file of fs.readdirSync(DOCS_DIR)) {
    if (!file.endsWith(".md") || SKIP_CONTENT_REPLACE.has(file)) continue;
    const filePath = path.join(DOCS_DIR, file);
    const before = fs.readFileSync(filePath, "utf-8");
    if (!/OpsCanvas|opscanvas\.io/i.test(before)) continue;
    const after = rebrandText(before);
    if (after !== before) {
      fs.writeFileSync(filePath, after, "utf-8");
      filesUpdated++;
      console.log(`  updated content: ${file}`);
    }
  }

  let renamed = 0;
  for (const [from, to] of FILE_RENAMES) {
    const fromPath = path.join(DOCS_DIR, from);
    const toPath = path.join(DOCS_DIR, to);
    if (!fs.existsSync(fromPath)) continue;
    if (fs.existsSync(toPath)) fs.unlinkSync(toPath);
    fs.renameSync(fromPath, toPath);
    renamed++;
    console.log(`  renamed: ${from} → ${to}`);
  }

  return { filesUpdated, renamed };
}

async function rebrandDatabase(dryRun) {
  const dbUrl = process.env.DATABASE_URL ?? process.env.MYSQL_URL;
  if (!dbUrl?.trim() || dbUrl.includes("${{")) {
    throw new Error("DATABASE_URL not configured");
  }

  const conn = await mysql.createConnection(dbUrl);
  const [rows] = await conn.execute(
    `SELECT id, slug, title, filename, content FROM documents
     WHERE title LIKE '%OpsCanvas%' OR content LIKE '%OpsCanvas%' OR filename LIKE '%OpsCanvas%' OR slug LIKE '%opscanvas%'`
  );

  console.log(`\nDatabase: ${rows.length} documents to rebrand`);

  for (const row of rows) {
    const skipContent = SKIP_CONTENT_REPLACE.has(row.filename ?? "");
    const newTitle = rebrandText(row.title ?? "");
    const newContent = skipContent ? row.content : rebrandText(row.content ?? "");
    const newFilename = rebrandText(row.filename ?? "");
    let newSlug = row.slug;

    for (const [from, to] of FILE_RENAMES) {
      if (row.filename === from || row.slug === slugify(from)) {
        newSlug = slugify(to);
        break;
      }
    }
    if (/opscanvas/i.test(newSlug)) {
      newSlug = rebrandText(newSlug).toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    }

    console.log(`  ${dryRun ? "[dry-run]" : ""} ${row.slug} → ${newSlug}`);

    if (!dryRun) {
      await conn.execute(
        `UPDATE documents SET slug = ?, title = ?, filename = ?, content = ? WHERE id = ?`,
        [newSlug, newTitle.slice(0, 500), newFilename.slice(0, 500), newContent, row.id]
      );
    }
  }

  await conn.end();
  return rows.length;
}

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const withDb = args.has("--db");

console.log("Rebrand OpsCanvas → ARG-Builder in docs-seed…");
const seedStats = rebrandDocsSeed();
console.log(`docs-seed: ${seedStats.filesUpdated} files updated, ${seedStats.renamed} renamed`);

if (withDb) {
  const count = await rebrandDatabase(dryRun);
  console.log(`database: ${count} rows ${dryRun ? "would be" : ""} updated`);
}
