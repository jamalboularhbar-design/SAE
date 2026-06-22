---
name: reference-local-workspace
description: "Quirks of the local file structure on Jamal's machine — the cwd-lock issue, the Desktop ARG-Builder folder layout, what's where."
metadata: 
  node_type: memory
  type: reference
  originSessionId: ee5d7b67-b6ec-425f-85dc-32239b69176f
---

**The cwd-lock issue.** This Claude Code session's cwd is `C:\Users\G-shop\Desktop\ARG-Builder\app\node_modules\resolve\node_modules\hasown\.github` (someone's old test seed). On Windows you cannot rename or delete any directory that's the cwd of a running process — and Claude Code itself holds the cwd. So:

- `npm install` in `app/` fails with EBUSY trying to rename `node_modules/resolve/node_modules/hasown/.github`.
- `git clone SAE-live` fails to check out files because the seed docs in SAE include filenames with colons (`Follow-Up 7: Industry-Specific...md`), which Windows can't represent.
- PowerShell's `Remove-Item -Recurse -Force` cannot clear it either — same lock.

**Workarounds:**
- Don't clone SAE locally on Windows. Use the GitHub Git Data API via `gh api` (POST blobs → create tree → create commit → create branch ref). Python scripts in the workspace root demonstrate the pattern: `sae-launch-ready.py`, `sae-unblock-deploy.py`, `sae-mount-and-title.py`.
- ARG-Builder repo CAN be cloned (no colon-filename docs) → `ARG-Builder-live/` works fine, used for PR #1.
- The user would need to close Claude and `rmdir /s /q node_modules` from a separate terminal to unstick the EBUSY — this came up but wasn't required to ship anything.

**The Desktop layout:**

```
C:\Users\G-shop\Desktop\
├── ARG-Builder\                  ← the workspace root (multi-project)
│   ├── app\                      ← original Vite scaffold (legacy, superseded by manus/)
│   ├── manus\                    ← snapshot of the Manus codebase before NexusAI rebrand
│   │   ├── HANDOFF.md
│   │   ├── DEPLOY-RAILWAY.md
│   │   ├── client/server/shared/drizzle/
│   │   └── specs/founding-cohort.md
│   ├── 01\                       ← original spec + system prompt source docs
│   ├── ARG-Builder-live\         ← cloned from jamalboularhbar-design/ARG-Builder (PR #1 worked here)
│   ├── pre-launch\               ← strategy docs, content, banner SVG, LinkedIn copy
│   │   ├── positioning.md
│   │   ├── icp.md
│   │   ├── playbook.md
│   │   ├── linkedin-profile.md
│   │   ├── company-pages.md
│   │   ├── CLOSEOUT.md
│   │   ├── NexusAI-Risk-Assessment.docx
│   │   ├── SESSION-INVENTORY.md
│   │   ├── content/anchor-posts.md
│   │   └── assets/LOGO-NOTES.md, linkedin-banner.svg
│   ├── riad-routes\              ← real client docs (Valérie Mantot-Groene), templates
│   ├── personal\                 ← 30-day-reset-plan.md (the smoking/sleep plan)
│   └── .claude\                  ← settings.local.json + launch.json
└── (various pptx, pdf, zip, .lnk files for tools)
```

**How to apply:**
- Need to edit production code → use Git Data API on SAE, don't try to clone it.
- Need to edit strategy/copy → local files in `pre-launch/` work fine.
- Need to look at the original Manus-era code → `manus/` snapshot has it.
- Need to find a real-world content example (the "How we work" PDF, etc.) → `riad-routes/templates/` has them.
- Don't try to start the local dev server (`preview_start` failed last time on the cwd-lock).
