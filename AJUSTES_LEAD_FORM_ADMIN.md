# Ajustes Completos: Formulário de Criação de Lead (Admin)

## 🎯 Objetivo
Tornar o formulário de criação de lead no painel admin **IDÊNTICO** ao fluxo de cotação do cliente (frontend-public), mantendo a mesma sequência, campos, diagramação e comportamento.

---

## 📋 Análise Comparativa

### ❌ ATUAL (Admin Lead Form)
Estrutura simplificada em 4 cards estáticos:
1. **Customer Information**: Name, Email, Phone, Lead Source
2. **Vehicle Information**: Make, Model, Year, License Plate
3. **Accident Information**: Date, Description
4. **Insurance Information**: Has Insurance checkbox, Company, Policy Number

**Problemas**:
- Não separa nome em First/Last Name
- Não tem seleção de tipo de serviço (Bodyshop/Mechanic)
- Não coleta photos de dano
- Não coleta VIN
- Não coleta documentos de warranty
- Não tem agendamento (data/hora preferida)
- Não tem preferências de contato
- Layout diferente do público
- Sem fluxo progressivo

---

### ✅ ESPERADO (Cliente Quote Flow)
Fluxo progressivo multi-step com validação:

#### **STEP 1: Basic Info** (Informações Básicas)
- **Service Type** (Required): 
  - Body Shop (ícone Car) - "Collision repair"
  - Mechanic (ícone Wrench) - "General repair"
- **First Name** (Required)
- **Last Name** (Required)
- **Phone** (Required) - Com máscara: (XXX) XXX-XXXX
- **Email** (Required)

#### **STEP 2: Service Details** (Detalhes do Serviço)

**Se BODYSHOP:**
- **Insurance Company** (Required): Grid com logos
  - Allstate, American Family, Nationwide, Progressive
  - State Farm, USAA, Geico, Liberty Mutual
  - Farmers, Travelers, Erie Insurance
  - "Other" (campo de texto para nome customizado)
- **Has Claim Number** (Checkbox)
  - Se YES: Campo "Claim Number"
- **Preferred Date** (Optional): Calendar picker + time slots
- **Skip Date** button

**Se MECHANIC:**
- **Warranty Company** (Required): Grid com logos
  - CARCHEX, CarShield, Endurance, Protect My Car
  - "Other" (campo de texto para nome customizado)
- **Has Warranty Claim Number** (Checkbox)
  - Se YES: Campo "Warranty Claim Number"
- **Preferred Date** (Optional): Calendar picker + time slots
- **Skip Date** button

#### **STEP 2B: Warranty Documents** (Apenas MECHANIC)
- **Upload Warranty Documents**:
  - PDF do contrato de garantia
  - Fotos da documentação
  - Drag & drop ou click to upload
  - Preview dos arquivos
  - Botão de remover
- **Continue** ou **Skip** buttons

#### **STEP 3: Photos** (Apenas BODYSHOP)
- **Upload Damage Photos**:
  - Múltiplas fotos do dano
  - Drag & drop ou click to upload
  - Preview em grid
  - Botão de remover cada foto
  - Mínimo 1 foto recomendado
- **Continue** button

#### **STEP 3A: VIN** (Apenas BODYSHOP)
- **Vehicle VIN** (Optional):
  - Campo de texto para VIN de 17 caracteres
  - Tooltip explicativo
  - Validação de formato
- **Skip** ou **Continue** buttons

#### **STEP 4: Contact Preferences** (Final antes da confirmação)
- **How would you like us to contact you?**:
  - Phone call (radio button)
  - Text message (radio button)
  - Email (radio button)
- **Best time to reach you**:
  - Morning (9AM - 12PM)
  - Afternoon (12PM - 5PM)
  - Evening (5PM - 8PM)
- **Additional Notes** (Optional textarea)

#### **STEP 5/6: Confirmation** (Review antes de enviar)
- Review de todos os dados coletados
- Botões de "Edit" em cada seção
- Botão final "Submit"
- Success message com Reference Number

---

## 🔧 Ajustes Necessários

### 1. **Criar Multi-Step Form Component**

**Arquivo**: `/frontend-admin/src/components/forms/LeadFormMultiStep.tsx`

Estrutura:
```tsx
- Progress bar (Step X of Y, percentage)
- State management para currentStep
- Navegação between steps (Next, Back)
- Data persistence entre steps
- Validação por step
```

### 2. **Step 1: Basic Info**

**Campos a ADICIONAR**:
- ✅ `serviceType` (radio buttons com icons)
- ✅ Separar `name` em `firstName` e `lastName`
- ✅ Aplicar máscara no `phone`: (XXX) XXX-XXXX

**Campos a REMOVER**:
- ❌ `source` (Lead Source) - Mover para campo hidden com valor "admin_created"

**Validação**:
- Todos campos required
- Phone: exatamente 14 caracteres com máscara
- Email: formato válido

### 3. **Step 2: Service Details**

**Se serviceType === 'bodyshop'**:
- ✅ Grid de Insurance Companies com logos
- ✅ Campo "Other" para insurance customizada
- ✅ Checkbox "Has Claim Number"
- ✅ Campo conditional `claimNumber`
- ✅ Date picker para `preferredDate`
- ✅ Time slots selector
- ✅ Botão "Skip Date"

**Se serviceType === 'mechanic'**:
- ✅ Grid de Warranty Companies com logos
- ✅ Campo "Other" para warranty customizada
- ✅ Checkbox "Has Warranty Claim Number"
- ✅ Campo conditional `warrantyClaimNumber`
- ✅ Date picker para `preferredDate`
- ✅ Time slots selector
- ✅ Botão "Skip Date"

**Campos a MOVER**:
- Move `vehicleMake`, `vehicleModel`, `vehicleYear` para dentro deste step (inline)

### 4. **Step 2B: Warranty Documents** (Apenas Mechanic)

**Novo componente**: `Step2bWarrantyDocs.tsx`

**Funcionalidade**:
- ✅ Upload de múltiplos arquivos (PDF, images)
- ✅ Suporte a drag & drop
- ✅ Preview dos arquivos
- ✅ Botão de remover cada arquivo
- ✅ Validação de tamanho/tipo
- ✅ Armazenar URLs no `warrantyDocuments[]`
- ✅ Botão "Skip" (opcional)

**Integração**:
- Usar Supabase Storage para upload
- Salvar URLs no array `warrantyDocuments`

### 5. **Step 3: Damage Photos** (Apenas Bodyshop)

**Novo componente**: `Step3Photos.tsx`

**Funcionalidade**:
- ✅ Upload de múltiplas imagens
- ✅ Suporte a drag & drop
- ✅ Preview em grid responsivo
- ✅ Botão de remover cada foto
- ✅ Validação de tipo (apenas images)
- ✅ Compressão de imagens (opcional)
- ✅ Armazenar URLs no `damagePhotos[]`

**Integração**:
- Usar Supabase Storage bucket: `lead-photos`
- Salvar URLs no array `damagePhotos`

### 6. **Step 3A: VIN Entry** (Apenas Bodyshop)

**Novo componente**: `Step3aVIN.tsx`

**Funcionalidade**:
- ✅ Campo de texto para VIN (17 caracteres)
- ✅ Validação de formato VIN
- ✅ Tooltip explicativo
- ✅ Campo opcional (botão Skip)
- ✅ Salvar em `vehicleVIN`

### 7. **Step 4: Contact Preferences**

**Novo componente**: `Step4Contact.tsx`

**Campos**:
- ✅ `preferredContactMethod` (radio: phone, text, email)
- ✅ `bestTimeToReach` (checkboxes: morning, afternoon, evening)
- ✅ `additionalNotes` (textarea opcional)

### 8. **Step 5/6: Confirmation & Review**

**Novo componente**: `Step5Confirmation.tsx`

**Funcionalidade**:
- ✅ Review completo de todos os dados
- ✅ Seções editáveis (botão Edit que volta ao step correto)
- ✅ Botão final "Create Lead"
- ✅ Loading state durante submit
- ✅ Success message com Reference Number gerado
- ✅ Botão "View Lead" que redireciona para detalhes

---

## 🎨 Diagramação e Estilos

### Cores e Tema
```css
/* Gold/Black Theme (seguir frontend-public) */
--gold: #D4AF37
--gold-dark: #B8941F
--black: #000000
--neutral-300: #D4D4D4
--neutral-600: #525252
--neutral-700: #404040
```

### Layout
- **Max Width**: 3xl (48rem / 768px)
- **Padding**: 6-8 (1.5rem - 2rem)
- **Background**: White cards com shadow-lg
- **Border Radius**: lg (0.5rem)
- **Font Size**: Base no mobile (16px), sm no desktop (14px)

### Progress Bar
```tsx
<div className="mb-6">
  <div className="flex justify-between mb-2">
    <span className="text-sm font-medium text-gray-700">
      Step {currentStep} of {maxSteps}
    </span>
    <span className="text-sm text-gray-500">
      {Math.round(progressPercentage)}% complete
    </span>
  </div>
  <div className="h-2 bg-gray-200 rounded-full">
    <div 
      className="h-full bg-[#D4AF37] transition-all duration-300"
      style={{ width: `${progressPercentage}%` }}
    />
  </div>
</div>
```

### Botões
- **Primary** (Continue): Gold background, black text, semibold
- **Outline** (Back/Cancel): Black border, black text, hover:bg-black hover:text-white
- **Skip**: Secondary style

### Form Fields
```tsx
<input 
  className="w-full px-3 py-2.5 text-base md:text-sm 
             text-gray-900 placeholder:text-gray-600 
             border border-neutral-300 rounded-lg 
             focus:ring-2 focus:ring-gold focus:border-gold 
             outline-none transition-colors"
/>
```

---

## 📊 Fluxo de Navegação

### Bodyshop (6 Steps)
```
1. Basic Info (firstName, lastName, phone, email, serviceType)
   ↓
2. Service Details (insuranceCompany, claimNumber, preferredDate, vehicle)
   ↓
3. Photos (damagePhotos[])
   ↓
4. VIN (vehicleVIN - optional)
   ↓
5. Contact (preferredContactMethod, bestTimeToReach, notes)
   ↓
6. Confirmation (review + submit)
```

### Mechanic (5 Steps)
```
1. Basic Info (firstName, lastName, phone, email, serviceType)
   ↓
2. Service Details (warrantyCompany, warrantyClaimNumber, preferredDate, vehicle)
   ↓
3. Warranty Docs (warrantyDocuments[] - optional)
   ↓
4. Contact (preferredContactMethod, bestTimeToReach, notes)
   ↓
5. Confirmation (review + submit)
```

---

## 🗂️ Estrutura de Dados

### Lead Entity (Backend)
Campos a ADICIONAR:
```typescript
firstName: string;
lastName: string;
serviceType: 'bodyshop' | 'mechanic';
warrantyCompany?: string;
warrantyClaimNumber?: string;
warrantyDocuments?: string[]; // Array de URLs
vehicleVIN?: string;
preferredContactMethod?: 'phone' | 'text' | 'email';
bestTimeToReach?: string[]; // ['morning', 'afternoon', 'evening']
additionalNotes?: string;
preferredDate?: Date;
preferredTimeSlot?: string;
```

Campos a MODIFICAR:
```typescript
name: string; // Será gerado como `${firstName} ${lastName}`
insuranceCompany?: string; // Aceitar "Other: CustomName"
```

---

## 📁 Arquivos a Criar/Modificar

### Criar:
1. `/frontend-admin/src/components/forms/LeadFormMultiStep.tsx`
2. `/frontend-admin/src/components/forms/lead-steps/Step1BasicInfo.tsx`
3. `/frontend-admin/src/components/forms/lead-steps/Step2ServiceDetails.tsx`
4. `/frontend-admin/src/components/forms/lead-steps/Step2bWarrantyDocs.tsx`
5. `/frontend-admin/src/components/forms/lead-steps/Step3Photos.tsx`
6. `/frontend-admin/src/components/forms/lead-steps/Step3aVIN.tsx`
7. `/frontend-admin/src/components/forms/lead-steps/Step4Contact.tsx`
8. `/frontend-admin/src/components/forms/lead-steps/Step5Confirmation.tsx`
9. `/frontend-admin/src/lib/validations/lead-steps.schemas.ts`

### Modificar:
1. `/frontend-admin/src/app/dashboard/leads/new/page.tsx` - Usar LeadFormMultiStep
2. `/backend/src/database/entities/lead.entity.ts` - Adicionar novos campos
3. `/backend/src/modules/leads/dto/create-lead.dto.ts` - Validação dos novos campos
4. `/backend/src/database/migrations/XXXXX-add-lead-form-fields.ts` - Migration

---

## 🔄 Integração com Supabase Storage

### Upload de Photos (Bodyshop)
```typescript
// Upload para bucket: lead-photos
const uploadPhoto = async (file: File, leadId: string) => {
  const path = `${leadId}/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from('lead-photos')
    .upload(path, file);
  
  if (error) throw error;
  
  const { data: urlData } = supabase.storage
    .from('lead-photos')
    .getPublicUrl(path);
  
  return urlData.publicUrl;
};
```

### Upload de Warranty Docs (Mechanic)
```typescript
// Upload para bucket: warranty-documents
const uploadWarrantyDoc = async (file: File, leadId: string) => {
  const path = `${leadId}/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from('warranty-documents')
    .upload(path, file);
  
  if (error) throw error;
  
  const { data: urlData } = supabase.storage
    .from('warranty-documents')
    .getPublicUrl(path);
  
  return urlData.publicUrl;
};
```

---

## ✅ Checklist de Implementação

### Phase 1: Estrutura Base
- [ ] Criar componente LeadFormMultiStep com state management
- [ ] Implementar progress bar
- [ ] Criar sistema de navegação between steps
- [ ] Adicionar validação por step

### Phase 2: Steps Básicos
- [ ] Step 1: Basic Info (serviceType, firstName, lastName, phone, email)
- [ ] Step 2: Service Details (insurance/warranty, claim number, date picker)
- [ ] Step 4: Contact Preferences

### Phase 3: Steps Condicionais
- [ ] Step 2B: Warranty Documents (apenas mechanic)
- [ ] Step 3: Damage Photos (apenas bodyshop)
- [ ] Step 3A: VIN Entry (apenas bodyshop)

### Phase 4: Confirmação e Submit
- [ ] Step 5/6: Confirmation com review completo
- [ ] Submit final para backend
- [ ] Success message com reference number

### Phase 5: Backend
- [ ] Adicionar novos campos no Lead Entity
- [ ] Criar migration para novos campos
- [ ] Atualizar DTOs de validação
- [ ] Testar criação via admin

### Phase 6: Supabase Storage
- [ ] Criar buckets: lead-photos, warranty-documents
- [ ] Implementar upload de photos
- [ ] Implementar upload de warranty docs
- [ ] Configurar permissões dos buckets

### Phase 7: Testes & Refinamento
- [ ] Testar fluxo bodyshop completo
- [ ] Testar fluxo mechanic completo
- [ ] Validar uploads funcionando
- [ ] Testar navegação back/forward
- [ ] Validar dados salvos corretamente
- [ ] Ajustar estilos para match exato

---

## 🎯 Resultado Final

Após implementação completa:

✅ **Formulário admin IDÊNTICO ao fluxo público**
✅ **Mesma sequência de campos**
✅ **Mesma diagramação visual**
✅ **Mesmos comportamentos (validação, navegação)**
✅ **Upload de photos e documentos**
✅ **Suporte a bodyshop E mechanic**
✅ **Agendamento com date/time picker**
✅ **Preferências de contato**
✅ **Confirmação antes de criar**

**Diferença**: Campo "source" automaticamente preenchido como "admin_created" para distinguir leads criados pelo admin vs pelo cliente.

---

## 📝 Notas de Implementação

1. **Reusar Componentes**: Copiar components do frontend-public e adaptar paths
2. **Validação**: Reusar schemas de validação do frontend-public
3. **Estilos**: Manter gold theme e classes Tailwind idênticas
4. **UX**: Manter botões Cancel/Back sempre visíveis
5. **Mobile**: Garantir responsividade em todos os steps
6. **Performance**: Lazy load de imagens no preview
7. **Errors**: Mostrar mensagens claras de validação
8. **Loading**: Estados de loading durante uploads

---

**Status**: 📋 Planejamento Completo - Pronto para Implementação
