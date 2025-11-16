# 🎨 PLANO DE IMPLEMENTAÇÃO - Substituir Layout por Mockup

**Data:** 16 de Novembro, 2025  
**Objetivo:** Substituir FullCalendar atual pelo design do mockup  
**Tempo:** 1 semana (5 dias úteis)  
**Risco:** BAIXO ✅

---

## 📸 LAYOUT ATUAL vs MOCKUP

### **ATUAL (FullCalendar):**
```
┌─────────────────────────────────────────────┐
│  Appointments Calendar                      │
│  [<] [>] [today]            [month][week]   │
├─────────────────────────────────────────────┤
│                                              │
│  Sun  Mon  Tue  Wed  Thu  Fri  Sat          │
│                                              │
│   1    2    3    4    5    6    7           │
│   8    9   10   11   12   13   14           │
│  15   16   17   18   19   20   21           │
│  22   23   24   25   26   27   28           │
│                                              │
└─────────────────────────────────────────────┘

❌ Sem painéis laterais
❌ Sem estatísticas
❌ Sem tags visuais
❌ Sem badges coloridos
```

### **MOCKUP (Nosso Design):**
```
┌────────────────────────────────────────────────────────────┐
│  📊 Statistics Cards                                       │
│  [11 Total] [8 This Week] [$6.7K Revenue]                 │
├───────────┬──────────────────────────┬───────────────────┤
│ OVERDUE   │     CALENDAR             │   UPCOMING        │
│           │                          │                   │
│ Nov 10    │  November 2025           │ Nov 20            │
│ John Doe  │  ┌──┬──┬──┬──┬──┬──┬──┐ │ Jane Smith        │
│ 🏢 State │  │  │  │● │  │  │  │  │ │ 🛡️ Warranty      │
│ Farm      │  │  │  │  │  │  │  │  │ │ 10:00-12:00       │
│ Overdue!  │  └──┴──┴──┴──┴──┴──┴──┘ │ FLIP-xxx-0002     │
│           │                          │                   │
└───────────┴──────────────────────────┴───────────────────┘

✅ 3 colunas: Overdue | Calendar | Upcoming
✅ Estatísticas no topo
✅ Tags visuais (🏢 Insurance, 🛡️ Warranty, 💳 Private)
✅ Badges coloridos por status
✅ Reference numbers (FLIP-YYYYMMDD-XXXX)
✅ Preview rápido de clientes
```

---

## 🔧 IMPLEMENTAÇÃO PASSO A PASSO

### **DIA 1: Backend - Enriquecer API Response**

#### **1.1 Modificar `appointments.service.ts`**

**Localização:** `backend/src/modules/appointments/appointments.service.ts`

**Modificação:** Adicionar mais campos do Lead no response

```typescript
// ANTES (linha 39-43):
async findAll(): Promise<Appointment[]> {
  return this.appointmentRepository.find({
    relations: ['lead'],
    order: { appointmentDate: 'ASC', appointmentStartTime: 'ASC' },
  });
}

// DEPOIS:
async findAll(): Promise<Appointment[]> {
  return this.appointmentRepository.find({
    relations: ['lead'],
    select: {
      // Campos do appointment (todos)
      id: true,
      leadId: true,
      appointmentDate: true,
      appointmentTimeSlot: true,
      appointmentStartTime: true,
      appointmentEndTime: true,
      status: true,
      contactPreferences: true,
      adminNotes: true,
      confirmedAt: true,
      createdAt: true,
      updatedAt: true,
      
      // Campos do lead (adicionar mais)
      lead: {
        id: true,
        referenceNumber: true,        // ✅ Já tem
        name: true,                    // ✅ Já tem
        email: true,                   // ✅ Já tem
        phone: true,                   // ✅ Já tem
        
        // ADICIONAR ESTES:
        vehicleYear: true,             // 🆕 Para mostrar "2021 Honda Accord"
        vehicleMake: true,             // 🆕
        vehicleModel: true,            // 🆕
        hasInsurance: true,            // 🆕 Para tag Insurance
        insuranceProvider: true,       // 🆕 Para tag "State Farm"
        priority: true,                // 🆕 Para badge "High Priority"
        status: true,                  // 🆕 Para saber status do lead
        estimatedValue: true,          // 🆕 Para estatísticas
      },
    },
    order: { appointmentDate: 'ASC', appointmentStartTime: 'ASC' },
  });
}
```

**Fazer o mesmo para:**
- `findOne(id)` - linha 47-56
- `findByDateRange(startDate, endDate)` - linha 69-77
- `findByMonth(year, month)` - linha 80-86

#### **1.2 Adicionar Método para Estatísticas Enriquecidas**

**Adicionar ao final do `appointments.service.ts`:**

```typescript
/**
 * Get enriched statistics for dashboard
 */
async getEnrichedStats() {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // Total appointments
  const total = await this.appointmentRepository.count();

  // This week appointments
  const thisWeek = await this.appointmentRepository.count({
    where: {
      appointmentDate: Between(
        startOfWeek.toISOString().split('T')[0],
        endOfWeek.toISOString().split('T')[0]
      ),
    },
  });

  // Estimated revenue (this week)
  const thisWeekAppointments = await this.appointmentRepository.find({
    where: {
      appointmentDate: Between(
        startOfWeek.toISOString().split('T')[0],
        endOfWeek.toISOString().split('T')[0]
      ),
    },
    relations: ['lead'],
    select: {
      lead: {
        estimatedValue: true,
      },
    },
  });

  const estimatedRevenue = thisWeekAppointments.reduce(
    (sum, apt) => sum + (Number(apt.lead?.estimatedValue) || 0),
    0
  );

  return {
    total,
    thisWeek,
    estimatedRevenue: estimatedRevenue.toFixed(2),
    formattedRevenue: `$${(estimatedRevenue / 1000).toFixed(1)}K`,
  };
}
```

#### **1.3 Adicionar Endpoint no Controller**

**Localização:** `backend/src/modules/appointments/appointments.controller.ts`

**Adicionar:**

```typescript
@Get('dashboard/stats')
getDashboardStats() {
  return this.appointmentsService.getEnrichedStats();
}
```

**Testar:**
```bash
curl http://localhost:3001/api/appointments/dashboard/stats

# Resposta esperada:
{
  "total": 11,
  "thisWeek": 8,
  "estimatedRevenue": "6700.00",
  "formattedRevenue": "$6.7K"
}
```

---

### **DIA 2-3: Frontend - Criar Componentes do Mockup**

#### **2.1 Estrutura de Arquivos**

```
frontend-admin/src/
├── app/dashboard/appointments/
│   └── page.tsx (modificar - layout 3 colunas)
│
├── components/appointments/
│   ├── AppointmentsCalendar.tsx (remover FullCalendar)
│   ├── AppointmentDetailsModal.tsx (melhorar)
│   │
│   ├── CalendarMockup/ (NOVO)
│   │   ├── CalendarGrid.tsx         (grade do calendário)
│   │   ├── CalendarSidebar.tsx      (overdue + upcoming)
│   │   ├── CalendarStats.tsx        (cards estatísticas)
│   │   ├── EventItem.tsx            (item de evento)
│   │   └── EventBadge.tsx           (badges e tags)
│   │
│   └── styles/
│       └── calendar-mockup.css (NOVO - estilos do mockup)
```

#### **2.2 CalendarStats.tsx** (Cards de Estatísticas)

**Criar:** `frontend-admin/src/components/appointments/CalendarMockup/CalendarStats.tsx`

```tsx
'use client';

import { useEffect, useState } from 'react';
import { appointmentsService } from '@/lib/api/appointments.service';

interface Stats {
  total: number;
  thisWeek: number;
  formattedRevenue: string;
}

export function CalendarStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const data = await appointmentsService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="stats-loading">Loading stats...</div>;
  }

  return (
    <div className="calendar-stats">
      <div className="stat-card">
        <div className="stat-label">Total Events</div>
        <div className="stat-value">{stats?.total || 0}</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-label">This Week</div>
        <div className="stat-value">{stats?.thisWeek || 0}</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-label">Estimated Revenue</div>
        <div className="stat-value">{stats?.formattedRevenue || '$0K'}</div>
      </div>
    </div>
  );
}
```

#### **2.3 EventBadge.tsx** (Tags Visuais)

**Criar:** `frontend-admin/src/components/appointments/CalendarMockup/EventBadge.tsx`

```tsx
interface Lead {
  hasInsurance?: boolean;
  insuranceProvider?: string;
  priority?: string;
}

interface EventBadgeProps {
  lead: Lead;
  status: string;
}

export function EventBadge({ lead, status }: EventBadgeProps) {
  const tags: string[] = [];

  // Insurance/Private Pay tag
  if (lead.hasInsurance && lead.insuranceProvider) {
    tags.push(`🏢 ${lead.insuranceProvider}`);
  } else if (lead.hasInsurance === false) {
    tags.push('💳 Private Pay');
  }

  // Priority tag
  if (lead.priority === 'high') {
    tags.push('⚠️ High Priority');
  }

  // Status tag
  if (status === 'confirmed') {
    tags.push('✅ Confirmed');
  }

  return (
    <div className="event-tags">
      {tags.map((tag, index) => (
        <span 
          key={index} 
          className={`tag ${getTagClass(tag)}`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function getTagClass(tag: string): string {
  if (tag.includes('Insurance') || tag.includes('🏢')) return 'tag-insurance';
  if (tag.includes('Warranty') || tag.includes('🛡️')) return 'tag-warranty';
  if (tag.includes('Private') || tag.includes('💳')) return 'tag-private';
  if (tag.includes('High Priority')) return 'tag-priority';
  if (tag.includes('Confirmed')) return 'tag-confirmed';
  return 'tag-default';
}
```

#### **2.4 CalendarGrid.tsx** (Grade do Calendário)

**Criar:** `frontend-admin/src/components/appointments/CalendarMockup/CalendarGrid.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import { Appointment } from '@/lib/api/appointments.service';

interface CalendarGridProps {
  appointments: Appointment[];
  currentMonth: number;
  currentYear: number;
  onDateClick: (date: string) => void;
}

export function CalendarGrid({ 
  appointments, 
  currentMonth, 
  currentYear,
  onDateClick 
}: CalendarGridProps) {
  const [days, setDays] = useState<Date[]>([]);

  useEffect(() => {
    generateCalendarDays();
  }, [currentMonth, currentYear]);

  function generateCalendarDays() {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    
    const daysArray: Date[] = [];
    
    // Previous month days
    for (let i = 0; i < startingDayOfWeek; i++) {
      const day = new Date(currentYear, currentMonth, -startingDayOfWeek + i + 1);
      daysArray.push(day);
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      daysArray.push(new Date(currentYear, currentMonth, i));
    }
    
    // Next month days (to complete grid)
    const remainingDays = 42 - daysArray.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      daysArray.push(new Date(currentYear, currentMonth + 1, i));
    }
    
    setDays(daysArray);
  }

  function getAppointmentsForDate(date: Date): Appointment[] {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.appointmentDate === dateStr);
  }

  function isCurrentMonth(date: Date): boolean {
    return date.getMonth() === currentMonth;
  }

  function isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  return (
    <div className="calendar-grid">
      {/* Header - Days of week */}
      <div className="calendar-header">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-header-day">{day}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="calendar-days">
        {days.map((day, index) => {
          const dayAppointments = getAppointmentsForDate(day);
          const hasAppointments = dayAppointments.length > 0;

          return (
            <div
              key={index}
              className={`
                calendar-day
                ${!isCurrentMonth(day) ? 'other-month' : ''}
                ${isToday(day) ? 'today' : ''}
                ${hasAppointments ? 'has-events' : ''}
              `}
              onClick={() => hasAppointments && onDateClick(day.toISOString().split('T')[0])}
            >
              <div className="day-number">{day.getDate()}</div>
              
              {hasAppointments && (
                <>
                  <div className="day-events">
                    {dayAppointments.slice(0, 3).map(apt => (
                      <div 
                        key={apt.id} 
                        className={`event-indicator ${apt.status}`}
                      />
                    ))}
                  </div>
                  <span className="event-badge">{dayAppointments.length}</span>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

#### **2.5 CalendarSidebar.tsx** (Overdue + Upcoming)

**Criar:** `frontend-admin/src/components/appointments/CalendarMockup/CalendarSidebar.tsx`

```tsx
'use client';

import { Appointment } from '@/lib/api/appointments.service';
import { EventBadge } from './EventBadge';

interface CalendarSidebarProps {
  appointments: Appointment[];
  type: 'overdue' | 'upcoming';
  onEventClick: (appointment: Appointment) => void;
}

export function CalendarSidebar({ 
  appointments, 
  type,
  onEventClick 
}: CalendarSidebarProps) {
  const title = type === 'overdue' ? 'Overdue' : 'Upcoming';
  const filteredAppointments = filterAppointments(appointments, type);

  return (
    <div className={`side-panel ${type}`}>
      <div className="side-panel-header">
        <h3>{title}</h3>
        <span className="badge">{filteredAppointments.length}</span>
      </div>

      <div className="side-panel-body">
        <div className="event-list">
          {filteredAppointments.map(apt => (
            <div
              key={apt.id}
              className="event-item"
              onClick={() => onEventClick(apt)}
            >
              <div className="event-item-content">
                <div className="event-item-header">
                  <div className="event-icon">📅</div>
                  <div className="event-main-info">
                    <div className="event-name">{apt.lead?.name}</div>
                    <div className="event-time-phone">
                      <strong>{apt.appointmentTimeSlot}</strong> • 📞 {apt.lead?.phone}
                    </div>
                  </div>
                  <span className="event-badge">
                    {formatDate(apt.appointmentDate)}
                  </span>
                </div>

                <div className="event-details">
                  {apt.lead?.vehicleYear} {apt.lead?.vehicleMake} {apt.lead?.vehicleModel}
                </div>

                <EventBadge lead={apt.lead || {}} status={apt.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function filterAppointments(
  appointments: Appointment[], 
  type: 'overdue' | 'upcoming'
): Appointment[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (type === 'overdue') {
    return appointments
      .filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate < today && 
               apt.status !== 'completed' && 
               apt.status !== 'cancelled';
      })
      .slice(0, 10); // Max 10
  } else {
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    return appointments
      .filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate >= today && aptDate <= thirtyDaysFromNow;
      })
      .sort((a, b) => 
        new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
      )
      .slice(0, 15); // Max 15
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
```

---

### **DIA 4: Integração - Página Principal**

#### **4.1 Modificar `page.tsx`**

**Localização:** `frontend-admin/src/app/dashboard/appointments/page.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import { appointmentsService, Appointment } from '@/lib/api/appointments.service';
import { CalendarStats } from '@/components/appointments/CalendarMockup/CalendarStats';
import { CalendarGrid } from '@/components/appointments/CalendarMockup/CalendarGrid';
import { CalendarSidebar } from '@/components/appointments/CalendarMockup/CalendarSidebar';
import { AppointmentDetailsModal } from '@/components/appointments/AppointmentDetailsModal';
import '../../../components/appointments/styles/calendar-mockup.css';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadAppointments();
  }, [currentMonth, currentYear]);

  async function loadAppointments() {
    try {
      setLoading(true);
      const data = await appointmentsService.getAppointmentsByMonth(
        currentYear,
        currentMonth + 1
      );
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  }

  function handlePreviousMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  function handleNextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }

  if (loading) {
    return <div>Loading calendar...</div>;
  }

  return (
    <div className="appointments-mockup-container">
      {/* Header */}
      <div className="page-header">
        <h1>📅 Appointments Calendar</h1>
        <p>Manage customer appointments and schedules</p>
      </div>

      {/* Statistics Cards */}
      <CalendarStats />

      {/* Main Layout: 3 Columns */}
      <div className="main-layout">
        {/* Left: Overdue */}
        <CalendarSidebar
          appointments={appointments}
          type="overdue"
          onEventClick={setSelectedAppointment}
        />

        {/* Center: Calendar */}
        <div className="calendar-card">
          <div className="calendar-header-controls">
            <button onClick={handlePreviousMonth}>←</button>
            <h2>
              {new Date(currentYear, currentMonth).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}
            </h2>
            <button onClick={handleNextMonth}>→</button>
          </div>

          <CalendarGrid
            appointments={appointments}
            currentMonth={currentMonth}
            currentYear={currentYear}
            onDateClick={(date) => {
              // TODO: Open day modal
              console.log('Clicked date:', date);
            }}
          />
        </div>

        {/* Right: Upcoming */}
        <CalendarSidebar
          appointments={appointments}
          type="upcoming"
          onEventClick={setSelectedAppointment}
        />
      </div>

      {/* Modal */}
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
```

---

### **DIA 5: CSS - Estilos do Mockup**

#### **5.1 Criar `calendar-mockup.css`**

**Localização:** `frontend-admin/src/components/appointments/styles/calendar-mockup.css`

**Copiar estilos do mockup:**

```css
/* Variables (from mockup) */
:root {
  --primary: #d4af37;
  --secondary: #1e40af;
  --text: #1f2937;
  --text-secondary: #6b7280;
  --text-muted: #9ca3af;
  --border: #e5e7eb;
  --bg-light: #f9fafb;
}

/* Page Container */
.appointments-mockup-container {
  padding: 24px;
  background: var(--bg-light);
  min-height: 100vh;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 28px;
  color: var(--text);
  margin-bottom: 4px;
}

.page-header p {
  color: var(--text-secondary);
  font-size: 14px;
}

/* Statistics Cards */
.calendar-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid var(--border);
}

.stat-label {
  font-size: 12px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--text);
}

/* Main Layout - 3 Columns */
.main-layout {
  display: grid;
  grid-template-columns: 320px 1fr 320px;
  gap: 24px;
  overflow: visible;
  height: calc(100vh - 240px);
}

/* Side Panels */
.side-panel {
  background: white;
  border-radius: 8px;
  border: 1px solid var(--border);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.side-panel-header {
  padding: 16px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.side-panel-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
}

.side-panel.overdue .side-panel-header {
  background: #fef2f2;
}

.side-panel.upcoming .side-panel-header {
  background: #f0fdf4;
}

.side-panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  max-height: 65vh;
  padding-bottom: 20px;
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 16px;
}

.event-list .event-item:last-child {
  margin-bottom: 24px;
}

/* Event Item */
.event-item {
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  border-left: 3px solid var(--text-muted);
  transition: all 0.2s;
  cursor: pointer;
  background: white;
}

.event-item:hover {
  border-color: var(--primary);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transform: translateX(3px);
}

.event-item-header {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.event-icon {
  font-size: 20px;
}

.event-main-info {
  flex: 1;
}

.event-name {
  font-weight: 600;
  color: var(--text);
  font-size: 14px;
}

.event-time-phone {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.event-details {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.event-badge {
  background: var(--secondary);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

/* Tags */
.event-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.tag {
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  border: 1px solid;
}

.tag-insurance {
  background: #dbeafe;
  color: #1e40af;
  border-color: #60a5fa;
}

.tag-warranty {
  background: #e0e7ff;
  color: #4338ca;
  border-color: #818cf8;
}

.tag-private {
  background: #f3e8ff;
  color: #7c3aed;
  border-color: #a78bfa;
}

.tag-priority {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fca5a5;
}

.tag-confirmed {
  background: #d1fae5;
  color: #065f46;
  border-color: #6ee7b7;
}

/* Calendar Grid */
.calendar-card {
  background: white;
  border-radius: 8px;
  border: 1px solid var(--border);
  padding: 16px;
}

.calendar-header-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.calendar-header-controls button {
  padding: 8px 16px;
  border: 1px solid var(--border);
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.calendar-header-controls button:hover {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.calendar-header-controls h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 4px;
}

.calendar-header-day {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  padding: 8px 0;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-day {
  aspect-ratio: 1;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  background: white;
}

.calendar-day:hover {
  border-color: var(--primary);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.calendar-day.other-month {
  opacity: 0.3;
}

.calendar-day.today {
  background: #fef3c7;
  border-color: var(--primary);
}

.day-number {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}

.day-events {
  display: flex;
  gap: 2px;
  margin-top: 4px;
}

.event-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--secondary);
}

.event-indicator.confirmed {
  background: #10b981;
}

.event-indicator.scheduled {
  background: #3b82f6;
}

.event-indicator.cancelled {
  background: #ef4444;
}

.calendar-day .event-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 10px;
  padding: 2px 6px;
}
```

---

## 🧪 TESTES

### **Checklist de Validação:**

**Backend:**
- [ ] GET /api/appointments retorna campos do lead (vehicle, insurance, priority)
- [ ] GET /api/appointments/dashboard/stats retorna estatísticas corretas
- [ ] Response inclui referenceNumber (FLIP-YYYYMMDD-XXXX)

**Frontend:**
- [ ] Página carrega sem erros
- [ ] 3 colunas aparecem (Overdue | Calendar | Upcoming)
- [ ] Estatísticas aparecem no topo
- [ ] Tags visuais corretas (Insurance, Private Pay, etc.)
- [ ] Click em evento abre modal de detalhes
- [ ] Navegação de mês funciona (← →)
- [ ] Badges de contagem corretos

**Visual:**
- [ ] Cores do mockup aplicadas
- [ ] Layout responsivo
- [ ] Hover effects funcionando
- [ ] Mobile friendly (se aplicável)

---

## 🚀 DEPLOY

### **Staging (Dia 5):**
```bash
# Backend
cd /home/user/webapp/backend
git add .
git commit -m "feat: enrich appointments API for mockup UI"
npm run build
# Deploy staging

# Frontend
cd /home/user/webapp/frontend-admin
git add .
git commit -m "feat: replace FullCalendar with mockup design"
npm run build
# Deploy staging
```

### **Produção (após validação):**
```bash
# Após testes em staging
# Deploy backend
# Deploy frontend
# Monitorar 24h
```

---

## ✅ CHECKLIST FINAL

- [ ] Backup do código atual
- [ ] Branch criado: `feature/appointments-mockup-ui`
- [ ] Backend modificado (SELECT fields)
- [ ] Endpoint stats criado
- [ ] Componentes mockup criados
- [ ] CSS migrado do mockup
- [ ] Página principal integrada
- [ ] Testes locais OK
- [ ] Deploy staging OK
- [ ] Validação usuários OK
- [ ] Deploy produção
- [ ] Monitoramento 24h
- [ ] Feedback coletado

---

**Tempo Total:** 5 dias úteis (1 semana)  
**Risco:** BAIXO ✅  
**Rollback:** git revert (< 5 min)

