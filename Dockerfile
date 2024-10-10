FROM node:20-alpine3.18 as base

RUN apk --no-cache add curl

# All deps stage
FROM base as deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci

# Production only deps stage
FROM base as production-deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci --omit=dev
# Permet de réduire la taille des projets Node.js en supprimant les fichiers inutiles dans les répertoires node_modules.
RUN wget https://gobinaries.com/tj/node-prune --output-document - | /bin/sh && node-prune

# Build stage
FROM base as build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD . .
RUN npm run build

# Production stage
FROM base
ENV NODE_ENV=production
WORKDIR /app
COPY --from=production-deps /app/node_modules /app/node_modules
# Copier le build de l'étape précédente
COPY --from=build /app/dist ./dist

# Exposer le port utilisé par NestJS
EXPOSE 3000

CMD ["node", "dist/main"]


#FROM node:18.0 as build
#
#WORKDIR /app
#COPY package*.json .
#RUN npm install
#COPY . .
#RUN npm run build
#
#FROM node:18.0
#WORKDIR /app
#COPY package.json .
#RUN npm install --only=production
#COPY --from=build /app/dist ./dist
#CMD npm run start:prod
