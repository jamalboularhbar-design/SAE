---
name: reference-obsidian-workflow
description: Obsidian second brain — vault location, daily rhythm, sync with agent memory, Granola, Notion PPV.
metadata:
  node_type: memory
  type: reference
---

## Vault

**Path:** `obsidian-vault/` in SAE repo (git-synced)

**Open:** Obsidian → Open folder as vault → `obsidian-vault/` → start at `Home.md`

**Skill:** `.cursor/skills/obsidian-second-brain/SKILL.md`

## Daily rhythm

| Time | Action |
|------|--------|
| Morning | Daily note → top 3 outcomes → triage inbox |
| Work | Capture to inbox/daily; Granola for meeting recall |
| Evening | Ships, decisions, open loops |
| Monday | Align with Notion PPV |

Full doc: `obsidian-vault/04-Resources/Daily-Workflow.md`

## Sync (agent memory ↔ Obsidian)

```bash
./scripts/obsidian/sync-memory-to-vault.sh
```

One-way mirror: `.cursor/arg-builder-memory/memory/*.md` → `obsidian-vault/04-Resources/Memory/`

Run after significant Cursor sessions or before daily review.

## Division of labor

| Obsidian | Agent memory |
|----------|--------------|
| Daily notes, narrative, wikilinks | Deploy SHAs, file paths, verify commands |
| Decisions (why) | Decisions (what changed in code) |
| Personal / venture notes | Technical runbooks |

## Integrations

- **Granola** — meeting source; query via Cursor, persist to vault with Meeting-Capture template
- **Notion PPV** — weekly pipelines/metrics; Obsidian for daily, Notion for team-scale ops
- **Cursor** — agents read memory at start, write captures to vault when asked

## Templates

- `Templates/Daily.md`
- `Templates/Meeting-Capture.md`
- `Templates/Decision.md`
- `Templates/Ship-Log.md`
