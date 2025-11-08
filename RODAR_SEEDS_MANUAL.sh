#!/bin/bash

# Script para rodar seeds manualmente no Railway
# Uso: Executar este script após configurar Railway CLI

echo "========================================="
echo "🌱 RODANDO SEEDS MANUALMENTE NO RAILWAY"
echo "========================================="
echo ""

# Variável do token Railway
export RAILWAY_TOKEN="5f32d7ad-03b4-44b9-9b76-c761a0d8f652"

echo "📋 Passo 1: Conectando ao Railway..."
echo "Service ID: c1318e1d-be54-4823-91b6-e08b537cf012"
echo ""

echo "📋 Passo 2: Executando seeds..."
echo "Comando: npm run seed:prod"
echo ""

# Comando para rodar via Railway CLI (se disponível)
# railway run npm run seed:prod

echo "⚠️  ATENÇÃO: Este script precisa do Railway CLI instalado localmente!"
echo ""
echo "ALTERNATIVA: Rodar seeds via GraphQL API"
echo ""

# Usando GraphQL API para executar comando
curl -X POST https://backboard.railway.app/graphql/v2 \
  -H "Authorization: Bearer 5f32d7ad-03b4-44b9-9b76-c761a0d8f652" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { serviceInstanceConnect(serviceId: \"c1318e1d-be54-4823-91b6-e08b537cf012\", environmentId: \"production\") { sessionId } }"
  }'

echo ""
echo "========================================="
echo "❓ Se o script acima não funcionar:"
echo "========================================="
echo ""
echo "VOCÊ PRECISA rodar o seed MANUALMENTE no Railway Dashboard:"
echo ""
echo "1. Railway Dashboard → Service 'upbeat-dedication'"
echo "2. Clique no botão '...' (três pontos)"
echo "3. Selecione 'Shell' ou 'Terminal'"
echo "4. Digite: cd /app && npm run seed:prod"
echo "5. Aguarde execução"
echo "6. Teste login novamente"
echo ""
echo "========================================="
