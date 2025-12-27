# Configuration Presets

Pre-configured setup examples for common use cases.

## Development Presets

### Preset 1: Quick Start Developer

For developers who want to quickly get started with minimal setup:

```bash
# Clone and quick setup
git clone https://github.com/vhvplatform/react-framework.git
cd react-framework
./scripts/setup-quick.sh

# Complete setup when ready
./scripts/setup.sh development
```

**Use case:**

- First-time users
- Quick evaluation
- Learning the framework

### Preset 2: Full Stack Developer

For developers working on both frontend and backend:

```bash
# Full development setup
./scripts/setup-dev.sh

# Create sample app
pnpm cli create-app my-app
cd my-app
pnpm install
pnpm dev
```

**Use case:**

- Active development
- Contributing to framework
- Building complex applications

### Preset 3: Package Developer

For developers working on specific packages:

```bash
# Setup without building all packages
./scripts/setup-dev.sh --skip-build

# Build only needed packages
cd packages/your-package
pnpm build
pnpm dev
```

**Use case:**

- Package-specific development
- Faster iteration
- Isolated testing

## Production Presets

### Preset 1: Simple VPS Deployment

For deploying to a single VPS server:

```bash
# On server
sudo ./scripts/setup-server.sh

# Deploy application
cd /var/www/react-framework
git clone YOUR_REPO .
pnpm install --prod
pnpm build

# Configure Nginx
sudo nano /etc/nginx/sites-available/react-framework.template
# Update domain and settings

# Enable site
sudo ln -s /etc/nginx/sites-available/react-framework.template \
            /etc/nginx/sites-enabled/react-framework
sudo nginx -t
sudo systemctl reload nginx

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
```

**Use case:**

- Small to medium applications
- Single server deployment
- Cost-effective hosting

### Preset 2: Docker Deployment

For containerized deployment:

```bash
# Build image
docker build -t react-framework:latest .

# Run with docker-compose
docker-compose up -d

# Or run standalone
docker run -d \
  --name react-framework \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e VITE_API_URL=https://api.example.com \
  react-framework:latest
```

**Use case:**

- Containerized environments
- Easy scaling
- Consistent deployment

### Preset 3: Kubernetes Microservices

For large-scale microservices deployment:

```bash
# Build and push image
docker build -t your-registry/react-framework:v1.0.0 .
docker push your-registry/react-framework:v1.0.0

# Deploy with Helm
helm install react-framework ./helm/react-framework \
  --namespace production \
  --create-namespace \
  --values ./helm/react-framework/values-prod.yaml

# Monitor deployment
kubectl get pods -n production -w
```

**Use case:**

- Enterprise applications
- High availability requirements
- Auto-scaling needs

## CI/CD Presets

### Preset 1: GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install --prod

      - name: Build
        run: pnpm build

      - name: Deploy
        run: |
          # Your deployment commands
```

### Preset 2: GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - build
  - deploy

build:
  stage: build
  image: node:18
  script:
    - npm install -g pnpm
    - pnpm install
    - pnpm build
  artifacts:
    paths:
      - packages/*/dist

deploy:
  stage: deploy
  script:
    -  # Your deployment commands
  only:
    - main
```

## Environment Presets

### Development Environment

```bash
# .env.development
NODE_ENV=development
VITE_API_URL=http://localhost:8080
PUBLIC_URL=http://localhost:5173
LOG_LEVEL=debug
VITE_ENABLE_DEVTOOLS=true
VITE_FEATURE_FLAGS=experimental,beta
```

### Staging Environment

```bash
# .env.staging
NODE_ENV=production
VITE_API_URL=https://staging-api.example.com
PUBLIC_URL=https://staging.example.com
LOG_LEVEL=info
VITE_ENABLE_DEVTOOLS=true
VITE_FEATURE_FLAGS=beta
```

### Production Environment

```bash
# .env.production
NODE_ENV=production
VITE_API_URL=https://api.example.com
PUBLIC_URL=https://example.com
LOG_LEVEL=error
VITE_ENABLE_DEVTOOLS=false
VITE_FEATURE_FLAGS=stable
```

## Team Presets

### Preset 1: Frontend Team

Focus on UI development without backend:

```bash
# Setup
./scripts/setup-dev.sh

# Use mock API
cat > .env.local << EOF
VITE_API_URL=http://localhost:3001
VITE_USE_MOCK_API=true
EOF

# Start mock server (if available)
pnpm mock-server

# Start development
pnpm dev
```

### Preset 2: Backend Integration Team

Focus on API integration:

```bash
# Setup
./scripts/setup-dev.sh

# Configure backend URL
cat > .env.local << EOF
VITE_API_URL=http://localhost:8080
VITE_DEBUG_API=true
EOF

# Start development
pnpm dev
```

### Preset 3: QA/Testing Team

Focus on testing and quality assurance:

```bash
# Setup
./scripts/setup-dev.sh

# Run tests
pnpm test:watch

# Run with coverage
pnpm test:coverage

# Run E2E tests (if available)
pnpm test:e2e
```

## VS Code Workspace Presets

### Development Workspace

```json
{
  "folders": [
    {
      "path": "."
    }
  ],
  "settings": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    },
    "typescript.tsdk": "node_modules/typescript/lib",
    "typescript.enablePromptUseWorkspaceTsdk": true,
    "files.exclude": {
      "**/node_modules": true,
      "**/dist": true,
      "**/.turbo": true
    },
    "search.exclude": {
      "**/node_modules": true,
      "**/dist": true,
      "pnpm-lock.yaml": true
    }
  },
  "extensions": {
    "recommendations": [
      "esbenp.prettier-vscode",
      "dbaeumer.vscode-eslint",
      "bradlc.vscode-tailwindcss",
      "ms-vscode.vscode-typescript-next"
    ]
  }
}
```

### Package Development Workspace

```json
{
  "folders": [
    {
      "path": "packages/core",
      "name": "Core"
    },
    {
      "path": "packages/auth",
      "name": "Auth"
    },
    {
      "path": "packages/ui-components",
      "name": "UI Components"
    }
  ],
  "settings": {
    "editor.formatOnSave": true,
    "typescript.tsdk": "../../node_modules/typescript/lib"
  }
}
```

## Custom Presets

### Creating Your Own Preset

1. **Save your configuration:**

```bash
# Export your environment
cp .env .env.preset-name

# Save installed packages
pnpm list --json > preset-packages.json
```

2. **Document setup steps:**

```bash
cat > PRESET_NAME.md << EOF
# My Custom Preset

## Setup
\`\`\`bash
./scripts/setup-dev.sh
pnpm add custom-package
# ... more steps
\`\`\`

## Configuration
\`\`\`bash
cp .env.preset-name .env
\`\`\`
EOF
```

3. **Share with team:**

```bash
# Commit preset files
git add .env.preset-name PRESET_NAME.md
git commit -m "Add custom preset"
```

## Troubleshooting Presets

If a preset doesn't work:

1. **Check prerequisites:**

   ```bash
   ./scripts/verify-installation.sh
   ```

2. **Clean and retry:**

   ```bash
   pnpm clean
   rm -rf node_modules
   ./scripts/setup.sh development
   ```

3. **Check documentation:**
   - [Installation Guide](../INSTALLATION.md)
   - [Troubleshooting](./setup/TROUBLESHOOTING.md)

## Next Steps

After applying a preset:

1. **Verify setup:**

   ```bash
   ./scripts/verify-installation.sh
   ```

2. **Start development:**

   ```bash
   pnpm dev
   ```

3. **Create your first app:**
   ```bash
   pnpm cli create-app my-app
   ```

---

**Questions?** Check the [Installation Guide](../INSTALLATION.md) or [open an issue](https://github.com/vhvplatform/react-framework/issues).
