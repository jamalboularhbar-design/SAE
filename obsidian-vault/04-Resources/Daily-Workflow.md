# Daily Workflow — Obsidian + Cursor + Granola + Notion

## Stack roles

| Tool | When | What goes there |
|------|------|-----------------|
| **Obsidian** | All day | Thoughts, decisions, daily plan, links between ideas |
| **Cursor** | Build time | Code, deploy, agent memory (machine-readable) |
| **Granola** | Meetings | Auto capture; query via Cursor when implementing |
| **Notion PPV** | Weekly ops | Pillars, pipelines, metrics, launch tasks |

**Obsidian is the glue** — human-readable second brain. Agent memory is the machine mirror.

---

## Morning (5 min)

1. Open Obsidian → **Open today's daily note** (`Cmd/Ctrl+P`)
2. Set **Top 3 outcomes** (one per venture max if split day)
3. Glance at [[00-Inbox/README|Inbox]] — triage or defer to evening
4. Optional: ask Cursor *"What's on my calendar / upcoming meetings?"* (Granola)

---

## During work

| Event | Action |
|-------|--------|
| Idea / todo | Line in daily note or `00-Inbox/` |
| Meeting ends | New note from [[Templates/Meeting-Capture]] |
| Decision made | New note from [[Templates/Decision]] |
| Code shipped | [[Templates/Ship-Log]] + agent updates memory |
| Cursor session ends | Run `./scripts/obsidian/sync-memory-to-vault.sh` |

**Cursor agents** should:
- Read `.cursor/arg-builder-memory/memory/MEMORY.md` at session start
- Write human captures to `obsidian-vault/00-Inbox/` or today's daily note when Jamal says "capture this"
- Sync memory → vault after significant work

---

## Evening (5 min)

1. Fill **Ships**, **Decisions**, **Open loops** on daily note
2. Process inbox (≤10 min — move, link, or delete)
3. Link today's note from relevant [[MOCs/ARG-Builder|project MOC]]

---

## Weekly (Monday, 15 min)

Align with Notion PPV Action Zone:
- Review last 7 daily notes
- Update pipeline stages in Notion
- Refresh [[MOCs/ARG-Builder#Active projects|active projects list]]

---

## Vault location

**Path:** `SAE/obsidian-vault/` (this repo, git-synced)

### Open in Obsidian

1. Obsidian → Open folder as vault → select `obsidian-vault`
2. Enable **Daily notes** + **Templates** (preconfigured in `.obsidian/`)
3. Optional: **Obsidian Git** plugin for auto-commit on local machine

### Mobile

- Obsidian Sync (paid), or
- iCloud/Dropbox on `obsidian-vault` folder if repo cloned locally

---

## Wikilink conventions

- `[[Note title]]` — link to note
- `[[Note#Heading]]` — link to section
- Tags: `#daily`, `#decision`, `#ship`, `#meeting`

---

## Do not duplicate

| Keep in Obsidian | Keep in agent memory |
|------------------|---------------------|
| Daily rhythm, personal context | Deploy SHAs, file paths, verify commands |
| Decision narrative | Technical runbooks |
| Meeting summaries | API routes, component names |

Sync script copies agent memory → `04-Resources/Memory/` for browsing in Obsidian graph.
