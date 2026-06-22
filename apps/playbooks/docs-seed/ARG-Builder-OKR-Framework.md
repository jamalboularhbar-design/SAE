# ARG-Builder: OKR Framework & Goal-Setting System

## Objectives and Key Results Operating System for Company-Wide Alignment

---

## 1. Executive Summary

OKRs (Objectives and Key Results) provide the goal-setting framework that aligns ARG-Builder's entire organization around shared priorities. When implemented correctly, OKRs create transparency, focus, and accountability — ensuring every team member understands how their work contributes to company success. This document defines the complete OKR operating system including cadence, structure, scoring, and integration with performance management.

---

## 2. OKR Philosophy

### 2.1 Core Principles

| Principle | Description | Anti-Pattern |
|-----------|-------------|-------------|
| Ambitious | Stretch goals that inspire (70% achievement = success) | Sandbagging easy targets |
| Focused | 3–5 objectives maximum per team | 10+ objectives that dilute focus |
| Measurable | Key results are quantifiable | Vague, subjective measures |
| Time-bound | Quarterly cadence with annual context | Open-ended timelines |
| Transparent | All OKRs visible to entire company | Hidden or siloed goals |
| Decoupled from compensation | OKRs inform but don't determine pay | Direct bonus linkage |
| Bottom-up + top-down | Mix of company-directed and team-proposed | Purely top-down mandates |

### 2.2 OKR Structure

```
OBJECTIVE: Qualitative, inspirational goal (What do we want to achieve?)
├── Key Result 1: Quantitative measure of progress (How do we know we achieved it?)
├── Key Result 2: Quantitative measure of progress
└── Key Result 3: Quantitative measure of progress
```

**Good OKR Example:**
- **Objective:** Become the undisputed leader in AI-powered operational intelligence
  - KR1: Achieve 50 enterprise customers (from 25)
  - KR2: Reach $5M ARR (from $2.2M)
  - KR3: Achieve NPS of 65+ (from 52)

**Bad OKR Example:**
- **Objective:** Improve the product *(too vague)*
  - KR1: Ship more features *(not measurable)*
  - KR2: Make customers happy *(not quantifiable)*
  - KR3: Reduce bugs *(no target)*

---

## 3. OKR Cadence

### 3.1 Annual + Quarterly Rhythm

| Timeframe | Purpose | Scope | Review |
|-----------|---------|-------|--------|
| Annual OKRs | Strategic direction, 12-month vision | Company-level | Quarterly check-in |
| Quarterly OKRs | Execution focus, 90-day sprints | Company + Team + Individual | Weekly + monthly |

### 3.2 Quarterly OKR Calendar

| Week | Activity | Owner | Duration |
|------|----------|-------|----------|
| Week -3 (prior quarter) | Leadership drafts company OKRs | CEO + leadership | 2 hours |
| Week -2 | Teams draft team OKRs (aligned to company) | Team leads | 2 hours |
| Week -1 | Alignment review (cross-functional) | All leads | 90 minutes |
| Week 1 | OKRs finalized and published | All | — |
| Week 1–12 | Execution | All | Ongoing |
| Week 4 | Month 1 check-in (confidence scoring) | Teams | 30 minutes |
| Week 8 | Month 2 check-in (mid-quarter review) | Teams + leadership | 60 minutes |
| Week 12 | Quarter-end scoring and retrospective | All | 2 hours |
| Week 12–13 | Next quarter planning begins | Leadership | — |

### 3.3 Weekly OKR Rhythm

| Day | Activity | Format |
|-----|----------|--------|
| Monday | Team reviews OKR progress in standup | 5-minute review |
| Wednesday | Individual updates key result metrics | Async (tool update) |
| Friday | Weekly wins tied to OKRs shared | Slack/all-hands |

---

## 4. Company OKRs (Example Quarter)

### 4.1 Q3 2026 Company OKRs

**Objective 1: Accelerate revenue growth to establish market leadership**

| Key Result | Baseline | Target | Owner |
|-----------|----------|--------|-------|
| Achieve $1.2M in new ARR this quarter | $800K last Q | $1.2M | CRO |
| Close 15 new enterprise customers (> $50K ACV) | 8 last Q | 15 | CRO |
| Expand 20% of existing customers | 12% last Q | 20% | VP CS |

**Objective 2: Deliver product capabilities that create competitive moats**

| Key Result | Baseline | Target | Owner |
|-----------|----------|--------|-------|
| Launch enterprise SSO and achieve 10 deployments | 0 | 10 | CPO |
| Reduce AI generation time by 40% | 45 min avg | 27 min avg | CTO |
| Achieve 95% customer satisfaction on new features | 88% | 95% | CPO |

**Objective 3: Build the team and culture to support 3x growth**

| Key Result | Baseline | Target | Owner |
|-----------|----------|--------|-------|
| Hire 8 key roles with < 45 day time-to-fill | 62 days avg | 45 days | VP People |
| Achieve eNPS of 55+ | 42 | 55 | VP People |
| Complete leadership development program for all managers | 0% | 100% | VP People |

### 4.2 OKR Alignment Cascade

```
Company OKR: Accelerate revenue growth
    │
    ├── Sales Team OKR: Build predictable pipeline engine
    │   ├── KR: Generate $4M in qualified pipeline
    │   ├── KR: Achieve 35% SQL-to-close rate
    │   └── KR: Reduce sales cycle to 45 days
    │
    ├── Marketing Team OKR: Drive quality demand at scale
    │   ├── KR: Generate 200 MQLs from enterprise segment
    │   ├── KR: Achieve $500K in marketing-sourced pipeline
    │   └── KR: Reduce CAC by 15%
    │
    ├── CS Team OKR: Maximize customer lifetime value
    │   ├── KR: Achieve net revenue retention of 120%
    │   ├── KR: Expand 25 accounts by > 20%
    │   └── KR: Reduce logo churn to < 5%
    │
    └── Product Team OKR: Deliver features that close enterprise deals
        ├── KR: Ship SSO with 0 critical bugs
        ├── KR: Launch API v2 with 10 beta customers
        └── KR: Reduce time-to-value by 30%
```

---

## 5. Team OKR Templates

### 5.1 Engineering Team

| Objective | Key Results |
|-----------|-------------|
| Deliver reliable, performant platform | KR1: 99.95% uptime (from 99.8%) |
| | KR2: P95 latency < 500ms (from 800ms) |
| | KR3: Zero SEV-1 incidents |
| Accelerate development velocity | KR1: Reduce deploy frequency to 5x/day (from 2x) |
| | KR2: Reduce PR review time to < 4 hours |
| | KR3: Achieve 80% test coverage (from 65%) |

### 5.2 Sales Team

| Objective | Key Results |
|-----------|-------------|
| Build a predictable revenue engine | KR1: $1.2M new ARR closed |
| | KR2: 35% SQL-to-close conversion rate |
| | KR3: Average deal size > $60K ACV |
| Develop enterprise sales capability | KR1: Close 5 deals > $100K ACV |
| | KR2: Build pipeline of $5M in enterprise opportunities |
| | KR3: Achieve 90% forecast accuracy |

### 5.3 Customer Success Team

| Objective | Key Results |
|-----------|-------------|
| Maximize customer retention and growth | KR1: Net revenue retention > 120% |
| | KR2: Logo retention > 95% |
| | KR3: Expansion revenue > $400K |
| Deliver exceptional customer experience | KR1: NPS > 65 |
| | KR2: Time-to-value < 14 days (from 21) |
| | KR3: Health score > 80 for 90% of accounts |

### 5.4 Marketing Team

| Objective | Key Results |
|-----------|-------------|
| Drive efficient demand generation | KR1: 200 enterprise MQLs generated |
| | KR2: Marketing-sourced pipeline > $2M |
| | KR3: CAC < $12,000 (blended) |
| Establish thought leadership position | KR1: 50K monthly organic visitors (from 30K) |
| | KR2: 3 tier-1 media placements |
| | KR3: 500 webinar registrations |

---

## 6. Individual OKRs

### 6.1 Individual OKR Guidelines

| Guideline | Detail |
|-----------|--------|
| Number | 2–3 objectives, 2–3 KRs each |
| Alignment | At least 1 objective aligned to team OKR |
| Ownership | Individual has direct influence over outcomes |
| Stretch | 70% achievement = "on track" |
| Development | 1 objective can be personal growth |
| Review | Weekly self-assessment, monthly manager review |

### 6.2 Individual OKR Examples

**Senior Account Executive:**
- **Objective:** Become the top-performing AE in enterprise segment
  - KR1: Close $400K in new ARR (quota: $350K)
  - KR2: Maintain 40% win rate on qualified opportunities
  - KR3: Generate 3 customer references from closed deals

**Senior Engineer:**
- **Objective:** Deliver the SSO feature that unlocks enterprise deals
  - KR1: Ship SSO integration supporting SAML 2.0 + OIDC by Week 8
  - KR2: Zero critical bugs in first 30 days post-launch
  - KR3: Achieve < 2 second authentication flow

---

## 7. Scoring & Review

### 7.1 Scoring Scale

| Score | Meaning | Color | Interpretation |
|-------|---------|-------|---------------|
| 0.0–0.3 | Failed to make meaningful progress | Red | Significant miss — investigate |
| 0.4–0.6 | Made progress but fell short | Yellow | Partial achievement — learn |
| 0.7–0.9 | Achieved target (stretch goal sweet spot) | Green | Strong performance |
| 1.0 | Fully achieved or exceeded | Blue | Exceptional (or goal wasn't ambitious enough) |

### 7.2 Scoring Guidelines

| Scenario | Score | Notes |
|----------|-------|-------|
| KR target was 100, achieved 70 | 0.7 | On track for stretch goal |
| KR target was 100, achieved 40 | 0.4 | Significant miss |
| KR target was 100, achieved 100 | 1.0 | Consider if goal was ambitious enough |
| KR target was 100, achieved 120 | 1.0 (cap) | Exceeded — great, but was it a stretch? |
| KR was binary (ship/don't ship), shipped | 1.0 | Binary KRs are 0 or 1 |
| KR was binary, didn't ship | 0.0 | Binary miss |

### 7.3 Quarterly Review Process

| Step | Activity | Duration | Output |
|------|----------|----------|--------|
| 1 | Self-score all KRs | 30 min | Scored OKRs |
| 2 | Team review (discuss scores, learnings) | 60 min | Team retrospective |
| 3 | Cross-functional alignment check | 30 min | Dependency review |
| 4 | Leadership review | 60 min | Company scorecard |
| 5 | Retrospective (what worked, what didn't) | 30 min | Process improvements |
| 6 | Publish results (transparent) | — | Company-wide visibility |

### 7.4 Confidence Scoring (Mid-Quarter)

| Confidence | Meaning | Action |
|-----------|---------|--------|
| On track | Likely to achieve 0.7+ | Continue execution |
| At risk | May fall below 0.7 | Identify blockers, adjust approach |
| Off track | Unlikely to achieve 0.4+ | Escalate, reprioritize, or adjust KR |

---

## 8. OKR Anti-Patterns

### 8.1 Common Mistakes

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| Too many OKRs | Dilutes focus, nothing gets done | Maximum 3–5 objectives |
| Sandbagging | Goals too easy, no stretch | Score history should average 0.7 |
| Task-based KRs | "Launch feature X" isn't a result | Focus on outcomes, not outputs |
| No alignment | Team OKRs disconnected from company | Cascade from company OKRs |
| Set and forget | OKRs written then ignored | Weekly check-ins required |
| Punishing misses | People sandbag to avoid failure | Celebrate learning from ambitious misses |
| Changing OKRs mid-quarter | Destroys focus and accountability | Only change if strategy fundamentally shifts |
| Individual OKRs = job description | OKRs should be stretch, not BAU | Separate OKRs from role expectations |

### 8.2 OKR vs. KPI Distinction

| Dimension | OKR | KPI |
|-----------|-----|-----|
| Purpose | Drive change and improvement | Monitor ongoing health |
| Nature | Aspirational, stretch | Operational, steady-state |
| Timeframe | Quarterly (time-bound) | Ongoing (continuous) |
| Achievement | 70% = success | 100% = expected |
| Example | "Increase NPS from 52 to 65" | "Maintain uptime > 99.9%" |
| Consequence of miss | Learning opportunity | Operational concern |

---

## 9. Tools & Infrastructure

### 9.1 OKR Tool Requirements

| Requirement | Description |
|-------------|-------------|
| Visibility | All OKRs visible to all employees |
| Alignment view | See how OKRs cascade from company to team to individual |
| Progress tracking | Update key results with current values |
| Confidence scoring | Mid-quarter health assessment |
| Check-in workflow | Weekly/monthly update reminders |
| Reporting | Dashboards for leadership review |
| Integration | Connect to Slack, project management tools |
| History | View past quarter OKRs and scores |

### 9.2 Tool Options

| Tool | Price | Best For |
|------|-------|----------|
| Lattice | $11/user/month | OKRs + performance management |
| 15Five | $14/user/month | OKRs + engagement + 1:1s |
| Ally.io (Microsoft Viva Goals) | $6/user/month | Microsoft ecosystem |
| Gtmhub (Quantive) | $9/user/month | Data-driven OKRs |
| Weekdone | $9/user/month | Simple OKR tracking |
| Notion/spreadsheet | Free | Early stage, < 20 people |

**ARG-Builder Recommendation:** Start with Notion (free, flexible) until 25+ employees, then migrate to Lattice or 15Five for integrated people management.

---

## 10. OKR Rollout Plan

### 10.1 Implementation Timeline

| Phase | Timeline | Activities | Success Criteria |
|-------|----------|-----------|-----------------|
| Education | Week 1–2 | OKR training for all employees | 100% attendance |
| Pilot | Quarter 1 | Company + leadership team OKRs only | Process validated |
| Expansion | Quarter 2 | Add team-level OKRs | All teams participating |
| Full rollout | Quarter 3 | Add individual OKRs | Full company adoption |
| Optimization | Quarter 4+ | Refine process, improve quality | Average score 0.6–0.8 |

### 10.2 Training Curriculum

| Session | Audience | Duration | Content |
|---------|----------|----------|---------|
| OKR fundamentals | All employees | 60 min | What, why, how |
| Writing great OKRs | Managers + leads | 90 min | Crafting objectives and KRs |
| Alignment workshop | Leadership | 2 hours | Cascading and cross-functional alignment |
| Scoring and review | All employees | 30 min | How to score, what scores mean |
| OKR coaching | Individual (as needed) | 30 min | 1:1 help with specific OKRs |

### 10.3 Success Metrics for OKR Program

| Metric | Target | Measurement |
|--------|--------|-------------|
| OKR completion rate | > 90% of teams | Teams with published OKRs |
| Average OKR score | 0.6–0.8 | Company-wide average |
| Weekly check-in compliance | > 80% | Tool usage data |
| Employee understanding | > 85% "I understand company priorities" | Engagement survey |
| Alignment perception | > 80% "My work connects to company goals" | Engagement survey |
| OKR quality score | > 4/5 (leadership assessment) | Quarterly review |
