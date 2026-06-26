# ARG-Builder: Customer Journey

## End-to-End Framework for Designing, Automating, and Optimizing Every Customer Touchpoint

---

## 1. Executive Summary

Customer journey orchestration moves beyond static lifecycle emails to dynamic, multi-channel experiences that adapt in real-time based on customer behavior, context, and intent. Rather than treating customers as segments in a funnel, orchestration treats each customer as an individual on a unique path — triggering the right message, through the right channel, at the right moment. This document defines ARG-Builder's complete journey orchestration strategy from awareness through advocacy.

---

## 2. Journey Architecture

### 2.1 Journey Stages

| Stage | Customer State | Primary Goal | Success Metric |
|-------|---------------|-------------|---------------|
| Awareness | Knows the problem, discovering solutions | Educate, build trust | Website visits, content engagement |
| Consideration | Evaluating ARG-Builder vs. alternatives | Demonstrate value, differentiate | Trial signups, demo requests |
| Activation | New customer, first experiences | Achieve first value quickly | Time to first value, activation rate |
| Adoption | Using product, building habits | Deepen engagement, expand usage | Feature adoption, DAU/WAU |
| Expansion | Ready for more value | Increase ACV, add seats/features | Expansion revenue, NRR |
| Renewal | Approaching contract end | Secure renewal, prevent churn | Renewal rate, GRR |
| Advocacy | Highly satisfied, willing to promote | Generate referrals, testimonials | NPS, referrals, reviews |

### 2.2 Journey Orchestration Principles

| Principle | Implementation |
|-----------|---------------|
| Behavior-triggered, not time-based | Actions trigger next touchpoint, not arbitrary delays |
| Channel-appropriate | Use the channel that fits the message and moment |
| Contextually relevant | Content reflects what customer just did or needs |
| Respectful frequency | Never overwhelm; quality over quantity |
| Measurably effective | Every touchpoint has a measurable outcome |
| Continuously optimized | A/B test, measure, iterate |
| Human + automated | Automation handles scale, humans handle complexity |

---

## 3. Awareness Stage Orchestration

### 3.1 Awareness Touchpoints

| Trigger | Channel | Content | Goal |
|---------|---------|---------|------|
| First website visit | Website | Personalized hero based on referral source | Engage |
| Blog post read | Website | Related content recommendation | Deepen engagement |
| Content download | Email | Nurture sequence (3 emails over 2 weeks) | Move to consideration |
| Webinar registration | Email + calendar | Confirmation + prep materials | Attendance |
| Social engagement | Social | Follow-up content, community invite | Build relationship |
| Paid ad click | Landing page | Tailored LP matching ad message | Convert to trial/demo |

### 3.2 Content Nurture Sequence

| Email | Timing | Subject | Content | CTA |
|-------|--------|---------|---------|-----|
| 1 | Day 0 (download) | "Here's your [resource] + a quick tip" | Deliver asset + one actionable insight | Read the guide |
| 2 | Day 3 | "How [Company] solved [problem]" | Case study relevant to their interest | See the results |
| 3 | Day 7 | "The framework behind great ops teams" | Educational content, thought leadership | Watch 3-min video |
| 4 | Day 14 | "See it in action (2-min demo)" | Product demo video, soft CTA | Start free trial |

---

## 4. Activation Stage Orchestration

### 4.1 Activation Journey Map

| Day | Trigger | Channel | Action | Success Criteria |
|-----|---------|---------|--------|-----------------|
| 0 | Signs up | Email + in-app | Welcome + guided setup wizard | Account created |
| 0 | Completes signup | In-app | Interactive onboarding tour | Tour completed |
| 1 | No first guide created | Email + in-app | "Create your first guide in 2 minutes" | First guide created |
| 2 | First guide created | In-app | Celebration + "try AI generation" prompt | AI feature used |
| 3 | No team invited | Email | "Invite your team — here's why" | Team member invited |
| 5 | Low engagement | Email | "Quick wins you might have missed" | Feature discovery |
| 7 | Active user | In-app | "You're doing great — here's what's next" | Advanced feature adoption |
| 14 | Trial ending (if applicable) | Email + in-app | Conversion prompt with value summary | Conversion to paid |

### 4.2 Activation Milestones

| Milestone | Definition | Target Timing | Intervention if Missed |
|-----------|-----------|--------------|----------------------|
| Account setup complete | Profile, workspace configured | Day 0 | In-app prompt + email |
| First guide created | Any guide (template or custom) | Day 1 | Email + in-app nudge |
| AI feature used | Generated content with AI | Day 3 | Feature highlight email |
| Team member invited | At least 1 teammate added | Day 5 | Social proof email |
| Integration connected | At least 1 integration | Day 7 | Integration guide email |
| "Aha moment" reached | 3+ guides created AND team active | Day 10 | Proactive CS outreach if not reached |

### 4.3 Activation Scoring

| Signal | Points | Weight |
|--------|--------|--------|
| Completed onboarding tour | 10 | Required |
| Created first guide | 20 | Required |
| Used AI generation | 15 | High |
| Invited team member | 15 | High |
| Connected integration | 10 | Medium |
| Returned Day 2+ | 10 | Medium |
| Created 3+ guides | 20 | High |
| **Activated threshold** | **≥ 60 points** | — |

---

## 5. Adoption Stage Orchestration

### 5.1 Feature Adoption Campaigns

| Feature | Trigger | Channel | Message | Timing |
|---------|---------|---------|---------|--------|
| Advanced templates | User created 5+ guides manually | In-app tooltip | "Save time with templates — here are 3 for your industry" | After 5th guide |
| AI customization | User used AI 3+ times | In-app + email | "Customize AI output to match your voice" | After 3rd AI use |
| Analytics dashboard | User has 10+ guides | In-app banner | "See which guides your team uses most" | After 10th guide |
| Workflow automation | Team has 3+ active users | Email | "Automate guide updates when processes change" | After team activation |
| API/integrations | Technical user detected | In-app + docs | "Connect ARG-Builder to your existing tools" | After technical signals |

### 5.2 Engagement Recovery

| Signal | Severity | Channel | Action | Timing |
|--------|----------|---------|--------|--------|
| No login for 7 days | Low | Email | "Here's what's new since you last visited" | Day 7 |
| No login for 14 days | Medium | Email + in-app (next login) | "Your team is waiting — quick wins inside" | Day 14 |
| No login for 30 days | High | Email + CSM alert | "We miss you — can we help?" + CSM outreach | Day 30 |
| Usage dropped 50%+ | High | CSM alert | Proactive call — understand what changed | Within 48 hours |
| Key user churned (left company) | Critical | CSM alert | Identify new champion, re-onboard | Within 24 hours |

---

## 6. Expansion Stage Orchestration

### 6.1 Expansion Triggers

| Trigger | Signal | Action | Owner |
|---------|--------|--------|-------|
| Seat utilization > 80% | All seats active, waitlist forming | Proactive upgrade conversation | CSM |
| Feature limit approaching | Approaching plan limits | In-app upgrade prompt + CSM alert | Product + CSM |
| New department interest | Users from new department signing up | Cross-sell conversation | CSM + AE |
| Power user emergence | Individual exceeding usage benchmarks | Champion development + expansion | CSM |
| Positive NPS + high health | NPS 9–10, health score > 80 | Expansion conversation | CSM |
| Contract anniversary | 6 months into annual contract | Mid-term review + expansion discussion | CSM |

### 6.2 Expansion Playbook

| Step | Timing | Action | Channel |
|------|--------|--------|---------|
| 1 | Trigger detected | Alert CSM, prepare expansion brief | Internal |
| 2 | Within 1 week | Value review conversation | Call/meeting |
| 3 | During conversation | Identify additional use cases/teams | Discussion |
| 4 | Within 3 days | Custom expansion proposal | Email + document |
| 5 | Within 2 weeks | Decision and close | Call + contract |
| 6 | Post-expansion | Onboard new users/teams | CS-led |

---

## 7. Renewal Stage Orchestration

### 7.1 Renewal Journey (90-Day Countdown)

| Day Before Renewal | Action | Channel | Owner |
|-------------------|--------|---------|-------|
| 120 | Renewal risk assessment (internal) | Internal | CS Ops |
| 90 | Renewal conversation initiated | Call/email | CSM |
| 90 | Value delivered report sent | Email | Automated |
| 75 | Renewal proposal (if changes needed) | Email + call | CSM |
| 60 | Negotiation (if needed) | Call | CSM + AE |
| 45 | Final terms agreed | Email | CSM |
| 30 | Contract sent for signature | Email (DocuSign) | CSM |
| 14 | Reminder if unsigned | Email + call | CSM |
| 7 | Escalation if unsigned | Call (manager) | CS Manager |
| 0 | Renewal processed | System | Automated |
| +7 | Thank you + year-ahead planning | Email + call | CSM |

### 7.2 At-Risk Renewal Intervention

| Risk Level | Signals | Intervention |
|-----------|---------|-------------|
| Low risk | Health > 70, engaged, no complaints | Standard renewal process |
| Medium risk | Health 40–70, declining usage, minor issues | CSM proactive outreach, value reinforcement |
| High risk | Health < 40, support escalations, champion left | Executive engagement, recovery plan, concessions |
| Critical | Stated intent to churn, competitive evaluation | All-hands save attempt, executive-to-executive |

---

## 8. Advocacy Stage Orchestration

### 8.1 Advocacy Triggers & Actions

| Trigger | Action | Channel | Incentive |
|---------|--------|---------|-----------|
| NPS 9–10 submitted | Request review on G2/Capterra | Email (personalized) | $25 gift card |
| Customer achieves major milestone | Request case study participation | CSM conversation | Co-marketing, early access |
| Referral program eligible | Invite to referral program | Email + in-app | Revenue share or credits |
| 12+ months, high health | Invite to advisory board | CSM + executive | Influence roadmap, recognition |
| Speaking opportunity | Invite to co-present at event | Email | Conference attendance, visibility |
| Community contribution | Recognize and amplify | Social + community | Public recognition |

### 8.2 Referral Program Integration

| Stage | Trigger | Action |
|-------|---------|--------|
| Eligible | Health > 80, NPS 9–10, 6+ months | Auto-enrolled, notification sent |
| Activated | Shares referral link | Track, provide materials |
| Referred | Someone signs up via link | Notify referrer, thank them |
| Converted | Referral becomes customer | Deliver reward, celebrate |
| Super-referrer | 3+ successful referrals | VIP treatment, increased rewards |

---

## 9. Multi-Channel Orchestration

### 9.1 Channel Selection Matrix

| Context | Best Channel | Rationale |
|---------|-------------|-----------|
| Urgent, time-sensitive | In-app notification + email | Immediate visibility |
| Educational, non-urgent | Email | Consumable at their pace |
| Complex, relationship | Video call / meeting | Nuance, rapport |
| Quick update | In-app notification | Non-intrusive |
| Celebration | Email + in-app + social | Amplify positive moment |
| Risk/intervention | Phone call + email | Personal, urgent |
| Feature discovery | In-app tooltip/banner | Contextual, in-the-moment |
| Community building | Community platform + email | Peer connection |

### 9.2 Frequency Governance

| Channel | Maximum Frequency | Cool-Down Rules |
|---------|------------------|----------------|
| Email (marketing) | 2/week | 48-hour minimum between sends |
| Email (product/transactional) | As needed | No limit (but be judicious) |
| In-app notifications | 1/day (non-critical) | Dismiss = 7-day cool-down for that type |
| In-app tooltips | 1 per session | Don't repeat dismissed tooltips |
| CSM outreach | 1/week (proactive) | Respect "do not contact" periods |
| SMS (if applicable) | Critical only | Opt-in required, max 1/month |

### 9.3 Suppression Rules

| Condition | Suppression |
|-----------|------------|
| Customer in active support escalation | Suppress marketing emails |
| Customer in renewal negotiation | Suppress upsell messages |
| Customer just churned (< 14 days) | Suppress all except win-back (after cooling period) |
| User unsubscribed from marketing | Suppress marketing, allow transactional |
| Account in legal dispute | Suppress all non-essential communication |
| User inactive > 90 days | Reduce to monthly maximum |

---

## 10. Technology & Measurement

### 10.1 Orchestration Technology Stack

| Tool | Purpose | Integration |
|------|---------|-------------|
| Customer.io OR Iterable | Email + multi-channel orchestration | Product events, CRM, billing |
| Intercom / Pendo | In-app messaging, tooltips, tours | Product events |
| Segment | Event collection and routing | All tools |
| HubSpot | CRM, sales sequences | All customer data |
| Metabase | Journey analytics, funnel reporting | Data warehouse |
| Custom (internal) | Health scoring, trigger engine | All data sources |

### 10.2 Journey Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Activation rate (14-day) | > 60% | % reaching activation threshold |
| Time to first value | < 24 hours | Median time to first guide |
| Email engagement (open rate) | > 35% | Email analytics |
| Email engagement (click rate) | > 5% | Email analytics |
| Journey completion rate | > 40% per journey | Funnel analytics |
| Expansion influenced by orchestration | > 30% of expansions | Attribution |
| Churn prevented by intervention | > 20% of at-risk saved | Intervention tracking |
| NPS improvement (journey vs. no journey) | +10 points | Cohort comparison |

### 10.3 Optimization Framework

| Activity | Frequency | Method |
|----------|-----------|--------|
| A/B test email subject lines | Every send | 10% holdout |
| A/B test in-app messaging | Monthly | Feature flag |
| Journey path optimization | Quarterly | Conversion analysis |
| Channel effectiveness review | Monthly | Attribution analysis |
| Suppression rule audit | Quarterly | Complaint/unsubscribe analysis |
| Full journey audit | Semi-annual | End-to-end review |
