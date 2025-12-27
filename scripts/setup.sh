#!/bin/bash
# Unified Setup Script for SaaS Framework React
# Supports quick, development, and production setup modes
set -e

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Setup mode (default: development)
SETUP_MODE="${1:-development}"

# Display banner
echo -e "${BLUE}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║        SaaS Framework React - Setup Assistant            ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Display mode
case "$SETUP_MODE" in
  quick)
    echo -e "${YELLOW}Mode: Quick Setup (minimal installation)${NC}\n"
    ;;
  development|dev)
    echo -e "${YELLOW}Mode: Development Setup (full environment)${NC}\n"
    SETUP_MODE="development"
    ;;
  production|prod)
    echo -e "${YELLOW}Mode: Production Setup (optimized build)${NC}\n"
    SETUP_MODE="production"
    ;;
  *)
    echo -e "${RED}Error: Invalid mode. Use: quick, development, or production${NC}"
    echo -e "Usage: ./setup.sh [quick|development|production]"
    exit 1
    ;;
esac

# Function to check if command exists
command_exists() {
  command -v "$1" &> /dev/null
}

# Function to print status
print_status() {
  echo -e "${BLUE}==>${NC} $1"
}

print_success() {
  echo -e "${GREEN}✓${NC} $1"
}

print_error() {
  echo -e "${RED}✗${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

# Check prerequisites
print_status "Checking prerequisites..."

# Check Node.js
if ! command_exists node; then
  print_error "Node.js not installed"
  echo -e "\nPlease install Node.js 18+ from: ${BLUE}https://nodejs.org/${NC}"
  exit 1
fi

NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
  print_error "Node.js 18+ required (current: $(node -v))"
  echo -e "\nPlease upgrade Node.js from: ${BLUE}https://nodejs.org/${NC}"
  exit 1
fi
print_success "Node.js $(node -v)"

# Check or install pnpm
if ! command_exists pnpm; then
  print_warning "pnpm not installed. Installing..."
  npm install -g pnpm
fi
PNPM_VERSION=$(pnpm -v)
print_success "pnpm v${PNPM_VERSION}"

# Check Git
if ! command_exists git; then
  print_warning "Git not installed (recommended)"
else
  print_success "Git $(git --version | cut -d ' ' -f 3)"
fi

echo ""

# Install dependencies
print_status "Installing dependencies..."
if [ "$SETUP_MODE" = "quick" ]; then
  # Quick mode: install only core dependencies
  print_warning "Quick mode: Installing core dependencies only"
  print_warning "Note: Some packages may require build scripts to function properly"
  pnpm install --prod --ignore-scripts
else
  # Full installation
  pnpm install
fi
print_success "Dependencies installed"

echo ""

# Build packages
if [ "$SETUP_MODE" != "quick" ]; then
  print_status "Building packages..."
  
  if [ "$SETUP_MODE" = "production" ]; then
    # Production build with optimizations
    NODE_ENV=production pnpm build
  else
    # Development build
    pnpm build
  fi
  
  print_success "Packages built successfully"
  echo ""
fi

# Create environment file
if [ ! -f .env ]; then
  print_status "Creating environment file..."
  
  if [ "$SETUP_MODE" = "production" ]; then
    cat > .env << 'EOF'
NODE_ENV=production
VITE_API_URL=https://api.example.com
PUBLIC_URL=https://example.com
LOG_LEVEL=error
EOF
  else
    cat > .env << 'EOF'
NODE_ENV=development
VITE_API_URL=http://localhost:8080
PUBLIC_URL=http://localhost:5173
LOG_LEVEL=debug
EOF
  fi
  
  print_success "Environment file created (.env)"
else
  print_warning "Environment file already exists (.env)"
fi

echo ""

# Validation
if [ "$SETUP_MODE" != "quick" ]; then
  print_status "Running validation checks..."
  
  # Type check
  if pnpm type-check > /dev/null 2>&1; then
    print_success "Type checking passed"
  else
    print_warning "Type checking failed (non-critical)"
  fi
  
  # Lint check
  if pnpm lint > /dev/null 2>&1; then
    print_success "Linting passed"
  else
    print_warning "Linting issues found (run: pnpm lint:fix)"
  fi
  
  echo ""
fi

# Setup Git hooks (development only)
if [ "$SETUP_MODE" = "development" ]; then
  if [ -d .git ]; then
    print_status "Setting up Git hooks..."
    pnpm prepare > /dev/null 2>&1 || true
    print_success "Git hooks configured"
    echo ""
  fi
fi

# Display summary
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}║              Setup Completed Successfully! ✓              ║${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"

echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo ""

if [ "$SETUP_MODE" = "quick" ]; then
  echo -e "  ${BLUE}1.${NC} Complete setup: ${GREEN}./scripts/setup.sh development${NC}"
  echo -e "  ${BLUE}2.${NC} Build packages: ${GREEN}pnpm build${NC}"
  echo -e "  ${BLUE}3.${NC} Start development: ${GREEN}pnpm dev${NC}"
elif [ "$SETUP_MODE" = "development" ]; then
  echo -e "  ${BLUE}1.${NC} Start development server: ${GREEN}pnpm dev${NC}"
  echo -e "  ${BLUE}2.${NC} Create a new app: ${GREEN}pnpm cli create-app my-app${NC}"
  echo -e "  ${BLUE}3.${NC} Create a module: ${GREEN}pnpm cli create-module dashboard${NC}"
  echo -e "  ${BLUE}4.${NC} Run tests: ${GREEN}pnpm test${NC}"
  echo -e "  ${BLUE}5.${NC} View documentation: ${GREEN}cat README.md${NC}"
else # production
  echo -e "  ${BLUE}1.${NC} Start production server: ${GREEN}pnpm start${NC}"
  echo -e "  ${BLUE}2.${NC} Deploy with Docker: ${GREEN}./scripts/deploy-docker.sh${NC}"
  echo -e "  ${BLUE}3.${NC} Deploy to Kubernetes: ${GREEN}./scripts/deploy-k8s.sh${NC}"
  echo -e "  ${BLUE}4.${NC} View deployment guide: ${GREEN}cat DEPLOYMENT.md${NC}"
fi

echo ""
echo -e "${YELLOW}Documentation:${NC}"
echo -e "  • Quick Start: ${BLUE}docs/setup/QUICK-START.md${NC}"
echo -e "  • Dev Setup: ${BLUE}docs/setup/SETUP-DEV.md${NC}"
echo -e "  • Troubleshooting: ${BLUE}docs/setup/TROUBLESHOOTING.md${NC}"

echo ""
echo -e "${YELLOW}Need help?${NC}"
echo -e "  • GitHub Issues: ${BLUE}https://github.com/vhvplatform/react-framework/issues${NC}"
echo -e "  • Documentation: ${BLUE}https://github.com/vhvplatform/react-framework/tree/main/docs${NC}"

echo ""
