# ARG-Builder: Referral Program Design

## Complete Referral Mechanics, Incentive Structures, Tracking, and Promotion Strategy

---

## 1. Executive Summary

Referral programs are the highest-ROI acquisition channel in B2B SaaS, delivering customers with 37% higher retention, 25% higher LTV, and 5x lower CAC than paid channels. This document designs ARG-Builder's complete referral program — from mechanics and incentives to tracking infrastructure and promotional campaigns.

---

## 2. Program Strategy

### 2.1 Program Goals

| Goal | Year 1 Target | Year 2 Target |
|------|--------------|--------------|
| Referral-sourced customers | 15% of new customers | 25% of new customers |
| Referral revenue | $330K ARR | $1.5M ARR |
| Active referrers | 30% of customer base | 45% of customer base |
| Referral CAC | $5,000 (vs. $22K blended) | $4,000 |
| Referral NRR | 130% | 135% |
| Program NPS | > 60 | > 70 |

### 2.2 Program Tiers

| Tier | Name | Qualification | Benefits |
|------|------|--------------|----------|
| 1 | Advocate | Any active customer | Standard rewards |
| 2 | Champion | 2+ successful referrals | Enhanced rewards + recognition |
| 3 | Ambassador | 5+ successful referrals | Premium rewards + exclusive access |
| 4 | Partner | 10+ referrals OR strategic value | Revenue share + co-marketing |

---

## 3. Referral Mechanics

### 3.1 Referral Flow

```
Step 1: Referrer shares unique link/code
    ↓
Step 2: Prospect clicks link → lands on dedicated page
    ↓
Step 3: Prospect signs up for demo/trial (referral tracked)
    ↓
Step 4: Sales team engages (referrer notified)
    ↓
Step 5: Prospect becomes customer (referral validated)
    ↓
Step 6: Rewards distributed to both parties
    ↓
Step 7: Referrer notified of reward + encouraged to refer again
```

### 3.2 Referral Methods

| Method | Description | Tracking | Best For |
|--------|-------------|----------|----------|
| Unique link | Personalized URL per referrer | UTM + cookie | Digital sharing |
| Referral code | Alphanumeric code entered at signup | Code lookup | Verbal/event sharing |
| Email introduction | Referrer CC's ARG-Builder on intro email | Email parsing | Warm introductions |
| In-app referral | "Invite a colleague" button in product | Product analytics | Organic moments |
| Sales-assisted | Referrer tells AE about prospect | CRM manual entry | Enterprise deals |

### 3.3 Qualification Criteria

**A referral is "successful" (reward-eligible) when:**

| Criterion | Requirement | Rationale |
|-----------|-------------|-----------|
| New customer | Not previously in our CRM/pipeline | Prevents gaming |
| Qualified company | Meets ICP criteria (size, industry) | Quality control |
| Signed contract | Paid subscription activated | Revenue confirmation |
| Minimum term | 3+ months retained | Prevents churn gaming |
| Unique referral | Not referred by another source simultaneously | Attribution clarity |

### 3.4 Attribution Rules

| Scenario | Attribution | Rule |
|----------|-----------|------|
| Referral link + no prior contact | 100% referral credit | First touch |
| Referral link + existing pipeline | Split credit (50/50) | Multi-touch |
| Referral code at signup | 100% referral credit | Direct attribution |
| Email intro + sales follow-up | 100% referral credit | Referrer initiated |
| Verbal mention (no tracking) | 100% referral credit | Trust-based |
| Multiple referrers for same prospect | First referrer gets credit | First-in rule |

---

## 4. Incentive Structure

### 4.1 Referrer Rewards

| Tier | Reward Type | Value | When Paid |
|------|------------|-------|-----------|
| Advocate | Account credit | 1 month free ($2K–$10K value) | After 3 months retention |
| Champion | Cash OR credit | $2,500 per referral | After 3 months retention |
| Ambassador | Cash + perks | $5,000 + exclusive access | After 3 months retention |
| Partner | Revenue share | 10% of Year 1 ACV | Quarterly (after payment received) |

### 4.2 Referred Customer Rewards

| Offer | Value | Conditions |
|-------|-------|-----------|
| Extended trial | 30 days free (vs. standard 14) | Sign up via referral link |
| Onboarding credit | $2,500 off implementation | Annual contract |
| First month discount | 25% off first month | Any plan |
| Waived setup fee | $5,000–$25,000 value | Enterprise tier |

### 4.3 Bonus Incentives

| Bonus | Trigger | Reward |
|-------|---------|--------|
| Speed bonus | Referral closes within 30 days | +$500 |
| Enterprise bonus | Referred customer is Enterprise tier | +$2,000 |
| Multi-referral bonus | 3 referrals in one quarter | +$1,000 |
| Annual milestone | 5 referrals in calendar year | $5,000 + Ambassador dinner |
| Referral of the quarter | Highest-value referral | $2,500 + public recognition |

### 4.4 Non-Monetary Rewards

| Reward | Tier | Value to Referrer |
|--------|------|------------------|
| Early access to new features | Champion+ | Competitive advantage |
| Executive dinner (annual) | Ambassador+ | Networking, status |
| Conference ticket + VIP access | Ambassador+ | Professional development |
| Co-branded case study | Champion+ | Personal brand building |
| Advisory board invitation | Partner | Influence, recognition |
| LinkedIn endorsement from CEO | Champion+ | Professional credibility |
| Speaking opportunity at our events | Ambassador+ | Thought leadership platform |

---

## 5. Program Infrastructure

### 5.1 Technology Stack

| Component | Tool | Purpose |
|-----------|------|---------|
| Referral tracking | PartnerStack or Referral Rock | Link generation, attribution, payouts |
| CRM integration | Salesforce/HubSpot | Pipeline tracking, attribution |
| Email automation | Customer.io or Iterable | Nurture sequences, notifications |
| Reward fulfillment | Tremendous or Ramp | Cash/gift card distribution |
| Analytics | Looker/Metabase | Program performance dashboards |
| In-app widget | Custom (React component) | Referral prompts and sharing |

### 5.2 Referral Portal Features

**Referrer Dashboard:**
- Unique referral link (copyable)
- Referral status tracker (submitted → qualified → closed → rewarded)
- Earnings history and pending rewards
- Leaderboard (opt-in)
- Promotional assets (email templates, social posts)
- Program tier and progress

**Admin Dashboard:**
- Referral pipeline (all stages)
- Attribution verification
- Reward approval queue
- Program metrics and ROI
- Fraud detection alerts
- Referrer segmentation

### 5.3 Fraud Prevention

| Risk | Detection | Prevention |
|------|-----------|-----------|
| Self-referral | Email domain matching | Block same-domain referrals |
| Fake companies | ICP validation | Manual review for edge cases |
| Referral farming | Velocity monitoring | Cap at 5 referrals/month |
| Collusion | Pattern analysis | Review clustered referrals |
| Churn-and-return | Customer history check | Exclude previously churned |

---

## 6. Promotional Strategy

### 6.1 Launch Campaign

**Timeline:** 4-week launch sequence

| Week | Activity | Channel | Goal |
|------|----------|---------|------|
| 1 | Teaser ("Something exciting coming") | Email + in-app | Build anticipation |
| 2 | Launch announcement | Email + blog + social | Awareness |
| 3 | Activation push (how-to content) | Email + in-app + webinar | First referrals |
| 4 | Early success stories | Email + social | Social proof |

### 6.2 Ongoing Promotion

| Trigger | Promotion | Channel |
|---------|-----------|---------|
| High NPS score submitted | "Share the love" prompt | In-app + email |
| Milestone achieved (e.g., 100th guide) | "Celebrate by sharing" | In-app notification |
| QBR with positive results | CSM mentions program | Meeting + follow-up email |
| Customer anniversary | "Thank you + refer" | Email |
| New feature launch | "Know someone who'd love this?" | In-app + email |
| End of quarter | "Referral bonus week" (2x rewards) | All channels |

### 6.3 Referral Enablement Content

| Asset | Purpose | Format |
|-------|---------|--------|
| Email templates (5 variations) | Easy sharing via email | Copy-paste text |
| LinkedIn post templates | Social sharing | Pre-written posts |
| One-pager PDF | Shareable product overview | Downloadable PDF |
| Video testimonial clips | Social proof for sharing | 30-second clips |
| "Why I use ARG-Builder" template | Personal endorsement | Customizable template |
| Comparison guide | Competitive positioning | PDF/webpage |

### 6.4 Referral Email Sequences

**Sequence 1: New Customer Activation (Day 30)**

> Subject: "Know someone who'd love ARG-Builder?"
>
> Hi [Name],
>
> You've been using ARG-Builder for a month now, and we hope you're seeing the value we promised. Based on your usage, you've already [specific metric: saved X hours, generated Y guides].
>
> Do you know someone facing similar challenges? Our referral program rewards you with [reward] for every successful introduction — and your referral gets [their reward] too.
>
> [Share your unique link] →
>
> It takes 30 seconds, and you'll be helping a peer solve a real problem.

**Sequence 2: Post-QBR (After Positive Review)**

> Subject: "Your results are worth sharing"
>
> Hi [Name],
>
> After our review yesterday, I was struck by the results your team has achieved — [specific metric from QBR]. That's genuinely impressive.
>
> I'm curious: do you know 2–3 peers at other companies facing similar operational challenges? Our referral program makes it easy (and rewarding) to share what's working for you.
>
> [Your referral dashboard] →
>
> For every successful referral, you'll receive [reward]. Plus, your referral gets [their benefit] to get started.

---

## 7. Program Metrics & Reporting

### 7.1 Key Metrics

| Metric | Definition | Target | Frequency |
|--------|-----------|--------|-----------|
| Referral rate | % of customers who refer | 30% | Monthly |
| Referral conversion | % of referrals that become customers | 25% | Monthly |
| Referral CAC | Total program cost / referral customers | $5,000 | Monthly |
| Referral LTV | Average LTV of referred customers | $370K | Quarterly |
| Referral NRR | NRR of referred customer cohort | 130% | Quarterly |
| Time to close (referral) | Days from referral to closed-won | 25 days | Monthly |
| Program ROI | (Referral revenue - program cost) / program cost | > 10x | Quarterly |
| Reward redemption rate | % of earned rewards claimed | > 90% | Monthly |
| Referrer satisfaction | NPS of referral program | > 60 | Quarterly |

### 7.2 Reporting Dashboard

**Weekly Report:**
- New referrals submitted
- Referrals in pipeline (by stage)
- Referrals closed this week
- Rewards distributed
- Top referrers this week

**Monthly Report:**
- Program contribution to pipeline and revenue
- Referral CAC vs. other channels
- Referrer activation and engagement
- Cohort performance (referral vs. non-referral)
- Program cost and ROI

**Quarterly Report:**
- Strategic program review
- Tier progression analysis
- Incentive effectiveness
- Competitive benchmarking
- Program evolution recommendations

---

## 8. Program Evolution Roadmap

### 8.1 Phase 1: Foundation (Months 1–3)

- Launch basic referral link tracking
- Implement account credit rewards
- Email-based promotion
- Manual reward fulfillment
- Target: 10% referral rate, 5 referral customers

### 8.2 Phase 2: Scale (Months 4–6)

- Launch referral portal
- Add cash reward option
- In-app referral prompts
- Automated reward fulfillment
- Tier system introduction
- Target: 20% referral rate, 15 referral customers

### 8.3 Phase 3: Optimize (Months 7–12)

- Advanced attribution modeling
- A/B test incentive structures
- Partner tier with revenue share
- Community integration
- Gamification elements
- Target: 30% referral rate, 30+ referral customers

### 8.4 Phase 4: Mature (Year 2+)

- Predictive referral scoring
- Automated referrer nurturing
- Multi-level referral tracking
- Integration with partner program
- International expansion
- Target: 45% referral rate, 25% of new revenue

---

## 9. Legal & Compliance

### 9.1 Program Terms & Conditions

**Key Terms:**
- Rewards are taxable income (1099 issued for > $600/year)
- ARG-Builder reserves the right to modify program terms with 30 days notice
- Referrals must be new prospects not already in our pipeline
- Maximum reward per referral: $10,000
- Rewards expire if unclaimed after 12 months
- Program participation is voluntary and can be revoked for abuse

### 9.2 Compliance Considerations

| Consideration | Approach |
|--------------|----------|
| Anti-kickback (healthcare) | Ensure rewards don't influence purchasing decisions |
| Financial services regulations | Verify referral fees comply with FINRA/SEC rules |
| Data privacy (referral data) | Obtain consent before sharing prospect information |
| Tax reporting | Issue 1099-MISC for rewards > $600/year |
| International (future) | Comply with local referral/incentive regulations |

---

## 10. Budget

### 10.1 Annual Program Budget

| Category | Year 1 | Year 2 |
|----------|--------|--------|
| Referral rewards (referrer) | $75,000 | $250,000 |
| Referred customer incentives | $30,000 | $100,000 |
| Technology (tracking platform) | $24,000 | $36,000 |
| Program marketing | $15,000 | $30,000 |
| Events (Ambassador dinners, etc.) | $10,000 | $25,000 |
| Administration | $6,000 | $12,000 |
| **Total** | **$160,000** | **$453,000** |
| **Projected referral revenue** | **$330,000** | **$1,500,000** |
| **Program ROI** | **2.1x** | **3.3x** |
