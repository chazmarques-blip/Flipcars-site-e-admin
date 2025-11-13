# 🎯 GUIA DE INSTALAÇÃO DO GOOGLE TAG MANAGER

## ✅ O QUE JÁ FOI FEITO NO CÓDIGO:

1. ✅ Componente `GoogleTagManager.tsx` criado
2. ✅ Integrado no layout do site público (`frontend-public`)
3. ✅ Integrado no layout do admin (`frontend-admin`)
4. ✅ Variáveis de ambiente preparadas (`.env.local`)

---

## 📋 PASSO 1: CRIAR CONTA NO GOOGLE TAG MANAGER

### 1.1 Acesse o Google Tag Manager:
🔗 https://tagmanager.google.com/

### 1.2 Crie uma Conta:
- Clique em **"Create Account"**
- **Account Name**: `FlipCars`
- **Country**: `United States`
- Clique **"Continue"**

### 1.3 Configure o Container:
- **Container Name**: `FlipCars Website`
- **Target Platform**: Selecione **"Web"** ⚡
- Aceite os termos
- Clique **"Create"**

### 1.4 COPIE SEU GTM ID:
Você receberá um código tipo: **`GTM-XXXXXXX`**

📝 **EXEMPLO**: `GTM-K5T9XYZ`

---

## 📋 PASSO 2: CONFIGURAR AS VARIÁVEIS DE AMBIENTE

### 2.1 Site Público (FlipCars.us):

Edite: `frontend-public/.env.local`

```bash
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

Substitua `GTM-XXXXXXX` pelo seu ID real.

### 2.2 Admin (Admin.FlipCars.us):

Edite: `frontend-admin/.env.local`

```bash
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

Use o **MESMO ID** ou crie um container separado se quiser tracking diferente.

---

## 📋 PASSO 3: CONFIGURAR NO VERCEL (PRODUÇÃO)

### 3.1 Site Público:
1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto: **frontend-public**
3. Vá em **Settings** → **Environment Variables**
4. Adicione:
   - **Name**: `NEXT_PUBLIC_GTM_ID`
   - **Value**: `GTM-XXXXXXX`
   - **Environment**: Marque **Production, Preview, Development**
5. Clique **"Save"**
6. **Redeploy** o projeto

### 3.2 Admin:
Repita o mesmo processo para o projeto **frontend-admin**.

---

## 🎯 PASSO 4: CONFIGURAR TAGS NO GTM

Agora que o GTM está instalado, configure as tags:

### 4.1 Google Analytics 4 (GA4):

1. No GTM, vá em **Tags** → **New**
2. **Tag Configuration** → **Google Analytics: GA4 Configuration**
3. Cole seu **Measurement ID** (formato: `G-XXXXXXXXXX`)
4. **Triggering** → Selecione **"All Pages"**
5. **Save** → Nomeie: "GA4 - All Pages"

### 4.2 Google Ads Conversion Tracking:

1. **Tags** → **New**
2. **Tag Configuration** → **Google Ads Conversion Tracking**
3. Cole seu **Conversion ID** e **Conversion Label**
4. **Triggering** → Configure quando disparar (ex: página de "Obrigado")
5. **Save**

### 4.3 Facebook Pixel:

1. **Tags** → **New**
2. **Tag Configuration** → **Custom HTML**
3. Cole o código do Facebook Pixel
4. **Triggering** → **"All Pages"**
5. **Save**

---

## 🧪 PASSO 5: TESTAR A INSTALAÇÃO

### 5.1 Instale o GTM Preview Mode:
1. No GTM, clique em **"Preview"** (canto superior direito)
2. Digite a URL do seu site: `https://flipcars.us`
3. Clique **"Connect"**

### 5.2 Verifique se está funcionando:
- A página do seu site deve abrir
- No GTM Preview, você verá os eventos disparando
- Tags devem aparecer como **"Fired"** (disparadas)

### 5.3 Alternativa - Use a Extensão Chrome:
🔗 **Google Tag Assistant**: https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk

---

## 📊 EVENTOS IMPORTANTES PARA CONFIGURAR

### Eventos Recomendados para FlipCars:

1. **Lead Submission** (Envio de Formulário):
   - Trigger: Quando formulário de orçamento é enviado
   - Use para: Google Ads, Facebook Ads

2. **Phone Click** (Clique no Telefone):
   - Trigger: Quando usuário clica para ligar
   - Use para: Medir intenção de conversão

3. **Get Estimate Button** (Botão de Orçamento):
   - Trigger: Clique no botão "Get Free Estimate"
   - Use para: Medir interesse

4. **Form Started** (Formulário Iniciado):
   - Trigger: Quando usuário começa a preencher
   - Use para: Remarketing

---

## ✅ CHECKLIST FINAL

- [ ] Conta GTM criada
- [ ] GTM ID copiado (formato: GTM-XXXXXXX)
- [ ] `.env.local` atualizado (frontend-public)
- [ ] `.env.local` atualizado (frontend-admin)
- [ ] Variáveis configuradas no Vercel (ambos os projetos)
- [ ] Projetos redeployados no Vercel
- [ ] GA4 configurado no GTM
- [ ] Tags de conversão configuradas
- [ ] Testado com GTM Preview Mode
- [ ] Tags disparando corretamente

---

## 🆘 PROBLEMAS COMUNS

### GTM não aparece no site:
1. Verifique se `NEXT_PUBLIC_GTM_ID` está definido
2. Confirme que fez redeploy após adicionar a variável
3. Limpe o cache do browser (Ctrl+Shift+R)

### Tags não disparam:
1. Verifique os Triggers no GTM
2. Use GTM Preview Mode para debugar
3. Confira se publicou a versão no GTM (botão "Submit")

### Dados não aparecem no GA4:
1. Aguarde 24-48h para dados históricos
2. Use "Realtime" no GA4 para ver dados imediatos
3. Verifique se o Measurement ID está correto

---

## 📞 PRÓXIMOS PASSOS

Depois de instalar:

1. **Publish no GTM**: Clique em "Submit" no canto superior direito
2. **Nome da Versão**: "Initial Setup with GA4"
3. **Aguarde dados**: 24-48h para Google Analytics processar
4. **Configure conversões**: Para medir leads e vendas

---

## 🎯 CÓDIGO JÁ INSTALADO

O código GTM já está instalado em:
- ✅ `frontend-public/src/components/GoogleTagManager.tsx`
- ✅ `frontend-public/src/app/layout.tsx`
- ✅ `frontend-admin/src/components/GoogleTagManager.tsx`

**Só falta você configurar o GTM ID nas variáveis de ambiente!**
