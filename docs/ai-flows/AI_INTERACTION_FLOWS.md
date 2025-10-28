# FlipCars 2.0 - AI Interaction Flows

## 📋 Visão Geral

Este documento descreve os fluxos de interação do sistema de IA (ChatGPT) com leads e usuários da plataforma FlipCars.

---

## 🤖 Agentes de IA

### 1. Lead Qualification Agent (Site Público)
**Objetivo:** Qualificar leads, coletar informações essenciais e determinar prioridade

### 2. Response Suggestion Agent (Dashboard Admin)
**Objetivo:** Sugerir respostas para agentes humanos

### 3. Content Generation Agent (Dashboard Admin)
**Objetivo:** Gerar emails, SMS e resumos de conversas

---

## 🔄 Fluxo Principal: Lead Qualification

```
┌─────────────────────────────────────────────────────────────────┐
│                    INÍCIO DA INTERAÇÃO                           │
│              (Lead abre chat widget no site)                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: GREETING & LANGUAGE DETECTION                           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  IA: "Hi! I'm FlipCars virtual assistant. How can I help you    │
│       today?"                                                     │
│  OU: "¡Hola! Soy el asistente virtual de FlipCars..."           │
│  OU: "Olá! Sou o assistente virtual da FlipCars..."             │
│                                                                   │
│  Action:                                                          │
│  • Detectar idioma da primeira mensagem do usuário               │
│  • Registrar sessão em ai_conversations                          │
│  • Iniciar coleta de dados                                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: UNDERSTAND NEED & COLLECT BASIC INFO                   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  User: "I was in an accident and need repairs"                   │
│                                                                   │
│  IA Analysis:                                                     │
│  • Intent Recognition: COLLISION_REPAIR                          │
│  • Sentiment: NEUTRAL/STRESSED                                   │
│  • Priority: MEDIUM                                               │
│                                                                   │
│  IA Response:                                                     │
│  "I'm sorry to hear about your accident. I'm here to help!      │
│   Let me collect some information to assist you better.          │
│   First, what's your name?"                                      │
│                                                                   │
│  Data Collection Starts:                                          │
│  ✓ Name                                                           │
│  ✓ Phone                                                          │
│  ✓ Email                                                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: VEHICLE INFORMATION                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  IA: "Great, Maria! Now, tell me about your vehicle.            │
│       What make and model is it?"                                │
│                                                                   │
│  User: "It's a 2020 Toyota Camry"                                │
│                                                                   │
│  IA Response:                                                     │
│  "Got it - 2020 Toyota Camry. Do you happen to have the VIN     │
│   handy? (You can find it on your registration or insurance)"   │
│                                                                   │
│  Data Collection:                                                 │
│  ✓ Make: Toyota                                                   │
│  ✓ Model: Camry                                                   │
│  ✓ Year: 2020                                                     │
│  ○ VIN: (optional)                                                │
│  ○ License Plate: (optional)                                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: INSURANCE STATUS (CRITICAL)                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  IA: "Do you have insurance coverage for this vehicle?"          │
│                                                                   │
│  ┌─────────────┐                        ┌──────────────┐         │
│  │ YES         │                        │ NO           │         │
│  └──────┬──────┘                        └──────┬───────┘         │
│         │                                      │                  │
│         ▼                                      ▼                  │
│  "Great! Who's your                     "I understand. We can    │
│   insurance provider?"                  still help you. The      │
│                                         repair will be out-of-    │
│  User: "State Farm"                     pocket."                 │
│                                                                   │
│  "Do you have a claim                   QUALIFICATION_SCORE: -30 │
│   number already?"                      (Lower priority)         │
│                                                                   │
│  Data Collection:                       Data Collection:          │
│  ✓ Has Insurance: Yes                   ✓ Has Insurance: No      │
│  ✓ Provider: State Farm                                          │
│  ○ Claim Number                                                   │
│                                                                   │
│  QUALIFICATION_SCORE: +40                                         │
└────────────────────────┬────────────────┬───────────────────────┘
                         │                │
                         ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 5: ACCIDENT DETAILS & URGENCY                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  IA: "Can you still drive the vehicle?"                          │
│                                                                   │
│  ┌──────────────┐                      ┌─────────────┐           │
│  │ YES          │                      │ NO          │           │
│  └──────┬───────┘                      └──────┬──────┘           │
│         │                                     │                   │
│         ▼                                     ▼                   │
│  "You can bring it to         "We'll arrange towing for you.     │
│   our shop at..."              Do you need it right away?"       │
│                                                                   │
│  SCORE: +10                    SCORE: +20 (Higher urgency)       │
│                                                                   │
│  Next Question:                IA: "Do you need a rental car     │
│  "Do you need a rental         while we repair yours?"           │
│   car during repair?"                                             │
│                                ┌─────────┐  ┌─────────┐          │
│  ┌─────┐  ┌─────┐             │ YES     │  │ NO      │          │
│  │ YES │  │ NO  │             └────┬────┘  └────┬────┘          │
│  └──┬──┘  └──┬──┘                  │            │               │
│     │        │                     │            │               │
│     ▼        ▼                     ▼            ▼               │
│  +10      +5                   +15          +5                   │
│                                                                   │
│  Data Collection:                                                 │
│  ✓ Is Drivable: Yes/No                                           │
│  ✓ Needs Tow: Yes/No                                             │
│  ✓ Needs Rental: Yes/No                                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 6: PHOTO UPLOAD                                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  IA: "Can you share some photos of the damage? This helps us    │
│       give you a faster estimate."                               │
│                                                                   │
│  [Upload Button Interface]                                        │
│  • Front damage                                                   │
│  • Rear damage                                                    │
│  • Side damage                                                    │
│  • Other angles                                                   │
│                                                                   │
│  Guidance:                                                        │
│  "📸 Tips for good photos:                                       │
│   ✓ Take photos in good lighting                                │
│   ✓ Show damage from multiple angles                            │
│   ✓ Include close-ups of specific areas                         │
│   ✓ Show overall vehicle condition"                             │
│                                                                   │
│  Data Collection:                                                 │
│  ✓ Photos uploaded (stored in S3)                                │
│  ✓ Photo count: X                                                 │
│                                                                   │
│  SCORE: +15 (if photos uploaded)                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 7: QUALIFICATION SCORE CALCULATION                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  AI Analysis:                                                     │
│                                                                   │
│  Base Score: 50                                                   │
│  + Has Insurance: +40                                             │
│  + Insurance Provider (Major): +10                                │
│  + Not Drivable (Urgency): +20                                    │
│  + Needs Tow: +5                                                  │
│  + Needs Rental: +15                                              │
│  + Photos Uploaded: +15                                           │
│  ────────────────────────                                         │
│  Total Score: 155 / 100 = 95 (HIGH PRIORITY)                     │
│                                                                   │
│  Qualification Thresholds:                                        │
│  • 0-40: LOW (self-service or schedule callback)                 │
│  • 41-70: MEDIUM (schedule appointment)                           │
│  • 71-100: HIGH (immediate human contact)                         │
│                                                                   │
│  Decision Tree:                                                   │
│                                                                   │
│  IF score >= 71 AND has_insurance:                               │
│    → ESCALATE TO HUMAN IMMEDIATELY                                │
│                                                                   │
│  ELSE IF score >= 41:                                             │
│    → SCHEDULE CALLBACK/APPOINTMENT                                │
│                                                                   │
│  ELSE:                                                             │
│    → PROVIDE INFO & CAPTURE IN SYSTEM                             │
│                                                                   │
│  Current Lead: SCORE = 95 → ESCALATE                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 8: ESCALATION (HIGH PRIORITY LEAD)                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  IA: "Thank you for all the information, Maria! Based on what    │
│       you've told me, I'd like to connect you with one of our    │
│       specialists right away. They can give you an immediate     │
│       estimate and schedule your repair."                        │
│                                                                   │
│  Actions:                                                         │
│  1. Save lead to database with status: 'qualified_ai'            │
│  2. Create notification for available attendant                  │
│  3. Send SMS to lead: "FlipCars received your info. A           │
│     specialist will contact you within 15 minutes."              │
│                                                                   │
│  Options Presented:                                               │
│  ┌────────────────────────────────────┐                          │
│  │ "Connect me now" (Chat handoff)    │                          │
│  │ "Call me at XXX-XXX-XXXX"          │                          │
│  │ "I'll wait for a call back"        │                          │
│  └────────────────────────────────────┘                          │
│                                                                   │
│  IF "Connect me now":                                             │
│    → Transfer chat to available attendant                        │
│    → Attendant sees full conversation history & AI summary       │
│                                                                   │
│  IF "Call me":                                                    │
│    → Initiate immediate call via Twilio                          │
│    → Log call in system                                           │
│                                                                   │
│  IF "Wait for callback":                                          │
│    → Schedule callback in next 15-30 minutes                     │
│    → Assign to next available attendant                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 9: CONVERSATION SUMMARY (For Human Agent)                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  AI-Generated Summary:                                            │
│                                                                   │
│  Lead: Maria Silva                                                │
│  Priority: HIGH (Score: 95/100)                                   │
│  Language: Portuguese                                             │
│                                                                   │
│  Quick Facts:                                                     │
│  ✓ 2020 Toyota Camry - Rear-end collision                        │
│  ✓ Insurance: State Farm (has claim number)                      │
│  ✓ Vehicle NOT drivable - needs immediate tow                    │
│  ✓ Needs rental car during repair                                │
│  ✓ 4 photos uploaded showing rear damage                         │
│                                                                   │
│  Key Points:                                                      │
│  • Customer is stressed but cooperative                          │
│  • Mentioned accident happened today                             │
│  • Prefers Portuguese communication                              │
│  • Available for call back between 2-5 PM                        │
│                                                                   │
│  Recommended Actions:                                             │
│  1. Call immediately - customer is available now                 │
│  2. Arrange tow service ASAP (provide tow company contacts)      │
│  3. Check State Farm claim status                                │
│  4. Offer rental car options (Enterprise/Hertz partnerships)     │
│  5. Schedule initial inspection for tomorrow AM                  │
│                                                                   │
│  Estimated Repair Value: $3,500 - $5,000                         │
│  Expected Timeline: 5-7 business days                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo Alternativo: Medium Priority Lead

```
┌─────────────────────────────────────────────────────────────────┐
│  MEDIUM PRIORITY (Score: 41-70)                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  IA: "Thank you for the information! I've created an estimate    │
│       request for you. Here's what happens next:"                │
│                                                                   │
│  Timeline:                                                        │
│  ✓ We'll review your case within 2-4 hours                       │
│  ✓ A specialist will call you to discuss details                │
│  ✓ We'll schedule an inspection at our shop                      │
│                                                                   │
│  "In the meantime, here are some helpful resources:"             │
│  • What to do after an accident [Link]                           │
│  • How insurance claims work [Link]                              │
│  • Our repair process explained [Link]                           │
│                                                                   │
│  Actions:                                                         │
│  1. Save lead with status: 'new' or 'qualified_ai'               │
│  2. Send confirmation email with reference number                │
│  3. Add to queue for callback within 4 hours                     │
│  4. Send SMS reminder after 2 hours if not contacted             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo Alternativo: Low Priority Lead

```
┌─────────────────────────────────────────────────────────────────┐
│  LOW PRIORITY (Score: 0-40)                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Reasons for Low Score:                                           │
│  • No insurance                                                   │
│  • Minor damage only                                              │
│  • Just browsing/information gathering                           │
│  • Looking for out-of-pocket estimate                            │
│                                                                   │
│  IA Response:                                                     │
│  "I've saved your information. We typically respond to           │
│   inquiries like yours within 24-48 hours."                      │
│                                                                   │
│  "While you wait, you can:"                                       │
│  • Browse our gallery of repairs [Link]                          │
│  • Read customer testimonials [Link]                             │
│  • Learn about our services [Link]                               │
│  • Get a rough estimate using our calculator [Link]              │
│                                                                   │
│  Actions:                                                         │
│  1. Save lead with status: 'new'                                 │
│  2. Send automated follow-up email with info                     │
│  3. Add to nurture campaign (emails over 2 weeks)                │
│  4. Manual review by marketing team                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚨 Escalation Triggers (Human Intervention Needed)

### 1. Explicit Request
```
User: "I want to speak to a real person"
User: "Connect me to someone"
User: "Is this a bot?"

→ IMMEDIATE ESCALATION
IA: "Of course! Let me connect you with a specialist right now."
```

### 2. Complex Question
```
User: "My insurance said they'll only cover 70%. What do I do?"
User: "I have questions about the deductible..."

→ AI attempts answer from knowledge base
→ If uncertain (confidence < 70%), escalate:
   IA: "That's a great question. Let me connect you with our 
        insurance specialist who can explain this in detail."
```

### 3. Frustration Detected
```
Sentiment Analysis detects:
• Negative sentiment score < -0.6
• Keywords: "frustrated", "angry", "this is ridiculous"
• Multiple questions with no progress

→ IMMEDIATE ESCALATION
IA: "I apologize for the frustration. Let me get you connected 
     with a team member who can better assist you."
```

### 4. High-Value Opportunity
```
Qualification Score >= 90
AND (
  Insurance confirmed +
  Needs immediate service +
  Has photos +
  Available now
)

→ PRIORITY ESCALATION
IA: "Based on your situation, I'd like to connect you with a 
     specialist immediately. They can start the process right away."
```

---

## 💬 AI Response Suggestion Agent (Dashboard)

### Context
Human agent is viewing lead/claim details and wants to respond

### Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  HUMAN AGENT DASHBOARD                                           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Lead: Maria Silva                                                │
│  Last Message: "When can I bring my car in?"                     │
│                                                                   │
│  [AI Suggest Response Button] ← Agent clicks                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  AI ANALYSIS                                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Input Context:                                                   │
│  • Lead data (vehicle, insurance, urgency)                       │
│  • Conversation history                                           │
│  • Business hours                                                 │
│  • Current technician availability                               │
│  • Customer's preferred language: PT                             │
│                                                                   │
│  AI Generates 3 Response Options:                                │
│                                                                   │
│  Option 1 (Professional Friendly):                               │
│  "Olá Maria! Posso agendar para você amanhã às 10h da manhã.    │
│   Vamos fazer a inspeção completa e te dar um orçamento          │
│   detalhado. Isso funciona para você?"                           │
│                                                                   │
│  Option 2 (Brief & Direct):                                       │
│  "Oi Maria! Amanhã 10h está bom? Vamos inspecionar e orçar."    │
│                                                                   │
│  Option 3 (Detailed & Empathetic):                               │
│  "Oi Maria! Entendo que você quer resolver isso logo. Posso     │
│   agendar sua inspeção para amanhã às 10h. Durante a visita,    │
│   vamos avaliar todos os danos e trabalhar com sua seguradora   │
│   State Farm para agilizar o processo. Também podemos arranjar  │
│   o guincho e carro reserva se precisar. Te espero amanhã?"     │
│                                                                   │
│  [Use Option 1] [Use Option 2] [Use Option 3] [Edit]            │
└─────────────────────────────────────────────────────────────────┘
```

### Agent Can:
1. Select one option as-is
2. Edit before sending
3. Ask for alternative suggestions
4. Provide feedback (thumbs up/down)

---

## 📧 Content Generation Agent

### Use Cases

#### 1. Email: Claim Status Update

```
Input:
• Claim ID
• Current status: "paint"
• Customer language: PT

AI Generates:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Subject: Atualização: Seu Toyota Camry está na fase de pintura! 🎨

Olá Maria,

Boas notícias! Seu Toyota Camry 2020 está progredindo bem no reparo.

Status Atual: Pintura em Andamento
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Hoje começamos a aplicação da camada base de pintura. A cor está 
sendo perfeitamente combinada para garantir um acabamento impecável.

Próximos Passos:
✓ Aplicação de camadas de acabamento (1-2 dias)
✓ Verificação de qualidade
✓ Montagem final

Previsão de Conclusão: 05/11/2025

Você pode acompanhar o progresso em tempo real no seu portal:
[Ver Detalhes do Reparo]

Perguntas? Responda este email ou nos ligue: +1-321-960-8661

Atenciosamente,
Equipe FlipCars
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### 2. SMS: Claim Ready

```
Input:
• Claim completed
• Customer language: ES

AI Generates:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
¡Hola Maria! 🎉 Tu Toyota Camry está LISTO y te espera. Puedes 
recogerlo mañana de 9am-6pm en nuestra tienda. ¿Te viene bien? 

FlipCars - 321-960-8661
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### 3. Conversation Summary

```
Input:
• Long conversation history (20+ messages)

AI Generates:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Conversation Summary - Maria Silva

Key Points:
• Initial contact via AI chat widget at 4:15 PM
• Rear-end collision, 2020 Toyota Camry
• Insurance: State Farm (claim #SF-2024-123456)
• Vehicle not drivable, needs tow + rental
• Customer available tomorrow 10 AM for inspection
• Preferred language: Portuguese
• Very cooperative, slightly stressed

Action Items:
1. ✓ Scheduled inspection: Tomorrow 10 AM
2. ⏳ Arrange tow service (pending)
3. ⏳ Reserve rental car with Enterprise
4. ⏳ Contact State Farm adjuster

Sentiment: Neutral → Positive (reassured by agent)
Estimated Value: $4,200
Priority: HIGH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🎯 AI Knowledge Base Structure

### Categories

```
1. FAQs
   • "Do you work with my insurance?"
   • "How long does repair take?"
   • "Do you use OEM parts?"
   • "What's your warranty?"

2. Insurance Providers
   • State Farm: Contact info, process, common issues
   • Geico: Contact info, process, common issues
   • Progressive: Contact info, process, common issues
   • (etc.)

3. Repair Processes
   • Collision repair steps
   • Paint matching process
   • Quality control checks
   • Timeline estimates

4. Services
   • Body work
   • Paint
   • Mechanical
   • Towing
   • Rental cars

5. Policies
   • Warranty terms
   • Payment options
   • Cancellation policy
   • Privacy policy
```

### Knowledge Base Entry Example

```json
{
  "id": "kb-001",
  "category": "faq",
  "question_en": "How long does a typical repair take?",
  "question_es": "¿Cuánto tiempo toma una reparación típica?",
  "question_pt": "Quanto tempo leva um reparo típico?",
  "answer_en": "Most collision repairs take 5-7 business days. However, the exact timeline depends on the extent of damage, parts availability, and insurance approval. We'll give you a precise estimate after the initial inspection.",
  "answer_es": "La mayoría de las reparaciones de colisión toman de 5 a 7 días hábiles. Sin embargo, el plazo exacto depende del alcance del daño, disponibilidad de piezas y aprobación del seguro. Te daremos una estimación precisa después de la inspección inicial.",
  "answer_pt": "A maioria dos reparos de colisão leva de 5 a 7 dias úteis. No entanto, o prazo exato depende da extensão dos danos, disponibilidade de peças e aprovação da seguradora. Daremos uma estimativa precisa após a inspeção inicial.",
  "keywords": ["time", "duration", "how long", "tempo", "cuánto tiempo", "timeline", "prazo"],
  "confidence_threshold": 0.75,
  "is_active": true
}
```

---

## 🔧 AI Configuration Settings

### Persona Settings (Customizable in Dashboard)

```json
{
  "tone": "empathetic",
  "formality": "professional_friendly",
  "verbosity": "balanced",
  "emoji_usage": "occasional",
  "greeting_style": "warm",
  "language_detection": "automatic",
  "default_language": "en",
  "escalation_threshold": {
    "qualification_score": 71,
    "frustration_sentiment": -0.6,
    "complex_question_confidence": 0.7,
    "explicit_request": true
  },
  "response_time_target": 2,
  "conversation_timeout": 1800
}
```

### System Prompts (OpenAI)

**Lead Qualification Agent:**
```
You are a helpful virtual assistant for FlipCars, an auto body shop 
in Orlando, FL. Your goal is to:

1. Greet customers warmly in their preferred language (EN/ES/PT)
2. Understand their collision repair needs
3. Collect essential information for qualification:
   - Contact info (name, phone, email)
   - Vehicle details (make, model, year, VIN)
   - Insurance status and provider
   - Accident details (drivability, urgency)
   - Photos of damage
4. Assess priority and qualification score
5. Escalate high-priority leads to human agents
6. Provide helpful resources for medium/low priority leads

Tone: Empathetic, professional, and efficient
Never: Make promises about costs or timelines without inspection
Always: Reassure customers and demonstrate expertise
```

---

## 📊 AI Performance Metrics (To Track)

1. **Qualification Accuracy**
   - % of AI-qualified leads that convert
   - False positive rate (qualified but shouldn't be)
   - False negative rate (not qualified but should be)

2. **Escalation Rate**
   - % of conversations escalated to humans
   - Average time to escalation
   - Escalation reasons breakdown

3. **Response Quality**
   - Average confidence score of responses
   - Feedback ratings from human agents
   - Customer satisfaction with AI interaction

4. **Efficiency**
   - Average conversation length
   - Average time to collect all info
   - % of conversations completed without escalation

5. **Language Performance**
   - Accuracy per language (EN/ES/PT)
   - Customer satisfaction per language

---

**Versão:** 1.0  
**Última Atualização:** 2025-10-28  
**Status:** DRAFT - Fase 0
