# User profile

## Identity

- **Windows user path:** `C:\Users\G-shop\`
- **GitLab username:** Ask before API calls that reference "me" / "my" (per GitLab workflow rule)
- **Email domains in app:** admin@argbuilder.io, hello@argbuilder.io

## Environment

- Develops on Windows locally; Cloud Agent runs on Linux VM
- Downloads folder used for exports: `C:\Users\G-shop\Downloads\`
- Memory bundle exported: `arg-builder-memory-2026-06-22\`

## Working relationship

- Expects agents to **run commands and verify** — not hand-wave or ask user to check
- Uses Cursor Cloud Agents for GitHub/GitLab PRs and deploy fixes
- Conventional commits; reference GitLab issues with `#<number>` when known
