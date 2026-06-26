# ARG-Builder: Team Communication

## Executive Summary

This document defines ARG-Builder's internal communication system — the cadences, channels, templates, and protocols that keep a fast-growing team aligned, informed, and productive. Effective communication is the operating system of a startup; this playbook ensures information flows efficiently without creating noise or meeting fatigue.

---

## Communication Principles

| Principle | Definition | Application |
|-----------|-----------|-------------|
| **Async-first** | Default to written, async communication | Use Slack/docs before scheduling meetings |
| **Transparency** | Share context broadly, restrict access rarely | Open channels, shared docs, public decisions |
| **Brevity** | Respect attention; be concise | BLUF (Bottom Line Up Front) in all comms |
| **Intentionality** | Every communication has a clear purpose | State: inform, discuss, or decide |
| **Documentation** | Decisions and context are recorded | Meeting notes, decision logs, ADRs |

---

## Communication Channels

| Channel | Purpose | Response SLA | Examples |
|---------|---------|-------------|----------|
| **Slack (async)** | Day-to-day coordination, quick questions | 4 hours (business hours) | Updates, questions, FYIs |
| **Slack (urgent)** | Time-sensitive issues requiring immediate attention | 15 minutes | Production incidents, customer escalations |
| **Email** | External communication, formal internal comms | 24 hours | Customer comms, legal, board updates |
| **Notion/Docs** | Long-form thinking, proposals, documentation | 48 hours (for review requests) | RFCs, specs, meeting notes |
| **Video call** | Complex discussions, relationship building | Scheduled | 1:1s, brainstorms, all-hands |
| **Loom** | Async video updates, demos, walkthroughs | N/A (one-way) | Feature demos, context sharing |

---

## Slack Channel Architecture

| Channel | Purpose | Who | Posting Cadence |
|---------|---------|-----|----------------|
| #general | Company-wide announcements | All | 2–3x/week |
| #wins | Customer wins, team celebrations | All | As they happen |
| #product | Product discussions, feature requests | Product + Eng + Design | Daily |
| #engineering | Technical discussions, code reviews | Engineering | Daily |
| #sales | Deal updates, competitive intel | Sales + Leadership | Daily |
| #customer-success | Customer health, escalations | CS + Product | Daily |
| #marketing | Campaign updates, content | Marketing | Daily |
| #metrics | Automated KPI updates | All (read) | Daily (automated) |
| #incidents | Production issues, status updates | Eng + Leadership | As needed |
| #random | Non-work, team bonding | All | Anytime |
| #leadership | Executive discussions | Leadership team | As needed |
| #hiring | Recruiting updates, referrals | All | As needed |

---

## Meeting Cadence

### Recurring Meetings

| Meeting | Frequency | Duration | Attendees | Purpose | Output |
|---------|-----------|----------|-----------|---------|--------|
| All-Hands | Weekly (Fri) | 30 min | Everyone | Company updates, wins, Q&A | Recording + notes |
| Leadership Sync | Weekly (Mon) | 60 min | Exec team | Strategic alignment, blockers | Decision log |
| Sprint Planning | Bi-weekly (Mon) | 60 min | Product + Eng | Plan next sprint | Sprint backlog |
| Sprint Retro | Bi-weekly (Fri) | 45 min | Product + Eng | Improve process | Action items |
| Sales Standup | Daily (9 AM) | 15 min | Sales team | Pipeline updates, blockers | None (verbal) |
| CS Sync | Weekly (Tue) | 30 min | CS team | Customer health, escalations | Risk register |
| 1:1s | Weekly | 30 min | Manager + report | Coaching, feedback, blockers | Notes in 1:1 doc |
| Board Meeting | Quarterly | 2 hours | Board + Exec | Governance, strategy | Board minutes |

### Meeting Rules

| Rule | Rationale |
|------|-----------|
| No meeting without an agenda (shared 24h before) | Ensures preparation and focus |
| All meetings have a designated note-taker | Captures decisions for absent team members |
| Meetings end with clear action items + owners | Drives accountability |
| 25-minute or 50-minute meetings (not 30/60) | Buffer time between meetings |
| Camera-on for < 8 people, optional for larger | Builds connection without fatigue |
| No-meeting Wednesday afternoons | Protected deep work time |
| Record all-hands and leadership syncs | Async access for different time zones |

---

## Communication Templates

### Weekly Update (Individual → Manager)

| Section | Content | Example |
|---------|---------|---------|
| **Accomplishments** | What I completed this week (3–5 items) | "Shipped search v2, closed 3 deals" |
| **Plan** | What I'm focused on next week (3–5 items) | "Launch email campaign, hire SDR" |
| **Blockers** | What's slowing me down (0–3 items) | "Waiting on legal review for contract" |
| **Metrics** | Key numbers I own | "Pipeline: $450K, Win rate: 28%" |
| **Asks** | What I need from others | "Need intro to [Company] from CEO" |

### Decision Document (RFC)

| Section | Content |
|---------|---------|
| **Title** | Clear, descriptive title |
| **Status** | Draft / In Review / Decided / Superseded |
| **Author** | Who wrote it |
| **Decider** | Who makes the final call |
| **Date needed** | When decision must be made |
| **Context** | Background and why this decision matters now |
| **Options** | 2–4 options with pros/cons |
| **Recommendation** | Author's preferred option with reasoning |
| **Decision** | Final decision + rationale (filled post-decision) |

### Incident Communication

| Severity | Internal Channel | External Channel | Update Frequency |
|----------|-----------------|-----------------|-----------------|
| P0 (Critical) | #incidents + PagerDuty + SMS | Status page + email to affected | Every 15 min |
| P1 (Major) | #incidents + Slack alert | Status page | Every 30 min |
| P2 (Minor) | #incidents | None (unless customer-facing) | Every 2 hours |
| P3 (Low) | #engineering | None | Resolution only |

---

## Information Flow Architecture

### Upward Communication (Team → Leadership)

| Information Type | Channel | Frequency | Format |
|-----------------|---------|-----------|--------|
| Metrics & KPIs | Automated dashboard + #metrics | Daily | Numbers + trend |
| Wins & milestones | #wins + weekly update | As they happen | Brief celebration |
| Blockers & risks | 1:1s + leadership sync | Weekly | Problem + proposed solution |
| Strategic insights | RFC documents | As needed | Structured proposal |
| Customer feedback | CS sync + product channel | Weekly | Themes + quotes |

### Downward Communication (Leadership → Team)

| Information Type | Channel | Frequency | Format |
|-----------------|---------|-----------|--------|
| Company strategy | All-hands + Notion doc | Quarterly (refresh) | Narrative + Q&A |
| Decisions made | #general + decision log | As they happen | Decision + rationale |
| Performance feedback | 1:1s | Weekly (informal), Quarterly (formal) | Conversation + written |
| Company health | All-hands | Weekly | Transparent metrics |
| Changes & announcements | #general + email (if major) | As needed | Context + impact + next steps |

### Cross-functional Communication

| Between | Channel | Purpose | Cadence |
|---------|---------|---------|---------|
| Sales ↔ Product | #product + monthly sync | Feature requests, roadmap | Continuous + monthly |
| CS ↔ Product | #customer-success + weekly sync | Customer feedback, bugs | Continuous + weekly |
| Marketing ↔ Sales | #sales + weekly sync | Leads, content needs, messaging | Continuous + weekly |
| Eng ↔ CS | #incidents + escalation process | Technical issues, customer impact | As needed |

---

## Remote Work Communication Standards

### Availability Expectations

| Time Zone Coverage | Core Hours (overlap) | Flexible Hours | Offline |
|-------------------|---------------------|----------------|---------|
| US-based team | 10 AM – 3 PM ET | 8 AM – 10 AM, 3 PM – 6 PM | Evenings, weekends |
| Distributed team | 11 AM – 2 PM ET (3 hours) | Remaining work hours | Outside work hours |

### Async Communication Best Practices

| Practice | Description |
|----------|-------------|
| BLUF format | Lead with the conclusion/ask, then provide context |
| Thread everything | Keep conversations in threads, not main channel |
| Use reactions | Acknowledge with emoji instead of "thanks" messages |
| Set status | Update Slack status when unavailable/focused |
| Record decisions | Document outcomes in shared docs, not just Slack |
| Time-zone awareness | Don't expect immediate responses outside core hours |

---

## Metrics & Health

### Communication Health Indicators

| Metric | Healthy | Warning | Action Required |
|--------|---------|---------|----------------|
| Meeting hours/week (avg per person) | < 15 hours | 15–20 hours | > 20 hours |
| Slack messages/day (company) | 100–300 | 300–500 | > 500 (noise) |
| Decision cycle time | < 3 days | 3–7 days | > 7 days |
| Meeting NPS (quarterly survey) | > 30 | 0–30 | < 0 |
| Information accessibility score | > 80% | 60–80% | < 60% |
