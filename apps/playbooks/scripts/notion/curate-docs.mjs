/**
 * Curated docs-seed subset for Notion sync — prioritized for speed + pro structure.
 * Reads from docs-seed/ and docs/ without modifying source files.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PLAYBOOKS_ROOT = path.resolve(__dirname, "../..");
const DOCS_SEED = path.join(PLAYBOOKS_ROOT, "docs-seed");
const MONOREPO_DOCS = path.resolve(PLAYBOOKS_ROOT, "../../docs");

/** Tier 1 — vertical ops + live case studies (sync first) */
const TIER1_GLOBS = [
  /^ARG-Builder-RR-/,
  /^ARG-Builder-AK-/,
  /^Specialized ARG-Builder Agent: (Luxury Travel|ArtKech)/,
];

/** Tier 2 — GTM, sales, launch */
const TIER2_FILES = [
  "Go-to-Market Strategy by ARG-Builder.md",
  "ARG-Builder Product Hunt Launch Guide.md",
  "ARG-Builder LinkedIn Content Calendar.md",
  "ARG Builder — Founder's Daily Launch Checklist.md",
  "ARG Builder — Weekly Metrics Dashboard.md",
  "ARG Builder — Competitive Battle Card.md",
  "ARG-Builder: Sales Demo Playbook.md",
  "ARG-Builder: Founding Customer Playbook.md",
  "ARG-Builder: Comprehensive Sales Objection Library.md",
  "ARG-Builder-SDR-Playbook.md",
  "ARG-Builder: Master Document Index.md",
  "ARG-Builder: MVP Product Roadmap.md",
  "ARG-Builder-OKR-Framework.md",
  "ARG-Builder: Startup Metrics Dashboard Design.md",
  "ARG-Builder: Product Launch Playbook.md",
  "ARG-Builder-One-Pager.md",
  "Follow-Up 6: External Tool Integrations.md",
];

/** Tier 3 — strategy, product, finance reference */
const TIER3_PATTERNS = [
  /ARG-Builder: Strategic/,
  /ARG-Builder: Product (Metrics|Analytics|Roadmap)/,
  /ARG-Builder: (Pricing|Revenue|Investor|SaaS)/,
  /ARG-Builder: Customer (Success|Health)/,
  /ARG-Builder: (Marketing|Demand|Content)/,
  /Implementation Roadmaps/,
  /State-of-Operational-Knowledge/,
  /Agent Reference Guide — Final Project Report/,
];

/** Tier 4 — monorepo docs (outside docs-seed) */
const MONOREPO_FILES = [
  "roadmap/90-day-plan.md",
  "product/positioning.md",
  "product/pricing.md",
  "product/flywheel.md",
  "deploy/railway.md",
];

const WORKSPACE_RULES = [
  { workspace: "Riad & Routes", test: (f) => /RR-|Riad|Routes|Luxury Travel/i.test(f) },
  { workspace: "ArtKech Design Studio", test: (f) => /AK-|ArtKech|Creative Studio/i.test(f) },
  { workspace: "NexusAI Playbooks", test: (f) => /ARG-Builder|NexusAI|ARG-Builder(?!-(RR|AK))/i.test(f) },
];

function categorize(filename) {
  const n = filename.toLowerCase();
  if (/sales|sdr|demo|objection|battle|outreach|founding-customer/i.test(n)) return "Sales";
  if (/marketing|linkedin|content|launch|gtm|product-hunt/i.test(n)) return "GTM";
  if (/metric|dashboard|okr|analytics|forecast|revenue|pricing|investor|finance/i.test(n))
    return "Finance";
  if (/product|roadmap|mvp|feature/i.test(n)) return "Product";
  if (/customer|success|health|onboarding|churn/i.test(n)) return "Customer Success";
  if (/engineer|technical|architecture|deploy|railway|integration|api/i.test(n)) return "Ops";
  if (/strategy|master|implementation|operating|founder/i.test(n)) return "Strategy";
  return "Reference";
}

function workspaceFor(filename) {
  for (const rule of WORKSPACE_RULES) {
    if (rule.test(filename)) return rule.workspace;
  }
  return "NexusAI Playbooks";
}

function docType(filename) {
  const n = filename.toLowerCase();
  if (/playbook|checklist|sequence|calendar|guide\.md/i.test(n)) return "Playbook";
  if (/framework|model|strategy|roadmap|okr/i.test(n)) return "Framework";
  if (/template|script|email|outreach/i.test(n)) return "Template";
  if (/sop|protocol|workflow|operations|handling/i.test(n)) return "SOP";
  return "Reference";
}

function tierFor(filename, tier1Set, tier2Set) {
  if (tier1Set.has(filename)) return "Tier 1 — Vertical Ops";
  if (tier2Set.has(filename)) return "Tier 2 — GTM & Launch";
  if (TIER3_PATTERNS.some((p) => p.test(filename))) return "Tier 3 — Strategy";
  return "Tier 4 — Reference";
}

export function getCuratedDocs() {
  const seedFiles = fs.existsSync(DOCS_SEED)
    ? fs.readdirSync(DOCS_SEED).filter((f) => f.endsWith(".md"))
    : [];

  const tier1Set = new Set(seedFiles.filter((f) => TIER1_GLOBS.some((p) => p.test(f))));
  const tier2Set = new Set(TIER2_FILES.filter((f) => seedFiles.includes(f)));

  const tier3Files = seedFiles.filter(
    (f) => !tier1Set.has(f) && !tier2Set.has(f) && TIER3_PATTERNS.some((p) => p.test(f))
  );

  const selected = new Set([...tier1Set, ...tier2Set, ...tier3Files]);

  const docs = [];

  for (const file of [...selected].sort()) {
    const abs = path.join(DOCS_SEED, file);
    docs.push({
      id: `docs-seed/${file}`,
      file,
      absPath: abs,
      workspace: workspaceFor(file),
      category: categorize(file),
      type: docType(file),
      tier: tierFor(file, tier1Set, tier2Set),
    });
  }

  for (const rel of MONOREPO_FILES) {
    const abs = path.join(MONOREPO_DOCS, rel);
    if (!fs.existsSync(abs)) continue;
    docs.push({
      id: `docs/${rel}`,
      file: path.basename(rel),
      absPath: abs,
      workspace: "NexusAI Playbooks",
      category: rel.startsWith("deploy") ? "Ops" : rel.includes("roadmap") ? "Strategy" : "Product",
      type: "Framework",
      tier: "Tier 2 — GTM & Launch",
    });
  }

  return docs;
}

export function summarizeMarkdown(content, max = 400) {
  const stripped = content
    .replace(/^#+\s.*$/gm, "")
    .replace(/[*_`>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return stripped.slice(0, max);
}
