# syntax=docker/dockerfile:1.7

# ---------- Builder ----------
FROM oven/bun:1.2-alpine AS builder
WORKDIR /app

# Install deps (cached layer)
COPY package.json bun.lockb* bun.lock* ./
RUN bun install --frozen-lockfile || bun install

# Copy source and build
COPY . .
# BASE_PATH defaults to "/" so the container serves correctly at the root.
ARG BASE_PATH=/
ENV BASE_PATH=${BASE_PATH}
RUN bun run build

# ---------- Runtime ----------
FROM nginx:1.27-alpine AS runtime

# Custom nginx config: SPA fallback + listen on 0.0.0.0:3000
RUN rm /etc/nginx/conf.d/default.conf
COPY <<'EOF' /etc/nginx/conf.d/app.conf
server {
  listen 3000 default_server;
  listen [::]:3000 default_server;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  # Long-cache hashed assets
  location /assets/ {
    access_log off;
    expires 1y;
    add_header Cache-Control "public, immutable";
    try_files $uri =404;
  }

  # SPA fallback for client-side routes
  location / {
    try_files $uri $uri/ /index.html;
  }
}
EOF

# Copy built static files
COPY --from=builder /app/dist/client /usr/share/nginx/html

# Ensure a 404.html for SPA fallback (mirrors GH Pages behavior)
RUN cp /usr/share/nginx/html/index.html /usr/share/nginx/html/404.html || true

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1:3000/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
