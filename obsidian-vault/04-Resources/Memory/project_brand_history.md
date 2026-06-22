---
name: project-brand-history
description: Brand path — ARG-Builder → NexusAI → ARG-Builder. Documents the parent-brand decision and the Nexus OS sub-brand.
metadata: 
  node_type: memory
  type: project
  originSessionId: ee5d7b67-b6ec-425f-85dc-32239b69176f
---

**Why:** The brand path matters because every layer of the system (DNS, repo names, SEO, GitHub workflows, Stripe products) has been touched by it, and confusion in this layer cost real money in the form of broken builds and stale deploys.

**The timeline:**

1. **Original brand: ARG-Builder.** Built on Manus, deployed at `argbuilder.manus.space`. Repo `agent-reference-guide` (still on the user's account, mostly emptied). Tagline: "Autonomous Capacity, not software."
2. **Mid-June 2026: rebrand to NexusAI Playbooks.** Done inside Manus cloud. Parent brand: NexusAI. Product: NexusAI Playbooks. Suite: Intelligence Hub + Playbooks + Templates + (planned) Ops Core. Reflected in `shared/brand.ts` in the SAE monorepo. Live argbuilder.io title became "NexusAI Playbooks — AI-Powered Operational Intelligence."
3. **2026-06-21 (this session).** Rolled the parent brand back to ARG-Builder. Reason: the "NexusAI" parent collides with the USD 1.28 B Morocco government Nexus AI Factory project (Nexus Core Systems × Nvidia × NAVER Cloud × TAQA, MoU at GITEX Africa 2026, endorsed by US Ambassador to Morocco). See [[reference-brand-collision]] for the source list.

**Current state (as of 2026-06-22, code-merged-but-not-yet-deployed):**

| Layer | Value |
|---|---|
| Parent brand | **ARG-Builder** |
| Product | **ARG-Builder Playbooks** |
| Sub-product (the wedge) | **Nexus OS** (kept — it's the runtime, not the parent) |
| Domain | **argbuilder.io** |
| Email | `hello@argbuilder.io` |
| Tagline | *Playbooks and the runtime that runs them* |
| Legacy (kept as redirect, do not delete) | `nexusai.ma`, `NexusAI Playbooks` |

**Key rule:** Nexus OS as a product name is fine — it's narrower than "NexusAI" and refers to a specific runtime mounted at `/os`. The collision risk is on the **parent** brand. Don't reintroduce NexusAI as the umbrella unless trademark clearance happens first.

**How to apply:**
- Brand strings on the public surface should say ARG-Builder (parent) or Nexus OS (product). Never NexusAI as the umbrella.
- When editing copy across the SAE repo, the source of truth is `apps/playbooks/shared/brand.ts`. Most components read from it; a few hardcoded spots (the static `client/index.html` `<title>` is the canonical one to remember) need direct edits.
- The "legacy" fields in `BRAND` are intentional — they enable a soft pivot back if needed, but should not be referenced by current copy.
