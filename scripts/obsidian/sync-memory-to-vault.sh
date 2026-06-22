#!/usr/bin/env bash
# Sync Cursor agent memory → Obsidian vault (one-way mirror for browsing in graph).
# Run after significant agent sessions or before daily review.
#
#   ./scripts/obsidian/sync-memory-to-vault.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
MEMORY_SRC="$ROOT/.cursor/arg-builder-memory/memory"
VAULT_DST="$ROOT/obsidian-vault/04-Resources/Memory"

mkdir -p "$VAULT_DST"

echo ">>> Syncing agent memory → Obsidian vault"
echo "    From: $MEMORY_SRC"
echo "    To:   $VAULT_DST"

count=0
for src in "$MEMORY_SRC"/*.md; do
  [ -f "$src" ] || continue
  base="$(basename "$src")"
  dst="$VAULT_DST/$base"

  # Skip if unchanged
  if [ -f "$dst" ] && cmp -s "$src" "$dst" 2>/dev/null; then
    continue
  fi

  # Add Obsidian frontmatter if missing (agent memory uses YAML already)
  cp "$src" "$dst"
  count=$((count + 1))
  echo "    ✓ $base"
done

# Ensure index note exists with wikilinks
INDEX="$VAULT_DST/MEMORY.md"
if [ -f "$INDEX" ]; then
  echo ">>> Memory index at obsidian-vault/04-Resources/Memory/MEMORY.md"
fi

echo ">>> Done. $count file(s) updated."
echo ">>> Open Obsidian → graph view to explore links."
