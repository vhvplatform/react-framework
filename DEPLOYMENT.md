# Deployment Guide - Go Infrastructure Alignment

This guide explains how to deploy the React Framework in a microservices architecture aligned with go-infrastructure standards.

## Overview

The React Framework is designed to integrate seamlessly with Go-based backend microservices in a containerized, Kubernetes-native environment.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Kubernetes Cluster                    │
│                                                           │
│  ┌──────────────┐       ┌─────────────────────────────┐ │
│  │   Ingress    │──────▶│   Istio Gateway (optional)  │ │
│  └──────────────┘       └─────────────────────────────┘ │
│         │                           │                     │
│         ▼                           ▼                     │
│  ┌──────────────────┐      ┌──────────────────┐        │
│  │ React Framework  │◀────▶│  Go API Service  │        │
│  │   (Frontend)     │      │    (Backend)     │        │
│  │   Port: 3000     │      │    Port: 8080    │        │
│  └──────────────────┘      └──────────────────┘        │
│         │                           │                     │
│         │                  ┌────────▼────────┐          │
│         │                  │   PostgreSQL    │          │
│         │                  │   Redis         │          │
│         │                  └─────────────────┘          │
└─────────────────────────────────────────────────────────┘
```

## Prerequisites

- Docker 20.10+
- Kubernetes 1.24+
- kubectl configured
- Helm 3.0+ (optional)
- Access to container registry (GHCR, Docker Hub, etc.)

## Deployment Options

### Option 1: Docker Compose (Local Development)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 2: Kubernetes with kubectl

```bash
# Apply manifests
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/hpa.yaml
kubectl apply -f k8s/pdb.yaml

# Or use Kustomize
kubectl apply -k k8s/

# Check deployment
kubectl get pods -l app=react-framework
kubectl logs -f deployment/react-framework
```

### Option 3: Helm Chart (Recommended for Production)

```bash
# Install
helm install react-framework ./helm/react-framework \
  --namespace production \
  --create-namespace \
  --values ./helm/react-framework/values-prod.yaml

# Upgrade
helm upgrade react-framework ./helm/react-framework \
  --namespace production

# Rollback
helm rollback react-framework --namespace production
```

## Configuration

### Environment Variables

Required environment variables:

```bash
# Application
NODE_ENV=production
VITE_API_URL=http://go-api-service/api

# Logging
LOG_LEVEL=info

# Feature flags (optional)
VITE_FEATURE_*=true/false
```

### ConfigMap

Edit `k8s/deployment.yaml`:

```yaml
data:
  api-url: "http://go-api-service/api"
  log-level: "info"
```

## Go Infrastructure Integration

### Backend Service Discovery

The React Framework expects the Go backend API to be available at:

- **Docker Compose**: `http://api:8080`
- **Kubernetes**: `http://go-api-service/api`

### Health Check Compatibility

Both frontend and backend should implement:
- `GET /health` - Liveness probe
- `GET /ready` - Readiness probe

### Service Mesh (Istio)

For advanced traffic management:

```bash
# Enable Istio injection
kubectl label namespace default istio-injection=enabled

# Apply service mesh configs
kubectl apply -f k8s/gateway.yaml
kubectl apply -f k8s/virtual-service.yaml
kubectl apply -f k8s/destination-rule.yaml
```

## CI/CD Pipeline

### GitHub Actions Workflows

1. **ci.yml** - Continuous Integration
   - Lint, test, type-check
   - Build Docker image
   - Push to container registry

2. **deploy-k8s.yml** - Kubernetes Deployment
   - Deploy to staging/production
   - Rolling updates
   - Health check verification

### Deployment Process

```bash
# 1. Build and push image
docker build -t ghcr.io/vhvplatform/react-framework:v1.0.0 .
docker push ghcr.io/vhvplatform/react-framework:v1.0.0

# 2. Update Kubernetes
kubectl set image deployment/react-framework \
  react-framework=ghcr.io/vhvplatform/react-framework:v1.0.0

# 3. Monitor rollout
kubectl rollout status deployment/react-framework
```

## Monitoring

### Health Endpoints

- **Liveness**: `http://localhost:3000/health`
- **Readiness**: `http://localhost:3000/ready`

### Metrics

Prometheus annotations are configured for scraping:

```yaml
prometheus.io/scrape: "true"
prometheus.io/port: "3000"
prometheus.io/path: "/metrics"
```

## Scaling

### Horizontal Pod Autoscaler

Configured in `k8s/hpa.yaml`:
- Min replicas: 2
- Max replicas: 10
- Target CPU: 70%
- Target Memory: 80%

### Manual Scaling

```bash
kubectl scale deployment/react-framework --replicas=5
```

## Security

### Container Security

- Non-root user (UID 1000)
- Read-only root filesystem option
- Dropped capabilities
- Security context enforcement

### Network Policies

Apply network policies to restrict traffic:

```bash
kubectl apply -f k8s/network-policy.yaml
```

## Troubleshooting

### Check Pod Status

```bash
kubectl get pods -l app=react-framework
kubectl describe pod <pod-name>
kubectl logs -f <pod-name>
```

### Common Issues

1. **ImagePullBackOff**: Check registry credentials
2. **CrashLoopBackOff**: Review logs for application errors
3. **Service Unavailable**: Verify backend connectivity

### Debug Container

```bash
kubectl run -it --rm debug --image=curlimages/curl --restart=Never -- sh
curl http://react-framework/health
```

## Best Practices

1. **Use specific image tags** (not `latest` in production)
2. **Set resource limits and requests**
3. **Enable HPA for production workloads**
4. **Use Pod Disruption Budgets**
5. **Implement proper health checks**
6. **Use ConfigMaps for configuration**
7. **Store secrets in Kubernetes Secrets**
8. **Enable service mesh for advanced routing**
9. **Monitor with Prometheus/Grafana**
10. **Follow 12-factor app principles**

## References

- [Go Infrastructure Repository](https://github.com/vhvplatform/go-infrastructure)
- [Microservices Developer Guide](./docs/architecture/MICROSERVICES_DEVELOPER_GUIDE.md)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Helm Documentation](https://helm.sh/docs/)
- [Istio Documentation](https://istio.io/latest/docs/)
