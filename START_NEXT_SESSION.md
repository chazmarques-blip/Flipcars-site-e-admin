# 🚀 START NEXT SESSION - Quick Reference

## 📋 O QUE FAZER NO PRÓXIMO CHAT

### 1️⃣ PRIMEIRA COISA: Verificar Admin Dashboard
```
URL: https://admin.flipcars.us/dashboard/leads
Status: ⏳ Pendente verificação
Ação: Confirmar se leads aparecem sem erros
```

### 2️⃣ DEPOIS: Google Ads Keywords
```
Arquivo: GOOGLE_ADS_KEYWORDS_IMPORT.csv
Campanha: "Leads Body shop insuranse"
Ação: Importar CSV ou copiar/colar keywords
```

### 3️⃣ TESTAR: Conversão
```
URL: https://flipcars.us
Ação: Enviar lead teste e verificar no Google Ads
```

---

## 🔍 CONTEXTO RÁPIDO

**Problema Resolvido**: Admin dashboard não mostrava leads
**Solução**: Migration executada via Supabase SQL Editor
**Status Backend**: ✅ Online em Railway
**Status Frontend**: ✅ Online em Vercel

---

## 📁 ARQUIVOS IMPORTANTES

```
/home/user/webapp/
├── SESSION_SUMMARY_2025-11-13.md         ← Resumo completo desta sessão
├── ADMIN_DASHBOARD_FIX_DEPLOYMENT.md     ← Guia do problema resolvido
├── GOOGLE_ADS_KEYWORDS_IMPORT.csv        ← Keywords prontas (20 itens)
├── GOOGLE_ADS_KEYWORDS_MANUAL_PASTE.txt  ← Para copiar/colar
└── backend/src/database/migrations/
    └── 1763059418320-AddSchedulingFieldsToLeads.ts ← Migration criada
```

---

## 🎯 CHECKLIST RÁPIDO

- [x] Migration criada
- [x] Migration executada no banco
- [x] Backend redeployado
- [x] Google Ads conversion tracking configurado
- [x] Keywords research completo
- [ ] **Verificar admin dashboard** ← VOCÊ FAZ
- [ ] Importar keywords no Google Ads
- [ ] Testar conversão

---

## 🔗 LINKS ÚTEIS

- Admin: https://admin.flipcars.us/dashboard/leads
- Site: https://flipcars.us
- Backend Health: https://upbeat-dedication-production.up.railway.app/api/health
- Railway: https://railway.app/dashboard
- Google Ads: https://ads.google.com

---

## 💬 COMANDOS PARA O PRÓXIMO CHAT

### Se admin dashboard funcionar:
```
"Funcionou! Os leads aparecem! Vamos adicionar as keywords do Google Ads?"
```

### Se ainda tiver problema:
```
"Ainda tem erro [descrever erro]. Segue screenshot: [colar link]"
```

### Para continuar Google Ads:
```
"Quero importar as keywords agora"
```

---

**ÚLTIMA ATUALIZAÇÃO**: 2025-11-13  
**PRÓXIMA AÇÃO**: Verificar https://admin.flipcars.us/dashboard/leads
