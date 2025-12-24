#!/bin/bash
# Production Server Setup Script
set -e

echo "SaaS Framework React - Server Setup"
echo "===================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root: sudo ./setup-server.sh"
    exit 1
fi

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Install Nginx
apt-get install -y nginx
systemctl enable nginx

# Install PM2
npm install -g pm2
pm2 startup

# Install Let's Encrypt
apt-get install -y certbot python3-certbot-nginx

echo "✅ Server setup complete!"
echo ""
echo "Next steps:"
echo "1. Clone your repository to /var/www"
echo "2. Run: pnpm install && pnpm build"
echo "3. Start with PM2: pm2 start npm --name app -- start"
echo "4. Configure Nginx (see docs/SETUP-SERVER.md)"
echo "5. Setup SSL: certbot --nginx -d your-domain.com"
