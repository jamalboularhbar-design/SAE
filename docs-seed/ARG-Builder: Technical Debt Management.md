# ARG-Builder: Technical Debt Management

## Executive Summary

This document defines ARG-Builder's Technical Debt Management framework — the classification system, measurement methodology, prioritization model, and governance processes that ensure technical debt is systematically identified, tracked, and resolved without sacrificing product velocity. Technical debt is inevitable in a fast-growing startup; the key is managing it intentionally rather than letting it accumulate uncontrolled.

---

## Technical Debt Classification

### Debt Categories

| Category | Description | Examples | Typical Impact |
|----------|-------------|----------|---------------|
| **Architecture Debt** | Structural decisions that limit scalability or flexibility | Monolith needing decomposition, tightly coupled services, missing abstraction layers | High (blocks future features) |
| **Code Quality Debt** | Code that works but is hard to maintain or extend | Duplicated code, missing tests, unclear naming, complex functions | Medium (slows development) |
| **Infrastructure Debt** | Operational systems that are fragile or inefficient | Manual deployments, missing monitoring, outdated dependencies | High (reliability risk) |
| **Documentation Debt** | Missing or outdated documentation | Undocumented APIs, stale architecture diagrams, missing runbooks | Low-Medium (onboarding friction) |
| **Testing Debt** | Insufficient test coverage or test quality | Missing integration tests, flaky tests, no E2E coverage | Medium (regression risk) |
| **Security Debt** | Known security issues not yet addressed | Outdated dependencies with CVEs, missing input validation, weak auth | Critical (compliance/breach risk) |
| **UX Debt** | User experience shortcuts that create friction | Inconsistent UI patterns, missing error states, poor mobile experience | Medium (user satisfaction) |
| **Data Debt** | Data model or pipeline issues | Missing indexes, denormalization needs, data quality issues | Medium-High (performance) |

---

## Debt Severity Matrix

### Severity Levels

| Severity | Definition | Resolution SLA | Budget Allocation |
|----------|-----------|---------------|-------------------|
| **Critical (S1)** | Active security vulnerability, data loss risk, or production outage potential | < 7 days | Immediate (interrupt sprint) |
| **High (S2)** | Blocks feature development, causes frequent incidents, or degrades performance significantly | < 30 days | Next sprint |
| **Medium (S3)** | Slows development, creates maintenance burden, or causes minor user friction | < 90 days | Within quarter |
| **Low (S4)** | Cosmetic, minor inefficiency, or "nice to have" improvement | Best effort | When convenient |

### Impact Assessment

| Impact Dimension | Score (1–5) | Definition |
|-----------------|-------------|-----------|
| Development velocity | How much does this slow feature delivery? | 1 = negligible, 5 = blocks all work |
| Reliability risk | How likely is this to cause an incident? | 1 = unlikely, 5 = imminent |
| Security exposure | What is the security/compliance risk? | 1 = none, 5 = critical vulnerability |
| User experience | How much does this impact users? | 1 = invisible, 5 = major friction |
| Scalability | Will this break at 10x current load? | 1 = fine at 100x, 5 = breaks at 2x |
| Onboarding friction | Does this slow new engineer productivity? | 1 = no impact, 5 = major blocker |

---

## Measurement & Tracking

### Debt Inventory

| Field | Description | Example |
|-------|-------------|---------|
| ID | Unique identifier | TD-2026-042 |
| Title | Brief description | "Refactor user authentication to support SSO" |
| Category | From classification above | Architecture Debt |
| Severity | S1–S4 | S2 (High) |
| Impact score | Composite (1–30) | 22/30 |
| Estimated effort | Engineering days to resolve | 8 days |
| Owner | Responsible engineer/team | Platform Team |
| Created date | When identified | 2026-03-15 |
| Target resolution | When it should be resolved | 2026-06-30 |
| Status | Open, In Progress, Resolved, Deferred | Open |
| Dependencies | Other work that depends on or blocks this | Blocks: SSO feature, Multi-tenant |
| Business justification | Why this matters to the business | "Required for enterprise customers, SOC 2 compliance" |

### Debt Metrics (Tracked Monthly)

| Metric | Definition | Target | Red Flag |
|--------|-----------|--------|----------|
| Total debt items | Count of open debt items | < 50 | > 100 |
| Critical/High items | Count of S1 + S2 items | < 10 | > 20 |
| Debt age (average) | Average days since creation | < 60 days | > 120 days |
| Debt resolved/month | Items closed per month | > 5 | < 2 |
| Debt created/month | New items identified per month | Stable or declining | Accelerating |
| Debt ratio | % of sprint capacity spent on debt | 15–25% | < 10% or > 40% |
| Code coverage | % of codebase with automated tests | > 80% | < 60% |
| Dependency freshness | % of dependencies within 2 major versions | > 90% | < 70% |

---

## Budget Allocation

### Sprint Capacity Model

| Allocation | % of Sprint | Purpose | Governance |
|-----------|-------------|---------|-----------|
| Feature development | 60–70% | New capabilities, customer requests | Product roadmap |
| Technical debt | 15–25% | Systematic debt reduction | Engineering leadership |
| Bug fixes | 5–10% | Production issues, customer-reported bugs | Support escalation |
| Innovation/exploration | 5–10% | Spikes, prototypes, learning | Engineering discretion |

### Quarterly Debt Budget

| Quarter | Debt Budget (Engineering Days) | Focus Areas |
|---------|-------------------------------|-------------|
| Q1 | 20% of capacity (~25 days for 5-person team) | Security debt, testing debt |
| Q2 | 20% of capacity | Architecture debt, infrastructure |
| Q3 | 15% of capacity (feature push) | Code quality, documentation |
| Q4 | 25% of capacity (stability focus) | All categories, year-end cleanup |

---

## Prioritization Framework

### RICE-D Score (Modified RICE for Debt)

| Factor | Weight | Scale | Definition |
|--------|--------|-------|-----------|
| **R**isk reduction | 30% | 1–10 | How much does resolving this reduce operational/security risk? |
| **I**mpact on velocity | 25% | 1–10 | How much faster will the team move after resolution? |
| **C**ustomer impact | 20% | 1–10 | How much does this affect customer experience? |
| **E**ffort (inverse) | 15% | 1–10 | How easy is this to resolve? (10 = trivial, 1 = massive) |
| **D**ependency unlock | 10% | 1–10 | How many other items does this unblock? |

### Priority Score Calculation

> **Priority Score = (R × 0.30) + (I × 0.25) + (C × 0.20) + (E × 0.15) + (D × 0.10)**

| Score Range | Priority | Action |
|-------------|----------|--------|
| 8.0–10.0 | P0 — Immediate | Interrupt current sprint |
| 6.0–7.9 | P1 — Next sprint | Schedule for next sprint |
| 4.0–5.9 | P2 — This quarter | Include in quarterly planning |
| 2.0–3.9 | P3 — Backlog | Track, address when convenient |
| 0–1.9 | P4 — Monitor | May not need resolution |

---

## Governance Process

### Monthly Debt Review

| Activity | Duration | Participants | Output |
|----------|----------|-------------|--------|
| Debt inventory review | 30 min | Engineering leads | Updated inventory, new items added |
| Priority re-scoring | 15 min | Engineering leads + Product | Updated priorities |
| Sprint allocation decision | 15 min | Engineering leads | Next month's debt budget and focus |
| Metrics review | 15 min | VP Engineering | Health check on debt trends |

### Quarterly Debt Planning

| Activity | Duration | Participants | Output |
|----------|----------|-------------|--------|
| Debt audit (full inventory) | 2 hours | All engineers | Complete, accurate inventory |
| Architecture review | 2 hours | Senior engineers + CTO | Architecture debt assessment |
| Dependency audit | 1 hour | DevOps + Security | Outdated/vulnerable dependencies |
| Quarterly debt roadmap | 1 hour | Engineering leads + Product | Committed debt reduction plan |

### Debt Prevention Practices

| Practice | Implementation | Frequency |
|----------|---------------|-----------|
| Code review standards | All PRs reviewed, debt-creating patterns flagged | Every PR |
| Architecture Decision Records (ADRs) | Document decisions and known trade-offs | Every significant decision |
| Definition of Done includes debt check | "Does this create technical debt? If yes, log it." | Every feature |
| Refactoring Fridays | Last Friday of month dedicated to small improvements | Monthly |
| Dependency update automation | Dependabot/Renovate for automated dependency PRs | Continuous |
| Static analysis | SonarQube/ESLint rules enforced in CI | Every commit |

---

## Debt Reduction Strategies

### Strategy by Category

| Category | Strategy | Timeline | Success Metric |
|----------|----------|----------|---------------|
| Architecture | Strangler fig pattern (incremental migration) | 6–12 months | % of traffic on new architecture |
| Code Quality | Boy Scout Rule + dedicated refactoring sprints | Ongoing | Cyclomatic complexity trending down |
| Infrastructure | Infrastructure-as-Code migration | 3–6 months | % of infra managed by IaC |
| Documentation | Doc-a-thon events + docs-as-code | Ongoing | % of APIs documented |
| Testing | Coverage targets + test-first for new code | 3–6 months | Coverage % increasing monthly |
| Security | Automated scanning + quarterly pen tests | Ongoing | 0 critical/high CVEs open > 7 days |
| UX | Design system adoption + pattern library | 6–12 months | % of UI using design system |
| Data | Schema migration plan + index optimization | 3–6 months | Query performance P95 < 200ms |

---

## Communication & Transparency

### Stakeholder Communication

| Audience | What They Need to Know | Format | Frequency |
|----------|----------------------|--------|-----------|
| CEO/Board | Debt level, risk, investment needed | Executive summary (1 page) | Quarterly |
| Product team | How debt affects feature velocity | Velocity impact report | Monthly |
| Engineering team | Current inventory, priorities, progress | Team dashboard | Real-time |
| Customer Success | How debt affects customer experience | Impact summary | As needed |

### Debt Dashboard (Engineering)

| Widget | Content | Update Frequency |
|--------|---------|-----------------|
| Total open items (by severity) | Bar chart: S1/S2/S3/S4 | Real-time |
| Debt trend (12-month) | Line chart: created vs. resolved | Weekly |
| Debt ratio | Gauge: % of sprint on debt | Per sprint |
| Top 10 priority items | Table: ranked by RICE-D score | Weekly |
| Category breakdown | Pie chart: items by category | Monthly |
| Average resolution time | Line chart: days to resolve | Monthly |

---

*Document prepared by Manus AI for ARG-Builder engineering operations.*
