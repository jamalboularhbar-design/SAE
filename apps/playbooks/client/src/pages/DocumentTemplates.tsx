import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, FileText, Copy, CheckCircle } from 'lucide-react';

const TEMPLATES = [
  {
    name: 'Standard Operating Procedure',
    category: 'Operations',
    description: 'Step-by-step process documentation for repeatable workflows.',
    content: `# [Process Name] - Standard Operating Procedure

## Purpose
Briefly describe the purpose of this SOP and what it aims to achieve.

## Scope
Define who this applies to and under what circumstances.

## Prerequisites
- List any required tools, access, or prior knowledge
- Include links to related documents

## Procedure

### Step 1: [Action Name]
Detailed description of the first step.

**Expected Outcome:** What should happen after this step.

### Step 2: [Action Name]
Detailed description of the second step.

**Expected Outcome:** What should happen after this step.

### Step 3: [Action Name]
Detailed description of the third step.

**Expected Outcome:** What should happen after this step.

## Escalation Path
Describe when and how to escalate issues.

## Metrics & KPIs
- Metric 1: [Description]
- Metric 2: [Description]

## Revision History
| Date | Author | Changes |
|------|--------|---------|
| YYYY-MM-DD | Name | Initial version |
`,
  },
  {
    name: 'Incident Response Playbook',
    category: 'Engineering',
    description: 'Structured response plan for handling incidents and outages.',
    content: `# [Incident Type] Response Playbook

## Severity Classification
| Level | Description | Response Time |
|-------|-------------|---------------|
| P1 | Critical | < 15 minutes |
| P2 | High | < 1 hour |
| P3 | Medium | < 4 hours |
| P4 | Low | Next business day |

## Detection
- How is this incident typically detected?
- What monitoring/alerts trigger?
- What are the early warning signs?

## Initial Response
1. Acknowledge the alert
2. Assess severity level
3. Notify relevant stakeholders
4. Begin investigation

## Diagnosis Steps
1. Check [system/service] health
2. Review recent deployments
3. Examine error logs
4. Identify affected scope

## Resolution Procedures
### Scenario A: [Common cause]
- Step-by-step resolution

### Scenario B: [Alternative cause]
- Step-by-step resolution

## Communication Template
**Subject:** [Severity] - [Brief Description]
**Status:** Investigating / Identified / Monitoring / Resolved
**Impact:** [Who/what is affected]
**Next Update:** [Time]

## Post-Incident
- [ ] Root cause analysis
- [ ] Timeline documentation
- [ ] Prevention measures
- [ ] Communication to stakeholders
`,
  },
  {
    name: 'Client Onboarding Guide',
    category: 'Customer Success',
    description: 'Structured onboarding workflow for new clients.',
    content: `# [Client Name] Onboarding Guide

## Client Overview
- **Company:** [Name]
- **Industry:** [Industry]
- **Size:** [Employee count / Revenue tier]
- **Primary Contact:** [Name, Role, Email]
- **Start Date:** [Date]

## Onboarding Timeline
| Week | Milestone | Owner | Status |
|------|-----------|-------|--------|
| 1 | Kickoff & Discovery | CSM | |
| 2 | Configuration & Setup | Technical | |
| 3 | Training & Enablement | CSM | |
| 4 | Go-Live & Optimization | Team | |

## Week 1: Discovery & Kickoff
### Kickoff Meeting Agenda
- Introductions and role mapping
- Goals and success criteria
- Timeline review
- Access and permissions setup

### Discovery Questions
1. What are your primary goals?
2. What does success look like in 90 days?
3. What are your current pain points?
4. Who are the key stakeholders?

## Week 2: Configuration
- [ ] Account setup complete
- [ ] Integrations configured
- [ ] Data migration (if applicable)
- [ ] Custom settings applied

## Week 3: Training
- [ ] Admin training session
- [ ] End-user training session
- [ ] Documentation shared
- [ ] Q&A session scheduled

## Week 4: Go-Live
- [ ] Final review meeting
- [ ] Go-live confirmation
- [ ] Support handoff
- [ ] 30-day check-in scheduled

## Success Metrics
- Metric 1: [Target]
- Metric 2: [Target]
- Metric 3: [Target]
`,
  },
  {
    name: 'Product Feature Specification',
    category: 'Product',
    description: 'Detailed feature spec for product development.',
    content: `# Feature: [Feature Name]

## Overview
Brief description of the feature and its value proposition.

## Problem Statement
What problem does this solve? Who experiences this problem?

## Goals & Success Metrics
| Goal | Metric | Target |
|------|--------|--------|
| [Goal 1] | [Metric] | [Target] |
| [Goal 2] | [Metric] | [Target] |

## User Stories
- As a [user type], I want to [action] so that [benefit]
- As a [user type], I want to [action] so that [benefit]

## Requirements

### Functional Requirements
1. [Requirement 1]
2. [Requirement 2]
3. [Requirement 3]

### Non-Functional Requirements
- Performance: [Requirement]
- Security: [Requirement]
- Scalability: [Requirement]

## Design
[Link to design mockups or describe the UI/UX approach]

## Technical Approach
High-level technical implementation plan.

## Dependencies
- [Dependency 1]
- [Dependency 2]

## Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| [Risk 1] | High/Med/Low | [Mitigation] |

## Timeline
| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Design | [X days] | Mockups |
| Development | [X days] | Working feature |
| Testing | [X days] | QA sign-off |
| Launch | [X days] | GA release |
`,
  },
  {
    name: 'Competitive Analysis',
    category: 'Strategy',
    description: 'Structured competitive intelligence framework.',
    content: `# Competitive Analysis: [Competitor Name]

## Executive Summary
Brief overview of the competitive landscape and key findings.

## Competitor Profile
- **Company:** [Name]
- **Founded:** [Year]
- **Funding/Revenue:** [Amount]
- **Employees:** [Count]
- **Target Market:** [Description]

## Product Comparison
| Feature | Us | Competitor | Notes |
|---------|-----|-----------|-------|
| [Feature 1] | ✅/❌ | ✅/❌ | |
| [Feature 2] | ✅/❌ | ✅/❌ | |
| [Feature 3] | ✅/❌ | ✅/❌ | |

## Pricing Comparison
| Tier | Us | Competitor |
|------|-----|-----------|
| Starter | $X/mo | $X/mo |
| Pro | $X/mo | $X/mo |
| Enterprise | Custom | Custom |

## Strengths
1. [Strength 1]
2. [Strength 2]
3. [Strength 3]

## Weaknesses
1. [Weakness 1]
2. [Weakness 2]
3. [Weakness 3]

## Win/Loss Analysis
- **Win Rate Against:** [X%]
- **Common Win Reasons:** [List]
- **Common Loss Reasons:** [List]

## Recommended Actions
1. [Action 1]
2. [Action 2]
3. [Action 3]
`,
  },
];

export default function DocumentTemplates() {
  const [, navigate] = useLocation();
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (template: typeof TEMPLATES[0]) => {
    navigator.clipboard.writeText(template.content);
    setCopied(template.name);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <FileText className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold text-foreground">Document Templates</h1>
        </div>
      </header>

      <div className="container py-6 sm:py-8 max-w-4xl mx-auto">
        <p className="text-sm text-muted-foreground mb-6">
          Pre-built markdown templates for common document types. Copy and customize for your needs.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TEMPLATES.map(template => (
            <div key={template.name} className="p-4 rounded-lg border border-border/50 bg-card/30 hover:border-accent/30 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{template.name}</h3>
                  <span className="text-[10px] text-accent bg-accent/10 px-1.5 py-0.5 rounded mt-1 inline-block">{template.category}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{template.description}</p>
              <button
                onClick={() => handleCopy(template)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors"
              >
                {copied === template.name ? (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Template</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
