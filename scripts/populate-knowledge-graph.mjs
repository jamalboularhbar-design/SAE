/**
 * Populate Knowledge Graph tables: cross-references + logical dependencies.
 *
 * Usage: DATABASE_URL=... node scripts/populate-knowledge-graph.mjs
 */
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function run(script) {
  return new Promise((resolve, reject) => {
    const child = spawn("node", [path.join(__dirname, script)], {
      stdio: "inherit",
      env: process.env,
    });
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`${script} exited ${code}`))));
  });
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  console.log("=== Step 1/2: Cross-references ===\n");
  await run("generate-cross-refs.mjs");

  console.log("\n=== Step 2/2: Dependencies ===\n");
  await run("generate-dependencies.mjs");

  console.log("\nKnowledge graph populated. Visit /graph or /admin/knowledge-graph");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
