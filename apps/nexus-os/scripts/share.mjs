#!/usr/bin/env node
/**
 * Opens a public URL for Nexus OS (no terminal needed on your side).
 * Requires `pnpm dev` already running on port 5273.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const urlFile = path.join(root, ".data/public-url.txt");
const logFile = "/tmp/nexus-cf-tunnel.log";
const WEB_PORT = process.env.WEB_PORT ?? "5273";

function readUrl() {
  try {
    const log = fs.readFileSync(logFile, "utf8");
    const m = log.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
    return m?.[0] ?? null;
  } catch {
    return null;
  }
}

const existing = readUrl();
if (existing) {
  console.log(`\n  ⬡ Nexus OS is already shared at:\n     ${existing}\n`);
  process.exit(0);
}

console.log("⬡ Opening a public link for Nexus OS…");

const child = spawn("/tmp/cloudflared", ["tunnel", "--url", `http://localhost:${WEB_PORT}`], {
  stdio: ["ignore", "pipe", "pipe"],
});

let buf = "";
const onData = (chunk) => {
  buf += chunk.toString();
  fs.writeFileSync(logFile, buf);
  const m = buf.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
  if (m) {
    fs.mkdirSync(path.dirname(urlFile), { recursive: true });
    fs.writeFileSync(urlFile, m[0] + "\n");
    console.log(`\n  ✅ Open Nexus OS here:\n     ${m[0]}\n`);
    console.log("  (Link saved to apps/nexus-os/.data/public-url.txt)\n");
    child.stdout?.off("data", onData);
    child.stderr?.off("data", onData);
  }
};

child.stdout?.on("data", onData);
child.stderr?.on("data", onData);

process.on("SIGINT", () => {
  child.kill();
  process.exit();
});
