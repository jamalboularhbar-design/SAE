# Reference: Brand collision (NexusAI → ARG-Builder)

## Decision (2026-06-21)

Public-facing brand rolled back from **NexusAI** to **ARG-Builder**.

## Reason

Collision with **Morocco Nexus AI Factory** — $1.28B national AI infrastructure project in news. Risk of confusion, SEO clash, and trust issues for a solo/small-team product.

## What kept "Nexus" naming

- **Nexus OS** — product name for the runtime at `/os`
- Internal/legacy strings may still say NexusAI in old docs or meta during transition
- `legacyName: "NexusAI Playbooks"` in brand.ts for transition only

## Public copy today

- Parent: ARG-Builder
- Product: ARG-Builder Playbooks + Nexus OS
- Domain: argbuilder.io (not nexusai.ma as primary)

## Agent rule

Use **ARG-Builder** in user-facing copy, commit messages about brand, and new meta tags. Nexus OS is fine as sub-product name.
