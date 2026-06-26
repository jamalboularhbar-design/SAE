/**
 * Nexus OS — standalone server entry (dev / separate deploy).
 * For argbuilder.io integration, use registerNexusOs() from ./mount.ts instead.
 */
import express from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createNexusOsApiRouter } from "./mount.ts";
import { startScheduler } from "./scheduler.ts";
import { isLiveMode } from "./llm.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use("/api", createNexusOsApiRouter());

const publicDir = path.resolve(__dirname, "../dist/public");
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get("*", (_req, res) => res.sendFile(path.join(publicDir, "index.html")));
}

const PORT = Number(process.env.PORT ?? 8787);
app.listen(PORT, () => {
  console.log(`\n  ⬡ Nexus OS → http://localhost:${PORT}  [${isLiveMode() ? "LIVE" : "DEMO"} mode]\n`);
  startScheduler();
});
