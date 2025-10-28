# FlipCars 2.0 - Brand Identity & Visual Guidelines

## 📋 Análise do Site Atual (www.flipcars.us)

### Informações Gerais
- **Nome da Marca:** Flip Cars™
- **Slogan/Tagline:** "All you need to fix car"
- **Localização:** Orlando, FL
- **Site Original:** www.flipcars.us

---

## 🎨 Paleta de Cores

### Cores Atuais (Extraídas)
```css
/* Cores Principais Identificadas */
--color-black: #000000;           /* Texto principal */
--color-white: #FFFFFF;           /* Fundo e texto invertido */
--color-dark-gray: #222222;       /* Cinza escuro */
--color-medium-gray: #666666;     /* Cinza médio */
--color-light-gray: #F5F5F5;      /* Fundo claro */
```

### Nova Paleta Proposta (Com Cor de Destaque)

#### Opção 1: Laranja Vibrante (RECOMENDADO)
```css
/* Paleta Principal - Laranja */
--primary-dark: #0A2540;          /* Azul marinho escuro - Profissionalismo */
--primary-medium: #336699;        /* Azul médio - Confiança */
--primary-light: #E8F1F8;         /* Azul muito claro - Backgrounds */

--accent-primary: #FF6B00;        /* Laranja vibrante - CTAs principais */
--accent-hover: #E55D00;          /* Laranja hover - Interações */
--accent-light: #FFE8D6;          /* Laranja claro - Backgrounds de destaque */

--neutral-black: #000000;         /* Preto puro - Títulos */
--neutral-dark: #1A1A1A;          /* Cinza muito escuro - Texto principal */
--neutral-medium: #666666;        /* Cinza médio - Texto secundário */
--neutral-light: #E0E0E0;         /* Cinza claro - Bordas */
--neutral-lighter: #F5F5F5;       /* Cinza muito claro - Fundos */
--neutral-white: #FFFFFF;         /* Branco puro - Fundos principais */

--success: #4CAF50;               /* Verde - Sucesso */
--warning: #FFC107;               /* Amarelo - Avisos */
--error: #F44336;                 /* Vermelho - Erros */
--info: #2196F3;                  /* Azul - Informações */
```

**Justificativa Opção 1:**
- Laranja transmite energia, ação e urgência (ideal para CTAs)
- Complementa bem os tons de azul/cinza neutros
- Alta visibilidade e contraste
- Associado a segurança e confiabilidade no setor automotivo

#### Opção 2: Verde Moderno (Alternativa)
```css
/* Paleta Principal - Verde */
--primary-dark: #0A2540;
--primary-medium: #336699;
--primary-light: #E8F1F8;

--accent-primary: #4CAF50;        /* Verde moderno */
--accent-hover: #45A049;
--accent-light: #E8F5E9;

/* Demais cores iguais à Opção 1 */
```

**Justificativa Opção 2:**
- Verde transmite renovação, reparo e "voltar ao novo"
- Associado a "aprovado" e "tudo certo" com seguradoras
- Tom mais sustentável e ecológico

#### Opção 3: Vermelho Automotivo (Tradicional)
```css
/* Paleta Principal - Vermelho */
--primary-dark: #0A2540;
--primary-medium: #336699;
--primary-light: #E8F1F8;

--accent-primary: #D32F2F;        /* Vermelho automotivo */
--accent-hover: #B71C1C;
--accent-light: #FFEBEE;

/* Demais cores iguais à Opção 1 */
```

**Justificativa Opção 3:**
- Vermelho é tradicional no setor automotivo
- Transmite paixão e urgência
- Pode ser muito agressivo para alguns contextos

### ✅ Decisão Recomendada: **OPÇÃO 1 - LARANJA VIBRANTE**

---

## 📝 Tipografia

### Fontes Atuais (Identificadas)
- **Atual:** Arial, Open Sans (sans-serif genéricas)

### Novas Fontes Recomendadas

#### Opção 1: Inter (RECOMENDADO)
```css
/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

/* Font Family Definitions */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Font Weights */
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
--font-black: 900;

/* Font Sizes - Mobile First */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */
--text-6xl: 3.75rem;     /* 60px */

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

**Justificativa Inter:**
- Excelente legibilidade em telas
- Suporta múltiplos pesos
- Otimizada para UI/UX
- Gratuita e open-source
- Renderização superior em dispositivos móveis

#### Opção 2: Roboto (Alternativa)
```css
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap');
--font-primary: 'Roboto', sans-serif;
```

### Hierarquia Tipográfica

#### Headings (Títulos)
```css
/* H1 - Hero Headlines */
h1, .h1 {
  font-family: var(--font-primary);
  font-weight: var(--font-extrabold);
  font-size: var(--text-4xl);      /* Mobile */
  line-height: var(--leading-tight);
  color: var(--neutral-black);
}
@media (min-width: 768px) {
  h1, .h1 {
    font-size: var(--text-5xl);    /* Tablet */
  }
}
@media (min-width: 1280px) {
  h1, .h1 {
    font-size: var(--text-6xl);    /* Desktop */
  }
}

/* H2 - Section Headers */
h2, .h2 {
  font-family: var(--font-primary);
  font-weight: var(--font-bold);
  font-size: var(--text-3xl);
  line-height: var(--leading-tight);
  color: var(--neutral-black);
}

/* H3 - Subsection Headers */
h3, .h3 {
  font-family: var(--font-primary);
  font-weight: var(--font-semibold);
  font-size: var(--text-2xl);
  line-height: var(--leading-tight);
  color: var(--neutral-dark);
}

/* H4 - Card Titles */
h4, .h4 {
  font-family: var(--font-primary);
  font-weight: var(--font-semibold);
  font-size: var(--text-xl);
  line-height: var(--leading-normal);
  color: var(--neutral-dark);
}
```

#### Body Text (Corpo de Texto)
```css
/* Paragraph - Regular */
p, body {
  font-family: var(--font-primary);
  font-weight: var(--font-regular);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--neutral-dark);
}

/* Small Text */
.text-small {
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  color: var(--neutral-medium);
}

/* Caption / Fine Print */
.text-caption {
  font-size: var(--text-xs);
  line-height: var(--leading-normal);
  color: var(--neutral-medium);
}

/* Bold Text */
strong, .font-bold {
  font-weight: var(--font-bold);
}
```

---

## 🖼 Logo

### Especificações do Logo

#### Descrição (Baseada no Site Atual)
- **Wordmark:** "FLIPCARS" em sans-serif robusta, capitalizada
- **Símbolo:** "US" posicionado acima do "S" (menor)
- **Trademark:** ™ símbolo presente
- **Versões:** Colorida (logo.png) e Branca (logo-white.png)

#### Formatos Necessários (A Criar)
```
/assets/logo/
├── logo-primary.svg          # Logo principal colorido (vetorial)
├── logo-white.svg            # Logo branco (para fundos escuros)
├── logo-black.svg            # Logo preto (para fundos claros)
├── logo-icon.svg             # Apenas ícone (quadrado)
├── logo-horizontal.svg       # Versão horizontal
├── logo-vertical.svg         # Versão vertical
├── favicon.svg               # Favicon vetorial
├── favicon-16x16.png         # Favicon 16px
├── favicon-32x32.png         # Favicon 32px
└── apple-touch-icon.png      # Apple touch icon 180x180
```

#### Área de Proteção (Clear Space)
- Mínimo: 1x altura do "F" em todas as direções
- Não colocar outros elementos dentro desta área

#### Tamanho Mínimo
- **Digital:** 120px de largura mínima
- **Print:** 30mm de largura mínima

#### Cores do Logo
```css
/* Logo Primary Version */
--logo-text: var(--neutral-black);
--logo-accent: var(--accent-primary);    /* Se houver elemento de destaque */

/* Logo White Version */
--logo-white: #FFFFFF;

/* Logo Black Version */
--logo-black: #000000;
```

---

## 🎯 Tom de Voz e Mensagens

### Princípios de Comunicação

#### Tom de Voz
- **Empático:** "Entendemos que sofrer um acidente é estressante"
- **Confiável:** "Com mais de 10 anos de experiência"
- **Eficiente:** "Processo simples em 4 passos"
- **Transparente:** "Acompanhe cada etapa do reparo em tempo real"
- **Acessível:** Linguagem clara, sem jargões técnicos desnecessários

#### Persona da Marca
- **Somos:** Especialistas acessíveis e comprometidos
- **Não somos:** Corporativos distantes ou técnicos impessoais
- **Falamos como:** Um amigo confiável que é expert no assunto

### Mensagens-Chave

#### Mensagem Principal (Value Proposition)
```
EN: "Collision Repair with Insurance Made Simple - We Handle Everything"
ES: "Reparación de Colisión con Seguro Simplificada - Nos Encargamos de Todo"
PT: "Reparo de Colisão com Seguro Simplificado - Cuidamos de Tudo"
```

#### Diferenciadores (Key Benefits)
1. **Sem Burocracia**
   - EN: "We handle all the paperwork with your insurance"
   - ES: "Manejamos todo el papeleo con tu seguro"
   - PT: "Cuidamos de toda a papelada com sua seguradora"

2. **Serviço Completo**
   - EN: "From towing to rental car - everything included"
   - ES: "Desde remolque hasta auto de alquiler - todo incluido"
   - PT: "De guincho a carro reserva - tudo incluso"

3. **Transparência**
   - EN: "Track your repair status in real-time"
   - ES: "Rastrea el estado de tu reparación en tiempo real"
   - PT: "Acompanhe o status do reparo em tempo real"

4. **Qualidade Garantida**
   - EN: "Certified technicians, OEM parts, lifetime warranty"
   - ES: "Técnicos certificados, piezas originales, garantía de por vida"
   - PT: "Técnicos certificados, peças originais, garantia vitalícia"

#### Headlines por Seção

##### Hero Section
```
EN: "Your Car, Perfectly Restored After an Accident"
ES: "Tu Auto, Perfectamente Restaurado Después de un Accidente"
PT: "Seu Carro, Perfeitamente Restaurado Após um Acidente"
```

##### Como Funciona
```
EN: "4 Simple Steps to Get Your Car Back Like New"
ES: "4 Pasos Simples Para Recuperar tu Auto Como Nuevo"
PT: "4 Passos Simples Para Ter Seu Carro de Volta Como Novo"
```

##### Serviços
```
EN: "Complete Collision Repair Services"
ES: "Servicios Completos de Reparación de Colisión"
PT: "Serviços Completos de Reparo de Colisão"
```

##### Depoimentos
```
EN: "What Our Customers Say"
ES: "Lo Que Dicen Nuestros Clientes"
PT: "O Que Nossos Clientes Dizem"
```

---

## 📸 Guia de Imagens e Fotografia

### Estilo Fotográfico

#### Características
- **Realismo:** Fotos reais da oficina FlipCars (não stock photos)
- **Iluminação:** Brilhante, bem iluminada, profissional
- **Enquadramento:** Limpo, focado, sem distrações
- **Pessoas:** Equipe real, expressões genuínas e acolhedoras
- **Veículos:** Ênfase em "Antes e Depois" dramáticos

#### Tipos de Fotos Necessárias

##### 1. Hero/Banner (Homepage)
- Oficina moderna, bem iluminada
- Técnico trabalhando em veículo de alta qualidade
- Dimensões: 1920x1080px mínimo
- Formato: WebP, AVIF (fallback JPG)

##### 2. Galeria Antes & Depois
- Par de fotos (mesmo ângulo)
- Boa iluminação em ambas
- Dimensões: 1200x800px
- Slider interativo

##### 3. Equipe
- Fotos individuais dos técnicos/gerentes
- Fundo consistente (oficina ou neutro)
- Dimensões: 800x800px (quadrado)

##### 4. Processo/Serviços
- Fotos de cada etapa do serviço
- Close-ups de técnicas específicas
- Dimensões: 800x600px

##### 5. Instalações
- Recepção, área de trabalho, equipamentos
- Transmitir profissionalismo e limpeza
- Dimensões variadas

### Otimização de Imagens

#### Formatos
```
Ordem de Prioridade:
1. AVIF (melhor compressão, navegadores modernos)
2. WebP (boa compressão, amplo suporte)
3. JPG (fallback universal)
```

#### Tamanhos Responsivos
```html
<!-- Exemplo de srcset responsivo -->
<picture>
  <source 
    type="image/avif" 
    srcset="image-320w.avif 320w, image-768w.avif 768w, image-1280w.avif 1280w"
  />
  <source 
    type="image/webp" 
    srcset="image-320w.webp 320w, image-768w.webp 768w, image-1280w.webp 1280w"
  />
  <img 
    src="image-1280w.jpg" 
    alt="Descrição da imagem"
    loading="lazy"
  />
</picture>
```

#### Compressão
- **JPG:** 70-85% de qualidade
- **PNG:** TinyPNG ou similar
- **WebP/AVIF:** Ferramentas de conversão automáticas

---

## 🎨 Componentes UI

### Botões (Buttons)

#### Primário (CTAs Principais)
```css
.btn-primary {
  background-color: var(--accent-primary);
  color: var(--neutral-white);
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(255, 107, 0, 0.2);
}

.btn-primary:hover {
  background-color: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(255, 107, 0, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}
```

#### Secundário (CTAs Alternativos)
```css
.btn-secondary {
  background-color: transparent;
  color: var(--accent-primary);
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  border: 2px solid var(--accent-primary);
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background-color: var(--accent-primary);
  color: var(--neutral-white);
}
```

#### Botão Fantasma (Ghost)
```css
.btn-ghost {
  background-color: transparent;
  color: var(--neutral-dark);
  font-weight: var(--font-medium);
  font-size: var(--text-base);
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  border: 1px solid var(--neutral-light);
  transition: all 0.3s ease;
}

.btn-ghost:hover {
  border-color: var(--neutral-medium);
  background-color: var(--neutral-lighter);
}
```

### Cards

```css
.card {
  background-color: var(--neutral-white);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}
```

### Inputs

```css
.input-field {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: var(--text-base);
  border: 2px solid var(--neutral-light);
  border-radius: 0.5rem;
  background-color: var(--neutral-white);
  transition: all 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.1);
}

.input-field.error {
  border-color: var(--error);
}
```

---

## 📐 Espaçamento e Grid

### Sistema de Espaçamento
```css
/* Base: 4px */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### Container Widths
```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
```

### Border Radius
```css
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 1rem;      /* 16px */
--radius-xl: 1.5rem;    /* 24px */
--radius-full: 9999px;  /* Círculo */
```

---

## ✅ Checklist de Implementação

### Design System
- [ ] Criar arquivo CSS com variáveis de cores
- [ ] Importar fontes do Google Fonts
- [ ] Configurar Tailwind CSS com tema customizado
- [ ] Criar biblioteca de componentes reutilizáveis
- [ ] Documentar cada componente (Storybook)

### Assets
- [ ] Exportar logo em todos os formatos necessários
- [ ] Criar favicon e ícones para dispositivos
- [ ] Organizar biblioteca de imagens
- [ ] Otimizar todas as imagens (WebP/AVIF)
- [ ] Criar placeholders para lazy loading

### Implementação
- [ ] Configurar i18n para EN, ES, PT
- [ ] Aplicar brand guidelines em todos os componentes
- [ ] Testar responsividade em múltiplos dispositivos
- [ ] Validar contraste de cores (WCAG AA)
- [ ] Testar com usuários reais

---

**Documento criado em:** 2025-10-28  
**Versão:** 1.0  
**Status:** DRAFT - Aguardando aprovação
