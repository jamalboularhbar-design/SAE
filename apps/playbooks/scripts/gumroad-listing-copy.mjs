#!/usr/bin/env node
/**
 * Print Gumroad-ready listing copy (paste into each product manually).
 * Usage: pnpm templates:gumroad-copy
 */
import { TEMPLATE_BUNDLES, TEMPLATE_CLUB } from "../shared/templateBundles.ts";
import { resolveBundleDocs } from "../shared/templateBundleManifest.mjs";

const SLUGS = {
  starter: "nexusai-starter-pack",
  agency: "nexusai-agency-pack",
  "travel-ops": "nexusai-travel-ops",
  "creative-studio": "nexusai-creative-studio",
  complete: "nexusai-complete-library",
};

const ENV_NAMES = {
  starter: "GUMROAD_URL_STARTER",
  agency: "GUMROAD_URL_AGENCY",
  "travel-ops": "GUMROAD_URL_TRAVEL_OPS",
  "creative-studio": "GUMROAD_URL_CREATIVE_STUDIO",
  complete: "GUMROAD_URL_COMPLETE",
};

function listingBody(bundle, docCount) {
  return `${bundle.description}

## What's included
- **${docCount} operational documents** (Markdown, ready for Notion import)
- README with import instructions
- manifest.json (full file list)
- **Bonus:** ${bundle.credit} on NexusAI Playbooks

## Who it's for
${bundle.badge ? `_${bundle.badge}_` : ""}

## Import in 3 steps
1. Download and unzip
2. Notion → Import → Markdown & CSV → select \`markdown/\` folder
3. Optional: start a free Playbooks trial to run live with AI search → https://argbuilder.io/start-trial?utm_source=gumroad&utm_medium=readme&utm_campaign=${bundle.id}

## Formats
${bundle.formats.join(" · ")}

---
© NexusAI · https://nexusai.ma
Questions: hello@nexusai.ma`;
}

console.log("═".repeat(60));
console.log("GUMROAD LISTING KIT — paste each block into Gumroad");
console.log("Zip files: apps/playbooks/dist/template-bundles/{id}.zip");
console.log("═".repeat(60));

for (const bundle of TEMPLATE_BUNDLES) {
  const docs = resolveBundleDocs(bundle.id);
  const count = docs.length;
  console.log(`\n\n## ${bundle.name.toUpperCase()}`);
  console.log("─".repeat(40));
  console.log(`Product name:    NexusAI Templates — ${bundle.name}`);
  console.log(`URL slug:        ${SLUGS[bundle.id]}`);
  console.log(`Price:           $${bundle.price} USD (one-time)`);
  console.log(`File to upload:  dist/template-bundles/${bundle.id}.zip`);
  console.log(`Suggested tag: Digital product · Templates · Business`);
  console.log(`\nShort description (Gumroad summary):`);
  console.log(`${count} curated SOPs for ${bundle.vertical === "general" ? "any team" : bundle.vertical}. ${bundle.credit}.`);
  console.log(`\nLong description (Gumroad content):`);
  console.log(listingBody(bundle, count));
  console.log(`\nEnv var after publish:`);
  console.log(`GUMROAD_URL_${bundle.id.toUpperCase().replace(/-/g, "_")}=https://YOURNAME.gumroad.com/l/${SLUGS[bundle.id]}`);
}

console.log(`\n\n## TEMPLATE CLUB (optional — subscription)`);
console.log("─".repeat(40));
console.log(`Product name:    NexusAI ${TEMPLATE_CLUB.name}`);
console.log(`Price:           $${TEMPLATE_CLUB.price}/month`);
console.log(`Description:     ${TEMPLATE_CLUB.description}`);
console.log(`\nEnv var: GUMROAD_URL_TEMPLATE_CLUB=https://YOURNAME.gumroad.com/l/nexusai-template-club`);

console.log("\n\n═".repeat(60));
console.log("CHECKLIST — do in this order (~45 min total)");
console.log("═".repeat(60));
console.log(`
[ ] 1. pnpm templates:export
[ ] 2. Gumroad → Settings → Payments (connect Stripe/PayPal)
[ ] 3. Create Starter ($49) → upload starter.zip → publish → copy URL → .env
[ ] 4. Create Agency ($99) → upload agency.zip → publish → copy URL
[ ] 5. Create Travel Ops ($149) → upload travel-ops.zip
[ ] 6. Create Creative Studio ($149) → upload creative-studio.zip
[ ] 7. Create Complete ($199) → upload complete.zip
[ ] 8. (Optional) Template Club subscription $29/mo
[ ] 9. Add all GUMROAD_URL_* to Railway env → redeploy
[ ] 10. Verify /product/templates shows "Buy now"
`);
