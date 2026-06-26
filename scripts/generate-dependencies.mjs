/**
 * Auto-generate logical document dependencies for the Knowledge Graph.
 * Tuned: capped per-doc deps, prioritized learning paths, lighter foundation links.
 *
 * Usage: DATABASE_URL=... node scripts/generate-dependencies.mjs
 */

import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const MAX_DEPS_PER_DOC = 5;
const MIN_WORD_COUNT = 120;

const LEARNING_PATHS = [
  ["annual-planning", "strategic-planning", "okr-framework"],
  ["data-driven-decisions", "startup-metrics-dashboard", "saas-benchmarks"],
  ["mvp-roadmap", "product-roadmap-governance", "feature-prioritization", "product-launch"],
  ["product-metrics", "product-analytics", "product-analytics-framework"],
  ["technical-architecture", "scalability-infrastructure", "technical-debt"],
  ["engineering-culture", "security-incident-response", "soc-2-compliance"],
  ["sales-enablement", "sales-demo", "comprehensive-sales-objection", "sales-forecasting"],
  ["pricing-validation", "pricing-page-optimization", "pricing-experimentation"],
  ["brand-identity", "content-marketing", "demand-generation"],
  ["competitive-positioning", "competitive-intelligence", "competitive-moat"],
  ["customer-segmentation", "customer-journey", "customer-onboarding", "customer-success"],
  ["customer-health-score", "churn-prevention", "customer-retention"],
  ["financial-controls", "revenue-recognition", "revenue-forecasting"],
  ["hiring-playbook", "employee-onboarding", "performance-review"],
  ["partner-program", "channel-partner-enablement", "partner-ecosystem"],
];

const CATEGORY_FOUNDATION = {
  Sales: ["go-to-market", "gtm-sales", "sales-enablement"],
  Marketing: ["brand-identity", "demand-generation"],
  "Customer Success": ["customer-segmentation", "customer-onboarding"],
  Product: ["mvp-roadmap", "product-roadmap"],
  Engineering: ["technical-architecture"],
  "Finance & Legal": ["financial-controls", "business-plan"],
  "Strategy & Operations": ["business-plan", "okr-framework"],
  "People & Culture": ["hiring-playbook", "culture-values"],
  "AI & Developer": ["ai-ml-governance", "technical-architecture"],
  "Security & Compliance": ["security-incident", "compliance-privacy"],
  "Partnerships & GTM": ["partner-program", "gtm-partnerships"],
  "Data & Analytics": ["data-analytics", "startup-metrics"],
  "Revenue & Pricing": ["pricing-validation", "unit-economics"],
};

function slugifyTitle(title) {
  return title
    .replace(/\.md$/i, "")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 200);
}

function findSlugMatch(pattern, slugSet, allSlugs) {
  if (slugSet.has(pattern)) return pattern;
  return allSlugs.find((s) => s.includes(pattern) || pattern.includes(s)) ?? null;
}

function extractPrerequisiteSection(content) {
  const match = content.match(
    /(?:^|\n)#+\s*(?:Prerequisites?|Before You Begin|Before Reading|Required Reading)[^\n]*\n([\s\S]*?)(?=\n#+\s|\n---|\Z)/i
  );
  return match ? match[1] : "";
}

function depPriority(reason) {
  if (reason.startsWith("Learning path")) return 1;
  if (reason.startsWith("Content:")) return 2;
  if (reason.startsWith("Master Index")) return 3;
  if (reason.startsWith("Foundation:")) return 4;
  return 5;
}

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);

  const [rows] = await connection.execute(
    "SELECT id, slug, title, category, content, wordCount FROM documents WHERE status = 'published'"
  );
  const docs = rows.filter((d) => (d.wordCount ?? 0) >= MIN_WORD_COUNT || (d.content?.length ?? 0) > 800);

  console.log(`Found ${docs.length} substantive documents`);

  const slugSet = new Set(docs.map((d) => d.slug));
  const allSlugs = docs.map((d) => d.slug);
  const titleToSlug = new Map(docs.map((d) => [d.title.toLowerCase(), d.slug]));

  await connection.execute("DELETE FROM document_dependencies");
  console.log("Cleared existing dependencies");

  const deps = [];
  const seen = new Set();

  const addDep = (documentSlug, prerequisiteSlug, reason) => {
    if (!documentSlug || !prerequisiteSlug || documentSlug === prerequisiteSlug) return;
    const key = `${prerequisiteSlug}->${documentSlug}`;
    if (seen.has(key)) return;
    seen.add(key);
    deps.push({ documentSlug, prerequisiteSlug, reason, priority: depPriority(reason) });
  };

  // Learning paths
  console.log("Applying learning paths...");
  for (const chain of LEARNING_PATHS) {
    const resolved = chain.map((p) => findSlugMatch(p, slugSet, allSlugs)).filter(Boolean);
    for (let i = 1; i < resolved.length; i++) {
      addDep(resolved[i], resolved[i - 1], `Learning path: ${chain[i]}`);
    }
  }
  console.log(`  ${deps.length} path deps`);

  // Category foundation (1 per doc max)
  const foundationCount = deps.length;
  const indexSlug = findSlugMatch("master-document-index", slugSet, allSlugs);

  for (const doc of docs) {
    if (indexSlug && doc.slug !== indexSlug && doc.category !== "Strategy & Operations") {
      addDep(doc.slug, indexSlug, "Foundation: Master Document Index");
    }
    const patterns = CATEGORY_FOUNDATION[doc.category] ?? ["business-plan"];
    for (const pattern of patterns) {
      const anchor = findSlugMatch(pattern, slugSet, allSlugs);
      if (anchor && anchor !== doc.slug) {
        addDep(doc.slug, anchor, `Foundation: ${doc.category}`);
        break;
      }
    }
  }
  console.log(`  +${deps.length - foundationCount} foundation deps`);

  // Content prerequisites (prerequisite section only — high confidence)
  const contentCount = deps.length;
  for (const doc of docs) {
    if (!doc.content) continue;
    const prereqBlock = extractPrerequisiteSection(doc.content);
    if (!prereqBlock) continue;
    const blockLower = prereqBlock.toLowerCase();

    for (const other of docs) {
      if (other.id === doc.id) continue;
      const titleLower = other.title.toLowerCase();
      if (titleLower.length < 10) continue;
      if (blockLower.includes(titleLower)) {
        addDep(doc.slug, other.slug, `Content: prerequisite mentions "${other.title}"`);
      }
      if (prereqBlock.includes(`/docs/${other.slug}`)) {
        addDep(doc.slug, other.slug, `Content: links to /docs/${other.slug}`);
      }
    }
  }
  console.log(`  +${deps.length - contentCount} content deps`);

  // Master index sequential (same section only — every 5th to reduce noise)
  const indexDoc = docs.find((d) => d.slug.includes("master-document-index"));
  if (indexDoc?.content) {
    const indexCount = deps.length;
    const fileMatches = [...indexDoc.content.matchAll(/\|\s*\d+\s*\|\s*([^|]+)\|\s*([^|]+)\|/g)];
    let prevSlug = null;
    let n = 0;

    for (const row of fileMatches) {
      const docName = row[1].trim();
      const fileRef = row[2].trim().replace(/\.md$/i, "");
      const slug =
        findSlugMatch(slugifyTitle(fileRef), slugSet, allSlugs) ??
        findSlugMatch(slugifyTitle(docName), slugSet, allSlugs);

      if (slug) {
        n++;
        if (prevSlug && prevSlug !== slug && n % 3 === 0) {
          addDep(slug, prevSlug, "Master Index: sequential");
        }
        prevSlug = slug;
      }
    }
    console.log(`  +${deps.length - indexCount} index deps`);
  }

  // Cap dependencies per document (keep highest priority)
  const byTarget = {};
  for (const d of deps) {
    if (!byTarget[d.documentSlug]) byTarget[d.documentSlug] = [];
    byTarget[d.documentSlug].push(d);
  }

  const capped = [];
  for (const list of Object.values(byTarget)) {
    list.sort((a, b) => a.priority - b.priority);
    capped.push(...list.slice(0, MAX_DEPS_PER_DOC));
  }

  console.log(`\nTotal dependencies: ${capped.length} (capped from ${deps.length})`);

  if (capped.length > 0) {
    const batchSize = 100;
    for (let i = 0; i < capped.length; i += batchSize) {
      const batch = capped.slice(i, i + batchSize);
      const placeholders = batch.map(() => "(?, ?)").join(", ");
      const values = batch.flatMap((d) => [d.documentSlug, d.prerequisiteSlug]);
      await connection.execute(
        `INSERT INTO document_dependencies (documentSlug, prerequisiteSlug) VALUES ${placeholders}`,
        values
      );
    }
  }

  const byReason = {};
  for (const d of capped) {
    const type = d.reason.split(":")[0];
    byReason[type] = (byReason[type] || 0) + 1;
  }
  console.log("Breakdown:", byReason);

  await connection.end();
  console.log("\nDone! Dependencies ready for Knowledge Graph.");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
