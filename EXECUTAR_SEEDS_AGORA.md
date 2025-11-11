# 🚀 EXECUTAR SEEDS NO RAILWAY - GUIA RÁPIDO

**Tempo estimado:** 5 minutos  
**O que vai fazer:** Criar usuários no banco de dados Railway

---

## 📋 MÉTODO 1: Railway Dashboard (MAIS FÁCIL)

### **Passo 1: Acessar Railway** 
```
1. Abra seu navegador
2. Vá para: https://railway.app
3. Faça login na sua conta
```

### **Passo 2: Encontrar o Projeto**
```
1. Na tela inicial, procure o projeto "FlipCars" ou "Backend"
2. Clique no projeto
3. Você verá uma lista de serviços
```

### **Passo 3: Abrir o Backend Service**
```
1. Clique no serviço "Backend" (ou o nome do seu serviço Node.js)
2. Você verá informações do deploy
```

### **Passo 4: Executar Seeds**

**Opção A: Via "Deploy" → "Custom Start Command"**
```
1. Clique na aba "Settings"
2. Procure por "Deploy" ou "Custom Command"
3. No campo de comando, digite: npm run seed
4. Clique "Deploy" ou "Run"
```

**Opção B: Via "Console" / "Shell"** (SE DISPONÍVEL)
```
1. Procure por "Console", "Shell" ou "Terminal"
2. Se encontrar, clique
3. Um terminal vai abrir
4. Digite: npm run seed
5. Pressione Enter
```

**Opção C: Via Redeploy com modificação temporária**
```
1. Vá para "Variables" ou "Environment Variables"
2. Adicione temporariamente uma variável:
   Nome: RUN_SEEDS
   Valor: true
3. Redeploy
4. Após deploy, remover a variável
```

### **Passo 5: Verificar Logs**
```
1. Vá para "Deployments" ou "Logs"
2. Abra os logs do último deploy
3. Procure por:
   ✅ "Starting database seeding..."
   ✅ "Created 10 roles"
   ✅ "Created 7 users"
   ✅ "All users have password: Password123!"
   ✅ "Database seeding completed"
```

✅ **Se ver essas mensagens, seeds executados com sucesso!**

---

## 📋 MÉTODO 2: Railway CLI (Se tiver acesso a terminal local)

### **Passo 1: Instalar Railway CLI**
```bash
# No seu computador local (não sandbox):
npm install -g @railway/cli

# Ou via script:
curl -fsSL https://railway.app/install.sh | sh
```

### **Passo 2: Fazer Login**
```bash
railway login
# Abrirá navegador para autenticação
```

### **Passo 3: Conectar ao Projeto**
```bash
cd /caminho/para/Flipcars-site-e-admin/backend
railway link
# Selecione o projeto FlipCars
```

### **Passo 4: Executar Seeds**
```bash
railway run npm run seed
```

### **Passo 5: Ver Logs**
```
Você verá output direto no terminal:
   ✅ Created 10 roles
   ✅ Created 7 users
   📧 All users have password: Password123!
```

---

## 📋 MÉTODO 3: SQL Manual (Se Railway Dashboard não tiver opção de comando)

### **Passo 1: Conectar ao PostgreSQL**
```
1. Railway Dashboard
2. PostgreSQL Service
3. Procure por "Connect" ou "Connection"
4. Copie a connection string ou abra em cliente SQL
```

### **Passo 2: Executar SQL para Criar Admin**

Abra um cliente SQL (pgAdmin, DBeaver, ou Railway SQL Editor) e execute:

```sql
-- 1. Criar role admin (se não existir)
INSERT INTO role (id, name, description, "createdAt", "updatedAt")
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'admin',
  'Administrator with full access except role management',
  NOW(),
  NOW()
) ON CONFLICT (name) DO NOTHING;

-- 2. Criar usuário admin
-- NOTA: Este hash bcrypt é para senha "Password123!"
INSERT INTO "user" (
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
) VALUES (
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
RETURNING id;

-- 3. Associar usuário à role admin
-- Substitua [USER_ID] pelo UUID retornado acima
INSERT INTO user_roles_role ("userId", "roleId")
VALUES (
  '[COLE_UUID_AQUI]',  -- UUID retornado do INSERT anterior
  '00000000-0000-0000-0000-000000000002'
);

-- 4. Verificar criação
SELECT 
  u.id,
  u.name,
  u.email,
  u.status,
  r.name as role_name
FROM "user" u
LEFT JOIN user_roles_role urr ON u.id = urr."userId"
LEFT JOIN role r ON urr."roleId" = r.id
WHERE u.email = 'admin@flipcars.us';
```

---

## ✅ VALIDAÇÃO

### **Teste 1: Via Ferramenta HTML**

```bash
# 1. Abrir arquivo no navegador
# Localização: /home/user/webapp/test_dashboard_auth.html

# 2. Preencher:
Email: admin@flipcars.us
Password: Password123!

# 3. Clicar: "Test Login"

# 4. Resultado esperado:
✅ LOGIN SUCCESSFUL!
Access Token: eyJhbGci...
Refresh Token: eyJhbGci...
```

### **Teste 2: Via curl**

```bash
curl -X POST https://upbeat-dedication-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@flipcars.us","password":"Password123!"}'
```

**Resposta esperada (SUCESSO):**
```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci...",
  "user": {
    "id": "...",
    "name": "Admin User",
    "email": "admin@flipcars.us",
    "roles": [...]
  }
}
```

**Resposta de ERRO (seeds não rodaram):**
```json
{
  "message": "Invalid credentials",
  "statusCode": 401
}
```

### **Teste 3: Acessar Dashboard Admin**

```
1. Abrir: admin.flipcars.us (ou sua URL Vercel)
2. Email: admin@flipcars.us
3. Senha: Password123!
4. Clicar: Login

Resultado esperado:
✅ Login bem-sucedido
✅ Dashboard carrega
✅ Cards mostram valores (não mais 0)
```

---

## 🐛 TROUBLESHOOTING

### **Problema 1: Não encontro opção de executar comando no Railway**

**Solução:**
```
1. Use o Método 3 (SQL Manual)
2. Ou use Railway CLI localmente (Método 2)
3. Ou me informe que não consegue, podemos tentar outra abordagem
```

### **Problema 2: Seeds dizem "already seeded, skipping"**

**Causa:** Seeds já foram executados antes

**Solução:**
```
✅ Isso é BOM! Significa que usuários já existem!
✅ Teste o login diretamente
```

### **Problema 3: Erro "Cannot connect to database"**

**Causa:** Variável DATABASE_URL não está configurada

**Solução:**
```
1. Railway Dashboard → Backend Service
2. Variables → Verificar se DATABASE_URL existe
3. Se não existe, adicionar (Railway PostgreSQL auto-fornece)
4. Redeploy
```

### **Problema 4: Login continua retornando 401 após seeds**

**Possíveis causas:**

**A) Seeds não criaram usuário:**
```sql
-- Verificar se usuário existe:
SELECT * FROM "user" WHERE email = 'admin@flipcars.us';
-- Se retornar vazio, usuário não foi criado
```

**B) Senha diferente:**
```
-- Seeds usam: Password123!
-- Certifique-se de usar essa senha exata (case-sensitive)
```

**C) Role não associada:**
```sql
-- Verificar roles:
SELECT u.email, r.name 
FROM "user" u
LEFT JOIN user_roles_role urr ON u.id = urr."userId"
LEFT JOIN role r ON urr."roleId" = r.id
WHERE u.email = 'admin@flipcars.us';
```

---

## 📊 O QUE OS SEEDS CRIAM

### **Usuários:**
```
1. superadmin@flipcars.us - Super Admin
2. admin@flipcars.us - Admin (USE ESTE!)
3. agent@flipcars.us - Agent
4. maria.agent@flipcars.us - Agent (ES)
5. joao.agent@flipcars.us - Agent (PT)
6. customer@flipcars.us - Customer
7. readonly@flipcars.us - Read Only

TODOS com senha: Password123!
```

### **Roles:**
```
- super_admin
- admin
- agent
- customer
- read_only
```

### **Permissões:**
```
Cada role tem permissões específicas para:
- Leads (create, read, update, delete)
- Users (manage, view)
- Reports (view, export)
- Settings (manage)
```

---

## 🎯 APÓS SEEDS EXECUTADOS

### **Ações Imediatas:**

1. **Testar Login:**
   - Abrir `test_dashboard_auth.html`
   - Login: admin@flipcars.us / Password123!
   - Verificar tokens

2. **Acessar Dashboard:**
   - URL do admin panel
   - Login com credenciais
   - Dashboard deve mostrar dados reais

3. **Mudar Senha:** (IMPORTANTE!)
   ```
   ⚠️ "Password123!" é senha de TESTE!
   
   Após login:
   1. Ir para Settings → Profile
   2. Mudar senha para algo seguro
   ```

### **Próximos Passos:**

- [ ] Seeds executados com sucesso
- [ ] Login funcionando
- [ ] Dashboard mostrando dados
- [ ] Senha admin alterada
- [ ] Criar leads teste
- [ ] Testar formulário público
- [ ] (Opcional) Migrar para Supabase

---

## 💡 DICA PRO

Se você tiver dificuldade em executar seeds via Railway Dashboard, a forma **MAIS GARANTIDA** é:

```
1. Conectar ao PostgreSQL via cliente SQL
2. Executar SQL manual (Método 3)
3. Criar apenas usuário admin
4. Testar login
5. Resto dos dados pode criar depois via admin panel
```

---

## 📞 PRECISA DE AJUDA?

Se não conseguir executar pelos métodos acima:

1. **Me informe:**
   - Qual método tentou?
   - Qual erro apareceu?
   - Consegue acessar Railway Dashboard?
   - Tem acesso ao SQL do PostgreSQL?

2. **Posso ajudar a:**
   - Criar SQL completo de seeds
   - Gerar hash bcrypt para senha customizada
   - Troubleshoot problemas específicos

---

**Criado em:** 11/11/2025  
**Tempo estimado:** 5 minutos  
**Status:** Pronto para executar  
**Próximo passo:** Escolha um dos 3 métodos acima
