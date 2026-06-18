# SAE — Sovereign Automation Engine

**NexusAI** product suite for operational intelligence, AI-powered documentation, and multi-brand knowledge management.

## Products

| Product | Codename | Status | Description |
|---------|----------|--------|-------------|
| **NexusAI Playbooks** | ARG Builder | Beta | Multi-brand operational reference guides for agencies and service businesses |
| **NexusAI Templates** | — | Planned | Curated operational playbook templates (Notion, Markdown, hosted) |
| **NexusAI Ops Core** | — | Planned | Open-source self-hosted documentation engine |

## Repository Structure

```
sae/
├── apps/
│   └── playbooks/          # ARG Builder → NexusAI Playbooks (import from GitHub)
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
- [Three-Path Flywheel](./docs/product/flywheel.md)

## Getting Started

> **Next step:** Import the ARG Builder codebase into `apps/playbooks/` once GitHub access is granted.

```bash
git clone https://github.com/jamalboularhbar-design/sae.git
cd sae
# After playbooks repo is linked:
# cd apps/playbooks && npm install && npm run dev
```

## License

- **NexusAI Playbooks (SaaS):** Proprietary
- **NexusAI Ops Core:** MIT (planned open-source release)
