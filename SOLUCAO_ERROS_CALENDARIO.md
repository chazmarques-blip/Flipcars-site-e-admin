# 🔧 SOLUÇÃO: Erros 401/500 no Calendário

## 📊 **SITUAÇÃO ATUAL**

Você conseguiu fazer login com sucesso, mas o calendário ainda mostra erros 401 e 500.

## 🎯 **CAUSA**

O token JWT pode estar:
1. Expirado (tokens duram 1 hora)
2. Corrompido no localStorage
3. Não sendo enviado em todas as requisições

## ✅ **SOLUÇÃO RÁPIDA**

### **Passo 1: Limpar localStorage**

Abra o DevTools (F12) e execute no Console:

```javascript
// Limpar todos os dados de autenticação
localStorage.clear();
sessionStorage.clear();

// Recarregar página
window.location.href = '/auth/login';
```

### **Passo 2: Fazer login novamente**

1. Acesse: https://admin.flipcars.us/auth/login
2. Email: `admin@flipcars.us`
3. Senha: `Admin123!`

### **Passo 3: Acessar calendário**

https://admin.flipcars.us/dashboard/appointments-v2

**Os erros devem desaparecer!**

---

## 🧪 **VERIFICAR SE APPOINTMENT FOI CRIADO**

Execute no Supabase SQL Editor:

```sql
-- Ver appointments criados
SELECT 
  a.id,
  a.appointment_date,
  a.appointment_time_slot,
  a.status,
  l.name as lead_name,
  l.phone as lead_phone
FROM appointments a
INNER JOIN leads l ON a.lead_id = l.id
ORDER BY a.created_at DESC;
```

Se retornar alguma linha, o appointment foi criado! ✅

---

## 🔍 **DEBUG AVANÇADO (se ainda houver erros)**

### **Verificar token no localStorage**

Console do DevTools:

```javascript
// Ver token atual
console.log('Token:', localStorage.getItem('accessToken'));

// Ver quando expira
const token = localStorage.getItem('accessToken');
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  const exp = new Date(payload.exp * 1000);
  console.log('Token expira em:', exp);
  console.log('Token expirado?', Date.now() > payload.exp * 1000);
}
```

### **Se token estiver expirado:**

```javascript
// Forçar logout
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
window.location.href = '/auth/login';
```

---

## 📋 **CHECKLIST**

- [ ] Limpar localStorage (F12 → Console → `localStorage.clear()`)
- [ ] Fazer logout (se houver botão de logout)
- [ ] Fazer login novamente com `admin@flipcars.us` / `Admin123!`
- [ ] Acessar calendário
- [ ] Verificar se erros 401/500 desapareceram
- [ ] Verificar se appointment aparece no calendário

---

## 🎯 **CRIAR APPOINTMENT DE TESTE**

Se não houver appointments ainda, execute no Supabase:

```sql
-- Criar appointment automático
INSERT INTO appointments (lead_id, appointment_date, appointment_time_slot, appointment_start_time, appointment_end_time, status)
SELECT id, '2025-11-25', '10:00-12:00', '10:00:00', '12:00:00', 'scheduled'
FROM leads
ORDER BY created_at DESC
LIMIT 1
RETURNING *;
```

Depois recarregue o calendário!

---

## 🚀 **RESULTADO ESPERADO**

Após limpar cache e fazer login novamente:

✅ Sem erros 401
✅ Sem erros 500
✅ Calendário carrega dados
✅ Appointments aparecem
✅ Stats funcionam

---

**Execute os passos acima e me diga o resultado!** 👍
