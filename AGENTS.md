# SAE — Sovereign Automation Engine

## Cursor Cloud specific instructions

State of the repository (base branch `main`):

- `main` currently contains only `README.md`. There is **no application code, dependency
  manifest (`package.json`, `requirements.txt`, etc.), test suite, linter config, or build
  tooling** yet. There is nothing to install, lint, test, build, or run on `main`.
- Because there is no manifest on `main`, the startup update script is a guarded no-op: it
  only installs dependencies once a manifest (e.g. `package.json`) is actually committed.

Available toolchain on the VM (for when code is added):

- Node.js v22 and npm 10 (via nvm).
- Python 3.12 (`python3`).

How to proceed once application code exists:

- Add the relevant dependency manifest and run the matching install command
  (`npm install` / `npm ci`, `pip install -r requirements.txt`, etc.), then update the
  startup update script accordingly.
- Re-run environment setup to verify the app can be linted, tested, built, and run in
  development mode.
