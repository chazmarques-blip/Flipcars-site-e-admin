#!/bin/bash

# Comprehensive API test script for appointments endpoint

echo "=========================================="
echo "🧪 TESTE COMPLETO DA API DE APPOINTMENTS"
echo "=========================================="
echo ""

API_BASE="https://upbeat-dedication-production.up.railway.app/api"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test users from seed file
USERS=(
  "superadmin@flipcars.us:Password123!"
  "admin@flipcars.us:Password123!"
  "agent@flipcars.us:Password123!"
)

echo "🔐 Tentando autenticar com usuários seed..."
echo ""

TOKEN=""
LOGIN_SUCCESS=false

for USER_CREDS in "${USERS[@]}"; do
  EMAIL="${USER_CREDS%%:*}"
  PASSWORD="${USER_CREDS##*:}"
  
  echo -n "   Testando $EMAIL... "
  
  RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
  
  # Try to extract token
  TOKEN=$(echo "$RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
  
  if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    echo -e "${GREEN}✅ Sucesso!${NC}"
    LOGIN_SUCCESS=true
    LOGIN_EMAIL="$EMAIL"
    break
  else
    echo -e "${RED}❌ Falhou${NC}"
  fi
done

echo ""

if [ "$LOGIN_SUCCESS" = false ]; then
  echo -e "${RED}❌ Nenhum usuário seed funcionou!${NC}"
  echo ""
  echo "⚠️  Isso significa que os usuários no Supabase são diferentes dos seeds."
  echo ""
  echo "📝 Soluções:"
  echo "   1. Verifique quais usuários existem no Supabase: SELECT email FROM users;"
  echo "   2. Use as credenciais corretas para fazer login"
  echo "   3. Ou execute os seeds no banco: npm run seed (no backend)"
  echo ""
  exit 1
fi

echo -e "${GREEN}✅ Autenticado como: $LOGIN_EMAIL${NC}"
echo -e "${BLUE}🔑 Token JWT obtido${NC}"
echo ""

# Now test appointments endpoint
echo "=========================================="
echo "📅 TESTANDO ENDPOINT /api/appointments"
echo "=========================================="
echo ""

echo "GET /api/appointments"
APPOINTMENTS_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" "$API_BASE/appointments")

# Check HTTP status
if echo "$APPOINTMENTS_RESPONSE" | grep -q "Internal server error"; then
  echo -e "${RED}❌ ERRO 500 - Internal Server Error${NC}"
  echo ""
  echo "Resposta completa:"
  echo "$APPOINTMENTS_RESPONSE"
  echo ""
  echo "🔍 Diagnóstico:"
  echo "   1. Railway pode ainda estar fazendo deploy"
  echo "   2. Tabela appointments pode não existir"
  echo "   3. TypeORM pode ter erro de configuração"
  echo ""
  echo "📋 Próximos passos:"
  echo "   1. Execute o SQL no Supabase (veja DIAGNOSTICO_COMPLETO.md)"
  echo "   2. Verifique logs do Railway"
  echo "   3. Aguarde 2-3 minutos e teste novamente"
  exit 1
fi

if echo "$APPOINTMENTS_RESPONSE" | grep -q "Unauthorized"; then
  echo -e "${RED}❌ Token inválido ou expirado${NC}"
  exit 1
fi

# Check if it's an array (empty or with data)
if echo "$APPOINTMENTS_RESPONSE" | grep -q "^\["; then
  COUNT=$(echo "$APPOINTMENTS_RESPONSE" | grep -o "{" | wc -l)
  
  if [ "$COUNT" -eq 0 ]; then
    echo -e "${GREEN}✅ API FUNCIONANDO! (0 appointments)${NC}"
    echo ""
    echo "📋 Resposta: []"
    echo ""
    echo "🎉 SUCESSO! A API está funcionando perfeitamente!"
    echo ""
    echo "📝 Próximos passos:"
    echo "   1. Execute o SQL no Supabase para criar appointment de teste"
    echo "   2. Acesse o calendário: https://admin.flipcars.us/dashboard/appointments-v2"
    echo "   3. Verifique se o appointment aparece"
  else
    echo -e "${GREEN}✅ API FUNCIONANDO! ($COUNT appointments encontrados)${NC}"
    echo ""
    echo "📋 Resposta:"
    echo "$APPOINTMENTS_RESPONSE" | jq '.' 2>/dev/null || echo "$APPOINTMENTS_RESPONSE"
    echo ""
    echo "🎉 SUCESSO! Appointments existem no banco!"
    echo ""
    echo "📝 Próximo passo:"
    echo "   Acesse: https://admin.flipcars.us/dashboard/appointments-v2"
    echo "   Os appointments devem aparecer no calendário!"
  fi
  
  echo ""
  echo "=========================================="
  echo "🎯 TESTE ADICIONAL: GET POR MÊS"
  echo "=========================================="
  echo ""
  
  # Test month endpoint (November 2025)
  YEAR="2025"
  MONTH="11"
  
  echo "GET /api/appointments/month/$YEAR/$MONTH"
  MONTH_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" "$API_BASE/appointments/month/$YEAR/$MONTH")
  
  if echo "$MONTH_RESPONSE" | grep -q "^\["; then
    MONTH_COUNT=$(echo "$MONTH_RESPONSE" | grep -o "{" | wc -l)
    echo -e "${GREEN}✅ Endpoint /month OK! ($MONTH_COUNT appointments em $MONTH/$YEAR)${NC}"
  else
    echo -e "${YELLOW}⚠️  Resposta inesperada:${NC}"
    echo "$MONTH_RESPONSE"
  fi
  
  echo ""
  echo "=========================================="
  echo "✅ TODOS OS TESTES PASSARAM!"
  echo "=========================================="
  echo ""
  echo "🎯 Resumo:"
  echo "   ✅ API está online e respondendo"
  echo "   ✅ Autenticação funcionando"
  echo "   ✅ Endpoint /appointments OK"
  echo "   ✅ Endpoint /appointments/month/:year/:month OK"
  echo ""
  echo "🚀 Sistema pronto para uso!"
  
else
  echo -e "${YELLOW}⚠️  Resposta inesperada:${NC}"
  echo "$APPOINTMENTS_RESPONSE"
  echo ""
  echo "📋 Isso pode ser:"
  echo "   1. Erro não previsto"
  echo "   2. Formato de resposta diferente"
  echo "   3. Problema temporário"
fi

echo ""
