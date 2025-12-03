# 🔍 Diagnóstico de Email - FlipCars

## 📋 CHECKLIST DE VERIFICAÇÃO

### **1. Verificar Logs do Railway**

**Acesse:** https://railway.app/dashboard
- Ir para: **FlipCars Backend** → **backend** → **Deployments**
- Clicar no deploy ativo (primeiro da lista)
- Procurar por mensagens de email:

#### **✅ Buscar por:**
```
📧 Sending printable confirmation email
✅ Email sent successfully
❌ Failed to send email
⚠️ SMTP not configured
```

---

### **2. Possíveis Problemas e Soluções**

#### **Problema 1: SMTP não configurado**
**Logs mostram:**
```
[EmailService] ⚠️ SMTP credentials not configured
[EmailService] Skipping email send
```

**Solução:**
Variáveis de ambiente não estão no Railway. Verificar em:
https://railway.app/dashboard → FlipCars Backend → backend → Variables

Deve ter:
- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=587`
- `SMTP_SECURE=false`
- `SMTP_USER=auto@flipcars.us`
- `SMTP_PASS=[App Password de 16 dígitos]`
- `SMTP_FROM="FlipCars Auto Repair" <auto@flipcars.us>`

---

#### **Problema 2: Invalid login (App Password errada)**
**Logs mostram:**
```
[EmailService] ❌ Failed to send email: Invalid login: 535-5.7.8 Username and Password not accepted
```

**Solução:**
1. Gerar nova App Password para `auto@flipcars.us`:
   - Acessar: https://myaccount.google.com/apppasswords
   - Login com `auto@flipcars.us`
   - Criar nova senha para "Mail" / "FlipCars Backend Railway"
   - Copiar senha de 16 dígitos (ex: `abcd efgh ijkl mnop`)
2. Atualizar `SMTP_PASS` no Railway
3. Redesploy

---

#### **Problema 3: Email timeout (mesmo com 30s)**
**Logs mostram:**
```
[EmailService] ❌ Failed to send email: Email timeout after 30 seconds
```

**Possíveis causas:**
- Porta 587 bloqueada no Railway
- Google bloqueando IP do Railway

**Solução alternativa - Usar porta 465 (SSL):**
No Railway Variables, mudar:
- `SMTP_PORT=465`
- `SMTP_SECURE=true`

---

#### **Problema 4: Google bloqueou acesso**
**Logs mostram:**
```
[EmailService] ❌ Failed to send email: Connection refused
```

**Solução:**
1. Verificar se 2FA está ativo em `auto@flipcars.us`
2. Verificar se App Password ainda é válida
3. Tentar fazer login manual no Gmail com `auto@flipcars.us` para desbloquear
4. Verificar em: https://myaccount.google.com/notifications
   - Pode ter notificação de "tentativa de login bloqueada"

---

#### **Problema 5: Email vai para spam**
**Logs mostram:**
```
[EmailService] ✅ Email sent successfully! MessageId: <...>
```

Mas você não recebe o email.

**Solução:**
1. Verificar pasta de **SPAM** no seu email
2. Verificar **Promoções** ou **Social** (Gmail)
3. Procurar por remetente: `auto@flipcars.us`

---

### **3. Teste Manual de SMTP**

Se os logs não estiverem claros, podemos testar SMTP diretamente:

**Criar arquivo de teste `test-email.js` no Railway:**
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.sendMail({
  from: process.env.SMTP_FROM,
  to: 'SEU_EMAIL_AQUI@example.com',
  subject: 'Teste SMTP - FlipCars',
  text: 'Email de teste funcionando!',
  html: '<h1>Teste SMTP</h1><p>Email de teste funcionando!</p>',
})
  .then((info) => {
    console.log('✅ Email enviado:', info.messageId);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro:', error);
    process.exit(1);
  });
```

---

### **4. Alternativa: Usar SendGrid (Recomendado para Produção)**

Se Gmail continuar com problemas, usar SendGrid:

1. **Criar conta:** https://sendgrid.com/
2. **Criar API Key:** Settings → API Keys → Create API Key
3. **No Railway, mudar variáveis:**
   - `SMTP_HOST=smtp.sendgrid.net`
   - `SMTP_PORT=587`
   - `SMTP_SECURE=false`
   - `SMTP_USER=apikey`
   - `SMTP_PASS=[Sua SendGrid API Key]`
   - `SMTP_FROM="FlipCars Auto Repair" <noreply@flipcars.us>`

4. **Verificar domínio no SendGrid:**
   - Settings → Sender Authentication
   - Authenticate Your Domain: `flipcars.us`
   - Seguir instruções para adicionar DNS records

---

## 🔗 LINKS ÚTEIS

- **Railway Dashboard:** https://railway.app/dashboard
- **Google App Passwords:** https://myaccount.google.com/apppasswords
- **Google Account Activity:** https://myaccount.google.com/notifications
- **SendGrid:** https://sendgrid.com/
- **Gmail SMTP Settings:** https://support.google.com/mail/answer/7126229

---

## 📝 PRÓXIMOS PASSOS

1. **Acessar Railway logs** e procurar mensagens de email
2. **Identificar o erro específico** (ver seção 2 acima)
3. **Aplicar a solução correspondente**
4. **Redesploy se necessário**
5. **Testar novamente criando novo lead**

---

**📸 ME ENVIE:**
1. Screenshot dos logs do Railway mostrando mensagens de email
2. Screenshot das variáveis de ambiente configuradas (esconder senha!)
3. Qual erro específico aparece nos logs?

---

**📅 Criado em:** 2024-12-03  
**🔗 Projeto:** FlipCars Auto Repair  
**🎯 Objetivo:** Diagnosticar e resolver problema de envio de email
