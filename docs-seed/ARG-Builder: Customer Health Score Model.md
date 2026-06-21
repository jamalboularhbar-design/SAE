# ARG-Builder: Customer Health Score Model

## Executive Summary

This document defines ARG-Builder's Customer Health Score Model — a predictive, multi-dimensional scoring system that identifies at-risk accounts before they churn, surfaces expansion opportunities, and enables proactive customer success management. The model combines product usage, engagement, support, financial, and relationship signals into a single actionable score (0–100) that drives automated workflows and CSM prioritization.

---

## Score Architecture

### Composite Score (0–100)

| Score Range | Health Status | Color | Action Required |
|-------------|-------------|-------|-----------------|
| 85–100 | Thriving | Green | Expansion opportunity, advocacy candidate |
| 70–84 | Healthy | Light Green | Maintain, nurture relationship |
| 55–69 | Neutral | Yellow | Monitor closely, proactive outreach |
| 40–54 | At Risk | Orange | Intervention required, CSM escalation |
| 0–39 | Critical | Red | Immediate executive engagement, save plan |

### Dimension Weights

| Dimension | Weight | Rationale |
|-----------|--------|-----------|
| Product Usage | 35% | Strongest predictor of retention |
| Engagement | 20% | Relationship health indicator |
| Support | 15% | Friction and satisfaction signal |
| Financial | 15% | Payment health and growth trajectory |
| Relationship | 15% | Stakeholder strength and advocacy |

---

## Dimension 1: Product Usage (35%)

### Usage Metrics

| Metric | Weight (within dimension) | Scoring | Data Source |
|--------|--------------------------|---------|-------------|
| Weekly Active Users (WAU) | 25% | % of licensed seats active | Product analytics |
| Guide views per week | 20% | Views vs. benchmark for plan | Product analytics |
| Feature breadth | 20% | % of key features used (search, timeline, export, collaborate) | Product analytics |
| AI generation frequency | 15% | New guides/updates per month | Product analytics |
| Session duration | 10% | Average time in product per session | Product analytics |
| Login frequency trend | 10% | Increasing, stable, or declining over 30 days | Product analytics |

### Usage Scoring Rules

| Metric | Score 100 | Score 75 | Score 50 | Score 25 | Score 0 |
|--------|-----------|----------|----------|----------|---------|
| WAU (% of seats) | > 80% | 60–80% | 40–60% | 20–40% | < 20% |
| Guide views/week | > 50 | 30–50 | 15–30 | 5–15 | < 5 |
| Feature breadth | > 80% features | 60–80% | 40–60% | 20–40% | < 20% |
| AI generations/month | > 10 | 5–10 | 2–5 | 1–2 | 0 |
| Avg session duration | > 15 min | 10–15 min | 5–10 min | 2–5 min | < 2 min |
| Login trend (30-day) | Increasing > 20% | Stable (±10%) | Slight decline (10–20%) | Declining (20–40%) | Declining > 40% |

---

## Dimension 2: Engagement (20%)

### Engagement Metrics

| Metric | Weight | Scoring | Data Source |
|--------|--------|---------|-------------|
| Executive sponsor engagement | 30% | Last interaction with sponsor | CRM + CSM notes |
| Meeting attendance (QBRs, check-ins) | 25% | % of scheduled meetings attended | Calendar + CRM |
| Email/Slack responsiveness | 20% | Average response time to CSM outreach | Communication tools |
| Event participation | 15% | Webinars, community, user groups attended | Event platform |
| Feedback provided | 10% | NPS responses, feature requests, reviews | Survey + product |

### Engagement Scoring Rules

| Metric | Score 100 | Score 75 | Score 50 | Score 25 | Score 0 |
|--------|-----------|----------|----------|----------|---------|
| Sponsor engagement | < 14 days ago | 14–30 days | 30–60 days | 60–90 days | > 90 days |
| Meeting attendance | 100% | 75–99% | 50–74% | 25–49% | < 25% |
| Response time | < 24 hours | 24–48 hours | 48–72 hours | 3–7 days | > 7 days or no response |
| Event participation | 3+ events/quarter | 2 events | 1 event | Registered but didn't attend | No participation |
| Feedback provided | NPS 9–10 + detailed | NPS 7–8 | NPS responded (any) | Partial response | No response in 6+ months |

---

## Dimension 3: Support (15%)

### Support Metrics

| Metric | Weight | Scoring | Data Source |
|--------|--------|---------|-------------|
| Ticket volume trend | 30% | Increasing vs. decreasing tickets | Support platform |
| Ticket severity | 25% | % of tickets that are P1/P2 | Support platform |
| Resolution satisfaction (CSAT) | 25% | Post-ticket satisfaction rating | Support surveys |
| Open ticket age | 10% | Average age of open tickets | Support platform |
| Escalation frequency | 10% | Escalations to management in last 90 days | Support platform |

### Support Scoring Rules

| Metric | Score 100 | Score 75 | Score 50 | Score 25 | Score 0 |
|--------|-----------|----------|----------|----------|---------|
| Ticket trend | Decreasing > 20% | Stable | Slight increase (< 20%) | Increasing 20–50% | Increasing > 50% |
| Severity mix | 0% P1, < 10% P2 | < 5% P1, < 20% P2 | 5–10% P1 | 10–20% P1 | > 20% P1 |
| CSAT | > 4.5/5 | 4.0–4.5 | 3.5–4.0 | 3.0–3.5 | < 3.0 |
| Open ticket age | < 24 hours avg | 24–48 hours | 48–72 hours | 3–7 days | > 7 days |
| Escalations (90 days) | 0 | 1 | 2 | 3–4 | 5+ |

---

## Dimension 4: Financial (15%)

### Financial Metrics

| Metric | Weight | Scoring | Data Source |
|--------|--------|---------|-------------|
| Payment history | 30% | On-time payments, failed charges | Billing system |
| Contract value trend | 25% | Growing, stable, or contracting | CRM |
| Expansion signals | 20% | Usage approaching limits, new departments | Product + CRM |
| Renewal timeline risk | 15% | Days to renewal + renewal likelihood | CRM |
| Invoice disputes | 10% | Disputed invoices in last 12 months | Finance |

### Financial Scoring Rules

| Metric | Score 100 | Score 75 | Score 50 | Score 25 | Score 0 |
|--------|-----------|----------|----------|----------|---------|
| Payment history | Always on-time | 1 late (< 15 days) | 2 late payments | 3+ late or 1 failed | Chronic late/failed |
| Contract trend | Expanded in last 12 months | Stable | Stable but no growth signals | Downgraded | Requested cancellation |
| Expansion signals | Strong (> 80% seat utilization + new dept interest) | Moderate (60–80% utilization) | Low (40–60%) | Very low (< 40%) | Contraction signals |
| Renewal risk | > 90 days out + confirmed | > 90 days, not yet discussed | 30–90 days, uncertain | < 30 days, at risk | Cancellation notice |
| Invoice disputes | 0 in 12 months | 1 minor, resolved | 2+ minor or 1 significant | Ongoing dispute | Legal/collections |

---

## Dimension 5: Relationship (15%)

### Relationship Metrics

| Metric | Weight | Scoring | Data Source |
|--------|--------|---------|-------------|
| Stakeholder depth | 30% | Number of relationships across org | CRM contacts |
| Champion strength | 25% | Internal advocate activity and influence | CSM assessment |
| Decision-maker access | 20% | Direct relationship with budget holder | CRM + CSM notes |
| Multi-threading | 15% | Relationships across departments | CRM contacts |
| Advocacy willingness | 10% | Reference calls, case studies, reviews | Reference program |

### Relationship Scoring Rules

| Metric | Score 100 | Score 75 | Score 50 | Score 25 | Score 0 |
|--------|-----------|----------|----------|----------|---------|
| Stakeholder depth | 5+ contacts across 3+ depts | 3–4 contacts, 2 depts | 2 contacts, 1 dept | 1 contact only | Contact has left/unresponsive |
| Champion strength | Active internal advocate, promotes tool | Supportive, uses regularly | Neutral, uses occasionally | Passive, rarely engages | No champion identified |
| Decision-maker access | Direct relationship, regular contact | Indirect access via champion | Known but no relationship | Unknown decision-maker | Decision-maker opposed |
| Multi-threading | 3+ departments engaged | 2 departments | 1 department, multiple teams | 1 team only | Single user |
| Advocacy | Active reference + case study | Willing to be reference | Gave positive review | Neutral, not willing | Negative sentiment |

---

## Automated Workflows

### Health-Triggered Actions

| Health Score | Trigger | Automated Action | Human Action |
|-------------|---------|-----------------|-------------|
| Drops below 70 | Score crosses threshold | Alert CSM via Slack | CSM reviews account within 24 hours |
| Drops below 55 | Score crosses threshold | Alert CSM + Manager | Manager-CSM strategy session within 48 hours |
| Drops below 40 | Score crosses threshold | Alert VP CS + CSM | Executive engagement within 72 hours |
| Drops > 15 points in 30 days | Rapid decline | Immediate alert to CSM + Manager | Same-day review |
| Rises above 85 | Score crosses threshold | Notify CSM + Marketing | Evaluate for reference program |
| Stable > 85 for 90 days | Sustained health | Notify CSM | Evaluate for expansion conversation |

### Intervention Playbooks

| Health Range | Playbook | Key Actions | Timeline |
|-------------|----------|-------------|----------|
| 55–69 (Yellow) | Proactive Outreach | Check-in call, usage review, identify blockers | 7 days |
| 40–54 (Orange) | Rescue Plan | Executive sponsor meeting, success plan, training offer | 14 days |
| 0–39 (Red) | Save Campaign | Executive escalation, custom offer, on-site visit | 7 days |

---

## Model Calibration

### Validation Methodology

| Method | Frequency | Purpose |
|--------|-----------|---------|
| Churn correlation analysis | Monthly | Verify score predicts actual churn |
| CSM override tracking | Monthly | Identify where model misses human insight |
| False positive/negative rate | Quarterly | Tune thresholds and weights |
| Cohort survival analysis | Quarterly | Validate score predicts retention curves |
| A/B test interventions | Quarterly | Prove interventions improve outcomes |

### Target Accuracy

| Metric | Target | Current |
|--------|--------|---------|
| Churn prediction (accounts scoring < 40 that actually churn within 90 days) | > 70% | Baseline TBD |
| False positive rate (accounts scoring < 40 that don't churn) | < 30% | Baseline TBD |
| Expansion prediction (accounts scoring > 85 that expand within 180 days) | > 50% | Baseline TBD |

---

*Document prepared by Manus AI for ARG-Builder customer success operations.*
