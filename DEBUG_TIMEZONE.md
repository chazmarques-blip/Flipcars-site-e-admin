# 🐛 DEBUG: Data Errada nos Cards de Upcoming

## 📊 INFORMAÇÕES NECESSÁRIAS

Para diagnosticar corretamente, preciso que você:

### 1️⃣ **Tire Print Mostrando:**
- **Calendário** (qual dia está selecionado/destacado)
- **Cards de Upcoming** (qual data aparece)

### 2️⃣ **Me Diga:**
- **Data esperada**: Ex: "Deveria mostrar 4 de dezembro"
- **Data aparecendo**: Ex: "Está mostrando 5 de dezembro"

### 3️⃣ **Abra o Console do Navegador** (F12)

Acesse: https://admin.flipcars.us/dashboard/appointments

No console, cole e execute:
```javascript
// Ver dados RAW dos appointments
const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
console.log('=== APPOINTMENTS RAW DATA ===');
appointments.slice(0, 2).forEach(apt => {
  console.log({
    id: apt.id,
    appointmentDate: apt.appointmentDate,
    appointmentStartTime: apt.appointmentStartTime,
    customerName: apt.lead?.name,
  });
});

// Ver hoje em Orlando
const todayOrlando = new Date().toLocaleString('en-US', { 
  timeZone: 'America/New_York',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});
console.log('TODAY ORLANDO:', todayOrlando);

// Ver hoje no navegador
console.log('TODAY BROWSER:', new Date().toLocaleDateString());
```

**Copie e cole aqui** o resultado do console.

---

## 🔍 POSSÍVEIS CAUSAS

### **Causa 1: Backend retornando data errada**
Se o backend salva `2025-12-05` mas retorna `2025-12-04` na API.

**Como verificar**: 
- Abra Network (F12 → Network)
- Recarregue a página
- Procure chamada `appointments`
- Veja o JSON retornado → campo `appointmentDate`

### **Causa 2: Vercel ainda com código antigo**
O deploy do Vercel não foi feito ou falhou.

**Como verificar**:
1. Acesse: https://vercel.com/dashboard
2. FlipCars Admin → Deployments
3. Último deploy é `ab7b6e28`? (commit de correção de timezone)
4. Status é "Ready"?

### **Causa 3: Cache do browser**
O navegador está usando código antigo em cache.

**Como resolver**:
1. Hard refresh: `Ctrl + Shift + R` (Windows) ou `Cmd + Shift + R` (Mac)
2. Ou: Abrir janela anônima/privada
3. Limpar cache do site

### **Causa 4: Timezone do sistema diferente**
Seu computador está em timezone diferente de Orlando.

**Como verificar**:
```javascript
console.log('System timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
```

---

## 🔧 TESTES RÁPIDOS

### **Teste 1: Ver appointmentDate RAW**
No console (F12):
```javascript
// Pegar primeiro appointment
fetch('https://upbeat-dedication-production.up.railway.app/api/appointments', {
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
})
.then(r => r.json())
.then(data => {
  console.log('FIRST APPOINTMENT:', data[0]);
  console.log('appointmentDate:', data[0].appointmentDate);
  console.log('appointmentStartTime:', data[0].appointmentStartTime);
});
```

### **Teste 2: Ver se código novo está rodando**
No console (F12):
```javascript
// Ver versão do EventBadge (se tem comentário CRITICAL)
const badges = document.querySelectorAll('[class*="EventBadge"]');
console.log('EventBadge elements:', badges.length);
```

### **Teste 3: Forçar recarga sem cache**
1. Abrir DevTools (F12)
2. Clicar direito no botão "Reload" do navegador
3. Selecionar **"Empty Cache and Hard Reload"**

---

## 📸 ME ENVIE

1. **Print** do calendário + cards de upcoming (mostrando data errada)
2. **Resultado do console** (teste 1 acima - dados RAW do backend)
3. **Screenshot do Vercel** (Deployments - último deploy)
4. **Seu timezone**: Execute no console:
   ```javascript
   console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
   ```

Com essas informações, vou identificar **exatamente** onde está o problema! 🎯
