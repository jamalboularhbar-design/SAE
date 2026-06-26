# ARG-Builder: Customer Data Platform Architecture

## Unified Customer Intelligence for Personalization, Retention, and Growth

---

## 1. Executive Summary

A Customer Data Platform (CDP) unifies all customer data — behavioral, transactional, and demographic — into a single, actionable view. For ARG-Builder, the CDP powers personalized experiences, predictive churn models, expansion triggers, and data-driven decision-making across every customer-facing team. This document defines the architecture, data model, integrations, and use cases.

---

## 2. CDP Architecture Overview

### 2.1 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATA SOURCES                               │
├──────────┬──────────┬──────────┬──────────┬──────────┬──────────┤
│ Product  │ Sales    │ Marketing│ Support  │ Billing  │ External │
│ (Events) │ (CRM)   │ (MAP)    │ (Tickets)│ (Stripe) │ (Enrich) │
└────┬─────┴────┬─────┴────┬─────┴────┬─────┴────┬─────┴────┬─────┘
     │          │          │          │          │          │
     ▼          ▼          ▼          ▼          ▼          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    INGESTION LAYER                                │
│  (Event streaming: Kafka/Segment | Batch: ETL pipelines)         │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    UNIFIED DATA STORE                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ Identity     │  │ Event       │  │ Profile     │            │
│  │ Resolution   │  │ Store       │  │ Store       │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    INTELLIGENCE LAYER                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ Segmentation│  │ Predictive  │  │ Scoring     │            │
│  │ Engine      │  │ Models      │  │ Engine      │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ACTIVATION LAYER                               │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐            │
│  │Email │  │In-App│  │Sales │  │Ads   │  │Custom│            │
│  │      │  │      │  │Alerts│  │      │  │      │            │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘            │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Data Model

**Core Entities:**

| Entity | Description | Key Attributes |
|--------|-------------|---------------|
| Account | Company/organization | Name, industry, size, plan, ARR, health score |
| User | Individual person | Name, email, role, last active, feature usage |
| Event | Behavioral action | Type, timestamp, properties, user_id, account_id |
| Subscription | Billing relationship | Plan, MRR, start date, renewal date, status |
| Interaction | Human touchpoint | Type (call, email, meeting), date, outcome, owner |
| Ticket | Support request | Priority, category, resolution time, satisfaction |

### 2.3 Identity Resolution

| Method | Description | Confidence |
|--------|-------------|-----------|
| Email match | Same email across systems | 99% |
| Domain match | Same company domain | 90% |
| Cookie/device ID | Browser fingerprinting | 85% |
| IP + behavior | Same IP with similar patterns | 70% |
| Manual merge | Human-verified linkage | 100% |

---

## 3. Data Sources & Integration

### 3.1 Source Systems

| Source | Data Type | Integration | Frequency |
|--------|-----------|-------------|-----------|
| ARG-Builder product | Usage events, feature adoption | Event stream (real-time) | Real-time |
| Salesforce/HubSpot | Deals, contacts, activities | API sync | Every 15 min |
| Stripe | Subscriptions, invoices, payments | Webhook | Real-time |
| Intercom/Zendesk | Tickets, conversations, CSAT | API sync | Every 15 min |
| Customer.io/Iterable | Email engagement, campaigns | Webhook | Real-time |
| Google Analytics | Website behavior, attribution | API | Daily |
| LinkedIn/ZoomInfo | Firmographic enrichment | API | Weekly |
| NPS/Survey tools | Satisfaction scores, feedback | Webhook | Real-time |
| Gong/Chorus | Call recordings, sentiment | API | Daily |

### 3.2 Event Taxonomy

**Product Events (examples):**

| Event Name | Properties | Significance |
|-----------|-----------|-------------|
| `guide.generated` | guide_type, word_count, time_taken | Core value delivery |
| `guide.shared` | recipient_count, share_method | Viral/expansion signal |
| `search.performed` | query, results_count, clicked | Engagement depth |
| `feature.used` | feature_name, duration, frequency | Adoption tracking |
| `integration.connected` | integration_type, status | Stickiness indicator |
| `user.invited` | inviter_id, role_assigned | Expansion signal |
| `export.completed` | format, page_count | Value extraction |
| `ai.feedback` | rating, comment, guide_id | Quality signal |

### 3.3 Data Quality Framework

| Dimension | Definition | Target | Measurement |
|-----------|-----------|--------|-------------|
| Completeness | % of required fields populated | > 95% | Automated audit |
| Accuracy | % of data verified as correct | > 98% | Sampling + validation |
| Timeliness | Latency from event to availability | < 5 min (real-time), < 1 hr (batch) | Pipeline monitoring |
| Consistency | Same data across systems | > 99% | Cross-system reconciliation |
| Uniqueness | No duplicate records | > 99.5% | Deduplication checks |

---

## 4. Customer Intelligence Models

### 4.1 Health Score Model

| Signal | Weight | Data Source | Scoring |
|--------|--------|-------------|---------|
| Product usage (DAU/MAU) | 25% | Product events | 0–100 based on percentile |
| Feature adoption breadth | 15% | Product events | Features used / total available |
| Support sentiment | 15% | Tickets + CSAT | Weighted satisfaction |
| Engagement trend | 15% | Product + email | Improving vs. declining |
| NPS score | 10% | Survey | Direct score |
| Contract status | 10% | Billing | Days to renewal, payment history |
| Stakeholder engagement | 10% | CRM + product | Multi-user activity |

**Health Score Tiers:**

| Score | Status | Action |
|-------|--------|--------|
| 80–100 | Healthy (Green) | Expansion opportunity |
| 60–79 | Stable (Yellow) | Monitor, proactive check-in |
| 40–59 | At Risk (Orange) | Intervention required |
| 0–39 | Critical (Red) | Immediate escalation |

### 4.2 Churn Prediction Model

**Input Features:**

| Feature | Type | Predictive Power |
|---------|------|-----------------|
| Login frequency trend (30d) | Behavioral | High |
| Feature usage decline | Behavioral | High |
| Support ticket volume spike | Interaction | Medium |
| NPS score drop | Sentiment | High |
| Champion departure | Relationship | Very High |
| Payment failure | Financial | Medium |
| Competitor evaluation signals | Intent | Very High |
| Contract renewal proximity | Temporal | Medium |

**Model Output:**
- Churn probability (0–100%)
- Churn risk factors (ranked)
- Recommended interventions
- Estimated time to churn

### 4.3 Expansion Propensity Model

**Input Features:**

| Feature | Type | Signal Strength |
|---------|------|----------------|
| Seat utilization > 80% | Usage | Strong |
| Feature limit approaching | Usage | Strong |
| Cross-department usage | Behavioral | Very Strong |
| High NPS + engagement | Sentiment | Strong |
| Company growth signals | External | Medium |
| Champion promoted | Relationship | Strong |
| QBR positive outcome | Interaction | Medium |

**Model Output:**
- Expansion probability (0–100%)
- Recommended expansion vector (seats, tier, department)
- Optimal timing
- Estimated expansion value

---

## 5. Segmentation Engine

### 5.1 Segmentation Dimensions

| Dimension | Segments | Use Case |
|-----------|----------|----------|
| Lifecycle stage | Trial, Onboarding, Active, Mature, At-risk, Churned | Lifecycle marketing |
| Plan tier | Starter, Professional, Enterprise | Feature gating, pricing |
| Industry | Professional services, Financial, Healthcare, Tech | Vertical messaging |
| Company size | SMB, Mid-market, Enterprise | Sales motion, content |
| Engagement level | Power user, Regular, Light, Dormant | Activation campaigns |
| Health status | Green, Yellow, Orange, Red | CS prioritization |
| Expansion readiness | Hot, Warm, Developing, Not ready | Expansion targeting |
| Feature cohort | AI-heavy, Integration-focused, Basic | Product development |

### 5.2 Dynamic Segments (Real-Time)

| Segment | Definition | Trigger Action |
|---------|-----------|---------------|
| "About to churn" | Health < 40 + declining usage | CS escalation |
| "Ready to expand" | Expansion score > 80 | AE notification |
| "Onboarding stuck" | Day 7+ with < 3 key actions | CSM intervention |
| "Power users" | DAU + 5+ features used daily | Advocacy recruitment |
| "Feature discoverers" | Used new feature within 48 hrs | Feedback request |
| "Payment at risk" | Failed payment + no update | Finance outreach |

---

## 6. Activation & Orchestration

### 6.1 Automated Workflows

| Trigger | Condition | Action | Channel | Owner |
|---------|-----------|--------|---------|-------|
| Health score drops below 60 | Previously > 60 | Alert CSM + auto-schedule check-in | Slack + email | CS |
| Expansion score > 80 | Sustained 7+ days | Create expansion opportunity in CRM | CRM | Sales |
| User inactive 14 days | Previously active weekly | Re-engagement email sequence | Email | Marketing |
| NPS detractor submitted | Score 0–6 | Immediate CSM outreach | Email + Slack | CS |
| Feature limit hit (3x) | Same feature, same month | In-app upgrade prompt + CSM alert | In-app + Slack | Product + CS |
| New user added | First login | Onboarding sequence triggered | Email + in-app | Product |
| Contract renewal 90 days | Auto-trigger | Renewal prep workflow | CRM + email | CS |

### 6.2 Personalization Engine

| Context | Personalization | Data Used |
|---------|----------------|-----------|
| In-app experience | Feature recommendations based on usage | Event history |
| Email content | Industry-specific content and case studies | Firmographic |
| Sales outreach | Trigger-based messaging | Intent signals |
| Support routing | Priority based on health + tier | Health score + plan |
| Product roadmap | Feature voting weighted by segment | Segment + ARR |
| Pricing | Dynamic packaging based on usage | Usage patterns |

---

## 7. Privacy & Compliance

### 7.1 Data Governance

| Principle | Implementation |
|-----------|---------------|
| Data minimization | Collect only what's needed for defined use cases |
| Purpose limitation | Data used only for stated purposes |
| Consent management | Explicit consent for marketing, implied for product |
| Right to deletion | Automated deletion workflows |
| Data retention | Defined retention periods by data type |
| Access controls | Role-based access to customer data |
| Audit trail | All data access logged |

### 7.2 Retention Policies

| Data Type | Retention Period | After Expiry |
|-----------|-----------------|-------------|
| Product events | 24 months | Aggregated, raw deleted |
| Support tickets | 36 months | Archived |
| Billing data | 7 years | Required by law |
| Marketing engagement | 24 months | Deleted |
| Enrichment data | 12 months | Refreshed or deleted |
| Aggregated analytics | Indefinite | No PII |

---

## 8. Technology Stack

### 8.1 Recommended Tools

| Layer | Tool Options | Selection Criteria |
|-------|-------------|-------------------|
| CDP Platform | Segment, RudderStack, mParticle | Scale, integrations, cost |
| Data Warehouse | Snowflake, BigQuery, Redshift | Query performance, cost |
| Event Streaming | Kafka, AWS Kinesis | Throughput, latency |
| ML/Predictions | Python (scikit-learn), SageMaker | Model complexity |
| Orchestration | Airflow, Dagster | Pipeline reliability |
| Visualization | Looker, Metabase, Tableau | Self-serve analytics |
| Activation | Customer.io, Iterable, Braze | Multi-channel orchestration |

### 8.2 Build vs. Buy Decision

| Component | Recommendation | Rationale |
|-----------|---------------|-----------|
| Event collection | Buy (Segment/RudderStack) | Commodity, fast to implement |
| Data warehouse | Buy (Snowflake) | Best-in-class, managed |
| Identity resolution | Build (custom) | Competitive advantage |
| Health scoring | Build (custom) | Domain-specific logic |
| Churn prediction | Build (custom) | Proprietary advantage |
| Activation/orchestration | Buy (Customer.io) | Complex to build, fast to deploy |
| Dashboards | Buy (Looker/Metabase) | Commodity, self-serve |

---

## 9. Implementation Roadmap

### 9.1 Phase 1: Foundation (Months 1–3)

- Implement event tracking (Segment/RudderStack)
- Set up data warehouse (Snowflake)
- Build unified customer profile (basic)
- Create health score v1 (rule-based)
- Dashboard for CS team

### 9.2 Phase 2: Intelligence (Months 4–6)

- Build churn prediction model v1
- Implement expansion scoring
- Dynamic segmentation engine
- Automated CS alerts
- Marketing personalization (basic)

### 9.3 Phase 3: Activation (Months 7–9)

- Multi-channel orchestration
- In-app personalization
- Predictive models v2 (ML-based)
- Self-serve analytics for all teams
- A/B testing infrastructure

### 9.4 Phase 4: Optimization (Months 10–12)

- Advanced ML models (deep learning)
- Real-time personalization
- Cross-channel attribution
- Revenue impact measurement
- Continuous model improvement

---

## 10. Success Metrics

| Metric | Baseline | Target (12 months) |
|--------|----------|-------------------|
| Churn prediction accuracy | N/A | > 80% (30-day lookahead) |
| Expansion revenue influenced by CDP | 0% | > 40% |
| CS intervention success rate | 50% | > 75% |
| Time to detect at-risk customer | 30 days | < 7 days |
| Personalization lift (email CTR) | Baseline | +40% |
| Data completeness | 70% | > 95% |
| Cross-team data usage | 2 teams | All teams |
