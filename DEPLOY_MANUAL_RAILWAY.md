# 🚀 DEPLOY MANUAL NO RAILWAY - FlipCars Backend

## ⚠️ PROBLEMA IDENTIFICADO

O Railway não está rodando a migration automaticamente. Os novos campos (`service_type`, `warranty_company`, `selected_services`, `symptoms_description`) não estão sendo salvos no banco.

**Sintomas:**
- Modal de appointment mostra "Service: N/A"
- Notas não aparecem
- selectedServices não aparecem

---

## ✅ SOLUÇÃO: EXECUTAR MIGRATION MANUALMENTE

### **OPÇÃO 1: Via Railway CLI (Recomendado)**

Se você tem acesso SSH ao Railway:

```bash
# 1. Conecte ao Railway
railway login

# 2. Entre no projeto
railway link

# 3. Execute a migration
railway run npm run migration:run
```

---

### **OPÇÃO 2: Via Supabase SQL (VOCÊ JÁ FEZ ISSO! ✅)**

Você já executou o SQL no Supabase, então as colunas existem!

**Problema atual:** O backend pode estar usando código antigo em cache.

---

## 🔧 FORÇAR REDEPLOY DO RAILWAY

### **Passo 1: Acesse o Railway Dashboard**
1. Vá em: https://railway.app/dashboard
2. Selecione projeto: **Flipcars Backend**
3. Clique no serviço: **backend**

### **Passo 2: Force Redeploy**
1. No canto superior direito, clique: **⋯ (três pontos)**
2. Clique: **"Restart"** ou **"Redeploy"**
3. Aguarde 2-3 minutos

### **Passo 3: Verifique os Logs**
1. No Railway, clique na aba: **"Deployments"**
2. Clique no deploy mais recente
3. Procure por estas mensagens:

```
[Migration] Adding service fields to leads table...
[Migration] ✅ Added service_type column
[Migration] ✅ Added warranty_company column
[Migration] ✅ Added selected_services column
[Migration] ✅ Added symptoms_description column
```

**OU** (se já existir):

```
[Migration] ⏭️  service_type column already exists, skipping
```

---

## 🧪 TESTE APÓS REDEPLOY

### **1. Crie um NOVO lead**
- Vá em: https://flipcars.us/estimate
- Selecione: Mechanic Service
- Selecione: Private (Self-Pay)
- Selecione: Oil Change + Engine
- Escreva notas: "teste deploy manual"
- Complete o formulário

### **2. Verifique no Admin**
1. Admin → Appointments
2. Clique em "View" no novo appointment
3. **Deve aparecer:**
   - Service: "Oil, Engine" (não "N/A")
   - Symptoms: "teste deploy manual"
   - Warranty: "Private (Self-Pay)"

---

## 🐛 SE AINDA NÃO FUNCIONAR

### **Verificar Variáveis de Ambiente**

No Railway, verifique se a `DATABASE_URL` está correta:

```
postgresql://postgres.xxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### **Verificar Commit Deployado**

No Railway, verifique qual commit está deployado:
- Deve ser: `1e67ca90` ou mais recente
- Se for commit antigo, force redeploy

---

## 📞 ALTERNATIVA: DEPLOY VIA GITHUB

Se o Railway não atualizar automaticamente:

1. No Railway Dashboard
2. Settings → GitHub
3. Clique: **"Disconnect"** e depois **"Reconnect"**
4. Ou force trigger: Vá no GitHub Actions e rode o workflow manualmente

---

## ✅ CHECKLIST DE DEPLOY

- [ ] Railway redeploy executado
- [ ] Logs mostram migration rodando
- [ ] Novo lead criado APÓS redeploy
- [ ] Modal mostra serviços corretamente
- [ ] Modal mostra notas/symptoms
- [ ] Calendário mostra appointments no dia correto

---

## 🆘 SUPORTE

Se precisar de ajuda:
1. Tire screenshot dos logs do Railway
2. Tire screenshot do modal do appointment
3. Me envie e eu ajudo a resolver!

**Última atualização:** 2024-11-30
**Commits relevantes:**
- `30cf9b59` - Fix appointment date format
- `9a7e4197` - Calendar fix + debug logs
- `141979a3` - Leads table colors
- `1e67ca90` - Hide warranty alert for Self-Pay
