# FlipCars 2.0 - Plataforma Integrada de Gestão de Sinistros Automotivos com IA

## 🚀 Visão Geral do Projeto

Plataforma web completa que otimiza a captação de leads qualificados (foco em reparo via seguro), moderniza a gestão de sinistros e a comunicação com clientes através de um CRM próprio impulsionado por agentes de IA e integração com ChatGPT.

**Site Atual Analisado:** [www.flipcars.us](https://www.flipcars.us)

## 📋 Público-Alvo

- **Site Público:** Proprietários de veículos nos EUA (região de Orlando, FL) que sofreram acidentes e precisam de reparos via seguro.
- **Dashboard Administrativo:** Equipe interna da FlipCars (gerentes, atendentes, técnicos, marketing).

## 🎯 Objetivos Principais

1. **Captação de Leads Qualificados:** Sistema de formulário multi-etapas + AI Chat Widget
2. **CRM Próprio com IA:** Qualificação automática de leads, assistência em respostas, escalonamento inteligente
3. **Gestão de Sinistros:** Pipeline visual, timeline de reparo, comunicação automatizada
4. **Portal do Cliente:** Transparência total sobre o status do reparo
5. **Gestão de Conteúdo:** CMS multilíngue (EN, ES, PT)
6. **Dashboard Administrativo:** Controle total das operações

## 🛠 Stack Tecnológica

### Backend
- **Linguagem:** Node.js com TypeScript
- **Framework:** NestJS
- **ORM:** TypeORM ou Prisma
- **Banco de Dados:** PostgreSQL
- **Storage:** AWS S3
- **IA:** OpenAI API (ChatGPT)

### Frontend - Site Público
- **Framework:** React.js + Next.js (SSR/SSG)
- **Styling:** Tailwind CSS + Styled Components
- **i18n:** react-i18next (EN, ES, PT)

### Frontend - Dashboard Admin
- **Framework:** React.js com TypeScript
- **UI Library:** Material-UI ou Chakra UI
- **Styling:** Tailwind CSS
- **State:** React Query + Zustand
- **Charts:** Recharts

### Infraestrutura
- **Cloud:** AWS (EC2, RDS, S3, CloudFront, Route 53)
- **CI/CD:** GitHub Actions
- **Containers:** Docker
- **Monitoramento:** AWS CloudWatch, Sentry

### Integrações
- **Email:** SendGrid ou AWS SES
- **SMS/WhatsApp:** Twilio
- **Analytics:** Google Analytics 4
- **Maps:** Google Maps API
- **Social:** Meta Graph API

## 📁 Estrutura do Projeto

```
/home/user/webapp/
├── docs/                           # Documentação completa
│   ├── phase0/                     # Fase 0: Fundação e Design
│   ├── api/                        # Especificações da API
│   ├── database/                   # Schemas do banco de dados
│   ├── components/                 # Specs dos componentes React
│   ├── mockups/                    # Mockups e wireframes
│   ├── brand-guidelines/           # Diretrizes visuais
│   └── ai-flows/                   # Fluxogramas de IA
├── backend/                        # API NestJS
├── frontend-public/                # Site público (Next.js)
└── frontend-admin/                 # Dashboard admin (React)
```

## 🎨 Brand Identity (Análise do Site Atual)

### Informações de Contato
- **Telefone:** +1 321-960-8661
- **Endereço:** 5200 Old Winter Garden Rd, Suite 110A, Orlando, FL 32835
- **Horário:** Seg-Sex 9:00-18:00 | Sáb 10:00-16:00 | Dom Fechado

### Paleta de Cores (Extraída e Aprimorada)
- **Cores Atuais:** Preto, Branco, Cinza
- **Nova Cor de Destaque (Proposta):** #FF6B00 (Laranja vibrante) ou #4CAF50 (Verde)
- Ver documentação completa em: `docs/brand-guidelines/`

### Tipografia
- **Atual:** Sans-serif (Arial/Open Sans)
- **Recomendação:** Inter ou Roboto
- Ver especificações em: `docs/brand-guidelines/typography.md`

## 📊 Fases do Desenvolvimento

### ✅ Fase 0: Fundação e Especificação de Design (2 semanas) - **EM ANDAMENTO**
- [ ] Análise do site www.flipcars.us
- [ ] Brand Guidelines completas
- [ ] Especificação da API
- [ ] Modelo de dados do banco
- [ ] Especificação de componentes React
- [ ] Fluxogramas de interação da IA
- [ ] Mockups de alta fidelidade

### 🔄 Fase 1: Desenvolvimento Backend Core (4 semanas)
- Auth Module
- User Management
- Lead Management (CRM)
- AI Integration Module
- Storage Module
- Content Management (CMS base)

### 🔄 Fase 2: Desenvolvimento Frontend Site Público (3 semanas)
- Homepage
- Formulário Multi-etapas
- AI Chat Widget
- Service Pages
- Gallery (Antes & Depois)
- Contact Page

### 🔄 Fase 3: Desenvolvimento Frontend Dashboard Admin (4 semanas)
- Auth & Login
- Dashboard Principal
- Gestão de Leads (CRM)
- Gestão de Sinistros
- Comunicação com Cliente
- Gestão de Conteúdo (CMS)
- Relatórios
- Configurações de IA

### 🔄 Fase 4: Integração e Testes (2 semanas)
- Integração Full Stack
- Testes de Sistema Completo
- Correção de Bugs
- Documentação Final

### 🔄 Fase 5: Implantação e Monitoramento (1 semana)
- Deploy em AWS
- Configuração de DNS/SSL
- Monitoramento
- Treinamento da Equipe

### 🔄 Fase 6: Iteração e Manutenção (Contínuo)
- Feedback e melhorias
- Otimização da IA
- Novas funcionalidades

## 🤖 Funcionalidades de IA

### AI Chat Widget (Site Público)
- Qualificação automática de leads
- Suporte multilíngue (EN, ES, PT)
- Coleta de informações
- Detecção de escalonamento

### AI Assistant (Dashboard Admin)
- Sugestão de respostas
- Geração de resumos de conversas
- Redação de emails/SMS
- Análise de sentimento

### AI Analytics
- Performance da qualificação
- Taxa de conversão
- Impacto nas vendas
- Feedback loop

## 🌐 Multilíngue (i18n)

Suporte nativo para:
- 🇺🇸 English (EN) - Principal
- 🇪🇸 Español (ES)
- 🇧🇷 Português (PT)

## 📱 Mobile-First

Todo o design e desenvolvimento prioriza dispositivos móveis:
- Breakpoints: Mobile (<768px), Tablet (768-1279px), Desktop (≥1280px)
- Touch-friendly CTAs
- Sticky navigation
- Optimized images

## 🔒 Segurança

- JWT Authentication
- RBAC (Role-Based Access Control)
- Input Validation
- SQL Injection Protection
- XSS Protection
- CORS Configuration
- Rate Limiting
- Secure API Key Management (OpenAI)

## 📈 Analytics & Monitoramento

- Google Analytics 4
- Meta Pixel
- AWS CloudWatch
- Sentry (Error Tracking)
- Custom AI Performance Metrics

## 📞 Canais de Comunicação

- Telefone (Click-to-call)
- WhatsApp (Floating button)
- AI Chat Widget
- Formulário de contato
- Email
- SMS (via Twilio)

## 🚀 Como Começar

Ver documentação específica de cada módulo em `/docs/`

## 📝 Licença

Proprietary - FlipCars © 2024

---

**Status Atual:** FASE 0 - Especificação e Design  
**Última Atualização:** 2025-10-28  
**Desenvolvido por:** AI Development Team
