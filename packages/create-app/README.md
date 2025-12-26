# @vhvplatform/create-app

CLI tool to bootstrap new SaaS applications using the @vhvplatform framework.

## Usage

### Interactive Mode

```bash
npx @vhvplatform/create-app
```

### With App Name

```bash
npx @vhvplatform/create-app my-saas-app
```

### With Options

```bash
npx @vhvplatform/create-app my-saas-app \
  --template blank \
  --version latest \
  --registry https://registry.npmjs.org \
  --skip-git \
  --skip-install
```

## Options

- `--template <name>` - Template to use (integration-portal, crm, admin-dashboard, blank)
- `--framework-version <version>` - Framework version (latest or specific version like 1.0.0)
- `--registry <url>` - NPM registry URL
- `--package-manager <manager>` - Package manager to use (npm, pnpm, yarn)
- `--skip-git` - Skip git initialization
- `--skip-install` - Skip dependency installation
- `--verbose` - Enable verbose logging

## What It Creates

The CLI will create a new SaaS application with:

- Full project structure (src, public, scripts, hooks, utils, types)
- Package.json with all @vhvplatform dependencies
- TypeScript configuration
- Vite configuration
- Tailwind CSS setup
- ESLint and Prettier configuration
- PostCSS configuration
- EditorConfig for consistent formatting
- VSCode settings and recommended extensions
- Git repository (optional)
- CI/CD workflows (GitHub Actions, GitLab CI)
- Deployment configuration (Kubernetes, Vercel, AWS, Docker)
- **Kubernetes manifests** (if Kubernetes deployment selected)
- **Dockerfile and Docker Compose** (if Kubernetes or Docker deployment selected)
- **Helm charts** (if Kubernetes deployment selected)
- **Service mesh configuration** (if microservices enabled)

## Templates

### Blank

Minimal setup with core framework packages.

### Integration Portal

Developer portal with API documentation.

### CRM

Customer relationship management application.

### Admin Dashboard

Admin panel with user management.

## Generated Structure

```
my-saas-app/
├── src/
│   ├── main.tsx
│   ├── index.css
│   ├── modules/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── types/
├── public/
├── scripts/
├── k8s/                      # Kubernetes manifests (if K8s deployment)
│   ├── deployment.yaml
│   ├── hpa.yaml
│   ├── kustomization.yaml
│   ├── virtual-service.yaml  # If microservices enabled
│   ├── destination-rule.yaml # If microservices enabled
│   └── README.md
├── helm/                     # Helm charts (if K8s deployment)
│   └── my-saas-app/
│       ├── Chart.yaml
│       ├── values.yaml
│       └── templates/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── deploy.yml       # Or k8s-deploy.yml for Kubernetes
│       └── k8s-deploy.yml   # Kubernetes-specific
├── .vscode/
│   ├── settings.json
│   └── extensions.json
├── Dockerfile               # If Docker/K8s deployment
├── docker-compose.yml       # For local development
├── nginx.conf               # Nginx configuration for container
├── healthcheck.sh          # Health check script
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── .editorconfig
├── .eslintrc.json
├── .prettierrc
├── .prettierignore
├── .dockerignore           # If Docker/K8s deployment
├── .gitignore
├── .npmrc                  # If using private registry
├── .env.example
└── README.md
```

## Deployment Options

### Kubernetes (Microservices)

**NEW!** Full Kubernetes support with:

- Deployment, Service, ConfigMap, Ingress manifests
- Horizontal Pod Autoscaler for auto-scaling
- Kustomize configuration for environment management
- Helm charts for easier deployment
- Service mesh configuration (Istio) for microservices
- GitHub Actions workflow for CI/CD
- Health check and readiness probes
- Multi-stage Dockerfile with nginx
- Security best practices (non-root user, read-only filesystem)

### Vercel

Optimized for serverless React applications with automatic deployments.

### AWS

Amazon Web Services configuration for scalable cloud deployment.

### Docker

Containerized deployment with Docker Compose for local development.

## Next Steps

After creating your app:

```bash
cd my-saas-app
npm install  # if you used --skip-install
npm run dev
```

### For Kubernetes Deployment

If you selected Kubernetes as your deployment target:

1. **Build Docker image:**

   ```bash
   docker build -t my-saas-app:latest .
   ```

2. **Deploy to Kubernetes:**

   ```bash
   # Using kubectl
   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/hpa.yaml

   # Using Helm
   helm install my-saas-app ./helm/my-saas-app -n default

   # Using Kustomize
   kubectl apply -k k8s/
   ```

3. **Check deployment status:**
   ```bash
   kubectl get pods
   kubectl get svc
   ```

See `k8s/README.md` for comprehensive deployment instructions.

## Microservices Architecture

When deploying to Kubernetes with microservices enabled, you get:

- **Service mesh integration** (Istio) for advanced traffic management
- **Circuit breakers** and **retries** for resilience
- **Load balancing** and **connection pooling**
- **Traffic splitting** for canary deployments
- **Distributed tracing** support
- **Mutual TLS** for secure service-to-service communication

## Private Registry

To use a private registry (GitHub Packages, custom):

```bash
npx @vhvplatform/create-app my-app --registry https://npm.pkg.github.com
```

The CLI will create a `.npmrc` file with the registry configuration. Make sure to set your `NPM_TOKEN` environment variable.

## Requirements

- Node.js >= 18.0.0
- npm >= 8.0.0

## License

MIT
