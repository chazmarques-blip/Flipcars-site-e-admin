#!/bin/bash

# Test script for public leads endpoint
# Usage: ./test-public-endpoint.sh

set -e

API_URL="https://upbeat-dedication-production.up.railway.app/api/public/leads"
ORIGIN="https://flipcars.us"

echo "======================================"
echo "🧪 Testing Public Leads Endpoint"
echo "======================================"
echo ""
echo "API URL: $API_URL"
echo "Origin: $ORIGIN"
echo ""

# Test 1: Create Bodyshop Lead
echo "📝 Test 1: Creating Bodyshop Lead..."
echo "--------------------------------------"

RESPONSE1=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Origin: $ORIGIN" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@test.com",
    "phone": "(321) 555-0123",
    "serviceType": "bodyshop",
    "insuranceCompany": "Geico",
    "claimNumber": "GEICO-TEST-12345",
    "preferredDate": "2025-11-15",
    "preferredTimeSlot": "9:00-11:00",
    "vehicle": {
      "vin": "1HGCM82633A123456",
      "year": "2023",
      "make": "Honda",
      "model": "Accord"
    },
    "contactPreferences": {
      "phoneCall": true,
      "whatsapp": true,
      "textMessage": false
    },
    "additionalNotes": "Front bumper damage from parking lot incident",
    "source": "test_script"
  }')

HTTP_CODE1=$(echo "$RESPONSE1" | tail -n1)
BODY1=$(echo "$RESPONSE1" | head -n-1)

echo "HTTP Status: $HTTP_CODE1"
echo "Response:"
echo "$BODY1" | jq '.' 2>/dev/null || echo "$BODY1"
echo ""

if [ "$HTTP_CODE1" = "201" ]; then
  echo "✅ Test 1 PASSED"
else
  echo "❌ Test 1 FAILED (Expected 201, got $HTTP_CODE1)"
fi

echo ""
echo "======================================"
echo ""

# Test 2: Create Mechanic Lead
echo "📝 Test 2: Creating Mechanic Lead..."
echo "--------------------------------------"

RESPONSE2=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Origin: $ORIGIN" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@test.com",
    "phone": "(407) 555-0456",
    "serviceType": "mechanic",
    "warrantyCompany": "Endurance",
    "warrantyClaimNumber": "END-TEST-67890",
    "preferredDate": "2025-11-16",
    "preferredTimeSlot": "11:00-13:00",
    "vehicle": {
      "vin": "1G1ZD5ST5HF123456",
      "year": "2022",
      "make": "Chevrolet",
      "model": "Malibu"
    },
    "warrantyDocs": {
      "selectedIssues": ["engine", "transmission"],
      "symptomsDescription": "Engine makes knocking sound when accelerating, and transmission slips between gears"
    },
    "contactPreferences": {
      "phoneCall": true,
      "whatsapp": false,
      "textMessage": true
    },
    "additionalNotes": "Issue started last week",
    "source": "test_script"
  }')

HTTP_CODE2=$(echo "$RESPONSE2" | tail -n1)
BODY2=$(echo "$RESPONSE2" | head -n-1)

echo "HTTP Status: $HTTP_CODE2"
echo "Response:"
echo "$BODY2" | jq '.' 2>/dev/null || echo "$BODY2"
echo ""

if [ "$HTTP_CODE2" = "201" ]; then
  echo "✅ Test 2 PASSED"
else
  echo "❌ Test 2 FAILED (Expected 201, got $HTTP_CODE2)"
fi

echo ""
echo "======================================"
echo ""

# Test 3: Invalid Data (should fail)
echo "📝 Test 3: Testing Validation (should fail)..."
echo "--------------------------------------"

RESPONSE3=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Origin: $ORIGIN" \
  -d '{
    "firstName": "T",
    "email": "invalid-email"
  }')

HTTP_CODE3=$(echo "$RESPONSE3" | tail -n1)
BODY3=$(echo "$RESPONSE3" | head -n-1)

echo "HTTP Status: $HTTP_CODE3"
echo "Response:"
echo "$BODY3" | jq '.' 2>/dev/null || echo "$BODY3"
echo ""

if [ "$HTTP_CODE3" = "400" ]; then
  echo "✅ Test 3 PASSED (Validation working correctly)"
else
  echo "❌ Test 3 FAILED (Expected 400, got $HTTP_CODE3)"
fi

echo ""
echo "======================================"
echo ""

# Summary
echo "📊 Test Summary:"
echo "--------------------------------------"
TEST_COUNT=0
PASSED_COUNT=0

if [ "$HTTP_CODE1" = "201" ]; then
  ((PASSED_COUNT++))
fi
((TEST_COUNT++))

if [ "$HTTP_CODE2" = "201" ]; then
  ((PASSED_COUNT++))
fi
((TEST_COUNT++))

if [ "$HTTP_CODE3" = "400" ]; then
  ((PASSED_COUNT++))
fi
((TEST_COUNT++))

echo "Total Tests: $TEST_COUNT"
echo "Passed: $PASSED_COUNT"
echo "Failed: $((TEST_COUNT - PASSED_COUNT))"
echo ""

if [ "$PASSED_COUNT" = "$TEST_COUNT" ]; then
  echo "🎉 All tests PASSED!"
  echo ""
  echo "✅ Next Step: Check admin dashboard at https://admin.flipcars.us"
  echo "   Look for leads with source: 'test_script'"
  exit 0
else
  echo "❌ Some tests FAILED!"
  echo ""
  echo "Troubleshooting:"
  echo "1. Check if Railway backend is running"
  echo "2. Verify CORS configuration"
  echo "3. Check Railway logs for errors"
  exit 1
fi
