# ARG Builder — External Deployment Guide

## What changed (5 files replaced)

| File | Change |
|------|--------|
| `server/_core/env.ts` | Replaced Manus Forge vars with `LLM_*`, `S3_*`, `IMAGE_*` |
| `server/_core/llm.ts` | Now points to any OpenAI-compatible endpoint (Google AI / OpenAI) |
| `server/_core/imageGeneration.ts` | Uses OpenAI DALL-E 3 directly |
| `server/storage.ts` | Uses AWS SDK directly (S3 or Cloudflare R2) |
| `server/_core/storageProxy.ts` | Route changed `/manus-storage/*` → `/storage/*` |
| `.env.example` | Updated with all new vars and setup instructions |

## Step 1 — Copy the files into your repo

Replace the 5 files above in your local clone of `agent-reference-guide`.

## Step 2 — Fix the one reference to /manus-storage in your frontend

Search your client code for `/manus-storage/` and update to `/storage/`:

```bash
grep -r "manus-storage" client/src/
```

Any hits: change `/manus-storage/` → `/storage/`

## Step 3 — Get your API keys

### Google AI (for LLM — free tier is generous)
1. Go to https://aistudio.google.com/apikey
2. Create an API key
3. Set `LLM_API_KEY=<your key>`

### Cloudflare R2 (for file storage — free 10 GB)
1. Go to https://dash.cloudflare.com → R2 → Create bucket
2. Go to R2 → Manage R2 API tokens → Create token (with read+write on your bucket)
3. Copy Account ID from R2 overview page
4. In bucket settings → enable Public Access → copy the public URL
5. Set all `S3_*` vars from `.env.example`

### OpenAI (for image generation — optional)
1. Go to https://platform.openai.com/api-keys
2. Create a key, set `IMAGE_API_KEY=sk-...`
3. Skip this if you don't use image generation

## Step 4 — Deploy to Railway (recommended)

The `railway.toml` is already configured. Steps:

1. Install Railway CLI: `npm install -g @railway/cli`
2. `railway login`
3. `railway init` (link to your project)
4. Add MySQL: Railway dashboard → New → Database → MySQL
5. Set env vars: Railway dashboard → Variables → paste from your `.env`
   - `DATABASE_URL` is auto-set by the MySQL plugin
6. `railway up` — deploys automatically

**Database maintenance (fix categories + cross-refs):** do **not** use the MySQL service console — it has no Node app or Railway CLI. Instead:

1. Log in as admin at https://argbuilder.io
2. Open **Admin → Cross-References** (`/admin/cross-references`)
3. Click **Run full maintenance**

Or from your machine (linked to the **ARG-Builder app service**, not MySQL):

```bash
railway link   # select ARG-Builder app, not MySQL
railway run npm run db:maintenance
```

Or connect your GitHub repo in the Railway dashboard for auto-deploy on push.

## Step 5 — Optional cleanup

Remove Manus-only items that have zero effect on production but are dead weight:

```bash
# Remove Manus debug tooling from vite.config.ts
# Delete the vitePluginManusDebugCollector() function and its usage in plugins[]

# Remove unused package
pnpm remove vite-plugin-manus-runtime

# Update allowed dev server hosts in vite.config.ts
# Add your domain, remove .manus.computer etc.
```

## Verify it works

```bash
pnpm install
pnpm run build          # should compile with 0 errors
pnpm run db:push        # run migrations against your DB
pnpm start              # start production server
```

Hit `http://localhost:3000` — you should see ARG Builder, login with your ADMIN_EMAIL/ADMIN_PASSWORD.

## Environment variables quick-reference

| Var | Required | Description |
|-----|----------|-------------|
| `DATABASE_URL` | ✅ | MySQL connection string (on Railway: `${{MySQL.MYSQL_URL}}`) |
| `MYSQL_URL` | — | Railway MySQL plugin URL (fallback if `DATABASE_URL` unset) |
| `JWT_SECRET` | ✅ | Session signing secret (32+ chars) |
| `ADMIN_EMAIL` | ✅ | Login email |
| `ADMIN_PASSWORD` | ✅ | Login password |
| `LLM_API_KEY` | ✅ | Google AI or OpenAI key |
| `LLM_API_URL` | ✅ | API endpoint (see .env.example) |
| `LLM_MODEL` | ✅ | Model name (gemini-2.5-flash or gpt-4o-mini) |
| `S3_BUCKET` | ✅ | Bucket name |
| `S3_ACCESS_KEY_ID` | ✅ | R2/S3 access key |
| `S3_SECRET_ACCESS_KEY` | ✅ | R2/S3 secret |
| `S3_ENDPOINT` | R2 only | R2 endpoint URL |
| `S3_PUBLIC_URL` | recommended | Public CDN URL for files |
| `IMAGE_API_KEY` | optional | OpenAI key for DALL-E |
| `STRIPE_SECRET_KEY` | optional | Enables billing features |
