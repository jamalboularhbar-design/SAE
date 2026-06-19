# Gumroad Listings — Manual Setup Kit

Gumroad listing creation is **manual** (no API). This doc + `pnpm templates:gumroad-copy` gives you everything to paste.

**Actual doc counts** (from last export — use these on Gumroad, not the marketing round numbers):

| Product | Price | Zip file | Docs |
|---------|-------|----------|------|
| Starter Pack | $49 | `starter.zip` | 50 |
| Agency Pack | $99 | `agency.zip` | 70 |
| Travel Ops Pack | $149 | `travel-ops.zip` | 17 |
| Creative Studio Pack | $149 | `creative-studio.zip` | 17 |
| Complete Library | $199 | `complete.zip` | 82 |
| Template Club (optional) | $29/mo | — | subscription |

---

## One-session checklist (~45 min)

1. `cd apps/playbooks && pnpm templates:export`
2. Gumroad → connect payouts (Stripe/PayPal)
3. Create **5 products** (order: Starter → Agency → Travel → Creative → Complete)
4. For each: upload zip → paste copy from `pnpm templates:gumroad-copy` → publish
5. Copy each product URL into Railway env (see below)
6. Redeploy → check https://argbuilder.io/product/templates for **Buy now**

---

## Env vars (after publish)

```bash
GUMROAD_URL_STARTER=https://YOU.gumroad.com/l/nexusai-starter-pack
GUMROAD_URL_AGENCY=https://YOU.gumroad.com/l/nexusai-agency-pack
GUMROAD_URL_TRAVEL_OPS=https://YOU.gumroad.com/l/nexusai-travel-ops
GUMROAD_URL_CREATIVE_STUDIO=https://YOU.gumroad.com/l/nexusai-creative-studio
GUMROAD_URL_COMPLETE=https://YOU.gumroad.com/l/nexusai-complete-library
GUMROAD_URL_TEMPLATE_CLUB=https://YOU.gumroad.com/l/nexusai-template-club
```

You can ship **Starter + Agency first** — the site shows Buy now for any bundle that has a URL; others stay on waitlist.

---

## Gumroad settings (all products)

- **Type:** Digital product
- **Currency:** USD
- **Tags:** templates, SOP, operations, notion
- **Thumbnail:** 1280×720 — reuse `/og-image.png` or NX logo on teal gradient
- **Email receipt:** Gumroad default is fine; README inside zip has Playbooks CTA

---

## What automation we *do* have

| Automated | Manual (you) |
|-----------|----------------|
| Zip export from docs-seed | Create Gumroad products |
| Buy now buttons when URLs in env | Cover art (optional polish) |
| Waitlist until URLs set | Payout account setup |
| README + manifest in each zip | Template Club subscription product |

---

Run `pnpm templates:gumroad-copy` anytime exports change — it regenerates descriptions with current doc counts.
