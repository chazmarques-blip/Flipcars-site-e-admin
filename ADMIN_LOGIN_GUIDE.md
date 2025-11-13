# 🔐 ADMIN LOGIN GUIDE - FlipCars 2.0

## ⚠️ PROBLEMA IDENTIFICADO

O admin dashboard está retornando **401 Unauthorized** porque:
- O usuário admin ainda não foi criado no banco de dados
- Os seeds não foram executados no ambiente de produção

---

## 🎯 SOLUÇÃO RÁPIDA (2 MÉTODOS)

### 📌 MÉTODO 1: Executar SQL no Supabase (RECOMENDADO)

**Passo 1**: Acesse o Supabase SQL Editor
```
https://supabase.com/dashboard/project/[your-project-id]/sql/new
```

**Passo 2**: Copie e cole todo o conteúdo do arquivo:
```
/home/user/webapp/CREATE_ADMIN_USER.sql
```

**Passo 3**: Execute o SQL (botão "Run")

**Passo 4**: Verifique se o usuário foi criado (última query do SQL)

---

### 📌 MÉTODO 2: Executar Seeds via Railway

**Passo 1**: Acesse o Railway Dashboard
```
https://railway.app/project/[your-project-id]
```

**Passo 2**: No terminal do Railway, execute:
```bash
npm run seed:prod
```

**Nota**: Este método pode falhar se houver problemas de conexão. Use o Método 1 se isso acontecer.

---

## 🔑 CREDENCIAIS DO ADMIN

Após criar o usuário, use estas credenciais para login:

```
URL: https://admin.flipcars.us
Email: admin@flipcars.us
Password: Password123!
```

---

## ✅ VERIFICAÇÃO PÓS-LOGIN

Após fazer login com sucesso:

1. ✅ Acesse: https://admin.flipcars.us/dashboard/leads
2. ✅ Verifique se os leads aparecem (pode estar vazio se não houver leads)
3. ✅ Confirme que não há mais erros 401/500

---

## 🐛 TROUBLESHOOTING

### Erro: "User already exists"
**Solução**: O usuário já foi criado. Tente fazer login com as credenciais acima.

### Erro: "Role 'admin' not found"
**Solução**: Execute os seeds de roles primeiro:
```sql
-- Verificar se roles existem
SELECT * FROM roles;

-- Se não existir, criar role admin
INSERT INTO roles (name, description, "createdAt", "updatedAt")
VALUES ('admin', 'Administrator role', NOW(), NOW())
ON CONFLICT DO NOTHING;
```

### Erro 401 mesmo após criar usuário
**Possíveis causas**:
1. **Token expirado**: Faça logout e login novamente
2. **Cache do browser**: Limpe o cache (Ctrl+Shift+Del)
3. **JWT_SECRET incorreto**: Verifique variáveis de ambiente do Railway

---

## 📊 VERIFICAR ESTRUTURA DO BANCO

Para confirmar que tudo está correto, execute no Supabase:

```sql
-- Verificar tabelas existentes
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verificar usuários existentes
SELECT id, name, email, status FROM "user";

-- Verificar roles existentes
SELECT * FROM roles;

-- Verificar associações user_roles
SELECT 
    u.email,
    r.name as role
FROM "user" u
JOIN user_roles ur ON u.id = ur."userId"
JOIN roles r ON ur."roleId" = r.id;
```

---

## 🚀 PRÓXIMOS PASSOS APÓS LOGIN

1. ✅ Verificar que admin dashboard funciona
2. ✅ Importar keywords do Google Ads
3. ✅ Testar conversão de leads
4. ✅ Configurar extensões do Google Ads

---

## 📞 SUPORTE TÉCNICO

Se ainda tiver problemas:
1. Compartilhe screenshot do erro
2. Verifique logs do Railway: `railway logs`
3. Verifique console do browser (F12)

---

**Última Atualização**: 2025-11-13
**Status**: Aguardando criação do usuário admin
