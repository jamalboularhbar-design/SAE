# ARG-Builder: Churn Prevention System

## Executive Summary

This document defines ARG-Builder's comprehensive churn prevention system — a proactive, data-driven framework for identifying at-risk accounts before they churn and executing targeted interventions to save them. For a SaaS business with $2K–$10K/month contracts, losing a single customer costs $24K–$120K in ARR. The system combines health scoring, early warning indicators, automated alerts, intervention playbooks, and save strategies to maintain net revenue retention above 120%.

---

## Customer Health Score Model

The health score is a composite metric (0–100) that predicts the likelihood of renewal. Scores are calculated daily and visible on the customer success dashboard.

### Health Score Components

| Component | Weight | Data Source | Scoring Logic |
|-----------|--------|-------------|---------------|
| Product Usage | 30% | Platform analytics | DAU/MAU ratio, feature breadth, session duration |
| Adoption Depth | 25% | Platform analytics | % of team active, search usage, command palette usage |
| Engagement | 20% | CRM + Support | CSM meeting attendance, email responsiveness, NPS |
| Support Sentiment | 15% | Support tickets | Ticket volume, resolution satisfaction, escalations |
| Contract Signals | 10% | CRM | Payment history, contract discussions, expansion signals |

### Health Score Ranges

| Score | Status | Color | Action |
|-------|--------|-------|--------|
| 80–100 | Healthy | Green | Monitor, identify expansion opportunities |
| 60–79 | Neutral | Yellow | Proactive outreach, engagement boost |
| 40–59 | At Risk | Orange | Intervention required within 7 days |
| 0–39 | Critical | Red | Emergency save protocol within 48 hours |

### Scoring Methodology

**Product Usage (30 points max):**

| Metric | Excellent (30) | Good (20) | Fair (10) | Poor (0) |
|--------|---------------|-----------|-----------|----------|
| DAU/MAU ratio | > 60% | 40–60% | 20–40% | < 20% |
| Features used | > 80% | 50–80% | 25–50% | < 25% |
| Avg session duration | > 5 min | 3–5 min | 1–3 min | < 1 min |
| Weekly sessions/user | > 10 | 5–10 | 2–5 | < 2 |

**Adoption Depth (25 points max):**

| Metric | Excellent (25) | Good (17) | Fair (8) | Poor (0) |
|--------|---------------|-----------|----------|----------|
| Team adoption | > 90% | 70–90% | 50–70% | < 50% |
| Search queries/week | > 20 | 10–20 | 5–10 | < 5 |
| Command palette usage | > 30% of users | 15–30% | 5–15% | < 5% |
| Process timeline views | > 50/week | 20–50 | 5–20 | < 5 |

**Engagement (20 points max):**

| Metric | Excellent (20) | Good (13) | Fair (7) | Poor (0) |
|--------|---------------|-----------|----------|----------|
| CSM meeting attendance | 100% | 75%+ | 50%+ | < 50% |
| Email response time | < 24h | 24–48h | 48–72h | > 72h |
| NPS score | 9–10 | 7–8 | 5–6 | < 5 |
| Feature requests submitted | > 2/quarter | 1–2 | 0 | Complaints only |

**Support Sentiment (15 points max):**

| Metric | Excellent (15) | Good (10) | Fair (5) | Poor (0) |
|--------|---------------|-----------|----------|----------|
| Tickets/month | 0–1 | 2–3 | 4–5 | > 5 |
| Resolution satisfaction | > 4.5/5 | 3.5–4.5 | 2.5–3.5 | < 2.5 |
| Escalations | 0 | 1 | 2 | > 2 |
| Tone sentiment | Positive | Neutral | Frustrated | Angry |

**Contract Signals (10 points max):**

| Metric | Excellent (10) | Good (7) | Fair (3) | Poor (0) |
|--------|---------------|-----------|----------|----------|
| Payment status | On time | — | Late once | Multiple late |
| Expansion discussions | Active | Open | None | Downsizing talk |
| Contract inquiries | Upgrade | None | Questions | Cancellation |
| Champion stability | Same person | — | Role change | Champion left |

---

## Early Warning Indicators

These are specific behavioral signals that predict churn 30–90 days before it happens. Each indicator triggers an automated alert to the assigned CSM.

### Tier 1: Critical Warnings (Predict churn within 30 days)

| Indicator | Detection Method | Confidence |
|-----------|-----------------|------------|
| Champion leaves company | LinkedIn monitoring + CRM | 85% |
| Usage drops > 50% week-over-week | Platform analytics | 78% |
| Cancellation page visited | Event tracking | 90% |
| Executive sponsor disengaged | Meeting no-shows (2+) | 72% |
| Competitor evaluation mentioned | Support ticket / CSM notes | 80% |
| Payment failure (2+ attempts) | Billing system | 65% |

### Tier 2: Moderate Warnings (Predict churn within 60 days)

| Indicator | Detection Method | Confidence |
|-----------|-----------------|------------|
| Login frequency declining (3 weeks) | Platform analytics | 65% |
| Support tickets increasing | Support system | 58% |
| NPS score dropped > 3 points | Survey data | 62% |
| Feature adoption stalled | Platform analytics | 55% |
| CSM emails unanswered (2+ weeks) | CRM | 60% |
| Team members deactivated | Platform admin | 70% |

### Tier 3: Early Warnings (Predict churn within 90 days)

| Indicator | Detection Method | Confidence |
|-----------|-----------------|------------|
| Onboarding milestones missed | Onboarding tracker | 45% |
| Low initial adoption (< 60% at Day 30) | Platform analytics | 50% |
| No expansion interest at QBR | CSM notes | 40% |
| Industry/company downturn | News monitoring | 35% |
| Organizational restructuring | LinkedIn / news | 42% |
| Budget review cycle approaching | Contract data | 38% |

---

## Intervention Playbooks

### Playbook 1: Usage Decline Intervention

**Trigger:** Usage drops > 30% for 2+ consecutive weeks

**Timeline:** Execute within 5 business days of trigger

| Day | Action | Owner | Channel |
|-----|--------|-------|---------|
| 1 | Analyze usage data — identify which features/users declined | CSM | Internal |
| 1 | Send "checking in" email with usage insights | CSM | Email |
| 2 | If no response: call customer champion | CSM | Phone |
| 3 | Schedule "value refresh" session | CSM | Calendar |
| 5 | Conduct value refresh: re-demonstrate features, identify new use cases | CSM | Video call |
| 7 | Follow-up with personalized action plan | CSM | Email |
| 14 | Check usage metrics — confirm recovery | CSM | Dashboard |

**Value Refresh Session Agenda (30 min):**
- Review current usage patterns (5 min)
- Identify underutilized features relevant to their goals (10 min)
- Live demonstration of 2–3 features they're not using (10 min)
- Create action plan with specific adoption targets (5 min)

### Playbook 2: Champion Departure Save

**Trigger:** Customer champion leaves the company

**Timeline:** Execute within 48 hours of detection

| Day | Action | Owner | Channel |
|-----|--------|-------|---------|
| 0 | Identify new point of contact (ask departing champion if possible) | CSM | Email/Phone |
| 1 | Send introduction email to new contact with value summary | CSM | Email |
| 2 | Schedule "re-onboarding" call with new champion | CSM | Calendar |
| 3 | Conduct re-onboarding: platform tour, value demonstration, success metrics | CSM | Video call |
| 5 | Send personalized success plan for new champion | CSM | Email |
| 7 | Executive sponsor check-in (VP CS → their VP) | VP CS | Email |
| 14 | Confirm new champion is engaged and adoption is stable | CSM | Dashboard |

### Playbook 3: Competitive Threat Response

**Trigger:** Customer mentions evaluating competitor or asks for feature comparison

**Timeline:** Execute within 24 hours

| Day | Action | Owner | Channel |
|-----|--------|-------|---------|
| 0 | Alert CS Manager and Account Executive | CSM | Slack |
| 0 | Pull competitive battle card for mentioned competitor | CSM | Internal |
| 1 | Schedule "strategic review" call (position as value discussion, not save) | CSM + AE | Calendar |
| 2 | Conduct strategic review: demonstrate unique value, address gaps, share roadmap | CSM + AE | Video call |
| 2 | If pricing concern: prepare custom retention offer | AE + Finance | Internal |
| 3 | Send follow-up with ROI analysis specific to their usage | CSM | Email |
| 5 | Executive outreach from CEO/VP (for enterprise accounts) | CEO/VP | Email |
| 7 | Follow-up: confirm decision, address remaining concerns | AE | Phone |

### Playbook 4: Low Adoption Recovery

**Trigger:** Team adoption below 60% at Day 30 or drops below 70% after initial adoption

**Timeline:** Execute within 7 business days

| Day | Action | Owner | Channel |
|-----|--------|-------|---------|
| 1 | Analyze: which team members are not adopting and why | CSM | Dashboard |
| 2 | Call customer champion: understand barriers to adoption | CSM | Phone |
| 3 | Create targeted adoption plan (training, content, incentives) | CSM | Document |
| 4 | Conduct team training session focused on non-adopters | CSM | Video call |
| 5 | Send personalized "quick win" guides to low-adoption users | CSM | Email |
| 7 | Implement adoption gamification (if available) | CSM | Platform |
| 14 | Measure improvement — escalate if < 10% improvement | CSM | Dashboard |

---

## Save Offers & Retention Incentives

When a customer explicitly signals intent to cancel, deploy tiered retention offers based on account value and reason for churn.

| Churn Reason | Tier 1 Offer (< $5K MRR) | Tier 2 Offer ($5K–$10K MRR) | Tier 3 Offer (> $10K MRR) |
|--------------|--------------------------|-----------------------------|-----------------------------|
| Price | 1 month free + 10% annual discount | 2 months free + 15% annual discount | Custom pricing + executive review |
| Low usage | Free re-onboarding + 1 month free | Dedicated CSM + 2 months free | Custom implementation + 3 months free |
| Missing features | Roadmap commitment + beta access | Priority feature development + 2 months free | Custom development + executive sponsor |
| Champion left | Free re-onboarding for new champion | Dedicated transition support + 1 month free | Executive-level relationship building |
| Budget cuts | Downgrade option + pause (up to 3 months) | Flexible payment terms + reduced scope | Custom contract restructuring |

### Save Offer Authorization Matrix

| Offer Value | Approval Required |
|-------------|-------------------|
| < $5K (1 month free, small discount) | CSM can approve |
| $5K–$15K (2–3 months free, moderate discount) | CS Manager approval |
| $15K–$50K (custom pricing, development) | VP CS approval |
| > $50K (major concessions) | CEO approval |

---

## Churn Analysis & Learning

After every churn event, conduct a structured post-mortem to extract learnings and improve the prevention system.

**Post-Mortem Template:**

| Question | Answer |
|----------|--------|
| Account name and value | |
| Tenure (months) | |
| Primary churn reason | |
| Were early warnings detected? | |
| Were interventions attempted? | |
| What could we have done differently? | |
| Is this a systemic issue or one-off? | |
| Recommended system improvement | |

---

## System Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Gross revenue retention | > 92% | — |
| Net revenue retention | > 120% | — |
| Logo retention | > 90% | — |
| Save rate (of at-risk accounts) | > 40% | — |
| Time to intervention (from alert) | < 48 hours | — |
| Health score accuracy (predicts churn) | > 75% | — |
| False positive rate | < 20% | — |
