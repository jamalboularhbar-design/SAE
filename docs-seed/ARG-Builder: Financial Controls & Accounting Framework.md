# ARG-Builder: Financial Controls & Accounting Framework

## Executive Summary

This document defines ARG-Builder's financial controls, accounting policies, and reporting framework. Robust financial controls ensure accurate reporting, prevent fraud, support fundraising due diligence, and provide the data foundation for strategic decision-making. This framework scales from seed stage through Series B and beyond, with controls that satisfy investor, auditor, and board requirements.

---

## Chart of Accounts

### Revenue Accounts (4000–4999)

| Account # | Name | Description |
|-----------|------|-------------|
| 4100 | Subscription Revenue — Starter | Monthly/annual Starter plan revenue |
| 4200 | Subscription Revenue — Professional | Monthly/annual Professional plan revenue |
| 4300 | Subscription Revenue — Enterprise | Monthly/annual Enterprise plan revenue |
| 4400 | Implementation Services | One-time implementation fee revenue |
| 4500 | Training & Education | Training package revenue |
| 4600 | Professional Services | Custom development, consulting |
| 4700 | Partner Referral Revenue | Revenue from partner-sourced deals |
| 4900 | Other Revenue | Miscellaneous revenue |

### Cost of Revenue (5000–5999)

| Account # | Name | Description |
|-----------|------|-------------|
| 5100 | Cloud Infrastructure | AWS, hosting, CDN costs |
| 5200 | AI/ML Costs | OpenAI, Anthropic API costs |
| 5300 | Third-Party Software (COGS) | Tools directly supporting product delivery |
| 5400 | Customer Success Salaries | CS team compensation |
| 5500 | Support Costs | Support tools, outsourced support |
| 5600 | Implementation Costs | Delivery team for implementation services |

### Operating Expenses (6000–8999)

| Account # | Name | Description |
|-----------|------|-------------|
| 6100 | Engineering Salaries | Engineering team compensation |
| 6200 | Product Salaries | Product management compensation |
| 6300 | Design Salaries | Design team compensation |
| 6400 | Engineering Tools | Development tools, testing, CI/CD |
| 7100 | Sales Salaries + Commission | Sales team base + variable |
| 7200 | Marketing Salaries | Marketing team compensation |
| 7300 | Marketing Programs | Advertising, content, events |
| 7400 | Sales Tools | CRM, sales engagement, data |
| 8100 | G&A Salaries | Finance, HR, legal, operations |
| 8200 | Office & Facilities | Rent, utilities, supplies |
| 8300 | Legal & Professional | Legal counsel, accounting, audit |
| 8400 | Insurance | D&O, E&O, cyber, general liability |
| 8500 | Travel & Entertainment | Business travel, team events |
| 8600 | Recruiting | Agency fees, job boards, events |

---

## Revenue Recognition (ASC 606)

### Five-Step Model

| Step | Application to ARG-Builder |
|------|---------------------------|
| 1. Identify contract | Signed subscription agreement or online acceptance |
| 2. Identify performance obligations | Subscription access, implementation, training (separate obligations) |
| 3. Determine transaction price | Contract value, net of discounts |
| 4. Allocate to obligations | Standalone selling price for each obligation |
| 5. Recognize when satisfied | Subscription: ratably over term; Services: upon delivery |

### Recognition Rules

| Revenue Type | Recognition Method | Timing |
|-------------|-------------------|--------|
| Monthly subscription | Recognized monthly | Month of service |
| Annual subscription (prepaid) | Recognized ratably over 12 months | 1/12 per month |
| Multi-year subscription | Recognized ratably over contract term | Monthly over term |
| Implementation services | Recognized upon completion | Milestone delivery |
| Training packages | Recognized upon delivery | Session completion |
| Professional services | Recognized as delivered | Time & materials or milestone |

---

## Expense Policies

### Expense Categories & Limits

| Category | Pre-Approval Required | Limit (per occurrence) | Documentation |
|----------|---------------------|----------------------|---------------|
| Software/tools | > $500/month | $5,000/year per tool | Invoice + business justification |
| Travel (domestic) | > $1,000 | $2,500 per trip | Receipts + itinerary |
| Travel (international) | Always | $5,000 per trip | Receipts + itinerary + approval |
| Meals (business) | No | $75/person | Receipt + attendees + purpose |
| Team events | > $500 | $100/person | Receipt + attendee list |
| Equipment | > $500 | $3,000 per item | Receipt + asset tag |
| Professional development | > $1,000 | $2,500/year per person | Receipt + relevance |
| Client entertainment | Always | $200/person | Receipt + client name + purpose |

### Approval Workflow

| Amount | Approver | Timeline |
|--------|----------|----------|
| < $100 | Self-approved | Submit within 30 days |
| $100–$500 | Manager | Approve within 5 days |
| $500–$2,500 | VP/Director | Approve within 5 days |
| $2,500–$10,000 | CEO | Approve within 3 days |
| > $10,000 | CEO + Board awareness | Approve within 3 days |

---

## Monthly Close Process

### Close Calendar (Target: Day 10)

| Day | Activity | Owner | Deliverable |
|-----|----------|-------|-------------|
| 1 | Cut off period, close AP/AR | Controller | Period locked |
| 2 | Revenue recognition entries | Controller | Revenue schedule |
| 3 | Expense accruals, prepaid amortization | Controller | Accrual journal entries |
| 4 | Payroll reconciliation | Controller | Payroll JE posted |
| 5 | Bank reconciliation | Bookkeeper | Reconciled bank statements |
| 6 | Intercompany reconciliation (if applicable) | Controller | IC entries cleared |
| 7 | Balance sheet review | Controller | BS reconciliation |
| 8 | P&L review, variance analysis | VP Finance | Variance commentary |
| 9 | Management review | CEO + VP Finance | Approved financials |
| 10 | Financial package distributed | VP Finance | Board-ready package |

### Monthly Financial Package

| Report | Audience | Content |
|--------|----------|---------|
| P&L (actual vs. budget) | Leadership + Board | Revenue, COGS, OpEx, EBITDA with variance |
| Balance sheet | Leadership + Board | Assets, liabilities, equity |
| Cash flow statement | Leadership + Board | Operating, investing, financing activities |
| ARR waterfall | Leadership + Board | New, expansion, contraction, churn |
| Burn rate & runway | Leadership + Board | Monthly burn, months of runway |
| Department spend | Department heads | Budget vs. actual by department |
| Headcount report | Leadership | Actual vs. plan, cost per head |

---

## Internal Controls

### Segregation of Duties

| Process | Initiator | Approver | Executor | Reconciler |
|---------|-----------|----------|----------|------------|
| Vendor payment | Requestor | Manager/VP | AP/Controller | Controller |
| Payroll | HR | CEO | Payroll provider | Controller |
| Revenue recognition | Billing system | Controller | Controller | VP Finance |
| Bank transfers | Controller | CEO (> $10K) | Bank | Controller |
| New vendor setup | Requestor | Finance | AP | Controller |
| Credit card charges | Cardholder | Manager | Auto-posted | Controller |

### Key Controls

| Control | Purpose | Frequency | Owner |
|---------|---------|-----------|-------|
| Bank reconciliation | Detect errors/fraud | Monthly | Controller |
| Access review (financial systems) | Prevent unauthorized access | Quarterly | VP Finance |
| Vendor master review | Detect fictitious vendors | Quarterly | Controller |
| Revenue reconciliation | Ensure accurate recognition | Monthly | Controller |
| Expense report audit | Policy compliance | Monthly (sample) | Controller |
| Budget variance analysis | Identify overspend | Monthly | VP Finance |
| Cash forecast update | Ensure adequate runway | Weekly | VP Finance |

---

## Tax Planning

### Tax Obligations

| Tax Type | Jurisdiction | Frequency | Owner |
|----------|-------------|-----------|-------|
| Federal income tax | US (IRS) | Quarterly estimates + annual | Tax advisor |
| State income tax | Delaware + operating states | Annual | Tax advisor |
| Sales tax (SaaS) | States with nexus | Monthly/quarterly | Tax automation (Avalara) |
| Payroll taxes | Federal + state | Per payroll | Payroll provider |
| 1099 reporting | US (contractors) | Annual (January) | Controller |
| R&D tax credit | Federal + state | Annual | Tax advisor |

### Tax Optimization Strategies

| Strategy | Benefit | Implementation |
|----------|---------|---------------|
| R&D tax credit | 6–8% of qualifying R&D expenses | Document qualifying activities |
| Delaware incorporation | Favorable corporate law, no sales tax | Standard for VC-backed startups |
| 83(b) elections | Reduced founder tax on equity | File within 30 days of grant |
| QSBS exclusion | Exclude up to $10M gain from federal tax | Hold stock > 5 years |
| Accelerated depreciation | Immediate deduction for equipment | Section 179 / bonus depreciation |
| Sales tax automation | Compliance without manual effort | Avalara or TaxJar integration |

---

## Audit Readiness

### Audit Preparation Checklist

| Category | Items | Status |
|----------|-------|--------|
| Financial statements | P&L, BS, CF for all periods | Monthly close |
| Revenue support | Contracts, invoices, recognition schedule | Ongoing |
| Expense support | Receipts, approvals, vendor agreements | Ongoing |
| Bank statements | All accounts, all months | Monthly reconciliation |
| Equity records | Cap table, option grants, exercises | Carta/Pulley |
| Tax filings | All federal, state, local filings | Annual |
| Payroll records | Pay stubs, tax deposits, W-2s/1099s | Per payroll |
| Corporate records | Board minutes, resolutions, bylaws | Per meeting |

---

## Financial Systems Stack

| System | Purpose | Cost | Owner |
|--------|---------|------|-------|
| QuickBooks Online (Advanced) | General ledger, AP, AR | $200/month | Controller |
| Stripe | Payment processing, billing | 2.9% + $0.30/transaction | Engineering |
| Carta | Cap table, equity management | $3K–$10K/year | VP Finance |
| Avalara | Sales tax automation | $500–$2K/month | Controller |
| Brex/Ramp | Corporate cards, expense management | Free–$12/user/month | Controller |
| Gusto/Rippling | Payroll, benefits | $40 + $6/person/month | HR |
| Metabase | Financial dashboards | $500/month | VP Finance |
| Google Sheets | Ad-hoc modeling, budgets | Included in Workspace | VP Finance |
