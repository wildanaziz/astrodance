FROM oven/bun:1 AS base
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:1-slim
WORKDIR /app

COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./
COPY --from=base /app/drizzle ./drizzle
COPY --from=base /app/scripts ./scripts

RUN chmod +x /app/scripts/docker-entrypoint.sh

EXPOSE 4321

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4321/', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); })"

ENTRYPOINT ["/app/scripts/docker-entrypoint.sh"]
