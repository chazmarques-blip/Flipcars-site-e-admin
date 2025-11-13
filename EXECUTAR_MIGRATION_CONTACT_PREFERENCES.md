# 🗄️ Executar Database Migration - Contact Preferences

## 📋 Situação Atual

Você está no **Admin Dashboard** e a tabela de leads está vazia. Para a coluna "Preferred Contact" funcionar, precisamos executar a **database migration** que adiciona a coluna `contact_preferences` na tabela `leads`.

---

## ⚠️ IMPORTANTE: Migration Necessária

A feature de Contact Preferences (PR #14) adicionou:
- ✅ Código no backend
- ✅ Código no frontend-admin
- ✅ Migration file criada
- ❌ **Migration NÃO executada no banco ainda**

**Arquivo da Migration**:
```
backend/src/database/migrations/1731538800000-AddContactPreferencesToLeads.ts
```

**O que ela faz**:
```sql
ALTER TABLE "leads" 
ADD COLUMN "contact_preferences" jsonb NULL;
```

---

## 🎯 Opções Para Executar a Migration

Você tem **3 opções** dependendo de onde seu banco de dados está hospedado.

---

## 📍 OPÇÃO 1: Banco no Supabase (Recomendado)

Se você usa **Supabase** como banco de dados:

### Via SQL Editor no Supabase Dashboard

1. **Acesse o Supabase Dashboard**
   - URL: https://app.supabase.com
   - Faça login

2. **Selecione seu projeto**
   - Procure pelo projeto do FlipCars

3. **Vá para SQL Editor**
   - Menu lateral → SQL Editor
   - Ou: https://app.supabase.com/project/[SEU-PROJECT-ID]/sql

4. **Execute o SQL**
   ```sql
   -- Verificar se a coluna já existe
   SELECT column_name 
   FROM information_schema.columns 
   WHERE table_name = 'leads' 
     AND column_name = 'contact_preferences';
   
   -- Se retornar vazio, executar:
   ALTER TABLE "leads" 
   ADD COLUMN "contact_preferences" jsonb NULL;
   
   -- Verificar novamente
   SELECT column_name 
   FROM information_schema.columns 
   WHERE table_name = 'leads' 
     AND column_name = 'contact_preferences';
   ```

5. **Clicar "Run"**

6. **Verificar sucesso**
   - Deve retornar: "Success. No rows returned"
   - Ou: "ALTER TABLE"

---

## 📍 OPÇÃO 2: Banco no Railway

Se você usa **Railway** como banco de dados:

### Via Railway Dashboard

1. **Acesse Railway Dashboard**
   - URL: https://railway.app
   - Faça login

2. **Selecione seu projeto**

3. **Abra o PostgreSQL service**

4. **Vá para "Data" tab**

5. **Clique em "Query"**

6. **Execute o SQL**
   ```sql
   ALTER TABLE "leads" 
   ADD COLUMN "contact_preferences" jsonb NULL;
   ```

### Via Railway CLI (Alternativa)

```bash
# 1. Instalar Railway CLI (se não tiver)
npm install -g @railway/cli

# 2. Login
railway login

# 3. Link ao projeto
railway link

# 4. Conectar ao banco
railway connect postgres

# 5. Executar SQL
ALTER TABLE "leads" ADD COLUMN "contact_preferences" jsonb NULL;

# 6. Sair
\q
```

---

## 📍 OPÇÃO 3: Banco Local ou Outro Provider

Se você tem acesso direto ao PostgreSQL:

### Via psql CLI

```bash
# Conectar ao banco
psql $DATABASE_URL

# Ou com credenciais explícitas
psql -h hostname -U username -d database_name

# Executar migration
ALTER TABLE "leads" 
ADD COLUMN "contact_preferences" jsonb NULL;

# Verificar
\d leads

# Sair
\q
```

### Via TypeORM Migration (Se você tem acesso ao servidor backend)

```bash
# No diretório do backend
cd backend

# Executar migrations pendentes
npm run migration:run

# Ou
npm run typeorm migration:run
```

---

## ✅ Como Verificar se Funcionou

### 1️⃣ Via SQL Query

Execute esta query no seu banco:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'leads' 
  AND column_name = 'contact_preferences';
```

**Resultado esperado**:
```
column_name           | data_type
----------------------|----------
contact_preferences   | jsonb
```

### 2️⃣ Via Admin Dashboard

1. **Refresh a página** do admin dashboard
2. **Vá para Leads** (já está lá)
3. **Procure a coluna "Preferred Contact"** nos headers da tabela
4. Deve aparecer entre "Contact" e "Vehicle"

### 3️⃣ Via Teste Real

1. **Vá para o site público**: https://www.flipcars.us
2. **Submeta um novo lead** (Free Estimate)
3. **No Step 4**, selecione algumas preferências de contato:
   - ☑ Phone Call
   - ☑ WhatsApp
   - ☐ Text Message
4. **Complete o formulário**
5. **Volte para o admin dashboard**
6. **Veja o lead** - deve mostrar os ícones na coluna "Preferred Contact"

---

## 🔍 Troubleshooting

### Erro: "column already exists"

Se você receber este erro:
```
ERROR: column "contact_preferences" of relation "leads" already exists
```

**Solução**: A coluna já foi adicionada! Apenas verifique se está funcionando no dashboard.

### Erro: "permission denied"

Se você receber:
```
ERROR: permission denied for table leads
```

**Solução**: Você precisa de permissões de admin. Use a conta de superusuário do banco.

### Erro: "relation 'leads' does not exist"

Se você receber:
```
ERROR: relation "leads" does not exist
```

**Problema**: A tabela `leads` não existe no banco.

**Solução**: Você precisa executar **TODAS as migrations** primeiro:
```bash
cd backend
npm run migration:run
```

---

## 📊 Status das Migrations

Para ver quais migrations já foram executadas:

```sql
SELECT * FROM migrations ORDER BY timestamp DESC;
```

**Esperado ver**:
```
timestamp          | name
-------------------|------------------------------------------
1731538800000      | AddContactPreferencesToLeads1731538800000
[outras...]        | [outras migrations...]
```

---

## 🎯 Próximos Passos Após Migration

### 1️⃣ Verificar Admin Dashboard
- [ ] Refresh página do admin
- [ ] Coluna "Preferred Contact" aparece?
- [ ] Headers da tabela estão corretos?

### 2️⃣ Testar com Lead Real
- [ ] Criar novo lead no site público
- [ ] Selecionar preferências de contato
- [ ] Ver ícones no admin dashboard

### 3️⃣ Verificar Ícones
- [ ] 🟡 Ícone dourado para Phone Call
- [ ] ⚫ Ícone cinza escuro para WhatsApp
- [ ] ⚪ Ícone cinza claro para Text Message

---

## 💡 Dica: Backup Antes de Migration

**Sempre faça backup antes de migrations em produção!**

### Supabase
```
Dashboard → Database → Backups → Create backup
```

### Railway
```
Dashboard → PostgreSQL → Backups → Create manual backup
```

### psql
```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

---

## 🆘 Precisa de Ajuda?

Se você não conseguir executar a migration, me avise qual opção você está usando:
- [ ] Supabase
- [ ] Railway
- [ ] Outro (qual?)

E me envie:
1. Screenshot do erro (se houver)
2. Qual opção você tentou
3. Qual mensagem de erro apareceu

---

## 📝 Comando SQL Completo (Copy-Paste Ready)

**Para executar diretamente no SQL Editor:**

```sql
-- 1. Verificar se coluna já existe
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'leads' 
  AND column_name = 'contact_preferences';

-- 2. Se não existir, criar
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'leads' 
          AND column_name = 'contact_preferences'
    ) THEN
        ALTER TABLE "leads" 
        ADD COLUMN "contact_preferences" jsonb NULL;
        
        RAISE NOTICE 'Column contact_preferences added successfully!';
    ELSE
        RAISE NOTICE 'Column contact_preferences already exists!';
    END IF;
END $$;

-- 3. Verificar resultado
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'leads' 
  AND column_name = 'contact_preferences';
```

Este script é **idempotente** (pode executar múltiplas vezes sem problema).

---

## ✅ Checklist Final

Após executar a migration:

- [ ] SQL executado sem erros
- [ ] Coluna `contact_preferences` existe na tabela `leads`
- [ ] Admin dashboard refreshed
- [ ] Coluna "Preferred Contact" aparece na tabela
- [ ] Teste com novo lead criado
- [ ] Ícones aparecem corretamente

---

**Data**: 2025-11-13  
**Migration File**: `1731538800000-AddContactPreferencesToLeads.ts`  
**SQL**: `ALTER TABLE "leads" ADD COLUMN "contact_preferences" jsonb NULL;`  
**Status**: ⏳ Aguardando execução
