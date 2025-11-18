# 🔧 Exemplos de Uso da API - Appointments System

## 🔐 Autenticação

### 1. Login
```bash
curl -X POST https://upbeat-dedication-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu-email@exemplo.com",
    "password": "sua-senha"
  }' | jq '.'
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "seu-email@exemplo.com",
    "name": "Seu Nome",
    "role": "admin"
  }
}
```

### 2. Extrair Token (apenas o token)
```bash
TOKEN=$(curl -s -X POST https://upbeat-dedication-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu-email@exemplo.com",
    "password": "sua-senha"
  }' | jq -r '.access_token')

echo "Token: $TOKEN"
```

### 3. Verificar Perfil
```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://upbeat-dedication-production.up.railway.app/api/auth/profile | jq '.'
```

---

## 📅 Appointments

### 1. Listar Todos os Appointments
```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://upbeat-dedication-production.up.railway.app/api/appointments | jq '.'
```

### 2. Buscar Appointment por ID
```bash
APPOINTMENT_ID="uuid-do-appointment"
curl -H "Authorization: Bearer $TOKEN" \
  "https://upbeat-dedication-production.up.railway.app/api/appointments/$APPOINTMENT_ID" | jq '.'
```

### 3. Buscar Appointment por Lead ID
```bash
LEAD_ID="uuid-do-lead"
curl -H "Authorization: Bearer $TOKEN" \
  "https://upbeat-dedication-production.up.railway.app/api/appointments/lead/$LEAD_ID" | jq '.'
```

### 4. Buscar Appointments por Mês
```bash
# Mês atual
YEAR=$(date +%Y)
MONTH=$(date +%m)

curl -H "Authorization: Bearer $TOKEN" \
  "https://upbeat-dedication-production.up.railway.app/api/appointments/month/$YEAR/$MONTH" | jq '.'

# Exemplo: Novembro 2025
curl -H "Authorization: Bearer $TOKEN" \
  "https://upbeat-dedication-production.up.railway.app/api/appointments/month/2025/11" | jq '.'
```

### 5. Criar Appointment Manualmente
```bash
curl -X POST https://upbeat-dedication-production.up.railway.app/api/appointments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "leadId": "uuid-do-lead",
    "appointmentDate": "2025-11-25",
    "appointmentTimeSlot": "14:00-16:00",
    "contactPreferences": {
      "phoneCall": true,
      "whatsapp": true,
      "textMessage": false
    },
    "adminNotes": "Cliente preferiu horário da tarde"
  }' | jq '.'
```

### 6. Atualizar Appointment
```bash
APPOINTMENT_ID="uuid-do-appointment"

curl -X PATCH "https://upbeat-dedication-production.up.railway.app/api/appointments/$APPOINTMENT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed",
    "adminNotes": "Cliente confirmou via WhatsApp"
  }' | jq '.'
```

**Status disponíveis:**
- `scheduled` - Agendado
- `confirmed` - Confirmado
- `completed` - Concluído
- `cancelled` - Cancelado
- `no_show` - Cliente não compareceu
- `rescheduled` - Reagendado

### 7. Deletar Appointment
```bash
APPOINTMENT_ID="uuid-do-appointment"

curl -X DELETE "https://upbeat-dedication-production.up.railway.app/api/appointments/$APPOINTMENT_ID" \
  -H "Authorization: Bearer $TOKEN"
```

### 8. Estatísticas Básicas
```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://upbeat-dedication-production.up.railway.app/api/appointments/stats | jq '.'
```

**Resposta:**
```json
{
  "total": 42,
  "byStatus": {
    "scheduled": 15,
    "confirmed": 10,
    "completed": 12,
    "cancelled": 3,
    "no_show": 2
  }
}
```

### 9. Estatísticas Enriquecidas (Dashboard)
```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://upbeat-dedication-production.up.railway.app/api/appointments/stats/enriched | jq '.'
```

**Resposta:**
```json
{
  "total": 42,
  "thisWeek": 8,
  "estimatedRevenue": "35000.00",
  "formattedRevenue": "$35.0K"
}
```

---

## 👥 Leads (que criam Appointments automaticamente)

### 1. Criar Lead COM Appointment
```bash
curl -X POST https://upbeat-dedication-production.up.railway.app/api/leads \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "phone": "11987654321",
    "email": "joao.silva@email.com",
    "vehicleYear": "2020",
    "vehicleMake": "Toyota",
    "vehicleModel": "Corolla",
    "hasInsurance": true,
    "insuranceProvider": "Porto Seguro",
    "preferredDate": "2025-11-22",
    "preferredTimeSlot": "10:00-12:00",
    "contactPreferences": {
      "phoneCall": true,
      "whatsapp": true
    },
    "priority": "high",
    "estimatedValue": 5500,
    "notes": "Cliente solicitou orçamento urgente"
  }' | jq '.'
```

**⚠️ IMPORTANTE:** Quando você cria um Lead com `preferredDate` e `preferredTimeSlot`, um Appointment é criado **automaticamente**!

### 2. Criar Lead SEM Appointment
```bash
curl -X POST https://upbeat-dedication-production.up.railway.app/api/leads \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Santos",
    "phone": "11976543210",
    "email": "maria.santos@email.com",
    "vehicleYear": "2019",
    "vehicleMake": "Honda",
    "vehicleModel": "Civic",
    "hasInsurance": false,
    "priority": "medium",
    "estimatedValue": 4200,
    "notes": "Lead ainda não definiu data"
  }' | jq '.'
```

### 3. Listar Leads
```bash
# Listar todos (paginado)
curl -H "Authorization: Bearer $TOKEN" \
  "https://upbeat-dedication-production.up.railway.app/api/leads?page=1&limit=10" | jq '.'

# Filtrar por status
curl -H "Authorization: Bearer $TOKEN" \
  "https://upbeat-dedication-production.up.railway.app/api/leads?status=new" | jq '.'

# Filtrar por prioridade
curl -H "Authorization: Bearer $TOKEN" \
  "https://upbeat-dedication-production.up.railway.app/api/leads?priority=high" | jq '.'

# Buscar por nome
curl -H "Authorization: Bearer $TOKEN" \
  "https://upbeat-dedication-production.up.railway.app/api/leads?search=João" | jq '.'
```

### 4. Buscar Lead por ID
```bash
LEAD_ID="uuid-do-lead"
curl -H "Authorization: Bearer $TOKEN" \
  "https://upbeat-dedication-production.up.railway.app/api/leads/$LEAD_ID" | jq '.'
```

### 5. Atualizar Lead (adicionar data preferida)
```bash
LEAD_ID="uuid-do-lead"

curl -X PATCH "https://upbeat-dedication-production.up.railway.app/api/leads/$LEAD_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "preferredDate": "2025-11-23",
    "preferredTimeSlot": "15:00-17:00"
  }' | jq '.'
```

**⚠️ NOTA:** Atualizar um Lead existente com `preferredDate` e `preferredTimeSlot` **NÃO** cria appointment automaticamente. Apenas na criação inicial.

---

## 📊 Exemplos Práticos

### Fluxo Completo: Login → Criar Lead → Ver Appointment

```bash
#!/bin/bash

# 1. Fazer login e obter token
echo "🔐 Fazendo login..."
TOKEN=$(curl -s -X POST https://upbeat-dedication-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu-email@exemplo.com",
    "password": "sua-senha"
  }' | jq -r '.access_token')

echo "✅ Token obtido: ${TOKEN:0:20}..."
echo ""

# 2. Criar Lead com appointment
echo "📝 Criando Lead com appointment..."
LEAD=$(curl -s -X POST https://upbeat-dedication-production.up.railway.app/api/leads \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste API",
    "phone": "11999999999",
    "email": "teste@api.com",
    "vehicleYear": "2021",
    "vehicleMake": "Fiat",
    "vehicleModel": "Argo",
    "hasInsurance": true,
    "preferredDate": "2025-11-25",
    "preferredTimeSlot": "9:00-11:00",
    "priority": "high",
    "estimatedValue": 3500
  }')

LEAD_ID=$(echo "$LEAD" | jq -r '.id')
echo "✅ Lead criado: $LEAD_ID"
echo ""

# 3. Verificar se appointment foi criado
echo "📅 Buscando appointment do Lead..."
sleep 2  # Aguardar criação
APPOINTMENT=$(curl -s -H "Authorization: Bearer $TOKEN" \
  "https://upbeat-dedication-production.up.railway.app/api/appointments/lead/$LEAD_ID")

if echo "$APPOINTMENT" | grep -q '"id"'; then
    echo "✅ Appointment encontrado!"
    echo "$APPOINTMENT" | jq '{id, appointmentDate, appointmentTimeSlot, status}'
else
    echo "❌ Appointment não encontrado"
fi
echo ""

# 4. Listar todos appointments
echo "📊 Total de appointments:"
curl -s -H "Authorization: Bearer $TOKEN" \
  https://upbeat-dedication-production.up.railway.app/api/appointments \
  | jq 'length'
```

---

## 🔍 Filtros e Queries

### Appointments por período
```bash
# Appointments entre datas
START_DATE="2025-11-01"
END_DATE="2025-11-30"

# Nota: Este endpoint precisa ser implementado no backend
# curl -H "Authorization: Bearer $TOKEN" \
#   "https://upbeat-dedication-production.up.railway.app/api/appointments/range?start=$START_DATE&end=$END_DATE"
```

### Leads com paginação e ordenação
```bash
# Página 1, 20 itens, ordenado por data de criação (mais recente primeiro)
curl -H "Authorization: Bearer $TOKEN" \
  "https://upbeat-dedication-production.up.railway.app/api/leads?page=1&limit=20&sortBy=createdAt&sortOrder=DESC" \
  | jq '.'
```

---

## 💡 Dicas

### 1. Salvar Token em Variável de Ambiente
```bash
export API_TOKEN="seu-token-aqui"

# Usar em requests
curl -H "Authorization: Bearer $API_TOKEN" \
  https://upbeat-dedication-production.up.railway.app/api/appointments | jq '.'
```

### 2. Formatar Data Automaticamente
```bash
# Amanhã
TOMORROW=$(date -d "+1 day" +%Y-%m-%d 2>/dev/null || date -v+1d +%Y-%m-%d)

# Próxima semana
NEXT_WEEK=$(date -d "+7 days" +%Y-%m-%d 2>/dev/null || date -v+7d +%Y-%m-%d)

echo "Amanhã: $TOMORROW"
echo "Próxima semana: $NEXT_WEEK"
```

### 3. Contar Appointments por Status
```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  https://upbeat-dedication-production.up.railway.app/api/appointments \
  | jq 'group_by(.status) | map({status: .[0].status, count: length})'
```

### 4. Listar Appointments de Hoje
```bash
TODAY=$(date +%Y-%m-%d)

curl -s -H "Authorization: Bearer $TOKEN" \
  https://upbeat-dedication-production.up.railway.app/api/appointments \
  | jq --arg today "$TODAY" '.[] | select(.appointmentDate == $today)'
```

---

## 🚨 Códigos de Resposta HTTP

| Código | Significado | Ação |
|--------|-------------|------|
| `200` | Sucesso | Tudo certo |
| `201` | Criado | Recurso criado com sucesso |
| `400` | Bad Request | Verificar formato dos dados |
| `401` | Unauthorized | Token inválido ou expirado |
| `403` | Forbidden | Sem permissão |
| `404` | Not Found | Recurso não encontrado |
| `500` | Server Error | Erro no servidor |

---

## 📝 Campos Obrigatórios

### Create Appointment
- `leadId` ✅
- `appointmentDate` ✅ (formato: YYYY-MM-DD)
- `appointmentTimeSlot` ✅ (formato: "H:MM-H:MM")

### Create Lead (mínimo)
- `name` ✅
- `phone` ✅
- `email` ✅
- `vehicleYear` ✅
- `vehicleMake` ✅
- `vehicleModel` ✅

### Create Lead (para gerar appointment)
- Todos os campos acima ✅
- `preferredDate` ✅
- `preferredTimeSlot` ✅

---

## 🎯 Testes Rápidos

### Teste 1: Verificar se API está online
```bash
curl -s https://upbeat-dedication-production.up.railway.app/api/appointments
# Esperado: {"message":"Unauthorized","statusCode":401}
```

### Teste 2: Login funciona?
```bash
curl -X POST https://upbeat-dedication-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}' | jq '.'
# Esperado: token ou erro de credenciais
```

### Teste 3: Quantos appointments existem?
```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  https://upbeat-dedication-production.up.railway.app/api/appointments | jq 'length'
```

---

## 📚 Recursos Adicionais

- **Documentação Completa:** `TESTE_APPOINTMENTS.md`
- **Script de Teste:** `./test-appointments.sh`
- **Script de Criação:** `./create-test-appointments.sh`
- **Resumo:** `RESUMO_FINAL_TESTE.md`
