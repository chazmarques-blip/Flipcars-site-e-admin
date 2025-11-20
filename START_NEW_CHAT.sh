#!/bin/bash

# 🚀 Script para Iniciar Novo Chat com Contexto - FlipCars Project
# Criado em: 2025-11-20
# Uso: ./START_NEW_CHAT.sh

clear

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║         🚀 FlipCars - Novo Chat Context Helper              ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ Status: Dashboard mockup IMPLEMENTADO com sucesso!"
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "NEW_CHAT_CONTEXT.md" ]; then
    echo "❌ Erro: Execute este script do diretório /home/user/webapp/"
    exit 1
fi

echo "📋 Preparando informações do projeto..."
echo ""

# Obter informações do Git
echo "🔍 Informações do Repositório:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd /home/user/webapp
echo "Branch atual: $(git branch --show-current)"
echo "Último commit: $(git log -1 --oneline)"
echo "Commits à frente: $(git rev-list --count origin/genspark_ai_developer..HEAD 2>/dev/null || echo '0')"
echo ""

# Verificar servidores ativos
echo "🌐 Servidores Ativos:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verificar porta 3001 (Next.js)
if lsof -i :3001 > /dev/null 2>&1; then
    echo "✅ Next.js Dev Server (porta 3001): RODANDO"
    echo "   URL: https://3001-i0s90jm77mc76ydqc5fpz-2e77fc33.sandbox.novita.ai"
else
    echo "⚠️  Next.js Dev Server (porta 3001): PARADO"
    echo "   Para iniciar: cd frontend-admin && npm run dev"
fi

# Verificar porta 8765 (Mockup)
if lsof -i :8765 > /dev/null 2>&1; then
    echo "✅ Mockup Server (porta 8765): RODANDO"
    echo "   URL: https://8765-i0s90jm77mc76ydqc5fpz-2e77fc33.sandbox.novita.ai"
else
    echo "⚠️  Mockup Server (porta 8765): PARADO"
    echo "   Para iniciar: node serve-mockup.js"
fi
echo ""

# Status da PR
echo "📦 Pull Request:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PR #30: https://github.com/chazmarques-blip/Flipcars-site-e-admin/pull/30"
echo "Status: ABERTA e pronta para merge"
echo ""

# Componentes criados
echo "📁 Componentes Implementados:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Dashboard.module.css (699 linhas)"
echo "✅ 6 KPI Cards (Leads, Appointments, Overdue, Approved, Pending, Jobs)"
echo "✅ 2 Tables (WeeksLeads, Estimates - com scroll)"
echo "✅ 2 Actions (BusinessActions, ConversionFunnel)"
echo "✅ 3 Sidebar (MiniCalendar, UrgentActions, PerformanceTimeline)"
echo ""

# TODOs prioritários
echo "🎯 TODOs Prioritários:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. [ ] Merge da PR #30"
echo "2. [ ] Integrar estimateService API real"
echo "3. [ ] Integrar appointmentService API real"
echo "4. [ ] Integrar jobService API real"
echo "5. [ ] Implementar refresh automático de dados"
echo ""

# Arquivos importantes
echo "📚 Arquivos de Contexto:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. NEW_CHAT_CONTEXT.md - Contexto completo para novo chat"
echo "2. IMPLEMENTACAO_COMPLETA.md - Resumo da implementação"
echo "3. PLANO_IMPLEMENTACAO_MOCKUP.md - Plano original"
echo ""

# Gerar texto para copiar
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║         📋 TEXTO PARA INICIAR NOVO CHAT                      ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "Copie e cole o texto abaixo em um novo chat:"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cat << 'EOF'
Olá! Estou continuando o projeto FlipCars Dashboard.

**Status Atual**: ✅ Dashboard mockup IMPLEMENTADO com sucesso

**O que foi feito**:
- ✅ 15 componentes React/TypeScript criados
- ✅ CSS Module com estilos completos (699 linhas)
- ✅ Layout pixel-perfect replicando mockup aprovado
- ✅ Integração com leadService API (dados reais)
- ✅ Build bem-sucedido sem erros
- ✅ PR #30 criada e pronta para merge

**Links Importantes**:
- Dashboard: https://3001-i0s90jm77mc76ydqc5fpz-2e77fc33.sandbox.novita.ai/dashboard
- PR #30: https://github.com/chazmarques-blip/Flipcars-site-e-admin/pull/30
- Mockup: https://8765-i0s90jm77mc76ydqc5fpz-2e77fc33.sandbox.novita.ai

**Próximos Passos**:
1. Merge da PR #30
2. Integrar APIs reais (estimates, appointments, jobs)
3. Implementar refresh automático

**Preciso de ajuda com**: [descreva o que você quer fazer agora]

Para contexto completo, leia: `/home/user/webapp/NEW_CHAT_CONTEXT.md`
EOF
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Comandos rápidos úteis
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║         ⚡ COMANDOS RÁPIDOS                                   ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "# Ver contexto completo:"
echo "cat /home/user/webapp/NEW_CHAT_CONTEXT.md"
echo ""
echo "# Ver resumo da implementação:"
echo "cat /home/user/webapp/IMPLEMENTACAO_COMPLETA.md"
echo ""
echo "# Ver status git:"
echo "cd /home/user/webapp && git status"
echo ""
echo "# Ver PR:"
echo "cd /home/user/webapp && gh pr view 30"
echo ""
echo "# Iniciar Next.js dev server:"
echo "cd /home/user/webapp/frontend-admin && npm run dev"
echo ""
echo "# Iniciar mockup server:"
echo "cd /home/user/webapp && node serve-mockup.js"
echo ""
echo "# Build de produção:"
echo "cd /home/user/webapp/frontend-admin && npm run build"
echo ""

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║         ✅ CONTEXTO PREPARADO COM SUCESSO!                    ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "🎯 Agora você pode:"
echo "   1. Copiar o texto acima para um novo chat"
echo "   2. Ou ler NEW_CHAT_CONTEXT.md para detalhes completos"
echo "   3. Ou consultar os comandos rápidos quando precisar"
echo ""
echo "Boa sorte! 🚀"
echo ""
