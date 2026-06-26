# ARG-Builder: Onboarding Email Sequence

## Executive Summary

This document defines ARG-Builder's onboarding email automation — the structured sequence of emails that guide new trial users and customers from signup to activation, adoption, and expansion. Well-designed onboarding emails are the highest-leverage communication channel for converting trials to paid customers and driving time-to-value.

---

## Sequence Architecture

### Email Journeys Overview

| Journey | Trigger | Duration | Emails | Goal |
|---------|---------|----------|--------|------|
| Trial onboarding | Trial signup | 14 days | 8 emails | Convert to paid |
| Customer onboarding | Contract signed | 30 days | 10 emails | Achieve first value |
| Activation nudge | Inactive after 3 days | 7 days | 4 emails | Re-engage |
| Expansion trigger | Usage threshold hit | 14 days | 5 emails | Upgrade tier |
| Win-back | Trial expired (no convert) | 30 days | 5 emails | Re-engage |

---

## Trial Onboarding Sequence (14 Days)

### Email Schedule

| Day | Email | Subject Line | Purpose | CTA |
|-----|-------|-------------|---------|-----|
| 0 | Welcome | "Welcome to ARG-Builder — let's build your first guide" | Set expectations, first step | "Create your first persona" |
| 1 | Quick win | "Your first operational guide in 10 minutes" | Demonstrate speed-to-value | "Start guided setup" |
| 3 | Feature spotlight | "The feature our customers say saves 5 hours/week" | Highlight search/command palette | "Try it now" |
| 5 | Social proof | "How [Company] reduced onboarding time by 60%" | Build credibility | "Read the case study" |
| 7 | Check-in | "How's it going? (Quick question)" | Engagement, identify blockers | Reply or "Book a call" |
| 9 | Advanced feature | "Unlock the power of process timelines" | Deepen engagement | "Explore timelines" |
| 11 | Urgency | "3 days left — here's what you'll lose" | Create urgency | "Upgrade now" |
| 13 | Final | "Your trial ends tomorrow — special offer inside" | Convert with incentive | "Claim 20% off" |

### Email Templates

#### Day 0: Welcome Email

| Element | Content |
|---------|---------|
| Subject | "Welcome to ARG-Builder — let's build your first guide" |
| Preview | "You're 10 minutes away from your first operational reference guide" |
| Body | Welcome message, 3-step quick start (1. Define a persona, 2. Add your first process, 3. Share with your team), link to guided setup |
| CTA | "Create Your First Persona →" |
| Design | Clean, minimal, product screenshot, branded |
| Metrics target | 60% open rate, 30% click rate |

#### Day 5: Social Proof Email

| Element | Content |
|---------|---------|
| Subject | "How [Company] reduced onboarding time by 60%" |
| Preview | "From 3 weeks to 5 days — here's how they did it" |
| Body | Brief case study (problem → solution → result), customer quote, relevant metrics |
| CTA | "Read the Full Story →" |
| Design | Customer logo, pull quote, metrics callout |
| Metrics target | 45% open rate, 15% click rate |

#### Day 13: Final Conversion Email

| Element | Content |
|---------|---------|
| Subject | "Your trial ends tomorrow — special offer inside" |
| Preview | "Lock in 20% off your first year (expires in 24 hours)" |
| Body | Summary of value created during trial (personalized metrics if available), what they'll lose, limited-time offer, risk reversal (30-day guarantee) |
| CTA | "Upgrade Now — Save 20% →" |
| Design | Urgency elements, countdown, clear pricing |
| Metrics target | 50% open rate, 20% click rate |

---

## Customer Onboarding Sequence (30 Days)

### Email Schedule

| Day | Email | Subject Line | Purpose | CTA |
|-----|-------|-------------|---------|-----|
| 0 | Welcome | "Welcome aboard! Here's your onboarding roadmap" | Set expectations | "View your roadmap" |
| 1 | Setup | "Step 1: Let's configure your workspace" | Technical setup | "Complete setup" |
| 3 | First persona | "Define your first persona in 15 minutes" | Core feature adoption | "Create persona" |
| 5 | Team invite | "Invite your team — collaboration unlocked" | Expand usage | "Invite team members" |
| 7 | Process flow | "Map your first process flow" | Deepen engagement | "Build a process" |
| 10 | Search & tools | "Your team's new superpower: instant search" | Feature adoption | "Try search" |
| 14 | Check-in | "Week 2: How are things going?" | Identify issues | Reply or "Book call" |
| 21 | Advanced | "5 power-user tips from our top customers" | Deepen expertise | "Watch tips video" |
| 25 | QBR prep | "Let's measure your progress (quick survey)" | Gather feedback | "Take 2-min survey" |
| 30 | Milestone | "30 days in — look how far you've come!" | Celebrate, set next goals | "Set next quarter goals" |

---

## Behavioral Triggers

### Activation-Based Emails

| Trigger | Condition | Email | Timing |
|---------|-----------|-------|--------|
| No login (3 days) | User hasn't logged in since signup | "We miss you — need help getting started?" | Day 3 |
| Persona created | First persona completed | "Great start! Here's what to do next" | Immediately |
| Team invited | First team member added | "Your team is growing — here's how to collaborate" | Immediately |
| Search used 10x | Heavy search usage | "You're a search power user — try the command palette" | Next day |
| Export used | PDF export triggered | "Love exports? Here are 3 more ways to share" | Next day |
| Approaching limit | 80% of tier usage | "You're growing fast — here's how to scale" | Immediately |

---

## Performance Metrics

### Email Performance Targets

| Metric | Trial Sequence | Customer Sequence | Industry Benchmark |
|--------|---------------|-------------------|-------------------|
| Open rate | > 50% | > 60% | 35–45% (B2B SaaS) |
| Click rate | > 15% | > 20% | 8–12% (B2B SaaS) |
| Unsubscribe rate | < 0.5% | < 0.3% | 0.5–1% |
| Trial → Paid conversion | > 25% | N/A | 15–25% |
| Time to first value | < 3 days | < 7 days | Varies |
| 30-day activation rate | > 60% | > 80% | 40–60% |

---

## Technical Implementation

### Email Platform Requirements

| Requirement | Implementation |
|-------------|---------------|
| Behavioral triggers | Event-based automation (product events → email) |
| Personalization | Dynamic content based on usage, plan, industry |
| A/B testing | Subject lines, send times, content variants |
| Suppression | Don't email if user is active/engaged that day |
| Deliverability | SPF, DKIM, DMARC, dedicated sending domain |
| Analytics | Per-email and per-sequence metrics |
