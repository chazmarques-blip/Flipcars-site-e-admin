#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Railway CLI Commands - FlipCars Backend
# ═══════════════════════════════════════════════════════════════
# Use estes comandos APÓS configurar o Railway Dashboard
# Data: 07/Nov/2025
# ═══════════════════════════════════════════════════════════════

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Railway CLI - FlipCars Backend Setup              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 1: Instalar Railway CLI
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[PASSO 1]${NC} Instalando Railway CLI..."
echo -e "${GREEN}➜${NC} npm install -g @railway/cli"
echo ""

npm install -g @railway/cli

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Railway CLI instalado com sucesso!"
else
    echo -e "${RED}✗${NC} Erro ao instalar Railway CLI"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 2: Login no Railway
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[PASSO 2]${NC} Fazendo login no Railway..."
echo -e "${GREEN}➜${NC} railway login"
echo ""
echo -e "${BLUE}ℹ${NC}  Um browser será aberto para autenticação"
echo -e "${BLUE}ℹ${NC}  Complete o login e volte aqui"
echo ""

railway login

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Login realizado com sucesso!"
else
    echo -e "${RED}✗${NC} Erro ao fazer login"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 3: Link ao Projeto
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[PASSO 3]${NC} Linkando ao projeto Railway..."
echo -e "${GREEN}➜${NC} railway link"
echo ""
echo -e "${BLUE}ℹ${NC}  Quando perguntado:"
echo -e "${BLUE}   → Projeto: ${GREEN}inspiring-imagination${NC}"
echo -e "${BLUE}   → Serviço: ${GREEN}upbeat-dedication${NC}"
echo ""

cd /home/user/webapp/backend
railway link

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Projeto linkado com sucesso!"
else
    echo -e "${RED}✗${NC} Erro ao linkar projeto"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 4: Verificar Variáveis de Ambiente
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[PASSO 4]${NC} Verificando variáveis de ambiente..."
echo -e "${GREEN}➜${NC} railway variables"
echo ""

railway variables

echo ""
echo -e "${BLUE}ℹ${NC}  Verifique se as seguintes variáveis existem:"
echo -e "   ${GREEN}✓${NC} NODE_ENV=production"
echo -e "   ${GREEN}✓${NC} PORT=3001"
echo -e "   ${GREEN}✓${NC} FRONTEND_URL=..."
echo -e "   ${GREEN}✓${NC} DATABASE_TYPE=postgres"
echo -e "   ${GREEN}✓${NC} DATABASE_URL=... (auto-injetada)"
echo -e "   ${GREEN}✓${NC} JWT_SECRET=..."
echo -e "   ${GREEN}✓${NC} JWT_REFRESH_SECRET=..."
echo ""

read -p "Todas as variáveis estão OK? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}✗${NC} Configure as variáveis no Railway Dashboard primeiro"
    echo -e "${BLUE}ℹ${NC}  Veja: RAILWAY_SETUP_STEPS.md - Passo 3"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 5: Rodar Migrations
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[PASSO 5]${NC} Rodando database migrations..."
echo -e "${GREEN}➜${NC} railway run npm run migration:run"
echo ""

railway run npm run migration:run

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Migrations executadas com sucesso!"
else
    echo -e "${RED}✗${NC} Erro ao executar migrations"
    echo -e "${BLUE}ℹ${NC}  Verifique se o PostgreSQL está rodando"
    echo -e "${BLUE}ℹ${NC}  Verifique se DATABASE_URL está configurada"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 6: Verificar Migrations
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[PASSO 6]${NC} Verificando migrations executadas..."
echo -e "${GREEN}➜${NC} railway run npm run migration:show"
echo ""

railway run npm run migration:show

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 7: Rodar Seeds (Criar Admin User)
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[PASSO 7]${NC} Rodando database seeds (criar admin user)..."
echo -e "${GREEN}➜${NC} railway run npm run seed"
echo ""

railway run npm run seed

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Seeds executados com sucesso!"
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║     CREDENCIAIS DO ADMIN CRIADAS COM SUCESSO!         ║${NC}"
    echo -e "${GREEN}╠════════════════════════════════════════════════════════╣${NC}"
    echo -e "${GREEN}║  Email:    superadmin@flipcars.us                      ║${NC}"
    echo -e "${GREEN}║  Password: Password123!                                ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
else
    echo -e "${RED}✗${NC} Erro ao executar seeds"
    echo -e "${BLUE}ℹ${NC}  Pode ser que o seed já tenha sido executado antes"
    echo -e "${BLUE}ℹ${NC}  Tente fazer login no admin dashboard"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ═══════════════════════════════════════════════════════════════
# PASSO 8: Verificar Status do Deploy
# ═══════════════════════════════════════════════════════════════

echo -e "${YELLOW}[PASSO 8]${NC} Verificando status do serviço..."
echo -e "${GREEN}➜${NC} railway status"
echo ""

railway status

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ═══════════════════════════════════════════════════════════════
# FINALIZAÇÃO
# ═══════════════════════════════════════════════════════════════

echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              SETUP CONCLUÍDO COM SUCESSO! 🎉           ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Próximos passos:${NC}"
echo ""
echo -e "1. ${YELLOW}Configurar domínio:${NC}"
echo -e "   ${GREEN}→${NC} Railway Dashboard → Settings → Networking"
echo -e "   ${GREEN}→${NC} Add Custom Domain: api.flipcars.us"
echo ""
echo -e "2. ${YELLOW}Configurar DNS no GoDaddy:${NC}"
echo -e "   ${GREEN}→${NC} Adicionar CNAME: api → <railway-domain>"
echo ""
echo -e "3. ${YELLOW}Testar backend:${NC}"
echo -e "   ${GREEN}→${NC} curl https://api.flipcars.us/api/health"
echo ""
echo -e "4. ${YELLOW}Fazer login no admin:${NC}"
echo -e "   ${GREEN}→${NC} https://admin.flipcars.us"
echo -e "   ${GREEN}→${NC} superadmin@flipcars.us / Password123!"
echo ""
echo -e "${BLUE}Comandos úteis:${NC}"
echo ""
echo -e "  ${GREEN}railway logs${NC}          - Ver logs em tempo real"
echo -e "  ${GREEN}railway status${NC}        - Ver status do deploy"
echo -e "  ${GREEN}railway open${NC}          - Abrir dashboard no browser"
echo -e "  ${GREEN}railway variables${NC}     - Ver variáveis de ambiente"
echo -e "  ${GREEN}railway shell${NC}         - SSH no container"
echo ""
echo -e "${GREEN}✓${NC} Backend: https://api.flipcars.us"
echo -e "${GREEN}✓${NC} Admin:   https://admin.flipcars.us"
echo -e "${GREEN}✓${NC} Public:  https://flipcars.us"
echo ""
echo -e "${BLUE}Documentação:${NC}"
echo -e "  - RAILWAY_SETUP_STEPS.md      (guia completo)"
echo -e "  - RAILWAY_QUICK_CHECKLIST.md  (checklist rápido)"
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
