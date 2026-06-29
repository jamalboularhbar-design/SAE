# Automotive Morocco — Phase 0 Discovery Guide

**Status:** Active (do this before any automotive build)  
**Owner:** Jamal  
**Gate:** 8–10 conversations → scorecard → Kill / Modify / Double down  
**Binding verdict:** [roundtable-verdict-automotive-expansion.md](./roundtable-verdict-automotive-expansion.md)

---

## Why this exists

The cross-model roundtable (Grok + Perplexity + Claude orchestrator) concluded **Modify (lean skeptical)** on automotive expansion. Platform capability is not the blocker — **credibility and reference transfer** are.

Do not ship automotive playbooks, calculators, or Railway routes until Phase 0 conversations complete.

---

## Who to talk to (8–10 targets)

Pick a mix — not all plant managers:

| Tier | Who | Why |
|------|-----|-----|
| A | Plant / Site Director, Ops Director (Lear, Adient, Nexteer, Aptiv, TE Connectivity — Morocco sites) | Budget and pain authority |
| B | HR Director, Training Manager, Continuous Improvement Lead | Onboarding / attrition / knowledge-loss pain |
| C | AMICA or industrial consultant, ex-plant director | Faster honesty, intro paths |

**Sources:** LinkedIn (Morocco filter), AMICA/GIMAS posts, Kenitra AFZ network, warm intros.

---

## Conversation script (20–30 min)

### Opener (2 min)

> Je travaille sur un outil de playbooks opérationnels + runtime IA pour équipes multi-sites. Je ne vends rien aujourd’hui — je veux comprendre si le problème existe chez vous et ce qu’il faudrait pour que ce soit crédible.

English variant if needed:

> I'm exploring operational playbook + AI runtime tools for multi-site teams. Not selling today — I want to understand whether the problem is real for you and what would make a vendor trustworthy enough to use on a real line.

### Core questions (15 min)

1. **Pain:** Where does operational knowledge break today — attrition, onboarding, audits, shift handover, quality?
2. **Current fix:** Confluence, SharePoint, paper, Excel, internal LMS, nothing structured?
3. **Willingness to pay:** Would you pay for playbooks + a runtime that teams actually use? What budget bucket (tool vs training vs consulting)?
4. **Trust gate:** What would make you trust a platform with **no automotive reference** — pilot scope, sponsor, language (FR/AR), integration, consultant co-sign?
5. **Decision path:** Who signs — plant manager, HR, IT, procurement? Typical cycle?

### Closer (2 min)

> If I sent a one-page summary, who else should see it?

Ask permission to follow up in 2 weeks.

---

## Scorecard (fill after each call)

Copy one block per conversation.

```markdown
### Call #__ — [Name] — [Company] — [Role] — [Date]

**Pain (0–3):** 0=none, 1=mild, 2=clear budget pain, 3=urgent/active project  
**Pay intent (0–3):** 0=never, 1=maybe someday, 2=would evaluate, 3=would pilot now  
**Trust path named?** Y/N — what specifically: ___________  
**Decision maker identified?** Y/N — who: ___________  
**Cycle estimate:** <3 mo / 3–12 mo / 12+ mo / unknown  
**Quote (verbatim):** "___________"  
**Verdict this call:** Kill / Modify / Double down  
**Notes:**
```

---

## Aggregate decision (after 8–10 calls)

| Outcome | Criteria | Next action |
|---------|----------|-------------|
| **Kill** | Median pain ≤1, no pay intent, no trust path | Stay hospitality/creative only; archive automotive probe |
| **Modify** | Pain real but motion = founding partner / consultant-led / long cycle | Netlify lab only: FR landing + 5 sample playbooks; no Railway |
| **Double down** | ≥2 calls at pain 2–3 + pay intent 2–3 + named trust path or intro | Pursue 1 industrial pilot; then additive Railway workspace |

**Tie-breaker:** One paid discovery or LOI beats five polite "interesting" calls.

---

## What NOT to do during Phase 0

- Do not add automotive to main nav on argbuilder.io  
- Do not seed 10+ automotive playbooks to production DB  
- Do not rebrand ARG-Builder as an automotive product  
- Do not spend on ads or Product Hunt for automotive  

**Allowed:** Netlify lab experiments, this doc, outreach, one-pager PDF for conversations.

---

## Links

- ICP brief (Notion): Morocco ICP Target Brief — US Multinationals  
- Outreach contacts: ARG-Builder Outreach — 17 contacts, FR  
- Production app: https://argbuilder.io (Railway — protect core GTM)  
- Deploy map: [Handoff_and_Deploy_SOP.md](./Handoff_and_Deploy_SOP.md)
