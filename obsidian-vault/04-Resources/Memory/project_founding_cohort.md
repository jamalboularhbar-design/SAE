---
name: project-founding-cohort
description: "The 10-seat founding cohort offer — closed group, 6-month commitment, premium NY/SF founders. The canonical pricing and ICP."
metadata: 
  node_type: memory
  type: project
  originSessionId: ee5d7b67-b6ec-425f-85dc-32239b69176f
---

**The offer (canonical, capped at 10 seats):**
- 6-month commitment
- Co-design of one Autopilot for one workflow loop they pick
- Weekly direct founder access (Jamal himself — real, not delegated)
- Full Playbooks library + every update
- Nexus OS early access (the runtime, mounted at /os)
- Founding pricing, locked
- Naming credit at public launch
- In exchange: case study rights, monthly written feedback, a public testimonial at launch

**Current Stripe pricing** (in `apps/playbooks/server/products.ts` on SAE):
- Monthly Membership: `$39/mo`
- Annual Founding: `$290/yr` ("Save 38% — price locked permanently")
- Both go through `stripe.createCheckoutSession`. Self-serve, no application gate.

**Audit synthesis recommendation (not yet executed):** drop the $39/mo tier from the public surface, keep founding annual only, gate by application instead of self-serve checkout. The reasoning is in [[project-thesis]] — $39/mo puts the venture in a price-war with Notion and ChatGPT, where the founder narrative is wasted. A capped 10-seat cohort is what the Marrakech-25-year-arc justifies. Jamal hasn't said yes or no to this yet.

**ICP definition (from `pre-launch/icp.md`):**

> Operators of taste-driven, ops-heavy businesses in New York or San Francisco — agencies, studios, concierges, ateliers, premium services — where the founder's time is the bottleneck and the work has texture that off-the-shelf SaaS can't capture.

Tier 1 (~10 dream accounts):
- Founder-led, 2–25 employees
- $1M–$10M annual revenue
- Public taste signal (intentional website, considered LinkedIn voice)
- Operator already tinkers with AI but is frustrated by the seat-based ceiling
- Founder visibly is the bottleneck

Archetypes:
1. Boutique agency principal (brand/editorial/creative/packaging; NYC SoHo/Williamsburg, SF Mission/Hayes Valley)
2. Premium concierge / experiential founder (high-touch travel, private events, art advisory)
3. Independent publisher / studio with shelf presence (magazines, journals, books, editions)
4. Taste-led professional services founder (boutique law, family office, IP advisory)
5. Post-VC operator turned solo studio (ex-tech, now quieter second act)

Tier 3 (deprioritize): pure SaaS, mass-market D2C, enterprise procurement, solo freelancers, "another AI tool" buyers.

Disqualifying signals: procurement portal mentioned, "AI" already prominent in marketing, engagement-farming founder, repeated failed software trials, no visible bottleneck.

**Trip target metrics:** 30 Tier 1 + Tier 2 prospects mapped by end of Week 2 · 30 first-touch DMs · reply rate ≥30% · 10–15 booked meetings for June trip · **3 signed founding customers + 5 strong leads** = launch success.

**How to apply:**
- The number 10 is canonical for the cohort. Catch-and-flag any drift ("100 seats" appeared in pricing copy at one point — that was a drift, not intent).
- ICP is "founder-led taste-driven NY/SF" — don't broaden it to Morocco SMEs or generic tech. The brand thesis collapses outside this range.
- If asked about pricing changes, anchor the conversation to the ICP, not to revenue projections. The ICP buys $1k–10k/year relationships, not $39/mo subscriptions.
