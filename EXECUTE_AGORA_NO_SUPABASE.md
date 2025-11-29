# 🚨 EXECUTE ISTO AGORA NO SUPABASE

## ⚡ Problema Identificado

A migration do Railway ainda não rodou. Precisamos adicionar as colunas manualmente no Supabase.

---

## 📋 PASSO A PASSO (2 minutos)

### **1. Acesse o Supabase**
- URL: https://supabase.com/dashboard
- Login com sua conta
- Selecione o projeto: **Flipcars**

### **2. Abra o SQL Editor**
- No menu lateral esquerdo, clique em **"SQL Editor"**
- Clique em **"+ New query"**

### **3. Cole o SQL abaixo**

```sql
-- Add service fields to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS service_type VARCHAR(20) NULL;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS warranty_company VARCHAR(100) NULL;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS selected_services JSONB NULL;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS symptoms_description TEXT NULL;

-- Verify
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'leads'
    AND column_name IN ('service_type', 'warranty_company', 'selected_services', 'symptoms_description')
ORDER BY column_name;
```

### **4. Execute o SQL**
- Clique no botão **"RUN"** (ou pressione Ctrl+Enter)
- Aguarde 2 segundos
- Você verá uma tabela mostrando as 4 colunas criadas

### **5. Resultado Esperado**

Você deve ver isto:

```
column_name          | data_type              | is_nullable
---------------------|------------------------|-------------
selected_services    | jsonb                  | YES
service_type         | character varying      | YES
symptoms_description | text                   | YES
warranty_company     | character varying      | YES
```

---

## ✅ Pronto!

Depois de executar o SQL:

1. **Crie um NOVO lead** no formulário público (https://flipcars.us/estimate)
2. Selecione "Oil Change" ou outro serviço
3. Vá ao admin dashboard (https://admin.flipcars.us/dashboard/appointments)
4. O serviço deve aparecer: **"2021 CHEVROLET Silverado • Oil"**

---

## ⚠️ IMPORTANTE

- **Leads antigos**: Não terão os serviços (campos vazios)
- **Leads novos**: Terão os serviços salvos corretamente
- **Seguro**: Este SQL não apaga nada, só adiciona colunas opcionais

---

## 🆘 Se der erro

Me avise e eu ajudo a corrigir!
