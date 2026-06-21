# ARG-Builder: Data Infrastructure & Warehouse Architecture

## Blueprint for Building a Scalable, Governed Data Platform That Powers Every Business Decision

---

## 1. Executive Summary

Data infrastructure is the invisible backbone that powers product analytics, revenue forecasting, customer health scoring, marketing attribution, and AI/ML capabilities. A poorly designed data stack creates silos, inconsistencies, and bottlenecks that compound as the company scales. This document defines ARG-Builder's complete data architecture — from ingestion through transformation to consumption — ensuring every team operates from a single source of truth with sub-minute latency where needed and cost-efficient batch processing everywhere else.

---

## 2. Architecture Overview

### 2.1 Data Stack Components

| Layer | Purpose | Technology | Refresh |
|-------|---------|-----------|---------|
| Sources | Raw data generation | Product (Postgres), Stripe, HubSpot, Mixpanel, Intercom | Real-time |
| Ingestion | Extract and load raw data | Fivetran (SaaS), Custom CDC (product DB), Segment (events) | 5 min – 6 hours |
| Storage | Central data lake/warehouse | Snowflake OR BigQuery | Continuous |
| Transformation | Model, clean, enrich | dbt (SQL-based transformations) | Hourly – daily |
| Orchestration | Schedule and monitor pipelines | Dagster OR Airflow | Event + schedule |
| Serving | Deliver data to consumers | Reverse ETL (Census/Hightouch), APIs, BI | Near real-time – daily |
| Consumption | Business intelligence, analytics | Metabase/Looker, Python notebooks, operational tools | On-demand |
| Governance | Quality, lineage, access | dbt tests, Monte Carlo, catalog | Continuous |

### 2.2 Data Flow Architecture

| Flow | Source → Destination | Method | Latency |
|------|---------------------|--------|---------|
| Product events → Warehouse | App → Segment → Snowflake | Event streaming | < 5 minutes |
| Product database → Warehouse | Postgres → Fivetran → Snowflake | CDC (change data capture) | 5–15 minutes |
| CRM data → Warehouse | HubSpot → Fivetran → Snowflake | API sync | 6 hours |
| Billing data → Warehouse | Stripe → Fivetran → Snowflake | Webhook + API | 15 minutes |
| Support data → Warehouse | Intercom → Fivetran → Snowflake | API sync | 6 hours |
| Warehouse → CRM | Snowflake → Census → HubSpot | Reverse ETL | 1 hour |
| Warehouse → Product | Snowflake → API → App | Custom API | On-demand |
| Warehouse → BI | Snowflake → Metabase | Direct query | Real-time |

---

## 3. Data Modeling

### 3.1 Modeling Layers (dbt)

| Layer | Purpose | Naming Convention | Examples |
|-------|---------|-------------------|----------|
| Sources | Raw data references | `src_{source}_{table}` | src_stripe_subscriptions |
| Staging | Clean, rename, type-cast | `stg_{source}_{entity}` | stg_stripe__subscriptions |
| Intermediate | Business logic joins | `int_{domain}_{description}` | int_revenue__subscription_periods |
| Marts | Business-ready models | `{domain}__{entity}` | finance__mrr_movements |
| Metrics | Pre-aggregated KPIs | `metrics__{metric_name}` | metrics__daily_arr |

### 3.2 Core Data Models

| Domain | Key Models | Business Questions Answered |
|--------|-----------|---------------------------|
| Revenue | mrr_movements, arr_waterfall, cohort_retention | ARR, NRR, churn, expansion |
| Product | user_activity, feature_adoption, session_metrics | DAU/WAU/MAU, feature usage, engagement |
| Sales | pipeline_snapshots, deal_velocity, forecast | Pipeline, conversion, forecast accuracy |
| Marketing | attribution_touches, campaign_performance, funnel | CAC, channel ROI, conversion |
| Customer Success | health_scores, nps_responses, support_tickets | Health, satisfaction, risk |
| Finance | revenue_recognition, cash_flow, unit_economics | GAAP revenue, burn, LTV/CAC |

### 3.3 Key Dimension Tables

| Dimension | Grain | Key Attributes |
|-----------|-------|---------------|
| dim_accounts | One row per customer account | Name, segment, industry, ACV, status, CSM |
| dim_users | One row per user | Email, role, account, created_at, last_active |
| dim_subscriptions | One row per subscription period | Plan, start, end, MRR, seats |
| dim_dates | One row per calendar day | Date, week, month, quarter, fiscal period |
| dim_features | One row per product feature | Name, category, release_date |

### 3.4 Key Fact Tables

| Fact | Grain | Key Measures |
|------|-------|-------------|
| fct_events | One row per product event | Event type, user, timestamp, properties |
| fct_mrr_movements | One row per MRR change | Movement type (new, expansion, churn), amount |
| fct_deals | One row per deal stage change | Stage, amount, probability, close_date |
| fct_support_tickets | One row per ticket | Priority, resolution_time, satisfaction |
| fct_sessions | One row per user session | Duration, pages, actions, device |

---

## 4. Data Quality & Testing

### 4.1 Testing Framework

| Test Type | Tool | Scope | Frequency |
|-----------|------|-------|-----------|
| Schema tests | dbt tests | All models | Every run |
| Not null | dbt tests | Critical columns | Every run |
| Unique | dbt tests | Primary keys | Every run |
| Accepted values | dbt tests | Enum columns | Every run |
| Referential integrity | dbt tests | Foreign keys | Every run |
| Freshness | dbt source freshness | All sources | Hourly |
| Volume anomaly | Monte Carlo / Elementary | All tables | Continuous |
| Distribution anomaly | Monte Carlo / Elementary | Key metrics | Continuous |
| Custom business rules | dbt tests (custom SQL) | Revenue, health scores | Every run |

### 4.2 Data Quality SLAs

| Data Domain | Freshness SLA | Accuracy Target | Completeness Target |
|-------------|--------------|----------------|-------------------|
| Revenue/billing | < 1 hour | 99.9% | 100% |
| Product events | < 15 minutes | 99% | 99.5% |
| CRM/pipeline | < 6 hours | 98% | 99% |
| Marketing | < 24 hours | 95% | 98% |
| Support | < 6 hours | 98% | 99% |
| Financial reporting | < 24 hours | 99.99% | 100% |

### 4.3 Data Incident Response

| Severity | Definition | Response Time | Resolution Time |
|----------|-----------|--------------|----------------|
| P0 | Revenue data incorrect, board reporting affected | 15 minutes | 2 hours |
| P1 | Customer-facing data wrong, operational decisions impacted | 1 hour | 4 hours |
| P2 | Internal reporting delayed or inaccurate | 4 hours | 24 hours |
| P3 | Non-critical data quality issue | 24 hours | 1 week |

---

## 5. Access & Governance

### 5.1 Data Access Model

| Role | Access Level | Data Domains | Tool Access |
|------|-------------|-------------|-------------|
| Executive | Full (aggregated) | All domains | BI dashboards |
| Data team | Full (raw + modeled) | All domains | Warehouse + BI + notebooks |
| Engineering | Read (product data) | Product, events | Warehouse (read-only) |
| Sales | Curated views | Pipeline, accounts, revenue | BI + CRM |
| Marketing | Curated views | Marketing, attribution | BI + marketing tools |
| CS | Curated views | Health, accounts, support | BI + CS platform |
| Finance | Full (financial) | Revenue, billing, forecasts | BI + spreadsheets |

### 5.2 Data Classification

| Classification | Examples | Access | Encryption | Retention |
|---------------|----------|--------|-----------|-----------|
| Public | Marketing metrics, blog stats | Anyone | Standard | Indefinite |
| Internal | Product metrics, pipeline | All employees | Standard | 3 years |
| Confidential | Revenue, compensation, customer PII | Role-based | Enhanced | Per policy |
| Restricted | SSN, payment cards, health data | Named individuals | Maximum | Minimum required |

### 5.3 PII Handling

| PII Type | Storage | Access | Masking | Deletion |
|----------|---------|--------|---------|----------|
| Email addresses | Hashed in analytics, plain in operational | Role-based | Masked in BI | On request (GDPR) |
| Names | Plain in operational, pseudonymized in analytics | Role-based | Masked in BI | On request |
| IP addresses | Truncated in analytics | Data team only | Always masked | 90-day retention |
| Payment info | Never in warehouse | Stripe only | N/A | Stripe manages |
| Usage data | Aggregated for analytics | Broad access (aggregated) | N/A | 2 years |

---

## 6. Real-Time vs. Batch

### 6.1 Processing Strategy

| Use Case | Latency Requirement | Processing Mode | Technology |
|----------|-------------------|----------------|-----------|
| Product analytics (dashboards) | < 5 minutes | Near real-time | Segment → Snowflake streaming |
| Revenue metrics | < 1 hour | Micro-batch | Fivetran (15-min sync) + dbt |
| Customer health scores | < 1 hour | Micro-batch | dbt + reverse ETL |
| Marketing attribution | < 24 hours | Batch | Daily dbt run |
| Financial reporting | < 24 hours | Batch | Daily dbt run |
| AI/ML features | < 1 hour | Micro-batch | Feature store |
| Alerting (churn risk) | < 15 minutes | Near real-time | Event stream + rules engine |
| Board reporting | Weekly | Batch | Weekly dbt + BI refresh |

### 6.2 Event Streaming Architecture

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Event collection | Segment Analytics.js + server-side | Capture product events |
| Event bus | Segment (or Kafka at scale) | Route events to destinations |
| Real-time processing | Segment Functions (or Flink at scale) | Transform, enrich, filter |
| Real-time storage | Redis / DynamoDB | Low-latency lookups |
| Batch storage | Snowflake | Historical analysis |
| Alerting | Custom service + PagerDuty | Trigger on conditions |

---

## 7. Self-Service Analytics

### 7.1 BI Tool Strategy

| Tool | Audience | Use Case | Governance |
|------|----------|----------|-----------|
| Metabase (primary) | All employees | Dashboards, ad-hoc queries | Curated collections, verified models |
| Python notebooks | Data team | Complex analysis, ML | Version-controlled, peer-reviewed |
| Spreadsheets | Finance, RevOps | Modeling, planning | Connected to warehouse (read-only) |
| Embedded analytics | Customers (future) | Customer-facing dashboards | Strict access control |

### 7.2 Dashboard Hierarchy

| Level | Audience | Content | Refresh |
|-------|----------|---------|---------|
| Executive dashboard | C-suite, board | Top 10 KPIs, trends, alerts | Daily |
| Department dashboards | Department leads | Department-specific metrics | Daily |
| Team dashboards | Individual teams | Operational metrics | Hourly – daily |
| Self-serve exploration | Analysts, curious employees | Ad-hoc queries on curated models | Real-time |

### 7.3 Metric Definitions (Single Source of Truth)

| Metric | Definition | Calculation | Owner |
|--------|-----------|-------------|-------|
| ARR | Annual recurring revenue | Sum of active subscription MRR × 12 | Finance |
| Net Revenue Retention | Revenue retained + expanded from existing cohort | (Beginning ARR + Expansion - Contraction - Churn) / Beginning ARR | Finance |
| DAU | Daily active users | Unique users with ≥ 1 meaningful action per day | Product |
| CAC | Customer acquisition cost | (Sales + Marketing spend) / New customers | Marketing |
| Health Score | Customer health composite | Weighted: Usage (40%) + Engagement (30%) + Satisfaction (20%) + Growth (10%) | CS |
| Pipeline Coverage | Pipeline vs. quota ratio | Total weighted pipeline / Remaining quota | Sales |

---

## 8. Cost Management

### 8.1 Data Infrastructure Costs

| Component | Monthly Cost (Current) | Monthly Cost (12-Month) | Optimization |
|-----------|----------------------|------------------------|-------------|
| Snowflake (compute + storage) | $2,000 | $5,000 | Warehouse sizing, auto-suspend |
| Fivetran (connectors) | $1,000 | $2,000 | Sync frequency optimization |
| Segment (events) | $1,500 | $3,000 | Event filtering, sampling |
| dbt Cloud | $500 | $500 | Efficient models |
| Metabase (Cloud) | $300 | $500 | — |
| Monitoring (Monte Carlo) | $500 | $1,000 | — |
| Reverse ETL (Census) | $500 | $1,000 | Sync optimization |
| **Total** | **$6,300** | **$13,000** | — |

### 8.2 Cost Optimization Strategies

| Strategy | Savings Potential | Implementation |
|----------|-----------------|---------------|
| Warehouse auto-suspend | 30–50% compute | Configure idle timeout (1 min) |
| Incremental models (dbt) | 40–60% compute | Convert full-refresh to incremental |
| Sync frequency tuning | 20–30% ingestion | Reduce non-critical syncs to daily |
| Data retention policies | 10–20% storage | Archive old data, compress |
| Query optimization | 20–40% compute | Materialized views, clustering |
| Event filtering | 15–25% events | Filter noise events before warehouse |

---

## 9. Team & Ownership

### 9.1 Data Team Structure

| Role | Responsibility | Headcount (Current) | Headcount (12-Month) |
|------|---------------|--------------------|--------------------|
| Data Engineer | Pipeline building, infrastructure | 1 | 2 |
| Analytics Engineer | dbt models, metric definitions | 1 | 2 |
| Data Analyst | Dashboards, ad-hoc analysis | 0 (shared) | 1 |
| Data Scientist | ML models, advanced analytics | 0 | 1 |
| **Total** | — | **2** | **6** |

### 9.2 Ownership Model

| Domain | Data Owner (Business) | Data Steward (Technical) |
|--------|----------------------|-------------------------|
| Revenue/Finance | CFO | Analytics Engineer |
| Product | CPO | Data Engineer |
| Sales/Pipeline | CRO | Analytics Engineer |
| Marketing | CMO | Analytics Engineer |
| Customer Success | VP CS | Analytics Engineer |
| Engineering/Ops | CTO | Data Engineer |

---

## 10. Roadmap

### 10.1 Implementation Phases

| Phase | Timeline | Deliverables |
|-------|----------|-------------|
| Foundation | Month 1–2 | Snowflake setup, Fivetran connectors, Segment, basic dbt models |
| Core Models | Month 2–4 | Revenue models, product analytics, health scores, BI dashboards |
| Self-Service | Month 4–6 | Curated BI collections, metric definitions, team dashboards |
| Advanced | Month 6–9 | ML features, reverse ETL, embedded analytics, real-time alerting |
| Optimization | Month 9–12 | Cost optimization, governance automation, data mesh exploration |

### 10.2 Success Metrics

| Metric | Target | Timeline |
|--------|--------|----------|
| Time to answer data question | < 5 minutes (self-serve) | Month 6 |
| Data freshness (revenue) | < 1 hour | Month 2 |
| Dashboard adoption | > 80% of employees weekly | Month 6 |
| Data quality score | > 99% (critical models) | Month 4 |
| Cost per query | Declining quarter-over-quarter | Ongoing |
| Self-serve ratio | > 70% of questions answered without data team | Month 9 |

---

*Document prepared by Manus AI. Data infrastructure and warehouse architecture designed for ARG-Builder scalable, governed, and self-service analytics.*
