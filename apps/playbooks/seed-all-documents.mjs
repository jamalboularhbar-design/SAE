/**
 * Seed the full ARG-Builder document library (target: 525 docs).
 * Self-contained — no local imports (Railway-safe).
 *
 * Usage: pnpm seed:525
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.join(__dirname, "docs-seed");
const CATALOG_TS = path.join(__dirname, "client/src/lib/documentCatalog.ts");

// ── seed helpers (inlined from scripts/seed-lib.mjs) ─────────────────────

function stripManusFooter(content) {
  if (!content) return content;
  const MANUS_FOOTER_PATTERN = /\n*---?\n*\n*\*Document prepared by Manus AI[^*]*\*\s*$/i;
  const MANUS_FOOTER_ALT = /\n*\*?(?:Document )?(?:prepared|generated) by Manus(?: AI)?[^*\n]*\*?\s*$/i;
  return content.replace(MANUS_FOOTER_PATTERN, "").replace(MANUS_FOOTER_ALT, "").trimEnd();
}

function slugify(input) {
  return String(input)
    .replace(/\.md$/i, "")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 200);
}

function catalogSlug(filename) {
  const base = filename.replace(/^ARG-Builder-/i, "").replace(/\.md$/i, "");
  return slugify(base);
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/arg-builder[-: ]+/g, " ")
    .replace(/\.md$/i, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 2 && !["the", "and", "for", "with", "playbook", "framework", "guide"].includes(w));
}

function tokenScore(a, b) {
  const A = new Set(tokenize(a));
  const B = new Set(tokenize(b));
  if (!A.size || !B.size) return 0;
  const inter = [...A].filter((x) => B.has(x)).length;
  return inter / new Set([...A, ...B]).size;
}

function parseCatalog() {
  if (!fs.existsSync(CATALOG_TS)) {
    console.error(`Catalog not found: ${CATALOG_TS}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(CATALOG_TS, "utf-8");
  return [...raw.matchAll(/\{\s*id:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*filename:\s*"([^"]+)"\s*\}/g)].map(
    (m) => ({
      id: m[1],
      title: m[2],
      category: m[3],
      filename: m[4],
      slug: catalogSlug(m[4]),
    })
  );
}

function loadDocsSeedFiles() {
  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`docs-seed not found: ${DOCS_DIR}`);
    return [];
  }
  return fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((filename) => {
      const filePath = path.join(DOCS_DIR, filename);
      const content = stripManusFooter(fs.readFileSync(filePath, "utf-8"));
      return {
        filename,
        slug: slugify(filename),
        title: filename
          .replace(/\.md$/i, "")
          .replace(/^ARG-Builder[-: ]+/i, "")
          .replace(/^ARG Builder — /, "")
          .replace(/[-_]/g, " ")
          .trim(),
        content,
        wordCount: content.split(/\s+/).filter(Boolean).length,
      };
    });
}

function findBestSeedFile(entry, seedFiles, usedFilenames) {
  const available = seedFiles.filter((f) => !usedFilenames.has(f.filename));
  const exact = available.find((f) => f.filename === entry.filename);
  if (exact) return { file: exact, score: 1, matchType: "exact" };

  let best = null;
  let bestScore = 0;
  for (const f of available) {
    const score = Math.max(
      tokenScore(entry.filename, f.filename),
      tokenScore(entry.title, f.title),
      tokenScore(entry.id, f.filename),
      tokenScore(entry.slug, f.slug)
    );
    if (score > bestScore) {
      bestScore = score;
      best = f;
    }
  }
  if (best && bestScore >= 0.45) return { file: best, score: bestScore, matchType: "fuzzy" };
  return null;
}

function stubContent(title, category) {
  return `# ${title}

> **${category}** · Part of the ARG-Builder Playbooks library

This playbook is indexed in the Master Document Library. Structured content for **${title}** is being restored to the library — browse related documents on the [knowledge graph](/graph).

## Purpose

Operational guidance for ${category.toLowerCase()} teams on **${title.toLowerCase()}**.

## Recommended next steps

1. Review prerequisites in the same category on the knowledge graph
2. Adapt templates and checklists to your workspace
3. Link this document to active OKRs or operating cadences

---

*ARG-Builder Playbooks · [argbuilder.io](https://argbuilder.io)*
`;
}

function categorizeFromFilename(filename) {
  const categories = {
    Engineering: ["engineering", "ci-cd", "devops", "kubernetes", "api", "architecture", "infrastructure", "terraform", "pipeline", "observability", "security", "technical"],
    Sales: ["sales", "sdr", "deal", "pipeline", "demo", "objection", "forecast", "revops", "outreach"],
    Marketing: ["marketing", "seo", "content", "email", "demand-gen", "abm", "brand", "launch", "linkedin"],
    "Customer Success": ["customer", "onboarding", "churn", "retention", "health-score", "qbr", "success"],
    Product: ["product", "roadmap", "feature", "prototype", "analytics", "metrics"],
    "Finance & Legal": ["finance", "legal", "accounting", "revenue", "fundraising", "investor", "cap-table", "pricing"],
    "Strategy & Operations": ["strategy", "okr", "planning", "board", "operating", "founder", "implementation"],
    "People & Culture": ["hiring", "talent", "employee", "culture", "handbook", "hr"],
    "AI & Developer": ["ai", "ml", "agent", "llm", "copilot"],
    "Security & Compliance": ["compliance", "soc-2", "gdpr", "privacy", "audit"],
    "Partnerships & GTM": ["partner", "channel", "gtm", "referral", "ecosystem"],
    "Data & Analytics": ["data", "analytics", "cohort", "cdp", "warehouse"],
    "Revenue & Pricing": ["pricing", "monetization", "acv", "unit-economics"],
    Operations: ["incident", "on-call", "runbook", "vendor", "procurement"],
    "Riad & Routes": ["RR-", "riad", "routes", "concierge", "hospitality", "travel"],
    "ArtKech Design Studio": ["AK-", "artkech", "creative", "design-studio"],
  };

  if (filename.includes("RR-") || filename.includes("Riad")) return "Riad & Routes";
  if (filename.includes("AK-") || filename.includes("ArtKech")) return "ArtKech Design Studio";

  const nameLower = filename.toLowerCase();
  let best = "Strategy & Operations";
  let bestScore = 0;
  for (const [cat, keywords] of Object.entries(categories)) {
    const score = keywords.filter((kw) => nameLower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      best = cat;
    }
  }
  return best;
}

// ── main ───────────────────────────────────────────────────────────────────

const args = new Set(process.argv.slice(2));
const force = args.has("--force");
const withStubs = args.has("--with-stubs") || !args.has("--no-stubs");
const docsOnly = args.has("--docs-only");
const includeExtras = args.has("--include-extras");
const includePersona = args.has("--include-persona") || args.has("--include-extras");

const META_FILE_PATTERN =
  /^(todo|workflow|components|periodic-updates|SKILL|FINAL_REPORT|PROJECT-SUMMARY|presentation-content|pitch-deck|email-capture|agent_design|agent_system_prompt|www\.|Loss Analysis)\.md$/i;

function isMetaSeedFile(filename) {
  if (META_FILE_PATTERN.test(filename)) return true;
  if (/^Follow-Up \d/i.test(filename)) return true;
  if (/^1 - /i.test(filename)) return true;
  if (/Agent Reference Guide/i.test(filename) && !/Playbook/i.test(filename)) return true;
  return false;
}

function isPersonaOrGtmFile(filename) {
  return /RR-/i.test(filename) || /AK-/i.test(filename) || /^ARG Builder —/i.test(filename) || /^ARG-Builder /i.test(filename) || /^OpsCanvas /i.test(filename);
}

async function insertBatch(connection, rows) {
  if (!rows.length) return;
  const batchSize = 25;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const placeholders = batch.map(() => "(?, ?, ?, ?, ?, ?, 'published')").join(", ");
    const values = batch.flatMap((r) => [
      r.slug,
      r.title.slice(0, 500),
      r.category.slice(0, 100),
      r.filename.slice(0, 500),
      r.content,
      r.wordCount,
    ]);
    await connection.execute(
      `INSERT INTO documents (slug, title, category, filename, content, wordCount, status) VALUES ${placeholders}
       ON DUPLICATE KEY UPDATE title=VALUES(title), category=VALUES(category), filename=VALUES(filename),
         content=VALUES(content), wordCount=VALUES(wordCount), status='published'`,
      values
    );
    process.stdout.write(`\r  inserted ${Math.min(i + batchSize, rows.length)}/${rows.length}`);
  }
  process.stdout.write("\n");
}

async function main() {
  console.log(`seed-all-documents v2 (self-contained) cwd=${process.cwd()}`);

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  const seedFiles = loadDocsSeedFiles();
  console.log(`docs-seed files on disk: ${seedFiles.length} (${DOCS_DIR})`);

  const connection = await mysql.createConnection(dbUrl);
  console.log("Connected to database");

  if (force) {
    await connection.execute("DELETE FROM documents");
    console.log("Cleared existing documents (--force)");
  }

  const toInsert = [];
  const usedFilenames = new Set();
  const usedSlugs = new Set();
  let stats = { exact: 0, fuzzy: 0, stub: 0, docsSeedOnly: 0, skipped: 0 };

  if (docsOnly) {
    for (const f of seedFiles) {
      toInsert.push({
        slug: f.slug,
        title: f.title,
        category: categorizeFromFilename(f.filename),
        filename: f.filename,
        content: f.content,
        wordCount: f.wordCount,
      });
      usedSlugs.add(f.slug);
    }
    stats.docsSeedOnly = seedFiles.length;
  } else {
    const catalog = parseCatalog();
    console.log(`catalog entries: ${catalog.length}`);

    for (const entry of catalog) {
      const match = findBestSeedFile(entry, seedFiles, usedFilenames);
      let content;
      let filename = entry.filename;
      let wordCount;

      if (match) {
        usedFilenames.add(match.file.filename);
        content = match.file.content;
        wordCount = match.file.wordCount;
        if (match.matchType === "exact") stats.exact++;
        else stats.fuzzy++;
      } else if (withStubs) {
        content = stubContent(entry.title, entry.category);
        wordCount = content.split(/\s+/).filter(Boolean).length;
        stats.stub++;
      } else {
        stats.skipped++;
        continue;
      }

      if (usedSlugs.has(entry.slug)) continue;
      usedSlugs.add(entry.slug);

      toInsert.push({
        slug: entry.slug,
        title: entry.title,
        category: entry.category,
        filename,
        content,
        wordCount,
      });
    }

    if (includePersona || includeExtras) {
      for (const f of seedFiles) {
        if (usedFilenames.has(f.filename) || usedSlugs.has(f.slug)) continue;
        if (isMetaSeedFile(f.filename)) continue;
        if (includePersona && !includeExtras && !isPersonaOrGtmFile(f.filename)) continue;

        usedSlugs.add(f.slug);
        usedFilenames.add(f.filename);
        stats.docsSeedOnly++;
        toInsert.push({
          slug: f.slug,
          title: f.title,
          category: categorizeFromFilename(f.filename),
          filename: f.filename,
          content: f.content,
          wordCount: f.wordCount,
        });
      }
    }
  }

  console.log(`\nSeeding ${toInsert.length} documents...`);
  console.log(`  catalog exact: ${stats.exact}, fuzzy: ${stats.fuzzy}, stubs: ${stats.stub}`);
  console.log(`  docs-seed only: ${stats.docsSeedOnly}, skipped: ${stats.skipped}`);

  await insertBatch(connection, toInsert);

  const [[{ count }]] = await connection.execute("SELECT COUNT(*) as count FROM documents");
  console.log(`\nDone! ${count} documents in database.`);

  if (stats.stub > 0) {
    console.log(`${stats.stub} catalog entries use placeholder content until originals are restored.`);
  }

  await connection.end();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
