import fs from 'fs';
import path from 'path';
import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

function categorize(filename) {
  if (filename.startsWith('ARG-Builder-RR-')) return 'Horizon Concierge';
  if (filename.startsWith('ARG-Builder-AK-')) return 'Meridian Creative Studio';
  return 'Strategy & Operations';
}

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  const connection = await createConnection(dbUrl);
  console.log('Connected to database');

  // Get only the new RR and AK documents
  const docsDir = '/home/ubuntu';
  const files = fs.readdirSync(docsDir)
    .filter(f => (f.startsWith('ARG-Builder-RR-') || f.startsWith('ARG-Builder-AK-')) && f.endsWith('.md'))
    .sort();

  console.log(`Found ${files.length} Horizon Concierge / Meridian Creative documents to seed`);

  // Delete existing RR and AK documents to avoid duplicates
  await connection.execute("DELETE FROM documents WHERE category = 'Horizon Concierge' OR category = 'Meridian Creative Studio'");
  console.log('Cleared existing RR/AK documents');

  let inserted = 0;
  const batchSize = 16;

  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    const values = [];
    const placeholders = [];

    for (const filename of batch) {
      const slug = filename.replace('ARG-Builder-', '').replace('.md', '');
      const title = slug.replace(/-/g, ' ');
      const category = categorize(filename);
      const filePath = path.join(docsDir, filename);
      const content = fs.readFileSync(filePath, 'utf-8');
      const wordCount = content.split(/\s+/).length;

      placeholders.push('(?, ?, ?, ?, ?, ?)');
      values.push(slug, title, category, filename, content, wordCount);
    }

    const sql = `INSERT INTO documents (slug, title, category, filename, content, wordCount) VALUES ${placeholders.join(', ')}`;
    await connection.execute(sql, values);
    inserted += batch.length;
    console.log(`Inserted ${inserted}/${files.length} documents`);
  }

  // Ensure the categories exist in category_ordering
  const existingCats = await connection.execute("SELECT categoryName FROM category_ordering WHERE categoryName IN ('Horizon Concierge', 'Meridian Creative Studio')");
  const existingNames = existingCats[0].map(r => r.categoryName);
  
  if (!existingNames.includes('Horizon Concierge')) {
    const [maxOrder] = await connection.execute("SELECT MAX(sortOrder) as maxOrd FROM category_ordering");
    const nextOrder = (maxOrder[0].maxOrd || 0) + 1;
    await connection.execute("INSERT INTO category_ordering (categoryName, sortOrder) VALUES ('Horizon Concierge', ?)", [nextOrder]);
    console.log('Added "Horizon Concierge" category');
  }
  
  if (!existingNames.includes('Meridian Creative Studio')) {
    const [maxOrder] = await connection.execute("SELECT MAX(sortOrder) as maxOrd FROM category_ordering");
    const nextOrder = (maxOrder[0].maxOrd || 0) + 1;
    await connection.execute("INSERT INTO category_ordering (categoryName, sortOrder) VALUES ('Meridian Creative Studio', ?)", [nextOrder]);
    console.log('Added "Meridian Creative Studio" category');
  }

  console.log(`\nSeeding complete! ${inserted} documents persisted to database.`);
  await connection.end();
}

main().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
