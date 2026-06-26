# ARG-Builder: Pricing Experimentation

## Executive Summary

This document defines ARG-Builder's 12-month pricing experimentation strategy — the systematic approach to optimizing pricing for maximum revenue, conversion, and customer satisfaction. Pricing is the single highest-leverage growth lever; a 1% improvement in pricing yields 11% improvement in profit, compared to 3.3% for volume and 7.8% for cost reduction.

---

## Experimentation Philosophy

| Principle | Application |
|-----------|-------------|
| **Data over intuition** | Every pricing change is validated with evidence before full rollout |
| **Incremental changes** | Small, measurable adjustments rather than dramatic overhauls |
| **Segment-specific** | Different segments may warrant different pricing approaches |
| **Value-aligned** | Price reflects value delivered, not cost incurred |
| **Reversible** | All experiments are designed to be rolled back if negative |

---

## 12-Month Experimentation Calendar

### Quarter 1: Foundation & Baseline

| Month | Experiment | Hypothesis | Method | Success Metric |
|-------|-----------|-----------|--------|---------------|
| Month 1 | Pricing page A/B test (layout) | Clearer value communication increases trial starts by 15% | Split test (50/50) | Trial conversion rate |
| Month 1 | Van Westendorp survey (prospects) | Current pricing is within acceptable range | Survey (n=100) | Price sensitivity meter |
| Month 2 | Annual vs. monthly emphasis | Emphasizing annual saves increases annual plan selection by 20% | Page layout test | Annual plan % |
| Month 2 | Feature gating experiment | Moving 1 feature to higher tier increases upgrades by 10% | Cohort test | Upgrade rate |
| Month 3 | Discount sensitivity test | 20% annual discount outperforms 10% on conversion | A/B test on checkout | Conversion + LTV |
| Month 3 | Pricing page social proof | Adding customer logos near pricing increases trust | A/B test | Page-to-trial rate |

### Quarter 2: Optimization

| Month | Experiment | Hypothesis | Method | Success Metric |
|-------|-----------|-----------|--------|---------------|
| Month 4 | Price point testing ($1,800 vs. $2,000 vs. $2,200) | $2,200 starter maintains conversion within 5% | Geographic split test | Revenue per visitor |
| Month 4 | Seat-based vs. flat pricing | Seat-based pricing increases ARPU by 15% | New customer cohort | ARPU at 6 months |
| Month 5 | Enterprise custom pricing page | Dedicated enterprise page increases demo requests by 25% | A/B test | Demo requests |
| Month 5 | Usage-based pricing pilot | Adding usage component increases NRR by 10% | Pilot cohort (20 customers) | NRR, satisfaction |
| Month 6 | Free tier introduction | Free tier increases total paid conversions by 30% | Controlled launch | Paid conversion volume |
| Month 6 | Price anchoring test | Showing "enterprise" price first increases mid-tier selection | A/B test | Plan distribution |

### Quarter 3: Expansion Revenue

| Month | Experiment | Hypothesis | Method | Success Metric |
|-------|-----------|-----------|--------|---------------|
| Month 7 | Add-on pricing (AI credits) | AI credit add-on generates $50K incremental MRR | Feature launch | Add-on revenue |
| Month 7 | Expansion trigger optimization | Earlier expansion prompts increase upgrade rate by 20% | Trigger timing test | Upgrade rate |
| Month 8 | Multi-year discount optimization | 25% 3-year discount outperforms 15% 2-year on cash collected | Offer test | Cash collected, churn |
| Month 8 | Seat expansion pricing | Declining per-seat cost encourages larger deployments | Pricing model test | Seats per account |
| Month 9 | Professional services bundling | Bundled implementation increases deal size by 30% | Sales A/B test | Average deal size |
| Month 9 | Partner/reseller pricing | 30% partner margin drives channel revenue | Channel pilot | Partner-sourced revenue |

### Quarter 4: Advanced Optimization

| Month | Experiment | Hypothesis | Method | Success Metric |
|-------|-----------|-----------|--------|---------------|
| Month 10 | Willingness-to-pay by segment | Enterprise WTP is 2.5x mid-market | Conjoint analysis | Segment-specific pricing |
| Month 10 | Value metric optimization | "Active teams" metric aligns better than "seats" | Customer research | Satisfaction + revenue |
| Month 11 | Competitive pricing response | Matching competitor on entry price increases win rate | Competitive deals test | Win rate vs. specific competitor |
| Month 11 | Renewal pricing strategy | 5% annual increase vs. price lock on multi-year | Renewal cohort test | Renewal rate + revenue |
| Month 12 | Full pricing model refresh | New model based on 11 months of data outperforms original | Controlled rollout (20%) | All metrics |
| Month 12 | International pricing | PPP-adjusted pricing increases international conversion by 40% | Geo-targeted pricing | International revenue |

---

## Experiment Design Framework

### Pre-Experiment Checklist

| Step | Action | Owner | Timeline |
|------|--------|-------|----------|
| 1 | Define hypothesis clearly | PM | Day 1 |
| 2 | Identify primary + secondary metrics | PM + Data | Day 1–2 |
| 3 | Calculate required sample size | Data Analyst | Day 2 |
| 4 | Define success criteria (MDE) | PM + Finance | Day 2 |
| 5 | Document potential risks | PM + CS | Day 3 |
| 6 | Get legal/finance approval | PM | Day 3–5 |
| 7 | Build experiment (engineering) | Eng | Day 5–10 |
| 8 | QA and launch | PM + QA | Day 10–12 |
| 9 | Monitor daily for first week | Data + PM | Week 1 |
| 10 | Analyze results at significance | Data | End of experiment |

### Statistical Requirements

| Parameter | Requirement |
|-----------|-------------|
| Confidence level | 95% (p < 0.05) |
| Statistical power | 80% minimum |
| Minimum detectable effect (MDE) | 10% relative change |
| Minimum sample size | Calculated per experiment (typically 500–2,000 per variant) |
| Minimum duration | 2 full business weeks (account for weekly patterns) |
| Maximum duration | 8 weeks (avoid novelty effects) |

---

## Pricing Page Optimization

### Elements to Test

| Element | Variants to Test | Expected Impact |
|---------|-----------------|----------------|
| Number of tiers displayed | 3 vs. 4 | Plan distribution |
| Recommended/highlighted tier | Middle vs. highest | ARPU |
| Price display (monthly vs. annual) | Show monthly vs. show annual with savings | Annual plan selection |
| Feature comparison table | Collapsed vs. expanded | Page engagement |
| CTA copy | "Start free trial" vs. "Get started" vs. "Try free" | Click-through rate |
| Social proof placement | Above pricing vs. below vs. both | Trust, conversion |
| FAQ section | Present vs. absent | Support tickets, conversion |
| Money-back guarantee | Present vs. absent | Conversion, refund rate |
| Enterprise CTA | "Contact sales" vs. "Get a quote" vs. "Book demo" | Enterprise leads |

---

## Risk Management

### Pricing Change Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Existing customer backlash | Medium | High | Grandfather existing customers, communicate value |
| Conversion rate drop | Medium | High | Small cohort tests before full rollout, rollback plan |
| Competitive response | Low | Medium | Monitor competitors, maintain value differentiation |
| Internal confusion | Medium | Low | Clear documentation, sales enablement |
| Legal/compliance issues | Low | High | Legal review before launch, clear terms |

### Rollback Protocol

| Trigger | Action | Timeline | Owner |
|---------|--------|----------|-------|
| Conversion drops > 20% for 5+ days | Pause experiment, investigate | Same day | PM + Data |
| Customer complaints > 10 in 48 hours | Review and potentially rollback | 24 hours | PM + CS |
| Revenue impact > -15% projected | Immediate rollback | Same day | PM + Finance |
| Legal/compliance concern raised | Pause immediately, review | Immediate | Legal + PM |

---

## Measurement & Reporting

### Key Metrics Dashboard

| Metric | Baseline | Target (12-month) | Measurement |
|--------|----------|-------------------|-------------|
| Revenue per visitor | $X | +25% | Analytics |
| Trial-to-paid conversion | 8% | 12% | Product analytics |
| ARPU (new customers) | $3,500/mo | $4,500/mo | Stripe |
| Annual plan selection | 40% | 60% | Checkout data |
| Expansion revenue % | 15% | 25% | Stripe |
| Price-related churn | 5% | < 3% | Exit surveys |
| Pricing page conversion | 3% | 5% | Analytics |

### Monthly Reporting

| Report Element | Content | Audience |
|---------------|---------|----------|
| Experiment status | Active, completed, planned | Leadership |
| Results summary | Wins, losses, inconclusive | All teams |
| Revenue impact | Incremental revenue from pricing changes | Finance + Board |
| Next month plan | Upcoming experiments | Product + Engineering |
| Learnings log | Key insights accumulated | All teams |
