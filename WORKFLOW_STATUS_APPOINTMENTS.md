# 📋 Workflow de Status dos Appointments - FlipCars

**Data:** 2025-12-04  
**Sistema:** Frontend Admin - Gerenciamento de Agendamentos

---

## 🔄 Fluxo Completo de Status

### Status Disponíveis:

```
1. SCHEDULED (Agendado)
   ↓
2. CONFIRMED (Confirmado)
   ↓
3. COMPLETED (Completado)

Ramificações:
- CANCELLED (Cancelado)
- NO_SHOW (Não compareceu)
- RESCHEDULED (Reagendado)
```

---

## 📊 Detalhamento de Cada Status

### 1️⃣ SCHEDULED (Agendado)

**Quando acontece:**
- Cliente solicitou agendamento pelo site público
- Lead foi convertido em appointment pelo admin
- Appointment foi criado mas ainda não confirmado

**Botão de Ação:** **✅ Confirm**

**O que o botão faz:**
- Altera status de `SCHEDULED` → `CONFIRMED`
- Registra `confirmedAt` (timestamp)
- Registra `confirmedById` (ID do admin)
- Envia notificação ao cliente (se configurado)

**Cor do card:** Branco
**Cor do botão:** Dourado `#D4AF37`

**Exemplo de uso:**
```
Cliente "John Silva" solicitou agendamento para Dec 10, 2:00 PM
→ Admin recebe notificação
→ Admin verifica disponibilidade
→ Admin clica em "Confirm"
→ Cliente recebe confirmação por email/SMS
```

---

### 2️⃣ CONFIRMED (Confirmado)

**Quando acontece:**
- Admin clicou em "Confirm" no appointment SCHEDULED
- Appointment foi confirmado manualmente

**Botão de Ação:** **📍 Check-in**

**O que o botão faz:**
- Marca que o cliente chegou na oficina
- Prepara para iniciar o serviço
- Pode alterar status para "em andamento" (se implementado)

**Cor do card:** Branco
**Cor do botão:** Verde `#4caf50`

**Exemplo de uso:**
```
Cliente "John Silva" chega na oficina
→ Recepcionista verifica agendamento
→ Clica em "Check-in"
→ Serviço pode iniciar
```

---

### 3️⃣ COMPLETED (Completado)

**Quando acontece:**
- Serviço foi finalizado
- Cliente pagou e retirou o veículo
- Admin marcou appointment como concluído

**Botão de Ação:** **✓ Done** (apenas visual)

**Cor do card:** Cinza claro `#f5f5f5`
**Cor do botão:** Cinza `#gray-400`

**Exemplo de uso:**
```
Serviço de Oil Change finalizado
→ Cliente pagou
→ Cliente retirou veículo
→ Admin marca como "Completed"
```

---

### 4️⃣ CANCELLED (Cancelado)

**Quando acontece:**
- Cliente cancelou agendamento
- Admin cancelou por indisponibilidade
- Motivo de força maior

**Botão de Ação:** **✗ Cancelled** (apenas visual)

**Cor do card:** Vermelho claro `#red-50`
**Cor do botão:** Vermelho `#red-500`

---

### 5️⃣ NO_SHOW (Não Compareceu)

**Quando acontece:**
- Cliente não compareceu no horário agendado
- Não avisou previamente
- Passou da janela de tolerância (ex: +15min)

**Botão de Ação:** **⚠️ No Show** (apenas visual)

**Cor do card:** Laranja claro `#orange-50`
**Cor do botão:** Laranja `#orange-500`

**Exemplo de uso:**
```
Appointment confirmado para 2:00 PM
→ Às 2:15 PM cliente não chegou
→ Às 2:30 PM admin marca como "No Show"
→ Sistema pode aplicar penalidade ou taxa
```

---

### 6️⃣ RESCHEDULED (Reagendado)

**Quando acontece:**
- Cliente solicitou mudança de data/horário
- Admin precisa ajustar agenda
- Novo appointment é criado

**Botão de Ação:** **🔄 Reschedule**

**O que o botão faz:**
- Abre modal para selecionar nova data/hora
- Mantém histórico do appointment original
- Cria novo appointment linkado

**Cor do card:** Azul claro `#blue-50`
**Cor do botão:** Azul `#blue-500`

---

## 🔴 Status Especial: OVERDUE (Vencido)

**Quando acontece:**
- Data do appointment passou
- Status ainda está em SCHEDULED ou CONFIRMED
- Não foi marcado como COMPLETED

**Botão de Ação:** **💬 Remind**

**O que o botão faz:**
- Envia lembrete ao cliente
- Email ou SMS: "Você perdeu seu agendamento?"
- Oferece opção de reagendar

**Cor do card:** Padrão
**Cor do botão:** Dourado `#D4AF37`
**Ícone especial:** 💰 (indica possível pagamento pendente)

---

## 📱 Fluxo Prático Completo

### Cenário 1: Agendamento Normal (Sucesso)

```
1. Cliente solicita agendamento no site
   Status: SCHEDULED
   Botão: [Confirm]

2. Admin confirma disponibilidade
   Status: CONFIRMED
   Botão: [Check-in]

3. Cliente chega na oficina
   Admin clica [Check-in]
   Status: CONFIRMED (ou "in_progress" se implementado)

4. Serviço finalizado
   Status: COMPLETED
   Botão: [Done] (visual apenas)
```

### Cenário 2: Cliente Não Comparece

```
1. Status: CONFIRMED
2. Horário passou (+15min tolerância)
3. Admin clica [No Show]
4. Status: NO_SHOW
5. Sistema envia notificação ao cliente
```

### Cenário 3: Cliente Cancela

```
1. Status: SCHEDULED ou CONFIRMED
2. Cliente liga para cancelar
3. Admin clica [Cancel] no modal
4. Status: CANCELLED
5. Horário fica disponível na agenda
```

### Cenário 4: Reagendamento

```
1. Status: SCHEDULED ou CONFIRMED
2. Cliente solicita mudança de data
3. Admin clica [Reschedule]
4. Seleciona nova data/hora
5. Status original: RESCHEDULED
6. Novo appointment: SCHEDULED
```

---

## 🎯 Benefícios do Sistema de Status

### Para o Admin:
- ✅ **Visibilidade total** do pipeline de appointments
- ✅ **Controle de confirmações** antes do dia
- ✅ **Identificação rápida** de no-shows
- ✅ **Histórico completo** de cada appointment

### Para o Cliente:
- ✅ **Confirmação clara** do agendamento
- ✅ **Lembretes automáticos** (se configurado)
- ✅ **Transparência** no processo
- ✅ **Facilidade** para reagendar

### Para o Negócio:
- ✅ **Redução de no-shows** com confirmações
- ✅ **Melhor gestão** da agenda
- ✅ **Dados para análise** de taxa de conversão
- ✅ **Otimização** do fluxo de trabalho

---

## 🔧 Implementação Técnica

### Backend Endpoints:

```typescript
// Alterar status
PATCH /api/appointments/:id
Body: { status: 'confirmed' }

// Confirmar appointment
POST /api/appointments/:id/confirm

// Check-in
POST /api/appointments/:id/check-in

// Cancelar
POST /api/appointments/:id/cancel

// Reagendar
POST /api/appointments/:id/reschedule
Body: { newDate: '2024-12-15', newTime: '14:00' }
```

### Frontend Actions:

```typescript
// EventBadge.tsx - Linha 88-95
const statusMap: Record<AppointmentStatus, ActionButton> = {
  SCHEDULED: { text: 'Confirm', icon: '✅', color: 'gold' },
  CONFIRMED: { text: 'Check-in', icon: '📍', color: 'green' },
  COMPLETED: { text: 'Done', icon: '✓', color: 'gray' },
  CANCELLED: { text: 'Cancelled', icon: '✗', color: 'red' },
  NO_SHOW: { text: 'No Show', icon: '⚠️', color: 'orange' },
  RESCHEDULED: { text: 'Reschedule', icon: '🔄', color: 'blue' },
};
```

---

## 📈 Métricas e Análises

### KPIs Importantes:

1. **Taxa de Confirmação:**
   ```
   Confirmados / Agendados = %
   ```

2. **Taxa de No-Show:**
   ```
   No-Shows / Confirmados = %
   ```

3. **Taxa de Conclusão:**
   ```
   Completados / Confirmados = %
   ```

4. **Tempo Médio de Confirmação:**
   ```
   Tempo entre SCHEDULED e CONFIRMED
   ```

---

## 🎯 Próximas Melhorias

1. **Notificações Automáticas:**
   - Email/SMS ao confirmar
   - Lembrete 24h antes
   - Lembrete 2h antes

2. **Status Intermediários:**
   - `IN_PROGRESS` (em andamento)
   - `WAITING_PAYMENT` (aguardando pagamento)
   - `READY_PICKUP` (pronto para retirada)

3. **Automações:**
   - Auto-confirm para clientes recorrentes
   - Auto no-show após 30min
   - Auto-remind para overdue

4. **Integrações:**
   - Google Calendar sync
   - SMS via Twilio
   - WhatsApp Business

---

## 📝 Resumo Rápido

| Status | Botão | Cor | Próximo Status |
|--------|-------|-----|----------------|
| SCHEDULED | Confirm ✅ | Dourado | CONFIRMED |
| CONFIRMED | Check-in 📍 | Verde | IN_PROGRESS |
| COMPLETED | Done ✓ | Cinza | - |
| CANCELLED | Cancelled ✗ | Vermelho | - |
| NO_SHOW | No Show ⚠️ | Laranja | - |
| RESCHEDULED | Reschedule 🔄 | Azul | SCHEDULED (novo) |
| OVERDUE | Remind 💬 | Dourado | - |

---

**Referência:** `frontend-admin/src/components/appointments/EventBadge.tsx` (linhas 77-96)
