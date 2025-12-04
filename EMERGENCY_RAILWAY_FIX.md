# 🚨 EMERGÊNCIA: LEADS SUMIRAM - AÇÃO IMEDIATA

## ❌ PROBLEMA

**Todos os leads desapareceram** após habilitar o campo `contactPreferences`.

**Causa**: A coluna `contact_preferences` **NÃO EXISTE** no banco de dados do Railway.

---

## ✅ SOLUÇÃO IMEDIATA

### **PASSO 1: FORCE REDEPLOY DO RAILWAY** (AGORA!)

1. Acesse: https://railway.app/dashboard
2. Clique em **FlipCars** → **backend**
3. Vá em **Deployments**
4. Clique no último deploy
5. Clique nos **3 pontos (⋮)** → **"Redeploy"**
6. ⚠️ **DESMARQUE** "Use existing Build Cache"
7. Clique **"Redeploy"**
8. **Aguarde 3-5 minutos**

**Commit a ser deployado**: `f39b50aa` (HOTFIX - reverte contactPreferences)

### **PASSO 2: VERIFICAR SE LEADS VOLTARAM**

Após redeploy:
1. Acesse: https://admin.flipcars.us/dashboard/leads
2. Recarregue a página (Ctrl+R)
3. **Leads devem reaparecer**

Se ainda não aparecerem:
- Limpe cache do navegador (Ctrl+Shift+R)
- Aguarde mais 2-3 minutos
- Tente em janela anônima

---

## 🔍 POR QUE ISSO ACONTECEU?

1. **Migration existia** mas **nunca foi executada** no Railway
2. Backend tentou acessar coluna `contact_preferences`
3. **PostgreSQL retornou erro**: "column contact_preferences does not exist"
4. Query falhou → Nenhum lead foi retornado
5. Frontend mostrou lista vazia

**Erro esperado nos logs do Railway**:
```
QueryFailedError: column "contact_preferences" does not exist
```

---

## 🛠️ SOLUÇÃO PERMANENTE (DEPOIS DOS LEADS VOLTAREM)

Para habilitar `contactPreferences` corretamente:

### **Opção A: Executar Migration no Railway**

1. **Acesse Railway Dashboard**
2. FlipCars → backend → **Terminal** (ou Settings)
3. Execute:
   ```bash
   npm run typeorm:migration:run
   ```
4. Verifique se migration `AddContactPreferencesToLeads` foi executada
5. **DEPOIS** descomente o campo na entity
6. Commit + redeploy

### **Opção B: SQL Direto no Banco**

Se não conseguir rodar migrations:

1. Acesse Railway → FlipCars → **PostgreSQL** → **Connect**
2. Execute SQL:
   ```sql
   ALTER TABLE "leads" 
   ADD COLUMN IF NOT EXISTS "contact_preferences" jsonb NULL;
   ```
3. Verifique:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'leads' AND column_name = 'contact_preferences';
   ```
4. **DEPOIS** descomente o campo na entity
5. Commit + redeploy

---

## 📋 CHECKLIST DE RECUPERAÇÃO

- [ ] **Railway redeploy feito** (commit `f39b50aa`)
- [ ] **Aguardou 5 minutos**
- [ ] **Leads voltaram** na lista
- [ ] **Verificou que funciona** normalmente

---

## ⚠️ NÃO FAÇA ISSO NOVAMENTE

**NUNCA** habilite um campo na entity sem:
1. Verificar se a coluna existe no banco de produção
2. Executar a migration primeiro
3. Testar em staging/local antes

**Ordem correta**:
1. ✅ Criar migration
2. ✅ Executar migration no banco
3. ✅ Descomentar campo na entity
4. ✅ Deploy

**Ordem ERRADA** (o que fizemos):
1. ✅ Criar migration
2. ❌ Descomentar campo na entity **SEM executar migration**
3. ❌ Deploy → ERRO

---

## 🚨 SE LEADS AINDA NÃO VOLTAREM

1. **Verifique logs do Railway**:
   - Railway → backend → Deployments → [último deploy] → "View Logs"
   - Procure por erros relacionados a `contact_preferences`

2. **Force outro redeploy**:
   - Pode ser que o primeiro redeploy não pegou
   - Repita PASSO 1 acima

3. **Rollback para commit anterior**:
   - Se nada funcionar, podemos fazer rollback para `5a46bf14` (antes do problema)

4. **Me envie**:
   - Screenshot dos logs do Railway (últimas 50 linhas)
   - Screenshot da tela de Leads (mostrando vazio ou erro)
   - Console do navegador (F12) com possíveis erros

---

## 📞 AÇÃO IMEDIATA

**AGORA**: Force redeploy do Railway com commit `f39b50aa`

**DEPOIS**: Me avise quando os leads voltarem

**IMPORTANTE**: **NÃO** tente habilitar `contactPreferences` novamente até executarmos a migration no banco do Railway!

---

**Commit de correção**: `f39b50aa` (hotfix: revert contactPreferences)
**Status**: ⏳ Aguardando Railway redeploy
