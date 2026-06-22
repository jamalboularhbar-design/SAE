# ARG-Builder agent memory

Persistent context for Cursor Cloud Agents and local sessions.

## Start here

1. [memory/MEMORY.md](./memory/MEMORY.md) — index
2. [SESSION-INVENTORY.md](./SESSION-INVENTORY.md) — PRs, open items, skills

## Sync from your local export

Your canonical export lives at:

```
C:\Users\G-shop\Downloads\arg-builder-memory-2026-06-22\
```

To update the repo copy after editing locally:

```powershell
# From Windows — copy into SAE monorepo
xcopy /E /Y "C:\Users\G-shop\Downloads\arg-builder-memory-2026-06-22\*" ".\.cursor\arg-builder-memory\"
```

Or copy individual `memory/*.md` files and `SESSION-INVENTORY.md`.

## Repo copy

Committed to git so cloud agents read it on clone. Last agent sync: **2026-06-22**.
