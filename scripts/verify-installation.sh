#!/bin/bash
# Post-Install Verification Script
# Validates that the installation was successful
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     SaaS Framework React - Installation Verification    ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}\n"

ERRORS=0
WARNINGS=0

# Function to check command exists
command_exists() {
  command -v "$1" &> /dev/null
}

# Function to run check
check() {
  local name=$1
  local command=$2
  local required=$3
  
  echo -e "${YELLOW}→ Checking $name...${NC}"
  
  if eval "$command" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ $name OK${NC}"
    return 0
  else
    if [ "$required" = "true" ]; then
      echo -e "${RED}✗ $name FAILED (required)${NC}"
      ERRORS=$((ERRORS + 1))
    else
      echo -e "${YELLOW}⚠ $name FAILED (optional)${NC}"
      WARNINGS=$((WARNINGS + 1))
    fi
    return 1
  fi
}

echo -e "${BLUE}=== System Requirements ===${NC}\n"

# Check Node.js
if command_exists node; then
  NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
  if [ "$NODE_VERSION" -ge 18 ]; then
    echo -e "${GREEN}✓ Node.js $(node -v) (≥18 required)${NC}"
  else
    echo -e "${RED}✗ Node.js $(node -v) (≥18 required)${NC}"
    ERRORS=$((ERRORS + 1))
  fi
else
  echo -e "${RED}✗ Node.js not found${NC}"
  ERRORS=$((ERRORS + 1))
fi

# Check pnpm
if command_exists pnpm; then
  echo -e "${GREEN}✓ pnpm v$(pnpm -v)${NC}"
else
  echo -e "${RED}✗ pnpm not found${NC}"
  ERRORS=$((ERRORS + 1))
fi

# Check Git
if command_exists git; then
  echo -e "${GREEN}✓ Git $(git --version | cut -d ' ' -f 3)${NC}"
else
  echo -e "${YELLOW}⚠ Git not found (recommended)${NC}"
  WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo -e "${BLUE}=== Dependencies ===${NC}\n"

# Check if node_modules exists
if [ -d "node_modules" ]; then
  echo -e "${GREEN}✓ node_modules directory exists${NC}"
  
  # Count packages
  PKG_COUNT=$(find node_modules -maxdepth 2 -type d | wc -l)
  echo -e "${GREEN}✓ $PKG_COUNT packages installed${NC}"
else
  echo -e "${RED}✗ node_modules not found${NC}"
  echo -e "  Run: ${BLUE}pnpm install${NC}"
  ERRORS=$((ERRORS + 1))
fi

# Check pnpm-lock.yaml
if [ -f "pnpm-lock.yaml" ]; then
  echo -e "${GREEN}✓ pnpm-lock.yaml exists${NC}"
else
  echo -e "${YELLOW}⚠ pnpm-lock.yaml not found${NC}"
  WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo -e "${BLUE}=== Packages ===${NC}\n"

# Check if packages are built
BUILT_PACKAGES=0
TOTAL_PACKAGES=0

for pkg in packages/*/; do
  if [ -d "$pkg" ]; then
    TOTAL_PACKAGES=$((TOTAL_PACKAGES + 1))
    pkg_name=$(basename "$pkg")
    
    if [ -d "${pkg}dist" ]; then
      echo -e "${GREEN}✓ @vhvplatform/$pkg_name built${NC}"
      BUILT_PACKAGES=$((BUILT_PACKAGES + 1))
    else
      echo -e "${YELLOW}⚠ @vhvplatform/$pkg_name not built${NC}"
      WARNINGS=$((WARNINGS + 1))
    fi
  fi
done

if [ "$BUILT_PACKAGES" -eq 0 ] && [ "$TOTAL_PACKAGES" -gt 0 ]; then
  echo -e "\n${YELLOW}  No packages built. Run: ${BLUE}pnpm build${NC}"
fi

echo ""
echo -e "${BLUE}=== Configuration ===${NC}\n"

# Check .env
if [ -f ".env" ]; then
  echo -e "${GREEN}✓ .env file exists${NC}"
  
  # Check required env vars
  if grep -q "NODE_ENV" .env; then
    echo -e "${GREEN}✓ NODE_ENV configured${NC}"
  else
    echo -e "${YELLOW}⚠ NODE_ENV not set in .env${NC}"
    WARNINGS=$((WARNINGS + 1))
  fi
else
  echo -e "${YELLOW}⚠ .env file not found (will use defaults)${NC}"
  WARNINGS=$((WARNINGS + 1))
fi

# Check TypeScript configuration
if [ -f "tsconfig.json" ]; then
  echo -e "${GREEN}✓ tsconfig.json exists${NC}"
else
  echo -e "${RED}✗ tsconfig.json not found${NC}"
  ERRORS=$((ERRORS + 1))
fi

# Check ESLint configuration
if [ -f ".eslintrc.json" ] || [ -f ".eslintrc.js" ]; then
  echo -e "${GREEN}✓ ESLint configuration exists${NC}"
else
  echo -e "${YELLOW}⚠ ESLint configuration not found${NC}"
  WARNINGS=$((WARNINGS + 1))
fi

# Check Prettier configuration
if [ -f ".prettierrc" ] || [ -f "prettier.config.js" ]; then
  echo -e "${GREEN}✓ Prettier configuration exists${NC}"
else
  echo -e "${YELLOW}⚠ Prettier configuration not found${NC}"
  WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo -e "${BLUE}=== Project Structure ===${NC}\n"

# Check key directories
for dir in "packages" "scripts" "docs"; do
  if [ -d "$dir" ]; then
    echo -e "${GREEN}✓ $dir/ directory exists${NC}"
  else
    echo -e "${RED}✗ $dir/ directory missing${NC}"
    ERRORS=$((ERRORS + 1))
  fi
done

echo ""
echo -e "${BLUE}=== Optional Tools ===${NC}\n"

# Check Docker
if command_exists docker; then
  echo -e "${GREEN}✓ Docker $(docker --version | cut -d ' ' -f 3 | cut -d ',' -f 1)${NC}"
else
  echo -e "${YELLOW}⊘ Docker not installed (optional)${NC}"
fi

# Check Docker Compose
if command_exists docker-compose; then
  echo -e "${GREEN}✓ Docker Compose $(docker-compose --version | cut -d ' ' -f 4 | cut -d ',' -f 1)${NC}"
else
  echo -e "${YELLOW}⊘ Docker Compose not installed (optional)${NC}"
fi

# Check kubectl
if command_exists kubectl; then
  echo -e "${GREEN}✓ kubectl $(kubectl version --client -o json 2>/dev/null | grep -o '"gitVersion":"[^"]*"' | cut -d '"' -f 4)${NC}"
else
  echo -e "${YELLOW}⊘ kubectl not installed (optional)${NC}"
fi

echo ""
echo -e "${BLUE}=== Summary ===${NC}\n"

if [ "$ERRORS" -eq 0 ] && [ "$WARNINGS" -eq 0 ]; then
  echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║          All Checks Passed! ✓                            ║${NC}"
  echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo -e "${GREEN}Your installation is ready to use!${NC}"
  echo ""
  echo -e "${YELLOW}Next steps:${NC}"
  echo -e "  ${BLUE}1.${NC} Start development: ${GREEN}pnpm dev${NC}"
  echo -e "  ${BLUE}2.${NC} Create an app: ${GREEN}pnpm cli create-app my-app${NC}"
  echo -e "  ${BLUE}3.${NC} Read documentation: ${GREEN}cat README.md${NC}"
  exit 0
elif [ "$ERRORS" -eq 0 ]; then
  echo -e "${YELLOW}⚠ $WARNINGS warning(s) found${NC}"
  echo -e "\n${YELLOW}Installation is functional but some optional features may not work.${NC}"
  echo -e "\nYou can proceed with development."
  exit 0
else
  echo -e "${RED}✗ $ERRORS error(s) and $WARNINGS warning(s) found${NC}"
  echo -e "\n${RED}Installation has critical issues that must be fixed.${NC}"
  echo ""
  echo -e "${YELLOW}Recommended actions:${NC}"
  
  if ! command_exists node; then
    echo -e "  • Install Node.js 18+: ${BLUE}https://nodejs.org/${NC}"
  fi
  
  if ! command_exists pnpm; then
    echo -e "  • Install pnpm: ${BLUE}npm install -g pnpm${NC}"
  fi
  
  if [ ! -d "node_modules" ]; then
    echo -e "  • Install dependencies: ${BLUE}pnpm install${NC}"
  fi
  
  if [ "$BUILT_PACKAGES" -eq 0 ] && [ "$TOTAL_PACKAGES" -gt 0 ]; then
    echo -e "  • Build packages: ${BLUE}pnpm build${NC}"
  fi
  
  echo ""
  echo -e "  Or run: ${BLUE}./scripts/setup.sh development${NC}"
  echo ""
  exit 1
fi
