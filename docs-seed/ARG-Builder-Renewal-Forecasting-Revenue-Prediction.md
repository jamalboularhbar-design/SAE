# ARG-Builder: Renewal Forecasting Revenue Prediction

## Multi-Method Framework for Accurate, Board-Ready Revenue Predictions

---

## 1. Executive Summary

Revenue forecasting is the backbone of operational planning — it drives hiring, spending, fundraising, and strategic decisions. Inaccurate forecasts destroy credibility with boards and investors, while overly conservative forecasts leave growth on the table. This document defines ARG-Builder's multi-method forecasting approach, combining bottoms-up pipeline analysis, tops-down market sizing, cohort modeling, and scenario planning to produce reliable, defensible revenue projections.

---

## 2. Forecasting Methodology Overview

### 2.1 Forecasting Methods

| Method | Best For | Accuracy | Complexity | Time Horizon |
|--------|---------|----------|-----------|-------------|
| Pipeline-based (bottoms-up) | Near-term (0–3 months) | High (when pipeline is mature) | Medium | 1–3 months |
| Cohort-based | Medium-term (3–12 months) | High (with historical data) | High | 3–18 months |
| Run-rate + growth | Short-term (1–3 months) | Medium | Low | 1–6 months |
| Tops-down (TAM/SAM/SOM) | Long-term (12–36 months) | Low-Medium | Low | 1–5 years |
| Scenario-based | Strategic planning | Ranges, not point estimates | Medium | 6–24 months |
| Hybrid (weighted blend) | Operating forecast | Highest | High | 1–12 months |

### 2.2 Forecast Hierarchy

| Level | Method | Owner | Cadence | Audience |
|-------|--------|-------|---------|----------|
| Weekly commit | Pipeline-based | AEs + Sales Manager | Weekly | Sales leadership |
| Monthly forecast | Hybrid (pipeline + cohort) | RevOps | Monthly | Leadership team |
| Quarterly board forecast | Hybrid + scenarios | CFO/VP Finance | Quarterly | Board of directors |
| Annual plan | Cohort + tops-down + scenarios | CFO + CEO | Annual | Board + investors |
| Long-range plan (3-year) | Tops-down + cohort trends | CFO | Annual | Board + investors |

---

## 3. Pipeline-Based Forecasting

### 3.1 Pipeline Stage Conversion Rates

| Stage | Definition | Historical Win Rate | Weighted Probability |
|-------|-----------|--------------------|--------------------|
| Prospect | Initial outreach, no meeting | 2% | 2% |
| Discovery | First meeting completed | 8% | 8% |
| Qualified | BANT confirmed, demo scheduled | 20% | 20% |
| Demo/Evaluation | Active evaluation, trial | 35% | 35% |
| Proposal | Proposal sent, pricing discussed | 50% | 50% |
| Negotiation | Contract redlines, legal review | 70% | 70% |
| Verbal commit | Verbal yes, awaiting signature | 90% | 90% |
| Closed Won | Contract signed | 100% | 100% |
| Closed Lost | Deal lost | 0% | 0% |

### 3.2 Pipeline Forecast Calculation

| Component | Formula | Example |
|-----------|---------|---------|
| Weighted pipeline | Σ (Deal value × Stage probability) | $500K × 35% = $175K |
| Expected close (month) | Deals × probability × timing adjustment | Adjusted for historical close timing |
| Pipeline coverage ratio | Total pipeline / Quota | Target: 3–4x coverage |
| Commit forecast | Deals at 70%+ probability | High-confidence deals only |
| Best case | Deals at 35%+ probability | Optimistic but achievable |
| Upside | All qualified deals (20%+) | Maximum potential |

### 3.3 Pipeline Adjustments

| Adjustment Factor | Impact | Application |
|------------------|--------|-------------|
| Deal age (stale deals) | -10% per month over average cycle | Reduce probability for aged deals |
| Champion strength | ±15% | Adjust based on champion engagement |
| Competitive presence | -10% to -20% | Known competitive deals |
| Multi-threading | +10% to +15% | Multiple contacts engaged |
| Executive engagement | +10% | C-level involved in evaluation |
| Budget confirmed | +15% | Written budget confirmation |
| Procurement involved | -5% (timing) | Adds time, doesn't reduce probability |

---

## 4. Cohort-Based Revenue Modeling

### 4.1 Cohort Model Structure

| Cohort Dimension | Definition | Example |
|-----------------|-----------|---------|
| Acquisition cohort | Month/quarter customer signed | Q1 2025 cohort |
| Segment cohort | Customer segment at acquisition | Enterprise, Mid-Market, SMB |
| Channel cohort | Acquisition channel | Inbound, outbound, partner, PLG |
| Plan cohort | Initial plan/tier | Starter, Professional, Enterprise |

### 4.2 Cohort Revenue Projection

| Month | Starting MRR | Expansion | Contraction | Churn | Net MRR |
|-------|-------------|-----------|-------------|-------|---------|
| Month 1 | $100K | $0 | $0 | $0 | $100K |
| Month 3 | $100K | $5K | -$2K | -$3K | $100K |
| Month 6 | $100K | $15K | -$5K | -$8K | $102K |
| Month 12 | $100K | $30K | -$8K | -$12K | $110K |
| Month 18 | $100K | $40K | -$10K | -$15K | $115K |
| Month 24 | $100K | $45K | -$12K | -$18K | $115K |

### 4.3 Cohort Assumptions

| Assumption | Enterprise | Mid-Market | SMB | Self-Serve |
|-----------|-----------|-----------|-----|-----------|
| Monthly logo churn | 0.4% | 0.8% | 1.5% | 3.0% |
| Monthly expansion rate | 2.5% | 1.5% | 0.8% | 0.3% |
| Monthly contraction rate | 0.3% | 0.5% | 0.8% | 1.0% |
| Net revenue retention (annual) | 130% | 115% | 100% | 88% |
| Average ramp to full value | 3 months | 2 months | 1 month | Immediate |
| Expansion timing (first) | Month 6 | Month 4 | Month 8 | Month 12 |

### 4.4 New Customer Acquisition Forecast

| Source | Monthly New Customers | Average ACV | Monthly New ARR |
|--------|---------------------|-------------|----------------|
| Inbound (marketing) | 15 | $18K | $270K |
| Outbound (sales) | 5 | $60K | $300K |
| PLG conversion | 20 | $6K | $120K |
| Partner/channel | 3 | $40K | $120K |
| **Total** | **43** | **$19K avg** | **$810K** |

---

## 5. Scenario Planning

### 5.1 Scenario Definitions

| Scenario | Probability | Assumptions | Revenue Impact |
|----------|------------|-------------|---------------|
| Bull case | 20% | Pipeline converts at 120% of historical, expansion accelerates, new product launches on time | +25% vs. base |
| Base case | 50% | Historical conversion rates, planned hiring executes, moderate expansion | Plan target |
| Bear case | 25% | Pipeline slips 20%, hiring delayed, churn increases 50% | -20% vs. base |
| Stress case | 5% | Major market downturn, key customer losses, competitive disruption | -40% vs. base |

### 5.2 Scenario Variables

| Variable | Bull | Base | Bear | Stress |
|----------|------|------|------|--------|
| New logo win rate | 30% | 25% | 20% | 15% |
| Average deal size | +15% | Plan | -10% | -25% |
| Sales cycle length | -20% | Plan | +30% | +50% |
| Logo churn (annual) | 8% | 12% | 18% | 25% |
| Net revenue retention | 135% | 120% | 105% | 90% |
| New AE ramp time | 4 months | 6 months | 8 months | 10 months |
| Marketing pipeline | +20% | Plan | -15% | -30% |

### 5.3 Scenario Output (12-Month)

| Metric | Bull | Base | Bear | Stress |
|--------|------|------|------|--------|
| Ending ARR | $12.5M | $10M | $8M | $6M |
| Net new ARR | $6.5M | $4.5M | $2.5M | $500K |
| New customer ARR | $4.5M | $3.2M | $2M | $1M |
| Expansion ARR | $2.5M | $1.8M | $1M | $500K |
| Churned ARR | -$500K | -$500K | -$500K | -$1M |
| Cash required | $2M | $4M | $6M | $8M |

---

## 6. Forecast Accuracy Measurement

### 6.1 Accuracy Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| Forecast accuracy | 1 - |Actual - Forecast| / Actual | > 90% |
| Bias (over/under) | (Forecast - Actual) / Actual | ±5% |
| Weighted accuracy | Accuracy weighted by deal size | > 85% |
| Coverage accuracy | Actual / Pipeline at period start | Track trend |
| Timing accuracy | % of deals closing in predicted month | > 70% |

### 6.2 Accuracy by Forecast Horizon

| Horizon | Target Accuracy | Acceptable Range |
|---------|----------------|-----------------|
| Current month (commit) | > 95% | ±5% |
| Next month | > 85% | ±10% |
| Current quarter | > 80% | ±15% |
| Next quarter | > 70% | ±20% |
| 6 months out | > 60% | ±25% |
| 12 months out | > 50% | ±30% |

### 6.3 Forecast Review Process

| Activity | Frequency | Participants | Output |
|----------|-----------|-------------|--------|
| Weekly pipeline review | Weekly | Sales team + RevOps | Updated commit/best case |
| Monthly forecast update | Monthly | RevOps + Finance + Sales | Updated monthly forecast |
| Quarterly reforecast | Quarterly | Finance + Leadership | Updated annual forecast |
| Accuracy retrospective | Monthly | RevOps | Accuracy report + improvement actions |
| Annual planning | Annual | Leadership + Board | Next year plan |

---

## 7. Rolling Forecast Process

### 7.1 Rolling Forecast Cadence

| Week | Activity | Owner | Output |
|------|----------|-------|--------|
| Week 1 | AEs update deal stages, close dates | AEs | Updated pipeline |
| Week 1 | RevOps runs forecast model | RevOps | Draft forecast |
| Week 2 | Sales leadership review + adjustments | VP Sales | Validated forecast |
| Week 2 | Finance review + scenario update | Finance | Board-ready forecast |
| Week 3 | Leadership alignment | CEO + CFO | Approved forecast |
| Week 4 | Board communication (if quarterly) | CFO | Board package |

### 7.2 Forecast Inputs

| Input | Source | Refresh |
|-------|--------|---------|
| Pipeline data | CRM (Salesforce/HubSpot) | Real-time |
| Historical conversion rates | RevOps analysis | Monthly |
| Cohort retention/expansion | Billing system + product analytics | Monthly |
| Hiring plan (capacity) | HR/Finance | Monthly |
| Marketing pipeline forecast | Marketing ops | Monthly |
| Macro indicators | Market research | Quarterly |
| Customer health scores | CS platform | Real-time |
| Competitive intelligence | Sales + marketing | Quarterly |

---

## 8. Board-Ready Forecast Presentation

### 8.1 Board Forecast Package

| Section | Content | Format |
|---------|---------|--------|
| Executive summary | Key numbers, confidence level, risks | 1-page narrative |
| ARR bridge | Beginning → New + Expansion - Churn → Ending | Waterfall chart |
| Forecast vs. plan | Actual/forecast vs. annual plan | Line chart with variance |
| Scenario analysis | Bull/base/bear outcomes | Range chart |
| Pipeline health | Coverage, conversion, velocity | Dashboard |
| Key assumptions | What must be true for forecast to hit | Bullet list |
| Risks & mitigations | Top 3 risks with mitigation plans | Table |
| Asks | What the board can help with | Specific requests |

### 8.2 ARR Bridge Format

| Component | Q1 Actual | Q2 Forecast | Q3 Forecast | Q4 Forecast | Full Year |
|-----------|-----------|-------------|-------------|-------------|-----------|
| Beginning ARR | $5.5M | $6.5M | $7.8M | $9.2M | $5.5M |
| New customer ARR | $600K | $800K | $900K | $1M | $3.3M |
| Expansion ARR | $500K | $600K | $650K | $700K | $2.45M |
| Contraction ARR | -$50K | -$60K | -$70K | -$80K | -$260K |
| Churned ARR | -$50K | -$60K | -$80K | -$100K | -$290K |
| **Ending ARR** | **$6.5M** | **$7.8M** | **$9.2M** | **$10.7M** | **$10.7M** |

---

## 9. Common Forecasting Pitfalls

### 9.1 Pitfalls & Solutions

| Pitfall | Symptom | Solution |
|---------|---------|----------|
| Sandbagging | Consistently beating forecast by 20%+ | Calibrate with historical accuracy, incentivize accuracy |
| Happy ears | Consistently missing forecast | Require evidence for stage advancement, deal review |
| Stale pipeline | Large pipeline, low conversion | Enforce pipeline hygiene, age-out rules |
| Single-method reliance | Volatile forecasts | Use multiple methods, weighted blend |
| Ignoring seasonality | Q4 miss, Q1 surprise | Build seasonality into model |
| New rep optimism | New AEs over-forecasting | Apply ramp adjustment factor |
| Expansion assumptions | Over-counting expansion | Base on historical cohort data, not wishes |
| Macro blindness | Market shifts not reflected | Include external indicators |

### 9.2 Forecast Hygiene Rules

| Rule | Implementation |
|------|---------------|
| No deal > 90 days without activity | Auto-move to "stalled" |
| Close date in past | Must update or close-lost |
| Stage advancement requires evidence | Defined criteria per stage |
| Commit = AE stakes reputation | Personal accountability |
| Best case ≠ everything in pipeline | Curated list with rationale |
| Forecast ≠ quota | Forecast is prediction, not target |

---

## 10. Tools & Automation

### 10.1 Forecasting Technology Stack

| Tool | Purpose | Integration |
|------|---------|-------------|
| CRM (Salesforce/HubSpot) | Pipeline data, deal tracking | Source of truth |
| Forecasting tool (Clari/Gong Forecast) | AI-assisted forecasting, deal intelligence | CRM integration |
| Financial planning (Mosaic/Pigment) | Financial models, scenarios | CRM + billing |
| BI tool (Looker/Metabase) | Dashboards, reporting | All data sources |
| Spreadsheet (backup) | Ad-hoc analysis, board models | Manual |

### 10.2 Automation Opportunities

| Process | Current | Automated | Benefit |
|---------|---------|-----------|---------|
| Pipeline data collection | Manual CRM updates | Auto-capture from email/calls | Accuracy, time savings |
| Stage progression | Manual AE update | AI-suggested based on signals | Consistency |
| Forecast generation | RevOps builds model | AI-generated baseline | Speed |
| Accuracy tracking | Monthly manual analysis | Real-time accuracy dashboard | Visibility |
| Risk identification | Manager gut feel | AI-flagged at-risk deals | Early intervention |
