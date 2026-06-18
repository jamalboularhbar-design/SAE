# ARG-Builder: Product Deprecation & Sunsetting Framework

## Structured Process for Retiring Features, Products, and APIs with Minimal Customer Disruption

---

## 1. Executive Summary

Product deprecation is as critical as product development — every feature carries maintenance cost, security surface area, and cognitive complexity. A well-executed deprecation process reduces technical debt, focuses engineering resources, and maintains customer trust through transparent communication and smooth transitions. This document defines ARG-Builder's complete framework for deciding what to deprecate, communicating changes, and executing graceful sunsets.

---

## 2. Deprecation Decision Framework

### 2.1 Deprecation Criteria

| Criterion | Threshold for Deprecation | Data Source |
|-----------|--------------------------|-------------|
| Usage volume | < 5% of active accounts using feature | Product analytics |
| Usage trend | Declining > 20% quarter-over-quarter | Product analytics |
| Revenue attribution | < 2% of revenue tied to feature | Revenue analytics |
| Maintenance cost | > 15% of engineering time for < 5% usage | Engineering tracking |
| Security risk | Unpatched dependencies, legacy architecture | Security audit |
| Strategic alignment | Conflicts with product direction | Product strategy |
| Customer satisfaction | NPS < 20 for feature, high support volume | Surveys, support data |
| Replacement available | Superior alternative exists (internal or external) | Product assessment |

### 2.2 Deprecation Decision Matrix

| Factor | Weight | Score 1 (Keep) | Score 3 (Consider) | Score 5 (Deprecate) |
|--------|--------|---------------|--------------------|--------------------|
| Usage (% accounts) | 25% | > 30% | 10–30% | < 10% |
| Maintenance burden | 20% | Low (< 5% eng time) | Medium (5–15%) | High (> 15%) |
| Strategic fit | 20% | Core to strategy | Neutral | Conflicts with strategy |
| Revenue impact | 15% | > 10% of revenue | 2–10% | < 2% |
| Customer impact | 10% | Many vocal advocates | Some users, alternatives exist | Few users, easy migration |
| Technical debt | 10% | Clean, modern code | Some debt | Legacy, risky |

**Decision thresholds:** Score > 3.5 = Deprecate. Score 2.5–3.5 = Monitor. Score < 2.5 = Keep.

### 2.3 Deprecation Types

| Type | Scope | Timeline | Communication |
|------|-------|----------|--------------|
| Feature removal | Single feature within product | 6–12 months | In-app + email |
| API version sunset | API version (v1 → v2) | 12–18 months | Developer docs + email |
| Integration removal | Third-party integration | 3–6 months | Affected users + partners |
| Plan/tier discontinuation | Pricing plan | 6–12 months | All affected customers |
| Product line sunset | Entire product | 12–24 months | All customers + public |

---

## 3. Communication Framework

### 3.1 Communication Timeline

| Phase | Timing | Channel | Content |
|-------|--------|---------|---------|
| Pre-announcement (internal) | T-6 months | Internal all-hands | Decision rationale, plan, FAQ |
| Customer advisory | T-5 months | Direct outreach to top users | Early warning, gather feedback |
| Public announcement | T-4 months | Blog, email, in-app | Official deprecation notice |
| Reminder #1 | T-3 months | Email, in-app banner | Migration guide, timeline |
| Reminder #2 | T-2 months | Email, in-app modal | Urgency, support available |
| Final notice | T-1 month | Email, in-app blocking | Last chance, data export |
| Sunset | T-0 | In-app redirect | Feature removed, alternative shown |
| Post-sunset | T+1 month | Email | Confirmation, feedback request |

### 3.2 Communication Templates

**Announcement Email Structure:**

| Section | Content |
|---------|---------|
| Subject line | "Important update: [Feature] is being retired on [Date]" |
| Opening | What's changing and why (2 sentences) |
| Timeline | Key dates with clear deadlines |
| Impact | What this means for the customer specifically |
| Migration path | Step-by-step alternative or migration guide |
| Support | How to get help (dedicated support channel) |
| FAQ link | Link to detailed FAQ page |
| Feedback | How to share concerns |

### 3.3 Stakeholder Communication Matrix

| Stakeholder | When | Channel | Message Focus |
|-------------|------|---------|--------------|
| Enterprise customers (affected) | First (before public) | CSM call + email | Personal, migration plan, support |
| All affected customers | Public announcement | Email + in-app | Clear timeline, migration path |
| Integration partners | Before public | Partner manager call | Technical migration, timeline |
| Sales team | Before public | Internal briefing | Objection handling, positioning |
| Support team | Before public | Training + FAQ | How to handle inquiries |
| Developer community | Public announcement | Blog + developer docs | Technical details, API changes |
| Press/analysts (if major) | At public announcement | Press release | Strategic rationale |

---

## 4. Migration Planning

### 4.1 Migration Path Options

| Scenario | Migration Path | Support Level |
|----------|---------------|--------------|
| Feature replaced by better alternative | Guided in-app migration wizard | Self-serve + support |
| Feature removed, no direct replacement | Data export + third-party recommendations | White-glove for enterprise |
| API version upgrade | SDK update guide, compatibility layer | Developer support |
| Plan discontinued | Grandfathering OR upgrade path | CSM-led for enterprise |
| Integration removed | Alternative integration recommendation | Partner coordination |

### 4.2 Migration Support Tiers

| Customer Tier | Support Level | Activities |
|-------------|--------------|-----------|
| Enterprise (> $100K ACV) | White-glove | Dedicated migration engineer, custom timeline, executive check-ins |
| Mid-Market ($25K–$100K) | High-touch | CSM-led migration plan, training sessions, priority support |
| SMB ($5K–$25K) | Guided | Self-serve migration tool, group webinars, email support |
| Self-Serve (< $5K) | Self-serve | Documentation, video guides, community support |

### 4.3 Data Export Obligations

| Data Type | Export Format | Availability | Retention Post-Sunset |
|-----------|-------------|-------------|----------------------|
| Customer-created content | JSON, CSV, Markdown | Self-serve export tool | 90 days |
| Configuration/settings | JSON export | Self-serve | 60 days |
| Usage history/analytics | CSV | Upon request | 30 days |
| Integration data | API bulk export | Self-serve | 60 days |
| Audit logs | CSV | Upon request | Per compliance requirements |

---

## 5. Legacy Support Period

### 5.1 Support Phases

| Phase | Duration | Support Level | Changes |
|-------|----------|--------------|---------|
| Active (pre-announcement) | Until announcement | Full support | Bug fixes, security patches |
| Deprecated (announced) | 3–6 months | Maintenance only | Security patches only |
| End-of-life (sunset) | 0–90 days post | Migration support only | No changes |
| Archived | Post-EOL | No support | Data export only |

### 5.2 SLA During Deprecation

| Metric | Active Phase | Deprecated Phase | EOL Phase |
|--------|-------------|-----------------|-----------|
| Uptime SLA | Standard (99.9%) | Reduced (99.5%) | Best effort |
| Bug fixes | Yes (all severities) | Critical/security only | None |
| Feature requests | Accepted | Declined | N/A |
| Support response | Standard SLA | Standard SLA | 48-hour SLA |
| Documentation | Maintained | Maintained (frozen) | Archived |

---

## 6. Contractual Considerations

### 6.1 Contract Review

| Scenario | Contractual Obligation | Resolution |
|----------|----------------------|-----------|
| Feature in contract scope | Must provide until contract end | Grandfather until renewal, then migrate |
| SLA on deprecated feature | SLA applies until EOL | Maintain SLA through sunset date |
| Multi-year contract | Cannot remove mid-contract | Offer alternative or credit |
| Custom development | Custom work being deprecated | Provide equivalent or refund |
| Integration dependency | Customer workflow depends on it | Extended support or migration assistance |

### 6.2 Financial Considerations

| Situation | Approach |
|-----------|----------|
| Customer paying for deprecated feature | Pro-rata credit or equivalent feature access |
| Enterprise with custom contract | Negotiate amendment, offer migration incentive |
| Annual prepaid (feature removed mid-term) | Credit toward alternative or refund |
| Price increase due to migration | Grandfather pricing for 12 months |
| Migration costs (customer-side) | Offer professional services credit |

---

## 7. Internal Coordination

### 7.1 Cross-Functional Responsibilities

| Team | Responsibilities |
|------|-----------------|
| Product | Decision, timeline, migration path design |
| Engineering | Technical execution, migration tools, data export |
| Customer Success | Enterprise communication, migration support |
| Sales | Pipeline impact assessment, objection handling |
| Marketing | Public communication, blog posts, FAQ |
| Support | Customer inquiries, escalation handling |
| Legal | Contract review, compliance assessment |
| Finance | Revenue impact analysis, credit/refund processing |

### 7.2 Deprecation Project Plan

| Phase | Duration | Key Activities | Milestone |
|-------|----------|---------------|-----------|
| Decision | 2 weeks | Data analysis, stakeholder alignment, approval | Decision approved |
| Planning | 4 weeks | Migration path, communication plan, timeline | Plan finalized |
| Internal prep | 2 weeks | Team training, tool building, FAQ creation | Teams ready |
| Communication | 1 week | Customer notification, public announcement | Announcement live |
| Migration period | 3–6 months | Customer migration, support, monitoring | 80% migrated |
| Final push | 1 month | Remaining customers, escalations | 95% migrated |
| Sunset | 1 day | Feature removal, redirects | Feature off |
| Post-sunset | 1 month | Data retention, final exports, retrospective | Complete |

---

## 8. Risk Management

### 8.1 Deprecation Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Customer churn | Medium | High | Extended timeline, migration support, incentives |
| Negative PR | Low | Medium | Transparent communication, clear rationale |
| Contract disputes | Low | High | Legal review, proactive outreach |
| Data loss | Low | Very High | Multiple export options, extended retention |
| Engineering delays | Medium | Medium | Buffer in timeline, phased approach |
| Incomplete migration | Medium | Medium | Tracking dashboard, escalation process |
| Competitive exploitation | Medium | Medium | Position as improvement, highlight alternatives |

### 8.2 Rollback Criteria

| Condition | Action |
|-----------|--------|
| > 10% of affected revenue at churn risk | Pause deprecation, extend timeline |
| Major customer threatens legal action | Pause, involve legal, negotiate |
| Migration tool has critical bugs | Pause migration, fix, extend deadline |
| Competitive threat exploiting deprecation | Accelerate alternative delivery |
| > 30% of affected customers haven't migrated at T-1 month | Extend deadline by 2 months |

---

## 9. Measuring Deprecation Success

### 9.1 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Migration completion rate | > 95% by sunset date | Migration tracking |
| Customer churn (attributed) | < 2% of affected accounts | Churn analysis |
| Support ticket volume | Declining trend | Support metrics |
| Customer satisfaction (affected) | NPS > 30 | Post-migration survey |
| Engineering time freed | > 80% of maintenance cost eliminated | Time tracking |
| Timeline adherence | Within 2 weeks of plan | Project tracking |
| Revenue impact | < 1% ARR loss | Revenue analysis |

### 9.2 Retrospective

| Question | Purpose |
|----------|---------|
| Was the decision correct? | Validate criteria |
| Was communication effective? | Improve future comms |
| Was migration support adequate? | Improve support model |
| What was the actual customer impact? | Calibrate risk assessment |
| What would we do differently? | Process improvement |
| Were there surprises? | Improve planning |

---

## 10. Deprecation Register

### 10.1 Active Deprecations Tracking

| Feature/Product | Status | Announcement Date | Sunset Date | Migration % | Owner |
|----------------|--------|-------------------|-------------|-------------|-------|
| (Template row) | Planning/Announced/Migrating/Complete | Date | Date | % | Name |

### 10.2 Historical Deprecations

| Feature/Product | Sunset Date | Affected Accounts | Churn Rate | Lessons |
|----------------|-------------|-------------------|-----------|---------|
| (Template row) | Date | Number | % | Key learnings |

---

*Document prepared by Manus AI. Product deprecation and sunsetting framework designed for ARG-Builder responsible product lifecycle management.*
