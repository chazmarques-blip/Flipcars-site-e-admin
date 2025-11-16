# 📅 PLANO DE IMPLEMENTAÇÃO DO CALENDÁRIO EM PRODUÇÃO

**Data de Criação:** 16 de Novembro, 2025  
**Sistema:** Flip Auto Body - CRM + AI Lead Management  
**Objetivo:** Adicionar visualização de calendário SEM alterar sistema de leads existente

---

## 🎯 PRINCÍPIO FUNDAMENTAL

> **"O calendário é uma CAMADA DE VISUALIZAÇÃO sobre os leads existentes - NÃO modifica a criação/formatação/estrutura dos leads"**

---

## 📊 ANÁLISE DO SISTEMA ATUAL

### **Estrutura de Leads (PRESERVADA 100%)**

```typescript
// Lead Entity (backend/src/database/entities/lead.entity.ts)
@Entity('leads')
export class Lead {
  id: string;                    // UUID
  referenceNumber: string;       // FLIP-YYYYMMDD-XXXX (FORMATO ATUAL)
  name: string;                  // Nome do cliente
  phone: string;                 // Telefone
  email: string;                 // Email
  
  // APPOINTMENT DATA (já existe!)
  preferredDate?: string;        // Data preferida (ISO string)
  preferredTimeSlot?: string;    // Horário preferido
  
  // Vehicle Info
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  
  // Insurance/Warranty
  hasInsurance: boolean;
  insuranceProvider: string;
  claimNumber: string;
  
  // Status & Priority
  status: LeadStatus;            // NEW, QUALIFIED_AI, etc.
  priority: LeadPriority;        // LOW, MEDIUM, HIGH
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

### **Fluxo de Criação Atual (INTACTO)**

```
┌──────────────────┐
│  Site Externo    │ → POST /api/public/leads
│  (Formulário)    │    (public-leads.controller.ts)
└──────────────────┘           │
                               ▼
┌──────────────────┐    ┌─────────────────┐
│  Admin Panel     │ ───│  leads.service  │
│  (Interno)       │    │  .create()      │
└──────────────────┘    └─────────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │  PostgreSQL DB   │
                        │  'leads' table   │
                        │                  │
                        │  ✅ REFERÊNCIA:  │
                        │  FLIP-20251116-  │
                        │  0001             │
                        └──────────────────┘
```

**✅ ESTE FLUXO NÃO SERÁ MODIFICADO**

---

## 🏗️ ARQUITETURA DA SOLUÇÃO

### **Camada de Calendário (NOVA - READ ONLY)**

```
┌─────────────────────────────────────────────────────────────┐
│                   FLUXO ATUAL (100% PRESERVADO)             │
│                                                              │
│  Site/Admin → CREATE LEAD → Database → referenceNumber      │
│               (Intacto)      (Intacto)  (FLIP-YYYYMMDD-XXX) │
└─────────────────────────────────────────────────────────────┘
                               │
                               │ READ ONLY
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              NOVA CAMADA: CALENDÁRIO (Visualização)         │
│                                                              │
│  ┌──────────────┐        ┌─────────────────┐               │
│  │ Calendar     │  GET   │  Calendar       │               │
│  │ Frontend     │───────→│  API Endpoint   │               │
│  │ Component    │        │  (NOVO)         │               │
│  └──────────────┘        └─────────────────┘               │
│         │                         │                         │
│         │                         ▼                         │
│         │                  ┌──────────────┐                 │
│         │                  │ Appointments │                 │
│         │                  │ Service      │                 │
│         │                  │ (READ ONLY)  │                 │
│         │                  └──────────────┘                 │
│         │                         │                         │
│         ▼                         ▼                         │
│  ┌─────────────────────────────────────────┐               │
│  │  Transforma Lead em Event Appointment:  │               │
│  │                                          │               │
│  │  Lead.preferredDate → Event.date        │               │
│  │  Lead.referenceNumber → Event.reference │               │
│  │  Lead.name → Event.customer             │               │
│  │  Lead.insuranceProvider → Event.tag     │               │
│  └─────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📐 IMPLEMENTAÇÃO DETALHADA

### **FASE 1: Backend - Novo Módulo de Appointments (READ ONLY)**

#### **1.1 Criar Novo Módulo Appointments** ✨

**Localização:** `backend/src/modules/appointments/`

**Estrutura:**
```
appointments/
├── appointments.module.ts
├── appointments.controller.ts
├── appointments.service.ts
└── dto/
    └── query-appointments.dto.ts
```

#### **1.2 Appointments Service (READ ONLY)** 🔒

```typescript
// backend/src/modules/appointments/appointments.service.ts

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
  ) {}

  /**
   * IMPORTANTE: Este serviço APENAS LÊ dados existentes
   * NÃO cria, atualiza ou deleta leads
   */
  
  async getCalendarEvents(startDate: string, endDate: string) {
    // Query SOMENTE para leitura
    const leads = await this.leadRepository.find({
      where: {
        preferredDate: Between(new Date(startDate), new Date(endDate)),
      },
      order: {
        preferredDate: 'ASC',
      },
    });

    // TRANSFORMAÇÃO: Lead → Calendar Event
    return leads.map(lead => this.transformLeadToEvent(lead));
  }

  /**
   * Transforma Lead em formato de Calendar Event
   * NÃO modifica o lead, apenas formata para visualização
   */
  private transformLeadToEvent(lead: Lead) {
    return {
      id: lead.id,
      type: 'appointment',
      date: lead.preferredDate,
      time: lead.preferredTimeSlot || 'Not specified',
      
      // Customer Info
      customer: lead.name,
      phone: lead.phone,
      email: lead.email,
      
      // Vehicle Info
      vehicle: `${lead.vehicleYear} ${lead.vehicleMake} ${lead.vehicleModel}`.trim(),
      
      // Reference (FORMATO ATUAL PRESERVADO)
      reference: lead.referenceNumber, // FLIP-YYYYMMDD-XXXX
      
      // Service Type Detection
      serviceCategory: this.detectServiceCategory(lead),
      paymentType: this.detectPaymentType(lead),
      
      // Tags for visualization
      tags: this.generateTags(lead),
      
      // Status
      status: this.mapLeadStatusToAppointment(lead.status),
      
      // Original lead data (for modal display)
      originalLead: {
        id: lead.id,
        referenceNumber: lead.referenceNumber,
        status: lead.status,
        priority: lead.priority,
        aiQualificationScore: lead.aiQualificationScore,
        estimatedValue: lead.estimatedValue,
        notes: lead.notes,
        createdAt: lead.createdAt,
      },
    };
  }

  /**
   * Detecta categoria do serviço baseado em dados do lead
   */
  private detectServiceCategory(lead: Lead): 'Mechanic' | 'Body Shop' {
    // Lógica: Se tem insurance e accident, provavelmente é Body Shop
    if (lead.hasInsurance && lead.accidentDescription) {
      return 'Body Shop';
    }
    return 'Mechanic'; // Default
  }

  /**
   * Detecta tipo de pagamento
   */
  private detectPaymentType(lead: Lead): 'Insurance' | 'Warranty' | 'Private Pay' {
    if (lead.hasInsurance && lead.insuranceProvider) {
      return 'Insurance';
    }
    // Adicionar lógica para warranty quando o campo existir
    return 'Private Pay';
  }

  /**
   * Gera tags visuais para o calendário
   */
  private generateTags(lead: Lead): string[] {
    const tags = [];
    
    if (lead.insuranceProvider) {
      tags.push(`🏢 ${lead.insuranceProvider}`);
    }
    
    if (lead.priority === LeadPriority.HIGH) {
      tags.push('⚠️ High Priority');
    }
    
    if (lead.aiQualificationScore >= 70) {
      tags.push('✅ Qualified');
    }
    
    return tags;
  }

  /**
   * Mapeia status do lead para status de appointment
   */
  private mapLeadStatusToAppointment(leadStatus: LeadStatus): string {
    const statusMap = {
      [LeadStatus.NEW]: 'Pending',
      [LeadStatus.QUALIFIED_AI]: 'Confirmed',
      [LeadStatus.HUMAN_CONTACTED]: 'In Progress',
      [LeadStatus.ESTIMATE_SENT]: 'Estimate Sent',
      [LeadStatus.CONVERTED]: 'Completed',
      [LeadStatus.LOST]: 'Cancelled',
    };
    
    return statusMap[leadStatus] || 'Pending';
  }
}
```

#### **1.3 Appointments Controller**

```typescript
// backend/src/modules/appointments/appointments.controller.ts

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  /**
   * GET /api/appointments/calendar
   * Retorna eventos do calendário (READ ONLY)
   */
  @Get('calendar')
  async getCalendarEvents(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.appointmentsService.getCalendarEvents(startDate, endDate);
  }

  /**
   * GET /api/appointments/:id
   * Retorna detalhes de um appointment específico
   */
  @Get(':id')
  async getAppointment(@Param('id') id: string) {
    return this.appointmentsService.getAppointmentDetails(id);
  }
}
```

---

### **FASE 2: Frontend - Componente de Calendário**

#### **2.1 Estrutura de Arquivos**

```
frontend/src/
├── components/
│   └── calendar/
│       ├── CalendarView.tsx         (Componente principal)
│       ├── CalendarGrid.tsx         (Grade de dias)
│       ├── EventModal.tsx           (Modal de detalhes)
│       ├── SidePanel.tsx            (Painel lateral)
│       └── hooks/
│           └── useCalendarData.ts   (Hook para buscar dados)
└── services/
    └── appointments.service.ts      (API calls)
```

#### **2.2 API Service (READ ONLY)**

```typescript
// frontend/src/services/appointments.service.ts

export class AppointmentsService {
  /**
   * Busca eventos do calendário (READ ONLY)
   * NÃO faz create/update/delete de leads
   */
  async getCalendarEvents(startDate: string, endDate: string) {
    const response = await api.get('/appointments/calendar', {
      params: { startDate, endDate },
    });
    return response.data;
  }

  /**
   * Busca detalhes de um evento
   */
  async getEventDetails(eventId: string) {
    const response = await api.get(`/appointments/${eventId}`);
    return response.data;
  }
}
```

#### **2.3 Custom Hook para Dados**

```typescript
// frontend/src/components/calendar/hooks/useCalendarData.ts

export function useCalendarData(month: number, year: number) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCalendarData();
  }, [month, year]);

  async function loadCalendarData() {
    try {
      setLoading(true);
      
      // Calcular início e fim do mês
      const startDate = new Date(year, month, 1).toISOString();
      const endDate = new Date(year, month + 1, 0).toISOString();
      
      // Buscar dados (READ ONLY)
      const data = await appointmentsService.getCalendarEvents(
        startDate,
        endDate
      );
      
      setEvents(data);
    } catch (err) {
      setError(err);
      console.error('Error loading calendar data:', err);
    } finally {
      setLoading(false);
    }
  }

  return { events, loading, error, reload: loadCalendarData };
}
```

---

### **FASE 3: Integração Visual (Baseada no Mockup)**

#### **3.1 Migrar Estilo do Mockup**

**Componentes a migrar:**
- ✅ Layout de 3 colunas (Overdue | Calendar | Upcoming)
- ✅ Cards de estatísticas
- ✅ Indicadores visuais de eventos
- ✅ Sistema de tags (Warranty, Insurance, Private Pay)
- ✅ Modais de detalhes
- ✅ Badges de contagem

#### **3.2 Mapeamento de Dados Mockup → Produção**

```typescript
// Mockup tinha dados estáticos
const mockEvent = {
  customer: 'Jennifer Martinez',
  reference: '2025-1116-0001',
  warrantyCompany: 'CarShield',
};

// Produção vai buscar de Leads
const productionEvent = {
  customer: lead.name,                    // "Jennifer Martinez"
  reference: lead.referenceNumber,        // "FLIP-20251116-0001"
  insuranceProvider: lead.insuranceProvider, // "CarShield"
};
```

---

## 🔒 GARANTIAS DE SEGURANÇA

### **1. Separação de Responsabilidades**

```
✅ Módulo de Leads (EXISTENTE)
   - Cria leads
   - Atualiza leads
   - Gera referenceNumber (FLIP-YYYYMMDD-XXXX)
   - Gerencia status e prioridade

✅ Módulo de Appointments (NOVO - READ ONLY)
   - Lê leads existentes
   - Transforma em formato de calendário
   - NÃO cria ou modifica leads
```

### **2. Rotas Separadas**

```
POST   /api/leads              → LeadsController.create() ✅ INTACTO
GET    /api/leads              → LeadsController.findAll() ✅ INTACTO
PATCH  /api/leads/:id          → LeadsController.update() ✅ INTACTO

GET    /api/appointments/calendar → AppointmentsController.get() ✨ NOVO
GET    /api/appointments/:id      → AppointmentsController.get() ✨ NOVO
```

### **3. Database Permissions**

```typescript
// appointments.service.ts - SOMENTE SELECT
@InjectRepository(Lead)
private readonly leadRepository: Repository<Lead>; // READ ONLY

// NÃO tem métodos de:
// - save()
// - update()
// - delete()
// - insert()

// APENAS:
// - find()
// - findOne()
// - createQueryBuilder() para SELECT
```

### **4. TypeScript Types para Segurança**

```typescript
// Tipo específico para calendar events (READ ONLY)
export interface CalendarEvent {
  readonly id: string;
  readonly customer: string;
  readonly reference: string;
  readonly date: string;
  // ... outros campos
}

// Impede modificações acidentais
```

---

## 📝 CAMPOS NECESSÁRIOS NA TABELA LEADS

### **Campos Existentes (Já Funcionam)** ✅

```sql
-- Já existem na entidade Lead:
preferredDate          VARCHAR   -- Data do appointment
preferredTimeSlot      VARCHAR   -- Horário preferido
referenceNumber        VARCHAR   -- FLIP-YYYYMMDD-XXXX
vehicleYear            VARCHAR
vehicleMake            VARCHAR
vehicleModel           VARCHAR
insuranceProvider      VARCHAR
hasInsurance           BOOLEAN
status                 VARCHAR
priority               VARCHAR
```

### **Campos Opcionais (Se Quiser Adicionar)** 🆕

```sql
-- Futuro: Para melhor tracking de appointments
appointment_confirmed_at  TIMESTAMP  -- Quando foi confirmado
appointment_completed_at  TIMESTAMP  -- Quando foi completado
appointment_notes         TEXT       -- Notas específicas do appointment
```

**⚠️ IMPORTANTE:** Estes campos são **OPCIONAIS** e podem ser adicionados depois. O calendário funciona com os dados existentes.

---

## 🚀 PLANO DE DEPLOY (ZERO DOWNTIME)

### **Passo 1: Deploy Backend (Módulo Appointments)**

```bash
# 1. Criar branch de feature
git checkout -b feature/calendar-appointments

# 2. Adicionar novo módulo (NÃO modifica módulo de leads)
# - appointments.module.ts
# - appointments.service.ts
# - appointments.controller.ts

# 3. Registrar no app.module.ts
import { AppointmentsModule } from './modules/appointments/appointments.module';

@Module({
  imports: [
    // ... módulos existentes (INTACTOS)
    AppointmentsModule, // NOVO - não interfere com existentes
  ],
})

# 4. Build e test
npm run build
npm run test

# 5. Deploy em staging primeiro
# Testar /api/appointments/calendar

# 6. Se OK, deploy em produção
# Sistema de leads continua funcionando normalmente
```

### **Passo 2: Deploy Frontend (Componente de Calendário)**

```bash
# 1. Adicionar novo componente de calendário
# - CalendarView.tsx
# - appointmentsService.ts

# 2. Adicionar rota no admin
# /admin/calendar → CalendarView

# 3. Build e test
npm run build
npm run test

# 4. Deploy
# Componente novo não afeta funcionalidades existentes
```

### **Passo 3: Validação em Produção**

```bash
# ✅ Verificar que leads continuam sendo criados
# ✅ Verificar que referenceNumber mantém formato FLIP-YYYYMMDD-XXXX
# ✅ Verificar que calendário mostra eventos corretamente
# ✅ Verificar que tags aparecem baseadas em insurance/priority
```

---

## 🧪 TESTES DE SEGURANÇA

### **Teste 1: Lead Creation (Deve Funcionar Igual)**

```bash
# ANTES do calendário
POST /api/leads
{
  "name": "Test Customer",
  "phone": "1234567890",
  "preferredDate": "2025-11-20"
}

→ Response: { referenceNumber: "FLIP-20251116-0001" } ✅

# DEPOIS do calendário
POST /api/leads
{
  "name": "Test Customer",
  "phone": "1234567890",
  "preferredDate": "2025-11-20"
}

→ Response: { referenceNumber: "FLIP-20251116-0002" } ✅
→ Aparece no calendário automaticamente ✅
```

### **Teste 2: Calendar Read (Novo - Não Afeta Leads)**

```bash
GET /api/appointments/calendar?startDate=2025-11-01&endDate=2025-11-30

→ Response: [
  {
    "id": "...",
    "customer": "Test Customer",
    "reference": "FLIP-20251116-0001",
    "date": "2025-11-20"
  }
] ✅

# Verificar que lead original não foi modificado
GET /api/leads/[id]
→ Dados idênticos aos originais ✅
```

### **Teste 3: Tentativa de Modificação (Deve Falhar)**

```typescript
// Appointments service NÃO deve ter método update
appointmentsService.updateEvent() // ❌ Não existe

// Apenas leads service pode modificar
leadsService.update() // ✅ Continua funcionando
```

---

## 📈 MONITORAMENTO PÓS-DEPLOY

### **Métricas a Monitorar**

```
1. ✅ Taxa de criação de leads (deve permanecer igual)
2. ✅ Formato de referenceNumber (FLIP-YYYYMMDD-XXXX)
3. ✅ Performance de queries de calendário
4. ✅ Erros no console do frontend
5. ✅ Tempo de resposta de /api/appointments/calendar
```

### **Logs Importantes**

```typescript
// leads.service.ts - INTACTO
console.log('[LeadsService] Creating lead:', dto);
console.log('[LeadsService] Generated reference:', referenceNumber);

// appointments.service.ts - NOVO
console.log('[AppointmentsService] Reading calendar events:', { startDate, endDate });
console.log('[AppointmentsService] Found leads:', leads.length);
```

---

## 🎯 RESUMO EXECUTIVO

### **O Que VAI Mudar** ✨

1. **Nova rota API:** `GET /api/appointments/calendar` (leitura apenas)
2. **Novo componente:** Calendar View no frontend
3. **Nova visualização:** Leads com `preferredDate` aparecem no calendário

### **O Que NÃO VAI Mudar** 🔒

1. **Criação de leads:** Processo idêntico (site externo + admin)
2. **Formato de referência:** Continua `FLIP-YYYYMMDD-XXXX`
3. **Banco de dados:** Usa campos existentes (`preferredDate`, etc.)
4. **Rotas existentes:** `/api/leads` continua funcionando igual
5. **Validações:** Todas as validações de leads preservadas

### **Risco: ZERO** ✅

- Módulo de appointments é **separado** e **read-only**
- Não toca em código de criação de leads
- Não modifica banco de dados
- Se der erro, basta desativar o componente de calendário
- Leads continuam funcionando normalmente

---

## 📞 PRÓXIMOS PASSOS

### **Fase 1 (Semana 1): Backend**
1. Criar módulo `appointments`
2. Implementar `appointments.service.ts` (read-only)
3. Criar endpoints de API
4. Testes unitários
5. Deploy em staging

### **Fase 2 (Semana 2): Frontend**
1. Migrar estilo do mockup
2. Criar componente `CalendarView`
3. Integrar com API de appointments
4. Testes de integração
5. Deploy em staging

### **Fase 3 (Semana 3): Produção**
1. Validação final em staging
2. Deploy em produção
3. Monitoramento intensivo (48h)
4. Ajustes finos se necessário
5. Documentação final

---

**🎉 Conclusão:** O calendário será uma **camada de visualização segura** que não interfere com o sistema de leads existente. É como adicionar um **painel de controle** que mostra os dados de uma forma diferente, sem modificar os dados originais.

