# Cursor Launchpad Course

A responsive, interactive course web app for learning Cursor. Pure static front end:
`index.html` + `styles.css` + vanilla JS in `app.js`. No backend, no framework, no
runtime dependencies. State (module completion, quiz answers, shipping checklist) is
persisted in the browser via `localStorage`.

## Cursor Cloud specific instructions

Commands (see `package.json` `scripts`):

- Run (dev): `npm run start` — serves the static files with `python3 -m http.server 4173`.
  Open `http://localhost:4173/`.
- JS check / "lint": `npm run check` — runs `node --check app.js` (syntax check only;
  there is no ESLint/Prettier or test suite configured).
- There is no build step and no automated test suite.

Non-obvious notes:

- `npm install` is effectively a no-op: `package.json` declares no dependencies and there
  is no lockfile. The only runtime requirements are Python 3 (for the dev server) and
  Node.js (for `npm run check`). Both are preinstalled on the VM (Python 3.12, Node 22).
- The dev server is a plain static file server with no hot reload — refresh the browser
  after editing `index.html`, `styles.css`, or `app.js`.
- App state lives in `localStorage` under the key `cursor-launchpad-state`. Use the
  in-app "Reset progress" button (or clear site data) to start fresh.
