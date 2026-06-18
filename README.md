# SAE — Sovereign Automation Engine

**NexusAI** product suite for operational intelligence, AI-powered documentation, and multi-brand knowledge management.

## Products

| Product | Codename | Status | Description |
|---------|----------|--------|-------------|
| **NexusAI Playbooks** | agent-reference-guide | ✅ Imported | Multi-brand operational reference guides — [apps/playbooks](./apps/playbooks/) |
| **NexusAI Templates** | — | Planned | Curated operational playbook templates (Notion, Markdown, hosted) |
| **NexusAI Ops Core** | — | Planned | Open-source self-hosted documentation engine |

## Repository Structure

```
sae/
├── apps/
│   └── playbooks/          # NexusAI Playbooks (imported from agent-reference-guide)
├── packages/
│   ├── core/               # Shared types, auth, multi-tenancy
│   ├── ai/                 # AI writing, search, Q&A
│   └── templates/          # Template marketplace content
├── docs/
│   ├── product/            # Strategy, positioning, pricing
│   └── roadmap/            # Implementation plans
└── open-source/            # OSS core (Phase 3)
```

## Quick Links

- [Unified Product Strategy](./docs/product/nexusai-playbooks-strategy.md)
- [Brand Positioning](./docs/product/positioning.md)
- [Pricing Model](./docs/product/pricing.md)
- [90-Day Roadmap](./docs/roadmap/90-day-plan.md)
- [Codebase Audit](./docs/product/codebase-audit.md)
- [Three-Path Flywheel](./docs/product/flywheel.md)

## Getting Started

```bash
git clone https://github.com/jamalboularhbar-design/SAE.git
cd SAE/apps/playbooks
cp .env.example .env.local
pnpm install
pnpm dev
```

## License

- **NexusAI Playbooks (SaaS):** Proprietary
- **NexusAI Ops Core:** MIT (planned open-source release)
