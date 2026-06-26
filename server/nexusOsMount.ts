/**
 * Mount Nexus OS inside argbuilder.io (ARG-Builder Playbooks).
 * API at /os/api · UI at /os/
 *
 * Path resolution candidates — tried in order. The first one that exists wins.
 * This way the mount works in:
 *   - Railway / deploy-branch layout : /app/dist running, nexus-os vendored
 *     at /app/nexus-os/dist/(server|public).
 *   - Monorepo dev (built)            : apps/playbooks/dist running, sibling
 *     apps/nexus-os/dist/(server|public).
 *   - Monorepo dev (tsx watch)        : apps/playbooks/server/_core/index.ts
 *     running, sibling apps/nexus-os/server/mount.ts.
 */
import type { Express, Request, Response, NextFunction } from "express";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mounted = false;

function firstExisting(candidates: string[]): string | undefined {
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return undefined;
}

export async function registerNexusOsIntegration(app: Express): Promise<void> {
  if (process.env.NEXUS_OS_ENABLED === "false") return;
  if (mounted) return;

  try {
    // Built mount module candidates (preferred for prod).
    const mountJsCandidates = [
      path.resolve(__dirname, "../nexus-os/dist/server/mount.js"),
      path.resolve(__dirname, "../../nexus-os/dist/server/mount.js"),
      path.resolve(__dirname, "../../../nexus-os/dist/server/mount.js"),
      path.resolve(process.cwd(), "nexus-os/dist/server/mount.js"),
    ];
    // Source mount candidates (dev only).
    const mountTsCandidates = [
      path.resolve(__dirname, "../nexus-os/server/mount.ts"),
      path.resolve(__dirname, "../../nexus-os/server/mount.ts"),
      path.resolve(__dirname, "../../../nexus-os/server/mount.ts"),
    ];

    const mountJs = firstExisting(mountJsCandidates);
    const entry = mountJs ?? firstExisting(mountTsCandidates);

    if (!entry) {
      console.log("  ⬡ Nexus OS: no mount module found — /os will 404");
      console.log("    tried (built):");
      mountJsCandidates.forEach((c) => console.log(`      ${c}`));
      return;
    }

    console.log(`  ⬡ Nexus OS: using mount module ${entry}`);

    const { registerNexusOs } = await import(/* @vite-ignore */ entry);

    // Static (built UI) candidates — must align with vite outDir "dist/public".
    const staticCandidates = [
      path.resolve(__dirname, "../nexus-os/dist/public"),
      path.resolve(__dirname, "../../nexus-os/dist/public"),
      path.resolve(__dirname, "../../../nexus-os/dist/public"),
      path.resolve(process.cwd(), "nexus-os/dist/public"),
    ];
    const staticDir = firstExisting(staticCandidates);
    if (staticDir) {
      console.log(`  ⬡ Nexus OS: serving UI from ${staticDir}`);
    } else {
      console.log("  ⬡ Nexus OS: no built UI dir — /os/* will 404 unless dev redirect is set");
    }

    registerNexusOs(app, {
      basePath: "/os",
      staticDir,
      startScheduler: true,
    });

    // Dev fallback when UI isn't built — redirect to the standalone Nexus OS dev server.
    if (!staticDir && process.env.NODE_ENV === "development") {
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
