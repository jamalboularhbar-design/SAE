# ARG-Builder: Sales Engineering Playbook

## Technical Pre-Sales Strategy, Demo Methodology, POC Framework, and Technical Win Criteria

---

## 1. Executive Summary

Sales Engineers (SEs) are the bridge between customer technical requirements and ARG-Builder's capabilities. In enterprise deals, the SE is often the difference between a technical win and a competitive loss. This playbook defines the SE role, demo methodology, proof-of-concept framework, and technical objection handling for ARG-Builder's sales process.

---

## 2. SE Role & Responsibilities

### 2.1 Role Definition

| Responsibility | Description | % of Time |
|---------------|-------------|-----------|
| Discovery (technical) | Understand customer's technical environment and requirements | 20% |
| Demonstrations | Deliver compelling, personalized product demos | 25% |
| POC/Pilot management | Design, execute, and evaluate proof-of-concept engagements | 20% |
| Technical objection handling | Address security, integration, scalability concerns | 15% |
| RFP/RFI responses | Complete technical questionnaires and proposals | 10% |
| Internal feedback | Relay customer requirements to product team | 5% |
| Enablement | Train AEs on technical positioning | 5% |

### 2.2 SE Engagement Model

| Deal Stage | SE Involvement | Activities |
|-----------|---------------|-----------|
| Discovery | Light (AE-led, SE observes) | Listen for technical signals |
| Demo | Heavy (SE-led) | Deliver personalized demonstration |
| Evaluation | Heavy (SE-led) | POC design, execution, support |
| Proposal | Medium (SE supports AE) | Technical proposal sections, architecture |
| Negotiation | Light (on-call) | Address last-minute technical concerns |
| Close | Light | Handoff documentation to CS/Implementation |

### 2.3 SE Capacity Planning

| Metric | Target | Notes |
|--------|--------|-------|
| SE:AE ratio | 1:2 (Enterprise), 1:3 (Mid-market) | Adjust based on deal complexity |
| Active POCs per SE | 2–3 concurrent | Quality over quantity |
| Demos per week | 4–6 | Including prep time |
| Win rate (SE-engaged deals) | > 60% | vs. 30% without SE |
| Technical win rate | > 75% | Technical evaluation passed |

---

## 3. Discovery Framework (Technical)

### 3.1 Technical Discovery Questions

**Current State:**
- "Walk me through your current documentation/knowledge management stack."
- "How many tools are involved in creating and maintaining operational content?"
- "What's your current content creation workflow — who creates, reviews, and approves?"
- "How do you handle version control and content freshness?"

**Technical Requirements:**
- "What are your SSO/authentication requirements?"
- "Do you have specific data residency or compliance requirements?"
- "What systems would ARG-Builder need to integrate with?"
- "What's your security review process for new SaaS vendors?"

**Success Criteria:**
- "If we could solve this perfectly, what would success look like in 6 months?"
- "What are the must-have vs. nice-to-have requirements?"
- "Who needs to sign off on the technical evaluation?"
- "What's your timeline for making a decision?"

### 3.2 Technical Qualification Checklist

| Criterion | Green | Yellow | Red |
|-----------|-------|--------|-----|
| SSO requirement | Standard SAML/OIDC | Custom IdP | Unsupported protocol |
| Integration needs | Standard APIs/webhooks | Custom integration | Legacy system dependency |
| Data residency | US/EU (supported) | Specific country | Air-gapped/on-premise |
| Security requirements | Standard enterprise | SOC 2 + HIPAA | FedRAMP/IL4+ |
| Scale requirements | < 5,000 users | 5,000–50,000 | > 50,000 |
| Customization needs | Configuration | Moderate custom | Heavy custom development |
| Timeline | 30–90 days | 90–180 days | > 180 days |

---

## 4. Demo Methodology

### 4.1 Demo Preparation

| Step | Activity | Time Investment |
|------|----------|---------------|
| 1 | Review discovery notes and technical requirements | 30 min |
| 2 | Customize demo environment with prospect's industry/use case | 45 min |
| 3 | Prepare "wow moments" tailored to their pain points | 30 min |
| 4 | Test all integrations and flows end-to-end | 15 min |
| 5 | Prepare backup plan (offline demo, screenshots) | 15 min |
| 6 | Align with AE on demo goals and close plan | 15 min |

### 4.2 Demo Structure (45 minutes)

| Segment | Duration | Content | Goal |
|---------|----------|---------|------|
| Opening | 3 min | Recap discovery, confirm agenda | Alignment |
| Context | 5 min | "Here's what we heard" — their pain | Validation |
| Core demo | 20 min | 3 key workflows solving their problems | Value |
| Differentiation | 7 min | Unique capabilities vs. alternatives | Competitive edge |
| Q&A | 7 min | Address questions and concerns | Confidence |
| Close | 3 min | Next steps, POC proposal | Momentum |

### 4.3 Demo Best Practices

| Principle | Implementation |
|-----------|---------------|
| Tell their story | Use their industry, roles, and terminology |
| Show, don't tell | Every claim backed by live demonstration |
| Start with the outcome | Show the end result first, then how to get there |
| Limit features shown | 3 key workflows max (depth over breadth) |
| Create "aha moments" | Identify 2–3 moments that make them lean forward |
| Handle the unexpected | Have backup plans for technical issues |
| Involve the audience | Ask questions, get reactions, adjust in real-time |
| End with clear next steps | Always propose the next action |

### 4.4 Demo Scenarios by Persona

| Persona | Demo Focus | Key Workflows | "Aha Moment" |
|---------|-----------|---------------|-------------|
| VP Operations | Operational system generation, analytics | Generate full ops guide in minutes | Speed of generation |
| COO | Executive dashboard, cross-team visibility | Organization-wide operational view | Completeness |
| HR/People Leader | Onboarding, training documentation | New hire guide auto-generated | Time savings |
| IT Director | Integrations, security, administration | SSO setup, API capabilities | Enterprise-ready |
| Compliance Officer | Audit readiness, regulatory mapping | Compliance framework auto-populated | Risk reduction |

---

## 5. Proof of Concept (POC) Framework

### 5.1 POC Decision Criteria

**When to offer a POC:**
- Enterprise deal (> $100K ACV)
- Technical complexity requires hands-on evaluation
- Multiple stakeholders need to experience the product
- Competitive evaluation where demo alone is insufficient
- Customer's procurement process requires it

**When NOT to offer a POC:**
- Deal is < $50K ACV (offer extended trial instead)
- Customer is using POC to delay decision
- No clear success criteria defined
- No executive sponsor identified
- Competitive deal already lost on non-technical grounds

### 5.2 POC Structure

| Phase | Duration | Activities | Deliverables |
|-------|----------|-----------|-------------|
| Planning | 3–5 days | Define scope, success criteria, timeline | POC plan document |
| Setup | 2–3 days | Configure environment, integrations, data | Ready environment |
| Execution | 10–15 days | Customer uses product, SE supports | Usage data, feedback |
| Evaluation | 3–5 days | Review results against criteria | Evaluation report |
| Decision | 3–5 days | Present findings, propose next steps | Go/no-go decision |

**Total POC Duration:** 3–4 weeks (never exceed 30 days)

### 5.3 POC Success Criteria Template

| Category | Criterion | Measurement | Target | Weight |
|----------|-----------|-------------|--------|--------|
| Functionality | Core use case works as expected | Pass/fail per scenario | 100% pass | 30% |
| Performance | Response time acceptable | Page load, generation speed | < 5 seconds | 15% |
| Integration | Connects to required systems | Successful data flow | All critical integrations | 20% |
| Usability | Users can accomplish tasks independently | Task completion rate | > 85% | 15% |
| Quality | Generated content meets quality bar | Expert review score | > 4/5 | 15% |
| Security | Passes security review | Questionnaire completion | All critical items | 5% |

### 5.4 POC Governance

| Rule | Rationale |
|------|-----------|
| Maximum 30 days duration | Prevents indefinite evaluation |
| Written success criteria before start | Prevents moving goalposts |
| Executive sponsor required | Ensures decision authority |
| Weekly check-in calls | Maintains momentum |
| No scope expansion without re-scoping | Prevents scope creep |
| Clear go/no-go decision at end | Forces conclusion |
| Limited to 2 concurrent POCs per SE | Quality focus |

---

## 6. Technical Objection Handling

### 6.1 Security Objections

| Objection | Response | Evidence |
|-----------|----------|----------|
| "Is our data safe?" | "We encrypt all data at rest (AES-256) and in transit (TLS 1.3). Your data is isolated in dedicated tenancy. We're SOC 2 certified." | SOC 2 report, security whitepaper |
| "Where is data stored?" | "All data is stored in [US/EU] on AWS/GCP infrastructure. We can accommodate data residency requirements." | Architecture diagram |
| "Can your employees access our data?" | "Access is strictly controlled via RBAC with audit logging. No employee can access customer data without explicit authorization and logging." | Access control policy |
| "What about AI data usage?" | "Your data is never used to train models. It's processed in isolated environments and never shared across customers." | Data processing agreement |

### 6.2 Integration Objections

| Objection | Response | Evidence |
|-----------|----------|----------|
| "We need it to work with [system]" | "We have a robust API and webhook system. Let me show you our integration architecture and how it connects to [system]." | API documentation, integration examples |
| "Our tech stack is complex" | "We're designed for enterprise environments. Here's how similar companies with [similar stack] have integrated." | Case study, architecture diagram |
| "We need custom integrations" | "Our API supports custom workflows. For enterprise customers, we also offer professional services for complex integrations." | API docs, PS offering |

### 6.3 Scalability Objections

| Objection | Response | Evidence |
|-----------|----------|----------|
| "Can it handle our volume?" | "We serve customers with [X]K+ users generating [Y]K+ documents. Our architecture auto-scales to handle peak loads." | Performance benchmarks |
| "What about uptime?" | "We guarantee 99.9% uptime SLA with redundant infrastructure across multiple availability zones." | SLA document, status page history |
| "What if AI quality degrades at scale?" | "Our AI models are optimized for enterprise scale. Quality actually improves with more organizational context." | Quality metrics at scale |

### 6.4 Competitive Objections

| Competitor | Their Strength | Our Counter |
|-----------|---------------|-------------|
| Confluence/Notion | Established, familiar | "Those are blank canvases. ARG-Builder generates complete systems. It's the difference between a blank Word doc and a finished consulting deliverable." |
| Custom internal tool | Tailored to their needs | "Custom tools require ongoing maintenance. ARG-Builder evolves autonomously, saving your engineering team hundreds of hours." |
| Consulting firms | Human expertise | "We deliver consulting-quality output at SaaS pricing, continuously — not a one-time engagement that becomes stale." |
| Document AI tools | AI-powered | "They help with individual documents. We generate entire operational systems with cross-references, hierarchies, and continuous updates." |

---

## 7. RFP/RFI Response Framework

### 7.1 Response Process

| Step | Timeline | Owner | Activity |
|------|----------|-------|----------|
| 1 | Day 0 | AE | Receive RFP, initial review |
| 2 | Day 1 | SE | Technical assessment, go/no-go |
| 3 | Day 2–5 | SE | Draft technical responses |
| 4 | Day 5–7 | AE + SE | Review, refine, add commercial |
| 5 | Day 7–8 | Legal | Review terms and conditions |
| 6 | Day 8–9 | Leadership | Final review and approval |
| 7 | Day 10 | AE | Submit response |

### 7.2 Common RFP Sections

| Section | Owner | Key Content |
|---------|-------|-------------|
| Company overview | Marketing | Boilerplate, financials, references |
| Technical architecture | SE | Architecture, scalability, reliability |
| Security & compliance | SE + Security | SOC 2, encryption, access controls |
| Integration capabilities | SE | APIs, webhooks, pre-built integrations |
| Implementation approach | SE + CS | Timeline, methodology, support |
| Pricing | AE + Finance | Pricing model, terms |
| Support & SLA | CS | Support tiers, SLA commitments |
| Roadmap | Product | Future capabilities (carefully) |

---

## 8. Technical Win Criteria

### 8.1 Definition of Technical Win

A "technical win" is achieved when the technical evaluators confirm that ARG-Builder meets their requirements and recommend proceeding with the purchase. This is distinct from the commercial close.

### 8.2 Technical Win Checklist

| Criterion | Verification Method | Status |
|-----------|-------------------|--------|
| Core functionality demonstrated | Demo + POC | — |
| Integration feasibility confirmed | POC or architecture review | — |
| Security requirements met | Security questionnaire + review | — |
| Performance requirements met | POC benchmarks | — |
| Usability validated by end users | POC user feedback | — |
| Technical champion identified | Relationship confirmed | — |
| No blocking technical issues | Issue log clear | — |
| Technical recommendation documented | Written or verbal confirmation | — |

### 8.3 Handoff to Close

| Deliverable | From SE | To AE | Purpose |
|-------------|---------|-------|---------|
| Technical evaluation summary | SE | AE | Document technical win |
| Customer requirements map | SE | AE | Inform proposal |
| Integration architecture | SE | AE + CS | Implementation planning |
| Risk register | SE | AE | Address in negotiation |
| Champion relationship | SE | AE | Leverage for close |
| Competitive positioning | SE | AE | Differentiation in proposal |

---

## 9. SE Tools & Resources

### 9.1 Demo Environment

| Environment | Purpose | Maintenance |
|-------------|---------|-------------|
| Standard demo | General demonstrations | Updated weekly |
| Industry-specific (3 verticals) | Vertical demos | Updated monthly |
| Custom POC environments | Customer-specific | Created per POC |
| Sandbox (self-serve) | Prospect exploration | Always available |

### 9.2 Content Library

| Asset | Purpose | Update Frequency |
|-------|---------|-----------------|
| Security whitepaper | Address security concerns | Quarterly |
| Architecture diagram | Explain technical design | Quarterly |
| Integration guide | Show connectivity | Monthly |
| API documentation | Technical reference | Continuous |
| Competitive battle cards | Counter competitors | Monthly |
| Case studies (technical) | Prove capability | Quarterly |
| ROI calculator | Quantify value | Quarterly |

---

## 10. SE Performance Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Technical win rate | > 75% | Won / (Won + Lost) |
| Demo-to-POC conversion | > 40% | POCs started / demos given |
| POC-to-close conversion | > 70% | Closed / POCs completed |
| Average POC duration | < 25 days | Start to decision |
| Customer satisfaction (demo) | > 4.5/5 | Post-demo survey |
| RFP response time | < 10 business days | Submission date - receipt date |
| Pipeline influenced | > $1.5M/quarter | SE-engaged pipeline |
| Revenue closed (SE-engaged) | > $500K/quarter | Closed-won with SE involvement |
