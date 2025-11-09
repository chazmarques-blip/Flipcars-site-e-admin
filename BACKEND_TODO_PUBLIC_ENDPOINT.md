# 🚨 BACKEND: Criar Endpoint Público para Formulário de Estimate

## Problema Atual

O formulário de estimate em **www.flipcars.us** está funcionando, mas **NÃO está enviando dados para o backend** porque:

1. ❌ Endpoint `/api/leads` requer autenticação (401 Unauthorized)
2. ❌ Não existe endpoint público para receber submissões do site
3. ❌ Frontend não pode usar token de autenticação (seria inseguro expor no client)

## Solução Temporária Atual

- ✅ Dados são salvos em **localStorage** do navegador
- ✅ Reference number é gerado no frontend
- ✅ Usuário recebe confirmação
- ❌ **Dados NÃO aparecem no admin dashboard**

## Solução Permanente Necessária

### 1. Criar Endpoint Público no Backend (NestJS)

**Endpoint:** `POST /api/public/leads` ou `POST /api/public/estimate-request`

**Características:**
- ✅ **Sem autenticação** (público)
- ✅ Rate limiting para prevenir spam
- ✅ Validação de dados
- ✅ Geração automática de reference number
- ✅ Salva no banco de dados PostgreSQL
- ✅ Envia email de confirmação (opcional)
- ✅ Webhook/notification para equipe (opcional)

### 2. Schema do Request Body

```typescript
{
  // Customer information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Service details
  serviceType: 'bodyshop' | 'mechanic';
  damageDescription?: string;  // For bodyshop
  issueDescription?: string;   // For mechanic
  
  // Vehicle information
  vehicle?: {
    vin?: string;
    year?: number;
    make?: string;
    model?: string;
  };
  
  // Insurance (bodyshop only)
  hasInsurance?: boolean;
  insuranceInfo?: {
    provider?: string;
    policyNumber?: string;
    claimNumber?: string;
  };
  
  // Scheduling
  preferredDate?: string;  // ISO date
  preferredTime?: string;
  
  // Contact preferences
  contactPreferences?: {
    phoneCall?: boolean;
    textMessage?: boolean;
    whatsapp?: boolean;
  };
  
  // Files (URLs ou base64)
  photos?: string[];
  warrantyDocs?: string[];
  
  // Metadata
  source: 'website_estimate_form';
}
```

### 3. Schema do Response

```typescript
{
  id: string;              // UUID do lead criado
  referenceNumber: string; // Ex: "FL-2025-1234"
  status: 'new';
  createdAt: string;       // ISO timestamp
}
```

### 4. Exemplo de Implementação NestJS

**Arquivo:** `backend/src/public/public-leads.controller.ts`

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { LeadsService } from '../leads/leads.service';
import { CreatePublicLeadDto } from './dto/create-public-lead.dto';

@Controller('public')
export class PublicLeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post('leads')
  async createPublicLead(@Body() dto: CreatePublicLeadDto) {
    // Generate reference number
    const referenceNumber = this.generateReferenceNumber();
    
    // Create lead in database
    const lead = await this.leadsService.create({
      ...dto,
      referenceNumber,
      status: 'new',
      source: 'website_estimate_form',
    });
    
    // TODO: Send confirmation email
    // TODO: Notify team via webhook
    
    return {
      id: lead.id,
      referenceNumber: lead.referenceNumber,
      status: lead.status,
      createdAt: lead.createdAt,
    };
  }
  
  private generateReferenceNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `FL-${year}-${random}`;
  }
}
```

**Arquivo:** `backend/src/public/dto/create-public-lead.dto.ts`

```typescript
import { IsString, IsEmail, IsOptional, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class VehicleDto {
  @IsOptional()
  @IsString()
  vin?: string;

  @IsOptional()
  year?: number;

  @IsOptional()
  @IsString()
  make?: string;

  @IsOptional()
  @IsString()
  model?: string;
}

class InsuranceInfoDto {
  @IsOptional()
  @IsString()
  provider?: string;

  @IsOptional()
  @IsString()
  policyNumber?: string;

  @IsOptional()
  @IsString()
  claimNumber?: string;
}

class ContactPreferencesDto {
  @IsOptional()
  @IsBoolean()
  phoneCall?: boolean;

  @IsOptional()
  @IsBoolean()
  textMessage?: boolean;

  @IsOptional()
  @IsBoolean()
  whatsapp?: boolean;
}

export class CreatePublicLeadDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  serviceType: 'bodyshop' | 'mechanic';

  @IsOptional()
  @IsString()
  damageDescription?: string;

  @IsOptional()
  @IsString()
  issueDescription?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => VehicleDto)
  vehicle?: VehicleDto;

  @IsOptional()
  @IsBoolean()
  hasInsurance?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => InsuranceInfoDto)
  insuranceInfo?: InsuranceInfoDto;

  @IsOptional()
  @IsString()
  preferredDate?: string;

  @IsOptional()
  @IsString()
  preferredTime?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ContactPreferencesDto)
  contactPreferences?: ContactPreferencesDto;

  @IsOptional()
  photos?: string[];

  @IsOptional()
  warrantyDocs?: string[];
}
```

### 5. Rate Limiting (Proteção contra Spam)

**Arquivo:** `backend/src/public/public-leads.controller.ts`

```typescript
import { Throttle } from '@nestjs/throttler';

@Controller('public')
export class PublicLeadsController {
  
  @Post('leads')
  @Throttle(5, 60) // Max 5 requests por minuto
  async createPublicLead(@Body() dto: CreatePublicLeadDto) {
    // ...
  }
}
```

### 6. CORS Configuration

Certifique-se de que o backend permite requests de `www.flipcars.us`:

**Arquivo:** `backend/src/main.ts`

```typescript
app.enableCors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://admin.flipcars.us',
    'https://www.flipcars.us',
    'https://*.vercel.app'
  ],
  credentials: true,
});
```

---

## Checklist de Implementação

### Backend (NestJS)
- [ ] Criar `PublicLeadsController`
- [ ] Criar `CreatePublicLeadDto`
- [ ] Implementar rate limiting
- [ ] Configurar CORS para www.flipcars.us
- [ ] Testar endpoint com Postman/curl
- [ ] Deploy para Railway

### Frontend (Next.js - frontend-public)
- [ ] Atualizar `leadsService.createLead()` para usar endpoint público
- [ ] Remover fallback localStorage quando endpoint estiver pronto
- [ ] Testar submissão de formulário
- [ ] Verificar dados no admin dashboard
- [ ] Deploy para Vercel

---

## Testes

### 1. Test Manual com curl

```bash
curl -X POST https://upbeat-dedication-production.up.railway.app/api/public/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "serviceType": "bodyshop",
    "damageDescription": "Front bumper damage",
    "vehicle": {
      "year": 2023,
      "make": "Toyota",
      "model": "Camry"
    },
    "preferredDate": "2025-11-15",
    "preferredTime": "morning"
  }'
```

**Expected Response:**
```json
{
  "id": "uuid-here",
  "referenceNumber": "FL-2025-1234",
  "status": "new",
  "createdAt": "2025-11-09T12:00:00.000Z"
}
```

### 2. Verificar no Admin

Após criar o lead via endpoint público:

1. Login no admin: https://admin.flipcars.us
2. Ir para /dashboard/leads
3. Verificar se o novo lead aparece na lista

---

## Prioridade

⚠️ **ALTA PRIORIDADE**

Sem esse endpoint, o formulário do site público **NÃO funciona corretamente**:
- ❌ Dados não são salvos no banco
- ❌ Admin não vê as solicitações
- ❌ Equipe não é notificada
- ❌ Não há rastreamento dos leads

---

## Alternativa Temporária

Enquanto o endpoint não é criado, os dados estão sendo salvos em **localStorage** do navegador do usuário. 

Para recuperar esses dados manualmente:

```javascript
// No console do navegador em www.flipcars.us
const leads = JSON.parse(localStorage.getItem('flipcars_pending_leads') || '[]');
console.log(leads);
```

---

**Status Atual:** ⏳ Aguardando implementação no backend  
**Última Atualização:** 2025-11-09
