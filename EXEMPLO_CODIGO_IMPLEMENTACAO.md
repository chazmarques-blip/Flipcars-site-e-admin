# 💻 EXEMPLO DE CÓDIGO - IMPLEMENTAÇÃO DO CALENDÁRIO

---

## 📁 ESTRUTURA DE ARQUIVOS

```
backend/src/modules/
├── leads/                          (EXISTENTE - NÃO MUDA)
│   ├── leads.module.ts
│   ├── leads.service.ts            ✅ INTACTO
│   └── leads.controller.ts         ✅ INTACTO
│
└── appointments/                   (NOVO - READ ONLY)
    ├── appointments.module.ts
    ├── appointments.service.ts
    ├── appointments.controller.ts
    └── dto/
        └── query-appointments.dto.ts

frontend/src/
├── components/
│   └── calendar/                   (NOVO)
│       ├── CalendarView.tsx
│       ├── CalendarGrid.tsx
│       ├── EventModal.tsx
│       └── hooks/
│           └── useCalendarData.ts
└── services/
    └── appointments.service.ts     (NOVO)
```

---

## 🔧 BACKEND IMPLEMENTATION

### **1. Appointments Module**

```typescript
// backend/src/modules/appointments/appointments.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from '@database/entities/lead.entity';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead]), // READ ONLY access to leads
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
```

---

### **2. Appointments Service (READ ONLY)** 🔒

```typescript
// backend/src/modules/appointments/appointments.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Lead, LeadStatus, LeadPriority } from '@database/entities/lead.entity';

/**
 * APPOINTMENTS SERVICE - READ ONLY
 * 
 * Este serviço APENAS lê leads existentes e os transforma
 * em formato de calendário para visualização.
 * 
 * NÃO cria, atualiza ou deleta leads.
 */

interface CalendarEvent {
  id: string;
  type: 'appointment';
  date: string;
  time: string;
  customer: string;
  phone: string;
  email: string;
  vehicle: string;
  reference: string;          // FLIP-YYYYMMDD-XXXX
  serviceCategory: 'Mechanic' | 'Body Shop';
  paymentType: 'Insurance' | 'Warranty' | 'Private Pay';
  tags: string[];
  status: string;
  originalLead: Partial<Lead>;
}

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
  ) {}

  /**
   * Busca eventos do calendário para um período específico
   * READ ONLY - Não modifica leads
   */
  async getCalendarEvents(
    startDate: string,
    endDate: string,
  ): Promise<CalendarEvent[]> {
    console.log('[AppointmentsService] Fetching calendar events', {
      startDate,
      endDate,
    });

    try {
      // Query READ ONLY - apenas SELECT
      const leads = await this.leadRepository.find({
        where: {
          preferredDate: Between(new Date(startDate), new Date(endDate)),
        },
        order: {
          preferredDate: 'ASC',
          createdAt: 'ASC',
        },
      });

      console.log(`[AppointmentsService] Found ${leads.length} leads with appointments`);

      // Transforma cada lead em CalendarEvent
      return leads.map(lead => this.transformLeadToEvent(lead));
    } catch (error) {
      console.error('[AppointmentsService] Error fetching calendar events:', error);
      throw error;
    }
  }

  /**
   * Busca eventos overdue (passados e não completados)
   * READ ONLY
   */
  async getOverdueEvents(): Promise<CalendarEvent[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const leads = await this.leadRepository.find({
      where: {
        preferredDate: LessThanOrEqual(today),
        status: Not(In([LeadStatus.CONVERTED, LeadStatus.LOST])),
      },
      order: {
        preferredDate: 'DESC',
      },
      take: 10, // Limita para performance
    });

    return leads.map(lead => this.transformLeadToEvent(lead));
  }

  /**
   * Busca eventos upcoming (próximos 30 dias)
   * READ ONLY
   */
  async getUpcomingEvents(): Promise<CalendarEvent[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const leads = await this.leadRepository.find({
      where: {
        preferredDate: Between(today, thirtyDaysFromNow),
      },
      order: {
        preferredDate: 'ASC',
      },
    });

    return leads.map(lead => this.transformLeadToEvent(lead));
  }

  /**
   * Busca detalhes de um appointment específico
   * READ ONLY
   */
  async getAppointmentDetails(id: string): Promise<CalendarEvent> {
    const lead = await this.leadRepository.findOne({
      where: { id },
    });

    if (!lead) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return this.transformLeadToEvent(lead);
  }

  /**
   * Calcula estatísticas para o dashboard
   * READ ONLY
   */
  async getStatistics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    // Total events (com appointment scheduled)
    const totalEvents = await this.leadRepository.count({
      where: {
        preferredDate: Not(IsNull()),
      },
    });

    // This week events
    const thisWeekEvents = await this.leadRepository.count({
      where: {
        preferredDate: Between(startOfWeek, endOfWeek),
      },
    });

    // Estimated revenue this week
    const thisWeekLeads = await this.leadRepository.find({
      where: {
        preferredDate: Between(startOfWeek, endOfWeek),
      },
      select: ['estimatedValue'],
    });

    const estimatedRevenue = thisWeekLeads.reduce(
      (sum, lead) => sum + (Number(lead.estimatedValue) || 0),
      0
    );

    return {
      totalEvents,
      thisWeekEvents,
      estimatedRevenue: estimatedRevenue.toFixed(2),
    };
  }

  /**
   * PRIVATE: Transforma Lead em CalendarEvent
   * CORE TRANSFORMATION LOGIC
   */
  private transformLeadToEvent(lead: Lead): CalendarEvent {
    return {
      // Core identification
      id: lead.id,
      type: 'appointment',
      
      // Date & Time (from lead's preferred fields)
      date: lead.preferredDate?.toISOString() || '',
      time: lead.preferredTimeSlot || 'Not specified',
      
      // Customer Information
      customer: lead.name,
      phone: lead.phone,
      email: lead.email || '',
      
      // Vehicle Information
      vehicle: this.formatVehicle(lead),
      
      // Reference Number (PRESERVADO DO LEAD)
      reference: lead.referenceNumber, // FLIP-YYYYMMDD-XXXX ✅
      
      // Service Classification
      serviceCategory: this.detectServiceCategory(lead),
      paymentType: this.detectPaymentType(lead),
      
      // Visual Tags
      tags: this.generateTags(lead),
      
      // Status
      status: this.mapLeadStatusToAppointment(lead.status),
      
      // Original Lead Data (for modal display)
      originalLead: {
        id: lead.id,
        referenceNumber: lead.referenceNumber, // ✅ FLIP-YYYYMMDD-XXXX
        status: lead.status,
        priority: lead.priority,
        aiQualificationScore: lead.aiQualificationScore,
        estimatedValue: lead.estimatedValue,
        notes: lead.notes,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
        hasInsurance: lead.hasInsurance,
        insuranceProvider: lead.insuranceProvider,
        claimNumber: lead.claimNumber,
        accidentDescription: lead.accidentDescription,
        isDrivable: lead.isDrivable,
        needsTow: lead.needsTow,
        needsRental: lead.needsRental,
      },
    };
  }

  /**
   * Formata informação do veículo
   */
  private formatVehicle(lead: Lead): string {
    const parts = [
      lead.vehicleYear,
      lead.vehicleMake,
      lead.vehicleModel,
    ].filter(Boolean);
    
    return parts.join(' ') || 'Vehicle not specified';
  }

  /**
   * Detecta categoria do serviço baseado em dados do lead
   */
  private detectServiceCategory(lead: Lead): 'Mechanic' | 'Body Shop' {
    // Se tem insurance E descrição de acidente, provavelmente é Body Shop
    if (lead.hasInsurance && lead.accidentDescription) {
      return 'Body Shop';
    }
    
    // Se precisa de reboque ou aluguel, também indica Body Shop
    if (lead.needsTow || lead.needsRental) {
      return 'Body Shop';
    }
    
    // Default: Mechanic
    return 'Mechanic';
  }

  /**
   * Detecta tipo de pagamento
   */
  private detectPaymentType(lead: Lead): 'Insurance' | 'Warranty' | 'Private Pay' {
    // Se tem insurance provider, é Insurance
    if (lead.hasInsurance && lead.insuranceProvider) {
      return 'Insurance';
    }
    
    // TODO: Adicionar lógica para warranty quando campo existir
    // if (lead.hasWarranty && lead.warrantyCompany) {
    //   return 'Warranty';
    // }
    
    // Default: Private Pay
    return 'Private Pay';
  }

  /**
   * Gera tags visuais para o calendário
   */
  private generateTags(lead: Lead): string[] {
    const tags: string[] = [];
    
    // Insurance/Warranty tag
    if (lead.insuranceProvider) {
      tags.push(`🏢 ${lead.insuranceProvider}`);
    }
    
    // TODO: Add warranty tag when field exists
    // if (lead.warrantyCompany) {
    //   tags.push(`🛡️ ${lead.warrantyCompany}`);
    // }
    
    // Private Pay tag
    if (!lead.hasInsurance && !lead.insuranceProvider) {
      tags.push('💳 Private Pay');
    }
    
    // Priority tag
    if (lead.priority === LeadPriority.HIGH) {
      tags.push('⚠️ High Priority');
    }
    
    // AI Qualification tag
    if (lead.aiQualificationScore) {
      if (lead.aiQualificationScore >= 70) {
        tags.push(`✅ Qualified (${lead.aiQualificationScore}%)`);
      } else if (lead.aiQualificationScore < 40) {
        tags.push(`⚠️ Low Score (${lead.aiQualificationScore}%)`);
      }
    }
    
    // Confirmed tag
    if (lead.status === LeadStatus.QUALIFIED_AI || lead.status === LeadStatus.HUMAN_CONTACTED) {
      tags.push('✅ Confirmed');
    }
    
    return tags;
  }

  /**
   * Mapeia status do lead para status de appointment
   */
  private mapLeadStatusToAppointment(leadStatus: LeadStatus): string {
    const statusMap: Record<LeadStatus, string> = {
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

---

### **3. Appointments Controller**

```typescript
// backend/src/modules/appointments/appointments.controller.ts

import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppointmentsService } from './appointments.service';

/**
 * APPOINTMENTS CONTROLLER - READ ONLY
 * 
 * Apenas endpoints GET para visualização
 * NÃO tem POST, PATCH, DELETE
 */

@Controller('appointments')
@UseGuards(JwtAuthGuard) // Requer autenticação
export class AppointmentsController {
  constructor(
    private readonly appointmentsService: AppointmentsService,
  ) {}

  /**
   * GET /api/appointments/calendar
   * Busca eventos do calendário para um período
   */
  @Get('calendar')
  async getCalendarEvents(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    console.log('[AppointmentsController] GET /calendar', {
      startDate,
      endDate,
    });

    return this.appointmentsService.getCalendarEvents(startDate, endDate);
  }

  /**
   * GET /api/appointments/overdue
   * Busca eventos atrasados
   */
  @Get('overdue')
  async getOverdueEvents() {
    console.log('[AppointmentsController] GET /overdue');
    return this.appointmentsService.getOverdueEvents();
  }

  /**
   * GET /api/appointments/upcoming
   * Busca próximos eventos (30 dias)
   */
  @Get('upcoming')
  async getUpcomingEvents() {
    console.log('[AppointmentsController] GET /upcoming');
    return this.appointmentsService.getUpcomingEvents();
  }

  /**
   * GET /api/appointments/statistics
   * Busca estatísticas do dashboard
   */
  @Get('statistics')
  async getStatistics() {
    console.log('[AppointmentsController] GET /statistics');
    return this.appointmentsService.getStatistics();
  }

  /**
   * GET /api/appointments/:id
   * Busca detalhes de um appointment específico
   */
  @Get(':id')
  async getAppointmentDetails(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    console.log('[AppointmentsController] GET /:id', { id });
    return this.appointmentsService.getAppointmentDetails(id);
  }
}
```

---

### **4. DTO para Query**

```typescript
// backend/src/modules/appointments/dto/query-appointments.dto.ts

import { IsDateString, IsOptional } from 'class-validator';

export class QueryAppointmentsDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
```

---

### **5. Registrar Módulo no App**

```typescript
// backend/src/app.module.ts

import { Module } from '@nestjs/common';
import { LeadsModule } from './modules/leads/leads.module';
import { AppointmentsModule } from './modules/appointments/appointments.module'; // NOVO

@Module({
  imports: [
    // ... outros módulos existentes (INTACTOS)
    LeadsModule,        // ✅ INTACTO
    AppointmentsModule, // ✨ NOVO - não interfere com existentes
  ],
})
export class AppModule {}
```

---

## 🎨 FRONTEND IMPLEMENTATION

### **1. Appointments Service**

```typescript
// frontend/src/services/appointments.service.ts

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface CalendarEvent {
  id: string;
  type: 'appointment';
  date: string;
  time: string;
  customer: string;
  phone: string;
  email: string;
  vehicle: string;
  reference: string; // FLIP-YYYYMMDD-XXXX
  serviceCategory: 'Mechanic' | 'Body Shop';
  paymentType: 'Insurance' | 'Warranty' | 'Private Pay';
  tags: string[];
  status: string;
  originalLead: any;
}

export class AppointmentsService {
  private api = axios.create({
    baseURL: `${API_BASE_URL}/appointments`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  /**
   * Adiciona token de autenticação
   */
  setAuthToken(token: string) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Busca eventos do calendário (READ ONLY)
   */
  async getCalendarEvents(
    startDate: string,
    endDate: string,
  ): Promise<CalendarEvent[]> {
    try {
      const response = await this.api.get('/calendar', {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  }

  /**
   * Busca eventos overdue
   */
  async getOverdueEvents(): Promise<CalendarEvent[]> {
    try {
      const response = await this.api.get('/overdue');
      return response.data;
    } catch (error) {
      console.error('Error fetching overdue events:', error);
      throw error;
    }
  }

  /**
   * Busca eventos upcoming
   */
  async getUpcomingEvents(): Promise<CalendarEvent[]> {
    try {
      const response = await this.api.get('/upcoming');
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      throw error;
    }
  }

  /**
   * Busca estatísticas
   */
  async getStatistics() {
    try {
      const response = await this.api.get('/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }

  /**
   * Busca detalhes de um evento
   */
  async getEventDetails(id: string): Promise<CalendarEvent> {
    try {
      const response = await this.api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching event details:', error);
      throw error;
    }
  }
}

// Singleton instance
export const appointmentsService = new AppointmentsService();
```

---

### **2. Custom Hook**

```typescript
// frontend/src/components/calendar/hooks/useCalendarData.ts

import { useState, useEffect } from 'react';
import { appointmentsService, CalendarEvent } from '@/services/appointments.service';

export function useCalendarData(month: number, year: number) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadCalendarData();
  }, [month, year]);

  async function loadCalendarData() {
    try {
      setLoading(true);
      setError(null);
      
      // Calcular início e fim do mês
      const startDate = new Date(year, month, 1).toISOString();
      const endDate = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
      
      console.log('Loading calendar data:', { startDate, endDate });
      
      // Buscar dados (READ ONLY)
      const data = await appointmentsService.getCalendarEvents(
        startDate,
        endDate
      );
      
      console.log(`Loaded ${data.length} events`);
      setEvents(data);
    } catch (err) {
      console.error('Error loading calendar data:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  return {
    events,
    loading,
    error,
    reload: loadCalendarData,
  };
}
```

---

### **3. CalendarView Component (Simplified)**

```typescript
// frontend/src/components/calendar/CalendarView.tsx

import React, { useState } from 'react';
import { useCalendarData } from './hooks/useCalendarData';

export function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const { events, loading, error } = useCalendarData(currentMonth, currentYear);

  if (loading) {
    return <div>Loading calendar...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="calendar-container">
      <h1>Calendar - {currentMonth + 1}/{currentYear}</h1>
      
      <div className="events-list">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <h3>{event.customer}</h3>
            <p>Reference: {event.reference}</p> {/* FLIP-YYYYMMDD-XXXX */}
            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
            <p>Time: {event.time}</p>
            <p>Vehicle: {event.vehicle}</p>
            <div className="tags">
              {event.tags.map((tag, i) => (
                <span key={i} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## ✅ VALIDAÇÃO DO SISTEMA

### **Teste 1: Verificar que Lead Creation Funciona**

```bash
# Criar lead normalmente
curl -X POST http://localhost:3001/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Customer",
    "phone": "1234567890",
    "preferredDate": "2025-11-20",
    "preferredTimeSlot": "10:00-12:00"
  }'

# Resposta esperada:
# {
#   "id": "uuid-abc",
#   "referenceNumber": "FLIP-20251116-0001",  ✅ FORMATO CORRETO
#   ...
# }
```

### **Teste 2: Verificar que Aparece no Calendário**

```bash
# Buscar eventos do calendário
curl http://localhost:3001/api/appointments/calendar \
  ?startDate=2025-11-01 \
  &endDate=2025-11-30

# Resposta esperada:
# [
#   {
#     "id": "uuid-abc",
#     "reference": "FLIP-20251116-0001",  ✅ MESMO REFERENCE
#     "customer": "Test Customer",
#     "date": "2025-11-20",
#     ...
#   }
# ]
```

### **Teste 3: Verificar que Lead Não Foi Modificado**

```bash
# Buscar lead original
curl http://localhost:3001/api/leads/uuid-abc

# Resposta deve ser IDÊNTICA ao criado
# Nenhuma modificação feita pelo appointments module
```

---

**✅ RESULTADO:** Sistema de calendário implementado com segurança, sem modificar a criação ou formatação de leads!
