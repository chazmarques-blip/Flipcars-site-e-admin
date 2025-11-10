#!/bin/bash

API_URL="https://upbeat-dedication-production.up.railway.app/api"
LEAD_ID="4d4cd75-84aa-414d-b9a6-495ec54964a7"

echo "🔍 TESTANDO LEAD ESPECÍFICO DA URL"
echo "===================================="
echo ""

# 1. Login
echo "1️⃣ Fazendo login..."
LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@flipcars.com","password":"Admin@2024"}')

ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['accessToken'])" 2>/dev/null)

if [ -z "$ACCESS_TOKEN" ]; then
  echo "   ❌ Erro no login"
  exit 1
fi

echo "   ✅ Login OK"
echo ""

# 2. Test specific lead
echo "2️⃣ Testando lead: $LEAD_ID"
LEAD_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "${API_URL}/leads/${LEAD_ID}" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

HTTP_STATUS=$(echo "$LEAD_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
LEAD_DATA=$(echo "$LEAD_RESPONSE" | sed '$d')

echo "   Status HTTP: $HTTP_STATUS"

if [ "$HTTP_STATUS" = "200" ]; then
  echo "   ✅ Lead encontrado!"
  echo ""
  echo "📋 DADOS DO LEAD:"
  echo "$LEAD_DATA" | python3 -m json.tool
else
  echo "   ❌ Lead NÃO encontrado"
  echo ""
  echo "📋 Erro:"
  echo "$LEAD_DATA" | python3 -m json.tool
  
  # Get all leads
  echo ""
  echo "3️⃣ Buscando todos os leads..."
  ALL_LEADS=$(curl -s "${API_URL}/leads?page=1&limit=20" \
    -H "Authorization: Bearer $ACCESS_TOKEN")
  
  echo "$ALL_LEADS" | python3 -c "
import sys, json
data = json.load(sys.stdin)
leads = data['data']
print(f'\n✅ Total de leads: {len(leads)}\n')
print('📋 IDs VÁLIDOS NO BANCO:')
for i, lead in enumerate(leads, 1):
    name = lead.get('name') or f\"{lead.get('firstName', '')} {lead.get('lastName', '')}\"
    print(f'{i}. ID: {lead[\"id\"]}')
    print(f'   Ref: {lead[\"referenceNumber\"]}')
    print(f'   Name: {name}')
    print()
"
fi
