# 🎯 Estratégia Completa de Campanha Facebook Ads - FlipCars

## 📊 PARTE 1: CAPTURA DE LEADS PARCIAIS

### ✅ Sistema Implementado

Criamos um sistema que captura dados do usuário **mesmo se ele não completar o formulário**:

#### **Como Funciona:**

1. **Auto-save a cada step do formulário**
   - Step 1: Nome + Tipo de serviço
   - Step 2: Detalhes do serviço + Seguro
   - Step 3: Fotos
   - Step 4: Contato (email + telefone) ← **CRÍTICO**

2. **Eventos Facebook Pixel:**
   - `InitiateCheckout` quando usuário começar a preencher
   - `PartialLeadCapture` quando preencher email OU telefone
   - `Lead` quando completar formulário

3. **Armazenamento:**
   - localStorage (navegador do usuário)
   - Eventos enviados para Facebook
   - Você pode criar público de "Iniciaram formulário mas não completaram"

---

## 🎬 PARTE 2: ESTRATÉGIA DE CAMPANHA COM VÍDEO

### **Objetivo: Gerar Leads Qualificados para Auto Body Repair**

---

## 📋 ESTRUTURA DA CAMPANHA

### **Campanha 1: Conversão - Leads de Estimativa**

#### **Configuração Básica:**
- **Objetivo**: Conversions (Conversões)
- **Evento de Conversão**: Lead (formulário de estimativa)
- **Orçamento Diário**: $20-50 (começar baixo e escalar)
- **Duração**: Contínua (sempre ativa)

#### **Segmentação (Público):**

**Localização:**
- Orlando, FL + 25 milhas de raio
- Ou CEPs específicos: 32801, 32803, 32804, 32805, 32806, etc.

**Demografia:**
- **Idade**: 25-65 anos
- **Gênero**: Todos
- **Idioma**: Inglês, Espanhol (comunidade latina forte em Orlando)

**Interesses (Adicione estes):**
- 🚗 Automotive (Automotivo geral)
- 🔧 Auto repair
- 🏁 Car racing / Car enthusiasts
- 💰 Auto insurance
- 🚘 Luxury cars (potencial maior ticket)
- 📱 Mobile users (60-70% do seu tráfego)

**Comportamentos:**
- Compraram carro recentemente
- Proprietários de veículos
- Comutadores (quem dirige diariamente)

**Exclusões (Importante!):**
- Pessoas fora de Orlando/FL
- Menores de 25 anos (improvável terem seguro próprio)

---

### **Criativos (Ad Sets)**

#### **Ad Set 1: Vídeo "Before & After"** (Seu vídeo)

**Texto do Anúncio (Primary Text):**
```
🚗 Bateu o carro? Nós consertamos como novo!

✅ Aprovado por TODAS as seguradoras
✅ Reboque GRÁTIS
✅ Carro aluguel GRÁTIS
✅ SEM pagamento adiantado

⚡ Estimativa GRÁTIS em 24h!

📍 Orlando, FL | 20+ anos de experiência
📞 (321) 960-8661

👉 Clique para começar seu conserto hoje!
```

**Headline (Título):**
```
Conserto de Colisão Aprovado pelo Seguro
```

**Description:**
```
Estimativa grátis. Reboque grátis. Sem pagamento adiantado. Começe agora!
```

**Call-to-Action Button:**
- **"Get Quote"** (Obter Orçamento) ← Melhor para serviços
- OU "Learn More" (Saiba Mais)

#### **Vídeo:**
- Upload do arquivo "Flipcars video.mov"
- **Legendas**: OBRIGATÓRIO (60% assistem sem som)
- **Thumbnail**: Frame com before/after mais impactante
- **Duração**: Ideal 15-30 segundos (cortar se necessário)

---

#### **Ad Set 2: Carrossel de Imagens**

**Imagens Sugeridas:**
1. Before & After de reparo
2. Loja/Equipamentos profissionais
3. Equipe trabalhando
4. Carro pintado na cabine
5. Cliente satisfeito recebendo chaves

**Texto por Card:**
- Card 1: "Bateu o carro? Consertamos!"
- Card 2: "Equipamentos de última geração"
- Card 3: "20+ anos de experiência"
- Card 4: "Acabamento de fábrica"
- Card 5: "Estimativa GRÁTIS em 24h"

---

#### **Ad Set 3: Imagem Estática + Oferta**

**Design:**
```
┌─────────────────────────────┐
│  BATEU O CARRO?             │
│                             │
│  ✅ Reboque GRÁTIS          │
│  ✅ Carro aluguel GRÁTIS    │
│  ✅ Estimativa em 24h       │
│  ✅ Aprovado por seguradoras│
│                             │
│  📞 (321) 960-8661          │
│                             │
│  [COMEÇAR AGORA]            │
└─────────────────────────────┘
```

---

### **Campanha 2: Remarketing - Abandono de Formulário**

#### **Público:**
- Pessoas que visitaram o site (últimos 7 dias)
- Pessoas que iniciaram formulário mas não completaram
- Pessoas que clicaram em CTAs

#### **Criativo:**
```
Olá! Notamos que você começou uma estimativa...

⚡ OFERTA ESPECIAL para você:
✅ 10% de desconto se agendar esta semana
✅ Reboque grátis mesmo se não tiver seguro
✅ Atendimento prioritário

👉 Complete sua estimativa agora!
📞 Ou ligue: (321) 960-8661
```

---

### **Campanha 3: Lookalike Audience (Após 50+ Leads)**

#### **Público:**
- Lookalike 1-2% baseado em LEADS
- Mesmo targeting geográfico (Orlando + 25mi)

#### **Budget:**
- Maior orçamento (este público converte melhor)
- $50-100/dia quando escalar

---

## 📊 MÉTRICAS PARA ACOMPANHAR

### **Métricas Primárias:**
1. **Custo por Lead (CPL)**
   - Meta inicial: $15-30 por lead
   - Após otimização: $10-20 por lead

2. **Taxa de Conversão**
   - Meta: 5-10% (visitantes → leads)

3. **CTR (Click-Through Rate)**
   - Meta: 2-5%

### **Métricas Secundárias:**
4. **CPC (Custo por Clique)**
   - Meta: $0.50-2.00

5. **Frequency (Frequência)**
   - Manter abaixo de 3 (evitar ad fatigue)

6. **Video Views**
   - ThruPlay rate >15%

---

## 🎯 FUNIL DE CONVERSÃO

### **Jornada do Cliente:**

```
1. VER ANÚNCIO (Facebook/Instagram)
   ↓
2. CLICAR (CTA: Get Quote)
   ↓
3. CHEGAR NO SITE (flipcars.us)
   ↓ [CAPTURA PARCIAL AQUI]
4. COMEÇAR FORMULÁRIO
   ↓ [CAPTURA EMAIL/PHONE]
5. PREENCHER DADOS
   ↓ [EVENTO: InitiateCheckout]
6. SUBMETER FORMULÁRIO
   ↓ [EVENTO: Lead]
7. CONVERSÃO COMPLETA ✅
```

---

## 🔧 SETUP TÉCNICO

### **1. Configurar Eventos Personalizados no Facebook:**

Vá para **Events Manager → Custom Conversions**:

#### **Conversão 1: Formulário Iniciado**
- **Nome**: Estimate Form Started
- **Regra**: Event = InitiateCheckout
- **Valor**: Evento de engajamento

#### **Conversão 2: Email Capturado**
- **Nome**: Email Captured
- **Regra**: Event = PartialLeadCapture AND hasEmail = true
- **Valor**: Lead qualificado parcial

#### **Conversão 3: Lead Completo**
- **Nome**: Full Lead
- **Regra**: Event = Lead
- **Valor**: $50 (valor estimado de um lead)

---

### **2. Criar Públicos Personalizados:**

#### **Público 1: Visitantes do Site**
- **Nome**: FlipCars Website Visitors - 30 Days
- **Regra**: Visitaram qualquer página
- **Duração**: 30 dias

#### **Público 2: Formulário Iniciado (Não Completo)**
- **Nome**: Form Starters - Not Completed
- **Regra**: Event = InitiateCheckout BUT NOT Event = Lead
- **Duração**: 7 dias
- **USO**: Remarketing prioritário

#### **Público 3: Email Capturado (Não Completo)**
- **Nome**: Email Captured - Not Completed
- **Regra**: Event = PartialLeadCapture BUT NOT Event = Lead
- **Duração**: 14 dias
- **USO**: Remarketing + Criar Lookalike

#### **Público 4: Leads Completos**
- **Nome**: Full Leads - Conversions
- **Regra**: Event = Lead
- **Duração**: 180 dias
- **USO**: Criar Lookalike (melhor público)

---

### **3. Criar Lookalike Audiences:**

Após ter **50+ leads**:

#### **Lookalike 1%**
- **Baseado em**: Público "Full Leads"
- **Localização**: Estados Unidos
- **Tamanho**: 1%
- **USO**: Prospecting principal

#### **Lookalike 2%**
- **Baseado em**: Público "Full Leads"
- **Localização**: Estados Unidos
- **Tamanho**: 2%
- **USO**: Escalar após lookalike 1% funcionar

---

## 💰 ORÇAMENTO SUGERIDO

### **Fase 1: Teste (Semanas 1-2)**
- **Budget Total**: $500-700
- **Distribuição**:
  - Campanha Conversão (Vídeo): $300-400
  - Campanha Conversão (Imagens): $100-150
  - Remarketing: $100-150

### **Fase 2: Otimização (Semanas 3-4)**
- **Budget Total**: $700-1000
- **Focar no que funciona**: 70% budget no ad set com melhor CPL
- **Remarketing**: 30% do budget

### **Fase 3: Escala (Mês 2+)**
- **Budget Total**: $1000-2000+
- **Lookalike Audiences**: 50% do budget
- **Remarketing**: 30% do budget
- **Prospecting**: 20% do budget

---

## 📅 CRONOGRAMA DE IMPLEMENTAÇÃO

### **Semana 1:**
- [ ] Criar conta Facebook Ads (se não tiver)
- [ ] Configurar forma de pagamento
- [ ] Upload do vídeo e criar thumbn ail
- [ ] Criar copy dos anúncios
- [ ] Configurar Campanha 1 (Conversão)
- [ ] Iniciar com $20/dia

### **Semana 2:**
- [ ] Monitorar métricas diariamente
- [ ] Ajustar targeting se CPL > $30
- [ ] Testar diferentes copies
- [ ] Aumentar budget se CPL < $20

### **Semana 3:**
- [ ] Criar públicos personalizados
- [ ] Lançar Campanha 2 (Remarketing)
- [ ] Desativar ads com CTR < 1%

### **Semana 4:**
- [ ] Analisar dados completos
- [ ] Criar relatório de performance
- [ ] Planejar escala para mês 2

---

## 🎯 COPY VARIATIONS (Teste A/B)

### **Variation A: Foco em Seguro**
```
🚗 BATEU O CARRO? Seu seguro cobre!

Trabalhamos com TODAS as seguradoras:
✅ State Farm, Geico, Progressive, Allstate...
✅ Reboque GRÁTIS
✅ Carro aluguel GRÁTIS
✅ ZERO pagamento adiantado

📍 Orlando, FL | 20+ anos
📞 (321) 960-8661
```

### **Variation B: Urgência**
```
🚗 Bateu o carro? Conserte HOJE!

⚡ Atendimento EXPRESSO:
✅ Estimativa em 24h
✅ Reparos em 3-5 dias
✅ Reboque imediato GRÁTIS

👉 NÃO ESPERE! Agende agora
📞 (321) 960-8661
```

### **Variation C: Social Proof**
```
⭐⭐⭐⭐⭐ 4.9/5 - 51 avaliações

"Melhor funilaria de Orlando!" - Maria S.

✅ 20+ anos de experiência
✅ Garantia vitalícia nos reparos
✅ Equipamentos de última geração

📞 (321) 960-8661
👉 Estimativa GRÁTIS em 24h
```

---

## 🚀 PRÓXIMOS PASSOS IMEDIATOS

### **1. Configurar Sistema de Captura Parcial:**
```bash
# Integrar o código de captura parcial no formulário
# Já criamos o arquivo: src/lib/partialLeadCapture.ts
```

### **2. Preparar Vídeo:**
- [ ] Adicionar legendas (use Kapwing ou CapCut)
- [ ] Cortar para 15-20 segundos se maior
- [ ] Criar 3 thumbnails diferentes para testar

### **3. Criar Conteúdo Gráfico:**
- [ ] Logo em alta resolução
- [ ] Fotos before/after (mínimo 5)
- [ ] Foto da equipe/loja

### **4. Configurar Facebook Business Manager:**
- [ ] Criar conta (business.facebook.com)
- [ ] Adicionar forma de pagamento
- [ ] Conectar página do Facebook/Instagram
- [ ] Verificar domínio flipcars.us

---

## 📞 SUPORTE E AJUDA

**Precisa de ajuda com:**
- Criação das campanhas passo-a-passo
- Design dos anúncios
- Análise de resultados
- Otimização de performance

**Me avise e eu te ajudo!**

---

**Data de Criação**: 2025-11-23
**Status**: Pronto para implementação
**Pixel Instalado**: ✅ Funcionando (ID: 2262253837597996)
**Próximo Passo**: Implementar captura parcial e criar primeira campanha
