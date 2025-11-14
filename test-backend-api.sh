#!/bin/bash

# Test Backend API directly to check if lead FL-2025-4645 exists
# This tests the deployed Railway backend

echo "=================================================="
echo "🧪 Testing Railway Backend API for Lead FL-2025-4645"
echo "=================================================="
echo ""

# Backend URL
API_URL="https://api.flipcars.us"

# Test 1: Health check
echo "📋 Test 1: Health Check"
echo "--------------------------------------------------"
curl -s -w "\nHTTP Status: %{http_code}\n" "$API_URL/api/health" || echo "❌ API not responding"
echo ""

# Test 2: Get leads without authentication (should fail with 401)
echo "📋 Test 2: GET /api/leads (No Auth - Should 401)"
echo "--------------------------------------------------"
curl -s -w "\nHTTP Status: %{http_code}\n" "$API_URL/api/leads?page=1&limit=10"
echo ""

# Test 3: Check if public leads endpoint exists
echo "📋 Test 3: GET /api/public-leads (Public endpoint)"
echo "--------------------------------------------------"
curl -s -w "\nHTTP Status: %{http_code}\n" "$API_URL/api/public-leads?leadNumber=FL-2025-4645"
echo ""

# Test 4: Try to find lead by leadNumber in public endpoint
echo "📋 Test 4: Search for FL-2025-4645 via public endpoint"
echo "--------------------------------------------------"
curl -s -X GET "$API_URL/api/public-leads" \
  -H "Content-Type: application/json" \
  | jq '.' 2>/dev/null || echo "No jq available or endpoint doesn't exist"
echo ""

echo "=================================================="
echo "🏁 Tests Complete"
echo "=================================================="
echo ""
echo "⚠️  NOTE: To test authenticated endpoints, you need a valid JWT token"
echo "💡 Get token by:"
echo "   1. Login at https://admin.flipcars.us"
echo "   2. Open browser console (F12)"
echo "   3. Run: localStorage.getItem('accessToken')"
echo ""
