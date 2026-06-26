#!/usr/bin/env node
/**
 * Publish Nexus OS to its own GitHub repo.
 *
 *   node apps/nexus-os/scripts/publish-github.mjs
 *
 * Requires: empty repo https://github.com/jamalboularhbar-design/nexus-os
 * (create at github.com/new — public, no README)
 *
 * Or set NEXUS_OS_GITHUB_REPO=owner/name
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tmp = "/tmp/nexus-os-publish";
const repo = process.env.NEXUS_OS_GITHUB_REPO ?? "jamalboularhbar-design/nexus-os";
const repoUrl = `https://github.com/${repo}.git`;

function run(cmd, cwd = tmp) {
  console.log(`→ ${cmd}`);
  execSync(cmd, { cwd, stdio: "inherit" });
}

function copyTree(src, dest) {
  if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true });
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (["node_modules", ".data", "dist", ".git"].includes(entry.name)) continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyTree(from, to);
    else fs.copyFileSync(from, to);
  }
}

console.log("⬡ Preparing Nexus OS standalone export…");
copyTree(root, tmp);

if (!fs.existsSync(path.join(tmp, ".git"))) {
  run("git init -b main");
  run("git add -A");
  run('git commit -m "feat: Nexus OS standalone — argbuilder.io /os integration"');
}

run("git remote remove origin", tmp);
run(`git remote add origin ${repoUrl}`, tmp);

try {
  run("git push -u origin main --force", tmp);
  console.log(`\n✅ Published → https://github.com/${repo}\n`);
} catch {
  console.log(`\n⚠ Push failed — create an empty repo first:\n`);
  console.log(`  1. Open https://github.com/new`);
  console.log(`  2. Name: nexus-os · Public · No README`);
  console.log(`  3. Run this script again\n`);
  console.log(`  Standalone code is also on SAE branch publish/nexus-os-standalone\n`);
  process.exit(1);
}
