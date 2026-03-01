# ============================================
# Development Stage
# ============================================
FROM node:25-alpine AS development

WORKDIR /app

COPY package.json yarn.lock* ./

RUN yarn install

COPY . .

EXPOSE 8081

CMD ["npm", "run", "start"]

# ============================================
# Production Stage
# ============================================
FROM node:25-alpine AS production

WORKDIR /app

COPY package.json yarn.lock* ./

RUN yarn install --frozen-lockfile

COPY . .

RUN npx expo export -p web

CMD ["sh", "-c", "cp -r dist/* /usr/share/nginx/html"]
