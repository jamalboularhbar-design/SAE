# ARG-Builder: Compliance Automation GRC

## Executive Summary

This document defines ARG-Builder's compliance automation and governance framework — the systematic approach to maintaining regulatory compliance, data protection, and corporate governance at scale without creating bureaucratic overhead. Compliance is automated wherever possible, making it a competitive advantage rather than a burden.

---

## Compliance Landscape

### Applicable Regulations

| Regulation | Jurisdiction | Applicability | Priority | Certification Timeline |
|-----------|-------------|---------------|----------|----------------------|
| SOC 2 Type II | US (global standard) | All customers | Critical | Year 1 Q2 |
| CCPA/CPRA | California | California customers/data | High | Year 1 Q1 |
| GDPR | EU/EEA | EU customers/data | High | Year 1 Q3 (if EU expansion) |
| HIPAA | US | Healthcare customers | Medium | Year 2 Q1 |
| ISO 27001 | International | Enterprise customers | Medium | Year 2 Q2 |
| FedRAMP | US Federal | Government customers | Low | Year 3+ |
| PCI DSS | Global | Payment processing | High | Year 1 (via Stripe) |
| SOX | US | If publicly traded | Low | Pre-IPO |

---

## Automated Compliance Controls

### Control Categories

| Category | Manual Controls | Automated Controls | Automation Rate |
|----------|----------------|-------------------|----------------|
| Access management | Role changes, offboarding | SSO provisioning, auto-deprovisioning, access reviews | 85% |
| Data protection | Classification, DLP | Encryption at rest/transit, auto-classification, retention policies | 90% |
| Change management | Approval workflows | CI/CD gates, automated testing, deployment policies | 80% |
| Monitoring | Log review, incident detection | SIEM alerts, anomaly detection, automated response | 90% |
| Vendor management | Assessment, review | Automated questionnaires, continuous monitoring | 60% |
| Training | Scheduling, tracking | LMS auto-enrollment, completion tracking, reminders | 95% |
| Policy management | Writing, distribution | Version control, auto-acknowledgment, expiry alerts | 75% |

### Automation Technology Stack

| Function | Tool | Purpose | Cost |
|----------|------|---------|------|
| Compliance management | Vanta / Drata | Continuous monitoring, evidence collection | $15K–$30K/year |
| Identity & access | Okta / Auth0 | SSO, MFA, lifecycle management | $5K–$15K/year |
| Endpoint security | CrowdStrike / SentinelOne | Device compliance, threat detection | $10K–$20K/year |
| Cloud security | AWS Config + GuardDuty | Configuration compliance, threat detection | $5K–$10K/year |
| Vulnerability management | Snyk + Dependabot | Code scanning, dependency updates | $5K–$10K/year |
| Security training | KnowBe4 / Curricula | Phishing simulation, compliance training | $3K–$8K/year |
| Policy management | Notion / Confluence | Policy documentation, version control | $1K–$3K/year |
| Audit trail | CloudTrail + custom logging | Immutable audit logs | $2K–$5K/year |

---

## SOC 2 Implementation

### Trust Service Criteria

| Criteria | Description | Key Controls | Evidence |
|----------|-------------|-------------|----------|
| **Security** | Protection against unauthorized access | Firewall, encryption, access controls, MFA | Config screenshots, access logs |
| **Availability** | System accessible as committed | Uptime monitoring, DR plan, incident response | Uptime reports, DR test results |
| **Processing Integrity** | System processing is complete and accurate | Input validation, error handling, reconciliation | Test results, error logs |
| **Confidentiality** | Information designated confidential is protected | Encryption, access controls, data classification | Encryption configs, access reviews |
| **Privacy** | Personal information collected/used per notice | Privacy policy, consent management, data mapping | Privacy assessments, consent records |

### SOC 2 Readiness Timeline

| Month | Activities | Deliverables |
|-------|-----------|-------------|
| Month 1 | Gap assessment, policy drafting | Gap report, policy templates |
| Month 2 | Control implementation, tool deployment | Controls documented, tools configured |
| Month 3 | Employee training, process rollout | Training records, process documentation |
| Month 4 | Internal audit, remediation | Internal audit report, remediation plan |
| Month 5 | Type I audit (point-in-time) | SOC 2 Type I report |
| Month 6–11 | Observation period (Type II) | Continuous evidence collection |
| Month 12 | Type II audit | SOC 2 Type II report |

---

## Data Governance

### Data Classification

| Level | Definition | Examples | Controls |
|-------|-----------|----------|----------|
| **Public** | Freely shareable | Marketing content, public docs | No restrictions |
| **Internal** | Company-wide access | Internal guides, meeting notes | Authentication required |
| **Confidential** | Need-to-know basis | Customer data, financials, roadmap | Role-based access, encryption |
| **Restricted** | Highly sensitive | PII, credentials, legal matters | MFA, audit logging, encryption, DLP |

### Data Lifecycle Management

| Stage | Policy | Automation | Retention |
|-------|--------|-----------|-----------|
| Collection | Minimize, consent-based | Privacy-by-design in forms | — |
| Processing | Purpose limitation, accuracy | Validation rules, data quality checks | — |
| Storage | Encrypted, classified, access-controlled | Auto-encryption, auto-classification | Per policy |
| Sharing | Need-to-know, contractual protection | DLP rules, sharing controls | — |
| Retention | Defined periods per data type | Auto-archival, retention labels | See below |
| Deletion | Secure erasure, certificate | Auto-deletion triggers, crypto-shredding | — |

### Retention Schedule

| Data Type | Active Retention | Archive | Deletion |
|-----------|-----------------|---------|----------|
| Customer account data | Duration of contract | 90 days post-termination | 90 days post-termination |
| Customer content (guides) | Duration of contract | 30 days post-termination (export available) | 30 days post-termination |
| Financial records | 7 years | 7 years | After 7 years |
| Employee records | Duration of employment + 3 years | 3 years post-departure | After 3 years |
| Marketing data (leads) | 24 months of inactivity | None | After 24 months inactive |
| System logs | 90 days (hot) | 1 year (cold) | After 1 year |
| Audit logs | 1 year (hot) | 7 years (cold) | After 7 years |
| Backup data | 35 days | None | After 35 days |

---

## Corporate Governance

### Governance Structure

| Body | Composition | Meeting Frequency | Responsibilities |
|------|------------|-------------------|-----------------|
| Board of Directors | 3–5 members (2 founders, 1–2 investors, 1 independent) | Quarterly | Strategy, fiduciary duty, CEO oversight |
| Advisory Board | 5–7 advisors | Quarterly | Industry guidance, introductions |
| Executive Team | CEO, CTO, VP Sales, VP CS, VP Product | Weekly | Operational decisions, execution |
| Security Committee | CTO, VP Eng, Security Lead | Monthly | Security posture, incident review |
| Compensation Committee | Board subset (2–3) | Semi-annually | Executive comp, equity grants |

### Decision Authority Matrix

| Decision Type | < $10K | $10K–$50K | $50K–$250K | > $250K |
|--------------|--------|-----------|-----------|---------|
| Operating expense | Manager | VP | CEO | Board |
| Capital expenditure | VP | CEO | CEO + CFO | Board |
| Hiring | Hiring Manager | VP | CEO | Board (executives) |
| Contract commitment | Manager | VP | CEO | Board |
| Strategic partnership | VP | CEO | CEO + Board awareness | Board approval |
| Pricing change | VP Product | CEO | CEO + Board awareness | Board approval |

---

## Audit Readiness

### Continuous Audit Preparation

| Activity | Frequency | Owner | Output |
|----------|-----------|-------|--------|
| Evidence collection | Continuous (automated) | Compliance tool | Evidence repository |
| Control testing | Monthly (automated) | Security team | Test results dashboard |
| Policy review | Quarterly | Legal + Compliance | Updated policies |
| Access review | Quarterly | IT + Managers | Access certification |
| Vendor assessment | Annually (critical), bi-annually (others) | Procurement | Vendor risk reports |
| Penetration testing | Annually | External firm | Pen test report |
| Business continuity test | Semi-annually | Operations | DR test results |
| Employee training | Annually (+ new hire) | People Ops | Completion records |

### Audit Response Process

| Phase | Duration | Activities | Deliverables |
|-------|----------|-----------|-------------|
| Preparation | 2 weeks | Gather evidence, brief team, review controls | Evidence package |
| Fieldwork | 2–4 weeks | Auditor interviews, testing, walkthroughs | Auditor questions answered |
| Findings review | 1 week | Review draft findings, provide context | Management responses |
| Remediation | 2–4 weeks | Address findings, implement fixes | Remediation evidence |
| Report | 2 weeks | Final report review, distribution | Audit report |

---

## Incident & Breach Response

### Breach Notification Requirements

| Regulation | Notification Timeline | Who to Notify | Content Required |
|-----------|----------------------|---------------|-----------------|
| CCPA/CPRA | "Expedient" (interpreted as 72h) | Affected individuals + AG (if > 500) | Nature of breach, data involved, steps taken |
| GDPR | 72 hours to DPA, "without undue delay" to individuals | Supervisory authority + affected individuals (if high risk) | Nature, categories, consequences, measures |
| HIPAA | 60 days to individuals, 60 days to HHS | Individuals + HHS + media (if > 500) | Description, types of info, steps to protect |
| State breach laws | Varies (30–90 days) | Affected individuals + AG (varies by state) | Varies by state |

---

## Compliance Metrics

| Metric | Target | Measurement | Reporting |
|--------|--------|-------------|-----------|
| Control effectiveness | > 95% passing | Automated testing | Monthly |
| Policy acknowledgment | 100% within 30 days | LMS tracking | Quarterly |
| Security training completion | 100% annually | LMS tracking | Quarterly |
| Vulnerability remediation (critical) | < 24 hours | Scanning tools | Weekly |
| Vulnerability remediation (high) | < 7 days | Scanning tools | Weekly |
| Access review completion | 100% quarterly | IAM tools | Quarterly |
| Incident response time | Within SLA | Incident tracking | Per incident |
| Audit findings (critical) | 0 | Audit reports | Per audit |
| Vendor risk assessments current | > 90% | Vendor management | Quarterly |
