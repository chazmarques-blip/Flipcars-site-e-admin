# 🚂 Railway Setup - Passo a Passo Completo
**Data:** 07 de Novembro de 2025
**Projeto:** FlipCars Backend Deployment

---

## ✅ STATUS ATUAL

Você está em: **Railway Dashboard → Projeto: inspiring-imagination → Serviço: upbeat-dedication**

**O que já foi feito:**
- ✅ Conta Railway criada
- ✅ Projeto criado (inspiring-imagination)
- ✅ Serviço criado (upbeat-dedication)
- ✅ Conectado ao GitHub (chazmarques-blip/Flipcars-site-e-admin)
- ✅ Branch selecionada (genspark_ai_developer)
- ✅ railway.toml e railway.json configurados

---

## 🎯 PASSO 1: CONFIGURAR ROOT DIRECTORY

### **No Railway Dashboard:**

1. **Abra o serviço "upbeat-dedication"**
   - Clique no card do serviço no projeto
   
2. **Vá para a aba "Settings"**
   - No menu lateral, clique em "Settings"
   
3. **Procure por "Root Directory" ou "Service Root"**
   - Role a página até encontrar a seção de configuração do serviço
   - Pode estar em "Build" ou "Configuration" section
   
4. **Configure o Root Directory:**
   ```
   backend
   ```
   - Digite exatamente: `backend` (sem barra, sem aspas)
   - Clique em "Update" ou "Save"

5. **Aguarde o deploy automático**
   - Railway vai detectar a mudança e iniciar um novo deploy
   - O build **VAI FALHAR** por enquanto (falta o PostgreSQL)
   - Isso é esperado! Continue para o próximo passo.

### **⚠️ Se não encontrar "Root Directory":**

O Railway pode chamar isso de:
- "Root Directory"
- "Service Root"
- "Watch Paths"
- "Build Context"

Se não encontrar, não tem problema! O `railway.toml` na raiz já está configurado para lidar com isso. Pule para o próximo passo.

---

## 🎯 PASSO 2: ADICIONAR POSTGRESQL DATABASE

### **No Railway Dashboard:**

1. **Volte para a visão do Projeto**
   - Clique em "inspiring-imagination" no breadcrumb superior
   - Ou clique em "← Back to Project"

2. **Adicione um novo Database:**
   - Clique no botão **"+ New"** (geralmente no canto superior direito)
   - Selecione **"Database"**
   - Escolha **"PostgreSQL"**

3. **Aguarde o provisionamento:**
   - Railway vai criar o PostgreSQL automaticamente
   - Isso leva ~30-60 segundos
   - Você verá um novo card "PostgreSQL" aparecer

4. **Verifique a conexão automática:**
   - Railway automaticamente injeta `DATABASE_URL` em todos os serviços do projeto
   - Não precisa configurar conexão manualmente

---

## 🎯 PASSO 3: CONFIGURAR VARIÁVEIS DE AMBIENTE

### **No Railway Dashboard:**

1. **Abra o serviço "upbeat-dedication" novamente**
   - Clique no card do serviço

2. **Vá para a aba "Variables"**
   - No menu lateral, clique em "Variables"

3. **Adicione as seguintes variáveis (uma por uma):**

#### **Variáveis Essenciais:**

```env
NODE_ENV=production
```

```env
PORT=3001
```

```env
FRONTEND_URL=https://flipcars.us,https://www.flipcars.us,https://admin.flipcars.us
```

```env
DATABASE_TYPE=postgres
```

```env
DATABASE_SYNCHRONIZE=false
```

```env
DATABASE_LOGGING=false
```

#### **JWT Secrets (IMPORTANTE - Use os valores gerados abaixo):**

```env
JWT_SECRET=7yP1wyX8Lt3e64Czu8Pem/SSrl6MBDaeQpz2KipBoFE=
```

```env
JWT_EXPIRATION=15m
```

```env
JWT_REFRESH_SECRET=gl5DhoFTM39reheJrtVLlZLc/L46o/OlKH3Y5X0M6zo=
```

```env
JWT_REFRESH_EXPIRATION=7d
```

4. **Salve as variáveis**
   - Railway salva automaticamente a cada variável adicionada
   - Não precisa clicar em "Save" no final

5. **Trigger novo deploy:**
   - Volte para a aba "Deployments"
   - Clique em "Deploy" para forçar um novo deploy com as variáveis
   - OU: Railway pode fazer deploy automático ao detectar as mudanças

---

## 🎯 PASSO 4: VERIFICAR O DEPLOY

### **No Railway Dashboard:**

1. **Monitore o Build:**
   - Na aba "Deployments", clique no deploy mais recente
   - Você verá "Build Logs" em tempo real

2. **O que esperar:**
   ```
   ✓ Installing dependencies...
   ✓ Building backend...
   ✓ Build completed successfully
   ✓ Starting application...
   ✓ Health check passed
   ```

3. **Se o deploy passar:**
   - ✅ Status: "Success" (verde)
   - ✅ Health check: OK
   - Continue para o Passo 5

4. **Se o deploy falhar:**
   - ❌ Verifique os "Build Logs" para erros
   - ❌ Verifique se o Root Directory está configurado
   - ❌ Verifique se o PostgreSQL está rodando
   - ❌ Verifique se as variáveis de ambiente estão corretas

---

## 🎯 PASSO 5: RODAR MIGRATIONS E SEEDS

### **No seu terminal local:**

1. **Instale o Railway CLI:**
   ```bash
   cd /home/user/webapp/backend
   npm install -g @railway/cli
   ```

2. **Faça login no Railway:**
   ```bash
   railway login
   ```
   - Isso abrirá um browser para autenticação
   - Complete o login

3. **Link ao projeto:**
   ```bash
   railway link
   ```
   - Selecione: "inspiring-imagination"
   - Selecione: "upbeat-dedication"

4. **Rode as migrations:**
   ```bash
   railway run npm run migration:run
   ```
   - Isso criará as tabelas no PostgreSQL
   - Aguarde até ver "Migration completed"

5. **Rode os seeds:**
   ```bash
   railway run npm run seed
   ```
   - Isso criará o usuário admin inicial
   - Aguarde até ver "Seed completed"

6. **Verifique os dados:**
   ```bash
   railway run npm run migration:show
   ```
   - Deve listar todas as migrations executadas

---

## 🎯 PASSO 6: CONFIGURAR DOMÍNIO PERSONALIZADO

### **No Railway Dashboard:**

1. **Abra o serviço "upbeat-dedication"**
   - Clique no card do serviço

2. **Vá para Settings → Networking:**
   - Scroll até "Domains"
   - Você verá um domínio Railway automático (algo como: `upbeat-dedication-production.up.railway.app`)

3. **Adicione Custom Domain:**
   - Clique em "Add Custom Domain"
   - Digite: `api.flipcars.us`
   - Clique em "Add"

4. **Copie o CNAME Target:**
   - Railway vai mostrar algo como:
     ```
     CNAME: api.flipcars.us → upbeat-dedication-production.up.railway.app
     ```
   - Copie o valor do target (o domínio Railway)

---

## 🎯 PASSO 7: CONFIGURAR DNS NO GODADDY

### **No GoDaddy DNS Manager:**

1. **Acesse seu domínio flipcars.us:**
   - Faça login no GoDaddy
   - Vá para "Meus Produtos"
   - Clique em "DNS" ao lado de flipcars.us

2. **Adicione um registro CNAME:**
   - Clique em "Add" ou "Adicionar"
   - **Type:** CNAME
   - **Name:** `api`
   - **Value:** `<CNAME-target-do-Railway>`
   - **TTL:** 600 (10 minutos)
   - Clique em "Save"

3. **Aguarde a propagação:**
   - DNS leva 5-30 minutos para propagar
   - Você pode verificar com:
     ```bash
     nslookup api.flipcars.us
     ```

---

## 🎯 PASSO 8: TESTAR O BACKEND

### **Teste 1: Health Check**

```bash
curl https://api.flipcars.us/api/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-07T...",
  "database": "connected",
  "uptime": 123.45
}
```

### **Teste 2: Login API**

```bash
curl -X POST https://api.flipcars.us/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@flipcars.us",
    "password": "Password123!"
  }'
```

**Resposta esperada:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "superadmin@flipcars.us",
    "role": "super_admin"
  }
}
```

### **Teste 3: Admin Dashboard Login**

1. Abra: https://admin.flipcars.us
2. Faça login com:
   - Email: `superadmin@flipcars.us`
   - Password: `Password123!`
3. Deve funcionar e mostrar o dashboard

### **Teste 4: Public Form Submission**

1. Abra: https://flipcars.us
2. Preencha o formulário de estimativa
3. Submeta o formulário
4. Verifique no Admin Dashboard se o lead aparece

---

## 📊 CHECKLIST COMPLETO

### **Railway Setup:**
- [ ] Root Directory configurado (`backend`)
- [ ] PostgreSQL adicionado e rodando
- [ ] Variáveis de ambiente configuradas (10 variáveis)
- [ ] JWT secrets adicionados (2 secrets)
- [ ] Deploy bem-sucedido (status verde)
- [ ] Health check passando
- [ ] Migrations executadas
- [ ] Seeds executados
- [ ] Domínio customizado adicionado (api.flipcars.us)
- [ ] DNS configurado no GoDaddy
- [ ] SSL certificado emitido (automático Railway)

### **Testes:**
- [ ] Health endpoint respondendo (200 OK)
- [ ] Login API funcionando
- [ ] Admin Dashboard conectando ao backend
- [ ] Form submission salvando no banco
- [ ] Leads aparecendo no dashboard

---

## 🔧 TROUBLESHOOTING

### **Problema 1: Deploy falha com "Module not found"**
**Causa:** Root Directory não configurado corretamente
**Solução:** Verifique se está exatamente `backend` (sem `/` ou `./`)

### **Problema 2: "DATABASE_URL not defined"**
**Causa:** PostgreSQL não conectado ao serviço
**Solução:** 
1. Verifique se PostgreSQL está rodando no mesmo projeto
2. Reinicie o serviço backend
3. Verifique em Variables se `DATABASE_URL` aparece (auto-injetada)

### **Problema 3: "JWT secret too short"**
**Causa:** JWT secrets não configurados
**Solução:** Adicione os JWT secrets nas variáveis (veja Passo 3)

### **Problema 4: CORS error no frontend**
**Causa:** FRONTEND_URL não incluindo todos os domínios
**Solução:** Verifique se `FRONTEND_URL` tem todos os 3 domínios separados por vírgula

### **Problema 5: 502 Bad Gateway**
**Causa:** Aplicação não iniciou corretamente
**Solução:**
1. Verifique Build Logs para erros
2. Verifique se PORT=3001 está configurado
3. Verifique health check logs

### **Problema 6: SSL certificate pending**
**Causa:** DNS não propagado ainda
**Solução:** Aguarde 5-30 minutos. Verifique com `nslookup api.flipcars.us`

---

## 📞 PRÓXIMOS PASSOS APÓS DEPLOYMENT

### **Imediatos:**
1. ✅ Backend no ar: https://api.flipcars.us
2. ✅ Admin conectado ao backend
3. ✅ Public form salvando leads

### **Opcionais (Futuro):**
1. ⬜ Configurar AWS S3 para uploads de imagens
2. ⬜ Configurar SendGrid para envio de emails
3. ⬜ Configurar Twilio para SMS/WhatsApp
4. ⬜ Adicionar Redis para caching (performance)
5. ⬜ Configurar monitoramento (Sentry, LogRocket)
6. ⬜ Configurar backups automáticos do PostgreSQL

---

## 💰 CUSTO MENSAL

**Railway Hobby Plan:** $5/mês
- Backend (Node.js) ✅
- PostgreSQL ✅
- Custom domain com SSL ✅
- 500 horas de execução (sempre ligado 24/7)
- 8GB storage
- Backups automáticos

**Economia vs. alternativas:**
- Heroku: ~$25/mês (Dyno + PostgreSQL)
- AWS: ~$30-50/mês (EC2 + RDS + Load Balancer)
- DigitalOcean: ~$15-20/mês (Droplet + Managed PostgreSQL)

---

## 🔐 CREDENCIAIS E URLs

### **Acesso ao Backend:**
- URL Production: https://api.flipcars.us
- URL Railway (alternativa): https://upbeat-dedication-production.up.railway.app
- Health Check: https://api.flipcars.us/api/health
- API Docs: https://api.flipcars.us/api-docs (se habilitado)

### **Credenciais Admin:**
```
Email:    superadmin@flipcars.us
Password: Password123!
```

### **JWT Secrets (SALVE EM LOCAL SEGURO):**
```
JWT_SECRET=7yP1wyX8Lt3e64Czu8Pem/SSrl6MBDaeQpz2KipBoFE=
JWT_REFRESH_SECRET=gl5DhoFTM39reheJrtVLlZLc/L46o/OlKH3Y5X0M6zo=
```

### **Railway Project:**
- Dashboard: https://railway.app/project/inspiring-imagination
- Projeto: inspiring-imagination
- Serviço Backend: upbeat-dedication
- Database: PostgreSQL (auto-nomeado)

### **GitHub:**
- Repo: https://github.com/chazmarques-blip/Flipcars-site-e-admin
- Branch deploy: genspark_ai_developer
- Branch principal: main

---

## 📝 COMANDOS ÚTEIS

### **Railway CLI:**
```bash
# Login
railway login

# Link projeto
railway link

# Ver logs em tempo real
railway logs

# Rodar comando no serviço
railway run <command>

# Abrir dashboard
railway open

# Ver variáveis de ambiente
railway variables

# SSH no container (debug)
railway shell
```

### **Migrations e Seeds:**
```bash
# Rodar migrations
railway run npm run migration:run

# Reverter migration
railway run npm run migration:revert

# Ver migrations
railway run npm run migration:show

# Criar nova migration
railway run npm run migration:create -- MyMigration

# Rodar seeds
railway run npm run seed
```

### **Database Direct Access:**
```bash
# Conectar ao PostgreSQL
railway run psql $DATABASE_URL

# Dump do banco
railway run pg_dump $DATABASE_URL > backup.sql

# Restore do banco
railway run psql $DATABASE_URL < backup.sql
```

---

## ✅ DEPLOY COMPLETO!

Quando você completar todos os passos acima, o FlipCars estará 100% funcional:

✅ **Frontend Public:** https://flipcars.us (Vercel)
✅ **Frontend Admin:** https://admin.flipcars.us (Cloudflare Pages)
✅ **Backend API:** https://api.flipcars.us (Railway)
✅ **Database:** PostgreSQL (Railway)

**Arquitetura completa:**
```
┌─────────────────────────────────────────────────────────────┐
│                         FLIPCARS                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐      ┌──────────────┐     ┌───────────┐ │
│  │   Public     │      │    Admin     │     │  Backend  │ │
│  │  flipcars.us │ ───► │ admin.flip   │ ───►│ api.flip  │ │
│  │   (Vercel)   │      │ cars.us      │     │ cars.us   │ │
│  └──────────────┘      │ (Cloudflare) │     │ (Railway) │ │
│                        └──────────────┘     └─────┬─────┘ │
│                                                    │       │
│                                             ┌──────▼────┐  │
│                                             │PostgreSQL │  │
│                                             │ (Railway) │  │
│                                             └───────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

**Última atualização:** 2025-11-07 22:30 UTC
**Status:** 🚀 Pronto para deployment!
**Próxima ação:** Configurar Root Directory no Railway Dashboard
