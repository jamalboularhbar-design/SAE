# ARG Builder — Investor FAQ

**Purpose:** Prepared answers for common investor questions during fundraising conversations. Use as a reference before and during pitch meetings.

---

## Market & Opportunity

### Q: How big is the market?

The global knowledge management market is valued at $580 billion (McKinsey, 2024) and growing at 18% CAGR. Within that, the enterprise knowledge management software segment is $22.6 billion (Gartner, 2025). ARG Builder targets the mid-market segment specifically — companies with 200–2,000 employees — which represents approximately $4.2 billion of addressable spend. The broader opportunity includes the $47 million per year that the average mid-market company loses to poor knowledge management (IDC), creating a massive willingness-to-pay for solutions that demonstrably reduce this cost.

### Q: Why now? What's changed?

Three converging forces make this the right moment. First, AI capabilities have reached the point where content governance (staleness detection, duplicate identification, knowledge gap analysis) can be automated reliably — this wasn't possible even 18 months ago. Second, the post-pandemic shift to hybrid/remote work has made structured operational knowledge non-negotiable; you can't tap a colleague on the shoulder when they're in a different timezone. Third, mid-market companies are scaling past the point where Google Docs and Notion work, but they can't afford or justify ServiceNow-class enterprise tools. The gap is wide open.

### Q: Who are your competitors and how do you differentiate?

The competitive landscape includes horizontal tools (Notion at $10/seat, Confluence at $6/seat) that lack governance features, narrow solutions (Trainual at $249/month for onboarding only), and expensive enterprise options (Guru at $25/seat). ARG Builder differentiates on three axes that no competitor combines: AI-powered content governance (automatic staleness detection, duplicate flagging, gap analysis), measurable knowledge consumption (reading analytics with depth tracking, not just page views), and interactive knowledge graphs (visual mapping of how operational documents connect). We're positioned as the "Datadog for operational knowledge" — you wouldn't run production infrastructure without monitoring, so why run operational knowledge without governance?

### Q: What's your unfair advantage?

Our unfair advantage is the combination of vertical depth and AI-native architecture. We're not retrofitting AI onto a wiki — we built the entire platform around the premise that operational knowledge needs active governance. The 525+ pre-loaded operational documents across 6 verticals give us an immediate "time to value" advantage that horizontal tools can't match. Additionally, the founder's background in both hospitality operations (Riad & Routes) and AI-powered product development (through argbuilder.io) gives us authentic domain expertise in the exact problem we're solving.

---

## Business Model & Unit Economics

### Q: What's your pricing model?

We use a hybrid model designed for land-and-expand: Starter at $299/month flat (up to 25 users) for self-serve PLG entry, Professional at $15/user/month (25-seat minimum) for mid-market scaling, and Enterprise at custom pricing (starting $2,500/month) for sales-led deals. We also generate implementation revenue at $5,000–$50,000 per engagement. The Starter tier gets us in the door with zero friction; as teams grow and see value, they naturally upgrade to Professional where revenue scales linearly with adoption.

### Q: What are your target unit economics?

At maturity, we target 80%+ gross margins (pure SaaS with AI compute costs offset by pricing), LTV:CAC ratio of 5:1 or better, net revenue retention of 120%+ (driven by seat expansion within accounts), and payback period under 12 months. The hybrid pricing model means our floor revenue per customer is $299/month (Starter) or $375/month (Professional minimum), with significant expansion potential as organizations grow.

### Q: How do you plan to reach $1M ARR?

The path to $1M ARR requires approximately 85 Professional customers at average 50 seats ($15 × 50 × 12 = $9,000/year each), or a mix of Starter ($3,588/year), Professional, and Enterprise accounts. Our GTM strategy prioritizes founder-led sales to 50 target accounts in NYC/SF for the first 6 months, transitioning to PLG + content marketing + partnerships by month 9. The founding customer program (30% off, 20 spots) is designed to generate the initial case studies and social proof needed to accelerate inbound.

---

## Product & Technology

### Q: What's your current product status?

ARG Builder is a fully built, production-grade platform — not a prototype or MVP. It includes 92 database tables, 109 application pages, 90 UI components, 525+ seeded operational documents, and 307 passing tests across 22 test files. The platform was built across 25 development batches totaling 288 shipped features with zero TypeScript errors. It's live, functional, and ready for enterprise deployment today.

### Q: What's your tech stack?

React 19 + TypeScript frontend with Tailwind CSS 4, Express + tRPC backend with full type safety end-to-end, MySQL/TiDB database with Drizzle ORM, and AI integration via configurable LLM providers. The architecture is designed for horizontal scaling with stateless servers and managed database infrastructure. We use Stripe for payments, S3-compatible storage for files, and OAuth for authentication.

### Q: How do you handle AI costs?

AI features (document generation, governance analysis, duplicate detection) use LLM inference that costs approximately $0.02–$0.10 per operation. At our pricing ($15/user/month), AI costs represent less than 5% of revenue even with heavy usage. We batch non-urgent AI operations (staleness checks, gap analysis) to run during off-peak hours, further optimizing costs. As AI inference costs continue to decline (50%+ annually per OpenAI/Anthropic pricing trends), our margins improve naturally.

### Q: What about data security and compliance?

All data is encrypted at rest and in transit. We're pursuing SOC 2 Type II certification (target: Q4 2026). The platform supports SSO/SAML for enterprise authentication, role-based access control, and full audit logging. For healthcare customers, we offer HIPAA-compliant deployment options. Customer data is isolated per tenant with no cross-contamination. We never use customer data for model training.

---

## Go-to-Market & Traction

### Q: What traction do you have?

We're in pre-revenue launch phase with the product fully built and live. Current traction includes: production-ready platform deployed and accessible, landing page with lead capture active, 30 target companies researched and pipeline built, founding customer outreach beginning June 2026, and a complete GTM playbook with personalized sequences for top targets. We expect first revenue within 30 days of active outreach.

### Q: What's your go-to-market strategy?

Phase 1 (June–August 2026) is founder-led sales targeting 50 accounts in NYC and SF with in-person demos, ops leader dinners, and personalized outreach. Phase 2 (September–December 2026) adds PLG motion with 14-day free trials, content marketing (LinkedIn 3x/week, industry reports), and Product Hunt launch. Phase 3 (2027) scales with partnerships (consulting firms, HR platforms), paid acquisition, and expansion into additional verticals. The strategy is deliberately sequential — we prove product-market fit with founder-led sales before investing in scalable channels.

### Q: Why NYC and SF first?

Both cities have the highest concentration of mid-market companies (200–2,000 employees) in our target verticals. NYC leads in hospitality, professional services, and healthcare; SF leads in SaaS and manufacturing/deep tech. Starting in two cities allows us to build dense local networks, host in-person events (dinners, demos), and generate word-of-mouth within tight-knit operator communities. We expand to other markets once we have 10+ customers and proven playbooks.

---

## Team & Vision

### Q: Tell me about the founding team.

Jamal Boularhbar is the solo technical founder with a unique combination of operational domain expertise (running Riad & Routes, a luxury hospitality business) and AI product development capability (building production-grade AI-powered platforms through argbuilder.io). This dual background means he both understands the operational pain firsthand and can build the technical solution — a rare combination in B2B SaaS founders. The immediate hiring plan includes a Head of Sales (month 3–4) and a Senior Full-Stack Engineer (month 4–5).

### Q: What's the long-term vision?

ARG Builder is the first product from argbuilder.io — a company whose vision is to build AI-powered solutions that solve operational problems for mid-market companies across all verticals. The knowledge management platform is the wedge product that gets us into organizations; from there, we expand into adjacent operational challenges (workflow automation, compliance management, training delivery) using the same AI-native approach. The 5-year vision is to become the "operational intelligence layer" that every mid-market company runs on — the way Salesforce became the CRM layer and Datadog became the infrastructure monitoring layer.

### Q: What are you raising and how will you use it?

We're raising a $1.5M seed round to fund 18 months of runway. Allocation: 40% engineering (hire 2 senior engineers to accelerate product development), 30% sales & marketing (hire Head of Sales, fund events and content), 20% operations (infrastructure, compliance certifications, legal), 10% reserve. Key milestones for the round: 20 paying customers, $50K MRR, and proven unit economics by month 12.

---

## Risks & Mitigation

### Q: What if a big player (Notion, Confluence) adds these features?

This is the classic "what if Google builds it" question. Three reasons we're protected: First, horizontal tools optimize for breadth, not depth — adding governance features to Notion would conflict with their "simple and flexible" positioning. Second, our vertical-specific content library (525+ documents) and AI governance models are trained on operational knowledge specifically — a horizontal tool would need years to build equivalent depth. Third, mid-market buyers want purpose-built solutions, not Swiss Army knives. Guru tried to be everything and still charges $25/seat for basic features we include at $15/seat.

### Q: What if you can't find product-market fit?

Our risk mitigation is the founding customer program — we're not building in isolation. The first 20 customers get direct product influence, which means we're iterating based on real operational needs, not assumptions. If the current positioning doesn't resonate, we have the flexibility to pivot within the operational intelligence space (e.g., focus on compliance-first, or training-first) without rebuilding the core platform. The technology is modular enough to serve multiple use cases.

### Q: Solo founder risk?

Acknowledged and actively mitigated. The product is already built (reducing technical risk), the GTM playbook is documented and repeatable (reducing execution risk), and the first hire priority is a Head of Sales to distribute the revenue-generation burden. Additionally, the platform architecture is clean, well-tested (307 tests), and documented — reducing bus factor. The seed round specifically allocates budget for 2 senior engineering hires within the first 6 months.
