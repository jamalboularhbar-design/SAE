# Reference: Workspace layout

## Monorepo (main branch)

```
/workspace/
├── apps/
│   ├── playbooks/          # ARG-Builder Playbooks
│   │   ├── client/         # React frontend
│   │   ├── server/         # Express + tRPC
│   │   └── shared/         # brand.ts, types
│   └── nexus-os/           # Nexus OS
│       ├── client/
│       ├── server/
│       └── public/         # logo, favicons
├── scripts/
│   └── sync-deploy-branch.sh
└── .cursor/
    └── arg-builder-memory/ # This memory store
```

## Deploy branch (flat)

When on `deploy/production`, repo root **is** playbooks — paths like `client/`, `server/` at root; `nexus-os/` sibling.

## Agent tip

Check `git branch --show-current` before editing paths:
- **main:** `apps/playbooks/client/...`
- **deploy/production:** `client/...`

## Package manager

pnpm workspaces; playbooks builds nexus-os via `build:nexus-os` script resolving `../nexus-os` or `./nexus-os`.
