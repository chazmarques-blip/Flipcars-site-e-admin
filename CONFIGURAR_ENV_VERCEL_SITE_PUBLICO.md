# 🔧 CONFIGURAR VARIÁVEIS DE AMBIENTE NO VERCEL - SITE PÚBLICO

**Data**: 2025-11-10  
**Projeto**: frontend-public (www.flipcars.us)

---

## 🎯 OBJETIVO

Adicionar `NEXT_PUBLIC_API_URL` no Vercel para que o site público se conecte ao backend.

---

## ✅ O QUE JÁ ESTÁ PRONTO

### Backend
- ✅ Endpoint público criado: `POST /api/public/leads`
- ✅ Rate limiting configurado
- ✅ Validação de dados completa
- ✅ CORS configurado para www.flipcars.us
- ✅ Testado com curl - funcionando 100%

### Frontend Código
- ✅ `leadsService.ts` usando endpoint correto
- ✅ `client.ts` configurado
- ✅ `.env.local` atualizado localmente
- ✅ Transformação de dados correta

---

## 🔴 O QUE FALTA

### Vercel Environment Variables

Adicionar no Vercel Dashboard:

```env
NEXT_PUBLIC_API_URL=https://upbeat-dedication-production.up.railway.app/api
```

---

## 📋 PASSO A PASSO

### OPÇÃO 1: Via Vercel Dashboard (Recomendado)

1. **Acessar Vercel**
   ```
   https://vercel.com/dashboard
   ```

2. **Selecionar Projeto**
   - Procure por: `frontend-public` ou `flipcars` (site público)
   - **NÃO confundir** com `frontend-admin`

3. **Ir em Settings**
   - Clique no projeto
   - Vá para **Settings** (tab superior)

4. **Environment Variables**
   - No menu lateral, clique em **Environment Variables**

5. **Adicionar Variável**
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://upbeat-dedication-production.up.railway.app/api`
   - **Environment**: Marcar **TODOS** (Production, Preview, Development)
   - Clicar em **Save**

6. **Redeploy**
   - Ir para **Deployments**
   - Encontrar último deployment
   - Clicar nos 3 pontinhos (...)
   - Clicar em **Redeploy**
   - Aguardar build completar (~2-3 min)

---

### OPÇÃO 2: Via Vercel CLI

```bash
# 1. Instalar Vercel CLI (se não tiver)
npm install -g vercel

# 2. Login
vercel login

# 3. Link ao projeto (se necessário)
cd /home/user/webapp/frontend-public
vercel link

# 4. Adicionar variável
vercel env add NEXT_PUBLIC_API_URL

# Quando perguntar o valor, cole:
https://upbeat-dedication-production.up.railway.app/api

# Quando perguntar os environments, selecione TODOS:
# - Production
# - Preview  
# - Development

# 5. Redeploy
vercel --prod
```

---

## 🧪 TESTE APÓS CONFIGURAR

### 1. Aguardar Deploy Completar

Verifique em: https://vercel.com/dashboard → Deployments

Status deve ficar: ✅ **Ready**

### 2. Abrir Site

```
https://www.flipcars.us
ou
https://flipcars.us
```

### 3. Testar Formulário

1. Clique em **"Get Free Estimate"**
2. Preencha o formulário:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Phone: +1321960866 1
   - Service Type: Body Shop ou Mechanic
3. Complete todas as etapas
4. Submeter

### 4. Verificar Console

Pressione `F12` e vá em **Console**:

**Antes (sem API_URL)**:
```
❌ Network Error
❌ CORS Error
```

**Depois (com API_URL)**:
```
✅ [ApiClient] 📤 Outgoing Request: POST /public/leads
✅ [ApiClient] ✅ Response Received: 201
✅ [LeadsService] ✅ Lead created successfully
```

### 5. Verificar Reference Number

Após submeter, deve aparecer:
```
✅ Request submitted successfully!
📋 Reference Number: FLIP-20251110-XXXX
```

### 6. Verificar no Admin

1. Login no admin: https://admin.flipcars.us
2. Credenciais: `admin@flipcars.com` / `Admin123!`
3. Ir em **Leads**
4. ✅ **Deve aparecer o novo lead IMEDIATAMENTE**

---

## 🔍 TROUBLESHOOTING

### Problema: Still using localhost

**Sintoma**: Console mostra `localhost:3001/api/public/leads`

**Solução**:
1. Limpar build cache do Vercel
2. Redeploy com cache clear: **Settings → Redeploy → Clear Cache**

---

### Problema: CORS Error

**Sintoma**: `Access to fetch at 'https://...' has been blocked by CORS`

**Solução**:
Backend já tem CORS configurado. Se der erro:
1. Verificar se URL está correta (com `/api`)
2. Verificar se backend está online
3. Checar logs no Railway

---

### Problema: 404 Not Found

**Sintoma**: `POST /public/leads` retorna 404

**Possíveis causas**:
1. ❌ URL sem `/api`: `https://.../public/leads`
   - ✅ Correta: `https://.../api/public/leads`
2. ❌ Backend offline
3. ❌ Endpoint não deployado

**Solução**:
```bash
# Testar endpoint diretamente
curl -X POST https://upbeat-dedication-production.up.railway.app/api/public/leads \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@test.com","phone":"+1321","serviceType":"bodyshop","contactPreferences":{"phoneCall":true}}'
```

Deve retornar 201 com reference number.

---

### Problema: Validation Error

**Sintoma**: `400 Bad Request - Validation failed`

**Causa**: Dados faltando ou formato incorreto

**Campos obrigatórios**:
- `firstName` (string, min 2 chars)
- `lastName` (string, min 2 chars)
- `email` (email válido)
- `phone` (string, min 10 chars)
- `serviceType` ('bodyshop' ou 'mechanic')
- `contactPreferences` (objeto com phoneCall/whatsapp/textMessage)

---

## 📊 VERIFICAÇÃO COMPLETA

Checklist antes de considerar concluído:

- [ ] Variável `NEXT_PUBLIC_API_URL` adicionada no Vercel
- [ ] Redeploy completado com sucesso
- [ ] Site abre sem erros
- [ ] Formulário carrega normalmente
- [ ] Console não mostra erros de CORS
- [ ] Teste de submissão bem-sucedido
- [ ] Reference number gerado
- [ ] Lead aparece no admin dashboard
- [ ] Email de confirmação enviado (se configurado)

---

## 🎉 RESULTADO ESPERADO

### Frontend (Site Público)
```
✅ Formulário funciona
✅ Dados enviados para backend
✅ Reference number retornado
✅ Confirmação exibida ao usuário
```

### Backend
```
✅ Lead salvo no PostgreSQL
✅ Status: 'new'
✅ Reference number: FLIP-YYYYMMDD-XXXX
```

### Admin Dashboard
```
✅ Lead aparece na lista
✅ Todos os dados visíveis
✅ Fotos (se enviadas) acessíveis
✅ Status correto
```

---

## 📝 VARIÁVEIS DE AMBIENTE - RESUMO

### Frontend Público (Vercel)
```env
# Backend
NEXT_PUBLIC_API_URL=https://upbeat-dedication-production.up.railway.app/api

# Google Maps
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=AIzaSyAkylKLMRvz9DoH3zlomxFyGdGM9YUlvJQ
NEXT_PUBLIC_GOOGLE_PLACE_ID=ChIJj6UdeKN554gRrEhFVdR2F2o

# Business Info
NEXT_PUBLIC_BUSINESS_NAME=FlipCars Auto Body Shop
NEXT_PUBLIC_BUSINESS_ADDRESS=5200 Old Winter Garden Rd Suite 110A, Orlando, FL 32811
```

### Frontend Admin (Vercel)
```env
# Backend
NEXT_PUBLIC_API_URL=https://upbeat-dedication-production.up.railway.app/api
```

### Backend (Railway)
```env
# Configuradas automaticamente pelo Railway:
DATABASE_URL=postgresql://...
PORT=3000
```

---

**Status Atual**: ⏳ Aguardando configuração no Vercel  
**Próximo Passo**: Adicionar `NEXT_PUBLIC_API_URL` no Vercel Dashboard  
**ETA**: 5 minutos após configurar  

---

**Working Directory**: `/home/user/webapp`
