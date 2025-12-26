#!/bin/bash
# Docker Deployment Script - Aligned with go-infrastructure standards
set -e

echo "React Framework - Docker Deploy"
echo "======================================="
echo "Deploying with go-infrastructure integration"
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not installed"
    exit 1
fi

# Check docker-compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not installed"
    exit 1
fi

# Build & deploy
echo "📦 Building containers..."
docker-compose build

echo "🔄 Restarting services..."
docker-compose down
docker-compose up -d

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Services:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:8080"
echo "  PostgreSQL: localhost:5432"
echo "  Redis: localhost:6379"
echo ""
echo "Health checks:"
echo "  curl http://localhost:3000/health"
echo "  curl http://localhost:8080/health"
echo ""

# Show container status
docker-compose ps
