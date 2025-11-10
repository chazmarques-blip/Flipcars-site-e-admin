# 🔧 OPÇÕES PARA EXECUTAR SQL NO RAILWAY

**Situação**: Railway não tem editor SQL na interface web (apenas visualização de tabelas).

---

## ✅ OPÇÃO 1: RAILWAY CLI (MAIS FÁCIL) ⭐

### Passo a passo:

```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Fazer login
railway login

# 3. Linkar ao projeto
railway link

# 4. Conectar ao PostgreSQL
railway connect Postgres

# 5. Cole o SQL e execute:
```

```sql
-- Ver estado atual
SELECT u.email, ARRAY_AGG(r.name) as roles
FROM users u
LEFT JOIN user_roles ur ON ur."userId" = u.id
LEFT JOIN roles r ON r.id = ur."roleId"
WHERE u.email = 'admin@flipcars.com'
GROUP BY u.email;

-- Remover role incorreta
DELETE FROM user_roles WHERE "userId" IN (
  SELECT id FROM users WHERE email = 'admin@flipcars.com'
);

-- Adicionar role correta
INSERT INTO user_roles ("userId", "roleId")
SELECT u.id, r.id FROM users u
CROSS JOIN roles r
WHERE u.email = 'admin@flipcars.com' AND r.name = 'super_admin';

-- Verificar (deve mostrar {super_admin})
SELECT u.email, ARRAY_AGG(r.name) as roles
FROM users u
LEFT JOIN user_roles ur ON ur."userId" = u.id
LEFT JOIN roles r ON r.id = ur."roleId"
WHERE u.email = 'admin@flipcars.com'
GROUP BY u.email;
```

---

## ✅ OPÇÃO 2: PGADMIN / DBEAVER (INTERFACE GRÁFICA)

### 1. Pegar credenciais do Railway

No Railway, clique no serviço **Postgres** → aba **"Variables"** ou **"Connect"**

Anote:
- `PGHOST`
- `PGPORT`
- `PGDATABASE`
- `PGUSER`
- `PGPASSWORD`

### 2. Baixar ferramenta

**DBeaver** (recomendado): https://dbeaver.io/download/
**pgAdmin**: https://www.pgadmin.org/download/

### 3. Criar conexão

- Host: (valor de PGHOST)
- Port: (valor de PGPORT)
- Database: (valor de PGDATABASE)
- User: (valor de PGUSER)
- Password: (valor de PGPASSWORD)
- SSL: Enabled

### 4. Executar SQL

Cole o SQL do `fix-admin-role.sql` e execute.

---

## ✅ OPÇÃO 3: PSQL DIRETO (TERMINAL)

### Se tiver psql instalado:

```bash
# Pegar DATABASE_URL do Railway
# No Railway: Postgres → Variables → DATABASE_URL

# Copie a URL completa tipo:
# postgresql://postgres:password@host:port/database

# Conectar:
psql "postgresql://postgres:password@host:port/database"

# Cole o SQL e execute
```

---

## ✅ OPÇÃO 4: ATRAVÉS DA TABELA "users" (INTERFACE WEB)

### No Railway que você já tem aberto:

1. **Clique na tabela "users"**
2. **Encontre a linha com email "admin@flipcars.com"**
3. **Copie o ID** (deve ser algo como: `00000000-0000-0000-0000-000000000001`)

4. **Clique na tabela "roles"**
5. **Encontre a role "super_admin"** (COM UNDERSCORE)
6. **Copie o ID da role**

7. **Clique na tabela "user_roles"**
8. **Encontre a linha onde userId = ID do admin**
9. **Delete essa linha** (botão delete/trash)
10. **Clique em "Add Row"** ou similar
11. **Preencha**:
    - `userId`: ID do admin copiado no passo 3
    - `roleId`: ID da role super_admin copiado no passo 6
12. **Salvar**

✅ **Pronto! Role corrigida!**

---

## ✅ OPÇÃO 5: CRIAR NOVO USUÁRIO COM ROLE CORRETA

Se for muito complicado corrigir o existente, podemos criar um novo:

### No Railway, tabela "users":

1. **Adicionar novo usuário**:
   - name: `Super Admin`
   - email: `superadmin@flipcars.com`
   - password: `$2b$10$9kE7vps6NfrE81B6neRGMeFU.JYxqI7jZvCwxYGZp4OVEcKbZvH0G`
   - status: `active`
   - language: `en`
   - emailVerified: `true`

2. **Copiar o ID gerado**

3. **Na tabela "roles"**, copiar ID da role `super_admin`

4. **Na tabela "user_roles"**, adicionar:
   - userId: ID do novo usuário
   - roleId: ID da role super_admin

5. **Login**:
   - Email: `superadmin@flipcars.com`
   - Senha: `Admin123!`

---

## 🎯 QUAL OPÇÃO ESCOLHER?

| Opção | Dificuldade | Tempo | Recomendado |
|-------|-------------|-------|-------------|
| **Opção 1 (Railway CLI)** | Média | 5 min | ⭐⭐⭐ Se tiver npm |
| **Opção 2 (DBeaver)** | Baixa | 10 min | ⭐⭐⭐ Melhor para visualizar |
| **Opção 3 (psql)** | Alta | 3 min | ⭐⭐ Se já tiver instalado |
| **Opção 4 (Interface Web)** | Baixa | 5 min | ⭐⭐⭐⭐⭐ **MAIS FÁCIL** |
| **Opção 5 (Novo usuário)** | Baixa | 5 min | ⭐⭐⭐⭐ Alternativa rápida |

---

## 🌟 RECOMENDAÇÃO

### **Use a OPÇÃO 4** (Interface Web) - É a mais fácil!

Você já está na interface do Railway, basta:
1. Clicar nas tabelas
2. Copiar IDs
3. Deletar e criar registro em `user_roles`

**OU**

### **Use a OPÇÃO 5** (Novo usuário) - Mais rápido!

Criar um novo super admin é mais rápido que consertar o atual.

---

## 📸 Quer que eu te guie?

**Me mostre um screenshot de uma das tabelas aberta** (users, roles ou user_roles) e te guio passo a passo pela **OPÇÃO 4**!

Ou me diga qual opção prefere e te ajudo!
