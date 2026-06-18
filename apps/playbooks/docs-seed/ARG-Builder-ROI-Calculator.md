# ARG-Builder: Customer Onboarding ROI Calculator

## Interactive Tool Design for Demonstrating Value During Sales and Onboarding

---

## 1. Executive Summary

An ROI calculator is one of the most powerful sales tools in enterprise SaaS — it transforms abstract value propositions into concrete financial outcomes personalized to each prospect. This document specifies the complete design, logic, inputs, outputs, and implementation of ARG-Builder's ROI calculator for use in sales demos, website lead generation, and customer onboarding.

---

## 2. Calculator Design Philosophy

### 2.1 Core Principles

1. **Conservative by default** — Always underestimate savings to build credibility
2. **Transparent assumptions** — Every calculation is explainable and adjustable
3. **Personalized inputs** — Uses prospect's actual data, not generic benchmarks
4. **Multiple value dimensions** — Shows time savings, cost reduction, risk mitigation, and revenue impact
5. **Shareable output** — Generates a PDF/presentation for internal circulation

### 2.2 Use Cases

| Use Case | Stage | User | Purpose |
|----------|-------|------|---------|
| Website lead gen | Top of funnel | Prospect (self-serve) | Capture leads, demonstrate value |
| Sales demo | Discovery/demo | AE + prospect | Quantify pain, build business case |
| Business case | Proposal | Champion + EB | Internal justification |
| Onboarding | Post-sale | CSM + customer | Set expectations, define success |
| QBR | Retention | CSM + customer | Prove ongoing value |

---

## 3. Input Variables

### 3.1 Company Profile Inputs

| Input | Type | Default | Range | Purpose |
|-------|------|---------|-------|---------|
| Company name | Text | — | — | Personalization |
| Industry | Dropdown | — | 10 options | Industry-specific benchmarks |
| Number of employees | Number | 500 | 50–50,000 | Scale calculations |
| Number of knowledge workers | Number | 250 | 25–25,000 | Primary user base |
| Annual revenue | Currency | $50M | $5M–$5B | Revenue impact calculations |
| Number of locations/offices | Number | 3 | 1–500 | Complexity factor |
| Annual employee turnover | Percentage | 20% | 5%–50% | Knowledge loss calculation |
| Average fully-loaded employee cost | Currency | $120,000 | $50K–$500K | Time savings valuation |

### 3.2 Current State Inputs

| Input | Type | Default | Range | Purpose |
|-------|------|---------|-------|---------|
| Hours/week searching for information | Number | 5 | 1–20 | Time savings |
| Current documentation tools | Multi-select | — | List | Migration context |
| % of documentation that is current | Percentage | 40% | 10%–90% | Staleness cost |
| New hire ramp time (months) | Number | 6 | 1–18 | Onboarding savings |
| Annual consulting spend on documentation | Currency | $100K | $0–$2M | Direct cost replacement |
| Hours/year on compliance documentation | Number | 2,000 | 100–20,000 | Compliance savings |
| Number of process-related errors/month | Number | 10 | 0–100 | Quality improvement |
| Average cost per process error | Currency | $5,000 | $500–$100K | Error reduction value |

### 3.3 ARG-Builder Configuration

| Input | Type | Default | Options | Purpose |
|-------|------|---------|---------|---------|
| Plan tier | Dropdown | Professional | Starter/Pro/Enterprise | Pricing |
| Number of users | Number | 50 | 10–5,000 | License cost |
| Implementation type | Dropdown | Standard | Self/Standard/Premium | Setup cost |
| Contract term | Dropdown | Annual | Monthly/Annual/Multi-year | Total investment |

---

## 4. Calculation Logic

### 4.1 Value Dimension 1: Time Savings

**Knowledge Search Time Savings:**
```
Current annual search cost = Knowledge workers × Hours/week searching × 52 weeks × Hourly rate
ARG-Builder reduction = 70% (conservative)
Annual savings = Current cost × 0.70
```

**Example:**
- 250 knowledge workers × 5 hrs/week × 52 × $57.69/hr = $3,750,000 current cost
- 70% reduction = **$2,625,000 annual savings**

### 4.2 Value Dimension 2: Onboarding Acceleration

**New Hire Productivity Savings:**
```
Annual new hires = Employees × Turnover rate
Current ramp cost = New hires × Ramp months × Monthly salary × Productivity loss %
ARG-Builder ramp reduction = 50%
Annual savings = Current ramp cost × 0.50
```

**Example:**
- 500 employees × 20% turnover = 100 new hires
- 100 × 6 months × $10,000/month × 50% productivity loss = $3,000,000 current cost
- 50% reduction = **$1,500,000 annual savings**

### 4.3 Value Dimension 3: Documentation Cost Replacement

**Direct Cost Savings:**
```
Current documentation costs = Consulting spend + Internal FTE time on documentation
ARG-Builder replacement = 60% of consulting + 40% of internal time
Annual savings = (Consulting × 0.60) + (Internal time × 0.40)
```

**Example:**
- $100K consulting + $200K internal time = $300K current cost
- ($100K × 0.60) + ($200K × 0.40) = **$140,000 annual savings**

### 4.4 Value Dimension 4: Error Reduction

**Process Quality Improvement:**
```
Current error cost = Errors/month × 12 × Average cost per error
ARG-Builder reduction = 50% (through standardized procedures)
Annual savings = Current error cost × 0.50
```

**Example:**
- 10 errors/month × 12 × $5,000 = $600,000 current cost
- 50% reduction = **$300,000 annual savings**

### 4.5 Value Dimension 5: Compliance Efficiency

**Compliance Documentation Savings:**
```
Current compliance cost = Hours/year × Hourly rate (compliance staff)
ARG-Builder reduction = 60%
Annual savings = Current cost × 0.60
```

**Example:**
- 2,000 hours × $75/hr = $150,000 current cost
- 60% reduction = **$90,000 annual savings**

### 4.6 Value Dimension 6: Knowledge Retention

**Turnover Knowledge Loss Prevention:**
```
Knowledge loss cost = Departing employees × Knowledge replacement cost
ARG-Builder capture rate = 70% of institutional knowledge preserved
Annual savings = Departing employees × Knowledge cost × 0.70
```

**Example:**
- 100 departures × $15,000 knowledge replacement = $1,500,000 current cost
- 70% capture = **$1,050,000 annual savings**

---

## 5. Output Calculations

### 5.1 Total Annual Value

```
Total Annual Savings = Time Savings + Onboarding + Documentation + Errors + Compliance + Knowledge Retention
```

**Example Total:** $2,625,000 + $1,500,000 + $140,000 + $300,000 + $90,000 + $1,050,000 = **$5,705,000**

### 5.2 ARG-Builder Investment

```
Annual Investment = (Monthly subscription × 12) + Implementation fee (Year 1 only)
```

**Example:** ($5,000/month × 12) + $25,000 implementation = **$85,000 Year 1**

### 5.3 ROI Calculation

```
Year 1 ROI = (Total Annual Savings - Year 1 Investment) / Year 1 Investment × 100
3-Year ROI = (Total 3-Year Savings - Total 3-Year Investment) / Total 3-Year Investment × 100
```

**Example:**
- Year 1 ROI: ($5,705,000 - $85,000) / $85,000 = **6,612%**
- 3-Year ROI: ($17,115,000 - $145,000) / $145,000 = **11,700%**

### 5.4 Payback Period

```
Payback (days) = Annual Investment / (Total Annual Savings / 365)
```

**Example:** $85,000 / ($5,705,000 / 365) = **5.4 days**

---

## 6. Output Presentation

### 6.1 Executive Summary Output

```
┌─────────────────────────────────────────────────────────┐
│  ARG-Builder ROI Analysis for [Company Name]            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Total Annual Value:        $5,705,000                  │
│  Annual Investment:         $85,000                     │
│  Net Annual Benefit:        $5,620,000                  │
│  ROI:                       6,612%                      │
│  Payback Period:            5 days                      │
│                                                         │
│  ┌─────────────────────────────────────────────┐       │
│  │ Value Breakdown:                             │       │
│  │ ████████████████████  Time Savings    46%    │       │
│  │ ██████████████        Onboarding      26%    │       │
│  │ █████████             Knowledge       18%    │       │
│  │ ████                  Errors           5%    │       │
│  │ ██                    Documentation    3%    │       │
│  │ █                     Compliance       2%    │       │
│  └─────────────────────────────────────────────┘       │
│                                                         │
│  3-Year Total Value:        $17,115,000                 │
│  3-Year Total Investment:   $145,000                    │
│  3-Year Net Benefit:        $16,970,000                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 6.2 Detailed Output Sections

**Section 1: Value Summary**
- Total annual savings (headline number)
- Breakdown by dimension (pie chart)
- Monthly value (for comparison to monthly cost)

**Section 2: Investment Summary**
- Subscription cost (monthly and annual)
- Implementation cost
- Total Year 1 investment
- Ongoing annual cost (Year 2+)

**Section 3: ROI Metrics**
- Year 1 ROI percentage
- 3-Year cumulative ROI
- Payback period (days)
- Monthly net value after payback

**Section 4: Assumptions & Methodology**
- All input values used
- Reduction percentages applied
- Industry benchmarks referenced
- Conservative adjustment factors

**Section 5: Sensitivity Analysis**
- Best case / Base case / Conservative case
- Key variable sensitivity (±20%)
- Break-even analysis (what would need to be true for ROI < 100%)

---

## 7. Implementation Specifications

### 7.1 Web Calculator (Lead Generation)

**Location:** argbuilder.com/roi-calculator

**User Flow:**
1. Landing page with value proposition
2. Step 1: Company profile (4 fields)
3. Step 2: Current state (4 fields)
4. Step 3: Results page (gated — email required)
5. PDF download + CTA to schedule demo

**Lead Scoring:**
- Calculator completed = +20 points
- High ROI result (> $1M) = +15 points
- Enterprise size (> 500 employees) = +10 points
- Downloaded PDF = +5 points

### 7.2 Sales Tool (Demo Integration)

**Features:**
- Pre-populated with prospect research data
- Real-time calculation as inputs change
- Side-by-side comparison (current vs. ARG-Builder)
- Save and share functionality
- Export to PDF/PowerPoint
- Integration with CRM (auto-attach to opportunity)

### 7.3 Customer Success Tool (QBR)

**Features:**
- Pre-populated with actual usage data
- Realized value vs. projected value comparison
- Trend over time (value delivered per quarter)
- Recommendations for increasing value capture
- Export for executive sharing

---

## 8. Validation & Credibility

### 8.1 Benchmark Sources

| Metric | Source | Benchmark |
|--------|--------|-----------|
| Time searching for information | McKinsey Global Institute | 1.8 hours/day for knowledge workers |
| New hire ramp time | SHRM | 6–12 months for complex roles |
| Employee turnover cost | Gallup | 50–200% of annual salary |
| Process error costs | ASQ | $10K–$100K per significant error |
| Documentation maintenance | AIIM | 20–30% of content is outdated |

### 8.2 Conservative Adjustments

| Calculation | Raw Estimate | Conservative Factor | Adjusted |
|-------------|-------------|-------------------|----------|
| Time savings | 70% reduction | 0.7x | 49% actual |
| Onboarding | 50% reduction | 0.8x | 40% actual |
| Error reduction | 50% reduction | 0.7x | 35% actual |
| Compliance | 60% reduction | 0.8x | 48% actual |
| Knowledge retention | 70% capture | 0.7x | 49% actual |

**Philosophy:** Always present the conservative number. If the ROI is compelling at conservative estimates, the actual results will exceed expectations — building trust and driving expansion.

---

## 9. Competitive Differentiation

### 9.1 Calculator vs. Competitors

| Feature | ARG-Builder | Competitor A | Competitor B |
|---------|-------------|-------------|-------------|
| Personalized inputs | ✓ (15+ variables) | ✓ (5 variables) | ✗ (generic) |
| Multiple value dimensions | ✓ (6 dimensions) | ✓ (2 dimensions) | ✓ (3 dimensions) |
| Transparent methodology | ✓ (full disclosure) | ✗ (black box) | Partial |
| Sensitivity analysis | ✓ | ✗ | ✗ |
| PDF export | ✓ (branded) | ✓ (basic) | ✗ |
| CRM integration | ✓ | ✗ | ✓ |
| Actual vs. projected tracking | ✓ | ✗ | ✗ |

---

## 10. Success Metrics for the Calculator

| Metric | Target | Measurement |
|--------|--------|-------------|
| Website calculator completions | 200/month | Analytics |
| Lead-to-demo conversion (calculator users) | 35% | CRM |
| Calculator-influenced pipeline | $500K/month | Attribution |
| Average calculated ROI | > 500% | Calculator data |
| Sales team usage (% of demos) | > 80% | CRM activity |
| Customer QBR usage | > 90% | CS tracking |
| PDF downloads | 150/month | Analytics |

---

*Document prepared by Manus AI. ROI calculator designed for ARG-Builder sales acceleration and value demonstration.*
