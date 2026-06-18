# ARG-Builder: Customer Support Operations & Ticketing

## Executive Summary

This document defines ARG-Builder's customer support operations — the systems, processes, and standards that ensure every customer interaction resolves quickly, professionally, and in a way that strengthens the relationship. Support is not a cost center; it is a revenue-protection and expansion engine.

---

## Support Philosophy

### Core Principles

| Principle | Definition | Metric |
|-----------|-----------|--------|
| Speed | First response within SLA, resolution ASAP | First Response Time (FRT) |
| Empathy | Understand the customer's context and urgency | CSAT per interaction |
| Ownership | One person owns the ticket to resolution | Resolution without escalation rate |
| Transparency | Proactive updates, honest timelines | Customer effort score (CES) |
| Learning | Every ticket improves the product or documentation | Deflection rate improvement |

---

## Support Tiers & SLAs

### Tier Structure

| Tier | Scope | Staff | Tools |
|------|-------|-------|-------|
| Tier 0 (Self-serve) | Knowledge base, in-app guides, community | AI chatbot | Help center, Intercom |
| Tier 1 (Frontline) | Common issues, how-to, configuration | Support specialists | Zendesk, macros |
| Tier 2 (Technical) | Complex issues, integrations, bugs | Senior support engineers | Zendesk + Jira |
| Tier 3 (Engineering) | Critical bugs, infrastructure, data issues | Engineers (on-call) | Jira, PagerDuty |
| Tier 4 (Executive) | Escalated accounts, relationship issues | VP CS / CEO | Direct communication |

### SLA Matrix

| Plan | Severity 1 (Critical) | Severity 2 (High) | Severity 3 (Medium) | Severity 4 (Low) |
|------|----------------------|-------------------|--------------------|--------------------|
| **Starter** | 4 hours (FRT) / 24h (resolution) | 8 hours / 48h | 24 hours / 5 days | 48 hours / 10 days |
| **Professional** | 1 hour / 8h | 4 hours / 24h | 8 hours / 3 days | 24 hours / 7 days |
| **Enterprise** | 30 min / 4h | 2 hours / 12h | 4 hours / 24h | 8 hours / 5 days |
| **Strategic** | 15 min / 2h | 1 hour / 8h | 2 hours / 12h | 4 hours / 3 days |

### Severity Definitions

| Severity | Definition | Examples | Escalation |
|----------|-----------|----------|-----------|
| **S1 (Critical)** | Service completely down, data loss, security breach | Platform outage, data corruption, unauthorized access | Immediate: Eng on-call + VP |
| **S2 (High)** | Major feature broken, significant performance degradation | Search not working, AI generation failing, slow load (>10s) | Within 1 hour: Senior support + Eng |
| **S3 (Medium)** | Feature partially broken, workaround available | Export failing for specific format, UI glitch | Standard queue: Tier 2 |
| **S4 (Low)** | Minor issue, cosmetic, feature request | Typo in UI, color preference, enhancement idea | Standard queue: Tier 1 |

---

## Ticket Management

### Ticket Lifecycle

| Stage | Actions | Owner | Max Duration |
|-------|---------|-------|-------------|
| New | Auto-categorize, assign priority, route | System | < 1 min |
| Assigned | Agent reviews, acknowledges | Tier 1/2 | Within SLA FRT |
| In Progress | Investigation, troubleshooting, communication | Assigned agent | Per SLA |
| Waiting on Customer | Info requested, awaiting response | Customer | 72h (then follow-up) |
| Waiting on Internal | Escalated to engineering or product | Internal team | Per severity |
| Resolved | Solution provided, confirmed working | Agent | — |
| Closed | Auto-close after 48h of no response post-resolution | System | 48h |

### Routing Rules

| Criteria | Route To | Logic |
|----------|----------|-------|
| Plan = Enterprise/Strategic | Dedicated support pod | Named assignment |
| Category = Billing | Finance support | Keyword + category |
| Category = Technical/Bug | Tier 2 | Complexity detection |
| Category = How-to | Tier 1 | Standard queue |
| Language ≠ English | Multilingual agent | Language detection |
| Sentiment = Angry/Frustrated | Senior agent | Sentiment analysis |
| Customer health score < 40 | Priority queue + CSM alert | Health score check |

---

## Knowledge Base & Self-Service

### Content Architecture

| Section | Articles | Update Frequency | Owner |
|---------|----------|-----------------|-------|
| Getting Started | 15–20 | Monthly | Product Marketing |
| Feature Guides | 50–80 | Per release | Product + Support |
| Troubleshooting | 30–50 | Weekly | Support team |
| API Documentation | 20–40 | Per release | Engineering |
| Best Practices | 15–25 | Monthly | Customer Success |
| FAQs | 30–50 | Weekly | Support team |
| Video Tutorials | 20–30 | Monthly | Marketing |
| Release Notes | Ongoing | Per release | Product |

### Self-Service Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Self-service resolution rate | > 60% | (KB views - tickets created) / KB views |
| Article helpfulness rating | > 80% positive | Thumbs up/down on articles |
| Search success rate | > 70% | Searches with click / total searches |
| Chatbot resolution rate | > 40% | Bot-resolved / bot-initiated conversations |
| Time to find answer | < 3 minutes | Average session duration on help center |
| Ticket deflection rate | > 30% | Reduction in tickets after KB improvement |

---

## Support Metrics & Reporting

### Key Performance Indicators

| Metric | Definition | Target | Reporting |
|--------|-----------|--------|-----------|
| First Response Time (FRT) | Time from ticket creation to first human response | < 2 hours (avg) | Daily |
| First Contact Resolution (FCR) | % resolved in first interaction | > 70% | Weekly |
| Average Resolution Time | Time from creation to resolution | < 12 hours | Weekly |
| Customer Satisfaction (CSAT) | Post-interaction survey score | > 4.5/5 | Per ticket |
| Net Promoter Score (NPS) | Quarterly relationship survey | > 50 | Quarterly |
| Customer Effort Score (CES) | "How easy was it to resolve?" | > 4/5 | Per ticket |
| Ticket volume | Total tickets per period | Decreasing per customer | Monthly |
| Escalation rate | % tickets escalated to Tier 2+ | < 20% | Weekly |
| SLA compliance | % tickets resolved within SLA | > 95% | Daily |
| Agent utilization | Tickets handled per agent per day | 15–25 | Daily |

### Reporting Cadence

| Report | Audience | Frequency | Content |
|--------|----------|-----------|---------|
| Daily dashboard | Support team | Daily | Volume, FRT, open tickets, SLA status |
| Weekly summary | Support manager | Weekly | Trends, CSAT, FCR, escalations, top issues |
| Monthly review | VP CS | Monthly | Full metrics, staffing, quality, improvements |
| Quarterly business review | Leadership | Quarterly | Strategic metrics, cost per ticket, ROI |

---

## Staffing Model

### Capacity Planning

| Growth Stage | Customers | Monthly Tickets | Agents Needed | Ratio |
|-------------|-----------|----------------|---------------|-------|
| Early (0–50) | 50 | 200 | 2 (1 T1, 1 T2) | 1:25 customers |
| Growth (50–200) | 200 | 800 | 5 (3 T1, 2 T2) | 1:40 customers |
| Scale (200–500) | 500 | 1,500 | 10 (6 T1, 3 T2, 1 Lead) | 1:50 customers |
| Mature (500–2,000) | 2,000 | 4,000 | 20 (12 T1, 5 T2, 2 Lead, 1 Mgr) | 1:100 customers |

### Coverage Model

| Timezone | Hours | Staff Required | Approach |
|----------|-------|---------------|----------|
| US East (ET) | 8am–8pm ET | Core team | Full staffing |
| US West (PT) | 8am–8pm PT | Overlap + extended | Staggered shifts |
| Europe (CET) | 9am–6pm CET | Dedicated (Year 2+) | Hire in region |
| After-hours | 8pm–8am ET | On-call (Sev 1 only) | Rotation + PagerDuty |
| Weekends | Sat–Sun | Reduced (Sev 1–2 only) | Rotation |

---

## Quality Assurance

### Ticket Review Process

| Element | Standard | Frequency | Reviewer |
|---------|----------|-----------|---------|
| Tone & empathy | Professional, warm, solution-oriented | 10% of tickets | QA Lead |
| Technical accuracy | Correct information, proper resolution | 10% of tickets | Tier 2 |
| Process adherence | Followed escalation, documentation, SLA | 5% of tickets | Manager |
| Knowledge base update | Created/updated article when applicable | Every resolved ticket | Agent self-check |

### Quality Score Rubric

| Dimension | Weight | 5 (Excellent) | 3 (Acceptable) | 1 (Needs Improvement) |
|-----------|--------|---------------|----------------|----------------------|
| Resolution accuracy | 30% | Correct, complete, verified | Correct but incomplete | Incorrect or misleading |
| Communication quality | 25% | Clear, empathetic, proactive | Clear but transactional | Confusing or cold |
| Process compliance | 20% | All steps followed perfectly | Minor deviations | Significant gaps |
| Efficiency | 15% | Resolved quickly, no waste | Reasonable time | Excessive back-and-forth |
| Documentation | 10% | Thorough internal notes, KB updated | Basic notes | No documentation |

---

## Incident Management

### Incident Response Process

| Phase | Duration | Actions | Communication |
|-------|----------|---------|---------------|
| Detection | < 5 min | Alert triggered, on-call notified | Internal: Slack alert |
| Assessment | < 15 min | Severity determined, team assembled | Internal: Incident channel created |
| Communication | < 30 min | Status page updated, affected customers notified | External: Email + in-app banner |
| Resolution | Per severity SLA | Fix deployed, verified | External: Updates every 30 min (S1) or 2h (S2) |
| Recovery | < 2h post-fix | Full service restored, monitoring | External: "Resolved" notification |
| Post-mortem | < 48h | Root cause analysis, prevention plan | Internal: Post-mortem document shared |

---

*Document prepared by Manus AI for ARG-Builder customer operations.*
