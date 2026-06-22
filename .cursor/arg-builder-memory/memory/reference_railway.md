# Reference: Railway deployment

## Setup

- Hosts argbuilder.io production
- Watches `deploy/production` branch on SAE repo
- Express server serves Playbooks static + Nexus OS mount

## Environment

- See `.env.example` in playbooks for required vars
- Nexus OS: Gemini model, Notion/Slack tokens in nexus-os config

## Known issues

- Auto-redeploy workflow needs GitHub secrets:
  - `RAILWAY_TOKEN`
  - `RAILWAY_SERVICE_ID`
  - `RAILWAY_ENVIRONMENT_ID` (optional)
- Manual redeploy from Railway dashboard if push doesn't trigger

## Build gotcha

```json
"build": "(pnpm build:nexus-os || echo 'continuing') && vite build ..."
```

If `build:nexus-os` fails, deploy continues **without** `/os` — always verify `/os/api/status` after deploy.

## Headers

Responses include `x-railway-request-id`, Cloudflare in front.
