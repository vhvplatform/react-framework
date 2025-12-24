#!/bin/bash
# Development Setup Script
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}SaaS Framework React - Dev Setup${NC}\n"

# Check Node.js
echo -e "${YELLOW}Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not installed${NC}"
    exit 1
fi
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 18+ required (current: $(node -v))${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v)${NC}"

# Check pnpm
echo -e "${YELLOW}Checking pnpm...${NC}"
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}Installing pnpm...${NC}"
    npm install -g pnpm
fi
echo -e "${GREEN}✅ pnpm $(pnpm -v)${NC}"

# Install dependencies
echo -e "\n${YELLOW}Installing dependencies...${NC}"
pnpm install
echo -e "${GREEN}✅ Dependencies installed${NC}"

# Build packages
echo -e "\n${YELLOW}Building packages...${NC}"
pnpm build
echo -e "${GREEN}✅ Packages built${NC}"

# Create .env
if [ ! -f .env ]; then
    cat > .env << 'EOF'
NODE_ENV=development
API_URL=http://localhost:8080
PUBLIC_URL=http://localhost:5173
EOF
    echo -e "${GREEN}✅ .env created${NC}"
fi

# Validate
echo -e "\n${YELLOW}Validating...${NC}"
pnpm typecheck
echo -e "${GREEN}✅ Type check passed${NC}"

echo -e "\n${GREEN}✅ Setup Complete!${NC}\n"
echo -e "Next steps:"
echo -e "  ${YELLOW}pnpm dev${NC} - Start development"
echo -e "  ${YELLOW}pnpm cli create-app my-app${NC} - Create app"
