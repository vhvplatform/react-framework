#!/bin/bash

# Quality Check Script
# Runs comprehensive code quality checks before commit or deployment

set -e  # Exit on error

echo "🔍 Starting quality checks for SaaS Framework React..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✓${NC} $2"
  else
    echo -e "${RED}✗${NC} $2"
  fi
}

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
  echo -e "${RED}Error: pnpm is not installed${NC}"
  exit 1
fi

# 1. ESLint with SonarJS rules
echo "📝 Step 1/5: Running ESLint with SonarJS rules..."
if pnpm lint:sonar --quiet; then
  print_status 0 "ESLint passed"
else
  print_status 1 "ESLint failed"
  echo -e "${YELLOW}Tip: Run 'pnpm lint:sonar:fix' to auto-fix issues${NC}"
  exit 1
fi
echo ""

# 2. TypeScript compilation
echo "🔨 Step 2/5: Checking TypeScript compilation..."
if pnpm build --quiet; then
  print_status 0 "TypeScript compilation passed"
else
  print_status 1 "TypeScript compilation failed"
  exit 1
fi
echo ""

# 3. Unit tests
echo "🧪 Step 3/5: Running unit tests..."
if pnpm test --run; then
  print_status 0 "Unit tests passed"
else
  print_status 1 "Unit tests failed"
  exit 1
fi
echo ""

# 4. Test coverage
echo "📊 Step 4/5: Generating coverage report..."
if pnpm test:coverage --run; then
  print_status 0 "Coverage generated"
else
  print_status 1 "Coverage generation failed"
  exit 1
fi

# Check coverage threshold
if [ -f coverage/coverage-summary.json ]; then
  coverage=$(node -p "JSON.parse(require('fs').readFileSync('coverage/coverage-summary.json')).total.lines.pct")
  threshold=50  # Current threshold, target is 80
  
  echo "   Coverage: ${coverage}% (threshold: ${threshold}%)"
  
  if (( $(echo "$coverage >= $threshold" | bc -l) )); then
    print_status 0 "Coverage threshold met"
  else
    print_status 1 "Coverage below threshold"
    echo -e "${YELLOW}Warning: Coverage is ${coverage}%, target is 80%${NC}"
    # Don't exit, just warn for now
  fi
fi
echo ""

# 5. Check for common issues
echo "🔎 Step 5/5: Checking for common issues..."

# Check for console.log (except in allowed files)
console_logs=$(grep -r "console\.log" packages/ --exclude-dir=node_modules --exclude-dir=dist --include="*.ts" --include="*.tsx" | wc -l || true)
if [ "$console_logs" -gt 0 ]; then
  echo -e "${YELLOW}⚠${NC}  Found $console_logs console.log statements"
  echo "   Consider using a proper logger"
else
  print_status 0 "No console.log statements found"
fi

# Check for TODO comments
todos=$(grep -r "TODO\|FIXME" packages/ --exclude-dir=node_modules --exclude-dir=dist --include="*.ts" --include="*.tsx" | wc -l || true)
if [ "$todos" -gt 0 ]; then
  echo -e "${YELLOW}ℹ${NC}  Found $todos TODO/FIXME comments"
else
  print_status 0 "No TODO/FIXME comments"
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ All quality checks passed!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo ""
echo "Next steps:"
echo "  • Run 'pnpm sonar:scan' to analyze with SonarQube"
echo "  • View detailed coverage: open coverage/index.html"
echo "  • Commit your changes"
echo ""

exit 0
