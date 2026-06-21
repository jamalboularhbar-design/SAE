# ARG-Builder: Company Wiki & Knowledge Base Structure

## Executive Summary

This document defines ARG-Builder's internal knowledge management architecture — the information hierarchy, content standards, ownership model, and governance processes that ensure institutional knowledge is captured, organized, and accessible to every team member. A well-structured company wiki eliminates knowledge silos, accelerates onboarding, reduces repetitive questions, and creates a single source of truth for how the company operates.

---

## Information Architecture

### Top-Level Structure

| Space | Purpose | Audience | Owner |
|-------|---------|----------|-------|
| **Company** | Mission, values, policies, org chart, all-hands | Everyone | People/CEO |
| **Product** | Roadmap, specs, research, design, analytics | Product + Engineering | VP Product |
| **Engineering** | Architecture, standards, runbooks, ADRs | Engineering | VP Engineering |
| **Sales** | Playbooks, battle cards, pricing, proposals | Sales + Revenue | VP Sales |
| **Marketing** | Brand, content calendar, campaigns, assets | Marketing | VP Marketing |
| **Customer Success** | Onboarding, health scores, playbooks, QBRs | CS + Support | VP CS |
| **Finance** | Budget, forecasts, policies, vendor management | Finance + Leadership | VP Finance |
| **People & Culture** | Handbook, benefits, hiring, performance | Everyone | VP People |
| **Operations** | Processes, tools, security, compliance | Everyone | VP Operations |
| **Leadership** | Board materials, strategy, OKRs, decisions | Leadership team | CEO |

---

## Content Hierarchy (Per Space)

### Standard Page Types

| Page Type | Purpose | Template | Review Cycle |
|-----------|---------|----------|-------------|
| **Overview** | Space introduction, navigation guide | Space overview template | Quarterly |
| **Policy** | Official company policies and procedures | Policy template | Annually |
| **Process** | Step-by-step operational procedures | Process template | Semi-annually |
| **Reference** | Lookup information (contacts, tools, links) | Reference template | Monthly |
| **Decision Record** | Documented decisions with context and rationale | ADR/Decision template | Never (immutable) |
| **Meeting Notes** | Recurring meeting documentation | Meeting notes template | Per meeting |
| **How-To Guide** | Task-specific instructions | How-to template | As needed |
| **FAQ** | Frequently asked questions and answers | FAQ template | Monthly |
| **Runbook** | Incident response and operational procedures | Runbook template | Quarterly |

---

## Detailed Space Structures

### Company Space

| Section | Pages | Owner |
|---------|-------|-------|
| About Us | Mission, Vision, Values, History, Founding Story | CEO |
| Organization | Org chart, Team directory, Roles & responsibilities | People |
| Policies | Code of conduct, Remote work, Travel, Expense | People |
| Communication | Meeting norms, Slack guidelines, Email standards | Operations |
| All-Hands | Meeting notes archive, recordings, Q&A | CEO |
| Onboarding | New hire guide, 30-60-90 plan, Tool access | People |

### Product Space

| Section | Pages | Owner |
|---------|-------|-------|
| Strategy | Product vision, Annual roadmap, Quarterly goals | VP Product |
| Roadmap | Current quarter, Next quarter, Backlog, Icebox | PM |
| Specifications | PRDs (by feature), Technical specs, API docs | PM + Engineering |
| Research | User research findings, Competitive analysis, Market data | Product Research |
| Design | Design system, Component library, Figma links, Brand guidelines | Design |
| Analytics | Dashboards, Metric definitions, Experiment results | Product Analytics |
| Releases | Release notes archive, Changelog, Feature flags | PM |

### Engineering Space

| Section | Pages | Owner |
|---------|-------|-------|
| Architecture | System overview, Service map, Data flow, ADRs | CTO/Staff Engineers |
| Standards | Code style, Review guidelines, Testing standards, Git workflow | Engineering Leads |
| Infrastructure | Cloud architecture, Deployment process, Monitoring, Alerts | DevOps/SRE |
| Runbooks | Incident response, Service restart, Database operations, Rollback | On-call team |
| Onboarding | Dev environment setup, Codebase tour, First PR guide | Engineering Leads |
| Technical Debt | Debt inventory, Priority list, Resolution plans | Engineering Leads |
| Security | Security policies, Vulnerability management, Pen test results | Security |

### Sales Space

| Section | Pages | Owner |
|---------|-------|-------|
| Playbooks | Sales process, Discovery calls, Demo script, Closing | Sales Enablement |
| Competitive | Battle cards, Win/loss analysis, Competitor profiles | Product Marketing |
| Pricing | Pricing guide, Discount authority, Deal desk process | Revenue Ops |
| Collateral | One-pagers, Case studies, ROI calculator, Proposals | Marketing |
| Training | Onboarding curriculum, Product training, Objection handling | Sales Enablement |
| Metrics | Quota tracker, Pipeline dashboard, Forecast methodology | Revenue Ops |

---

## Content Standards

### Writing Guidelines

| Principle | Standard | Example |
|-----------|----------|---------|
| Clarity | Write at 8th-grade reading level, avoid jargon | "Send the customer an email" not "Initiate client correspondence" |
| Brevity | Maximum 500 words per page section | Break long content into sub-pages |
| Actionability | Start with what the reader needs to DO | Lead with steps, not background |
| Currency | Include "Last updated" date on every page | Auto-generated via wiki platform |
| Ownership | Every page has a named owner | Displayed in page metadata |
| Findability | Use consistent naming, tags, and cross-links | Standardized title formats |

### Page Template (Standard)

| Section | Required | Content |
|---------|----------|---------|
| Title | Yes | Clear, descriptive, follows naming convention |
| Status | Yes | Draft / Current / Under Review / Deprecated |
| Owner | Yes | Named individual responsible for accuracy |
| Last updated | Yes | Date of last meaningful update |
| Summary | Yes | 1–2 sentence overview (what and why) |
| Body | Yes | Main content (follows page type template) |
| Related pages | Recommended | Cross-links to relevant content |
| Tags | Recommended | Categorization for search |
| Changelog | Optional | History of significant changes |

---

## Governance Model

### Content Lifecycle

| Stage | Action | Responsibility | Timeline |
|-------|--------|---------------|----------|
| Creation | Write and publish new content | Any team member | As needed |
| Review | Verify accuracy and completeness | Page owner | Per review cycle |
| Update | Revise outdated content | Page owner or delegate | When triggered |
| Deprecation | Mark as outdated, redirect to replacement | Page owner | When superseded |
| Archival | Move to archive space | Wiki admin | 6 months after deprecation |
| Deletion | Permanently remove | Wiki admin (with approval) | 12 months after archival |

### Review Cadence

| Content Type | Review Frequency | Trigger for Ad-Hoc Review |
|-------------|-----------------|--------------------------|
| Policies | Annually | Regulation change, incident |
| Processes | Semi-annually | Tool change, reorg, feedback |
| References | Monthly | New hires, tool changes |
| Runbooks | Quarterly | Post-incident review |
| Meeting notes | Never (immutable) | — |
| Decision records | Never (immutable) | — |

### Ownership Rules

| Rule | Implementation |
|------|---------------|
| Every page has one owner | Displayed in metadata, enforced by platform |
| Owner departures trigger reassignment | Part of offboarding checklist |
| Orphaned pages flagged automatically | Monthly report to space admins |
| Ownership = accountability for accuracy | Part of performance expectations |
| Delegation allowed with notification | Owner can assign reviewer |

---

## Search & Discovery

### Search Optimization

| Strategy | Implementation |
|----------|---------------|
| Consistent naming conventions | [Space] - [Type] - [Topic] format |
| Tag taxonomy | Standardized tags per space |
| Cross-linking | Related pages linked in every document |
| Aliases | Common search terms mapped to official pages |
| Featured pages | Pinned content for each space |
| Recent updates feed | Dashboard showing latest changes |

### Navigation Patterns

| Pattern | Use Case | Implementation |
|---------|----------|---------------|
| Space home pages | Entry point for each team | Overview + quick links |
| Breadcrumbs | Orientation within hierarchy | Automatic via platform |
| Sidebar navigation | Browse within space | Curated by space owner |
| Search | Find specific content | Full-text + tag search |
| Recently viewed | Return to recent pages | Personal history |
| Favorites/bookmarks | Quick access to frequent pages | Personal bookmarks |

---

## Platform & Tooling

### Recommended Platforms

| Platform | Best For | Cost | Key Features |
|----------|----------|------|-------------|
| Notion | Startups, flexible structure | $8–$15/user/month | Databases, templates, API |
| Confluence | Enterprise, Jira integration | $6–$12/user/month | Structured spaces, permissions |
| GitBook | Developer documentation | $8–$13/user/month | Git-backed, clean UI |
| Slite | Small teams, simplicity | $8–$10/user/month | AI search, clean interface |
| Outline | Self-hosted, privacy-focused | Free (self-hosted) | Open source, Markdown |

### Integration Requirements

| Integration | Purpose | Priority |
|-------------|---------|----------|
| Slack | Page notifications, search from Slack | P0 |
| Google Workspace | SSO, document embedding | P0 |
| GitHub | Link PRs to ADRs, auto-update from code | P1 |
| Jira/Linear | Link tickets to specs and runbooks | P1 |
| Figma | Embed designs in product specs | P2 |
| Loom | Embed video walkthroughs | P2 |

---

## Metrics & Health

### Wiki Health Metrics

| Metric | Target | Measurement | Frequency |
|--------|--------|-------------|-----------|
| Pages with owner assigned | 100% | Platform audit | Monthly |
| Pages updated within review cycle | > 80% | Last updated vs. cycle | Monthly |
| Orphaned pages (no owner, no links) | < 5% | Platform report | Monthly |
| Search success rate | > 80% | Search → click-through | Monthly |
| New pages created/month | 10–20 | Platform analytics | Monthly |
| Active contributors (% of team) | > 60% | Edit activity | Monthly |
| Average page views/month | Increasing | Platform analytics | Monthly |
| Time to find information (survey) | < 2 minutes | Quarterly survey | Quarterly |

---

*Document prepared by Manus AI for ARG-Builder knowledge management operations.*
