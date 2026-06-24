/**
 * Fix miscategorized workspace documents (RR/ArtKech slug patterns in wrong category).
 * Usage: DATABASE_URL=... node scripts/fix-workspace-categories.mjs [--dry-run]
 */
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const WORKSPACE_RULES = [
  { category: "Riad & Routes", test: (slug, filename) => /rr-|riad|routes|concierge/i.test(`${slug} ${filename}`) },
  { category: "ArtKech Design Studio", test: (slug, filename) => /ak-|artkech|creative-studio/i.test(`${slug} ${filename}`) },
];

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL required");
    process.exit(1);
  }

  const db = await mysql.createConnection(url);
  const [rows] = await db.execute("SELECT id, slug, filename, category FROM documents");
  let fixed = 0;

  for (const doc of rows) {
    for (const rule of WORKSPACE_RULES) {
      if (!rule.test(doc.slug, doc.filename || "")) continue;
      if (doc.category === rule.category) break;
      console.log(`[fix] ${doc.slug}: "${doc.category}" → "${rule.category}"`);
      if (!dryRun) {
        await db.execute("UPDATE documents SET category = ? WHERE id = ?", [rule.category, doc.id]);
      }
      fixed++;
      break;
    }
  }

  console.log(dryRun ? `Would fix ${fixed} documents` : `Fixed ${fixed} documents`);
  await db.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
