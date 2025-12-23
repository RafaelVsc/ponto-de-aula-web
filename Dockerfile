# Stage 1 - build
FROM node:18-alpine AS builder
WORKDIR /app

# Permite definir a URL da API no build (fallback mantém localhost)
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2 - runtime (serve build via vite preview)
FROM node:18-alpine AS runtime
WORKDIR /app

# Reuse installed deps (inclui devDeps para rodar o preview)
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY --from=builder /app/dist ./dist

EXPOSE 4173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
