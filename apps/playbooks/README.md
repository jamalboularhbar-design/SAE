# NexusAI Playbooks

> **NexusAI Playbooks** — Multi-brand operational documentation platform.
> Part of the [NexusAI / SAE](../../README.md) product suite.

**Upstream:** [jamalboularhbar-design/agent-reference-guide](https://github.com/jamalboularhbar-design/agent-reference-guide)

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Tailwind CSS 4 + shadcn/ui |
| Backend | Express 4 + tRPC 11 |
| Database | MySQL + Drizzle ORM (109 tables) |
| Auth | JWT sessions + TOTP 2FA |
| AI | OpenAI-compatible LLM (Gemini default) |
| Payments | Stripe (3-tier subscriptions) |
| Storage | S3-compatible (Cloudflare R2) |

## What's Already Built

This codebase is **far more complete** than a typical MVP:

- 525 seeded documents, 170 pages, 132 tRPC routers
- Multi-workspace support (Batch 22)
- 10 AI services (summarize, writer, semantic search, chat, etc.)
- Enterprise admin (SSO/SAML, audit trail, white-label, webhooks)
- Stripe billing, Close CRM integration, lead nurturing
- 364 passing tests

## NexusAI Rebrand Status

- [x] Central brand config (`shared/brand.ts`)
- [x] Header, Footer, Login, SEO updated
- [x] Category dropdown bug fixed (AdminEditor)
- [ ] Remaining ARG Builder references (~40 client files, server emails)
- [ ] Generic demo workspaces (replace Riad & Routes / ArtKech)
- [ ] nexusai.io domain configuration

## Setup

```bash
cd apps/playbooks
cp .env.example .env.local
# Configure DATABASE_URL, JWT_SECRET, LLM_API_KEY
pnpm install
pnpm dev
```

## Scripts

```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm test         # Run 364 tests
pnpm db:push      # Run Drizzle migrations
```

## License

MIT (inherited from upstream agent-reference-guide)
