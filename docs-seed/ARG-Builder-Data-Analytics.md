# ARG-Builder: Data Analytics

## Executive Summary

This document defines ARG-Builder's comprehensive data and analytics strategy — the infrastructure, metrics, models, and decision frameworks that transform raw product and business data into actionable intelligence. The strategy covers product analytics (understanding user behavior), customer health analytics (predicting outcomes), business intelligence (operational metrics), and predictive models (forecasting growth and risk). Data-driven decision-making is not optional — it is the foundation of every strategic choice at ARG-Builder.

---

## Analytics Architecture

### Data Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Collection | Segment (CDP) | Unified event tracking across all touchpoints |
| Storage | Snowflake | Cloud data warehouse for all structured data |
| Transformation | dbt | Data modeling, transformation, and testing |
| Visualization | Metabase (internal) + custom dashboards (customer-facing) | Reporting and exploration |
| Reverse ETL | Census or Hightouch | Push insights back to operational tools (CRM, CS) |
| Experimentation | Statsig or LaunchDarkly | A/B testing and feature flags |
| ML/Predictions | Python + scikit-learn (initially) | Churn prediction, lead scoring |

### Event Taxonomy

All product events follow a consistent naming convention: `object.action` (e.g., `guide.created`, `search.executed`, `persona.defined`).

| Category | Events | Purpose |
|----------|--------|---------|
| Account | account.created, account.upgraded, account.churned | Lifecycle tracking |
| User | user.signed_up, user.logged_in, user.invited, user.activated | Adoption tracking |
| Guide | guide.created, guide.viewed, guide.exported, guide.shared | Core product usage |
| Persona | persona.defined, persona.edited, persona.switched | Content engagement |
| Search | search.executed, search.result_clicked, search.no_results | Feature usage |
| Timeline | timeline.viewed, timeline.stage_clicked, timeline.expanded | Feature engagement |
| Command Palette | palette.opened, palette.command_executed, palette.dismissed | Power user behavior |
| Integration | integration.connected, integration.synced, integration.error | Platform stickiness |

---

## Product Analytics

### Core Product Metrics

| Metric | Definition | Target | Frequency |
|--------|-----------|--------|-----------|
| DAU/MAU | Daily active / monthly active users | > 50% | Daily |
| Feature adoption | % of users using each feature weekly | > 60% for core features | Weekly |
| Session duration | Average time spent per session | 5–8 minutes | Daily |
| Sessions per user/week | Average weekly sessions per active user | > 8 | Weekly |
| Search success rate | Searches with result clicks / total searches | > 75% | Daily |
| Guide completion rate | Guides fully generated / guides started | > 90% | Weekly |
| Time to first value | Days from signup to activation milestone | < 3 days | Weekly |
| Stickiness ratio | DAU/WAU (daily to weekly) | > 40% | Daily |

### User Segmentation

| Segment | Definition | % of Users | Strategy |
|---------|-----------|------------|----------|
| Power Users | > 15 sessions/week, use 80%+ features | 15% | Nurture, get feedback, make advocates |
| Regular Users | 5–15 sessions/week, use 50%+ features | 45% | Maintain engagement, introduce new features |
| Light Users | 1–5 sessions/week, use < 50% features | 30% | Activation campaigns, training nudges |
| Dormant Users | < 1 session/week | 10% | Re-engagement campaigns, churn risk |

### Feature Usage Funnel

Track how users progress through the product's core value chain:

| Stage | Action | Target Completion |
|-------|--------|-------------------|
| 1. Awareness | User sees feature in navigation/UI | 100% |
| 2. Discovery | User clicks/opens feature for first time | > 70% |
| 3. Activation | User completes first meaningful action | > 50% |
| 4. Engagement | User returns to feature within 7 days | > 40% |
| 5. Mastery | User uses advanced capabilities | > 20% |

---

## Customer Health Analytics

### Health Score Model (Detailed)

The health score combines product usage, engagement, and business signals into a single predictive metric. The model is trained on historical churn data and validated quarterly.

| Component | Weight | Data Sources | Calculation |
|-----------|--------|-------------|-------------|
| Product Usage Score | 30% | Event data (Segment → Snowflake) | Composite of DAU, features used, session depth |
| Adoption Breadth | 25% | User activity data | Active users / total seats provisioned |
| Engagement Score | 20% | CRM + support data | Meeting attendance, email responsiveness, NPS |
| Support Health | 15% | Zendesk/Intercom | Ticket volume, sentiment, resolution time |
| Business Signals | 10% | CRM + enrichment | Payment status, contract signals, champion stability |

### Predictive Churn Model

| Model Input | Type | Predictive Power |
|-------------|------|-----------------|
| Usage trend (30-day slope) | Numeric | High — declining usage is strongest predictor |
| Days since last login (champion) | Numeric | High — champion disengagement predicts churn |
| Support ticket sentiment | Categorical | Medium — frustrated tickets predict churn |
| NPS score change | Numeric | Medium — declining NPS predicts churn |
| Feature breadth decline | Numeric | Medium — narrowing usage predicts churn |
| Payment failures | Boolean | Low-medium — correlates with budget issues |
| Company news (layoffs, M&A) | Boolean | Low — external factors |

**Model Performance Targets:**

| Metric | Target |
|--------|--------|
| Accuracy | > 80% |
| Precision (true positives) | > 75% |
| Recall (catch rate) | > 85% |
| False positive rate | < 20% |
| Prediction horizon | 60–90 days before churn |

---

## Business Intelligence

### Executive Dashboard

| Section | Metrics | Update Frequency |
|---------|---------|-----------------|
| Revenue | MRR, ARR, NRR, growth rate, runway | Real-time |
| Customers | Total, new, churned, NPS, health distribution | Daily |
| Pipeline | Value, velocity, win rate, coverage ratio | Daily |
| Product | DAU/MAU, activation rate, feature adoption | Daily |
| Team | Headcount, hiring velocity, employee NPS | Weekly |
| Unit Economics | CAC, LTV, LTV/CAC, payback period, burn multiple | Monthly |

### Revenue Analytics

| Metric | Definition | Calculation |
|--------|-----------|-------------|
| MRR | Monthly recurring revenue | Sum of all active subscriptions |
| ARR | Annual recurring revenue | MRR × 12 |
| Net New MRR | Growth in MRR | New + Expansion - Contraction - Churn |
| Quick Ratio | Growth efficiency | (New MRR + Expansion MRR) / (Contraction + Churn MRR) |
| Revenue per Employee | Efficiency metric | ARR / headcount |
| Magic Number | Sales efficiency | Net New ARR / Prior Quarter S&M Spend |
| Burn Multiple | Capital efficiency | Net Burn / Net New ARR |
| Rule of 40 | Growth + profitability | Revenue Growth % + Profit Margin % |

### Cohort Analysis Framework

Track customer cohorts by signup month to understand retention patterns and identify systemic issues.

| Cohort Metric | Definition | Target |
|---------------|-----------|--------|
| Month 1 retention | % of cohort active after 1 month | > 95% |
| Month 3 retention | % of cohort active after 3 months | > 90% |
| Month 6 retention | % of cohort active after 6 months | > 85% |
| Month 12 retention | % of cohort active after 12 months | > 80% |
| Revenue retention (NRR) by cohort | Revenue from cohort vs. starting | > 115% |
| Time to expansion by cohort | Median days to first expansion | < 180 days |

---

## Data-Driven Decision Framework

### Experiment Design Standards

All significant product and business decisions should be validated through structured experiments when possible.

| Experiment Type | When to Use | Duration | Sample Size |
|----------------|-------------|----------|-------------|
| A/B test | UI changes, pricing page, email copy | 2–4 weeks | 1,000+ users per variant |
| Feature flag rollout | New features, risky changes | 1–2 weeks | 10% → 50% → 100% |
| Holdout test | Measuring feature impact | 4–8 weeks | 10% holdout group |
| Pricing test | New pricing models | 4–8 weeks | Geographic or segment split |

### Decision Criteria

| Decision Type | Data Required | Confidence Threshold |
|---------------|--------------|---------------------|
| Ship feature | Activation + retention impact | 90% statistical significance |
| Change pricing | Willingness-to-pay + conversion impact | 95% significance |
| Enter new market | Market size + demand validation | Qualitative + 10 customer interviews |
| Hire role | Capacity model + ROI projection | Financial model approval |
| Kill feature | Usage < 5% for 90 days + no retention impact | 90% significance |

---

## Data Governance

| Policy | Description |
|--------|-------------|
| Data classification | All data classified as Public, Internal, Confidential, or Restricted |
| Access control | Role-based access; analysts see aggregated data, not PII |
| Retention | Product data: 24 months active, 7 years archived. PII: deleted on request |
| Quality | Automated data quality checks (dbt tests) run daily |
| Documentation | All metrics defined in central data dictionary |
| Privacy | No individual-level data shared externally; all reporting is aggregated |

---

## Implementation Roadmap

| Phase | Timeline | Deliverables |
|-------|----------|-------------|
| Foundation | Months 1–2 | Segment setup, event taxonomy, Snowflake, basic dashboards |
| Core Analytics | Months 2–4 | Product analytics, executive dashboard, cohort analysis |
| Health Scoring | Months 4–6 | Customer health model, automated alerts, CS integration |
| Predictive Models | Months 6–9 | Churn prediction, lead scoring, expansion propensity |
| Advanced | Months 9–12 | Experimentation platform, self-serve analytics, ML pipeline |
