# 🔐 CRIAR USUÁRIO ADMIN NO SUPABASE

## 🎯 PROBLEMA IDENTIFICADO

✅ **Backend está rodando:** https://upbeat-dedication-production.up.railway.app  
✅ **Health check funcionando:** `/api/health` retorna OK  
✅ **Banco conectado:** Login retorna "Invalid credentials" (não erro 500)  
❌ **Usuário admin NÃO existe:** Seeds não rodaram (desabilitados em produção)

---

## 🚀 SOLUÇÃO: EXECUTAR SQL NO SUPABASE

### Passo 1: Acessar Supabase SQL Editor

1. **Acesse:** https://supabase.com/dashboard/project/kvjvieekkudeqtnunqlb
2. **Clique em:** SQL Editor (ícone na barra lateral esquerda)
3. **Clique em:** "+ New query"

### Passo 2: Executar o SQL

**Copie e cole este SQL completo:**

\`\`\`sql
-- ============================================
-- CRIAR USUÁRIO ADMIN NO FLIPCARS
-- ============================================

-- 1. Criar role ADMIN (se não existir)
INSERT INTO roles (name, description, created_at, updated_at)
VALUES ('admin', 'Administrator with full system access', NOW(), NOW())
ON CONFLICT (name) DO UPDATE SET updated_at = NOW();

-- 2. Criar usuário ADMIN
-- Email: admin@flipcars.com
-- Senha: Admin123!
INSERT INTO users (
  email,
  password,
  first_name,
  last_name,
  phone,
  is_active,
  email_verified,
  created_at,
  updated_at
)
VALUES (
  'admin@flipcars.com',
  '$2b$10$sOp.Px5gY8th1v9Ngp33M.9Sm7A36U2sGsraUyoZL7uSFeQCgsBOa',
  'Admin',
  'User',
  '+1-555-0100',
  true,
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  updated_at = NOW();

-- 3. Associar usuário ao role ADMIN
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'admin@flipcars.com' AND r.name = 'admin'
ON CONFLICT DO NOTHING;

-- 4. Verificar se foi criado corretamente
SELECT 
  u.id,
  u.email,
  u.first_name,
  u.last_name,
  u.is_active,
  r.name as role
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'admin@flipcars.com';
\`\`\`

### Passo 3: Executar

1. **Clique em:** RUN (botão verde no canto inferior direito)
2. **Aguarde:** ~2 segundos
3. **Verifique resultado:**

**Resultado esperado:**
\`\`\`
| id | email | first_name | last_name | is_active | role |
|----|-------|------------|-----------|-----------|------|
| 1  | admin@flipcars.com | Admin | User | true | admin |
\`\`\`

---

## ✅ VERIFICAÇÃO

### Teste 1: Login via cURL

\`\`\`bash
curl -X POST https://upbeat-dedication-production.up.railway.app/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"admin@flipcars.com","password":"Admin123!"}'
\`\`\`

**Resultado esperado:**
\`\`\`json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@flipcars.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }
}
\`\`\`

### Teste 2: Login via Frontend

1. **Acesse:** https://admin.flipcars.us/auth/login
2. **Email:** admin@flipcars.com
3. **Senha:** Admin123!
4. **Clique em:** Sign In
5. **Resultado:** ✅ Redirecionado para dashboard!

---

## 🔍 SE DER ERRO

### Erro: "relation 'roles' does not exist"

**Causa:** Migrations não rodaram (tabelas não existem)

**Solução:** Rodar migrations primeiro:

1. Acesse: https://github.com/chazmarques-blip/Flipcars-site-e-admin/tree/main/backend/src/database/migrations
2. Copie e execute os arquivos .ts convertidos para SQL
3. Ou habilite migrations no main.ts

### Erro: "duplicate key value violates unique constraint"

**Causa:** Usuário já existe

**Solução:** Isso é BOM! Significa que já foi criado. Apenas teste o login!

### Erro: "column 'phone' does not exist"

**Causa:** Schema diferente

**Solução:** Remova a linha do phone do INSERT:

\`\`\`sql
INSERT INTO users (
  email,
  password,
  first_name,
  last_name,
  -- phone,  ← REMOVER ESTA LINHA
  is_active,
  ...
)
VALUES (
  'admin@flipcars.com',
  '$2b$10$sOp.Px5gY8th1v9Ngp33M.9Sm7A36U2sGsraUyoZL7uSFeQCgsBOa',
  'Admin',
  'User',
  -- '+1-555-0100',  ← REMOVER ESTA LINHA
  true,
  ...
)
\`\`\`

---

## 📊 CREDENCIAIS CRIADAS

| Campo | Valor |
|-------|-------|
| **Email** | admin@flipcars.com |
| **Senha** | Admin123! |
| **Role** | admin |
| **Ativo** | true |
| **Email Verificado** | true |

---

## 🎯 PRÓXIMOS PASSOS APÓS CRIAR ADMIN

1. ✅ **Fazer login no admin panel**
2. ✅ **Verificar se todas as funcionalidades funcionam**
3. ✅ **Criar outros usuários se necessário**
4. ✅ **Testar CRUD de leads, customers, etc**

---

## 📝 ARQUIVO SQL

O SQL também está salvo em:
\`/home/user/webapp/CREATE_ADMIN_USER.sql\`

---

## 💡 ALTERNATIVA: HABILITAR SEEDS NO STARTUP

Se preferir que seeds rodem automaticamente no futuro:

**Editar:** \`backend/src/main.ts\` (linha 91-104)

**Descomentar:**
\`\`\`typescript
if (process.env.NODE_ENV === 'production') {
  const migrationsSucceeded = await runMigrations();
  if (migrationsSucceeded) {
    await runDatabaseSeeds();
  }
}
\`\`\`

**Mas CUIDADO:** Isso aumenta o tempo de startup e pode causar problemas se seeds rodarem múltiplas vezes!

---

## 🎉 APÓS EXECUTAR O SQL

**ME AVISE E EU TESTO O LOGIN PARA CONFIRMAR QUE FUNCIONOU!** ✅
