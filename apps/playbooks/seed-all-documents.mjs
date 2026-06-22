/**
 * Seed the full ARG-Builder document library (target: 525 docs).
 *
 * Sources (in priority order):
 * 1. documentCatalog.ts — 515 canonical playbooks (Manus-era flat filenames)
 * 2. docs-seed/*.md — 281 markdown files on disk (colon/dash naming)
 * 3. Structured stubs for catalog entries with no matching file (--with-stubs, default)
 *
 * Usage (Railway console):
 *   pnpm seed:525
 *   pnpm graph:populate
 *
 * Flags:
 *   --force            DELETE all documents first, then re-seed
 *   --with-stubs       Placeholder content for catalog entries without a file match (default)
 *   --no-stubs         Skip catalog entries that have no content file
 *   --include-persona  Add RR/AK + GTM docs from docs-seed (515 + ~35 → ~550)
 *   --include-extras   Add all non-meta docs-seed files not already mapped
 *   --docs-only        Only seed docs-seed files (legacy ~281)
 */
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import {
  parseCatalog,
  loadDocsSeedFiles,
  findBestSeedFile,
  stubContent,
  categorizeFromFilename,
} from "./seed-lib.mjs";

dotenv.config();

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
  return (
    /RR-/i.test(filename) ||
    /AK-/i.test(filename) ||
    /^ARG Builder —/i.test(filename) ||
    /^OpsCanvas /i.test(filename)
  );
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
       ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         category = VALUES(category),
         filename = VALUES(filename),
         content = VALUES(content),
         wordCount = VALUES(wordCount),
         status = 'published'`,
      values
    );
    process.stdout.write(`\r  inserted ${Math.min(i + batchSize, rows.length)}/${rows.length}`);
  }
  process.stdout.write("\n");
}

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  const seedFiles = loadDocsSeedFiles();
  console.log(`docs-seed files on disk: ${seedFiles.length}`);

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
        // Keep catalog filename for canonical identity; content from matched file
        if (match.file.filename !== entry.filename) {
          filename = entry.filename;
        }
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

    // Persona / GTM extras from docs-seed (target ~525 = 515 catalog + ~10 vertical docs)
    if (includePersona || includeExtras) {
      const extras = seedFiles.filter((f) => !usedFilenames.has(f.filename) && !usedSlugs.has(f.slug));

      for (const f of extras) {
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
  console.log(`\nDone! ${count} documents in database (target library: 525).`);

  if (Number(count) < 525 && withStubs) {
    console.log("Note: fewer than 525 rows — some catalog slugs may have collided or stubs were disabled.");
  }
  if (stats.stub > 0) {
    console.log(`${stats.stub} catalog entries use placeholder content until original markdown is restored.`);
  }

  await connection.end();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
