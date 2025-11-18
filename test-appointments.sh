#!/bin/bash

# Script para testar appointments no backend
# Substitua YOUR_TOKEN_HERE pelo token JWT após fazer login

echo "=========================================="
echo "🧪 Teste de Appointments - Backend Railway"
echo "=========================================="
echo ""

# Verificar se token foi fornecido
if [ -z "$1" ]; then
    echo "❌ Erro: Token JWT não fornecido"
    echo ""
    echo "Uso: ./test-appointments.sh YOUR_JWT_TOKEN"
    echo ""
    echo "Como obter o token:"
    echo "1. Faça login em: https://seu-dominio.vercel.app/auth/login"
    echo "2. Abra DevTools (F12) > Application > Local Storage"
    echo "3. Copie o valor de 'token'"
    echo "4. Execute: ./test-appointments.sh <seu_token>"
    exit 1
fi

TOKEN="$1"
API_URL="https://upbeat-dedication-production.up.railway.app/api"

echo "🔍 Testando autenticação..."
AUTH_RESPONSE=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $TOKEN" "$API_URL/auth/profile")
HTTP_CODE=$(echo "$AUTH_RESPONSE" | tail -n1)
BODY=$(echo "$AUTH_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" != "200" ]; then
    echo "❌ Falha na autenticação (HTTP $HTTP_CODE)"
    echo "Response: $BODY"
    exit 1
fi

echo "✅ Autenticação OK"
echo ""

echo "📊 Buscando appointments..."
APPOINTMENTS_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/appointments")
echo "$APPOINTMENTS_RESPONSE" | jq '.' 2>/dev/null || echo "$APPOINTMENTS_RESPONSE"
echo ""

echo "📈 Estatísticas:"
COUNT=$(echo "$APPOINTMENTS_RESPONSE" | jq 'length' 2>/dev/null || echo "0")
echo "Total de appointments: $COUNT"
echo ""

if [ "$COUNT" = "0" ]; then
    echo "⚠️  Nenhum appointment encontrado!"
    echo ""
    echo "💡 Para criar appointments, você precisa criar Leads com:"
    echo "   - preferredDate (data desejada)"
    echo "   - preferredTimeSlot (horário desejado)"
    echo ""
    echo "Os appointments são criados automaticamente quando um Lead tem essas informações."
fi

echo ""
echo "=========================================="
echo "✅ Teste concluído"
echo "=========================================="
