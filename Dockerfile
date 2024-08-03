FROM node:20 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
WORKDIR /app

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=@open-auth/sdk-core --prod core
RUN pnpm deploy --filter=api --prod api


FROM base AS api-prod
WORKDIR /app

COPY --from=build /app/api/.env.* ./
COPY --from=build /app/api/dist ./dist
COPY --from=build /app/api/prisma ./prisma
COPY --from=build /app/api/package.json ./package.json
COPY --from=build /app/api/node_modules ./node_modules

CMD [ "node", "--env-file=.env.production", "dist/api.js" ]


FROM build AS queue-prod
WORKDIR /app

COPY --from=build /app/api/.env.* ./
COPY --from=build /app/api/dist ./dist
COPY --from=build /app/api/prisma ./prisma
COPY --from=build /app/api/package.json ./package.json
COPY --from=build /app/api/node_modules ./node_modules

CMD [ "node", "--env-file=.env.production", "dist/queue.js" ]
