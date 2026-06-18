#!/usr/bin/env bash
# Sync NexusAI Playbooks changes from SAE → agent-reference-guide and push.
# Run locally (requires push access to agent-reference-guide):
#
#   ./scripts/sync-to-production-repo.sh
#
# Railway auto-deploys on push to agent-reference-guide main.

set -euo pipefail

SAE_PLAYBOOKS="${SAE_PLAYBOOKS:-$(cd "$(dirname "$0")/../apps/playbooks" && pwd)}"
PROD_REPO="${PROD_REPO:-agent-reference-guide}"
PROD_DIR="${PROD_DIR:-/tmp/${PROD_REPO}-sync}"

echo ">>> Cloning ${PROD_REPO}..."
rm -rf "$PROD_DIR"
git clone "https://github.com/jamalboularhbar-design/${PROD_REPO}.git" "$PROD_DIR"

echo ">>> Syncing from ${SAE_PLAYBOOKS}..."
cd "$SAE_PLAYBOOKS"
tar cf - \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.git' \
  --exclude='.manus' \
  . | tar xf - -C "$PROD_DIR"

cd "$PROD_DIR"
echo ">>> Changed files:"
git status --short

echo ">>> Building..."
corepack enable 2>/dev/null || true
pnpm install
pnpm check
pnpm build

read -r -p "Commit and push to main? [y/N] " confirm
if [[ "${confirm,,}" != "y" ]]; then
  echo "Aborted. Changes remain in ${PROD_DIR}"
  exit 0
fi

git add -A
git commit -m "feat: NexusAI rebrand, product page, and Intelligence Hub surfacing"
git push origin main

echo ">>> Done. Railway should auto-deploy from main within ~2-5 minutes."
echo ">>> Verify: https://argbuilder.io/product"
