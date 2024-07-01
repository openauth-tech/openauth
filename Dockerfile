# Build stage
FROM node:20 AS build

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . ./

RUN pnpm run build

# Runtime stage
FROM node:20 AS runtime

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/.env.* ./
COPY --from=build /usr/src/app/build ./build
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json

ENV NODE_ENV=production

CMD [ "node", "--env-file=.env.production", "build/api.js" ]
