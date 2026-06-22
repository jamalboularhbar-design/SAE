# ARG-Builder: Product Roadmap Governance

## Executive Summary

This document defines how ARG-Builder prioritizes, validates, builds, and measures product features. Product roadmap governance ensures that engineering effort is directed toward the highest-impact work, that stakeholders have appropriate input without creating chaos, and that every shipped feature is measured against clear success criteria. The framework balances customer needs, business objectives, and technical excellence.

---

## Roadmap Philosophy

> **We do not build features. We solve problems. Every item on the roadmap must trace back to a customer problem worth solving and a business outcome worth achieving.**

### Roadmap Principles

| Principle | Implementation |
|-----------|---------------|
| Outcome over output | Measure success by customer outcomes, not features shipped |
| Evidence over opinion | Every roadmap item requires evidence of demand |
| Fewer things, done well | Prefer depth over breadth; finish before starting |
| Transparent by default | Roadmap visible to all employees; customer-facing version updated quarterly |
| Flexible but committed | Quarterly commitments are firm; beyond that is directional |

---

## Roadmap Structure

### Time Horizons

| Horizon | Timeframe | Certainty | Detail Level | Communication |
|---------|-----------|-----------|--------------|---------------|
| Now | Current quarter | 90%+ committed | Detailed specs, assigned teams | Internal: specific. External: committed |
| Next | Next quarter | 60–70% planned | Problem statements, rough scope | Internal: planned. External: directional |
| Later | 2–4 quarters out | 30–40% directional | Themes and opportunities | Internal: exploratory. External: vision |
| Vision | 1–3 years | Aspirational | Strategic bets and market shifts | Internal + external: inspirational |

### Roadmap Categories

| Category | % of Capacity | Description |
|----------|---------------|-------------|
| Customer-requested | 40% | Features driven by customer feedback and demand |
| Strategic bets | 25% | Features that open new markets or create differentiation |
| Technical foundation | 20% | Infrastructure, performance, security, scalability |
| Quick wins | 10% | Small improvements with outsized impact |
| Innovation / R&D | 5% | Experimental features, future technology exploration |

---

## Prioritization Framework

### RICE Scoring

Every feature request is scored using the RICE framework:

| Factor | Definition | Scale | Weight |
|--------|-----------|-------|--------|
| **R**each | How many customers will this impact in the next quarter? | 1–100 (% of customers) | 1x |
| **I**mpact | How much will this improve the customer experience? | 0.25 (minimal) to 3 (massive) | 1x |
| **C**onfidence | How confident are we in our estimates? | 50%–100% | 1x |
| **E**ffort | How many person-weeks will this take? | 0.5–12 weeks | Divisor |

**RICE Score = (Reach × Impact × Confidence) / Effort**

### Prioritization Inputs

| Input Source | Weight | Method | Frequency |
|-------------|--------|--------|-----------|
| Customer requests (volume) | 25% | Feature request tracking in CRM | Continuous |
| Customer requests (revenue-weighted) | 20% | ARR of requesting customers | Continuous |
| Churn/risk analysis | 20% | Features cited in churn reasons | Monthly |
| Strategic alignment | 20% | CEO/CPO strategic priorities | Quarterly |
| Technical necessity | 15% | Engineering team assessment | Monthly |

### Decision Matrix

| Score Range | Decision | Action |
|-------------|----------|--------|
| > 80 | Build now | Add to current quarter |
| 50–80 | Build next | Add to next quarter |
| 25–50 | Consider | Add to "Later" horizon |
| < 25 | Decline | Communicate "not planned" |

---

## Feature Lifecycle

### Stage Gate Process

| Stage | Gate Criteria | Owner | Duration |
|-------|--------------|-------|----------|
| 1. Problem Definition | Clear problem statement, evidence of demand, customer quotes | PM | 1 week |
| 2. Solution Design | Technical feasibility, UX wireframes, scope defined | PM + Engineering | 1–2 weeks |
| 3. Validation | Customer interviews (5+), prototype testing, stakeholder alignment | PM | 1–2 weeks |
| 4. Build | Implementation, testing, documentation | Engineering | 2–6 weeks |
| 5. Beta | 5–10 customers testing, feedback incorporated | PM + Engineering | 1–2 weeks |
| 6. Launch | GA release, marketing, enablement, success metrics live | PM + Marketing | 1 week |
| 7. Measure | 30/60/90 day metrics review, iterate or sunset | PM | Ongoing |

### Feature Specification Template

| Section | Content |
|---------|---------|
| Problem Statement | What problem are we solving? For whom? How do we know it's a problem? |
| Success Metrics | How will we measure success? What does "good" look like at 30/60/90 days? |
| User Stories | As a [role], I want to [action] so that [outcome] |
| Scope | What's included? What's explicitly NOT included? |
| Technical Approach | High-level architecture, dependencies, risks |
| UX Design | Wireframes, user flows, edge cases |
| Launch Plan | Beta criteria, GA criteria, marketing, enablement |
| Rollback Plan | How do we undo this if it fails? |

---

## Stakeholder Communication

### Internal Communication

| Audience | Format | Frequency | Content |
|----------|--------|-----------|---------|
| All employees | All-hands roadmap update | Monthly | Highlights, shipped, upcoming |
| Engineering | Sprint planning | Bi-weekly | Detailed specs, priorities |
| Sales | Enablement update | Bi-weekly | What's coming, how to position |
| CS | Feature briefing | Weekly | New features, customer impact |
| Leadership | Roadmap review | Monthly | Progress, pivots, decisions needed |

### External Communication

| Audience | Format | Frequency | Content |
|----------|--------|-----------|---------|
| All customers | Product update email | Monthly | Shipped features, coming soon |
| Enterprise customers | Roadmap preview (QBR) | Quarterly | Upcoming features relevant to them |
| CAB members | Early access + input | Quarterly | Validate direction, preview features |
| Prospects | Public roadmap page | Quarterly update | High-level themes (no dates) |

### Saying "No" Framework

Not every request can be built. Saying "no" well is as important as saying "yes."

| Scenario | Response Template |
|----------|-----------------|
| Low priority, good idea | "Great idea. We've added it to our consideration list. Right now, [X] is higher priority because [reason]. We'll revisit in Q[X]." |
| Doesn't fit strategy | "I appreciate the suggestion. This doesn't align with our current direction because [reason]. Here's what we're focused on instead and why." |
| Too niche | "This would help a small number of customers. We're prioritizing features with broader impact right now. Can you share more about the underlying problem? There might be a different solution." |
| Already planned | "Great news — this is already on our roadmap for Q[X]. I'll make sure you're in our beta group when it's ready." |

---

## Measuring Success

### Feature Success Metrics

Every feature must define success metrics before building begins:

| Metric Type | Examples | Measurement Timeline |
|-------------|---------|---------------------|
| Adoption | % of target users who try the feature | 30 days post-launch |
| Engagement | Frequency of use, depth of use | 60 days post-launch |
| Retention impact | Does this feature correlate with retention? | 90 days post-launch |
| Business impact | Revenue influence, churn reduction, NPS change | 90 days post-launch |
| Satisfaction | Feature-specific CSAT or feedback | 30 days post-launch |

### Feature Health Review (90 days post-launch)

| Outcome | Criteria | Action |
|---------|----------|--------|
| Success | Meets or exceeds all success metrics | Invest further, expand |
| Partial success | Meets some metrics, misses others | Iterate, A/B test improvements |
| Underperforming | Misses most metrics | Investigate root cause, pivot or sunset |
| Failure | No meaningful adoption or impact | Sunset, document learnings |

---

## Roadmap Governance Cadence

| Meeting | Frequency | Attendees | Purpose | Output |
|---------|-----------|-----------|---------|--------|
| Weekly Product Sync | Weekly | PM + Engineering leads | Execution updates, blockers | Updated sprint board |
| Monthly Roadmap Review | Monthly | PM + Engineering + Design | Progress, reprioritization | Updated roadmap |
| Quarterly Planning | Quarterly | Leadership + PM + Engineering | Set quarterly commitments | Quarterly roadmap |
| Annual Strategy | Annually | All leadership | Set annual themes and vision | Annual product strategy |
