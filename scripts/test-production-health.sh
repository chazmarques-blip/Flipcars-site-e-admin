#!/bin/bash
# 🏥 Production Health Check Script
# Verifica se sistema principal está funcionando

set -e

echo "🏥 ==============================================="
echo "   FLIPCARS PRODUCTION HEALTH CHECK"
echo "==============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BACKEND_URL="https://upbeat-dedication-production.up.railway.app/api"
ADMIN_URL="https://admin.flipcars.us"
PUBLIC_URL="https://flipcars.us"

FAILED_TESTS=0
PASSED_TESTS=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected_status=$3
    
    echo -n "Testing $name... "
    
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$url" -m 10)
    
    if [ "$STATUS" -eq "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC} (HTTP $STATUS)"
        ((PASSED_TESTS++))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (Expected $expected_status, got $STATUS)"
        ((FAILED_TESTS++))
        return 1
    fi
}

# Function to test API with auth
test_api_with_auth() {
    local name=$1
    local endpoint=$2
    
    echo -n "Testing $name... "
    
    # Get token
    TOKEN=$(curl -s -X POST "$BACKEND_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"email":"admin@flipcars.com","password":"admin123"}' \
        | jq -r '.tokens.accessToken')
    
    if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
        echo -e "${RED}❌ FAIL${NC} (Login failed)"
        ((FAILED_TESTS++))
        return 1
    fi
    
    # Test endpoint with token
    RESPONSE=$(curl -s "$BACKEND_URL/$endpoint" \
        -H "Authorization: Bearer $TOKEN")
    
    # Check if response has data
    LEAD_COUNT=$(echo "$RESPONSE" | jq -r '.pagination.total // 0')
    
    if [ "$LEAD_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✅ PASS${NC} (Found $LEAD_COUNT leads)"
        ((PASSED_TESTS++))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (No leads found)"
        echo "Response: $RESPONSE"
        ((FAILED_TESTS++))
        return 1
    fi
}

echo "📍 Testing Backend API..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test backend health
test_endpoint "Backend Health" "$BACKEND_URL/health" "200" || true

# Test login
test_endpoint "Login Endpoint" "$BACKEND_URL/auth/login" "401" || true # 401 expected without credentials

# Test leads API with auth
test_api_with_auth "Leads API" "leads?page=1&limit=10"

echo ""
echo "🌐 Testing Frontend Sites..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test admin site
test_endpoint "Admin Dashboard" "$ADMIN_URL" "200" || true

# Test public site
test_endpoint "Public Website" "$PUBLIC_URL" "200" || true

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESULTS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "✅ Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "❌ Failed: ${RED}$FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -gt 0 ]; then
    echo -e "${RED}⚠️  CRITICAL: Some tests failed!${NC}"
    echo "   Action required: Check logs and rollback if needed"
    exit 1
else
    echo -e "${GREEN}🎉 All tests passed! System is healthy.${NC}"
    exit 0
fi
