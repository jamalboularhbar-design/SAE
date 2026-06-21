#!/usr/bin/env node
/**
 * Publish Nexus OS to its own GitHub repo (run once from SAE monorepo root).
 *
 *   node apps/nexus-os/scripts/publish-github.mjs
 *
 * Requires: gh auth login, permission to create repos on jamalboularhbar-design
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tmp = "/tmp/nexus-os-publish";
const repo = process.env.NEXUS_OS_GITHUB_REPO ?? "jamalboularhbar-design/nexus-os";

function run(cmd, cwd = tmp) {
  console.log(`→ ${cmd}`);
  execSync(cmd, { cwd, stdio: "inherit" });
}

if (fs.existsSync(tmp)) fs.rmSync(tmp, { recursive: true });
fs.mkdirSync(tmp, { recursive: true });

run(`tar cf - --exclude=node_modules --exclude=.data --exclude=dist . | tar xf -`, root);

if (!fs.existsSync(path.join(tmp, ".git"))) {
  run("git init -b main");
  run("git add -A");
  run('git commit -m "feat: Nexus OS standalone — argbuilder.io /os integration"');
}

try {
  run(`gh repo create ${repo} --public --description "Nexus OS — Ask once; specialist agents execute across your tools" --source=. --remote=origin --push`);
  console.log(`\n✅ Published → https://github.com/${repo}\n`);
} catch {
  console.log(`\n⚠ Could not auto-create repo. Push manually:\n`);
  console.log(`  cd ${tmp}`);
  console.log(`  git remote add origin https://github.com/${repo}.git`);
  console.log(`  git push -u origin main\n`);
}
