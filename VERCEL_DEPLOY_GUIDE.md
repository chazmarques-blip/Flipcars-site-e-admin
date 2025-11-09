# 🚀 Guia de Deploy Rápido via Vercel API

**Token salvo em:** `.vercel-credentials` (não commitado no git)

---

## 🔑 **Quick Commands**

### 1. Carregar Token
```bash
source .vercel-credentials
```

### 2. Listar Projetos
```bash
curl -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v9/projects"
```

### 3. Forçar Redeploy do Frontend-Admin
```bash
curl -X POST "https://api.vercel.com/v13/deployments" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "frontend-admin",
    "project": "prj_sayFhHQpCbU34G9z7coTfknHoJre",
    "target": "production",
    "gitSource": {
      "type": "github",
      "ref": "main",
      "repoId": 1085182472
    }
  }'
```

### 4. Verificar Status de um Deploy
```bash
# Substituir DEPLOY_ID pelo ID retornado no passo 3
curl -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v13/deployments/DEPLOY_ID"
```

---

## 📊 **Informações dos Projetos**

### Frontend Admin (FlipCars Admin)
- **Project ID:** `prj_sayFhHQpCbU34G9z7coTfknHoJre`
- **URL:** https://admin.flipcars.us
- **Repo:** Flipcars-site-e-admin
- **Root Directory:** `frontend-admin`
- **Framework:** Next.js

### Public Site (FlipCars Public)
- **Project ID:** `prj_eDxWdvpR7LtBS8cjXVO7jk1kkp8g`
- **URL:** https://www.flipcars.us
- **Repo:** Flipcars-site-e-admin
- **Root Directory:** `frontend-public`
- **Framework:** Next.js

---

## 🔧 **Scripts Úteis**

### Deploy Script
```bash
#!/bin/bash
# deploy-frontend.sh
source /home/user/webapp/.vercel-credentials

PROJECT_ID="prj_sayFhHQpCbU34G9z7coTfknHoJre"
REPO_ID="1085182472"

echo "🚀 Iniciando deploy do FlipCars Admin..."

RESPONSE=$(curl -X POST "https://api.vercel.com/v13/deployments" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"frontend-admin\",
    \"project\": \"$PROJECT_ID\",
    \"target\": \"production\",
    \"gitSource\": {
      \"type\": \"github\",
      \"ref\": \"main\",
      \"repoId\": $REPO_ID
    }
  }" 2>/dev/null)

DEPLOY_ID=$(echo $RESPONSE | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

echo "✅ Deploy iniciado: $DEPLOY_ID"
echo "📊 Inspector: https://vercel.com/charles-marques-projects/frontend-admin/$DEPLOY_ID"
```

### Check Deploy Status Script
```bash
#!/bin/bash
# check-deploy.sh
source /home/user/webapp/.vercel-credentials

DEPLOY_ID=$1

if [ -z "$DEPLOY_ID" ]; then
  echo "Usage: ./check-deploy.sh DEPLOY_ID"
  exit 1
fi

STATUS=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v13/deployments/$DEPLOY_ID" | \
  grep -o '"readyState":"[^"]*"' | head -1 | cut -d'"' -f4)

echo "📊 Deploy Status: $STATUS"
```

---

## 🎯 **Casos de Uso Comuns**

### Caso 1: Deploy não está acontecendo automaticamente
```bash
# 1. Force redeploy via API
source .vercel-credentials
curl -X POST "https://api.vercel.com/v13/deployments" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"frontend-admin","project":"prj_sayFhHQpCbU34G9z7coTfknHoJre","target":"production","gitSource":{"type":"github","ref":"main","repoId":1085182472}}'

# 2. Aguarde 90 segundos
sleep 90

# 3. Verifique o site
curl -I https://admin.flipcars.us | grep etag
```

### Caso 2: Cache não está invalidando
```bash
# 1. Force redeploy sem cache
# (mesmo comando do Caso 1, Vercel decide automaticamente)

# 2. Limpe CDN do domínio personalizado
curl -X PURGE "https://admin.flipcars.us"
```

### Caso 3: Verificar último deploy
```bash
source .vercel-credentials
curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v9/projects/prj_sayFhHQpCbU34G9z7coTfknHoJre" | \
  grep -o '"readyAt":[^,]*' | head -1
```

---

## 🔐 **Segurança**

### Token Permissions:
- ✅ Full Account Access
- ⚠️ **NUNCA** commitar este token no git
- ✅ Já adicionado ao `.gitignore`

### Revogar Token:
1. Acesse: https://vercel.com/account/tokens
2. Encontre: "FlipCars-Debug-Token"
3. Click "Delete"

### Rotacionar Token:
1. Revogue o token atual
2. Crie um novo token
3. Atualize `.vercel-credentials`

---

## 📚 **Documentação Vercel API**

- **API Reference:** https://vercel.com/docs/rest-api
- **Deployments:** https://vercel.com/docs/rest-api/endpoints#deployments
- **Projects:** https://vercel.com/docs/rest-api/endpoints#projects

---

## 🆘 **Troubleshooting**

### Erro: "Invalid token"
```bash
# Verifique se token está correto
cat .vercel-credentials
# Se necessário, gere novo token no Vercel Dashboard
```

### Erro: "Project not found"
```bash
# Liste todos os projetos
source .vercel-credentials
curl -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v9/projects" | jq '.projects[].name'
```

### Deploy travado em "QUEUED"
```bash
# Verifique o status
curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v13/deployments/DEPLOY_ID" | \
  grep -E '"(readyState|status|error)"'
```

---

**Última atualização:** 2025-11-09  
**Autor:** GenSpark AI Assistant
