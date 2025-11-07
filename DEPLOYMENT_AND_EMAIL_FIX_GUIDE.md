# 🚀 Guia de Deploy para Produção + Fix Email auto@flipcars.us

**Data:** 2025-11-07  
**Projeto:** FlipCars Admin Dashboard + Public Site  
**Feature Completa:** Free Estimate Form (Steps 1-5)

---

## 📋 ÍNDICE

1. [Deploy do Admin Dashboard](#1-deploy-do-admin-dashboard)
2. [Deploy do Site Público](#2-deploy-do-site-público)
3. [Fix Email auto@flipcars.us](#3-fix-email-autoflipcarsus)
4. [Verificações Pós-Deploy](#4-verificações-pós-deploy)
5. [Troubleshooting](#5-troubleshooting)

---

## 1. DEPLOY DO ADMIN DASHBOARD

### 1.1 Merge do Pull Request

**IMPORTANTE:** Primeiro, faça merge do PR #2 que contém todas as features do estimate form:

```bash
# 1. Acesse o GitHub
https://github.com/chazmarques-blip/Flipcars-site-e-admin/pull/2

# 2. Review as mudanças (última revisão)
- Step 1: Basic Info
- Step 2: Service Details (Insurance/Warranty)
- Step 2.5: Warranty Documents (NOVO - Mechanic only)
- Step 3: Photos (Bodyshop only)
- Step 3a: VIN (Bodyshop only)
- Step 4: Contact Preferences
- Step 5: Confirmation

# 3. Clique em "Merge Pull Request"
# 4. Escolha: "Squash and Merge" (recomendado para histórico limpo)
# 5. Confirme o merge
```

**Commits no PR #2:**
- `d0b9550b` - SVG diagrams + golden icons
- `7a1bec54` - Layout redesign to match bodyshop
- `3c8b427e` - Warranty documents step
- `a6f1b186` - Mirrored car angle icons
- ... (e outros)

---

### 1.2 Deploy no Vercel (Recomendado)

#### Opção A: Deploy via GitHub (Automático)

**1. Conecte o Repositório ao Vercel:**

```bash
# Acesse: https://vercel.com
# Login com GitHub
# Clique em "Add New Project"
# Selecione o repositório: Flipcars-site-e-admin
```

**2. Configure o Projeto:**

```json
{
  "name": "flipcars-admin",
  "framework": "nextjs",
  "buildCommand": "cd frontend-admin && npm run build",
  "outputDirectory": "frontend-admin/.next",
  "installCommand": "cd frontend-admin && npm install",
  "rootDirectory": "./",
  "environmentVariables": {
    "NEXT_PUBLIC_API_URL": "https://api.flipcars.us",
    "NODE_ENV": "production"
  }
}
```

**3. Deploy Automático:**
- Cada push para `main` fará deploy automático
- Preview deployments para PRs
- Rollback com 1 clique

---

#### Opção B: Deploy Manual via CLI

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy do Admin Dashboard
cd /home/user/webapp/frontend-admin
vercel --prod

# 4. Siga o wizard:
# - Setup and deploy: Yes
# - Which scope: Sua conta/org
# - Link to existing project: No (primeira vez)
# - Project name: flipcars-admin
# - Directory: ./frontend-admin
# - Build command: npm run build
# - Output directory: .next
# - Environment variables: Configure conforme necessário
```

---

### 1.3 Configuração de Domínio Personalizado

**No Vercel Dashboard:**

```bash
# 1. Vá para o projeto flipcars-admin
# 2. Settings → Domains
# 3. Adicione: admin.flipcars.us
# 4. Configure DNS:
```

**DNS Records (em seu provedor de DNS):**

```
Type: CNAME
Name: admin
Value: cname.vercel-dns.com
TTL: 3600
```

**Ou se usar Vercel DNS:**

```
Type: A
Name: admin
Value: 76.76.21.21
TTL: 3600
```

---

### 1.4 Variáveis de Ambiente (Production)

**Arquivo `.env.production` (ou configure no Vercel):**

```bash
# API
NEXT_PUBLIC_API_URL=https://api.flipcars.us
NEXT_PUBLIC_API_TIMEOUT=30000

# Authentication
NEXT_PUBLIC_AUTH_DOMAIN=flipcars.us
NEXTAUTH_URL=https://admin.flipcars.us
NEXTAUTH_SECRET=<generate-strong-secret-here>

# Firebase (se usar)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=flipcars-prod

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Features
NEXT_PUBLIC_ENABLE_AI_CHAT=true
NEXT_PUBLIC_ENABLE_ESTIMATE_FORM=true

# Email (para notificações)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=auto@flipcars.us
SMTP_PASS=<your-app-password>
SMTP_FROM=auto@flipcars.us
```

---

## 2. DEPLOY DO SITE PÚBLICO

### 2.1 Configuração Similar ao Admin

**Vercel Project Settings:**

```json
{
  "name": "flipcars-public",
  "framework": "nextjs",
  "buildCommand": "cd frontend-public && npm run build",
  "outputDirectory": "frontend-public/.next",
  "installCommand": "cd frontend-public && npm install",
  "rootDirectory": "./"
}
```

**Domínio:**
- Principal: `flipcars.us` ou `www.flipcars.us`

---

## 3. FIX EMAIL auto@flipcars.us

### 3.1 Diagnóstico do Problema

**Causa Provável:**
Quando você migrou o site para `flipcars.us`, os registros DNS (especialmente MX records) podem ter sido alterados ou removidos.

---

### 3.2 Verificar Configuração Atual

#### Passo 1: Verificar DNS MX Records

```bash
# No terminal, verifique os MX records atuais:
nslookup -type=MX flipcars.us

# Ou use:
dig flipcars.us MX

# Ou online:
# https://mxtoolbox.com/SuperTool.aspx?action=mx%3aflipcars.us
```

**Output Esperado (exemplo com Gmail/Google Workspace):**
```
flipcars.us    MX preference = 1, mail exchanger = smtp.google.com
flipcars.us    MX preference = 5, mail exchanger = smtp2.google.com
```

**Se não houver MX records, o email NÃO FUNCIONA!**

---

### 3.3 Identificar Provedor de Email

**Você usa qual provedor?**

1. **Google Workspace (antigo G Suite):**
   - MX records apontam para `google.com`
   - Admin: https://admin.google.com

2. **Microsoft 365 / Outlook:**
   - MX records apontam para `outlook.com` ou `protection.outlook.com`
   - Admin: https://admin.microsoft.com

3. **cPanel / Hosting tradicional:**
   - MX records apontam para seu servidor
   - Ex: `mail.flipcars.us` ou IP do servidor

4. **SendGrid / Mailgun / AWS SES:**
   - Requer configuração especial

---

### 3.4 Restaurar Configuração de Email

#### Cenário A: Google Workspace

**1. Login no Google Workspace Admin:**
```
https://admin.google.com
```

**2. Verifique se o domínio está ativo:**
- Account → Domains
- Verifique se `flipcars.us` está listado
- Status deve ser "Active"

**3. Verifique MX Records:**
- Apps → Google Workspace → Gmail → MX records
- Copie os MX records corretos

**4. Configure no seu provedor DNS:**

```
# MX Records do Google Workspace:
Priority 1:  ASPMX.L.GOOGLE.COM
Priority 5:  ALT1.ASPMX.L.GOOGLE.COM
Priority 5:  ALT2.ASPMX.L.GOOGLE.COM
Priority 10: ALT3.ASPMX.L.GOOGLE.COM
Priority 10: ALT4.ASPMX.L.GOOGLE.COM
```

**5. Adicione SPF Record:**
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.google.com ~all
TTL: 3600
```

**6. Adicione DMARC Record:**
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:auto@flipcars.us
TTL: 3600
```

**7. Adicione DKIM (opcional mas recomendado):**
- Gere no Google Workspace Admin
- Adicione o TXT record fornecido

---

#### Cenário B: Microsoft 365

**1. Login no Microsoft 365 Admin:**
```
https://admin.microsoft.com
```

**2. Vá para Settings → Domains:**
- Selecione `flipcars.us`
- Verifique status

**3. Configure MX Records:**
```
Priority: 0
Value: flipcars-us.mail.protection.outlook.com
TTL: 3600
```

**4. SPF Record:**
```
Type: TXT
Name: @
Value: v=spf1 include:spf.protection.outlook.com -all
TTL: 3600
```

---

#### Cenário C: cPanel / Hosting Tradicional

**1. Login no cPanel:**
```
https://seu-hosting.com:2083
```

**2. Email Accounts:**
- Verifique se `auto@flipcars.us` existe
- Se não, crie a conta

**3. MX Records:**
```
Priority: 0
Value: mail.flipcars.us (ou IP do servidor)
TTL: 3600
```

**4. SPF Record:**
```
Type: TXT
Name: @
Value: v=spf1 a mx ip4:SEU.IP.AQUI ~all
TTL: 3600
```

---

### 3.5 Onde Configurar DNS Records

**Opção 1: Cloudflare (Recomendado)**

```bash
# 1. Login: https://dash.cloudflare.com
# 2. Selecione: flipcars.us
# 3. DNS → Records
# 4. Adicione os MX, SPF, DKIM, DMARC records
# 5. Proxy status: DNS only (cinza) para MX records
```

**Opção 2: Vercel DNS**

```bash
# 1. https://vercel.com
# 2. Seu projeto → Settings → Domains
# 3. flipcars.us → DNS Records
# 4. Adicione os records
```

**Opção 3: GoDaddy / Namecheap / Outro Registrar**

```bash
# 1. Login no seu registrar
# 2. Manage DNS / DNS Settings
# 3. Adicione os records
```

---

### 3.6 Teste a Configuração de Email

#### Teste 1: Verificar MX Records

```bash
# Terminal:
nslookup -type=MX flipcars.us

# Deve mostrar os MX records configurados
# Aguarde até 24h para propagação (geralmente 1-4h)
```

#### Teste 2: Enviar Email de Teste

```bash
# Use um cliente de email ou:
echo "Test email from auto@flipcars.us" | mail -s "Test" seu-email@gmail.com

# Ou teste online:
# https://mxtoolbox.com/diagnostic.aspx
```

#### Teste 3: Verificar SPF/DKIM/DMARC

```bash
# Use:
https://mxtoolbox.com/SuperTool.aspx

# Testes:
# - SPF Record Lookup
# - DKIM Record Lookup
# - DMARC Record Lookup
```

---

### 3.7 Configurar Aplicação para Enviar Emails

**No código do Admin Dashboard / Backend:**

```typescript
// backend/src/modules/email/email.service.ts

import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST, // smtp.gmail.com ou seu servidor
  port: parseInt(process.env.SMTP_PORT), // 587 (TLS) ou 465 (SSL)
  secure: process.env.SMTP_PORT === '465', // true para 465, false para 587
  auth: {
    user: process.env.SMTP_USER, // auto@flipcars.us
    pass: process.env.SMTP_PASS, // App Password (não sua senha normal!)
  },
});

// Enviar email
await transporter.sendMail({
  from: '"FlipCars" <auto@flipcars.us>',
  to: 'customer@example.com',
  subject: 'Estimate Request Received',
  html: '<p>Thank you for your estimate request...</p>',
});
```

**Google Workspace - App Password:**
```
1. https://myaccount.google.com/apppasswords
2. Gere um App Password para "Mail"
3. Use esse password no SMTP_PASS (não sua senha normal)
```

---

## 4. VERIFICAÇÕES PÓS-DEPLOY

### 4.1 Checklist Admin Dashboard

```bash
# 1. URL funciona
✓ https://admin.flipcars.us carrega

# 2. SSL/HTTPS ativo
✓ Certificado válido (cadeado verde)

# 3. Funcionalidades testadas:
✓ Login/Authentication
✓ Dashboard carrega
✓ Estimate Form (todos os 5 steps)
  - Step 1: Basic Info
  - Step 2: Service Details
  - Step 2.5: Warranty Docs (mechanic)
  - Step 3: Photos (bodyshop)
  - Step 4: Contact
  - Step 5: Confirmation
✓ Lead Management
✓ Email notifications funcionam

# 4. Performance
✓ Lighthouse Score > 90
✓ Tempo de carregamento < 3s
```

---

### 4.2 Checklist Email

```bash
# 1. MX Records corretos
✓ nslookup -type=MX flipcars.us mostra records

# 2. SPF configurado
✓ nslookup -type=TXT flipcars.us mostra SPF

# 3. DKIM configurado (se aplicável)
✓ DKIM record presente

# 4. Enviar email teste
✓ Email enviado com sucesso
✓ Email NÃO cai em spam
✓ Email recebido em tempo < 1min

# 5. Receber email teste
✓ Email para auto@flipcars.us funciona
✓ Email aparece na caixa de entrada
```

---

## 5. TROUBLESHOOTING

### 5.1 Problema: Deploy Falha no Vercel

**Erro comum: Build failed**

```bash
# Solução:
# 1. Verifique logs no Vercel Dashboard
# 2. Build localmente primeiro:
cd frontend-admin
npm run build

# 3. Se build local funciona, problema é nas env vars
# 4. Configure todas as env vars necessárias no Vercel
```

---

### 5.2 Problema: Email Não Envia

**Checklist:**

```bash
# 1. MX records corretos?
nslookup -type=MX flipcars.us

# 2. SPF record correto?
nslookup -type=TXT flipcars.us

# 3. Credenciais SMTP corretas?
# - User: auto@flipcars.us
# - Pass: App Password (não senha normal)
# - Host: smtp.gmail.com (ou seu servidor)
# - Port: 587 (TLS) ou 465 (SSL)

# 4. Firewall bloqueando?
# - Verifique se porta 587/465 está aberta

# 5. Teste com telnet:
telnet smtp.gmail.com 587
# Deve conectar (output: Connected to...)
```

---

### 5.3 Problema: Email Cai em Spam

**Soluções:**

```bash
# 1. Configure SPF corretamente
v=spf1 include:_spf.google.com ~all

# 2. Configure DKIM
# Gere no Google Workspace e adicione TXT record

# 3. Configure DMARC
v=DMARC1; p=none; rua=mailto:auto@flipcars.us

# 4. Aqueça o domínio (warm-up)
# Envie poucos emails por dia no início (10-20)
# Aumente gradualmente (50, 100, 200...)

# 5. Conteúdo do email
# - Não use palavras spam (FREE, WIN, URGENT)
# - Inclua unsubscribe link
# - Balanceie texto/imagens
```

---

### 5.4 Problema: Domínio Não Propaga

**DNS ainda não propagou:**

```bash
# 1. Verifique propagação global:
https://www.whatsmydns.net/#A/flipcars.us

# 2. Aguarde até 24-48h (geralmente 1-4h)

# 3. Limpe cache DNS local:
# Windows:
ipconfig /flushdns

# Mac:
sudo killall -HUP mDNSResponder

# Linux:
sudo systemd-resolve --flush-caches

# 4. Use DNS público temporariamente:
# Google DNS: 8.8.8.8 / 8.8.4.4
# Cloudflare DNS: 1.1.1.1 / 1.0.0.1
```

---

## 📞 SUPORTE

### Recursos Úteis:

1. **Vercel Docs:** https://vercel.com/docs
2. **Next.js Deployment:** https://nextjs.org/docs/deployment
3. **Email Testing:** https://mxtoolbox.com
4. **DNS Testing:** https://www.whatsmydns.net
5. **SSL Testing:** https://www.ssllabs.com/ssltest/

### Contatos de Emergência:

- **Vercel Support:** https://vercel.com/support
- **Google Workspace Support:** https://support.google.com
- **Cloudflare Support:** https://support.cloudflare.com

---

## ✅ PRÓXIMOS PASSOS

### Após Deploy e Email Funcionando:

1. **Monitoramento:**
   - Configure Sentry para error tracking
   - Configure Google Analytics
   - Configure Vercel Analytics

2. **Backups:**
   - Configure backup automático do banco
   - Backup dos emails importantes

3. **Performance:**
   - Otimize imagens (WebP, lazy loading)
   - Configure CDN (Cloudflare)
   - Monitore Core Web Vitals

4. **Segurança:**
   - Configure rate limiting
   - WAF (Web Application Firewall)
   - DDoS protection
   - Regular security audits

---

**Última Atualização:** 2025-11-07  
**Autor:** AI Development Team  
**Status:** Pronto para produção ✅
