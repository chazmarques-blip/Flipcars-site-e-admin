# FlipCars 2.0 - API Specification

## 📋 Visão Geral

RESTful API desenvolvida com NestJS, TypeScript, TypeORM/Prisma e PostgreSQL.

**Base URL (Produção):** `https://api.flipcars.us/v1`  
**Base URL (Dev):** `http://localhost:3000/v1`

---

## 🔐 Autenticação

### Sistema de Autenticação
- **Método:** JWT (JSON Web Tokens)
- **Header:** `Authorization: Bearer <token>`
- **Expiração:** 24 horas (access token) / 7 dias (refresh token)
- **Algoritmo:** RS256

### Roles (RBAC)
```typescript
enum UserRole {
  ADMIN = 'admin',           // Acesso total
  MANAGER = 'manager',       // Gestão de operações
  ATTENDANT = 'attendant',   // Atendimento ao cliente
  TECHNICIAN = 'technician', // Técnico de reparo
  MARKETING = 'marketing'    // Marketing e conteúdo
}
```

---

## 📡 Módulos e Endpoints

### 1. AUTH MODULE

#### POST /auth/register
Registro de novo usuário (Admin only)

**Request Body:**
```json
{
  "email": "john.doe@flipcars.us",
  "password": "SecureP@ssw0rd!",
  "name": "John Doe",
  "role": "attendant",
  "phone": "+1-321-960-8661"
}
```

**Response (201):**
```json
{
  "id": "uuid-v4",
  "email": "john.doe@flipcars.us",
  "name": "John Doe",
  "role": "attendant",
  "createdAt": "2025-10-28T10:00:00Z"
}
```

**Errors:**
- 400: Validation error
- 409: Email already exists
- 403: Forbidden (not admin)

---

#### POST /auth/login
Login de usuário

**Request Body:**
```json
{
  "email": "john.doe@flipcars.us",
  "password": "SecureP@ssw0rd!"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400,
  "user": {
    "id": "uuid-v4",
    "email": "john.doe@flipcars.us",
    "name": "John Doe",
    "role": "attendant"
  }
}
```

**Errors:**
- 400: Validation error
- 401: Invalid credentials
- 429: Too many attempts (rate limiting)

---

#### POST /auth/refresh
Renovar access token

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}
```

---

#### POST /auth/forgot-password
Solicitar reset de senha

**Request Body:**
```json
{
  "email": "john.doe@flipcars.us"
}
```

**Response (200):**
```json
{
  "message": "Password reset email sent"
}
```

---

#### POST /auth/reset-password
Resetar senha com token

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "NewSecureP@ssw0rd!"
}
```

**Response (200):**
```json
{
  "message": "Password reset successful"
}
```

---

### 2. USER MANAGEMENT MODULE

#### GET /users
Listar usuários (Admin/Manager)

**Query Parameters:**
```
?page=1
&limit=20
&role=attendant
&search=john
&sortBy=createdAt
&order=DESC
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid-v4",
      "email": "john.doe@flipcars.us",
      "name": "John Doe",
      "role": "attendant",
      "phone": "+1-321-960-8661",
      "isActive": true,
      "createdAt": "2025-10-28T10:00:00Z",
      "updatedAt": "2025-10-28T10:00:00Z"
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

#### GET /users/:id
Obter usuário por ID

**Response (200):**
```json
{
  "id": "uuid-v4",
  "email": "john.doe@flipcars.us",
  "name": "John Doe",
  "role": "attendant",
  "phone": "+1-321-960-8661",
  "isActive": true,
  "createdAt": "2025-10-28T10:00:00Z",
  "updatedAt": "2025-10-28T10:00:00Z",
  "lastLogin": "2025-10-28T14:30:00Z"
}
```

---

#### PUT /users/:id
Atualizar usuário (Admin only)

**Request Body:**
```json
{
  "name": "John Smith",
  "phone": "+1-321-960-8661",
  "role": "manager",
  "isActive": true
}
```

**Response (200):**
```json
{
  "id": "uuid-v4",
  "email": "john.doe@flipcars.us",
  "name": "John Smith",
  "role": "manager",
  "phone": "+1-321-960-8661",
  "isActive": true,
  "updatedAt": "2025-10-28T15:00:00Z"
}
```

---

#### DELETE /users/:id
Desativar usuário (soft delete - Admin only)

**Response (200):**
```json
{
  "message": "User deactivated successfully"
}
```

---

### 3. LEAD MANAGEMENT MODULE (CRM)

#### POST /leads
Criar novo lead (público ou autenticado)

**Request Body:**
```json
{
  "name": "Maria Silva",
  "phone": "+1-407-555-0123",
  "email": "maria.silva@email.com",
  "preferredLanguage": "pt",
  "vehicle": {
    "make": "Toyota",
    "model": "Camry",
    "year": 2020,
    "vin": "1HGBH41JXMN109186",
    "licensePlate": "ABC-1234"
  },
  "insurance": {
    "hasInsurance": true,
    "provider": "State Farm",
    "claimNumber": "SF-2024-123456",
    "policyNumber": "POL-789456"
  },
  "accident": {
    "isDrivable": false,
    "needsTow": true,
    "needsRental": true,
    "description": "Rear-end collision at intersection"
  },
  "photos": [
    "https://s3.amazonaws.com/flipcars/leads/photo1.jpg",
    "https://s3.amazonaws.com/flipcars/leads/photo2.jpg"
  ],
  "source": "google_ads",
  "utmParams": {
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "collision_repair_orlando"
  }
}
```

**Response (201):**
```json
{
  "id": "uuid-v4",
  "name": "Maria Silva",
  "phone": "+1-407-555-0123",
  "email": "maria.silva@email.com",
  "preferredLanguage": "pt",
  "status": "new",
  "source": "google_ads",
  "createdAt": "2025-10-28T16:00:00Z",
  "referenceNumber": "FC-2024-001234"
}
```

---

#### GET /leads
Listar leads (autenticado)

**Query Parameters:**
```
?page=1
&limit=20
&status=new,contacted
&source=google_ads
&search=maria
&dateFrom=2025-10-01
&dateTo=2025-10-31
&assignedTo=user-uuid
&sortBy=createdAt
&order=DESC
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid-v4",
      "name": "Maria Silva",
      "phone": "+1-407-555-0123",
      "email": "maria.silva@email.com",
      "preferredLanguage": "pt",
      "status": "new",
      "source": "google_ads",
      "aiQualificationScore": 85,
      "assignedHumanAgent": null,
      "assignedAiAgent": "ai-agent-1",
      "lastAiInteraction": "2025-10-28T16:05:00Z",
      "lastHumanInteraction": null,
      "createdAt": "2025-10-28T16:00:00Z",
      "referenceNumber": "FC-2024-001234"
    }
  ],
  "meta": {
    "total": 156,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

---

#### GET /leads/:id
Obter lead por ID (com histórico completo)

**Response (200):**
```json
{
  "id": "uuid-v4",
  "name": "Maria Silva",
  "phone": "+1-407-555-0123",
  "email": "maria.silva@email.com",
  "preferredLanguage": "pt",
  "vehicle": {
    "make": "Toyota",
    "model": "Camry",
    "year": 2020,
    "vin": "1HGBH41JXMN109186",
    "licensePlate": "ABC-1234"
  },
  "insurance": {
    "hasInsurance": true,
    "provider": "State Farm",
    "claimNumber": "SF-2024-123456",
    "policyNumber": "POL-789456"
  },
  "accident": {
    "isDrivable": false,
    "needsTow": true,
    "needsRental": true,
    "description": "Rear-end collision at intersection"
  },
  "photos": [
    "https://s3.amazonaws.com/flipcars/leads/photo1.jpg"
  ],
  "status": "qualified_ai",
  "source": "google_ads",
  "aiQualificationScore": 85,
  "assignedHumanAgent": {
    "id": "user-uuid",
    "name": "John Doe"
  },
  "assignedAiAgent": "ai-agent-1",
  "conversationHistory": [
    {
      "id": "conv-1",
      "role": "assistant",
      "content": "Olá Maria! Sou o assistente virtual da FlipCars. Vi que você teve um acidente. Como posso ajudar?",
      "timestamp": "2025-10-28T16:05:00Z"
    },
    {
      "id": "conv-2",
      "role": "user",
      "content": "Meu carro foi atingido por trás. Preciso de reparo urgente.",
      "timestamp": "2025-10-28T16:06:00Z"
    }
  ],
  "notes": [
    {
      "id": "note-1",
      "author": {
        "id": "user-uuid",
        "name": "John Doe"
      },
      "content": "Cliente muito receptivo. Seguro State Farm já confirmado.",
      "isInternal": true,
      "createdAt": "2025-10-28T16:30:00Z"
    }
  ],
  "lastAiInteraction": "2025-10-28T16:10:00Z",
  "lastHumanInteraction": "2025-10-28T16:30:00Z",
  "createdAt": "2025-10-28T16:00:00Z",
  "updatedAt": "2025-10-28T16:30:00Z",
  "referenceNumber": "FC-2024-001234"
}
```

---

#### PUT /leads/:id
Atualizar lead

**Request Body:**
```json
{
  "status": "human_contacted",
  "assignedHumanAgent": "user-uuid",
  "notes": "Cliente confirmou disponibilidade para amanhã"
}
```

**Response (200):**
```json
{
  "id": "uuid-v4",
  "status": "human_contacted",
  "assignedHumanAgent": {
    "id": "user-uuid",
    "name": "John Doe"
  },
  "updatedAt": "2025-10-28T17:00:00Z"
}
```

---

#### POST /leads/:id/notes
Adicionar nota ao lead

**Request Body:**
```json
{
  "content": "Cliente confirmou horário para inspeção",
  "isInternal": true
}
```

**Response (201):**
```json
{
  "id": "note-uuid",
  "author": {
    "id": "user-uuid",
    "name": "John Doe"
  },
  "content": "Cliente confirmou horário para inspeção",
  "isInternal": true,
  "createdAt": "2025-10-28T17:15:00Z"
}
```

---

#### POST /leads/:id/convert
Converter lead em sinistro/cliente

**Response (201):**
```json
{
  "claim": {
    "id": "claim-uuid",
    "leadId": "lead-uuid",
    "status": "intake",
    "createdAt": "2025-10-28T17:30:00Z"
  },
  "customer": {
    "id": "customer-uuid",
    "name": "Maria Silva",
    "email": "maria.silva@email.com"
  }
}
```

---

### 4. AI INTEGRATION MODULE

#### POST /ai/chat
Conversa com o agente de IA

**Request Body:**
```json
{
  "leadId": "uuid-v4",
  "message": "Meu carro foi atingido por trás",
  "language": "pt",
  "context": {
    "currentStep": "initial_greeting",
    "collectedData": {}
  }
}
```

**Response (200):**
```json
{
  "response": "Sinto muito pelo acidente. Vou te ajudar com o processo. Seu carro ainda está em condições de dirigir?",
  "nextStep": "check_drivability",
  "actions": [
    {
      "type": "collect_info",
      "field": "isDrivable",
      "options": ["yes", "no"]
    }
  ],
  "shouldEscalate": false,
  "qualificationScore": 65
}
```

---

#### POST /ai/qualify
Qualificar lead automaticamente

**Request Body:**
```json
{
  "leadId": "uuid-v4"
}
```

**Response (200):**
```json
{
  "qualificationScore": 85,
  "qualificationReason": "Lead has insurance, needs immediate repair, high intent",
  "recommendedAction": "assign_to_human",
  "priority": "high",
  "estimatedValue": 3500,
  "confidence": 0.87
}
```

---

#### POST /ai/summarize-conversation
Gerar resumo de conversa

**Request Body:**
```json
{
  "leadId": "uuid-v4",
  "conversationHistory": [
    {
      "role": "assistant",
      "content": "Como posso ajudar?",
      "timestamp": "2025-10-28T16:00:00Z"
    },
    {
      "role": "user",
      "content": "Preciso reparar meu carro",
      "timestamp": "2025-10-28T16:01:00Z"
    }
  ]
}
```

**Response (200):**
```json
{
  "summary": "Cliente precisa de reparo após colisão traseira. Tem seguro State Farm. Veículo não está dirigível. Necessita guincho e carro reserva. Alta prioridade.",
  "keyPoints": [
    "Insurance: State Farm",
    "Vehicle not drivable",
    "Needs tow and rental",
    "Rear-end collision"
  ],
  "sentiment": "neutral",
  "urgency": "high"
}
```

---

#### POST /ai/suggest-response
IA sugere resposta para agente humano

**Request Body:**
```json
{
  "leadId": "uuid-v4",
  "context": "Cliente perguntou sobre prazo de reparo",
  "conversationHistory": []
}
```

**Response (200):**
```json
{
  "suggestedResponses": [
    {
      "text": "Olá Maria! Normalmente um reparo como o seu leva de 5 a 7 dias úteis. Vou agendar uma inspeção para te dar um prazo mais preciso. Quando você pode trazer o veículo?",
      "tone": "professional_friendly",
      "confidence": 0.92
    },
    {
      "text": "O prazo depende da extensão dos danos, mas geralmente é de 5-7 dias. Posso agendar uma avaliação?",
      "tone": "professional_brief",
      "confidence": 0.85
    }
  ]
}
```

---

### 5. STORAGE MODULE

#### POST /storage/upload-request
Solicitar URL pré-assinada para upload

**Request Body:**
```json
{
  "fileName": "vehicle-damage-front.jpg",
  "fileType": "image/jpeg",
  "fileSize": 2048576,
  "category": "lead_photos",
  "leadId": "uuid-v4"
}
```

**Response (200):**
```json
{
  "uploadUrl": "https://s3.amazonaws.com/flipcars/...",
  "fileKey": "leads/uuid-v4/vehicle-damage-front-timestamp.jpg",
  "expiresIn": 3600,
  "publicUrl": "https://cdn.flipcars.us/leads/uuid-v4/vehicle-damage-front-timestamp.jpg"
}
```

---

#### GET /storage/files
Listar arquivos (com filtros)

**Query Parameters:**
```
?category=lead_photos
&leadId=uuid-v4
&page=1
&limit=20
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "file-uuid",
      "fileName": "vehicle-damage-front.jpg",
      "fileType": "image/jpeg",
      "fileSize": 2048576,
      "category": "lead_photos",
      "publicUrl": "https://cdn.flipcars.us/...",
      "uploadedBy": {
        "id": "user-uuid",
        "name": "Maria Silva"
      },
      "createdAt": "2025-10-28T16:00:00Z"
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 20
  }
}
```

---

#### DELETE /storage/files/:id
Deletar arquivo

**Response (200):**
```json
{
  "message": "File deleted successfully"
}
```

---

### 6. CONTENT MANAGEMENT MODULE (CMS)

#### GET /pages
Listar páginas (público)

**Query Parameters:**
```
?language=en
&status=published
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "page-uuid",
      "slug": "services",
      "title": {
        "en": "Our Services",
        "es": "Nuestros Servicios",
        "pt": "Nossos Serviços"
      },
      "status": "published",
      "publishedAt": "2025-10-28T10:00:00Z"
    }
  ]
}
```

---

#### GET /pages/:slug
Obter página por slug

**Query Parameters:**
```
?language=en
```

**Response (200):**
```json
{
  "id": "page-uuid",
  "slug": "services",
  "title": "Our Services",
  "content": "<h2>Complete Collision Repair</h2><p>We handle everything...</p>",
  "metaTitle": "Collision Repair Services Orlando | FlipCars",
  "metaDescription": "Professional collision repair services...",
  "featuredImage": "https://cdn.flipcars.us/pages/services-hero.jpg",
  "language": "en",
  "status": "published",
  "publishedAt": "2025-10-28T10:00:00Z"
}
```

---

#### POST /admin/pages
Criar página (Admin/Marketing)

**Request Body:**
```json
{
  "slug": "about-us",
  "title": {
    "en": "About Us",
    "es": "Sobre Nosotros",
    "pt": "Sobre Nós"
  },
  "content": {
    "en": "<p>FlipCars has been serving Orlando...</p>",
    "es": "<p>FlipCars ha estado sirviendo...</p>",
    "pt": "<p>FlipCars tem servido Orlando...</p>"
  },
  "metaTitle": {
    "en": "About FlipCars - Orlando Auto Body Shop"
  },
  "metaDescription": {
    "en": "Learn about FlipCars..."
  },
  "status": "draft"
}
```

**Response (201):**
```json
{
  "id": "page-uuid",
  "slug": "about-us",
  "status": "draft",
  "createdAt": "2025-10-28T18:00:00Z"
}
```

---

#### PUT /admin/pages/:id
Atualizar página

**Request Body:**
```json
{
  "status": "published",
  "content": {
    "en": "<p>Updated content...</p>"
  }
}
```

**Response (200):**
```json
{
  "id": "page-uuid",
  "status": "published",
  "publishedAt": "2025-10-28T18:30:00Z",
  "updatedAt": "2025-10-28T18:30:00Z"
}
```

---

#### GET /blog/posts
Listar posts do blog

**Query Parameters:**
```
?language=en
&status=published
&category=tips
&page=1
&limit=10
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "post-uuid",
      "slug": "5-tips-after-car-accident",
      "title": "5 Tips to Follow After a Car Accident",
      "excerpt": "If you've been in an accident...",
      "featuredImage": "https://cdn.flipcars.us/blog/...",
      "author": {
        "name": "FlipCars Team",
        "avatar": "https://cdn.flipcars.us/authors/..."
      },
      "publishedAt": "2025-10-28T10:00:00Z",
      "readTime": 5
    }
  ],
  "meta": {
    "total": 24,
    "page": 1,
    "limit": 10
  }
}
```

---

#### GET /gallery
Listar itens da galeria (Antes & Depois)

**Query Parameters:**
```
?page=1
&limit=12
&vehicleType=sedan
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "gallery-uuid",
      "title": {
        "en": "Toyota Camry - Rear End Collision Repair",
        "es": "Toyota Camry - Reparación de Colisión Trasera",
        "pt": "Toyota Camry - Reparo de Colisão Traseira"
      },
      "before": "https://cdn.flipcars.us/gallery/before-1.jpg",
      "after": "https://cdn.flipcars.us/gallery/after-1.jpg",
      "vehicleType": "sedan",
      "repairType": "collision",
      "createdAt": "2025-10-28T10:00:00Z"
    }
  ],
  "meta": {
    "total": 48,
    "page": 1,
    "limit": 12
  }
}
```

---

### 7. CLAIM MANAGEMENT MODULE (Gestão de Sinistros)

#### POST /claims
Criar sinistro (a partir de lead convertido)

**Request Body:**
```json
{
  "leadId": "lead-uuid",
  "customerId": "customer-uuid",
  "vehicleId": "vehicle-uuid",
  "estimatedValue": 3500,
  "assignedTechnician": "tech-user-uuid"
}
```

**Response (201):**
```json
{
  "id": "claim-uuid",
  "claimNumber": "CLM-2024-001234",
  "status": "intake",
  "estimatedValue": 3500,
  "createdAt": "2025-10-28T19:00:00Z"
}
```

---

#### GET /claims
Listar sinistros

**Query Parameters:**
```
?status=in_progress
&assignedTechnician=tech-user-uuid
&dateFrom=2025-10-01
&page=1
&limit=20
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "claim-uuid",
      "claimNumber": "CLM-2024-001234",
      "status": "in_progress",
      "customer": {
        "name": "Maria Silva",
        "phone": "+1-407-555-0123"
      },
      "vehicle": {
        "make": "Toyota",
        "model": "Camry",
        "year": 2020
      },
      "estimatedValue": 3500,
      "estimatedCompletionDate": "2025-11-05",
      "assignedTechnician": {
        "name": "Mike Johnson"
      },
      "createdAt": "2025-10-28T19:00:00Z"
    }
  ],
  "meta": {
    "total": 23,
    "page": 1,
    "limit": 20
  }
}
```

---

#### GET /claims/:id
Obter sinistro por ID (com timeline completa)

**Response (200):**
```json
{
  "id": "claim-uuid",
  "claimNumber": "CLM-2024-001234",
  "status": "in_progress",
  "customer": {
    "id": "customer-uuid",
    "name": "Maria Silva",
    "email": "maria.silva@email.com",
    "phone": "+1-407-555-0123",
    "preferredLanguage": "pt"
  },
  "vehicle": {
    "make": "Toyota",
    "model": "Camry",
    "year": 2020,
    "vin": "1HGBH41JXMN109186",
    "color": "Silver"
  },
  "insurance": {
    "provider": "State Farm",
    "claimNumber": "SF-2024-123456",
    "adjuster": {
      "name": "John Smith",
      "phone": "+1-555-0199"
    }
  },
  "timeline": [
    {
      "id": "timeline-1",
      "status": "intake",
      "title": "Claim Received",
      "description": "Initial intake and inspection scheduled",
      "completedBy": {
        "name": "John Doe"
      },
      "timestamp": "2025-10-28T19:00:00Z"
    },
    {
      "id": "timeline-2",
      "status": "inspection",
      "title": "Vehicle Inspected",
      "description": "Full damage assessment completed",
      "photos": [
        "https://cdn.flipcars.us/claims/inspection-1.jpg"
      ],
      "completedBy": {
        "name": "Mike Johnson"
      },
      "timestamp": "2025-10-29T10:00:00Z"
    }
  ],
  "estimatedValue": 3500,
  "actualValue": null,
  "estimatedCompletionDate": "2025-11-05",
  "actualCompletionDate": null,
  "assignedTechnician": {
    "id": "tech-uuid",
    "name": "Mike Johnson"
  },
  "createdAt": "2025-10-28T19:00:00Z",
  "updatedAt": "2025-10-29T10:30:00Z"
}
```

---

#### PUT /claims/:id
Atualizar sinistro

**Request Body:**
```json
{
  "status": "repair_in_progress",
  "actualValue": 3750,
  "notes": "Identified additional frame damage"
}
```

**Response (200):**
```json
{
  "id": "claim-uuid",
  "status": "repair_in_progress",
  "actualValue": 3750,
  "updatedAt": "2025-10-30T14:00:00Z"
}
```

---

#### POST /claims/:id/timeline
Adicionar evento à timeline

**Request Body:**
```json
{
  "status": "paint",
  "title": "Paint Job Started",
  "description": "Base coat applied, color matching complete",
  "photos": [
    "https://cdn.flipcars.us/claims/paint-1.jpg"
  ]
}
```

**Response (201):**
```json
{
  "id": "timeline-uuid",
  "status": "paint",
  "title": "Paint Job Started",
  "timestamp": "2025-10-30T15:00:00Z"
}
```

---

### 8. CUSTOMER PORTAL MODULE

#### GET /portal/auth/login
Login do cliente (via email/phone + OTP)

**Request Body:**
```json
{
  "email": "maria.silva@email.com"
}
```

**Response (200):**
```json
{
  "message": "OTP sent to email",
  "expiresIn": 300
}
```

---

#### POST /portal/auth/verify
Verificar OTP

**Request Body:**
```json
{
  "email": "maria.silva@email.com",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "customer": {
    "id": "customer-uuid",
    "name": "Maria Silva",
    "email": "maria.silva@email.com"
  }
}
```

---

#### GET /portal/claims
Listar sinistros do cliente

**Response (200):**
```json
{
  "data": [
    {
      "id": "claim-uuid",
      "claimNumber": "CLM-2024-001234",
      "status": "in_progress",
      "vehicle": {
        "make": "Toyota",
        "model": "Camry",
        "year": 2020
      },
      "estimatedCompletionDate": "2025-11-05",
      "progressPercentage": 65,
      "currentStep": "paint",
      "updatedAt": "2025-10-30T15:00:00Z"
    }
  ]
}
```

---

#### GET /portal/claims/:id
Obter detalhes do sinistro (cliente)

**Response (200):**
```json
{
  "id": "claim-uuid",
  "claimNumber": "CLM-2024-001234",
  "status": "in_progress",
  "vehicle": {
    "make": "Toyota",
    "model": "Camry",
    "year": 2020
  },
  "timeline": [
    {
      "status": "intake",
      "title": "Sinistro Recebido",
      "description": "Inspeção inicial agendada",
      "timestamp": "2025-10-28T19:00:00Z"
    },
    {
      "status": "paint",
      "title": "Pintura Iniciada",
      "description": "Camada base aplicada",
      "photos": [
        "https://cdn.flipcars.us/claims/paint-1.jpg"
      ],
      "timestamp": "2025-10-30T15:00:00Z"
    }
  ],
  "estimatedCompletionDate": "2025-11-05",
  "progressPercentage": 65,
  "currentStep": "paint"
}
```

---

#### POST /portal/claims/:id/messages
Enviar mensagem para a oficina

**Request Body:**
```json
{
  "message": "Quando posso visitar para ver o progresso?"
}
```

**Response (201):**
```json
{
  "id": "message-uuid",
  "message": "Quando posso visitar para ver o progresso?",
  "sentBy": "customer",
  "timestamp": "2025-10-30T16:00:00Z"
}
```

---

#### POST /portal/claims/:id/photos
Cliente faz upload de fotos adicionais

**Request Body:**
```json
{
  "photos": [
    "https://s3.amazonaws.com/flipcars/customer-uploads/photo1.jpg"
  ],
  "description": "Additional damage photos"
}
```

**Response (201):**
```json
{
  "message": "Photos uploaded successfully",
  "count": 1
}
```

---

### 9. COMMUNICATION MODULE

#### POST /communications/email
Enviar email

**Request Body:**
```json
{
  "to": "maria.silva@email.com",
  "template": "claim_update",
  "language": "pt",
  "data": {
    "customerName": "Maria",
    "claimNumber": "CLM-2024-001234",
    "status": "in_progress",
    "message": "Seu veículo está na fase de pintura"
  }
}
```

**Response (200):**
```json
{
  "messageId": "email-msg-uuid",
  "status": "sent",
  "sentAt": "2025-10-30T17:00:00Z"
}
```

---

#### POST /communications/sms
Enviar SMS

**Request Body:**
```json
{
  "to": "+1-407-555-0123",
  "message": "Olá Maria, seu Toyota Camry está pronto! Pode buscar amanhã às 10h. FlipCars",
  "claimId": "claim-uuid"
}
```

**Response (200):**
```json
{
  "messageId": "sms-msg-uuid",
  "status": "sent",
  "sentAt": "2025-10-30T17:05:00Z"
}
```

---

#### POST /communications/whatsapp
Enviar mensagem WhatsApp

**Request Body:**
```json
{
  "to": "+1-407-555-0123",
  "template": "claim_ready",
  "language": "pt",
  "parameters": ["Maria", "Toyota Camry"]
}
```

**Response (200):**
```json
{
  "messageId": "whatsapp-msg-uuid",
  "status": "sent",
  "sentAt": "2025-10-30T17:10:00Z"
}
```

---

### 10. ANALYTICS & REPORTING MODULE

#### GET /analytics/leads
Analytics de leads

**Query Parameters:**
```
?dateFrom=2025-10-01
&dateTo=2025-10-31
&groupBy=source
```

**Response (200):**
```json
{
  "summary": {
    "totalLeads": 156,
    "qualifiedLeads": 89,
    "convertedLeads": 34,
    "conversionRate": 21.79
  },
  "bySource": [
    {
      "source": "google_ads",
      "count": 67,
      "conversionRate": 28.4
    },
    {
      "source": "meta_ads",
      "count": 45,
      "conversionRate": 17.8
    },
    {
      "source": "organic",
      "count": 44,
      "conversionRate": 15.9
    }
  ],
  "aiPerformance": {
    "totalInteractions": 234,
    "qualificationRate": 72.5,
    "escalationRate": 15.3,
    "averageResponseTime": 1.2
  }
}
```

---

#### GET /analytics/claims
Analytics de sinistros

**Query Parameters:**
```
?dateFrom=2025-10-01
&dateTo=2025-10-31
```

**Response (200):**
```json
{
  "summary": {
    "totalClaims": 34,
    "completedClaims": 28,
    "inProgressClaims": 6,
    "averageRepairTime": 6.5,
    "averageValue": 3750
  },
  "byStatus": [
    {
      "status": "completed",
      "count": 28
    },
    {
      "status": "in_progress",
      "count": 6
    }
  ]
}
```

---

## 🔒 Segurança e Validação

### Rate Limiting
```
- /auth/login: 5 tentativas por 15 minutos
- /auth/forgot-password: 3 tentativas por hora
- /ai/chat: 50 mensagens por hora (por IP)
- Outros endpoints: 100 requisições por minuto
```

### Validação de Dados
- **Email:** RFC 5322 compliant
- **Phone:** E.164 format (+1-XXX-XXX-XXXX)
- **VIN:** 17 caracteres alfanuméricos
- **Passwords:** Mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 especial

### CORS
```javascript
{
  origin: ['https://flipcars.us', 'https://www.flipcars.us'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

---

## 📊 Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Success |
| 201 | Created - Resource created |
| 204 | No Content - Success without body |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Semantic error |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

---

## 🧪 Ambiente de Testes

**Base URL (Staging):** `https://api-staging.flipcars.us/v1`

**Credenciais de Teste:**
```json
{
  "admin": {
    "email": "admin@test.flipcars.us",
    "password": "Test@dmin123"
  },
  "attendant": {
    "email": "attendant@test.flipcars.us",
    "password": "Test@ttend123"
  }
}
```

---

**Versão:** 1.0  
**Última Atualização:** 2025-10-28  
**Status:** DRAFT - Fase 0
