# 🚀 Início Rápido - Sistema de Appointments

## ⚡ 3 Comandos para Testar Tudo

### 1️⃣ Obter Token JWT
```bash
# Substitua email e senha pelos seus
curl -s -X POST https://upbeat-dedication-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"SEU_EMAIL","password":"SUA_SENHA"}' \
  | jq -r '.access_token'
```

### 2️⃣ Criar 5 Appointments de Teste
```bash
# Cole o token obtido acima
./create-test-appointments.sh "SEU_TOKEN_AQUI"
```

### 3️⃣ Ver no Calendário
```
Abra: https://seu-frontend.vercel.app/dashboard/appointments-v2
```

---

## 📚 Documentação Completa

| Arquivo | Descrição |
|---------|-----------|
| **RESUMO_FINAL_TESTE.md** | 📖 Guia completo e detalhado |
| **TESTE_APPOINTMENTS.md** | 🧪 Instruções passo a passo |
| **API_EXAMPLES.md** | 💻 Exemplos de cURL e API |
| **INICIO_RAPIDO.md** | ⚡ Este arquivo (início rápido) |

---

## 🔧 Scripts Disponíveis

| Script | Função |
|--------|--------|
| `./test-appointments.sh TOKEN` | Verifica appointments existentes |
| `./create-test-appointments.sh TOKEN` | Cria 5 Leads + Appointments |

---

## ✅ Sistema 100% Pronto

### Backend (Railway)
- ✅ Online e respondendo
- ✅ API de appointments funcionando
- ✅ Auto-criação implementada
- ✅ Logs funcionais

### Frontend (Vercel)
- ✅ Deployado
- ✅ Calendário FullCalendar integrado
- ✅ Carrega appointments via API
- ✅ UI responsiva

### Funcionalidades
- ✅ Login e autenticação JWT
- ✅ CRUD completo de appointments
- ✅ Criação automática via Leads
- ✅ Visualização em calendário
- ✅ Filtros por mês/status
- ✅ Estatísticas e dashboard

---

## 🎯 Próximo Passo

**Escolha um:**

### A) Testar via Interface Web
1. Acesse: `https://seu-frontend.vercel.app/auth/login`
2. Faça login
3. Vá para: `/dashboard/appointments-v2`
4. Visualize o calendário

### B) Testar via Scripts
1. Execute: `./create-test-appointments.sh SEU_TOKEN`
2. Acesse o calendário
3. Veja os 5 appointments criados

### C) Testar via API (manual)
1. Veja exemplos em: `API_EXAMPLES.md`
2. Use cURL ou Postman
3. Teste endpoints individualmente

---

## 💡 Lembre-se

- 🔑 **Token expira:** Faça login periodicamente
- 🔄 **Auto-criação:** Leads com `preferredDate` geram appointments
- 🎨 **Cores:** Cada status tem uma cor no calendário
- 📱 **Responsivo:** Funciona em mobile e desktop

---

## 🆘 Problemas?

### Token 401?
→ Fazer login novamente e obter novo token

### Calendário vazio?
→ Executar `./create-test-appointments.sh TOKEN`

### Erro na API?
→ Verificar logs no Railway Dashboard

### Frontend não carrega?
→ Verificar console do navegador (F12)

---

## 📊 Status dos Deploys

| Serviço | URL | Status |
|---------|-----|--------|
| **Backend** | https://upbeat-dedication-production.up.railway.app/api | ✅ Online |
| **Frontend** | https://seu-dominio.vercel.app | ✅ Online |

---

## 🎉 Pronto para Usar!

O sistema está **100% funcional**. Basta seguir os 3 comandos acima para começar a testar.

**Boa sorte! 🚀**
