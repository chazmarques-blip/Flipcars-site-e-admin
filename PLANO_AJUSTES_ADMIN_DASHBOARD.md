# 📋 PLANO DE AJUSTES - Admin Dashboard

**Data**: 2025-11-10  
**Status**: 🟢 **LOGIN FUNCIONANDO - INICIANDO AJUSTES**

---

## ✅ **COMPLETADO**

### **Fase 1: Ambiente e Autenticação**
- ✅ Setup local development (port 3003)
- ✅ CORS fix no backend (sandbox permitido)
- ✅ Deploy Railway (backend atualizado)
- ✅ Login funcionando
- ✅ Redirecionamento para dashboard
- ✅ Hot reload ativo

---

## 🎯 **PÁGINAS DISPONÍVEIS NO ADMIN**

### **📊 Dashboard & Analytics**
- `/dashboard` - Dashboard Home (stats, gráficos)
- `/dashboard/analytics` - Analytics detalhado
- `/dashboard/activity` - Activity Log

### **👥 Lead Management**
- `/dashboard/leads` - Lista de leads
- `/dashboard/leads/[id]` - Detalhes do lead (⚠️ **PRECISA AJUSTE**)
- `/dashboard/leads/new` - Criar novo lead

### **🚗 Customer Management**
- `/dashboard/customers` - Lista de clientes
- `/dashboard/customers/[id]` - Detalhes do cliente
- `/dashboard/customers/new` - Criar novo cliente

### **📋 Claims Management**
- `/dashboard/claims` - Lista de sinistros
- `/dashboard/claims/[id]` - Detalhes do sinistro
- `/dashboard/claims/new` - Criar novo sinistro

### **⚙️ Utilities**
- `/dashboard/search` - Busca global
- `/dashboard/settings` - Configurações
- `/dashboard/files` - Gerenciamento de arquivos
- `/dashboard/emails` - Email management
- `/dashboard/ai-chat` - AI Chat widget
- `/dashboard/estimate-test` - Teste do formulário de estimativa

---

## 🔧 **AJUSTES PRIORITÁRIOS**

### **PRIORIDADE 1: CRÍTICO (Fazer Primeiro)**

#### **1.1 Lead Detail Page** ⭐⭐⭐
**Arquivo**: `frontend-admin/src/app/dashboard/leads/[id]/page.tsx`  
**Problema**: Erro ao abrir detalhes de lead  
**Ações**:
- [ ] Verificar qual API está falhando
- [ ] Corrigir chamada da API
- [ ] Adicionar loading states
- [ ] Adicionar error handling
- [ ] Testar com lead real

**Tempo Estimado**: 15-30 min

---

#### **1.2 Dashboard Home Stats** ⭐⭐⭐
**Arquivo**: `frontend-admin/src/app/dashboard/page.tsx`  
**Problema**: Pode estar com dados mockados ou não carregando  
**Ações**:
- [ ] Verificar se está usando dados reais
- [ ] Conectar com `/leads/statistics` endpoint
- [ ] Adicionar loading skeleton
- [ ] Mostrar estatísticas reais (total leads, status, etc)
- [ ] Adicionar gráficos se necessário

**Tempo Estimado**: 30-45 min

---

### **PRIORIDADE 2: IMPORTANTE (Fazer Depois)**

#### **2.1 Lead List Enhancement**
**Arquivo**: `frontend-admin/src/app/dashboard/leads/page.tsx`  
**Ações**:
- [ ] Adicionar filtros (status, priority, date range)
- [ ] Adicionar paginação
- [ ] Adicionar busca
- [ ] Adicionar sorting (ordenação)
- [ ] Adicionar bulk actions (ações em massa)

**Tempo Estimado**: 45-60 min

---

#### **2.2 Customer Management**
**Arquivos**: `frontend-admin/src/app/dashboard/customers/*`  
**Ações**:
- [ ] Lista de clientes
- [ ] Criar cliente
- [ ] Editar cliente
- [ ] Ver detalhes do cliente
- [ ] Associar leads aos clientes

**Tempo Estimado**: 60-90 min

---

#### **2.3 User Management**
**Nota**: Parece não ter página de usuários ainda  
**Ações**:
- [ ] Criar página `/dashboard/users`
- [ ] Lista de usuários
- [ ] Criar usuário (admin, manager, agent)
- [ ] Editar usuário
- [ ] Gerenciar permissões/roles

**Tempo Estimado**: 90-120 min

---

### **PRIORIDADE 3: MELHORIAS (Futuro)**

#### **3.1 Claims Management**
- [ ] Implementar CRUD completo de sinistros
- [ ] Associar claims com leads/customers
- [ ] Upload de documentos
- [ ] Timeline de atividades

**Tempo Estimado**: 120-180 min

---

#### **3.2 AI Chat Widget**
- [ ] Integrar chat AI
- [ ] Histórico de conversas
- [ ] Resposta automática
- [ ] Treinamento do modelo

**Tempo Estimado**: 180-240 min

---

#### **3.3 Email Management**
- [ ] Templates de email
- [ ] Envio de emails
- [ ] Tracking de abertura/cliques
- [ ] Automações

**Tempo Estimado**: 120-180 min

---

#### **3.4 Analytics & Reports**
- [ ] Dashboard analytics detalhado
- [ ] Gráficos de conversão
- [ ] Reports exportáveis (PDF, Excel)
- [ ] Métricas de performance

**Tempo Estimado**: 90-120 min

---

## 📊 **ESTIMATIVA TOTAL**

### **Por Prioridade**:
- **Prioridade 1** (Crítico): 45-75 min (0.75-1.25h)
- **Prioridade 2** (Importante): 195-270 min (3.25-4.5h)
- **Prioridade 3** (Melhorias): 390-600 min (6.5-10h)

### **Total Geral**: 10.5-15.75 horas

---

## 🎯 **WORKFLOW RECOMENDADO**

### **Sessão 1: Hoje** (1-2 horas)
```
1. Corrigir Lead Detail Page (30 min)
2. Ajustar Dashboard Stats (30 min)
3. Testar fluxo completo (15 min)
4. Deploy para preview (15 min)
```

### **Sessão 2: Próxima** (2-3 horas)
```
1. Lead List Enhancement (1h)
2. Customer Management básico (1-2h)
```

### **Sessão 3: Futuras**
```
1. User Management
2. Claims Management
3. Features avançadas
```

---

## 🚀 **COMEÇAR AGORA**

### **Próxima Ação Imediata**:

1. **VOCÊ**: Me avisa qual é a prioridade #1
   - Lead Detail?
   - Dashboard Stats?
   - Outro?

2. **EU**: Corrijo e testo em tempo real

3. **VOCÊ**: Valida no ambiente local

4. **REPETIR**: Até tudo funcionar

---

## 📝 **CHECKLIST DE TESTE**

Para cada ajuste, testar:

- [ ] Funcionalidade básica funciona
- [ ] Loading states aparecem
- [ ] Error handling funciona
- [ ] UI/UX está boa
- [ ] Responsivo (mobile)
- [ ] Performance OK
- [ ] Sem erros no console

---

## 💻 **AMBIENTE DE DEV**

✅ **Tudo Pronto**:
- Frontend local: Port 3003
- Backend: Railway (produção)
- Hot reload: Ativo
- Git: Feature branch
- Logs: Detalhados

**URL Local**: https://3003-i0s90jm77mc76ydqc5fpz-2e77fc33.sandbox.novita.ai

---

## 🎯 **DECISÃO NECESSÁRIA**

**ME AVISE**:

1. **Qual ajuste fazer primeiro?**
   - A) Lead Detail Page (problema conhecido)
   - B) Dashboard Stats (melhorar visualização)
   - C) Lead List (adicionar filtros)
   - D) Outro (me diga qual)

2. **Quanto tempo você tem disponível hoje?**
   - 1-2 horas?
   - 3-4 horas?
   - Dia inteiro?

---

**Status**: 🟢 Aguardando sua decisão de prioridade  
**Pronto para começar**: ✅ SIM  
**Tempo de resposta**: ⚡ Imediato com hot reload
