# Appointments: Troubleshooting - Notes & Status Not Saving

## 🔴 Problema Reportado

**Sintomas:**
- Notas de admin não estão sendo salvas
- Mudanças de status (Confirm, Complete, Cancel, No Show) não funcionam

---

## ✅ Melhorias Implementadas

### 1. **Logging Detalhado**

O código agora faz log completo de:

```typescript
// ANTES de chamar API:
[AppointmentModal] Updating status to: confirmed
[AppointmentModal] Appointment ID: abc-123
[AppointmentModal] Admin notes: cliente ligou...

// DEPOIS (sucesso):
[AppointmentModal] ✅ Status updated successfully

// DEPOIS (erro):
[AppointmentModal] ❌ Failed to update appointment status
[AppointmentModal] Error details: { message, response, status }
```

### 2. **Mensagens de Erro Melhoradas**

```typescript
// ANTES:
alert('Failed to update status');

// DEPOIS:
alert('❌ Failed to update status: [ERRO ESPECÍFICO DO BACKEND]\n\nCheck console for details.');
```

---

## 🔍 Como Diagnosticar o Problema

### Passo 1: Abrir DevTools Console

1. Abra a aplicação: `http://localhost:3001/dashboard/appointments`
2. Pressione **F12** (Chrome DevTools)
3. Vá para a aba **Console**
4. Filtre por: `[AppointmentModal]`

### Passo 2: Tentar Salvar Nota ou Mudar Status

1. Clique em um appointment
2. Digite uma nota em "Admin Notes"
3. Clique em **"Save Notes"**
4. Ou clique em **"Confirm"** / **"Complete"** / etc.

### Passo 3: Verificar Logs no Console

#### ✅ Caso de Sucesso:
```
[AppointmentModal] Saving notes...
[AppointmentModal] Appointment ID: 123-abc
[AppointmentModal] Notes: cliente ligou que vai pensar...
[ApiClient] ========== REQUEST ==========
[ApiClient] Method: PATCH
[ApiClient] URL: /appointments/123-abc
[ApiClient] ✅ Token added to headers
[AppointmentModal] ✅ Notes saved successfully
```

#### ❌ Caso de Erro - Backend não responde:
```
[AppointmentModal] Saving notes...
[ApiClient] ========== REQUEST ==========
[ApiClient] Method: PATCH
[ApiClient] URL: /appointments/123-abc
[ApiClient] ⚠️ No token available!
[AppointmentModal] ❌ Failed to save notes
[AppointmentModal] Error details: {
  message: "Request failed with status code 401",
  status: 401
}
```

#### ❌ Caso de Erro - Backend retorna erro:
```
[AppointmentModal] Updating status to: confirmed
[ApiClient] ========== REQUEST ==========
[ApiClient] ✅ Token added to headers
[AppointmentModal] ❌ Failed to update appointment status
[AppointmentModal] Error details: {
  message: "Appointment not found",
  response: { message: "Appointment not found", statusCode: 404 },
  status: 404
}
```

---

## 🐛 Problemas Comuns e Soluções

### Problema 1: `⚠️ No token available!`

**Causa:** Usuário não está autenticado ou token expirou

**Solução:**
```bash
# 1. Fazer logout e login novamente
# 2. Verificar localStorage
localStorage.getItem('accessToken')
localStorage.getItem('refreshToken')

# 3. Se vazio, fazer login em:
http://localhost:3001/auth/login
```

### Problema 2: `401 Unauthorized`

**Causa:** Token inválido ou backend não está validando corretamente

**Solução:**
```bash
# 1. Verificar se backend está rodando
curl http://localhost:3000/api/appointments

# 2. Testar autenticação
curl -H "Authorization: Bearer SEU_TOKEN" \
     http://localhost:3000/api/appointments

# 3. Verificar .env do backend
cat backend/.env.development | grep JWT_SECRET
```

### Problema 3: `404 Not Found`

**Causa:** Appointment ID não existe no banco de dados

**Solução:**
```bash
# Verificar appointments no banco
psql -U postgres -d flipcars_admin -c "SELECT id, \"leadId\", \"appointmentDate\", status FROM appointments;"

# Verificar se o ID do appointment está correto
```

### Problema 4: `Network Error` ou `ERR_CONNECTION_REFUSED`

**Causa:** Backend não está rodando

**Solução:**
```bash
cd backend
npm run start:dev

# Verificar se está rodando em http://localhost:3000
curl http://localhost:3000/api
```

### Problema 5: `CORS Error`

**Causa:** Frontend (porta 3001) não tem permissão para chamar Backend (porta 3000)

**Solução:**
```typescript
// backend/src/main.ts
app.enableCors({
  origin: ['http://localhost:3001', 'http://localhost:3002'],
  credentials: true,
});
```

---

## 🧪 Teste Manual Completo

### Teste 1: Salvar Notas

1. Abra appointment
2. Digite: "cliente ligou que vai pensar no orçamento"
3. Clique "Save Notes"
4. **Esperar:** Alert "✅ Notes saved successfully!"
5. **Verificar:** Refresh da página, nota deve aparecer

### Teste 2: Mudar Status para Confirmed

1. Abra appointment com status "Scheduled"
2. Clique botão verde "Confirm"
3. **Esperar:** Alert "✅ Status updated to CONFIRMED successfully!"
4. **Verificar:** Modal fecha, calendário atualiza

### Teste 3: Mudar Status para Complete

1. Abra appointment com status "Confirmed"
2. Clique botão cinza "Complete"
3. **Esperar:** Alert "✅ Status updated to COMPLETED successfully!"
4. **Verificar:** Event no calendário muda de cor

### Teste 4: Cancelar Appointment

1. Abra qualquer appointment
2. Clique botão vermelho "Cancel"
3. **Esperar:** Alert "✅ Status updated to CANCELLED successfully!"
4. **Verificar:** Event fica vermelho no calendário

### Teste 5: Marcar No Show

1. Abra appointment que passou da data
2. Clique botão laranja "No Show"
3. **Esperar:** Alert "✅ Status updated to NO_SHOW successfully!"
4. **Verificar:** Event fica laranja no calendário

---

## 📊 Endpoints Backend Necessários

Para tudo funcionar, o backend precisa ter:

```typescript
// 1. Update appointment (notes)
PATCH /api/appointments/:id
Body: { adminNotes: "string" }

// 2. Update status
PATCH /api/appointments/:id
Body: { status: "confirmed" | "completed" | "cancelled" | "no_show" }

// 3. Update status + notes (combinado)
PATCH /api/appointments/:id
Body: { status: "confirmed", adminNotes: "string" }
```

---

## 🔧 Verificar Backend

Execute estes comandos no backend:

```bash
# 1. Verificar se endpoint existe
cd backend
grep -r "updateAppointment\|@Patch.*appointments" src/

# 2. Testar endpoint diretamente
curl -X PATCH http://localhost:3000/api/appointments/APPOINTMENT_ID \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"adminNotes":"test note"}'

# 3. Verificar logs do backend
npm run start:dev
# Abrir outro terminal e fazer o teste acima
```

---

## ✅ Checklist de Funcionamento

- [ ] **Backend rodando** em http://localhost:3000
- [ ] **Frontend rodando** em http://localhost:3001
- [ ] **Token presente** no localStorage
- [ ] **Console sem erros** CORS ou 401
- [ ] **Endpoint PATCH /appointments/:id** existe no backend
- [ ] **Alert de sucesso** aparece ao salvar
- [ ] **Calendário atualiza** após mudança de status
- [ ] **Notas persistem** após refresh da página

---

## 📝 Como Reportar Bug

Se o problema persistir, reporte com estas informações:

```
1. **Console Logs:**
   - Copie TODOS os logs com prefixo [AppointmentModal] e [ApiClient]

2. **Network Tab:**
   - Abra DevTools > Network
   - Faça a ação (salvar nota)
   - Copie a requisição PATCH /appointments/...
   - Inclua: Request Headers, Request Payload, Response

3. **Backend Logs:**
   - O que aparece no terminal do backend ao fazer a ação?

4. **Ambiente:**
   - Sistema operacional
   - Node version: `node -v`
   - npm version: `npm -v`
   - Backend URL: process.env.NEXT_PUBLIC_API_URL
```

---

## 🚀 Próximos Passos

Após fazer o debug acima, você vai identificar qual o problema exato:

1. **Token missing** → Fazer login novamente
2. **Backend down** → Iniciar backend
3. **404 Not Found** → Verificar dados no banco
4. **500 Server Error** → Ver logs do backend
5. **CORS Error** → Configurar CORS no backend

**Commit implementado**: `a7f4c7fd`

