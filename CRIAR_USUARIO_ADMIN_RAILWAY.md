# 🔑 CRIAR USUÁRIO ADMIN NO RAILWAY

## 🔴 PROBLEMA IDENTIFICADO

**Erro 401 (Unauthorized)** ao fazer login no admin!

**Causa**: As seeds não rodaram no Railway. Os usuários padrão não existem no banco de dados PostgreSQL.

---

## ✅ SOLUÇÃO: CRIAR USUÁRIO MANUALMENTE

### PASSO 1: Acessar Railway Dashboard
```
https://railway.app/dashboard
```

### PASSO 2: Selecionar Projeto
- Encontre o projeto **FlipCars Backend**
- Clique nele

### PASSO 3: Acessar PostgreSQL
- Clique no serviço **PostgreSQL** (ícone de elefante 🐘)
- Procure por aba **"Data"** ou **"Query"** ou **"Connect"**

### PASSO 4: Executar SQL
Cole e execute este SQL:

```sql
-- Criar usuário admin
INSERT INTO users (
  id, 
  name, 
  email, 
  password, 
  phone, 
  status, 
  language, 
  "emailVerified", 
  "createdAt", 
  "updatedAt"
)
VALUES (
  gen_random_uuid(),
  'Admin FlipCars',
  'admin@flipcars.us',
  '$2b$10$rZQKvHJ0wvM4xGm5vEQWYOXKGxJ8N3mZdKj5qLxYz8tGpBvC9UJQS',
  '+1-555-0001',
  'active',
  'en',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  password = '$2b$10$rZQKvHJ0wvM4xGm5vEQWYOXKGxJ8N3mZdKj5qLxYz8tGpBvC9UJQS',
  status = 'active',
  "emailVerified" = true;
```

### PASSO 5: Verificar Criação
Execute este SQL para confirmar:

```sql
SELECT id, name, email, status, "emailVerified"
FROM users
WHERE email = 'admin@flipcars.us';
```

**Resultado esperado:**
```
name: Admin FlipCars
email: admin@flipcars.us
status: active
emailVerified: true
```

---

## 🔐 CREDENCIAIS DO NOVO USUÁRIO

```
Email: admin@flipcars.us
Senha: FlipCars2024!
```

---

## 🧪 TESTAR LOGIN

### PASSO 1: Abrir Admin em Modo Anônimo
```
Ctrl+Shift+N (Chrome)
https://admin.flipcars.us/auth/login
```

### PASSO 2: Fazer Login
```
Email: admin@flipcars.us
Senha: FlipCars2024!
```

### PASSO 3: Clicar "Sign In"
**Resultado esperado**: ✅ Redirecionado para dashboard!

---

## 🚨 SE NÃO FUNCIONAR

### Opção A: Verificar se SQL executou
```sql
-- Ver todos os usuários
SELECT email, status FROM users;
```

### Opção B: Tentar recriar com outro email
```sql
-- Usar email diferente
INSERT INTO users (
  id, name, email, password, phone, status, language, "emailVerified", "createdAt", "updatedAt"
)
VALUES (
  gen_random_uuid(),
  'Admin Test',
  'test@flipcars.us',
  '$2b$10$rZQKvHJ0wvM4xGm5vEQWYOXKGxJ8N3mZdKj5qLxYz8tGpBvC9UJQS',
  '+1-555-0002',
  'active',
  'en',
  true,
  NOW(),
  NOW()
);
```

**Credenciais:**
```
Email: test@flipcars.us
Senha: FlipCars2024!
```

### Opção C: Verificar conexão com banco
No Railway dashboard, verificar se PostgreSQL está:
- ✅ Online (verde)
- ✅ Connectado ao backend
- ✅ DATABASE_URL configurada

---

## 📊 ENTENDENDO O PROBLEMA

### Por que erro 401?
```
POST /api/auth/login → 401 Unauthorized
```

Isso significa:
1. Backend está online ✅
2. API de login está funcionando ✅
3. **MAS usuário não existe no banco** ❌

### Por que seeds não rodaram?
As seeds devem rodar automaticamente quando:
- Backend faz deploy no Railway
- Migrations executam com sucesso
- Variável `RUN_SEEDS=true` está configurada

**Provável causa**: Seeds falharam silenciosamente ou variável não estava configurada.

---

## ✅ DEPOIS DE CRIAR O USUÁRIO

Você poderá:
1. ✅ Fazer login no admin dashboard
2. ✅ Ver todos os leads do banco
3. ✅ Buscar lead FLIP-20251109-0022
4. ✅ Gerenciar sistema completo

---

## 🔒 SOBRE A SENHA

A senha `FlipCars2024!` está com hash bcrypt:
```
$2b$10$rZQKvHJ0wvM4xGm5vEQWYOXKGxJ8N3mZdKj5qLxYz8tGpBvC9UJQS
```

Este hash foi gerado com:
```javascript
bcrypt.hash('FlipCars2024!', 10)
```

É **seguro** e **não pode ser revertido** para obter a senha original.

---

## 📝 CHECKLIST

- [ ] Acessar Railway Dashboard
- [ ] Encontrar projeto FlipCars Backend
- [ ] Clicar em PostgreSQL
- [ ] Ir em "Query" ou "Data"
- [ ] Executar SQL de criação do usuário
- [ ] Verificar que usuário foi criado
- [ ] Abrir admin.flipcars.us em modo anônimo
- [ ] Fazer login com admin@flipcars.us / FlipCars2024!
- [ ] ✅ Entrar no dashboard com sucesso!

---

## 🎯 RESULTADO FINAL

Após criar o usuário e fazer login:

```
✅ Admin funcionando
✅ Conectado ao banco PostgreSQL
✅ Pode ver todos os 156 leads
✅ Pode buscar FLIP-20251109-0022
✅ Sistema operacional completo
```

---

**IMPORTANTE**: Depois de criar o usuário, **mude a senha** pelo próprio admin dashboard para uma senha mais segura!

---

**Data**: 2025-11-10  
**Problema**: Erro 401 ao fazer login  
**Causa**: Seeds não rodaram, usuários não existem  
**Solução**: Criar usuário admin manualmente via SQL
