#!/bin/bash
# Development Setup Script - Enhanced version
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Parse arguments
SKIP_BUILD=false
SKIP_VALIDATION=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --skip-build)
      SKIP_BUILD=true
      shift
      ;;
    --skip-validation)
      SKIP_VALIDATION=true
      shift
      ;;
    --help)
      echo "Usage: ./setup-dev.sh [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --skip-build       Skip package build step"
      echo "  --skip-validation  Skip validation checks"
      echo "  --help             Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     SaaS Framework React - Development Setup            ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}\n"

# Function to check command exists
command_exists() {
  command -v "$1" &> /dev/null
}

# Check Node.js
echo -e "${YELLOW}→ Checking Node.js...${NC}"
if ! command_exists node; then
    echo -e "${RED}✗ Node.js not installed${NC}"
    echo -e "  Install from: ${BLUE}https://nodejs.org/${NC}"
    exit 1
fi
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}✗ Node.js 18+ required (current: $(node -v))${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# Check pnpm
echo -e "${YELLOW}→ Checking pnpm...${NC}"
if ! command_exists pnpm; then
    echo -e "${YELLOW}→ Installing pnpm...${NC}"
    npm install -g pnpm
fi
PNPM_VERSION=$(pnpm -v)
echo -e "${GREEN}✓ pnpm v${PNPM_VERSION}${NC}"

# Check Git
if command_exists git; then
    echo -e "${GREEN}✓ Git $(git --version | cut -d ' ' -f 3)${NC}"
else
    echo -e "${YELLOW}⚠ Git not installed (recommended for development)${NC}"
fi

# Disk space check
AVAILABLE_SPACE=$(df . | tail -1 | awk '{print $4}')
REQUIRED_SPACE=1048576 # 1GB in KB
if [ "$AVAILABLE_SPACE" -lt "$REQUIRED_SPACE" ]; then
    echo -e "${YELLOW}⚠ Low disk space. At least 1GB recommended${NC}"
fi

echo ""

# Install dependencies
echo -e "${YELLOW}→ Installing dependencies...${NC}"
echo -e "  This may take a few minutes..."
if pnpm install; then
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install dependencies${NC}"
    exit 1
fi

echo ""

# Build packages
if [ "$SKIP_BUILD" = false ]; then
    echo -e "${YELLOW}→ Building packages...${NC}"
    echo -e "  This may take a few minutes..."
    if pnpm build; then
        echo -e "${GREEN}✓ Packages built${NC}"
    else
        echo -e "${RED}✗ Build failed${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⊘ Skipping build (--skip-build)${NC}"
fi

echo ""

# Create .env
if [ ! -f .env ]; then
    echo -e "${YELLOW}→ Creating environment file...${NC}"
    cat > .env << 'EOF'
NODE_ENV=development
VITE_API_URL=http://localhost:8080
PUBLIC_URL=http://localhost:5173
LOG_LEVEL=debug
EOF
    echo -e "${GREEN}✓ .env created${NC}"
    echo -e "${YELLOW}  Note: Update VITE_API_URL to match your backend server${NC}"
else
    echo -e "${YELLOW}⊘ .env already exists${NC}"
fi

# Create .gitignore additions if needed
if [ ! -f .gitignore.local ]; then
    cat > .gitignore.local << 'EOF'
# Local development
.env.local
*.local
.vscode/
.idea/
EOF
    echo -e "${GREEN}✓ .gitignore.local created${NC}"
fi

echo ""

# Validation
if [ "$SKIP_VALIDATION" = false ]; then
    echo -e "${YELLOW}→ Running validation checks...${NC}"
    
    # Type check
    if pnpm type-check > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Type checking passed${NC}"
    else
        echo -e "${YELLOW}⚠ Type checking failed (non-critical)${NC}"
    fi
    
    # Lint check (don't fail on errors)
    if pnpm lint > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Linting passed${NC}"
    else
        echo -e "${YELLOW}⚠ Linting issues found${NC}"
        echo -e "  Run ${BLUE}pnpm lint:fix${NC} to auto-fix"
    fi
else
    echo -e "${YELLOW}⊘ Skipping validation (--skip-validation)${NC}"
fi

# Setup Git hooks
if [ -d .git ]; then
    echo -e "${YELLOW}→ Setting up Git hooks...${NC}"
    pnpm prepare > /dev/null 2>&1 || true
    echo -e "${GREEN}✓ Git hooks configured${NC}"
fi

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          Development Setup Complete! ✓                   ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"

echo ""
echo -e "${YELLOW}Next steps:${NC}\n"
echo -e "  ${BLUE}1.${NC} Start development: ${GREEN}pnpm dev${NC}"
echo -e "  ${BLUE}2.${NC} Create an app: ${GREEN}pnpm cli create-app my-app${NC}"
echo -e "  ${BLUE}3.${NC} Create a module: ${GREEN}pnpm cli create-module dashboard${NC}"
echo -e "  ${BLUE}4.${NC} Run tests: ${GREEN}pnpm test${NC}"
echo -e "  ${BLUE}5.${NC} Open Storybook: ${GREEN}pnpm storybook${NC}"

echo ""
echo -e "${YELLOW}Useful commands:${NC}\n"
echo -e "  ${GREEN}pnpm dev${NC}           - Start dev servers"
echo -e "  ${GREEN}pnpm build${NC}         - Build all packages"
echo -e "  ${GREEN}pnpm test${NC}          - Run tests"
echo -e "  ${GREEN}pnpm lint:fix${NC}      - Fix linting issues"
echo -e "  ${GREEN}pnpm format${NC}        - Format code"
echo -e "  ${GREEN}pnpm type-check${NC}    - Check TypeScript types"

echo ""
echo -e "${YELLOW}Documentation:${NC}"
echo -e "  • Quick Start: ${BLUE}docs/setup/QUICK-START.md${NC}"
echo -e "  • API Reference: ${BLUE}docs/packages/00-OVERVIEW.md${NC}"
echo -e "  • Examples: ${BLUE}examples/${NC}"

echo ""
