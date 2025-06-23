FROM node:22-alpine AS builder

WORKDIR /app

# Copy only necessary files for dependency installation
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

# Copy source files
COPY . .

# Enable corepack for Yarn 3+ support
RUN corepack enable

# Install dependencies (Zero-Install)
RUN yarn

# Build the project
RUN yarn build

# --- Final stage ---
FROM caddy:2.8.4-alpine

WORKDIR /srv

# Copy built static files
COPY --from=builder /app/dist /srv

# Copy Caddyfile for static server configuration
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]