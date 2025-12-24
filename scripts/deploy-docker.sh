#!/bin/bash
# Docker Deployment Script
set -e

echo "SaaS Framework React - Docker Deploy"
echo "====================================="

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not installed"
    exit 1
fi

# Build & deploy
docker-compose build
docker-compose down
docker-compose up -d

echo "✅ Deployed with Docker!"
echo "Application: http://localhost:5173"
docker-compose ps
