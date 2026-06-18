# ARG-Builder: Marketing Attribution Model

## Multi-Touch Attribution Framework for Measuring Marketing's Revenue Contribution

---

## 1. Executive Summary

Marketing attribution answers the most critical question in B2B marketing: "Which activities drive revenue?" Without proper attribution, companies over-invest in easily measurable but low-impact channels while under-investing in high-impact but harder-to-measure activities. This document defines ARG-Builder's complete attribution framework — from model selection to implementation and reporting.

---

## 2. Attribution Model Selection

### 2.1 Model Comparison

| Model | Description | Pros | Cons | Best For |
|-------|-------------|------|------|----------|
| First-touch | 100% credit to first interaction | Simple, shows awareness drivers | Ignores nurture journey | Top-of-funnel analysis |
| Last-touch | 100% credit to last interaction before conversion | Simple, shows closers | Ignores awareness | Bottom-of-funnel analysis |
| Linear | Equal credit to all touches | Fair, easy to understand | Doesn't reflect reality | Balanced view |
| Time-decay | More credit to recent touches | Reflects recency bias | Undervalues early touches | Sales-heavy orgs |
| U-shaped (Position) | 40% first, 40% last, 20% middle | Values key moments | Arbitrary weights | Most B2B companies |
| W-shaped | 30% first, 30% lead creation, 30% opportunity, 10% rest | Values key conversions | Complex to implement | Enterprise B2B |
| Custom/algorithmic | ML-based credit assignment | Most accurate | Requires data volume | Mature organizations |

### 2.2 ARG-Builder Recommended Approach

**Primary Model:** W-shaped attribution (for pipeline and revenue reporting)

**Rationale:** ARG-Builder's sales cycle involves distinct conversion events (first touch → lead creation → opportunity creation → close) that each deserve significant credit.

**Credit Distribution:**

| Touchpoint | Credit | Rationale |
|-----------|--------|-----------|
| First touch (awareness) | 30% | Created initial awareness |
| Lead creation touch | 30% | Converted anonymous to known |
| Opportunity creation touch | 30% | Triggered sales engagement |
| All other touches | 10% (distributed equally) | Supporting role |

**Secondary Models (for specific analysis):**
- First-touch: Understanding which channels create awareness
- Last-touch: Understanding what triggers conversion
- Linear: Holistic channel contribution view

---

## 3. Touchpoint Taxonomy

### 3.1 Channel Categories

| Category | Channels | Tracking Method |
|----------|----------|----------------|
| Paid Search | Google Ads, Bing Ads | UTM parameters |
| Paid Social | LinkedIn Ads, Meta Ads | UTM + platform pixels |
| Organic Search | Google, Bing (organic) | Referrer + landing page |
| Content Marketing | Blog, guides, reports | UTM + content tracking |
| Email Marketing | Nurture, newsletters, campaigns | Email platform + UTM |
| Events | Webinars, conferences, meetups | Registration tracking |
| Direct | Direct traffic, bookmarks | Cookie-based |
| Referral | Partner links, customer referrals | UTM + referral codes |
| Social (organic) | LinkedIn, Twitter posts | UTM + social tracking |
| Product-led | In-app prompts, freemium | Product analytics |
| Sales outreach | Cold email, cold call | CRM activity tracking |
| Community | Community posts, discussions | Community platform |

### 3.2 Touchpoint Definitions

| Touchpoint | Definition | Minimum Threshold |
|-----------|-----------|------------------|
| Website visit | Identified visit to any page | > 10 seconds on site |
| Content download | Gated content form submission | Form completed |
| Email engagement | Open + click on marketing email | Click (not just open) |
| Webinar attendance | Attended live or watched replay | > 10 minutes viewed |
| Demo request | Submitted demo request form | Form completed |
| Product sign-up | Created free account/trial | Account created |
| Sales meeting | Attended scheduled meeting | Meeting occurred |
| Event attendance | Attended in-person/virtual event | Checked in |
| Ad click | Clicked paid advertisement | Click tracked |
| Social engagement | Meaningful social interaction | Comment or share (not just like) |

### 3.3 Touchpoint Weighting (Within Categories)

| Touchpoint Type | Engagement Level | Weight Multiplier |
|----------------|-----------------|-------------------|
| Content download (high-intent) | High | 2.0x |
| Demo request | Very High | 3.0x |
| Webinar attendance | Medium-High | 1.5x |
| Blog visit | Low | 0.5x |
| Email click | Medium | 1.0x |
| Ad click (no conversion) | Low | 0.3x |
| Event attendance | High | 2.0x |
| Product sign-up | Very High | 3.0x |
| Pricing page visit | High | 2.0x |
| Case study view | Medium-High | 1.5x |

---

## 4. Data Collection & Infrastructure

### 4.1 Tracking Requirements

| Data Point | Collection Method | System |
|-----------|------------------|--------|
| Anonymous web visits | Cookie + fingerprint | Google Analytics / Segment |
| Known visitor identity | Form submission, login | Marketing automation |
| Email engagement | Pixel tracking, click tracking | Email platform |
| Ad interactions | Platform pixels, UTM | Ad platforms |
| CRM activities | Manual + automated logging | Salesforce/HubSpot |
| Product usage | Event tracking | Product analytics |
| Event attendance | Registration + check-in | Event platform |
| Phone calls | Call tracking numbers | CallRail / similar |

### 4.2 UTM Parameter Standards

| Parameter | Format | Example |
|-----------|--------|---------|
| utm_source | Platform/channel name | google, linkedin, newsletter |
| utm_medium | Marketing medium | cpc, email, organic, social |
| utm_campaign | Campaign identifier | q1-enterprise-launch |
| utm_content | Content variant | hero-cta-a, sidebar-banner |
| utm_term | Keyword (paid search) | operational-intelligence |

**Naming Conventions:**
- All lowercase
- Hyphens for spaces (not underscores)
- Consistent across all teams
- Documented in shared spreadsheet

### 4.3 Identity Resolution

| Stage | Method | Confidence |
|-------|--------|-----------|
| Anonymous | Cookie ID + device fingerprint | Low |
| Semi-known | IP-to-company matching (Clearbit Reveal) | Medium |
| Known | Form submission, login, email click | High |
| Verified | CRM record matched | Very High |

**Stitching Logic:**
1. Anonymous visits tracked by cookie ID
2. When form is submitted, cookie ID linked to email/contact
3. All previous anonymous visits attributed to that contact
4. Contact linked to account in CRM
5. Account-level attribution aggregated from all contacts

---

## 5. Attribution Reporting

### 5.1 Report Types

| Report | Question Answered | Audience | Frequency |
|--------|------------------|----------|-----------|
| Channel performance | Which channels drive pipeline? | Marketing leadership | Weekly |
| Campaign ROI | Which campaigns are worth the investment? | Marketing + Finance | Monthly |
| Content attribution | Which content drives conversions? | Content team | Monthly |
| Pipeline influence | How much pipeline did marketing touch? | Executive team | Monthly |
| Revenue attribution | How much revenue did marketing drive? | Board + C-suite | Quarterly |
| Funnel velocity | How do channels affect speed-to-close? | Marketing + Sales | Monthly |

### 5.2 Key Attribution Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| Marketing-sourced pipeline | Pipeline where marketing was first touch | > 60% of total pipeline |
| Marketing-influenced pipeline | Pipeline with any marketing touch | > 85% of total pipeline |
| Marketing-sourced revenue | Revenue from marketing-sourced opportunities | > 50% of new revenue |
| Marketing-influenced revenue | Revenue from marketing-touched opportunities | > 80% of new revenue |
| Cost per MQL | Total marketing spend / MQLs generated | < $500 |
| Cost per SQL | Total marketing spend / SQLs generated | < $2,000 |
| Cost per opportunity | Total marketing spend / opportunities created | < $5,000 |
| Marketing CAC | Marketing spend / marketing-sourced customers | < $15,000 |
| Pipeline velocity (by channel) | Average days from first touch to close | Varies by channel |
| Channel ROI | Revenue attributed / channel spend | > 5x |

### 5.3 Dashboard Design

**Executive Dashboard (Monthly):**

| Section | Metrics | Visualization |
|---------|---------|--------------|
| Revenue attribution | Sourced vs. influenced revenue | Waterfall chart |
| Channel performance | Pipeline by channel (W-shaped) | Bar chart |
| Campaign ROI | Top 10 campaigns by ROI | Table with sparklines |
| Funnel conversion | Stage-to-stage conversion by source | Funnel chart |
| Trend | Month-over-month attribution changes | Line chart |
| Efficiency | CAC by channel, blended CAC | Comparison chart |

---

## 6. Channel-Specific Attribution

### 6.1 Content Marketing Attribution

| Content Type | Attribution Window | Measurement |
|-------------|-------------------|-------------|
| Blog posts | 90 days from view | Page view → conversion |
| Gated guides/reports | 180 days from download | Download → pipeline |
| Case studies | 90 days from view | View → opportunity influence |
| Webinars | 90 days from attendance | Attendance → pipeline |
| Podcasts | 30 days from listen | Listen → site visit → conversion |
| Video content | 60 days from view | View → engagement → conversion |

### 6.2 Paid Media Attribution

| Channel | Attribution Window | Model | Key Metrics |
|---------|-------------------|-------|-------------|
| Google Ads (search) | 30 days post-click | Last-click + W-shaped | Cost per SQL, pipeline ROI |
| LinkedIn Ads | 90 days post-click, 30 days post-view | View-through + click | Cost per MQL, pipeline influence |
| Retargeting | 7 days post-click | Assist credit only | Influence on conversion rate |
| Content syndication | 90 days from lead delivery | First-touch (for new leads) | Cost per lead, SQL conversion |

### 6.3 Event Attribution

| Event Type | Attribution Window | Credit Model |
|-----------|-------------------|-------------|
| Hosted webinar | 90 days post-attendance | Full credit if first/last touch |
| Conference (booth) | 60 days post-scan | Lead creation credit |
| Sponsored event | 60 days post-attendance | Influence credit |
| Customer event | 30 days post-attendance | Expansion influence |
| Community event | 90 days post-attendance | Awareness + influence |

---

## 7. Dark Funnel & Unmeasurable Touches

### 7.1 The Dark Funnel Problem

The "dark funnel" refers to buyer activities that cannot be directly tracked — word of mouth, private Slack conversations, podcast mentions, social media browsing (without clicking), and peer recommendations.

**Estimated dark funnel impact:** 40–60% of buying decisions are influenced by unmeasurable activities.

### 7.2 Dark Funnel Measurement Approaches

| Approach | Method | Insight |
|----------|--------|---------|
| Self-reported attribution | "How did you hear about us?" on forms | Captures word-of-mouth, podcasts |
| Post-demo survey | "What influenced your decision to evaluate?" | Multi-source awareness |
| Win/loss interviews | "What sources did you consult during evaluation?" | Full journey reconstruction |
| Brand tracking | Quarterly brand awareness surveys | Awareness trend |
| Direct traffic analysis | Spike correlation with activities | Indirect measurement |
| Social listening | Monitor brand mentions | Conversation volume |

### 7.3 Self-Reported Attribution Implementation

**Form field:** "How did you first hear about ARG-Builder?" (required on demo request form)

| Option | Maps To | Action |
|--------|---------|--------|
| Google search | Organic/Paid search | Validate with UTM |
| LinkedIn (saw a post) | Organic social | Credit content team |
| Colleague/friend recommended | Word of mouth | Credit community/referral |
| Podcast | Content marketing | Credit specific show |
| Industry event | Events | Credit specific event |
| Blog/article | Content | Credit specific content |
| Analyst report | AR/PR | Credit analyst relations |
| Other (specify) | Various | Manual categorization |

---

## 8. Attribution Governance

### 8.1 Rules of Engagement

| Rule | Description | Rationale |
|------|-------------|-----------|
| 90-day attribution window | Touches older than 90 days receive reduced credit | Recency relevance |
| Minimum engagement threshold | Must meet minimum engagement to count | Quality over quantity |
| No double-counting | Revenue counted once across all models | Accuracy |
| Account-level attribution | All contacts' touches roll up to account | B2B buying committee |
| Quarterly model review | Review and adjust model quarterly | Continuous improvement |
| Sales override | Sales can flag attribution disputes | Fairness |

### 8.2 Attribution Disputes

| Scenario | Resolution |
|----------|-----------|
| Sales claims they sourced a deal marketing claims | Review touchpoint timeline, apply W-shaped model |
| Multiple campaigns claim credit | Apply model weights, acknowledge all contributions |
| Self-reported contradicts tracking | Self-reported takes priority (buyer knows best) |
| Touch happened but wasn't tracked | Accept self-reported, fix tracking gap |
| Channel team disagrees with attribution | Quarterly review meeting, data-driven resolution |

### 8.3 Model Calibration

| Activity | Frequency | Method |
|----------|-----------|--------|
| Model accuracy review | Quarterly | Compare predicted vs. actual conversion |
| Weight adjustment | Semi-annual | Based on conversion data |
| New channel addition | As needed | Define tracking + attribution rules |
| Stakeholder alignment | Quarterly | Cross-functional review meeting |
| Full model audit | Annual | External review or consultant |

---

## 9. Technology Stack

### 9.1 Attribution Technology

| Layer | Tool Options | Purpose |
|-------|-------------|---------|
| Data collection | Segment, RudderStack | Event tracking |
| Marketing automation | HubSpot, Marketo | Email + lead tracking |
| CRM | Salesforce, HubSpot | Opportunity + revenue data |
| Attribution platform | HockeyStack, Dreamdata, Bizible | Multi-touch modeling |
| Analytics | Google Analytics 4 | Web analytics |
| Data warehouse | Snowflake, BigQuery | Unified data store |
| Visualization | Looker, Metabase | Dashboards |
| Call tracking | CallRail | Phone attribution |

### 9.2 Implementation Priority

| Phase | Components | Timeline |
|-------|-----------|----------|
| 1 | UTM standards, GA4, CRM tracking | Month 1–2 |
| 2 | Marketing automation integration, basic reporting | Month 2–3 |
| 3 | Multi-touch model implementation | Month 3–4 |
| 4 | Self-reported attribution, dark funnel | Month 4–5 |
| 5 | Advanced dashboards, automated reporting | Month 5–6 |
| 6 | Model optimization, algorithmic testing | Month 6+ |

---

## 10. Reporting Templates

### 10.1 Monthly Marketing Attribution Report

| Section | Content |
|---------|---------|
| Executive summary | Top-line numbers: sourced pipeline, influenced revenue, CAC |
| Channel performance | Pipeline and revenue by channel (W-shaped) |
| Campaign highlights | Top 5 campaigns by ROI |
| Content performance | Top content by pipeline influence |
| Efficiency metrics | CAC by channel, cost per SQL, cost per opportunity |
| Dark funnel insights | Self-reported data, brand mentions |
| Recommendations | Budget reallocation suggestions |
| Next month focus | Planned campaigns and expected impact |

### 10.2 Quarterly Board Report (Marketing Section)

| Metric | Q-1 | Current Q | Target | Trend |
|--------|-----|-----------|--------|-------|
| Marketing-sourced pipeline | — | — | — | ↑↓→ |
| Marketing-sourced revenue | — | — | — | ↑↓→ |
| Blended CAC | — | — | — | ↑↓→ |
| Marketing CAC | — | — | — | ↑↓→ |
| Pipeline coverage (marketing) | — | — | — | ↑↓→ |
| Top channel (by pipeline) | — | — | — | — |
| Marketing efficiency ratio | — | — | — | ↑↓→ |

---

*Document prepared by Manus AI. Marketing attribution model designed for ARG-Builder data-driven marketing investment.*
