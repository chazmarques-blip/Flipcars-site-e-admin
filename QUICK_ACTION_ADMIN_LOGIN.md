# ⚡ AÇÃO IMEDIATA - Admin Login FlipCars

## 🔴 PROBLEMA IDENTIFICADO

**Erro**: 401 Unauthorized no admin dashboard  
**Causa**: Usuário admin não existe no banco de dados  
**Status**: ✅ Solução pronta para executar

---

## ✅ SOLUÇÃO EM 3 PASSOS

### 📍 PASSO 1: Acesse o Supabase

```
🔗 URL: https://supabase.com/dashboard
```

1. Faça login no Supabase
2. Selecione o projeto FlipCars
3. Clique em **SQL Editor** no menu lateral
4. Clique em **New Query**

---

### 📍 PASSO 2: Execute o SQL

**Copie TODO o conteúdo deste arquivo:**
```
📄 /home/user/webapp/CREATE_ADMIN_USER.sql
```

**Cole no SQL Editor e clique em "RUN"**

Você verá 4 queries sendo executadas:
1. ✅ Verificar roles existentes
2. ✅ Criar usuário admin
3. ✅ Associar role admin ao usuário
4. ✅ Verificar usuário criado

---

### 📍 PASSO 3: Faça Login no Admin

```
🔗 URL: https://admin.flipcars.us
📧 Email: admin@flipcars.us
🔑 Password: Password123!
```

---

## 🎯 CONTEÚDO DO SQL (Para Copy/Paste)

```sql
-- Verificar se roles existem
SELECT id, name FROM roles ORDER BY name;

-- Criar usuário admin
INSERT INTO "user" (
    name, email, password, phone, status, language, 
    "emailVerified", "createdAt", "updatedAt"
)
VALUES (
    'Admin FlipCars',
    'admin@flipcars.us',
    '$2b$10$FhRk/vs5ciAnQZYa.IVIueoTJkUzdCTke6FwNa2Rqm.GzwS.VqmGO',
    '+1-555-1234',
    'active',
    'en',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (email) DO NOTHING
RETURNING id, email;

-- Associar role ADMIN
INSERT INTO user_roles ("userId", "roleId")
SELECT u.id, r.id
FROM "user" u, roles r
WHERE u.email = 'admin@flipcars.us' AND r.name = 'admin'
ON CONFLICT DO NOTHING;

-- Verificar usuário criado
SELECT u.id, u.name, u.email, u.status, r.name as role
FROM "user" u
LEFT JOIN user_roles ur ON u.id = ur."userId"
LEFT JOIN roles r ON ur."roleId" = r.id
WHERE u.email = 'admin@flipcars.us';
```

---

## ✅ VERIFICAÇÃO

Após executar o SQL, você deve ver:
```
✅ 1 row returned (usuário criado)
✅ id, name, email, status, role exibidos
```

---

## 🚀 PRÓXIMO PASSO

Após login bem-sucedido:
```
👉 Importar keywords do Google Ads
📄 Arquivo: GOOGLE_ADS_KEYWORDS_IMPORT.csv
```

---

## 📞 SE TIVER PROBLEMA

**Erro: "role 'admin' not found"**
```sql
-- Execute primeiro:
INSERT INTO roles (name, description, "createdAt", "updatedAt")
VALUES ('admin', 'Administrator role', NOW(), NOW())
ON CONFLICT DO NOTHING;
```

**Erro: "user already exists"**
```
✅ Usuário já foi criado! 
👉 Tente fazer login com as credenciais acima
```

---

**TEMPO ESTIMADO**: 2 minutos  
**ARQUIVOS CRIADOS**: CREATE_ADMIN_USER.sql, ADMIN_LOGIN_GUIDE.md  
**GIT STATUS**: ✅ Committed e pushed para GitHub
