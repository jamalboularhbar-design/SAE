# Railway Deployment — NexusAI Playbooks

## What triggers deploy

Railway watches **`jamalboularhbar-design/agent-reference-guide`** (`main` branch).

The NexusAI rebrand lives in **SAE** at `apps/playbooks/`. Sync to production repo before deploy.

## Option A — One-command sync (recommended)

From your machine (with push access to `agent-reference-guide`):

```bash
git clone https://github.com/jamalboularhbar-design/SAE.git
cd SAE
chmod +x scripts/sync-to-production-repo.sh
./scripts/sync-to-production-repo.sh
```

This clones `agent-reference-guide`, copies `apps/playbooks/`, runs `pnpm check && pnpm build`, commits, and pushes to `main`.

## Option B — Manual sync

```bash
git clone https://github.com/jamalboularhbar-design/agent-reference-guide.git
cd agent-reference-guide

# Copy from your SAE checkout
rsync -a --exclude node_modules --exclude dist --exclude .git --exclude .manus \
  ../SAE/apps/playbooks/ .

pnpm install && pnpm check && pnpm build
git add -A
git commit -m "feat: NexusAI rebrand and Intelligence Hub surfacing"
git push origin main
```

## Option C — Point Railway at SAE (future)

In Railway dashboard → Service → Settings:

| Setting | Value |
|---------|-------|
| Repository | `jamalboularhbar-design/SAE` |
| Root directory | `apps/playbooks` |
| Branch | `main` |

Build/start commands are in `apps/playbooks/railway.toml`.

## Required environment variables

Set in Railway → Variables (copy from `.env.example`):

| Variable | Required |
|----------|----------|
| `DATABASE_URL` | ✅ (MySQL plugin auto-sets) |
| `JWT_SECRET` | ✅ |
| `ADMIN_EMAIL` | ✅ |
| `ADMIN_PASSWORD` | ✅ |
| `LLM_API_KEY` | ✅ |
| `LLM_API_URL` | ✅ |
| `LLM_MODEL` | ✅ |
| `S3_*` | ✅ for file uploads |
| `STRIPE_*` | optional |

## Verify after deploy

1. `https://argbuilder.io/product` — NexusAI branding, Intelligence section, comparison table
2. `https://argbuilder.io/ai` — NexusAI Intelligence Hub
3. Header — purple **Intelligence** button on all app pages

## Custom domain (Phase 3)

Railway → Settings → Domains → add `app.nexusai.ma` when DNS is ready.
