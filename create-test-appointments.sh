#!/bin/bash

# Script para criar Leads de teste com appointments
# Isso criará automaticamente appointments no calendário

API_URL="https://upbeat-dedication-production.up.railway.app/api"

echo "=========================================="
echo "🚀 Criar Appointments de Teste"
echo "=========================================="
echo ""

# Verificar se token foi fornecido
if [ -z "$1" ]; then
    echo "❌ Erro: Token JWT não fornecido"
    echo ""
    echo "Uso: ./create-test-appointments.sh YOUR_JWT_TOKEN"
    echo ""
    echo "Como obter o token:"
    echo "1. Faça login no sistema"
    echo "2. Abra DevTools (F12) > Application > Local Storage"
    echo "3. Copie o valor de 'token'"
    echo "4. Execute: ./create-test-appointments.sh <seu_token>"
    exit 1
fi

TOKEN="$1"

echo "🔐 Testando autenticação..."
AUTH_TEST=$(curl -s -w "%{http_code}" -o /dev/null -H "Authorization: Bearer $TOKEN" "$API_URL/auth/profile")

if [ "$AUTH_TEST" != "200" ]; then
    echo "❌ Token inválido ou expirado (HTTP $AUTH_TEST)"
    echo "Por favor, faça login novamente e obtenha um novo token."
    exit 1
fi

echo "✅ Token válido!"
echo ""

# Função para gerar data futura
get_future_date() {
    local days_ahead=$1
    date -d "+$days_ahead days" +%Y-%m-%d 2>/dev/null || date -v+${days_ahead}d +%Y-%m-%d
}

# Criar 5 leads de teste com appointments
echo "📝 Criando 5 Leads de teste com appointments..."
echo ""

# Lead 1: Hoje + 1 dia, manhã
DATE1=$(get_future_date 1)
echo "1️⃣ Lead: Maria Santos - Honda Civic (Amanhã, 9:00-11:00)"
RESPONSE1=$(curl -s -X POST "$API_URL/leads" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Maria Santos\",
    \"phone\": \"11987654321\",
    \"email\": \"maria.santos@email.com\",
    \"vehicleYear\": \"2021\",
    \"vehicleMake\": \"Honda\",
    \"vehicleModel\": \"Civic\",
    \"hasInsurance\": true,
    \"insuranceProvider\": \"Porto Seguro\",
    \"preferredDate\": \"$DATE1\",
    \"preferredTimeSlot\": \"9:00-11:00\",
    \"priority\": \"high\",
    \"estimatedValue\": 5500
  }")

if echo "$RESPONSE1" | grep -q '"id"'; then
    echo "   ✅ Lead criado com sucesso!"
    LEAD1_ID=$(echo "$RESPONSE1" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "   ID: $LEAD1_ID"
else
    echo "   ❌ Erro ao criar lead"
    echo "   Response: $RESPONSE1"
fi
echo ""

# Lead 2: Hoje + 2 dias, tarde
DATE2=$(get_future_date 2)
echo "2️⃣ Lead: João Silva - Toyota Corolla (+2 dias, 14:00-16:00)"
RESPONSE2=$(curl -s -X POST "$API_URL/leads" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"João Silva\",
    \"phone\": \"11976543210\",
    \"email\": \"joao.silva@email.com\",
    \"vehicleYear\": \"2020\",
    \"vehicleMake\": \"Toyota\",
    \"vehicleModel\": \"Corolla\",
    \"hasInsurance\": true,
    \"insuranceProvider\": \"Bradesco Seguros\",
    \"preferredDate\": \"$DATE2\",
    \"preferredTimeSlot\": \"14:00-16:00\",
    \"priority\": \"medium\",
    \"estimatedValue\": 4800
  }")

if echo "$RESPONSE2" | grep -q '"id"'; then
    echo "   ✅ Lead criado com sucesso!"
else
    echo "   ❌ Erro ao criar lead"
fi
echo ""

# Lead 3: Hoje + 3 dias, manhã
DATE3=$(get_future_date 3)
echo "3️⃣ Lead: Ana Costa - Chevrolet Onix (+3 dias, 10:00-12:00)"
RESPONSE3=$(curl -s -X POST "$API_URL/leads" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Ana Costa\",
    \"phone\": \"11965432109\",
    \"email\": \"ana.costa@email.com\",
    \"vehicleYear\": \"2019\",
    \"vehicleMake\": \"Chevrolet\",
    \"vehicleModel\": \"Onix\",
    \"hasInsurance\": false,
    \"preferredDate\": \"$DATE3\",
    \"preferredTimeSlot\": \"10:00-12:00\",
    \"priority\": \"high\",
    \"estimatedValue\": 3200
  }")

if echo "$RESPONSE3" | grep -q '"id"'; then
    echo "   ✅ Lead criado com sucesso!"
else
    echo "   ❌ Erro ao criar lead"
fi
echo ""

# Lead 4: Hoje + 5 dias, tarde
DATE4=$(get_future_date 5)
echo "4️⃣ Lead: Pedro Oliveira - Volkswagen Gol (+5 dias, 15:00-17:00)"
RESPONSE4=$(curl -s -X POST "$API_URL/leads" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Pedro Oliveira\",
    \"phone\": \"11954321098\",
    \"email\": \"pedro.oliveira@email.com\",
    \"vehicleYear\": \"2018\",
    \"vehicleMake\": \"Volkswagen\",
    \"vehicleModel\": \"Gol\",
    \"hasInsurance\": true,
    \"insuranceProvider\": \"SulAmérica\",
    \"preferredDate\": \"$DATE4\",
    \"preferredTimeSlot\": \"15:00-17:00\",
    \"priority\": \"low\",
    \"estimatedValue\": 2800
  }")

if echo "$RESPONSE4" | grep -q '"id"'; then
    echo "   ✅ Lead criado com sucesso!"
else
    echo "   ❌ Erro ao criar lead"
fi
echo ""

# Lead 5: Hoje + 7 dias, manhã
DATE5=$(get_future_date 7)
echo "5️⃣ Lead: Carla Mendes - Ford Ka (+7 dias, 11:00-13:00)"
RESPONSE5=$(curl -s -X POST "$API_URL/leads" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Carla Mendes\",
    \"phone\": \"11943210987\",
    \"email\": \"carla.mendes@email.com\",
    \"vehicleYear\": \"2022\",
    \"vehicleMake\": \"Ford\",
    \"vehicleModel\": \"Ka\",
    \"hasInsurance\": true,
    \"insuranceProvider\": \"Mapfre\",
    \"preferredDate\": \"$DATE5\",
    \"preferredTimeSlot\": \"11:00-13:00\",
    \"priority\": \"medium\",
    \"estimatedValue\": 4200
  }")

if echo "$RESPONSE5" | grep -q '"id"'; then
    echo "   ✅ Lead criado com sucesso!"
else
    echo "   ❌ Erro ao criar lead"
fi
echo ""

# Verificar appointments criados
echo "=========================================="
echo "📊 Verificando appointments criados..."
echo "=========================================="
echo ""

APPOINTMENTS=$(curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/appointments")
COUNT=$(echo "$APPOINTMENTS" | jq 'length' 2>/dev/null || echo "0")

echo "✅ Total de appointments no sistema: $COUNT"
echo ""

if [ "$COUNT" -gt 0 ]; then
    echo "📅 Lista de appointments:"
    echo "$APPOINTMENTS" | jq -r '.[] | "  • \(.appointmentDate) (\(.appointmentTimeSlot)) - \(.lead.name) - \(.lead.vehicleMake) \(.lead.vehicleModel)"' 2>/dev/null || echo "$APPOINTMENTS"
else
    echo "⚠️  Nenhum appointment encontrado!"
    echo "Isso pode indicar que:"
    echo "  - Os Leads não foram criados corretamente"
    echo "  - A criação automática de appointments não está funcionando"
fi

echo ""
echo "=========================================="
echo "✅ Processo concluído!"
echo "=========================================="
echo ""
echo "🌐 Próximo passo:"
echo "   Acesse: https://seu-dominio.vercel.app/dashboard/appointments-v2"
echo "   e veja os appointments no calendário!"
echo ""
