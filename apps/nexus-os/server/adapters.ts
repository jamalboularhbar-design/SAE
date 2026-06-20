/**
 * Real tool adapters. Each activates when you connect it (paste a token in the UI).
 * Until then the agent uses safe simulated output, so nothing breaks.
 *
 * Tokens (all set from Settings → Gateway, no terminal):
 *   notion  — Internal Integration token (ntn_… / secret_…)
 *   slack   — Bot/User OAuth token (xoxb-… / xoxp-…)
 *   gmail   — Google OAuth access token (drive/gmail share Google auth)
 *   drive   — Google OAuth access token
 */
import { secrets } from "./secrets.ts";

export interface AdapterResult {
  ok: boolean;
  summary: string;
  live: boolean;
}

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

// ── Notion ──
export async function notionTest(): Promise<AdapterResult> {
  const cred = secrets.getIntegration("notion");
  if (!cred?.token) return { ok: false, live: false, summary: "Not connected." };
  const res = await fetch("https://api.notion.com/v1/users/me", {
    headers: { Authorization: `Bearer ${cred.token}`, "Notion-Version": "2022-06-28" },
  });
  const data = await safeJson(res);
  if (!res.ok) return { ok: false, live: true, summary: `Notion error ${res.status}: ${data?.message ?? "check token"}` };
  return { ok: true, live: true, summary: `Connected as ${data?.name ?? data?.bot?.owner?.user?.name ?? "Notion integration"}.` };
}

export async function notionSearch(query: string): Promise<AdapterResult> {
  const cred = secrets.getIntegration("notion");
  if (!cred?.token) return { ok: true, live: false, summary: `(simulated) Searched Notion for "${query}".` };
  const res = await fetch("https://api.notion.com/v1/search", {
    method: "POST",
    headers: { Authorization: `Bearer ${cred.token}`, "Notion-Version": "2022-06-28", "content-type": "application/json" },
    body: JSON.stringify({ query, page_size: 5 }),
  });
  const data = await safeJson(res);
  if (!res.ok) return { ok: false, live: true, summary: `Notion error ${res.status}` };
  const titles = (data?.results ?? [])
    .map((p: { properties?: Record<string, { title?: { plain_text?: string }[] }>; title?: { plain_text?: string }[] }) => {
      const t = p.title?.[0]?.plain_text;
      if (t) return t;
      const props = p.properties ?? {};
      for (const v of Object.values(props)) {
        const pt = v?.title?.[0]?.plain_text;
        if (pt) return pt;
      }
      return null;
    })
    .filter(Boolean)
    .slice(0, 5);
  return { ok: true, live: true, summary: titles.length ? `Found in Notion: ${titles.join("; ")}.` : "No matching Notion pages." };
}

// ── Slack ──
export async function slackTest(): Promise<AdapterResult> {
  const cred = secrets.getIntegration("slack");
  if (!cred?.token) return { ok: false, live: false, summary: "Not connected." };
  const res = await fetch("https://slack.com/api/auth.test", {
    method: "POST",
    headers: { Authorization: `Bearer ${cred.token}` },
  });
  const data = await safeJson(res);
  if (!data?.ok) return { ok: false, live: true, summary: `Slack error: ${data?.error ?? "check token"}` };
  return { ok: true, live: true, summary: `Connected to ${data.team} as ${data.user}.` };
}

export async function slackChannels(): Promise<AdapterResult> {
  const cred = secrets.getIntegration("slack");
  if (!cred?.token) return { ok: true, live: false, summary: "(simulated) Reviewed Slack channels." };
  const res = await fetch("https://slack.com/api/conversations.list?limit=10&types=public_channel", {
    headers: { Authorization: `Bearer ${cred.token}` },
  });
  const data = await safeJson(res);
  if (!data?.ok) return { ok: false, live: true, summary: `Slack error: ${data?.error}` };
  const names = (data.channels ?? []).map((c: { name: string }) => `#${c.name}`).slice(0, 8);
  return { ok: true, live: true, summary: names.length ? `Slack channels: ${names.join(", ")}.` : "No channels." };
}

// ── Google (Gmail / Drive) ──
export async function gmailTest(): Promise<AdapterResult> {
  const cred = secrets.getIntegration("gmail");
  if (!cred?.token) return { ok: false, live: false, summary: "Not connected." };
  const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
    headers: { Authorization: `Bearer ${cred.token}` },
  });
  const data = await safeJson(res);
  if (!res.ok) return { ok: false, live: true, summary: `Gmail error ${res.status} (token may be expired).` };
  return { ok: true, live: true, summary: `Connected: ${data?.emailAddress} (${data?.messagesTotal} msgs).` };
}

export async function driveTest(): Promise<AdapterResult> {
  const cred = secrets.getIntegration("drive");
  if (!cred?.token) return { ok: false, live: false, summary: "Not connected." };
  const res = await fetch("https://www.googleapis.com/drive/v3/about?fields=user", {
    headers: { Authorization: `Bearer ${cred.token}` },
  });
  const data = await safeJson(res);
  if (!res.ok) return { ok: false, live: true, summary: `Drive error ${res.status} (token may be expired).` };
  return { ok: true, live: true, summary: `Connected as ${data?.user?.displayName ?? "Google user"}.` };
}

// ── Dispatchers used by the API + engine ──
export async function testIntegration(id: string): Promise<AdapterResult> {
  switch (id) {
    case "notion": return notionTest();
    case "slack": return slackTest();
    case "gmail": case "email": return gmailTest();
    case "drive": return driveTest();
    default:
      return { ok: secrets.isIntegrationConnected(id), live: false, summary: secrets.isIntegrationConnected(id) ? "Connected (no live test for this tool yet)." : "Not connected." };
  }
}

/** Used by the Brain when a specialist's tool maps to a connected service. */
export async function runIntegrationAction(via: string, query: string): Promise<AdapterResult | null> {
  if (via === "notion" && secrets.isIntegrationConnected("notion")) return notionSearch(query);
  if (via === "slack" && secrets.isIntegrationConnected("slack")) return slackChannels();
  return null;
}
