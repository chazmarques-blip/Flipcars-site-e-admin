# 🔍 Investigação: Por que o lead não foi criado?

**Situação**: Apenas 6 leads no banco, nenhum é Juan Felipe (FL-2025-4645)

---

## ✅ Endpoint do Backend ESTÁ CORRETO

**Arquivo**: `backend/src/modules/leads/public-leads.controller.ts`

**Endpoint**: `POST /api/public/leads`

**Logs implementados**:
- ✅ Recebe submission
- ✅ Transforma dados
- ✅ Cria no banco
- ✅ Retorna referenceNumber

---

## 🔍 POSSÍVEIS CAUSAS

### 1. 🌐 Frontend público não está enviando para o backend correto

**Verificar**: `frontend-public/.env.production`

```bash
# Deve apontar para Railway
NEXT_PUBLIC_API_URL=https://upbeat-dedication-production.up.railway.app/api
```

### 2. ❌ Requisição está falhando silenciosamente

**Testar**: Abrir formulário e verificar console do navegador (F12)

### 3. 🚫 CORS bloqueando requisição

**Backend permite**: 
- http://localhost:3000
- https://admin.flipcars.us
- https://www.flipcars.us
- https://flipcars.us

**Verificar**: Se www.flipcars.us está deployado e acessível

### 4. 🔴 Backend Railway com erro

**Verificar**: Logs do Railway

### 5. 📝 Validação bloqueando

**DTO**: CreatePublicLeadDto pode estar rejeitando dados

---

## 🧪 TESTES PARA EXECUTAR

### Teste 1: Verificar URL do backend no frontend público

```bash
# Execute no terminal
cd /home/user/webapp/frontend-public
cat .env.production
```

### Teste 2: Testar endpoint diretamente (via curl)

```bash
curl -X POST https://upbeat-dedication-production.up.railway.app/api/public/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "serviceType": "bodyshop",
    "source": "manual_test"
  }'
```

**Esperado**: Retornar `{ "success": true, "data": { "referenceNumber": "FLIP-..." } }`

### Teste 3: Verificar console do navegador

```
1. Acessar: https://www.flipcars.us (ou https://flipcars.us)
2. Clicar em "Get FREE Estimate Now"
3. Preencher formulário
4. Abrir DevTools (F12) → Aba Console
5. Clicar em Submit
6. Ver erros no console
```

### Teste 4: Verificar Network tab

```
1. DevTools (F12) → Aba Network
2. Filtrar por "Fetch/XHR"
3. Submeter formulário
4. Procurar requisição para "/public/leads"
5. Ver Status Code (deve ser 201)
6. Ver Response (deve ter referenceNumber)
```

### Teste 5: Verificar Railway Logs

```
1. Acessar: https://railway.app
2. Ir para projeto backend
3. Clicar em "Logs" ou "Deployments"
4. Filtrar por "public lead" ou "POST /public/leads"
5. Ver se há erros
```

---

## 🎯 PRÓXIMOS PASSOS

### Imediato:
1. ✅ Verificar .env.production do frontend-public
2. ✅ Testar endpoint via curl (Teste 2)
3. ✅ Verificar logs do Railway

### Se endpoint funcionar:
- Problema é no frontend (não está chamando corretamente)
- Verificar EstimateFormModal.tsx

### Se endpoint não funcionar:
- Problema é no backend (validação ou erro de runtime)
- Verificar logs do Railway
- Verificar DTO CreatePublicLeadDto

---

## 📋 CHECKLIST DE DIAGNÓSTICO

- [ ] Frontend-public .env.production verificado
- [ ] Endpoint testado via curl
- [ ] Console do navegador verificado
- [ ] Network tab verificado
- [ ] Railway logs verificados
- [ ] EstimateFormModal verificado
- [ ] CreatePublicLeadDto verificado

---

## 🔧 SE O PROBLEMA FOR FRONTEND

**Arquivo**: `frontend-public/src/components/estimate/EstimateFormModal.tsx`

Verificar:
- URL da API está correta?
- Headers estão corretos?
- Payload está no formato esperado?
- Erros estão sendo logados?

---

## 🔧 SE O PROBLEMA FOR BACKEND

**Arquivo**: `backend/src/modules/leads/dto/create-public-lead.dto.ts`

Verificar:
- Validações não estão muito restritivas?
- Campos obrigatórios estão presentes?
- Tipos de dados estão corretos?

---

**Status**: Aguardando execução dos testes acima para identificar causa raiz.
