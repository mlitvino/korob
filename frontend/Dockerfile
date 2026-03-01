# ============================================
# Development Stage
# ============================================
FROM node:20-alpine AS development

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* ./

RUN npm ci

COPY . .

EXPOSE 19006 8081

CMD ["npx", "expo", "start", "--web", "--host", "0.0.0.0"]

# ============================================
# Production Stage
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* ./

RUN npm ci

COPY . .

RUN npx expo export:web

CMD ["sh", "-c", "cp -r dist/* /usr/share/nginx/html"]
