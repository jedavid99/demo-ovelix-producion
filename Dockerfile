# ---- Build stage ----
FROM node:20-slim AS build

WORKDIR /app

# Dependencias primero (cache)
COPY backend/package*.json ./
RUN npm install --include=dev

# Fuentes
COPY backend/tsconfig.json ./
COPY backend/nest-cli.json ./
COPY backend/prisma ./prisma
COPY backend/scripts ./scripts
COPY backend/src ./src

# Generar cliente Prisma y compilar
RUN npx prisma generate
RUN npm run build

# ---- Runtime stage ----
FROM node:20-slim AS runtime

ENV NODE_ENV=production
WORKDIR /app

# Copiar solo dependencias de producción (sin postinstall de Prisma)
COPY --from=build /app/package*.json ./
RUN PRISMA_SKIP_POSTINSTALL_GENERATE=1 npm install --omit=dev

# Artefactos compilados + Prisma (cliente generado, migraciones y CLI)
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /app/node_modules/prisma ./node_modules/prisma
COPY --from=build /app/node_modules/.bin ./node_modules/.bin
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

EXPOSE 3000
# Aplica migraciones pendientes y arranca
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]
