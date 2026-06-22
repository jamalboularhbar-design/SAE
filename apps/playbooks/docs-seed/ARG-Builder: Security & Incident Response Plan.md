# ARG-Builder: Security & Incident Response Plan

## Executive Summary

This document defines ARG-Builder's comprehensive security posture and incident response procedures. As a B2B SaaS platform handling sensitive operational data for mid-market and enterprise customers, security is not merely a compliance requirement — it is a competitive advantage and a trust foundation. This plan covers security policies, access controls, data protection, vulnerability management, incident classification, response procedures, communication protocols, and post-incident review processes.

---

## Security Framework

### Security Principles

| Principle | Implementation |
|-----------|---------------|
| Defense in depth | Multiple layers of security controls |
| Least privilege | Minimum access required for each role |
| Zero trust | Verify every request, trust no network |
| Shift left | Security integrated into development lifecycle |
| Assume breach | Design systems assuming attackers are already inside |

### Security Governance

| Role | Responsibility | Person |
|------|---------------|--------|
| Security Lead | Overall security strategy, policy, compliance | CTO (initially) |
| Incident Commander | Leads incident response during active incidents | Rotating (engineering) |
| Data Protection Officer | GDPR/privacy compliance, data handling | VP Engineering |
| Security Champions | Per-team security advocates, code review | 1 per engineering team |

---

## Access Control

### Identity & Access Management

| Control | Implementation | Standard |
|---------|---------------|----------|
| Authentication | SSO via Google Workspace + MFA required | All employees |
| Authorization | Role-based access control (RBAC) | Principle of least privilege |
| Password policy | 16+ characters, no reuse, password manager required | 1Password Teams |
| MFA | Hardware keys (YubiKey) for production access | Required for all |
| Session management | 8-hour session timeout, re-auth for sensitive actions | All systems |
| Service accounts | Unique per service, rotated quarterly | Automated rotation |

### Access Levels

| Level | Access | Who | Approval |
|-------|--------|-----|----------|
| L1 (Read) | View dashboards, logs, documentation | All employees | Automatic |
| L2 (Write) | Modify code, configuration, non-production data | Engineers | Manager approval |
| L3 (Admin) | Production database, infrastructure, secrets | Senior engineers | CTO approval |
| L4 (Super Admin) | Billing, customer data, security systems | CTO + CEO only | Board awareness |

### Production Access

| Policy | Standard |
|--------|----------|
| Direct database access | Prohibited (use admin tools with audit logging) |
| SSH to production | Emergency only, requires justification + approval |
| Customer data access | Requires written justification, time-limited, fully audited |
| Secret management | HashiCorp Vault, no secrets in code or environment variables |
| Infrastructure changes | Terraform only (no manual changes), PR-reviewed |

---

## Data Protection

### Data Classification

| Classification | Description | Examples | Controls |
|----------------|-------------|----------|----------|
| Public | Freely available | Marketing content, pricing | None required |
| Internal | Company-only information | Internal docs, metrics | Access control |
| Confidential | Sensitive business data | Customer data, financials | Encryption + access control |
| Restricted | Highest sensitivity | Credentials, PII, health data | Encryption + strict access + audit |

### Encryption Standards

| Data State | Standard | Implementation |
|-----------|----------|---------------|
| At rest | AES-256 | AWS KMS-managed keys, database encryption |
| In transit | TLS 1.3 | All connections, no exceptions |
| In use | Application-level | Sensitive fields encrypted in memory |
| Backups | AES-256 | Encrypted before storage, separate key |
| Key management | AWS KMS | Automatic rotation every 90 days |

### Data Retention & Disposal

| Data Type | Retention Period | Disposal Method |
|-----------|----------------|-----------------|
| Customer operational data | Duration of contract + 30 days | Secure deletion + verification |
| Customer PII | Duration of contract + 30 days | Secure deletion + certificate |
| Application logs | 90 days (hot), 1 year (cold) | Automatic expiration |
| Security logs | 2 years | Archived, then secure deletion |
| Financial records | 7 years | Archived per legal requirements |
| Employee data | Employment + 3 years | Secure deletion |

---

## Vulnerability Management

### Vulnerability Scanning

| Type | Tool | Frequency | Scope |
|------|------|-----------|-------|
| Dependency scanning | Snyk | Every PR + daily | All dependencies |
| Static analysis | CodeQL + SonarQube | Every PR | All application code |
| Container scanning | Trivy | Every build | All Docker images |
| Infrastructure scanning | AWS Inspector | Weekly | All cloud resources |
| Penetration testing | External firm | Annually | Full application + infrastructure |
| Bug bounty | HackerOne (private) | Continuous | Public-facing application |

### Vulnerability Response SLAs

| Severity | CVSS Score | Response Time | Remediation Time |
|----------|-----------|---------------|-----------------|
| Critical | 9.0–10.0 | 4 hours | 24 hours |
| High | 7.0–8.9 | 24 hours | 7 days |
| Medium | 4.0–6.9 | 72 hours | 30 days |
| Low | 0.1–3.9 | 1 week | 90 days |

---

## Incident Classification

### Incident Severity Levels

| Level | Definition | Examples | Response |
|-------|-----------|----------|----------|
| SEV-1 (Critical) | Active data breach, service completely down, security compromise | Data exfiltration, ransomware, total outage | All-hands, CEO notified, customer notification |
| SEV-2 (Major) | Partial service degradation, potential data exposure, failed security control | Partial outage, unauthorized access attempt, failed encryption | On-call team + security lead, management notified |
| SEV-3 (Moderate) | Minor service impact, security policy violation, suspicious activity | Single feature down, policy violation, unusual login | On-call engineer, documented and tracked |
| SEV-4 (Low) | No immediate impact, potential future risk | Unpatched non-critical system, minor misconfiguration | Scheduled remediation, backlog item |

---

## Incident Response Procedures

### Phase 1: Detection & Triage (0–15 minutes)

| Step | Action | Owner | Tool |
|------|--------|-------|------|
| 1 | Alert received (automated or reported) | On-call engineer | PagerDuty |
| 2 | Acknowledge alert, assess severity | On-call engineer | PagerDuty |
| 3 | Classify incident (SEV-1 through SEV-4) | On-call engineer | Incident template |
| 4 | Open incident channel (#incident-YYYY-MM-DD) | On-call engineer | Slack |
| 5 | Assign Incident Commander (IC) | On-call engineer | Rotation schedule |
| 6 | Notify stakeholders per severity | IC | Notification matrix |

### Phase 2: Containment (15–60 minutes)

| Step | Action | Owner |
|------|--------|-------|
| 1 | Identify blast radius (what systems/data affected) | IC + engineers |
| 2 | Implement immediate containment (isolate, block, disable) | Engineers |
| 3 | Preserve evidence (logs, snapshots, memory dumps) | Security lead |
| 4 | Verify containment (confirm threat is isolated) | IC |
| 5 | Communicate status update to stakeholders | IC |

### Phase 3: Eradication (1–4 hours)

| Step | Action | Owner |
|------|--------|-------|
| 1 | Identify root cause | Engineers + security |
| 2 | Remove threat (malware, compromised credentials, vulnerability) | Engineers |
| 3 | Patch vulnerability or close attack vector | Engineers |
| 4 | Verify eradication (scan, test, validate) | Security lead |
| 5 | Document actions taken | IC |

### Phase 4: Recovery (4–24 hours)

| Step | Action | Owner |
|------|--------|-------|
| 1 | Restore affected systems from clean backups | Engineers |
| 2 | Validate system integrity (checksums, tests) | Engineers |
| 3 | Monitor for recurrence (enhanced monitoring for 72 hours) | On-call |
| 4 | Gradually restore full service | IC |
| 5 | Confirm with customers that service is restored | CS team |

### Phase 5: Post-Incident Review (48 hours after resolution)

| Step | Action | Owner |
|------|--------|-------|
| 1 | Schedule blameless retrospective | IC |
| 2 | Prepare incident timeline | IC |
| 3 | Conduct retrospective (all involved parties) | IC |
| 4 | Document findings, root cause, contributing factors | IC |
| 5 | Define corrective actions with owners and deadlines | IC + CTO |
| 6 | Publish post-incident report (internal + customer if applicable) | IC |
| 7 | Track corrective actions to completion | Security lead |

---

## Communication Protocols

### Internal Communication

| Severity | Who to Notify | When | Channel |
|----------|--------------|------|---------|
| SEV-1 | CEO, CTO, VP CS, all engineering | Immediately | Slack + PagerDuty + phone |
| SEV-2 | CTO, engineering leads, VP CS | Within 15 minutes | Slack + PagerDuty |
| SEV-3 | Engineering team lead | Within 1 hour | Slack |
| SEV-4 | Documented in backlog | Next business day | Jira/Linear |

### Customer Communication

| Severity | Communication | Timeline | Channel |
|----------|--------------|----------|---------|
| SEV-1 (data breach) | Immediate notification + regular updates | Within 1 hour of confirmation | Email + status page + phone (enterprise) |
| SEV-1 (outage) | Status page update + email for extended outages | Within 30 minutes | Status page + email |
| SEV-2 | Status page update if customer-facing | Within 1 hour | Status page |
| SEV-3/4 | No external communication required | — | — |

### Customer Notification Template (Data Breach)

**Subject:** Security Incident Notification — [Date]

**Body:**

Dear [Customer Name],

We are writing to inform you of a security incident that may have affected your data. We take this matter extremely seriously and want to provide you with full transparency.

**What happened:** [Brief, factual description]

**When it happened:** [Date/time range]

**What data was affected:** [Specific data types]

**What we've done:** [Containment and remediation actions]

**What you should do:** [Recommended actions for customer]

**Next steps:** We will provide updates every [frequency] until this matter is fully resolved. Our security team is available at security@argbuilder.com for any questions.

We sincerely apologize for this incident and are committed to preventing future occurrences.

---

## Security Compliance

### SOC 2 Type II Controls

| Trust Service Criteria | Key Controls |
|----------------------|--------------|
| Security | Firewalls, IDS/IPS, access controls, encryption, vulnerability management |
| Availability | Redundancy, failover, disaster recovery, SLA monitoring |
| Processing Integrity | Input validation, error handling, change management |
| Confidentiality | Data classification, encryption, access controls, DLP |
| Privacy | Consent management, data minimization, retention policies |

### Compliance Calendar

| Activity | Frequency | Owner |
|----------|-----------|-------|
| Access review | Quarterly | Security lead |
| Penetration test | Annually | External firm |
| Security training | Annually (+ new hire) | Security lead |
| Policy review | Annually | CTO |
| Disaster recovery test | Semi-annually | Engineering |
| SOC 2 audit | Annually | External auditor |
| Vendor security review | Annually (or on new vendor) | Security lead |
