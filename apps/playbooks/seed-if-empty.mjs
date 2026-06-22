/**
 * Seed documents only if the database is empty.
 * Safe to run on every deploy — skips if data already exists.
 */
import { createConnection } from 'mysql2/promise';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.log('[seed-if-empty] No DATABASE_URL — skipping.');
  process.exit(0);
}

let connection;
try {
  connection = await createConnection(dbUrl);
  const [[{ count }]] = await connection.execute('SELECT COUNT(*) as count FROM documents');
  await connection.end();

  if (Number(count) > 0) {
    console.log(`[seed-if-empty] ${count} documents already in DB — skipping seed.`);
    process.exit(0);
  }

  console.log('[seed-if-empty] DB is empty — seeding full library (525 target)...');
  execSync('node seed-all-documents.mjs --force --with-stubs --include-persona', { stdio: 'inherit' });
  console.log('[seed-if-empty] Seeding complete!');

} catch (err) {
  if (connection) await connection.end().catch(() => {});
  console.log('[seed-if-empty] Skipping seed:', err.message);
  process.exit(0);
}
