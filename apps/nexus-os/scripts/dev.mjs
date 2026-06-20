#!/usr/bin/env node
/**
 * Self-healing dev launcher for Nexus OS.
 * Frees stale web/API ports before starting so a double-start can never
 * half-break the app (no more EADDRINUSE / port-bumped-to-5274 issues).
 */
import { execSync, spawn } from "node:child_process";

const WEB_PORT = process.env.WEB_PORT ?? "5273";
const API_PORT = process.env.PORT ?? "8787";

function freePort(port) {
  try {
    // Find PIDs listening on the port (Linux/macOS). Best-effort; ignored on failure.
    const out = execSync(`lsof -tiTCP:${port} -sTCP:LISTEN 2>/dev/null || true`, {
      encoding: "utf8",
    }).trim();
    if (!out) return;
    for (const pid of out.split(/\s+/).filter(Boolean)) {
      try {
        process.kill(Number(pid));
        console.log(`  ↳ freed port ${port} (stopped stale process ${pid})`);
      } catch {
        /* already gone */
      }
    }
  } catch {
    /* lsof unavailable — Vite/Express will surface a clear error if truly in use */
  }
}

console.log("⬡ Nexus OS — preparing a clean dev environment…");
freePort(WEB_PORT);
freePort(API_PORT);

const child = spawn(
  "concurrently",
  ["-k", "-n", "server,web", "-c", "green,cyan", "npm:dev:server", "npm:dev:web"],
  { stdio: "inherit", shell: true }
);

const shutdown = () => {
  try {
    child.kill();
  } catch {
    /* noop */
  }
  process.exit();
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
child.on("exit", (code) => process.exit(code ?? 0));
