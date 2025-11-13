# 🚀 RAILWAY - EXECUTAR MIGRATION AGORA

## ⚡ MÉTODO RÁPIDO - Railway Dashboard Console

### Passo 1: Acesse o Railway Dashboard
1. Vá para: https://railway.app/dashboard
2. Encontre o projeto: **FlipCars Backend** (ou similar)
3. Clique no serviço do **backend**

### Passo 2: Abra o Console
1. No menu lateral, clique em **"Console"** ou **"Terminal"**
2. Aguarde o terminal carregar

### Passo 3: Execute a Migration
Cole este comando e pressione Enter:

```bash
npm run migration:run:prod
```

### Passo 4: Verifique o Resultado
Você deve ver algo como:

```
✅ Successfully ran 1 migration(s):
   - AddSchedulingFieldsToLeads1763059418320
```

### Passo 5: Reinicie o Backend
1. Volte para a página principal do serviço
2. Clique no menu **"⋯"** (três pontos)
3. Clique em **"Restart"**
4. Aguarde ~30 segundos

---

## 🎯 ALTERNATIVA - Se o Console não estiver disponível

### Opção A: Adicionar ao Start Command (Temporário)

1. No Railway Dashboard, vá em **Settings**
2. Encontre **"Custom Start Command"**
3. Altere de:
   ```
   cd backend && npm run start:prod
   ```
   Para:
   ```
   cd backend && npm run migration:run:prod && npm run start:prod
   ```
4. Clique em **"Save"** e aguarde redeploy
5. **DEPOIS** que rodar, volte e remova `npm run migration:run:prod &&` do comando

### Opção B: Railway CLI no seu computador local

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Linkar ao projeto
railway link

# Rodar migration
railway run npm run migration:run:prod
```

---

## ✅ VERIFICAÇÃO FINAL

Após executar a migration:

1. **Teste o Admin Dashboard**
   - URL: https://admin.flipcars.us/dashboard/leads
   - Verifique se os leads aparecem
   - Abra o console do navegador (F12)
   - Deve estar limpo, sem erros 401/500

2. **Verifique no Railway Logs**
   - Vá em **"Logs"** no Railway Dashboard
   - Procure por: `"Successfully ran 1 migration"`
   - Não deve ter mais erros de "column does not exist"

---

## 🆘 PROBLEMAS?

### Erro: "Migration already ran"
✅ **Tudo bem!** Significa que a migration já foi executada. Só reinicie o backend.

### Erro: "Database connection failed"
❌ Verifique a variável `DATABASE_URL` no Railway Settings

### Erro: "Cannot find module"
❌ Faça rebuild: No Railway, force um novo deploy (Settings → Redeploy)

---

## 📝 DEPOIS DA MIGRATION

Quando os leads aparecerem no admin dashboard:

1. ✅ Migration concluída
2. ✅ Backend funcionando
3. 🎯 **Próximo**: Adicionar keywords no Google Ads (CSV pronto!)

---

**Dúvidas?** Me avisa qual erro apareceu! 🚀
