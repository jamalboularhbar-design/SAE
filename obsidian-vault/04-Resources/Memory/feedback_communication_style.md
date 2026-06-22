---
name: feedback-communication-style
description: "Jamal's communication style — terse, decisive, execution-oriented. Don't ask multi-part questions, don't over-narrate, don't restate what he just said."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: ee5d7b67-b6ec-425f-85dc-32239b69176f
---

**Rule:** Match his cadence. He writes in two-to-six-word messages when momentum is high — "so what", "done", "check now", "tackle the changes", "i need everything." Your response density should compress accordingly.

**Why:** Across the session he repeatedly steered toward less ceremony — interrupted long deployments to say "done", interrupted tool sequences to redirect ("https://github.com/jamalboularhbar-design/nexus-os"), pushed back on questions when he wanted action ("so what"). He's running multiple AIs and three businesses; ceremony costs him.

**How to apply:**

- **Don't restate his ask.** If he says "tackle this now", do not respond with "On it. I'll tackle [restating]." Just tackle it.
- **One question per turn, max.** Never present a 4-option menu when there's a clear best path. Use `AskUserQuestion` only when the choice has irreversible consequences (merge to main, push to prod).
- **Verify with one curl/probe, not a polling loop.** When checking deploy status, one one-shot check is right; a 5-minute polling loop is wrong — interruption-prone and ignores his pace.
- **Status reports get a headline + a table.** Not three paragraphs of preamble. Bottom line first, table beneath, recommended next action last.
- **Lead the reply with the answer.** If he asked "what's on the plate", reply starts with the plate, not "Here's what's on the plate."
- **Don't apologize unnecessarily.** When I was wrong about something (e.g., the deploy is on Railway not Manus, ARG-Builder PR vs SAE PR), a single short correction in line is enough. No paragraphs of "apologies for the confusion."
- **He skips merges.** If he says "yes merge", merge — don't ask again before clicking.
- **He validates by silence.** A short "done" or no response = the work was right. A correction = redirect immediately, don't defend.
- **Avoid em-dash overuse in headers.** He notices typography. He also notices when copy has the same em-dash drag pattern as everyone else's AI output. Vary.
- **Markdown links are good.** He clicks them. Bare PR numbers are bad.

**What he likes:**
- Tight tables with markers (✓, status colors)
- Numbered checklists for steps he must take himself
- Frank synthesis when audits disagree — "my honest pro judgment is X" beats "depends on…"
- One-page summaries that name what to do next

**What he doesn't:**
- "Great question!" / "Let me think about this." / "Excellent point."
- Surveys of options that are actually one option
- Repeating the question back before answering
- Long "here's what I'm going to do" preambles before doing it
