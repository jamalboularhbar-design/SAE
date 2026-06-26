# ARG-Builder: Product Metrics

## Executive Summary

This document defines ARG-Builder's product metrics architecture — the structured hierarchy of metrics that measure product health, guide development decisions, and demonstrate value to customers and investors. A well-designed metrics framework transforms intuition-based product decisions into data-driven ones.

---

## North Star Metric

### Definition

| Element | Detail |
|---------|--------|
| **North Star Metric** | Weekly Active Teams Using Reference Guides |
| **Definition** | Number of distinct teams (3+ users) that accessed or updated a reference guide at least once in the past 7 days |
| **Why this metric** | Captures value delivery (teams using guides), engagement (weekly cadence), and breadth (team, not individual) |
| **Target growth** | 15% month-over-month |
| **Leading indicators** | Guide creation rate, team invitations, search queries |
| **Lagging indicators** | Revenue, retention, NPS |

---

## Metrics Hierarchy

### Input Metrics (Leading)

| Metric | Definition | Target | Frequency |
|--------|-----------|--------|-----------|
| New guides created/week | Reference guides initialized | > 50/week | Weekly |
| Personas added/week | New personas defined | > 100/week | Weekly |
| Team invitations sent | Invites to join a workspace | > 200/week | Weekly |
| Search queries/day | Total search actions | > 1,000/day | Daily |
| Content updates/week | Edits to existing guides | > 500/week | Weekly |

### Output Metrics (Lagging)

| Metric | Definition | Target | Frequency |
|--------|-----------|--------|-----------|
| MRR | Monthly recurring revenue | Growing 15%+ MoM | Monthly |
| Net revenue retention | Revenue from existing customers (expansion - churn) | > 120% | Monthly |
| Logo retention | % of customers retained | > 90% annually | Monthly |
| NPS | Net Promoter Score | > 50 | Quarterly |
| Customer count | Total paying customers | Growing 10%+ MoM | Monthly |

---

## Funnel Metrics

### Acquisition Funnel

| Stage | Metric | Target | Conversion Target |
|-------|--------|--------|-------------------|
| Awareness | Website visitors | 50K/month | — |
| Interest | Signup/trial starts | 2,500/month | 5% of visitors |
| Activation | First guide created | 1,500/month | 60% of signups |
| Conversion | Trial → Paid | 375/month | 25% of activated |
| Expansion | Tier upgrade or seat expansion | 15% of customers/quarter | — |

### Activation Milestones

| Milestone | Definition | Target (% of signups) | Timeframe |
|-----------|-----------|----------------------|-----------|
| M1: First login | User logs in after signup | 95% | Day 0 |
| M2: First persona | Creates their first persona | 70% | Day 1 |
| M3: First process | Adds a process flow | 55% | Day 3 |
| M4: Team invite | Invites at least 1 team member | 40% | Day 5 |
| M5: Search used | Uses search or command palette | 60% | Day 7 |
| **Activated** | Achieves M2 + M3 + M4 | 35% | Day 7 |

---

## Engagement Metrics

### Daily/Weekly/Monthly Active Users

| Metric | Definition | Target | Health Signal |
|--------|-----------|--------|--------------|
| DAU | Unique users with 1+ action/day | Growing | Product stickiness |
| WAU | Unique users with 1+ action/week | Growing | Habit formation |
| MAU | Unique users with 1+ action/month | Growing | Reach |
| DAU/MAU ratio | Daily engagement intensity | > 30% | Strong habit |
| DAU/WAU ratio | Weekly engagement intensity | > 50% | Daily utility |

### Feature Adoption

| Feature | Adoption Target (30 days) | Power User Threshold | Health |
|---------|--------------------------|---------------------|--------|
| Persona creation | 80% of accounts | 5+ personas | Core |
| Process timelines | 60% of accounts | 3+ timelines | Core |
| Search | 70% of active users | 10+ queries/week | Core |
| Command palette | 30% of active users | 5+ uses/week | Power |
| PDF export | 40% of accounts | 2+ exports/month | Utility |
| Team collaboration | 50% of accounts | 3+ team members active | Growth |

---

## Retention Metrics

### Cohort Analysis Framework

| Cohort Period | Day 1 | Day 7 | Day 14 | Day 30 | Day 60 | Day 90 |
|--------------|-------|-------|--------|--------|--------|--------|
| Target retention | 80% | 60% | 50% | 40% | 35% | 30% |
| Activated users | 95% | 80% | 70% | 60% | 55% | 50% |
| Non-activated | 60% | 30% | 20% | 10% | 5% | 2% |

### Revenue Retention

| Metric | Definition | Target | Benchmark |
|--------|-----------|--------|-----------|
| Gross revenue retention | Revenue retained (excluding expansion) | > 90% | 85–95% (B2B SaaS) |
| Net revenue retention | Revenue retained (including expansion) | > 120% | 100–130% (best-in-class) |
| Logo retention | % of customers retained | > 90% | 85–95% |
| Expansion rate | % of customers that expand | > 30%/year | 20–40% |
| Contraction rate | % of revenue lost to downgrades | < 5%/year | 3–8% |

---

## Product Quality Metrics

### Performance

| Metric | Target | Alert Threshold | Measurement |
|--------|--------|----------------|-------------|
| Page load time (P50) | < 1.5s | > 3s | RUM |
| Page load time (P95) | < 3s | > 5s | RUM |
| Search response time | < 200ms | > 500ms | Server logs |
| API response time (P50) | < 100ms | > 300ms | APM |
| Uptime | > 99.9% | < 99.5% | Monitoring |
| Error rate | < 0.1% | > 1% | Error tracking |

### User Experience

| Metric | Target | Measurement | Frequency |
|--------|--------|-------------|-----------|
| Task completion rate | > 90% | Product analytics | Continuous |
| Time to complete key tasks | Decreasing | Product analytics | Weekly |
| Support ticket rate | < 2% of MAU | Support system | Monthly |
| Feature satisfaction (CSAT) | > 4.2/5 | In-app survey | Per feature |
| System Usability Scale (SUS) | > 75 | Quarterly survey | Quarterly |

---

## Reporting & Dashboards

### Executive Dashboard (Weekly)

| Section | Metrics | Visualization |
|---------|---------|---------------|
| North Star | WAT using guides, trend, MoM growth | Line chart + number |
| Revenue | MRR, new MRR, churned MRR, net new | Bar chart |
| Funnel | Visitors → Signups → Activated → Paid | Funnel chart |
| Engagement | DAU/WAU/MAU, DAU/MAU ratio | Line chart |
| Health | NPS, CSAT, uptime, error rate | Gauges |
