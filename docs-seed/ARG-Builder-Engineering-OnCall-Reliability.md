# ARG-Builder: Engineering On-Call & Site Reliability Operations

## Complete Framework for Building Reliable Systems and Sustainable On-Call Practices

---

## 1. Executive Summary

Reliability is a feature — the most important feature for a SaaS product where customers depend on continuous access. This document defines ARG-Builder's approach to site reliability engineering (SRE), on-call operations, incident management, and the cultural practices that make reliability sustainable without burning out engineers. The goal is 99.95% uptime (21.9 minutes of downtime per month maximum) while maintaining engineering velocity.

---

## 2. Reliability Targets

### 2.1 Service Level Objectives (SLOs)

| Service | SLI (Indicator) | SLO (Objective) | Error Budget (Monthly) |
|---------|-----------------|-----------------|----------------------|
| Web application (core) | Successful requests / Total requests | 99.95% availability | 21.9 minutes downtime |
| API | Successful API calls / Total API calls | 99.9% availability | 43.8 minutes downtime |
| API latency | P99 response time | < 500ms | 0.1% of requests > 500ms |
| AI generation | Successful generations / Total requests | 99.5% availability | 3.6 hours downtime |
| Data pipeline | Fresh data / Expected freshness | 99% on-time delivery | 7.2 hours delay allowed |
| Authentication | Successful auth / Total auth attempts | 99.99% availability | 4.3 minutes downtime |

### 2.2 Error Budget Policy

| Error Budget Status | Action | Engineering Response |
|--------------------|--------|-------------------|
| > 50% remaining | Normal operations | Ship features freely |
| 25–50% remaining | Caution | Require reliability review for risky deploys |
| 10–25% remaining | Warning | Pause non-critical feature work, focus on reliability |
| < 10% remaining | Critical | Feature freeze, all hands on reliability |
| Exhausted (0%) | Freeze | No deploys except reliability fixes until budget recovers |

---

## 3. On-Call Structure

### 3.1 On-Call Rotation Design

| Aspect | Configuration |
|--------|--------------|
| Rotation type | Weekly primary + secondary |
| Rotation size | Minimum 5 engineers (sustainable) |
| Shift duration | 7 days (Monday 9 AM → Monday 9 AM) |
| Handoff | 30-minute sync at rotation change |
| Escalation | Primary → Secondary → Engineering Manager → CTO |
| Compensation | $500/week on-call stipend + $200/incident outside hours |
| Time off | Day off after overnight page (mandatory) |

### 3.2 On-Call Responsibilities

| Responsibility | During Business Hours | After Hours |
|---------------|---------------------|-------------|
| Respond to pages | < 5 minutes | < 15 minutes |
| Triage severity | Immediately | Immediately |
| Mitigate (not fix) | Priority #1 | Priority #1 |
| Communicate status | Every 30 minutes | Every 30 minutes |
| Escalate if needed | Immediately | After 30 minutes of no progress |
| Write incident report | Within 24 hours | Within 48 hours |
| Non-urgent alerts | Batch and address | Acknowledge, address next business day |

### 3.3 On-Call Readiness Checklist

| Requirement | Details |
|-------------|---------|
| Laptop accessible | Within 15 minutes at all times |
| VPN/access verified | Test access before shift starts |
| Runbook familiarity | Review top 10 runbooks before shift |
| Escalation contacts | Know who to call for each system |
| Communication tools | Slack, PagerDuty, status page access |
| Shadow shift completed | New on-call engineers shadow 1 full rotation first |
| Incident commander training | Completed IC training module |

---

## 4. Alerting Strategy

### 4.1 Alert Severity Levels

| Severity | Definition | Response | Notification | Example |
|----------|-----------|----------|-------------|---------|
| P0 (Critical) | Service down, all users affected | Immediate, all hands | Page (phone) + Slack | Database unreachable |
| P1 (High) | Major degradation, many users affected | < 15 minutes | Page (phone) + Slack | API error rate > 5% |
| P2 (Medium) | Partial degradation, some users affected | < 1 hour | Slack notification | Single service degraded |
| P3 (Low) | Minor issue, no user impact | Next business day | Slack (low-priority channel) | Disk usage > 80% |
| P4 (Info) | Informational, no action needed | Review weekly | Dashboard only | Deployment completed |

### 4.2 Alert Design Principles

| Principle | Implementation |
|-----------|---------------|
| Every alert must be actionable | If you can't do anything, don't alert |
| Alert on symptoms, not causes | "Error rate high" not "CPU high" |
| Reduce noise relentlessly | Target < 2 pages per on-call shift |
| Alert fatigue = reliability risk | Review and prune alerts monthly |
| Alerts need runbooks | Every alert links to a runbook |
| Test alerts regularly | Quarterly alert fire drills |
| Tune thresholds with data | Use historical data to set thresholds |

### 4.3 Alert Routing

| Alert Type | Primary Route | Escalation | Auto-Resolve |
|-----------|--------------|-----------|-------------|
| Infrastructure (AWS/GCP) | On-call engineer | → Engineering Manager (30 min) | If metric recovers |
| Application errors | On-call engineer | → Service owner (30 min) | If error rate drops |
| Database | On-call engineer | → DBA/Senior engineer (15 min) | If resolved |
| Security | Security + On-call | → CTO (15 min) | Never auto-resolve |
| Third-party outage | On-call (awareness) | → Vendor contact | When vendor resolves |
| Customer-reported | Support → On-call | → Engineering Manager (1 hour) | When confirmed fixed |

---

## 5. Incident Management

### 5.1 Incident Severity Classification

| Severity | Impact | Examples | Response Team |
|----------|--------|---------|--------------|
| SEV-1 | Complete outage, all customers affected | Database down, auth broken | All engineering + leadership |
| SEV-2 | Major feature broken, many customers affected | Search broken, AI generation down | On-call + service owner + manager |
| SEV-3 | Partial degradation, subset of customers | Slow performance, intermittent errors | On-call + service owner |
| SEV-4 | Minor issue, workaround available | UI glitch, non-critical feature broken | On-call (normal priority) |

### 5.2 Incident Response Process

| Phase | Duration | Activities | Owner |
|-------|----------|-----------|-------|
| Detection | 0–5 min | Alert fires, on-call acknowledges | On-call |
| Triage | 5–15 min | Assess severity, classify, open incident channel | On-call (becomes IC) |
| Mitigation | 15 min – 2 hours | Identify cause, apply fix or rollback | Responders |
| Communication | Throughout | Update status page, notify stakeholders | IC |
| Resolution | Until resolved | Confirm fix, verify metrics, close incident | IC |
| Post-mortem | Within 48 hours | Write blameless post-mortem, identify actions | IC + team |

### 5.3 Incident Commander (IC) Responsibilities

| Responsibility | Details |
|---------------|---------|
| Own the incident | Single point of accountability |
| Coordinate responders | Assign tasks, prevent duplication |
| Communicate status | Regular updates (every 15–30 min) |
| Make decisions | Rollback vs. forward-fix, escalation |
| Protect responders | Shield from external pressure |
| Declare resolution | Confirm incident is over |
| Initiate post-mortem | Schedule and facilitate review |

### 5.4 Communication During Incidents

| Audience | Channel | Frequency | Content |
|----------|---------|-----------|---------|
| Engineering team | Slack #incident-{id} | Real-time | Technical details, tasks |
| Leadership | Slack #incidents-summary | Every 30 min | Impact, ETA, decisions needed |
| Customer Success | Slack #cs-alerts | Every 30 min | Customer-facing impact, talking points |
| Customers | Status page + email | Every 30 min | What's happening, ETA, workarounds |
| Public | Status page (statuspage.io) | Major updates | Service status, resolution |

---

## 6. Post-Mortem Process

### 6.1 Post-Mortem Template

| Section | Content |
|---------|---------|
| Summary | 2–3 sentence description of what happened |
| Impact | Duration, affected users, revenue impact |
| Timeline | Minute-by-minute chronology |
| Root cause | Technical root cause (5 Whys) |
| Contributing factors | What made it worse or delayed resolution |
| What went well | Things that worked during response |
| What went poorly | Things that didn't work |
| Action items | Specific, assigned, deadlined improvements |
| Lessons learned | Broader takeaways for the team |

### 6.2 Blameless Culture

| Principle | Implementation |
|-----------|---------------|
| No blame, no shame | Focus on systems, not individuals |
| Assume good intent | People made the best decision with available info |
| Celebrate transparency | Reward people who surface issues |
| Focus on prevention | "How do we prevent this class of failure?" |
| Share widely | Post-mortems are company-readable |
| Follow through | Action items are tracked to completion |

### 6.3 Post-Mortem Action Item Tracking

| Priority | Definition | SLA for Completion |
|----------|-----------|-------------------|
| P0 | Could cause same incident again | 1 week |
| P1 | Significantly reduces risk | 2 weeks |
| P2 | Improves detection or response | 1 month |
| P3 | Nice-to-have improvement | 1 quarter |

---

## 7. Monitoring & Observability

### 7.1 Observability Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Metrics | Datadog / Prometheus + Grafana | System and application metrics |
| Logs | Datadog / ELK Stack | Centralized logging, search |
| Traces | Datadog APM / Jaeger | Distributed tracing |
| Errors | Sentry | Error tracking, grouping, alerting |
| Uptime | Datadog Synthetics / Pingdom | External availability monitoring |
| Status page | Statuspage.io / Instatus | Public status communication |
| Alerting | PagerDuty | Alert routing, escalation, scheduling |

### 7.2 Key Dashboards

| Dashboard | Audience | Key Metrics |
|-----------|----------|-------------|
| Service health | On-call, engineering | Error rates, latency, throughput per service |
| Infrastructure | On-call, platform | CPU, memory, disk, network, costs |
| SLO tracking | Engineering leadership | SLO compliance, error budget remaining |
| Deployment | All engineering | Deploy frequency, rollback rate, change failure rate |
| Customer impact | CS, leadership | Affected accounts, support tickets, status |
| Cost | Engineering, finance | Infrastructure spend by service |

### 7.3 Monitoring Coverage Requirements

| System Component | Metrics Required | Alert Threshold |
|-----------------|-----------------|----------------|
| Load balancer | Request rate, error rate, latency | Error > 1%, P99 > 2s |
| Application servers | CPU, memory, request queue, errors | CPU > 80%, errors > 0.5% |
| Database | Connections, query time, replication lag | Connections > 80%, lag > 30s |
| Cache (Redis) | Hit rate, memory, evictions | Hit rate < 90%, memory > 80% |
| Queue (if applicable) | Depth, processing time, dead letters | Depth > 1000, DLQ > 0 |
| External dependencies | Availability, latency | Availability < 99%, latency > 5s |
| Background jobs | Success rate, duration, queue depth | Failure > 5%, duration > 2x normal |

---

## 8. Runbooks

### 8.1 Runbook Structure

| Section | Content |
|---------|---------|
| Title | Clear description of the issue |
| Severity | Expected severity level |
| Symptoms | What the alert/issue looks like |
| Impact | Who/what is affected |
| Diagnosis steps | How to confirm the issue (commands, queries) |
| Mitigation steps | How to fix or work around (step-by-step) |
| Escalation | When and who to escalate to |
| Prevention | Long-term fix reference |
| Last updated | Date and author |

### 8.2 Critical Runbooks (Must-Have)

| Runbook | Trigger | Key Actions |
|---------|---------|-------------|
| Database failover | Primary DB unresponsive | Promote replica, update connection strings |
| High error rate | Application error rate > 5% | Identify cause, rollback if recent deploy |
| Memory exhaustion | OOM kills detected | Restart service, identify leak, scale |
| DDoS/traffic spike | Abnormal traffic patterns | Enable rate limiting, scale, block if malicious |
| Third-party outage | External service down | Enable fallback, communicate to customers |
| Data corruption | Inconsistent data detected | Stop writes, assess scope, restore from backup |
| Certificate expiry | TLS cert expiring/expired | Renew certificate, restart services |
| Deployment rollback | Failed deployment detected | Execute rollback procedure, verify |

---

## 9. Reliability Engineering Practices

### 9.1 Proactive Reliability

| Practice | Frequency | Purpose |
|----------|-----------|---------|
| Chaos engineering | Monthly | Test failure modes in controlled way |
| Load testing | Before major releases | Verify capacity under stress |
| Dependency audit | Quarterly | Identify single points of failure |
| Disaster recovery drill | Semi-annual | Verify backup/restore procedures |
| Capacity planning | Monthly | Ensure headroom for growth |
| Security patching | Weekly (automated) | Reduce vulnerability window |
| On-call retrospective | Monthly | Improve on-call experience |
| Alert tuning | Monthly | Reduce noise, improve signal |

### 9.2 Deployment Safety

| Practice | Implementation |
|----------|---------------|
| Canary deployments | 5% traffic → 25% → 100% over 30 minutes |
| Feature flags | All new features behind flags |
| Automated rollback | Auto-rollback if error rate increases > 2x |
| Deploy during business hours | No deploys Friday afternoon or after 4 PM |
| Deploy freeze periods | No deploys during critical customer events |
| Pre-deploy checklist | Automated checks before promotion |
| Post-deploy verification | Automated smoke tests after deploy |

### 9.3 Reliability Review (for new features)

| Question | Purpose |
|----------|---------|
| What happens if this fails? | Understand failure modes |
| How will we know it's failing? | Ensure monitoring exists |
| What's the blast radius? | Understand impact scope |
| Can we roll back quickly? | Ensure reversibility |
| What are the dependencies? | Identify coupling risks |
| What's the load expectation? | Ensure capacity |
| Is there a runbook? | Ensure operational readiness |

---

## 10. On-Call Health & Sustainability

### 10.1 On-Call Health Metrics

| Metric | Target | Action if Exceeded |
|--------|--------|-------------------|
| Pages per shift | < 5 | Alert tuning, reliability investment |
| After-hours pages per shift | < 2 | Priority reliability work |
| Mean time to acknowledge | < 5 min (business), < 15 min (after-hours) | Training, tooling |
| Mean time to mitigate | < 30 minutes | Runbook improvement |
| On-call satisfaction (survey) | > 3.5/5 | Process improvement |
| Rotation size | ≥ 5 engineers | Hire or cross-train |
| Repeat incidents | < 10% | Post-mortem action follow-through |

### 10.2 Preventing Burnout

| Practice | Implementation |
|----------|---------------|
| Mandatory day off after overnight page | Non-negotiable policy |
| On-call compensation | Financial recognition of burden |
| Rotation size minimum | Never fewer than 5 people |
| Toil budget | Max 30% of on-call time on toil (automate the rest) |
| On-call retrospectives | Monthly — what can we automate/eliminate? |
| Swap flexibility | Easy to swap shifts, no guilt |
| Leadership visibility | Executives see on-call load metrics |
| Career growth | On-call expertise valued in promotions |

### 10.3 On-Call Improvement Cycle

| Step | Activity | Frequency |
|------|----------|-----------|
| 1 | Collect data (pages, MTTA, MTTR, satisfaction) | Continuous |
| 2 | Monthly on-call retro | Monthly |
| 3 | Identify top page sources | Monthly |
| 4 | Prioritize reliability work | Sprint planning |
| 5 | Execute improvements | Each sprint |
| 6 | Measure impact | Monthly |
| 7 | Celebrate improvements | Monthly |

---

*Document prepared by Manus AI. Engineering on-call and site reliability operations designed for ARG-Builder sustainable, high-reliability SaaS operations.*
