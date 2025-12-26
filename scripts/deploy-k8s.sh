#!/bin/bash
# Kubernetes Deployment Script - Aligned with go-infrastructure standards
set -e

echo "React Framework - Kubernetes Deploy"
echo "===================================="

# Configuration
NAMESPACE="${NAMESPACE:-default}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
DEPLOYMENT_METHOD="${DEPLOYMENT_METHOD:-kubectl}"

# Check prerequisites
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl not installed"
    exit 1
fi

# Verify cluster connection
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Cannot connect to Kubernetes cluster"
    exit 1
fi

echo "📋 Deployment Configuration:"
echo "  Namespace: $NAMESPACE"
echo "  Image Tag: $IMAGE_TAG"
echo "  Method: $DEPLOYMENT_METHOD"
echo ""

# Deploy based on method
case $DEPLOYMENT_METHOD in
    kubectl)
        echo "📦 Deploying with kubectl..."
        kubectl apply -k k8s/ --namespace=$NAMESPACE
        ;;
    helm)
        echo "📦 Deploying with Helm..."
        if ! command -v helm &> /dev/null; then
            echo "❌ Helm not installed"
            exit 1
        fi
        helm upgrade --install react-framework ./helm/react-framework \
            --namespace=$NAMESPACE \
            --create-namespace \
            --set image.tag=$IMAGE_TAG \
            --wait
        ;;
    *)
        echo "❌ Unknown deployment method: $DEPLOYMENT_METHOD"
        echo "Valid methods: kubectl, helm"
        exit 1
        ;;
esac

# Wait for rollout
echo ""
echo "⏳ Waiting for rollout to complete..."
kubectl rollout status deployment/react-framework --namespace=$NAMESPACE --timeout=5m

# Verify deployment
echo ""
echo "✅ Deployment complete!"
echo ""
echo "Pod status:"
kubectl get pods -l app=react-framework --namespace=$NAMESPACE

echo ""
echo "Service status:"
kubectl get svc -l app=react-framework --namespace=$NAMESPACE

echo ""
echo "Ingress status:"
kubectl get ingress -l app=react-framework --namespace=$NAMESPACE

echo ""
echo "Health check:"
echo "  kubectl port-forward svc/react-framework 8080:80 --namespace=$NAMESPACE"
echo "  curl http://localhost:8080/health"
