# 🚀 MIGRAR PARA SUPABASE AGORA - Guia Simples

**Você está certo!** Vamos usar o Supabase que já está conectado para fotos.

**Tempo:** 15-20 minutos  
**Vantagem:** SQL Editor visual - copiar e colar!

---

## 📋 PASSO 1: Acessar Supabase (2 min)

### **1.1. Ir para Supabase**
```
https://supabase.com
Fazer login
```

### **1.2. Abrir Projeto FlipCars**
```
Se já tiver projeto:
- Clique no projeto existente

Se NÃO tiver projeto:
- Clique "New Project"
- Name: FlipCars
- Database Password: [escolha senha forte]
- Region: East US
- Aguarde 2 minutos (provisioning)
```

---

## 📋 PASSO 2: Obter Credenciais (1 min)

### **2.1. Ir para Settings → API**
```
1. Menu lateral → Settings (ícone de engrenagem)
2. Clique em "API"
3. Copie:
   ✅ Project URL: https://xxxxx.supabase.co
   ✅ service_role key (não o anon key!)
```

### **2.2. Ir para Settings → Database**
```
1. Menu lateral → Settings
2. Clique em "Database"
3. Na seção "Connection string"
4. Selecione: "URI" (não "Connection pooling")
5. Copie a connection string:
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

**IMPORTANTE:** Substitua `[YOUR-PASSWORD]` pela senha do passo 1.2

---

## 📋 PASSO 3: Criar Estrutura no Supabase (5 min)

### **3.1. Abrir SQL Editor**
```
1. Menu lateral → SQL Editor
2. Clique "New query"
```

### **3.2. Executar Migrations**

Vou te dar o SQL completo para copiar e colar. Execute em ordem:

#### **Query 1: Criar Tabelas Base**
```sql
-- EXECUTAR PRIMEIRO: Criar tabelas básicas
CREATE TABLE IF NOT EXISTS "role" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(50) UNIQUE NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "user" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "phone" VARCHAR(50),
  "status" VARCHAR(50) DEFAULT 'active',
  "language" VARCHAR(10) DEFAULT 'en',
  "emailVerified" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "user_roles_role" (
  "userId" UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  "roleId" UUID NOT NULL REFERENCES "role"(id) ON DELETE CASCADE,
  PRIMARY KEY ("userId", "roleId")
);

CREATE TABLE IF NOT EXISTS "lead" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "referenceNumber" VARCHAR(50) UNIQUE NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "phone" VARCHAR(50) NOT NULL,
  "status" VARCHAR(50) DEFAULT 'new',
  "priority" VARCHAR(50) DEFAULT 'medium',
  "source" VARCHAR(50) DEFAULT 'website',
  "serviceType" VARCHAR(50),
  "vehicleYear" INTEGER,
  "vehicleMake" VARCHAR(100),
  "vehicleModel" VARCHAR(100),
  "vehicleVin" VARCHAR(50),
  "hasInsurance" BOOLEAN DEFAULT false,
  "insuranceCompany" VARCHAR(255),
  "claimNumber" VARCHAR(100),
  "estimatedValue" DECIMAL(10,2),
  "damageDescription" TEXT,
  "notes" TEXT,
  "aiQualificationScore" INTEGER,
  "aiQualificationNotes" TEXT,
  "assignedToId" UUID REFERENCES "user"(id),
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);
```

**Clique "Run" ou "Execute"**

---

#### **Query 2: Criar Admin User**
```sql
-- EXECUTAR SEGUNDO: Criar admin com senha Password123!
DO $$
DECLARE
  admin_role_id UUID := '00000000-0000-0000-0000-000000000002';
  admin_user_id UUID;
BEGIN
  -- 1. Criar role admin
  INSERT INTO role (id, name, description, "createdAt", "updatedAt")
  VALUES (admin_role_id, 'admin', 'Administrator with full access', NOW(), NOW())
  ON CONFLICT (name) DO NOTHING;

  -- 2. Criar usuário admin
  -- Hash bcrypt para senha: Password123!
  INSERT INTO "user" (id, name, email, password, phone, status, language, "emailVerified", "createdAt", "updatedAt")
  VALUES (
    gen_random_uuid(),
    'Admin User',
    'admin@flipcars.us',
    '$2b$10$rqYQWJKTi0Y9R8NXHZxzOeV4xOKNKL0gEk3E7p0hMQBwFKYZqGNGO',
    '+1-555-0002',
    'active',
    'en',
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO admin_user_id;

  -- 3. Associar role
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO user_roles_role ("userId", "roleId")
    VALUES (admin_user_id, admin_role_id)
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE '✅ Admin criado: admin@flipcars.us / Password123!';
  ELSE
    RAISE NOTICE '⚠️ Admin já existe';
  END IF;
END $$;

-- 4. VERIFICAR (deve retornar 1 linha)
SELECT 
  u.email,
  u.name,
  u.status,
  r.name as role_name
FROM "user" u
LEFT JOIN user_roles_role urr ON u.id = urr."userId"
LEFT JOIN role r ON urr."roleId" = r.id
WHERE u.email = 'admin@flipcars.us';
```

**Clique "Run" ou "Execute"**

**Resultado esperado:**
```
✅ Admin criado: admin@flipcars.us / Password123!

E uma tabela mostrando:
email: admin@flipcars.us
name: Admin User
status: active
role_name: admin
```

---

## 📋 PASSO 4: Configurar Storage (2 min)

### **4.1. Abrir SQL Editor novamente**
```
New query
```

### **4.2. Executar Storage Setup**
```sql
-- Criar bucket para fotos de leads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lead-photos',
  'lead-photos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880;

-- Políticas de acesso público
CREATE POLICY "Public can upload lead photos"
ON storage.objects FOR INSERT TO public
WITH CHECK (bucket_id = 'lead-photos');

CREATE POLICY "Public can view lead photos"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'lead-photos');
```

**Clique "Run"**

---

## 📋 PASSO 5: Atualizar Railway (5 min)

### **5.1. Voltar ao Railway Dashboard**

### **5.2. Ir para upbeat-dedication → Variables**

### **5.3. Atualizar DATABASE_URL**
```
Encontre a variável: DATABASE_URL

Substitua o valor por:
postgresql://postgres:[SUA-SENHA]@db.xxxxx.supabase.co:5432/postgres

(Cole a connection string que você copiou no Passo 2.2)
```

### **5.4. Adicionar/Atualizar SUPABASE vars**
```
Se não existirem, adicione:

SUPABASE_URL
Valor: https://xxxxx.supabase.co

SUPABASE_SERVICE_ROLE_KEY
Valor: eyJhbGci... (a service_role key do Passo 2.1)
```

### **5.5. Redeploy**
```
1. Voltar para aba "Deployments"
2. Clicar "Redeploy" ou aguardar auto-deploy
3. Aguardar build concluir (~2 min)
```

---

## ✅ PASSO 6: TESTAR! (2 min)

### **6.1. Teste rápido via curl**
```bash
curl -X POST https://upbeat-dedication-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@flipcars.us","password":"Password123!"}'
```

**Resultado esperado:**
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": {
    "name": "Admin User",
    "email": "admin@flipcars.us"
  }
}
```

### **6.2. Ou use a ferramenta HTML**
```
1. Abrir: test_dashboard_auth.html
2. Email: admin@flipcars.us
3. Senha: Password123!
4. Clicar: Test Login
5. Resultado: ✅ LOGIN SUCCESSFUL
```

### **6.3. Testar Dashboard**
```
1. Acessar admin panel
2. Login: admin@flipcars.us / Password123!
3. Dashboard deve carregar com dados!
```

---

## 🎉 PRONTO!

Agora você tem:
- ✅ PostgreSQL no Supabase (banco completo)
- ✅ Storage no Supabase (fotos)
- ✅ Admin user criado
- ✅ Backend conectado ao Supabase
- ✅ SQL Editor fácil de usar
- ✅ Tudo em um lugar!

**Economia:** $84/ano (Railway → Supabase free tier)

---

## 📋 PRÓXIMOS PASSOS

### **Após funcionar:**
1. ✅ Mudar senha do admin (Password123! é teste)
2. ✅ Criar leads via admin panel
3. ✅ Testar upload de fotos
4. ✅ Desativar PostgreSQL no Railway (economizar $)

### **Opcional: Criar mais usuários**
```sql
-- Super Admin
INSERT INTO "user" (name, email, password, phone, status, language, "emailVerified")
VALUES (
  'Super Admin',
  'superadmin@flipcars.us',
  '$2b$10$rqYQWJKTi0Y9R8NXHZxzOeV4xOKNKL0gEk3E7p0hMQBwFKYZqGNGO',
  '+1-555-0001',
  'active',
  'en',
  true
);
```

---

## 🆘 TROUBLESHOOTING

### **Problema: "Relation does not exist"**
```
Causa: Tabela não foi criada
Solução: Executar Query 1 novamente
```

### **Problema: "Password authentication failed"**
```
Causa: Senha errada na connection string
Solução: Verificar senha do Supabase no Passo 2.2
```

### **Problema: Login retorna 401**
```
Causa: Backend ainda apontando para Railway
Solução: Verificar DATABASE_URL no Railway (Passo 5.3)
```

---

## 💡 DICA PRO

Salve essas credenciais em algum lugar seguro:
- Supabase URL
- Supabase service_role key
- Database connection string
- Admin password (mude depois!)

---

**Criado:** 11/11/2025  
**Tempo total:** ~15-20 minutos  
**Dificuldade:** Fácil (copiar e colar SQL)  
**Status:** Pronto para executar
