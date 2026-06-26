/**
 * Seed documents on deploy:
 * - Empty DB → full seed (--force)
 * - Many thin stubs (<120 words) → refresh content from docs-seed + repopulate graph
 * - Otherwise skip
 */
import { createConnection } from 'mysql2/promise';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const THIN_WORD_THRESHOLD = 120;
/** If more than this many published docs are thin, refresh from docs-seed */
const THIN_REFRESH_MIN = 50;

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.log('[seed-if-empty] No DATABASE_URL — skipping.');
  process.exit(0);
}

function runSeed(force) {
  const flags = force
    ? '--force --with-stubs --include-persona'
    : '--with-stubs --include-persona';
  execSync(`node seed-all-documents.mjs ${flags}`, { stdio: 'inherit' });
}

let connection;
try {
  connection = await createConnection(dbUrl);
  const [[{ count }]] = await connection.execute('SELECT COUNT(*) as count FROM documents');
  const docCount = Number(count);

  if (docCount === 0) {
    await connection.end();
    console.log('[seed-if-empty] DB is empty — seeding full library (525 target)...');
    runSeed(true);
    console.log('[seed-if-empty] Seeding complete!');
    process.exit(0);
  }

  const [[{ thin }]] = await connection.execute(
    'SELECT COUNT(*) as thin FROM documents WHERE wordCount < ? AND status = ?',
    [THIN_WORD_THRESHOLD, 'published']
  );
  await connection.end();

  const thinCount = Number(thin);
  if (thinCount >= THIN_REFRESH_MIN) {
    console.log(
      `[seed-if-empty] ${docCount} documents in DB, ${thinCount} thin stubs — refreshing from docs-seed...`
    );
    runSeed(false);
    console.log('[seed-if-empty] Content refresh complete — repopulating knowledge graph...');
    execSync('node scripts/populate-knowledge-graph.mjs', { stdio: 'inherit' });
    console.log('[seed-if-empty] Graph repopulated.');
    process.exit(0);
  }

  console.log(`[seed-if-empty] ${docCount} documents in DB (${thinCount} thin) — no seed needed.`);
} catch (err) {
  if (connection) await connection.end().catch(() => {});
  console.log('[seed-if-empty] Skipping seed:', err.message);
  process.exit(0);
}
