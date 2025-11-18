# 🧪 Guia Completo de Teste - Sistema de Appointments

## 📊 Status Atual dos Deploys

| Serviço | Status | URL |
|---------|--------|-----|
| **Frontend** | ✅ Online | Vercel (seu domínio) |
| **Backend** | ✅ Online | https://upbeat-dedication-production.up.railway.app/api |
| **Token JWT** | ⚠️ Expirado | Precisa fazer login |

---

## 🔐 PASSO 1: Renovar Token JWT

### Opção A: Via Interface Web

1. **Acesse:** `https://seu-dominio.vercel.app/auth/login`
2. **Faça login** com suas credenciais
3. **Abra DevTools** (F12)
4. **Vá para:** Application > Local Storage > `https://seu-dominio.vercel.app`
5. **Copie o valor** da chave `token`

### Opção B: Via API Direta

```bash
curl -X POST https://upbeat-dedication-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu-email@exemplo.com",
    "password": "sua-senha"
  }'
```

**Resposta esperada:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "seu-email@exemplo.com",
    "name": "Seu Nome"
  }
}
```

---

## 📅 PASSO 2: Testar API de Appointments

### Usando o Script de Teste

```bash
# Executar o script com seu token
./test-appointments.sh "SEU_TOKEN_JWT_AQUI"
```

### Teste Manual com cURL

```bash
# Substituir YOUR_TOKEN pelo token obtido no passo 1
TOKEN="YOUR_TOKEN"

# 1. Listar todos appointments
curl -H "Authorization: Bearer $TOKEN" \
  https://upbeat-dedication-production.up.railway.app/api/appointments

# 2. Buscar appointments do mês atual
YEAR=$(date +%Y)
MONTH=$(date +%m)
curl -H "Authorization: Bearer $TOKEN" \
  "https://upbeat-dedication-production.up.railway.app/api/appointments/month/$YEAR/$MONTH"

# 3. Ver estatísticas
curl -H "Authorization: Bearer $TOKEN" \
  https://upbeat-dedication-production.up.railway.app/api/appointments/stats

# 4. Ver estatísticas enriquecidas (para dashboard)
curl -H "Authorization: Bearer $TOKEN" \
  https://upbeat-dedication-production.up.railway.app/api/appointments/stats/enriched
```

---

## 🌐 PASSO 3: Testar Frontend (Calendário)

### 3.1. Acessar Página de Appointments

1. **URL:** `https://seu-dominio.vercel.app/dashboard/appointments-v2`
2. **O que esperar:**
   - Se **houver appointments:** Calendário mostra eventos
   - Se **não houver:** Calendário vazio (esperado)

### 3.2. Abrir Console do Navegador

**Pressione F12** e veja os logs:

✅ **Logs esperados (sucesso):**
```
[AppointmentsCalendar] Initializing...
[ApiClient] GET /appointments - Response: 200
[AppointmentsCalendar] Loaded X appointments
[AppointmentsCalendar] Events for calendar: [...]
```

❌ **Logs de erro (se token expirado):**
```
[ApiClient] GET /appointments - Response: 401
Error: Unauthorized
```

---

## 🔧 PASSO 4: Criar Appointments para Teste

### Por que o calendário está vazio?

**Appointments são criados automaticamente** quando você cria um **Lead** com:
- `preferredDate` (data desejada)
- `preferredTimeSlot` (horário desejado)

### 4.1. Criar Lead com Appointment via API

```bash
TOKEN="SEU_TOKEN"

curl -X POST https://upbeat-dedication-production.up.railway.app/api/leads \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "phone": "11999887766",
    "email": "joao.silva@email.com",
    "vehicleYear": "2020",
    "vehicleMake": "Toyota",
    "vehicleModel": "Corolla",
    "hasInsurance": true,
    "insuranceProvider": "Porto Seguro",
    "preferredDate": "2025-11-20",
    "preferredTimeSlot": "9:00-11:00",
    "priority": "high",
    "estimatedValue": 5000
  }'
```

### 4.2. Criar Lead via Interface (se disponível)

1. Vá para a página de **criação de Leads**
2. Preencha os campos obrigatórios
3. **IMPORTANTE:** Preencha:
   - **Preferred Date:** (selecione uma data futura)
   - **Preferred Time Slot:** (ex: "9:00-11:00")
4. Salve o Lead

### 4.3. Verificar se Appointment foi criado

```bash
# Listar appointments novamente
curl -H "Authorization: Bearer $TOKEN" \
  https://upbeat-dedication-production.up.railway.app/api/appointments
```

**Resposta esperada:**
```json
[
  {
    "id": "uuid-do-appointment",
    "leadId": "uuid-do-lead",
    "appointmentDate": "2025-11-20",
    "appointmentTimeSlot": "9:00-11:00",
    "appointmentStartTime": "09:00:00",
    "appointmentEndTime": "11:00:00",
    "status": "scheduled",
    "lead": {
      "id": "uuid-do-lead",
      "name": "João Silva",
      "phone": "11999887766",
      "vehicleYear": "2020",
      "vehicleMake": "Toyota",
      "vehicleModel": "Corolla"
    }
  }
]
```

---

## 🎨 PASSO 5: Visualizar no Calendário

### 5.1. Atualizar Página

1. **Volte para:** `https://seu-dominio.vercel.app/dashboard/appointments-v2`
2. **Recarregue a página** (F5 ou Ctrl+R)
3. **Verifique o console** (F12)

### 5.2. O que você deve ver

✅ **Calendário com eventos:**
- Data com appointment aparece destacada
- Click no evento mostra detalhes do Lead
- Cor indica status (azul = scheduled)

### 5.3. Estrutura do Evento no Calendário

```javascript
{
  id: "uuid-do-appointment",
  title: "João Silva - Toyota Corolla (2020)",
  date: "2025-11-20",
  extendedProps: {
    appointment: {
      id: "uuid",
      timeSlot: "9:00-11:00",
      status: "scheduled",
      lead: {
        name: "João Silva",
        phone: "11999887766",
        vehicle: "2020 Toyota Corolla"
      }
    }
  }
}
```

---

## 🔍 PASSO 6: Verificar Banco de Dados (Opcional)

### Se você tem acesso ao Railway

1. **Acesse:** Railway Dashboard
2. **Vá para:** PostgreSQL plugin > Data
3. **Execute query:**

```sql
-- Ver todos appointments
SELECT 
  a.id,
  a.appointment_date,
  a.appointment_time_slot,
  a.status,
  l.name as lead_name,
  l.vehicle_make,
  l.vehicle_model
FROM appointments a
LEFT JOIN leads l ON a.lead_id = l.id
ORDER BY a.appointment_date DESC;

-- Contar appointments por status
SELECT status, COUNT(*) as total
FROM appointments
GROUP BY status;
```

---

## 🐛 Solução de Problemas

### Problema 1: Token 401 (Unauthorized)

**Causa:** Token JWT expirado ou inválido

**Solução:**
1. Fazer logout
2. Fazer login novamente
3. Copiar novo token
4. Testar API novamente

### Problema 2: Calendário Vazio

**Causa 1:** Não há appointments no banco

**Solução:**
- Criar Lead com `preferredDate` e `preferredTimeSlot`
- Verificar se appointment foi criado via API

**Causa 2:** Erro ao carregar dados

**Solução:**
- Abrir console do navegador (F12)
- Verificar logs de erro
- Verificar se API está respondendo

### Problema 3: Appointment não aparece

**Causa:** Lead criado sem `preferredDate` ou `preferredTimeSlot`

**Solução:**
- Editar Lead e adicionar esses campos
- OU criar novo Lead com esses campos preenchidos

### Problema 4: Erro CORS

**Causa:** Frontend tentando acessar backend de domínio diferente

**Solução:**
- Verificar configuração de CORS no backend
- Deve permitir origem do Vercel

---

## 📝 Checklist de Teste Completo

### Backend (API)
- [ ] Health check responde (ou 404 é ok)
- [ ] Login funciona e retorna token
- [ ] GET /api/appointments retorna 401 sem token
- [ ] GET /api/appointments retorna 200 com token válido
- [ ] POST /api/leads cria appointment automaticamente

### Frontend (Calendário)
- [ ] Página /dashboard/appointments-v2 carrega
- [ ] Calendário é exibido (FullCalendar)
- [ ] Console não mostra erros críticos
- [ ] Se há appointments, aparecem no calendário
- [ ] Click em evento mostra detalhes
- [ ] Navegação entre meses funciona

### Integração
- [ ] Lead com preferredDate cria appointment
- [ ] Appointment aparece na API
- [ ] Appointment aparece no calendário
- [ ] Dados do Lead aparecem corretamente
- [ ] Status é exibido corretamente

---

## 📊 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/appointments` | Listar todos |
| `GET` | `/api/appointments/:id` | Buscar por ID |
| `GET` | `/api/appointments/lead/:leadId` | Buscar por Lead |
| `GET` | `/api/appointments/month/:year/:month` | Buscar por mês |
| `GET` | `/api/appointments/stats` | Estatísticas básicas |
| `GET` | `/api/appointments/stats/enriched` | Stats para dashboard |
| `POST` | `/api/appointments` | Criar appointment |
| `PATCH` | `/api/appointments/:id` | Atualizar |
| `DELETE` | `/api/appointments/:id` | Deletar |

---

## 🎯 Próximos Passos

1. ✅ **Deploy concluído** (Frontend + Backend)
2. ⚠️ **Renovar token** (fazer login)
3. 🧪 **Executar testes** (usar script ou manual)
4. 📊 **Criar dados de teste** (Leads com appointments)
5. 🎨 **Validar UI** (calendário funcionando)
6. 🚀 **Documentar resultados**

---

## 💡 Dicas

- **Token expira:** Faça login periodicamente
- **Console é seu amigo:** Sempre abra DevTools (F12)
- **API primeiro:** Teste API antes do frontend
- **Dados de teste:** Crie alguns Leads para visualizar
- **Horários:** Use formato "H:MM-H:MM" (ex: "9:00-11:00")

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique logs do console (F12)
2. Teste API com cURL
3. Verifique se backend está online
4. Confirme que token está válido
5. Verifique formato de dados

**Backend Logs:** Railway Dashboard > Deployments > View Logs
**Frontend Logs:** DevTools Console (F12)
