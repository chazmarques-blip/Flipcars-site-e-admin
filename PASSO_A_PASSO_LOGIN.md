# 🚀 PASSO A PASSO: FAZER LOGIN E CRIAR APPOINTMENT

## 📋 VISÃO GERAL

Você está vendo erros 401 porque **não está autenticado**. Vamos resolver isso!

---

## ✅ PASSO 1: TESTAR API (Terminal Mac)

Abra o **Terminal** no seu Mac e execute:

```bash
curl https://upbeat-dedication-production.up.railway.app/api/health
```

**Resultado esperado:**
```json
{"status":"ok"}
```

✅ Se mostrar isso → API está funcionando!

---

## ✅ PASSO 2: TESTAR LOGIN (Terminal Mac)

```bash
curl -X POST https://upbeat-dedication-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@flipcars.us","password":"COLOQUE_SUA_SENHA_AQUI"}'
```

### Resultados Possíveis:

#### ✅ SUCESSO (você verá algo assim):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0YjRlNGI2My1kODJhLTRhYjctYTM1OS0zZDY2YjNjZmE5ZjUiLCJ1c2VySWQiOiI0YjRlNGI2My1kODJhLTRhYjctYTM1OS0zZDY2YjNjZmE5ZjUiLCJlbWFpbCI6ImFkbWluQGZsaXBjYXJzLnVzIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxOTYxMjAwLCJleHAiOjE3MzE5NjQ4MDB9.abc123...",
  "user": {
    "id": "4b4e4b63-d82a-4ab7-a359-3d66b3cfa9f5",
    "email": "admin@flipcars.us",
    "name": "Admin FlipCars US",
    "role": "admin"
  }
}
```

**🎉 Isso significa que suas credenciais estão CORRETAS!**

#### ❌ SENHA ERRADA (você verá):
```json
{
  "message": "Invalid credentials",
  "error": "Unauthorized",
  "statusCode": 401
}
```

**Solução:** Use a senha correta ou resete via SQL (veja Passo 5)

---

## ✅ PASSO 3: FAZER LOGIN NO FRONTEND

### 3.1 Acesse a página de login:
👉 **https://admin.flipcars.us/auth/login**

### 3.2 Digite suas credenciais:
- **Email:** `admin@flipcars.us` (ou outro que você usa)
- **Senha:** (mesma que você testou no curl)

### 3.3 Clique em "Login"

### 3.4 Deve redirecionar para o dashboard

---

## ✅ PASSO 4: ACESSAR CALENDÁRIO

Após fazer login, acesse:
👉 **https://admin.flipcars.us/dashboard/appointments-v2**

**Neste momento o calendário deve carregar SEM erros 401!**

Se ainda aparecer appointments vazios, é porque não há appointments criados ainda.

---

## ✅ PASSO 5: CRIAR APPOINTMENT DE TESTE (OPCIONAL)

### 5.1 Abrir Supabase SQL Editor

### 5.2 Pegar um lead_id:
```sql
SELECT id, name, phone FROM leads ORDER BY created_at DESC LIMIT 1;
```

**Copie o `id` retornado** (ex: `4b4e4b63-d82a-4ab7-a359-3d66b3cfa9f5`)

### 5.3 Criar appointment:
```sql
INSERT INTO appointments (
  lead_id, 
  appointment_date, 
  appointment_time_slot,
  appointment_start_time, 
  appointment_end_time, 
  status
) VALUES (
  'COLE_O_ID_AQUI',  -- ⚠️ Substitua pelo ID do passo 5.2
  '2025-11-25',
  '10:00-12:00',
  '10:00:00',
  '12:00:00',
  'scheduled'
) RETURNING *;
```

### 5.4 Verificar no calendário:
- Recarregue a página: https://admin.flipcars.us/dashboard/appointments-v2
- **O appointment deve aparecer no dia 25 de novembro!** 🎉

---

## 🚨 PASSO 6: SE SENHA NÃO FUNCIONAR (RESETAR)

Execute no **Supabase SQL Editor**:

```sql
-- Resetar senha para: FlipCars2024!
UPDATE users 
SET password = '$2b$10$EixZaYVK9559K0YaxC8p8.nrfU0kBQ.A8KqQXZxQm0hGvKqG0K5vy'
WHERE email = 'admin@flipcars.us';

-- Verificar
SELECT email, name, status FROM users WHERE email = 'admin@flipcars.us';
```

Depois tente fazer login com:
- **Email:** `admin@flipcars.us`
- **Senha:** `FlipCars2024!`

---

## 📊 RESUMO DO QUE VOCÊ DEVE FAZER AGORA

| # | Ação | Onde | Status |
|---|------|------|--------|
| 1 | Testar API health | Terminal Mac | ⏳ |
| 2 | Testar login via curl | Terminal Mac | ⏳ |
| 3 | Fazer login no frontend | https://admin.flipcars.us/auth/login | ⏳ |
| 4 | Acessar calendário | https://admin.flipcars.us/dashboard/appointments-v2 | ⏳ |
| 5 | Criar appointment (opcional) | Supabase SQL Editor | ⏳ |

---

## 🎯 O QUE EU PRECISO QUE VOCÊ ME DIGA

Depois de executar os comandos do **PASSO 2**, me diga:

1. ✅ O curl de health retornou `{"status":"ok"}`?
2. ✅ O curl de login retornou `accessToken` ou deu erro?
3. 📝 Se deu erro, qual foi a mensagem exata?

Com essas informações posso te ajudar no próximo passo! 🚀

---

## 💡 DICAS

- **Não coloque a senha aqui no chat** (por segurança)
- Apenas me diga: "funcionou" ou "deu erro X"
- Se resetar senha via SQL, use uma senha forte
- O token JWT dura 1 hora (depois precisa fazer login novamente)

---

**Aguardando seu retorno com os resultados dos testes!** 👍
