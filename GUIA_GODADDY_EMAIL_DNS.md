# 🎯 GUIA: Configurar Email no GoDaddy - FlipCars

**Data:** 11/11/2025  
**Domínio:** flipcars.us  
**Provedor:** GoDaddy  
**Tempo estimado:** 10 minutos

---

## 📍 VOCÊ ESTÁ NO LUGAR CERTO!

Vi que você está no **GoDaddy Dashboard** do domínio Flip Cars.

Agora vamos adicionar os registros DNS para o email funcionar novamente! 📧

---

## 🔧 PASSO A PASSO COMPLETO

### **PASSO 1: Acessar DNS Management**

Na tela onde você está agora (GoDaddy Dashboard):

1. **Procure no menu lateral esquerdo** (onde você está):
   - Clique em **"Domain"** (Domínio)
   
2. **OU vá direto:**
   - Acesse: https://dcc.godaddy.com/manage/flipcars.us/dns

3. **Você verá uma lista de DNS Records** (Registros DNS)

---

### **PASSO 2: Adicionar Registro - mail.flipcars.us**

1. **Botão "ADD" ou "Add Record"** (no canto superior ou inferior)

2. **Preencher:**
   ```
   Type: A
   Host: mail
   Points to: 216.198.79.1
   TTL: 1 Hour (ou Default)
   ```

3. **Clique em "Save"**

---

### **PASSO 3: Adicionar Registro - webmail.flipcars.us**

1. **Botão "ADD" novamente**

2. **Preencher:**
   ```
   Type: A
   Host: webmail
   Points to: 216.198.79.1
   TTL: 1 Hour (ou Default)
   ```

3. **Clique em "Save"**

---

### **PASSO 4: Adicionar MX Record (Email)**

1. **Botão "ADD" novamente**

2. **Preencher:**
   ```
   Type: MX
   Host: @ (deixar vazio ou @)
   Points to: mail.flipcars.us
   Priority: 0
   TTL: 1 Hour (ou Default)
   ```

3. **Clique em "Save"**

---

### **PASSO 5: Adicionar SPF Record (Opcional)**

Ajuda a evitar emails caírem em spam:

1. **Botão "ADD" novamente**

2. **Preencher:**
   ```
   Type: TXT
   Host: @ (deixar vazio ou @)
   TXT Value: v=spf1 a mx ip4:216.198.79.1 ~all
   TTL: 1 Hour (ou Default)
   ```

3. **Clique em "Save"**

---

## 📋 RESUMO DOS 4 REGISTROS

Após adicionar tudo, você deve ver estes registros na lista:

```
┌─────────────────────────────────────────────────────────┐
│  Type │ Host    │ Points to / Value           │ Priority│
├─────────────────────────────────────────────────────────┤
│  A    │ mail    │ 216.198.79.1               │    -    │
│  A    │ webmail │ 216.198.79.1               │    -    │
│  MX   │ @       │ mail.flipcars.us           │    0    │
│  TXT  │ @       │ v=spf1 a mx ip4:216... ~all│    -    │
└─────────────────────────────────────────────────────────┘
```

---

## ⏱️ AGUARDAR PROPAGAÇÃO

**Tempo de propagação:**
- Mínimo: 15-30 minutos
- Máximo: 24-48 horas
- Comum: 1-2 horas

**Verificar propagação:**
https://www.whatsmydns.net/#A/mail.flipcars.us

---

## ✅ TESTAR APÓS PROPAGAÇÃO

### **Teste 1: Verificar DNS Resolvido**

**Online:**
https://www.whatsmydns.net/#A/mail.flipcars.us

**Resultado esperado:**
- ✅ mail.flipcars.us → 216.198.79.1
- ✅ webmail.flipcars.us → 216.198.79.1

---

### **Teste 2: Acessar Webmail**

1. **Abra:** https://webmail.flipcars.us
2. **Login:**
   - Email: auto@flipcars.us
   - Senha: Flip@2030*

**Resultado esperado:**
- ✅ Página carrega (não mais erro DNS)
- ✅ Login funciona
- ❌ "Mailbox doesn't exist" → Precisamos recriar (Passo 6)

---

### **Teste 3: Enviar Email de Teste**

1. Do Gmail (ou outro), envie para: auto@flipcars.us
2. Aguarde 5 minutos
3. Verifique no webmail se chegou

---

## 🔐 PASSO 6 (SE NECESSÁRIO): Recriar Email no cPanel

Se o webmail carregar mas der erro "Mailbox doesn't exist":

### **Acessar cPanel:**

**Opção A: Via URL Direta**
```
https://flipcars.us:2083
OU
https://216.198.79.1:2083
```

**Opção B: Via GoDaddy**
1. GoDaddy Dashboard → "Hosting" ou "Web Hosting"
2. Botão "Manage" no plano de hospedagem
3. Botão "cPanel Admin"

---

### **Criar Email Account:**

1. **cPanel → Seção "EMAIL"**
2. **Clique em "Email Accounts"**
3. **Botão "+ Create"**

4. **Preencher:**
   ```
   Email: auto
   Domain: flipcars.us (selecionar no dropdown)
   Password: Flip@2030* (ou criar nova senha segura)
   Storage Space: 250 MB (ou Unlimited)
   ```

5. **Clique em "Create"**

6. **✅ Email recriado!**

---

## 📸 SCREENSHOTS ESPERADOS

### **GoDaddy DNS Management:**

Você deve ver algo assim:

```
┌──────────────────────────────────────────────────────┐
│  DNS Management - flipcars.us                        │
├──────────────────────────────────────────────────────┤
│  [Add] [Import] [Export]                  [Advanced] │
├──────────────────────────────────────────────────────┤
│  Type │ Name     │ Value           │ TTL   │ Actions │
├──────────────────────────────────────────────────────┤
│  A    │ @        │ 216.198.79.1    │ 1 Hour│ [Edit]  │
│  A    │ mail     │ 216.198.79.1    │ 1 Hour│ [Edit]  │ ← NOVO
│  A    │ webmail  │ 216.198.79.1    │ 1 Hour│ [Edit]  │ ← NOVO
│  MX   │ @        │ mail.flipcars.us│ 1 Hour│ [Edit]  │ ← NOVO
│  TXT  │ @        │ v=spf1...       │ 1 Hour│ [Edit]  │ ← NOVO
└──────────────────────────────────────────────────────┘
```

---

## ⚠️ ATENÇÃO: Não Remover Registros Existentes!

**IMPORTANTE:**
- ✅ **ADICIONE** os novos registros (mail, webmail, MX)
- ❌ **NÃO DELETE** registros existentes (A record @ para site)
- ⚠️ Se já existir MX record antigo, pode substituir

---

## 🔍 TROUBLESHOOTING

### **Problema 1: Não encontro "Domain" no menu**

**Solução:**
- Acesse direto: https://dcc.godaddy.com/manage/flipcars.us/dns
- OU: https://account.godaddy.com/products → Domains → flipcars.us → DNS

---

### **Problema 2: "Access Denied" ao salvar**

**Causa:** Você pode não ter permissões administrativas

**Solução:**
- Verifique se está logado com conta principal (não sub-usuário)
- Contate suporte GoDaddy se necessário

---

### **Problema 3: MX Record já existe mas incorreto**

**Solução:**
1. Clique em "Edit" no MX record existente
2. Altere para:
   - Points to: mail.flipcars.us
   - Priority: 0
3. Salve

---

### **Problema 4: Email ainda não funciona após 24h**

**Possíveis causas:**
1. **DNS não propagou** → Aguardar mais
2. **Email não existe no cPanel** → Recriar (Passo 6)
3. **Servidor de email offline** → Contatar hospedagem

**Verificações:**
```bash
# Ver se DNS resolveu:
https://www.whatsmydns.net/#A/mail.flipcars.us

# Ver se MX está correto:
https://mxtoolbox.com/SuperTool.aspx?action=mx%3aflipars.us
```

---

## 📞 PRECISA DE AJUDA?

### **Suporte GoDaddy:**
- **Telefone:** 0800-761-1680 (Brasil)
- **Chat:** https://www.godaddy.com/contact-us
- **Email:** support@godaddy.com

### **O que dizer ao suporte:**
```
"Meu email auto@flipcars.us parou de funcionar após 
reconfigurar o site. Preciso adicionar os registros DNS 
para o email funcionar novamente:

- A record para mail.flipcars.us → 216.198.79.1
- A record para webmail.flipcars.us → 216.198.79.1
- MX record apontando para mail.flipcars.us (prioridade 0)

Podem me ajudar a configurar?"
```

---

## 🎯 CHECKLIST COMPLETO

### **Configuração DNS:**
- [ ] Acessar GoDaddy DNS Management
- [ ] Adicionar A record: mail → 216.198.79.1
- [ ] Adicionar A record: webmail → 216.198.79.1
- [ ] Adicionar MX record: @ → mail.flipcars.us (prioridade 0)
- [ ] Adicionar TXT record: @ → v=spf1... (opcional)
- [ ] Salvar todas as mudanças

### **Aguardar e Testar:**
- [ ] Aguardar 30 min - 2 horas
- [ ] Verificar propagação: whatsmydns.net
- [ ] Testar webmail: https://webmail.flipcars.us
- [ ] Tentar login: auto@flipcars.us / Flip@2030*

### **Se Email Não Existir:**
- [ ] Acessar cPanel (flipcars.us:2083)
- [ ] Email Accounts → Create
- [ ] Criar: auto@flipcars.us / Flip@2030*
- [ ] Testar login novamente

### **Validação Final:**
- [ ] Webmail carrega sem erro DNS
- [ ] Login funciona
- [ ] Enviar email de teste (Gmail → auto@flipcars.us)
- [ ] Email chega em 5 min
- [ ] ✅ **TUDO FUNCIONANDO!**

---

## 🔗 LINKS RÁPIDOS

| Recurso | URL |
|---------|-----|
| **DNS Management** | https://dcc.godaddy.com/manage/flipcars.us/dns |
| **GoDaddy Products** | https://account.godaddy.com/products |
| **cPanel (estimado)** | https://flipcars.us:2083 |
| **Webmail** | https://webmail.flipcars.us |
| **Verificar Propagação** | https://www.whatsmydns.net |
| **Testar MX** | https://mxtoolbox.com |

---

## 📋 VALORES PARA COPIAR/COLAR

### **A Record - mail:**
```
Type: A
Host: mail
Points to: 216.198.79.1
TTL: 1 Hour
```

### **A Record - webmail:**
```
Type: A
Host: webmail
Points to: 216.198.79.1
TTL: 1 Hour
```

### **MX Record:**
```
Type: MX
Host: @
Points to: mail.flipcars.us
Priority: 0
TTL: 1 Hour
```

### **TXT Record (SPF):**
```
Type: TXT
Host: @
TXT Value: v=spf1 a mx ip4:216.198.79.1 ~all
TTL: 1 Hour
```

---

## 🎉 DEPOIS DE CONFIGURAR

**Me avise quando:**
1. ✅ Adicionou os 4 registros DNS
2. ⏱️ Aguardou 30+ minutos
3. 🧪 Testou o webmail

**Eu te ajudo com:**
- ✅ Verificar se propagou
- ✅ Recriar email no cPanel (se necessário)
- ✅ Configurar cliente de email (Outlook, Gmail, etc)
- ✅ Resolver qualquer problema que aparecer

---

**CRIADO EM:** 11/11/2025  
**PROVEDOR:** GoDaddy  
**IP SERVIDOR:** 216.198.79.1  
**STATUS:** 📍 Pronto para configurar  
**PRÓXIMA AÇÃO:** Adicionar 4 registros DNS no GoDaddy
