/**
 * Shared helpers for document seeding — catalog parsing, slugify, content matching.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DOCS_DIR = path.join(__dirname, "../docs-seed");
export const CATALOG_TS = path.join(__dirname, "../client/src/lib/documentCatalog.ts");

export function stripManusFooter(content) {
  if (!content) return content;
  const MANUS_FOOTER_PATTERN = /\n*---?\n*\n*\*Document prepared by Manus AI[^*]*\*\s*$/i;
  const MANUS_FOOTER_ALT = /\n*\*?(?:Document )?(?:prepared|generated) by Manus(?: AI)?[^*\n]*\*?\s*$/i;
  return content.replace(MANUS_FOOTER_PATTERN, "").replace(MANUS_FOOTER_ALT, "").trimEnd();
}

export function slugify(input) {
  return String(input)
    .replace(/\.md$/i, "")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 200);
}

export function catalogSlug(filename) {
  // Match legacy Manus flat files: ARG-Builder-ABM.md → abm
  const base = filename.replace(/^ARG-Builder-/i, "").replace(/\.md$/i, "");
  return slugify(base);
}

export function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/arg-builder[-: ]+/g, " ")
    .replace(/\.md$/i, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 2 && !["the", "and", "for", "with", "playbook", "framework", "guide"].includes(w));
}

export function tokenScore(a, b) {
  const A = new Set(tokenize(a));
  const B = new Set(tokenize(b));
  if (!A.size || !B.size) return 0;
  const inter = [...A].filter((x) => B.has(x)).length;
  return inter / new Set([...A, ...B]).size;
}

export function parseCatalog() {
  const raw = fs.readFileSync(CATALOG_TS, "utf-8");
  const entries = [...raw.matchAll(/\{\s*id:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*filename:\s*"([^"]+)"\s*\}/g)].map(
    (m) => ({
      id: m[1],
      title: m[2],
      category: m[3],
      filename: m[4],
      slug: catalogSlug(m[4]),
    })
  );
  return entries;
}

export function loadDocsSeedFiles() {
  if (!fs.existsSync(DOCS_DIR)) return [];
  return fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((filename) => {
      const filePath = path.join(DOCS_DIR, filename);
      const content = stripManusFooter(fs.readFileSync(filePath, "utf-8"));
      return {
        filename,
        slug: slugify(filename),
        title: filename
          .replace(/\.md$/i, "")
          .replace(/^ARG-Builder[-: ]+/i, "")
          .replace(/^ARG Builder — /, "")
          .replace(/[-_]/g, " ")
          .trim(),
        content,
        wordCount: content.split(/\s+/).filter(Boolean).length,
      };
    });
}

/**
 * Find best docs-seed file for a catalog entry.
 * Returns { file, score, matchType } or null.
 */
export function findBestSeedFile(entry, seedFiles, usedFilenames) {
  const available = seedFiles.filter((f) => !usedFilenames.has(f.filename));

  const exact = available.find((f) => f.filename === entry.filename);
  if (exact) return { file: exact, score: 1, matchType: "exact" };

  let best = null;
  let bestScore = 0;
  for (const f of available) {
    const scores = [
      tokenScore(entry.filename, f.filename),
      tokenScore(entry.title, f.title),
      tokenScore(entry.id, f.filename),
      tokenScore(entry.slug, f.slug),
    ];
    const score = Math.max(...scores);
    if (score > bestScore) {
      bestScore = score;
      best = f;
    }
  }

  if (best && bestScore >= 0.45) {
    return { file: best, score: bestScore, matchType: "fuzzy" };
  }
  return null;
}

export function stubContent(title, category) {
  return `# ${title}

> **${category}** · Part of the ARG-Builder Playbooks library

This playbook is indexed in the Master Document Library. Structured content for **${title}** is being restored to the library — browse related documents on the [knowledge graph](/graph) or contact your workspace admin to attach source material.

## Purpose

Operational guidance for ${category.toLowerCase()} teams on **${title.toLowerCase()}**.

## Recommended next steps

1. Review prerequisites in the same category on the knowledge graph
2. Adapt templates and checklists to your workspace
3. Link this document to active OKRs or operating cadences

---

*ARG-Builder Playbooks · [argbuilder.io](https://argbuilder.io)*
`;
}

export function categorizeFromFilename(filename) {
  const categories = {
    Engineering: ["engineering", "ci-cd", "devops", "kubernetes", "api", "architecture", "infrastructure", "terraform", "pipeline", "observability", "security", "technical"],
    Sales: ["sales", "sdr", "deal", "pipeline", "demo", "objection", "forecast", "revops", "outreach"],
    Marketing: ["marketing", "seo", "content", "email", "demand-gen", "abm", "brand", "launch", "linkedin"],
    "Customer Success": ["customer", "onboarding", "churn", "retention", "health-score", "qbr", "success"],
    Product: ["product", "roadmap", "feature", "prototype", "analytics", "metrics"],
    "Finance & Legal": ["finance", "legal", "accounting", "revenue", "fundraising", "investor", "cap-table", "pricing"],
    "Strategy & Operations": ["strategy", "okr", "planning", "board", "operating", "founder", "implementation"],
    "People & Culture": ["hiring", "talent", "employee", "culture", "handbook", "hr"],
    "AI & Developer": ["ai", "ml", "agent", "llm", "copilot"],
    "Security & Compliance": ["compliance", "soc-2", "gdpr", "privacy", "audit"],
    "Partnerships & GTM": ["partner", "channel", "gtm", "referral", "ecosystem"],
    "Data & Analytics": ["data", "analytics", "cohort", "cdp", "warehouse"],
    "Revenue & Pricing": ["pricing", "monetization", "acv", "unit-economics"],
    Operations: ["incident", "on-call", "runbook", "vendor", "procurement"],
    "Riad & Routes": ["RR-", "riad", "routes", "concierge", "hospitality", "travel"],
    "ArtKech Design Studio": ["AK-", "artkech", "creative", "design-studio"],
  };

  if (filename.includes("RR-") || filename.includes("Riad")) return "Riad & Routes";
  if (filename.includes("AK-") || filename.includes("ArtKech")) return "ArtKech Design Studio";

  const nameLower = filename.toLowerCase();
  let best = "Strategy & Operations";
  let bestScore = 0;
  for (const [cat, keywords] of Object.entries(categories)) {
    const score = keywords.filter((kw) => nameLower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      best = cat;
    }
  }
  return best;
}
