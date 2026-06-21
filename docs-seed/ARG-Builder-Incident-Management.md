# ARG-Builder: Incident Management & On-Call Operations

## Complete Framework for Detecting, Responding to, and Learning from Production Incidents

---

## 1. Executive Summary

For enterprise SaaS, every minute of downtime costs customer trust, revenue, and reputation. A mature incident management process ensures rapid detection, coordinated response, clear communication, and continuous improvement. This document defines ARG-Builder's complete incident management framework — from alerting and on-call to post-incident review and SLA management.

---

## 2. Incident Classification

### 2.1 Severity Levels

| Severity | Definition | Impact | Response Time | Resolution Target |
|----------|-----------|--------|---------------|-------------------|
| SEV-1 (Critical) | Complete service outage or data breach | All customers affected | 5 minutes | 1 hour |
| SEV-2 (Major) | Significant degradation or partial outage | Many customers affected | 15 minutes | 4 hours |
| SEV-3 (Minor) | Limited impact, workaround available | Some customers affected | 1 hour | 24 hours |
| SEV-4 (Low) | Cosmetic issue or minor bug | Minimal impact | 4 hours | 72 hours |

### 2.2 Severity Decision Matrix

| Criteria | SEV-1 | SEV-2 | SEV-3 | SEV-4 |
|----------|-------|-------|-------|-------|
| Users affected | > 50% | 10–50% | 1–10% | < 1% |
| Revenue impact | Direct revenue loss | Potential revenue loss | Indirect impact | No impact |
| Data integrity | Data loss or corruption | Data at risk | Minor data issue | No data impact |
| Security | Active breach | Vulnerability exploited | Potential vulnerability | Low-risk finding |
| Workaround | None available | Difficult workaround | Easy workaround | Not needed |
| Customer-facing | Core features down | Important features degraded | Non-critical feature affected | Internal only |

### 2.3 Incident Categories

| Category | Examples | Primary Team |
|----------|----------|-------------|
| Availability | Service down, timeouts, errors | Platform/SRE |
| Performance | Slow responses, high latency | Platform/Backend |
| Data | Corruption, loss, inconsistency | Backend/Database |
| Security | Breach, vulnerability, unauthorized access | Security |
| Integration | Third-party failures, API issues | Backend/Integrations |
| Capacity | Resource exhaustion, scaling failures | Platform/SRE |

---

## 3. On-Call Structure

### 3.1 On-Call Rotations

| Rotation | Coverage | Team Size | Shift Length |
|----------|----------|-----------|-------------|
| Primary (Platform) | 24/7 | 4–6 engineers | 1 week |
| Secondary (Backend) | 24/7 | 4–6 engineers | 1 week |
| Escalation (Engineering Manager) | 24/7 | 2–3 managers | 2 weeks |
| Executive (VP/CTO) | 24/7 | 2 executives | 2 weeks |
| Customer Communication | Business hours + SEV-1 | 2–3 CS leaders | 1 week |

### 3.2 On-Call Responsibilities

| Responsibility | Description |
|---------------|-------------|
| Alert response | Acknowledge alerts within SLA |
| Initial triage | Assess severity, determine scope |
| Incident declaration | Formally declare incident if warranted |
| Coordination | Lead response until resolved or escalated |
| Communication | Update status page, notify stakeholders |
| Documentation | Log actions, decisions, and timeline |
| Handoff | Clean handoff at rotation end |

### 3.3 On-Call Compensation

| Component | Amount | Conditions |
|-----------|--------|-----------|
| On-call stipend | $500/week | For carrying the pager |
| Incident response (off-hours) | 1.5x hourly rate | Minimum 1 hour per page |
| SEV-1 response bonus | $200 per incident | Active participation |
| Comp time | Hour-for-hour | Off-hours work > 2 hours |
| Meal/transport | Reimbursed | If called to office |

### 3.4 On-Call Health

| Policy | Implementation |
|--------|---------------|
| Maximum pages per shift | Alert if > 5 pages in one night |
| Post-incident rest | Minimum 8 hours off after SEV-1 |
| Rotation fairness | Equal distribution, no back-to-back |
| Opt-out for life events | Swap coverage for personal needs |
| Burnout monitoring | Track page volume per person monthly |
| Quarterly review | Assess on-call burden and adjust |

---

## 4. Alerting & Detection

### 4.1 Monitoring Stack

| Layer | Tool | Metrics |
|-------|------|---------|
| Infrastructure | Datadog / CloudWatch | CPU, memory, disk, network |
| Application | Datadog APM / New Relic | Latency, errors, throughput |
| Database | CloudWatch / pganalyze | Query time, connections, replication lag |
| External | Pingdom / Better Uptime | Endpoint availability |
| Logs | Datadog Logs / ELK | Error patterns, anomalies |
| User experience | Sentry / FullStory | Client errors, rage clicks |
| Business metrics | Custom dashboards | Signup rate, API usage, revenue |

### 4.2 Alert Thresholds

| Metric | Warning | Critical | SEV Level |
|--------|---------|----------|-----------|
| Error rate (5xx) | > 1% | > 5% | SEV-2 / SEV-1 |
| Response time (p95) | > 2s | > 5s | SEV-3 / SEV-2 |
| Response time (p99) | > 5s | > 10s | SEV-3 / SEV-2 |
| CPU utilization | > 70% | > 90% | SEV-3 / SEV-2 |
| Memory utilization | > 80% | > 95% | SEV-3 / SEV-2 |
| Disk utilization | > 75% | > 90% | SEV-3 / SEV-2 |
| Database connections | > 70% pool | > 90% pool | SEV-3 / SEV-2 |
| Queue depth | > 1000 messages | > 10000 messages | SEV-3 / SEV-2 |
| SSL certificate expiry | < 30 days | < 7 days | SEV-4 / SEV-3 |
| Uptime check failure | 1 failure | 3 consecutive | SEV-3 / SEV-1 |

### 4.3 Alert Routing

| Severity | Notification Method | Recipients |
|----------|-------------------|-----------|
| SEV-1 | PagerDuty (phone + SMS + push) | Primary + Secondary + Manager |
| SEV-2 | PagerDuty (push + SMS) | Primary on-call |
| SEV-3 | Slack alert + PagerDuty (push) | Primary on-call |
| SEV-4 | Slack alert only | Team channel |

---

## 5. Incident Response Process

### 5.1 Response Workflow

```
Alert Triggered
    │
    ▼
Acknowledge (< 5 min for SEV-1)
    │
    ▼
Assess & Classify Severity
    │
    ├── SEV-1/2: Declare Incident → Open War Room
    │       │
    │       ▼
    │   Assign Roles (IC, Comms, SMEs)
    │       │
    │       ▼
    │   Investigate & Mitigate
    │       │
    │       ▼
    │   Communicate (Status Page + Customers)
    │       │
    │       ▼
    │   Resolve & Verify
    │       │
    │       ▼
    │   Close Incident
    │       │
    │       ▼
    │   Post-Incident Review (within 48 hrs)
    │
    ├── SEV-3: Investigate → Fix → Document
    │
    └── SEV-4: Ticket → Schedule Fix
```

### 5.2 Incident Roles

| Role | Responsibility | Who |
|------|---------------|-----|
| Incident Commander (IC) | Overall coordination, decisions, timeline | On-call engineer or manager |
| Communications Lead | Status page, customer updates, internal comms | CS/Support lead |
| Technical Lead | Debugging, fix implementation | Senior engineer (domain expert) |
| Scribe | Document timeline, actions, decisions | Any available team member |
| Executive Sponsor | Escalation decisions, customer calls | VP/CTO (SEV-1 only) |

### 5.3 War Room Protocol

| Rule | Rationale |
|------|-----------|
| Single communication channel (Slack incident channel) | Reduce noise |
| IC controls the room | Clear authority |
| Status updates every 15 minutes | Accountability |
| No blame during incident | Focus on resolution |
| Decisions documented in real-time | Post-incident accuracy |
| Only relevant people in the room | Reduce distraction |
| Clear action items with owners | Accountability |
| IC can request anyone to join | Access to expertise |

---

## 6. Communication Framework

### 6.1 Internal Communication

| Audience | Channel | Frequency | Content |
|----------|---------|-----------|---------|
| Incident team | Slack #incident-[id] | Real-time | Technical details, actions |
| Engineering | Slack #engineering | Every 30 min | Summary, ETA |
| Leadership | Slack #leadership + email | Every 30 min (SEV-1) | Impact, ETA, customer risk |
| All company | Slack #general | At resolution | Summary, impact, next steps |

### 6.2 External Communication (Customers)

| Timing | Communication | Channel | Template |
|--------|-------------|---------|----------|
| Detection + 15 min | Initial acknowledgment | Status page | "We're investigating..." |
| Every 30 min | Progress update | Status page | "Update: We've identified..." |
| Resolution | Resolution notice | Status page + email | "Resolved: The issue has been..." |
| +24 hours | Post-incident summary | Email (affected customers) | "Incident summary and next steps" |
| +1 week | RCA (enterprise) | Email + meeting | Full root cause analysis |

### 6.3 Status Page Templates

**Investigating:**
> We are currently investigating reports of [brief description]. Some users may experience [impact]. Our team is actively working on this issue. We will provide updates every 30 minutes.

**Identified:**
> We have identified the root cause of [brief description]. The issue is related to [high-level cause]. Our team is implementing a fix. Estimated resolution: [time].

**Monitoring:**
> A fix has been implemented for [brief description]. We are monitoring the situation to ensure stability. If you continue to experience issues, please contact support.

**Resolved:**
> The issue affecting [brief description] has been fully resolved. The incident lasted [duration]. All services are operating normally. We will publish a full post-incident report within [timeframe].

---

## 7. Post-Incident Review (PIR)

### 7.1 PIR Process

| Step | Timeline | Owner | Output |
|------|----------|-------|--------|
| Schedule PIR | Within 24 hours of resolution | IC | Calendar invite |
| Prepare timeline | Before PIR meeting | Scribe | Incident timeline document |
| Conduct PIR | Within 48 hours (SEV-1/2), 1 week (SEV-3) | IC | Meeting notes |
| Write PIR document | Within 3 days of meeting | IC + team | Published PIR |
| Assign action items | During PIR | IC | Tracked tickets |
| Follow up on actions | Weekly | Engineering manager | Progress updates |

### 7.2 PIR Document Template

```
# Post-Incident Review: [Incident Title]

## Summary
- **Date:** [Date and time]
- **Duration:** [Total duration]
- **Severity:** [SEV level]
- **Impact:** [Number of users, revenue impact, SLA impact]
- **IC:** [Name]

## Timeline
| Time | Event | Action |
|------|-------|--------|
| HH:MM | Alert triggered | [What happened] |
| HH:MM | IC assigned | [Who responded] |
| ... | ... | ... |
| HH:MM | Resolved | [What fixed it] |

## Root Cause
[Detailed technical explanation of what caused the incident]

## Contributing Factors
1. [Factor 1]
2. [Factor 2]
3. [Factor 3]

## What Went Well
1. [Positive aspect of response]
2. [Positive aspect of response]

## What Could Be Improved
1. [Improvement area]
2. [Improvement area]

## Action Items
| # | Action | Owner | Priority | Deadline |
|---|--------|-------|----------|----------|
| 1 | [Action] | [Name] | P1 | [Date] |
| 2 | [Action] | [Name] | P2 | [Date] |

## Lessons Learned
[Key takeaways for the team]
```

### 7.3 Blameless Culture

| Principle | Implementation |
|-----------|---------------|
| No individual blame | Focus on systems, not people |
| Assume good intent | Everyone was trying their best |
| Focus on learning | "How do we prevent this?" not "Who caused this?" |
| Celebrate transparency | Reward honest disclosure of mistakes |
| Systemic fixes | Address root causes, not symptoms |
| Share broadly | Publish PIRs for organizational learning |

---

## 8. SLA Management

### 8.1 Service Level Agreements

| Tier | Uptime SLA | Monthly Downtime Budget | Credit |
|------|-----------|------------------------|--------|
| Standard | 99.5% | 3.6 hours | 10% monthly credit |
| Professional | 99.9% | 43 minutes | 15% monthly credit |
| Enterprise | 99.95% | 22 minutes | 25% monthly credit |
| Premium | 99.99% | 4.3 minutes | 30% monthly credit |

### 8.2 SLA Exclusions

| Exclusion | Rationale |
|-----------|-----------|
| Scheduled maintenance (with 72hr notice) | Planned, communicated |
| Customer-caused issues | Not our responsibility |
| Force majeure | Beyond control |
| Third-party service outages | Dependency failures |
| Beta/preview features | Not production-grade |

### 8.3 SLA Tracking

| Metric | Measurement | Tool |
|--------|-------------|------|
| Uptime percentage | (Total minutes - downtime minutes) / Total minutes | Monitoring platform |
| Downtime minutes | Sum of all incident durations (by severity) | Incident tracker |
| SLA credits owed | Automatic calculation based on breach | Billing system |
| SLA breach notifications | Alert when approaching budget | Custom alerting |
| Monthly SLA report | Automated report to customers | Dashboard |

---

## 9. Runbooks

### 9.1 Runbook Structure

| Section | Content |
|---------|---------|
| Title | Clear, searchable name |
| Trigger | When to use this runbook |
| Symptoms | What you'll observe |
| Impact | Who/what is affected |
| Steps | Numbered resolution steps |
| Verification | How to confirm resolution |
| Escalation | When and how to escalate |
| Prevention | Long-term fix reference |

### 9.2 Critical Runbooks (Required)

| Runbook | Trigger | Owner |
|---------|---------|-------|
| Database failover | Primary DB unresponsive | Platform |
| Service restart | Application crash loop | Platform |
| Cache invalidation | Stale data serving | Backend |
| CDN purge | Static asset issues | Platform |
| API rate limit override | Legitimate traffic blocked | Platform |
| Security incident | Potential breach detected | Security |
| DNS failover | DNS resolution failure | Platform |
| Certificate renewal | Cert expiry imminent | Platform |
| Rollback deployment | Bad deploy detected | Platform |
| Scale-up | Capacity exhaustion | Platform |

### 9.3 Runbook Maintenance

| Activity | Frequency | Owner |
|----------|-----------|-------|
| Review accuracy | Quarterly | Runbook owner |
| Test execution | Semi-annual | On-call team |
| Update after incidents | After every incident that used runbook | IC |
| New runbook creation | After incident without runbook | Engineering manager |
| Retire obsolete runbooks | Quarterly | Platform team |

---

## 10. Metrics & Continuous Improvement

### 10.1 Incident Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| MTTD (Mean Time to Detect) | < 5 min (SEV-1), < 15 min (SEV-2) | Alert time - incident start |
| MTTA (Mean Time to Acknowledge) | < 5 min (SEV-1), < 15 min (SEV-2) | Ack time - alert time |
| MTTR (Mean Time to Resolve) | < 1 hr (SEV-1), < 4 hr (SEV-2) | Resolution - detection |
| Incident frequency | Decreasing trend | Monthly count by severity |
| Repeat incidents | < 5% | Same root cause recurrence |
| PIR completion rate | 100% (SEV-1/2) | PIRs completed / incidents |
| Action item completion | > 90% within deadline | Completed / assigned |
| SLA compliance | > 99.9% | Months meeting SLA / total months |
| Customer impact (minutes) | Decreasing trend | Total customer-minutes affected |
| On-call page volume | < 20/week | Pages per rotation |

### 10.2 Quarterly Incident Review

| Agenda Item | Purpose |
|-------------|---------|
| Incident trend analysis | Identify patterns and systemic issues |
| Top root causes | Focus prevention efforts |
| SLA performance | Track against commitments |
| On-call health | Assess team burden |
| Action item review | Ensure follow-through |
| Process improvements | Evolve the incident process |
| Tool evaluation | Assess monitoring effectiveness |
| Training needs | Identify knowledge gaps |

### 10.3 Maturity Model

| Level | Description | Characteristics |
|-------|-------------|----------------|
| 1 — Reactive | Fight fires as they come | No process, heroic individuals |
| 2 — Defined | Basic process exists | Severity levels, on-call rotation |
| 3 — Measured | Metrics tracked and reviewed | MTTR targets, SLA tracking |
| 4 — Proactive | Prevention-focused | Chaos engineering, proactive alerts |
| 5 — Optimized | Self-improving system | ML-based detection, automated remediation |

**ARG-Builder Target:** Level 3 by Month 6, Level 4 by Month 18.

---

*Document prepared by Manus AI. Incident management framework designed for ARG-Builder operational reliability and customer trust.*
