# 🔧 SUPABASE: ADICIONAR COLUNA contact_preferences

## 🎯 OBJETIVO

Adicionar a coluna `contact_preferences` na tabela `leads` do Supabase para permitir:
- Salvar preferências de contato (Phone Call, WhatsApp, Text Message)
- Exibir ícones na coluna "PREFERRED CONTACT" no admin

---

## ✅ SOLUÇÃO SQL (EXECUTAR NO SUPABASE)

### **PASSO 1: Acessar Supabase SQL Editor**

1. Acesse: https://supabase.com/dashboard
2. Selecione o projeto **FlipCars**
3. No menu lateral, clique em **"SQL Editor"**
4. Clique em **"New Query"**

### **PASSO 2: Executar SQL**

Cole e execute este SQL:

```sql
-- Adicionar coluna contact_preferences (JSONB)
ALTER TABLE "leads" 
ADD COLUMN IF NOT EXISTS "contact_preferences" jsonb NULL;

-- Verificar se foi criada
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'leads' 
  AND column_name = 'contact_preferences';
```

**Resultado esperado**:
```
column_name          | data_type | is_nullable
---------------------|-----------|------------
contact_preferences  | jsonb     | YES
```

### **PASSO 3: (Opcional) Adicionar Índice para Performance**

Se quiser melhorar performance de queries que filtram por contactPreferences:

```sql
-- Criar índice GIN no campo JSONB
CREATE INDEX IF NOT EXISTS idx_leads_contact_preferences 
ON leads USING GIN (contact_preferences);
```

---

## 🔄 DEPOIS DO SQL

### **1. Habilitar o Campo na Entity**

Depois que a coluna existir no Supabase, descomente o campo:

```typescript
// backend/src/database/entities/lead.entity.ts

// ✅ Descomentar estas linhas:
@Column({ type: 'jsonb', nullable: true, name: 'contact_preferences' })
contactPreferences?: {
  phoneCall?: boolean;
  whatsapp?: boolean;
  textMessage?: boolean;
};
```

### **2. Commit e Deploy**

```bash
cd /home/user/webapp
git add backend/src/database/entities/lead.entity.ts
git commit -m "feat: enable contactPreferences after Supabase column creation"
git push origin main
```

### **3. Force Redeploy Railway Backend**

1. Railway Dashboard → FlipCars → backend
2. Deployments → Redeploy (sem cache)
3. Aguarde 3-5 minutos

### **4. Testar**

1. Acesse: https://admin.flipcars.us/dashboard/leads
2. Recarregue (Ctrl+R)
3. **Leads devem aparecer**
4. Crie um **NOVO** lead em https://flipcars.us
5. Selecione preferências de contato
6. Verifique se ícones aparecem no admin

---

## 📊 EXEMPLO DE DADOS

Depois que funcionar, o campo `contact_preferences` vai conter:

```json
{
  "phoneCall": true,
  "whatsapp": true,
  "textMessage": false
}
```

E no admin vai mostrar:
```
PREFERRED CONTACT
[📞] [💬]  ← Phone + WhatsApp selecionados
```

---

## 🔍 VERIFICAR SE COLUNA JÁ EXISTE (ANTES DE EXECUTAR SQL)

Execute primeiro este SQL para verificar:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'leads' 
  AND column_name = 'contact_preferences';
```

**Se retornar vazio** → Coluna NÃO existe → Execute o SQL de criação
**Se retornar 1 linha** → Coluna JÁ existe → Só habilitar na entity

---

## ⚠️ IMPORTANTE

- **NÃO** descomente o campo na entity **ANTES** de executar o SQL no Supabase
- **PRIMEIRO** crie a coluna no banco
- **DEPOIS** habilite na entity + deploy

Ordem correta:
1. ✅ SQL no Supabase (criar coluna)
2. ✅ Verificar que coluna existe
3. ✅ Descomentar campo na entity
4. ✅ Commit + Push
5. ✅ Railway redeploy

---

## 🚨 SE LEADS AINDA ESTIVEREM SUMIDOS

Se os leads não voltarem após o redeploy do commit `f39b50aa`:

1. **Verifique Railway Logs**:
   - Railway → backend → Deployments → View Logs
   - Procure erros relacionados a `contact_preferences`

2. **Aguarde 5 minutos completos**:
   - Railway pode demorar para propagar

3. **Limpe cache do navegador**:
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)
   - Ou abra janela anônima

4. **Force outro redeploy**:
   - Se necessário, force mais um redeploy

---

## 📞 AÇÃO IMEDIATA

**AGORA**:
1. ✅ Aguarde Railway fazer redeploy do commit `f39b50aa` (já está no GitHub)
2. ✅ Verifique se leads voltaram
3. ✅ **DEPOIS** que leads voltarem, execute o SQL no Supabase
4. ✅ Habilite o campo na entity
5. ✅ Commit + Redeploy

**NÃO** execute o SQL no Supabase **ANTES** dos leads voltarem!

---

**Status Atual**: ⏳ Aguardando Railway redeploy de `f39b50aa` para leads voltarem
**Próximo Passo**: Executar SQL no Supabase **APÓS** leads voltarem
