# Feedback: Implementation

## Code principles

1. **Minimize scope** — smallest correct diff; no drive-by refactors
2. **No over-engineering** — no one-line helpers, no excessive edge handling
3. **Match conventions** — read surrounding code first
4. **Comments** — only for non-obvious business logic
5. **Tests** — only when requested or meaningful

## Agent behavior

- Run commands yourself; real environment with network
- Don't give up after one failure
- Commit + push + update PR each iteration before testing summary
- Cloud agent branches: `cursor/<name>-0c61`

## Playbooks-specific

- `/os` routes: always full-page navigation, never wouter SPA
- Logo: use user's PNG; strip neutral background programmatically if needed
- deploy/production sync after main merges for Railway

## Don't

- Redraw user logo as SVG without explicit ask
- Silent-fail nexus-os build without flagging in summary
- Estimate calendar timelines for agents — use technical scope instead
