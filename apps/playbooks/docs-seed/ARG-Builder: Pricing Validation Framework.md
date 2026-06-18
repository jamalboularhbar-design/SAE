# ARG-Builder: Pricing Validation Framework

## Executive Summary

This framework provides a structured methodology for validating ARG-Builder's pricing model ($2K–$10K/month subscription + $25K–$100K implementation) with real market data before public launch. It includes willingness-to-pay interview scripts, A/B testing plans for pricing pages, Van Westendorp price sensitivity analysis, conjoint analysis design, and pricing page mockup specifications. The goal is to confirm optimal price points that maximize revenue while maintaining competitive positioning and customer satisfaction.

---

## Pricing Hypothesis to Validate

The current pricing model is based on value-based pricing principles, anchored against the $2.8M annual cost of operational inconsistency and the $100K–$500K cost of consulting alternatives.

| Tier | Monthly Price | Implementation Fee | Target Segment |
|------|--------------|-------------------|----------------|
| Starter | $2,000/month | $25,000 | 200–400 employees |
| Professional | $5,000/month | $50,000 | 400–700 employees |
| Enterprise | $10,000/month | $75,000–$100,000 | 700–1,000+ employees |

**Key Assumptions to Validate:**
1. Mid-market companies will pay $2K–$10K/month for operational systems
2. Implementation fees of $25K–$100K are acceptable given consulting alternatives cost $100K–$500K
3. Value perception is anchored against the $2.8M annual cost of operational inconsistency
4. The 3-tier structure aligns with natural market segmentation

---

## Methodology 1: Van Westendorp Price Sensitivity Meter

The Van Westendorp method identifies acceptable price ranges by asking four questions that reveal psychological price thresholds. Conduct this with 30–50 qualified prospects during discovery calls.

### Interview Questions

Ask these four questions in sequence after demonstrating the product (post-demo, when the prospect understands the value):

**Question 1 — Too Cheap:** "At what monthly price would you consider ARG-Builder to be so inexpensive that you'd question its quality and effectiveness?"

**Question 2 — Bargain:** "At what monthly price would you consider ARG-Builder to be a great deal — you'd feel you're getting more value than you're paying for?"

**Question 3 — Getting Expensive:** "At what monthly price would you start to feel ARG-Builder is getting expensive — you'd still consider it, but you'd need to think carefully?"

**Question 4 — Too Expensive:** "At what monthly price would ARG-Builder be so expensive that you'd never consider purchasing it, regardless of the value?"

### Analysis Framework

Plot all responses on a cumulative frequency chart. The intersections reveal:

| Intersection | Meaning | Expected Range |
|--------------|---------|----------------|
| Too Cheap ∩ Too Expensive | Point of Marginal Cheapness | $800–$1,200/month |
| Bargain ∩ Getting Expensive | Optimal Price Point (OPP) | $3,500–$5,500/month |
| Too Cheap ∩ Getting Expensive | Indifference Price Point | $2,500–$4,000/month |
| Bargain ∩ Too Expensive | Point of Marginal Expensiveness | $7,000–$12,000/month |

The acceptable price range lies between the Point of Marginal Cheapness and the Point of Marginal Expensiveness. The Optimal Price Point is where the maximum number of prospects find the price acceptable.

---

## Methodology 2: Willingness-to-Pay Interviews

Conduct 20–30 structured interviews with qualified prospects to understand value perception, budget constraints, and price anchoring. These interviews should occur during the founding customer acquisition phase.

### Interview Script

**Opening (2 minutes):**
"Thank you for your time. I'd like to understand how you think about investing in operational systems. There are no right or wrong answers — I'm genuinely trying to understand your perspective to build the right product at the right price."

**Value Perception (5 minutes):**

"Based on what you've seen of ARG-Builder, what's the most valuable aspect for your organization?" (Listen, probe for specifics.)

"If ARG-Builder delivered the results we discussed — 35% efficiency improvement, 92% team adoption — what would that be worth to your organization annually?" (Anchor to value, not cost.)

"How does that compare to what you're currently spending on operational documentation, training, and onboarding?" (Establish current spend baseline.)

**Price Testing (8 minutes):**

"I'm going to share some pricing options. For each, I'd like your honest reaction — would you buy at this price, and why or why not?"

Present three prices in random order (rotate across interviews):
- Low anchor: $1,500/month + $15,000 implementation
- Target price: $5,000/month + $50,000 implementation
- High anchor: $12,000/month + $100,000 implementation

For each price, ask:
1. "What's your immediate reaction to this price?"
2. "Would you be able to get budget approval at this level? From whom?"
3. "How does this compare to alternatives you've considered?"

**Budget Reality (3 minutes):**

"What's your typical budget for operational improvement initiatives?"
"Who approves purchases at this level in your organization?"
"What's the typical procurement timeline for a purchase like this?"

**Closing (2 minutes):**

"If we offered a founding customer program with 60% off the first year in exchange for feedback and a case study, would that change your decision? At what price point would you say yes immediately?"

### Data Collection Template

| Field | Response |
|-------|----------|
| Company name | |
| Employee count | |
| Industry | |
| Respondent title | |
| Current spend on ops documentation | |
| Perceived annual value of solution | |
| Reaction to low price | |
| Reaction to target price | |
| Reaction to high price | |
| Budget approval level | |
| Decision timeline | |
| Founding customer interest (Y/N) | |
| Maximum acceptable price | |

---

## Methodology 3: Pricing Page A/B Testing

Once the product is live, run structured A/B tests on the pricing page to optimize conversion rates and average contract value.

### Test 1: Price Point Optimization

| Variant | Starter | Professional | Enterprise |
|---------|---------|--------------|------------|
| Control (A) | $2,000/month | $5,000/month | $10,000/month |
| Variant B | $1,500/month | $4,000/month | $8,000/month |
| Variant C | $2,500/month | $6,000/month | $12,000/month |
| Variant D | $1,800/month | $5,500/month | Custom |

**Success Metric:** Revenue per visitor (not just conversion rate — higher prices with slightly lower conversion may yield more revenue).

**Sample Size:** 500 unique visitors per variant (2,000 total) for statistical significance at 95% confidence.

**Duration:** 4–6 weeks depending on traffic volume.

### Test 2: Pricing Structure

| Variant | Structure |
|---------|-----------|
| Control (A) | Monthly subscription + one-time implementation fee |
| Variant B | Annual subscription only (implementation included) |
| Variant C | Per-employee pricing ($15–$30/employee/month) |
| Variant D | Outcome-based (% of measured efficiency gains) |

### Test 3: Anchoring & Framing

| Variant | Framing Approach |
|---------|-----------------|
| Control (A) | Standard 3-tier pricing table |
| Variant B | "Save $2.8M" — anchor against the problem cost |
| Variant C | "vs. $180K consulting" — anchor against alternatives |
| Variant D | ROI calculator as primary CTA (price revealed after) |

---

## Methodology 4: Conjoint Analysis

Design a conjoint analysis survey to understand which features and price combinations drive purchase decisions. This reveals the relative importance of different value drivers and optimal bundling strategies.

### Attributes & Levels

| Attribute | Level 1 | Level 2 | Level 3 |
|-----------|---------|---------|---------|
| Monthly Price | $2,000 | $5,000 | $10,000 |
| Implementation Time | 1 week | 2 weeks | 4 weeks |
| Number of Personas | 2 | 5 | Unlimited |
| Support Level | Email (48hr) | Priority (4hr) | Dedicated CSM |
| Customization | Standard templates | Custom design | Full white-label |
| Analytics | Basic metrics | Advanced dashboard | Custom reporting |

### Survey Design

Present 12–15 choice sets, each with 3 product configurations. Respondents choose their preferred option in each set. Analyze using hierarchical Bayesian estimation to determine part-worth utilities for each attribute level.

**Target Respondents:** 100–150 qualified mid-market operations leaders.
**Distribution:** Email to prospect list, LinkedIn targeting, partner channels.
**Incentive:** $50 Amazon gift card or free operational health assessment.

---

## Pricing Validation Timeline

| Week | Activity | Output |
|------|----------|--------|
| 1–2 | Van Westendorp interviews (15 prospects) | Preliminary price range |
| 2–4 | WTP interviews (20 prospects) | Value perception data |
| 4–5 | Analysis and hypothesis refinement | Revised pricing model |
| 5–6 | Conjoint survey design and distribution | Survey live |
| 6–8 | Conjoint data collection (100+ responses) | Statistical analysis |
| 8–9 | Pricing page A/B test design | Test variants ready |
| 9–13 | A/B testing (4 weeks live) | Conversion data |
| 13–14 | Final analysis and pricing decision | Validated pricing model |

---

## Decision Criteria

After completing all validation activities, make the final pricing decision based on these criteria:

| Criterion | Weight | Measurement |
|-----------|--------|-------------|
| Revenue maximization | 30% | Revenue per visitor from A/B tests |
| Market positioning | 25% | Price perception vs. competitors |
| Customer willingness | 25% | WTP interview data, Van Westendorp OPP |
| Scalability | 10% | Does pricing scale with customer growth? |
| Simplicity | 10% | Can prospects understand pricing in < 30 seconds? |

---

*Document prepared by Manus AI for ARG-Builder pricing strategy validation.*
