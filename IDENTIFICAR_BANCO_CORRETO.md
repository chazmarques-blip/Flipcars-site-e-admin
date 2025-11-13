# 🔍 IDENTIFICAR E CORRIGIR BANCO DE DADOS

## 🎯 BANCO CORRETO DO FLIPCARS

Baseado no `.env` do backend:

```
Host: aws-0-us-east-1.pooler.supabase.com
Database: postgres
Project ID: nsvzqehytuqwfaerzmau
```

---

## ✅ COMO VERIFICAR SE ESTÁ NO BANCO CORRETO

### No Supabase Dashboard:

**PASSO 1**: Acesse https://supabase.com/dashboard

**PASSO 2**: Veja a lista de projetos

**PASSO 3**: Identifique qual projeto tem o ID: **nsvzqehytuqwfaerzmau**

**PASSO 4**: O projeto correto deve ter nome relacionado a "FlipCars" ou "flipcars"

---

## 🔧 EXECUTAR SQL NO BANCO CORRETO

### PASSO 1: Selecionar Projeto Correto

1. Acesse Supabase
2. Clique no projeto com ID: **nsvzqehytuqwfaerzmau**
3. Ou procure pelo projeto chamado "FlipCars" ou similar

### PASSO 2: Abrir SQL Editor

1. No menu lateral, clique em **"SQL Editor"**
2. Clique em **"New Query"**

### PASSO 3: Executar SQL de Limpeza

```sql
-- VERIFICAR SE ESTAMOS NO BANCO CORRETO
-- Deve retornar tabelas: leads, users, roles, etc.
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Se aparecer as tabelas do FlipCars, está correto!
```

### PASSO 4: Remover Colunas Problemáticas

```sql
-- Remover colunas de calendário (SE existirem)
ALTER TABLE leads 
DROP COLUMN IF EXISTS preferred_time_slot CASCADE;

ALTER TABLE leads 
DROP COLUMN IF EXISTS preferred_date CASCADE;

-- Verificar remoção (deve retornar 0 linhas)
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'leads'
AND column_name IN ('preferred_date', 'preferred_time_slot');
```

---

## 🗑️ LIMPAR BANCO ERRADO (OUTRO PROJETO)

### PASSO 1: Identificar o Banco Errado

1. Volte para lista de projetos no Supabase
2. Identifique qual projeto você estava usando (o errado)
3. Será um projeto diferente de **nsvzqehytuqwfaerzmau**

### PASSO 2: Verificar o que Foi Criado

```sql
-- Listar tabelas criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Ver se tem colunas preferred_date/time_slot
SELECT 
    table_name,
    column_name
FROM information_schema.columns
WHERE column_name IN ('preferred_date', 'preferred_time_slot');
```

### PASSO 3: Opções de Limpeza

**Opção A - Reverter Apenas as Mudanças**:
```sql
-- Remover colunas criadas por engano
ALTER TABLE leads DROP COLUMN IF EXISTS preferred_time_slot CASCADE;
ALTER TABLE leads DROP COLUMN IF EXISTS preferred_date CASCADE;
```

**Opção B - Se Não Usar Esse Projeto**:
- Não precisa fazer nada
- Ou delete o projeto inteiro no Supabase Dashboard

**Opção C - Se Quebrou o Projeto Errado**:
```sql
-- Backup antes de qualquer mudança!
-- Depois execute os drops necessários
```

---

## ✅ CHECKLIST DE VERIFICAÇÃO

### No Banco CORRETO (FlipCars - nsvzqehytuqwfaerzmau):

```sql
-- 1. Verificar estrutura da tabela leads
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'leads'
ORDER BY ordinal_position;

-- 2. Contar leads
SELECT COUNT(*) as total FROM leads;

-- 3. Verificar usuários admin
SELECT name, email, status FROM "user" WHERE email = 'admin@flipcars.us';

-- 4. Verificar roles
SELECT name, description FROM roles;
```

**Resultados Esperados**:
- ✅ Tabela `leads` existe e tem ~27 colunas
- ✅ **NÃO** tem colunas `preferred_date` ou `preferred_time_slot`
- ✅ Tem usuário admin@flipcars.us
- ✅ Tem roles (admin, agent, customer, etc.)

---

## 🚨 SE PRECISAR RECRIAR TUDO

Se você bagunçou o banco correto, podemos:

1. Fazer backup dos leads existentes
2. Rodar migrations do zero
3. Recriar estrutura limpa

**MAS PRIMEIRO**: Verifique se realmente está no banco correto!

---

## 📞 PRÓXIMOS PASSOS

1. **Identifique** qual projeto Supabase é o correto (ID: nsvzqehytuqwfaerzmau)
2. **Execute** os SQLs no banco CORRETO
3. **Verifique** se backend continua funcionando
4. **Teste** admin dashboard

---

## 🎯 SQL RÁPIDO PARA EXECUTAR NO BANCO CORRETO

```sql
-- Execute TUDO de uma vez no banco CORRETO:

-- 1. Remover colunas problemáticas
ALTER TABLE leads DROP COLUMN IF EXISTS preferred_time_slot CASCADE;
ALTER TABLE leads DROP COLUMN IF EXISTS preferred_date CASCADE;

-- 2. Verificar (deve retornar 0)
SELECT COUNT(*) FROM information_schema.columns
WHERE table_name = 'leads'
AND column_name IN ('preferred_date', 'preferred_time_slot');

-- 3. Contar leads
SELECT COUNT(*) as total_leads FROM leads;
```

**Se retornar**:
- `COUNT = 0` (verificação) ✅
- `total_leads > 0` (tem leads) ✅

Então está tudo certo!

---

**IMPORTANTE**: Sempre verifique o nome/ID do projeto Supabase antes de executar SQL!
