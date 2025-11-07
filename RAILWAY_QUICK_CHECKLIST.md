# ✅ Railway Deployment - Quick Checklist
**FlipCars Backend - 07/Nov/2025**

---

## 🎯 ONDE VOCÊ ESTÁ AGORA

```
Railway Dashboard → Projeto: inspiring-imagination → Serviço: upbeat-dedication → Settings
```

---

## ⚡ PASSOS RÁPIDOS

### **[ ] PASSO 1: Root Directory (2 min)**
- [ ] Abrir serviço "upbeat-dedication"
- [ ] Ir em Settings
- [ ] Procurar "Root Directory"
- [ ] Digitar: `backend`
- [ ] Salvar

**Se não encontrar Root Directory:** OK! O railway.toml já cuida disso.

---

### **[ ] PASSO 2: PostgreSQL (1 min)**
- [ ] Voltar para projeto (clicar em "inspiring-imagination")
- [ ] Clicar "+ New"
- [ ] Escolher "Database" → "PostgreSQL"
- [ ] Aguardar provisionamento (~30s)
- [ ] Confirmar que card PostgreSQL apareceu

---

### **[ ] PASSO 3: Environment Variables (5 min)**

Abrir serviço "upbeat-dedication" → Aba "Variables"

#### **Essenciais (6 variáveis):**
```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://flipcars.us,https://www.flipcars.us,https://admin.flipcars.us
DATABASE_TYPE=postgres
DATABASE_SYNCHRONIZE=false
DATABASE_LOGGING=false
```

#### **JWT Secrets (4 variáveis):**
```env
JWT_SECRET=7yP1wyX8Lt3e64Czu8Pem/SSrl6MBDaeQpz2KipBoFE=
JWT_EXPIRATION=15m
JWT_REFRESH_SECRET=gl5DhoFTM39reheJrtVLlZLc/L46o/OlKH3Y5X0M6zo=
JWT_REFRESH_EXPIRATION=7d
```

**Total:** 10 variáveis

---

### **[ ] PASSO 4: Deploy (5-10 min)**
- [ ] Ir em aba "Deployments"
- [ ] Clicar "Deploy" (ou aguardar deploy automático)
- [ ] Acompanhar Build Logs
- [ ] Aguardar status "Success" (verde)
- [ ] Confirmar Health Check OK

---

### **[ ] PASSO 5: Migrations (3 min)**

No seu terminal:

```bash
cd /home/user/webapp/backend

# Instalar Railway CLI (se não tiver)
npm install -g @railway/cli

# Login
railway login

# Link ao projeto
railway link
# → Selecionar: inspiring-imagination
# → Selecionar: upbeat-dedication

# Rodar migrations
railway run npm run migration:run

# Rodar seeds (criar admin user)
railway run npm run seed
```

---

### **[ ] PASSO 6: Domínio (5 min)**

#### **No Railway:**
- [ ] Serviço "upbeat-dedication" → Settings → Networking
- [ ] "Add Custom Domain"
- [ ] Digitar: `api.flipcars.us`
- [ ] Copiar CNAME target (algo como: upbeat-dedication-xxx.up.railway.app)

#### **No GoDaddy:**
- [ ] Login GoDaddy
- [ ] Domínio flipcars.us → DNS
- [ ] "Add" → CNAME
  - Name: `api`
  - Value: `<CNAME-do-Railway>`
  - TTL: 600
- [ ] Salvar
- [ ] Aguardar 5-30 min para propagar

---

### **[ ] PASSO 7: Testar (2 min)**

```bash
# Teste 1: Health Check
curl https://api.flipcars.us/api/health

# Teste 2: Login
curl -X POST https://api.flipcars.us/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@flipcars.us","password":"Password123!"}'
```

Abrir Admin Dashboard:
- [ ] https://admin.flipcars.us
- [ ] Login: superadmin@flipcars.us / Password123!
- [ ] Confirmar que funciona

Testar form público:
- [ ] https://flipcars.us
- [ ] Preencher e submeter formulário
- [ ] Verificar lead no admin dashboard

---

## ⏱️ TEMPO TOTAL ESTIMADO

- Passo 1: 2 min
- Passo 2: 1 min
- Passo 3: 5 min
- Passo 4: 10 min (aguardando build)
- Passo 5: 3 min
- Passo 6: 5 min + 30 min DNS
- Passo 7: 2 min

**Total:** ~30 minutos + 30 min DNS propagation = **1 hora**

---

## 🚨 TROUBLESHOOTING RÁPIDO

| Problema | Solução Rápida |
|----------|----------------|
| Build falha | Verificar Root Directory = `backend` |
| DATABASE_URL missing | PostgreSQL rodando? Reiniciar serviço |
| JWT error | Adicionar JWT secrets no Variables |
| CORS error | FRONTEND_URL com 3 domínios separados por vírgula |
| 502 Bad Gateway | Verificar Build Logs, PORT=3001 configurado? |
| SSL pending | Aguardar DNS propagar (5-30 min) |

---

## 📞 COMANDOS ÚTEIS

```bash
# Ver logs em tempo real
railway logs

# Ver status do deploy
railway status

# Abrir dashboard
railway open

# Conectar ao PostgreSQL
railway run psql $DATABASE_URL

# Ver variáveis
railway variables
```

---

## ✅ DEPLOY COMPLETO QUANDO:

- [x] Root Directory configurado
- [x] PostgreSQL rodando
- [x] 10 variáveis de ambiente configuradas
- [x] Deploy status = Success (verde)
- [x] Migrations executadas
- [x] Seeds executados
- [x] Domínio api.flipcars.us configurado
- [x] DNS propagado
- [x] SSL certificado emitido
- [x] Health check retorna 200 OK
- [x] Login API funciona
- [x] Admin dashboard conecta
- [x] Form submission salva no banco

---

## 🎉 RESULTADO FINAL

```
✅ Public:  https://flipcars.us          (Vercel)
✅ Admin:   https://admin.flipcars.us    (Cloudflare Pages)
✅ Backend: https://api.flipcars.us      (Railway)
✅ Database: PostgreSQL                  (Railway)
```

**Status:** 🚀 Production Ready!

---

**Arquivos de apoio:**
- `RAILWAY_SETUP_STEPS.md` - Guia completo detalhado
- `JWT_SECRETS_PRODUCTION.txt` - Secrets para guardar
- `RAILWAY_DEPLOYMENT_IN_PROGRESS.md` - Documentação anterior

**Última atualização:** 2025-11-07 22:35 UTC
