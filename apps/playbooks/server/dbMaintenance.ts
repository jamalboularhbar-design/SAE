import { spawn } from "node:child_process";
import { join } from "node:path";

function resolveDatabaseUrl(): string | null {
  const url = process.env.DATABASE_URL ?? process.env.MYSQL_URL;
  if (!url?.trim() || url.includes("${{")) return null;
  return url.trim();
}

function runNodeScript(scriptPath: string, args: string[] = []): Promise<string> {
  return new Promise((resolve, reject) => {
    const cwd = process.cwd();
    const chunks: string[] = [];
    const child = spawn("node", [scriptPath, ...args], {
      cwd,
      env: { ...process.env, DATABASE_URL: resolveDatabaseUrl() ?? "" },
    });

    child.stdout.on("data", (d) => chunks.push(String(d)));
    child.stderr.on("data", (d) => chunks.push(String(d)));
    child.on("error", reject);
    child.on("close", (code) => {
      const output = chunks.join("");
      if (code === 0) resolve(output);
      else reject(new Error(`${scriptPath} failed (${code}):\n${output}`));
    });
  });
}

export async function runDbMaintenance(options?: { dryRun?: boolean }) {
  const dryRun = options?.dryRun ?? false;
  if (!resolveDatabaseUrl()) {
    throw new Error("DATABASE_URL or MYSQL_URL is not configured");
  }

  const scriptsDir = join(process.cwd(), "scripts");
  const fixArgs = dryRun ? ["--dry-run"] : [];

  const fixOutput = await runNodeScript(join(scriptsDir, "fix-workspace-categories.mjs"), fixArgs);

  let crossRefOutput = "";
  if (!dryRun) {
    crossRefOutput = await runNodeScript(join(scriptsDir, "generate-cross-refs.mjs"));
  }

  return {
    dryRun,
    fixOutput: fixOutput.trim(),
    crossRefOutput: crossRefOutput.trim(),
  };
}
