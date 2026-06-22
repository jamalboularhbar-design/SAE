/**
 * Restore missing catalog playbooks to docs-seed/ as canonical ARG-Builder-*.md files.
 *
 * - Copies content from fuzzy-matched colon/dash variants (~270)
 * - Generates structured operational playbooks for the rest (~187)
 * - Skips files that already exist with substantive content (>200 words)
 *
 * Usage: node scripts/restore-catalog-docs.mjs [--dry-run] [--force]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.join(__dirname, "../docs-seed");
const CATALOG_TS = path.join(__dirname, "../client/src/lib/documentCatalog.ts");

const dryRun = process.argv.includes("--dry-run");
const force = process.argv.includes("--force");

function parseCatalog() {
  const raw = fs.readFileSync(CATALOG_TS, "utf-8");
  return [...raw.matchAll(/\{\s*id:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*filename:\s*"([^"]+)"\s*\}/g)].map(
    (m) => ({ id: m[1], title: m[2], category: m[3], filename: m[4] })
  );
}

function loadSeedFiles() {
  return fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const content = fs.readFileSync(path.join(DOCS_DIR, filename), "utf-8");
      return {
        filename,
        content,
        wordCount: content.split(/\s+/).filter(Boolean).length,
        title: filename.replace(/\.md$/i, "").replace(/^ARG-Builder[-: ]+/i, "").replace(/[-_]/g, " "),
      };
    });
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/arg-builder[-: ]+/g, " ")
    .replace(/\.md$/i, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 2 && !["the", "and", "for", "with", "playbook", "framework", "guide"].includes(w));
}

function tokenScore(a, b) {
  const A = new Set(tokenize(a));
  const B = new Set(tokenize(b));
  if (!A.size || !B.size) return 0;
  const inter = [...A].filter((x) => B.has(x)).length;
  return inter / new Set([...A, ...B]).size;
}

function findBestMatch(entry, files, used) {
  const available = files.filter((f) => !used.has(f.filename));
  const exact = available.find((f) => f.filename === entry.filename);
  if (exact) return { file: exact, score: 1 };

  let best = null;
  let bestScore = 0;
  for (const f of available) {
    const score = Math.max(
      tokenScore(entry.filename, f.filename),
      tokenScore(entry.title, f.title),
      tokenScore(entry.id, f.filename)
    );
    if (score > bestScore) {
      bestScore = score;
      best = f;
    }
  }
  if (best && bestScore >= 0.45) return { file: best, score: bestScore };
  return null;
}

function normalizeH1(content, title) {
  const h1 = `# ARG-Builder: ${title}`;
  if (/^#\s+/m.test(content)) {
    return content.replace(/^#\s+.+$/m, h1);
  }
  return `${h1}\n\n${content}`;
}

function categoryPeers(entry, catalog, limit = 4) {
  return catalog
    .filter((c) => c.category === entry.category && c.id !== entry.id)
    .slice(0, limit)
    .map((c) => c.title);
}

function generatePlaybook(entry, catalog) {
  const peers = categoryPeers(entry, catalog);
  const peerList = peers.map((p) => `- ${p}`).join("\n");
  const cat = entry.category;

  const frameworks = {
    Engineering: {
      summary: `defines the engineering standards, architecture decisions, and implementation practices for **${entry.title}** at ARG-Builder.`,
      phases: ["Design & RFC", "Implementation", "Testing & Review", "Deploy & Monitor"],
      metrics: ["Deployment frequency", "Change failure rate", "MTTR", "Test coverage"],
    },
    Sales: {
      summary: `provides the sales methodology, talk tracks, and execution playbook for **${entry.title}** across the ARG-Builder revenue team.`,
      phases: ["Discovery", "Qualification", "Demo & POV", "Negotiation & Close"],
      metrics: ["Win rate", "Sales cycle length", "ACV", "Pipeline coverage"],
    },
    Marketing: {
      summary: `outlines the marketing strategy, channel tactics, and measurement framework for **${entry.title}** in the ARG-Builder GTM motion.`,
      phases: ["Research & Positioning", "Campaign Build", "Launch", "Measure & Iterate"],
      metrics: ["MQL volume", "CAC", "Conversion rate", "Content engagement"],
    },
    "Customer Success": {
      summary: `defines the customer success processes, health indicators, and intervention playbooks for **${entry.title}** to maximize retention and expansion.`,
      phases: ["Onboard", "Adopt", "Expand", "Renew"],
      metrics: ["NRR", "Gross retention", "Health score", "Time to value"],
    },
    Product: {
      summary: `establishes the product strategy, prioritization criteria, and delivery framework for **${entry.title}** across the ARG-Builder product org.`,
      phases: ["Discover", "Define", "Build", "Ship & Learn"],
      metrics: ["Activation rate", "Feature adoption", "NPS", "Release cadence"],
    },
    "Finance & Legal": {
      summary: `covers the financial controls, compliance requirements, and operating procedures for **${entry.title}** at ARG-Builder.`,
      phases: ["Policy", "Process", "Controls", "Audit & Report"],
      metrics: ["Close time", "Audit findings", "Forecast accuracy", "Compliance score"],
    },
    "Strategy & Operations": {
      summary: `defines the strategic framework, operating cadence, and decision rights for **${entry.title}** across ARG-Builder leadership.`,
      phases: ["Assess", "Plan", "Execute", "Review"],
      metrics: ["OKR attainment", "Initiative velocity", "Cross-functional SLA", "Decision cycle time"],
    },
    default: {
      summary: `provides the operational framework, roles, and execution guidance for **${entry.title}** within the ARG-Builder business operating system.`,
      phases: ["Assess", "Design", "Execute", "Measure"],
      metrics: ["Cycle time", "Quality score", "Adoption", "ROI"],
    },
  };

  const fw = frameworks[cat] || frameworks.default;
  const phases = fw.phases
    .map(
      (p, i) => `### Phase ${i + 1}: ${p}

| Activity | Owner | Output |
|----------|-------|--------|
| Define scope and success criteria | ${cat} lead | Brief + metrics |
| Execute core workflows | Team | Deliverables |
| Review and document learnings | Ops | Playbook update |`
    )
    .join("\n\n");

  const metrics = fw.metrics
    .map((m) => `| ${m} | TBD | Monthly | ${cat} lead |`)
    .join("\n");

  return `# ARG-Builder: ${entry.title}

## Executive Summary

This playbook ${fw.summary} It is part of the ARG-Builder operational library for **${cat}** teams building and scaling a B2B SaaS platform.

---

## Objectives

| Objective | Success Criteria | Owner |
|-----------|------------------|-------|
| Standardize ${entry.title.toLowerCase()} practices | Documented process adopted by team | ${cat} lead |
| Reduce execution variance | < 10% deviation from playbook steps | Ops |
| Enable measurable outcomes | KPIs tracked in weekly review | Leadership |

---

## Key Metrics

| Metric | Target | Frequency | Owner |
|--------|--------|-----------|-------|
${metrics}

---

## Process Framework

${phases}

---

## Roles & Responsibilities

| Role | Responsibility |
|------|----------------|
| Executive sponsor | Approves policy changes, removes blockers |
| ${cat} lead | Owns playbook, trains team, reports metrics |
| IC contributors | Execute workflows, flag gaps |
| RevOps / Data | Instrument metrics, maintain dashboards |

---

## Templates & Checklists

- [ ] Review prerequisites in related ${cat} playbooks
- [ ] Customize templates for your team size and stage
- [ ] Assign owner and review cadence (monthly recommended)
- [ ] Link outcomes to OKRs in your planning system
- [ ] Publish updates to the team wiki after each revision

---

## Related Playbooks (${cat})

${peerList || "- Browse the full library on the knowledge graph"}

Explore connections: [/graph](/graph)

---

*Part of the ARG-Builder Playbooks library · [argbuilder.io](https://argbuilder.io)*
`;
}

async function main() {
  const catalog = parseCatalog();
  const seedFiles = loadSeedFiles();
  const usedSources = new Set();

  let copied = 0;
  let generated = 0;
  let skipped = 0;

  console.log(`Catalog: ${catalog.length} entries | docs-seed: ${seedFiles.length} files`);
  if (dryRun) console.log("(dry run — no files written)\n");

  for (const entry of catalog) {
    const dest = path.join(DOCS_DIR, entry.filename);

    if (fs.existsSync(dest) && !force) {
      const existing = fs.readFileSync(dest, "utf-8");
      const wc = existing.split(/\s+/).filter(Boolean).length;
      if (wc > 200 && !existing.includes("being restored to the library")) {
        skipped++;
        continue;
      }
    }

    const match = findBestMatch(entry, seedFiles, usedSources);
    let content;

    if (match && match.score >= 0.45) {
      usedSources.add(match.file.filename);
      content = normalizeH1(match.file.content, entry.title);
      copied++;
    } else {
      content = generatePlaybook(entry, catalog);
      generated++;
    }

    if (!dryRun) {
      fs.writeFileSync(dest, content.trimEnd() + "\n", "utf-8");
    }
  }

  console.log(`\nRestore complete:`);
  console.log(`  copied from existing docs-seed: ${copied}`);
  console.log(`  generated new playbooks:       ${generated}`);
  console.log(`  skipped (already good):      ${skipped}`);
  console.log(`  total canonical files:       ${copied + generated + skipped}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
