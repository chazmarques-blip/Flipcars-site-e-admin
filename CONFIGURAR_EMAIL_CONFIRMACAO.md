# 📧 CONFIGURAR E-MAIL DE CONFIRMAÇÃO - FlipCars

## ✅ BOA NOTÍCIA: EMAIL JÁ ESTÁ IMPLEMENTADO!

O código para envio de e-mail de confirmação **já está implementado** e funcionando! 🎉

**Localização:** `backend/src/modules/leads/leads.service.ts` (linhas 408-422)

Após criar um lead, o sistema automaticamente:
1. ✅ Cria o lead no banco de dados
2. ✅ Gera número de referência (ex: FLIP-20241203-0001)
3. ✅ Cria appointment automaticamente (se data selecionada)
4. ✅ **Envia e-mail de confirmação para o cliente**

---

## 📨 CONTEÚDO DO EMAIL

O e-mail enviado contém:

### **Assunto:**
```
Estimate Request Confirmation - FLIP-20241203-0001
```

### **Conteúdo:**
- ✅ Número de referência destacado
- ✅ Dados do cliente (nome, telefone, email)
- ✅ Informações do veículo
- ✅ Data preferida do agendamento
- ✅ Serviços selecionados (se mechanic)
- ✅ Próximos passos (What Happens Next)
- ✅ Localização da loja com mapa do Google Maps
- ✅ Horário de funcionamento
- ✅ Design profissional com cores FlipCars (preto/dourado)

**Código:** `backend/src/modules/email/email.service.ts` (linhas 164-316)

---

## ⚙️ CONFIGURAÇÃO SMTP NO RAILWAY

Para que os e-mails sejam enviados, você precisa configurar as credenciais SMTP no Railway.

### **Passo 1: Acessar Railway Dashboard**
```
🔗 https://railway.app/dashboard
```

### **Passo 2: Ir para Variáveis de Ambiente**
1. Selecione projeto: **FlipCars Backend**
2. Clique no serviço: **backend**
3. Clique na aba: **"Variables"**

### **Passo 3: Adicionar Variáveis SMTP**

Adicione as seguintes variáveis:

#### **Opção A: Gmail (Recomendado para desenvolvimento/teste)**

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app-gmail
SMTP_FROM="FlipCars Auto Repair" <noreply@flipcars.us>
```

**⚠️ IMPORTANTE:** 
- Não use sua senha normal do Gmail!
- Use uma **"App Password"** (Senha de aplicativo)
- Como criar: https://myaccount.google.com/apppasswords

#### **Opção B: SendGrid (Recomendado para produção)**

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SMTP_FROM="FlipCars Auto Repair" <noreply@flipcars.us>
```

**Como obter API Key do SendGrid:**
1. Crie conta gratuita em: https://sendgrid.com/
2. Plano gratuito: 100 emails/dia
3. Settings → API Keys → Create API Key

#### **Opção C: Mailgun (Alternativa)**

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@mg.flipcars.us
SMTP_PASS=sua-senha-mailgun
SMTP_FROM="FlipCars Auto Repair" <noreply@mg.flipcars.us>
```

### **Passo 4: Redeploy do Railway**

Após adicionar as variáveis:
1. No Railway, clique nos **3 pontos (⋯)**
2. Selecione: **"Redeploy"**
3. Aguarde 2-3 minutos

---

## 🧪 TESTAR ENVIO DE EMAIL

### **Teste 1: Criar Novo Lead**

1. Acesse: https://flipcars.us
2. Clique em: **"Book Oil Change Now! Only $39.99 !!"**
3. Preencha o formulário completo
4. **USE SEU E-MAIL PESSOAL** para receber o teste
5. Finalize o formulário

### **Teste 2: Verificar Logs do Railway**

1. No Railway, clique na aba: **"Deployments"**
2. Clique no deployment mais recente
3. Busque nos logs por: `📧 Sending printable confirmation email`

**Logs esperados (sucesso):**
```
[LeadsService] 📧 Sending printable confirmation email to: cliente@example.com
[EmailService] 📤 Sending email to cliente@example.com
[EmailService] ✅ Email sent successfully! MessageId: <xxx@gmail.com>
[LeadsService] ✅ Printable confirmation email sent successfully to cliente@example.com
```

**Logs esperados (SMTP não configurado):**
```
[EmailService] ⚠️ SMTP not configured. Skipping email send.
[LeadsService] ⚠️ Failed to send confirmation email to cliente@example.com
```

### **Teste 3: Verificar Inbox do Cliente**

1. Verifique a caixa de entrada do email usado no formulário
2. Busque por: "Estimate Request Confirmation"
3. Verifique também a pasta de **SPAM**

---

## 🐛 TROUBLESHOOTING

### **Problema: Email não chega**

**Causa 1: SMTP não configurado**
- Verifique as variáveis de ambiente no Railway
- Certifique-se de que `SMTP_USER` e `SMTP_PASS` estão preenchidos
- Faça redeploy do Railway após adicionar variáveis

**Causa 2: Senha incorreta (Gmail)**
- Se usar Gmail, use **App Password**, não sua senha normal
- Crie em: https://myaccount.google.com/apppasswords

**Causa 3: Email vai para SPAM**
- Normal em ambientes de teste
- Verifique pasta de SPAM
- Para produção, configure domínio próprio (ex: noreply@flipcars.us)

**Causa 4: Limite de envio atingido**
- Gmail: 500 emails/dia (conta gratuita)
- SendGrid: 100 emails/dia (plano free)
- Mailgun: 5,000 emails/mês (plano free)

### **Problema: Erro no Railway Logs**

```
[EmailService] ❌ Failed to send email: Invalid login
```
**Solução:** Senha SMTP incorreta. Verifique credenciais.

```
[EmailService] ❌ Failed to send email: Email timeout after 5 seconds
```
**Solução:** Problema de conexão SMTP. Verifique host e porta.

---

## 📊 FLUXO COMPLETO DO EMAIL

```
1. Cliente preenche formulário → https://flipcars.us
2. Frontend envia dados → Backend API
3. Backend cria Lead → Banco de dados
4. Backend cria Appointment (se data selecionada)
5. Backend envia email → Cliente
   ├─ SMTP configurado? ✅ → Email enviado
   └─ SMTP não configurado? ❌ → Log de warning
6. Cliente recebe email de confirmação
```

---

## 🎨 PREVIEW DO EMAIL

O email tem design profissional com:

```
┌────────────────────────────────────────┐
│   🎯 ESTIMATE REQUEST CONFIRMED        │
│   Auto Repair Service                  │
├────────────────────────────────────────┤
│                                        │
│   Dear John Doe,                       │
│                                        │
│   Your Reference Number                │
│   FLIP-20241203-0001                   │
│   (Please save this for your records)  │
│                                        │
│   Request Details:                     │
│   • Submitted: December 3, 2024        │
│   • Vehicle: 2020 Honda Civic          │
│   • Date: December 10, 2024 (Morning)  │
│   • Phone: (321) 960-8661              │
│                                        │
│   What Happens Next?                   │
│   1. Review - Within 1 hour            │
│   2. Contact - Via your preferred method│
│   3. Service - Confirm appointment     │
│                                        │
│   📍 Our Location                      │
│   [Google Maps embed]                  │
│   5200 Old Winter Garden Rd, Suite 110A│
│   Orlando, FL 32811                    │
│                                        │
└────────────────────────────────────────┘
```

---

## ✅ CHECKLIST DE CONFIGURAÇÃO

- [ ] Acessou Railway Dashboard
- [ ] Adicionou variáveis SMTP (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM)
- [ ] Executou redeploy do Railway
- [ ] Verificou logs - sem erros de SMTP
- [ ] Criou lead de teste com seu email pessoal
- [ ] Recebeu email de confirmação (verificou SPAM)
- [ ] Email contém número de referência
- [ ] Email contém dados corretos do lead

---

## 🔗 LINKS ÚTEIS

- **Railway Dashboard:** https://railway.app/dashboard
- **Gmail App Passwords:** https://myaccount.google.com/apppasswords
- **SendGrid Sign Up:** https://sendgrid.com/
- **Mailgun Sign Up:** https://www.mailgun.com/
- **Código Email Service:** `/backend/src/modules/email/email.service.ts`
- **Código Leads Service:** `/backend/src/modules/leads/leads.service.ts`

---

## 🆘 SUPORTE

Se precisar de ajuda:
1. Tire screenshot dos logs do Railway (busque por "📧 Sending")
2. Verifique se recebeu email (inclua SPAM)
3. Envie as variáveis de ambiente configuradas (sem revelar senhas)
4. Me avise e eu ajudo a resolver!

---

**Criado em:** 2024-12-03  
**Última atualização:** 2024-12-03  
**Status:** ✅ EMAIL JÁ IMPLEMENTADO - APENAS CONFIGURAR SMTP
