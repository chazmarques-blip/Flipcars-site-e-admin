#!/bin/bash
set -e  # Exit on error

echo "========================================="
echo "🚀 FlipCars Backend - Production Start"
echo "========================================="
echo ""
echo "Environment: ${NODE_ENV:-production}"
echo "Database URL: ${DATABASE_URL:0:30}..." 
echo ""

# Test database connection
echo "🔍 Validating environment variables..."
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL not set!"
    exit 1
fi
echo "✅ DATABASE_URL is configured"

# Wait for database to be ready
echo ""
echo "⏳ Waiting for database to be ready (5 seconds)..."
sleep 5

# Start application (migrations and seeds run programmatically inside NestJS)
echo ""
echo "========================================="
echo "🎯 Starting NestJS Application..."
echo "   (Migrations and seeds will run automatically)"
echo "========================================="
echo ""

exec node dist/main.js
