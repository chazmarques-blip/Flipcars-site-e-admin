# 🎯 PLANEJAMENTO COMPLETO - ADMIN DASHBOARD: LEAD MANAGEMENT

**Data:** 2025-11-07  
**Projeto:** FlipCars Auto Body Shop  
**Fase:** Admin Dashboard - Lead Management  
**Decisões:**
- ✅ Subdomínio: `admin.flipcars.us`
- ✅ Desenvolvimento local primeiro
- ✅ Autenticação mock simples
- ✅ Deploy depois

---

## 📊 **SITUAÇÃO ATUAL DO PROJETO**

### ✅ **JÁ IMPLEMENTADO:**

**1. Autenticação Mock** ✅
- `src/stores/authStore.ts` - Zustand store com login mock
- `src/components/forms/LoginForm.tsx` - Formulário de login
- `src/app/auth/login/page.tsx` - Página de login
- **Credenciais Mock:**
  ```
  admin@flipcars.com / admin123 (super_admin)
  manager@flipcars.com / manager123 (admin)
  agent@flipcars.com / agent123 (agent)
  ```

**2. Lead List Page** ✅
- `src/app/dashboard/leads/page.tsx` - Lista de leads com filtros
- DataTable com paginação
- Filtros por status, priority, insurance
- Export para CSV/Excel
- Search bar

**3. API Services** ✅
- `src/lib/api/lead.service.ts` - Todos os métodos CRUD
- `src/lib/api/client.ts` - Axios client com interceptors

**4. Types** ✅
- Lead, LeadStatus, LeadPriority, LeadFilters, etc.

**5. UI Components** ✅
- DataTable, Badge, Button, FilterPanel, SearchBar, etc.

---

### ⚠️ **PROBLEMA ATUAL:**

**API Service está configurado para chamar backend real:**
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
```

Mas **não temos backend ainda!** Então precisa de **dados mock**.

---

### ⏳ **FALTANDO IMPLEMENTAR:**

**1. Middleware de Proteção** ❌
- Não existe `middleware.ts` no root
- Rotas `/dashboard/*` não estão protegidas

**2. Components de Leads** ❌
- Pasta `components/leads/` não existe
- Faltam: LeadDetail, LeadNotes, LeadTimeline, LeadStatusBadge, etc.

**3. Página de Detalhes** ❌
- `/dashboard/leads/[id]/page.tsx` existe mas precisa ser implementado

**4. Sistema de Notas** ❌
- Adicionar, editar, deletar notas

**5. Status Workflow** ❌
- Mudança de status visual
- Timeline de atividades

**6. Dados Mock** ❌
- Lead service precisa retornar dados fake

---

## 🚀 **PLANO DE IMPLEMENTAÇÃO**

---

## **ETAPA 1: MOCK DATA SYSTEM** (30 min)

### **Objetivo:**
Fazer o sistema funcionar sem backend usando dados fake.

### **Ações:**

#### **1.1: Criar arquivo de dados mock**

**Arquivo:** `src/lib/mock/leadsMockData.ts`

```typescript
import { Lead, LeadStatus, LeadPriority } from '@/types/lead';

export const mockLeads: Lead[] = [
  {
    id: '1',
    referenceNumber: 'FL-2024-001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(321) 555-0101',
    vehicleMake: 'Toyota',
    vehicleModel: 'Camry',
    vehicleYear: '2020',
    vin: '1HGBH41JXMN109186',
    status: LeadStatus.NEW,
    priority: LeadPriority.HIGH,
    source: 'website',
    damageDescription: 'Front bumper damaged in parking lot accident',
    damageType: ['front'],
    hasInsurance: true,
    insuranceCompany: 'State Farm',
    claimNumber: 'SF-2024-12345',
    aiQualificationScore: 85,
    aiQualificationNotes: 'High probability of conversion',
    assignedToId: null,
    assignedTo: null,
    createdAt: new Date('2024-11-01T10:00:00').toISOString(),
    updatedAt: new Date('2024-11-01T10:00:00').toISOString(),
  },
  {
    id: '2',
    referenceNumber: 'FL-2024-002',
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    phone: '(321) 555-0102',
    vehicleMake: 'Honda',
    vehicleModel: 'Accord',
    vehicleYear: '2019',
    vin: '1HGCV1F30JA123456',
    status: LeadStatus.CONTACTED,
    priority: LeadPriority.MEDIUM,
    source: 'phone',
    damageDescription: 'Side door dent from minor collision',
    damageType: ['side'],
    hasInsurance: true,
    insuranceCompany: 'Progressive',
    claimNumber: 'PRG-2024-67890',
    aiQualificationScore: 72,
    assignedToId: '2',
    createdAt: new Date('2024-11-02T14:30:00').toISOString(),
    updatedAt: new Date('2024-11-03T09:15:00').toISOString(),
  },
  {
    id: '3',
    referenceNumber: 'FL-2024-003',
    name: 'Robert Johnson',
    email: 'robert.j@example.com',
    phone: '(321) 555-0103',
    vehicleMake: 'Ford',
    vehicleModel: 'F-150',
    vehicleYear: '2021',
    vin: '1FTFW1ET5DKD12345',
    status: LeadStatus.QUALIFIED,
    priority: LeadPriority.HIGH,
    source: 'referral',
    damageDescription: 'Rear bumper and tailgate damage from rear-end collision',
    damageType: ['rear'],
    hasInsurance: true,
    insuranceCompany: 'Allstate',
    claimNumber: 'ALL-2024-11111',
    aiQualificationScore: 91,
    assignedToId: '1',
    createdAt: new Date('2024-10-28T16:45:00').toISOString(),
    updatedAt: new Date('2024-11-05T11:20:00').toISOString(),
  },
  // Adicionar mais 20+ leads...
];

export const mockLeadNotes = [
  {
    id: 'note-1',
    leadId: '1',
    userId: '1',
    userName: 'Admin User',
    content: 'Customer called to schedule estimate appointment.',
    isInternal: false,
    createdAt: new Date('2024-11-01T11:30:00').toISOString(),
    updatedAt: new Date('2024-11-01T11:30:00').toISOString(),
  },
  {
    id: 'note-2',
    leadId: '1',
    userId: '1',
    userName: 'Admin User',
    content: 'Internal note: Customer mentioned previous experience with another shop.',
    isInternal: true,
    createdAt: new Date('2024-11-01T14:20:00').toISOString(),
    updatedAt: new Date('2024-11-01T14:20:00').toISOString(),
  },
];

export const mockLeadActivities = [
  {
    id: 'activity-1',
    leadId: '1',
    userId: '1',
    userName: 'Admin User',
    action: 'created',
    description: 'Lead created from website form',
    metadata: {},
    createdAt: new Date('2024-11-01T10:00:00').toISOString(),
  },
  {
    id: 'activity-2',
    leadId: '1',
    userId: '1',
    userName: 'Admin User',
    action: 'status_changed',
    description: 'Status changed from NEW to CONTACTED',
    metadata: { oldStatus: 'NEW', newStatus: 'CONTACTED' },
    createdAt: new Date('2024-11-01T11:00:00').toISOString(),
  },
];
```

#### **1.2: Modificar lead.service.ts para usar dados mock**

**Adicionar no topo do arquivo:**
```typescript
import { mockLeads, mockLeadNotes, mockLeadActivities } from '@/lib/mock/leadsMockData';

// Mock mode flag (set to false when backend is ready)
const USE_MOCK_DATA = true;
```

**Modificar função getLeads:**
```typescript
async getLeads(
  page: number = 1,
  limit: number = 10,
  filters?: LeadFilters
): Promise<PaginatedResponse<Lead>> {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    let filteredLeads = [...mockLeads];

    // Apply filters
    if (filters?.status) {
      filteredLeads = filteredLeads.filter(l => l.status === filters.status);
    }
    if (filters?.priority) {
      filteredLeads = filteredLeads.filter(l => l.priority === filters.priority);
    }
    if (filters?.hasInsurance !== undefined) {
      filteredLeads = filteredLeads.filter(l => l.hasInsurance === filters.hasInsurance);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filteredLeads = filteredLeads.filter(l =>
        l.name.toLowerCase().includes(search) ||
        l.email.toLowerCase().includes(search) ||
        l.phone.includes(search) ||
        l.referenceNumber.toLowerCase().includes(search)
      );
    }

    // Pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedLeads = filteredLeads.slice(start, end);

    return {
      data: paginatedLeads,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(filteredLeads.length / limit),
        total: filteredLeads.length,
        perPage: limit,
      },
    };
  }

  // Real API call (quando backend existir)
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  // ... resto do código
}
```

---

## **ETAPA 2: MIDDLEWARE DE PROTEÇÃO** (15 min)

### **Objetivo:**
Proteger rotas do dashboard para usuários não autenticados.

### **Ações:**

#### **2.1: Criar middleware.ts**

**Arquivo:** `src/middleware.ts` (root do src/)

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas públicas (não precisam de autenticação)
const publicPaths = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
];

// Rotas protegidas (precisam de autenticação)
const protectedPaths = ['/dashboard'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verificar se é rota protegida
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // Se for rota protegida
  if (isProtectedPath) {
    // Verificar se tem token no cookie ou localStorage (via headers)
    const authStorage = request.cookies.get('auth-storage');
    
    if (!authStorage) {
      // Redirect para login
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Parsear JSON e verificar isAuthenticated
    try {
      const authData = JSON.parse(authStorage.value);
      if (!authData?.state?.isAuthenticated) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      const loginUrl = new URL('/auth/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Se já está autenticado e tenta acessar login
  if (isPublicPath && pathname.startsWith('/auth/login')) {
    const authStorage = request.cookies.get('auth-storage');
    if (authStorage) {
      try {
        const authData = JSON.parse(authStorage.value);
        if (authData?.state?.isAuthenticated) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      } catch {
        // Ignore parsing errors
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).  *)',
  ],
};
```

---

## **ETAPA 3: COMPONENTS DE LEADS** (45 min)

### **Objetivo:**
Criar componentes reutilizáveis para Lead Management.

### **Ações:**

#### **3.1: Criar pasta e index**

**Criar:** `src/components/leads/index.ts`

```typescript
export { LeadDetailView } from './LeadDetailView';
export { LeadNotes } from './LeadNotes';
export { LeadTimeline } from './LeadTimeline';
export { LeadStatusBadge } from './LeadStatusBadge';
export { LeadQuickActions } from './LeadQuickActions';
export { LeadAssignment } from './LeadAssignment';
```

#### **3.2: LeadStatusBadge Component**

**Arquivo:** `src/components/leads/LeadStatusBadge.tsx`

```typescript
'use client';

import { LeadStatus } from '@/types/lead';
import { Badge } from '@/components/ui';

interface LeadStatusBadgeProps {
  status: LeadStatus;
  className?: string;
}

export function LeadStatusBadge({ status, className }: LeadStatusBadgeProps) {
  const config: Record<LeadStatus, { 
    variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    label: string;
  }> = {
    [LeadStatus.NEW]: { variant: 'primary', label: 'New' },
    [LeadStatus.CONTACTED]: { variant: 'secondary', label: 'Contacted' },
    [LeadStatus.QUALIFIED]: { variant: 'success', label: 'Qualified' },
    [LeadStatus.PROPOSAL_SENT]: { variant: 'warning', label: 'Proposal Sent' },
    [LeadStatus.NEGOTIATING]: { variant: 'warning', label: 'Negotiating' },
    [LeadStatus.WON]: { variant: 'success', label: 'Won' },
    [LeadStatus.LOST]: { variant: 'danger', label: 'Lost' },
  };

  const { variant, label } = config[status];

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
```

#### **3.3: LeadNotes Component**

**Arquivo:** `src/components/leads/LeadNotes.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Plus, Lock, Globe } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { formatDistanceToNow } from 'date-fns';

interface Note {
  id: string;
  content: string;
  isInternal: boolean;
  userName: string;
  createdAt: string;
  updatedAt: string;
}

interface LeadNotesProps {
  leadId: string;
  notes: Note[];
  onAddNote: (content: string, isInternal: boolean) => void;
}

export function LeadNotes({ leadId, notes, onAddNote }: LeadNotesProps) {
  const [newNote, setNewNote] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddNote(newNote, isInternal);
      setNewNote('');
      setIsInternal(false);
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Note Form */}
      <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note..."
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          rows={3}
          disabled={isSubmitting}
        />
        
        <div className="flex items-center justify-between mt-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isInternal}
              onChange={(e) => setIsInternal(e.target.checked)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="text-sm text-gray-600 flex items-center gap-1">
              <Lock className="w-4 h-4" />
              Internal Note (only visible to staff)
            </span>
          </label>
          
          <Button
            type="submit"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            disabled={isSubmitting || !newNote.trim()}
            isLoading={isSubmitting}
          >
            Add Note
          </Button>
        </div>
      </form>

      {/* Notes List */}
      <div className="space-y-3">
        {notes.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No notes yet. Add the first one!
          </p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className={`p-4 rounded-lg border ${
                note.isInternal ? 'bg-yellow-50 border-yellow-200' : 'bg-white'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{note.userName}</span>
                  {note.isInternal ? (
                    <Badge variant="warning" size="sm">
                      <Lock className="w-3 h-3 mr-1" />
                      Internal
                    </Badge>
                  ) : (
                    <Badge variant="default" size="sm">
                      <Globe className="w-3 h-3 mr-1" />
                      Public
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

#### **3.4: LeadTimeline Component**

**Arquivo:** `src/components/leads/LeadTimeline.tsx`

```typescript
'use client';

import { Check, User, FileText, DollarSign, Phone } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  action: string;
  description: string;
  userName: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

interface LeadTimelineProps {
  activities: Activity[];
}

const actionIcons: Record<string, React.ReactNode> = {
  created: <FileText className="w-4 h-4" />,
  status_changed: <Check className="w-4 h-4" />,
  assigned: <User className="w-4 h-4" />,
  contacted: <Phone className="w-4 h-4" />,
  qualified: <DollarSign className="w-4 h-4" />,
};

export function LeadTimeline({ activities }: LeadTimelineProps) {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, idx) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {idx !== activities.length - 1 && (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center ring-8 ring-white text-white">
                    {actionIcons[activity.action] || <Check className="w-4 h-4" />}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-900">
                      {activity.description}{' '}
                      <span className="font-medium text-gray-900">
                        by {activity.userName}
                      </span>
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    {formatDistanceToNow(new Date(activity.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## **ETAPA 4: PÁGINA DE DETALHES DO LEAD** (60 min)

### **Objetivo:**
Implementar página completa de visualização e edição de lead.

### **Ações:**

#### **4.1: Implementar /dashboard/leads/[id]/page.tsx**

**Arquivo:** `src/app/dashboard/leads/[id]/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Car,
  Shield,
  Calendar,
} from 'lucide-react';
import { Button, Badge, Card } from '@/components/ui';
import { Lead, LeadStatus } from '@/types/lead';
import { leadService } from '@/lib/api/lead.service';
import { LeadNotes, LeadTimeline, LeadStatusBadge } from '@/components/leads';
import toast from 'react-hot-toast';

export default function LeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const leadId = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'timeline'>('overview');

  useEffect(() => {
    if (leadId) {
      fetchLead();
    }
  }, [leadId]);

  const fetchLead = async () => {
    setIsLoading(true);
    try {
      const data = await leadService.getLeadById(leadId);
      setLead(data);
    } catch (error) {
      toast.error('Failed to load lead');
      console.error('Error fetching lead:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!lead) return;

    try {
      await leadService.updateLeadStatus(lead.id, newStatus);
      setLead({ ...lead, status: newStatus });
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
      console.error('Error updating status:', error);
    }
  };

  const handleAddNote = async (content: string, isInternal: boolean) => {
    // Mock implementation
    toast.success('Note added successfully');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Lead not found</p>
        <Button onClick={() => router.push('/dashboard/leads')} className="mt-4">
          Back to Leads
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard/leads')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900">
              {lead.name}
            </h1>
            <p className="text-gray-600 mt-1">
              Reference: {lead.referenceNumber}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <LeadStatusBadge status={lead.status} />
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Edit className="w-4 h-4" />}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'notes', 'timeline'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm capitalize
                ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <a href={`mailto:${lead.email}`} className="hover:text-primary">
                    {lead.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <a href={`tel:${lead.phone}`} className="hover:text-primary">
                    {lead.phone}
                  </a>
                </div>
              </div>
            </Card>

            {/* Vehicle Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Vehicle Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Car className="w-5 h-5 text-gray-400" />
                  <span>
                    {lead.vehicleYear} {lead.vehicleMake} {lead.vehicleModel}
                  </span>
                </div>
                {lead.vin && (
                  <div className="text-sm text-gray-600">
                    VIN: <span className="font-mono">{lead.vin}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Damage Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Damage Description
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {lead.damageDescription}
              </p>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Insurance Info */}
            {lead.hasInsurance && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Insurance
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Company:</span>
                    <p className="font-medium">{lead.insuranceCompany}</p>
                  </div>
                  {lead.claimNumber && (
                    <div>
                      <span className="text-gray-600">Claim #:</span>
                      <p className="font-medium font-mono">{lead.claimNumber}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* AI Score */}
            {lead.aiQualificationScore && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  AI Qualification Score
                </h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {lead.aiQualificationScore}
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${lead.aiQualificationScore}%` }}
                    />
                  </div>
                  {lead.aiQualificationNotes && (
                    <p className="text-sm text-gray-600 mt-3">
                      {lead.aiQualificationNotes}
                    </p>
                  )}
                </div>
              </Card>
            )}

            {/* Dates */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Dates
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Created:</span>
                  <p className="font-medium">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Updated:</span>
                  <p className="font-medium">
                    {new Date(lead.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'notes' && (
        <Card className="p-6">
          <LeadNotes
            leadId={lead.id}
            notes={[]} // Mock data - implementar depois
            onAddNote={handleAddNote}
          />
        </Card>
      )}

      {activeTab === 'timeline' && (
        <Card className="p-6">
          <LeadTimeline activities={[]} /> {/* Mock data - implementar depois */}
        </Card>
      )}
    </div>
  );
}
```

---

## **ETAPA 5: TESTAR LOCALMENTE** (30 min)

### **Objetivo:**
Garantir que tudo funciona perfeitamente antes do deploy.

### **Ações:**

#### **5.1: Instalar dependências**
```bash
cd /home/user/webapp/frontend-admin
npm install
```

#### **5.2: Iniciar dev server**
```bash
npm run dev
```

#### **5.3: Testes a realizar**

**Login:**
- [ ] Acessar http://localhost:3000/auth/login
- [ ] Testar com credenciais mock (admin@flipcars.com / admin123)
- [ ] Verificar redirect para /dashboard após login
- [ ] Testar logout

**Middleware:**
- [ ] Tentar acessar /dashboard sem login (deve redirecionar)
- [ ] Login e acessar /dashboard (deve funcionar)
- [ ] Logout e tentar acessar /dashboard novamente

**Lead List:**
- [ ] Acessar /dashboard/leads
- [ ] Verificar se lista de leads aparece com dados mock
- [ ] Testar filtros (status, priority, insurance)
- [ ] Testar busca
- [ ] Testar paginação
- [ ] Testar export CSV

**Lead Detail:**
- [ ] Clicar em um lead
- [ ] Verificar se página de detalhes carrega
- [ ] Testar tabs (Overview, Notes, Timeline)
- [ ] Testar adicionar nota
- [ ] Testar mudança de status

**Performance:**
- [ ] Verificar que não há erros no console
- [ ] Verificar que transições são suaves
- [ ] Verificar responsividade mobile

---

## **ETAPA 6: DEPLOY (DEPOIS)** (30 min)

### **Objetivo:**
Colocar admin dashboard no ar em admin.flipcars.us

### **Ações:**

#### **6.1: Configurar DNS no GoDaddy**
```
Type: CNAME
Name: admin
Value: cname.vercel-dns.com
TTL: 1 Hour
```

#### **6.2: Configurar Vercel**
- Adicionar domínio admin.flipcars.us
- Verificar build settings
- Deploy!

---

## 📊 **RESUMO DO PLANEJAMENTO**

```
ETAPA 1: Mock Data System        (30 min)
ETAPA 2: Middleware Proteção     (15 min)
ETAPA 3: Components Leads        (45 min)
ETAPA 4: Página Detalhes         (60 min)
ETAPA 5: Testes Locais           (30 min)
ETAPA 6: Deploy                  (30 min)
─────────────────────────────────────────
TOTAL ESTIMADO:                  3h 30min
```

---

## ✅ **CHECKLIST FINAL**

```
⬜ Criar leadsMockData.ts com 25+ leads
⬜ Modificar lead.service.ts para usar mock data
⬜ Criar middleware.ts para proteção de rotas
⬜ Criar components/leads/ com 6 componentes
⬜ Implementar página /dashboard/leads/[id]
⬜ Testar login/logout
⬜ Testar lead list (filtros, busca, paginação)
⬜ Testar lead detail (tabs, notes, timeline)
⬜ Verificar responsividade
⬜ Configurar DNS admin.flipcars.us
⬜ Deploy no Vercel
```

---

**Próximo Passo:** Começar implementação pela Etapa 1! 🚀

**Dúvidas?** Me avise e eu te ajudo a implementar cada parte!
