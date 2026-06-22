# Logo fix

**Status:** Fixed 2026-06-22  
**Commit:** `3e6f75d`

## Root cause

Logo was crushed by flex layout — `min-w-0` on brand container + default `md` (32px) size.

## Fix

- `LogoMark`: shrink-0 wrapper, `min-h/min-w`, `nav` size (44px), `BASE_URL` path
- `MarketingNav`: `size="nav"`, `min-w-0` only on text block
- Footer: stacked layout, `size="md"`

## Verify

```bash
curl -sI https://argbuilder.io/logo-mark.png | grep HTTP
```
