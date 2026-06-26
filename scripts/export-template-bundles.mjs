#!/usr/bin/env node
/**
 * Export NexusAI template bundles as Markdown folders + zip archives.
 * Reads docs-seed/ read-only. Output: dist/template-bundles/
 *
 * Usage: pnpm templates:export
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { TEMPLATE_BUNDLES } from "../shared/templateBundles.ts";
import { resolveBundleDocs } from "../shared/templateBundleManifest.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../dist/template-bundles");

function readme(bundle) {
  return `# ${bundle.name} — NexusAI Templates

${bundle.description}

- **Documents:** ${bundle.docCount}+ curated SOPs
- **Formats included:** ${bundle.formats.join(", ")}
- **Playbooks credit:** ${bundle.credit}

## Import to Notion
1. Unzip this folder
2. Use Notion **Import** → **Markdown & CSV**
3. Select the \`markdown/\` folder

## Upgrade to NexusAI Playbooks
Live platform with AI search, multi-brand workspaces, and ${bundle.credit}.
https://argbuilder.io/start-trial?utm_source=template_bundle&utm_medium=readme&utm_campaign=${bundle.id}

---
© NexusAI · https://nexusai.ma
`;
}

function zipBundleDir(bundleDir, zipPath) {
  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
  execSync(`zip -r -q "${zipPath}" .`, { cwd: bundleDir });
}

async function exportBundle(bundleId, bundleMeta, docs) {
  const bundleDir = path.join(OUT_DIR, bundleId);
  const mdDir = path.join(bundleDir, "markdown");
  fs.rmSync(bundleDir, { recursive: true, force: true });
  fs.mkdirSync(mdDir, { recursive: true });

  fs.writeFileSync(path.join(bundleDir, "README.md"), readme(bundleMeta));
  fs.writeFileSync(
    path.join(bundleDir, "manifest.json"),
    JSON.stringify(
      {
        bundle: bundleMeta.name,
        id: bundleId,
        exportedAt: new Date().toISOString(),
        docCount: docs.length,
        files: docs.map((d) => d.id),
      },
      null,
      2
    )
  );

  for (const doc of docs) {
    const content = fs.readFileSync(doc.absPath, "utf8");
    const header = `<!-- NexusAI Templates · ${bundleMeta.name} · Source: ${doc.id} -->\n\n`;
    const safeName = doc.file.replace(/[^\w.-]/g, "_");
    fs.writeFileSync(path.join(mdDir, safeName), header + content);
  }

  const zipPath = path.join(OUT_DIR, `${bundleId}.zip`);
  zipBundleDir(bundleDir, zipPath);
  console.log(`  ✓ ${bundleMeta.name}: ${docs.length} docs → ${bundleId}.zip`);
}

async function main() {
  if (!fs.existsSync(path.resolve(__dirname, "../docs-seed"))) {
    console.error("docs-seed/ not found");
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log(`Exporting template bundles → ${OUT_DIR}\n`);

  for (const bundle of TEMPLATE_BUNDLES) {
    const docs = resolveBundleDocs(bundle.id);
    if (docs.length === 0) {
      console.warn(`  ⚠ ${bundle.name}: no docs matched patterns`);
      continue;
    }
    await exportBundle(bundle.id, bundle, docs);
  }

  console.log("\n✅ Export complete. Upload zips from dist/template-bundles/ to Gumroad.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
