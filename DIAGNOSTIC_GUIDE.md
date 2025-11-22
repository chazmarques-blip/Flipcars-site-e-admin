# 🔍 GUIA DE DIAGNÓSTICO - FlipCars Leads 500 Error

## 🎯 OBJETIVO
Identificar e corrigir a coluna que está causando erro 500 no endpoint `/api/leads`

---

## 📋 PASSO 1: Obter Lista de Colunas do Banco

### 1.1. Acessar Supabase
1. Abra: https://supabase.com/dashboard/project/nsvzqehytuqwfaerzmau
2. Faça login (se necessário)
3. No menu lateral, clique em **"SQL Editor"**

### 1.2. Executar Query de Diagnóstico
Cole e execute esta query:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'leads' 
ORDER BY ordinal_position;
```

### 1.3. Copiar TODOS os Resultados
- ⚠️ **IMPORTANTE**: Copie TODAS as linhas, não apenas as 10 primeiras
- Exemplo do formato esperado:
```
column_name              | data_type                   | is_nullable | column_default
-------------------------|-----------------------------|--------------|-----------------
id                       | uuid                        | NO           | gen_random_uuid()
reference_number         | character varying           | NO           | 
name                     | character varying           | NO           | 
...
```

---

## 🔧 PASSO 2: Usar Ferramenta de Comparação

### Opção A: Script Automático (RECOMENDADO)

Execute no terminal:
```bash
cd /home/user/webapp
python3 compare_schema.py
```

Quando solicitado, cole os resultados do Supabase e pressione ENTER duas vezes.

O script irá:
- ✅ Identificar colunas extras no banco
- ✅ Identificar colunas faltando no banco
- ✅ Gerar comandos SQL para corrigir
- ✅ Mostrar próximos passos

### Opção B: Comparação Manual

Abra os arquivos:
1. `SCHEMA_COMPARISON.md` - Lista de colunas esperadas
2. Resultados do Supabase (que você copiou)

Compare e identifique:
- Colunas que existem no **BANCO** mas NÃO na **ENTIDADE**
- Colunas que existem na **ENTIDADE** mas NÃO no **BANCO**

---

## 🩹 PASSO 3: Aplicar Correção

### 3.1. Identificar Colunas Problemáticas

Baseado no histórico, as **candidatas mais prováveis** são:

#### 🔴 ALTA PROBABILIDADE:
- `customer_id` (comentada na entidade, pode existir no banco)
- `contact_preferences` (comentada na entidade, pode existir no banco)
- `vehicle_id` (comentada na entidade, pode existir no banco)
- `assigned_human_agent_id` (comentada na entidade, pode existir no banco)

#### 🟡 MÉDIA PROBABILIDADE:
- Qualquer coluna relacionada a relacionamentos (foreign keys)
- Colunas com prefixo `ai_*` que não estejam na entidade

#### 🟢 BAIXA PROBABILIDADE:
- `service_type` (já confirmada que NÃO existe)

### 3.2. Aplicar Fix no Supabase

Volte para o **SQL Editor do Supabase** e execute:

#### Se encontrou coluna EXTRA no banco:
```sql
-- Exemplo: se customer_id existe no banco mas não na entidade
ALTER TABLE leads DROP COLUMN IF EXISTS customer_id;

-- Repita para cada coluna extra encontrada
-- ALTER TABLE leads DROP COLUMN IF EXISTS nome_coluna;
```

#### Se encontrou coluna FALTANDO no banco:
```sql
-- Exemplo: se preferred_language está na entidade mas não no banco
ALTER TABLE leads ADD COLUMN IF NOT EXISTS preferred_language varchar(10) DEFAULT 'en';

-- Repita para cada coluna faltando
```

### 3.3. Verificar Correção

Execute esta query para testar se o SELECT completo funciona:

```sql
SELECT 
    id,
    reference_number,
    name,
    phone,
    email,
    preferred_language,
    vehicle_year,
    vehicle_make,
    vehicle_model,
    vehicle_color,
    has_insurance,
    insurance_provider,
    claim_number,
    accident_description,
    accident_date,
    is_drivable,
    needs_tow,
    needs_rental,
    damage_photos,
    ai_qualification_score,
    ai_conversation_history,
    last_ai_interaction,
    assigned_ai_agent,
    last_human_interaction,
    status,
    priority,
    notes,
    estimated_value,
    source,
    preferred_date,
    preferred_time_slot,
    created_at,
    updated_at
FROM leads
LIMIT 5;
```

**✅ SUCESSO**: Query retorna resultados sem erro
**❌ ERRO**: Se aparecer "column does not exist", essa é a coluna problemática

---

## 🚀 PASSO 4: Reiniciar Backend

### 4.1. Acessar Railway
1. Abra: https://railway.app
2. Faça login
3. Encontre o projeto FlipCars
4. Clique no serviço **backend**

### 4.2. Restart Manual
1. Clique em **"⋯"** (três pontos)
2. Selecione **"Restart"**
3. Aguarde ~30 segundos para reiniciar

### 4.3. Verificar Logs
1. Na aba **"Logs"**, procure por:
   - ✅ `"Database connection established"`
   - ✅ `"Application is running on port 3000"`
   - ❌ Qualquer erro de TypeORM ou SQL

---

## 🧪 PASSO 5: Testar API

### 5.1. Teste Direto da API

Abra no navegador ou Postman:
```
GET https://upbeat-dedication-production.up.railway.app/api/leads
```

**Resultados Esperados:**

✅ **SUCESSO (200 OK)**:
```json
[
  {
    "id": "uuid-aqui",
    "referenceNumber": "FLIP-20251121-0013",
    "name": "Charles Marques",
    "email": "chaz.marques@gmail.com",
    "phone": "(727) 459-2135",
    "status": "new",
    ...
  },
  ...
]
```

❌ **ERRO (500)**:
```json
{
  "statusCode": 500,
  "message": "Internal Server Error"
}
```

### 5.2. Teste no Admin Dashboard

1. Abra: https://admin.flipcars.us
2. Login: `admin@flipcars.us` / `Admin123!`
3. Navegue para a página de **Leads**

**Resultados Esperados:**

✅ **SUCESSO**: Tabela mostra 33 leads com dados completos
❌ **ERRO**: Mensagem "No leads found" ou erro 500

---

## 📊 PASSO 6: Confirmar Resolução

### 6.1. Checklist Final

Marque cada item conforme completa:

- [ ] Query do Supabase executada com sucesso
- [ ] Colunas extras identificadas e removidas
- [ ] Colunas faltando identificadas e adicionadas
- [ ] SELECT completo funciona sem erros no Supabase
- [ ] Backend reiniciado no Railway
- [ ] GET /api/leads retorna 200 OK
- [ ] Admin dashboard mostra tabela de leads
- [ ] Consegue ver todos os 33 leads
- [ ] Consegue clicar e ver detalhes de um lead
- [ ] Não há erros no console do navegador

### 6.2. Atualizar Documentação

Quando tudo estiver funcionando, atualize o status:

```bash
# No arquivo HANDOFF_DOCUMENT.md, mude:
**Status**: 🟡 IN PROGRESS

# Para:
**Status**: ✅ RESOLVED
```

---

## 🆘 TROUBLESHOOTING

### Problema: Query do Supabase retorna 0 linhas
**Causa**: Tabela `leads` não existe ou está vazia
**Solução**: Verificar se está no database correto

### Problema: Não consigo acessar Supabase
**Causa**: Credenciais inválidas ou sessão expirada
**Solução**: Pedir ao dono do projeto para compartilhar acesso

### Problema: ALTER TABLE dá erro "permission denied"
**Causa**: Usuário sem permissões de ALTER
**Solução**: Usar conta com role de admin/owner

### Problema: Backend não reinicia no Railway
**Causa**: Erro de build ou deploy
**Solução**: Verificar logs de build no Railway

### Problema: /api/leads ainda retorna 500 após fix
**Causa**: Pode haver outro erro não relacionado ao schema
**Solução**: Verificar logs do backend no Railway
```bash
# Procure por:
# - Erros de TypeORM
# - Erros de SQL
# - Stack traces com "leads.service.ts"
```

### Problema: Admin dashboard não carrega
**Causa**: Frontend cache ou erro de build
**Solução**: 
1. Limpar cache do navegador (Ctrl+Shift+R)
2. Tentar em aba anônima
3. Verificar console do navegador (F12)

---

## 📞 PRÓXIMOS PASSOS SE TUDO FALHAR

Se após seguir todos os passos o problema persistir:

1. **Backup dos Dados**:
   ```sql
   -- No Supabase, exportar leads para JSON
   SELECT json_agg(t) FROM leads t;
   ```

2. **Recriar Tabela** (ÚLTIMA OPÇÃO):
   ```sql
   -- ⚠️  CUIDADO: Isso vai deletar a tabela!
   DROP TABLE IF EXISTS leads CASCADE;
   ```

3. **Rodar Migrations do Zero**:
   ```bash
   cd /home/user/webapp/backend
   npm run typeorm migration:run
   ```

4. **Restaurar Dados**:
   - Importar o JSON exportado no passo 1

---

## 📝 REGISTRO DE PROGRESSO

Use esta seção para anotar suas descobertas:

### Colunas Encontradas no Banco:
```
[Cole aqui a lista completa quando executar a query]
```

### Colunas Extras Identificadas:
```
[Liste aqui as colunas que existem no banco mas não na entidade]
```

### Comandos SQL Executados:
```sql
-- Cole aqui os comandos ALTER TABLE que você executou
```

### Resultado dos Testes:
```
GET /api/leads: [200 OK / 500 ERROR]
Admin Dashboard: [FUNCIONANDO / COM ERRO]
Total de Leads Exibidos: [número]
```

---

**Última atualização**: 2025-11-22
**Estimativa de tempo**: 15-20 minutos
**Nível de dificuldade**: ⭐⭐⭐ (Médio)

---

## 🎓 O QUE APRENDEMOS

1. ✅ TypeORM precisa de schema 100% sincronizado com o banco
2. ✅ Colunas extras no banco causam erro 500 em queries SELECT *
3. ✅ Sempre comentar colunas na entidade E remover do banco
4. ✅ Usar migrations para mudanças de schema
5. ✅ Testar queries diretamente no banco antes de implantar

---

END OF DIAGNOSTIC GUIDE
