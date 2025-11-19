#!/bin/bash

# Script de teste completo da API de Appointments
# Autor: Senior AI Developer
# Data: 2025-11-19

BASE_URL="https://upbeat-dedication-production.up.railway.app/api"
EMAIL="admin@flipcars.us"
PASSWORD="Admin123!"

echo "================================="
echo "🧪 TESTE COMPLETO - APPOINTMENTS API"
echo "================================="
echo ""

# 1. Health Check
echo "📡 1. HEALTH CHECK"
echo "-----------------"
HEALTH=$(curl -s "${BASE_URL}/health")
echo "$HEALTH" | jq -r '.'
STATUS=$(echo "$HEALTH" | jq -r '.status')
if [ "$STATUS" = "ok" ]; then
  echo "✅ API está online"
else
  echo "❌ API está offline"
  exit 1
fi
echo ""

# 2. Login
echo "🔐 2. LOGIN"
echo "-----------"
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${EMAIL}\",\"password\":\"${PASSWORD}\"}")

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.tokens.accessToken')
USER_EMAIL=$(echo "$LOGIN_RESPONSE" | jq -r '.user.email')

if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
  echo "✅ Login bem-sucedido"
  echo "   Usuário: $USER_EMAIL"
  echo "   Token: ${TOKEN:0:50}..."
else
  echo "❌ Falha no login"
  echo "$LOGIN_RESPONSE" | jq -r '.'
  exit 1
fi
echo ""

# 3. Buscar TODOS appointments
echo "📋 3. BUSCAR TODOS APPOINTMENTS"
echo "-------------------------------"
ALL_APPOINTMENTS=$(curl -s -H "Authorization: Bearer $TOKEN" \
  "${BASE_URL}/appointments")

# Verificar se é erro
ERROR_STATUS=$(echo "$ALL_APPOINTMENTS" | jq -r '.statusCode // empty')
if [ "$ERROR_STATUS" != "" ]; then
  echo "❌ Erro ao buscar appointments:"
  echo "$ALL_APPOINTMENTS" | jq -r '.'
else
  COUNT=$(echo "$ALL_APPOINTMENTS" | jq -r 'length')
  echo "✅ Total de appointments: $COUNT"
  if [ "$COUNT" -gt 0 ]; then
    echo ""
    echo "📊 Primeiros appointments:"
    echo "$ALL_APPOINTMENTS" | jq -r '.[0:3] | .[] | "   - ID: \(.id[0:8])... | Data: \(.appointmentDate) | Horário: \(.appointmentTimeSlot) | Status: \(.status)"'
  fi
fi
echo ""

# 4. Buscar appointments de NOVEMBRO 2025
echo "📅 4. BUSCAR APPOINTMENTS - NOVEMBRO 2025"
echo "-----------------------------------------"
NOVEMBER_APPOINTMENTS=$(curl -s -H "Authorization: Bearer $TOKEN" \
  "${BASE_URL}/appointments?year=2025&month=11")

# Verificar se é erro
ERROR_STATUS=$(echo "$NOVEMBER_APPOINTMENTS" | jq -r '.statusCode // empty')
if [ "$ERROR_STATUS" != "" ]; then
  echo "❌ Erro ao buscar appointments de novembro:"
  echo "$NOVEMBER_APPOINTMENTS" | jq -r '.'
else
  COUNT=$(echo "$NOVEMBER_APPOINTMENTS" | jq -r 'length')
  echo "✅ Appointments em Novembro 2025: $COUNT"
  
  if [ "$COUNT" -gt 0 ]; then
    echo ""
    echo "📊 Appointments encontrados:"
    echo "$NOVEMBER_APPOINTMENTS" | jq -r '.[] | "   📌 \(.appointmentDate) às \(.appointmentTimeSlot) - Status: \(.status)"'
    
    # Verificar se tem o appointment de teste (2025-11-25)
    HAS_TEST=$(echo "$NOVEMBER_APPOINTMENTS" | jq -r '.[] | select(.appointmentDate == "2025-11-25") | .appointmentDate')
    if [ "$HAS_TEST" = "2025-11-25" ]; then
      echo ""
      echo "🎉 SUCESSO! Appointment de teste (2025-11-25) encontrado!"
    else
      echo ""
      echo "⚠️  Appointment de teste (2025-11-25) NÃO encontrado"
    fi
  else
    echo ""
    echo "⚠️  Nenhum appointment encontrado para Novembro 2025"
    echo "   Possível causa: appointment não existe no banco"
  fi
fi
echo ""

# 5. Buscar por endpoint alternativo (month/:year/:month)
echo "🔍 5. TESTE ENDPOINT ALTERNATIVO (/month/2025/11)"
echo "--------------------------------------------------"
ALT_NOVEMBER=$(curl -s -H "Authorization: Bearer $TOKEN" \
  "${BASE_URL}/appointments/month/2025/11")

ERROR_STATUS=$(echo "$ALT_NOVEMBER" | jq -r '.statusCode // empty')
if [ "$ERROR_STATUS" != "" ]; then
  echo "❌ Erro no endpoint alternativo:"
  echo "$ALT_NOVEMBER" | jq -r '.'
else
  COUNT=$(echo "$ALT_NOVEMBER" | jq -r 'length')
  echo "✅ Appointments (endpoint alternativo): $COUNT"
fi
echo ""

# RESUMO FINAL
echo "================================="
echo "📊 RESUMO FINAL"
echo "================================="
echo ""

# Determinar status geral
ALL_OK=true
if [ "$STATUS" != "ok" ]; then ALL_OK=false; fi
if [ "$TOKEN" = "null" ] || [ "$TOKEN" = "" ]; then ALL_OK=false; fi

ALL_ERROR=$(echo "$ALL_APPOINTMENTS" | jq -r '.statusCode // empty')
if [ "$ALL_ERROR" != "" ]; then ALL_OK=false; fi

NOV_ERROR=$(echo "$NOVEMBER_APPOINTMENTS" | jq -r '.statusCode // empty')
if [ "$NOV_ERROR" != "" ]; then ALL_OK=false; fi

if [ "$ALL_OK" = true ]; then
  echo "✅ TODOS OS TESTES PASSARAM!"
  echo ""
  echo "Próximo passo:"
  echo "1. Abrir frontend: https://admin.flipcars.us/auth/login"
  echo "2. Fazer login com: $EMAIL / $PASSWORD"
  echo "3. Acessar: https://admin.flipcars.us/dashboard/appointments-v2"
  echo "4. Verificar se appointments aparecem no calendário"
else
  echo "⚠️  ALGUNS TESTES FALHARAM"
  echo ""
  echo "Verifique os logs acima para mais detalhes"
  exit 1
fi
echo ""
echo "================================="
