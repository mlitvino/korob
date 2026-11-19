FROM caddy:2.11-alpine

# Commit SHA, shown by /health.
ARG VERSION=dev
ENV VERSION=$VERSION

COPY Caddyfile /etc/caddy/Caddyfile

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
	CMD wget -qO- http://127.0.0.1:8080/health || exit 1
