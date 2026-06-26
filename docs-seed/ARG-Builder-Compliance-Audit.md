# ARG-Builder: Compliance & Audit Readiness Guide

## Framework for SOC 2, ISO 27001, and Enterprise Security Compliance

---

## 1. Executive Summary

Enterprise customers require vendors to demonstrate security and compliance maturity through certifications and audits. SOC 2 Type II is the minimum bar for selling to mid-market and enterprise companies, while ISO 27001 opens international markets. This guide defines ARG-Builder's compliance roadmap, control framework, audit preparation process, and ongoing compliance operations.

---

## 2. Compliance Roadmap

| Certification | Priority | Timeline | Cost | Business Impact |
|--------------|----------|----------|------|----------------|
| SOC 2 Type I | P0 | Month 1–4 | $30K–$50K | Unblocks mid-market deals |
| SOC 2 Type II | P0 | Month 5–16 | $40K–$60K | Required for enterprise |
| ISO 27001 | P1 | Month 12–18 | $50K–$80K | International enterprise |
| GDPR compliance | P0 | Month 1–6 | $20K–$30K | EU market access |
| HIPAA | P2 | Month 18–24 | $30K–$50K | Healthcare vertical |

---

## 3. SOC 2 Trust Service Criteria

| Criteria | Description | Relevance |
|----------|-------------|-----------|
| Security (CC) | Protection against unauthorized access | Core — all systems |
| Availability (A) | System availability per commitments | Core — SLA commitments |
| Processing Integrity (PI) | Accurate, complete processing | Important — AI generation |
| Confidentiality (C) | Protection of confidential information | Core — customer data |
| Privacy (P) | Personal information handling | Important — PII management |

---

## 4. Key Control Categories

| Category | Controls | Examples |
|----------|----------|---------|
| Access control | Logical access, authentication, authorization | SSO, MFA, RBAC, access reviews |
| Change management | Development lifecycle, change approval | Git workflow, PR reviews, deployment gates |
| Risk management | Risk assessment, mitigation, monitoring | Annual risk assessment, risk register |
| Incident management | Detection, response, communication | Incident playbooks, post-mortems |
| Vendor management | Third-party risk, due diligence | Vendor assessments, DPAs |
| Data protection | Encryption, backup, retention | AES-256, automated backups |
| Monitoring | Logging, alerting, review | SIEM, log aggregation |
| HR security | Background checks, training, offboarding | Security training, access revocation |
| Business continuity | DR planning, testing, recovery | DR plan, RTO/RPO, annual testing |

---

## 5. Policy Library

| Policy | Review Frequency | Owner |
|--------|-----------------|-------|
| Information Security Policy | Annual | CTO |
| Acceptable Use Policy | Annual | HR |
| Access Control Policy | Annual | Security |
| Data Classification Policy | Annual | Security |
| Encryption Policy | Annual | Engineering |
| Incident Response Policy | Annual | Security |
| Change Management Policy | Annual | Engineering |
| Vendor Management Policy | Annual | Security |
| Business Continuity Policy | Annual | Operations |
| Data Retention Policy | Annual | Legal + Security |
| Privacy Policy | Annual | Legal |
| Employee Security Policy | Annual | HR |
| Risk Management Policy | Annual | Security |
| Backup Policy | Annual | Engineering |

---

## 6. Technical Controls

### 6.1 Infrastructure Security

| Control | Implementation | Evidence |
|---------|---------------|----------|
| Encryption at rest | AES-256 (AWS KMS) | AWS configuration |
| Encryption in transit | TLS 1.2+ everywhere | SSL certificates |
| Network segmentation | VPC, security groups, private subnets | AWS VPC config |
| DDoS protection | AWS Shield + CloudFront | AWS configuration |
| WAF | AWS WAF or Cloudflare | WAF rules, logs |
| Secrets management | AWS Secrets Manager | Secrets configuration |
| Container security | Image scanning, runtime protection | Scan reports |

### 6.2 Application Security

| Control | Implementation | Evidence |
|---------|---------------|----------|
| Authentication | MFA required, SSO supported | Auth configuration |
| Authorization | RBAC with least privilege | Role definitions |
| Input validation | Server-side validation | Code review, testing |
| API security | Rate limiting, authentication | API gateway config |
| Dependency scanning | Automated vulnerability scanning | Scan reports |
| SAST/DAST | Static and dynamic analysis | Scan results |
| Penetration testing | Annual third-party pen test | Pen test report |

---

## 7. Audit Preparation

| Phase | Timeline | Activities |
|-------|----------|-----------|
| Pre-audit prep | 8 weeks before | Evidence collection, gap remediation |
| Auditor selection | 10 weeks before | RFP, selection, engagement |
| Readiness assessment | 6 weeks before | Internal audit, mock assessment |
| Evidence package | 4 weeks before | Compile all evidence |
| Audit fieldwork | 2–4 weeks | Auditor interviews, evidence review |
| Draft report review | 2 weeks after | Review findings, management response |
| Final report | 4 weeks after | Receive certified report |

---

## 8. Ongoing Compliance Operations

| Activity | Frequency | Owner |
|----------|-----------|-------|
| Access reviews | Quarterly | Security + Managers |
| Policy reviews | Annual (staggered) | Policy owners |
| Risk assessment | Annual | Security |
| Security training | Annual + new hire | HR + Security |
| Vulnerability scanning | Continuous | Engineering |
| Penetration testing | Annual | Security |
| Backup testing | Monthly | Engineering |
| DR testing | Annual | Operations |
| Vendor assessments | Annual | Security |
| Compliance dashboard review | Weekly | Security |

---

## 9. Compliance Automation Tools

| Tool | Annual Cost | Best For |
|------|-----------|----------|
| Vanta | $15K–$40K | Startups, speed |
| Drata | $15K–$50K | Mid-market |
| Secureframe | $12K–$35K | Cost-conscious |

**Recommendation:** Vanta for fastest path to SOC 2.

---

## 10. Enterprise Security Questionnaire

| Category | Common Question | Answer |
|----------|----------------|--------|
| Encryption | Data encrypted at rest and in transit? | Yes — AES-256 + TLS 1.2+ |
| Authentication | SSO and MFA supported? | Yes — SAML 2.0 SSO, MFA required |
| Incident response | IR plan documented? | Yes — tested annually, 72-hour notification |
| Backup | How is data backed up? | Daily automated, 30-day retention |
| DR | RTO/RPO? | RTO: 4 hours, RPO: 1 hour |
| Compliance | SOC 2 certified? | Yes — Type II |
| Pen testing | Annual pen test? | Yes — third-party |
| Data location | Where is data stored? | AWS US-East-1 (EU upon request) |
| Data deletion | Deletion process? | 30 days post-termination |

---

## 11. Budget & Resources

| Category | Year 1 | Year 2 |
|----------|--------|--------|
| Compliance platform | $20,000 | $25,000 |
| SOC 2 audit | $50,000 | $35,000 |
| Penetration testing | $15,000 | $15,000 |
| Security tools | $12,000 | $15,000 |
| Cyber insurance | $8,000 | $10,000 |
| Training platform | $5,000 | $5,000 |
| Consultant/advisory | $20,000 | $10,000 |
| **Total** | **$130,000** | **$115,000** |
