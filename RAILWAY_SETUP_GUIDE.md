# 🚂 Railway Deployment - Guia Completo de Configuração

**Atualizado:** 2025-11-11  
**Problema Resolvido:** IPv6 connection issue (ENETUNREACH)

---

## 🎯 Problema Identificado

### **Erro Original:**
```
Error: connect ENETUNREACH 2600:1f16:1c08:332e:7edd:af30:52a5:def1:5432
```

### **Causa Raiz:**
- TypeORM/pg driver resolvendo DNS do Supabase para endereço IPv6
- Railway **NÃO SUPORTA** conexões IPv6 para bancos externos
- Node.js preferindo IPv6 por padrão no DNS lookup

### **Solução Implementada:**
1. ✅ DNS resolver customizado que força IPv4
2. ✅ `dns.setDefaultResultOrder('ipv4first')` no data-source.ts
3. ✅ Resolução de hostname para IP IPv4 antes da conexão
4. ✅ Fallback para hostname original se DNS falhar
5. ✅ Logs detalhados para diagnóstico

---

## 📋 Variáveis de Ambiente Necessárias no Railway

### **1. Acesse o Railway Dashboard**

**URL:** https://railway.app

**Passos:**
1. Login na sua conta Railway
2. Selecione o projeto (ex: "inspiring-imagination")
3. Selecione o serviço: **upbeat-dedication**
4. Clique na aba **"Variables"**

---

### **2. Configure as Variáveis de Ambiente**

#### **✅ OPÇÃO RECOMENDADA: DATABASE_URL**

```bash
DATABASE_URL=postgresql://postgres.kvjvieekkudeqtnunqlb:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2anZpZWVra3VkZXF0bnVucWxiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTc1MTY0OSwiZXhwIjoyMDc3MzI3NjQ5fQ.HdU6WH0JS-oNam1nkHvax6JQC3221VkFXpY1Ejz2x04@db.kvjvieekkudeqtnunqlb.supabase.co:5432/postgres?sslmode=require
```

**⚠️ IMPORTANTE:**
- Usar **porta 5432** (não 6543)
- Incluir `?sslmode=require` no final
- Usar o **Service Role Key** como password

---

#### **📝 Variáveis Completas (Copy-Paste)**

```bash
# Node Environment
NODE_ENV=production
PORT=3001
NODE_OPTIONS=--dns-result-order=ipv4first

# Database Connection (PORTA 5432 - CONEXÃO DIRETA)
DATABASE_URL=postgresql://postgres.kvjvieekkudeqtnunqlb:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2anZpZWVra3VkZXF0bnVucWxiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTc1MTY0OSwiZXhwIjoyMDc3MzI3NjQ5fQ.HdU6WH0JS-oNam1nkHvax6JQC3221VkFXpY1Ejz2x04@db.kvjvieekkudeqtnunqlb.supabase.co:5432/postgres?sslmode=require

# Supabase Configuration
SUPABASE_URL=https://kvjvieekkudeqtnunqlb.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2anZpZWVra3VkZXF0bnVucWxiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTc1MTY0OSwiZXhwIjoyMDc3MzI3NjQ5fQ.HdU6WH0JS-oNam1nkHvax6JQC3221VkFXpY1Ejz2x04
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2anZpZWVra3VkZXF0bnVucWxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NTE2NDksImV4cCI6MjA3NzMyNzY0OX0.e7jgc-M101J29z83hYaFz2StStn0l7tI6TnefZon_nY

# JWT Secrets (PRODUCTION - CHANGE THESE!)
JWT_SECRET=flipcars-super-secret-jwt-key-production-2024-change-this
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=flipcars-refresh-secret-key-production-2024-change-this
JWT_REFRESH_EXPIRES_IN=7d

# Frontend URLs (CORS)
FRONTEND_URL=https://admin.flipcars.us,https://www.flipcars.us,https://flipcars.us

# Optional: Enable SQL logging for debugging
DATABASE_LOGGING=false
```

---

### **3. Opção Alternativa: Variáveis Separadas**

Se por algum motivo DATABASE_URL não funcionar, use variáveis separadas:

```bash
DATABASE_HOST=db.kvjvieekkudeqtnunqlb.supabase.co
DATABASE_PORT=5432
DATABASE_USERNAME=postgres.kvjvieekkudeqtnunqlb
DATABASE_PASSWORD=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2anZpZWVra3VkZXF0bnVucWxiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTc1MTY0OSwiZXhwIjoyMDc3MzI3NjQ5fQ.HdU6WH0JS-oNam1nkHvax6JQC3221VkFXpY1Ejz2x04
DATABASE_NAME=postgres
DATABASE_SSL=true
```

---

## 🔧 Mudanças no Código

### **Arquivos Modificados:**

#### **1. backend/src/database/data-source.ts**
- ✅ Adicionado `dns.setDefaultResultOrder('ipv4first')`
- ✅ Função `resolveHostToIPv4()` para forçar DNS IPv4
- ✅ Extração e substituição de hostname por IP
- ✅ Logs detalhados de debug
- ✅ Timeout configurations no pg driver

#### **2. backend/src/main.ts**
- ✅ Atualizado para aguardar promise do dataSource
- ✅ Mantido logs detalhados de startup

#### **3. backend/test-db-connection.js** (NOVO)
- ✅ Script para testar conexão ANTES do deploy
- ✅ Resolve DNS para IPv4
- ✅ Testa query simples
- ✅ Diagnóstico de erro IPv6

#### **4. backend/package.json**
- ✅ Script `test:db` adicionado
- ✅ Mantido `NODE_OPTIONS` no `start:prod`

---

## 🧪 Como Testar Localmente

### **1. Configurar .env.production local**

```bash
cd backend
cat > .env.production << 'EOF'
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://postgres.kvjvieekkudeqtnunqlb:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2anZpZWVra3VkZXF0bnVucWxiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTc1MTY0OSwiZXhwIjoyMDc3MzI3NjQ5fQ.HdU6WH0JS-oNam1nkHvax6JQC3221VkFXpY1Ejz2x04@db.kvjvieekkudeqtnunqlb.supabase.co:5432/postgres?sslmode=require
EOF
```

### **2. Testar conexão**

```bash
# Testar conexão diretamente
NODE_ENV=production npm run test:db

# Deve mostrar:
# ✅ Resolved db.kvjvieekkudeqtnunqlb.supabase.co to IPv4: 54.x.x.x
# ✅ Database connection successful!
# ✅ Query successful!
```

### **3. Build e testar backend**

```bash
# Build
npm run build

# Testar em modo produção
npm run start:prod

# Deve mostrar:
# ✅ Resolved ... to IPv4: ...
# ✅ Database connection established
# 🚀 FlipCars Backend API running on: http://localhost:3001/api
```

---

## 🚀 Deploy no Railway

### **Passo a Passo:**

#### **1. Commit e Push das mudanças**

```bash
cd /home/user/webapp

# Add mudanças
git add backend/

# Commit
git commit -m "fix(backend): Force IPv4 DNS resolution for Railway + Supabase connection

- Add custom DNS resolver to force IPv4 addresses only
- Implement dns.setDefaultResultOrder('ipv4first')
- Create resolveHostToIPv4() function for hostname resolution
- Replace hostname with IPv4 address in DATABASE_URL
- Add detailed connection logs for debugging
- Add test-db-connection.js script for local testing
- Update data-source.ts to handle async config building
- Update main.ts to await dataSource promise
- Add npm run test:db script

This fixes ENETUNREACH IPv6 errors on Railway when connecting to Supabase.
Railway doesn't support IPv6 for external connections, so we must force IPv4.

Resolves: #railway-ipv6-connection-issue"

# Push para branch
git push origin genspark_ai_developer
```

#### **2. No Railway Dashboard**

1. **Acesse:** https://railway.app
2. **Selecione:** Projeto > Serviço "upbeat-dedication"
3. **Variables:** Adicione/atualize conforme seção 2 acima
4. **Importante:** Certifique-se de incluir `NODE_OPTIONS=--dns-result-order=ipv4first`
5. **Deploy:** Railway fará redeploy automático (3-5 minutos)

#### **3. Monitorar Logs**

No Railway Dashboard, vá em **"Deployments"** > **Última deploy** > **"View Logs"**

**Logs esperados (sucesso):**
```
🔍 Using DATABASE_URL for connection...
🌐 Attempting to resolve hostname to IPv4: db.kvjvieekkudeqtnunqlb.supabase.co
✅ Resolved db.kvjvieekkudeqtnunqlb.supabase.co to IPv4: 54.x.x.x
✅ Using IPv4 address in connection: 54.x.x.x
📊 Database configuration created successfully
🚀 FlipCars Backend API running on: http://localhost:3001/api
✅ Database connection established
```

---

## ✅ Verificação de Sucesso

### **1. Health Check**

```bash
curl https://upbeat-dedication-production.up.railway.app/api/health

# Esperado:
{
  "status": "ok",
  "timestamp": "2025-11-11T...",
  "database": "connected",
  "supabase": "connected"
}
```

### **2. Verificar Status no Railway**

- ✅ Deploy status: **ACTIVE** (verde)
- ✅ Service status: **RUNNING**
- ✅ Logs sem erros de conexão
- ✅ CPU/Memory usage normal

---

## 🆘 Troubleshooting

### **Problema 1: Ainda dando erro IPv6**

**Sintomas:**
```
Error: connect ENETUNREACH 2600:1f16:...
```

**Soluções:**

1. **Verificar NODE_OPTIONS:**
   ```bash
   # Deve estar presente nas variáveis:
   NODE_OPTIONS=--dns-result-order=ipv4first
   ```

2. **Verificar logs de DNS resolution:**
   - Se não aparecer `✅ Resolved ... to IPv4: ...` nos logs
   - O código de resolução não está sendo executado

3. **Opção Nuclear - Usar IP direto:**
   ```bash
   # Descobrir IP do Supabase:
   nslookup db.kvjvieekkudeqtnunqlb.supabase.co
   
   # Pegar IPv4 (ex: 54.XXX.XXX.XXX)
   # Usar diretamente na DATABASE_URL:
   DATABASE_URL=postgresql://postgres.kvjvieekkudeqtnunqlb:TOKEN@54.XXX.XXX.XXX:5432/postgres?sslmode=require
   ```

### **Problema 2: DNS resolution timeout**

**Sintomas:**
```
❌ DNS IPv4 resolution failed
```

**Soluções:**

1. **O código já tem fallback** - usará hostname original
2. **Verificar se Railway permite DNS lookups** - pode ter firewall
3. **Usar IP direto** (opção nuclear acima)

### **Problema 3: Connection timeout**

**Sintomas:**
```
Connection timeout / ETIMEDOUT
```

**Soluções:**

1. **Verificar porta:** Deve ser **5432** (não 6543)
2. **Verificar SSL:** Deve ter `?sslmode=require`
3. **Aumentar timeout:**
   ```typescript
   // Já implementado em data-source.ts
   connectionTimeoutMillis: 30000
   ```

### **Problema 4: Authentication failed**

**Sintomas:**
```
password authentication failed
```

**Soluções:**

1. **Verificar Service Role Key:**
   - Ir no Supabase Dashboard
   - Project Settings > API
   - Copiar `service_role` (secret) key
   - Usar como password na DATABASE_URL

2. **Formato correto:**
   ```
   postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
   ```

---

## 📊 Diferenças: Porta 5432 vs 6543

| Porta | Tipo | Uso | IPv6 | Pooling |
|-------|------|-----|------|---------|
| **5432** | Direta | Conexão direta ao PostgreSQL | ❌ Problemas | ❌ Não |
| **6543** | PgBouncer | Connection pooling | ✅ Funciona | ✅ Sim |

**Por que usar 5432?**
- Evita camada extra do PgBouncer
- Mais simples para debugging
- Railway + custom DNS resolver funciona melhor
- Menos latência

---

## 🔗 Links Úteis

- **Railway Dashboard:** https://railway.app
- **Supabase Project:** https://supabase.com/dashboard/project/kvjvieekkudeqtnunqlb
- **GitHub Repo:** https://github.com/chazmarques-blip/Flipcars-site-e-admin
- **Backend URL:** https://upbeat-dedication-production.up.railway.app
- **Health Check:** https://upbeat-dedication-production.up.railway.app/api/health

---

## 📝 Checklist Pré-Deploy

Antes de fazer deploy, verificar:

- [ ] Código atualizado com DNS resolver customizado
- [ ] `dns.setDefaultResultOrder('ipv4first')` presente
- [ ] Função `resolveHostToIPv4()` implementada
- [ ] Logs de debug adicionados
- [ ] `test-db-connection.js` criado e testado localmente
- [ ] `npm run test:db` executado com sucesso
- [ ] Variáveis de ambiente prontas para Railway
- [ ] `NODE_OPTIONS` incluído nas variáveis
- [ ] DATABASE_URL usando porta **5432**
- [ ] DATABASE_URL com `?sslmode=require`
- [ ] Commit feito com mensagem descritiva
- [ ] Push para branch `genspark_ai_developer`
- [ ] Pull Request criado/atualizado

---

## 🎯 Resultado Esperado

**Backend 100% funcional no Railway:**

✅ Deploy bem-sucedido (verde)  
✅ Conexão IPv4 estabelecida  
✅ Database conectado e operacional  
✅ API respondendo corretamente  
✅ Health check retornando 200 OK  
✅ Sem crashes ou reinicializações  
✅ Logs limpos sem erros IPv6  

---

**Última atualização:** 2025-11-11  
**Status da solução:** ✅ IMPLEMENTADA - Aguardando deploy no Railway

**Próximo passo:** Deploy no Railway e verificação! 🚀
