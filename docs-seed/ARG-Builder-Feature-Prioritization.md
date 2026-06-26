# ARG-Builder: Feature Prioritization

## Executive Summary

This document defines ARG-Builder's systematic approach to feature prioritization — the decision-making engine that ensures engineering resources are invested in the highest-impact work. A rigorous prioritization framework eliminates opinion-based roadmap decisions and replaces them with data-driven, strategically-aligned choices.

---

## Prioritization Methodology: Weighted RICE-S

ARG-Builder uses a modified RICE framework enhanced with a Strategic Alignment factor (RICE-S).

### Scoring Formula

> **Priority Score = (Reach × Impact × Strategic Alignment × Confidence) / Effort**

### Scoring Dimensions

| Dimension | Definition | Scale | Measurement Method |
|-----------|-----------|-------|-------------------|
| **Reach** | Number of customers/users affected per quarter | 0.5–10 (logarithmic) | Product analytics, customer requests, TAM analysis |
| **Impact** | Degree of improvement for affected users | 0.25 (minimal) – 3 (massive) | Customer interviews, competitive analysis |
| **Strategic Alignment** | How well it supports company strategy | 0.5 (tangential) – 3 (core strategic) | OKR mapping, board priorities |
| **Confidence** | How certain we are about R, I, and S estimates | 20% – 100% | Data quality, research depth |
| **Effort** | Person-weeks of engineering work | 0.5 – 20+ | Engineering estimates (T-shirt → refined) |

---

## Reach Scoring Guide

| Score | Reach Level | Definition | Example |
|-------|------------|-----------|---------|
| 10 | Universal | Affects 100% of users every session | Core UI improvement |
| 8 | Very High | Affects 80%+ of users weekly | Search enhancement |
| 6 | High | Affects 50–80% of users monthly | New export format |
| 4 | Moderate | Affects 20–50% of users | Integration with popular tool |
| 2 | Low | Affects 5–20% of users | Enterprise-specific feature |
| 1 | Very Low | Affects < 5% of users | Niche use case |
| 0.5 | Minimal | Affects single customer/edge case | Custom request |

---

## Impact Scoring Guide

| Score | Impact Level | Definition | Evidence Required |
|-------|-------------|-----------|------------------|
| 3.0 | Massive | Game-changing; creates new market category | Market research, competitive void |
| 2.0 | High | Significant improvement; major differentiator | Customer interviews (5+), competitive gap |
| 1.0 | Medium | Notable improvement; expected feature | Customer requests (10+), industry standard |
| 0.5 | Low | Minor improvement; nice-to-have | Some requests, minor friction reduction |
| 0.25 | Minimal | Barely noticeable improvement | Internal observation only |

---

## Strategic Alignment Scoring

| Score | Alignment Level | Definition | Examples |
|-------|----------------|-----------|----------|
| 3.0 | Core Strategic | Directly enables top company OKR | Features that drive NRR, reduce churn |
| 2.5 | High Strategic | Strongly supports strategic initiative | Enterprise readiness, platform play |
| 2.0 | Moderate Strategic | Supports secondary objectives | Operational efficiency, developer experience |
| 1.5 | Low Strategic | Tangentially related to strategy | Technical debt, minor improvements |
| 1.0 | Neutral | Neither supports nor conflicts | Maintenance, bug fixes |
| 0.5 | Misaligned | Conflicts with current strategy | Features for deprioritized segments |

---

## Effort Estimation

| T-Shirt Size | Person-Weeks | Typical Scope | Examples |
|-------------|-------------|---------------|---------|
| XS | 0.5–1 | Config change, copy update, minor UI tweak | Button text change, color update |
| S | 1–2 | Single component, simple feature | New filter option, tooltip addition |
| M | 2–4 | Multi-component feature, integration | New dashboard widget, API endpoint |
| L | 4–8 | Major feature, new capability | AI search overhaul, new persona type |
| XL | 8–16 | Platform capability, architecture change | Real-time collaboration, mobile app |
| XXL | 16+ | Major platform shift, new product | Complete redesign, new product line |

---

## Input Sources & Weighting

| Source | Weight | Collection Method | Frequency |
|--------|--------|-------------------|-----------|
| Customer requests (CSM-reported) | 25% | CRM tags, CS feedback | Continuous |
| Churn/loss reasons | 20% | Win/loss interviews, exit surveys | Monthly analysis |
| Strategic roadmap (board/exec) | 20% | Quarterly planning, board feedback | Quarterly |
| Product analytics (usage gaps) | 15% | Mixpanel/Amplitude funnels | Weekly review |
| Competitive pressure | 10% | Competitive intel, deal losses | Monthly analysis |
| Engineering-identified (tech debt) | 5% | Sprint retros, architecture reviews | Bi-weekly |
| Support ticket patterns | 5% | Zendesk analysis, ticket clustering | Monthly |

---

## Prioritization Process

### Monthly Prioritization Cycle

| Week | Activity | Participants | Output |
|------|----------|-------------|--------|
| Week 1 | Input collection & scoring | PM + Data Analyst | Scored feature backlog |
| Week 2 | Cross-functional review | PM + Eng Lead + Design + CS | Validated scores, effort estimates |
| Week 3 | Executive alignment | PM + VP Product + CEO | Strategic override decisions |
| Week 4 | Sprint planning | PM + Engineering team | Committed sprint backlog |

### Decision Matrix

| Priority Score | Action | Timeline |
|---------------|--------|----------|
| > 50 | Must-do: Schedule immediately | Current or next sprint |
| 30–50 | Should-do: Plan for this quarter | Within 4–6 weeks |
| 15–30 | Could-do: Backlog for next quarter | 2–4 months |
| 5–15 | Won't-do now: Monitor for changes | Re-evaluate quarterly |
| < 5 | Decline: Communicate decision | Archive with reasoning |

---

## Example Prioritization

| Feature | Reach | Impact | Strategic | Confidence | Effort | Score | Priority |
|---------|-------|--------|-----------|-----------|--------|-------|----------|
| AI-powered search v2 | 10 | 2.0 | 3.0 | 80% | 6 | 8.0 | Must-do |
| Slack integration | 6 | 1.0 | 2.5 | 90% | 4 | 3.4 | Should-do |
| Custom branding | 4 | 1.0 | 2.0 | 70% | 3 | 1.9 | Could-do |
| Mobile app | 8 | 2.0 | 2.0 | 50% | 16 | 1.0 | Won't-do now |
| PDF export v2 | 6 | 0.5 | 1.5 | 90% | 2 | 2.0 | Could-do |
| Real-time collab | 8 | 3.0 | 3.0 | 40% | 12 | 2.4 | Should-do (validate first) |

---

## Governance & Communication

### Stakeholder Communication

| Audience | Format | Frequency | Content |
|----------|--------|-----------|---------|
| Engineering team | Sprint planning | Bi-weekly | What we're building and why |
| Customer Success | Roadmap update | Monthly | What's coming, ETA, talking points |
| Sales team | Feature release notes | Per release | What's new, how to sell it |
| Customers (CAB) | Roadmap preview | Quarterly | Strategic direction, feedback request |
| Board/Investors | Product update | Quarterly | Progress vs. plan, key decisions |

### "No" Communication Template

When declining a feature request:

> "Thank you for suggesting [feature]. We've evaluated it against our current priorities and it scored [X] on our prioritization framework. Here's why: [brief reasoning]. We're currently focused on [higher-priority items] that will benefit [broader audience]. We've added this to our backlog and will re-evaluate [timeframe]. In the meantime, here's a workaround: [alternative approach]."
