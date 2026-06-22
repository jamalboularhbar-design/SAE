# ARG-Builder: Vendor & Procurement Playbook

## Executive Summary

This document defines ARG-Builder's vendor evaluation, negotiation, and management framework. As a growing SaaS company, vendor relationships directly impact product quality, operational efficiency, and financial health. This playbook ensures every vendor decision is data-driven, cost-optimized, and aligned with company strategy — from initial evaluation through ongoing management and renewal.

---

## Vendor Categories

### Critical Vendor Stack

| Category | Vendor(s) | Annual Spend | Risk Level | Owner |
|----------|-----------|-------------|------------|-------|
| Cloud infrastructure | AWS | $180K–$400K | Critical | CTO |
| AI/ML models | OpenAI, Anthropic | $300K–$500K | Critical | VP Engineering |
| CRM | HubSpot | $36K–$72K | High | VP RevOps |
| Data warehouse | Snowflake | $48K–$96K | High | VP Engineering |
| Security/compliance | Vanta, Snyk | $24K–$48K | High | Security Lead |
| Communication | Slack, Zoom | $18K–$36K | Medium | Operations |
| HR/Payroll | Gusto/Rippling | $12K–$24K | Medium | VP People |
| Design | Figma | $6K–$12K | Low | Design Lead |
| Development tools | GitHub, Linear | $12K–$24K | Medium | VP Engineering |
| Marketing tech | Various | $60K–$120K | Medium | VP Marketing |

---

## Vendor Evaluation Framework

### Evaluation Criteria (Weighted Scoring)

| Criteria | Weight | Score (1–5) | Questions to Ask |
|----------|--------|-------------|-----------------|
| Feature fit | 25% | Does it solve our specific problem? | Demo with our use case |
| Total cost of ownership | 20% | All-in cost over 3 years? | Pricing, implementation, training, maintenance |
| Integration capability | 15% | Works with our existing stack? | API quality, pre-built integrations |
| Security & compliance | 15% | Meets our security standards? | SOC 2, encryption, access controls |
| Scalability | 10% | Grows with us to 10x scale? | Pricing at scale, performance limits |
| Vendor stability | 10% | Will they exist in 3 years? | Funding, revenue, customer base |
| Support quality | 5% | Responsive when things break? | SLA, support channels, escalation |

### Decision Matrix Template

| Vendor | Feature (25%) | Cost (20%) | Integration (15%) | Security (15%) | Scale (10%) | Stability (10%) | Support (5%) | **Total** |
|--------|--------------|-----------|-------------------|---------------|------------|-----------------|-------------|-----------|
| Vendor A | 4 (1.0) | 3 (0.6) | 5 (0.75) | 4 (0.6) | 4 (0.4) | 5 (0.5) | 4 (0.2) | **4.05** |
| Vendor B | 5 (1.25) | 4 (0.8) | 3 (0.45) | 5 (0.75) | 3 (0.3) | 4 (0.4) | 3 (0.15) | **4.10** |
| Vendor C | 3 (0.75) | 5 (1.0) | 4 (0.6) | 3 (0.45) | 5 (0.5) | 3 (0.3) | 5 (0.25) | **3.85** |

---

## Negotiation Playbook

### Negotiation Levers

| Lever | When to Use | Expected Discount |
|-------|------------|-------------------|
| Annual prepayment | Cash available, vendor stable | 15–25% |
| Multi-year commitment | High confidence in vendor | 20–35% |
| Case study/reference | Early-stage vendor | 10–20% + extras |
| Volume commitment | Predictable growth | 10–30% |
| End-of-quarter timing | Vendor's fiscal quarter end | 15–25% |
| Competitive alternative | Genuine alternative exists | 10–20% |
| Startup/growth program | Revenue < $10M | 25–50% (first year) |
| Strategic partnership | Mutual value creation | Custom terms |

### Negotiation Rules

| Rule | Rationale |
|------|-----------|
| Never accept first price | List price is always negotiable in B2B SaaS |
| Get 3 quotes minimum | Creates competitive pressure and market knowledge |
| Negotiate on value, not just price | Payment terms, SLA, support, features matter |
| Document everything in writing | Verbal promises are worthless |
| Walk away willingly | Best leverage is genuine willingness to choose alternative |
| Time the negotiation | End of quarter/year yields best discounts |
| Start with annual, negotiate to monthly | Understand true cost before committing |

---

## Contract Management

### Contract Review Checklist

| Section | Key Items to Verify |
|---------|-------------------|
| Term & renewal | Auto-renewal terms, cancellation notice period, price increase caps |
| SLA | Uptime guarantee, response times, remedies for breach |
| Data | Ownership, portability, deletion on termination, processing terms |
| Security | SOC 2 requirement, breach notification, audit rights |
| Liability | Cap on liability, indemnification, insurance requirements |
| IP | Who owns customizations, integrations, data derivatives |
| Termination | For convenience, for cause, transition assistance |
| Pricing | Price lock period, increase caps, usage overages |

### Approval Authority

| Annual Spend | Approver | Additional Requirements |
|-------------|----------|----------------------|
| < $5K | Department head | Budget available |
| $5K–$25K | VP + Finance | 2 vendor comparison |
| $25K–$100K | CEO + Finance | 3 vendor comparison, ROI analysis |
| > $100K | CEO + Board awareness | Full evaluation, legal review, board FYI |

---

## Vendor Performance Management

### Quarterly Vendor Review

| Metric | Measurement | Target | Action if Below |
|--------|-------------|--------|-----------------|
| Uptime/availability | Monitoring data | Per SLA (99.9%+) | SLA credit claim |
| Support responsiveness | Ticket response times | Per SLA | Escalate to account manager |
| Feature delivery | Roadmap commitments | 80%+ delivered | Renegotiate or evaluate alternatives |
| Cost efficiency | Actual vs. budgeted spend | Within 10% | Optimize usage or renegotiate |
| Security posture | SOC 2 report, incidents | No material findings | Remediation plan or exit |
| Integration reliability | Error rates, downtime | < 0.1% error rate | Engineering escalation |

### Vendor Risk Assessment

| Risk Factor | Low Risk | Medium Risk | High Risk |
|------------|----------|-------------|-----------|
| Financial stability | Profitable, well-funded | Funded but burning cash | Uncertain funding |
| Customer concentration | < 5% of their revenue | 5–15% of their revenue | > 15% of their revenue |
| Single point of failure | Multiple alternatives exist | Few alternatives | No viable alternative |
| Data sensitivity | Non-sensitive data | Business data | Customer PII/PHI |
| Integration depth | Easily replaceable | Moderate switching cost | Deep integration, high switching cost |

---

## Vendor Exit Strategy

### Exit Planning

| Trigger | Action | Timeline |
|---------|--------|----------|
| Contract renewal approaching | Evaluate alternatives, negotiate | 90 days before renewal |
| Vendor performance declining | Document issues, begin evaluation | Immediately |
| Vendor acquired/pivoting | Assess impact, identify alternatives | 30 days |
| Better alternative identified | Build business case, plan migration | 60–90 days |
| Budget constraints | Identify consolidation opportunities | Quarterly review |

### Migration Checklist

| Step | Action | Owner | Timeline |
|------|--------|-------|----------|
| 1 | Document all integrations and dependencies | Engineering | Week 1 |
| 2 | Export all data in portable format | Engineering | Week 2 |
| 3 | Set up new vendor in parallel | Engineering | Weeks 2–4 |
| 4 | Migrate data and test thoroughly | Engineering + QA | Weeks 4–6 |
| 5 | Run parallel systems for validation | Engineering | Weeks 6–8 |
| 6 | Cut over to new vendor | Engineering | Week 8 |
| 7 | Decommission old vendor | Engineering + Finance | Week 9 |
| 8 | Confirm data deletion from old vendor | Security | Week 10 |
