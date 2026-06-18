# ARG-Builder: Customer Health Scoring Model

## Predictive Framework for Identifying At-Risk Accounts and Expansion Opportunities

---

## 1. Executive Summary

Customer health scoring transforms reactive customer success into proactive account management. By combining product usage data, engagement signals, support patterns, and business outcomes into a single composite score, ARG-Builder's CS team can identify at-risk accounts before they churn and expansion-ready accounts before they ask. This document defines the complete health scoring methodology, data inputs, weighting model, and operational playbooks.

---

## 2. Health Score Architecture

### 2.1 Score Components

| Component | Weight | Description | Data Source |
|-----------|--------|-------------|-------------|
| Product usage | 35% | Depth and breadth of feature adoption | Product analytics |
| Engagement | 20% | Interaction with CS, marketing, community | CRM, email, events |
| Support health | 15% | Ticket volume, sentiment, resolution satisfaction | Help desk |
| Business outcomes | 20% | Value realization, ROI achievement | Customer reporting |
| Relationship | 10% | Champion strength, executive alignment | CSM assessment |

### 2.2 Scoring Scale

| Score Range | Health Status | Color | Meaning |
|-------------|-------------|-------|---------|
| 85–100 | Excellent | Green | Expansion-ready, advocate potential |
| 70–84 | Good | Light Green | Healthy, maintain engagement |
| 50–69 | Moderate | Yellow | Needs attention, some risk signals |
| 30–49 | At Risk | Orange | Significant risk, intervention required |
| 0–29 | Critical | Red | Imminent churn risk, executive escalation |

---

## 3. Component Details

### 3.1 Product Usage (35% Weight)

| Metric | Scoring | Max Points |
|--------|---------|-----------|
| Daily active users (% of licensed) | 0–20% = 0, 20–40% = 5, 40–60% = 10, 60–80% = 15, 80%+ = 20 | 20 |
| Feature breadth (% of features used) | 0–20% = 0, 20–40% = 3, 40–60% = 6, 60–80% = 9, 80%+ = 12 | 12 |
| Core feature depth (frequency of key actions) | Low = 0, Medium = 4, High = 8 | 8 |
| Usage trend (30-day vs. prior 30-day) | Declining > 20% = 0, Stable = 5, Growing = 10 | 10 |
| **Total** | | **50** |

**Normalized to 35 points maximum**

### 3.2 Engagement (20% Weight)

| Metric | Scoring | Max Points |
|--------|---------|-----------|
| CSM meeting attendance | No meetings = 0, Quarterly = 5, Monthly = 10 | 10 |
| Email open rate (CS communications) | < 20% = 0, 20–50% = 3, > 50% = 6 | 6 |
| Event/webinar participation | None = 0, 1–2/quarter = 4, 3+/quarter = 8 | 8 |
| Community participation | None = 0, Lurker = 2, Active = 4, Contributor = 6 | 6 |
| Executive engagement | None = 0, Annual = 5, Quarterly = 10 | 10 |
| **Total** | | **40** |

**Normalized to 20 points maximum**

### 3.3 Support Health (15% Weight)

| Metric | Scoring | Max Points |
|--------|---------|-----------|
| Ticket volume trend | Increasing = 0, Stable = 5, Decreasing = 10 | 10 |
| Ticket severity distribution | Mostly critical = 0, Mixed = 5, Mostly low = 8 | 8 |
| CSAT on resolved tickets | < 3 = 0, 3–4 = 5, > 4 = 8 | 8 |
| Open ticket age | > 7 days avg = 0, 3–7 days = 4, < 3 days = 6 | 6 |
| Escalation frequency | Frequent = 0, Occasional = 4, Rare = 8 | 8 |
| **Total** | | **40** |

**Normalized to 15 points maximum**

### 3.4 Business Outcomes (20% Weight)

| Metric | Scoring | Max Points |
|--------|---------|-----------|
| Stated goals achieved | 0% = 0, 25% = 3, 50% = 6, 75% = 9, 100% = 12 | 12 |
| Time-to-value achieved | Not yet = 0, Delayed = 4, On time = 8, Early = 10 | 10 |
| ROI demonstrated | Negative = 0, Break-even = 4, Positive = 8, Strong = 10 | 10 |
| Expansion signals | None = 0, Interest = 4, Active evaluation = 8 | 8 |
| **Total** | | **40** |

**Normalized to 20 points maximum**

### 3.5 Relationship (10% Weight)

| Metric | Scoring | Max Points |
|--------|---------|-----------|
| Champion strength | No champion = 0, Weak = 3, Strong = 6, Multiple = 10 | 10 |
| Executive sponsor | None = 0, Identified = 4, Engaged = 8 | 8 |
| Multi-threading | Single contact = 0, 2–3 contacts = 4, 4+ contacts = 8 | 8 |
| NPS/CSAT response | Detractor = 0, Passive = 5, Promoter = 8 | 8 |
| Renewal sentiment (CSM assessment) | Unlikely = 0, Uncertain = 3, Likely = 6 | 6 |
| **Total** | | **40** |

**Normalized to 10 points maximum**

---

## 4. Score Calculation

### 4.1 Formula

```
Health Score = (Product Usage Score / 50 × 35) + 
              (Engagement Score / 40 × 20) + 
              (Support Health Score / 40 × 15) + 
              (Business Outcomes Score / 40 × 20) + 
              (Relationship Score / 40 × 10)
```

### 4.2 Example Calculation

| Component | Raw Score | Max | Weighted Score |
|-----------|-----------|-----|---------------|
| Product Usage | 38 | 50 | 38/50 × 35 = 26.6 |
| Engagement | 28 | 40 | 28/40 × 20 = 14.0 |
| Support Health | 32 | 40 | 32/40 × 15 = 12.0 |
| Business Outcomes | 30 | 40 | 30/40 × 20 = 15.0 |
| Relationship | 30 | 40 | 30/40 × 10 = 7.5 |
| **Total** | | | **75.1 (Good)** |

### 4.3 Score Refresh Frequency

| Component | Refresh | Method |
|-----------|---------|--------|
| Product usage | Daily (automated) | Product analytics API |
| Engagement | Weekly (automated) | CRM + email + event data |
| Support health | Daily (automated) | Help desk API |
| Business outcomes | Monthly (CSM input) | QBR data + CSM assessment |
| Relationship | Monthly (CSM input) | CSM manual scoring |
| **Composite score** | **Weekly** | **Automated calculation** |

---

## 5. Operational Playbooks

### 5.1 Score-Based Actions

| Score Range | Status | CSM Action | Cadence | Escalation |
|-------------|--------|-----------|---------|-----------|
| 85–100 | Excellent | Expansion conversation, reference request, case study | Monthly touch | None |
| 70–84 | Good | Maintain engagement, identify growth opportunities | Bi-weekly touch | None |
| 50–69 | Moderate | Investigate declining signals, proactive outreach | Weekly touch | Manager awareness |
| 30–49 | At Risk | Intervention plan, executive alignment, save campaign | 2x/week touch | VP CS + Account Executive |
| 0–29 | Critical | Executive escalation, retention offer, save-or-learn | Daily touch | CEO + CRO involvement |

### 5.2 At-Risk Intervention Playbook

| Step | Timeline | Action | Owner |
|------|----------|--------|-------|
| 1 | Day 0 | Score drops below 50 — alert triggered | System |
| 2 | Day 1 | CSM reviews account, identifies root cause | CSM |
| 3 | Day 2 | Outreach to customer (call, not email) | CSM |
| 4 | Day 3 | Internal sync (CSM + AE + Manager) | CSM |
| 5 | Day 5 | Intervention plan created and shared with customer | CSM |
| 6 | Day 7 | Executive outreach (if score < 30) | VP CS or CEO |
| 7 | Day 14 | Progress check — is score improving? | CSM |
| 8 | Day 30 | Outcome assessment — saved or lost | CSM + Manager |

### 5.3 Expansion-Ready Playbook

| Signal | Action | Owner |
|--------|--------|-------|
| Score > 85 for 3+ months | Initiate expansion conversation | CSM + AE |
| Usage approaching plan limits | Proactive upgrade discussion | CSM |
| New use cases identified | Solution expansion proposal | CSM |
| Champion promoted | Executive alignment + broader rollout | CSM + AE |
| Multiple departments interested | Enterprise-wide proposal | AE + CSM |
| Customer requesting features in higher tier | Upgrade path discussion | CSM |

---

## 6. Alert System

### 6.1 Alert Triggers

| Alert | Trigger | Severity | Notification |
|-------|---------|----------|-------------|
| Score drop | > 10 point drop in 7 days | High | CSM + Manager (Slack + email) |
| Critical threshold | Score drops below 30 | Critical | VP CS + CEO (Slack + email + SMS) |
| Usage cliff | DAU drops > 50% in 7 days | High | CSM + Manager |
| Champion departure | Primary contact leaves company | Critical | CSM + AE + Manager |
| Support spike | 3x normal ticket volume in 7 days | Medium | CSM |
| Engagement drop | No CSM interaction in 45 days | Medium | CSM |
| Renewal risk | Score < 50 within 90 days of renewal | Critical | VP CS + AE |
| Expansion signal | Score > 85 + usage > 80% of plan | Low (positive) | CSM + AE |

### 6.2 Alert Response SLAs

| Severity | Response Time | Resolution Plan | Escalation |
|----------|--------------|----------------|-----------|
| Critical | < 4 hours | Same day | VP CS immediately |
| High | < 24 hours | Within 48 hours | Manager within 24 hours |
| Medium | < 48 hours | Within 1 week | Manager if unresolved in 1 week |
| Low (positive) | < 1 week | Within 2 weeks | None |

---

## 7. Segmentation & Benchmarks

### 7.1 Health by Segment

| Segment | Target Health Score | Acceptable Range | Red Flag |
|---------|-------------------|-----------------|----------|
| Enterprise (> $100K ACV) | > 80 | 70–100 | < 60 |
| Mid-Market ($25K–$100K) | > 75 | 65–100 | < 55 |
| SMB (< $25K) | > 70 | 60–100 | < 50 |
| New customers (< 90 days) | > 60 (building) | 50–100 | < 40 |

### 7.2 Health Distribution Targets

| Distribution | Target | Current (Example) |
|-------------|--------|------------------|
| Excellent (85–100) | > 30% of accounts | 22% |
| Good (70–84) | > 35% of accounts | 38% |
| Moderate (50–69) | < 25% of accounts | 28% |
| At Risk (30–49) | < 8% of accounts | 9% |
| Critical (0–29) | < 2% of accounts | 3% |

### 7.3 Health-to-Outcome Correlation

| Health Score | Renewal Rate | Expansion Rate | NPS |
|-------------|-------------|---------------|-----|
| 85–100 | 98% | 45% | 72 |
| 70–84 | 94% | 25% | 55 |
| 50–69 | 78% | 10% | 32 |
| 30–49 | 52% | 2% | 8 |
| 0–29 | 20% | 0% | -25 |

---

## 8. Data Infrastructure

### 8.1 Data Sources

| Source | Data | Integration | Refresh |
|--------|------|-------------|---------|
| Product analytics (Mixpanel/Amplitude) | Usage metrics, feature adoption | API | Real-time |
| CRM (Salesforce/HubSpot) | Account data, contacts, opportunities | API | Real-time |
| Help desk (Intercom/Zendesk) | Tickets, CSAT, resolution time | API | Real-time |
| Email (HubSpot/Outreach) | Open rates, click rates, responses | API | Daily |
| NPS tool (Delighted/AskNicely) | NPS scores, verbatim feedback | API | Real-time |
| CSM input | Relationship scores, qualitative assessment | Manual (monthly) | Monthly |
| Billing (Stripe) | Payment status, plan, usage | API | Real-time |
| Calendar (Google/Outlook) | Meeting frequency, attendance | API | Daily |

### 8.2 Technology Stack

| Layer | Tool Options | Purpose |
|-------|-------------|---------|
| Data warehouse | Snowflake, BigQuery | Central data store |
| ETL/Integration | Fivetran, Airbyte | Data ingestion |
| Customer success platform | Gainsight, Totango, ChurnZero | Health scoring engine |
| Visualization | Looker, Tableau | Dashboards and reporting |
| Alerting | PagerDuty, Slack integrations | Real-time notifications |
| CRM | Salesforce, HubSpot | Account management |

### 8.3 Implementation Phases

| Phase | Timeline | Deliverable |
|-------|----------|-------------|
| 1 | Month 1–2 | Manual health scoring (spreadsheet), define metrics |
| 2 | Month 3–4 | Automated product usage scoring, basic alerts |
| 3 | Month 5–6 | Full automated scoring, CS platform integration |
| 4 | Month 7–8 | Predictive modeling, expansion signals |
| 5 | Month 9–12 | ML-based scoring, continuous improvement |

---

## 9. Reporting & Governance

### 9.1 Reporting Cadence

| Report | Frequency | Audience | Content |
|--------|-----------|----------|---------|
| Health dashboard | Real-time | CS team | Individual account scores |
| Weekly health digest | Weekly | CS leadership | Score changes, alerts, actions |
| Monthly health report | Monthly | Executive team | Distribution, trends, at-risk accounts |
| Quarterly health review | Quarterly | Board | Retention correlation, predictive accuracy |

### 9.2 Model Governance

| Activity | Frequency | Purpose |
|----------|-----------|---------|
| Weight validation | Quarterly | Ensure weights correlate with outcomes |
| Metric relevance review | Semi-annual | Add/remove metrics based on predictive power |
| Score calibration | Quarterly | Compare scores to actual renewal outcomes |
| CSM feedback collection | Monthly | Qualitative input on model accuracy |
| Predictive accuracy measurement | Quarterly | % of at-risk accounts that actually churned |

### 9.3 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Predictive accuracy (churn) | > 80% | At-risk accounts that churned within 90 days |
| Predictive accuracy (expansion) | > 60% | Excellent accounts that expanded within 6 months |
| False positive rate | < 15% | Accounts flagged at-risk that renewed healthy |
| CSM confidence in scores | > 4/5 | Quarterly survey |
| Time to intervention | < 48 hours from alert | Alert-to-action tracking |
| Save rate (at-risk accounts) | > 50% | Saved / total at-risk |

---

## 10. Continuous Improvement

### 10.1 Model Evolution

| Stage | Approach | Accuracy Target |
|-------|----------|----------------|
| V1 (Manual) | Rule-based scoring, CSM input heavy | 60% predictive |
| V2 (Automated) | Data-driven scoring, automated refresh | 70% predictive |
| V3 (Predictive) | ML model trained on historical data | 80% predictive |
| V4 (Prescriptive) | AI recommends specific interventions | 85% predictive + action recommendations |

### 10.2 Feedback Loops

| Loop | Input | Output | Frequency |
|------|-------|--------|-----------|
| Outcome validation | Actual churn/expansion vs. predicted | Weight adjustments | Quarterly |
| CSM override tracking | CSM disagrees with score | Metric refinement | Monthly |
| New signal discovery | Patterns in churned/expanded accounts | New metrics added | Quarterly |
| Threshold optimization | Score-to-outcome correlation | Threshold adjustments | Semi-annual |

---

*Document prepared by Manus AI. Customer health scoring model designed for ARG-Builder proactive customer success and revenue protection.*
