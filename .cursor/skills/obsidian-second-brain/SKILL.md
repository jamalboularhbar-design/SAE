---
name: obsidian-second-brain
description: Daily second-brain workflow with Obsidian vault in SAE repo. Use for daily notes, captures, decisions, meeting notes, and syncing agent memory. Pair with Granola (meetings) and Notion PPV (weekly ops).
---

# Obsidian Second Brain

**Vault path:** `obsidian-vault/` in SAE repo (git-synced)

**Read:** [obsidian-vault/04-Resources/Daily-Workflow.md](../../obsidian-vault/04-Resources/Daily-Workflow.md)

---

## When to use this skill

- Jamal asks about daily workflow, second brain, Obsidian, note-taking
- Capturing decisions, meetings, ships outside of code
- End of Cursor session — sync memory to vault
- Start of day — populate or reference daily note

---

## Vault structure

```
obsidian-vault/
├── Home.md                 ← start here
├── 00-Inbox/               ← quick capture
├── 01-Daily/               ← daily notes (YYYY-MM-DD)
├── 02-Projects/            ← active work (ARG-Builder, etc.)
├── 03-Areas/               ← Riad-Routes, ArtKech, Personal
├── 04-Resources/
│   ├── Daily-Workflow.md
│   └── Memory/             ← synced from agent memory
├── MOCs/                   ← maps of content
└── Templates/              ← Daily, Meeting, Decision, Ship-Log
```

Obsidian config in `.obsidian/` — daily notes + templates preconfigured.

---

## Daily workflow (Jamal)

| Time | Action |
|------|--------|
| **Morning** | Open today's daily note → top 3 outcomes → triage inbox |
| **Work** | Capture to inbox or daily note; meetings → Meeting-Capture template |
| **Evening** | Log ships, decisions, open loops; process inbox |
| **Monday** | Align with Notion PPV pipelines |

---

## Agent responsibilities

### Session start
1. Read `.cursor/arg-builder-memory/memory/MEMORY.md` (machine context)
2. Optionally read today's `obsidian-vault/01-Daily/YYYY-MM-DD.md` if it exists

### During work
When Jamal says "capture this", "note this", or a decision is made:
- Write to `obsidian-vault/00-Inbox/<slug>.md` OR append to today's daily note
- Use [[wikilinks]] to related MOCs/projects
- For decisions: copy from `Templates/Decision.md`

### After significant work
```bash
./scripts/obsidian/sync-memory-to-vault.sh
```
Updates `04-Resources/Memory/` from agent memory files.

Also update agent memory directly (see `arg-builder` skill → Memory maintenance).

### Meetings
- **Recall:** use Granola MCP (`query_granola_meetings`) — don't ask Jamal to remember
- **Persist:** create `obsidian-vault/02-Projects/.../` or daily note entry from `Templates/Meeting-Capture.md`

---

## Integration map

| System | Role | Agent access |
|--------|------|--------------|
| Obsidian vault | Human second brain | Read/write markdown in repo |
| Agent memory | Machine context | `.cursor/arg-builder-memory/` |
| Granola | Meeting source of truth | MCP |
| Notion PPV | Weekly execution | MCP + `docs/notion/` |
| Git / SAE | Code + deploy | Shell |

**Rule:** Obsidian = narrative + links. Agent memory = paths, SHAs, verify commands. Sync script bridges both.

---

## Open vault (Jamal)

1. Clone/pull SAE repo
2. Obsidian → Open folder as vault → `obsidian-vault/`
3. `Cmd/Ctrl+P` → "Open today's daily note"

Optional plugins: **Obsidian Git** (auto-commit locally), **Calendar** (daily note sidebar).

---

## Templates

| Template | Use |
|----------|-----|
| `Templates/Daily.md` | Daily planning + review |
| `Templates/Meeting-Capture.md` | After calls |
| `Templates/Decision.md` | Immutable decisions |
| `Templates/Ship-Log.md` | After deploy |

Create from template: `Cmd/Ctrl+P` → "Insert template"

---

## Related skills

- `arg-builder` — code, deploy, UI (updates memory; run sync after ship)
- `granola-context` — meeting recall
- `knowledge-capture` — export to Notion when needed for team/PPV
