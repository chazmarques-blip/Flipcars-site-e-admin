# FlipCars 2.0 - Plataforma Integrada de Gestão de Sinistros Automotivos com IA

## 🚀 Visão Geral do Projeto

Plataforma web completa que otimiza a captação de leads qualificados (foco em reparo via seguro), moderniza a gestão de sinistros e a comunicação com clientes através de um CRM próprio impulsionado por agentes de IA e integração com ChatGPT.

## 🌐 Links de Produção

- **Site Público:** [www.flipcars.us](https://www.flipcars.us)
- **Dashboard Admin:** [admin.flipcars.us](https://admin.flipcars.us) ✅ **FUNCIONANDO**
- **Backend API:** [Railway Backend](https://upbeat-dedication-production.up.railway.app/api) ✅ **FUNCIONANDO**
- **API Docs (Swagger):** [API Documentation](https://upbeat-dedication-production.up.railway.app/api/docs)

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

### Backend ✅ EM PRODUÇÃO
- **Linguagem:** Node.js com TypeScript
- **Framework:** NestJS
- **ORM:** TypeORM
- **Banco de Dados:** PostgreSQL (Railway)
- **Storage:** AWS S3 (planejado)
- **IA:** OpenAI API (ChatGPT) (planejado)
- **Deploy:** Railway
- **URL:** https://upbeat-dedication-production.up.railway.app

### Frontend - Site Público
- **Framework:** React.js + Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **i18n:** react-i18next (EN, ES, PT)
- **Deploy:** Vercel
- **URL:** https://www.flipcars.us

### Frontend - Dashboard Admin ✅ EM PRODUÇÃO
- **Framework:** Next.js 14+ (App Router) com TypeScript
- **UI Library:** Custom components + Tailwind CSS
- **Styling:** Tailwind CSS
- **State:** React Context API (substituiu Zustand)
- **Charts:** Recharts
- **Autenticação:** JWT (15min access + 7 days refresh)
- **Deploy:** Vercel
- **URL:** https://admin.flipcars.us

### Infraestrutura
- **Backend:** Railway (PostgreSQL + NestJS API)
- **Frontend:** Vercel (Next.js SSR/SSG)
- **CI/CD:** GitHub → Vercel (automático)
- **Versionamento:** Git + GitHub
- **Monitoramento:** Vercel Analytics + Railway Logs

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

### Desenvolvimento Local

```bash
# Clone o repositório
git clone https://github.com/chazmarques-blip/Flipcars-site-e-admin.git
cd Flipcars-site-e-admin

# Frontend Admin
cd frontend-admin
npm install
npm run dev  # http://localhost:3000

# Frontend Público (em desenvolvimento)
cd frontend-public
npm install
npm run dev  # http://localhost:3001
```

### Credenciais de Teste

**Admin Dashboard:**
- Email: `admin@flipcars.com`
- Password: `Admin123!`

### Workflow de Desenvolvimento

**Use o script helper interativo:**
```bash
./scripts/dev-workflow.sh
```

**Ou siga o workflow manual:**
```bash
# 1. Criar feature branch
git checkout -b feature/minha-feature

# 2. Desenvolver...

# 3. Commit
git commit -m "feat: descrição"

# 4. Push
git push origin feature/minha-feature

# 5. Criar Pull Request no GitHub

# 6. Merge após aprovação
```

## 📚 Documentação

### Documentos Importantes

- **[CONFIGURACAO_PRODUCAO_FUNCIONANDO.md](./CONFIGURACAO_PRODUCAO_FUNCIONANDO.md)** - ⚠️ **LEITURA OBRIGATÓRIA!** Configuração atual em produção (NÃO ALTERAR!)
- **[WORKFLOW_DEV_PRODUCAO.md](./WORKFLOW_DEV_PRODUCAO.md)** - Como trabalhar sem afetar produção
- **[GUIA_TESTE_DADOS_PRODUCAO.md](./GUIA_TESTE_DADOS_PRODUCAO.md)** - Como testar dados reais
- **[VERCEL_DEPLOY_GUIDE.md](./VERCEL_DEPLOY_GUIDE.md)** - Guia de deploy via API Vercel
- **[scripts/README.md](./scripts/README.md)** - Documentação dos scripts helper

### Estrutura do Projeto

```
.
├── frontend-admin/          ✅ Dashboard Admin (PRODUÇÃO)
│   ├── src/
│   │   ├── app/            # Next.js 14 App Router
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── contexts/       # React Context (Auth, etc)
│   │   ├── lib/           # Utilities, API client
│   │   └── types/         # TypeScript types
│   └── public/            # Assets estáticos
│
├── frontend-public/         🚧 Site Público (EM DESENVOLVIMENTO)
│   └── ...
│
├── backend/                ✅ API NestJS (PRODUÇÃO - Railway)
│   └── (gerenciado separadamente)
│
├── scripts/                # Scripts helper
│   ├── dev-workflow.sh    # Workflow interativo
│   └── README.md
│
└── docs/                   # Documentação completa
```

## 🔧 Configurações Importantes

### Variáveis de Ambiente (Vercel)

**⚠️ CRÍTICO:** Vercel NÃO usa arquivos `.env` do repositório!

Configure manualmente no Vercel Dashboard ou via API:
```bash
NEXT_PUBLIC_API_URL=https://upbeat-dedication-production.up.railway.app/api
```

Ver [CONFIGURACAO_PRODUCAO_FUNCIONANDO.md](./CONFIGURACAO_PRODUCAO_FUNCIONANDO.md) para detalhes.

### Autenticação

O sistema usa **React Context API** para autenticação (NÃO Zustand!).

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  // ...
}
```

### Estrutura do User

Backend retorna `roles` como array:
```json
{
  "user": {
    "id": "uuid",
    "name": "Admin FlipCars",
    "email": "admin@flipcars.com",
    "roles": ["superadmin"],
    "language": "en"
  }
}
```

**Sempre acesse role com optional chaining:**
```typescript
{user.roles?.[0]?.replace('_', ' ') || 'User'}
```

## 🚨 Problemas Comuns & Soluções

Ver [CONFIGURACAO_PRODUCAO_FUNCIONANDO.md](./CONFIGURACAO_PRODUCAO_FUNCIONANDO.md#-problemas-conhecidos-e-soluções)

## 🔐 Segurança

### Branch Protection

Branch `main` está protegida:
- ✅ Requer Pull Request
- ✅ Requer aprovação
- ✅ Requer build bem-sucedido (Vercel)
- ❌ Não permite push direto

### Credentials

- **Vercel Token:** `.vercel-credentials` (gitignored)
- **Railway:** Variáveis de ambiente no dashboard
- **API Keys:** Nunca commitar no código

## 📊 Monitoramento

### Logs de Produção

**Backend (Railway):**
- Dashboard: https://railway.app
- Logs em tempo real no dashboard

**Frontend (Vercel):**
- Dashboard: https://vercel.com/charles-marques-projects/frontend-admin
- Runtime logs disponíveis
- Analytics integrado

### Performance

**Métricas Atuais:**
- ✅ Dashboard carrega em < 3s
- ✅ API response time < 500ms
- ✅ Auth token refresh automático
- ✅ Cache agressivo em CDN

## 🤝 Contribuindo

1. Leia [WORKFLOW_DEV_PRODUCAO.md](./WORKFLOW_DEV_PRODUCAO.md)
2. Use o script helper: `./scripts/dev-workflow.sh`
3. Siga convenção de commits: `feat:`, `fix:`, `refactor:`, etc.
4. Crie Pull Request com descrição detalhada
5. Aguarde review e aprovação
6. Merge automático triggera deploy

## 📝 Licença

Proprietary - FlipCars © 2024-2025

---

## 📞 Suporte

- **GitHub Issues:** https://github.com/chazmarques-blip/Flipcars-site-e-admin/issues
- **Documentação:** Ver arquivos `.md` na raiz do projeto

---

**Status Atual:** ✅ **DASHBOARD ADMIN EM PRODUÇÃO**  
**Última Atualização:** 2025-11-09  
**Desenvolvido por:** AI Development Team com GenSpark

## ✅ Checklist de Deploy

- [x] Backend NestJS em produção (Railway)
- [x] PostgreSQL com 21 tabelas criadas
- [x] Dashboard Admin em produção (Vercel)
- [x] Autenticação JWT funcionando
- [x] Integração Frontend ↔ Backend
- [x] Variáveis de ambiente configuradas
- [x] Deploy automático via GitHub
- [x] Documentação completa
- [x] Scripts helper criados
- [ ] Site público em produção
- [ ] Integração com OpenAI
- [ ] Portal do cliente
- [ ] Sistema de notificações
- [ ] Upload de arquivos (S3)
- [ ] Testes automatizados
- [ ] CI/CD completo
