# ARG-Builder: Engineering Hiring Technical Assessments

## Structured Framework for Evaluating Technical Talent with Rigor and Fairness

---

## 1. Executive Summary

Technical assessments determine whether engineering candidates can perform the actual work required. Poorly designed assessments waste candidate time, introduce bias, and miss great talent. Well-designed assessments predict job performance, respect candidate time, and create a positive experience regardless of outcome. This document defines ARG-Builder's complete technical assessment system across all engineering roles.

---

## 2. Assessment Philosophy

### 2.1 Core Principles

| Principle | Implementation | Anti-Pattern |
|-----------|---------------|-------------|
| Job relevance | Assess skills used daily in the role | Whiteboard algorithms unrelated to work |
| Time respect | < 4 hours total candidate investment | 8-hour take-homes, 6-round interviews |
| Bias reduction | Structured rubrics, diverse panels | Gut feel, culture fit as proxy |
| Candidate experience | Clear expectations, timely feedback | Ghosting, unclear process |
| Signal quality | Multiple data points, calibrated scoring | Single interviewer veto |
| Transparency | Share evaluation criteria upfront | Secret scoring, trick questions |
| Two-way evaluation | Candidates assess us too | One-sided interrogation |

### 2.2 Assessment Pipeline

| Stage | Duration | Purpose | Pass Rate |
|-------|----------|---------|-----------|
| Resume screen | 5 min | Basic qualification check | 20–30% |
| Recruiter call | 30 min | Mutual fit, logistics, expectations | 70% |
| Technical screen | 45–60 min | Core technical competency | 40–50% |
| Take-home OR live coding | 2–3 hours | Practical problem-solving | 50–60% |
| System design (senior+) | 60 min | Architecture and trade-off thinking | 50% |
| Team/culture fit | 45 min | Collaboration, values alignment | 80% |
| Hiring committee | 30 min | Final decision, calibration | 60–70% |

---

## 3. Assessment by Role

### 3.1 Frontend Engineer

| Stage | Focus | Format | Duration |
|-------|-------|--------|----------|
| Technical screen | JavaScript fundamentals, React concepts, CSS | Live coding (pair programming) | 45 min |
| Practical assessment | Build a small UI component from spec | Take-home OR live session | 2 hours |
| System design (senior) | Frontend architecture, state management, performance | Whiteboard/discussion | 45 min |
| Code review | Review a PR with intentional issues | Discussion | 30 min |

**Frontend Assessment Rubric:**

| Dimension | 1 (Below) | 2 (Meets) | 3 (Exceeds) |
|-----------|-----------|-----------|-------------|
| React proficiency | Basic hooks only, class components | Hooks, context, custom hooks, patterns | Advanced patterns, performance optimization |
| CSS/styling | Basic styles, layout struggles | Flexbox/Grid, responsive, Tailwind | Complex animations, design systems |
| TypeScript | Basic types | Generics, utility types, strict mode | Advanced type gymnastics, type-safe patterns |
| Testing | No tests | Unit tests, basic integration | E2E, accessibility testing, TDD |
| Performance | No awareness | Basic optimization (memo, lazy) | Profiling, bundle analysis, Core Web Vitals |

### 3.2 Backend Engineer

| Stage | Focus | Format | Duration |
|-------|-------|--------|----------|
| Technical screen | Data structures, API design, SQL | Live coding | 45 min |
| Practical assessment | Build a small API endpoint with tests | Take-home OR live session | 2–3 hours |
| System design (senior) | Distributed systems, scalability, data modeling | Whiteboard/discussion | 60 min |
| Debugging exercise | Debug a failing service with logs | Live exercise | 30 min |

**Backend Assessment Rubric:**

| Dimension | 1 (Below) | 2 (Meets) | 3 (Exceeds) |
|-----------|-----------|-----------|-------------|
| API design | Inconsistent, no error handling | RESTful, proper status codes, validation | Versioning, pagination, rate limiting, docs |
| Database | Basic queries | Joins, indexes, migrations, transactions | Query optimization, sharding, replication |
| System design | Single server thinking | Horizontal scaling, caching, queues | Distributed systems, CAP trade-offs |
| Testing | No tests | Unit + integration tests | Contract tests, load tests, chaos engineering |
| Security | No awareness | Input validation, auth, OWASP basics | Threat modeling, encryption, zero-trust |

### 3.3 ML/AI Engineer

| Stage | Focus | Format | Duration |
|-------|-------|--------|----------|
| Technical screen | ML fundamentals, Python, statistics | Discussion + coding | 60 min |
| Practical assessment | Improve a model or build a pipeline | Take-home (dataset provided) | 3 hours |
| System design | ML system architecture, serving, monitoring | Whiteboard/discussion | 60 min |
| Research discussion | Paper review, approach trade-offs | Discussion | 30 min |

**ML Assessment Rubric:**

| Dimension | 1 (Below) | 2 (Meets) | 3 (Exceeds) |
|-----------|-----------|-----------|-------------|
| ML fundamentals | Textbook only | Applied ML, model selection, evaluation | Novel approaches, research awareness |
| LLM/NLP | Basic API usage | Prompt engineering, fine-tuning, RAG | Custom architectures, evaluation frameworks |
| Engineering | Scripts only | Production code, testing, CI/CD | ML pipelines, monitoring, A/B testing |
| Data | Basic pandas | Feature engineering, data quality | Large-scale data, streaming, versioning |
| Communication | Can't explain approach | Clear explanation of trade-offs | Teaches others, writes documentation |

### 3.4 SRE/Platform Engineer

| Stage | Focus | Format | Duration |
|-------|-------|--------|----------|
| Technical screen | Linux, networking, cloud, scripting | Discussion + practical | 45 min |
| Practical assessment | Debug a production issue (simulated) | Live exercise | 60 min |
| System design | Infrastructure architecture, reliability | Whiteboard/discussion | 60 min |
| Incident response | Walk through incident handling | Scenario discussion | 30 min |

---

## 4. Take-Home vs. Live Coding

### 4.1 Comparison

| Factor | Take-Home | Live Coding |
|--------|-----------|-------------|
| Time pressure | Low (own pace) | High (real-time) |
| Environment | Candidate's own setup | Unfamiliar environment |
| Anxiety impact | Lower | Higher |
| Cheating risk | Higher | Lower |
| Signal quality | Higher (more natural work) | Lower (artificial pressure) |
| Scheduling | Flexible | Requires coordination |
| Candidate preference | Generally preferred | Some prefer (faster process) |
| Bias | Lower (anonymous review possible) | Higher (appearance, communication style) |

### 4.2 ARG-Builder Approach

| Role Level | Recommended Format | Rationale |
|-----------|-------------------|-----------|
| Junior (0–2 years) | Live coding (pair programming) | Mentoring signal, less intimidating with support |
| Mid (3–5 years) | Candidate choice (take-home OR live) | Respect preference, both valid |
| Senior (5+ years) | Take-home + system design discussion | Deeper signal, respects experience |
| Staff+ (8+ years) | Architecture discussion + code review | No coding exercise needed |

### 4.3 Take-Home Guidelines

| Guideline | Requirement |
|-----------|-------------|
| Time limit | Maximum 3 hours (stated clearly) |
| Deadline | 5–7 days to complete (flexible) |
| Scope | Well-defined, achievable in time limit |
| Evaluation | Blind review (name removed) |
| Compensation | $200 gift card for completed submissions |
| Feedback | Written feedback regardless of outcome |
| Reuse | Never reuse candidate's work |

---

## 5. Scoring & Calibration

### 5.1 Scoring Framework

| Score | Definition | Hiring Signal |
|-------|-----------|--------------|
| 1 — Strong No | Significant gaps, would struggle in role | Do not hire |
| 2 — Lean No | Some gaps, concerns about performance | Do not hire (unless other signals very strong) |
| 3 — Lean Yes | Meets bar, some areas to develop | Hire (with development plan) |
| 4 — Strong Yes | Exceeds bar, would thrive immediately | Definitely hire |

### 5.2 Evaluation Dimensions

| Dimension | Weight | What to Assess |
|-----------|--------|---------------|
| Technical skills | 35% | Can they do the technical work? |
| Problem-solving | 25% | How do they approach ambiguity? |
| Communication | 15% | Can they explain their thinking? |
| Collaboration | 15% | How do they work with others? |
| Growth potential | 10% | Will they grow in the role? |

### 5.3 Calibration Process

| Activity | Frequency | Purpose |
|----------|-----------|---------|
| Interviewer training | Before first interview | Consistent evaluation standards |
| Shadow interviews | First 3 interviews | Learn from experienced interviewers |
| Calibration sessions | Monthly | Align scoring across interviewers |
| Scorecard review | Quarterly | Identify scoring drift |
| Outcome tracking | Semi-annually | Correlate scores with job performance |

---

## 6. Bias Reduction

### 6.1 Structural Bias Mitigation

| Bias Type | Mitigation |
|-----------|-----------|
| Affinity bias | Diverse interview panels, structured questions |
| Halo effect | Score each dimension independently |
| Anchoring | Write feedback before discussing with others |
| Confirmation bias | Standardized rubrics, blind code review |
| Recency bias | Take notes during interview, score immediately |
| Attribution bias | Focus on demonstrated behavior, not assumptions |

### 6.2 Process Safeguards

| Safeguard | Implementation |
|-----------|---------------|
| Structured interviews | Same questions for all candidates at same level |
| Blind resume review | Remove name, photo, school for initial screen |
| Blind code review | Remove identifying information from take-homes |
| Diverse panels | At least one interviewer from underrepresented group |
| Independent scoring | Score before debrief discussion |
| Data tracking | Monitor pass rates by demographic |
| Regular audits | Quarterly review of assessment fairness |

---

## 7. Candidate Experience

### 7.1 Communication Standards

| Touchpoint | Timeline | Content |
|-----------|----------|---------|
| Application acknowledgment | < 24 hours | Confirmation + timeline |
| Screen scheduling | < 3 business days | Calendar invite + prep materials |
| Post-screen decision | < 48 hours | Pass/fail + next steps |
| Take-home instructions | Clear, comprehensive | Problem, expectations, time limit, deadline |
| Interview day prep | 3 days before | Schedule, interviewers, topics, logistics |
| Final decision | < 5 business days | Offer or rejection with feedback |
| Rejection feedback | With decision | Specific, constructive, actionable |

### 7.2 Candidate Prep Materials

| Material | Content | When Shared |
|----------|---------|-------------|
| Interview guide | Process overview, what to expect | After recruiter screen |
| Technical prep | Topics covered, recommended resources | 5 days before technical |
| Company overview | Product, culture, team, tech stack | With interview invite |
| Interviewer bios | Who they'll meet, roles, backgrounds | 3 days before onsite |
| FAQ | Common questions, logistics, dress code | With interview invite |

---

## 8. Hiring Committee

### 8.1 Committee Structure

| Role | Responsibility | Vote Weight |
|------|---------------|-------------|
| Hiring manager | Final decision authority, context | Deciding vote |
| Technical interviewer(s) | Technical assessment | Equal vote |
| Cross-functional interviewer | Collaboration, culture | Equal vote |
| Recruiter | Process, candidate experience, market context | Advisory (no vote) |
| Bar raiser (senior engineer) | Maintain hiring bar consistency | Veto power (rare) |

### 8.2 Decision Framework

| Scenario | Decision | Action |
|----------|----------|--------|
| All Strong Yes | Hire | Make offer immediately |
| Majority Lean Yes, no Strong No | Hire | Make offer |
| Mixed (Yes + No) | Discuss | Additional data point or pass |
| Any Strong No (with evidence) | Pass | Decline with feedback |
| All Lean No | Pass | Decline with feedback |
| Insufficient signal | Additional round | One more focused interview |

### 8.3 Debrief Protocol

| Rule | Rationale |
|------|-----------|
| Written feedback submitted before debrief | Prevent anchoring |
| Hiring manager speaks last | Prevent authority bias |
| Focus on evidence, not feelings | Reduce gut-feel decisions |
| Disagree and commit | Once decided, support the decision |
| Document decision rationale | Learning and accountability |

---

## 9. Assessment Maintenance

### 9.1 Question Bank Management

| Activity | Frequency | Owner |
|----------|-----------|-------|
| Add new questions | Monthly | Engineering team |
| Retire leaked/overused questions | Quarterly | Recruiting + Engineering |
| Validate question difficulty | Semi-annually | Calibration data |
| Update for tech stack changes | As needed | Engineering leads |
| Candidate feedback integration | Monthly | Recruiting |

### 9.2 Quality Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Candidate satisfaction (NPS) | > 50 | Post-interview survey |
| Time-to-decision | < 2 weeks (screen to offer) | ATS tracking |
| Offer acceptance rate | > 80% | ATS tracking |
| 90-day retention | > 95% | HR data |
| Performance correlation | > 0.6 | Score vs. performance review |
| Interviewer consistency | < 0.5 std dev across interviewers | Calibration analysis |
| Diversity of hires | Matches pipeline diversity | Demographic tracking |

---

## 10. Legal & Compliance

### 10.1 Assessment Compliance

| Requirement | Implementation |
|-------------|---------------|
| Job-relatedness | All assessments tied to actual job duties |
| Consistency | Same process for all candidates at same level |
| Accommodation | Alternative formats for disabilities |
| Data retention | Assessment data retained per policy (2 years) |
| Non-discrimination | No questions about protected characteristics |
| Compensation | Paid for take-home assessments (> 2 hours) |
| IP clarity | Candidate retains IP of assessment work |
| Feedback | Constructive feedback available on request |
