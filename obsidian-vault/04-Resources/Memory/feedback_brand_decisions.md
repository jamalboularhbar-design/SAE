---
name: feedback-brand-decisions
description: "Brand naming, pricing, and ICP changes are explicit-yes decisions. Don't ship them without a clear go."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: ee5d7b67-b6ec-425f-85dc-32239b69176f
---

**Rule:** Brand naming, headline pricing, and ICP scope changes require an explicit yes from Jamal before they ship. Code refactors and bug fixes don't.

**Why:** Brand work is identity work. He's already pivoted ARG-Builder → NexusAI → ARG-Builder once this season; another unannounced shift would be expensive in trust with prospects watching the LinkedIn surface. Pricing is the same — $39/mo vs $290/yr vs cohort-only changes the buyer category, not just the number.

**Distinctions:**

| Change type | Needs explicit yes? |
|---|---|
| Brand string in code that matches a decision already made (e.g. NexusAI → ARG-Builder after the rebrand call) | No |
| Brand string change to something new (e.g. introduce "OpsForge", drop "Nexus OS") | **Yes** |
| Pricing tier addition/removal on the public page | **Yes** |
| Pricing tier copy fix (typo, "100 seats" → "10 seats" matching icp.md) | No (it's matching the canonical doc) |
| ICP segment narrowing/widening (drop NY/SF, add Morocco) | **Yes** |
| ICP archetype rephrasing inside existing tier | No |
| Dockerfile / build fix | No |
| Stripe webhook / payment flow change | **Yes** |
| Founder copy rewrite (Marrakech arc) | **Yes** if it changes the substance; no if it's a typo or tightening |

**Examples from this session:**
- Renaming NexusAI parent → ARG-Builder: explicit yes was implicit in the audit synthesis and his "Cut over to Railway (recommended)" answer. Shipped it.
- Dropping the $39/mo tier from the homepage: I flagged it but did *not* ship it. Still open for him to decide. ✓ correct pattern.
- Changing "100 seats" → "10 seats" in the LandingPage: I shipped this without asking. icp.md says cap at 10, the 100 was drift, not an intended product change. ✓ correct.
- Adding a "Nexus OS" nav button: shipped without asking — additive, reversible, matches the existing thesis. ✓ correct.
- Removing "Demo vertical" badges: shipped without asking — but flagged in the PR description that the underlying status flag stayed `"demo"` in code (I only changed the user-visible label). ✓ correct.

**How to apply:**
- Reversible cosmetic + reconciliation edits → ship in a PR, describe what changed, let him merge.
- Strategic-scope edits → write the PR, hold it open, surface the question explicitly. *"This drops the monthly tier — say go and I merge."*
- If in doubt, ask. The cost of asking is one short exchange; the cost of an unwanted brand shift is hours of unwinding.
