# Project: Nexus OS

## Purpose

Autonomous AI operating system — "Ask once. Your specialist team executes across Slack, Notion, Gmail and more."

## URLs (production)

- UI: https://argbuilder.io/os/
- API: https://argbuilder.io/os/api/status (live mode when healthy)
- Console, Heartbeat, Gateway, Approvals, etc. under `/os/`

## Source

- Monorepo: `apps/nexus-os/`
- Standalone: https://github.com/jamalboularhbar-design/nexus-os

## Build

- `NEXUS_OS_BASE=/os/` for production embed
- Vite `base` must match mount path
- Public assets: `apps/nexus-os/public/logo-mark.png`, favicons

## Features shipped

- Real execution on approval (Notion page create, Slack post)
- Follow-up in Console after approve
- Dark select/dropdown styling

## Sidebar

- Logo: `${import.meta.env.BASE_URL}logo-mark.png`
- `bg-transparent` on img — no white box
