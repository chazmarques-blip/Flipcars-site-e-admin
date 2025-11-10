#!/bin/bash

# Force Vercel Redeploy for Admin Dashboard
# Purpose: Trigger new deployment to clear any cache issues

echo "🚀 FORÇANDO NOVO DEPLOY DO ADMIN DASHBOARD"
echo "=========================================="
echo ""

VERCEL_TOKEN="dZRr8mnyl9y5zaVOzP0lW0EY"
PROJECT_ID="prj_sayFhHQpCbU34G9z7coTfknHoJre"
TEAM_ID="team_swFh83L5TGQJknXqSnOKK12C"

echo "📦 Projeto: FlipCars Admin"
echo "🌐 URL: https://admin.flipcars.us"
echo ""

# Get latest deployment
echo "1️⃣ Obtendo último deployment..."
LATEST_DEPLOY=$(curl -s \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v6/deployments?projectId=$PROJECT_ID&teamId=$TEAM_ID&limit=1" \
  | python3 -c "import sys, json; data=json.load(sys.stdin); print(data['deployments'][0]['uid'] if data.get('deployments') else '')")

if [ -z "$LATEST_DEPLOY" ]; then
  echo "   ❌ Erro ao obter deployment"
  exit 1
fi

echo "   ✅ Deployment ID: $LATEST_DEPLOY"
echo ""

# Trigger redeploy
echo "2️⃣ Solicitando redeploy..."
REDEPLOY_RESPONSE=$(curl -s -X POST \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  "https://api.vercel.com/v13/deployments?teamId=$TEAM_ID" \
  -d "{
    \"deploymentId\": \"$LATEST_DEPLOY\",
    \"name\": \"flipcars-admin\",
    \"target\": \"production\"
  }")

NEW_DEPLOY_ID=$(echo "$REDEPLOY_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('id', ''))" 2>/dev/null)

if [ -z "$NEW_DEPLOY_ID" ]; then
  echo "   ❌ Erro ao criar redeploy"
  echo ""
  echo "📋 Resposta da API:"
  echo "$REDEPLOY_RESPONSE" | python3 -m json.tool
  exit 1
fi

echo "   ✅ Novo deployment criado: $NEW_DEPLOY_ID"
echo ""

# Monitor deployment status
echo "3️⃣ Aguardando conclusão do deploy..."
echo "   (Isso pode levar 2-3 minutos)"
echo ""

for i in {1..40}; do
  sleep 5
  
  STATUS=$(curl -s \
    -H "Authorization: Bearer $VERCEL_TOKEN" \
    "https://api.vercel.com/v13/deployments/$NEW_DEPLOY_ID?teamId=$TEAM_ID" \
    | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('readyState', ''))" 2>/dev/null)
  
  if [ "$STATUS" = "READY" ]; then
    echo "   ✅ Deploy concluído com sucesso!"
    echo ""
    echo "🎉 ADMIN DASHBOARD ATUALIZADO"
    echo "================================"
    echo ""
    echo "🌐 URL: https://admin.flipcars.us"
    echo ""
    echo "⚠️  IMPORTANTE:"
    echo "   Limpe o cache do browser antes de testar:"
    echo "   - Pressione: Ctrl + Shift + R"
    echo "   - Ou abra em aba anônima"
    echo ""
    exit 0
  elif [ "$STATUS" = "ERROR" ]; then
    echo "   ❌ Deploy falhou"
    echo ""
    echo "📋 Status detalhado:"
    curl -s \
      -H "Authorization: Bearer $VERCEL_TOKEN" \
      "https://api.vercel.com/v13/deployments/$NEW_DEPLOY_ID?teamId=$TEAM_ID" \
      | python3 -m json.tool
    exit 1
  fi
  
  echo -n "."
done

echo ""
echo "⏱️  Deploy ainda em progresso após 3 minutos"
echo ""
echo "📋 Verifique manualmente:"
echo "   https://vercel.com/chazmarques-blips-projects/flipcars-admin/deployments"
