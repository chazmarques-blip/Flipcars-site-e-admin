# 🏗️ DIAGRAMA DE ARQUITETURA - CALENDÁRIO + LEADS

---

## 📊 VISÃO GERAL DO SISTEMA

```
┌─────────────────────────────────────────────────────────────────────┐
│                          FLIP AUTO BODY CRM                          │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    CAMADA DE ENTRADA                           │ │
│  │                                                                 │ │
│  │  ┌──────────────┐              ┌─────────────────┐            │ │
│  │  │ Site Externo │              │  Admin Panel    │            │ │
│  │  │ (Formulário) │              │  (Usuários)     │            │ │
│  │  └──────┬───────┘              └────────┬────────┘            │ │
│  └─────────┼──────────────────────────────┼─────────────────────┘ │
│            │                               │                        │
│            │  POST /api/public/leads       │  POST /api/leads       │
│            │                               │                        │
│  ┌─────────▼───────────────────────────────▼─────────────────────┐ │
│  │                    LEADS MODULE (EXISTENTE)                   │ │
│  │                      ✅ NÃO SERÁ MODIFICADO                    │ │
│  │                                                                │ │
│  │  ┌──────────────────────────────────────────────────────────┐ │ │
│  │  │  LeadsController                                         │ │ │
│  │  │  - create()         ✅ INTACTO                           │ │ │
│  │  │  - findAll()        ✅ INTACTO                           │ │ │
│  │  │  - update()         ✅ INTACTO                           │ │ │
│  │  │  - delete()         ✅ INTACTO                           │ │ │
│  │  └──────────────────────────────────────────────────────────┘ │ │
│  │                               │                                │ │
│  │                               ▼                                │ │
│  │  ┌──────────────────────────────────────────────────────────┐ │ │
│  │  │  LeadsService                                            │ │ │
│  │  │  - generateReferenceNumber() ✅ INTACTO                  │ │ │
│  │  │    → FLIP-YYYYMMDD-XXXX                                  │ │ │
│  │  │  - create()         ✅ INTACTO                           │ │ │
│  │  │  - update()         ✅ INTACTO                           │ │ │
│  │  └──────────────────────────────────────────────────────────┘ │ │
│  │                               │                                │ │
│  │                               ▼                                │ │
│  │  ┌──────────────────────────────────────────────────────────┐ │ │
│  │  │  PostgreSQL Database                                     │ │ │
│  │  │  Table: leads                                            │ │ │
│  │  │                                                           │ │ │
│  │  │  Columns:                                                │ │ │
│  │  │  - id (UUID)                                             │ │ │
│  │  │  - reference_number (FLIP-YYYYMMDD-XXXX) ✅             │ │ │
│  │  │  - name                                                  │ │ │
│  │  │  - phone                                                 │ │ │
│  │  │  - email                                                 │ │ │
│  │  │  - preferred_date        ← USADO PELO CALENDÁRIO        │ │ │
│  │  │  - preferred_time_slot   ← USADO PELO CALENDÁRIO        │ │ │
│  │  │  - vehicle_year                                          │ │ │
│  │  │  - vehicle_make                                          │ │ │
│  │  │  - vehicle_model                                         │ │ │
│  │  │  - insurance_provider    ← USADO PARA TAGS              │ │ │
│  │  │  - has_insurance         ← USADO PARA TAGS              │ │ │
│  │  │  - status                                                │ │ │
│  │  │  - priority                                              │ │ │
│  │  │  - created_at                                            │ │ │
│  │  │  - updated_at                                            │ │ │
│  │  └──────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                               │                                      │
│                               │ SELECT apenas (READ ONLY)            │
│                               │                                      │
│  ┌────────────────────────────▼──────────────────────────────────┐  │
│  │            APPOINTMENTS MODULE (NOVO - READ ONLY)             │  │
│  │                      ✨ CAMADA DE VISUALIZAÇÃO                │  │
│  │                                                                │  │
│  │  ┌──────────────────────────────────────────────────────────┐ │  │
│  │  │  AppointmentsController (NOVO)                           │ │  │
│  │  │  GET /api/appointments/calendar                          │ │  │
│  │  │  GET /api/appointments/:id                               │ │  │
│  │  │                                                           │ │  │
│  │  │  🔒 NÃO TEM: POST, PATCH, DELETE                         │ │  │
│  │  └──────────────────────────────────────────────────────────┘ │  │
│  │                               │                                │  │
│  │                               ▼                                │  │
│  │  ┌──────────────────────────────────────────────────────────┐ │  │
│  │  │  AppointmentsService (NOVO - READ ONLY)                  │ │  │
│  │  │                                                           │ │  │
│  │  │  Methods:                                                │ │  │
│  │  │  ✅ getCalendarEvents(startDate, endDate)                │ │  │
│  │  │     → SELECT * FROM leads WHERE preferred_date BETWEEN   │ │  │
│  │  │                                                           │ │  │
│  │  │  ✅ transformLeadToEvent(lead)                           │ │  │
│  │  │     → Converte Lead em CalendarEvent                    │ │  │
│  │  │                                                           │ │  │
│  │  │  🔒 NÃO TEM:                                             │ │  │
│  │  │     - save()                                             │ │  │
│  │  │     - update()                                           │ │  │
│  │  │     - delete()                                           │ │  │
│  │  │     - insert()                                           │ │  │
│  │  └──────────────────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                               │                                      │
│                               │ JSON Response                        │
│                               │                                      │
│  ┌────────────────────────────▼──────────────────────────────────┐  │
│  │                    FRONTEND (React/Next.js)                   │  │
│  │                                                                │  │
│  │  ┌──────────────────────────────────────────────────────────┐ │  │
│  │  │  Componentes Existentes (INTACTOS)                       │ │  │
│  │  │  - LeadsListView        ✅                               │ │  │
│  │  │  - LeadDetailsView      ✅                               │ │  │
│  │  │  - CreateLeadForm       ✅                               │ │  │
│  │  └──────────────────────────────────────────────────────────┘ │  │
│  │                                                                │  │
│  │  ┌──────────────────────────────────────────────────────────┐ │  │
│  │  │  CalendarView (NOVO)                                     │ │  │
│  │  │                                                           │ │  │
│  │  │  Components:                                             │ │  │
│  │  │  - CalendarGrid                                          │ │  │
│  │  │  - SidePanel (Overdue + Upcoming)                        │ │  │
│  │  │  - EventModal                                            │ │  │
│  │  │  - StatisticsCards                                       │ │  │
│  │  │                                                           │ │  │
│  │  │  Hooks:                                                  │ │  │
│  │  │  - useCalendarData()                                     │ │  │
│  │  │    → Chama GET /api/appointments/calendar               │ │  │
│  │  │                                                           │ │  │
│  │  │  Services:                                               │ │  │
│  │  │  - appointmentsService.ts                                │ │  │
│  │  │    → API calls (READ ONLY)                              │ │  │
│  │  └──────────────────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 FLUXO DE DADOS DETALHADO

### **1. Criação de Lead (EXISTENTE - NÃO MUDA)**

```
┌─────────────┐
│ Usuário     │
│ preenche    │
│ formulário  │
└──────┬──────┘
       │
       │ Submete formulário
       ▼
┌─────────────────────────────────────────┐
│ POST /api/leads                         │
│                                         │
│ Body: {                                 │
│   name: "John Doe",                     │
│   phone: "1234567890",                  │
│   email: "john@email.com",              │
│   preferredDate: "2025-11-20",    ←──── Data do appointment
│   preferredTimeSlot: "10:00-12:00", ←── Horário
│   vehicleMake: "Honda",                 │
│   vehicleModel: "Accord",               │
│   hasInsurance: true,                   │
│   insuranceProvider: "State Farm"  ←──── Para tags
│ }                                        │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ LeadsService.create()                   │
│                                         │
│ 1. Gera referenceNumber:                │
│    → FLIP-20251116-0001          ✅     │
│                                         │
│ 2. Valida dados                         │
│                                         │
│ 3. Salva no database                    │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ Database: INSERT INTO leads             │
│                                         │
│ Values:                                 │
│   id: "uuid-123"                        │
│   reference_number: "FLIP-20251116-0001"│
│   name: "John Doe"                      │
│   preferred_date: "2025-11-20"    ✅    │
│   preferred_time_slot: "10:00-12:00" ✅ │
│   insurance_provider: "State Farm"  ✅  │
│   ...                                    │
└─────────────────────────────────────────┘

✅ RESULTADO: Lead criado com sucesso
✅ Reference number gerado: FLIP-20251116-0001
✅ Campos de appointment preenchidos (preferred_date, preferred_time_slot)
```

---

### **2. Visualização no Calendário (NOVO - READ ONLY)**

```
┌─────────────┐
│ Usuário     │
│ abre        │
│ /calendar   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ CalendarView.tsx                        │
│                                         │
│ useEffect(() => {                       │
│   loadCalendarData();                   │
│ }, [month, year]);                      │
└──────┬──────────────────────────────────┘
       │
       │ Chama API
       ▼
┌─────────────────────────────────────────┐
│ GET /api/appointments/calendar          │
│                                         │
│ Query params:                           │
│   startDate: "2025-11-01"               │
│   endDate: "2025-11-30"                 │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ AppointmentsService.getCalendarEvents() │
│                                         │
│ 🔒 READ ONLY Query:                     │
│                                         │
│ SELECT * FROM leads                     │
│ WHERE preferred_date                    │
│   BETWEEN '2025-11-01'                  │
│   AND '2025-11-30'                      │
│ ORDER BY preferred_date ASC             │
└──────┬──────────────────────────────────┘
       │
       │ Retorna Leads
       ▼
┌─────────────────────────────────────────┐
│ Transformação: Lead → CalendarEvent     │
│                                         │
│ Lead {                                  │
│   id: "uuid-123",                       │
│   reference_number: "FLIP-20251116-0001",│
│   name: "John Doe",                     │
│   preferred_date: "2025-11-20",         │
│   preferred_time_slot: "10:00-12:00",   │
│   insurance_provider: "State Farm",     │
│   vehicle_make: "Honda",                │
│   vehicle_model: "Accord"               │
│ }                                        │
│                                         │
│ ↓ transform()                           │
│                                         │
│ CalendarEvent {                         │
│   id: "uuid-123",                       │
│   type: "appointment",                  │
│   date: "2025-11-20",                   │
│   time: "10:00-12:00",                  │
│   customer: "John Doe",                 │
│   vehicle: "Honda Accord",              │
│   reference: "FLIP-20251116-0001",  ✅  │
│   tags: [                               │
│     "🏢 State Farm Insurance"           │
│   ],                                    │
│   serviceCategory: "Body Shop",         │
│   paymentType: "Insurance"              │
│ }                                        │
└──────┬──────────────────────────────────┘
       │
       │ Retorna JSON
       ▼
┌─────────────────────────────────────────┐
│ Frontend recebe eventos                 │
│                                         │
│ CalendarGrid renderiza:                 │
│                                         │
│ ┌───────────────────────────────────┐   │
│ │ November 2025                     │   │
│ ├───────────────────────────────────┤   │
│ │ ...                               │   │
│ │ 20  [●] Badge: 1                  │   │ ← Evento aparece
│ │     John Doe                      │   │
│ │     🏢 State Farm Insurance       │   │
│ │                                   │   │
│ └───────────────────────────────────┘   │
│                                         │
│ SidePanel renderiza:                    │
│                                         │
│ ┌───────────────────────────────────┐   │
│ │ Upcoming Appointments             │   │
│ ├───────────────────────────────────┤   │
│ │ Nov 20 • John Doe                 │   │
│ │ 10:00-12:00 • (123) 456-7890      │   │
│ │ Honda Accord                      │   │
│ │ 🏢 State Farm Insurance           │   │
│ │ Ref: FLIP-20251116-0001      ✅   │   │
│ └───────────────────────────────────┘   │
└─────────────────────────────────────────┘

✅ RESULTADO: Lead aparece no calendário
✅ Reference number correto (FLIP-20251116-0001)
✅ Tags visuais corretas (Insurance)
✅ Lead original NÃO foi modificado no database
```

---

## 🔒 SEPARAÇÃO DE RESPONSABILIDADES

```
┌─────────────────────────────────────────────────────────────┐
│                    LEADS MODULE (Owner)                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Responsabilidades:                                         │
│  ✅ CREATE leads                                            │
│  ✅ UPDATE leads                                            │
│  ✅ DELETE leads                                            │
│  ✅ Gerar reference_number (FLIP-YYYYMMDD-XXXX)             │
│  ✅ Validar dados de entrada                                │
│  ✅ Gerenciar status e prioridade                           │
│  ✅ AI qualification                                        │
│  ✅ Assignment de agentes                                   │
│                                                              │
│  Database Permissions:                                      │
│  ✅ SELECT, INSERT, UPDATE, DELETE                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              APPOINTMENTS MODULE (Read-Only Viewer)         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Responsabilidades:                                         │
│  ✅ READ leads com preferred_date                           │
│  ✅ TRANSFORMAR leads em formato de calendário              │
│  ✅ Servir dados para visualização                          │
│                                                              │
│  NÃO faz:                                                   │
│  ❌ Criar leads                                             │
│  ❌ Modificar leads                                         │
│  ❌ Deletar leads                                           │
│  ❌ Gerar reference numbers                                 │
│  ❌ Validar dados de entrada                                │
│                                                              │
│  Database Permissions:                                      │
│  ✅ SELECT apenas (READ ONLY)                               │
│  ❌ INSERT, UPDATE, DELETE bloqueados                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 MAPEAMENTO DE DADOS

### **Lead Entity → Calendar Event**

```typescript
┌──────────────────────────────────────────────────────────────┐
│                        LEAD (Source)                          │
├──────────────────────────────────────────────────────────────┤
│ id: "uuid-123"                                               │
│ reference_number: "FLIP-20251116-0001"                       │
│ name: "Jennifer Martinez"                                    │
│ phone: "(407) 892-3451"                                      │
│ email: "jennifer.martinez@email.com"                         │
│ preferred_date: "2025-11-18"           ← CAMPO CHAVE         │
│ preferred_time_slot: "10:00-12:00"     ← CAMPO CHAVE         │
│ vehicle_year: "2021"                                         │
│ vehicle_make: "Honda"                                        │
│ vehicle_model: "Accord"                                      │
│ has_insurance: true                                          │
│ insurance_provider: "State Farm"        ← PARA TAGS          │
│ status: "qualified_ai"                                       │
│ priority: "high"                                             │
│ ai_qualification_score: 85                                   │
│ estimated_value: 1200.00                                     │
└──────────────────────────────────────────────────────────────┘
                          │
                          │ transformLeadToEvent()
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                   CALENDAR EVENT (Display)                    │
├──────────────────────────────────────────────────────────────┤
│ // Core Info                                                 │
│ id: "uuid-123"                                               │
│ type: "appointment"                                          │
│ reference: "FLIP-20251116-0001"          ✅ PRESERVADO       │
│                                                              │
│ // Date & Time                                               │
│ date: "2025-11-18"                       ← preferred_date    │
│ time: "10:00-12:00"                      ← preferred_time_slot│
│                                                              │
│ // Customer                                                  │
│ customer: "Jennifer Martinez"            ← name              │
│ phone: "(407) 892-3451"                  ← phone             │
│ email: "jennifer.martinez@email.com"     ← email             │
│                                                              │
│ // Vehicle                                                   │
│ vehicle: "2021 Honda Accord"             ← year+make+model   │
│                                                              │
│ // Classification                                            │
│ serviceCategory: "Body Shop"             ← Detectado         │
│ paymentType: "Insurance"                 ← has_insurance     │
│                                                              │
│ // Visual Tags                                               │
│ tags: [                                                      │
│   "🏢 State Farm Insurance",             ← insurance_provider│
│   "⚠️ High Priority",                    ← priority          │
│   "✅ Qualified (85%)"                   ← ai_score          │
│ ]                                                            │
│                                                              │
│ // Status                                                    │
│ status: "Confirmed"                      ← mapped from status│
│                                                              │
│ // Original Data (for modal)                                 │
│ originalLead: {                                              │
│   id: "uuid-123",                                            │
│   referenceNumber: "FLIP-20251116-0001", ✅                 │
│   status: "qualified_ai",                                    │
│   priority: "high",                                          │
│   estimatedValue: 1200.00,                                   │
│   // ... todos campos originais                             │
│ }                                                            │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔐 GARANTIAS DE SEGURANÇA

### **1. TypeScript Type System**

```typescript
// READ ONLY interface
interface CalendarEvent {
  readonly id: string;
  readonly reference: string;    // FLIP-YYYYMMDD-XXXX
  readonly customer: string;
  readonly date: string;
  // ... outras propriedades
}

// Impede modificações acidentais:
const event: CalendarEvent = getEvent();
event.reference = "NEW-VALUE"; // ❌ ERRO: Cannot assign to 'reference'
```

### **2. Service Layer Separation**

```typescript
// LeadsService (Full Access)
class LeadsService {
  async create(dto: CreateLeadDto) { }      // ✅ Permitido
  async update(id: string, dto: UpdateLeadDto) { } // ✅ Permitido
  async delete(id: string) { }              // ✅ Permitido
}

// AppointmentsService (Read-Only)
class AppointmentsService {
  async getCalendarEvents() { }             // ✅ Permitido
  
  // Métodos que NÃO existem:
  // create() - ❌ Não definido
  // update() - ❌ Não definido
  // delete() - ❌ Não definido
}
```

### **3. API Route Protection**

```typescript
// Rotas de Leads (Full CRUD)
POST   /api/leads              ✅ Create
GET    /api/leads              ✅ Read
GET    /api/leads/:id          ✅ Read
PATCH  /api/leads/:id          ✅ Update
DELETE /api/leads/:id          ✅ Delete

// Rotas de Appointments (Read-Only)
GET    /api/appointments/calendar  ✅ Read
GET    /api/appointments/:id       ✅ Read

// Rotas que NÃO existem:
POST   /api/appointments       ❌ Não definida
PATCH  /api/appointments/:id   ❌ Não definida
DELETE /api/appointments/:id   ❌ Não definida
```

### **4. Database Access Control**

```typescript
// LeadsService - Full access
@InjectRepository(Lead)
private leadRepository: Repository<Lead>;

this.leadRepository.save(lead);      // ✅ Permitido
this.leadRepository.update(id, dto); // ✅ Permitido
this.leadRepository.delete(id);      // ✅ Permitido

// AppointmentsService - Read-only
@InjectRepository(Lead)
private leadRepository: Repository<Lead>;

this.leadRepository.find();          // ✅ Permitido (SELECT)
this.leadRepository.findOne();       // ✅ Permitido (SELECT)

// Não usa:
this.leadRepository.save();          // ❌ Não chamado
this.leadRepository.update();        // ❌ Não chamado
this.leadRepository.delete();        // ❌ Não chamado
```

---

## 📈 FLUXO DE TRABALHO COMPLETO

```
DIA 1: Lead é criado
─────────────────────────────────────────────────────
Cliente preenche formulário no site
  ↓
POST /api/public/leads
  ↓
LeadsService.create()
  ↓
Gera reference: FLIP-20251116-0001 ✅
  ↓
INSERT INTO leads (reference_number, preferred_date, ...)
  ↓
✅ Lead salvo no database


DIA 2: Lead aparece no calendário
─────────────────────────────────────────────────────
Admin abre /admin/calendar
  ↓
GET /api/appointments/calendar?date=2025-11-16
  ↓
AppointmentsService.getCalendarEvents()
  ↓
SELECT * FROM leads WHERE preferred_date = '2025-11-16'
  ↓
Transforma Lead → CalendarEvent
  ↓
Retorna JSON com reference: "FLIP-20251116-0001" ✅
  ↓
Frontend renderiza calendário
  ↓
✅ Lead aparece com reference correto


DIA 3: Admin visualiza detalhes
─────────────────────────────────────────────────────
Admin clica no evento no calendário
  ↓
GET /api/appointments/uuid-123
  ↓
AppointmentsService.getAppointmentDetails()
  ↓
SELECT * FROM leads WHERE id = 'uuid-123'
  ↓
Retorna todos dados do lead (READ ONLY)
  ↓
Modal abre com informações completas
  ↓
✅ Reference: FLIP-20251116-0001 ✅
✅ Vehicle: 2021 Honda Accord
✅ Insurance: State Farm
✅ Status: Qualified AI
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### **Backend**
- [ ] Criar módulo `appointments`
- [ ] Implementar `AppointmentsService` (read-only)
- [ ] Criar `AppointmentsController` (GET apenas)
- [ ] Adicionar testes unitários
- [ ] Validar que NÃO modifica leads
- [ ] Testar queries de performance

### **Frontend**
- [ ] Criar `CalendarView` component
- [ ] Implementar `useCalendarData` hook
- [ ] Criar `appointmentsService.ts` API client
- [ ] Migrar estilos do mockup
- [ ] Adicionar modais de detalhes
- [ ] Testar responsividade

### **Integração**
- [ ] Deploy em staging
- [ ] Testes end-to-end
- [ ] Validar reference numbers aparecem corretamente
- [ ] Verificar que leads continuam sendo criados
- [ ] Monitorar performance
- [ ] Deploy em produção

---

**🎉 RESULTADO FINAL:** Sistema de calendário funcionando perfeitamente SEM modificar a criação ou formatação de leads existente!
