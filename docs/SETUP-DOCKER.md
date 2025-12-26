# Docker Deployment

Deploy SaaS Framework React using Docker and Docker Compose.

## Prerequisites

- **Docker** 20.10+ ([Install](https://docs.docker.com/get-docker/))
- **Docker Compose** 2.0+ (included with Docker Desktop)

## Quick Start

```bash
# Clone repository
git clone https://github.com/vhvplatform/react-framework.git
cd react-framework

# Deploy with Docker Compose
docker-compose up -d

# Application runs on http://localhost:5173
```

## Docker Configuration

### Dockerfile

```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages ./packages

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build all packages
RUN pnpm build

# Production stage
FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm serve

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/packages ./packages

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5173:5173"
    environment:
      - NODE_ENV=production
      - API_URL=http://api:8080
    depends_on:
      - api
    restart: unless-stopped

  api:
    image: vhvplatform/go-framework:latest
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/saas
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=saas
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
```

## Commands

### Build & Run

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Development Mode

```bash
# Override for development
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Scale Services

```bash
# Scale app instances
docker-compose up -d --scale app=3
```

## Production Deployment

### With Load Balancer

docker-compose.prod.yml:

```yaml
version: '3.8'

services:
  app:
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:5173"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    deploy:
      replicas: 1
```

Deploy:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Maintenance

### Update Images

```bash
docker-compose pull
docker-compose up -d
```

### Backup

```bash
# Backup database
docker-compose exec db pg_dump -U user saas > backup.sql

# Backup volumes
docker run --rm -v postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/data-backup.tar.gz /data
```

### Logs

```bash
docker-compose logs app
docker-compose logs --tail=100 -f
```

---

**Containerized deployment ready! 🐳**
