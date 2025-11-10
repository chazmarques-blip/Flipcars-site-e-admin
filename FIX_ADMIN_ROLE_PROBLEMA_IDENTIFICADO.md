# 🔴 PROBLEMA IDENTIFICADO: ROLE INCORRETA DO ADMIN

**Data**: 2025-11-10  
**Status**: 🔴 CRÍTICO - Admin não consegue acessar leads

---

## 🎯 RESUMO DO PROBLEMA

O admin faz login com sucesso ✅, mas não consegue ver leads ❌.

**CAUSA RAIZ**: Role do usuário está INCORRETA no banco de dados!

---

## 🔍 DIAGNÓSTICO TÉCNICO

### 1️⃣ Comportamento Observado

```
✅ Login funciona: admin@flipcars.com / Admin123!
✅ Token JWT gerado com sucesso
❌ GET /api/leads retorna 401 Unauthorized
```

### 2️⃣ Investigação Realizada

**Script de teste executado:**
```javascript
// Login OK, mas leads falham
const response = await fetch('/api/leads', {
  headers: { Authorization: `Bearer ${token}` }
});
// Resultado: 401 Unauthorized
```

**Dados do token JWT decodificado:**
```json
{
  "user": {
    "id": "00000000-0000-0000-0000-000000000001",
    "name": "Admin FlipCars",
    "email": "admin@flipcars.com",
    "roles": ["superadmin"],  // ❌ PROBLEMA AQUI!
    "language": "en"
  }
}
```

### 3️⃣ Análise do Código Backend

**Enum de roles definido em `role.entity.ts`:**
```typescript
export enum RoleName {
  SUPER_ADMIN = 'super_admin',  // ✅ Com underscore
  ADMIN = 'admin',
  AGENT = 'agent',
  CUSTOMER = 'customer',
  READ_ONLY = 'read_only',
}
```

**Controller de leads (`leads.controller.ts` linha 39):**
```typescript
@Get()
@Roles('admin', 'agent', 'super_admin')  // ✅ Espera 'super_admin'
async findAll(@Query() query: QueryLeadsDto) {
  return this.leadsService.findAll(query);
}
```

**RolesGuard (`roles.guard.ts` linha 28-29):**
```typescript
// Compara roles do usuário com roles requeridas
const userRoleNames = user.roles.map((role) => role.name as string);
const hasRole = requiredRoles.some((role) => userRoleNames.includes(role));
```

### 4️⃣ Root Cause

**❌ Role no banco**: `"superadmin"` (sem underscore, tudo junto)  
**✅ Role esperada**: `"super_admin"` (com underscore)

**Resultado:** Guard rejeita requisição com 401 Unauthorized!

---

## ✅ SOLUÇÃO

### Opção 1: Corrigir Role no Banco (RECOMENDADO)

**Executar SQL no Railway PostgreSQL:**

```sql
-- 1. Ver estado atual
SELECT 
  u.id, u.name, u.email,
  ARRAY_AGG(r.name) as roles
FROM users u
LEFT JOIN user_roles ur ON ur."userId" = u.id
LEFT JOIN roles r ON r.id = ur."roleId"
WHERE u.email = 'admin@flipcars.com'
GROUP BY u.id, u.name, u.email;

-- 2. Ver roles disponíveis
SELECT id, name FROM roles ORDER BY name;

-- 3. Remover role incorreta
DELETE FROM user_roles
WHERE "userId" IN (
  SELECT id FROM users WHERE email = 'admin@flipcars.com'
);

-- 4. Adicionar role correta
INSERT INTO user_roles ("userId", "roleId")
SELECT u.id, r.id
FROM users u
CROSS JOIN roles r
WHERE u.email = 'admin@flipcars.com'
  AND r.name = 'super_admin';  -- ✅ COM UNDERSCORE

-- 5. Verificar resultado
SELECT 
  u.id, u.name, u.email,
  ARRAY_AGG(r.name) as roles
FROM users u
LEFT JOIN user_roles ur ON ur."userId" = u.id
LEFT JOIN roles r ON r.id = ur."roleId"
WHERE u.email = 'admin@flipcars.com'
GROUP BY u.id, u.name, u.email;
```

**📄 Arquivo SQL pronto:** `fix-admin-role.sql`

### Opção 2: Verificar Como Role Foi Criada

Possíveis causas da role errada:

1. **Criação manual no Railway** com nome errado
2. **Seed não rodou** e usuário foi criado manualmente
3. **Migração** criou role "superadmin" ao invés de "super_admin"

---

## 📋 PASSO A PASSO PARA CORRIGIR

### 1️⃣ Acessar Railway Dashboard
```
https://railway.app/dashboard
```

### 2️⃣ Selecionar Projeto FlipCars
- Clique no projeto
- Procure serviço PostgreSQL

### 3️⃣ Abrir PostgreSQL Query/Data Tab
- Clique no serviço PostgreSQL
- Vá para aba "Data" ou "Query"

### 4️⃣ Copiar e Executar SQL
```bash
# SQL está em:
cat fix-admin-role.sql
```

Cole TODO o conteúdo do arquivo no Railway e execute.

### 5️⃣ Verificar Resultado
O último SELECT deve mostrar:
```
roles: {super_admin}  // ✅ COM UNDERSCORE
```

### 6️⃣ Testar Login Novamente
```bash
# Modo anônimo
Ctrl+Shift+N

# URL
https://admin.flipcars.us/auth/login

# Credenciais
admin@flipcars.com / Admin123!

# Ir em Leads
# ✅ Deve aparecer lista de leads!
```

---

## 🧪 TESTE DE VERIFICAÇÃO

**Script Node.js:**
```bash
cd /home/user/webapp
node verificar-lead-no-banco.js
```

**Resultado esperado APÓS correção:**
```
✅ Login realizado com sucesso
✅ Encontrados X leads no banco
📋 Leads: [lista de leads]
```

---

## 📊 ARQUIVOS RELACIONADOS

### Scripts Criados
- ✅ `fix-admin-role.sql` - SQL para corrigir role
- ✅ `verificar-lead-no-banco.js` - Script de teste
- ✅ `verificar-usuario-admin.js` - Ver dados do usuário

### Documentação
- 📄 `COMANDO_PROXIMO_CHAT_2025-11-10.md` - Contexto completo
- 📄 `SOLUCAO_ADMIN_DINAMICO.md` - Guia anterior
- 📄 `CRIAR_USUARIO_ADMIN_RAILWAY.md` - Como criar usuários

### Backend
- 📄 `backend/src/database/entities/role.entity.ts` - Enum de roles
- 📄 `backend/src/modules/leads/leads.controller.ts` - Controller
- 📄 `backend/src/modules/auth/guards/roles.guard.ts` - Guard

---

## 🎓 LIÇÕES APRENDIDAS

### 1. Sempre Verificar Roles no Token
Ao debugar problemas de autorização, sempre decodificar o JWT e verificar:
- Roles do usuário
- Formato das roles (underscore, case, etc)
- Comparar com roles esperadas

### 2. Seeds vs. Criação Manual
Quando seeds não rodam:
- Documentar exatamente como criar usuários
- Incluir TODAS as tabelas necessárias (users, roles, user_roles)
- Usar valores EXATOS do enum

### 3. Testing
Criar scripts de teste que verificam:
- Login
- Autorização
- Acesso a recursos protegidos

---

## ⚠️ ATENÇÃO

**ANTES DE EXECUTAR O SQL:**
1. ✅ Fazer backup do banco (Railway faz automático)
2. ✅ Executar query de verificação primeiro
3. ✅ Confirmar que role "super_admin" existe na tabela roles
4. ✅ Só então executar DELETE e INSERT

**SE DER ERRO:**
- Verificar se tabela `user_roles` usa aspas: `"userId"`, `"roleId"`
- Verificar se role `super_admin` existe: `SELECT * FROM roles;`
- Verificar se há constraint de foreign key

---

## ✅ CHECKLIST DE CORREÇÃO

- [ ] Acessar Railway Dashboard
- [ ] Abrir PostgreSQL Query
- [ ] Executar SQL de verificação (SELECT inicial)
- [ ] Confirmar que role atual está errada
- [ ] Verificar que `super_admin` existe em roles
- [ ] Executar DELETE de role antiga
- [ ] Executar INSERT de role correta
- [ ] Executar SELECT final para confirmar
- [ ] Limpar cache do browser (Ctrl+Shift+Delete)
- [ ] Modo anônimo (Ctrl+Shift+N)
- [ ] Login no admin
- [ ] Verificar que leads aparecem
- [ ] ✅ SUCESSO!

---

## 🚀 PRÓXIMOS PASSOS APÓS CORREÇÃO

1. ✅ Confirmar que admin vê todos os leads
2. ✅ Buscar lead FLIP-20251109-0022 (pode não existir)
3. ✅ Criar novo lead no site público
4. ✅ Verificar que aparece IMEDIATAMENTE no admin
5. ✅ Testar todas as funcionalidades do admin
6. ✅ Documentar solução final

---

**Status**: ⏳ AGUARDANDO EXECUÇÃO DO SQL NO RAILWAY  
**Bloqueador**: Role incorreta no banco de dados  
**Solução**: Executar `fix-admin-role.sql` no Railway PostgreSQL  
**ETA**: 5 minutos após executar SQL  

---

**Working Directory**: `/home/user/webapp`
