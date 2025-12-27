# Production Server Deployment

Deploy SaaS Framework React to production server with Nginx, PM2, and SSL.

## Prerequisites

- **Ubuntu 20.04+** or similar Linux distribution
- **Root or sudo access**
- **Domain name** pointed to server IP
- **SSH access** to server

## Quick Deployment (Automated)

### Method 1: Full Server Setup

```bash
# On your local machine, copy script to server
scp scripts/setup-server.sh user@your-server.com:~/

# SSH to server
ssh user@your-server.com

# Run automated setup (installs Node.js, pnpm, Nginx, PM2, Certbot)
sudo ./setup-server.sh
```

### Method 2: Customized Setup

```bash
# SSH to server
ssh user@your-server.com

# Run with options
sudo ./setup-server.sh --no-nginx      # Skip Nginx installation
sudo ./setup-server.sh --no-pm2        # Skip PM2 installation
sudo ./setup-server.sh --no-certbot    # Skip Certbot installation
sudo ./setup-server.sh --skip-confirm  # Skip confirmation prompts
sudo ./setup-server.sh --help          # Show all options
```

### What Gets Installed

The automated script installs:
- ✅ Node.js 18.x
- ✅ pnpm package manager
- ✅ Nginx web server (optional)
- ✅ PM2 process manager (optional)
- ✅ Certbot for SSL/TLS (optional)
- ✅ UFW firewall configuration
- ✅ Deployment directory structure
- ✅ Configuration templates

📖 **[Complete Installation Guide](../../INSTALLATION.md)** - All deployment methods and options

## Manual Deployment

### 1. Install Node.js & pnpm

```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Verify
node -v && pnpm -v
```

### 2. Install Nginx

```bash
sudo apt-get update
sudo apt-get install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 3. Install PM2

```bash
npm install -g pm2
pm2 startup
# Run the command it outputs
```

### 4. Deploy Application

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/vhvplatform/react-framework.git
cd react-framework

# Install & build
pnpm install --frozen-lockfile
pnpm build

# Start with PM2
pm2 start npm --name "react-framework" -- start
pm2 save
```

### 5. Configure Nginx

Create `/etc/nginx/sites-available/react-framework`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/react-framework /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. SSL with Let's Encrypt

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
# Follow prompts for SSL setup
```

## Environment Configuration

Create `/var/www/react-framework/.env.production`:

```bash
NODE_ENV=production
API_URL=https://api.your-domain.com
PUBLIC_URL=https://your-domain.com
```

## Monitoring & Maintenance

### PM2 Commands

```bash
pm2 list            # List processes
pm2 logs            # View logs
pm2 restart all     # Restart
pm2 stop all        # Stop
pm2 monit           # Monitor
```

### Update Deployment

```bash
cd /var/www/react-framework
git pull
pnpm install
pnpm build
pm2 restart all
```

### Backup

```bash
# Backup script
#!/bin/bash
BACKUP_DIR="/backup/react-framework"
DATE=$(date +%Y%m%d-%H%M%S)
tar -czf $BACKUP_DIR/backup-$DATE.tar.gz /var/www/react-framework
```

## Security

### Firewall

```bash
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### Fail2Ban

```bash
sudo apt-get install -y fail2ban
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

## Troubleshooting

### Check logs
```bash
pm2 logs
sudo tail -f /var/log/nginx/error.log
```

### Restart services
```bash
pm2 restart all
sudo systemctl restart nginx
```

---

**Server deployed! 🎉**

Next: [CI/CD Setup](./SETUP-CICD.md) →
