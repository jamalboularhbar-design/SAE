# ARG-Builder: Revenue Operations (RevOps) Framework

## Executive Summary

This document defines ARG-Builder's Revenue Operations framework — the unified system that aligns marketing, sales, and customer success around shared revenue goals, consistent data, and optimized processes. RevOps eliminates departmental silos, creates a single source of truth for revenue metrics, and ensures every customer-facing team operates from the same playbook. The goal is predictable, efficient, and scalable revenue growth.

---

## RevOps Mission

> **Accelerate predictable revenue growth by aligning people, processes, and technology across the entire customer lifecycle — from first touch to renewal and expansion.**

---

## RevOps Organizational Structure

### Team Structure

| Role | Reports To | Responsibility | Hire Timing |
|------|-----------|---------------|-------------|
| VP Revenue Operations | CEO | Strategy, alignment, metrics, forecasting | Month 6 |
| Revenue Systems Manager | VP RevOps | CRM, tech stack, integrations, data quality | Month 9 |
| Revenue Analyst | VP RevOps | Reporting, forecasting, pipeline analysis | Month 12 |
| Marketing Ops Specialist | VP RevOps (dotted to VP Marketing) | Lead management, attribution, automation | Month 6 |
| Sales Ops Specialist | VP RevOps (dotted to VP Sales) | Territory, quota, compensation, deal desk | Month 9 |
| CS Ops Specialist | VP RevOps (dotted to VP CS) | Health scoring, renewal forecasting, expansion | Month 12 |

### RACI Matrix

| Process | Marketing | Sales | CS | RevOps |
|---------|-----------|-------|-----|--------|
| Lead scoring definition | Consulted | Consulted | Informed | Responsible |
| Pipeline stages | Informed | Consulted | Informed | Responsible |
| Forecasting methodology | Informed | Accountable | Consulted | Responsible |
| Territory design | Informed | Consulted | Informed | Responsible |
| Compensation design | Informed | Consulted | Consulted | Responsible |
| Tech stack selection | Consulted | Consulted | Consulted | Responsible |
| Data governance | Accountable | Accountable | Accountable | Responsible |
| Reporting & dashboards | Consulted | Consulted | Consulted | Responsible |

---

## Unified Revenue Metrics

### North Star Metrics

| Metric | Definition | Owner | Target (Year 1) |
|--------|-----------|-------|-----------------|
| ARR | Annual Recurring Revenue | CEO | $2.2M |
| NRR | Net Revenue Retention | VP CS | > 120% |
| CAC Payback | Months to recover acquisition cost | VP RevOps | < 12 months |
| Pipeline Coverage | Pipeline / quota (next quarter) | VP Sales | > 3x |
| Revenue per Employee | Total ARR / headcount | CEO | > $150K |

### Funnel Metrics (Full Journey)

| Stage | Metric | Owner | Target |
|-------|--------|-------|--------|
| Awareness | Website visitors/month | Marketing | 20,000 |
| Interest | Leads generated/month | Marketing | 400 |
| Consideration | MQLs/month | Marketing | 100 |
| Evaluation | SQLs/month | Sales | 40 |
| Purchase | Closed-won/month | Sales | 8 |
| Adoption | Time to first value | CS | < 14 days |
| Retention | Gross retention rate | CS | > 92% |
| Expansion | Expansion revenue/quarter | CS + Sales | 30% of new ARR |
| Advocacy | NPS score | CS | > 60 |

### Conversion Rate Benchmarks

| Conversion | Target | Action if Below |
|-----------|--------|-----------------|
| Visitor → Lead | 2% | Optimize CTAs, landing pages |
| Lead → MQL | 25% | Refine scoring, improve nurture |
| MQL → SQL | 40% | Improve handoff, SDR training |
| SQL → Opportunity | 60% | Better qualification, demo quality |
| Opportunity → Closed-Won | 25% | Sales process, competitive positioning |
| Overall Visitor → Customer | 0.04% | Full-funnel optimization |

---

## Revenue Process Design

### Lead-to-Revenue Process

| Step | Action | Owner | SLA | System |
|------|--------|-------|-----|--------|
| 1 | Lead captured | Marketing automation | Instant | HubSpot |
| 2 | Lead enriched | Clearbit/Apollo | < 1 minute | Automated |
| 3 | Lead scored | Scoring model | < 1 minute | HubSpot |
| 4 | MQL routed to SDR | Routing rules | < 5 minutes | HubSpot |
| 5 | SDR outreach | SDR | < 2 hours | HubSpot + Outreach |
| 6 | Discovery call | SDR | Within 48 hours of contact | Calendly |
| 7 | SQL created, AE assigned | SDR → AE handoff | Same day | HubSpot |
| 8 | Demo delivered | AE | Within 5 business days | Zoom + demo env |
| 9 | Proposal sent | AE | Within 3 days of demo | HubSpot + PandaDoc |
| 10 | Negotiation | AE + deal desk | Per deal complexity | HubSpot |
| 11 | Contract signed | AE | Within 30 days of proposal | PandaDoc |
| 12 | Handoff to CS | AE → CSM | Within 24 hours of close | HubSpot |

### Handoff Protocols

| Handoff | From → To | Required Information | SLA |
|---------|-----------|---------------------|-----|
| MQL → SDR | Marketing → Sales Development | Lead score, behavior history, company info | 5 minutes |
| SQL → AE | SDR → Account Executive | Discovery notes, BANT, champion info | Same day |
| Closed-Won → CS | AE → Customer Success | Contract details, success criteria, stakeholders | 24 hours |
| Expansion → AE | CS → Account Executive | Expansion opportunity, usage data, champion | 48 hours |
| Churn Risk → CS Lead | CSM → VP CS | Health score, risk factors, recommended action | 4 hours |

---

## Forecasting Framework

### Forecasting Methodology

| Category | Definition | Probability | Criteria |
|----------|-----------|-------------|----------|
| Commit | Will close this period | 90%+ | Verbal yes, contract in review, decision maker confirmed |
| Best Case | Likely to close this period | 70–89% | Champion engaged, proposal sent, timeline confirmed |
| Pipeline | Could close this period | 30–69% | Discovery complete, qualified, active engagement |
| Upside | Possible but uncertain | 10–29% | Early stage, not fully qualified |

### Forecasting Cadence

| Meeting | Frequency | Attendees | Focus |
|---------|-----------|-----------|-------|
| Deal review | Weekly | AE + Manager | Individual deal progression |
| Team forecast | Weekly | Sales team + VP Sales | Team-level forecast accuracy |
| Revenue forecast | Bi-weekly | VP Sales + VP CS + VP RevOps | Company-level forecast |
| Board forecast | Monthly | CEO + VP RevOps | Board-ready forecast + commentary |

### Forecast Accuracy Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Commit accuracy | > 90% | Commit deals that actually close |
| Best case accuracy | > 70% | Best case deals that close |
| Overall forecast accuracy | ± 10% | Actual vs. forecast |
| Pipeline coverage accuracy | Within 20% | Predicted vs. actual conversion |

---

## Territory & Quota Design

### Territory Model

| Segment | Territory Basis | AE Count (Year 1) | Quota/AE |
|---------|----------------|-------------------|----------|
| Enterprise (> 500 emp) | Named accounts (50 per AE) | 2 | $600K ARR |
| Mid-market (100–500) | Geographic + industry | 3 | $400K ARR |
| Growth (50–100) | Pooled (round robin) | 2 | $300K ARR |

### Quota Setting Principles

| Principle | Implementation |
|-----------|---------------|
| Data-driven | Based on historical conversion rates and pipeline |
| Achievable | 70% of reps should hit quota |
| Balanced | Mix of new business + expansion |
| Transparent | Clear methodology shared with all reps |
| Adjusted | Quarterly review, annual reset |

---

## Compensation Architecture

### Sales Compensation

| Role | Base | Variable | OTE | Split |
|------|------|----------|-----|-------|
| SDR | $55K | $25K | $80K | 70/30 |
| Mid-Market AE | $80K | $80K | $160K | 50/50 |
| Enterprise AE | $100K | $120K | $220K | 45/55 |
| VP Sales | $150K | $150K | $300K | 50/50 |

### CS Compensation

| Role | Base | Variable | OTE | Variable Tied To |
|------|------|----------|-----|-----------------|
| CSM | $85K | $25K | $110K | NRR + health scores |
| Senior CSM | $110K | $35K | $145K | NRR + expansion |
| VP CS | $160K | $60K | $220K | GRR + NRR + NPS |

### Accelerators & Decelerators

| Performance | Multiplier | Example |
|-------------|-----------|---------|
| < 50% of quota | 0.5x | Reduced commission rate |
| 50–100% of quota | 1.0x | Standard commission rate |
| 100–125% of quota | 1.5x | Accelerated commission |
| 125–150% of quota | 2.0x | Double commission |
| > 150% of quota | 2.5x | President's Club territory |

---

## Data Governance

### Data Quality Standards

| Dimension | Standard | Enforcement |
|-----------|----------|-------------|
| Completeness | All required fields populated | System validation |
| Accuracy | Data matches reality | Quarterly audit |
| Timeliness | Updated within 24 hours of change | Process + automation |
| Consistency | Same data across all systems | Integration rules |
| Uniqueness | No duplicate records | Deduplication automation |

### Data Ownership

| Data Domain | Owner | Steward |
|-------------|-------|---------|
| Lead/contact data | Marketing Ops | RevOps |
| Deal/opportunity data | Sales Ops | RevOps |
| Customer health data | CS Ops | RevOps |
| Product usage data | Product | RevOps |
| Financial data | Finance | RevOps |

---

## RevOps Technology Stack

| Layer | Tool | Purpose | Owner |
|-------|------|---------|-------|
| CRM | HubSpot | Single source of truth | RevOps |
| Data warehouse | Snowflake | Unified analytics | RevOps |
| BI/Reporting | Metabase | Dashboards, ad-hoc analysis | RevOps |
| ETL | Fivetran | Data integration | RevOps |
| Enrichment | Clearbit | Company/contact data | Marketing Ops |
| Sales engagement | Outreach | Sequences, cadences | Sales Ops |
| Document management | PandaDoc | Proposals, contracts | Sales Ops |
| CS platform | Vitally | Health scores, playbooks | CS Ops |
| Revenue intelligence | Gong | Call recording, deal intelligence | RevOps |

---

## RevOps Cadence

| Cadence | Frequency | Participants | Purpose |
|---------|-----------|-------------|---------|
| Revenue standup | Daily | RevOps team | Blockers, priorities |
| Pipeline review | Weekly | Sales + RevOps | Deal progression, forecast |
| Revenue leadership | Bi-weekly | All revenue leaders | Alignment, cross-functional issues |
| Monthly business review | Monthly | All leadership | Performance vs. plan |
| Quarterly planning | Quarterly | All revenue teams | Goals, territories, compensation |
| Annual planning | Annually | All leadership | Strategy, budgets, headcount |

---

*Document prepared by Manus AI for ARG-Builder revenue operations.*
