/**
 * Auto-generate document cross-references for the Knowledge Graph.
 * Tuned for quality over quantity — fewer, higher-confidence edges.
 *
 * Usage: DATABASE_URL=... node scripts/generate-cross-refs.mjs
 */

import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const WORKSPACE_ROOTS = new Set([
  "Riad & Routes",
  "ArtKech Design Studio",
  "Atlas Collective Agency",
  "Maison Voyager Hospitality",
]);

function inferWorkspaceFromSlug(slug) {
  const s = String(slug || "").toLowerCase();
  if (s.includes("rr-") || s.includes("riad") || s.includes("routes")) return "Riad & Routes";
  if (s.includes("ak-") || s.includes("artkech")) return "ArtKech Design Studio";
  return null;
}

function resolveWorkspace(category, slug) {
  if (WORKSPACE_ROOTS.has(category)) return category;
  return inferWorkspaceFromSlug(slug);
}

function sharesDocumentScope(catA, catB, slugA, slugB) {
  const wsA = resolveWorkspace(catA, slugA);
  const wsB = resolveWorkspace(catB, slugB);
  if (wsA && wsB) return wsA === wsB;
  if (wsA || wsB) return false;
  return catA === catB;
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const MIN_WORD_COUNT = 120; // skip stub-thin docs
const MAX_REFS_PER_DOC = 12;

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);

  console.log("Fetching published documents...");
  const [rows] = await connection.execute(
    "SELECT id, slug, title, category, content, wordCount FROM documents WHERE status = 'published'"
  );

  const docs = rows.filter((d) => (d.wordCount ?? 0) >= MIN_WORD_COUNT || (d.content?.length ?? 0) > 800);
  console.log(`Found ${docs.length} substantive documents (${rows.length} total published)`);

  await connection.execute("DELETE FROM document_cross_references");
  console.log("Cleared existing cross-references");

  const crossRefs = [];
  const seen = new Set();
  const perDocCount = new Map();

  const addRef = (sourceId, targetId, score, reason) => {
    if (sourceId === targetId) return;
    const src = idToDoc.get(sourceId);
    const tgt = idToDoc.get(targetId);
    if (src && tgt && !sharesDocumentScope(src.category, tgt.category, src.slug, tgt.slug)) return;
    const key = `${sourceId}->${targetId}`;
    if (seen.has(key)) return;

    const srcCount = perDocCount.get(sourceId) ?? 0;
    if (srcCount >= MAX_REFS_PER_DOC) return;

    seen.add(key);
    perDocCount.set(sourceId, srcCount + 1);
    crossRefs.push({
      sourceDocId: sourceId,
      targetDocId: targetId,
      relevanceScore: score,
      reason,
      status: "approved",
    });
  };

  const idToDoc = new Map(docs.map((d) => [d.id, d]));

  // Strategy 1: Title mentions (high confidence)
  console.log("Scanning for title mentions...");
  for (const doc of docs) {
    if (!doc.content) continue;
    const contentLower = doc.content.toLowerCase();
    for (const other of docs) {
      if (other.id === doc.id) continue;
      if (other.title.split(/\s+/).length < 4) continue;
      if (contentLower.includes(other.title.toLowerCase())) {
        addRef(doc.id, other.id, 0.92, `Title "${other.title}" mentioned in content`);
      }
    }
  }
  console.log(`  ${crossRefs.length} title-mention links`);

  // Strategy 2: Slug / docs links
  const slugCount = crossRefs.length;
  for (const doc of docs) {
    if (!doc.content) continue;
    for (const other of docs) {
      if (other.id === doc.id) continue;
      if (
        doc.content.includes(`/docs/${other.slug}`) ||
        doc.content.includes(`(${other.slug})`) ||
        doc.content.includes(`docs/${other.slug}`)
      ) {
        addRef(doc.id, other.id, 0.88, `Link to /docs/${other.slug}`);
      }
    }
  }
  console.log(`  +${crossRefs.length - slugCount} slug links`);

  // Strategy 3: Shared keywords (stricter — 3+ shared, same category bonus)
  const kwCount = crossRefs.length;
  const stopWords = new Set([
    "about", "guide", "their", "there", "these", "those", "under", "using", "which",
    "while", "would", "other", "process", "system", "management", "operational", "reference",
    "builder", "playbook", "framework", "strategy",
  ]);

  const getKeywords = (title) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length >= 5 && !stopWords.has(w));

  for (let i = 0; i < docs.length; i++) {
    const kwA = getKeywords(docs[i].title);
    if (kwA.length < 2) continue;
    for (let j = i + 1; j < docs.length; j++) {
      const kwB = getKeywords(docs[j].title);
      const shared = kwA.filter((w) => kwB.includes(w));
      if (shared.length >= 3) {
        const sameCat = docs[i].category === docs[j].category;
        const score = 0.55 + shared.length * 0.04 + (sameCat ? 0.08 : 0);
        addRef(docs[i].id, docs[j].id, Math.min(score, 0.85), `Shared keywords: ${shared.slice(0, 4).join(", ")}`);
        addRef(docs[j].id, docs[i].id, Math.min(score, 0.85), `Shared keywords: ${shared.slice(0, 4).join(", ")}`);
      }
    }
  }
  console.log(`  +${crossRefs.length - kwCount} keyword links`);

  // Strategy 4: Same category — 1 adjacent neighbor only (catalog order by title)
  const catCount = crossRefs.length;
  const byCategory = {};
  for (const doc of docs) {
    if (!byCategory[doc.category]) byCategory[doc.category] = [];
    byCategory[doc.category].push(doc);
  }

  for (const [cat, catDocs] of Object.entries(byCategory)) {
    catDocs.sort((a, b) => a.title.localeCompare(b.title));
    for (let i = 0; i < catDocs.length; i++) {
      const neighbor = catDocs[i + 1];
      if (neighbor) {
        addRef(catDocs[i].id, neighbor.id, 0.42, `Same category: ${cat}`);
      }
    }
  }
  console.log(`  +${crossRefs.length - catCount} category links`);

  // Strategy 5: Related section in content lists peer titles
  const relatedCount = crossRefs.length;
  for (const doc of docs) {
    const block = doc.content?.match(/## Related Playbooks[\s\S]*?(?=\n## |\n---|\Z)/i)?.[0];
    if (!block) continue;
    for (const other of docs) {
      if (other.id === doc.id) continue;
      if (block.toLowerCase().includes(other.title.toLowerCase())) {
        addRef(doc.id, other.id, 0.75, `Related playbooks section`);
      }
    }
  }
  console.log(`  +${crossRefs.length - relatedCount} related-section links`);

  console.log(`\nTotal cross-references: ${crossRefs.length}`);

  if (crossRefs.length > 0) {
    const batchSize = 100;
    for (let i = 0; i < crossRefs.length; i += batchSize) {
      const batch = crossRefs.slice(i, i + batchSize);
      const placeholders = batch.map(() => "(?, ?, ?, ?, ?)").join(", ");
      const values = batch.flatMap((r) => [r.sourceDocId, r.targetDocId, r.relevanceScore, r.reason, r.status]);
      await connection.execute(
        `INSERT INTO document_cross_references (sourceDocId, targetDocId, relevanceScore, reason, status) VALUES ${placeholders}`,
        values
      );
    }
  }

  const byReason = {};
  for (const ref of crossRefs) {
    const type = ref.reason.split(":")[0].split('"')[0].trim();
    byReason[type] = (byReason[type] || 0) + 1;
  }
  console.log("Breakdown:", byReason);

  await connection.end();
  console.log("\nDone! Cross-references populated.");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
