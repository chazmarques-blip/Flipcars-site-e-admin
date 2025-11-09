# Verificação de Lead no Banco de Dados

## Lead Criado via Formulário

**Informações do Lead:**
- Reference Number (Frontend): FL-2025-1175
- Nome: Carlos TesteReal / Carlos
- Email: testoreall@flipcars.com
- Data: 2025-11-09
- Horário: ~14:30 UTC

## Status Atual

✅ **Formulário Submetido**: Confirmação exibida com FL-2025-1175
❌ **Admin Dashboard**: Lead NÃO aparece na busca

## Possíveis Causas

### 1. Número de Referência Diferente
O frontend gera: `FL-2025-XXXX`
O backend gera: `FLIP-YYYYMMDD-XXXX`

Quando testei via cURL, o backend gerou: `FLIP-20251109-0016`

**Hipótese**: O lead foi salvo com referência `FLIP-20251109-XXXX` mas o frontend mostrou `FL-2025-1175`

### 2. Admin Dashboard Não Atualizado
O admin pode estar:
- Cacheando resultados
- Usando índice desatualizado
- Não conectado ao mesmo banco de dados

### 3. Lead Salvo em Tabela Diferente
O endpoint público pode estar salvando em:
- Tabela temporária
- Tabela de staging
- Banco de dados diferente

## Verificações Necessárias

### A. Verificar Logs do Railway
```
1. Acessar Railway deployment logs
2. Filtrar por timestamp: ~14:30 UTC (Nov 9, 2025)
3. Procurar por:
   - POST /api/public/leads
   - Lead created successfully
   - Reference number gerado
```

### B. Verificar Código do Frontend
```typescript
// frontend-public/src/components/estimate/EstimateForm.tsx
// Verificar qual número de referência está sendo usado
```

### C. Verificar Resposta da API
Abrir DevTools do navegador:
1. Aba Network
2. Procurar request para /api/public/leads
3. Ver response body com referenceNumber real

### D. Verificar Conexão do Admin com Backend
```
Admin Dashboard → Settings
Verificar qual API_URL está configurada
Deve ser: https://upbeat-dedication-production.up.railway.app/api
```

## Próximos Passos

1. **Verificar Logs do Railway** - Ver se POST /api/public/leads foi recebido
2. **Verificar Network Tab** - Ver response da API
3. **Buscar por "Carlos"** - Pode estar com referência diferente
4. **Verificar Database** - Consulta SQL direta (se possível)

## SQL Query para Verificar

```sql
SELECT 
  id,
  reference_number,
  name,
  email,
  phone,
  service_type,
  source,
  status,
  created_at
FROM leads
WHERE 
  created_at >= '2025-11-09 14:00:00'
  AND (
    email = 'testoreall@flipcars.com'
    OR name LIKE '%Carlos%'
    OR reference_number LIKE '%2025-1175%'
    OR reference_number LIKE '%20251109%'
  )
ORDER BY created_at DESC
LIMIT 10;
```

## Solução Temporária

Se o lead não aparecer:
1. Verificar localStorage do navegador (pode ter backup)
2. Reenviar dados via cURL para garantir que chega ao banco
3. Verificar se admin precisa de refresh ou logout/login

