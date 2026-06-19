# Template Marketplace Setup (Phase 1)

## 1. Export bundles locally

```bash
cd apps/playbooks
pnpm templates:export
```

Output: `dist/template-bundles/*.zip` — one zip per bundle with Markdown + README + manifest.

| Bundle | Source |
|--------|--------|
| Starter Pack | 50 general GTM/ops docs (excludes RR/AK vertical) |
| Agency Pack | Up to 100 agency/sales/GTM docs |
| Travel Ops Pack | All `ARG-Builder-RR-*` curated docs |
| Creative Studio Pack | All `ARG-Builder-AK-*` curated docs |
| Complete Library | Full 82-doc curated set |

## 2. Create Gumroad products (manual — ~45 min)

Gumroad has no API in this repo. You create each listing in the Gumroad UI once.

**Fast path:**

```bash
pnpm templates:export          # zips
pnpm templates:gumroad-copy    # paste-ready titles, descriptions, env var names
```

See **[gumroad-listings.md](./gumroad-listings.md)** for the full checklist and honest doc counts.

Per product on Gumroad:

1. [gumroad.com](https://gumroad.com) → **New product**
2. Upload `{id}.zip` from `dist/template-bundles/`
3. Paste name + description from `pnpm templates:gumroad-copy`
4. Set price → **Publish** → copy checkout URL

## 3. Wire checkout URLs

Add to `apps/playbooks/.env` (and Railway production env):

```bash
GUMROAD_URL_STARTER=https://yourname.gumroad.com/l/starter-pack
GUMROAD_URL_AGENCY=https://yourname.gumroad.com/l/agency-pack
GUMROAD_URL_TRAVEL_OPS=https://yourname.gumroad.com/l/travel-ops
GUMROAD_URL_CREATIVE_STUDIO=https://yourname.gumroad.com/l/creative-studio
GUMROAD_URL_COMPLETE=https://yourname.gumroad.com/l/complete-library
GUMROAD_URL_TEMPLATE_CLUB=https://yourname.gumroad.com/l/template-club
```

When any URL is set, `/product/templates` shows **Buy now** instead of waitlist.

## 4. Waitlist (until live)

Leads flow to `leads` table via `trpc.leads.submit`:

- `source=template_waitlist` — per-bundle interest
- `source=product_waitlist` — `/product` hero capture

View in **Admin → Lead Management** or Notion Sales Pipeline sync.

## 5. Flywheel copy

Every bundle README includes Playbooks trial CTA with UTM tags. Bundle credit messaging matches `shared/templateBundles.ts`.
