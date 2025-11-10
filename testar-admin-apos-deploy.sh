#!/bin/bash

echo "🔍 VERIFICANDO STATUS DO SISTEMA FLIPCARS 2.0"
echo "=============================================="
echo ""

# 1. Testar Backend Railway
echo "1️⃣ Testando Backend (Railway)..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://upbeat-dedication-production.up.railway.app/api/health)
if [ "$BACKEND_STATUS" == "200" ] || [ "$BACKEND_STATUS" == "404" ]; then
  echo "   ✅ Backend está ONLINE (HTTP $BACKEND_STATUS)"
else
  echo "   ❌ Backend está OFFLINE ou com erro (HTTP $BACKEND_STATUS)"
fi
echo ""

# 2. Verificar se código está correto no repositório
echo "2️⃣ Verificando código no repositório..."
cd /home/user/webapp
MOCK_STATUS=$(grep "const USE_MOCK_DATA" frontend-admin/src/lib/api/lead.service.ts | grep -o "false\|true")
if [ "$MOCK_STATUS" == "false" ]; then
  echo "   ✅ USE_MOCK_DATA = false (correto!)"
else
  echo "   ❌ USE_MOCK_DATA = true (ainda com mock!)"
fi
echo ""

# 3. Verificar último commit
echo "3️⃣ Último commit no main:"
git log -1 --oneline
echo ""

# 4. Verificar se PR foi merged
echo "4️⃣ Status do PR #4:"
gh pr view 4 --json state,mergedAt --jq '.state + " - Merged: " + (.mergedAt // "não merged")'
echo ""

# 5. Instruções para testar
echo "=============================================="
echo "📋 PRÓXIMOS PASSOS PARA VOCÊ:"
echo "=============================================="
echo ""
echo "⏰ AGUARDE 2-5 MINUTOS para Vercel fazer deploy"
echo ""
echo "Depois:"
echo ""
echo "1. 🌐 Abrir navegador em MODO ANÔNIMO:"
echo "   Chrome: Ctrl+Shift+N"
echo "   Firefox: Ctrl+Shift+P"
echo ""
echo "2. 🔗 Acessar: https://admin.flipcars.us"
echo ""
echo "3. 🔑 Fazer login com suas credenciais"
echo ""
echo "4. 🔍 Clicar em 'Search' ou 'Leads' no menu"
echo ""
echo "5. 🎯 Buscar pelo lead: FLIP-20251109-0022"
echo ""
echo "6. ✅ VERIFICAR:"
echo "   - Lead aparece na lista"
echo "   - Dados estão corretos"
echo "   - Fotos são visíveis"
echo "   - Status = 'New'"
echo ""
echo "=============================================="
echo "🎉 SE TUDO FUNCIONAR:"
echo "=============================================="
echo ""
echo "Sistema está 100% operacional!"
echo "Admin sincronizado com banco de dados!"
echo "Novos leads aparecerão em tempo real!"
echo ""
echo "=============================================="
echo "🚨 SE NÃO FUNCIONAR:"
echo "=============================================="
echo ""
echo "1. Verificar se passou 5 minutos"
echo "2. Verificar GitHub Actions:"
echo "   https://github.com/chazmarques-blip/Flipcars-site-e-admin/actions"
echo "3. Limpar cache completamente:"
echo "   Ctrl+Shift+Delete → Limpar tudo"
echo "4. Tentar em outro navegador"
echo "5. Ver console do navegador (F12)"
echo ""
echo "=============================================="
