# ARG-Builder: SaaS Metrics Glossary & Standardized Definitions

## Authoritative Reference for All Business Metrics Used Across the Organization

---

## 1. Purpose

This glossary establishes the single source of truth for how ARG-Builder defines, calculates, and reports every business metric. Consistent definitions prevent misalignment between teams, ensure accurate investor reporting, and enable meaningful benchmarking against industry standards.

---

## 2. Revenue Metrics

### MRR (Monthly Recurring Revenue)

> **Definition:** The total predictable revenue normalized to a monthly amount from all active subscriptions, excluding one-time fees, professional services, and variable usage charges.

**Formula:** Sum of (each customer's monthly subscription amount)

**Components:**
- **New MRR:** Revenue from customers acquired this month
- **Expansion MRR:** Additional revenue from existing customers (upgrades, seats, add-ons)
- **Contraction MRR:** Reduced revenue from existing customers (downgrades)
- **Churned MRR:** Revenue lost from customers who cancelled
- **Reactivation MRR:** Revenue from previously churned customers who return

**Calculation Rules:**
- Annual contracts: Divide annual amount by 12
- Multi-year contracts: Use annual rate divided by 12
- Discounts: Use discounted (actual) amount, not list price
- Free trials: Excluded until conversion to paid
- Pilots: Included only if paid

---

### ARR (Annual Recurring Revenue)

> **Definition:** MRR × 12. Represents the annualized run-rate of recurring revenue.

**Formula:** ARR = MRR × 12

**Important Notes:**
- ARR is a point-in-time metric (snapshot, not cumulative)
- Does not include one-time revenue, even if predictable
- Used for valuation multiples and investor reporting

---

### ACV (Annual Contract Value)

> **Definition:** The average annualized revenue per customer contract, including recurring subscription fees.

**Formula:** ACV = Total new ARR booked in period / Number of new contracts in period

**Distinction from ARR:**
- ARR = total recurring revenue (all customers)
- ACV = average per-deal value (new bookings)

---

### ARPA (Average Revenue Per Account)

> **Definition:** Total MRR divided by total number of paying customers.

**Formula:** ARPA = Total MRR / Number of paying customers

**Segmentation:** Calculate separately for Starter, Professional, and Enterprise tiers.

---

### TCV (Total Contract Value)

> **Definition:** The total value of a contract over its full term, including all recurring and one-time fees.

**Formula:** TCV = (Monthly recurring × contract months) + one-time fees

---

## 3. Growth Metrics

### MRR Growth Rate

> **Definition:** Month-over-month percentage change in MRR.

**Formula:** (Current month MRR - Previous month MRR) / Previous month MRR × 100

**Benchmarks:**
- Early stage (< $1M ARR): > 15% MoM
- Growth stage ($1M–$10M ARR): > 8% MoM
- Scale stage (> $10M ARR): > 5% MoM

---

### Net Revenue Retention (NRR)

> **Definition:** The percentage of recurring revenue retained from existing customers over a period, including expansion and contraction, but excluding new customer revenue.

**Formula:** NRR = (Beginning MRR + Expansion - Contraction - Churn) / Beginning MRR × 100

**Benchmarks:**
- Below average: < 100%
- Average: 100–110%
- Good: 110–120%
- Excellent: 120–130%
- Best-in-class: > 130%

**ARG-Builder Target:** 125%

---

### Gross Revenue Retention (GRR)

> **Definition:** The percentage of recurring revenue retained from existing customers, excluding expansion (only measuring contraction and churn).

**Formula:** GRR = (Beginning MRR - Contraction - Churn) / Beginning MRR × 100

**Note:** GRR can never exceed 100%. It measures your ability to keep existing revenue.

**Benchmarks:**
- Below average: < 85%
- Average: 85–90%
- Good: 90–95%
- Excellent: > 95%

---

### Quick Ratio (SaaS)

> **Definition:** Measures growth efficiency by comparing revenue additions to revenue losses.

**Formula:** (New MRR + Expansion MRR) / (Churned MRR + Contraction MRR)

**Benchmarks:**
- Unhealthy: < 1.0 (shrinking)
- Acceptable: 1.0–2.0
- Good: 2.0–4.0
- Excellent: > 4.0

---

## 4. Customer Metrics

### Logo Churn Rate (Customer Churn)

> **Definition:** The percentage of customers who cancel their subscription in a given period.

**Formula:** Customers lost in period / Customers at beginning of period × 100

**Calculation Rules:**
- Monthly: Customers churned this month / customers at start of month
- Annual: 1 - (1 - monthly churn rate)^12
- Exclude free trials and pilots from denominator
- A customer is "churned" on the date their subscription ends (not cancellation request date)

---

### Revenue Churn Rate (Dollar Churn)

> **Definition:** The percentage of MRR lost from churned customers in a given period.

**Formula:** MRR lost from churned customers / Beginning MRR × 100

**Distinction from logo churn:** Revenue churn can differ significantly if large or small customers churn disproportionately.

---

### Net MRR Churn

> **Definition:** Revenue churn offset by expansion from surviving customers.

**Formula:** (Churned MRR + Contraction MRR - Expansion MRR) / Beginning MRR × 100

**Note:** Negative net churn means expansion exceeds losses — the holy grail of SaaS.

**ARG-Builder Target:** Negative net churn (-5% or better)

---

### Customer Lifetime

> **Definition:** The average duration a customer remains a paying subscriber.

**Formula:** 1 / Monthly churn rate (in months)

**Example:** 1.5% monthly churn → 1/0.015 = 67 months average lifetime

---

## 5. Unit Economics

### CAC (Customer Acquisition Cost)

> **Definition:** The fully-loaded cost to acquire one new paying customer.

**Formula:** Total Sales & Marketing spend in period / New customers acquired in period

**What to include in S&M spend:**
- Sales team compensation (base + commission + benefits)
- Marketing team compensation
- Advertising and paid media
- Content production costs
- Events and conferences
- Sales and marketing tools/software
- Allocated overhead (office, admin)

**What to exclude:**
- Customer success (post-sale)
- Product development
- General & administrative (unless directly supporting S&M)

**Segmentation:** Calculate blended AND by channel/segment.

---

### LTV (Customer Lifetime Value)

> **Definition:** The total gross profit expected from a customer over their entire relationship.

**Formula:** LTV = (ARPA × Gross Margin) / Monthly Churn Rate

**Alternative formula (with expansion):**
LTV = ARPA × Gross Margin × Customer Lifetime × (1 + Annual Expansion Rate)

**ARG-Builder Calculation:**
- ARPA: $5,200/month
- Gross Margin: 82%
- Monthly Churn: 1.5%
- LTV = ($5,200 × 0.82) / 0.015 = $284,267

---

### LTV/CAC Ratio

> **Definition:** The ratio of customer lifetime value to acquisition cost, measuring return on acquisition investment.

**Formula:** LTV / CAC

**Benchmarks:**
- Unsustainable: < 1x (losing money on each customer)
- Break-even: 1x
- Minimum viable: 3x
- Healthy: 3–5x
- Strong: 5–10x
- May be under-investing in growth: > 10x

---

### CAC Payback Period

> **Definition:** The number of months required to recover the cost of acquiring a customer.

**Formula:** CAC / (ARPA × Gross Margin)

**Benchmarks:**
- Excellent: < 12 months
- Good: 12–18 months
- Acceptable: 18–24 months
- Concerning: > 24 months

---

### Burn Multiple

> **Definition:** How much cash is burned to generate each dollar of net new ARR.

**Formula:** Net Burn / Net New ARR

**Benchmarks:**
- Amazing: < 1x
- Good: 1–1.5x
- Acceptable: 1.5–2x
- Concerning: 2–3x
- Unsustainable: > 3x

---

### Magic Number

> **Definition:** Revenue efficiency metric measuring how much new ARR is generated per dollar of S&M spend.

**Formula:** (Current quarter ARR - Previous quarter ARR) / Previous quarter S&M spend

**Benchmarks:**
- Inefficient: < 0.5 (reduce spend or improve efficiency)
- Acceptable: 0.5–0.75
- Efficient: 0.75–1.0 (invest more in growth)
- Very efficient: > 1.0 (significantly increase investment)

---

## 6. Engagement Metrics

### DAU/MAU Ratio

> **Definition:** The percentage of monthly active users who are active on any given day, measuring product stickiness.

**Formula:** Daily Active Users / Monthly Active Users × 100

**Benchmarks:**
- Low engagement: < 15%
- Moderate: 15–25%
- Good: 25–40%
- Exceptional (consumer-like): > 40%

---

### Feature Adoption Rate

> **Definition:** The percentage of active users who have used a specific feature at least once in the measurement period.

**Formula:** Users who used feature / Total active users × 100

---

### Time to Value (TTV)

> **Definition:** The elapsed time from customer sign-up to their first meaningful value realization event.

**Measurement:** Time from contract signature to first "aha moment" (defined per product as: first operational guide generated and shared with team).

**ARG-Builder Target:** < 48 hours

---

## 7. Efficiency Metrics

### Gross Margin

> **Definition:** Revenue minus cost of goods sold (COGS), expressed as a percentage.

**Formula:** (Revenue - COGS) / Revenue × 100

**What counts as COGS for SaaS:**
- Hosting/infrastructure costs
- Third-party API costs (AI models)
- Customer support (Tier 1)
- DevOps/site reliability
- Payment processing fees

**Benchmarks:**
- Below average: < 70%
- Average: 70–75%
- Good: 75–80%
- Excellent: > 80%

---

### Rule of 40

> **Definition:** The sum of revenue growth rate and profit margin should exceed 40% for a healthy SaaS business.

**Formula:** Revenue Growth Rate (%) + EBITDA Margin (%) ≥ 40

**Interpretation:**
- High growth + losses: Acceptable if sum > 40 (e.g., 100% growth + -40% margin = 60)
- Moderate growth + profit: Acceptable if sum > 40 (e.g., 30% growth + 15% margin = 45)
- Low growth + low profit: Concerning (e.g., 15% growth + 10% margin = 25)

---

### Sales Efficiency (SaaS)

> **Definition:** Revenue generated per dollar of sales and marketing investment.

**Formula:** Net New ARR / Total S&M Spend (same period)

---

### Revenue Per Employee

> **Definition:** Total ARR divided by total full-time employees.

**Formula:** ARR / Total FTEs

**Benchmarks:**
- Early stage: $100K–$200K per employee
- Growth stage: $200K–$300K per employee
- Scale stage: $300K–$500K per employee
- Best-in-class: > $500K per employee

---

## 8. Sales Metrics

### Pipeline Coverage

> **Definition:** The ratio of qualified pipeline value to quota/target for a given period.

**Formula:** Total qualified pipeline / Revenue target × 100

**Benchmark:** 3–4x coverage for predictable attainment.

---

### Win Rate

> **Definition:** The percentage of qualified opportunities that result in a closed-won deal.

**Formula:** Closed Won / (Closed Won + Closed Lost) × 100

**Note:** Exclude opportunities that are still open or disqualified.

---

### Sales Cycle Length

> **Definition:** The average number of days from opportunity creation to closed-won.

**Formula:** Sum of (close date - create date for all won deals) / Number of won deals

---

### Quota Attainment

> **Definition:** The percentage of assigned quota achieved by a sales rep or team.

**Formula:** Actual bookings / Assigned quota × 100

---

## 9. Customer Success Metrics

### NPS (Net Promoter Score)

> **Definition:** Customer loyalty metric based on likelihood to recommend on a 0–10 scale.

**Formula:** % Promoters (9–10) - % Detractors (0–6)

**Range:** -100 to +100

**Benchmarks:**
- Below average: < 20
- Average: 20–40
- Good: 40–60
- Excellent: > 60

---

### CSAT (Customer Satisfaction Score)

> **Definition:** Direct satisfaction measurement, typically on a 1–5 scale.

**Formula:** (Satisfied responses [4–5]) / Total responses × 100

---

### CES (Customer Effort Score)

> **Definition:** Measures how easy it is for customers to accomplish their goals with the product.

**Formula:** Average score on "How easy was it to [action]?" (1–7 scale)

---

### Health Score

> **Definition:** Composite score predicting customer retention likelihood based on multiple signals.

**Components (ARG-Builder):**
- Product usage (30%)
- Support interactions (20%)
- NPS/CSAT (20%)
- Engagement (15%)
- Contract/payment status (15%)

---

## 10. Financial Metrics

### Runway

> **Definition:** The number of months the company can continue operating at current burn rate with available cash.

**Formula:** Current cash balance / Monthly net burn rate

---

### Monthly Burn Rate

> **Definition:** The net cash consumed per month (total expenses minus total revenue).

**Formula:** Total monthly expenses - Total monthly revenue

**Note:** "Gross burn" = total expenses. "Net burn" = expenses minus revenue.

---

### Months to Break-Even

> **Definition:** Projected months until monthly revenue equals monthly expenses.

**Formula:** Based on current growth trajectory and expense plan.

---

## 11. Reporting Cadence

| Metric Category | Reporting Frequency | Audience |
|----------------|--------------------|---------| 
| Revenue (MRR, ARR, NRR) | Weekly (internal), Monthly (board) | All leadership |
| Unit economics (CAC, LTV) | Monthly | Finance, Sales, Marketing |
| Engagement (DAU/MAU, TTV) | Weekly | Product, CS |
| Sales (pipeline, win rate) | Weekly | Sales, Revenue |
| Customer health | Weekly | CS, Product |
| Financial (burn, runway) | Monthly | CEO, CFO, Board |
| All metrics (comprehensive) | Monthly | Board deck |
