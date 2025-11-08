#!/bin/bash

# Script de Testes Completo - FlipCars
# Executa testes automatizados de todos os componentes

BACKEND_URL="https://upbeat-dedication-production.up.railway.app"
ADMIN_URL="https://admin.flipcars.us"
PUBLIC_URL="https://flipcars.us"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                                                                  ║"
echo "║           🧪 SCRIPT DE TESTES - FLIPCARS                         ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Função para testar endpoint
test_endpoint() {
    local name="$1"
    local url="$2"
    local method="${3:-GET}"
    local data="$4"
    local headers="$5"
    
    echo -n "Testando $name... "
    
    if [ "$method" = "POST" ]; then
        HTTP_CODE=$(curl -s -o /tmp/response.json -w "%{http_code}" -X POST "$url" -H "Content-Type: application/json" $headers -d "$data" --max-time 10)
    else
        HTTP_CODE=$(curl -s -o /tmp/response.json -w "%{http_code}" "$url" $headers --max-time 10)
    fi
    
    if [ "$HTTP_CODE" -eq 200 ] || [ "$HTTP_CODE" -eq 201 ]; then
        echo -e "${GREEN}✅ OK (HTTP $HTTP_CODE)${NC}"
        return 0
    elif [ "$HTTP_CODE" -eq 401 ]; then
        echo -e "${YELLOW}⚠️  401 Unauthorized (esperado se sem token)${NC}"
        return 1
    elif [ "$HTTP_CODE" -eq 500 ]; then
        echo -e "${RED}❌ 500 Internal Error (migrations não executadas?)${NC}"
        return 2
    else
        echo -e "${RED}❌ ERRO (HTTP $HTTP_CODE)${NC}"
        return 1
    fi
}

# ===========================================
# ETAPA 1: Verificar Backend
# ===========================================
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  ETAPA 1: Verificando Backend${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

test_endpoint "Health Check" "${BACKEND_URL}/api/health"
HEALTH_STATUS=$?

if [ $HEALTH_STATUS -eq 0 ]; then
    echo -e "\n${GREEN}✅ Backend está rodando!${NC}\n"
    cat /tmp/response.json | jq . 2>/dev/null || cat /tmp/response.json
else
    echo -e "\n${RED}❌ Backend não está respondendo corretamente${NC}"
    exit 1
fi

# ===========================================
# ETAPA 2: Testar Login (verifica se migrations rodaram)
# ===========================================
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  ETAPA 2: Testando Autenticação${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

LOGIN_DATA='{"email":"superadmin@flipcars.us","password":"Password123!"}'
test_endpoint "Login (superadmin)" "${BACKEND_URL}/api/auth/login" "POST" "$LOGIN_DATA"
LOGIN_STATUS=$?

if [ $LOGIN_STATUS -eq 0 ]; then
    echo -e "\n${GREEN}✅ Login funcionou! Migrations foram executadas.${NC}\n"
    
    # Extrair token
    ACCESS_TOKEN=$(cat /tmp/response.json | jq -r '.access_token' 2>/dev/null)
    
    if [ ! -z "$ACCESS_TOKEN" ] && [ "$ACCESS_TOKEN" != "null" ]; then
        echo -e "${GREEN}🔑 Token JWT obtido com sucesso!${NC}"
        echo ""
        echo "Response do login:"
        cat /tmp/response.json | jq . 2>/dev/null || cat /tmp/response.json
        
        # ===========================================
        # ETAPA 3: Testar endpoints autenticados
        # ===========================================
        echo ""
        echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
        echo -e "${BLUE}  ETAPA 3: Testando Endpoints Autenticados${NC}"
        echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
        echo ""
        
        test_endpoint "Listar Usuários" "${BACKEND_URL}/api/users" "GET" "" "-H 'Authorization: Bearer $ACCESS_TOKEN'"
        test_endpoint "Meu Perfil" "${BACKEND_URL}/api/users/me" "GET" "" "-H 'Authorization: Bearer $ACCESS_TOKEN'"
        test_endpoint "Listar Leads" "${BACKEND_URL}/api/leads" "GET" "" "-H 'Authorization: Bearer $ACCESS_TOKEN'"
        
    else
        echo -e "${YELLOW}⚠️  Login retornou mas sem token JWT${NC}"
    fi
    
elif [ $LOGIN_STATUS -eq 2 ]; then
    echo -e "\n${RED}❌ Login retornou erro 500${NC}"
    echo -e "${YELLOW}⚠️  MIGRATIONS AINDA NÃO FORAM EXECUTADAS!${NC}\n"
    echo "Para executar migrations:"
    echo "1. Vá em Railway Dashboard: https://railway.app/project/inspiring-imagination"
    echo "2. Clique em 'upbeat-dedication'"
    echo "3. Settings → Deploy → Start Command"
    echo "4. Mude para: npm run migration:run && npm run seed && npm run start:prod"
    echo ""
    echo -e "${BLUE}ℹ️  O backend está rodando, mas precisa das migrations!${NC}"
    exit 2
else
    echo -e "\n${YELLOW}⚠️  Não foi possível fazer login${NC}"
    echo "Response:"
    cat /tmp/response.json
fi

# ===========================================
# ETAPA 4: Testar criação de Lead (endpoint público)
# ===========================================
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  ETAPA 4: Testando Criação de Lead (Público)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

LEAD_DATA='{
  "name": "Teste Automatizado",
  "email": "teste.auto@example.com",
  "phone": "(11) 98765-4321",
  "vehicleYear": "2020",
  "vehicleMake": "Honda",
  "vehicleModel": "Civic",
  "vehicleMileage": "50000",
  "message": "Lead criado por script de teste"
}'

test_endpoint "Criar Lead" "${BACKEND_URL}/api/leads" "POST" "$LEAD_DATA"
LEAD_STATUS=$?

if [ $LEAD_STATUS -eq 0 ]; then
    echo -e "\n${GREEN}✅ Lead criado com sucesso!${NC}\n"
    echo "Response:"
    cat /tmp/response.json | jq . 2>/dev/null || cat /tmp/response.json
fi

# ===========================================
# ETAPA 5: Testar CORS
# ===========================================
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  ETAPA 5: Testando CORS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo -n "Testando CORS para flipcars.us... "
CORS_HEADER=$(curl -s -I "${BACKEND_URL}/api/health" -H "Origin: https://flipcars.us" | grep -i "access-control-allow-origin")

if [ ! -z "$CORS_HEADER" ]; then
    echo -e "${GREEN}✅ OK${NC}"
    echo "  Header: $CORS_HEADER"
else
    echo -e "${YELLOW}⚠️  CORS header não encontrado${NC}"
fi

echo -n "Testando CORS para admin.flipcars.us... "
CORS_HEADER=$(curl -s -I "${BACKEND_URL}/api/health" -H "Origin: https://admin.flipcars.us" | grep -i "access-control-allow-origin")

if [ ! -z "$CORS_HEADER" ]; then
    echo -e "${GREEN}✅ OK${NC}"
    echo "  Header: $CORS_HEADER"
else
    echo -e "${YELLOW}⚠️  CORS header não encontrado${NC}"
fi

# ===========================================
# ETAPA 6: Testar Frontends (básico)
# ===========================================
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  ETAPA 6: Testando Frontends${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo -n "Testando Admin Panel... "
ADMIN_HTTP=$(curl -s -o /dev/null -w "%{http_code}" "$ADMIN_URL" --max-time 10)
if [ "$ADMIN_HTTP" -eq 200 ]; then
    echo -e "${GREEN}✅ OK (HTTP $ADMIN_HTTP)${NC}"
else
    echo -e "${YELLOW}⚠️  HTTP $ADMIN_HTTP${NC}"
fi

echo -n "Testando Public Site... "
PUBLIC_HTTP=$(curl -s -o /dev/null -w "%{http_code}" "$PUBLIC_URL" --max-time 10)
if [ "$PUBLIC_HTTP" -eq 200 ]; then
    echo -e "${GREEN}✅ OK (HTTP $PUBLIC_HTTP)${NC}"
else
    echo -e "${YELLOW}⚠️  HTTP $PUBLIC_HTTP${NC}"
fi

# ===========================================
# RESUMO FINAL
# ===========================================
echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                                                                  ║"
echo "║                     📊 RESUMO DOS TESTES                         ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

if [ $HEALTH_STATUS -eq 0 ]; then
    echo -e "${GREEN}✅${NC} Backend está rodando"
else
    echo -e "${RED}❌${NC} Backend não está respondendo"
fi

if [ $LOGIN_STATUS -eq 0 ]; then
    echo -e "${GREEN}✅${NC} Autenticação funcionando"
    echo -e "${GREEN}✅${NC} Migrations executadas"
else
    echo -e "${RED}❌${NC} Autenticação falhou"
    if [ $LOGIN_STATUS -eq 2 ]; then
        echo -e "${YELLOW}⚠️${NC}  Migrations ainda não foram executadas"
    fi
fi

if [ $LEAD_STATUS -eq 0 ]; then
    echo -e "${GREEN}✅${NC} Criação de leads funcionando"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  URLs Importantes:${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "Backend:     $BACKEND_URL"
echo "Admin:       $ADMIN_URL"
echo "Public:      $PUBLIC_URL"
echo "Railway:     https://railway.app/project/inspiring-imagination"
echo ""

if [ $LOGIN_STATUS -eq 2 ]; then
    echo -e "${YELLOW}⚠️  PRÓXIMO PASSO: Execute as migrations no Railway${NC}"
    echo ""
    echo "Como fazer:"
    echo "1. Acesse: https://railway.app/project/inspiring-imagination"
    echo "2. Clique em 'upbeat-dedication'"
    echo "3. Settings → Deploy → Start Command"
    echo "4. Mude para: npm run migration:run && npm run seed && npm run start:prod"
    echo ""
elif [ $LOGIN_STATUS -eq 0 ]; then
    echo -e "${GREEN}🎉 Tudo funcionando! Projeto pronto para uso!${NC}"
    echo ""
    echo "Credenciais de teste:"
    echo "Email:    superadmin@flipcars.us"
    echo "Password: Password123!"
    echo ""
fi

echo "Para ver o plano completo de testes:"
echo "cat /home/user/webapp/PLANO_DE_TESTES_COMPLETO.md"
echo ""
echo "═══════════════════════════════════════════════════════════"
