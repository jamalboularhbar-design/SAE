/**
 * Post-deploy DB maintenance: fix workspace categories + regenerate cross-refs.
 * Usage: node scripts/run-db-maintenance.mjs [--dry-run]
 */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import dotenv from "dotenv";
import { resolveDatabaseUrl } from "./lib/database-url.mjs";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const dryRun = process.argv.includes("--dry-run");

function runScript(scriptName, extraArgs = []) {
  const scriptPath = join(__dirname, scriptName);
  return new Promise((resolve, reject) => {
    const child = spawn("node", [scriptPath, ...extraArgs], {
      cwd: join(__dirname, ".."),
      env: process.env,
      stdio: "inherit",
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${scriptName} exited with code ${code}`));
    });
  });
}

async function main() {
  const url = resolveDatabaseUrl();
  if (!url) {
    process.exit(1);
  }
  process.env.DATABASE_URL = url;

  console.log("=== DB maintenance: fix workspace categories ===");
  await runScript("fix-workspace-categories.mjs", dryRun ? ["--dry-run"] : []);

  if (!dryRun) {
    console.log("\n=== DB maintenance: regenerate cross-references ===");
    await runScript("generate-cross-refs.mjs");
  } else {
    console.log("\n[skip] cross-ref regeneration in --dry-run mode");
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
