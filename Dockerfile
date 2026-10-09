# syntax=docker/dockerfile:1

# ============================================
# Stage 1 — build the React client
# ============================================
FROM node:22-alpine AS client-build

WORKDIR /app/client

# Copy manifests first so `npm ci` is cached until dependencies actually change.
COPY client/package.json client/package-lock.json* ./

# `npm ci` requires a lockfile. Fall back to `install` if the lockfile is absent
# so the build still works on a fresh clone.
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY client/ ./

# REACT_APP_* values are inlined at build time, so they must be passed as build
# args rather than runtime environment variables.
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# ============================================
# Stage 2 — run the API server
# ============================================
FROM node:22-alpine AS runtime

WORKDIR /app/server

# `tini` reaps zombie processes and forwards SIGTERM, which the graceful
# shutdown handler in app.js relies on.
RUN apk add --no-cache tini

COPY server/package.json server/package-lock.json* ./

RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

COPY server/ ./

# Multer writes temp uploads here at runtime. The directory must exist and be
# writable by the unprivileged user, and it must never be baked into the image.
RUN mkdir -p uploads && chown -R node:node /app

USER node

ENV NODE_ENV=production
ENV PORT=5001

EXPOSE 5001

# Declare the healthcheck endpoint so orchestrators can gate traffic on the API
# actually being ready, not merely the container being alive.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||5001)+'/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

ENTRYPOINT ["/sbin/tini", "--"]

# Exec form so the process becomes PID 1's child and receives SIGTERM directly.
CMD ["node", "app.js"]