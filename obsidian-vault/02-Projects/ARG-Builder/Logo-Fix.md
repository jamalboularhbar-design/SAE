# Logo fix

**Status:** Open  
**Reported:** 2026-06-22 — "logo crushed again" on `/product`

## Symptoms

- Broken or squashed logo in MarketingNav header + footer
- Asset: `apps/playbooks/client/public/logo-mark.png`

## Fix plan

- [ ] `LogoMark size="lg"` in MarketingNav
- [ ] Verify PNG on `deploy/production` after sync
- [ ] `curl -sI https://argbuilder.io/logo-mark.png` → 200

## Links

- [[MOCs/ARG-Builder]]
- Skill: `.cursor/skills/arg-builder/SKILL.md` → Logo rules
