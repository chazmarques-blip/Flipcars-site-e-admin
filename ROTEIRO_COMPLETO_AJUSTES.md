# 🎯 ROTEIRO COMPLETO DE AJUSTES - FLIPCARS

**Data:** 2025-11-11  
**Status Atual:** Site e Admin funcionais, Backend com problemas no Railway  
**Objetivo:** Estabilizar completamente a infraestrutura e gestão de dados

---

## 📊 DIAGNÓSTICO ATUAL

### ✅ O QUE ESTÁ FUNCIONANDO

1. **Frontend Admin (Vercel)**
   - URL: https://admin.flipcars.us
   - Status: ✅ **FUNCIONANDO**
   - Deploy: Vercel automático via GitHub
   - Autenticação: JWT com React Context

2. **Frontend Público (Vercel)**
   - URL: https://www.flipcars.us
   - Status: ✅ **FUNCIONANDO**
   - Deploy: Vercel automático via GitHub

3. **Banco de Dados (Supabase)**
   - PostgreSQL funcionando
   - 21 tabelas criadas
   - Dados acessíveis

### ⚠️ O QUE ESTÁ COM PROBLEMA

1. **Backend API (Railway)**
   - URL: https://upbeat-dedication-production.up.railway.app
   - Status: ⚠️ **INSTÁVEL / CRASHANDO**
   - Problema: Erro IPv6 ENETUNREACH ao conectar no Supabase
   - Impacto: Admin não consegue gerenciar dados adequadamente

---

## 🗺️ ARQUITETURA ATUAL

```
┌─────────────────────────────────────────┐
│         USUÁRIOS                        │
└──────────┬─────────┬────────────────────┘
           │         │
           │         │
    ┌──────▼─────┐  ┌▼─────────┐
    │  Site      │  │  Admin   │
    │  Público   │  │  Panel   │
    │            │  │          │
    │ Vercel ✅  │  │ Vercel ✅│
    └──────┬─────┘  └──┬───────┘
           │           │
           └─────┬─────┘
                 │
          ┌──────▼──────┐
          │   Backend   │
          │   API       │
          │             │
          │ Railway ⚠️  │
          └──────┬──────┘
                 │
          ┌──────▼──────┐
          │  Database   │
          │             │
          │ Supabase ✅ │
          └─────────────┘
```

### Problema Identificado
- **Railway ⚠️ → Supabase ✅**: Conexão falhando por IPv6

---

## 🎯 ROTEIRO DE AJUSTES (PRIORIZADO)

---

## 🔴 PRIORIDADE 1: ESTABILIZAR BACKEND (RAILWAY)

### Problema
Backend no Railway crasha ao tentar conectar no Supabase devido a erro IPv6.

### Solução Já Implementada
✅ Código corrigido com DNS IPv4 enforcement (PR #6 merged)

### O QUE VOCÊ PRECISA FAZER AGORA

#### PASSO 1: Garantir que o Código Correto Está Deployado

1. **Verificar se PR #6 foi merged**
   - URL: https://github.com/chazmarques-blip/Flipcars-site-e-admin/pull/6
   - Status esperado: "Merged"
   - Se NÃO estiver merged: faça o merge agora!

2. **Verificar branch main atualizada**
   ```bash
   # No GitHub, vá em:
   # https://github.com/chazmarques-blip/Flipcars-site-e-admin/commits/main
   
   # Deve ter o commit: "fix(backend): Force IPv4 DNS resolution..."
   ```

#### PASSO 2: Configurar Variáveis no Railway

1. **Acessar Railway**
   - URL: https://railway.app
   - Projeto: "inspiring-imagination"
   - Serviço: "upbeat-dedication"

2. **Ir em "Variables"**

3. **Adicionar/Verificar TODAS estas variáveis:**

```bash
# === VARIÁVEIS CRÍTICAS ===

# Node Environment
NODE_ENV=production
PORT=3001
NODE_OPTIONS=--dns-result-order=ipv4first

# Database Connection (PORTA 5432 - DIRETA!)
DATABASE_URL=postgresql://postgres.kvjvieekkudeqtnunqlb:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2anZpZWVra3VkZXF0bnVucWxiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTc1MTY0OSwiZXhwIjoyMDc3MzI3NjQ5fQ.HdU6WH0JS-oNam1nkHvax6JQC3221VkFXpY1Ejz2x04@db.kvjvieekkudeqtnunqlb.supabase.co:5432/postgres?sslmode=require

# Supabase
SUPABASE_URL=https://kvjvieekkudeqtnunqlb.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2anZpZWVra3VkZXF0bnVucWxiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTc1MTY0OSwiZXhwIjoyMDc3MzI3NjQ5fQ.HdU6WH0JS-oNam1nkHvax6JQC3221VkFXpY1Ejz2x04
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2anZpZWVra3VkZXF0bnVucWxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NTE2NDksImV4cCI6MjA3NzMyNzY0OX0.e7jgc-M101J29z83hYaFz2StStn0l7tI6TnefZon_nY

# JWT Secrets
JWT_SECRET=flipcars-super-secret-jwt-key-production-2024-change-this
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=flipcars-refresh-secret-key-production-2024-change-this
JWT_REFRESH_EXPIRES_IN=7d

# Frontend CORS
FRONTEND_URL=https://admin.flipcars.us,https://www.flipcars.us,https://flipcars.us
```

4. **Salvar** (Railway fará redeploy automático)

#### PASSO 3: Aguardar e Verificar Deploy

1. **Aguardar 3-5 minutos** (Railway fazendo deploy)

2. **Ir em "Deployments"** → Clicar no deployment mais recente

3. **Clicar em "View Logs"**

4. **PROCURAR POR ESTAS LINHAS:**

```
✅ [DNS Patch] Resolved db.kvjvieekkudeqtnunqlb.supabase.co to IPv4: 54.x.x.x
✅ Database connection established
🚀 FlipCars Backend API running
```

#### PASSO 4: Testar Backend

```bash
# Abrir no navegador:
https://upbeat-dedication-production.up.railway.app/api/health

# Deve retornar:
{
  "status": "ok",
  "database": "connected",
  "supabase": "connected"
}
```

### ⏱️ Tempo Estimado: 15 minutos

### ✅ Critério de Sucesso
- Backend responde no health check
- Logs mostram "Database connection established"
- Sem crashes ou reinicializações

---

## 🟡 PRIORIDADE 2: VERIFICAR INTEGRAÇÃO FRONTEND ↔ BACKEND

### Objetivo
Garantir que Admin e Site conseguem se comunicar com o backend.

### PASSO 1: Verificar Variável de Ambiente no Vercel (Admin)

1. **Acessar Vercel**
   - URL: https://vercel.com
   - Projeto: "frontend-admin"

2. **Settings → Environment Variables**

3. **Verificar:**
```bash
NEXT_PUBLIC_API_URL=https://upbeat-dedication-production.up.railway.app/api
```

4. **Se não existir ou estiver errado:** Adicionar/corrigir e fazer redeploy

### PASSO 2: Testar Login no Admin

1. **Abrir:** https://admin.flipcars.us

2. **Fazer login:**
   - Email: `admin@flipcars.com`
   - Password: `Admin123!`

3. **Verificar se:**
   - Login funciona
   - Dashboard carrega
   - Dados aparecem

### PASSO 3: Verificar Console do Navegador

1. **Abrir DevTools** (F12)

2. **Ir em "Console"**

3. **Procurar por erros:**
   - ❌ `Failed to fetch`
   - ❌ `CORS error`
   - ❌ `Network error`

4. **Se tiver erros:** Anotar e investigar

### ⏱️ Tempo Estimado: 10 minutos

### ✅ Critério de Sucesso
- Login funciona
- Dashboard carrega dados
- Sem erros no console

---

## 🟢 PRIORIDADE 3: ORGANIZAR GESTÃO DE DADOS

### Objetivo
Estabelecer processo claro para gerenciar dados no sistema.

### Onde Estão os Dados?

```
Supabase PostgreSQL
├── Tabelas de Autenticação
│   ├── users
│   ├── roles
│   └── permissions
│
├── Tabelas de CRM
│   ├── customers
│   ├── leads
│   └── vehicles
│
├── Tabelas de Sinistros
│   ├── claims
│   ├── claim_timeline
│   └── claim_documents
│
├── Tabelas de IA
│   ├── ai_conversations
│   ├── ai_feedback
│   └── ai_knowledge_base
│
└── Tabelas de Conteúdo
    ├── cms_pages
    ├── cms_services
    ├── cms_faqs
    └── gallery_items
```

### Como Acessar e Gerenciar?

#### OPÇÃO 1: Via Admin Dashboard (Recomendado)

**URL:** https://admin.flipcars.us

**Funcionalidades:**
- ✅ Gestão de usuários
- ✅ Gestão de leads
- ✅ Gestão de clientes
- ✅ Gestão de sinistros
- ✅ Gestão de conteúdo (CMS)
- ✅ Relatórios e analytics

**Como usar:**
1. Login com credenciais admin
2. Navegar pelos menus laterais
3. Usar formulários para CRUD operations

#### OPÇÃO 2: Via Supabase Dashboard (Avançado)

**URL:** https://supabase.com/dashboard/project/kvjvieekkudeqtnunqlb

**Funcionalidades:**
- ✅ SQL Editor (queries diretas)
- ✅ Table Editor (CRUD visual)
- ✅ Database migrations
- ✅ Backups e restore

**Como usar:**
1. Login no Supabase
2. Selecionar projeto: kvjvieekkudeqtnunqlb
3. Ir em "Table Editor" ou "SQL Editor"
4. Executar queries ou editar registros

**⚠️ CUIDADO:** Edições diretas podem quebrar integridade referencial!

#### OPÇÃO 3: Via API REST (Programático)

**Base URL:** https://upbeat-dedication-production.up.railway.app/api

**Endpoints principais:**
```
POST   /auth/login                  # Autenticação
GET    /users                       # Listar usuários
POST   /users                       # Criar usuário
GET    /leads                       # Listar leads
POST   /leads                       # Criar lead
GET    /customers                   # Listar clientes
GET    /claims                      # Listar sinistros
```

**Como usar:**
1. Obter token JWT via `/auth/login`
2. Usar token no header: `Authorization: Bearer <token>`
3. Fazer requisições REST para endpoints

### ⏱️ Tempo Estimado: Conhecimento, não execução

---

## 🔵 PRIORIDADE 4: DOCUMENTAR FLUXOS DE DADOS

### Objetivo
Criar documentação clara de como os dados fluem no sistema.

### Fluxo 1: Novo Lead (Site → Backend → Database)

```
1. Usuário preenche formulário no site público
   ↓
2. Frontend envia POST /api/leads
   ↓
3. Backend valida dados
   ↓
4. Backend salva no Supabase (tabela: leads)
   ↓
5. Backend retorna confirmação
   ↓
6. Frontend mostra mensagem de sucesso
```

### Fluxo 2: Admin Visualiza Lead (Admin → Backend → Database)

```
1. Admin acessa dashboard
   ↓
2. Frontend faz GET /api/leads
   ↓
3. Backend busca no Supabase
   ↓
4. Backend retorna array de leads
   ↓
5. Frontend renderiza tabela
```

### Fluxo 3: Criar Sinistro (Admin → Backend → Database)

```
1. Admin clica "Novo Sinistro"
   ↓
2. Frontend mostra formulário
   ↓
3. Admin preenche e envia
   ↓
4. Frontend envia POST /api/claims
   ↓
5. Backend cria registro em 'claims'
   ↓
6. Backend cria timeline inicial
   ↓
7. Backend retorna sinistro criado
   ↓
8. Frontend redireciona para detalhes
```

### ⏱️ Tempo Estimado: 30 minutos de documentação

---

## 🟣 PRIORIDADE 5: ESTABELECER BACKUP E RECOVERY

### Objetivo
Garantir que dados não sejam perdidos.

### Backup Automático (Supabase)

**Configuração atual:**
- Supabase faz backup diário automático
- Retention: 7 dias (plano free)
- Backup manual disponível

**Como fazer backup manual:**
1. Supabase Dashboard
2. Database → Backups
3. Clicar em "Take backup"

### Backup Local (Recomendado)

**Script de backup:**
```bash
#!/bin/bash
# Fazer dump do database
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Compactar
gzip backup_$(date +%Y%m%d).sql

# Upload para S3 (opcional)
aws s3 cp backup_$(date +%Y%m%d).sql.gz s3://flipcars-backups/
```

**Agendar com cron:**
```bash
# Backup diário às 3:00 AM
0 3 * * * /home/user/backup-database.sh
```

### Recovery

**Se precisar restaurar:**
```bash
# Descompactar
gunzip backup_20251111.sql.gz

# Restaurar
psql $DATABASE_URL < backup_20251111.sql
```

### ⏱️ Tempo Estimado: 1 hora (setup inicial)

---

## 📋 CHECKLIST COMPLETO

### Prioridade 1: Backend Railway
- [ ] PR #6 verificado como merged
- [ ] Variáveis de ambiente configuradas no Railway
- [ ] Deploy realizado com sucesso
- [ ] Logs mostram conexão IPv4 estabelecida
- [ ] Health check retorna 200 OK
- [ ] Sem crashes por 24 horas

### Prioridade 2: Integração Frontend
- [ ] NEXT_PUBLIC_API_URL verificado no Vercel (Admin)
- [ ] NEXT_PUBLIC_API_URL verificado no Vercel (Site)
- [ ] Login funciona no Admin
- [ ] Dashboard carrega dados
- [ ] Sem erros no console do navegador

### Prioridade 3: Gestão de Dados
- [ ] Admin Dashboard acessível e funcional
- [ ] Supabase Dashboard acessível
- [ ] Entendimento de onde cada tipo de dado está
- [ ] Processo de CRUD estabelecido
- [ ] Documentação de como acessar dados

### Prioridade 4: Documentação
- [ ] Fluxos de dados documentados
- [ ] Endpoints da API listados
- [ ] Exemplos de uso criados
- [ ] Troubleshooting guide atualizado

### Prioridade 5: Backup
- [ ] Backup manual testado
- [ ] Script de backup criado
- [ ] Backup agendado (cron)
- [ ] Processo de recovery documentado
- [ ] Testes de recovery realizados

---

## 🚀 PLANO DE EXECUÇÃO SEQUENCIAL

### DIA 1 (Hoje - 2-3 horas)

**Manhã:**
1. ✅ Merge PR #6 (se ainda não foi)
2. ✅ Configurar variáveis Railway
3. ✅ Aguardar deploy e verificar logs
4. ✅ Testar health check

**Tarde:**
1. ✅ Verificar integração frontend
2. ✅ Testar login e dashboard
3. ✅ Documentar status atual

**Critério de sucesso DIA 1:**
- Backend estável por 4+ horas
- Admin funcionando perfeitamente
- Documentação atualizada

### DIA 2 (Amanhã - 2 horas)

**Manhã:**
1. ✅ Verificar estabilidade do backend (24h)
2. ✅ Documentar fluxos de dados
3. ✅ Criar guia de gestão de dados

**Tarde:**
1. ✅ Setup backup manual
2. ✅ Testar processo de backup
3. ✅ Documentar recovery

**Critério de sucesso DIA 2:**
- Backend estável por 24+ horas
- Documentação completa
- Backup funcionando

### DIA 3 (Depois de amanhã - 1 hora)

**Verificação Final:**
1. ✅ Backend estável por 48+ horas
2. ✅ Todas as checklist items completas
3. ✅ Sistema em produção estável

---

## 📞 LINKS IMPORTANTES

### Produção
- **Site:** https://www.flipcars.us
- **Admin:** https://admin.flipcars.us
- **Backend:** https://upbeat-dedication-production.up.railway.app
- **Health Check:** https://upbeat-dedication-production.up.railway.app/api/health

### Dashboards
- **Railway:** https://railway.app
- **Vercel Admin:** https://vercel.com/charles-marques-projects/frontend-admin
- **Vercel Site:** https://vercel.com/charles-marques-projects/frontend-public
- **Supabase:** https://supabase.com/dashboard/project/kvjvieekkudeqtnunqlb

### Código
- **GitHub Repo:** https://github.com/chazmarques-blip/Flipcars-site-e-admin
- **PR #6:** https://github.com/chazmarques-blip/Flipcars-site-e-admin/pull/6

---

## 🆘 SE ALGO DER ERRADO

### Backend Continua Crashando

**Opção 1:** Reverter para deployment anterior
- Railway → Deployments → Encontrar deployment verde anterior → Rollback

**Opção 2:** Reverter PR #6
- GitHub → PR #6 → Revert

**Opção 3:** Usar IP direto ao invés de hostname
```bash
# Descobrir IP
nslookup db.kvjvieekkudeqtnunqlb.supabase.co

# Usar IP na DATABASE_URL
DATABASE_URL=postgresql://...@54.XXX.XXX.XXX:5432/postgres?sslmode=require
```

### Frontend Não Conecta no Backend

**Verificar:**
1. CORS está configurado? (FRONTEND_URL no backend)
2. NEXT_PUBLIC_API_URL está correto?
3. Backend está online?
4. Firewall/network issues?

### Dados Não Aparecem

**Verificar:**
1. Token JWT é válido?
2. Usuário tem permissões?
3. Dados existem no banco?
4. Query SQL está correta?

---

## 💡 DICAS IMPORTANTES

1. **Sempre teste em staging primeiro** (se tiver)
2. **Faça backup antes de mudanças grandes**
3. **Monitore logs após deploys**
4. **Documente todas as mudanças**
5. **Use Git para versionamento**

---

## ✅ PRÓXIMA AÇÃO IMEDIATA

**AGORA (nos próximos 30 minutos):**

1. Abrir Railway: https://railway.app
2. Verificar se deployment atual está verde ou vermelho
3. Se vermelho: Ir em Variables e configurar conforme Prioridade 1
4. Se verde mas unstável: Verificar logs
5. Testar health check
6. **Me avisar o resultado!**

---

**Última atualização:** 2025-11-11 00:30  
**Status:** ✅ **ROTEIRO COMPLETO CRIADO**  
**Próximo Passo:** Executar Prioridade 1 (Backend Railway)

**BOA SORTE! 🚀**
