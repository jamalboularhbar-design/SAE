# ARG-Builder — Map of Content

## Thesis

Autonomous Capacity — the playbook and the runtime that runs it.

- Playbooks → library at argbuilder.io
- Nexus OS → runtime at argbuilder.io/os

## Active projects

- [[02-Projects/ARG-Builder/Knowledge-Graph|Knowledge Graph (Rovo UI)]]
- [[02-Projects/ARG-Builder/Logo-Fix|Logo fix (open)]]
- Founding cohort — 10 seats, $290/yr

## Deploy

Production: **argbuilder.io** via SAE `deploy/production` → Railway.

```bash
# Verify live after any ship
curl -sI https://argbuilder.io/logo-mark.png | grep HTTP
curl -s https://argbuilder.io/product | grep '<title>'
```

Full runbook: repo `.cursor/skills/arg-builder/SKILL.md`

## Agent memory (synced)

- [[04-Resources/Memory/MEMORY|Memory index]]
- [[04-Resources/Memory/project-deploy-state|Deploy state]]
- [[04-Resources/Memory/cloud-agent-updates|Latest agent updates]]

Run sync: `./scripts/obsidian/sync-memory-to-vault.sh`

## Links

- Product: https://argbuilder.io/product
- Graph: https://argbuilder.io/graph
- Nexus OS: https://argbuilder.io/os/
