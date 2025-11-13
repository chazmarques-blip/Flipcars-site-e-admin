#!/bin/bash

echo "🧪 TESTING FLIPCARS ADMIN API"
echo "=============================="
echo ""

# Health check
echo "1️⃣ Testing health endpoint..."
HEALTH=$(curl -s https://upbeat-dedication-production.up.railway.app/api/health)
echo "$HEALTH" | jq
echo ""

# Login
echo "2️⃣ Testing login..."
LOGIN_RESPONSE=$(curl -s -X POST https://upbeat-dedication-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@flipcars.us","password":"admin123"}')

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.tokens.accessToken')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
    echo "❌ Login failed!"
    echo "$LOGIN_RESPONSE" | jq
    exit 1
fi

echo "✅ Login successful! Token: ${TOKEN:0:50}..."
echo ""

# Test leads endpoint
echo "3️⃣ Testing GET /api/leads..."
LEADS_RESPONSE=$(curl -s "https://upbeat-dedication-production.up.railway.app/api/leads?page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN")

echo "$LEADS_RESPONSE" | jq

# Check for error
if echo "$LEADS_RESPONSE" | jq -e '.statusCode == 500' > /dev/null 2>&1; then
    echo ""
    echo "❌ ERRO 500 - Backend ainda tem problema!"
    echo "Aguarde mais 1-2 minutos e tente novamente."
    exit 1
elif echo "$LEADS_RESPONSE" | jq -e '.data' > /dev/null 2>&1; then
    echo ""
    echo "✅✅✅ SUCESSO! API FUNCIONANDO! ✅✅✅"
    echo ""
    echo "🎉 Admin dashboard deve estar funcionando agora!"
    echo ""
    echo "📋 Próximos passos:"
    echo "1. Limpe cache do browser (Ctrl+Shift+Del)"
    echo "2. Acesse: https://admin.flipcars.us"
    echo "3. Login: admin@flipcars.us / admin123"
    echo "4. Vá em Leads"
    echo ""
    exit 0
else
    echo ""
    echo "⚠️  Resposta inesperada"
    exit 1
fi
