---
name: feedback-agent-memory
description: Jamal wants session knowledge persisted as skills + memory — agents forget too much between runs.
metadata:
  node_type: memory
  type: feedback
---

**Rule (2026-06-22):** Turn operational knowledge into **skills** and **memory** — don't rely on conversation context alone.

**Why:** Agents repeatedly forgot deploy pipeline, logo asset paths, light-mode patterns, knowledge graph architecture, and "merge ≠ live" verification. Jamal had to re-explain.

**How to apply:**

1. **Every session:** read `.cursor/arg-builder-memory/memory/MEMORY.md` before coding
2. **Every ship:** update `cloud_agent_updates.md` + `project_deploy_state.md`
3. **Every recurring workflow:** encode in `.cursor/skills/arg-builder/SKILL.md`
4. **Never ask Jamal to verify production** — curl/probe yourself
5. **Never assume merged PR = deployed** — check `deploy/production` SHA + live bundle

**Skill location:** `.cursor/skills/arg-builder/SKILL.md` (repo-root, version-controlled)
