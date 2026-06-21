# ARG-Builder: SOC 2 Compliance Roadmap

## Executive Summary

This roadmap provides a step-by-step plan to achieve SOC 2 Type II certification within 12 months of ARG-Builder's launch. SOC 2 compliance is a critical enterprise sales requirement — 78% of mid-market companies require SOC 2 certification from SaaS vendors before procurement approval. The roadmap covers all five Trust Service Criteria (Security, Availability, Processing Integrity, Confidentiality, Privacy), tooling recommendations, policy templates, audit preparation, and a month-by-month execution timeline.

---

## Why SOC 2 Matters for ARG-Builder

Enterprise and mid-market customers entrust ARG-Builder with sensitive operational knowledge — process documentation, team structures, performance metrics, and strategic information. SOC 2 certification demonstrates that ARG-Builder has implemented rigorous controls to protect this data.

| Business Impact | Detail |
|----------------|--------|
| Sales Enablement | Removes #1 procurement blocker for enterprise deals |
| Competitive Advantage | Most competitors at our stage lack SOC 2 |
| Customer Trust | Demonstrates commitment to data protection |
| Insurance | Reduces cyber liability insurance premiums by 15–25% |
| Partnership Readiness | Required for technology partnership programs |

---

## SOC 2 Trust Service Criteria

| Criterion | Description | Relevance to ARG-Builder |
|-----------|-------------|--------------------------|
| Security (CC) | Protection against unauthorized access | Core — protecting customer operational data |
| Availability (A) | System uptime and accessibility | Critical — 99.9% SLA commitment |
| Processing Integrity (PI) | Accurate and complete data processing | Important — AI-generated content accuracy |
| Confidentiality (C) | Protection of confidential information | Critical — customer IP and processes |
| Privacy (P) | Personal information handling | Important — team member data |

---

## 12-Month Implementation Timeline

### Phase 1: Foundation (Months 1–3)

**Month 1: Gap Assessment & Planning**

Conduct a comprehensive gap assessment against SOC 2 requirements. Identify existing controls, missing controls, and remediation priorities. Engage a SOC 2 readiness consultant for initial assessment.

| Activity | Owner | Deliverable |
|----------|-------|-------------|
| Select compliance automation platform | CTO | Platform contract signed |
| Conduct gap assessment | CTO + Consultant | Gap analysis report |
| Define scope and boundaries | CEO + CTO | Scope document |
| Identify control owners | CTO | RACI matrix |
| Establish compliance budget | CEO | Budget approved ($50K–$80K Year 1) |

**Recommended Compliance Automation Platforms:**

| Platform | Annual Cost | Best For |
|----------|-------------|----------|
| Vanta | $15K–$25K | Startups, fast implementation |
| Drata | $12K–$20K | Continuous monitoring, automation |
| Secureframe | $10K–$18K | Cost-effective, good support |
| Laika | $15K–$25K | Complex environments |

**Month 2: Policy Development**

Develop the foundational security policies required for SOC 2. These policies define the organization's commitment to security and provide the framework for all subsequent controls.

| Policy | Purpose | Pages |
|--------|---------|-------|
| Information Security Policy | Overarching security framework | 8–12 |
| Access Control Policy | User access management | 5–8 |
| Change Management Policy | System change procedures | 4–6 |
| Incident Response Plan | Security incident handling | 6–10 |
| Data Classification Policy | Data sensitivity levels | 3–5 |
| Acceptable Use Policy | Employee technology usage | 3–4 |
| Vendor Management Policy | Third-party risk management | 4–6 |
| Business Continuity Plan | Disaster recovery procedures | 6–8 |
| Encryption Policy | Data encryption standards | 3–4 |
| Risk Assessment Policy | Risk identification and management | 4–6 |

**Month 3: Technical Controls Implementation**

Implement the technical controls required to meet SOC 2 security criteria. Focus on the highest-impact controls first.

| Control | Implementation | Tool/Service |
|---------|---------------|--------------|
| Multi-factor authentication | Enforce MFA for all team members | Google Workspace / Okta |
| Endpoint protection | Deploy EDR on all devices | CrowdStrike / SentinelOne |
| Network security | Configure VPC, security groups, WAF | AWS |
| Encryption at rest | Enable AES-256 for all databases | AWS RDS encryption |
| Encryption in transit | Enforce TLS 1.3 everywhere | AWS Certificate Manager |
| Logging & monitoring | Centralized log collection | Datadog / CloudWatch |
| Vulnerability scanning | Automated weekly scans | Snyk / Qualys |
| Access reviews | Quarterly access certification | Vanta / manual |
| Background checks | All employees | Checkr |

---

### Phase 2: Operationalization (Months 4–6)

**Month 4: Process Implementation**

Implement operational processes that demonstrate ongoing compliance — not just point-in-time controls.

| Process | Frequency | Owner | Evidence |
|---------|-----------|-------|----------|
| Access reviews | Quarterly | Engineering Manager | Review logs, approval records |
| Vulnerability management | Weekly scans, 30-day remediation | DevOps | Scan reports, ticket tracking |
| Change management | Every deployment | Engineering | PR reviews, deployment logs |
| Incident response drills | Quarterly | CTO | Drill reports, lessons learned |
| Security awareness training | Annual + onboarding | HR / CTO | Completion certificates |
| Vendor risk assessments | Annual per vendor | CTO | Assessment reports |
| Risk assessments | Annual + trigger-based | CTO | Risk register updates |
| Penetration testing | Annual | External firm | Pentest report |

**Month 5: Evidence Collection & Automation**

Configure the compliance automation platform to continuously collect evidence of control effectiveness. This transforms compliance from a periodic audit exercise into an ongoing operational practice.

| Evidence Type | Collection Method | Frequency |
|---------------|-------------------|-----------|
| Access logs | Automated via platform | Continuous |
| Code review records | GitHub integration | Per commit |
| Deployment records | CI/CD pipeline integration | Per deployment |
| Vulnerability scan results | Scanner integration | Weekly |
| Training completion | LMS integration | Per event |
| Policy acknowledgments | E-signature platform | Annual |
| Incident tickets | Ticketing system integration | Per incident |
| Infrastructure configurations | Cloud API integration | Daily |

**Month 6: SOC 2 Type I Readiness Assessment**

Conduct an internal readiness assessment to identify any remaining gaps before engaging the external auditor. Address all findings before proceeding to the Type I audit.

---

### Phase 3: Type I Audit (Months 6–8)

**Month 6–7: Auditor Selection & Engagement**

Select a qualified CPA firm to conduct the SOC 2 Type I audit. The Type I audit evaluates the design of controls at a specific point in time (not their operating effectiveness over a period).

| Auditor Selection Criteria | Importance |
|---------------------------|------------|
| Experience with SaaS/cloud companies | Critical |
| Familiarity with AWS infrastructure | High |
| Reasonable pricing ($15K–$30K for Type I) | Medium |
| Availability within timeline | High |
| Reputation and client references | Medium |

**Recommended Audit Firms for Startups:**

| Firm | Typical Cost (Type I) | Specialization |
|------|----------------------|----------------|
| Prescient Assurance | $15K–$25K | Startups, fast turnaround |
| A-LIGN | $20K–$35K | Technology companies |
| Schellman | $25K–$40K | Cloud-native companies |
| Coalfire | $30K–$50K | Enterprise, comprehensive |

**Month 7–8: Type I Audit Execution**

The auditor will review all policies, controls, and evidence to assess whether controls are suitably designed. Expect 2–4 weeks of fieldwork with regular communication.

| Audit Phase | Duration | Activities |
|-------------|----------|------------|
| Planning | 1 week | Scope confirmation, document request |
| Fieldwork | 2–3 weeks | Control testing, interviews, evidence review |
| Reporting | 1–2 weeks | Draft report, management response, final report |

**Expected Outcome:** SOC 2 Type I report issued by Month 8, demonstrating controls are properly designed.

---

### Phase 4: Observation Period & Type II (Months 8–12)

**Months 8–11: Observation Period**

The SOC 2 Type II audit requires demonstrating that controls operated effectively over a minimum 3-month observation period (6 months preferred for stronger report). During this period, maintain all controls and continue evidence collection.

| Focus Area | Monthly Activities |
|-----------|-------------------|
| Control monitoring | Review compliance dashboard daily, address alerts |
| Evidence collection | Ensure automated collection is functioning |
| Process adherence | Follow all documented processes consistently |
| Incident management | Handle any incidents per documented procedures |
| Change management | Document all system changes properly |
| Access management | Process access requests/revocations promptly |

**Month 11–12: Type II Audit**

The Type II audit evaluates operating effectiveness of controls over the observation period. This is the gold standard that enterprise customers require.

| Audit Phase | Duration | Activities |
|-------------|----------|------------|
| Planning | 1 week | Scope, sampling methodology |
| Fieldwork | 3–4 weeks | Sample testing, walkthroughs, evidence review |
| Reporting | 2–3 weeks | Draft, management response, final |

**Expected Outcome:** SOC 2 Type II report issued by Month 12.

---

## Budget Summary

| Category | Year 1 Cost |
|----------|-------------|
| Compliance automation platform | $15K–$25K |
| Readiness consultant | $10K–$15K |
| Type I audit | $20K–$30K |
| Type II audit | $25K–$40K |
| Security tooling (EDR, scanning, etc.) | $10K–$15K |
| Penetration testing | $8K–$15K |
| Training platform | $2K–$5K |
| **Total** | **$90K–$145K** |

---

## Post-Certification: Ongoing Compliance

After achieving SOC 2 Type II, maintain compliance through annual audits and continuous monitoring.

| Activity | Frequency | Annual Cost |
|----------|-----------|-------------|
| Type II audit renewal | Annual | $25K–$40K |
| Compliance platform | Annual | $15K–$25K |
| Penetration testing | Annual | $8K–$15K |
| Security tooling | Annual | $10K–$15K |
| Training & awareness | Annual | $2K–$5K |
| **Total Annual Maintenance** | — | **$60K–$100K** |

---

*Document prepared by Manus AI for ARG-Builder security and compliance strategy.*
