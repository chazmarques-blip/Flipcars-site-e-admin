# 🔄 MIGRAÇÃO: Railway → Supabase Completo

**Objetivo**: Migrar de Railway PostgreSQL + Supabase Storage para **Supabase Completo**

**Vantagens**:
- ✅ Tudo em um único lugar
- ✅ Mais simples de gerenciar
- ✅ Mais barato (free tier generoso)
- ✅ Seeds direto no SQL Editor
- ✅ Auth built-in do Supabase
- ✅ Dashboard visual melhor

**Tempo estimado**: 30-60 minutos

---

## 📊 ANTES E DEPOIS

### **ANTES (Atual):**
```
Railway PostgreSQL
├─ Banco de dados (users, leads, etc)
├─ $5/mês
├─ Seeds via CLI
└─ Mais complexo

Supabase Storage
├─ Só fotos
└─ Free tier
```

### **DEPOIS (Proposto):**
```
Supabase Completo
├─ PostgreSQL (banco completo)
├─ Storage (fotos)
├─ Auth (autenticação)
├─ Realtime (opcional)
├─ SQL Editor (seeds fáceis)
├─ Dashboard visual
└─ Free tier: 500MB DB + 1GB storage
```

---

## ✅ PASSO A PASSO

### **FASE 1: Setup Supabase** (10 min)

#### **1.1. Criar Projeto Supabase**
```
1. Ir para: https://supabase.com
2. Login/Sign up
3. Click: "New Project"
4. Preencher:
   - Name: FlipCars
   - Database Password: [senha forte]
   - Region: East US (perto do Railway)
5. Wait ~2 minutos (provisioning)
```

#### **1.2. Obter Credenciais**
```
1. Settings → API
2. Copiar:
   - Project URL: https://xxxxx.supabase.co
   - anon/public key: eyJhbG... (para frontend)
   - service_role key: eyJhbG... (para backend - SECRETO!)
   
3. Settings → Database
4. Copiar:
   - Connection string (URI mode)
   - postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres
```

---

### **FASE 2: Migrar Schema** (15 min)

#### **2.1. Exportar Schema do Railway**

**Opção A: Via Railway CLI**
```bash
# Conectar ao Railway PostgreSQL
railway connect postgres

# Exportar schema
pg_dump -h <host> -U <user> -d <database> --schema-only > schema.sql
```

**Opção B: Copiar Migrations**
```bash
# O projeto já tem migrations TypeORM
# Vamos usá-las diretamente no Supabase
cd /home/user/webapp/backend/src/database/migrations
ls -la *.ts
```

#### **2.2. Executar Migrations no Supabase**

**Método 1: SQL Editor (RECOMENDADO)**
```
1. Supabase Dashboard → SQL Editor
2. Click: "New query"
3. Copiar conteúdo de cada migration (convertido para SQL)
4. Executar uma por uma
```

**Método 2: TypeORM direto**
```bash
# Atualizar .env.production para apontar ao Supabase
DATABASE_URL=postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres

# Rodar migrations
npm run migration:run
```

#### **2.3. Executar Seeds**

No Supabase SQL Editor:
```sql
-- Copiar todo o conteúdo de backend/src/database/seeds/
-- Ou converter TypeScript para SQL puro

-- Exemplo: Criar admin user
INSERT INTO "user" (id, name, email, password, status, language, "emailVerified")
VALUES (
  gen_random_uuid(),
  'Admin User',
  'admin@flipcars.us',
  '$2b$10$rqYQWJKTi0Y9R8NXHZxzOeV4xOKNKL0gEk3E7p0hMQBwFKYZqGNGO',
  'active',
  'en',
  true
);
```

**Ou via backend:**
```bash
# Apontar backend para Supabase
npm run seed
```

---

### **FASE 3: Configurar Storage** (5 min)

#### **3.1. Executar Script de Storage**
```
1. Supabase Dashboard → SQL Editor
2. New query
3. Copiar conteúdo de: supabase-storage-setup.sql
4. Execute
5. Verificar: Storage → Buckets → "lead-photos" existe
```

#### **3.2. Validar Bucket**
```
Storage → lead-photos
├─ Public: ✅ Yes
├─ File size limit: 5MB
└─ Allowed MIME types: images
```

---

### **FASE 4: Atualizar Backend** (10 min)

#### **4.1. Atualizar Variáveis de Ambiente**

**Railway Dashboard → Backend Service → Variables:**

Remover/Comentar:
```bash
# DATABASE_HOST (não precisa mais)
# DATABASE_PORT
# DATABASE_USERNAME
# DATABASE_PASSWORD
# DATABASE_NAME
```

Adicionar/Atualizar:
```bash
# Supabase Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres

# Supabase Storage (já deve existir)
SUPABASE_URL=https://[PROJECT_REF].supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

#### **4.2. Verificar app.module.ts**

Arquivo: `backend/src/app.module.ts`

```typescript
// Deve usar DATABASE_URL (já configurado)
TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.DATABASE_URL, // ← Supabase connection string
  autoLoadEntities: true,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
}),
```

#### **4.3. Redeploy Backend**
```bash
git add .
git commit -m "feat: migrate to Supabase PostgreSQL + Storage"
git push

# Railway faz auto-deploy
```

---

### **FASE 5: Validação** (10 min)

#### **5.1. Testar Database**
```bash
# Via ferramenta de teste
open test_dashboard_auth.html

# Login com:
Email: admin@flipcars.us
Password: Password123!

# Resultado esperado: ✅ LOGIN SUCCESSFUL
```

#### **5.2. Testar Storage**
```bash
# Via Postman ou curl
curl -X POST https://upbeat-dedication-production.up.railway.app/api/public/upload/storage-health

# Resultado esperado:
{
  "success": true,
  "bucketExists": true,
  "bucketPublic": true
}
```

#### **5.3. Testar Upload**
```bash
# Upload de foto teste
curl -X POST https://upbeat-dedication-production.up.railway.app/api/public/upload/photo \
  -F "photo=@test-image.jpg"

# Resultado esperado:
{
  "photoUrl": "https://xxxxx.supabase.co/storage/v1/object/public/lead-photos/..."
}
```

---

### **FASE 6: Cleanup** (5 min)

#### **6.1. Desativar Railway PostgreSQL**
```
1. Railway Dashboard
2. PostgreSQL Service
3. Settings → Delete Service
4. ✅ Economiza $5/mês
```

#### **6.2. Atualizar Documentação**
```bash
# Atualizar todos os README com nova infra
- RESUMO_SESSAO_COMPLETO.md
- backend/README.md
- RAILWAY_DEPLOYMENT_GUIDE.md (se existir)
```

---

## 🎁 BENEFÍCIOS EXTRAS DO SUPABASE

### **1. Auth Built-in** (Futuro)
```typescript
// Pode usar autenticação do Supabase
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Login com email/password
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@flipcars.us',
  password: 'Password123!'
});

// Supabase gerencia tokens JWT automaticamente!
```

### **2. Realtime Subscriptions**
```typescript
// Updates em tempo real no dashboard
supabase
  .channel('leads')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'lead' },
    (payload) => {
      console.log('New lead!', payload);
      // Atualizar dashboard em tempo real
    }
  )
  .subscribe();
```

### **3. Row Level Security (RLS)**
```sql
-- Segurança em nível de linha
ALTER TABLE lead ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their leads"
ON lead FOR SELECT
USING (auth.uid() = assigned_to_id);
```

### **4. Edge Functions**
```typescript
// Serverless functions no Supabase
// Alternativa às Routes do backend

// supabase/functions/send-email/index.ts
serve(async (req) => {
  const { email, subject, body } = await req.json();
  
  // Enviar email
  await sendEmail(email, subject, body);
  
  return new Response(JSON.stringify({ success: true }));
});
```

---

## 📊 COMPARAÇÃO DE CUSTOS

### **Antes (Railway + Supabase):**
```
Railway PostgreSQL:     $5/mês
Railway Egress:         ~$2/mês
Supabase Storage:       Free
────────────────────────────
TOTAL:                  ~$7/mês
```

### **Depois (Supabase Apenas):**
```
Supabase Free Tier:
├─ PostgreSQL: 500MB    Free
├─ Storage: 1GB         Free
├─ Bandwidth: 2GB/mês   Free
├─ Auth: Unlimited      Free
└─ Realtime: Included   Free
────────────────────────────
TOTAL:                  $0/mês

(Se crescer, Supabase Pro: $25/mês para TUDO)
```

**Economia:** $84/ano ($7 x 12 meses)

---

## ⚠️ CONSIDERAÇÕES

### **Free Tier Limits:**
```
✅ 500MB Database (suficiente para milhares de leads)
✅ 1GB Storage (centenas de fotos)
✅ 2GB Bandwidth/mês (suficiente para pequeno/médio tráfego)
✅ Pausa após 1 semana de inatividade (reativa em ~2s)
```

### **Quando Upgrade para Pro:**
```
Se você tiver:
- Mais de 500MB de dados
- Mais de 1GB de fotos
- Mais de 2GB bandwidth/mês
- Precisa de database sempre ativo (sem pausa)

Então: Supabase Pro ($25/mês)
Ainda mais barato que Railway!
```

---

## 🚨 BACKUP ANTES DE MIGRAR

### **Backup do Railway:**
```bash
# 1. Conectar ao PostgreSQL
railway connect postgres

# 2. Exportar TUDO (schema + dados)
pg_dump -h <host> -U <user> -d <database> \
  --clean --no-owner --no-acl \
  > flipcars_railway_backup_$(date +%Y%m%d).sql

# 3. Salvar backup em lugar seguro
# - Google Drive
# - Dropbox
# - GitHub (privado)
```

### **Restaurar Backup (se necessário):**
```bash
# No Supabase
psql "postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres" \
  < flipcars_railway_backup_20251111.sql
```

---

## 📋 CHECKLIST DE MIGRAÇÃO

### **Preparação:**
- [ ] Criar conta Supabase
- [ ] Criar projeto FlipCars
- [ ] Obter credenciais (URL, keys, connection string)
- [ ] Fazer backup do Railway PostgreSQL

### **Migração:**
- [ ] Executar migrations no Supabase
- [ ] Executar seeds no Supabase
- [ ] Configurar bucket de storage
- [ ] Atualizar env vars no Railway backend
- [ ] Redeploy backend

### **Validação:**
- [ ] Testar login (test_dashboard_auth.html)
- [ ] Testar busca de leads
- [ ] Testar storage health
- [ ] Testar upload de foto
- [ ] Dashboard admin funciona

### **Cleanup:**
- [ ] Desativar PostgreSQL no Railway
- [ ] Atualizar documentação
- [ ] Deletar backup antigo (após 1 semana funcionando)

---

## 🛠️ SCRIPTS AUXILIARES

### **Script 1: Converter Seeds TypeScript para SQL**

```bash
cd /home/user/webapp/backend/src/database/seeds

# Analisar seeds e gerar SQL equivalente
cat 02-users.seed.ts

# Exemplo de conversão:
# TypeScript:
#   const hashedPassword = await bcrypt.hash('Password123!', 10);
#
# SQL:
#   INSERT INTO "user" (password) VALUES 
#   ('$2b$10$rqYQWJKTi0Y9R8NXHZxzOeV4xOKNKL0gEk3E7p0hMQBwFKYZqGNGO');
```

### **Script 2: Validar Migração**

```bash
#!/bin/bash
# validate_supabase.sh

echo "🔍 Validando migração para Supabase..."

# 1. Testar conexão database
echo "1. Testando database..."
curl -s "https://upbeat-dedication-production.up.railway.app/api/health"

# 2. Testar login
echo "2. Testando login..."
curl -s -X POST "https://upbeat-dedication-production.up.railway.app/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@flipcars.us","password":"Password123!"}'

# 3. Testar storage
echo "3. Testando storage..."
curl -s "https://upbeat-dedication-production.up.railway.app/api/public/upload/storage-health"

echo "✅ Validação completa!"
```

---

## 📚 DOCUMENTAÇÃO SUPABASE

### **Links Úteis:**
```
Dashboard:           https://app.supabase.com
Docs:                https://supabase.com/docs
SQL Editor:          https://app.supabase.com/project/_/sql
Storage:             https://app.supabase.com/project/_/storage
Database:            https://app.supabase.com/project/_/database
API Docs:            https://app.supabase.com/project/_/api
```

### **Cliente JavaScript:**
```bash
# Para usar Supabase client no frontend
npm install @supabase/supabase-js
```

---

## 🎯 PRÓXIMOS PASSOS APÓS MIGRAÇÃO

1. **Otimizar Database:**
   - Adicionar índices
   - Configurar RLS policies
   - Setup backups automáticos

2. **Usar Auth do Supabase:**
   - Migrar de JWT custom para Supabase Auth
   - Login com Google/GitHub (social auth)
   - Magic links (email sem senha)

3. **Implementar Realtime:**
   - Dashboard updates em tempo real
   - Notificações push
   - Colaboração multi-user

4. **Edge Functions:**
   - Processar uploads
   - Enviar emails
   - Webhooks

---

## ❓ FAQ

### **Q: Vou perder dados na migração?**
A: Não, se seguir os passos e fazer backup primeiro.

### **Q: Quanto tempo leva?**
A: 30-60 minutos (primeira vez)

### **Q: Preciso desligar o site?**
A: Não! Migração sem downtime.

### **Q: E se algo der errado?**
A: Backup do Railway → restaurar em 5 minutos.

### **Q: Vale a pena?**
A: Sim! Mais simples, mais barato, mais recursos.

---

## 📞 SUPORTE

### **Supabase:**
- Discord: https://discord.supabase.com
- Docs: https://supabase.com/docs
- Status: https://status.supabase.com

### **FlipCars:**
- Documentação: `/home/user/webapp/docs/`
- Ferramenta teste: `test_dashboard_auth.html`

---

**Criado em:** 11/11/2025  
**Status:** Planejamento completo - pronto para execução  
**Tempo estimado:** 30-60 minutos  
**Economia:** $84/ano
