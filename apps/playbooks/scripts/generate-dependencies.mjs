/**
 * Auto-generate logical document dependencies for the Knowledge Graph.
 *
 * Strategies (ordered by confidence):
 * 1. Curated learning paths — ordered sequences within each domain
 * 2. Foundation hubs — index, business plan, architecture as prerequisites
 * 3. Prerequisites sections — explicit "Prerequisites" / "Before you begin" blocks
 * 4. Content signals — "builds on", "requires", "see also" near title mentions
 * 5. Master Document Index order — sequential docs in same section
 *
 * Usage: DATABASE_URL=... node scripts/generate-dependencies.mjs
 */

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq } from "drizzle-orm";
import * as schema from "../drizzle/schema.js";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

/** Slug fragments for foundation docs (matched against actual slugs) */
const FOUNDATION_PATTERNS = [
  "master-document-index",
  "comprehensive-business-plan",
  "business-plan",
  "technical-architecture",
  "go-to-market",
  "gtm-sales-strategy",
  "founder-s-operating-manual",
  "founders-operating-manual",
];

/** Curated learning paths: each slug depends on the previous in its chain */
const LEARNING_PATHS = [
  // Strategy
  ["arg-builder-annual-planning", "arg-builder-strategic-planning-okrs", "arg-builder-okr-framework"],
  ["arg-builder-data-driven-decisions", "arg-builder-startup-metrics-dashboard-design"],
  // Product
  ["arg-builder-mvp-roadmap", "arg-builder-product-roadmap-governance", "arg-builder-feature-prioritization", "arg-builder-product-launch"],
  ["arg-builder-product-metrics", "arg-builder-product-analytics"],
  // Engineering
  ["arg-builder-technical-architecture", "arg-builder-scalability-infrastructure", "arg-builder-technical-debt"],
  ["arg-builder-engineering-culture", "arg-builder-security-incident-response", "arg-builder-soc-2-compliance-roadmap"],
  // Sales
  ["arg-builder-sales-enablement", "arg-builder-sales-demo", "arg-builder-comprehensive-sales-objection-library", "arg-builder-sales-forecasting"],
  ["arg-builder-pricing-validation", "arg-builder-pricing-page-optimization", "arg-builder-pricing-experimentation"],
  // Marketing
  ["arg-builder-brand-identity", "arg-builder-content-marketing-playbook", "arg-builder-demand-generation-engine"],
  ["arg-builder-competitive-positioning", "arg-builder-competitive-intelligence", "arg-builder-competitive-moat"],
  // Customer Success
  ["arg-builder-customer-segmentation", "arg-builder-customer-journey-mapping", "arg-builder-customer-onboarding", "arg-builder-customer-success"],
  ["arg-builder-customer-health-score", "arg-builder-churn-prevention", "arg-builder-customer-retention"],
  // Finance
  ["arg-builder-financial-controls", "arg-builder-revenue-recognition", "arg-builder-revenue-forecasting"],
  // People
  ["arg-builder-hiring-playbook", "arg-builder-employee-onboarding", "arg-builder-performance-review"],
  // GTM / Partnerships
  ["arg-builder-partner-program-design", "arg-builder-channel-partner-enablement", "arg-builder-partner-ecosystem"],
];

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
  const hit = allSlugs.find((s) => s.includes(pattern) || pattern.includes(s));
  return hit ?? null;
}

function extractPrerequisiteSection(content) {
  const match = content.match(
    /(?:^|\n)#+\s*(?:Prerequisites?|Before You Begin|Before Reading|Required Reading)[^\n]*\n([\s\S]*?)(?=\n#+\s|\n---|\Z)/i
  );
  return match ? match[1] : "";
}

function addDep(deps, seen, documentSlug, prerequisiteSlug, reason) {
  if (!documentSlug || !prerequisiteSlug || documentSlug === prerequisiteSlug) return;
  const key = `${prerequisiteSlug}->${documentSlug}`;
  if (seen.has(key)) return;
  seen.add(key);
  deps.push({ documentSlug, prerequisiteSlug, reason });
}

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection, { schema, mode: "default" });

  console.log("Fetching published documents...");
  const docs = await db
    .select({
      id: schema.documents.id,
      slug: schema.documents.slug,
      title: schema.documents.title,
      category: schema.documents.category,
      content: schema.documents.content,
    })
    .from(schema.documents)
    .where(eq(schema.documents.status, "published"));

  console.log(`Found ${docs.length} documents`);

  const slugSet = new Set(docs.map((d) => d.slug));
  const allSlugs = docs.map((d) => d.slug);
  const titleToSlug = new Map(
    docs.map((d) => [d.title.toLowerCase(), d.slug])
  );

  const foundationSlugs = FOUNDATION_PATTERNS.map((p) =>
    findSlugMatch(p, slugSet, allSlugs)
  ).filter(Boolean);

  console.log(`Foundation hubs: ${foundationSlugs.join(", ") || "(none matched)"}`);

  await db.delete(schema.documentDependencies);
  console.log("Cleared existing dependencies");

  const deps = [];
  const seen = new Set();

  // Strategy 1: Learning paths
  console.log("Applying curated learning paths...");
  for (const chain of LEARNING_PATHS) {
    const resolved = chain.map((p) => findSlugMatch(p, slugSet, allSlugs)).filter(Boolean);
    for (let i = 1; i < resolved.length; i++) {
      addDep(deps, seen, resolved[i], resolved[i - 1], `Learning path: ${chain[i]}`);
    }
  }
  console.log(`  ${deps.length} path dependencies`);

  // Strategy 2: Foundation hubs — index + one category anchor per doc (max 2)
  const foundationCount = deps.length;
  const CATEGORY_FOUNDATION = {
    Sales: ["go-to-market", "gtm-sales"],
    Marketing: ["go-to-market", "brand-identity"],
    "Customer Success": ["customer-segmentation", "customer-journey"],
    Product: ["mvp-roadmap", "product-roadmap"],
    Engineering: ["technical-architecture", "engineering-culture"],
    "Finance & Legal": ["financial-controls", "business-plan"],
    "Strategy & Operations": ["comprehensive-business-plan", "okr"],
    "People & Culture": ["hiring-playbook", "culture"],
    "AI & Developer": ["ai-ml", "technical-architecture"],
    "Security & Compliance": ["security-incident", "compliance-privacy"],
    "Partnerships & GTM": ["partner-program", "gtm-partnerships"],
    "Data & Analytics": ["data-analytics", "startup-metrics"],
  };

  const indexSlug = foundationSlugs.find((s) => s.includes("master-document-index"));

  for (const doc of docs) {
    if (indexSlug && doc.slug !== indexSlug) {
      addDep(deps, seen, doc.slug, indexSlug, "Foundation: Master Document Index");
    }
    const patterns = CATEGORY_FOUNDATION[doc.category] ?? ["comprehensive-business-plan"];
    for (const pattern of patterns.slice(0, 1)) {
      const anchor = findSlugMatch(pattern, slugSet, allSlugs);
      if (anchor && anchor !== doc.slug && anchor !== indexSlug) {
        addDep(deps, seen, doc.slug, anchor, `Foundation: ${doc.category}`);
        break;
      }
    }
  }
  console.log(`  +${deps.length - foundationCount} foundation links`);

  // Strategy 3 & 4: Content-based prerequisites
  const contentCount = deps.length;
  console.log("Scanning content for prerequisite signals...");
  const signalWords = /\b(builds on|requires|prerequisite|before reading|see also|depends on|start with)\b/i;

  for (const doc of docs) {
    if (!doc.content) continue;
    const prereqBlock = extractPrerequisiteSection(doc.content);
    const searchZones = [prereqBlock, doc.content.slice(0, 2000)].filter(Boolean);

    for (const zone of searchZones) {
      const zoneLower = zone.toLowerCase();
      const hasSignal = signalWords.test(zone) || zone === prereqBlock;

      for (const other of docs) {
        if (other.id === doc.id) continue;
        const titleLower = other.title.toLowerCase();
        if (titleLower.length < 12) continue;
        if (zoneLower.includes(titleLower)) {
          if (hasSignal || zone === prereqBlock) {
            addDep(deps, seen, doc.slug, other.slug, `Content: mentions "${other.title}"`);
          }
        }
        // Slug /docs/ links
        if (zone.includes(`/docs/${other.slug}`)) {
          addDep(deps, seen, doc.slug, other.slug, `Content: links to /docs/${other.slug}`);
        }
      }
    }
  }
  console.log(`  +${deps.length - contentCount} content-based dependencies`);

  // Strategy 5: Master Document Index sequential order
  const indexDoc = docs.find((d) => d.slug.includes("master-document-index"));
  if (indexDoc?.content) {
    const indexCount = deps.length;
    const fileMatches = [...indexDoc.content.matchAll(/\|\s*\d+\s*\|\s*([^|]+)\|\s*([^|]+)\|/g)];
    let prevSlug = null;
    let currentSection = "";

    for (const row of fileMatches) {
      const docName = row[1].trim();
      const fileRef = row[2].trim().replace(/\.md$/i, "");
      const slug = findSlugMatch(slugifyTitle(fileRef), slugSet, allSlugs)
        ?? findSlugMatch(slugifyTitle(docName), slugSet, allSlugs);

      if (slug) {
        if (prevSlug && prevSlug !== slug) {
          addDep(deps, seen, slug, prevSlug, "Master Index: sequential");
        }
        prevSlug = slug;
      }
    }
    console.log(`  +${deps.length - indexCount} index-order dependencies`);
  }

  // Insert
  console.log(`\nTotal dependencies: ${deps.length}`);
  if (deps.length > 0) {
    const batchSize = 100;
    const values = deps.map(({ documentSlug, prerequisiteSlug }) => ({
      documentSlug,
      prerequisiteSlug,
    }));
    for (let i = 0; i < values.length; i += batchSize) {
      await db.insert(schema.documentDependencies).values(values.slice(i, i + batchSize));
    }
  }

  const byReason = {};
  for (const d of deps) {
    const type = d.reason.split(":")[0];
    byReason[type] = (byReason[type] || 0) + 1;
  }
  console.log("Breakdown:");
  for (const [type, count] of Object.entries(byReason)) {
    console.log(`  ${type}: ${count}`);
  }

  await connection.end();
  console.log("\nDone! Dependency edges ready for Knowledge Graph.");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
