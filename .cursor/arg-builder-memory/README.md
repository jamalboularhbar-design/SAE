# ARG-Builder agent memory

**Canonical memory store** for Cursor Cloud Agents and local sessions.

## Start here

1. [memory/MEMORY.md](./memory/MEMORY.md) — index
2. **[Skill: arg-builder](../skills/arg-builder/SKILL.md)** — operational runbook (deploy, UI, graph, logo, verify)
3. [SESSION-INVENTORY.md](./SESSION-INVENTORY.md) — skills, tools, PRs through 2026-06-22 audit session
4. [memory/cloud_agent_updates.md](./memory/cloud_agent_updates.md) — latest cloud-agent work

## Structure

```
.cursor/
├── skills/arg-builder/SKILL.md    ← READ THIS for deploy/UI/graph workflows
└── arg-builder-memory/
    ├── SESSION-INVENTORY.md
    └── memory/
        ├── MEMORY.md
        ├── user_jamal_*.md          (3)
        ├── project_*.md               (7)
        ├── reference_*.md             (5)
        ├── feedback_*.md              (4)
        └── cloud_agent_updates.md
```

## Rules for agents

- Read `MEMORY.md` + `skills/arg-builder/SKILL.md` first every session
- Brand/naming changes → see `feedback_brand_decisions.md`
- Communication → `feedback_communication_style.md`, `feedback_judgment_over_survey.md`
- Deploy state → `project_deploy_state.md` + `cloud_agent_updates.md`
- **After every ship:** update memory + skill — see `feedback_agent_memory.md`
