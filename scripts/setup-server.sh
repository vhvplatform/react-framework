#!/bin/bash
# Production Server Setup Script - Enhanced version
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Parse arguments
INSTALL_NGINX=true
INSTALL_PM2=true
INSTALL_CERTBOT=true
SKIP_CONFIRM=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --no-nginx)
      INSTALL_NGINX=false
      shift
      ;;
    --no-pm2)
      INSTALL_PM2=false
      shift
      ;;
    --no-certbot)
      INSTALL_CERTBOT=false
      shift
      ;;
    --skip-confirm)
      SKIP_CONFIRM=true
      shift
      ;;
    --help)
      echo "Usage: sudo ./setup-server.sh [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --no-nginx        Skip Nginx installation"
      echo "  --no-pm2          Skip PM2 installation"
      echo "  --no-certbot      Skip Certbot installation"
      echo "  --skip-confirm    Skip confirmation prompts"
      echo "  --help            Show this help message"
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
echo -e "${BLUE}║     SaaS Framework React - Server Setup                 ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}\n"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}✗ Please run as root: sudo ./setup-server.sh${NC}"
    exit 1
fi

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
    VERSION=$VERSION_ID
    echo -e "${GREEN}✓ Detected OS: $OS $VERSION${NC}\n"
else
    echo -e "${RED}✗ Cannot detect OS${NC}"
    exit 1
fi

# Confirm before proceeding
if [ "$SKIP_CONFIRM" = false ]; then
    echo -e "${YELLOW}This script will install:${NC}"
    [ "$INSTALL_NGINX" = true ] && echo "  • Node.js 18.x"
    [ "$INSTALL_NGINX" = true ] && echo "  • pnpm package manager"
    [ "$INSTALL_NGINX" = true ] && echo "  • Nginx web server"
    [ "$INSTALL_PM2" = true ] && echo "  • PM2 process manager"
    [ "$INSTALL_CERTBOT" = true ] && echo "  • Certbot for SSL/TLS"
    echo ""
    read -p "Continue? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Setup cancelled${NC}"
        exit 0
    fi
fi

echo ""

# Update package list
echo -e "${YELLOW}→ Updating package list...${NC}"
apt-get update -qq
echo -e "${GREEN}✓ Package list updated${NC}"

# Install Node.js
echo -e "${YELLOW}→ Installing Node.js...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
    echo -e "${GREEN}✓ Node.js installed: $(node -v)${NC}"
else
    echo -e "${GREEN}✓ Node.js already installed: $(node -v)${NC}"
fi

# Install pnpm
echo -e "${YELLOW}→ Installing pnpm...${NC}"
if ! command -v pnpm &> /dev/null; then
    npm install -g pnpm
    echo -e "${GREEN}✓ pnpm installed: v$(pnpm -v)${NC}"
else
    echo -e "${GREEN}✓ pnpm already installed: v$(pnpm -v)${NC}"
fi

# Install Nginx
if [ "$INSTALL_NGINX" = true ]; then
    echo -e "${YELLOW}→ Installing Nginx...${NC}"
    if ! command -v nginx &> /dev/null; then
        apt-get install -y nginx
        systemctl enable nginx
        systemctl start nginx
        echo -e "${GREEN}✓ Nginx installed and started${NC}"
    else
        echo -e "${GREEN}✓ Nginx already installed${NC}"
    fi
fi

# Install PM2
if [ "$INSTALL_PM2" = true ]; then
    echo -e "${YELLOW}→ Installing PM2...${NC}"
    if ! command -v pm2 &> /dev/null; then
        npm install -g pm2
        pm2 startup systemd -u $SUDO_USER --hp /home/$SUDO_USER
        echo -e "${GREEN}✓ PM2 installed${NC}"
    else
        echo -e "${GREEN}✓ PM2 already installed${NC}"
    fi
fi

# Install Certbot
if [ "$INSTALL_CERTBOT" = true ]; then
    echo -e "${YELLOW}→ Installing Certbot...${NC}"
    if ! command -v certbot &> /dev/null; then
        apt-get install -y certbot python3-certbot-nginx
        echo -e "${GREEN}✓ Certbot installed${NC}"
    else
        echo -e "${GREEN}✓ Certbot already installed${NC}"
    fi
fi

# Install other useful tools
echo -e "${YELLOW}→ Installing additional tools...${NC}"
apt-get install -y git curl wget htop vim ufw
echo -e "${GREEN}✓ Additional tools installed${NC}"

# Setup firewall (UFW)
echo -e "${YELLOW}→ Configuring firewall...${NC}"
if command -v ufw &> /dev/null; then
    ufw --force enable
    ufw allow ssh
    ufw allow http
    ufw allow https
    echo -e "${GREEN}✓ Firewall configured${NC}"
else
    echo -e "${YELLOW}⚠ UFW not available${NC}"
fi

# Create deployment directory
echo -e "${YELLOW}→ Creating deployment directory...${NC}"
mkdir -p /var/www/react-framework
chown -R $SUDO_USER:$SUDO_USER /var/www/react-framework
echo -e "${GREEN}✓ Directory created: /var/www/react-framework${NC}"

# Create Nginx configuration template
echo -e "${YELLOW}→ Creating Nginx configuration template...${NC}"
cat > /etc/nginx/sites-available/react-framework.template << 'EOF'
server {
    listen 80;
    server_name YOUR_DOMAIN.com;
    
    root /var/www/react-framework/dist;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API proxy
    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF
echo -e "${GREEN}✓ Nginx template created: /etc/nginx/sites-available/react-framework.template${NC}"

# Create PM2 ecosystem template
echo -e "${YELLOW}→ Creating PM2 ecosystem template...${NC}"
cat > /var/www/react-framework/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'react-framework',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/react-framework',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/react-framework/error.log',
    out_file: '/var/log/react-framework/out.log',
    time: true,
    watch: false,
    max_memory_restart: '1G',
    min_uptime: '10s',
    max_restarts: 10,
  }]
};
EOF
chown $SUDO_USER:$SUDO_USER /var/www/react-framework/ecosystem.config.js
echo -e "${GREEN}✓ PM2 ecosystem template created${NC}"

# Create log directories
mkdir -p /var/log/react-framework
chown -R $SUDO_USER:$SUDO_USER /var/log/react-framework

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          Server Setup Complete! ✓                        ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"

echo ""
echo -e "${YELLOW}Next steps:${NC}\n"

echo -e "${BLUE}1. Deploy your application:${NC}"
echo -e "   cd /var/www/react-framework"
echo -e "   git clone YOUR_REPO ."
echo -e "   pnpm install"
echo -e "   pnpm build"

echo ""
echo -e "${BLUE}2. Configure Nginx:${NC}"
echo -e "   # Edit the template with your domain"
echo -e "   sudo nano /etc/nginx/sites-available/react-framework.template"
echo -e "   "
echo -e "   # Enable the site"
echo -e "   sudo ln -s /etc/nginx/sites-available/react-framework.template /etc/nginx/sites-enabled/react-framework"
echo -e "   sudo nginx -t"
echo -e "   sudo systemctl reload nginx"

echo ""
echo -e "${BLUE}3. Setup SSL with Certbot:${NC}"
echo -e "   sudo certbot --nginx -d YOUR_DOMAIN.com"

echo ""
echo -e "${BLUE}4. Start with PM2:${NC}"
echo -e "   pm2 start ecosystem.config.js"
echo -e "   pm2 save"

echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo -e "  ${GREEN}pm2 status${NC}              - Check app status"
echo -e "  ${GREEN}pm2 logs${NC}                - View logs"
echo -e "  ${GREEN}pm2 restart all${NC}         - Restart apps"
echo -e "  ${GREEN}pm2 monit${NC}               - Monitor resources"
echo -e "  ${GREEN}nginx -t${NC}                - Test Nginx config"
echo -e "  ${GREEN}systemctl status nginx${NC}  - Check Nginx status"

echo ""
echo -e "${YELLOW}Documentation:${NC}"
echo -e "  • Deployment Guide: ${BLUE}DEPLOYMENT.md${NC}"
echo -e "  • Server Setup: ${BLUE}docs/setup/SETUP-SERVER.md${NC}"

echo ""
