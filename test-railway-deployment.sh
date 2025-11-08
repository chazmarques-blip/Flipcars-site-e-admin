#!/bin/bash

# Railway Deployment Test Script
# Tests the backend health endpoint and provides status

BACKEND_URL="https://upbeat-dedication-production.up.railway.app"
HEALTH_ENDPOINT="${BACKEND_URL}/api/health"

echo "============================================"
echo "🚂 Railway Backend Deployment Test"
echo "============================================"
echo ""
echo "Testing: ${HEALTH_ENDPOINT}"
echo ""

# Test health endpoint
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${HEALTH_ENDPOINT}" --max-time 10)

if [ "$HTTP_CODE" -eq 200 ]; then
    echo "✅ SUCCESS! Backend is running"
    echo ""
    echo "Response:"
    curl -s "${HEALTH_ENDPOINT}" | jq . 2>/dev/null || curl -s "${HEALTH_ENDPOINT}"
    echo ""
    echo "============================================"
    echo "🎉 DEPLOYMENT SUCCESSFUL!"
    echo "============================================"
    echo ""
    echo "Next Steps:"
    echo "1. ✅ Backend is connected to database"
    echo "2. ⏭️  Run migrations: npm run migration:run"
    echo "3. ⏭️  Run seeds: npm run seed"
    echo "4. ⏭️  Configure custom domain: api.flipcars.us"
    echo ""
elif [ "$HTTP_CODE" -eq 502 ] || [ "$HTTP_CODE" -eq 503 ]; then
    echo "🟡 BACKEND STARTING... (HTTP $HTTP_CODE)"
    echo ""
    echo "The backend container is starting up."
    echo "This usually takes 1-2 minutes."
    echo ""
    echo "Try again in 1 minute:"
    echo "  bash test-railway-deployment.sh"
    echo ""
elif [ "$HTTP_CODE" -eq 000 ]; then
    echo "🔴 CONNECTION TIMEOUT"
    echo ""
    echo "Cannot reach the backend. Possible issues:"
    echo "1. Railway deployment still in progress"
    echo "2. Backend crashed during startup"
    echo "3. Network connectivity issue"
    echo ""
    echo "Check Railway logs:"
    echo "  Railway → upbeat-dedication → Deployments → Deploy Logs"
    echo ""
else
    echo "❌ ERROR (HTTP $HTTP_CODE)"
    echo ""
    echo "Response:"
    curl -s "${HEALTH_ENDPOINT}"
    echo ""
    echo ""
    echo "Check Railway logs for errors:"
    echo "  Railway → upbeat-dedication → Deployments → Deploy Logs"
    echo ""
fi

echo "============================================"
echo "📊 Status Check Complete"
echo "============================================"
