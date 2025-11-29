# 🔧 MOCKUP: Melhorias no Fluxo Mecânico (Mechanic Service)

**Data:** 2025-11-28  
**Status:** 📋 Mockup para Aprovação  
**Objetivo:** Visualizar mudanças antes de aplicar em produção

---

## 🎯 MUDANÇAS PROPOSTAS

### 1. **Condicional: Ocultar Step 2b (Warranty Docs) para Self-Pay**
   - Se cliente escolher "Private (Self-Pay)" ou "Other"
   - Pular direto para Step 3 (Photos)
   - Não mostrar tela de Warranty Documents

### 2. **Novo Serviço: "Troca de Óleo e Revisão GRÁTIS"**
   - Adicionar como PRIMEIRO botão na lista de serviços
   - Destacar que mão de obra é gratuita
   - Cliente paga apenas pelos produtos (óleo, filtros)

---

## 📱 MOCKUP: FLUXO VISUAL

### STEP 2: Service Details (Mechanic)

```
┌─────────────────────────────────────────────┐
│  Step 2 of 6                          33%   │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░        │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Who will pay for the repair? *             │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  ✓  💰                                │ │
│  │     Private (Self-Pay)                │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌─────────────┐  ┌─────────────────────┐ │
│  │  CARCHEX    │  │    CarShield        │ │
│  └─────────────┘  └─────────────────────┘ │
│                                             │
│  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Endurance  │  │    ProGuard         │ │
│  └─────────────┘  └─────────────────────┘ │
│                                             │
│  [... mais opções ...]                     │
│                                             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  ℹ️  Since you're paying out of pocket,     │
│     you can skip scheduling and we'll       │
│     contact you to arrange an appointment.  │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  When would you like to bring your car?    │
│  (Optional for self-pay customers)          │
│                                             │
│  [Select Date ▼]  [Skip Date]              │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  [← Back]              [Continue →]         │
└─────────────────────────────────────────────┘
```

**RESULTADO:** Se "Private (Self-Pay)" ou "Other" selecionado:
- ✅ Pula Step 2b (Warranty Documents)
- ✅ Vai direto para Step 3 (Photos)
- ✅ **Novo Step count: Step 3 of 5** (em vez de 6)

---

### STEP 2b: Warranty Documents (OCULTO PARA SELF-PAY)

```
❌ ESTA TELA NÃO APARECE SE:
   - warrantyCompany === "Private (Self-Pay)"
   - warrantyCompany === "Other"

✅ ESTA TELA APARECE SE:
   - warrantyCompany === "CARCHEX"
   - warrantyCompany === "CarShield"
   - warrantyCompany === "Endurance"
   - warrantyCompany === qualquer outra garantia
```

---

## 🆕 MOCKUP: NOVO SERVIÇO - TROCA DE ÓLEO GRÁTIS

### STEP 2b: Issue Selection (Atualizado)

```
┌─────────────────────────────────────────────┐
│  Step 3 of 6                          50%   │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░        │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Warranty Documents                         │
│  Upload documents to help us verify your    │
│  warranty coverage                          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  [Policy Doc]  [VIN Number]  [Odometer]    │
│   Required      Required      Required      │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Select Issue Type *                        │
│  Check all that apply                       │
│                                             │
│  ┌─────────────────┐  ┌─────────────────┐ │
│  │ 🛢️ Oil Change &  │  │ 🔧 Engine       │ │
│  │   FREE Checkup*  │  │                 │ │
│  │   ⭐ FREE LABOR  │  │                 │ │
│  └─────────────────┘  └─────────────────┘ │
│                                             │
│  ┌─────────────────┐  ┌─────────────────┐ │
│  │ ⚙️ Transmission │  │ ⚡ Electrical    │ │
│  │                 │  │   System        │ │
│  └─────────────────┘  └─────────────────┘ │
│                                             │
│  ┌─────────────────┐  ┌─────────────────┐ │
│  │ ❄️ Cooling      │  │ ⛽ Fuel System  │ │
│  │   System        │  │                 │ │
│  └─────────────────┘  └─────────────────┘ │
│                                             │
│  ┌─────────────────┐  ┌─────────────────┐ │
│  │ 🎯 Steering     │  │ 🛞 Suspension   │ │
│  │                 │  │                 │ │
│  └─────────────────┘  └─────────────────┘ │
│                                             │
│  ┌─────────────────┐  ┌─────────────────┐ │
│  │ 🛑 Brakes       │  │ 🌬️ A/C System   │ │
│  │                 │  │                 │ │
│  └─────────────────┘  └─────────────────┘ │
│                                             │
│  ┌─────────────────┐                       │
│  │ 📝 Other        │                       │
│  │ (describe below)│                       │
│  └─────────────────┘                       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  ⚠️  FREE OIL CHANGE PROMOTION              │
│                                             │
│  ✅ Labor is 100% FREE                      │
│  ✅ Complete vehicle inspection included    │
│  ✅ You only pay for:                       │
│     • Oil (synthetic or conventional)       │
│     • Oil filter                            │
│     • Any additional parts needed           │
│                                             │
│  📋 What's Included:                        │
│     • Professional oil change               │
│     • Multi-point inspection                │
│     • Fluid level check                     │
│     • Tire pressure check                   │
│     • Brake inspection                      │
│     • Battery test                          │
│                                             │
│  ⏱️  Service Time: 30-45 minutes           │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Describe the Symptoms *                    │
│  What are you experiencing with your        │
│  vehicle? (Required - minimum 10 chars)     │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ I need an oil change and would like │   │
│  │ to take advantage of the free       │   │
│  │ inspection service. My car has      │   │
│  │ about 5,000 miles since last change.│   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│  ✓ Looks good!         78/10 characters    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  [← Back]              [Continue →]         │
└─────────────────────────────────────────────┘
```

---

## 📊 COMPARAÇÃO: ANTES vs DEPOIS

### FLUXO ANTERIOR (Com Garantia)

```
Step 1: Basic Info
   ↓
Step 2: Service Details (escolhe garantia)
   ↓
Step 2b: Warranty Documents ✅ SEMPRE APARECE
   ↓
Step 3: Photos
   ↓
Step 4: Contact
   ↓
Step 5: Confirmation

TOTAL: 6 steps
```

### FLUXO NOVO (Self-Pay)

```
Step 1: Basic Info
   ↓
Step 2: Service Details (escolhe Self-Pay)
   ↓
Step 2b: Warranty Documents ❌ PULADO!
   ↓
Step 3: Photos
   ↓
Step 4: Contact
   ↓
Step 5: Confirmation

TOTAL: 5 steps (mais rápido!)
```

### FLUXO NOVO (Com Garantia)

```
Step 1: Basic Info
   ↓
Step 2: Service Details (escolhe CARCHEX/outra)
   ↓
Step 2b: Warranty Documents ✅ APARECE
   ↓  (agora com opção "Oil Change & FREE Checkup")
Step 3: Photos
   ↓
Step 4: Contact
   ↓
Step 5: Confirmation

TOTAL: 6 steps (normal)
```

---

## 🔧 DETALHES TÉCNICOS DA IMPLEMENTAÇÃO

### 1. Lógica Condicional do Step 2b

```typescript
// No componente EstimateForm.tsx ou Step2ServiceDetails.tsx

const shouldShowWarrantyDocs = (warrantyCompany: string): boolean => {
  const selfPayOptions = ['Private (Self-Pay)', 'Other'];
  return !selfPayOptions.includes(warrantyCompany);
};

// Uso no fluxo:
if (currentStep === 2 && serviceType === 'mechanic') {
  if (!shouldShowWarrantyDocs(formData.warrantyCompany)) {
    // Pular Step 2b, ir direto para Step 3
    setCurrentStep(3);
  } else {
    // Mostrar Step 2b normalmente
    setCurrentStep(2.5); // ou usar estado intermediário
  }
}
```

### 2. Nova Categoria de Serviço

```typescript
// Atualizar WARRANTY_CATEGORIES em Step2bWarrantyDocs.tsx

const WARRANTY_CATEGORIES = [
  // ⭐ NOVO - Primeiro na lista
  { 
    id: 'oil-change-free', 
    label: 'Oil Change & FREE Checkup*', 
    icon: '🛢️',
    isFreeService: true, // flag especial
  },
  // Existentes
  { id: 'engine', label: 'Engine', icon: '🔧' },
  { id: 'transmission', label: 'Transmission', icon: '⚙️' },
  // ... resto
] as const;
```

### 3. Informação sobre Serviço Gratuito

```typescript
// Adicionar Info Box após seleção de "Oil Change & FREE Checkup"

{selectedIssues.includes('oil-change-free') && (
  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
    <div className="flex items-start gap-2">
      <div className="text-2xl">⭐</div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-green-900 mb-1">
          FREE Oil Change Promotion!
        </h4>
        <ul className="text-xs text-green-800 space-y-1">
          <li>✅ <strong>Labor is 100% FREE</strong></li>
          <li>✅ Complete vehicle inspection included</li>
          <li>✅ You only pay for:</li>
          <li className="ml-4">• Oil (synthetic or conventional)</li>
          <li className="ml-4">• Oil filter</li>
          <li className="ml-4">• Any additional parts needed</li>
        </ul>
        <div className="mt-2 pt-2 border-t border-green-300">
          <p className="text-xs font-semibold text-green-900 mb-1">
            📋 What's Included:
          </p>
          <ul className="text-xs text-green-800 space-y-0.5">
            <li>• Professional oil change</li>
            <li>• Multi-point inspection</li>
            <li>• Fluid level check</li>
            <li>• Tire pressure check</li>
            <li>• Brake inspection</li>
            <li>• Battery test</li>
          </ul>
          <p className="text-xs text-green-700 mt-2">
            ⏱️ Service Time: 30-45 minutes
          </p>
        </div>
      </div>
    </div>
  </div>
)}
```

### 4. Atualizar Progress Bar

```typescript
// Calcular total de steps dinamicamente

const getTotalSteps = (serviceType: ServiceType, warrantyCompany?: string): number => {
  if (serviceType === 'bodyshop') {
    return 5; // Basic, Service, Photos, Contact, Confirmation
  }
  
  if (serviceType === 'mechanic') {
    const isSelfPay = warrantyCompany && 
      ['Private (Self-Pay)', 'Other'].includes(warrantyCompany);
    
    return isSelfPay ? 5 : 6; // Pula Warranty Docs se self-pay
  }
  
  return 5; // default
};

// Atualizar display
const totalSteps = getTotalSteps(serviceType, formData.warrantyCompany);
<div>Step {currentStep} of {totalSteps}</div>
```

---

## 🎨 VISUAL DO BOTÃO "OIL CHANGE FREE"

```
┌─────────────────────────────────────┐
│ 🛢️  Oil Change & FREE Checkup*      │
│     ⭐ FREE LABOR - You Pay Parts   │
│     [✓ SELECTED]                    │
└─────────────────────────────────────┘

CSS Classes (quando selecionado):
- border-2 border-green-500
- bg-green-50
- shadow-lg shadow-green-200
- ring-2 ring-green-300

CSS Classes (não selecionado):
- border-2 border-gold
- bg-white
- hover:border-gold
- hover:bg-gold/10
```

---

## ✅ CHECKLIST DE VALIDAÇÃO

### Antes de Aprovar o Mockup:

- [ ] O fluxo de Self-Pay está claro?
- [ ] O novo serviço "Oil Change FREE" está bem posicionado?
- [ ] Os termos da promoção estão claros?
- [ ] O destaque visual é adequado?
- [ ] A lógica de pular Step 2b faz sentido?
- [ ] Os textos estão em inglês correto?
- [ ] A info box verde é atraente?

### Após Aprovação, Implementar:

- [ ] Adicionar lógica condicional no EstimateForm
- [ ] Atualizar WARRANTY_CATEGORIES com novo item
- [ ] Adicionar Info Box verde para promoção
- [ ] Atualizar cálculo de totalSteps
- [ ] Testar fluxo Self-Pay (deve pular Step 2b)
- [ ] Testar fluxo com Garantia (deve mostrar Step 2b)
- [ ] Testar seleção do "Oil Change FREE"
- [ ] Verificar validações
- [ ] Testar em mobile
- [ ] Testar submissão final

---

## 📋 TEXTOS EM INGLÊS PARA COPIAR

### Botão Principal
```
Oil Change & FREE Checkup*
```

### Subtítulo
```
⭐ FREE LABOR - You Pay Only for Parts
```

### Info Box - Título
```
FREE Oil Change Promotion!
```

### Info Box - Conteúdo
```
✅ Labor is 100% FREE
✅ Complete vehicle inspection included
✅ You only pay for:
   • Oil (synthetic or conventional)
   • Oil filter
   • Any additional parts needed

📋 What's Included:
   • Professional oil change
   • Multi-point inspection
   • Fluid level check
   • Tire pressure check
   • Brake inspection
   • Battery test

⏱️ Service Time: 30-45 minutes
```

### Termos e Condições (opcional para footer)
```
* Free labor promotion applies to standard oil change service only. 
Customer pays for oil, filter, and any additional parts or services. 
Synthetic oil may have additional cost. Some restrictions may apply.
```

---

## 🚀 PRÓXIMOS PASSOS

### 1. REVISÃO DO MOCKUP
- [ ] Revisar este documento
- [ ] Aprovar ou sugerir mudanças
- [ ] Confirmar textos em inglês

### 2. IMPLEMENTAÇÃO
- [ ] Criar branch: `feature/mechanic-improvements`
- [ ] Implementar lógica condicional
- [ ] Adicionar novo serviço
- [ ] Adicionar info boxes
- [ ] Testar localmente

### 3. TESTES
- [ ] Testar Self-Pay (pula Step 2b)
- [ ] Testar com Garantia (mostra Step 2b)
- [ ] Testar novo serviço "Oil Change FREE"
- [ ] Verificar progress bar
- [ ] Testar submissão

### 4. DEPLOY
- [ ] Commit e push
- [ ] Deploy para produção
- [ ] Verificar em produção
- [ ] Monitorar conversões

---

## 💬 FEEDBACK E APROVAÇÃO

**Para aprovar este mockup, confirme:**

1. ✅ O fluxo de pular Step 2b para Self-Pay está OK?
2. ✅ O novo serviço "Oil Change FREE" está bem posicionado?
3. ✅ Os textos da promoção estão claros e atrativos?
4. ✅ O visual do botão destaca adequadamente?
5. ✅ Alguma mudança necessária?

**Após aprovação, vou implementar em código real!** 🚀

---

**Versão do Mockup:** 1.0  
**Data:** 2025-11-28  
**Status:** ⏳ Aguardando Aprovação
