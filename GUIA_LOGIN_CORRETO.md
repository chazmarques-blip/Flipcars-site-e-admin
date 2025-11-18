# 🔐 GUIA DE LOGIN - FlipCars Admin

## ✅ **URL CORRETO PARA LOGIN**

👉 **https://admin.flipcars.us/auth/login** ← Use este!

❌ ~~https://admin.flipcars.us/login~~ (404 - não existe)

---

## 👥 **USUÁRIOS DISPONÍVEIS NO SEU SUPABASE**

Baseado na query que você executou, você tem 3 usuários admin:

1. `admin@mytruck.com` - Admin
2. `admin@flipcars.com` - Admin FlipCars
3. `admin@flipcars.us` - Admin FlipCars US

**Use um desses emails + sua senha** para fazer login.

---

## 🔧 **SE ESTIVER TENDO ERRO DE LOGIN**

### Possíveis Problemas:

#### 1. **Senha incorreta**
- Verifique se está usando a senha correta
- Senhas são case-sensitive (maiúsculas/minúsculas)

#### 2. **Token expirado no navegador**
- Abra DevTools (F12)
- Vá em "Application" → "Local Storage" → `admin.flipcars.us`
- Delete a chave `accessToken` se existir
- Tente fazer login novamente

#### 3. **API não está respondendo**
- Verifique se Railway está online
- Teste: `curl https://upbeat-dedication-production.up.railway.app/api/health`
- Deve retornar: `{"status":"ok"}`

#### 4. **Erro 500 no backend**
- Se você vê erro 500 ao tentar login, o backend pode ter problema
- Verifique logs do Railway

---

## 🧪 **TESTAR LOGIN VIA CURL (ALTERNATIVA)**

Se o frontend não funcionar, teste direto na API:

```bash
# Teste com um dos seus usuários
curl -X POST https://upbeat-dedication-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@flipcars.us","password":"SUA_SENHA"}'
```

### Respostas Possíveis:

#### ✅ Sucesso (200):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@flipcars.us",
    "name": "Admin FlipCars US",
    "role": "admin"
  }
}
```

#### ❌ Credenciais inválidas (401):
```json
{
  "message": "Invalid credentials",
  "error": "Unauthorized",
  "statusCode": 401
}
```

#### ❌ Erro no servidor (500):
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

## 🔑 **RESETAR SENHA (SE NECESSÁRIO)**

Se você esqueceu a senha, execute no **Supabase SQL Editor**:

```sql
-- Resetar senha para: NewPassword123!
UPDATE users 
SET password = '$2b$10$YQ98iKT3GqRxJ/Z7W8EUhOJXKx8Xr0Xz5L0NVxdxH8YPqD0w3LYBa'
WHERE email = 'admin@flipcars.us';

-- Verificar
SELECT email, name, status FROM users WHERE email = 'admin@flipcars.us';
```

Depois tente fazer login com:
- **Email:** `admin@flipcars.us`
- **Senha:** `NewPassword123!`

---

## 📊 **DEBUG NO NAVEGADOR**

### Passo 1: Abrir DevTools
- Pressione `F12` ou clique direito → "Inspecionar"

### Passo 2: Ir para "Console"
- Veja se há erros JavaScript

### Passo 3: Ir para "Network"
- Tente fazer login
- Veja a requisição para `/api/auth/login`
- Clique nela e veja:
  - **Request:** Payload (email/senha enviados)
  - **Response:** Resposta do servidor

### Passo 4: Capturar erro específico
- Me mande uma screenshot ou copie o erro exato que aparece

---

## 🚨 **ERROS COMUNS E SOLUÇÕES**

### "Network error" ou "Failed to fetch"
- **Causa:** Railway está offline ou CORS está bloqueando
- **Solução:** Verifique Railway dashboard

### "Invalid credentials"
- **Causa:** Email ou senha incorretos
- **Solução:** Verifique os dados ou resete a senha via SQL

### "User not found"
- **Causa:** Email não existe no banco
- **Solução:** Execute `SELECT * FROM users WHERE email = 'SEU_EMAIL'` no Supabase

### Página carrega mas não envia login
- **Causa:** JavaScript error no frontend
- **Solução:** Veja console do navegador (F12)

### "Too many requests"
- **Causa:** Rate limiting (tentou muitas vezes seguido)
- **Solução:** Aguarde 1 minuto e tente novamente

---

## 📝 **INFORMAÇÕES PARA ME PASSAR**

Para eu ajudar melhor, me diga:

1. **Qual erro exato aparece?** (screenshot ou texto)
2. **Onde aparece?** (na página, no console, no network?)
3. **Você consegue acessar:** https://admin.flipcars.us/auth/login ?
4. **Teste da API funciona?** (curl de login)

---

## ✅ **PRÓXIMOS PASSOS APÓS LOGIN**

Quando conseguir fazer login:

1. Vá para: https://admin.flipcars.us/dashboard/appointments-v2
2. Execute o SQL no Supabase para criar appointment de teste:
   ```sql
   -- Pegar lead_id
   SELECT id, name FROM leads LIMIT 1;
   
   -- Criar appointment (substitua o UUID)
   INSERT INTO appointments (lead_id, appointment_date, appointment_time_slot, appointment_start_time, appointment_end_time, status)
   VALUES ('UUID_DO_LEAD', '2025-11-25', '10:00-12:00', '10:00:00', '12:00:00', 'scheduled')
   RETURNING *;
   ```
3. Verifique se o appointment aparece no calendário!

---

**Aguardando seu feedback sobre qual erro específico você está vendo!** 🔍
