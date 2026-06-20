# Nexus OS

> Your autonomous AI operating system. **Ask once — Nexus puts a team of specialist agents on it**, across Slack, Email, Calendar, CRM and more.

Nexus OS is an AI OS in the spirit of Apex: a single intelligent layer that understands context, decides, and acts across your tools. It is powered by **your own Hub specialist roster** (`jamal-hub-v2`) — 4 business workspaces (Riad & Routes, ArtKech, ARG-Builder, JB) and a deep bench of expert specialists.

## The six components (Apex-style architecture)

| Component | In Nexus OS |
|-----------|-------------|
| 🧠 **Brain** | Chief of Staff orchestrator — plans, delegates to specialists in parallel, synthesizes one answer (`server/engine.ts`) |
| 🧬 **Memory** | Compounding context — preferences, facts, relationships, decisions (`Memory` view) |
| 📱 **Gateway** | Connect-once integrations: Slack, Email, Calendar, Notion, HubSpot, GitHub… (`Gateway` view) |
| ⚡ **Skills** | Modular workflows the Brain invokes (Email Triage, Calendar Optimizer, Content Engine…) |
| ❤️ **Heartbeat** | Proactive pulse — morning briefings, follow-ups, alerts (`Heartbeat` view) |
| 🔐 **Security** | Append-only audit log; drafts held for approval; self-hostable (`Activity` view) |

## Your Hub, integrated

`client/src/hub/jamal-hub-v2.jsx` is embedded in the **Hub** tab, and its **businesses + specialist roster power the Brain** (`shared/hubData.ts`). When you ask Nexus something, it routes the request to the most relevant of your specialists, grounds them in the active business context, and each runs its real system prompt.

## Run it

```bash
cd apps/nexus-os
pnpm install
pnpm dev          # web → http://localhost:5273 , api → http://localhost:8787
```

- **Demo mode** (no key): a deterministic brain simulates the full multi-agent loop so the OS is always demoable.
- **Live mode**: set `LLM_API_KEY` (any OpenAI-compatible provider) in `.env`. Specialists then run on real models.

## Connect the live Hub (3 ways)

1. **HTTP** — `HUB_SPECIALIST_URL` → `POST { query, context } -> { answer }`
2. **Embedded** — the original UI renders in the Hub tab
3. **LLM persona** — auto-enabled when `LLM_API_KEY` is set

See `client/src/hub/README.md`.

## Stack

Vite + React 19 + TypeScript + Tailwind v4 (web) · Express + Zod (API) · JSON-file persistence (zero external DB). MIT licensed — 100% yours to ship and sell.
