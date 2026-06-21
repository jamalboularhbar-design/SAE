# SAE monorepo — builds NexusAI Playbooks from apps/playbooks
# Workdir kept at /app/apps/playbooks so build:nexus-os can `cd ../nexus-os`.
FROM node:20-bookworm-slim

RUN corepack enable

WORKDIR /app

# Sibling repo required by apps/playbooks `build:nexus-os` script.
COPY apps/nexus-os ./apps/nexus-os

WORKDIR /app/apps/playbooks

COPY apps/playbooks/package.json apps/playbooks/pnpm-lock.yaml ./
COPY apps/playbooks/patches ./patches

RUN pnpm install --frozen-lockfile

COPY apps/playbooks/ .

RUN pnpm run build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["sh", "-c", "node_modules/.bin/drizzle-kit migrate && node seed-from-files.mjs && node --experimental-global-webcrypto dist/index.js"]
