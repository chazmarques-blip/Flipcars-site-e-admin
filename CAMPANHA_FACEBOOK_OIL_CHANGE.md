# 🚀 CAMPANHA FACEBOOK ADS - OIL CHANGE $39.90
### Planejamento Estratégico Completo | FlipCars Orlando

---

## 📋 ÍNDICE
1. [Resumo Executivo](#resumo-executivo)
2. [Análise do Site Atual](#análise-do-site-atual)
3. [Objetivos da Campanha](#objetivos-da-campanha)
4. [Estratégia de Funil](#estratégia-de-funil)
5. [Estrutura de Campanha](#estrutura-de-campanha)
6. [Criativos e Copywriting](#criativos-e-copywriting)
7. [Públicos-Alvo (Audiences)](#públicos-alvo)
8. [Orçamento e Bidding](#orçamento-e-bidding)
9. [Métricas e KPIs](#métricas-e-kpis)
10. [Landing Page e Conversão](#landing-page-e-conversão)
11. [Cronograma de Implementação](#cronograma-de-implementação)
12. [Análise SWOT da Campanha](#análise-swot)

---

## 🎯 1. RESUMO EXECUTIVO

### Conceito da Campanha
**"$39.90 Oil Change + FREE Labor + FREE Checkup"**

Campanha de performance focada em **agendamento online direto** pelo site **https://flipcars.us**, aproveitando a promoção agressiva de troca de óleo com labor gratuito.

### USP (Unique Selling Proposition)
- ✅ **Labor 100% FREE** (diferencial competitivo forte)
- ✅ Complete Vehicle Inspection Included (valor agregado)
- ✅ $39.90 price (low-cost entry point)
- ✅ Online Booking em 5 minutos (frictionless)
- ✅ Service Time: 30-45 minutes (conveniência)

### Meta Principal
**Gerar 50+ agendamentos online por mês** com CAC (Custo por Agendamento) ≤ $15

---

## 🔍 2. ANÁLISE DO SITE ATUAL

### ✅ Pontos Fortes Identificados

#### 2.1 Hero Section (Slide 0 - Oil Change Special)
```typescript
// Localização: frontend-public/src/components/features/Hero.tsx (lines 30-52)

✅ CTA Primário: "Book Oil Change Now!" 
✅ CTA Secundário: "Call: 321-960-8661"
✅ Facebook Pixel Tracking configurado:
   - fbq('trackCustom', 'OilChangeCTAClick') 
   - fbq('trackCustom', 'PhoneClick')
✅ Badge promocional: "⭐ FREE LABOR PROMOTION"
✅ Trust Indicators visíveis:
   - 4.9/5 Stars (51 Google Reviews)
   - Licensed & Insured
   - Lifetime Warranty
```

**INSIGHT ESTRATÉGICO**: O site já tem infraestrutura de conversão robusta. O desafio é apenas trazer tráfego qualificado.

#### 2.2 Fluxo de Agendamento (Estimate Form)
```
Step 1: Basic Info (Name, Phone, Email, Service Type)
Step 2a: Service Details (Insurance/Warranty)
Step 2b: Warranty Docs (SELECT "Oil Change & FREE Checkup*" 🛢️)
Step 3: Photos (Optional for oil change)
Step 4: Contact Preferences (Phone Call, WhatsApp, Text Message)
Step 5: Confirmation + Calendar Scheduling
```

**Friction Points Identificados**:
- ⚠️ Oil Change está em "Step 2b" (mechanic flow) - não é o primeiro passo
- ⚠️ Form pode parecer longo para um serviço simples (5 steps)
- ✅ Mas oferece agendamento direto com data/hora (GRANDE VANTAGEM)

#### 2.3 Serviços Listados (Services.tsx)
```
1. Extended Warranty Repairs
2. Collision Repair
3. Paint Services
4. Insurance Claims
5. Body Shop Services
```

**⚠️ OBSERVAÇÃO CRÍTICA**: Oil Change **NÃO aparece na lista de serviços principais** do site (Services.tsx). Ele só aparece:
- Hero Slide 0 (carousel)
- Step2bWarrantyDocs.tsx (como categoria "oil")

**RECOMENDAÇÃO**: Criar uma landing page dedicada `/oil-change` (isso pode ser feito posteriormente, não é bloqueante).

#### 2.4 Trust Elements & Social Proof
```
✅ Google Reviews: 4.9/5 (51 reviews)
✅ Badges: Licensed & Insured, Lifetime Warranty
✅ Service Time: 30-45 minutes
✅ Emergency Towing 24/7 Available
✅ Serving all of Central Florida
```

---

## 🎯 3. OBJETIVOS DA CAMPANHA

### Objetivos Primários
| Objetivo | Meta | Prazo |
|----------|------|-------|
| **Agendamentos Online** | 50+ por mês | 30 dias |
| **CAC (Cost per Acquisition)** | ≤ $15 | Contínuo |
| **Conversion Rate (LP)** | 15-25% | 30 dias |
| **CTR (Click-Through Rate)** | 2.5-4% | Primeiros 14 dias |

### Objetivos Secundários
- **Brand Awareness**: Alcançar 50,000+ pessoas em Orlando/Central Florida
- **Engajamento**: 500+ likes/shares/comments nas ads
- **Retargeting Pool**: Construir lista de 5,000+ visitantes do site para remarketing
- **Customer Lifetime Value**: Converter clientes de oil change em serviços de maior ticket (bodyshop, warranty repairs)

### Métricas de Sucesso (North Star Metrics)
```
Primary: Online Bookings (via /estimate form)
Secondary: Phone Calls (321-960-8661)
Tertiary: Website Traffic Quality (Time on Site > 2min, Bounce Rate < 60%)
```

---

## 🧲 4. ESTRATÉGIA DE FUNIL (TOFU/MOFU/BOFU)

### TOFU (Top of Funnel) - Awareness
**Objetivo**: Introduzir a promoção para público frio

**Táticas**:
- Reach Campaigns com vídeo curto (15s-30s)
- Carrossel de benefícios (FREE Labor + $39.90 + FREE Checkup)
- Social Proof (Google Reviews 4.9/5)
- Geographic Targeting: Orlando + 25 mile radius

**Conteúdo**:
- "Save $80+ on Your Next Oil Change" (pain point)
- "Oil Change Special Orlando - Labor FREE"
- Vídeo de Before/After do serviço (se disponível)

### MOFU (Middle of Funnel) - Consideration
**Objetivo**: Engajar quem já conhece a marca/oferta

**Táticas**:
- Traffic Campaigns direcionadas para `/estimate` page
- Retargeting de visitantes do site (últimos 7-14 dias)
- Lookalike Audiences (email list, phone list)
- Lead Ads com formulário nativo (alternativa ao site)

**Conteúdo**:
- "Book Your $39.90 Oil Change Now - 3 Spots Left Today"
- Scarcity/Urgency messaging
- Testimunhos de clientes satisfeitos
- Comparação de preços (FlipCars vs. Competitors)

### BOFU (Bottom of Funnel) - Conversion
**Objetivo**: Converter leads warm em agendamentos

**Táticas**:
- Conversion Campaigns otimizadas para Lead events
- Retargeting agressivo (últimos 3 dias, não converteram)
- Offer Extensions (e.g., "Free Tire Rotation if you book today")
- Dynamic Ads mostrando Oil Change específico

**Conteúdo**:
- "Last Chance: $39.90 Oil Change Ends Friday"
- CTAs diretos: "Book Online in 3 Minutes"
- Phone call emphasis: "Call Now: 321-960-8661"

---

## 🏗️ 5. ESTRUTURA DE CAMPANHA (RECOMENDAÇÃO)

### Campaign Structure (3 Campanhas Principais)

#### **CAMPANHA 1: "Oil Change Awareness" (TOFU)**
```
Objetivo: Reach + Brand Awareness
Orçamento: $30-$50/dia
Duração: Contínua (evergreen)
Placements: Facebook Feed, Instagram Feed, Stories, Reels

Ad Sets:
├── AS 1.1: Orlando Metro (Broad, 25-65 years, Car Owners Interest)
├── AS 1.2: Central Florida (Davenport, Kissimmee, Winter Park)
└── AS 1.3: Lookalike 1% (Email/Phone List)

Creative Types:
- Vídeo 15s (Hero shot da promoção)
- Carrossel (5 cards: FREE Labor / $39.90 / FREE Checkup / 30-45min / Book Now)
- Single Image (Antes/Depois ou Mechanic trabalhando)
```

#### **CAMPANHA 2: "Oil Change Conversion" (MOFU/BOFU)**
```
Objetivo: Conversions (Lead event = Form Submit)
Orçamento: $50-$80/dia
Duração: Contínua (otimizar semanalmente)
Placements: Facebook Feed, Instagram Feed (alta intenção)

Ad Sets:
├── AS 2.1: Website Visitors (últimos 14 dias, não converteram)
├── AS 2.2: Engagement Retargeting (interagiram com ads últimos 7 dias)
├── AS 2.3: Lookalike 2-3% (Custom Audiences)
└── AS 2.4: Interest Targeting (Auto Maintenance, Jiffy Lube, Valvoline)

Creative Types:
- Static Image + Strong CTA ("Book Online Now")
- Testimonial Video (cliente satisfeito)
- Offer Graphic (Desconto visual destacado)
```

#### **CAMPANHA 3: "Oil Change Lead Ads" (Alternativa)**
```
Objetivo: Lead Generation (Facebook Native Form)
Orçamento: $20-$30/dia (teste)
Duração: 14-30 dias (teste piloto)
Placements: Facebook Feed, Instagram Feed

Ad Sets:
├── AS 3.1: Orlando 10-mile radius (Mobile-first)
└── AS 3.2: Lookalike 1% Email List

Creative Types:
- Carrossel com formulário integrado
- Single Image + Lead Form (pre-filled Facebook data)

Form Fields (Pré-preenchido pelo Facebook):
- Full Name
- Phone Number
- Email
- Preferred Date (custom question)
- Preferred Time (custom question: Morning/Afternoon/Evening)
```

---

## 🎨 6. CRIATIVOS E COPYWRITING

### 6.1 Headlines (Títulos Primários)

#### Variações para Teste A/B
```
✅ "$39.90 Oil Change + FREE Labor - Orlando"
✅ "Save $80+ on Your Next Oil Change | FREE Labor Included"
✅ "Oil Change Special: You Only Pay for Oil & Filter"
✅ "Professional Oil Change in 30-45 Minutes | Book Online"
✅ "FREE Labor on All Oil Changes - Limited Time Offer"
```

**Vencedor Projetado** (baseado em análise de mercado):
> **"$39.90 Oil Change + FREE Labor - Book Online Now"**

**Por quê?**
- Preço específico ($39.90) - credibilidade
- Benefício claro (FREE Labor) - valor
- Call-to-Action urgente (Book Online Now) - conversão
- Localização implícita (Orlando-focused audience)

### 6.2 Body Copy (Texto Principal)

#### Template A: "Value-Focused"
```
🛢️ Professional Oil Change | Orlando's Best Price

✅ Only $39.90 - You Pay for Oil & Filter Only
✅ Labor is 100% FREE (Save $80+)
✅ Complete Vehicle Inspection Included
✅ Service Time: 30-45 Minutes
✅ Licensed & Insured | Lifetime Warranty

📅 Book Your Appointment Online in 3 Minutes
👉 flipcars.us

Limited spots available daily. Schedule now!

📞 Questions? Call: 321-960-8661
📍 Serving All of Central Florida
⭐ 4.9/5 Stars on Google (51 Reviews)
```

#### Template B: "Pain-Point Focused"
```
Tired of paying $120+ for a simple oil change? 😤

At FlipCars, we believe auto maintenance should be AFFORDABLE.

That's why we're offering:
👉 $39.90 Oil Change (you only pay for oil & filter)
👉 FREE Labor (save $80+)
👉 FREE Complete Checkup (peace of mind)

No hidden fees. No upselling. Just honest service.

Book online now: flipcars.us
Or call: 321-960-8661

⭐ 4.9/5 Stars | Licensed & Insured
📍 Orlando, FL | Service in 30-45 min
```

#### Template C: "Urgency-Focused" (Retargeting)
```
⏰ STILL THINKING ABOUT IT?

Your car needs an oil change every 3,000-5,000 miles.
Skipping it can cost you $1,000s in engine damage.

🚨 Don't wait - Book your $39.90 oil change TODAY:

✅ FREE Labor (save $80+)
✅ FREE Vehicle Inspection
✅ Only 3 spots left this week
✅ 30-45 minute service

👉 Book Now: flipcars.us
📞 Or Call: 321-960-8661

Serving Orlando & Central Florida
⭐ 4.9/5 Stars | Licensed & Insured
```

### 6.3 Call-to-Action (CTAs)

#### CTA Buttons Recomendados (por prioridade)
```
1. "Book Online Now" (Primary CTA - maior conversão)
2. "Schedule Appointment" (Alternativa mais formal)
3. "Get Appointment" (Direto)
4. "Call Now" (Para ads com telefone em destaque)
5. "Learn More" (TOFU apenas, menor intenção)
```

**⚠️ IMPORTANTE**: Sempre usar CTAs de alta intenção (Book/Schedule/Call), nunca "Learn More" em campanhas de conversão.

### 6.4 Visual Guidelines

#### Imagens/Vídeos Necessários (Lista de Assets)

**PRIORIDADE ALTA** (necessários para lançar):
1. ✅ **Oil Change Hero Shot**: Mecânico trocando óleo, close-up profissional
2. ✅ **Price Graphic**: "$39.90" em destaque com badge "FREE LABOR"
3. ✅ **Before/After**: Óleo sujo vs. limpo (visual impactante)
4. ✅ **Facility Shot**: Loja FlipCars com carros (confiança)
5. ✅ **Mobile-Optimized**: Todas as imagens em formato 1:1 ou 4:5 (vertical)

**PRIORIDADE MÉDIA** (melhorar performance):
6. ⏳ **Vídeo 15-30s**: Processo de oil change time-lapse + CTA final
7. ⏳ **Testimonial Video**: Cliente satisfeito falando sobre o serviço
8. ⏳ **Comparison Graphic**: FlipCars $39.90 vs. Competitors $120
9. ⏳ **Infographic**: 5 sinais que seu carro precisa de oil change

**PRIORIDADE BAIXA** (testes futuros):
10. 📊 **Carrossel (5 slides)**: Step-by-step do processo de agendamento
11. 📊 **Instagram Stories Template**: Swipe-up para booking page
12. 📊 **Facebook Event Cover**: Para promover "Oil Change Days" especiais

#### Especificações Técnicas (Facebook Ads)
```
Format: Single Image
- Tamanho: 1080x1080px (1:1) ou 1080x1350px (4:5)
- Aspect Ratio: 1:1 ou 4:5 (mobile-first)
- Max File Size: 30MB
- Text Overlay: <20% da imagem (regra do Facebook)

Format: Video
- Tamanho: 1080x1080px (1:1) ou 1080x1920px (9:16 para Stories/Reels)
- Duração: 15-30 segundos (máximo 60s)
- Max File Size: 4GB
- Formato: MP4 ou MOV
- Thumbnail: Custom (com preço em destaque)

Format: Carousel
- Tamanho: 1080x1080px por card
- Cards: 3-5 cards
- Aspect Ratio: 1:1
- CTA: Mesmo para todos os cards
```

---

## 👥 7. PÚBLICOS-ALVO (AUDIENCES)

### 7.1 Cold Audiences (Públicos Frios)

#### **Audience A1: "Orlando Car Owners - Broad"**
```
Tipo: Interest Targeting
Location: Orlando, FL + 25 mile radius
Age: 25-65 years old
Gender: All
Interests:
- Automotive (broad)
- Car Maintenance
- Used Cars
- New Cars
- SUVs
- Sedans
Behaviors:
- Likely to need auto services
- Commuters
- Car Owners (Facebook categorization)
Estimated Reach: 500,000-800,000
```

#### **Audience A2: "Auto Maintenance Enthusiasts"**
```
Tipo: Interest + Competitor Targeting
Location: Orlando, FL + 20 mile radius
Age: 28-60 years old
Gender: All
Interests:
- Jiffy Lube
- Valvoline
- Pep Boys
- AutoZone
- Car Maintenance
- DIY Auto Repair
- Oil Change (specific)
Behaviors:
- Engaged Shoppers (auto services)
- Online Purchasers (auto parts)
Estimated Reach: 150,000-250,000
```

#### **Audience A3: "Budget-Conscious Drivers"**
```
Tipo: Interest + Financial Behavior
Location: Orlando, FL + 30 mile radius
Age: 25-55 years old
Gender: All
Interests:
- Coupons
- Groupon
- Deal Seekers
- Budget Travel
- Thrifty Shopping
Behaviors:
- Bargain Hunters
- Value Shoppers
- Likely to respond to offers
Estimated Reach: 300,000-500,000
```

### 7.2 Warm Audiences (Retargeting)

#### **Audience B1: "Website Visitors - All (Last 30 Days)"**
```
Tipo: Custom Audience (Pixel)
Source: Facebook Pixel - Page View
Timeframe: Last 30 days
Exclusions: Purchasers/Form Submitters (last 30 days)
Estimated Size: 1,000-5,000 (crescerá com a campanha)
Priority: HIGH
```

#### **Audience B2: "Estimate Form Initiators - Non-Completers"**
```
Tipo: Custom Audience (Pixel)
Source: Pixel Event - ViewContent (/estimate page)
AND NOT: Lead Event (form completion)
Timeframe: Last 14 days
Estimated Size: 500-2,000
Priority: CRITICAL (alta intenção, abandonaram)
```

#### **Audience B3: "Video Viewers - 50%+"**
```
Tipo: Video Engagement Custom Audience
Source: Facebook/Instagram Video Ads
Engagement: Watched 50% or more
Timeframe: Last 14 days
Estimated Size: 2,000-10,000 (depende do budget de awareness)
Priority: MEDIUM
```

#### **Audience B4: "Engagers - Last 7 Days"**
```
Tipo: Engagement Custom Audience
Source: Facebook Page + Instagram Profile
Actions: Liked, Commented, Shared, Clicked
Timeframe: Last 7 days
Estimated Size: 500-2,000
Priority: MEDIUM
```

### 7.3 Lookalike Audiences

#### **Audience C1: "Email List - Lookalike 1%"**
```
Tipo: Lookalike Audience
Source: Customer Email List (hashed, uploaded to Facebook)
Percentage: 1% (most similar)
Location: Florida (statewide)
Estimated Reach: 200,000-300,000
Priority: HIGH (alta qualidade)

⚠️ NOTA: Requer upload de lista de emails de clientes existentes
Formato: CSV com colunas [email, phone, first_name, last_name, zip_code]
```

#### **Audience C2: "Lead Converters - Lookalike 2%"**
```
Tipo: Lookalike Audience
Source: Pixel Event - Lead (completed /estimate form)
Percentage: 2% (expanded reach)
Location: Florida + Georgia (bordering states)
Estimated Reach: 400,000-600,000
Priority: MEDIUM-HIGH

⚠️ NOTA: Requer mínimo 100 conversões de Lead event para funcionar bem
```

### 7.4 Exclusions (Públicos a Excluir)

```
Sempre EXCLUIR das campanhas:
✅ Recent Converters (últimos 30 dias) - para economizar budget
✅ Existing Customers (última visita < 90 dias) - evitar canibalização
✅ Employees (se aplicável) - evitar cliques internos
✅ Competitors (employees de concorrentes, se identificáveis)
```

---

## 💰 8. ORÇAMENTO E BIDDING

### 8.1 Recomendação de Budget Mensal

#### **Cenário 1: Launch Phase (Primeiros 30 dias)**
```
Total Budget: $2,000 - $3,000/mês

Breakdown:
├── Campanha 1 (Awareness): $600-$900 ($20-$30/dia)
├── Campanha 2 (Conversion): $1,200-$1,800 ($40-$60/dia)
└── Campanha 3 (Lead Ads - Teste): $200-$300 ($10/dia por 14 dias)

Expectativa:
- Alcance: 80,000-150,000 pessoas
- Cliques: 2,000-4,000 (CTR 2.5-3%)
- Landing Page Visits: 1,500-3,000
- Conversões (Agendamentos): 40-70 (CR 15-25%)
- CAC (Cost per Acquisition): $28-$50 (inicial, vai otimizar)
```

#### **Cenário 2: Optimization Phase (Dias 31-90)**
```
Total Budget: $1,500 - $2,500/mês

Breakdown:
├── Campanha 1 (Awareness): $300-$500 ($10-$15/dia) ⬇️ REDUZIR
├── Campanha 2 (Conversion): $1,000-$1,800 ($35-$60/dia) ⬆️ ESCALAR
└── Campanha 3 (Lead Ads): Pausar ou manter se CAC < $20

Expectativa:
- Alcance: 50,000-100,000 pessoas
- Cliques: 2,500-5,000 (CTR 3-4% melhorado)
- Landing Page Visits: 2,000-4,000
- Conversões (Agendamentos): 60-100 (CR 20-30% melhorado)
- CAC (Cost per Acquisition): $15-$25 (otimizado)
```

#### **Cenário 3: Scale Phase (Mês 4+)**
```
Total Budget: $3,000 - $5,000/mês

Breakdown:
├── Campanha 2 (Conversion): $2,400-$4,000 ($80-$130/dia) ⬆️⬆️ ESCALAR
├── Retargeting Agressivo: $600-$1,000 ($20-$30/dia)
└── Awareness (mínimo): Apenas Lookalikes ($10/dia)

Expectativa:
- Conversões (Agendamentos): 100-200/mês
- CAC (Cost per Acquisition): $15-$20 (escala mantendo eficiência)
```

### 8.2 Bidding Strategy (Estratégia de Lance)

#### **Para Campanha 1 (Awareness - TOFU)**
```
Objetivo: Reach
Bid Strategy: Lowest Cost
OR
Bid Cap: $0.50 - $1.00 CPM (cost per 1000 impressions)

Optimization Goal: Reach
Delivery: Standard (evenly distributed)
```

#### **Para Campanha 2 (Conversion - MOFU/BOFU)**
```
Objetivo: Conversions
Bid Strategy: Lowest Cost (recommended)
OR
Cost Cap: $20-$30 per Lead event (se tiver 50+ conversões/semana)

Optimization Goal: Lead Event (Facebook Pixel - Form Submit)
Delivery: Accelerated (primeiras 48h) → Standard (depois)

Attribution Window: 7-day click, 1-day view
```

#### **Para Campanha 3 (Lead Ads)**
```
Objetivo: Lead Generation
Bid Strategy: Lowest Cost
OR
Bid Cap: $8-$12 per Lead (native form submit)

Optimization Goal: Leads (Facebook Native)
Delivery: Standard
```

### 8.3 Testing Budget (A/B Tests)

```
Reservar 15-20% do budget total para testes:
├── Creative Tests: $200-$400/mês
│   - Headlines (5 variações)
│   - Body Copy (3 variações)
│   - Images vs. Video
│   - Carrossel vs. Single Image
│
├── Audience Tests: $150-$300/mês
│   - Broad vs. Interest Targeting
│   - Lookalike 1% vs. 2-3%
│   - Age Ranges (25-45 vs. 45-65)
│
└── Placement Tests: $100-$200/mês
    - Feed Only vs. Feed + Stories
    - Facebook Only vs. Facebook + Instagram
    - Desktop vs. Mobile
```

---

## 📊 9. MÉTRICAS E KPIs

### 9.1 Dashboard de Métricas Primárias

| Métrica | Meta | Como Medir | Frequência |
|---------|------|------------|------------|
| **Agendamentos Online** | 50-100/mês | Facebook Pixel (Lead event) + Admin Dashboard | Diária |
| **CAC (Cost per Acquisition)** | ≤ $15-$20 | Total Spend ÷ Leads | Semanal |
| **ROAS (Return on Ad Spend)** | 3:1 - 5:1 | Revenue ÷ Ad Spend | Mensal |
| **CTR (Click-Through Rate)** | 2.5-4% | Clicks ÷ Impressions | Diária |
| **Conversion Rate (LP)** | 15-25% | Form Submits ÷ Landing Page Views | Semanal |
| **CPC (Cost per Click)** | $0.50-$1.50 | Total Spend ÷ Clicks | Diária |
| **CPM (Cost per 1000 Impressions)** | $8-$15 | Total Spend ÷ (Impressions/1000) | Semanal |

### 9.2 Métricas Secundárias (Qualidade de Leads)

| Métrica | Meta | Como Medir | Ação |
|---------|------|------------|------|
| **Show-Up Rate** | >70% | Appointments Attended ÷ Scheduled | Se <60%, melhorar follow-up |
| **Phone Call Rate** | 15-20% | Calls ÷ Total Leads | Indicador de urgência |
| **Average Time to Appointment** | 3-5 dias | Booking Date - Lead Date | Urgency messaging |
| **Lead-to-Customer Rate** | >80% | Completed Services ÷ Leads | Se <70%, investigar cancelamentos |
| **Upsell Rate** | 30-40% | Additional Services ÷ Oil Change Customers | Indicador de LTV |

### 9.3 Facebook Ads Manager - Métricas a Monitorar

#### **Tab: Performance**
```
✅ Results (Lead conversions)
✅ Cost per Result (CAC)
✅ Amount Spent
✅ Reach
✅ Impressions
✅ Frequency (manter < 3 para evitar ad fatigue)
```

#### **Tab: Engagement**
```
✅ Link Clicks
✅ CTR (Link Click-Through Rate)
✅ CPC (Cost per Link Click)
✅ Post Reactions
✅ Comments
✅ Shares
```

#### **Tab: Delivery**
```
✅ Delivery Status (Active/Paused/Learning)
✅ Budget Remaining
✅ Ad Set Budget vs. Spent
✅ Auction Overlap (se >10%, consolidar ad sets)
```

#### **Tab: Demographics**
```
✅ Age Breakdown (identificar sweet spot: provavelmente 35-54)
✅ Gender (M/F split)
✅ Placement (Feed vs. Stories)
✅ Device (Mobile vs. Desktop - provavelmente 80%+ mobile)
```

### 9.4 Google Analytics (Site Behavior)

```
Configurar Goals:
Goal 1: /estimate/confirmation page view (Primary Conversion)
Goal 2: Phone Click (tel: link click)
Goal 3: Time on Site > 2 minutes (Engagement)
Goal 4: Scroll Depth > 75% (/estimate page)

Segmentos a Analisar:
├── Traffic Source: facebook / cpc
├── Campaign: "oil_change_*"
├── Landing Page: /estimate OR /
└── Conversion Path: Pages visited before form submission
```

### 9.5 Frequência de Análise e Otimização

#### **Diária** (Primeiros 30 dias)
```
07:00 AM: Check ad performance (CAC, CTR, Spend)
12:00 PM: Adjust budgets (pause low performers, scale winners)
06:00 PM: Review form submissions (quality check)
```

#### **Semanal** (Reunião de Análise)
```
Segunda-feira:
- Review last week performance
- Identify top/bottom performing ads and audiences
- Plan creative/copy tests for the week
- Adjust budgets based on CAC trends

Sexta-feira:
- Weekly report (agendamentos, CAC, ROAS)
- Customer feedback analysis (show-up rate, satisfação)
- Prepare next week's tests
```

#### **Mensal** (Strategic Review)
```
- Overall campaign ROAS
- Customer Lifetime Value (LTV) analysis
- Upsell performance (oil change → other services)
- Competitor benchmarking
- Strategic pivots (e.g., should we expand to other services?)
```

---

## 🌐 10. LANDING PAGE E CONVERSÃO

### 10.1 Landing Page Atual (/estimate)

#### ✅ Pontos Fortes
```
1. Multi-Step Form (reduz ansiedade)
2. Progress Indicator (5 passos visíveis)
3. Mobile-Optimized (responsivo)
4. Facebook Pixel Tracking (Lead event configurado)
5. Contact Preferences (Phone/WhatsApp/Text) - flexibilidade
6. Calendar Integration (agendamento direto)
```

#### ⚠️ Oportunidades de Melhoria

**PRIORIDADE ALTA** (implementar antes de escalar budget):
```
1. ❌ CRIAR LANDING PAGE DEDICADA: /oil-change
   - Hero com oferta ($39.90 + FREE Labor)
   - FAQ específico de oil change
   - Botão único: "Book Oil Change Now" → /estimate?service=oil
   - Testimonials de oil change customers
   - Reduzir friction (menos campos no form)

2. ❌ SIMPLIFICAR FORM PARA OIL CHANGE:
   - Auto-select "mechanic" service type
   - Auto-check "Oil Change & FREE Checkup" in Step 2b
   - Skip photos (opcional para oil change)
   - Reduzir para 3 steps: Contact Info → Scheduling → Confirmation

3. ❌ ADICIONAR TRUST BADGES:
   - Google Reviews widget (mostrar 4.9/5)
   - BBB Accredited (se aplicável)
   - Payment icons (mesmo que seja cash/cartão no local)
   - Certificados (ASE Certified Technicians, se aplicável)
```

**PRIORIDADE MÉDIA** (otimizações incrementais):
```
4. ⏳ Exit Intent Popup:
   - Trigger quando usuário move mouse para sair
   - Offer: "Wait! Get $10 OFF if you book now"
   - Phone number destacado: "Or call: 321-960-8661"

5. ⏳ Live Chat (Chatbot):
   - Responder perguntas comuns (horário, localização, serviços)
   - Oferecer agendamento assistido
   - Capturar leads que não convertem pelo form

6. ⏳ Countdown Timer:
   - "Only 3 spots left today at $39.90"
   - Criar urgência (mas ser honesto, atualizar diariamente)

7. ⏳ Social Proof Real-Time:
   - "John D. from Orlando just booked an appointment"
   - Popup não-invasivo, bottom-left
```

**PRIORIDADE BAIXA** (testes futuros):
```
8. 📊 Video Explainer:
   - 30-60s explicando o processo de agendamento
   - Mostrar a loja, mecânicos, serviço
   - Humanizar a marca

9. 📊 Comparison Table:
   - FlipCars vs. Competitors (preço, tempo, qualidade)
   - Destacar diferenciais (FREE Labor)

10. 📊 Guarantee/Warranty Badge:
    - "100% Satisfaction Guaranteed or Your Money Back"
    - "Lifetime Warranty on All Work" (se aplicável a oil change)
```

### 10.2 Conversion Rate Optimization (CRO) Checklist

#### **Above the Fold** (sem scroll)
```
✅ Headline clara: "$39.90 Oil Change + FREE Labor"
✅ Sub-headline: Benefícios (3-5 bullet points)
✅ CTA Button: "Book Online Now" (contraste alto)
✅ Trust Badge: "⭐ 4.9/5 on Google" + "Licensed & Insured"
❌ NO distractions (menu minimalista, sem popup imediato)
```

#### **Form Design**
```
✅ Single Column (mobile-first)
✅ Large Input Fields (touch-friendly)
✅ Clear Labels (above input, not placeholder)
✅ Error Messages (inline, helpful)
✅ Auto-Format Phone (XXX) XXX-XXXX
✅ Progress Bar (visual feedback)
❌ NO CAPTCHA (usar honeypot para bots)
```

#### **Post-Conversion** (/estimate/confirmation)
```
✅ Thank You Message claro
✅ Next Steps (o que esperar: "Você receberá confirmação em 30min")
✅ Calendar Add (ICS file download)
✅ Social Share Buttons: "Tell your friends about this deal!"
✅ Upsell Soft: "Need other services? We also do..." (não invasivo)
```

### 10.3 Page Speed Optimization

#### **Target Metrics** (Google PageSpeed Insights)
```
Mobile:
- Performance Score: >80
- First Contentful Paint: <2s
- Largest Contentful Paint: <2.5s
- Time to Interactive: <3.5s

Desktop:
- Performance Score: >90
- FCP: <1s
- LCP: <1.5s
- TTI: <2s
```

#### **Ações Técnicas** (se necessário)
```
1. Image Optimization:
   - Usar WebP format (fallback para JPEG)
   - Lazy loading para imagens below fold
   - Comprimir todas as imagens (<200KB)

2. Code Splitting (Next.js):
   - Dynamic imports para Step components
   - Reduzir bundle size inicial

3. CDN:
   - Cloudflare ou Vercel Edge (já implementado?)
   - Cache estático agressivo

4. Critical CSS:
   - Inline CSS crítico no <head>
   - Defer non-critical CSS
```

---

## 📅 11. CRONOGRAMA DE IMPLEMENTAÇÃO

### Semana 1: Preparação (Pré-Launch)

#### **Dia 1-2: Setup Técnico**
```
☐ Verificar Facebook Pixel instalado corretamente
   - Testar Lead event (form submit)
   - Testar PageView event
   - Testar Custom Events (OilChangeCTAClick, PhoneClick)
☐ Criar Facebook Business Manager
   - Ad Account configurado
   - Pixel conectado
   - Payment method adicionado
☐ Google Analytics Goals configurados
   - Goal 1: /estimate/confirmation
   - Goal 2: Phone click
☐ Criar página /oil-change (se decidir implementar)
☐ Testar fluxo de agendamento end-to-end (mobile + desktop)
```

#### **Dia 3-4: Creative Production**
```
☐ Photoshoot (se necessário):
   - Hero shot (mecânico trabalhando)
   - Facility exterior/interior
   - Before/After (óleo sujo vs. limpo)
☐ Design Gráfico:
   - Price graphic ($39.90 com badge FREE LABOR)
   - Carrossel (5 cards)
   - Stories template (1080x1920)
☐ Copywriting:
   - 5 headlines variações
   - 3 body copy templates
   - CTAs
☐ Video (se aplicável):
   - Script para vídeo 15-30s
   - Gravação + Edição
   - Legendas (closed captions)
```

#### **Dia 5-7: Campaign Setup**
```
☐ Criar Campanhas no Ads Manager:
   - Campanha 1: Awareness
   - Campanha 2: Conversion
   - Campanha 3: Lead Ads (teste)
☐ Criar Ad Sets:
   - 3-5 ad sets por campanha
   - Definir budgets
   - Configurar targeting
☐ Criar Ads:
   - 3-5 ads por ad set (teste A/B)
   - Upload de criativos
   - Inserir copy
   - Configurar CTAs
☐ Review Final:
   - Verificar todos os links (UTM tracking)
   - Testar mobile preview
   - Aprovar criativos (legal/compliance)
☐ Submeter para Aprovação Facebook (pode levar 24-48h)
```

### Semana 2-3: Launch & Otimização Inicial

#### **Dia 8: LANÇAMENTO 🚀**
```
07:00 AM: ✅ Ativar todas as campanhas
08:00 AM: ✅ Monitorar primeiras impressões
10:00 AM: ✅ Check aprovações (se algum ad foi rejeitado)
12:00 PM: ✅ Primeira análise de CTR
06:00 PM: ✅ Review de primeiros cliques e form submissions
```

#### **Dia 9-14: Monitoramento Intensivo**
```
Diariamente:
☐ 07:00 AM: Dashboard review (spend, CTR, CAC)
☐ 12:00 PM: Ajustes de budget (pause low performers)
☐ 06:00 PM: Form submission quality check

A cada 48h:
☐ Pausar ads com CTR < 1.5%
☐ Duplicar (scale) ads com CTR > 3.5% e CAC < $25
☐ Testar nova variação de copy ou criativo
```

#### **Dia 15-21: Primeiras Otimizações**
```
☐ Análise de Audiences:
   - Qual público tem menor CAC?
   - Qual idade/gênero converte mais?
   - Mobile vs. Desktop split?
☐ Creative Performance:
   - Vídeo vs. Imagem: qual performa melhor?
   - Carrossel vs. Single Image?
   - Qual headline tem maior CTR?
☐ Ajustes:
   - Realocar budget para top performers
   - Criar Lookalike 1% de converters (se >50 conversões)
   - Adicionar retargeting de website visitors
```

### Semana 4: First Report & Scale Decision

```
☐ Weekly Report Completo:
   - Total agendamentos: X
   - CAC: $Y
   - ROAS: Z:1
   - Show-up rate: W%
   - Customer satisfaction: NPS score

☐ Decisão de Escala:
   SE CAC < $20 E show-up rate > 70%:
      → Aumentar budget em 30-50%
      → Expandir para Lookalike 2-3%
      → Testar placements adicionais (Messenger, Audience Network)
   
   SE CAC > $30 OU show-up rate < 60%:
      → Pausar campanhas de baixa performance
      → Revisar landing page (CRO improvements)
      → Investigar qualidade de leads (wrong expectations?)
   
   SE CAC $20-$30 E show-up rate 60-70%:
      → Manter budget atual
      → Continuar otimizações (creative, copy, targeting)
      → Focar em melhorar show-up rate (SMS reminders?)
```

### Mês 2-3: Optimization & Expansion

```
Semana 5-8:
☐ A/B Tests Avançados:
   - Landing page variations (headline, form length)
   - Offer tests ($39.90 vs. "Save $80+" messaging)
   - Urgency vs. Value positioning
☐ Retargeting Avançado:
   - Sequenced ads (3 touchpoints)
   - Dynamic Creative Optimization (DCO)
☐ Expandir Geográficos:
   - Se Orlando performar bem, testar Tampa, Jacksonville
☐ Novos Formatos:
   - Instagram Reels Ads
   - Facebook Stories Ads full-screen
   - Collection Ads (se tiver catálogo de serviços)

Semana 9-12:
☐ Lifetime Value Analysis:
   - Quantos clientes de oil change voltam?
   - Taxa de upsell para serviços maiores (bodyshop, warranty)
   - Ajustar CAC target baseado em LTV
☐ Seasonal Campaigns:
   - "Summer Road Trip Ready" (oil change antes de viagem)
   - "Back to School Special" (agosto/setembro)
☐ Referral Program:
   - "Refer a friend, both get $10 OFF"
   - Tracking via códigos promocionais
```

---

## 🔍 12. ANÁLISE SWOT DA CAMPANHA

### STRENGTHS (Forças)

```
✅ Oferta Competitiva Forte:
   - $39.90 é preço agressivo no mercado
   - FREE Labor (economia de $80+) - diferencial claro
   - FREE Checkup - valor agregado sem custo adicional

✅ Infraestrutura Digital Pronta:
   - Site profissional e responsivo (flipcars.us)
   - Sistema de agendamento online funcional
   - Facebook Pixel configurado e tracking Lead events
   - Admin dashboard para gerenciar appointments

✅ Social Proof Estabelecida:
   - 4.9/5 Stars no Google (51 reviews)
   - Licensed & Insured
   - Lifetime Warranty (confiança)

✅ Localização Geográfica Favorável:
   - Orlando é mercado grande (pop. 2.7M+ metro area)
   - Alto trânsito de turistas (potencial para one-time services)
   - Concorrência fragmentada (muitos pequenos players)

✅ Low Barrier to Entry:
   - Oil change é serviço de baixo ticket ($39.90)
   - Não requer commitment longo (30-45 min serviço)
   - Agendamento online reduz friction (sem ligação)
```

### WEAKNESSES (Fraquezas)

```
⚠️ Oil Change Não Está Proeminente no Site:
   - Não aparece na seção "Services" da homepage
   - Só visível no Hero carousel (slide 0)
   - Pode confundir usuários sobre foco do negócio (bodyshop vs. mechanic)

⚠️ Form de Agendamento Pode Ser Longo:
   - 5 steps podem parecer muitos para um serviço simples
   - Oil Change está em Step 2b (não é imediato)
   - Potencial de abandono entre Step 1 e Step 5

⚠️ Ausência de Landing Page Dedicada:
   - /oil-change não existe (redireciona para /estimate genérico)
   - Falta conteúdo específico de oil change (FAQ, benefícios, detalhes)
   - Dificulta A/B testing e otimização focada

⚠️ Falta de Prova Social Específica:
   - Não há testimonials específicos de oil change customers
   - Fotos/vídeos do processo podem não existir
   - Dificulta mostrar "behind the scenes" do serviço

⚠️ Baixa Margem de Lucro (Provavelmente):
   - $39.90 é preço promocional, margem pode ser apertada
   - CAC precisa ser muito baixo (< $15) para ser lucrativo
   - Dependência de upselling para gerar lucro real
```

### OPPORTUNITIES (Oportunidades)

```
🚀 Upselling e Cross-Selling:
   - Oil change é porta de entrada para serviços maiores
   - FREE Checkup identifica outros problemas (brakes, suspension, etc.)
   - Potencial para converter 30-40% em serviços adicionais

🚀 Recurring Revenue Model:
   - Oil change é serviço recorrente (3-6 meses)
   - Criar programa de membership/subscription
   - Email marketing para re-engajamento ("Time for your next oil change!")

🚀 Expansão de Serviços de Baixo Ticket:
   - Tire Rotation ($20-$30)
   - Brake Inspection (FREE + upsell)
   - Battery Check (FREE + upsell)
   - A/C Recharge ($80-$120)

🚀 Partnerships e B2B:
   - Fleet services (Uber/Lyft drivers, delivery drivers)
   - Rideshare discount programs
   - Corporate partnerships (employee benefits)

🚀 Seasonal Campaigns:
   - "Summer Road Trip Ready" (maio-junho)
   - "Winter Vehicle Preparation" (outubro-novembro)
   - "New Year, New Oil" (janeiro)

🚀 User-Generated Content (UGC):
   - Incentivar clientes a postar no Instagram/Facebook
   - Criar hashtag #FlipCarsOilChange
   - Oferecer desconto em próxima visita por review/post

🚀 Expansão Geográfica:
   - Se Orlando performar bem (CAC < $15, show-up rate > 75%)
   - Testar Tampa, Jacksonville, Miami
   - Eventualmente, franchise model?
```

### THREATS (Ameaças)

```
⚠️ Concorrência de Low-Cost Chains:
   - Jiffy Lube, Valvoline, Pep Boys têm brand recognition
   - Podem igualar ou baixar preços (race to the bottom)
   - Orçamentos de marketing maiores

⚠️ Sazonalidade da Demanda:
   - Oil change pode ter baixa demanda em certos meses
   - Turismo em Orlando é sazonal (alta no verão/inverno, baixa outono/primavera)
   - Economia em recessão = pessoas postergam manutenção

⚠️ Desafios de Logística e Capacidade:
   - Se campanha for MUITO bem-sucedida, pode sobrecarregar a oficina
   - Fila de espera pode levar a má experiência e reviews negativos
   - Necessidade de contratar mais mecânicos/expandir horários

⚠️ Qualidade de Leads de Facebook Ads:
   - Facebook pode trazer leads de baixa qualidade (no-shows)
   - Usuários podem clicar por curiosidade, não intenção real
   - Show-up rate <60% pode inviabilizar o CAC

⚠️ Mudanças no Facebook Ads:
   - iOS 14+ privacy changes (tracking limitado)
   - CPM em alta (competição por ad space)
   - Algoritmo do Facebook priorizando Reels (pode exigir mais conteúdo em vídeo)

⚠️ Reputação Online Frágil:
   - Uma experiência ruim pode viralizar (review negativo no Google)
   - Oil change errado pode causar dano ao motor (lawsuit risk)
   - Necessidade de manter 4.9/5 stars para credibilidade
```

---

## 🎯 PRÓXIMOS PASSOS (AÇÃO IMEDIATA)

### ✅ CHECKLIST DE PRÉ-LANÇAMENTO

#### **URGENTE** (Fazer ANTES de lançar campanhas)
```
☐ 1. Criar Assets Criativos:
   - Contratar fotógrafo OU usar banco de imagens (Unsplash, Pexels)
   - Design gráfico: $39.90 + FREE Labor visual
   - 3 variações de headlines escritas
   - 2 variações de body copy

☐ 2. Configurar Facebook Pixel (verificar):
   - Testar Lead event disparando no /estimate/confirmation
   - Testar PageView event no /estimate
   - Criar Custom Conversions no Business Manager

☐ 3. Criar Audiences:
   - Custom Audience: Website Visitors (últimos 30 dias)
   - Upload de Email List (se disponível) para Lookalike
   - Salvar Interest Audiences (Orlando Car Owners, Auto Maintenance)

☐ 4. Landing Page /oil-change (RECOMENDADO mas não bloqueante):
   - Clonar /estimate e customizar para oil change
   - Simplificar form (auto-select oil service)
   - Adicionar FAQ específico de oil change
```

#### **IMPORTANTE** (Fazer na Semana 1)
```
☐ 5. Configurar Google Analytics:
   - Goals para form submission
   - Goals para phone click
   - UTM tracking para todos os links de Facebook Ads

☐ 6. Preparar Operações Internas:
   - Treinar equipe para receber influxo de agendamentos online
   - Criar script de confirmação por telefone/SMS
   - Preparar estoque de óleo e filtros (demanda aumentará)

☐ 7. Definir Orçamento Final:
   - Aprovar budget mensal ($2,000-$3,000 Launch Phase)
   - Configurar método de pagamento no Facebook Business Manager
   - Definir billing threshold

☐ 8. Legal/Compliance:
   - Revisar copy dos ads (sem claims falsos, FDA, FTC compliant)
   - Termos da promoção claros (conditions apply, *asterisks)
   - Privacy Policy atualizada (GDPR, CCPA se aplicável)
```

#### **NICE TO HAVE** (Fazer no Mês 1)
```
☐ 9. Preparar Conteúdo Orgânico (Facebook/Instagram):
   - 3-5 posts sobre oil change (feed + stories)
   - Behind-the-scenes do processo (humanizar)
   - Customer testimonials (pedir reviews de clientes satisfeitos)

☐ 10. Email Marketing:
   - Criar sequência de follow-up (confirmation, reminder, thank you)
   - Newsletter mensal com dicas de manutenção
   - Re-engagement campaign ("Time for your next oil change!")

☐ 11. Parceria com Influencers Locais (micro-influencers):
   - Identificar 5-10 influencers de Orlando (10k-50k followers)
   - Oferecer oil change gratuito em troca de post
   - Budget: $200-$500 (muito menor que ads tradicionais)
```

---

## 📊 RESUMO FINAL E RECOMENDAÇÕES

### 🎯 RECOMENDAÇÃO ESTRATÉGICA

**ABORDAGEM: "Test & Scale" (Começar Pequeno, Escalar Rápido)**

1. **Semana 1-2**: Launch com budget conservador ($50-$70/dia)
2. **Semana 3-4**: Otimizar baseado em dados reais (pausar low performers, dobrar budget em winners)
3. **Mês 2**: Se CAC < $20 e show-up rate > 70%, ESCALAR para $100-$150/dia
4. **Mês 3+**: Expandir para novos públicos, formatos, e geográficos

### 💡 3 FATORES CRÍTICOS DE SUCESSO

```
1. ✅ QUALITY OF LEADS > QUANTITY
   - Melhor ter 30 agendamentos com 90% show-up rate
   - Do que 100 agendamentos com 40% show-up rate
   - Monitorar qualidade desde o Dia 1

2. ✅ VELOCIDADE DE OTIMIZAÇÃO
   - Primeiros 14 dias são CRÍTICOS
   - Analisar dados diariamente
   - Não ter medo de pausar ads ruins rapidamente

3. ✅ UPSELLING É A CHAVE DA LUCRATIVIDADE
   - Oil change $39.90 pode ter margem baixa
   - FREE Checkup deve revelar outros serviços necessários
   - Treinar mecânicos para fazer upselling educado (não pushy)
```

### 🚀 GO/NO-GO DECISION POINTS

**LANÇAR A CAMPANHA SE:**
- ✅ Website está funcional e mobile-optimized
- ✅ Sistema de agendamento está testado (end-to-end)
- ✅ Facebook Pixel está tracking Lead events corretamente
- ✅ Criativos estão prontos (mínimo 3 imagens + 2 copies)
- ✅ Equipe interna está preparada para receber leads
- ✅ Budget aprovado ($2,000+ para primeiros 30 dias)

**NÃO LANÇAR (OU PAUSAR) SE:**
- ❌ Show-up rate < 50% (indica problema de qualidade ou operacional)
- ❌ CAC > $50 após 14 dias (não é sustentável)
- ❌ Conversion rate < 5% (problema de landing page ou audience)
- ❌ Feedback negativo de clientes (reviews ruins, reclamações)

### 📞 PONTOS DE CONTATO

**Para discutir este plano ou tirar dúvidas:**
- Review deste documento completo
- Identificar blockers (assets, budget, técnico)
- Definir data de lançamento target
- Agendar reuniões de check-in (weekly durante primeiras 4 semanas)

---

## 📎 APÊNDICES

### A. GLOSSÁRIO DE TERMOS

| Termo | Definição |
|-------|-----------|
| **CAC** | Cost per Acquisition - Custo total para adquirir um cliente (agendamento) |
| **ROAS** | Return on Ad Spend - Retorno sobre investimento em anúncios (receita ÷ gasto) |
| **CTR** | Click-Through Rate - Taxa de cliques (cliques ÷ impressões) |
| **CPC** | Cost per Click - Custo médio por clique |
| **CPM** | Cost per Mille - Custo por 1000 impressões |
| **CR** | Conversion Rate - Taxa de conversão (conversões ÷ visitantes) |
| **LTV** | Lifetime Value - Valor total que um cliente gera ao longo do relacionamento |
| **TOFU/MOFU/BOFU** | Top/Middle/Bottom of Funnel - Estágios do funil de marketing |
| **Lookalike Audience** | Público similar a uma base de clientes existentes (Facebook cria baseado em machine learning) |
| **Retargeting** | Re-engajar pessoas que já interagiram com a marca (visitaram site, etc.) |

### B. RECURSOS ÚTEIS

**Facebook Ads Manager:**
- https://business.facebook.com/adsmanager
- https://business.facebook.com/events_manager (Pixel)

**Facebook Blueprint (Treinamento Gratuito):**
- https://www.facebook.com/business/learn

**Ferramentas de Design:**
- Canva (templates prontos): https://www.canva.com
- Figma (design profissional): https://www.figma.com

**Banco de Imagens Gratuitas:**
- Unsplash: https://unsplash.com
- Pexels: https://www.pexels.com
- Pixabay: https://pixabay.com

**Analytics:**
- Google Analytics: https://analytics.google.com
- Facebook Pixel Helper (Chrome Extension): Verificar se pixel está instalado
- GTM (Google Tag Manager): Gerenciar pixels e tags

### C. BENCHMARKS DA INDÚSTRIA (Automotive Services)

```
Facebook Ads - Automotive Services (US Market):
- CTR médio: 1.5-3%
- CPC médio: $0.80-$2.50
- CPM médio: $10-$20
- Conversion Rate: 10-20%
- CAC médio: $20-$50

Oil Change Específico (Low-Ticket Service):
- CTR esperado: 2.5-4% (acima da média, devido a preço low-cost)
- CAC target: $10-$20 (menor que serviços high-ticket)
- Show-up rate: 70-85% (oil change é urgente, maior show-up que outros serviços)
```

---

**FIM DO PLANEJAMENTO**

---

### 🗓️ PRÓXIMA REUNIÃO - AGENDA SUGERIDA

```
1. Review deste documento (20 min)
2. Definir assets disponíveis (fotos, vídeos) (10 min)
3. Aprovar budget e timeline (10 min)
4. Decidir: Criar /oil-change landing page OU usar /estimate? (10 min)
5. Atribuir responsabilidades (quem faz o quê) (10 min)
6. Definir data de lançamento (5 min)

Total: 65 minutos
```

**Data de Criação**: 2025-12-05  
**Versão**: 1.0  
**Próxima Revisão**: Após 30 dias de campanha ativa

---

