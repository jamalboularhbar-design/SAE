# Project: Playbooks

## Stack

- React + Vite + wouter (client-side routing)
- Express server, tRPC API
- Drizzle ORM, dark theme default

## Key routes

| Route | Component | Notes |
|-------|-----------|-------|
| `/` | Home | Header with LogoMark; requires auth context |
| `/login` | LoginPage | "Open Nexus OS →" link |
| `/product` | LandingPage | Marketing; Nexus OS button in nav |
| `/ai` | AIHubPage | Intelligence Hub |
| `/os` | **NOT IN SPA** | Must full-page navigate to `/os/` |

## Navigation rule

Nexus OS is a **separate mount**. Never use wouter `navigate('/os')` or `<Link href="/os">` — use `window.location.href = '/os/'` or `<a href="/os/">`.

Router safety net in `App.tsx`: any `/os*` client route triggers `window.location.replace`.

## Logo

- Component: `client/src/components/LogoMark.tsx`
- Asset: `/logo-mark.png` (transparent PNG)
