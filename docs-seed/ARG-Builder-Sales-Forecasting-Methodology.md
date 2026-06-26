# ARG-Builder: Sales Forecasting Methodology

## Executive Summary

This document defines ARG-Builder's sales forecasting methodology — the systematic approach to predicting future revenue with accuracy that enables confident resource allocation, hiring decisions, and investor communication. Accurate forecasting is the foundation of operational excellence in a growth-stage SaaS company.

---

## Forecasting Framework

### Multi-Method Approach

| Method | Best For | Accuracy | Timeframe | Weight in Blend |
|--------|----------|----------|-----------|----------------|
| Bottom-up (pipeline) | Near-term (current quarter) | High (±10%) | 0–90 days | 50% |
| Top-down (capacity) | Medium-term (next quarter) | Medium (±20%) | 90–180 days | 25% |
| Historical trend | Long-term (annual) | Low-Medium (±30%) | 180–365 days | 15% |
| Leading indicators | Directional (all timeframes) | Supplementary | All | 10% |

---

## Bottom-Up Pipeline Forecasting

### Stage-Based Probability Model

| Stage | Definition | Exit Criteria | Probability | Avg Days in Stage |
|-------|-----------|---------------|-------------|-------------------|
| 0. Lead | Identified, not yet qualified | — | 5% | — |
| 1. Discovery | First meeting completed | Pain confirmed, budget discussed | 10% | 14 days |
| 2. Qualification | MEDDPICC criteria validated | Champion identified, timeline confirmed | 20% | 14 days |
| 3. Demo/Evaluation | Product demonstrated, trial started | Technical validation complete | 40% | 21 days |
| 4. Proposal | Proposal/pricing delivered | Proposal reviewed by decision-maker | 60% | 14 days |
| 5. Negotiation | Terms being discussed | Verbal agreement on terms | 75% | 14 days |
| 6. Verbal Commit | Verbal yes, awaiting signature | Legal/procurement engaged | 90% | 7 days |
| 7. Closed Won | Contract signed | — | 100% | — |
| 8. Closed Lost | Deal lost | — | 0% | — |

### Weighted Pipeline Calculation

| Deal | Stage | ACV | Probability | Weighted Value | Expected Close |
|------|-------|-----|-------------|---------------|---------------|
| Acme Corp | 4. Proposal | $120K | 60% | $72K | This quarter |
| Beta Inc | 3. Demo | $80K | 40% | $32K | This quarter |
| Gamma LLC | 5. Negotiation | $200K | 75% | $150K | This quarter |
| Delta Co | 2. Qualification | $60K | 20% | $12K | Next quarter |
| **Total Pipeline** | | **$460K** | | **$266K** | |

### Forecast Categories

| Category | Definition | Confidence | Included in Commit |
|----------|-----------|-----------|-------------------|
| **Closed** | Signed contracts | 100% | Yes |
| **Commit** | Verbal agreement, high confidence | 90%+ | Yes |
| **Best Case** | Strong pipeline, likely this quarter | 60–89% | Upside only |
| **Pipeline** | Active opportunities, may slip | 20–59% | No |
| **Upside** | Early stage, could accelerate | < 20% | No |

### Quarterly Forecast Template

| Category | Deal Count | Total ACV | Weighted ACV | % of Quota |
|----------|-----------|-----------|-------------|-----------|
| Closed | X | $XXX | $XXX | XX% |
| Commit | X | $XXX | $XXX | XX% |
| Best Case | X | $XXX | $XXX | XX% |
| Pipeline | X | $XXX | $XXX | XX% |
| **Total** | **X** | **$XXX** | **$XXX** | **XX%** |
| **Quota** | | | **$XXX** | **100%** |
| **Coverage** | | | | **X.Xx** |

---

## Top-Down Capacity Forecasting

### Rep Productivity Model

| Role | Ramp Period | Ramped Quota | Ramp Quarter 1 | Ramp Quarter 2 | Fully Ramped |
|------|-----------|-------------|---------------|---------------|-------------|
| AE (Mid-Market) | 6 months | $600K/year | 25% ($37.5K) | 75% ($112.5K) | 100% ($150K/Q) |
| AE (Enterprise) | 9 months | $1M/year | 15% ($37.5K) | 50% ($125K) | 100% ($250K/Q) |
| SDR (Pipeline) | 3 months | $2.4M pipeline/year | 50% ($300K) | 100% ($600K/Q) | 100% ($600K/Q) |

### Capacity Plan

| Quarter | Ramped AEs | Ramping AEs | Total Capacity | Quota | Coverage |
|---------|-----------|-------------|---------------|-------|----------|
| Q1 | 3 | 2 | $525K | $500K | 1.05x |
| Q2 | 4 | 1 | $675K | $650K | 1.04x |
| Q3 | 5 | 2 | $875K | $800K | 1.09x |
| Q4 | 6 | 1 | $1,025K | $950K | 1.08x |

---

## Leading Indicators

### Predictive Metrics

| Indicator | Correlation to Revenue | Lead Time | Data Source |
|-----------|----------------------|-----------|-------------|
| Website traffic (ICP) | 0.65 | 90 days | Analytics |
| Demo requests | 0.82 | 60 days | Marketing automation |
| Trial activations | 0.78 | 45 days | Product analytics |
| Pipeline created (month) | 0.88 | 75 days | CRM |
| SDR meetings booked | 0.72 | 90 days | CRM |
| Content downloads (gated) | 0.55 | 120 days | Marketing automation |
| G2 intent signals | 0.60 | 60 days | G2 |
| Expansion signals (usage) | 0.85 | 30 days | Product analytics |

---

## Forecast Accuracy & Governance

### Accuracy Targets

| Timeframe | Accuracy Target | Acceptable Variance | Action if Missed |
|-----------|----------------|--------------------|--------------------|
| Current month | ±5% | ±10% | Weekly deal review |
| Current quarter | ±10% | ±15% | Pipeline scrub, re-forecast |
| Next quarter | ±20% | ±25% | Capacity adjustment |
| Annual | ±25% | ±30% | Strategy review |

### Forecast Cadence

| Activity | Frequency | Participants | Output |
|----------|-----------|-------------|--------|
| Deal-level forecast update | Weekly (Monday) | AEs | Updated CRM stages + close dates |
| Team forecast roll-up | Weekly (Tuesday) | Sales managers | Team forecast by category |
| Company forecast | Weekly (Wednesday) | VP Sales + Finance | Board-ready forecast |
| Pipeline review | Bi-weekly | AEs + Managers | Deal strategy, stage validation |
| Quarterly forecast lock | Month 2, Week 3 | VP Sales + CEO | Committed number for board |

### Forecast Hygiene Rules

| Rule | Implementation | Consequence of Violation |
|------|---------------|------------------------|
| Close dates must be realistic | No "end of quarter" dumping without evidence | Manager override |
| Stage must match criteria | Exit criteria validated before advancing | Deal flagged |
| Stale deals flagged | No activity > 14 days = automatic flag | Required update or close |
| Commit = 90%+ confidence | Only deals with verbal agreement | Removed from commit |
| Pipeline coverage minimum | 3x for current quarter, 4x for next | Prospecting sprint triggered |

---

## Scenario Planning

### Revenue Scenarios

| Scenario | Assumptions | Q Revenue | Annual Revenue | Probability |
|----------|-------------|-----------|---------------|-------------|
| Bear case | 70% of commit closes, 20% of best case, 0% pipeline | $XXX | $XXX | 15% |
| Base case | 90% of commit, 50% of best case, 10% pipeline | $XXX | $XXX | 60% |
| Bull case | 100% of commit, 75% of best case, 25% pipeline | $XXX | $XXX | 25% |
