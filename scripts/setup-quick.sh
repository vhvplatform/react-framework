#!/bin/bash
# Quick Setup Script - Minimal installation for quick start
# This script installs only the essentials to get started quickly
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Quick Setup - Minimal Installation${NC}\n"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠ Node.js not found. Please install Node.js 18+ first.${NC}"
    exit 1
fi

# Install/check pnpm
if ! command -v pnpm &> /dev/null; then
    echo "Installing pnpm..."
    npm install -g pnpm
fi

# Install dependencies (production only, skip scripts)
echo "Installing dependencies..."
pnpm install --prod --ignore-scripts

echo -e "\n${GREEN}✓ Quick setup complete!${NC}\n"
echo "To complete setup, run:"
echo -e "  ${BLUE}./scripts/setup.sh development${NC}"
