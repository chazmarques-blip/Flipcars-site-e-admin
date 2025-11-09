#!/bin/bash
# dev-workflow.sh - Helper script for development workflow

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "\n${BLUE}============================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if in correct directory
if [ ! -d ".git" ]; then
    print_error "Not in a git repository!"
    exit 1
fi

# Main menu
show_menu() {
    print_header "FlipCars Dev Workflow Helper"
    echo "1) 🌿 Criar nova feature branch"
    echo "2) 📝 Commit mudanças"
    echo "3) 🚀 Push e criar PR"
    echo "4) 🔄 Atualizar branch com main"
    echo "5) ✅ Merge feature para main"
    echo "6) 🚨 Criar hotfix"
    echo "7) 📊 Ver status do projeto"
    echo "8) 🧪 Testar API backend"
    echo "9) 🔍 Ver deploys no Vercel"
    echo "0) ❌ Sair"
    echo ""
    read -p "Escolha uma opção: " choice
    echo ""
}

# Create new feature branch
create_feature() {
    print_header "Criar Nova Feature Branch"
    
    # Update main first
    print_warning "Atualizando branch main..."
    git checkout main
    git pull origin main
    
    # Get feature name
    read -p "Nome da feature (ex: melhorar-dashboard): " feature_name
    
    if [ -z "$feature_name" ]; then
        print_error "Nome da feature não pode ser vazio!"
        return 1
    fi
    
    # Create branch
    branch_name="feature/$feature_name"
    git checkout -b "$branch_name"
    
    print_success "Branch '$branch_name' criada!"
    print_warning "Você está agora na branch: $(git branch --show-current)"
    echo ""
    echo "Próximos passos:"
    echo "1. Desenvolva sua funcionalidade"
    echo "2. Use opção 2 para fazer commits"
    echo "3. Use opção 3 para push e criar PR"
}

# Commit changes
commit_changes() {
    print_header "Commit Mudanças"
    
    # Show status
    echo "Status atual:"
    git status -s
    echo ""
    
    # Select commit type
    echo "Tipo de commit:"
    echo "1) feat     - Nova funcionalidade"
    echo "2) fix      - Correção de bug"
    echo "3) refactor - Refatoração"
    echo "4) style    - Mudanças de estilo"
    echo "5) docs     - Documentação"
    echo "6) test     - Testes"
    echo "7) chore    - Manutenção"
    echo ""
    read -p "Escolha o tipo: " commit_type_choice
    
    case $commit_type_choice in
        1) commit_type="feat" ;;
        2) commit_type="fix" ;;
        3) commit_type="refactor" ;;
        4) commit_type="style" ;;
        5) commit_type="docs" ;;
        6) commit_type="test" ;;
        7) commit_type="chore" ;;
        *) print_error "Opção inválida!"; return 1 ;;
    esac
    
    # Get commit scope
    read -p "Scope (ex: dashboard, auth, api): " scope
    
    # Get commit message
    read -p "Mensagem do commit: " message
    
    if [ -z "$message" ]; then
        print_error "Mensagem não pode ser vazia!"
        return 1
    fi
    
    # Build commit message
    if [ -z "$scope" ]; then
        full_message="$commit_type: $message"
    else
        full_message="$commit_type($scope): $message"
    fi
    
    # Add all and commit
    git add -A
    git commit -m "$full_message"
    
    print_success "Commit criado: $full_message"
}

# Push and create PR
push_and_pr() {
    print_header "Push e Criar Pull Request"
    
    current_branch=$(git branch --show-current)
    
    if [ "$current_branch" = "main" ]; then
        print_error "Você está na branch main! Não é recomendado fazer push direto."
        read -p "Deseja continuar mesmo assim? (y/N): " confirm
        if [ "$confirm" != "y" ]; then
            return 1
        fi
    fi
    
    # Push
    print_warning "Fazendo push da branch '$current_branch'..."
    git push origin "$current_branch"
    
    print_success "Push realizado!"
    echo ""
    
    if [ "$current_branch" != "main" ]; then
        echo "🔗 Preview Deploy será criado automaticamente pelo Vercel"
        echo "🔗 URL: https://frontend-admin-git-${current_branch}-charles-marques-projects.vercel.app"
        echo ""
        echo "Para criar Pull Request:"
        echo "1. Acesse: https://github.com/chazmarques-blip/Flipcars-site-e-admin/compare"
        echo "2. Ou use: gh pr create (se tiver GitHub CLI instalado)"
    fi
}

# Update branch with main
update_from_main() {
    print_header "Atualizar Branch com Main"
    
    current_branch=$(git branch --show-current)
    
    if [ "$current_branch" = "main" ]; then
        print_warning "Você já está na branch main. Fazendo pull..."
        git pull origin main
        print_success "Branch main atualizada!"
        return 0
    fi
    
    print_warning "Atualizando main..."
    git checkout main
    git pull origin main
    
    print_warning "Voltando para '$current_branch' e mergeando..."
    git checkout "$current_branch"
    git merge main
    
    print_success "Branch '$current_branch' atualizada com main!"
}

# Merge to main
merge_to_main() {
    print_header "Merge Feature para Main"
    
    current_branch=$(git branch --show-current)
    
    if [ "$current_branch" = "main" ]; then
        print_error "Você já está na main!"
        return 1
    fi
    
    print_warning "⚠️  IMPORTANTE: Use Pull Request no GitHub ao invés de merge local!"
    echo ""
    echo "Workflow recomendado:"
    echo "1. Use opção 3 para fazer push"
    echo "2. Crie Pull Request no GitHub"
    echo "3. Aguarde review"
    echo "4. Merge via interface do GitHub"
    echo ""
    read -p "Deseja fazer merge local mesmo assim? (y/N): " confirm
    
    if [ "$confirm" != "y" ]; then
        return 0
    fi
    
    # Update main
    git checkout main
    git pull origin main
    
    # Merge
    git merge "$current_branch"
    git push origin main
    
    # Delete branch
    read -p "Deletar branch '$current_branch'? (y/N): " delete_confirm
    if [ "$delete_confirm" = "y" ]; then
        git branch -d "$current_branch"
        git push origin --delete "$current_branch"
        print_success "Branch '$current_branch' deletada!"
    fi
    
    print_success "Merge completo! Deploy automático será iniciado."
}

# Create hotfix
create_hotfix() {
    print_header "Criar Hotfix"
    
    # Update main
    git checkout main
    git pull origin main
    
    # Get hotfix name
    read -p "Descrição do hotfix (ex: corrigir-erro-login): " hotfix_name
    
    if [ -z "$hotfix_name" ]; then
        print_error "Descrição não pode ser vazia!"
        return 1
    fi
    
    # Create branch
    branch_name="hotfix/$hotfix_name"
    git checkout -b "$branch_name"
    
    print_success "Branch de hotfix '$branch_name' criada!"
    print_warning "⚠️  Faça apenas a correção mínima necessária!"
    echo ""
    echo "Próximos passos:"
    echo "1. Faça a correção"
    echo "2. Teste localmente"
    echo "3. Commit (opção 2)"
    echo "4. Push e PR urgente (opção 3)"
    echo "5. Merge imediato após review"
}

# Project status
project_status() {
    print_header "Status do Projeto"
    
    echo "📍 Branch atual: $(git branch --show-current)"
    echo "📊 Commits não enviados:"
    git log origin/$(git branch --show-current)..HEAD --oneline 2>/dev/null || echo "  Nenhum"
    echo ""
    
    echo "🔄 Status do working directory:"
    git status -s || echo "  Limpo"
    echo ""
    
    echo "🌿 Branches locais:"
    git branch
    echo ""
    
    echo "🌐 Branches remotas:"
    git branch -r | grep -v HEAD
    echo ""
}

# Test backend API
test_backend() {
    print_header "Testar API Backend"
    
    API_URL="https://upbeat-dedication-production.up.railway.app/api"
    
    echo "1) Health check"
    echo "2) Login test"
    echo "3) Listar leads"
    echo "4) Listar customers"
    echo "5) Ver documentação Swagger"
    echo ""
    read -p "Escolha uma opção: " api_choice
    
    case $api_choice in
        1)
            echo ""
            print_warning "Testing health endpoint..."
            curl -s "$API_URL/../health" | jq .
            ;;
        2)
            echo ""
            print_warning "Testing login..."
            curl -s -X POST "$API_URL/auth/login" \
                -H "Content-Type: application/json" \
                -d '{"email":"admin@flipcars.com","password":"Admin123!"}' | jq .
            ;;
        3)
            echo ""
            read -p "Access Token: " token
            curl -s -H "Authorization: Bearer $token" "$API_URL/leads" | jq .
            ;;
        4)
            echo ""
            read -p "Access Token: " token
            curl -s -H "Authorization: Bearer $token" "$API_URL/customers" | jq .
            ;;
        5)
            echo ""
            echo "🔗 Swagger UI: https://upbeat-dedication-production.up.railway.app/api/docs"
            ;;
        *)
            print_error "Opção inválida!"
            ;;
    esac
}

# View Vercel deployments
view_deployments() {
    print_header "Ver Deploys no Vercel"
    
    if [ ! -f ".vercel-credentials" ]; then
        print_error "Arquivo .vercel-credentials não encontrado!"
        echo "Configure o token do Vercel primeiro."
        return 1
    fi
    
    source .vercel-credentials
    
    print_warning "Últimos 5 deploys:"
    echo ""
    
    curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
        "https://api.vercel.com/v6/deployments?projectId=prj_sayFhHQpCbU34G9z7coTfknHoJre&limit=5" | \
        jq -r '.deployments[] | "[\(.state)] \(.meta.githubCommitSha[0:8]) - \(.meta.githubCommitMessage // "No message")"'
    
    echo ""
    echo "🔗 Vercel Dashboard: https://vercel.com/charles-marques-projects/frontend-admin"
    echo "🔗 Produção: https://admin.flipcars.us"
}

# Main loop
while true; do
    show_menu
    
    case $choice in
        1) create_feature ;;
        2) commit_changes ;;
        3) push_and_pr ;;
        4) update_from_main ;;
        5) merge_to_main ;;
        6) create_hotfix ;;
        7) project_status ;;
        8) test_backend ;;
        9) view_deployments ;;
        0) 
            print_success "Até logo!"
            exit 0
            ;;
        *)
            print_error "Opção inválida!"
            ;;
    esac
    
    echo ""
    read -p "Pressione Enter para continuar..."
done
