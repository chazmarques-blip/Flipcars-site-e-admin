# 📧 CREDENCIAIS DE EMAIL - FLIPCARS

**Data de criação**: 11/11/2025  
**Domínio**: flipcars.us  
**Provedor de Email**: cPanel (Hospedagem)  
**Provedor de Domínio**: GoDaddy  
**IP do Servidor**: 216.198.79.1

---

## 🔐 CONTAS DE EMAIL CONFIGURADAS

### 1. **EMAIL PRINCIPAL (Automático/Notificações)**

```
Email: auto@flipcars.us
Senha: Flip@2030*
Uso: Envio automático de confirmações e notificações do sistema
```

**Webmail**: https://webmail.flipcars.us  
**Configuração SMTP** (para envio):
```
Host: mail.flipcars.us
Port: 465 (SSL) ou 587 (TLS)
Encryption: SSL/TLS
Username: auto@flipcars.us
Password: Flip@2030*
```

**Configuração IMAP** (para recebimento):
```
Host: mail.flipcars.us
Port: 993 (SSL)
Encryption: SSL/TLS
Username: auto@flipcars.us
Password: Flip@2030*
```

---

### 2. **EMAIL DE CONTATO (Público)**

```
Email: info@flipcars.us
Uso: Contato público exibido no site (footer, página de contato)
Status: Pode precisar ser criado no cPanel
```

**Onde aparece**:
- ✅ Footer do site: `info@flipcars.us`
- ✅ Página de contato: `/contact`
- ✅ Tipos TypeScript: `estimate.ts`

**Configuração** (se criar):
```
Webmail: https://webmail.flipcars.us
Username: info@flipcars.us
Password: [Definir senha segura]
SMTP/IMAP: Usar mesmas configurações do auto@flipcars.us
```

---

## 🌐 ACESSO AO WEBMAIL

### **URL Principal:**
```
https://webmail.flipcars.us
```

### **URL Completa (com sessão):**
```
https://webmail.flipcars.us/cpsess7054899248/3rdparty/roundcube/?_task=mail&_mbox=INBOX
```

### **Interface:**
- **Roundcube** (cliente de email web moderno)
- Acesso via browser
- Funciona em desktop e mobile

---

## 🛠️ ACESSO AO cPANEL

### **Para Criar/Gerenciar Contas de Email:**

**URL Estimada:**
```
https://flipcars.us:2083
OU
https://216.198.79.1:2083
```

**Credenciais:**
```
Username: [Usuário cPanel principal - não é email]
Password: [Senha cPanel principal - não é Flip@2030*]
```

**Nota**: O acesso cPanel é diferente do acesso email. Se não souber, contate o suporte da hospedagem.

---

## 📍 CONFIGURAÇÃO DNS NECESSÁRIA

Para o email funcionar corretamente, estes registros DNS devem estar configurados no GoDaddy:

### **1. MX Record (Roteamento de Email)**
```
Type: MX
Host: @ (ou deixar vazio)
Points to: mail.flipcars.us
Priority: 0
TTL: 1 Hour
```

### **2. A Record para Mail Server**
```
Type: A
Host: mail
Points to: 216.198.79.1
TTL: 1 Hour
```

### **3. A Record para Webmail**
```
Type: A
Host: webmail
Points to: 216.198.79.1
TTL: 1 Hour
```

### **4. SPF Record (Prevenir Spam)**
```
Type: TXT
Host: @ (ou deixar vazio)
TXT Value: v=spf1 a mx ip4:216.198.79.1 ~all
TTL: 1 Hour
```

**Status atual**: ⚠️ Pode precisar ser reconfigurado (ver guia `GUIA_GODADDY_EMAIL_DNS.md`)

---

## 📱 CONFIGURAÇÃO EM CLIENTES DE EMAIL

### **Outlook / Thunderbird / Apple Mail / Gmail App**

#### **Servidor de Entrada (IMAP):**
```
Servidor: mail.flipcars.us
Porta: 993
Segurança: SSL/TLS
Nome de usuário: auto@flipcars.us (ou info@flipcars.us)
Senha: Flip@2030* (ou senha configurada)
```

#### **Servidor de Saída (SMTP):**
```
Servidor: mail.flipcars.us
Porta: 465 (SSL) ou 587 (TLS)
Segurança: SSL/TLS
Autenticação: Sim
Nome de usuário: auto@flipcars.us (ou info@flipcars.us)
Senha: Flip@2030* (ou senha configurada)
```

---

## 🔧 CRIAR NOVA CONTA DE EMAIL (info@flipcars.us)

### **Passos no cPanel:**

1. **Login cPanel:**
   - URL: https://flipcars.us:2083
   - Username/Password do cPanel

2. **Ir para Email Accounts:**
   - Seção: **"EMAIL"**
   - Clique: **"Email Accounts"**

3. **Criar Nova Conta:**
   - Botão: **"+ Create"**

4. **Preencher:**
   ```
   Email: info
   Domain: flipcars.us (selecionar dropdown)
   Password: [Criar senha forte, ex: Info@Flip2030!]
   Storage Space: 250 MB (ou Unlimited)
   Send welcome email: Não
   ```

5. **Salvar:**
   - Clique: **"Create"**
   - ✅ Email criado!

6. **Testar:**
   - Acesse: https://webmail.flipcars.us
   - Login: info@flipcars.us / [senha criada]

---

## 📊 INTEGRAÇÃO COM APLICAÇÃO

### **Backend (Node.js/NestJS)**

**Arquivo**: `backend/.env.production`

```env
# Email Configuration
SMTP_HOST=mail.flipcars.us
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=auto@flipcars.us
SMTP_PASS=Flip@2030*
SMTP_FROM_NAME=FlipCars
SMTP_FROM_EMAIL=auto@flipcars.us

# Contact Email (usado para "Reply-To")
CONTACT_EMAIL=info@flipcars.us
```

### **Frontend (Next.js)**

Os emails são exibidos nos componentes:

- **Footer**: `frontend-public/src/components/layout/Footer.tsx`
- **Contact Page**: `frontend-public/src/app/contact/page.tsx`
- **Types**: `frontend-public/src/types/estimate.ts`

---

## 🚨 TROUBLESHOOTING

### **Problema 1: Email não envia**

**Verificar**:
1. ✅ DNS MX records configurados?
2. ✅ Conta existe no cPanel?
3. ✅ Senha correta?
4. ✅ SMTP configurado no backend?

**Solução**: Ver guia `DEPLOY_TROUBLESHOOTING.md`

---

### **Problema 2: Email não recebe**

**Verificar**:
1. ✅ MX records apontam para `mail.flipcars.us`?
2. ✅ Propagação DNS completa? (24-48h)
3. ✅ Caixa de entrada não está cheia?
4. ✅ Email existe no cPanel?

**Teste**:
```bash
# Verificar MX records
https://mxtoolbox.com/SuperTool.aspx?action=mx%3aflipars.us
```

---

### **Problema 3: Webmail não carrega**

**Erro**: "DNS_PROBE_FINISHED_NXDOMAIN"

**Causa**: DNS não aponta para servidor correto

**Solução**:
1. Adicionar A record: `webmail → 216.198.79.1`
2. Aguardar propagação (2-24h)
3. Limpar cache DNS: `ipconfig /flushdns` (Windows)

---

### **Problema 4: "Mailbox doesn't exist"**

**Causa**: Conta foi deletada ou nunca foi criada

**Solução**:
1. Acessar cPanel
2. Email Accounts → Create
3. Criar conta novamente
4. Testar login

---

## 📞 SUPORTE

### **Hospedagem (cPanel/Email):**

**GoDaddy Support:**
```
Telefone: 0800-761-1680 (Brasil)
Chat: https://www.godaddy.com/contact-us
Email: support@godaddy.com
Horário: 24/7
```

**O que dizer:**
```
"Preciso de ajuda com configuração de email para domínio flipcars.us.
Meu email auto@flipcars.us parou de funcionar após reconfigurar DNS.
Podem me ajudar a verificar se a conta existe no cPanel e 
configurar os MX records corretamente?"
```

---

### **Domínio (DNS/GoDaddy):**

**GoDaddy DNS Management:**
```
URL: https://dcc.godaddy.com/manage/flipcars.us/dns
```

**Verificar registros**:
- MX record aponta para `mail.flipcars.us`?
- A records para `mail` e `webmail` existem?

---

## 🔗 LINKS ÚTEIS

| Recurso | URL | Descrição |
|---------|-----|-----------|
| **Webmail** | https://webmail.flipcars.us | Acesso web aos emails |
| **cPanel** | https://flipcars.us:2083 | Gerenciar contas de email |
| **GoDaddy DNS** | https://dcc.godaddy.com/manage/flipcars.us/dns | Configurar registros DNS |
| **MX Toolbox** | https://mxtoolbox.com | Testar configuração email |
| **What's My DNS** | https://www.whatsmydns.net | Verificar propagação DNS |
| **Guia DNS** | GUIA_GODADDY_EMAIL_DNS.md | Guia completo configuração |

---

## 📋 CHECKLIST DE VERIFICAÇÃO

### **Email Funcionando?**

- [ ] Webmail carrega: https://webmail.flipcars.us
- [ ] Login funciona: auto@flipcars.us / Flip@2030*
- [ ] Recebe emails (teste de outro provedor)
- [ ] Envia emails (teste para Gmail/Outlook)
- [ ] DNS MX configurado no GoDaddy
- [ ] A records (mail, webmail) configurados
- [ ] Backend consegue enviar emails (confirmações)

### **Contas Criadas?**

- [x] auto@flipcars.us - ✅ EXISTE
- [ ] info@flipcars.us - ⚠️ VERIFICAR SE EXISTE

---

## 🎯 RESUMO RÁPIDO

### **Para Acessar Email:**
```
URL: https://webmail.flipcars.us
Email: auto@flipcars.us
Senha: Flip@2030*
```

### **Para Criar Novo Email:**
```
1. Acessar: https://flipcars.us:2083 (cPanel)
2. Email Accounts → Create
3. Preencher: info@flipcars.us + senha
4. Testar no webmail
```

### **Para Configurar DNS:**
```
1. Acessar: https://dcc.godaddy.com/manage/flipcars.us/dns
2. Adicionar 4 registros (ver GUIA_GODADDY_EMAIL_DNS.md)
3. Aguardar propagação (1-24h)
4. Testar email
```

---

## 📝 HISTÓRICO

**11/11/2025**:
- ✅ Configurado `auto@flipcars.us` com senha `Flip@2030*`
- ✅ Identificado IP servidor: `216.198.79.1`
- ✅ Documentado configurações DNS necessárias
- ⚠️ Email parou de funcionar após alteração DNS (em investigação)
- ✅ Criado guia de configuração GoDaddy
- ✅ Documentado acesso webmail e cPanel

---

## ⚡ AÇÕES IMEDIATAS SE EMAIL NÃO FUNCIONAR

1. **Verificar DNS** → https://mxtoolbox.com (buscar `flipcars.us`)
2. **Acessar GoDaddy** → Adicionar MX/A records (ver guia)
3. **Testar Webmail** → https://webmail.flipcars.us
4. **Contatar Suporte** → GoDaddy (0800-761-1680)

---

**Última atualização**: 11/11/2025  
**Status**: 📧 DOCUMENTADO - Aguardando configuração DNS
**Próxima ação**: Configurar registros DNS no GoDaddy
