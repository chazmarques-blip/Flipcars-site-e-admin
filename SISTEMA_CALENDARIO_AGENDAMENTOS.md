# 📅 Sistema de Calendário de Agendamentos - Especificação Completa

## 🎯 Objetivo

Criar um sistema de calendário no admin dashboard que seja automaticamente alimentado pelos agendamentos feitos pelos clientes no formulário público.

---

## 📋 Requisitos Funcionais

### Dados do Agendamento

**Origem:** Formulário público (Step 2 + Step 4)

**Campos Capturados:**
1. **preferredDate** - Data escolhida (formato: YYYY-MM-DD)
2. **preferredTimeSlot** - Horário escolhido (ex: "9:00-11:00")
3. **contactPreferences** - Como contatar (phoneCall, whatsapp, textMessage)

**Dados do Cliente (do Lead):**
1. **firstName** - Nome
2. **lastName** - Sobrenome
3. **phone** - Telefone
4. **email** - Email
5. **serviceType** - Tipo de serviço (bodyshop ou mechanic)
6. **insuranceCompany** ou **warrantyCompany** - Quem paga

---

## 🗄️ Estrutura do Banco de Dados

### Nova Tabela: `appointments`

```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relacionamento com lead
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  
  -- Data e horário
  appointment_date DATE NOT NULL,
  appointment_time_slot VARCHAR(20) NOT NULL, -- "9:00-11:00"
  appointment_start_time TIME, -- Calculado: 09:00:00
  appointment_end_time TIME,   -- Calculado: 11:00:00
  
  -- Status do agendamento
  status VARCHAR(20) DEFAULT 'scheduled',
  -- Valores possíveis:
  -- 'scheduled' - Agendado (padrão)
  -- 'confirmed' - Confirmado pelo admin
  -- 'completed' - Serviço realizado
  -- 'cancelled' - Cancelado
  -- 'no_show' - Cliente não compareceu
  -- 'rescheduled' - Reagendado
  
  -- Preferências de contato (array)
  contact_preferences JSONB,
  -- Exemplo: {"phoneCall": true, "whatsapp": true, "textMessage": false}
  
  -- Notas administrativas
  admin_notes TEXT,
  
  -- Confirmação
  confirmed_at TIMESTAMP,
  confirmed_by UUID REFERENCES users(id),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Índices
  CONSTRAINT unique_lead_appointment UNIQUE(lead_id)
);

-- Índices para performance
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_lead ON appointments(lead_id);
CREATE INDEX idx_appointments_date_status ON appointments(appointment_date, status);
```

---

## 🔧 Backend - NestJS

### 1. Entity: `appointment.entity.ts`

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Lead } from '../leads/lead.entity';
import { User } from '../users/user.entity';

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled',
}

export interface ContactPreferences {
  phoneCall?: boolean;
  whatsapp?: boolean;
  textMessage?: boolean;
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relacionamento com Lead
  @ManyToOne(() => Lead, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lead_id' })
  lead: Lead;

  @Column({ name: 'lead_id' })
  leadId: string;

  // Data e Horário
  @Column({ type: 'date', name: 'appointment_date' })
  appointmentDate: string; // YYYY-MM-DD

  @Column({ name: 'appointment_time_slot', length: 20 })
  appointmentTimeSlot: string; // "9:00-11:00"

  @Column({ type: 'time', name: 'appointment_start_time', nullable: true })
  appointmentStartTime: string; // "09:00:00"

  @Column({ type: 'time', name: 'appointment_end_time', nullable: true })
  appointmentEndTime: string; // "11:00:00"

  // Status
  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  // Preferências de Contato
  @Column({ type: 'jsonb', name: 'contact_preferences', nullable: true })
  contactPreferences: ContactPreferences;

  // Notas
  @Column({ type: 'text', name: 'admin_notes', nullable: true })
  adminNotes: string;

  // Confirmação
  @Column({ type: 'timestamp', name: 'confirmed_at', nullable: true })
  confirmedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'confirmed_by' })
  confirmedBy: User;

  @Column({ name: 'confirmed_by', nullable: true })
  confirmedById: string;

  // Timestamps
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

---

### 2. DTOs

**create-appointment.dto.ts:**
```typescript
import {
  IsString,
  IsUUID,
  IsDateString,
  IsOptional,
  IsObject,
  IsEnum,
} from 'class-validator';
import { AppointmentStatus } from '../appointment.entity';

export class CreateAppointmentDto {
  @IsUUID()
  leadId: string;

  @IsDateString()
  appointmentDate: string; // YYYY-MM-DD

  @IsString()
  appointmentTimeSlot: string; // "9:00-11:00"

  @IsObject()
  @IsOptional()
  contactPreferences?: {
    phoneCall?: boolean;
    whatsapp?: boolean;
    textMessage?: boolean;
  };

  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;
}
```

**update-appointment.dto.ts:**
```typescript
import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsString, IsOptional } from 'class-validator';
import { AppointmentStatus } from '../appointment.entity';
import { CreateAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;

  @IsString()
  @IsOptional()
  adminNotes?: string;
}
```

---

### 3. Service: `appointments.service.ts`

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment, AppointmentStatus } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  // Criar agendamento
  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    // Parse time slot (ex: "9:00-11:00")
    const [startTime, endTime] = this.parseTimeSlot(
      createAppointmentDto.appointmentTimeSlot,
    );

    const appointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      appointmentStartTime: startTime,
      appointmentEndTime: endTime,
    });

    return this.appointmentRepository.save(appointment);
  }

  // Buscar todos agendamentos
  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      relations: ['lead'],
      order: { appointmentDate: 'ASC', appointmentStartTime: 'ASC' },
    });
  }

  // Buscar por ID
  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['lead'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment ${id} not found`);
    }

    return appointment;
  }

  // Buscar por lead
  async findByLead(leadId: string): Promise<Appointment | null> {
    return this.appointmentRepository.findOne({
      where: { leadId },
      relations: ['lead'],
    });
  }

  // Buscar por data
  async findByDateRange(startDate: string, endDate: string): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: {
        appointmentDate: Between(startDate, endDate),
      },
      relations: ['lead'],
      order: { appointmentDate: 'ASC', appointmentStartTime: 'ASC' },
    });
  }

  // Buscar por mês
  async findByMonth(year: number, month: number): Promise<Appointment[]> {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

    return this.findByDateRange(startDate, endDate);
  }

  // Atualizar
  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
    userId?: string,
  ): Promise<Appointment> {
    const appointment = await this.findOne(id);

    // Se status mudou para 'confirmed', registrar
    if (
      updateAppointmentDto.status === AppointmentStatus.CONFIRMED &&
      !appointment.confirmedAt
    ) {
      appointment.confirmedAt = new Date();
      appointment.confirmedById = userId;
    }

    // Parse time slot se foi alterado
    if (updateAppointmentDto.appointmentTimeSlot) {
      const [startTime, endTime] = this.parseTimeSlot(
        updateAppointmentDto.appointmentTimeSlot,
      );
      appointment.appointmentStartTime = startTime;
      appointment.appointmentEndTime = endTime;
    }

    Object.assign(appointment, updateAppointmentDto);
    return this.appointmentRepository.save(appointment);
  }

  // Deletar
  async remove(id: string): Promise<void> {
    const appointment = await this.findOne(id);
    await this.appointmentRepository.remove(appointment);
  }

  // Helper: Parse time slot
  private parseTimeSlot(timeSlot: string): [string, string] {
    // Ex: "9:00-11:00" → ["09:00:00", "11:00:00"]
    const [start, end] = timeSlot.split('-');
    return [
      start.trim().padStart(5, '0') + ':00',
      end.trim().padStart(5, '0') + ':00',
    ];
  }

  // Stats
  async getStats(startDate?: string, endDate?: string) {
    let query = this.appointmentRepository.createQueryBuilder('appointment');

    if (startDate && endDate) {
      query = query.where('appointment.appointmentDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const total = await query.getCount();

    const byStatus = await query
      .select('appointment.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('appointment.status')
      .getRawMany();

    return {
      total,
      byStatus: byStatus.reduce((acc, { status, count }) => {
        acc[status] = parseInt(count);
        return acc;
      }, {}),
    };
  }
}
```

---

### 4. Controller: `appointments.controller.ts`

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get('stats')
  getStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.appointmentsService.getStats(startDate, endDate);
  }

  @Get('month/:year/:month')
  findByMonth(@Param('year') year: number, @Param('month') month: number) {
    return this.appointmentsService.findByMonth(year, month);
  }

  @Get('lead/:leadId')
  findByLead(@Param('leadId') leadId: string) {
    return this.appointmentsService.findByLead(leadId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @Request() req,
  ) {
    return this.appointmentsService.update(
      id,
      updateAppointmentDto,
      req.user?.userId,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}
```

---

### 5. Auto-criar Appointment ao Criar Lead

**Modificar: `leads.service.ts` ou `public-leads.controller.ts`**

```typescript
// No método create() do LeadsService

async create(createLeadDto: CreateLeadDto): Promise<Lead> {
  const lead = this.leadRepository.create(createLeadDto);
  
  // Gerar reference number
  lead.referenceNumber = await this.generateReferenceNumber();
  
  // Salvar lead
  const savedLead = await this.leadRepository.save(lead);
  
  // AUTO-CRIAR APPOINTMENT se tiver preferredDate
  if (createLeadDto.preferredDate && createLeadDto.preferredTimeSlot) {
    try {
      await this.appointmentsService.create({
        leadId: savedLead.id,
        appointmentDate: createLeadDto.preferredDate,
        appointmentTimeSlot: createLeadDto.preferredTimeSlot,
        contactPreferences: createLeadDto.contactPreferences,
      });
      
      console.log(`✅ Appointment auto-created for lead ${savedLead.referenceNumber}`);
    } catch (error) {
      // Log erro mas não falha a criação do lead
      console.error('❌ Failed to auto-create appointment:', error);
    }
  }
  
  return savedLead;
}
```

---

## 🎨 Frontend - Admin Dashboard

### 1. Instalar Biblioteca de Calendário

```bash
cd frontend-admin
npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
npm install @fullcalendar/core
```

---

### 2. Service: `appointments.service.ts`

```typescript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Appointment {
  id: string;
  leadId: string;
  appointmentDate: string;
  appointmentTimeSlot: string;
  appointmentStartTime: string;
  appointmentEndTime: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';
  contactPreferences?: {
    phoneCall?: boolean;
    whatsapp?: boolean;
    textMessage?: boolean;
  };
  adminNotes?: string;
  lead: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    serviceType: string;
    insuranceCompany?: string;
    warrantyCompany?: string;
  };
  createdAt: string;
  updatedAt: string;
}

class AppointmentsService {
  private getAuthHeader() {
    const token = localStorage.getItem('access_token');
    return { Authorization: `Bearer ${token}` };
  }

  async getAll(): Promise<Appointment[]> {
    const response = await axios.get(`${API_URL}/appointments`, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  async getByMonth(year: number, month: number): Promise<Appointment[]> {
    const response = await axios.get(`${API_URL}/appointments/month/${year}/${month}`, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  async getById(id: string): Promise<Appointment> {
    const response = await axios.get(`${API_URL}/appointments/${id}`, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  async update(id: string, data: Partial<Appointment>): Promise<Appointment> {
    const response = await axios.patch(`${API_URL}/appointments/${id}`, data, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/appointments/${id}`, {
      headers: this.getAuthHeader(),
    });
  }

  async getStats(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await axios.get(`${API_URL}/appointments/stats?${params}`, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }
}

export const appointmentsService = new AppointmentsService();
```

---

### 3. Componente: `AppointmentsCalendar.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { appointmentsService, Appointment } from '@/lib/api/appointments.service';

export default function AppointmentsCalendar() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await appointmentsService.getAll();
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Converter appointments para eventos do FullCalendar
  const events = appointments.map(apt => ({
    id: apt.id,
    title: `${apt.lead.firstName} ${apt.lead.lastName}`,
    start: `${apt.appointmentDate}T${apt.appointmentStartTime}`,
    end: `${apt.appointmentDate}T${apt.appointmentEndTime}`,
    backgroundColor: getStatusColor(apt.status),
    borderColor: getStatusColor(apt.status),
    extendedProps: {
      phone: apt.lead.phone,
      serviceType: apt.lead.serviceType,
      status: apt.status,
      contactPreferences: apt.contactPreferences,
    },
  }));

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: '#FFA500',    // Orange
      confirmed: '#4CAF50',    // Green
      completed: '#2196F3',    // Blue
      cancelled: '#F44336',    // Red
      no_show: '#9E9E9E',      // Gray
      rescheduled: '#FF9800',  // Amber
    };
    return colors[status] || '#757575';
  };

  const handleEventClick = async (info: any) => {
    const appointment = appointments.find(apt => apt.id === info.event.id);
    if (appointment) {
      setSelectedAppointment(appointment);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Appointments Calendar</h1>
        <p className="text-gray-600">Manage customer appointments and schedules</p>
      </div>

      {/* Legend */}
      <div className="mb-4 flex gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FFA500' }}></div>
          <span className="text-sm">Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#4CAF50' }}></div>
          <span className="text-sm">Confirmed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#2196F3' }}></div>
          <span className="text-sm">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#F44336' }}></div>
          <span className="text-sm">Cancelled</span>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={events}
          eventClick={handleEventClick}
          height="auto"
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5, 6], // Monday - Saturday
            startTime: '09:00',
            endTime: '18:00',
          }}
          slotMinTime="09:00:00"
          slotMaxTime="18:00:00"
          weekends={true}
        />
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onUpdate={loadAppointments}
        />
      )}
    </div>
  );
}

function getStatusColor(status: string): string {
  // Implementation
  return '#000000';
}
```

---

### 4. Página: `/appointments/page.tsx`

```typescript
import AppointmentsCalendar from '@/components/appointments/AppointmentsCalendar';

export default function AppointmentsPage() {
  return <AppointmentsCalendar />;
}
```

---

## 📊 Fluxo Completo

### 1. Cliente Submete Formulário
```
1. Cliente preenche Step 1 (nome, email, phone)
2. Cliente preenche Step 2 (empresa, data, horário)
3. Cliente preenche Step 4 (preferências contato)
4. Cliente submete formulário
```

### 2. Backend Processa
```
5. Backend cria Lead
6. Backend gera referenceNumber (FLIP-YYYYMMDD-XXXX)
7. Backend AUTO-CRIA Appointment
   - leadId = lead.id
   - appointmentDate = preferredDate
   - appointmentTimeSlot = preferredTimeSlot
   - contactPreferences = contactPreferences
   - status = 'scheduled'
```

### 3. Admin Visualiza
```
8. Admin acessa /appointments
9. Calendar mostra agendamento
10. Admin clica no evento
11. Modal mostra:
    - Nome: John Doe
    - Telefone: (321) 960-8661
    - Serviço: Body Shop
    - Data: 2025-11-15
    - Horário: 9:00-11:00
    - Status: Scheduled
    - Contato: Phone Call, WhatsApp
12. Admin pode:
    - Confirmar agendamento
    - Adicionar notas
    - Cancelar/Reagendar
    - Marcar como completado
```

---

## 🎯 Próximos Passos

1. Criar migration do banco
2. Criar entity/service/controller
3. Integrar com leads service
4. Instalar FullCalendar
5. Criar componente calendario
6. Criar página /appointments
7. Testar fluxo completo

---

**Status:** Especificação completa  
**Pronto para:** Implementação
