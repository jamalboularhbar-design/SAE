# ARG-Builder: Data-Driven Decision Making Framework

## Executive Summary

This document defines ARG-Builder's framework for making decisions based on evidence rather than intuition — the structured approach that ensures every significant business decision is informed by data, validated by analysis, and measured by outcomes. Data-driven companies are 23x more likely to acquire customers and 6x more likely to retain them.

---

## Decision Classification

### Decision Types & Data Requirements

| Decision Type | Examples | Data Required | Analysis Depth | Timeline |
|--------------|---------|---------------|---------------|----------|
| **Strategic** | Market entry, pricing model, M&A | Market data, financial models, competitive intel | Deep (2–4 weeks) | Quarterly |
| **Tactical** | Feature priority, campaign budget, hiring | Product metrics, funnel data, capacity models | Moderate (3–5 days) | Monthly |
| **Operational** | Bug priority, email timing, A/B test | Real-time metrics, experiment results | Light (same day) | Daily/Weekly |
| **Emergency** | Incident response, churn save, PR crisis | Available data + judgment | Rapid (< 1 hour) | Immediate |

---

## Decision Framework (RAPID-D)

### Step 1: Recognize the Decision

| Element | Question | Output |
|---------|----------|--------|
| What | What exactly needs to be decided? | Clear decision statement |
| Why | Why does this matter now? | Business impact quantified |
| Who | Who is the decision maker? Who provides input? | RAPID roles assigned |
| When | By when must this be decided? | Deadline set |
| Reversibility | Is this a one-way or two-way door? | Risk level determined |

### Step 2: Assemble Evidence

| Evidence Type | Source | Reliability | Weight |
|--------------|--------|-------------|--------|
| Quantitative (internal) | Product analytics, CRM, financial systems | High | 40% |
| Quantitative (external) | Market research, benchmarks, surveys | Medium-High | 25% |
| Qualitative (internal) | Customer interviews, team insights | Medium | 20% |
| Qualitative (external) | Industry reports, expert opinions | Medium-Low | 10% |
| Analogies | Similar decisions (own or others') | Low | 5% |

### Step 3: Analyze & Model

| Analysis Type | When to Use | Tools |
|--------------|-------------|-------|
| Descriptive | "What happened?" | Dashboards, reports |
| Diagnostic | "Why did it happen?" | Cohort analysis, segmentation |
| Predictive | "What will happen?" | Forecasting models, ML |
| Prescriptive | "What should we do?" | Optimization, simulation |
| Causal | "What caused what?" | A/B tests, quasi-experiments |

### Step 4: Present Options

| For Each Option | Document |
|----------------|----------|
| Description | Clear, specific action to take |
| Expected outcome | Quantified prediction with confidence interval |
| Assumptions | What must be true for this to work |
| Risks | What could go wrong, likelihood, impact |
| Resource requirements | Time, money, people needed |
| Reversibility | How easily can we undo this |
| Data supporting | Evidence that favors this option |
| Data against | Evidence that argues against |

### Step 5: Decide & Document

| Documentation Element | Content |
|----------------------|---------|
| Decision statement | What was decided |
| Rationale | Why this option was chosen |
| Key data points | Top 3–5 data points that drove the decision |
| Assumptions | What we're betting on |
| Success metrics | How we'll know it worked |
| Review date | When we'll evaluate the outcome |
| Dissenting views | Alternative perspectives considered |

### Step 6: Measure & Learn

| Timing | Action | Output |
|--------|--------|--------|
| T+1 week | Check early signals | Quick pulse |
| T+1 month | Measure primary metrics | Progress report |
| T+3 months | Full outcome assessment | Decision review |
| T+6 months | Long-term impact | Lessons learned |

---

## Data Infrastructure for Decisions

### Data Sources & Ownership

| Data Domain | Primary Source | Owner | Refresh Rate |
|------------|---------------|-------|-------------|
| Product usage | Mixpanel/Amplitude | Product | Real-time |
| Revenue & billing | Stripe + CRM | Finance | Daily |
| Customer health | Composite (calculated) | CS Ops | Daily |
| Pipeline & sales | CRM (HubSpot/Salesforce) | Sales Ops | Real-time |
| Marketing performance | Google Analytics + HubSpot | Marketing Ops | Daily |
| Engineering velocity | Jira/Linear | Eng Manager | Weekly |
| Employee data | HRIS (Rippling/Gusto) | People Ops | Weekly |
| Market data | Research tools + manual | Strategy | Monthly |

### Decision Dashboards

| Dashboard | Audience | Key Metrics | Update |
|-----------|----------|-------------|--------|
| Executive Overview | C-suite | ARR, NRR, burn, runway, Rule of 40 | Daily |
| Sales Performance | Sales leadership | Pipeline, win rate, quota attainment | Real-time |
| Product Health | Product + Eng | DAU/MAU, feature adoption, errors | Real-time |
| Customer Health | CS leadership | Health scores, churn risk, NPS | Daily |
| Marketing Funnel | Marketing | MQLs, conversion rates, CAC | Daily |
| Financial Health | Finance | Cash, burn, revenue vs. plan | Daily |

---

## Common Decision Traps & Mitigations

| Bias | Description | Mitigation |
|------|-------------|-----------|
| Confirmation bias | Seeking data that confirms existing beliefs | Assign "red team" to argue opposite |
| Survivorship bias | Only looking at successful examples | Include failure data in analysis |
| Anchoring | Over-weighting first data point seen | Present multiple data points simultaneously |
| Recency bias | Over-weighting recent events | Include historical trends (12+ months) |
| Sunk cost fallacy | Continuing because of past investment | Evaluate only future costs/benefits |
| HiPPO effect | Deferring to highest-paid person's opinion | Require data before opinions in meetings |
| Analysis paralysis | Over-analyzing, never deciding | Set decision deadlines, "good enough" threshold |
| False precision | Treating estimates as exact numbers | Always include confidence intervals |

---

## Experimentation Culture

### Experiment Hierarchy

| Level | Scope | Example | Approval | Duration |
|-------|-------|---------|----------|----------|
| Micro-experiment | UI element, copy change | Button color, CTA text | IC decision | 1–2 weeks |
| Feature experiment | New capability, workflow | New onboarding flow | PM approval | 2–4 weeks |
| Business experiment | Pricing, positioning, channel | New pricing tier | VP approval | 4–8 weeks |
| Strategic experiment | Market, product, model | New vertical | CEO approval | 8–16 weeks |

### Experiment Standards

| Requirement | Standard |
|-------------|----------|
| Hypothesis | Written before experiment starts |
| Sample size | Calculated for 80% power, 95% confidence |
| Duration | Minimum 2 full business weeks |
| Primary metric | One clearly defined success metric |
| Guardrail metrics | 2–3 metrics that must not degrade |
| Documentation | Pre-registered in experiment tracker |
| Analysis | Completed within 1 week of experiment end |
| Decision | Ship, iterate, or kill — decided within 48h of analysis |

---

*Document prepared by Manus AI for ARG-Builder strategic operations.*
