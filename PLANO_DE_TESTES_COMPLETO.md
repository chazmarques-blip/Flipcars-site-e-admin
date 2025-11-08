# 🧪 Plano Completo de Testes - FlipCars

**Data:** 2025-11-08  
**Status Backend:** ✅ Rodando (mas sem migrations)

---

## 📋 ETAPAS DE TESTE

### ETAPA 1: Executar Migrations no Railway ⏭️ **PRÓXIMO PASSO**

**Status:** ⏳ Pendente  
**Prioridade:** 🔴 CRÍTICA

#### O que fazer:

1. **Acesse o Railway Dashboard**
   - URL: https://railway.app/project/inspiring-imagination
   - Clique em `upbeat-dedication` (backend service)

2. **Configure o Start Command**
   - Vá em: `Settings` → `Deploy`
   - Encontre o campo `Start Command`
   - **Valor atual:** `npm run start:prod`
   - **Novo valor:**
     ```bash
     npm run migration:run && npm run seed && npm run start:prod
     ```
   - Clique em `Save` ou `Deploy`

3. **Aguarde o Deploy**
   - Railway vai fazer redeploy automático (~3-5 minutos)
   - Acompanhe os logs em: `Deployments` → Último deploy → `Deploy Logs`

4. **Verifique os Logs**
   Procure por estas mensagens:
   ```
   ✅ Migration completed successfully
   ✅ Seeding completed successfully
   ✅ Nest application successfully started
   ```

#### Teste após migrations:

```bash
# Teste 1: Health check
curl https://upbeat-dedication-production.up.railway.app/api/health

# Teste 2: Login com superadmin
curl https://upbeat-dedication-production.up.railway.app/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@flipcars.us",
    "password": "Password123!"
  }'
```

**Resultado esperado:** JWT tokens e dados do usuário superadmin

---

### ETAPA 2: Testes de API (Backend)

**Status:** ⏳ Após migrations  
**Prioridade:** 🟡 Alta

#### 2.1 Autenticação

```bash
# Login
curl https://upbeat-dedication-production.up.railway.app/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@flipcars.us",
    "password": "Password123!"
  }' | jq .

# Salvar o access_token da resposta para os próximos testes
```

#### 2.2 Usuários (com autenticação)

```bash
# Listar usuários
curl https://upbeat-dedication-production.up.railway.app/api/users \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" | jq .

# Ver perfil do usuário logado
curl https://upbeat-dedication-production.up.railway.app/api/users/me \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" | jq .
```

#### 2.3 Leads (endpoint público)

```bash
# Criar lead (simula formulário público)
curl https://upbeat-dedication-production.up.railway.app/api/leads \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao.teste@example.com",
    "phone": "(11) 98765-4321",
    "vehicleYear": "2020",
    "vehicleMake": "Honda",
    "vehicleModel": "Civic",
    "vehicleMileage": "50000",
    "message": "Gostaria de vender meu carro"
  }' | jq .

# Listar leads (requer autenticação)
curl https://upbeat-dedication-production.up.railway.app/api/leads \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" | jq .
```

#### 2.4 CORS (teste importante)

```bash
# Verificar headers CORS
curl -I https://upbeat-dedication-production.up.railway.app/api/health \
  -H "Origin: https://flipcars.us"

# Deve retornar:
# Access-Control-Allow-Origin: https://flipcars.us
```

---

### ETAPA 3: Testes de Frontend (Admin)

**Status:** ⏳ Após migrations  
**Prioridade:** 🟡 Alta  
**URL:** https://admin.flipcars.us

#### 3.1 Teste de Login

1. Acesse: https://admin.flipcars.us
2. Tente fazer login com:
   - Email: `superadmin@flipcars.us`
   - Password: `Password123!`
3. **Resultado esperado:** Redirecionamento para o dashboard

#### 3.2 Teste de Dashboard

1. Verifique se os cards de estatísticas aparecem
2. Verifique se o menu lateral funciona
3. Navegue entre as páginas

#### 3.3 Teste de Leads

1. Vá em "Leads" no menu
2. Verifique se a lista de leads carrega
3. Tente criar um novo lead manualmente (se disponível)
4. Tente editar um lead existente

#### 3.4 Teste de Usuários (apenas superadmin)

1. Vá em "Usuários" no menu
2. Verifique se lista de usuários carrega
3. Tente criar um novo usuário (admin ou manager)
4. Teste os diferentes roles

---

### ETAPA 4: Testes de Frontend (Público)

**Status:** ⏳ Após migrations  
**Prioridade:** 🟡 Alta  
**URL:** https://flipcars.us

#### 4.1 Teste de Homepage

1. Acesse: https://flipcars.us
2. Verifique se a página carrega corretamente
3. Verifique imagens e conteúdo

#### 4.2 Teste de Formulário de Lead

1. Localize o formulário de contato/lead
2. Preencha todos os campos:
   - Nome: "Maria Teste"
   - Email: "maria.teste@example.com"
   - Telefone: "(11) 99999-9999"
   - Dados do veículo (ano, marca, modelo, etc.)
3. Envie o formulário
4. **Resultado esperado:** Mensagem de sucesso

#### 4.3 Verificar Lead no Admin

1. Volte para https://admin.flipcars.us
2. Vá em "Leads"
3. **Resultado esperado:** Novo lead "Maria Teste" aparece na lista

#### 4.4 Teste de Navegação

1. Teste todos os links do menu
2. Verifique se páginas carregam corretamente
3. Teste responsividade (mobile/desktop)

---

### ETAPA 5: Configurar Domínio Customizado (Opcional)

**Status:** ⏳ Após testes básicos funcionarem  
**Prioridade:** 🟢 Média

#### 5.1 Adicionar Domínio no Railway

1. Railway → `upbeat-dedication` → `Settings` → `Networking`
2. Clique em `+ Custom Domain`
3. Digite: `api.flipcars.us`
4. **Copie o valor CNAME** fornecido (ex: `upbeat-dedication-production.up.railway.app`)

#### 5.2 Configurar DNS no GoDaddy

1. Login no GoDaddy: https://dcc.godaddy.com/
2. Vá em: `My Products` → `flipcars.us` → `DNS`
3. Clique em `Add` para adicionar registro
4. Configure:
   ```
   Type: CNAME
   Name: api
   Value: upbeat-dedication-production.up.railway.app
   TTL: 600 (10 minutos)
   ```
5. Salve

#### 5.3 Aguardar Propagação DNS

```bash
# Teste DNS (aguarde 10-15 minutos)
dig api.flipcars.us CNAME
nslookup api.flipcars.us

# Teste endpoint
curl https://api.flipcars.us/api/health
```

#### 5.4 Atualizar Frontends

**frontend-admin/.env.production:**
```env
NEXT_PUBLIC_API_URL=https://api.flipcars.us/api
```

**frontend-public/.env.production:**
```env
NEXT_PUBLIC_API_URL=https://api.flipcars.us/api
```

Redeploy ambos os frontends após atualizar.

---

### ETAPA 6: Testes de Integração Completa

**Status:** ⏳ Após domínio configurado  
**Prioridade:** 🟢 Média

#### 6.1 Fluxo Completo: Lead → Admin → Resposta

1. **Cliente no site público:**
   - Acessa: https://flipcars.us
   - Preenche formulário de interesse
   - Submete

2. **Admin no painel:**
   - Acessa: https://admin.flipcars.us
   - Faz login
   - Vê novo lead na lista
   - Abre detalhes do lead
   - Atualiza status do lead

3. **Verificação:**
   - Confirma que dados estão corretos
   - Confirma que timestamps estão corretos
   - Confirma que status foi atualizado

#### 6.2 Teste de Performance

```bash
# Teste de carga simples (100 requests)
for i in {1..100}; do
  curl -s https://upbeat-dedication-production.up.railway.app/api/health > /dev/null
  echo "Request $i completed"
done
```

#### 6.3 Teste de Segurança

```bash
# Tenta acessar rota protegida sem autenticação
curl https://upbeat-dedication-production.up.railway.app/api/users

# Resultado esperado: 401 Unauthorized
```

---

## 🎯 CHECKLIST DE TESTES

### Backend (API)
- [ ] Health check responde 200 OK
- [ ] Migrations executadas com sucesso
- [ ] Seeds executados com sucesso
- [ ] Login com superadmin funciona
- [ ] JWT tokens são gerados
- [ ] Endpoints de usuários funcionam (com auth)
- [ ] Endpoints de leads funcionam
- [ ] CORS configurado corretamente
- [ ] Rotas públicas acessíveis sem auth
- [ ] Rotas protegidas bloqueadas sem auth

### Frontend Admin
- [ ] Página carrega corretamente
- [ ] Login funciona
- [ ] Dashboard exibe dados
- [ ] Lista de leads funciona
- [ ] Lista de usuários funciona (superadmin)
- [ ] Criação de dados funciona
- [ ] Edição de dados funciona
- [ ] Logout funciona
- [ ] Navegação entre páginas funciona

### Frontend Público
- [ ] Homepage carrega
- [ ] Formulário de lead funciona
- [ ] Lead é criado no backend
- [ ] Lead aparece no admin
- [ ] Todas as páginas carregam
- [ ] Links funcionam
- [ ] Responsivo funciona

### Infraestrutura
- [ ] Backend rodando no Railway
- [ ] PostgreSQL conectado
- [ ] Variáveis de ambiente configuradas
- [ ] SSL/HTTPS funcionando
- [ ] Domínio customizado configurado (opcional)
- [ ] DNS propagado (se domínio configurado)

---

## 🚨 PROBLEMAS COMUNS E SOLUÇÕES

### ❌ Login retorna 500 Error
**Causa:** Migrations não foram executadas  
**Solução:** Execute as migrations (Etapa 1)

### ❌ CORS Error no frontend
**Causa:** Backend não permite origem do frontend  
**Solução:** Verifique variável `FRONTEND_URL` no Railway

### ❌ "Cannot connect to database"
**Causa:** DATABASE_URL não está configurada  
**Solução:** Já foi corrigido! Se aparecer, verifique Railway variables

### ❌ 401 Unauthorized em rotas protegidas
**Causa:** Token JWT inválido ou expirado  
**Solução:** Faça login novamente para obter novo token

### ❌ Domínio customizado não funciona
**Causa:** DNS não propagou ou CNAME incorreto  
**Solução:** Aguarde 15-30 minutos, verifique CNAME no GoDaddy

---

## 📊 FERRAMENTAS DE TESTE

### Testes Manuais
- **Browser DevTools:** Para ver Network requests e Console errors
- **Postman/Insomnia:** Para testar API endpoints
- **curl:** Para testes rápidos de linha de comando

### Scripts Disponíveis
```bash
# Health check automático
bash /home/user/webapp/test-railway-deployment.sh

# Teste manual de endpoints
curl https://upbeat-dedication-production.up.railway.app/api/health | jq .
```

### Logs e Monitoramento
- **Railway Logs:** Railway Dashboard → Deployments → Deploy Logs
- **Browser Console:** F12 → Console (para frontend errors)
- **Network Tab:** F12 → Network (para ver API calls)

---

## 🎯 ORDEM RECOMENDADA DE EXECUÇÃO

1. ✅ **Backend está rodando** (JÁ FEITO!)
2. ⏭️ **Executar migrations** (PRÓXIMO PASSO - Etapa 1)
3. ⏭️ **Testar API** (Etapa 2)
4. ⏭️ **Testar Admin Login** (Etapa 3.1)
5. ⏭️ **Testar formulário público** (Etapa 4.2)
6. ⏭️ **Verificar lead no admin** (Etapa 4.3)
7. ⏭️ **Configurar domínio** (Etapa 5) - Opcional
8. ⏭️ **Testes completos** (Etapa 6)

---

## 📝 NOTAS IMPORTANTES

### Credenciais de Teste (após migrations):
```
Superadmin:
Email: superadmin@flipcars.us
Password: Password123!
```

### URLs Importantes:
```
Backend (Railway):  https://upbeat-dedication-production.up.railway.app
Backend (Custom):   https://api.flipcars.us (após configurar)
Admin Panel:        https://admin.flipcars.us
Public Site:        https://flipcars.us
Railway Dashboard:  https://railway.app/project/inspiring-imagination
```

### Variáveis Já Configuradas no Railway:
- ✅ NODE_ENV=production
- ✅ PORT=3001
- ✅ DATABASE_URL (auto-injetado pelo PostgreSQL)
- ✅ JWT_SECRET e JWT_REFRESH_SECRET
- ✅ FRONTEND_URL (3 domínios)
- ✅ Database configs

---

## 🎉 SUCESSO!

Quando todos os testes passarem:
- ✅ Backend funcionando
- ✅ Database conectado e populado
- ✅ Admin pode fazer login
- ✅ Site público pode criar leads
- ✅ Leads aparecem no admin
- ✅ CORS funcionando
- ✅ Todos os endpoints respondendo

**Projeto está 100% funcional e pronto para uso!** 🚀

---

**Última atualização:** 2025-11-08  
**Próxima ação:** Executar migrations (Etapa 1)
