# 🛠️ Scripts Helper

Scripts úteis para facilitar o desenvolvimento do FlipCars Admin.

## 📋 Scripts Disponíveis

### `dev-workflow.sh`

Script interativo para gerenciar workflow de desenvolvimento.

**Como usar:**
```bash
./scripts/dev-workflow.sh
```

**Funcionalidades:**
- ✅ Criar nova feature branch
- ✅ Fazer commits com convenção
- ✅ Push e criar PR
- ✅ Atualizar branch com main
- ✅ Merge para main
- ✅ Criar hotfix
- ✅ Ver status do projeto
- ✅ Testar API backend
- ✅ Ver deploys no Vercel

## 🎯 Workflow Recomendado

```bash
# 1. Iniciar novo desenvolvimento
./scripts/dev-workflow.sh
# Escolher opção 1: Criar nova feature branch

# 2. Fazer alterações no código...

# 3. Commit
./scripts/dev-workflow.sh
# Escolher opção 2: Commit mudanças

# 4. Push e PR
./scripts/dev-workflow.sh
# Escolher opção 3: Push e criar PR

# 5. Após aprovação, merge via GitHub interface
```

## 🚨 Hotfix Urgente

```bash
./scripts/dev-workflow.sh
# Escolher opção 6: Criar hotfix
# Fazer correção mínima
# Commit, push, PR urgente
```

## 📊 Verificar Status

```bash
./scripts/dev-workflow.sh
# Escolher opção 7: Ver status do projeto
```

## 🧪 Testar Backend

```bash
./scripts/dev-workflow.sh
# Escolher opção 8: Testar API backend
```

## 🔍 Ver Deploys

```bash
./scripts/dev-workflow.sh
# Escolher opção 9: Ver deploys no Vercel
```

