# ARG-Builder: Go-to-Market Readiness Checklist

## Executive Summary

This document defines ARG-Builder's comprehensive Go-to-Market (GTM) readiness checklist — the pre-launch validation framework that ensures every new product, feature, or market entry is fully prepared for successful launch. A rigorous GTM readiness process prevents premature launches, aligns cross-functional teams, and maximizes launch impact.

---

## GTM Readiness Framework

### Readiness Levels

| Level | Status | Definition | Action |
|-------|--------|-----------|--------|
| **Green** | Ready | All criteria met, no blockers | Proceed with launch |
| **Yellow** | Conditional | Minor gaps, workarounds available | Launch with documented risks |
| **Red** | Not Ready | Critical gaps, launch would fail | Delay until resolved |

### Gate Criteria

| Gate | Timing | Decision Maker | Criteria |
|------|--------|---------------|----------|
| Gate 1: Concept | 8 weeks pre-launch | VP Product | Problem validated, solution defined |
| Gate 2: Build | 4 weeks pre-launch | VP Product + VP Eng | Product built, tested, stable |
| Gate 3: Enable | 2 weeks pre-launch | VP Sales + VP Marketing | Teams trained, materials ready |
| Gate 4: Launch | Launch day | CEO | All systems go, no red items |

---

## Complete Readiness Checklist

### Category 1: Product Readiness

| # | Item | Owner | Status | Notes |
|---|------|-------|--------|-------|
| 1.1 | Core functionality complete and tested | Eng Lead | ☐ | All user stories accepted |
| 1.2 | Performance benchmarks met (< 3s load, < 200ms API) | Eng Lead | ☐ | Load tested at 2x expected |
| 1.3 | Security review completed | Security Lead | ☐ | No critical/high vulnerabilities |
| 1.4 | Accessibility audit passed (WCAG AA) | Design Lead | ☐ | Automated + manual testing |
| 1.5 | Error handling and edge cases covered | QA Lead | ☐ | Error states designed and tested |
| 1.6 | Data migration plan tested (if applicable) | Eng Lead | ☐ | Rollback procedure documented |
| 1.7 | API documentation complete | Eng Lead | ☐ | OpenAPI spec published |
| 1.8 | Feature flags configured for gradual rollout | Eng Lead | ☐ | Kill switch tested |
| 1.9 | Monitoring and alerting configured | DevOps | ☐ | Dashboards live, alerts tested |
| 1.10 | Rollback plan documented and tested | Eng Lead | ☐ | < 15 min rollback time |

### Category 2: Sales Readiness

| # | Item | Owner | Status | Notes |
|---|------|-------|--------|-------|
| 2.1 | Sales team trained on new feature/product | Sales Enablement | ☐ | All reps certified |
| 2.2 | Demo environment updated | Sales Ops | ☐ | Demo script reviewed |
| 2.3 | Pricing finalized and configured in billing | Finance + Ops | ☐ | All tiers, discounts, add-ons |
| 2.4 | Sales deck updated | Marketing | ☐ | New slides added, old removed |
| 2.5 | Objection handling guide updated | Sales Enablement | ☐ | New objections anticipated |
| 2.6 | CRM updated (fields, stages, products) | Sales Ops | ☐ | Reporting ready |
| 2.7 | Competitive positioning updated | Product Marketing | ☐ | Battle cards refreshed |
| 2.8 | Quota/commission adjustments communicated | Sales Leadership | ☐ | If applicable |
| 2.9 | Partner/channel notified and enabled | Partnerships | ☐ | If applicable |
| 2.10 | Sales FAQ document created | Sales Enablement | ☐ | Top 20 questions answered |

### Category 3: Marketing Readiness

| # | Item | Owner | Status | Notes |
|---|------|-------|--------|-------|
| 3.1 | Messaging and positioning finalized | Product Marketing | ☐ | Approved by leadership |
| 3.2 | Website/landing page live | Marketing | ☐ | SEO optimized, mobile tested |
| 3.3 | Blog post / announcement drafted | Content | ☐ | Scheduled for launch day |
| 3.4 | Email campaigns configured | Demand Gen | ☐ | Segments defined, copy approved |
| 3.5 | Social media content scheduled | Social | ☐ | 2 weeks of content queued |
| 3.6 | Press/analyst outreach completed | Comms | ☐ | Embargo dates set |
| 3.7 | Customer testimonial/case study ready | Customer Marketing | ☐ | At least 1 for launch |
| 3.8 | Paid campaign creative approved | Demand Gen | ☐ | A/B variants ready |
| 3.9 | Product Hunt / launch platform prepared | Marketing | ☐ | If applicable |
| 3.10 | Analytics and attribution configured | Marketing Ops | ☐ | UTMs, conversion tracking |

### Category 4: Customer Success Readiness

| # | Item | Owner | Status | Notes |
|---|------|-------|--------|-------|
| 4.1 | CS team trained on new feature/product | CS Leadership | ☐ | All CSMs certified |
| 4.2 | Onboarding playbook updated | CS Ops | ☐ | New steps added |
| 4.3 | Help center articles published | CS / Content | ☐ | All new features documented |
| 4.4 | In-app guidance configured | Product | ☐ | Tooltips, tours, walkthroughs |
| 4.5 | Customer communication drafted | CS Leadership | ☐ | Existing customer notification |
| 4.6 | Health score model updated | CS Ops | ☐ | New feature usage tracked |
| 4.7 | Escalation paths defined | CS Leadership | ☐ | For new feature issues |
| 4.8 | QBR templates updated | CS Ops | ☐ | New value metrics included |
| 4.9 | Customer webinar/training scheduled | CS | ☐ | For existing customers |
| 4.10 | Feedback collection mechanism ready | Product + CS | ☐ | Survey or in-app feedback |

### Category 5: Support Readiness

| # | Item | Owner | Status | Notes |
|---|------|-------|--------|-------|
| 5.1 | Support team trained | Support Lead | ☐ | All agents certified |
| 5.2 | Knowledge base articles published | Support | ☐ | Troubleshooting guides ready |
| 5.3 | Ticket categories/tags updated | Support Ops | ☐ | Routing rules configured |
| 5.4 | SLA expectations defined | Support Lead | ☐ | Response/resolution targets |
| 5.5 | Escalation matrix updated | Support Lead | ☐ | Eng escalation paths clear |
| 5.6 | Chatbot/AI responses updated | Support Ops | ☐ | New feature Q&A trained |
| 5.7 | Known issues documented | QA + Support | ☐ | Workarounds available |
| 5.8 | Surge capacity plan ready | Support Lead | ☐ | If high ticket volume expected |

### Category 6: Legal & Compliance

| # | Item | Owner | Status | Notes |
|---|------|-------|--------|-------|
| 6.1 | Terms of Service updated (if needed) | Legal | ☐ | Customer notification plan |
| 6.2 | Privacy policy updated (if new data collected) | Legal | ☐ | DPA updates if needed |
| 6.3 | Compliance requirements met | Compliance | ☐ | SOC 2, GDPR, CCPA |
| 6.4 | Contract templates updated | Legal | ☐ | New pricing/features reflected |
| 6.5 | IP review completed | Legal | ☐ | No infringement risks |

### Category 7: Operations & Infrastructure

| # | Item | Owner | Status | Notes |
|---|------|-------|--------|-------|
| 7.1 | Infrastructure scaled for expected load | DevOps | ☐ | 3x headroom |
| 7.2 | Billing system configured | Finance + Eng | ☐ | All SKUs, pricing, trials |
| 7.3 | Analytics tracking implemented | Data + Eng | ☐ | All key events tracked |
| 7.4 | Backup and disaster recovery tested | DevOps | ☐ | RTO/RPO confirmed |
| 7.5 | Third-party integrations tested | Eng | ☐ | All dependencies stable |

---

## Launch Day Checklist

### T-minus Timeline

| Time | Action | Owner | Verification |
|------|--------|-------|-------------|
| T-24h | Final go/no-go decision | CEO | All gates green |
| T-12h | Feature flags ready to flip | Eng Lead | Staging verified |
| T-4h | All teams on standby | All leads | Slack confirmation |
| T-2h | Pre-launch monitoring check | DevOps | All systems nominal |
| T-1h | Marketing assets staged | Marketing | Scheduled posts confirmed |
| T-0 | Feature flag enabled / launch | Eng Lead | Monitoring active |
| T+15m | Smoke test in production | QA | Core flows verified |
| T+30m | Marketing goes live | Marketing | Blog, email, social |
| T+1h | First metrics check | Data + PM | No anomalies |
| T+4h | Initial performance review | All leads | Quick standup |
| T+24h | Day 1 retrospective | PM | Metrics, issues, feedback |
| T+7d | Week 1 review | PM + Leadership | Full analysis |

---

## Post-Launch Monitoring

### First 7 Days

| Day | Focus | Metrics to Watch | Action Threshold |
|-----|-------|-----------------|-----------------|
| Day 1 | Stability | Error rates, latency, uptime | Any P0 incident → rollback |
| Day 2 | Adoption | Feature usage, activation | < 10% of expected → investigate |
| Day 3 | Feedback | Support tickets, NPS, social | Negative trend → address |
| Day 4–5 | Performance | Conversion, engagement | Below baseline → optimize |
| Day 6–7 | Assessment | All metrics vs. forecast | Significant miss → action plan |

---

## Launch Types & Scope

| Launch Type | Scope | GTM Effort | Checklist Sections Required |
|-------------|-------|-----------|---------------------------|
| **Major launch** | New product, new market, pricing change | Full (all sections) | All 7 categories |
| **Feature launch** | Significant new capability | Medium (sections 1, 3, 4, 5) | Product, Marketing, CS, Support |
| **Minor update** | Bug fix, small improvement | Light (sections 1, 5) | Product, Support |
| **Internal launch** | Process change, tool change | Internal only (section 7) | Operations |
