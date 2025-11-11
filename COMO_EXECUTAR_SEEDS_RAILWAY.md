# 🌱 Como Executar Seeds no Railway

**Objetivo**: Popular o banco de dados PostgreSQL com dados iniciais (usuários, roles, etc.)

**Tempo estimado**: 5-10 minutos

---

## 🚀 MÉTODO 1: Via Railway Dashboard (MAIS FÁCIL)

### **Passo a Passo com Screenshots:**

#### **1. Acessar Railway**
```
URL: https://railway.app
Login com sua conta
```

#### **2. Selecionar Projeto**
```
Buscar: "FlipCars" ou "Backend"
Clicar no projeto
```

#### **3. Navegar até Backend Service**
```
Na lista de Services:
→ Clicar em "Backend" (ou nome do serviço Node.js)
```

#### **4. Abrir Settings**
```
No menu lateral:
→ Clicar em "Settings"
→ Rolar para baixo
```

#### **5. Encontrar "Deploy" ou "Commands" Section**
```
Procurar por uma das opções:
- "One-off Commands"
- "Deploy Commands"  
- "Run Command"
- "Console" / "Shell"
```

#### **6. Executar Seed Command**

**Opção A: Se houver campo "Run Command"**
```bash
npm run seed
```

**Opção B: Se houver botão "Open Shell" ou "Console"**
```bash
# 1. Abrir terminal/console
# 2. Digitar:
npm run seed

# 3. Pressionar Enter
# 4. Aguardar output
```

#### **7. Verificar Logs**
```
Você deve ver algo como:

🌱 Starting database seeding...
   ✅ Created 10 roles
   ✅ Created 7 users
   📧 All users have password: Password123!
   ✅ Created 15 knowledge base entries
   ✅ Created 12 leads
   ✅ Created 5 CMS pages
   ✅ Created 8 gallery items
✅ Database seeding completed successfully!
```

✅ **SUCESSO!** Banco populado com dados iniciais.

---

## 💻 MÉTODO 2: Via Railway CLI (Alternativo)

### **Pré-requisitos:**
- Node.js instalado
- Terminal/Command Prompt

### **Passos:**

#### **1. Instalar Railway CLI**
```bash
npm install -g @railway/cli
```

#### **2. Login no Railway**
```bash
railway login
```
- Abrirá navegador para autenticação
- Fazer login com sua conta Railway
- Voltar ao terminal

#### **3. Conectar ao Projeto**
```bash
# Navegar até a pasta do projeto
cd /home/user/webapp/backend

# Linkar ao projeto Railway
railway link
```
- Selecionar projeto "FlipCars Backend"
- Confirmar

#### **4. Executar Seeds**
```bash
railway run npm run seed
```

#### **5. Verificar Output**
```
Aguardar mensagens:
   ✅ Created 10 roles
   ✅ Created 7 users
   ...
```

✅ **CONCLUÍDO!**

---

## 🗄️ MÉTODO 3: Via PostgreSQL Direto (Avançado)

### **Se você precisa criar usuário manualmente:**

#### **1. Obter Credenciais do Banco**
```
Railway Dashboard:
→ Backend Service
→ Variables
→ Copiar DATABASE_URL
```

**Formato:**
```
postgresql://user:password@host:port/database
```

#### **2. Conectar ao Banco**

**Opção A: Via psql (linha de comando)**
```bash
psql [DATABASE_URL]
```

**Opção B: Via pgAdmin / DBeaver / TablePlus**
```
Host: [host do DATABASE_URL]
Port: [port do DATABASE_URL]
Database: [database do DATABASE_URL]
Username: [user do DATABASE_URL]
Password: [password do DATABASE_URL]
SSL Mode: Required
```

#### **3. Executar SQL para Criar Admin**

```sql
-- 1. Criar role admin (se não existir)
INSERT INTO role (id, name, description, "createdAt", "updatedAt")
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'admin',
  'Administrator with full access',
  NOW(),
  NOW()
) ON CONFLICT (name) DO NOTHING;

-- 2. Criar usuário admin
-- NOTA: Este hash é para senha "Password123!"
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

-- 3. Associar usuário à role (substituir [USER_ID] pelo ID retornado acima)
INSERT INTO user_roles_role ("userId", "roleId")
VALUES (
  '[USER_ID_AQUI]', -- Cole o UUID retornado
  '00000000-0000-0000-0000-000000000002'
);
```

#### **4. Verificar Criação**
```sql
SELECT * FROM "user" WHERE email = 'admin@flipcars.us';
```

✅ **Usuário criado!**

---

## ✅ VALIDAÇÃO

### **Testar se Seeds Funcionaram:**

#### **1. Via Curl (Linha de Comando)**
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

---

#### **2. Via Ferramenta de Teste HTML**

```bash
# 1. Abrir arquivo
open /home/user/webapp/test_dashboard_auth.html

# 2. Na interface:
- Email: admin@flipcars.us
- Password: Password123!
- Clicar: "Test Login"

# 3. Resultado esperado:
✅ LOGIN SUCCESSFUL!
Access Token: ey...
Refresh Token: ey...
```

---

#### **3. Via Admin Dashboard**

```
1. Acessar: [URL do admin Vercel]
2. Email: admin@flipcars.us
3. Password: Password123!
4. Clicar "Login"

Resultado esperado:
✅ Login bem-sucedido
✅ Dashboard carrega com dados
✅ Cards mostram valores reais
```

---

## 🐛 TROUBLESHOOTING

### **Problema 1: "Command not found: npm"**

**Causa**: Railway pode não ter npm no PATH do comando one-off

**Solução**:
```bash
# Em vez de:
npm run seed

# Tente:
node_modules/.bin/ts-node src/database/seeds/run-seeds.ts

# Ou:
npx ts-node src/database/seeds/run-seeds.ts
```

---

### **Problema 2: "Cannot connect to database"**

**Causa**: Variável DATABASE_URL não está configurada

**Solução**:
1. Railway Dashboard → Backend Service
2. Variables → Adicionar/verificar:
   ```
   DATABASE_URL=postgresql://...
   ```
3. Redeploy

---

### **Problema 3: Seeds já foram executados**

**Output:**
```
⏭️  Users already seeded, skipping...
⏭️  Roles already seeded, skipping...
```

**Causa**: Seeds tem proteção contra execução dupla

**Solução**: Isso é NORMAL! Significa que dados já existem.

**Se quiser re-seed (CUIDADO - APAGA DADOS):**
```sql
-- Conectar ao PostgreSQL
-- Executar:
TRUNCATE TABLE "user" CASCADE;
TRUNCATE TABLE "role" CASCADE;
-- Depois rodar: npm run seed
```

---

### **Problema 4: "Table does not exist"**

**Causa**: Migrations não foram executadas

**Solução**:
```bash
# Primeiro rodar migrations:
railway run npm run migration:run

# Depois rodar seeds:
railway run npm run seed
```

---

## 📊 O QUE OS SEEDS CRIAM?

### **Usuários Criados:**
```
1. superadmin@flipcars.us (Super Admin)
2. admin@flipcars.us (Admin)
3. agent@flipcars.us (Agent)
4. maria.agent@flipcars.us (Agent - Español)
5. joao.agent@flipcars.us (Agent - Português)
6. customer@flipcars.us (Customer)
7. readonly@flipcars.us (Read-only)

TODOS com senha: Password123!
```

### **Roles Criadas:**
```
- super_admin (acesso total)
- admin (administração)
- agent (agente de vendas)
- customer (cliente)
- read_only (somente leitura)
```

### **Outros Dados:**
```
- Knowledge Base (15 entradas)
- Leads de exemplo (12 leads)
- Páginas CMS (5 páginas)
- Galeria (8 imagens)
```

---

## ⚠️ AVISOS IMPORTANTES

### **Segurança:**

```
⚠️ NUNCA usar "Password123!" em produção!

Após popular o banco:
1. Fazer login como admin
2. Ir para Settings → Profile
3. Mudar senha para uma forte
```

### **Backup:**

```
✅ Recomendação: Fazer backup do banco após seeds

Railway Dashboard:
→ PostgreSQL Service
→ Backups
→ Create Backup
```

---

## 🔗 LINKS ÚTEIS

| Recurso | URL |
|---------|-----|
| **Railway Dashboard** | https://railway.app |
| **Railway Docs - Run Command** | https://docs.railway.app/deploy/one-off-commands |
| **Railway CLI Docs** | https://docs.railway.app/develop/cli |
| **Seed Script** | `/backend/src/database/seeds/run-seeds.ts` |
| **Test Tool** | `/test_dashboard_auth.html` |

---

## ✅ CHECKLIST FINAL

Após executar seeds, verificar:

- [ ] Login funciona com: admin@flipcars.us / Password123!
- [ ] Backend retorna token JWT válido
- [ ] GET /api/leads retorna dados (ou array vazio)
- [ ] Dashboard admin carrega sem mostrar 0
- [ ] Ferramenta de teste (test_dashboard_auth.html) mostra sucesso
- [ ] Tokens aparecem no localStorage do navegador

---

**Data de criação**: 11/11/2025  
**Última atualização**: 11/11/2025  
**Status**: ✅ GUIA COMPLETO - Pronto para uso
