# Hub Specialist drop-in (`jamal-hub-v2.jsx`)

Nexus OS treats your Hub as a first-class specialist agent. To wire in your real Hub:

## Option A — Embed the JSX component (UI panel)

1. Copy `jamal-hub-v2.jsx` into this folder: `client/src/hub/jamal-hub-v2.jsx`
2. It will auto-load in the **Hub** panel. Your component should accept:

```jsx
export default function Hub({ query, context, onAnswer }) {
  // ...render your hub UI, call onAnswer(answerString) when done
}
```

3. Restart `pnpm dev`.

## Option B — HTTP endpoint (recommended for production)

Serve your Hub anywhere and set an env var:

```bash
HUB_SPECIALIST_URL=https://your-hub.example.com/ask
```

Contract:

```
POST {HUB_SPECIALIST_URL}
body: { "query": "string", "context": { ... } }
->   { "answer": "string", "citations": ["..."] }
```

## Option C — LLM-backed persona (zero config)

If neither A nor B is set but `LLM_API_KEY` is present, the Hub runs as an
LLM persona automatically. With no key, a built-in deterministic responder is used
so the OS is always functional.

The connector logic lives in `server/hub.ts`.
