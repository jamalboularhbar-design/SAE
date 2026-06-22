# Feedback: Corrections (learn from past mistakes)

## Logo (2026-06-22)

- **Wrong:** Hand-drawn SVG + AI-generated PNG that didn't match user's book+circuit mark
- **Wrong:** Leaving light gray/white background in PNG → white box on dark site
- **Right:** User's exact PNG; remove neutral background (brightness >175, low saturation); `bg-transparent` on img
- **User quote:** "That is the logo… why it is showing the white background"

## Nexus OS navigation (2026-06-22)

- **Wrong:** `navigate('/os')` and `<Link href="/os">` → Playbooks 404
- **Right:** `window.location.href = '/os/'`, `<a href="/os/">`, router escape in App.tsx
- **User quote:** "getting to NexusOS from home page or product page is not working, returns 404"

## Deploy (earlier)

- **Wrong:** deploy/production without vendored nexus-os → `/os` 404 in production
- **Right:** sync script copies nexus-os; verify `/os/api/status` after every deploy

## General

- User says "check again" / "not working" → verify production with curl + browser, don't assume fix merged
- User provides memory bundle path on Windows → store in repo `.cursor/arg-builder-memory/` for cloud agents
