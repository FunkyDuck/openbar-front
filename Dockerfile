# Utilisation d'une image Node légère et récente
FROM node:20-alpine AS base

# Installation de pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# -----------------------------------------
# Étape 1 : Installation des dépendances
# -----------------------------------------
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
# On installe uniquement les dépendances de production pour le cache
RUN pnpm install --frozen-lockfile

# -----------------------------------------
# Étape 2 : Build de l'application
# -----------------------------------------
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# On build le projet Nuxt
RUN pnpm run build

# -----------------------------------------
# Étape 3 : Image de production finale
# -----------------------------------------
FROM base AS runner
WORKDIR /app

# Création d'un utilisateur non-root pour la sécurité
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxtjs

# On copie uniquement le dossier de sortie (.output) généré par le build
COPY --from=builder --chown=nuxtjs:nodejs /app/.output /app/.output

USER nuxtjs

ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

# Commande de démarrage (Nuxt Nitro Server)
CMD ["node", ".output/server/index.mjs"]