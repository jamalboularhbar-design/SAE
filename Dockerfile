FROM node:20-bookworm-slim

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["sh", "-c", "node_modules/.bin/drizzle-kit migrate && node seed-from-files.mjs && node --experimental-global-webcrypto dist/index.js"]
