# Deploy pipeline

## Production branch

- **Branch:** `deploy/production` on SAE repo
- **Trigger:** Railway watches this branch
- **Layout:** Playbooks at root; `nexus-os/` vendored sibling (not `apps/nexus-os`)

## Dockerfile

- Monorepo: `/app/apps/playbooks` + `/app/apps/nexus-os`
- Deploy branch: flat `./` + `./nexus-os`

## Manual sync (when rsync missing)

```bash
# Copy apps/playbooks → work dir, apps/nexus-os → work/nexus-os
# git checkout --orphan deploy/production-new
# cp work contents, commit, branch -M deploy/production, force push
```

## CI gaps

- `.github/workflows/railway-redeploy.yml` fails without `RAILWAY_TOKEN`, `RAILWAY_SERVICE_ID`
- `cursor/fix-nexus-os-deploy-0c61` adds tar fallback when rsync unavailable

## Verify production

```bash
curl -sS https://argbuilder.io/os/api/status
curl -sI https://argbuilder.io/os/
curl -sI https://argbuilder.io/product
```

## Cloud agent branches

- Create: `cursor/<name>-0c61`
- Push: `git push -u origin <branch>`
- PR base: `main`; deploy: merge main → sync → push `deploy/production`
