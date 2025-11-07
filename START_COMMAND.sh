#!/bin/bash

# ═══════════════════════════════════════════════════════════════════
# 🚀 FLIPCARS - COMANDO DE INÍCIO PARA PRÓXIMO CHAT
# ═══════════════════════════════════════════════════════════════════

echo -e "\n🎯 INICIANDO CONTEXTO DO PROJETO FLIPCARS...\n"

# Navegar para o diretório
cd /home/user/webapp/frontend-admin

# Mostrar informações essenciais
echo "═══════════════════════════════════════════════════════════════════"
echo "📂 PROJETO: FlipCars Auto Repair - Admin Dashboard"
echo "═══════════════════════════════════════════════════════════════════"

echo -e "\n📍 Diretório Atual:"
pwd

echo -e "\n🌿 Branch Atual:"
git branch --show-current

echo -e "\n📊 Status Git:"
git status -sb

echo -e "\n📝 Últimos 3 Commits:"
git log --oneline -3

echo -e "\n🔀 Pull Request Ativo:"
gh pr list --head genspark_ai_developer 2>/dev/null || echo "Comando gh não disponível"

echo -e "\n🖥️  Status dos Servidores:"
if pgrep -f "next dev" > /dev/null; then
    echo "✅ Dev server está RODANDO"
    echo "   Port 3002: Admin Dashboard"
else
    echo "❌ Dev server NÃO está rodando"
    echo "   Para iniciar: cd /home/user/webapp/frontend-admin && npm run dev"
fi

echo -e "\n📚 Arquivos de Documentação Disponíveis:"
echo "   📖 Guia Completo: cat /home/user/webapp/NEXT_SESSION_COMPLETE_GUIDE.md"
echo "   📋 Comandos: cat /home/user/webapp/COMANDO_PROXIMO_CHAT.txt"

echo -e "\n🔗 Links Importantes:"
echo "   🌐 Admin Dashboard: http://localhost:3002/dashboard"
echo "   🧪 Test Estimate: http://localhost:3002/dashboard/estimate-test"
echo "   📦 Repository: https://github.com/chazmarques-blip/Flipcars-site-e-admin"
echo "   🔀 Pull Request: https://github.com/chazmarques-blip/Flipcars-site-e-admin/pull/2"

echo -e "\n✅ ÚLTIMA SESSÃO - Resumo:"
echo "   ✓ Skip photos button fix"
echo "   ✓ Form size reduction (70%)"
echo "   ✓ Professional print layout with map"
echo "   ✓ Custom photo masks (6 SVG designs)"
echo "   ✓ Photo labels updated (Driver/Passenger)"
echo "   ✓ Bug fixes (component reference error)"

echo -e "\n💾 Estado Atual:"
echo "   ✅ Todas funcionalidades implementadas"
echo "   ✅ PR #2 pronto para revisão"
echo "   ✅ Sem bugs conhecidos"
echo "   ⏳ Aguardando aprovação do usuário"

echo -e "\n═══════════════════════════════════════════════════════════════════"
echo "✅ CONTEXTO CARREGADO! Pronto para continuar o trabalho! 🚀"
echo "═══════════════════════════════════════════════════════════════════\n"
