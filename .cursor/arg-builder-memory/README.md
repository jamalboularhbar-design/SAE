# ARG-Builder agent memory

**Canonical memory store** for Cursor Cloud Agents and local sessions.

## Start here

1. [memory/MEMORY.md](./memory/MEMORY.md) — index
2. **[Skill: arg-builder](../skills/arg-builder/SKILL.md)** — operational runbook (deploy, UI, graph, logo, verify)
3. **[Skill: obsidian-second-brain](../skills/obsidian-second-brain/SKILL.md)** — daily second brain workflow
4. [obsidian-vault/README.md](../../obsidian-vault/README.md) — open as Obsidian vault
5. [SESSION-INVENTORY.md](./SESSION-INVENTORY.md) — skills, tools, PRs through 2026-06-22 audit session
6. [memory/cloud_agent_updates.md](./memory/cloud_agent_updates.md) — latest cloud-agent work

## Structure

```
.cursor/
├── skills/
│   ├── arg-builder/SKILL.md         ← deploy/UI/graph
│   └── obsidian-second-brain/SKILL.md ← daily workflow
├── arg-builder-memory/
│   └── memory/
obsidian-vault/                      ← open in Obsidian app
scripts/obsidian/sync-memory-to-vault.sh
```

## Rules for agents

- Read `MEMORY.md` + `skills/arg-builder/SKILL.md` first every session
- Brand/naming changes → see `feedback_brand_decisions.md`
- Communication → `feedback_communication_style.md`, `feedback_judgment_over_survey.md`
- Deploy state → `project_deploy_state.md` + `cloud_agent_updates.md`
- **After every ship:** update memory + skill — see `feedback_agent_memory.md`
