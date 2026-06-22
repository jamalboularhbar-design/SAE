# Brand & logo

## Logo mark

- **Design:** Open book + circuit traces, gradient navy → cyan → purple
- **User asset:** Provided as PNG; light gray background in source file must be **removed** for web embed
- **Canonical file:** `apps/playbooks/client/public/logo-mark.png` (transparent)
- **DO NOT:** Hand-draw SVG approximations or AI-regenerate — user rejected these

## Assets

| File | Use |
|------|-----|
| `logo-mark.png` | Header, product nav, login, Nexus OS sidebar |
| `favicon-32.png` | Browser tab |
| `favicon.ico` | Legacy browsers |
| `apple-touch-icon.png` | iOS — dark `#0B1120` background (not transparent) |

## Component

`LogoMark.tsx` — sizes xs–xl, `bg-transparent`, src=`/logo-mark.png`

## Favicon links

In `client/index.html` and `apps/nexus-os/index.html`:
- `/favicon.ico`
- `/favicon-32.png`
- `/logo-mark.png`
- `/apple-touch-icon.png`

## Still TODO

- `og-image.png` — social share preview not yet updated with new logo

## Theme

- Site background: `#0B1120`
- theme-color meta: `#22d3ee`
