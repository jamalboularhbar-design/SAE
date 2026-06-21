# ARG-Builder: Engineering Culture & Technical Standards

## Executive Summary

This document defines ARG-Builder's engineering culture, technical standards, and development practices. Engineering is the engine that transforms product vision into customer value. Our engineering culture prioritizes craft, velocity, and reliability in equal measure — we ship fast without cutting corners, we build systems that scale, and we maintain a codebase that new engineers can understand in their first week.

---

## Engineering Principles

### 1. Ship Small, Ship Often

Large releases are risky, slow, and demoralizing. We deploy to production multiple times per day behind feature flags. Every PR should be reviewable in under 30 minutes. If a feature takes more than 3 days to build, it needs to be broken down further.

### 2. Boring Technology Wins

We choose proven, well-documented technologies over cutting-edge alternatives. Every new technology added to the stack must justify its complexity cost. The best infrastructure is invisible — it works reliably and nobody thinks about it.

### 3. Tests Are Not Optional

Untested code is broken code that has not been caught yet. We maintain > 80% test coverage on critical paths. Tests are written alongside code, not after. If you cannot test it, you cannot ship it.

### 4. Documentation Is Code

Architecture decisions, API contracts, and system behaviors are documented as rigorously as they are coded. Documentation lives next to the code it describes and is updated in the same PR.

### 5. Own Your Service

The team that builds it, runs it. There is no "throw it over the wall to ops" culture. Engineers are responsible for the reliability, performance, and cost of their services in production.

---

## Technical Standards

### Code Quality

| Standard | Requirement | Enforcement |
|----------|-------------|-------------|
| Linting | ESLint (strict config) + Prettier | CI/CD gate |
| Type safety | TypeScript strict mode, no `any` | CI/CD gate |
| Test coverage | > 80% on critical paths, > 60% overall | CI/CD gate |
| PR size | < 400 lines changed (excluding generated code) | Review policy |
| Review turnaround | < 4 hours during business hours | Team agreement |
| Documentation | All public APIs documented, ADRs for decisions | Review checklist |
| Security | No secrets in code, dependency scanning | CI/CD gate + Snyk |
| Performance | Core Web Vitals passing, API p95 < 200ms | Monitoring alerts |

### Code Review Standards

| Aspect | Reviewer Checks |
|--------|----------------|
| Correctness | Does it do what it claims? Edge cases handled? |
| Clarity | Can a new team member understand this in 5 minutes? |
| Simplicity | Is there a simpler way to achieve the same result? |
| Testing | Are the tests meaningful? Do they cover failure cases? |
| Security | Input validation? Authentication? Authorization? |
| Performance | N+1 queries? Unbounded loops? Memory leaks? |
| Documentation | Updated README? API docs? ADR if architectural? |

### Architecture Decision Records (ADRs)

Every significant technical decision is documented in an ADR. ADRs are immutable once accepted — new decisions create new ADRs that supersede previous ones.

| Section | Content |
|---------|---------|
| Title | Short descriptive title |
| Status | Proposed / Accepted / Deprecated / Superseded |
| Context | What is the situation? What forces are at play? |
| Decision | What did we decide? |
| Consequences | What are the trade-offs? What do we gain and lose? |
| Alternatives | What else did we consider? Why did we reject them? |

---

## Development Workflow

### Git Workflow

| Practice | Standard |
|----------|----------|
| Branching | Trunk-based development (short-lived feature branches) |
| Branch naming | `type/description` (e.g., `feat/search-filters`, `fix/auth-timeout`) |
| Commits | Conventional commits (feat:, fix:, docs:, refactor:, test:) |
| PRs | Squash merge to main, descriptive PR title |
| Releases | Continuous deployment via feature flags |
| Rollback | One-click rollback via deployment platform |

### CI/CD Pipeline

| Stage | Tools | Gate Criteria |
|-------|-------|---------------|
| Build | GitHub Actions | Compiles without errors |
| Lint | ESLint + Prettier | Zero violations |
| Type Check | TypeScript compiler | Zero errors |
| Unit Tests | Vitest | All pass, coverage threshold met |
| Integration Tests | Playwright | All critical paths pass |
| Security Scan | Snyk + CodeQL | No critical/high vulnerabilities |
| Deploy (Staging) | Vercel/Railway preview | Automatic on PR |
| Deploy (Production) | Vercel/Railway | Automatic on merge to main |
| Smoke Tests | Custom health checks | All endpoints responding |

### Feature Flags

All new features ship behind feature flags. This enables:

| Benefit | Implementation |
|---------|---------------|
| Gradual rollout | 1% → 10% → 50% → 100% over days |
| Instant rollback | Disable flag without code deployment |
| A/B testing | Measure impact before full release |
| Customer-specific | Enable for beta customers first |
| Kill switch | Disable problematic features immediately |

---

## Engineering Career Ladder

### Individual Contributor Track

| Level | Title | Years | Scope | Compensation |
|-------|-------|-------|-------|--------------|
| IC1 | Software Engineer | 0–2 | Tasks within a feature | $90K–$120K |
| IC2 | Senior Software Engineer | 2–5 | Features end-to-end | $130K–$170K |
| IC3 | Staff Engineer | 5–8 | System-level impact | $170K–$220K |
| IC4 | Principal Engineer | 8+ | Company-wide technical direction | $220K–$280K |

### Management Track

| Level | Title | Reports | Scope | Compensation |
|-------|-------|---------|-------|--------------|
| M1 | Engineering Manager | 4–7 | Single team | $150K–$190K |
| M2 | Senior Engineering Manager | 2–3 teams | Multiple teams | $180K–$230K |
| M3 | Director of Engineering | Department | Engineering org | $220K–$270K |
| M4 | VP Engineering | All engineering | Company-wide | $260K–$350K |

### Level Expectations

| Dimension | IC1 | IC2 | IC3 | IC4 |
|-----------|-----|-----|-----|-----|
| Scope | Task | Feature | System | Organization |
| Autonomy | Guided | Independent | Self-directed | Sets direction |
| Influence | Team | Team + adjacent | Engineering org | Company |
| Complexity | Known problems | Ambiguous problems | Novel problems | Undefined problems |
| Mentoring | Receives | Gives to IC1 | Gives to IC1–IC2 | Gives to all levels |

---

## Technical Debt Management

### Debt Classification

| Class | Description | Example | Action |
|-------|-------------|---------|--------|
| Critical | Actively causing bugs or security issues | Unpatched vulnerability | Fix immediately |
| High | Slowing development significantly | Monolithic module that needs splitting | Scheduled sprint work |
| Medium | Causes friction but workarounds exist | Inconsistent API patterns | 20% time allocation |
| Low | Cosmetic or minor inefficiency | Unused imports, old comments | Fix opportunistically |

### Debt Budget

20% of engineering capacity is allocated to technical debt reduction. This is non-negotiable and tracked as a team metric.

| Quarter | Debt Budget | Focus Area |
|---------|-------------|------------|
| Q1 | 20% | Foundation (testing, CI/CD, monitoring) |
| Q2 | 20% | Performance (query optimization, caching) |
| Q3 | 20% | Architecture (service boundaries, APIs) |
| Q4 | 20% | Developer experience (tooling, documentation) |

---

## On-Call & Incident Management

### On-Call Rotation

| Policy | Standard |
|--------|----------|
| Rotation | Weekly, shared across team |
| Compensation | $500/week on-call bonus |
| Response time | 15 minutes for P1, 1 hour for P2 |
| Escalation | Auto-escalate if no response in 2x response time |
| Handoff | Written handoff document at rotation change |
| Post-incident | Blameless retrospective within 48 hours |

### Incident Severity

| Severity | Definition | Response | Communication |
|----------|-----------|----------|---------------|
| P1 (Critical) | Service down, data loss, security breach | All hands, 15-min response | Customer + stakeholder notification |
| P2 (Major) | Degraded service, major feature broken | On-call + team lead, 1-hr response | Internal notification |
| P3 (Minor) | Minor feature broken, workaround exists | On-call, next business day | Ticket created |
| P4 (Low) | Cosmetic issue, no user impact | Backlog | No notification |

---

## Engineering Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| Deployment frequency | Deploys to production per day | > 3 |
| Lead time | Commit to production | < 4 hours |
| Change failure rate | % of deploys causing incidents | < 5% |
| Mean time to recovery (MTTR) | Time from incident to resolution | < 30 minutes |
| Code review turnaround | Time from PR opened to first review | < 4 hours |
| Test coverage (critical paths) | % of critical code covered by tests | > 80% |
| Technical debt ratio | % of sprint capacity on debt | 20% (± 5%) |
| Developer satisfaction | Quarterly survey score | > 4/5 |

---

*Document prepared by Manus AI for ARG-Builder engineering operations.*
