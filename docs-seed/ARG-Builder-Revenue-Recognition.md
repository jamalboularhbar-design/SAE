# ARG-Builder: Revenue Recognition

## Executive Summary

This document defines ARG-Builder's revenue recognition policies and financial reporting framework — ensuring compliance with ASC 606 (Revenue from Contracts with Customers), accurate financial statements, and investor-grade reporting. Proper revenue recognition is critical for fundraising, M&A readiness, and operational decision-making.

---

## ASC 606 Five-Step Model Application

### Step 1: Identify the Contract

| Contract Type | Recognition Trigger | Documentation Required |
|--------------|-------------------|----------------------|
| Click-through (self-serve) | Electronic acceptance | ToS acceptance log |
| Signed order form | Mutual signature | Executed order form |
| Enterprise MSA + Order Form | Both executed | MSA + Order Form |
| SOW (professional services) | Signed SOW | Executed SOW |
| Renewal (auto) | Renewal date | Auto-renewal confirmation |

### Step 2: Identify Performance Obligations

| Obligation | Nature | Standalone? | Typical Allocation |
|-----------|--------|-------------|-------------------|
| SaaS platform access | Stand-ready obligation | Yes | 75–85% of total contract value |
| Implementation services | Distinct service | Yes (if customer could self-implement) | 10–15% |
| Training | Distinct service | Yes | 3–5% |
| Premium support | Stand-ready obligation | Yes | 5–10% |
| Custom development | Distinct deliverable | Depends on specificity | Case-by-case |

### Step 3: Determine Transaction Price

| Component | Treatment | Example |
|-----------|-----------|---------|
| Fixed subscription fee | Include in full | $5,000/month |
| Variable usage fees | Estimate (most likely amount) | AI credits overage |
| Discounts | Allocate proportionally | 20% annual discount |
| Payment terms (> 12 months) | No significant financing component | Net 30 standard |
| Non-cash consideration | Fair value at contract inception | Equity swap (rare) |

### Step 4: Allocate Transaction Price

| Method | When Used | Application |
|--------|-----------|-------------|
| Adjusted market assessment | Primary method | Based on what market would pay |
| Expected cost plus margin | When market data unavailable | Cost of delivery + target margin |
| Residual approach | Highly variable pricing | Rarely used |

### Step 5: Recognize Revenue

| Obligation Type | Recognition Pattern | Basis |
|----------------|--------------------|----|
| SaaS subscription | Ratably over contract term | Time-based (daily proration) |
| Implementation | Over implementation period or at completion | Milestone-based or time-based |
| Training | Upon delivery | Point-in-time |
| Professional services (time-based) | As services are performed | Input method (hours) |
| Custom development | Over development period | Output method (milestones) |

---

## Revenue Categories & Treatment

### Monthly Revenue Waterfall

| Category | Definition | Recognition | Reporting Line |
|----------|-----------|-------------|---------------|
| New MRR | Revenue from new customers (first month) | Ratably from start date | New business |
| Expansion MRR | Revenue increase from existing customers | Ratably from effective date | Expansion |
| Contraction MRR | Revenue decrease from existing customers | Reduce from effective date | Contraction |
| Churned MRR | Revenue lost from departed customers | Cease on termination date | Churn |
| Reactivation MRR | Revenue from returning customers | Ratably from restart date | Reactivation |

### Deferred Revenue

| Scenario | Treatment | Balance Sheet Impact |
|----------|-----------|---------------------|
| Annual prepayment received | Recognize 1/12 monthly | Deferred revenue liability |
| Multi-year prepayment | Recognize ratably over full term | Long-term deferred revenue |
| Implementation fee (upfront) | Recognize over implementation period | Deferred revenue |
| Unused credits (expiring) | Recognize at expiration | Revenue upon expiry |

---

## Financial Statements

### Income Statement (SaaS Format)

| Line Item | Components | Frequency |
|-----------|-----------|-----------|
| **Subscription Revenue** | MRR × months recognized | Monthly |
| **Professional Services Revenue** | Implementation + training + consulting | Monthly |
| **Total Revenue** | Subscription + Services | Monthly |
| **Cost of Revenue** | Hosting + support + CS salaries + AI costs | Monthly |
| **Gross Profit** | Revenue - COGS | Monthly |
| **Sales & Marketing** | Sales salaries + marketing spend + tools | Monthly |
| **Research & Development** | Engineering salaries + tools + infrastructure | Monthly |
| **General & Administrative** | Finance + legal + HR + office + insurance | Monthly |
| **Total Operating Expenses** | S&M + R&D + G&A | Monthly |
| **Operating Income (Loss)** | Gross Profit - OpEx | Monthly |
| **Net Income (Loss)** | Operating Income +/- interest, taxes | Monthly |

### Key SaaS Metrics (Monthly Report)

| Metric | Formula | Target |
|--------|---------|--------|
| ARR | MRR × 12 | Track growth |
| MRR | Sum of all active subscriptions | Track monthly |
| Net New MRR | New + Expansion - Contraction - Churn | Positive |
| Gross Margin % | (Revenue - COGS) / Revenue | > 78% |
| Operating Margin % | Operating Income / Revenue | Improve quarterly |
| Burn Rate | Monthly cash decrease | Decreasing |
| Runway (months) | Cash / Monthly Burn | > 18 months |
| CAC | S&M spend / New customers | Decreasing |
| LTV | ARPU × Gross Margin / Churn Rate | Increasing |
| LTV/CAC | LTV / CAC | > 3x |

---

## Reporting Cadence

| Report | Audience | Frequency | Deadline | Owner |
|--------|----------|-----------|----------|-------|
| Flash report (revenue + cash) | CEO, CFO | Weekly | Monday AM | Finance |
| Monthly financial package | Leadership | Monthly | Day 10 | Finance |
| Board financial report | Board | Quarterly | Day 15 post-quarter | CFO |
| Investor update (financial section) | Investors | Monthly | Day 15 | CEO + CFO |
| Annual audit-ready financials | Auditors, Board | Annually | 60 days post-year-end | CFO |
| Tax filings | IRS, State | Annually/Quarterly | Per schedule | Tax advisor |

### Monthly Close Process

| Day | Activity | Owner | Deliverable |
|-----|----------|-------|-------------|
| Day 1–2 | Reconcile bank accounts | Accountant | Bank reconciliation |
| Day 2–3 | Close AP/AR | Accountant | Aged receivables report |
| Day 3–4 | Recognize revenue (ASC 606) | Controller | Revenue schedule |
| Day 4–5 | Accrue expenses | Controller | Accrual journal entries |
| Day 5–6 | Reconcile payroll | Accountant | Payroll reconciliation |
| Day 6–7 | Review and adjust | Controller | Trial balance |
| Day 7–8 | Prepare financial statements | Controller | P&L, Balance Sheet, Cash Flow |
| Day 8–9 | CFO review and commentary | CFO | Management commentary |
| Day 10 | Distribute to leadership | CFO | Monthly financial package |

---

## Audit Readiness

### Documentation Requirements

| Area | Required Documentation | Retention Period |
|------|----------------------|----------------|
| Revenue | All contracts, order forms, amendments | 7 years |
| Expenses | Receipts, invoices, approval records | 7 years |
| Payroll | Pay stubs, tax forms, benefit elections | 7 years |
| Equity | Cap table, option grants, board approvals | Permanent |
| Banking | Statements, reconciliations | 7 years |
| Tax | Returns, supporting schedules | 7 years |
| Corporate | Minutes, resolutions, filings | Permanent |
