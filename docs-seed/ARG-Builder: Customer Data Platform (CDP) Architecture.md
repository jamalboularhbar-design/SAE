# ARG-Builder: Customer Data Platform (CDP) Architecture

## Executive Summary

This document defines ARG-Builder's Customer Data Platform architecture — the unified data model, event tracking system, segmentation engine, and personalization framework that creates a 360-degree view of every customer. The CDP enables data-driven decision-making across marketing, sales, customer success, and product teams by consolidating all customer interactions into a single, actionable data layer.

---

## CDP Architecture Overview

### Data Flow

| Layer | Components | Purpose |
|-------|-----------|---------|
| Collection | SDKs, APIs, webhooks, imports | Capture events from all touchpoints |
| Unification | Identity resolution, deduplication | Create single customer profile |
| Storage | Data warehouse + real-time store | Persist and query customer data |
| Activation | Segmentation, personalization, triggers | Drive actions from data |
| Intelligence | Analytics, predictions, recommendations | Generate insights |

---

## Unified Customer Data Model

### Customer Profile Schema

| Category | Fields | Source |
|----------|--------|--------|
| Identity | customer_id, company_id, email, name, role, title | CRM + signup |
| Company | name, industry, size, revenue, location, tech_stack | Enrichment (Clearbit) |
| Subscription | plan, MRR, contract_start, contract_end, seats | Billing system |
| Usage | DAU, MAU, features_used, session_duration, last_active | Product analytics |
| Engagement | emails_opened, meetings_attended, support_tickets | CRM + support |
| Health | health_score, risk_level, expansion_signals | Calculated |
| Journey | lifecycle_stage, days_as_customer, milestones_achieved | Calculated |
| Preferences | communication_preference, timezone, language | Self-reported |

### Event Taxonomy

| Category | Event Name | Properties | Trigger |
|----------|-----------|------------|---------|
| Account | account.created | plan, source, referrer | Signup |
| Account | account.upgraded | old_plan, new_plan, MRR_change | Plan change |
| Account | account.churned | reason, last_active, health_score | Cancellation |
| Usage | guide.created | guide_id, persona_count, method | Guide creation |
| Usage | guide.viewed | guide_id, viewer_role, duration | Guide access |
| Usage | search.performed | query, results_count, clicked | Search use |
| Usage | feature.used | feature_name, duration, frequency | Feature interaction |
| Engagement | email.opened | campaign_id, subject, segment | Email open |
| Engagement | meeting.attended | type, duration, attendees | Calendar |
| Engagement | support.ticket_created | priority, category, sentiment | Support |
| Milestone | onboarding.completed | days_to_complete, steps_completed | Onboarding |
| Milestone | first_value.achieved | metric, value, days_to_achieve | Value realization |

---

## Identity Resolution

### Identity Graph

| Identifier Type | Priority | Source | Example |
|----------------|----------|--------|---------|
| Customer ID | Primary | Internal system | cust_abc123 |
| Email | Secondary | Signup, CRM | user@company.com |
| Company domain | Tertiary | Enrichment | company.com |
| Anonymous ID | Temporary | Cookie/device | anon_xyz789 |

### Resolution Rules

| Scenario | Resolution Logic |
|----------|-----------------|
| Same email, different devices | Merge into single profile |
| Same company domain, different users | Link to same account, separate user profiles |
| Anonymous → identified | Merge anonymous history into identified profile |
| Duplicate emails (typo) | Flag for manual review |
| Employee changes company | Create new profile, archive old |

---

## Segmentation Engine

### Segment Types

| Type | Definition | Example | Use Case |
|------|-----------|---------|----------|
| Static | Manually defined list | "Enterprise pilot customers" | Targeted outreach |
| Dynamic | Rule-based, auto-updating | "Health score < 50 AND contract renewal < 90 days" | Automated interventions |
| Predictive | ML-based probability | "Likely to expand in next 30 days" | Proactive CS |
| Behavioral | Event-based patterns | "Used search > 10x this week" | Product-led triggers |

### Key Segments

| Segment | Criteria | Size (Est.) | Action |
|---------|----------|-------------|--------|
| At-risk accounts | Health < 50, declining usage | 10–15% | CS intervention |
| Expansion ready | Health > 80, hitting usage limits | 15–20% | Expansion outreach |
| Champions | High usage, positive sentiment, refers others | 10–15% | Advocacy program |
| Dormant users | No login in 14+ days | 20–30% | Re-engagement campaign |
| Power users | Top 10% by feature breadth | 10% | Beta program, feedback |
| New accounts (< 30 days) | Recently signed | Variable | Onboarding nurture |

---

## Personalization Framework

### Personalization Layers

| Layer | What's Personalized | Data Used | Impact |
|-------|-------------------|-----------|--------|
| In-app experience | Feature recommendations, tips | Usage patterns, role | +25% feature adoption |
| Email communication | Content, timing, frequency | Engagement history | +40% open rates |
| Onboarding flow | Steps, content, pace | Company size, industry | -30% time to value |
| Support | Priority, routing, context | Health score, plan, history | +20% CSAT |
| Sales outreach | Messaging, timing, channel | Behavioral signals | +35% response rate |

### Personalization Rules Engine

| Trigger | Condition | Action | Channel |
|---------|-----------|--------|---------|
| New feature released | User's role matches feature | Show in-app announcement | Product |
| Usage decline (3 days) | Previously active user | Send re-engagement email | Email |
| Approaching usage limit | > 80% of plan limit | Trigger expansion conversation | CS + email |
| Onboarding milestone missed | Day 7, step 3 not complete | Send help content + CSM alert | Email + CS |
| High engagement spike | 3x normal usage in 1 day | Flag as expansion signal | CS dashboard |

---

## Real-Time Data Processing

### Event Processing Pipeline

| Component | Technology | Purpose | Latency |
|-----------|-----------|---------|---------|
| Event ingestion | Apache Kafka | Receive and buffer events | < 100ms |
| Stream processing | Apache Flink | Real-time transformations | < 1 second |
| Real-time store | Redis | Power real-time personalization | < 10ms |
| Batch processing | Apache Spark | Historical analysis, ML training | Hours |
| Data warehouse | Snowflake | Long-term storage, complex queries | Seconds–minutes |

### Real-Time Triggers

| Trigger | Latency Requirement | Action |
|---------|-------------------|--------|
| Health score drops below threshold | < 5 minutes | Alert CSM via Slack |
| User hits usage limit | < 1 minute | Show upgrade prompt |
| New user first login | < 30 seconds | Start onboarding flow |
| Support ticket (high priority) | < 1 minute | Route to senior agent |
| Expansion signal detected | < 15 minutes | Add to expansion queue |

---

## Analytics & Reporting

### Standard Dashboards

| Dashboard | Audience | Key Metrics | Refresh |
|-----------|----------|-------------|---------|
| Customer Health Overview | CS Leadership | Health distribution, trends, at-risk count | Real-time |
| Product Usage | Product Team | DAU/MAU, feature adoption, retention curves | Daily |
| Revenue Intelligence | RevOps | Pipeline health, expansion signals, churn risk | Daily |
| Marketing Attribution | Marketing | Channel performance, segment engagement | Daily |
| Executive Summary | C-Suite | ARR, NRR, health, adoption | Weekly |

### Self-Serve Analytics

| Capability | Implementation | User |
|-----------|---------------|------|
| Custom segments | Drag-and-drop segment builder | Marketing, CS |
| Ad-hoc queries | SQL interface (Metabase) | Analysts, RevOps |
| Cohort analysis | Pre-built cohort templates | Product, CS |
| Funnel analysis | Visual funnel builder | Marketing, Product |
| Export | CSV, API, scheduled reports | All teams |

---

## Data Governance & Privacy

### Data Policies

| Policy | Implementation |
|--------|---------------|
| Retention | 2 years active, 5 years archived, then deleted |
| Access control | Role-based, need-to-know, audit logged |
| Consent management | Granular opt-in/out per data use category |
| Right to deletion | Automated deletion pipeline (< 30 days) |
| Data portability | Customer can export all their data (JSON/CSV) |
| Cross-border | Data residency options (US, EU) |

---

*Document prepared by Manus AI for ARG-Builder customer data platform architecture.*
