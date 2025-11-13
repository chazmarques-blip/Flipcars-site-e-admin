# 🌍 Plano de Implementação: Site Multi-idioma (i18n)

## 🎯 Objetivo

Implementar suporte para **3 idiomas** no site FlipCars:
- 🇺🇸 **Inglês** (EN) - Idioma padrão atual
- 🇪🇸 **Espanhol** (ES) - Novo
- 🇧🇷 **Português** (PT) - Novo

**Requisito Crítico**: ⚠️ **ZERO IMPACTO** na produção atual

---

## 🏗️ Arquitetura Proposta

### Opção Recomendada: Next.js i18n Routing

Next.js já tem suporte nativo para internacionalização. Vamos usar:

```
Estrutura de URLs:
├── flipcars.us/           (inglês - padrão)
├── flipcars.us/es/        (espanhol)
└── flipcars.us/pt/        (português)

Ou com subdomínios (alternativa):
├── www.flipcars.us        (inglês - padrão)
├── es.flipcars.us         (espanhol)
└── pt.flipcars.us         (português)
```

---

## 📦 Fase 1: Setup e Estrutura (Sem Afetar Produção)

### 1.1 Instalar Dependências

```bash
cd frontend-public

# Instalar next-i18next (biblioteca recomendada)
npm install next-i18next react-i18next i18next

# Ou usar next-intl (alternativa mais moderna)
npm install next-intl
```

### 1.2 Criar Estrutura de Arquivos

```
frontend-public/
├── public/
│   └── locales/
│       ├── en/
│       │   ├── common.json
│       │   ├── estimate.json
│       │   └── home.json
│       ├── es/
│       │   ├── common.json
│       │   ├── estimate.json
│       │   └── home.json
│       └── pt/
│           ├── common.json
│           ├── estimate.json
│           └── home.json
├── src/
│   ├── i18n/
│   │   ├── config.ts
│   │   ├── locales.ts
│   │   └── translations/
│   └── middleware.ts (para detectar idioma)
```

### 1.3 Configurar next.config.js

**IMPORTANTE**: Fazer em **branch separada**, não em main!

```javascript
// frontend-public/next.config.js

const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Mantém static export
  
  // ⚠️ NOVO: Configuração de i18n
  i18n: {
    locales: ['en', 'es', 'pt'], // Idiomas suportados
    defaultLocale: 'en',          // Inglês como padrão
    localeDetection: true,        // Detecta idioma do navegador
  },
  
  // Resto da configuração existente...
  trailingSlash: true,
  images: {
    unoptimized: true,
    // ...
  },
}

module.exports = nextConfig
```

---

## 📝 Fase 2: Criar Arquivos de Tradução

### 2.1 Estrutura dos Arquivos JSON

**Inglês** (`public/locales/en/common.json`):
```json
{
  "nav": {
    "home": "Home",
    "services": "Services",
    "about": "About Us",
    "contact": "Contact"
  },
  "cta": {
    "freeEstimate": "Free Estimate",
    "getStarted": "Get Started",
    "learnMore": "Learn More"
  },
  "hero": {
    "title": "Expert Auto Repair in Orlando",
    "subtitle": "Quality service you can trust",
    "description": "Professional bodyshop and mechanical services"
  }
}
```

**Espanhol** (`public/locales/es/common.json`):
```json
{
  "nav": {
    "home": "Inicio",
    "services": "Servicios",
    "about": "Nosotros",
    "contact": "Contacto"
  },
  "cta": {
    "freeEstimate": "Presupuesto Gratis",
    "getStarted": "Comenzar",
    "learnMore": "Saber Más"
  },
  "hero": {
    "title": "Reparación de Autos Experta en Orlando",
    "subtitle": "Servicio de calidad en el que puede confiar",
    "description": "Servicios profesionales de carrocería y mecánica"
  }
}
```

**Português** (`public/locales/pt/common.json`):
```json
{
  "nav": {
    "home": "Início",
    "services": "Serviços",
    "about": "Sobre Nós",
    "contact": "Contato"
  },
  "cta": {
    "freeEstimate": "Orçamento Grátis",
    "getStarted": "Começar",
    "learnMore": "Saiba Mais"
  },
  "hero": {
    "title": "Reparação de Carros Especializada em Orlando",
    "subtitle": "Serviço de qualidade em que você pode confiar",
    "description": "Serviços profissionais de funilaria e mecânica"
  }
}
```

### 2.2 Formulário de Estimativa (Mais Importante!)

**Inglês** (`public/locales/en/estimate.json`):
```json
{
  "modal": {
    "title": "Free Estimate",
    "steps": {
      "basicInfo": "Basic Information",
      "serviceDetails": "Service Details",
      "photos": "Photos",
      "contact": "Contact"
    }
  },
  "step1": {
    "firstName": "First Name",
    "lastName": "Last Name",
    "phone": "Phone Number",
    "email": "Email Address",
    "serviceType": "What service do you need?",
    "bodyshop": "Bodyshop (Collision Repair)",
    "mechanic": "Mechanic (Engine/Maintenance)"
  },
  "step2": {
    "whoWillPay": "Who will pay for the repair?",
    "privateSelfPay": "Private (Self-Pay)",
    "insuranceCompany": "Insurance Company",
    "warrantyCompany": "Warranty Company",
    "other": "Other",
    "claimNumber": "Claim Number",
    "selectDate": "Select a date"
  },
  "step4": {
    "contactPreference": "How would you like us to contact you?",
    "phoneCall": "Phone Call",
    "whatsapp": "WhatsApp Message",
    "textMessage": "Text Message",
    "additionalNotes": "Additional Notes",
    "submit": "Submit Request"
  },
  "buttons": {
    "back": "Back",
    "next": "Next",
    "skip": "Skip",
    "continue": "Continue"
  }
}
```

**Espanhol** (`public/locales/es/estimate.json`):
```json
{
  "modal": {
    "title": "Presupuesto Gratis",
    "steps": {
      "basicInfo": "Información Básica",
      "serviceDetails": "Detalles del Servicio",
      "photos": "Fotos",
      "contact": "Contacto"
    }
  },
  "step1": {
    "firstName": "Nombre",
    "lastName": "Apellido",
    "phone": "Número de Teléfono",
    "email": "Correo Electrónico",
    "serviceType": "¿Qué servicio necesita?",
    "bodyshop": "Carrocería (Reparación de Colisión)",
    "mechanic": "Mecánico (Motor/Mantenimiento)"
  },
  "step2": {
    "whoWillPay": "¿Quién pagará la reparación?",
    "privateSelfPay": "Privado (Pago Propio)",
    "insuranceCompany": "Compañía de Seguros",
    "warrantyCompany": "Compañía de Garantía",
    "other": "Otro",
    "claimNumber": "Número de Reclamo",
    "selectDate": "Seleccione una fecha"
  },
  "step4": {
    "contactPreference": "¿Cómo le gustaría que lo contactemos?",
    "phoneCall": "Llamada Telefónica",
    "whatsapp": "Mensaje de WhatsApp",
    "textMessage": "Mensaje de Texto",
    "additionalNotes": "Notas Adicionales",
    "submit": "Enviar Solicitud"
  },
  "buttons": {
    "back": "Atrás",
    "next": "Siguiente",
    "skip": "Omitir",
    "continue": "Continuar"
  }
}
```

**Português** (`public/locales/pt/estimate.json`):
```json
{
  "modal": {
    "title": "Orçamento Grátis",
    "steps": {
      "basicInfo": "Informações Básicas",
      "serviceDetails": "Detalhes do Serviço",
      "photos": "Fotos",
      "contact": "Contato"
    }
  },
  "step1": {
    "firstName": "Nome",
    "lastName": "Sobrenome",
    "phone": "Número de Telefone",
    "email": "Endereço de Email",
    "serviceType": "Qual serviço você precisa?",
    "bodyshop": "Funilaria (Reparação de Colisão)",
    "mechanic": "Mecânico (Motor/Manutenção)"
  },
  "step2": {
    "whoWillPay": "Quem vai pagar pelo conserto?",
    "privateSelfPay": "Particular (Auto-pagamento)",
    "insuranceCompany": "Seguradora",
    "warrantyCompany": "Empresa de Garantia",
    "other": "Outro",
    "claimNumber": "Número do Sinistro",
    "selectDate": "Selecione uma data"
  },
  "step4": {
    "contactPreference": "Como você gostaria que entrássemos em contato?",
    "phoneCall": "Ligação Telefônica",
    "whatsapp": "Mensagem pelo WhatsApp",
    "textMessage": "Mensagem de Texto",
    "additionalNotes": "Observações Adicionais",
    "submit": "Enviar Solicitação"
  },
  "buttons": {
    "back": "Voltar",
    "next": "Próximo",
    "skip": "Pular",
    "continue": "Continuar"
  }
}
```

---

## 🔧 Fase 3: Implementar nos Componentes

### 3.1 Criar Hook useTranslation

```typescript
// src/hooks/useTranslation.ts

import { useRouter } from 'next/router';
import en from '@/locales/en/common.json';
import es from '@/locales/es/common.json';
import pt from '@/locales/pt/common.json';

const translations = { en, es, pt };

export function useTranslation(namespace = 'common') {
  const { locale = 'en' } = useRouter();
  
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[locale as keyof typeof translations];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };
  
  return { t, locale };
}
```

### 3.2 Atualizar Componentes

**ANTES** (hardcoded):
```tsx
<h1>Expert Auto Repair in Orlando</h1>
<button>Free Estimate</button>
```

**DEPOIS** (traduzível):
```tsx
import { useTranslation } from '@/hooks/useTranslation';

export function Hero() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <button>{t('cta.freeEstimate')}</button>
    </div>
  );
}
```

### 3.3 Atualizar Formulário de Estimativa

**Exemplo**: Step1BasicInfo.tsx

```tsx
import { useTranslation } from '@/hooks/useTranslation';

export function Step1BasicInfo({ onNext }: Step1Props) {
  const { t } = useTranslation('estimate'); // Usa estimate.json
  
  return (
    <form>
      <h3>{t('step1.serviceType')}</h3>
      
      <input 
        placeholder={t('step1.firstName')} 
        {...register('firstName')} 
      />
      
      <input 
        placeholder={t('step1.lastName')} 
        {...register('lastName')} 
      />
      
      <button type="button" onClick={onNext}>
        {t('buttons.next')}
      </button>
    </form>
  );
}
```

---

## 🎨 Fase 4: Seletor de Idioma (Language Switcher)

### 4.1 Componente LanguageSwitcher

```tsx
// src/components/LanguageSwitcher.tsx

import { useRouter } from 'next/router';
import { useState } from 'react';

const languages = {
  en: { name: 'English', flag: '🇺🇸' },
  es: { name: 'Español', flag: '🇪🇸' },
  pt: { name: 'Português', flag: '🇧🇷' },
};

export function LanguageSwitcher() {
  const router = useRouter();
  const { locale, pathname, query } = router;
  const [isOpen, setIsOpen] = useState(false);
  
  const changeLanguage = (newLocale: string) => {
    router.push({ pathname, query }, undefined, { locale: newLocale });
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
      >
        <span className="text-xl">{languages[locale as keyof typeof languages].flag}</span>
        <span className="text-sm font-medium">
          {languages[locale as keyof typeof languages].name}
        </span>
      </button>
      
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[150px]">
          {Object.entries(languages).map(([code, lang]) => (
            <button
              key={code}
              onClick={() => changeLanguage(code)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 ${
                locale === code ? 'bg-gold/10 font-semibold' : ''
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="text-sm">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 4.2 Adicionar ao Header

```tsx
// src/components/Header.tsx

import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  return (
    <header>
      <nav>
        {/* Logo e menu existente */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <button>Free Estimate</button>
        </div>
      </nav>
    </header>
  );
}
```

---

## 🗄️ Fase 5: Backend - Salvar Idioma Preferido

### 5.1 Atualizar Lead Entity

```typescript
// backend/src/database/entities/lead.entity.ts

@Entity('leads')
export class Lead {
  // ... campos existentes
  
  @Column({ type: 'varchar', length: 10, default: 'en', name: 'preferred_language' })
  preferredLanguage: string; // 'en', 'es', 'pt'
}
```

### 5.2 Migration para Adicionar Campo

```typescript
// backend/src/database/migrations/[timestamp]-AddPreferredLanguageToLeads.ts

export class AddPreferredLanguageToLeads[timestamp] implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "leads" 
      ADD COLUMN IF NOT EXISTS "preferred_language" varchar(10) DEFAULT 'en'
    `);
  }
  
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "leads" 
      DROP COLUMN "preferred_language"
    `);
  }
}
```

### 5.3 Atualizar DTO

```typescript
// backend/src/modules/leads/dto/create-public-lead.dto.ts

export class CreatePublicLeadDto {
  // ... campos existentes
  
  @IsOptional()
  @IsString()
  @IsIn(['en', 'es', 'pt'])
  preferredLanguage?: string;
}
```

### 5.4 Capturar Idioma no Frontend

```typescript
// frontend-public - ao submeter formulário

const onSubmit = async (data: EstimateRequest) => {
  const { locale } = useRouter();
  
  const payload = {
    ...data,
    preferredLanguage: locale, // Adiciona idioma atual
  };
  
  await leadService.createLead(payload);
};
```

---

## 🚀 Fase 6: Deploy Seguro (Zero Downtime)

### 6.1 Estratégia de Deploy

```
1. Branch Feature
   └─ Criar branch: feature/i18n-multilanguage
   
2. Desenvolvimento
   └─ Implementar tudo nesta branch
   
3. Testes Locais
   └─ Testar todos os 3 idiomas
   
4. Deploy Preview (Vercel)
   └─ Vercel cria URL de preview automaticamente
   └─ Testar preview: [branch-name].vercel.app
   
5. Pull Request
   └─ Criar PR para main
   └─ Revisar mudanças
   
6. Feature Flag (Opcional)
   └─ Adicionar flag para ativar/desativar i18n
   
7. Merge para Main
   └─ Deploy automático no Vercel
   └─ Site em produção atualizado
   
8. Monitorar
   └─ Ver se algo quebrou
   └─ Rollback rápido se necessário
```

### 6.2 Feature Flag (Segurança Extra)

```typescript
// src/config/features.ts

export const FEATURES = {
  I18N_ENABLED: process.env.NEXT_PUBLIC_I18N_ENABLED === 'true',
};

// Usar nos componentes
import { FEATURES } from '@/config/features';

export function Header() {
  return (
    <header>
      {FEATURES.I18N_ENABLED && <LanguageSwitcher />}
      {/* resto do header */}
    </header>
  );
}
```

**Vantagem**: Pode ativar/desativar sem redeploy, só mudando variável de ambiente no Vercel.

---

## 📊 Fase 7: SEO Multi-idioma

### 7.1 Meta Tags por Idioma

```tsx
// src/pages/index.tsx

import Head from 'next/head';
import { useTranslation } from '@/hooks/useTranslation';

export default function Home() {
  const { t, locale } = useTranslation();
  
  return (
    <>
      <Head>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
        <link rel="alternate" hrefLang="en" href="https://flipcars.us/" />
        <link rel="alternate" hrefLang="es" href="https://flipcars.us/es/" />
        <link rel="alternate" hrefLang="pt" href="https://flipcars.us/pt/" />
      </Head>
      {/* conteúdo */}
    </>
  );
}
```

### 7.2 Sitemap Multi-idioma

```xml
<!-- public/sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  
  <!-- English -->
  <url>
    <loc>https://flipcars.us/</loc>
    <xhtml:link rel="alternate" hrefLang="es" href="https://flipcars.us/es/"/>
    <xhtml:link rel="alternate" hrefLang="pt" href="https://flipcars.us/pt/"/>
  </url>
  
  <!-- Spanish -->
  <url>
    <loc>https://flipcars.us/es/</loc>
    <xhtml:link rel="alternate" hrefLang="en" href="https://flipcars.us/"/>
    <xhtml:link rel="alternate" hrefLang="pt" href="https://flipcars.us/pt/"/>
  </url>
  
  <!-- Portuguese -->
  <url>
    <loc>https://flipcars.us/pt/</loc>
    <xhtml:link rel="alternate" hrefLang="en" href="https://flipcars.us/"/>
    <xhtml:link rel="alternate" hrefLang="es" href="https://flipcars.us/es/"/>
  </url>
</urlset>
```

---

## ✅ Checklist de Implementação

### Fase 1: Setup (Dia 1-2)
- [ ] Criar branch `feature/i18n-multilanguage`
- [ ] Instalar dependências (next-i18next)
- [ ] Configurar next.config.js
- [ ] Criar estrutura de pastas

### Fase 2: Traduções (Dia 3-5)
- [ ] Criar arquivos JSON para EN
- [ ] Criar arquivos JSON para ES
- [ ] Criar arquivos JSON para PT
- [ ] Traduzir formulário de estimativa
- [ ] Traduzir página principal
- [ ] Traduzir textos de UI (botões, labels)

### Fase 3: Código (Dia 6-8)
- [ ] Criar hook useTranslation
- [ ] Atualizar componentes principais
- [ ] Atualizar formulário de estimativa (todos os steps)
- [ ] Criar LanguageSwitcher
- [ ] Adicionar LanguageSwitcher ao Header

### Fase 4: Backend (Dia 9)
- [ ] Adicionar campo preferred_language no Lead entity
- [ ] Criar migration
- [ ] Atualizar DTOs
- [ ] Capturar idioma no frontend

### Fase 5: Testes (Dia 10-11)
- [ ] Testar todos os idiomas localmente
- [ ] Testar formulário completo em EN
- [ ] Testar formulário completo em ES
- [ ] Testar formulário completo em PT
- [ ] Testar troca de idiomas
- [ ] Testar persistência do idioma

### Fase 6: Deploy (Dia 12)
- [ ] Criar Pull Request
- [ ] Revisar código
- [ ] Testar preview deployment (Vercel)
- [ ] Merge para main
- [ ] Monitorar produção
- [ ] Verificar analytics

### Fase 7: Pós-Deploy (Dia 13-14)
- [ ] Verificar SEO multi-idioma
- [ ] Atualizar Google Search Console
- [ ] Monitorar conversões por idioma
- [ ] Ajustes de tradução se necessário

---

## 💰 Estimativa de Tempo e Custo

### Tempo de Desenvolvimento
- **Desenvolvimento**: 10-14 dias (1 desenvolvedor)
- **Traduções**: 2-3 dias (se usar tradução profissional)
- **Testes**: 2 dias
- **Total**: ~2-3 semanas

### Custo Estimado
- **Desenvolvimento**: Sem custo adicional (você já tem o time)
- **Traduções Profissionais**: $0.10-0.15 por palavra
  - Estimativa: ~5.000 palavras = $500-750 USD
- **Alternativa**: Google Translate + revisão manual = $0-200 USD

---

## 🎯 Opção Rápida: MVP em 3 Dias

Se você quer algo **RÁPIDO** para testar:

### Dia 1: Setup Básico
- Instalar next-i18next
- Configurar 3 idiomas
- Criar arquivos JSON (usando Google Translate)

### Dia 2: Implementar em Componentes Principais
- Atualizar Hero section
- Atualizar Header/Footer
- Atualizar formulário de estimativa (só textos principais)

### Dia 3: Deploy e Teste
- Criar PR
- Deploy preview
- Testar e ajustar
- Merge para produção

**Resultado**: Site funcional em 3 idiomas, traduções podem ser refinadas depois.

---

## 🚫 O Que NÃO Fazer (Evitar Problemas)

### ❌ Não fazer direto na main
- Sempre usar branch separada

### ❌ Não quebrar URLs existentes
- Manter `/` como inglês (backward compatibility)
- Adicionar `/es/` e `/pt/` como novos

### ❌ Não traduzir tudo de uma vez
- Começar com páginas principais
- Expandir gradualmente

### ❌ Não usar tradução automática pura
- Google Translate como base
- Sempre revisar com falante nativo

### ❌ Não esquecer do backend
- Salvar idioma preferido do lead
- Enviar emails no idioma correto

---

## 📞 Decisão Necessária

**Eu preciso saber**:

1. **Quando quer começar?**
   - [ ] Agora (vou criar a estrutura)
   - [ ] Depois de resolver as logos/migration
   - [ ] Semana que vem

2. **Qual abordagem prefere?**
   - [ ] Completa (2-3 semanas, mais robusto)
   - [ ] MVP rápido (3 dias, básico)

3. **Traduções profissionais ou automáticas?**
   - [ ] Google Translate + revisão
   - [ ] Tradução profissional ($500-750)
   - [ ] Eu já tenho as traduções

4. **Estrutura de URL preferida?**
   - [ ] flipcars.us/es/ e flipcars.us/pt/ (RECOMENDADO)
   - [ ] es.flipcars.us e pt.flipcars.us (subdomínios)

**Me diga suas preferências e eu começo a implementar!** 🚀

---

**Resumo**: Implementação é totalmente segura, sem risco para produção. Vamos fazer em branch separada, testar tudo, e só depois fazer merge. O site atual continua funcionando 100% durante todo o processo.
