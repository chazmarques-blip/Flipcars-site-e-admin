#!/bin/bash

# Script para verificar status do deploy Railway e testar API

echo "=========================================="
echo "🔍 VERIFICAÇÃO RAILWAY + API STATUS"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Railway API URL
API_BASE="https://upbeat-dedication-production.up.railway.app/api"

# 1. Test Health Endpoint
echo "1️⃣  Testando Health Endpoint..."
HEALTH_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE/health")
if [ "$HEALTH_CODE" = "200" ]; then
  echo -e "   ${GREEN}✅ Health OK (200)${NC}"
else
  echo -e "   ${RED}❌ Health Failed ($HEALTH_CODE)${NC}"
  echo "   ⚠️  API pode estar offline ou reiniciando"
  exit 1
fi

echo ""

# 2. Check if we need login
echo "2️⃣  Verificando necessidade de autenticação..."
echo "   ℹ️  Para testar appointments, precisamos de um token JWT"
echo "   ℹ️  Use o comando abaixo para fazer login:"
echo ""
echo -e "${YELLOW}curl -X POST $API_BASE/auth/login \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"email\":\"SEU_EMAIL\",\"password\":\"SUA_SENHA\"}'${NC}"
echo ""

# 3. Test appointments endpoint (will fail without auth, but we can see the error)
echo "3️⃣  Testando Appointments Endpoint (sem auth)..."
APPOINTMENTS_RESPONSE=$(curl -s "$API_BASE/appointments")
echo "   Resposta: $APPOINTMENTS_RESPONSE"
echo ""

# Check if response contains "Unauthorized" (expected) or "Internal server error" (problem!)
if echo "$APPOINTMENTS_RESPONSE" | grep -q "Unauthorized"; then
  echo -e "   ${GREEN}✅ Endpoint está respondendo (401 Unauthorized esperado)${NC}"
  echo "   ℹ️  Use o token do login para acessar"
elif echo "$APPOINTMENTS_RESPONSE" | grep -q "Internal server error"; then
  echo -e "   ${RED}❌ Erro 500 detectado!${NC}"
  echo "   🔍 Possíveis causas:"
  echo "      1. Railway ainda está fazendo deploy"
  echo "      2. Tabela appointments não existe no banco"
  echo "      3. Erro no código TypeORM"
  echo ""
  echo "   📋 Verifique Railway logs para mais detalhes"
else
  echo -e "   ${YELLOW}⚠️  Resposta inesperada${NC}"
fi

echo ""

# 4. Instructions
echo "=========================================="
echo "📝 PRÓXIMOS PASSOS"
echo "=========================================="
echo ""
echo "1. Execute o SQL no Supabase SQL Editor (veja DIAGNOSTICO_COMPLETO.md)"
echo "2. Faça login para pegar token JWT"
echo "3. Teste com token:"
echo ""
echo -e "${YELLOW}TOKEN=\"seu_token_aqui\""
echo "curl -H \"Authorization: Bearer \$TOKEN\" \\"
echo "  $API_BASE/appointments${NC}"
echo ""
echo "4. Se retornar [] ou [{ appointments }], está funcionando! ✅"
echo "5. Se retornar 500, verifique logs do Railway"
echo ""
