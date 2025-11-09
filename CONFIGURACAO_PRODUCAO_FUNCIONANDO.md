# ✅ Configuração em Produção - FUNCIONANDO

**Data da Configuração:** 2025-11-09  
**Status:** ✅ TOTALMENTE FUNCIONAL

---

## 🎯 Arquitetura Atual

```
Frontend (Vercel)                    Backend (Railway)
├─ admin.flipcars.us        ──────►  upbeat-dedication-production.up.railway.app
│  └─ Next.js 14+                    └─ NestJS + PostgreSQL
│     └─ React Context Auth
│
└─ www.flipcars.us (público)
```

---

## 🔑 Configurações Críticas (NÃO ALTERAR!)

### 1. **Variáveis de Ambiente Vercel**

**IMPORTANTE:** Vercel **NÃO** usa arquivos `.env.production` do repositório!

**Configuração Manual Necessária:**

```bash
NEXT_PUBLIC_API_URL=https://upbeat-dedication-production.up.railway.app/api
```

**Como Configurar:**
```bash
# Via Vercel Dashboard:
# 1. Acesse: https://vercel.com/charles-marques-projects/frontend-admin/settings/environment-variables
# 2. Adicione: NEXT_PUBLIC_API_URL
# 3. Value: https://upbeat-dedication-production.up.railway.app/api
# 4. Targets: Production, Preview, Development

# Via API (recomendado):
source .vercel-credentials

# Deletar variável antiga (se existir)
ENV_ID=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v9/projects/prj_sayFhHQpCbU34G9z7coTfknHoJre/env" | \
  jq -r '.envs[] | select(.key == "NEXT_PUBLIC_API_URL") | .id')

curl -X DELETE "https://api.vercel.com/v9/projects/prj_sayFhHQpCbU34G9z7coTfknHoJre/env/$ENV_ID" \
  -H "Authorization: Bearer $VERCEL_TOKEN"

# Criar nova variável
curl -X POST "https://api.vercel.com/v10/projects/prj_sayFhHQpCbU34G9z7coTfknHoJre/env" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "NEXT_PUBLIC_API_URL",
    "value": "https://upbeat-dedication-production.up.railway.app/api",
    "type": "plain",
    "target": ["production", "preview", "development"]
  }'

# Após mudar env var, SEMPRE trigger novo deploy!
```

---

### 2. **Autenticação: React Context (NÃO Zustand!)**

**Arquivos Principais:**

```
src/contexts/AuthContext.tsx          ← Sistema de autenticação principal
src/components/auth/ProtectedRouteSimple.tsx
src/components/forms/LoginFormSimple.tsx
src/components/layouts/DashboardLayout.tsx
src/components/layouts/Header.tsx
src/components/layouts/Sidebar.tsx
```

**⚠️ CRÍTICO:** Todos os componentes de layout DEVEM usar `useAuth()` do Context, **NÃO** `useAuthStore()` do Zustand!

**Exemplo Correto:**
```typescript
import { useAuth } from '@/contexts/AuthContext';

export function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  // ...
}
```

**❌ NÃO USAR:**
```typescript
import { useAuthStore } from '@/stores/authStore'; // ← OBSOLETO!
```

---

### 3. **Estrutura do User (Backend vs Frontend)**

**Backend Railway retorna:**
```json
{
  "user": {
    "id": "00000000-0000-0000-0000-000000000001",
    "name": "Admin FlipCars",
    "email": "admin@flipcars.com",
    "roles": ["superadmin"],  ← Array!
    "language": "en"
  }
}
```

**Type Frontend (src/types/auth.ts):**
```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];  // ← Array, não singular!
  language?: string;
  status?: UserStatus;
  createdAt?: string;
  updatedAt?: string;
}
```

**⚠️ IMPORTANTE:** Sempre acessar role como `user.roles?.[0]` com optional chaining!

**Exemplo:**
```typescript
{user.roles?.[0]?.replace('_', ' ') || 'User'}
```

---

## 🔄 Sistema de Deploy

### Fluxo Automático (Recomendado)

```bash
# 1. Fazer alterações no código
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# 2. Vercel detecta push e faz deploy automático (2-3 minutos)
# 3. Aguardar deploy: https://vercel.com/charles-marques-projects/frontend-admin
```

### Deploy Manual Forçado (Se necessário)

```bash
source .vercel-credentials

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

---

## 🚨 Problemas Conhecidos e Soluções

### Problema 1: 403 Forbidden no login
**Causa:** Variável de ambiente `NEXT_PUBLIC_API_URL` não configurada no Vercel  
**Solução:** Seguir seção "Variáveis de Ambiente Vercel" acima

### Problema 2: "Cannot read properties of undefined (reading 'replace')"
**Causa:** Código tentando acessar `user.role` (singular) mas backend retorna `user.roles` (array)  
**Solução:** Usar `user.roles?.[0]` com optional chaining

### Problema 3: Deploy não atualiza
**Causa:** Cache agressivo do Vercel CDN  
**Solução:**
```bash
# 1. Limpar localStorage no navegador
localStorage.clear();
sessionStorage.clear();
location.reload();

# 2. Forçar novo deploy via API (ver seção acima)
# 3. Verificar novo bundle hash no source HTML
```

### Problema 4: Erro de hidratação (SSR)
**Causa:** Zustand persist middleware incompatível com Next.js 14+ Server Components  
**Solução:** Usar React Context puro (já implementado)

---

## 📦 Commits Importantes

**Histórico de Correções (Não Reverter!):**

| Commit | Descrição | Status |
|--------|-----------|--------|
| `8de6e703` | React Context authentication system | ✅ MANTER |
| `4f4cd9b9` | Replace Zustand in dashboard components | ✅ MANTER |
| `86aa343e` | Fix User type and role field references | ✅ MANTER |

---

## 🔐 Credenciais de Teste

**Admin:**
- Email: `admin@flipcars.com`
- Password: `Admin123!`
- Roles: `["superadmin"]`

**Backend API:**
- URL: https://upbeat-dedication-production.up.railway.app
- Health: https://upbeat-dedication-production.up.railway.app/health
- API Docs: https://upbeat-dedication-production.up.railway.app/api/docs

**Frontend:**
- Admin: https://admin.flipcars.us
- Public: https://www.flipcars.us

---

## 🛠️ Comandos Úteis

```bash
# Verificar último deploy
source .vercel-credentials
curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v6/deployments?projectId=prj_sayFhHQpCbU34G9z7coTfknHoJre&limit=1" | \
  jq -r '.deployments[0] | "State: \(.state)\nCommit: \(.meta.githubCommitSha[0:8])\nURL: https://\(.url)"'

# Testar backend diretamente
curl -X POST https://upbeat-dedication-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@flipcars.com","password":"Admin123!"}'

# Ver logs do backend (Railway)
# Acesse: https://railway.app/project/[PROJECT_ID]

# Limpar cache local
# No console do navegador (F12):
localStorage.clear(); sessionStorage.clear(); location.reload();
```

---

## ⚠️ CHECKLIST PRÉ-ALTERAÇÃO

Antes de fazer qualquer mudança significativa:

- [ ] Criar branch de desenvolvimento: `git checkout -b dev/minha-feature`
- [ ] Testar localmente primeiro: `npm run dev`
- [ ] Verificar tipos TypeScript: `npm run type-check`
- [ ] Commit com mensagem descritiva
- [ ] Push para branch de desenvolvimento primeiro
- [ ] Testar em preview deploy do Vercel
- [ ] Só então fazer merge para `main`

---

## 📞 Suporte

**Documentação Adicional:**
- [VERCEL_DEPLOY_GUIDE.md](./VERCEL_DEPLOY_GUIDE.md) - Guia de deploy via API
- [.vercel-credentials](./.vercel-credentials) - Token de acesso (gitignored)

**Links Importantes:**
- Vercel Dashboard: https://vercel.com/charles-marques-projects/frontend-admin
- Railway Dashboard: https://railway.app
- GitHub Repo: https://github.com/chazmarques-blip/Flipcars-site-e-admin

---

**✅ ESTA CONFIGURAÇÃO ESTÁ FUNCIONANDO PERFEITAMENTE!**  
**🚫 NÃO ALTERAR SEM NECESSIDADE!**
