#!/bin/bash

# Script para aguardar o deploy completar e testar automaticamente

BACKEND_URL="https://upbeat-dedication-production.up.railway.app"
MAX_WAIT=10  # 10 tentativas de 30 segundos = 5 minutos
CURRENT_TRY=0

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                                                                  ║"
echo "║     🔄 AGUARDANDO DEPLOY DO RAILWAY COMPLETAR                    ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
echo "⏳ O deploy está em andamento..."
echo "   Backend URL: $BACKEND_URL"
echo "   Tempo máximo de espera: 5 minutos"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

while [ $CURRENT_TRY -lt $MAX_WAIT ]; do
    CURRENT_TRY=$((CURRENT_TRY + 1))
    ELAPSED=$((CURRENT_TRY * 30))
    
    echo "🔍 Tentativa $CURRENT_TRY/$MAX_WAIT (${ELAPSED}s decorridos)..."
    
    # Tenta acessar o health check
    HTTP_CODE=$(curl -s -o /tmp/health_response.json -w "%{http_code}" "$BACKEND_URL/api/health" --max-time 10 2>/dev/null)
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo "   ✅ Backend respondeu! HTTP 200"
        UPTIME=$(cat /tmp/health_response.json | jq -r '.uptime' 2>/dev/null)
        
        # Se uptime é baixo (< 60s), é o novo deploy
        if [ ! -z "$UPTIME" ] && [ "$UPTIME" != "null" ]; then
            UPTIME_INT=$(echo "$UPTIME" | cut -d'.' -f1)
            if [ "$UPTIME_INT" -lt 120 ]; then
                echo "   ✅ NOVO DEPLOY CONFIRMADO! Uptime: ${UPTIME}s"
                echo ""
                echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                echo ""
                echo "🎉 DEPLOY COMPLETADO!"
                echo ""
                echo "Aguardando mais 15 segundos para garantir estabilidade..."
                sleep 15
                echo ""
                break
            else
                echo "   ⚠️  Backend respondeu mas uptime alto (${UPTIME}s) - deploy antigo ainda ativo"
            fi
        fi
    elif [ "$HTTP_CODE" = "502" ] || [ "$HTTP_CODE" = "503" ]; then
        echo "   🔄 Backend reiniciando (HTTP $HTTP_CODE)"
    elif [ "$HTTP_CODE" = "000" ]; then
        echo "   ⏳ Backend não respondeu (timeout ou down)"
    else
        echo "   ⚠️  Resposta inesperada: HTTP $HTTP_CODE"
    fi
    
    if [ $CURRENT_TRY -lt $MAX_WAIT ]; then
        echo "   ⏰ Aguardando 30 segundos antes da próxima tentativa..."
        echo ""
        sleep 30
    fi
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $CURRENT_TRY -ge $MAX_WAIT ]; then
    echo "⚠️  TIMEOUT: Deploy ainda não completou após 5 minutos"
    echo ""
    echo "Isso pode significar:"
    echo "  1. Deploy está demorando mais que o normal"
    echo "  2. Houve algum erro no build ou migrations"
    echo ""
    echo "📊 O que fazer:"
    echo "  1. Verifique os logs no Railway:"
    echo "     https://railway.app/project/inspiring-imagination"
    echo ""
    echo "  2. Vá em: Deployments → último deploy → Deploy Logs"
    echo ""
    echo "  3. Procure por erros (linhas em vermelho)"
    echo ""
    echo "  4. Se não houver erros, aguarde mais alguns minutos e execute:"
    echo "     bash /home/user/webapp/aguardar-e-testar.sh"
    echo ""
    exit 1
fi

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                                                                  ║"
echo "║         🧪 EXECUTANDO TESTES COMPLETOS AGORA                     ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Executar o script de testes completo
bash /home/user/webapp/testar-projeto.sh

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo ""
echo "Se os testes passaram:"
echo "  ✅ Faça login no admin: https://admin.flipcars.us"
echo "     Email: superadmin@flipcars.us"
echo "     Password: Password123!"
echo ""
echo "  ✅ Teste criar um lead no site: https://flipcars.us"
echo ""
echo "  ✅ Verifique o lead no admin"
echo ""
echo "Se os testes falharam:"
echo "  ❌ Verifique os logs no Railway"
echo "  ❌ Execute novamente: bash testar-projeto.sh"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
