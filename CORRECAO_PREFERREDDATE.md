# 🔧 Correção: Erro 400 - preferredDate

## 🎯 Problema Identificado

**Erro**: Backend retornava **400 Bad Request** ao submeter formulário.

**Causa Raiz**: 
```json
{
  "message": ["preferredDate must be a valid ISO 8601 date string"],
  "error": "Bad Request",
  "statusCode": 400
}
```

O campo `preferredDate` estava sendo enviado como **string vazia** (`""`), mas o backend espera:
- ✅ Formato ISO 8601 válido (ex: `"2025-11-09T14:30:00.000Z"`)
- ✅ OU campo não enviado (undefined)
- ❌ NÃO aceita string vazia

## 🛠️ Solução Implementada

**Arquivo modificado**: `frontend-public/src/lib/api/leads.service.ts`

**Antes** (linha 45):
```typescript
preferredDate: data.preferredDate,
```

**Depois** (linhas 45-47):
```typescript
// Only include preferredDate if it's not empty (backend expects ISO 8601 or null)
...(data.preferredDate && data.preferredDate.trim() !== '' ? { preferredDate: data.preferredDate } : {}),
```

**Lógica**:
- Se `preferredDate` existir E não for string vazia → incluir no payload
- Se `preferredDate` for vazio ou undefined → NÃO incluir no payload
- Usa spread operator (`...`) para condicionalmente incluir o campo

## ✅ Resultado Esperado

Após a correção, ao submeter o formulário:

1. ✅ Se usuário **selecionou data**: campo `preferredDate` é enviado com valor ISO 8601
2. ✅ Se usuário **pulou data**: campo `preferredDate` NÃO é enviado no payload
3. ✅ Backend aceita a requisição (201 Created)
4. ✅ Lead é criado no banco de dados
5. ✅ Reference number correto retornado: `FLIP-YYYYMMDD-XXXX`

## 📦 Deploy

**Commit**: `0f88a7d3`
```
fix: não enviar preferredDate vazio para evitar erro 400

- Backend rejeita preferredDate como string vazia
- Backend espera formato ISO 8601 válido ou campo não enviado
- Correção: só incluir preferredDate no payload se tiver valor
- Usa spread operator para condicionalmente incluir o campo
- Fix validation error: 'preferredDate must be a valid ISO 8601 date string'
```

**Status**: ✅ Push realizado - Vercel deploy em andamento

## 🧪 Como Testar Novamente

### Passo 1: Limpar Cache
1. Feche completamente o navegador
2. Reabra em modo incógnito
3. Ou faça hard refresh: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)

### Passo 2: Teste o Formulário
1. Acesse: https://www.flipcars.us/
2. Clique em "Free Estimate"
3. Preencha o formulário completamente
4. **IMPORTANTE**: Na etapa de agendamento, você pode:
   - **Opção A**: Selecionar uma data (vai enviar preferredDate)
   - **Opção B**: Pular/Skip a data (NÃO vai enviar preferredDate) ← Testar isso!
5. Complete e submeta

### Passo 3: Verificar Sucesso

**Console deve mostrar**:
```javascript
[EstimateForm] 🚀 Starting submission process
[EstimateForm] 📦 Loading API service...
[EstimateForm] 📡 Sending to backend API...
[ApiClient] 📤 Outgoing Request: {method: 'POST', ...}
[ApiClient] ✅ Response Received: {status: 201, ...}  ← 201 ao invés de 400!
[EstimateForm] ✅ Reference Number from backend: FLIP-20251109-XXXX
```

**Reference Number deve ser**:
- ✅ `FLIP-YYYYMMDD-XXXX` (formato correto do backend)
- ❌ NÃO `FL-YYYY-XXXX` (fallback - indica erro)

**Network tab deve mostrar**:
- ✅ Status: **201 Created** (ao invés de 400)
- ✅ Response contém `referenceNumber: "FLIP-..."`

### Passo 4: Verificar no Admin
1. Acesse: https://admin.flipcars.us
2. Lead deve aparecer com:
   - ✅ Reference: `FLIP-YYYYMMDD-XXXX`
   - ✅ Status: new
   - ✅ Todos os dados preenchidos

## 🔍 Debug (Se Ainda Houver Erro)

Se ainda aparecer erro 400:

1. **Verifique no Console** qual é a mensagem de erro agora
2. **Na Network tab** > Payload: verifique se `preferredDate` está presente ou ausente
3. **Na Network tab** > Response: veja a nova mensagem de erro do backend

## 📊 Payload Esperado

**Com data selecionada**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "preferredDate": "2025-11-15T14:30:00.000Z",  ← Presente com valor válido
  ...
}
```

**Sem data (skipado)**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  // preferredDate não aparece no payload  ← Ausente
  ...
}
```

## ✅ Commits Realizados Nesta Sessão

1. **a3798fbb** - Integração da API no EstimateFormModal
2. **6b567384** - Documentação de teste
3. **0f88a7d3** - Correção do preferredDate vazio ← ESTE

---

**Data**: 09/11/2025  
**Status**: ✅ Correção deployada  
**Próximo**: Teste end-to-end com cache limpo
