# Novo Usuário Admin Criado - FlipCars

## Informações do Usuário

**Email**: admin@flipcars.us  
**Senha**: admin123  
**Nome**: Admin FlipCars US  
**ID**: 4b4e4b63-d82a-4ab7-a359-3d66b3cfa9f5  
**Status**: active  
**Email Verified**: true  
**Role**: admin

## Ações Realizadas

### 1. Criação do Usuário
```sql
INSERT INTO users (name, email, password, phone, status, language, email_verified)
VALUES (
  'Admin FlipCars US',
  'admin@flipcars.us',
  '$2b$10$sOp.Px5gY8th1v9Ngp33M.9Sm7A36U2sGsraUyoZL7uSFeQCgsBOa',
  '+1 (305) 555-0101',
  'active',
  'en',
  true
)
```

### 2. Atribuição de Role Admin
```sql
INSERT INTO user_roles (user_id, role_id)
VALUES (
  '4b4e4b63-d82a-4ab7-a359-3d66b3cfa9f5',
  'b45b4ad0-9bda-460e-a97a-4792c654f951'
)
```

## Estrutura das Tabelas

### Tabela `users`
Colunas:
- id (uuid)
- name (varchar)
- email (varchar, unique)
- password (varchar)
- phone (varchar)
- avatar_url (varchar, nullable)
- **status** (varchar) - NÃO `is_active`!
- language (varchar)
- last_login (timestamp)
- reset_password_token (varchar)
- reset_password_expires (timestamp)
- email_verified (boolean)
- email_verification_token (varchar)
- created_at (timestamp)
- updated_at (timestamp)

### Tabela `roles`
- id: b45b4ad0-9bda-460e-a97a-4792c654f951
- name: admin
- description: Administrator with full system access

### Tabela `user_roles` (Many-to-Many)
- user_id (uuid)
- role_id (uuid)

## Observações Importantes

1. A tabela `users` NÃO tem colunas `role` ou `is_active`
2. O sistema usa uma relação many-to-many através da tabela `user_roles`
3. A verificação de permissões é feita no `RolesGuard` (backend/src/modules/auth/guards/roles.guard.ts)
4. O guard verifica `user.roles.map(role => role.name)` para autorização

## Próximo Passo

Testar login com:
- Email: admin@flipcars.us
- Senha: admin123

