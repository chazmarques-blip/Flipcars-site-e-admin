# 🔄 Workflow: Desenvolvimento vs Produção

**Como trabalhar com segurança sem afetar a produção**

---

## 🎯 Estratégia Recomendada: Git Flow Simplificado

```
main (produção)           ← Deploy automático para admin.flipcars.us
  ↑
  merge após testes
  ↑
development               ← Preview deploy automático
  ↑
  merge após revisão
  ↑
feature/minha-feature     ← Desenvolvimento local + preview deploy
```

---

## 📋 Passo a Passo: Nova Funcionalidade

### 1️⃣ **Criar Branch de Feature**

```bash
cd /home/user/webapp

# Garantir que está na main atualizada
git checkout main
git pull origin main

# Criar nova branch de feature
git checkout -b feature/nome-da-funcionalidade

# Exemplo:
git checkout -b feature/melhorar-dashboard
git checkout -b fix/corrigir-bug-leads
git checkout -b refactor/otimizar-performance
```

### 2️⃣ **Desenvolvimento Local**

```bash
cd /home/user/webapp/frontend-admin

# Instalar dependências (se necessário)
npm install

# Rodar servidor de desenvolvimento
npm run dev

# Servidor estará rodando em: http://localhost:3000
```

**Configuração Local (.env.local):**
```bash
# Usar API de desenvolvimento (se disponível)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# OU usar API de produção (com cuidado!)
NEXT_PUBLIC_API_URL=https://upbeat-dedication-production.up.railway.app/api
```

### 3️⃣ **Fazer Commits Atômicos**

```bash
# Fazer alterações no código...

# Verificar o que mudou
git status
git diff

# Adicionar arquivos
git add src/components/meu-componente.tsx
git add src/pages/minha-pagina.tsx

# Commit com mensagem clara
git commit -m "feat(dashboard): adicionar widget de estatísticas

- Criar componente StatsWidget
- Integrar com API de analytics
- Adicionar testes unitários
- Documentar props do componente"

# Push para GitHub
git push origin feature/melhorar-dashboard
```

**Convenção de Commits:**
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `refactor:` - Refatoração de código
- `style:` - Mudanças de estilo/formatação
- `docs:` - Documentação
- `test:` - Testes
- `chore:` - Manutenção/config

### 4️⃣ **Preview Deploy Automático**

Quando você faz `git push` da sua branch de feature, o Vercel automaticamente:

✅ Cria um **preview deployment**  
✅ Roda os builds  
✅ Gera URL única de preview  
✅ Comenta na PR com o link  

**Exemplo de URL:**
```
https://frontend-admin-git-feature-melhorar-dashboard-charles-marques-projects.vercel.app
```

**Como Acessar:**
1. Vá para GitHub: https://github.com/chazmarques-blip/Flipcars-site-e-admin
2. Clique na sua branch
3. Verá comentário do Vercel bot com link de preview

### 5️⃣ **Testar Preview Deploy**

```bash
# Limpar cache no navegador antes de testar
localStorage.clear();
sessionStorage.clear();
location.reload();

# Testar funcionalidade no preview URL
# Verificar console (F12) para erros
# Testar em diferentes navegadores/dispositivos
```

### 6️⃣ **Criar Pull Request**

```bash
# Via GitHub Web:
# 1. Ir para: https://github.com/chazmarques-blip/Flipcars-site-e-admin
# 2. Clicar em "Pull requests" → "New pull request"
# 3. Base: main ← Compare: feature/sua-branch
# 4. Preencher descrição detalhada
# 5. Adicionar screenshots/vídeos se aplicável
# 6. Marcar como "Draft" se ainda não estiver pronta

# Via CLI (gh - GitHub CLI):
gh pr create --title "feat: melhorar dashboard" \
  --body "## Mudanças
- Adiciona widget de estatísticas
- Melhora performance do carregamento
- Atualiza documentação

## Screenshots
[Adicionar imagens]

## Checklist
- [x] Testado localmente
- [x] Testado em preview deploy
- [x] Sem erros no console
- [x] TypeScript sem erros
- [ ] Revisão de código necessária"
```

**Template de PR:**
```markdown
## 📝 Descrição
[Descrever o que foi feito]

## 🎯 Motivação
[Por que essa mudança é necessária]

## 🧪 Como Testar
1. Ir para página X
2. Clicar em Y
3. Verificar que Z acontece

## 📸 Screenshots/Vídeos
[Adicionar evidências visuais]

## ✅ Checklist
- [ ] Código testado localmente
- [ ] Preview deploy testado
- [ ] Sem erros TypeScript
- [ ] Sem erros no console
- [ ] Documentação atualizada
- [ ] Commits seguem convenção
```

### 7️⃣ **Code Review & Merge**

```bash
# Após aprovação da PR:
# 1. Squash commits (opcional, recomendado)
# 2. Merge para main via GitHub interface
# 3. Delete branch após merge

# OU via CLI:
git checkout main
git pull origin main
git merge feature/sua-branch
git push origin main
git branch -d feature/sua-branch  # Deletar local
git push origin --delete feature/sua-branch  # Deletar remota
```

### 8️⃣ **Deploy Automático para Produção**

Quando você faz merge para `main`:

```
main branch atualizada
  ↓
Vercel detecta push
  ↓
Build automático (2-3 min)
  ↓
Deploy para admin.flipcars.us
  ↓
✅ Produção atualizada!
```

**Monitorar Deploy:**
```bash
# Via Vercel Dashboard:
https://vercel.com/charles-marques-projects/frontend-admin

# Via API:
source .vercel-credentials
curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v6/deployments?projectId=prj_sayFhHQpCbU34G9z7coTfknHoJre&limit=1"
```

---

## 🌳 Estrutura de Branches Recomendada

```
main
├── feature/dashboard-widgets
├── feature/leads-management
├── feature/claims-workflow
├── fix/header-responsive
├── fix/auth-token-refresh
└── refactor/api-client
```

**Naming Convention:**
- `feature/` - Novas funcionalidades
- `fix/` - Correções de bugs
- `refactor/` - Refatorações
- `hotfix/` - Correções urgentes para produção
- `chore/` - Manutenção (deps, config)

---

## 🚨 Hotfix: Correção Urgente em Produção

Se algo quebrar em produção e precisar correção imediata:

```bash
# 1. Criar branch hotfix direto da main
git checkout main
git pull origin main
git checkout -b hotfix/corrigir-erro-critico

# 2. Fazer correção mínima necessária
# ... editar código ...

# 3. Commit e push
git add .
git commit -m "hotfix: corrigir erro crítico no login"
git push origin hotfix/corrigir-erro-critico

# 4. Criar PR urgente
gh pr create --title "HOTFIX: Corrigir erro crítico no login" \
  --body "Erro crítico que impede login. Correção testada localmente."

# 5. Merge imediato após review rápido
# 6. Deploy automático acontece

# 7. Deletar branch após merge
git checkout main
git pull origin main
git branch -d hotfix/corrigir-erro-critico
```

---

## 🧪 Ambientes de Teste

### Local Development
```
URL: http://localhost:3000
API: localhost:3000/api OU Railway backend
Deploy: Manual (npm run dev)
Dados: Teste/Mock
```

### Preview Deploy (Vercel)
```
URL: https://frontend-admin-git-BRANCH-charles-marques-projects.vercel.app
API: Railway backend (produção)
Deploy: Automático em cada push
Dados: ⚠️ Produção (cuidado!)
```

### Production
```
URL: https://admin.flipcars.us
API: Railway backend (produção)
Deploy: Automático no merge para main
Dados: ⚠️ Produção REAL!
```

---

## 📊 Monitoramento de Deploys

### Ver Histórico de Deploys

```bash
source .vercel-credentials

# Últimos 5 deploys
curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v6/deployments?projectId=prj_sayFhHQpCbU34G9z7coTfknHoJre&limit=5" | \
  jq -r '.deployments[] | "\(.state) | \(.meta.githubCommitSha[0:8]) | \(.meta.githubCommitMessage)"'
```

### Rollback (Se Necessário)

```bash
# Opção 1: Revert no Git
git checkout main
git revert HEAD  # Reverte último commit
git push origin main  # Trigger novo deploy

# Opção 2: Rollback no Vercel Dashboard
# 1. Ir para: https://vercel.com/charles-marques-projects/frontend-admin
# 2. Deployments → Encontrar deploy anterior funcionando
# 3. Clicar nos 3 pontinhos → "Promote to Production"

# Opção 3: Redeploy commit específico via API
COMMIT_SHA="8de6e703"  # Commit que funcionava
curl -X POST "https://api.vercel.com/v13/deployments" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"frontend-admin\",
    \"project\": \"prj_sayFhHQpCbU34G9z7coTfknHoJre\",
    \"target\": \"production\",
    \"gitSource\": {
      \"type\": \"github\",
      \"ref\": \"$COMMIT_SHA\",
      \"repoId\": 1085182472
    }
  }"
```

---

## 🔐 Segurança: Proteger Branch Main

**Configurar Branch Protection no GitHub:**

1. Ir para: https://github.com/chazmarques-blip/Flipcars-site-e-admin/settings/branches
2. Adicionar regra para `main`:
   - ☑️ Require pull request reviews before merging
   - ☑️ Require status checks to pass (Vercel build)
   - ☑️ Require branches to be up to date
   - ☑️ Do not allow bypassing the above settings

Isso garante que:
- ❌ Não pode fazer push direto para main
- ✅ Só pode mergear via Pull Request
- ✅ Build do Vercel precisa passar
- ✅ Código precisa ser revisado

---

## 📚 Recursos Úteis

**Comandos Git Essenciais:**
```bash
# Ver branches locais
git branch

# Ver branches remotas
git branch -r

# Mudar de branch
git checkout nome-da-branch

# Criar e mudar para nova branch
git checkout -b nova-branch

# Atualizar branch com main
git checkout minha-branch
git merge main

# Ver histórico de commits
git log --oneline --graph --all

# Desfazer último commit (mantendo mudanças)
git reset --soft HEAD~1

# Desfazer mudanças não commitadas
git restore arquivo.tsx
git restore .  # Todos os arquivos
```

**Vercel CLI (Alternativa):**
```bash
# Instalar
npm i -g vercel

# Login
vercel login

# Ver projetos
vercel list

# Deploy manual
vercel --prod

# Ver logs
vercel logs admin.flipcars.us
```

---

## ✅ Workflow Recomendado: Resumo

```bash
# 1. Nova feature
git checkout -b feature/minha-feature

# 2. Desenvolver localmente
npm run dev  # Testar em localhost:3000

# 3. Commit
git add .
git commit -m "feat: descrição"
git push origin feature/minha-feature

# 4. Testar preview deploy
# URL: https://frontend-admin-git-feature-minha-feature-....vercel.app

# 5. Criar PR
gh pr create

# 6. Review + Merge
# Via GitHub interface

# 7. Deploy automático para produção!
# admin.flipcars.us atualizado automaticamente
```

---

**🎯 Com esse workflow, você pode desenvolver com segurança sem afetar a produção!**
