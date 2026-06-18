/**
 * Auto-generate document cross-references for the Knowledge Graph.
 * 
 * Strategy:
 * 1. Same-category links (relevance 0.5) — documents in the same category are related
 * 2. Title mention links (relevance 0.9) — when one document's content mentions another document's title
 * 3. Slug mention links (relevance 0.85) — when content contains a link to another document's slug
 * 4. Shared keyword links (relevance 0.6) — documents sharing significant keywords in titles
 * 
 * We limit same-category links to avoid overwhelming the graph.
 */

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq, sql } from "drizzle-orm";
import * as schema from "../drizzle/schema.js";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection, { schema, mode: "default" });

  console.log("Fetching all published documents...");
  const docs = await db.select({
    id: schema.documents.id,
    slug: schema.documents.slug,
    title: schema.documents.title,
    category: schema.documents.category,
    content: schema.documents.content,
  }).from(schema.documents).where(eq(schema.documents.status, "published"));

  console.log(`Found ${docs.length} published documents`);

  // Clear existing cross-references
  await db.delete(schema.documentCrossReferences);
  console.log("Cleared existing cross-references");

  const crossRefs = [];
  const seen = new Set(); // Prevent duplicates

  const addRef = (sourceId, targetId, score, reason) => {
    if (sourceId === targetId) return;
    const key = `${Math.min(sourceId, targetId)}-${Math.max(sourceId, targetId)}`;
    if (seen.has(key)) return;
    seen.add(key);
    crossRefs.push({ sourceDocId: sourceId, targetDocId: targetId, relevanceScore: score, reason, status: "approved" });
  };

  // Strategy 1: Title mentions in content (highest quality)
  console.log("Scanning for title mentions in content...");
  for (const doc of docs) {
    if (!doc.content) continue;
    const contentLower = doc.content.toLowerCase();
    for (const other of docs) {
      if (other.id === doc.id) continue;
      // Only match titles with 3+ words to avoid false positives
      const titleWords = other.title.split(/\s+/).length;
      if (titleWords < 3) continue;
      if (contentLower.includes(other.title.toLowerCase())) {
        addRef(doc.id, other.id, 0.9, `Title "${other.title}" mentioned in content`);
      }
    }
  }
  console.log(`  Found ${crossRefs.length} title-mention links`);

  // Strategy 2: Slug mentions (links between docs)
  const slugRefCount = crossRefs.length;
  console.log("Scanning for slug references in content...");
  for (const doc of docs) {
    if (!doc.content) continue;
    for (const other of docs) {
      if (other.id === doc.id) continue;
      // Look for /docs/slug patterns or just the slug in href attributes
      if (doc.content.includes(`/docs/${other.slug}`) || doc.content.includes(`href="${other.slug}"`)) {
        addRef(doc.id, other.id, 0.85, `Link to /docs/${other.slug}`);
      }
    }
  }
  console.log(`  Found ${crossRefs.length - slugRefCount} slug-reference links`);

  // Strategy 3: Shared significant title keywords (2+ shared words of 5+ chars)
  const keywordRefCount = crossRefs.length;
  console.log("Analyzing shared title keywords...");
  const stopWords = new Set(["about", "after", "again", "being", "below", "between", "could", "doing", "during", "every", "first", "found", "great", "guide", "their", "there", "these", "thing", "those", "under", "using", "where", "which", "while", "would", "other", "process", "system", "management", "operational", "reference"]);
  
  const getKeywords = (title) => {
    return title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length >= 5 && !stopWords.has(w));
  };

  for (let i = 0; i < docs.length; i++) {
    const kwA = getKeywords(docs[i].title);
    if (kwA.length === 0) continue;
    for (let j = i + 1; j < docs.length; j++) {
      const kwB = getKeywords(docs[j].title);
      const shared = kwA.filter(w => kwB.includes(w));
      if (shared.length >= 2) {
        addRef(docs[i].id, docs[j].id, 0.6 + (shared.length * 0.05), `Shared keywords: ${shared.join(', ')}`);
      }
    }
  }
  console.log(`  Found ${crossRefs.length - keywordRefCount} keyword-overlap links`);

  // Strategy 4: Same category (limit to 3 nearest neighbors by ID to avoid clutter)
  const catRefCount = crossRefs.length;
  console.log("Adding same-category neighbor links...");
  const byCategory = {};
  for (const doc of docs) {
    if (!byCategory[doc.category]) byCategory[doc.category] = [];
    byCategory[doc.category].push(doc);
  }

  for (const [cat, catDocs] of Object.entries(byCategory)) {
    if (catDocs.length < 2) continue;
    // Connect each doc to its 2 nearest neighbors in the category
    for (let i = 0; i < catDocs.length; i++) {
      const neighbors = [
        catDocs[i - 1],
        catDocs[i + 1],
        catDocs[i + 2],
      ].filter(Boolean);
      for (const neighbor of neighbors) {
        addRef(catDocs[i].id, neighbor.id, 0.4, `Same category: ${cat}`);
      }
    }
  }
  console.log(`  Found ${crossRefs.length - catRefCount} same-category links`);

  // Insert all cross-references in batches
  console.log(`\nTotal cross-references to insert: ${crossRefs.length}`);
  
  if (crossRefs.length > 0) {
    const batchSize = 100;
    for (let i = 0; i < crossRefs.length; i += batchSize) {
      const batch = crossRefs.slice(i, i + batchSize);
      await db.insert(schema.documentCrossReferences).values(batch);
      console.log(`  Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(crossRefs.length / batchSize)}`);
    }
  }

  console.log("\nDone! Knowledge Graph is now populated.");
  console.log(`Summary: ${crossRefs.length} connections across ${docs.length} documents`);
  
  // Print breakdown
  const byReason = {};
  for (const ref of crossRefs) {
    const type = ref.reason.split(':')[0].split('"')[0].trim();
    byReason[type] = (byReason[type] || 0) + 1;
  }
  console.log("Breakdown:");
  for (const [type, count] of Object.entries(byReason)) {
    console.log(`  ${type}: ${count}`);
  }

  await connection.end();
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
