#!/bin/sh
# Health check script for Docker container
# Aligned with go-infrastructure health check patterns

set -e

# Check if nginx is running
if ! pgrep nginx > /dev/null; then
    echo "ERROR: nginx is not running"
    exit 1
fi

# Check if application responds on health endpoint
if ! curl -f -s http://localhost:3000/health > /dev/null; then
    echo "ERROR: Application health check failed"
    exit 1
fi

# Check if application is ready
if ! curl -f -s http://localhost:3000/ready > /dev/null; then
    echo "WARN: Application not ready yet"
    exit 1
fi

echo "Container is healthy and ready"
exit 0
