# Microservices Developer Guide

Complete guide for developing, testing, and deploying microservices using the @longvhv framework with Kubernetes.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Development Environment Setup](#development-environment-setup)
3. [Creating a New Microservice](#creating-a-new-microservice)
4. [Local Development](#local-development)
5. [Testing Your Microservice](#testing-your-microservice)
6. [Building and Containerizing](#building-and-containerizing)
7. [Deploying to Development/Staging](#deploying-to-developmentstaging)
8. [Deploying to Production](#deploying-to-production)
9. [Monitoring and Troubleshooting](#monitoring-and-troubleshooting)
10. [Best Practices](#best-practices)

---

## Prerequisites

### Required Tools

Install the following tools on your development machine:

```bash
# Node.js (v18 or higher)
node --version  # Should be >= 18.0.0

# Package manager (npm, pnpm, or yarn)
npm --version   # or pnpm --version

# Docker (for containerization)
docker --version

# kubectl (Kubernetes CLI)
kubectl version --client

# Helm (optional, for Helm deployments)
helm version

# Git
git --version
```

### Access Requirements

Ensure you have access to:

- **Source Code Repository**: GitHub/GitLab account with appropriate permissions
- **Container Registry**: Access to push Docker images (GitHub Container Registry, Docker Hub, or private registry)
- **Kubernetes Cluster**: kubectl configured to access your cluster
- **NPM Registry**: Access to @longvhv packages (public or private npm registry)

### Verify Kubernetes Access

```bash
# Check cluster connection
kubectl cluster-info

# Verify you can access the target namespace
kubectl get namespaces

# Check your current context
kubectl config current-context
```

---

## Development Environment Setup

### 1. Install Framework CLI

```bash
# Install globally
npm install -g @longvhv/create-app

# Or use npx (no installation required)
npx @longvhv/create-app --version
```

### 2. Configure NPM Registry (if using private registry)

For private @longvhv packages:

```bash
# Login to npm registry
npm login --registry=https://registry.npmjs.org

# Or for GitHub Packages
npm login --registry=https://npm.pkg.github.com
```

Create `.npmrc` in your home directory:

```bash
# For GitHub Packages
@longvhv:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### 3. Set Up Git

```bash
# Configure git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Generate SSH key if needed
ssh-keygen -t ed25519 -C "your.email@example.com"
cat ~/.ssh/id_ed25519.pub  # Add to GitHub/GitLab
```

### 4. Docker Desktop Setup

```bash
# Start Docker Desktop
# On macOS: open -a Docker

# Verify Docker is running
docker ps

# Login to container registry
docker login ghcr.io  # or docker.io
```

---

## Creating a New Microservice

### Step 1: Generate Microservice Project

```bash
# Navigate to your workspace
cd ~/projects

# Create new microservice
npx @longvhv/create-app my-microservice

# The CLI will prompt you with options:
```

**Interactive Prompts:**

1. **Template**: Select `blank` for a minimal microservice
   ```
   ? Select application template:
   ❯ Blank (Minimal setup) - Recommended for new projects
     Integration Portal
     CRM Application
     Admin Dashboard
   ```

2. **Framework Version**: Choose `latest`
   ```
   ? Select framework version:
   ❯ Latest (recommended) - Always use the newest version
     Specific version - Pin to a specific version
   ```

3. **Package Registry**: Select your registry
   ```
   ? Select package registry:
   ❯ npm (Public registry)
     GitHub Packages (Private registry)
     Custom registry
   ```

4. **Initialize Git**: Select `Yes`
   ```
   ? Initialize Git repository? (Y/n) Y
   ```

5. **CI/CD Setup**: Choose `GitHub Actions`
   ```
   ? Select CI/CD platform:
   ❯ GitHub Actions (Recommended for GitHub)
     GitLab CI
     None
   ```

6. **Deployment Target**: **Select `Kubernetes`** (Important!)
   ```
   ? Select deployment target:
   ❯ Kubernetes (Microservices on K8s)
     Vercel
     AWS
     Docker
     None
   ```

7. **Enable Microservices**: Select `Yes`
   ```
   ? Enable microservices architecture features? (Y/n) Y
   ```

8. **Kubernetes Namespace**: Enter your namespace
   ```
   ? Kubernetes namespace (default: default): production
   ```

### Step 2: Explore Generated Structure

```bash
cd my-microservice
tree -L 2  # or ls -la
```

**Directory Structure:**

```
my-microservice/
├── src/                      # Application source code
│   ├── main.tsx             # Entry point
│   ├── index.css            # Global styles
│   ├── components/          # React components
│   ├── hooks/               # Custom hooks
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript types
│   └── modules/             # Business modules
├── public/                   # Static assets
├── k8s/                      # Kubernetes manifests
│   ├── deployment.yaml      # Deployment config
│   ├── hpa.yaml             # Auto-scaler
│   ├── kustomization.yaml   # Kustomize config
│   ├── virtual-service.yaml # Istio (if microservices enabled)
│   ├── destination-rule.yaml# Istio traffic policy
│   └── README.md            # Deployment guide
├── helm/                     # Helm charts
│   └── my-microservice/
│       ├── Chart.yaml
│       ├── values.yaml
│       └── templates/
├── .github/                  # CI/CD workflows
│   └── workflows/
│       ├── ci.yml           # Continuous integration
│       └── k8s-deploy.yml   # Kubernetes deployment
├── .vscode/                  # VSCode settings
│   ├── settings.json
│   └── extensions.json
├── Dockerfile                # Container image
├── docker-compose.yml        # Local development
├── nginx.conf                # Web server config
├── healthcheck.sh           # Health check script
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Build config
├── tailwind.config.js       # Tailwind CSS
├── .eslintrc.json           # ESLint rules
├── .prettierrc              # Prettier config
├── .editorconfig            # Editor settings
├── .dockerignore            # Docker build exclusions
├── .gitignore               # Git exclusions
├── .env.example             # Environment variables template
└── README.md                # Project documentation
```

### Step 3: Install Dependencies

```bash
# Install all dependencies
npm install

# This will install:
# - @longvhv/* framework packages
# - React and React Router
# - Development tools (ESLint, Prettier, TypeScript)
# - Build tools (Vite, Vitest)
```

---

## Local Development

### 1. Start Development Server

```bash
# Start Vite dev server with hot reload
npm run dev

# Output:
# VITE v5.0.0  ready in 500 ms
# ➜  Local:   http://localhost:3000/
# ➜  Network: http://192.168.1.100:3000/
```

Open browser at `http://localhost:3000`

### 2. Development with Docker Compose

For testing in a containerized environment:

```bash
# Build and start containers
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

### 3. Code Quality Checks

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### 4. Watch Mode Development

Open multiple terminals:

**Terminal 1: Dev Server**
```bash
npm run dev
```

**Terminal 2: Type Checking**
```bash
npm run type-check -- --watch
```

**Terminal 3: Tests**
```bash
npm run test -- --watch
```

### 5. Environment Variables

Copy and configure environment variables:

```bash
# Create .env file from template
cp .env.example .env

# Edit .env file
nano .env
```

**Example .env:**

```bash
# API Configuration
VITE_API_URL=http://localhost:8080

# Authentication
VITE_AUTH_ENABLED=true

# Feature Flags
VITE_FEATURE_NEW_UI=true

# Service Discovery (for microservices)
VITE_USER_SERVICE_URL=http://localhost:8081
VITE_ORDER_SERVICE_URL=http://localhost:8082
```

### 6. Hot Module Replacement (HMR)

The dev server supports HMR. Make changes to your code and see them reflected instantly:

```typescript
// src/components/Welcome.tsx
export function Welcome() {
  return <h1>Hello Microservice!</h1>; // Changes reflect immediately
}
```

---

## Testing Your Microservice

### 1. Unit Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm test -- --watch

# Run specific test file
npm test -- src/components/Welcome.test.tsx
```

**Example Test:**

```typescript
// src/components/Welcome.test.tsx
import { render, screen } from '@testing-library/react';
import { Welcome } from './Welcome';

describe('Welcome Component', () => {
  it('renders welcome message', () => {
    render(<Welcome />);
    expect(screen.getByText('Hello Microservice!')).toBeInTheDocument();
  });
});
```

### 2. Integration Tests

Test API integration:

```typescript
// src/services/api.test.ts
import { apiClient } from '@longvhv/api-client';

describe('API Integration', () => {
  it('fetches user data', async () => {
    const response = await apiClient.get('/users/1');
    expect(response.data).toHaveProperty('id', 1);
  });
});
```

### 3. UI Testing with Vitest UI

```bash
# Open Vitest UI
npm run test:ui

# This opens a browser interface for interactive testing
```

### 4. End-to-End Testing (Optional)

For E2E tests with Playwright:

```bash
# Install Playwright (first time only)
npx playwright install

# Run E2E tests
npx playwright test

# Open test UI
npx playwright test --ui
```

---

## Building and Containerizing

### 1. Production Build

```bash
# Build for production
npm run build

# Output directory: dist/
# Optimized and minified assets
```

**Verify Build:**

```bash
# Preview production build
npm run preview

# Opens at http://localhost:4173
```

### 2. Build Docker Image

```bash
# Build image
docker build -t my-microservice:latest .

# Tag for registry
docker tag my-microservice:latest ghcr.io/your-org/my-microservice:v1.0.0

# View images
docker images | grep my-microservice
```

**Multi-stage Build:**

The generated `Dockerfile` uses multi-stage builds for optimization:

- **Stage 1 (builder)**: Installs dependencies and builds application
- **Stage 2 (production)**: Uses nginx:alpine with only production artifacts

**Result**: Smaller image size (~50MB vs 500MB+)

### 3. Test Container Locally

```bash
# Run container
docker run -p 3000:3000 my-microservice:latest

# Test health endpoint
curl http://localhost:3000/health
# Response: healthy

# Test readiness endpoint
curl http://localhost:3000/ready
# Response: ready

# View logs
docker logs <container-id>

# Stop container
docker stop <container-id>
```

### 4. Push to Container Registry

```bash
# Login to registry
docker login ghcr.io -u your-username

# Push image
docker push ghcr.io/your-org/my-microservice:v1.0.0

# Verify push
docker pull ghcr.io/your-org/my-microservice:v1.0.0
```

**For GitHub Container Registry:**

```bash
# Create personal access token with write:packages scope
# Export token
export CR_PAT=your_github_token

# Login
echo $CR_PAT | docker login ghcr.io -u your-username --password-stdin

# Push
docker push ghcr.io/your-org/my-microservice:v1.0.0
```

---

## Deploying to Development/Staging

### 1. Configure kubectl for Dev Cluster

```bash
# View available contexts
kubectl config get-contexts

# Switch to dev context
kubectl config use-context dev-cluster

# Verify connection
kubectl cluster-info
```

### 2. Create Namespace (First Time)

```bash
# Create development namespace
kubectl create namespace development

# Label namespace for Istio (if using service mesh)
kubectl label namespace development istio-injection=enabled

# Verify
kubectl get namespace development --show-labels
```

### 3. Configure Environment-Specific Values

**Edit k8s/deployment.yaml** for development:

```yaml
# k8s/deployment.yaml
spec:
  replicas: 1  # Lower replicas for dev
  template:
    spec:
      containers:
      - name: my-microservice
        image: ghcr.io/your-org/my-microservice:dev-latest
        env:
        - name: VITE_API_URL
          value: "https://api-dev.example.com"
        resources:
          requests:
            memory: "128Mi"  # Lower resources for dev
            cpu: "100m"
```

### 4. Deploy Using kubectl

```bash
# Deploy to development
kubectl apply -f k8s/deployment.yaml -n development
kubectl apply -f k8s/hpa.yaml -n development

# Check deployment status
kubectl rollout status deployment/my-microservice -n development

# Verify pods are running
kubectl get pods -n development
```

### 5. Deploy Using Helm (Recommended)

```bash
# Install to development
helm install my-microservice ./helm/my-microservice \
  --namespace development \
  --create-namespace \
  --values ./helm/my-microservice/values-dev.yaml

# Upgrade existing deployment
helm upgrade my-microservice ./helm/my-microservice \
  --namespace development \
  --values ./helm/my-microservice/values-dev.yaml

# Check status
helm status my-microservice -n development

# List releases
helm list -n development
```

**Create values-dev.yaml:**

```yaml
# helm/my-microservice/values-dev.yaml
replicaCount: 1

image:
  repository: ghcr.io/your-org/my-microservice
  tag: "dev-latest"
  pullPolicy: Always

ingress:
  enabled: true
  hosts:
    - host: my-microservice-dev.example.com
      paths:
        - path: /
          pathType: Prefix

env:
  - name: VITE_API_URL
    value: https://api-dev.example.com

resources:
  limits:
    cpu: 250m
    memory: 256Mi
  requests:
    cpu: 100m
    memory: 128Mi
```

### 6. Deploy Using Kustomize

```bash
# Create overlay for dev
mkdir -p k8s/overlays/dev

# k8s/overlays/dev/kustomization.yaml
cat > k8s/overlays/dev/kustomization.yaml <<EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

namespace: development

resources:
  - ../../deployment.yaml

images:
  - name: ghcr.io/your-org/my-microservice
    newTag: dev-latest

replicas:
  - name: my-microservice
    count: 1
EOF

# Deploy
kubectl apply -k k8s/overlays/dev
```

### 7. Verify Deployment

```bash
# Check pods
kubectl get pods -n development -l app=my-microservice

# Check service
kubectl get svc -n development -l app=my-microservice

# Check ingress
kubectl get ingress -n development

# View logs
kubectl logs -f deployment/my-microservice -n development

# Describe deployment
kubectl describe deployment my-microservice -n development
```

### 8. Port Forward for Testing

```bash
# Forward port to local machine
kubectl port-forward svc/my-microservice 8080:80 -n development

# Test in browser
open http://localhost:8080

# Or with curl
curl http://localhost:8080/health
```

---

## Deploying to Production

### Prerequisites for Production

1. **Code Review**: All changes reviewed and approved
2. **Tests Passing**: All unit, integration, and E2E tests pass
3. **Security Scan**: Container image scanned for vulnerabilities
4. **Performance Testing**: Load testing completed
5. **Backup**: Database backups completed
6. **Rollback Plan**: Documented rollback procedure

### 1. Prepare Production Release

```bash
# Tag release
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Build production image
docker build -t ghcr.io/your-org/my-microservice:v1.0.0 .
docker push ghcr.io/your-org/my-microservice:v1.0.0

# Also tag as latest (optional)
docker tag ghcr.io/your-org/my-microservice:v1.0.0 \
  ghcr.io/your-org/my-microservice:latest
docker push ghcr.io/your-org/my-microservice:latest
```

### 2. Configure Production Cluster

```bash
# Switch to production context
kubectl config use-context prod-cluster

# Verify you're in production
kubectl config current-context
# Output: prod-cluster

# Check namespace exists
kubectl get namespace production
```

### 3. Production Configuration

**Create values-prod.yaml:**

```yaml
# helm/my-microservice/values-prod.yaml
replicaCount: 3  # Multiple replicas for HA

image:
  repository: ghcr.io/your-org/my-microservice
  tag: "v1.0.0"  # Use specific version, not latest!
  pullPolicy: IfNotPresent

ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: my-microservice.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: my-microservice-tls
      hosts:
        - my-microservice.example.com

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80

env:
  - name: NODE_ENV
    value: production
  - name: VITE_API_URL
    value: https://api.example.com

podSecurityContext:
  runAsNonRoot: true
  runAsUser: 1000
  fsGroup: 1000

securityContext:
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: false
  capabilities:
    drop:
    - ALL
```

### 4. Pre-Deployment Checklist

```bash
# Validate Kubernetes manifests
kubectl apply --dry-run=client -f k8s/deployment.yaml -n production

# Validate Helm chart
helm lint ./helm/my-microservice
helm template my-microservice ./helm/my-microservice \
  --values ./helm/my-microservice/values-prod.yaml

# Check image exists
docker pull ghcr.io/your-org/my-microservice:v1.0.0

# Verify secrets exist
kubectl get secrets -n production

# Check resource quotas
kubectl describe quota -n production
```

### 5. Deploy to Production (Blue-Green Strategy)

**Method 1: Helm with Rollback Support**

```bash
# Deploy new version
helm upgrade --install my-microservice ./helm/my-microservice \
  --namespace production \
  --values ./helm/my-microservice/values-prod.yaml \
  --wait \
  --timeout 10m

# Watch rollout
kubectl rollout status deployment/my-microservice -n production

# If issues occur, rollback
helm rollback my-microservice -n production
```

**Method 2: kubectl Rolling Update**

```bash
# Update image in deployment
kubectl set image deployment/my-microservice \
  my-microservice=ghcr.io/your-org/my-microservice:v1.0.0 \
  -n production

# Watch rollout
kubectl rollout status deployment/my-microservice -n production

# Pause rollout if issues detected
kubectl rollout pause deployment/my-microservice -n production

# Resume rollout
kubectl rollout resume deployment/my-microservice -n production

# Rollback to previous version
kubectl rollout undo deployment/my-microservice -n production
```

**Method 3: Canary Deployment (with Istio)**

```yaml
# k8s/virtual-service-canary.yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: my-microservice
  namespace: production
spec:
  hosts:
  - my-microservice
  http:
  - match:
    - headers:
        user-type:
          exact: beta-tester
    route:
    - destination:
        host: my-microservice
        subset: v2  # New version
      weight: 100
  - route:
    - destination:
        host: my-microservice
        subset: v1  # Current version
      weight: 90
    - destination:
        host: my-microservice
        subset: v2  # New version
      weight: 10  # 10% of traffic to new version
```

```bash
# Apply canary configuration
kubectl apply -f k8s/virtual-service-canary.yaml -n production

# Monitor new version
kubectl logs -l version=v2 -n production

# If successful, increase traffic gradually
# Edit weight from 10 -> 25 -> 50 -> 75 -> 100

# Finally, remove old version
kubectl delete deployment my-microservice-v1 -n production
```

### 6. Post-Deployment Verification

```bash
# Check all pods are running
kubectl get pods -n production -l app=my-microservice

# Verify service endpoints
kubectl get endpoints my-microservice -n production

# Check HPA status
kubectl get hpa my-microservice -n production

# Test health endpoints
curl https://my-microservice.example.com/health
curl https://my-microservice.example.com/ready

# Check application logs
kubectl logs -f deployment/my-microservice -n production --tail=100

# Monitor metrics
kubectl top pods -n production -l app=my-microservice
```

### 7. Smoke Tests

Run automated smoke tests:

```bash
# Health check
curl -f https://my-microservice.example.com/health || exit 1

# API test
curl -f https://my-microservice.example.com/api/version || exit 1

# Load page
curl -s -o /dev/null -w "%{http_code}" https://my-microservice.example.com | grep 200
```

### 8. Enable Monitoring Alerts

Ensure monitoring is active:

```bash
# Check Prometheus targets
kubectl get servicemonitor -n production

# Verify alerts are configured
kubectl get prometheusrule -n production

# Check Grafana dashboards exist
# Visit: https://grafana.example.com/d/microservices
```

---

## Monitoring and Troubleshooting

### 1. View Logs

```bash
# View logs from all pods
kubectl logs -l app=my-microservice -n production --tail=100

# Follow logs in real-time
kubectl logs -f deployment/my-microservice -n production

# View logs from specific pod
kubectl logs my-microservice-abc123-xyz -n production

# View previous container logs (if pod restarted)
kubectl logs my-microservice-abc123-xyz -n production --previous

# Filter logs by timestamp
kubectl logs deployment/my-microservice -n production --since=1h

# Export logs
kubectl logs deployment/my-microservice -n production > microservice-logs.txt
```

### 2. Check Pod Status

```bash
# List pods with details
kubectl get pods -n production -l app=my-microservice -o wide

# Describe pod (shows events and errors)
kubectl describe pod my-microservice-abc123-xyz -n production

# Check pod events
kubectl get events -n production --field-selector involvedObject.name=my-microservice-abc123-xyz

# Check resource usage
kubectl top pods -n production -l app=my-microservice
```

### 3. Common Issues and Solutions

#### Issue: Pods are CrashLooping

```bash
# Check pod logs
kubectl logs my-microservice-abc123-xyz -n production --previous

# Common causes:
# - Application error on startup
# - Missing environment variables
# - Failed health checks
# - Insufficient resources

# Fix: Update configuration and redeploy
kubectl edit deployment my-microservice -n production
```

#### Issue: Pods Not Starting (ImagePullBackOff)

```bash
# Check image pull errors
kubectl describe pod my-microservice-abc123-xyz -n production

# Common causes:
# - Image doesn't exist in registry
# - Authentication failed
# - Image tag is wrong

# Fix: Update image or create imagePullSecret
kubectl create secret docker-registry regcred \
  --docker-server=ghcr.io \
  --docker-username=your-username \
  --docker-password=your-token \
  -n production
```

#### Issue: Service Not Accessible

```bash
# Check service
kubectl get svc my-microservice -n production
kubectl describe svc my-microservice -n production

# Check endpoints
kubectl get endpoints my-microservice -n production

# Test service from within cluster
kubectl run -it --rm debug --image=curlimages/curl --restart=Never -- \
  curl http://my-microservice.production.svc.cluster.local/health

# Check ingress
kubectl get ingress -n production
kubectl describe ingress my-microservice -n production
```

#### Issue: High Memory/CPU Usage

```bash
# Check current resource usage
kubectl top pods -n production -l app=my-microservice

# Check HPA status
kubectl get hpa my-microservice -n production
kubectl describe hpa my-microservice -n production

# Scale manually if needed
kubectl scale deployment my-microservice --replicas=5 -n production

# Update resource limits
kubectl edit deployment my-microservice -n production
```

### 4. Debugging in Production

**Exec into Running Pod:**

```bash
# Get shell access (if available)
kubectl exec -it my-microservice-abc123-xyz -n production -- /bin/sh

# Run commands inside container
kubectl exec my-microservice-abc123-xyz -n production -- ps aux
kubectl exec my-microservice-abc123-xyz -n production -- df -h
kubectl exec my-microservice-abc123-xyz -n production -- cat /etc/nginx/nginx.conf
```

**Port Forward for Local Access:**

```bash
# Forward service port
kubectl port-forward svc/my-microservice 8080:80 -n production

# Forward specific pod
kubectl port-forward my-microservice-abc123-xyz 8080:3000 -n production

# Access at http://localhost:8080
```

**Create Debug Pod:**

```bash
# Create temporary debug pod in same namespace
kubectl run -it --rm debug --image=nicolaka/netshoot --restart=Never -n production

# Inside debug pod:
# - Test DNS: nslookup my-microservice
# - Test connectivity: curl http://my-microservice/health
# - Check network: ping my-microservice
```

### 5. Prometheus Metrics

```bash
# Port forward Prometheus
kubectl port-forward -n monitoring svc/prometheus 9090:9090

# Access at http://localhost:9090
# Query examples:
# - Rate of requests: rate(http_requests_total{service="my-microservice"}[5m])
# - CPU usage: container_cpu_usage_seconds_total{pod=~"my-microservice.*"}
# - Memory usage: container_memory_working_set_bytes{pod=~"my-microservice.*"}
```

### 6. Distributed Tracing (with Istio)

```bash
# Access Jaeger UI
istioctl dashboard jaeger

# Or port forward
kubectl port-forward -n istio-system svc/jaeger-query 16686:16686

# Access at http://localhost:16686
# Search for traces by service name
```

### 7. Service Mesh Troubleshooting (Istio)

```bash
# Check if sidecar is injected
kubectl get pod my-microservice-abc123-xyz -n production -o jsonpath='{.spec.containers[*].name}'
# Should show: my-microservice,istio-proxy

# Check Envoy config
istioctl proxy-config routes my-microservice-abc123-xyz -n production

# Check mTLS status
istioctl authn tls-check my-microservice-abc123-xyz.production

# View Kiali dashboard
istioctl dashboard kiali
# Visualize service mesh topology and traffic flow
```

---

## Best Practices

### Development Best Practices

1. **Use Feature Branches**
   ```bash
   git checkout -b feature/new-feature
   # Make changes
   git push origin feature/new-feature
   # Create pull request
   ```

2. **Write Tests First (TDD)**
   ```typescript
   // Write test first
   describe('UserService', () => {
     it('should fetch user by id', async () => {
       const user = await userService.getById(1);
       expect(user).toBeDefined();
     });
   });
   
   // Then implement
   class UserService {
     async getById(id: number) { /* ... */ }
   }
   ```

3. **Keep Dependencies Updated**
   ```bash
   # Check for updates
   npm outdated
   
   # Update framework packages
   npm update @longvhv/*
   
   # Update all dependencies
   npm update
   ```

4. **Use Environment Variables**
   - Never hardcode URLs, API keys, or secrets
   - Use `.env` files for local development
   - Use ConfigMaps/Secrets in Kubernetes

5. **Code Review Checklist**
   - Tests pass locally
   - Code follows style guide (ESLint/Prettier)
   - No console.log() in production code
   - Error handling implemented
   - Documentation updated

### Container Best Practices

1. **Use Specific Image Tags**
   ```yaml
   # Bad
   image: my-microservice:latest
   
   # Good
   image: my-microservice:v1.0.0
   ```

2. **Multi-Stage Builds**
   - Keep production images small
   - Separate build and runtime dependencies
   - Use alpine-based images

3. **Security Scanning**
   ```bash
   # Scan image for vulnerabilities
   docker scan ghcr.io/your-org/my-microservice:v1.0.0
   
   # Or use trivy
   trivy image ghcr.io/your-org/my-microservice:v1.0.0
   ```

4. **Health Checks**
   - Implement `/health` endpoint for liveness
   - Implement `/ready` endpoint for readiness
   - Return appropriate HTTP status codes

### Kubernetes Best Practices

1. **Resource Limits**
   ```yaml
   resources:
     requests:  # Guaranteed resources
       memory: "256Mi"
       cpu: "250m"
     limits:    # Maximum allowed
       memory: "512Mi"
       cpu: "500m"
   ```

2. **Horizontal Pod Autoscaling**
   - Enable HPA for production
   - Set appropriate min/max replicas
   - Monitor scaling events

3. **Namespace Isolation**
   - Use separate namespaces per environment
   - Apply resource quotas
   - Implement network policies

4. **Rolling Updates**
   ```yaml
   strategy:
     type: RollingUpdate
     rollingUpdate:
       maxSurge: 1         # Max pods during update
       maxUnavailable: 0   # Keep service available
   ```

5. **Pod Disruption Budgets**
   ```yaml
   apiVersion: policy/v1
   kind: PodDisruptionBudget
   metadata:
     name: my-microservice
   spec:
     minAvailable: 1  # Always keep 1 pod running
     selector:
       matchLabels:
         app: my-microservice
   ```

### Deployment Best Practices

1. **Use Helm for Deployment Management**
   - Version control your deployments
   - Easy rollback with `helm rollback`
   - Environment-specific values files

2. **Implement Canary Deployments**
   - Deploy to small percentage first
   - Monitor metrics and errors
   - Gradually increase traffic
   - Quick rollback if issues

3. **Automated Testing in CI/CD**
   - Run tests before deployment
   - Automated security scanning
   - Integration tests in staging
   - Smoke tests after deployment

4. **Documentation**
   - Keep README updated
   - Document environment variables
   - Maintain changelog
   - Deployment runbooks

5. **Monitoring and Alerting**
   - Set up alerts for errors
   - Monitor resource usage
   - Track deployment success rate
   - Implement SLIs/SLOs

### Security Best Practices

1. **Secrets Management**
   ```bash
   # Never commit secrets to git
   # Use Kubernetes Secrets
   kubectl create secret generic my-microservice-secrets \
     --from-literal=api-key=secret-value \
     -n production
   ```

2. **Network Policies**
   ```yaml
   # Limit pod-to-pod communication
   apiVersion: networking.k8s.io/v1
   kind: NetworkPolicy
   metadata:
     name: my-microservice-policy
   spec:
     podSelector:
       matchLabels:
         app: my-microservice
     policyTypes:
     - Ingress
     ingress:
     - from:
       - podSelector:
           matchLabels:
             app: api-gateway
   ```

3. **RBAC**
   - Least privilege principle
   - Service accounts per application
   - Regular audit of permissions

4. **Image Security**
   - Scan images regularly
   - Use trusted base images
   - Keep images updated
   - Sign images

5. **Runtime Security**
   - Run as non-root user
   - Read-only root filesystem
   - Drop unnecessary capabilities
   - Use security contexts

---

## Appendix

### A. Useful Commands Reference

```bash
# Kubernetes
kubectl get pods -n <namespace>
kubectl logs -f deployment/<name> -n <namespace>
kubectl describe pod <pod-name> -n <namespace>
kubectl exec -it <pod-name> -n <namespace> -- /bin/sh
kubectl port-forward svc/<service> <local-port>:<service-port> -n <namespace>

# Helm
helm list -n <namespace>
helm install <name> <chart> -n <namespace>
helm upgrade <name> <chart> -n <namespace>
helm rollback <name> -n <namespace>
helm uninstall <name> -n <namespace>

# Docker
docker build -t <image>:<tag> .
docker push <image>:<tag>
docker pull <image>:<tag>
docker ps
docker logs <container-id>

# Git
git status
git add .
git commit -m "message"
git push origin <branch>
git pull origin <branch>
```

### B. Environment-Specific Configurations

**Development:**
- 1 replica
- Lower resource limits
- Debug logging enabled
- Mock external services
- Faster health check intervals

**Staging:**
- 2 replicas
- Production-like resources
- Production logging
- Real external services
- Production-like health checks

**Production:**
- 3+ replicas
- Full resource limits
- Error-only logging
- All security enabled
- Strict health checks

### C. Troubleshooting Decision Tree

1. **Pods not starting?**
   - Check image exists: `docker pull <image>`
   - Check events: `kubectl describe pod <pod>`
   - Check logs: `kubectl logs <pod>`

2. **Service not accessible?**
   - Check pods running: `kubectl get pods`
   - Check service: `kubectl get svc`
   - Check endpoints: `kubectl get endpoints`
   - Check ingress: `kubectl get ingress`

3. **Performance issues?**
   - Check resource usage: `kubectl top pods`
   - Check HPA: `kubectl get hpa`
   - Check logs for errors
   - Review Prometheus metrics

4. **Deployment failed?**
   - Check rollout status: `kubectl rollout status`
   - View deployment events: `kubectl describe deployment`
   - Rollback if needed: `kubectl rollout undo deployment`

### D. Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Helm Documentation](https://helm.sh/docs/)
- [Istio Documentation](https://istio.io/latest/docs/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [12-Factor App Methodology](https://12factor.net/)
- [@longvhv Framework Documentation](https://github.com/longvhv/saas-framework-react)

---

## Getting Help

- **Framework Issues**: [GitHub Issues](https://github.com/longvhv/saas-framework-react/issues)
- **Kubernetes Issues**: Check logs and events first
- **Team Chat**: Slack/Discord channel
- **Documentation**: https://github.com/longvhv/saas-framework-react/docs

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Maintainer**: @longvhv
