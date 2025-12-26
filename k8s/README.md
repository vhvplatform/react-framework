# Kubernetes Deployment

This directory contains Kubernetes manifests for deploying the React Framework in a microservices architecture, aligned with go-infrastructure standards.

## Files

- `deployment.yaml` - Main deployment with Service, ConfigMap, Ingress
- `hpa.yaml` - Horizontal Pod Autoscaler
- `pdb.yaml` - Pod Disruption Budget
- `kustomization.yaml` - Kustomize configuration
- `virtual-service.yaml` - Istio VirtualService (optional)
- `destination-rule.yaml` - Istio DestinationRule (optional)
- `gateway.yaml` - Istio Gateway (optional)

## Quick Deploy

```bash
# Apply all manifests
kubectl apply -f deployment.yaml
kubectl apply -f hpa.yaml
kubectl apply -f pdb.yaml

# Or use Kustomize
kubectl apply -k .

# With Helm
helm install react-framework ../helm/react-framework --namespace default
```

## Istio Service Mesh

For service mesh deployment:

```bash
# Label namespace for Istio injection
kubectl label namespace default istio-injection=enabled

# Apply service mesh configs
kubectl apply -f gateway.yaml
kubectl apply -f virtual-service.yaml
kubectl apply -f destination-rule.yaml
```

## Configuration

Update ConfigMap in `deployment.yaml`:
- `api-url`: Backend API service URL
- `log-level`: Application log level

## Health Checks

- Liveness: `/health`
- Readiness: `/ready`
