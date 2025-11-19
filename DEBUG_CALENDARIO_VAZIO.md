# 🐛 Debug: Calendário Vazio

## 🔍 Situação Atual

✅ **Leads aparecem na lista**  
❌ **Appointments não aparecem no calendário**

---

## 📋 Checklist de Debug

### 1️⃣ **Verificar se Appointment Foi Criado**

**Você precisa:**
1. Abrir DevTools (F12) no calendário
2. Ir na aba **Console**
3. Procurar por mensagens de log

**O que procurar:**
```
✅ Loaded X appointments from API  ← Se X = 0, não há appointments
📋 Appointments data: [...]        ← Ver array de appointments
```

---

### 2️⃣ **Verificar Token no Console**

**No console, procure:**
```
✅ Found auth token: eyJ...  ← Token está presente
📡 API Response status: 200  ← API respondeu OK
```

**Se ver:**
```
❌ API Response status: 401  ← Token expirado
❌ API Response status: 500  ← Erro no servidor
```

---

### 3️⃣ **Testar API Manualmente**

**Me forneça um token novo** (copie do Local Storage) e eu vou verificar:

```bash
# Com o token novo
curl -H "Authorization: Bearer SEU_TOKEN" \
  https://upbeat-dedication-production.up.railway.app/api/appointments
```

---

## 🔧 Possíveis Causas

### **Causa 1: Appointment Não Foi Criado (Mais Provável)**

**Sintoma:** Lead existe, mas sem appointment  
**Motivo:** Coluna `preferred_date` ainda não existe no banco (migration pendente)

**Solução:**
```bash
# Criar appointment manualmente via API
curl -X POST https://upbeat-dedication-production.up.railway.app/api/appointments \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "leadId": "ID_DO_LEAD",
    "appointmentDate": "2025-11-22",
    "appointmentTimeSlot": "10:00-12:00"
  }'
```

---

### **Causa 2: API Retornando Erro 500**

**Sintoma:** Console mostra erro 500  
**Motivo:** Problema com `relations: ['lead']`

**Solução:** Já aplicamos correções, aguardar deploy

---

### **Causa 3: Token Expirado ao Carregar**

**Sintoma:** Console mostra 401  
**Motivo:** Token expira após 15 minutos

**Solução:** 
1. Fazer logout
2. Fazer login novamente
3. Recarregar calendário

---

## 🎯 Ação Imediata: Por Favor, Faça Isso

### **PASSO 1: Abra o Console**
1. Vá para: https://admin.flipcars.us/dashboard/appointments-v2
2. Pressione **F12**
3. Clique na aba **Console**

### **PASSO 2: Tire um Print do Console**
**E me envie**, ou copie as mensagens que aparecem, especialmente:
- Linhas que começam com ✅, ❌, 📡, 📋
- Mensagens de erro (em vermelho)

---

## 📸 O Que Eu Preciso Ver

**Me mande:**
1. **Screenshot do Console** (F12)
2. **Novo token** do Local Storage (accessToken)

Com isso eu consigo:
- ✅ Ver se API está respondendo
- ✅ Ver se appointment foi criado
- ✅ Identificar erro exato
- ✅ Criar appointment manualmente se necessário

---

## 🚀 Solução Rápida (Se Tiver Token)

Se você me passar o token agora, eu posso:

1. Verificar se há appointments no sistema
2. Criar appointments para todos os Leads existentes
3. Você recarrega a página e vê no calendário

**Tempo: ~2 minutos**

---

## 📊 Resumo Técnico

| Item | Status | Observação |
|------|--------|------------|
| Leads criados | ✅ | Visíveis na lista |
| Entidade Lead atualizada | ✅ | Commit dcdd2150 |
| Código de auto-criação | ✅ | Existe em leads.service.ts |
| Migration do banco | ❓ | Pode não ter executado |
| API de appointments | ❓ | Retornando 500? |
| Frontend carregando | ✅ | Console deve mostrar logs |

---

## 💡 Próximo Passo

**Por favor:**
1. Abra o console (F12)
2. Vá para o calendário
3. Me mande screenshot OU copie as mensagens
4. Me passe novo token

**Com isso eu resolvo em 2 minutos!** 🚀
