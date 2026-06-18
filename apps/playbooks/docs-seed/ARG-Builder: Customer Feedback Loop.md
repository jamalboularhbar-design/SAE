# ARG-Builder: Customer Feedback Loop

## Executive Summary

This document defines ARG-Builder's customer feedback system — the structured methodology for collecting, analyzing, prioritizing, and acting on customer input across all touchpoints. A closed-loop feedback system ensures every piece of customer insight reaches the right team, informs product decisions, and results in visible action that builds customer trust and loyalty.

---

## Feedback Collection Framework

### Collection Channels

| Channel | Type | Frequency | Owner | Volume |
|---------|------|-----------|-------|--------|
| In-app surveys (NPS/CSAT) | Quantitative | Quarterly (NPS), Post-interaction (CSAT) | Product | High |
| Feature request portal | Qualitative | Always-on | Product | Medium |
| Support tickets | Qualitative | Always-on | Support | High |
| Customer interviews | Qualitative | Monthly (10–15 interviews) | Product Research | Low |
| QBR feedback | Qualitative | Quarterly | CS | Medium |
| Sales call notes | Qualitative | Every opportunity | Sales | High |
| Community discussions | Qualitative | Always-on | Community | Medium |
| Social media mentions | Qualitative | Always-on | Marketing | Low |
| Churn exit interviews | Qualitative | Every churn event | CS | Low |
| Beta testing feedback | Qualitative | Per feature release | Product | Medium |
| Usage analytics | Quantitative | Always-on (passive) | Product Analytics | High |

### Survey Strategy

| Survey Type | Trigger | Question | Scale | Target Response Rate |
|-------------|---------|----------|-------|---------------------|
| NPS | 90 days post-onboarding, then quarterly | "How likely are you to recommend ARG-Builder?" | 0–10 | > 30% |
| CSAT | After support interaction | "How satisfied were you with this interaction?" | 1–5 | > 40% |
| CES | After key workflow completion | "How easy was it to accomplish your goal?" | 1–7 | > 25% |
| Feature satisfaction | 14 days after feature launch | "How useful is [feature] for your workflow?" | 1–5 | > 20% |
| Onboarding | Day 7, Day 30 | "How would you rate your onboarding experience?" | 1–5 | > 50% |

---

## Feedback Processing

### Categorization Taxonomy

| Category | Sub-categories | Priority Signal |
|----------|---------------|-----------------|
| **Feature request** | New capability, enhancement, integration | Volume + revenue weight |
| **Bug report** | Functional, visual, performance | Severity + frequency |
| **Usability issue** | Confusion, friction, workflow gap | Frequency + churn correlation |
| **Content gap** | Missing documentation, unclear guidance | Support ticket volume |
| **Praise/positive** | What's working well | Retention correlation |
| **Competitive** | Feature parity, switching reasons | Win/loss data |
| **Pricing/packaging** | Value perception, tier confusion | Revenue impact |

### Scoring & Prioritization

| Factor | Weight | Scoring (1–5) |
|--------|--------|---------------|
| Request frequency (# of customers) | 25% | 1 = 1 customer, 5 = 50+ customers |
| Revenue weight (ARR of requestors) | 25% | 1 = < $50K, 5 = > $500K |
| Strategic alignment | 20% | 1 = off-strategy, 5 = core to vision |
| Churn risk correlation | 15% | 1 = no correlation, 5 = primary churn driver |
| Implementation effort (inverse) | 15% | 1 = 6+ months, 5 = < 1 week |

---

## Feedback-to-Action Pipeline

### Workflow Stages

| Stage | Action | Owner | SLA |
|-------|--------|-------|-----|
| 1. Collection | Feedback captured in system | Various (see channels) | Real-time |
| 2. Categorization | Tagged, categorized, de-duplicated | Product Ops | 48 hours |
| 3. Analysis | Patterns identified, themes extracted | Product Research | Weekly |
| 4. Prioritization | Scored, ranked, roadmap consideration | Product Manager | Bi-weekly |
| 5. Decision | Accept, defer, or decline with rationale | Product Lead | Monthly |
| 6. Communication | Customer informed of decision/timeline | CSM or Product | Within 1 week of decision |
| 7. Implementation | Feature built and shipped | Engineering | Per roadmap |
| 8. Closing the loop | Customer notified of delivery | CSM + Product | Within 1 week of ship |

### Closing the Loop

| Decision | Communication Template | Channel | Owner |
|----------|----------------------|---------|-------|
| Accepted (building now) | "Great news! We're building [feature]. Expected delivery: [date]." | Email + in-app | CSM |
| Accepted (roadmapped) | "We've added [feature] to our roadmap for [quarter]. We'll keep you updated." | Email | CSM |
| Deferred | "We appreciate this feedback. While not in our immediate plans, we're tracking demand and will revisit in [timeframe]." | Email | CSM |
| Declined | "After careful consideration, [feature] doesn't align with our current direction because [reason]. Here's an alternative approach: [workaround]." | Email | CSM |
| Shipped | "You asked, we delivered! [Feature] is now live. Here's how to use it: [link]." | Email + in-app | Product |

---

## Feedback Analytics

### Key Metrics

| Metric | Definition | Target | Frequency |
|--------|-----------|--------|-----------|
| NPS score | Net Promoter Score | > 50 | Quarterly |
| CSAT score | Customer Satisfaction | > 4.2/5 | Monthly |
| CES score | Customer Effort Score | > 5.5/7 | Monthly |
| Feedback volume | Total pieces of feedback/month | Growing | Monthly |
| Response rate | % of surveys completed | > 30% | Monthly |
| Loop closure rate | % of feedback with response to customer | > 90% | Monthly |
| Time to close loop | Days from feedback to customer communication | < 14 days | Monthly |
| Feature adoption (from feedback) | % of shipped features that achieve target adoption | > 70% | Quarterly |
| Feedback-to-ship time | Days from request to delivery | < 90 days (P0) | Quarterly |

---

## Tools & Infrastructure

| Tool | Purpose | Integration |
|------|---------|-------------|
| Productboard / Canny | Feature request management, voting | CRM, Intercom |
| Intercom / Zendesk | Support feedback capture | CRM, Product tools |
| Typeform / Delighted | Survey delivery and analysis | Email, in-app |
| Dovetail / Grain | Interview recording and analysis | Calendar, Slack |
| Mixpanel / Amplitude | Usage analytics (passive feedback) | Product |
| Slack (#feedback channel) | Internal feedback sharing | All tools |

---

*Document prepared by Manus AI for ARG-Builder customer feedback operations.*
