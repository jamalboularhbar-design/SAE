# ARG-Builder: Product Analytics Framework

## Executive Summary

This document defines ARG-Builder's product analytics framework — the metrics, instrumentation strategy, analysis methodologies, and decision-making processes that ensure every product decision is data-informed. For an AI-powered SaaS platform, understanding how users interact with the product is critical for improving AI quality, reducing churn, driving expansion, and building competitive moats through usage data.

---

## Metrics Architecture

### North Star Metric

| Metric | Definition | Why It Matters |
|--------|-----------|---------------|
| **Weekly Active Guides Consulted** | Number of unique operational guides accessed by team members per week | Directly correlates with value delivery — if teams are consulting guides, they're getting value |

### Input Metrics (Drive the North Star)

| Input Metric | Definition | Target | Lever |
|-------------|-----------|--------|-------|
| Guides created per account | Total guides generated per customer | > 5 within 30 days | Onboarding quality |
| Team members invited | Users added to account | > 10 within 14 days | Activation flow |
| AI generation completion rate | % of AI-started guides completed and published | > 80% | AI quality |
| Search queries per user/week | How often users search within guides | > 5/week | Content quality + UX |
| Guide freshness score | % of guides updated within last 90 days | > 70% | Staleness alerts |

---

## Event Taxonomy

### Core Events

| Event Category | Event Name | Properties | Trigger |
|---------------|-----------|-----------|---------|
| **Account** | account.created | plan, source, industry | Signup |
| **Account** | account.upgraded | from_plan, to_plan, trigger | Plan change |
| **User** | user.invited | role, department, invited_by | Invitation sent |
| **User** | user.activated | time_to_activate, activation_path | First meaningful action |
| **Guide** | guide.created | method (AI/manual), persona, template_used | Guide published |
| **Guide** | guide.viewed | user_role, time_spent, sections_viewed | Guide opened |
| **Guide** | guide.searched | query, results_count, clicked_result | Search executed |
| **Guide** | guide.edited | sections_changed, editor_role, edit_type | Guide updated |
| **AI** | ai.generation.started | prompt_length, persona_count, context_provided | Generation initiated |
| **AI** | ai.generation.completed | duration, quality_score, sections_generated | Generation finished |
| **AI** | ai.generation.feedback | rating (1–5), feedback_text, section | User rates AI output |
| **Feature** | feature.used | feature_name, frequency, user_segment | Any feature interaction |
| **Export** | export.initiated | format (PDF/share/API), guide_id | Export triggered |
| **Integration** | integration.connected | platform, data_synced | Integration activated |
| **Collaboration** | comment.added | guide_id, section, mentions | Comment posted |

### Event Properties (Standard)

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| user_id | string | Unique user identifier | usr_abc123 |
| account_id | string | Account/organization ID | acc_xyz789 |
| timestamp | datetime | Event occurrence time | 2026-04-30T14:30:00Z |
| session_id | string | Browser session | sess_def456 |
| platform | string | Web, API, mobile | web |
| user_role | string | User's role in org | admin, editor, viewer |
| plan | string | Account plan tier | starter, professional, enterprise |

---

## Funnel Analytics

### Activation Funnel

| Stage | Definition | Target Conversion | Measurement |
|-------|-----------|-------------------|-------------|
| 1. Signup | Account created | 100% (baseline) | account.created |
| 2. First guide started | AI generation initiated | > 80% within 24 hours | ai.generation.started |
| 3. First guide completed | Guide published | > 70% within 48 hours | guide.created |
| 4. Team invited | 3+ members added | > 60% within 7 days | user.invited (count ≥ 3) |
| 5. Weekly usage | Guide consulted 3+ times in a week | > 50% within 14 days | guide.viewed (weekly ≥ 3) |
| 6. Activated | All above + 2nd guide created | > 40% within 30 days | Composite |

### Expansion Funnel

| Stage | Definition | Target | Trigger |
|-------|-----------|--------|---------|
| 1. Single department | One team using actively | Baseline | Initial adoption |
| 2. Power usage | > 20 guide views/week | > 60% of accounts | Usage threshold |
| 3. Cross-department interest | Users from 2nd department view guides | > 40% by month 3 | user.department tracking |
| 4. Expansion conversation | CSM identifies opportunity | > 30% by month 4 | Health score + usage |
| 5. Expansion closed | Additional seats/tier/departments | > 20% by month 6 | Billing event |

---

## Cohort Analysis

### Retention Cohorts

| Cohort Dimension | Analysis | Purpose |
|-----------------|----------|---------|
| Signup month | Month-over-month retention curves | Identify if product is improving |
| Plan tier | Retention by plan | Validate pricing/packaging |
| Industry | Retention by vertical | Identify best-fit segments |
| Acquisition channel | Retention by source | Optimize marketing spend |
| Activation speed | Retention by time-to-activate | Validate onboarding investment |
| Company size | Retention by employee count | Refine ICP |

### Retention Benchmarks

| Timeframe | Target (Logo) | Target (Revenue) | Red Flag |
|-----------|--------------|------------------|----------|
| Month 1 | > 95% | > 95% | < 90% |
| Month 3 | > 90% | > 92% | < 85% |
| Month 6 | > 85% | > 90% | < 80% |
| Month 12 | > 80% | > 88% | < 75% |
| Month 24 | > 75% | > 85% | < 70% |

---

## AI-Specific Analytics

### AI Quality Metrics

| Metric | Definition | Target | Measurement |
|--------|-----------|--------|-------------|
| Generation success rate | % of generations that produce usable output | > 95% | ai.generation.completed / ai.generation.started |
| First-pass acceptance | % of AI output accepted without major edits | > 60% | Edit distance analysis |
| User satisfaction | Average rating of AI output | > 4.0/5.0 | ai.generation.feedback |
| Time saved | Estimated time saved vs. manual creation | > 70% reduction | Benchmark comparison |
| Hallucination rate | % of outputs containing factual errors | < 2% | QA sampling + user reports |
| Prompt-to-value time | Time from prompt to published guide | < 30 minutes | Timestamp analysis |

### AI Improvement Loop

| Signal | Data Source | Action | Frequency |
|--------|-----------|--------|-----------|
| Low satisfaction rating | User feedback (1–3 stars) | Review and improve prompts | Weekly |
| High edit rate on specific sections | Edit tracking | Retrain/adjust for that section type | Bi-weekly |
| Generation abandonment | Incomplete generations | UX improvement + prompt refinement | Weekly |
| Repeated similar queries | Search analytics | Pre-build templates for common needs | Monthly |
| Feature requests in feedback | Feedback text analysis | Product roadmap input | Monthly |

---

## Experimentation Framework

### A/B Testing Protocol

| Element | Standard |
|---------|----------|
| Minimum sample size | 1,000 events or 100 users per variant |
| Statistical significance | p < 0.05 (95% confidence) |
| Minimum detectable effect | 5% relative change |
| Test duration | Minimum 2 weeks, maximum 6 weeks |
| Primary metric | One per experiment (pre-declared) |
| Guardrail metrics | 2–3 metrics that must not degrade |

### Experimentation Prioritization (ICE Framework)

| Factor | Score (1–10) | Definition |
|--------|-------------|-----------|
| Impact | How much will this move the North Star? | High = 8–10, Medium = 5–7, Low = 1–4 |
| Confidence | How sure are we this will work? | Data-backed = 8–10, Hypothesis = 5–7, Guess = 1–4 |
| Ease | How easy is this to implement and measure? | < 1 week = 8–10, 1–4 weeks = 5–7, > 4 weeks = 1–4 |

---

## Analytics Tech Stack

| Tool | Purpose | Cost | Owner |
|------|---------|------|-------|
| Segment | Event collection and routing | $120/month (startup plan) | Engineering |
| Amplitude / Mixpanel | Product analytics, funnels, cohorts | $500–$2K/month | Product |
| Metabase | Internal dashboards, SQL queries | $500/month | Data |
| dbt | Data transformation | Open source | Data |
| Snowflake | Data warehouse | $500–$2K/month | Data |
| LaunchDarkly | Feature flags, experimentation | $200–$500/month | Engineering |
| Hotjar / FullStory | Session recording, heatmaps | $200–$500/month | Product |
| Census / Hightouch | Reverse ETL (data → tools) | $300–$500/month | Data |

---

## Reporting Cadence

| Report | Audience | Frequency | Content |
|--------|----------|-----------|---------|
| Daily pulse | Product team | Daily (automated) | Key metrics, anomalies |
| Weekly product review | Product + Engineering | Weekly | Funnel performance, experiments, bugs |
| Monthly product board | Leadership | Monthly | North Star, cohorts, feature adoption |
| Quarterly deep-dive | Board | Quarterly | Strategic metrics, competitive position |
| Annual product review | All company | Annually | Year in review, product vision |

---

*Document prepared by Manus AI for ARG-Builder product analytics operations.*
