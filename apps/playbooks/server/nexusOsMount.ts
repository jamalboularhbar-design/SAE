/**
 * Mount Nexus OS inside argbuilder.io (NexusAI Playbooks).
 * API at /os/api · UI at /os/
 */
import type { Express, Request, Response, NextFunction } from "express";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mounted = false;

export async function registerNexusOsIntegration(app: Express): Promise<void> {
  if (process.env.NEXUS_OS_ENABLED === "false") return;
  if (mounted) return;

  try {
    const mountJs = path.resolve(__dirname, "../../nexus-os/dist/server/mount.js");
    const mountTs = path.resolve(__dirname, "../../nexus-os/server/mount.ts");
    const useJs = fs.existsSync(mountJs);
    const entry = useJs ? mountJs : mountTs;

    if (!fs.existsSync(entry)) {
      console.log("  ⬡ Nexus OS: mount module not found — skipping /os mount");
      return;
    }

    const { registerNexusOs } = await import(/* @vite-ignore */ entry);
    const staticDir = path.resolve(__dirname, "../../nexus-os/dist/public");

    registerNexusOs(app, {
      basePath: "/os",
      staticDir: fs.existsSync(staticDir) ? staticDir : undefined,
      startScheduler: true,
    });

    // Dev fallback when UI isn't built yet — send devs to standalone Nexus OS server
    if (!fs.existsSync(staticDir) && process.env.NODE_ENV === "development") {
      const devUrl = process.env.NEXUS_OS_DEV_URL ?? "http://localhost:5273";
      app.get("/os", (_req: Request, res: Response) => {
        res.redirect(devUrl);
      });
      app.get("/os/*", (req: Request, res: Response, next: NextFunction) => {
        if (req.path.startsWith("/os/api")) return next();
        res.redirect(devUrl);
      });
      console.log(`  ⬡ Nexus OS UI (dev) → redirect to ${devUrl}`);
    }

    mounted = true;
  } catch (err) {
    console.warn("  ⬡ Nexus OS mount failed:", err instanceof Error ? err.message : err);
  }
}
