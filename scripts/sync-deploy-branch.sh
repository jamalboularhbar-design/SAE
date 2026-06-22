#!/usr/bin/env bash
# Creates branch deploy/production with apps/playbooks at repo root (for Railway).
# Also vendors apps/nexus-os at ./nexus-os so the playbooks build:nexus-os step
# resolves to a sibling source directory inside the Railway build container.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PLAYBOOKS="$ROOT/apps/playbooks"
NEXUS_OS="$ROOT/apps/nexus-os"
WORK="$ROOT/.deploy-branch-work"
MAIN_SHA="$(git rev-parse main)"

rm -rf "$WORK"
mkdir -p "$WORK"
cp -a "$PLAYBOOKS/." "$WORK/"

# Vendor apps/nexus-os into the deploy branch so `cd ./nexus-os` resolves on
# Railway. Exclude transient/local-only dirs.
if [ -d "$NEXUS_OS" ]; then
  mkdir -p "$WORK/nexus-os"
  rsync -a \
    --exclude='node_modules' \
    --exclude='.data' \
    --exclude='dist' \
    --exclude='.git' \
    "$NEXUS_OS/" "$WORK/nexus-os/"
fi

cd "$ROOT"
git config user.name "github-actions[bot]"
git config user.email "github-actions[bot]@users.noreply.github.com"

git checkout --orphan deploy/production-new
git rm -rf . 2>/dev/null || true

cp -a "$WORK/." .
rm -rf .deploy-branch-work

git add -A
git commit -m "deploy: sync from main ${MAIN_SHA:0:7}"

git branch -M deploy/production
