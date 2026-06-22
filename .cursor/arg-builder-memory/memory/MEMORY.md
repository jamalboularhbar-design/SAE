# ARG-Builder Agent Memory — Index

**Start here.** This folder is the persistent memory store for Cloud Agent / Cursor sessions on ARG-Builder.

## Source

- **Local bundle (user):** `C:\Users\G-shop\Downloads\arg-builder-memory-2026-06-22\`
- **Repo copy (agents):** `.cursor/arg-builder-memory/` in SAE monorepo
- **Last sync:** 2026-06-22

## File map

### About the user (`user_*.md`)

| File | Contents |
|------|----------|
| [user_profile.md](./user_profile.md) | Identity, environment, GitLab |
| [user_goals.md](./user_goals.md) | What they're building and why |
| [user_tools.md](./user_tools.md) | Connected services, local paths |

### About the project (`project_*.md`)

| File | Contents |
|------|----------|
| [project_arg_builder.md](./project_arg_builder.md) | Product definition, brand decision |
| [project_playbooks.md](./project_playbooks.md) | Playbooks app, routes, stack |
| [project_nexus_os.md](./project_nexus_os.md) | Nexus OS runtime, `/os` mount |
| [project_integration.md](./project_integration.md) | How Playbooks + Nexus OS connect |
| [project_deploy.md](./project_deploy.md) | Railway, deploy branch, Docker |
| [project_brand.md](./project_brand.md) | Logo, favicon, naming |
| [project_launch_audit.md](./project_launch_audit.md) | argbuilder.io launch gaps |

### Reference (`reference_*.md`)

| File | Contents |
|------|----------|
| [reference_repos.md](./reference_repos.md) | GitHub repos and branches |
| [reference_railway.md](./reference_railway.md) | Deploy pipeline, env |
| [reference_brand_collision.md](./reference_brand_collision.md) | Why ARG-Builder not NexusAI |
| [reference_workspace.md](./reference_workspace.md) | Monorepo layout |

### Feedback (`feedback_*.md`)

| File | Contents |
|------|----------|
| [feedback_communication.md](./feedback_communication.md) | How to write responses |
| [feedback_implementation.md](./feedback_implementation.md) | Code style, scope |
| [feedback_corrections.md](./feedback_corrections.md) | Past mistakes to avoid |

### Session

| File | Contents |
|------|----------|
| [../SESSION-INVENTORY.md](../SESSION-INVENTORY.md) | PRs, skills, open items |

## Quick facts

- **Brand:** ARG-Builder (not NexusAI parent — Morocco factory collision)
- **Two products:** Playbooks (library) + Nexus OS (runtime at `/os`)
- **Logo:** User-provided book+circuit gradient PNG — **never redraw**; use transparent `logo-mark.png`
- **Nav bug pattern:** `/os` is NOT a Playbooks SPA route — always full-page `window.location` or `<a href="/os/">`
