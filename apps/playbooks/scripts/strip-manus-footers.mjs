/**
 * Strip legacy Manus AI footers from docs-seed/*.md and optionally from the database.
 *
 * Usage:
 *   node scripts/strip-manus-footers.mjs           # docs-seed only
 *   node scripts/strip-manus-footers.mjs --db        # docs-seed + documents.content in DB
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.join(__dirname, "../docs-seed");
const updateDb = process.argv.includes("--db");

const MANUS_FOOTER_PATTERN =
  /\n*---?\n*\n*\*Document prepared by Manus AI[^*]*\*\s*$/i;
const MANUS_FOOTER_ALT =
  /\n*\*?(?:Document )?(?:prepared|generated) by Manus(?: AI)?[^*\n]*\*?\s*$/i;

export function stripManusFooter(content) {
  if (!content) return content;
  return content.replace(MANUS_FOOTER_PATTERN, "").replace(MANUS_FOOTER_ALT, "").trimEnd();
}

function stripFile(filePath) {
  const original = fs.readFileSync(filePath, "utf-8");
  const cleaned = stripManusFooter(original);
  if (cleaned !== original) {
    fs.writeFileSync(filePath, cleaned + "\n", "utf-8");
    return true;
  }
  return false;
}

async function stripDatabase() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL not set — skipping DB update");
    return 0;
  }

  const connection = await mysql.createConnection(dbUrl);
  const [rows] = await connection.execute(
    "SELECT id, slug, content FROM documents WHERE content LIKE '%Manus AI%'"
  );

  let updated = 0;
  for (const row of rows) {
    const cleaned = stripManusFooter(row.content);
    if (cleaned !== row.content) {
      await connection.execute("UPDATE documents SET content = ? WHERE id = ?", [
        cleaned,
        row.id,
      ]);
      updated++;
    }
  }

  await connection.end();
  return updated;
}

async function main() {
  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`docs-seed/ not found at ${DOCS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith(".md"));
  let stripped = 0;

  for (const filename of files) {
    if (stripFile(path.join(DOCS_DIR, filename))) {
      stripped++;
      console.log(`  stripped: ${filename}`);
    }
  }

  console.log(`\nDocs-seed: stripped Manus footer from ${stripped}/${files.length} files`);

  if (updateDb) {
    const dbUpdated = await stripDatabase();
    console.log(`Database: updated ${dbUpdated} document(s)`);
  } else {
    console.log("Tip: run with --db to also clean documents.content in production DB");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
