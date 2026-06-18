#!/usr/bin/env bash
# Creates branch deploy/production with apps/playbooks at repo root (for Railway).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PLAYBOOKS="$ROOT/apps/playbooks"
WORK="$ROOT/.deploy-branch-work"
MAIN_SHA="$(git rev-parse main)"

rm -rf "$WORK"
mkdir -p "$WORK"
cp -a "$PLAYBOOKS/." "$WORK/"

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
