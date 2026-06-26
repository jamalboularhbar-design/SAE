#!/usr/bin/env node
/**
 * Verify NOTION_API_KEY before running full sync.
 * Usage: pnpm notion:verify
 */
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "../../.env") });

const key = (process.env.NOTION_API_KEY ?? "").trim();

function fail(msg) {
  console.error(`❌ ${msg}`);
  process.exit(1);
}

if (!key) fail("NOTION_API_KEY is missing. Add it to apps/playbooks/.env");
if (key.includes("...") || key.length < 40) {
  fail(
    "NOTION_API_KEY looks like a placeholder. Paste your full token from notion.so/my-integrations into .env"
  );
}
if (!key.startsWith("secret_") && !key.startsWith("ntn_")) {
  fail("Token should start with secret_ or ntn_. Regenerate at notion.so/my-integrations");
}

const hubId = "3848c474-cdec-8159-b5e0-c721055944cf";

async function main() {
  console.log("Checking Notion token…");

  const meRes = await fetch("https://api.notion.com/v1/users/me", {
    headers: {
      Authorization: `Bearer ${key}`,
      "Notion-Version": "2022-06-28",
    },
  });
  const me = await meRes.json();

  if (meRes.status === 401) {
    fail(
      "Token rejected (401). Regenerate the Internal Integration Secret at notion.so/my-integrations and update .env — no quotes, no spaces."
    );
  }
  if (!meRes.ok) {
    fail(`Notion API ${meRes.status}: ${me.message ?? JSON.stringify(me)}`);
  }

  console.log(`✓ Token valid — integration: ${me.name ?? me.id}`);

  const pageRes = await fetch(`https://api.notion.com/v1/pages/${hubId}`, {
    headers: {
      Authorization: `Bearer ${key}`,
      "Notion-Version": "2022-06-28",
    },
  });
  const page = await pageRes.json();

  if (pageRes.status === 403) {
    fail(
      "Token works but hub is not shared. Open PPV Ops Hub → ⋯ → Connections → add your integration."
    );
  }
  if (!pageRes.ok) {
    fail(`Hub access ${pageRes.status}: ${page.message ?? JSON.stringify(page)}`);
  }

  console.log(`✓ Hub access OK — ${page.url ?? "PPV Ops Hub"}`);
  console.log("\nReady to sync: pnpm notion:sync");
}

main().catch((err) => fail(err.message));
