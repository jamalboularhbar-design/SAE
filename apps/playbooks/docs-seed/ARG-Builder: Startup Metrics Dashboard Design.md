# ARG-Builder: Startup Metrics Dashboard Design

## Executive Summary

This document defines ARG-Builder's real-time metrics dashboard architecture — the centralized command center that provides instant visibility into business health, growth trajectory, and operational performance. A well-designed dashboard transforms raw data into actionable intelligence, enabling faster decisions and earlier detection of problems and opportunities.

---

## Dashboard Architecture

### Dashboard Hierarchy

| Level | Audience | Refresh Rate | Metrics Count | Purpose |
|-------|----------|-------------|---------------|---------|
| **Executive** | CEO, Board, Investors | Daily | 8–12 | Strategic health at a glance |
| **Departmental** | VP/Director level | Real-time | 15–20 | Functional performance |
| **Operational** | Managers, ICs | Real-time | 20–30 | Day-to-day execution |
| **Deep-dive** | Analysts, specialists | On-demand | 50+ | Root cause analysis |

---

## Executive Dashboard

### Layout (Single Screen)

| Section | Position | Metrics | Visualization |
|---------|----------|---------|---------------|
| **North Star** | Top center (hero) | Weekly Active Teams | Large number + sparkline |
| **Revenue** | Top left | MRR, ARR, MoM growth | Number + trend arrow |
| **Growth** | Top right | New customers, pipeline | Number + bar chart |
| **Efficiency** | Middle left | Burn rate, runway, magic number | Gauges |
| **Retention** | Middle center | NRR, logo retention, churn | Line chart (trailing 12m) |
| **Funnel** | Middle right | Visitors → Trials → Paid | Funnel visualization |
| **Health** | Bottom left | NPS, CSAT, uptime | Traffic light indicators |
| **Team** | Bottom center | Headcount, open roles, eNPS | Numbers |
| **Alerts** | Bottom right | Items needing attention | Red/yellow flags |

### Executive Metrics Detail

| Metric | Definition | Target | Alert Threshold | Data Source |
|--------|-----------|--------|----------------|-------------|
| ARR | Annual recurring revenue | Growing 15%+ MoM | < 10% MoM growth | Stripe |
| MRR | Monthly recurring revenue | $185K+ | < $150K | Stripe |
| Net new MRR | New + expansion - churn - contraction | Positive and growing | Negative | Stripe |
| Runway | Cash / monthly burn | > 18 months | < 12 months | Accounting |
| NRR | Net revenue retention (trailing 12m) | > 120% | < 100% | Stripe + CRM |
| CAC payback | Months to recover CAC | < 12 months | > 18 months | CRM + Stripe |
| Pipeline coverage | Weighted pipeline / quota | > 3x | < 2x | CRM |
| NPS | Net Promoter Score | > 50 | < 30 | Survey tool |

---

## Revenue Dashboard

### Metrics & Visualizations

| Metric | Visualization | Timeframe | Drill-down |
|--------|--------------|-----------|-----------|
| MRR waterfall | Waterfall chart (new, expansion, contraction, churn) | Monthly | By segment, plan |
| ARR trend | Line chart with forecast | 12-month trailing + 3-month forecast | By segment |
| Revenue by plan | Stacked bar chart | Monthly | By tier |
| Revenue by segment | Pie/donut chart | Current month | By industry, size |
| Cohort revenue | Heatmap | By signup month | By plan, segment |
| Expansion revenue | Bar chart | Monthly | By type (seats, tier, add-on) |
| Churn analysis | Bar chart + reasons | Monthly | By reason, segment |
| ARPU trend | Line chart | 12-month trailing | By plan |

---

## Sales Dashboard

### Pipeline Metrics

| Metric | Visualization | Target | Alert |
|--------|--------------|--------|-------|
| Pipeline value (weighted) | Number + trend | > 3x quota | < 2x |
| Pipeline by stage | Horizontal bar | Balanced distribution | Stage bloat |
| Win rate (trailing 30d) | Gauge | > 25% | < 15% |
| Average deal size | Number + trend | Growing | Declining 2+ months |
| Sales cycle (days) | Number + trend | < 45 (MM), < 90 (ENT) | > 60 (MM), > 120 (ENT) |
| Deals created this month | Number vs. target | On pace | < 70% of pace |
| Forecast accuracy | Actual vs. predicted | ± 10% | > 20% variance |
| Rep attainment | Leaderboard | > 80% on track | < 50% |

---

## Product Dashboard

### Engagement Metrics

| Metric | Visualization | Target | Alert |
|--------|--------------|--------|-------|
| DAU / WAU / MAU | Line chart (3 lines) | All growing | Any declining 2+ weeks |
| DAU/MAU ratio | Gauge | > 30% | < 20% |
| Feature adoption | Heatmap by feature | > 50% for core | < 30% for core feature |
| Search queries/day | Line chart | > 1,000 | < 500 |
| Session duration | Line chart | 5–15 min average | < 3 min |
| Activation rate (7-day) | Funnel | > 35% | < 20% |
| Error rate | Line chart | < 0.1% | > 1% |
| Page load time (P95) | Line chart | < 3s | > 5s |

---

## Customer Success Dashboard

### Health & Retention

| Metric | Visualization | Target | Alert |
|--------|--------------|--------|-------|
| Customer health distribution | Stacked bar (green/yellow/red) | > 70% green | > 20% red |
| Accounts at risk | List with scores | < 10% of base | > 15% |
| Renewal pipeline (next 90 days) | Table with health | > 95% expected renewal | < 90% |
| NPS by segment | Bar chart | > 50 all segments | Any segment < 30 |
| Support tickets (open) | Number + trend | Decreasing | Increasing 2+ weeks |
| Time to resolution | Number | < 4 hours (P50) | > 8 hours |
| QBR completion rate | Progress bar | > 90% on schedule | < 75% |
| Expansion pipeline | Number | Growing | Flat 2+ months |

---

## Technical Implementation

### Technology Stack

| Component | Tool | Purpose | Cost |
|-----------|------|---------|------|
| Data warehouse | BigQuery / Snowflake | Central data store | $500–$2K/month |
| ETL/ELT | Fivetran + dbt | Data extraction and transformation | $500–$1K/month |
| Visualization | Metabase (self-hosted) or Looker | Dashboard rendering | $0–$3K/month |
| Real-time events | Segment | Event collection | $120/month |
| Alerting | PagerDuty + Slack | Threshold notifications | $100/month |
| Monitoring | Datadog | Infrastructure + APM | $500/month |

### Data Pipeline Architecture

| Layer | Components | Refresh Rate |
|-------|-----------|-------------|
| Sources | Stripe, HubSpot, Product DB, Intercom, Google Analytics | Continuous |
| Ingestion | Fivetran connectors | 5-minute sync |
| Transformation | dbt models (staging → intermediate → marts) | Hourly |
| Serving | Materialized views, caching layer | Real-time for critical metrics |
| Presentation | Dashboard tool + embedded analytics | Real-time |

---

## Alert System

### Alert Configuration

| Alert Level | Criteria | Channel | Response SLA |
|-------------|----------|---------|-------------|
| **Critical (P0)** | Revenue metric > 30% off target, system down | PagerDuty + SMS + Slack | 15 minutes |
| **Warning (P1)** | Metric trending wrong direction 2+ periods | Slack #alerts + email | 4 hours |
| **Info (P2)** | Notable change, positive or negative | Slack #metrics | Next business day |
| **Digest** | Weekly summary of all metrics vs. targets | Email (Monday AM) | Review in weekly meeting |

---

*Document prepared by Manus AI for ARG-Builder metrics dashboard operations.*
