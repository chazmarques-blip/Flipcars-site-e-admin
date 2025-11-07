# 🚀 Deploy do Admin Dashboard - FlipInvest

**Data:** 2025-11-07  
**Domínio Alvo:** `admin.flipcars.us`  
**Projeto:** frontend-admin (Free Estimate Form completo)

---

## 📋 PRÉ-REQUISITOS

✅ **Já concluído:**
- [x] PR #2 mergeado com todos os recursos do Estimate Form
- [x] Código está na branch `main`
- [x] `vercel.json` criado em `/frontend-admin/`
- [x] Site público rodando em `www.flipcars.us`

❌ **Falta fazer:**
- [ ] Deploy do Admin Dashboard
- [ ] Configurar domínio `admin.flipcars.us`

---

## 🎯 OPÇÃO A: DEPLOY AUTOMÁTICO VIA VERCEL DASHBOARD (RECOMENDADO)

### Passo 1: Acessar Vercel

1. Abra: **https://vercel.com**
2. Clique em **"Login"**
3. Escolha **"Continue with GitHub"**
4. Autorize o Vercel a acessar seu repositório

---

### Passo 2: Criar Novo Projeto

1. No dashboard da Vercel, clique em **"Add New..."**
2. Selecione **"Project"**
3. Procure pelo repositório: **`Flipcars-site-e-admin`**
4. Clique em **"Import"**

---

### Passo 3: Configurar o Projeto

**IMPORTANTE:** Configure exatamente assim:

#### **General Settings:**

```
Project Name:           flipcars-admin
                        (ou flipinvest-admin)

Framework Preset:       Next.js
                        (deve detectar automaticamente)

Root Directory:         frontend-admin
                        ⚠️ CLIQUE EM "EDIT" E SELECIONE A PASTA
```

#### **Build & Development Settings:**

```
Build Command:          npm run build
                        (deixe o padrão)

Output Directory:       .next
                        (deixe o padrão)

Install Command:        npm install
                        (deixe o padrão)
```

#### **Environment Variables:**

Clique em **"Add Environment Variable"** e adicione:

```
Nome:                   NEXT_PUBLIC_API_URL
Valor:                  https://api.flipcars.us
Environment:            Production, Preview, Development (todos)
```

---

### Passo 4: Deploy Inicial

1. Clique em **"Deploy"**
2. Aguarde o build completar (2-5 minutos)
3. ✅ Você verá uma URL temporária: `https://flipcars-admin-xxx.vercel.app`

---

### Passo 5: Configurar Domínio Customizado

#### 5.1 Adicionar Domínio na Vercel

1. No projeto deployado, vá para **"Settings"**
2. No menu lateral, clique em **"Domains"**
3. Clique em **"Add Domain"**
4. Digite: **`admin.flipcars.us`**
5. Clique em **"Add"**

#### 5.2 Configurar DNS (Cloudflare, GoDaddy, etc.)

A Vercel mostrará as configurações necessárias. Você precisa adicionar um registro CNAME:

**No seu provedor de DNS (Cloudflare, GoDaddy, etc.):**

```
Tipo:       CNAME
Nome:       admin
Valor:      cname.vercel-dns.com
TTL:        Auto (ou 3600)
Proxy:      Desabilitado (se Cloudflare)
```

**OU (alternativa):**

```
Tipo:       A
Nome:       admin
Valor:      76.76.21.21
TTL:        Auto
```

#### 5.3 Verificar Domínio

1. Após adicionar o CNAME, volte para a Vercel
2. Clique em **"Refresh"** ou aguarde alguns minutos
3. ✅ Verá: **"Valid Configuration"**

---

### Passo 6: Testar o Admin Dashboard

Abra no navegador:

```
https://admin.flipcars.us
```

**Teste o Free Estimate Form:**

1. Clique no botão **"Get Free Estimate"** no topo
2. **Step 1:** Preencha informações básicas
3. **Step 2:** Selecione "Bodyshop Service" ou "Mechanic Service"
   - Se **Bodyshop:** verá Step 3 (Photos) com ícones dourados dos ângulos do carro
   - Se **Mechanic:** verá Step 2.5 (Warranty Docs) com 3 colunas (Policy, VIN, Odometer)
4. **Step 4:** Preencha preferências de contato
5. **Step 5:** Confirme e envie

**Verifique:**
- ✅ Ícones dourados dos ângulos do carro aparecem (driver/passenger front/rear)
- ✅ Diagrams SVG aparecem (VIN barcode, odometer gauge, policy document)
- ✅ Layout 3-colunas funciona no warranty docs
- ✅ Ícones de categoria brilham com efeito dourado quando selecionados
- ✅ Upload de arquivos funciona (PDF, JPG, PNG, WebP até 10MB)

---

## 🎯 OPÇÃO B: DEPLOY MANUAL VIA CLI

### Passo 1: Login no Vercel CLI

```bash
cd /home/user/webapp
npx vercel login
```

Siga as instruções no terminal (email de verificação).

---

### Passo 2: Deploy do Admin Dashboard

```bash
cd /home/user/webapp/frontend-admin
npx vercel --prod
```

**Durante o setup, responda:**

```
? Set up and deploy "~/webapp/frontend-admin"? [Y/n] Y
? Which scope do you want to deploy to? [Seu nome/organização]
? Link to existing project? [y/N] N
? What's your project's name? flipcars-admin
? In which directory is your code located? ./
```

---

### Passo 3: Adicionar Environment Variables

```bash
npx vercel env add NEXT_PUBLIC_API_URL production
# Cole quando solicitado: https://api.flipcars.us
```

---

### Passo 4: Configurar Domínio

```bash
npx vercel domains add admin.flipcars.us --scope [seu-scope]
```

Em seguida, configure o CNAME no DNS (mesmo processo da Opção A, Passo 5.2).

---

## 🔄 DEPLOYS AUTOMÁTICOS

Após o primeiro deploy com Opção A:

✅ **Cada push para `main` fará deploy automático**
✅ **Cada PR criará um preview deployment**
✅ **Rollback disponível no dashboard da Vercel**

---

## ✅ VERIFICAÇÃO PÓS-DEPLOY

### Checklist de Funcionalidades:

- [ ] **Admin Dashboard carrega:** `https://admin.flipcars.us`
- [ ] **Login funciona** (se aplicável)
- [ ] **Botão "Get Free Estimate" visível**
- [ ] **Estimate Form abre corretamente**
- [ ] **Step 1:** Campos de texto validam
- [ ] **Step 2:** Seleção de serviço funciona
- [ ] **Step 2 (Bodyshop):** Photos com ícones dourados
- [ ] **Step 2.5 (Mechanic):** Warranty docs com 3 colunas + SVG diagrams
- [ ] **Step 3 (Bodyshop):** VIN input com formato AAA-9999-X
- [ ] **Step 4:** Contact preferences salvas
- [ ] **Step 5:** Confirmação exibe dados corretos
- [ ] **Upload de arquivos:** PDF, JPG, PNG, WebP (max 10MB)
- [ ] **Ícones dourados:** Efeito de brilho quando selecionados
- [ ] **Responsivo:** Funciona em mobile (375px+)

### Checklist de Performance:

- [ ] **Lighthouse Score:** > 90
- [ ] **First Contentful Paint:** < 1.5s
- [ ] **Time to Interactive:** < 3s
- [ ] **Imagens otimizadas:** WebP com fallback
- [ ] **Fonts carregam rápido:** Preconnect para Google Fonts

---

## 🐛 TROUBLESHOOTING

### Erro: "Build Failed"

**Causa:** Dependências faltando ou erro de compilação TypeScript.

**Solução:**

```bash
cd /home/user/webapp/frontend-admin
npm install
npm run build
```

Se passar localmente, o problema pode ser environment variables faltando na Vercel.

---

### Erro: "Domain Configuration Invalid"

**Causa:** CNAME não configurado corretamente no DNS.

**Solução:**

1. Verifique se o CNAME aponta para `cname.vercel-dns.com`
2. Aguarde propagação DNS (até 48h, geralmente 5-30 minutos)
3. Use ferramentas:
   ```bash
   nslookup admin.flipcars.us
   dig admin.flipcars.us
   ```

---

### Erro: "Module not found: Can't resolve 'X'"

**Causa:** Dependência não instalada no servidor da Vercel.

**Solução:**

1. Verifique se a dependência está em `package.json` (não `devDependencies`)
2. Force rebuild:
   ```bash
   cd frontend-admin
   rm -rf .next node_modules
   npm install
   npx vercel --prod --force
   ```

---

### Imagens dos Ângulos do Carro Não Aparecem

**Causa:** Arquivos não estão no caminho correto `/public/images/car-angles/`.

**Solução:**

```bash
cd /home/user/webapp/frontend-admin
ls -la public/images/car-angles/
# Deve listar:
# driver-front-gold.jpg
# passenger-front-gold.jpg
# driver-rear-gold.jpg
# passenger-rear-gold.jpg
```

Se faltarem, copie do repositório:

```bash
git checkout main -- public/images/car-angles/
git add public/images/car-angles/
git commit -m "fix: add missing car angle images"
git push origin main
```

---

## 📞 SUPORTE

**Se algo der errado:**

1. **Vercel Logs:** https://vercel.com/[seu-projeto]/logs
2. **GitHub Actions:** https://github.com/chazmarques-blip/Flipcars-site-e-admin/actions
3. **Vercel Support:** https://vercel.com/support

---

## 🎉 PRÓXIMOS PASSOS

Após deploy bem-sucedido:

1. ✅ **Testar todos os fluxos do Estimate Form**
2. ✅ **Configurar email auto@flipcars.us** (sessão separada)
3. ✅ **Conectar com backend API**
4. ✅ **Configurar analytics (Google Analytics, Vercel Analytics)**
5. ✅ **Adicionar monitoring (Sentry, LogRocket)**

---

**Bom deploy! 🚀**
