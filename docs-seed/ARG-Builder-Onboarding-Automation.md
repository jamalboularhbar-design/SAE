# ARG-Builder: Onboarding Automation

## Executive Summary

This document defines ARG-Builder's automated onboarding system — the technology-driven workflows that ensure every new customer achieves their first value milestone in under 14 days without requiring manual CSM intervention for standard accounts. Automation handles 80% of onboarding touchpoints, freeing CSMs to focus on strategic relationship building.

---

## Automation Architecture

### Onboarding Tiers

| Tier | ACV | Automation Level | Human Touch | Target TTFV |
|------|-----|-----------------|-------------|-------------|
| Self-Serve (Starter) | < $24K | 95% automated | Community + chatbot | 3 days |
| Guided (Professional) | $24K–$60K | 70% automated | CSM-assisted (pooled) | 7 days |
| High-Touch (Enterprise) | > $60K | 40% automated | Dedicated CSM | 14 days |

---

## Automated Workflow Triggers

### Trigger Events & Actions

| Trigger Event | Automated Action | Channel | Timing |
|---------------|-----------------|---------|--------|
| Contract signed | Welcome email + account provisioning | Email + System | Immediate |
| First login | In-app tour activation | In-app | On login |
| No login (48h post-signup) | Nudge email + Slack notification to CSM | Email | Hour 48 |
| First persona created | Congratulations email + next step guide | Email + In-app | Immediate |
| First search performed | Feature tip: Command Palette | In-app tooltip | Immediate |
| 3 days without activity | Re-engagement email with video tutorial | Email | Day 3 |
| All onboarding milestones hit | Success celebration + expansion prompt | Email + In-app | On completion |
| Day 7 (regardless) | Mid-trial check-in | Email | Day 7 |
| Day 10 (not converted) | Urgency sequence + CSM alert | Email + Slack | Day 10 |
| Trial expiration | Grace period notification + save offer | Email | Day 14 |
| First team member invited | Collaboration tips email | Email | Immediate |
| Support ticket submitted | Auto-response + knowledge base suggestion | Email | Immediate |
| NPS response < 7 | CSM alert + intervention workflow | Slack + CRM | Immediate |

---

## Milestone-Based Progression

### Onboarding Milestones (Self-Serve)

| Milestone | Definition | Target Timing | Automated Support |
|-----------|-----------|---------------|-------------------|
| M1: Account Setup | Profile complete, preferences set | Day 0 | Setup wizard |
| M2: First Persona | Created first persona with 3+ attributes | Day 1 | Guided template |
| M3: Process Defined | Defined at least 1 process flow (3+ stages) | Day 2 | Interactive builder |
| M4: Search Used | Performed first search query | Day 2 | Feature prompt |
| M5: Team Invited | Invited at least 1 team member | Day 3 | Collaboration email |
| M6: Guide Published | Published first reference guide | Day 5 | One-click publish |
| M7: Value Realized | Team member accessed guide 3+ times | Day 7 | Usage notification |

### Milestone Tracking Dashboard

| Field | Data Source | Update Frequency |
|-------|------------|-----------------|
| Customer ID | CRM | Static |
| Current milestone | Product events | Real-time |
| Days since signup | System clock | Daily |
| Milestone velocity (vs. target) | Calculated | Daily |
| Risk flag | ML model | Daily |
| CSM assigned | CRM | On assignment |
| Next automated action | Workflow engine | Real-time |

---

## Workflow Specifications

### Workflow 1: Welcome & Setup (Automated)

| Step | Timing | Action | Condition | Fallback |
|------|--------|--------|-----------|----------|
| 1 | T+0 min | Send welcome email with login link | Always | Retry 1h later |
| 2 | T+0 min | Provision account in platform | Always | Alert engineering |
| 3 | T+5 min | Trigger in-app setup wizard on first login | First login | Show on next login |
| 4 | T+1h | Send "Getting Started" video email | If no login yet | — |
| 5 | T+24h | Send "Quick wins" email with templates | If M1 not complete | — |
| 6 | T+48h | CSM notification if no login | If no login | CSM outreach |

### Workflow 2: Activation (Automated + Guided)

| Step | Timing | Action | Condition | Fallback |
|------|--------|--------|-----------|----------|
| 1 | M1 complete | Prompt persona creation with template | Always | Email tutorial |
| 2 | M2 complete | Celebrate + prompt process definition | Always | Video guide |
| 3 | Day 3 (no M2) | Send "stuck?" email with calendar link | M2 not complete | CSM outreach |
| 4 | M3 complete | Feature discovery: search + command palette | Always | Tooltip on next visit |
| 5 | Day 5 (no M3) | CSM alert: at-risk onboarding | M3 not complete | Phone call |
| 6 | M5 complete | Send team collaboration best practices | Always | — |

### Workflow 3: Conversion (Trial → Paid)

| Step | Timing | Action | Condition | Fallback |
|------|--------|--------|-----------|----------|
| 1 | Day 7 | Mid-trial value summary email | Always | — |
| 2 | Day 9 | "Upgrade benefits" email with comparison | Not converted | — |
| 3 | Day 11 | Urgency email: "3 days left" | Not converted | — |
| 4 | Day 12 | CSM personal outreach (if high-value lead) | Lead score > 70 | — |
| 5 | Day 13 | Final reminder + special offer (if eligible) | Not converted | — |
| 6 | Day 14 | Trial expired + grace period (7 days) | Not converted | — |
| 7 | Day 21 | Account frozen + win-back sequence starts | Not converted | — |

---

## Technical Implementation

### Tech Stack

| Component | Tool | Purpose |
|-----------|------|---------|
| Workflow engine | Customer.io / Iterable | Email sequences, event triggers |
| In-app messaging | Intercom / Pendo | Tooltips, tours, announcements |
| Event tracking | Segment | Unified event pipeline |
| CRM | HubSpot / Salesforce | Customer records, CSM alerts |
| Analytics | Mixpanel / Amplitude | Milestone tracking, funnel analysis |
| Alerting | Slack (webhooks) | CSM notifications |
| Scheduling | Calendly | Automated meeting booking |

### Event Schema

| Event Name | Properties | Trigger Source |
|-----------|-----------|---------------|
| `account.created` | plan, source, company_size | Backend |
| `user.first_login` | timestamp, device, referrer | Frontend |
| `persona.created` | persona_type, attribute_count | Frontend |
| `process.defined` | stage_count, process_type | Frontend |
| `search.performed` | query, results_count | Frontend |
| `team.member_invited` | invitee_email, role | Backend |
| `guide.published` | guide_id, persona_count | Frontend |
| `subscription.upgraded` | plan, billing_cycle, amount | Backend |
| `milestone.completed` | milestone_id, days_elapsed | Calculated |

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Onboarding completion rate (all milestones) | > 85% | Per cohort |
| Time to first value (median) | < 7 days | Per customer |
| Automation coverage (touchpoints handled without CSM) | > 80% | Monthly |
| Trial-to-paid conversion | > 12% | Monthly |
| Day-7 activation rate | > 60% | Per cohort |
| CSM time saved per onboarding | > 4 hours | Quarterly estimate |
| Customer satisfaction (onboarding CSAT) | > 4.5/5 | Post-onboarding survey |
