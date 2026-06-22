# Obsidian Second Brain Vault

Git-synced Obsidian vault for Jamal's daily workflow — paired with Cursor agent memory, Granola, and Notion PPV.

## Quick start

1. **Obsidian** → Open folder as vault → this directory
2. Open [[Home]]
3. `Cmd/Ctrl+P` → **Open today's daily note**

## Sync agent memory

```bash
./scripts/obsidian/sync-memory-to-vault.sh
```

Copies `.cursor/arg-builder-memory/memory/*.md` → `04-Resources/Memory/`

## Docs

- [[04-Resources/Daily-Workflow|Daily Workflow]]
- Skill: `.cursor/skills/obsidian-second-brain/SKILL.md`
- Agent skill: `.cursor/skills/arg-builder/SKILL.md`

## Folders

| Folder | Purpose |
|--------|---------|
| `00-Inbox` | Quick capture |
| `01-Daily` | Daily notes |
| `02-Projects` | Active projects |
| `03-Areas` | Ongoing areas (ventures) |
| `04-Resources` | Reference + synced memory |
| `MOCs` | Maps of content |
| `Templates` | Note templates |

Do not commit Obsidian workspace cache — `.obsidian/workspace.json` is gitignored.
