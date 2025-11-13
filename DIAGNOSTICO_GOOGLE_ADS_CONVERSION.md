# 🔍 DIAGNÓSTICO - GOOGLE ADS CONVERSION TRACKING

## 📊 PROBLEMA RELATADO

Google Ads mostra: **"Conversion tracking setup is incomplete"**

Campanha: **Leads Body shop insuranse**
Status: ⚠️ Rastreamento incompleto

---

## ✅ O QUE JÁ ESTÁ CONFIGURADO

### 1. **Código de Rastreamento Instalado**

✅ **Google Ads Tag (Global)**
- Arquivo: `frontend-public/src/components/GoogleAds.tsx`
- ID: `AW-803837087`
- Instalado em: `layout.tsx` (todas as páginas)

✅ **Função de Conversão**
```typescript
export const trackConversion = (conversionLabel: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'conversion', {
      send_to: conversionLabel,
    });
  }
};
```

✅ **Conversão Disparada**
- Local: `EstimateFormModal.tsx` (linha 68)
- Quando: Após envio bem-sucedido do formulário
- Label: `ZsJvCIOV-LkbEJ-ppv8C`

### 2. **Variáveis de Ambiente**

✅ Configuradas no `.env.local`:
```bash
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-803837087
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=ZsJvCIOV-LkbEJ-ppv8C
```

---

## ❌ POSSÍVEIS CAUSAS DO PROBLEMA

### **1. Variáveis de Ambiente NÃO Configuradas no Vercel** ⚠️

O arquivo `.env.local` existe localmente, MAS as variáveis podem não estar configuradas no **Vercel Dashboard**.

**Como verificar:**
1. Acesse: https://vercel.com/dashboard
2. Clique no projeto FlipCars (frontend-public)
3. Vá em **Settings → Environment Variables**
4. Verifique se existem:
   - `NEXT_PUBLIC_GOOGLE_ADS_ID`
   - `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL`

❌ **Se NÃO existirem** → Este é o problema!

---

### **2. Redeploy Necessário Após Adicionar Variáveis**

Mesmo após adicionar variáveis no Vercel, o deploy atual ainda usa código antigo sem essas variáveis.

**Solução:** Fazer redeploy após configurar variáveis.

---

### **3. Tag Ainda Não Verificada pelo Google**

Google Ads pode levar **24-48 horas** para verificar a instalação do código.

Status atual: Código está instalado, mas Google pode ainda estar verificando.

---

### **4. Conversão Não Foi Testada**

Se ninguém completou o formulário desde que o código foi instalado, Google não consegue verificar.

**Necessário:** Fazer um teste completo (preencher e enviar formulário).

---

## 🔧 SOLUÇÃO PASSO A PASSO

### **ETAPA 1: Verificar e Configurar Variáveis no Vercel**

```bash
# Passo 1: Acesse Vercel Dashboard
https://vercel.com/dashboard

# Passo 2: Selecione projeto "flipcars-public" ou similar

# Passo 3: Vá em Settings → Environment Variables

# Passo 4: Adicione estas variáveis (se não existirem):

Nome: NEXT_PUBLIC_GOOGLE_ADS_ID
Valor: AW-803837087
Environments: Production, Preview, Development

Nome: NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL
Valor: ZsJvCIOV-LkbEJ-ppv8C
Environments: Production, Preview, Development
```

**❗ IMPORTANTE:** Marque todas as 3 opções (Production, Preview, Development)

---

### **ETAPA 2: Forçar Redeploy no Vercel**

Após adicionar variáveis:

```bash
# Opção A: Via Dashboard
1. Vá em Deployments
2. Clique nos 3 pontinhos do último deployment
3. Clique em "Redeploy"
4. Marque "Use existing Build Cache" = OFF
5. Clique em "Redeploy"

# Opção B: Via Git (mais fácil)
# Fazer um commit vazio para trigger novo deploy
cd /home/user/webapp
git commit --allow-empty -m "chore: trigger redeploy for Google Ads env vars"
git push origin main
```

---

### **ETAPA 3: Verificar se Código Está Rodando**

Após redeploy, abra o site e verifique no Console do Browser:

```bash
# Abra: https://flipcars.us
# Pressione F12 (DevTools)
# Vá na aba "Console"
# Procure por:

✅ Scripts Google Ads carregados:
   - gtag/js?id=AW-803837087

✅ Configuração executada:
   - gtag('config', 'AW-803837087')

# Complete o formulário de estimativa
# Após enviar, procure por:

✅ Conversão disparada:
   - [EstimateForm] 🎯 Google Ads conversion tracked
   - gtag('event', 'conversion', {...})
```

---

### **ETAPA 4: Testar Conversão Manualmente**

```bash
# 1. Acesse: https://flipcars.us
# 2. Clique em "Get Free Estimate"
# 3. Preencha o formulário completo
# 4. Envie (Submit)
# 5. Verifique se apareceu página de sucesso

# No Console (F12), deve aparecer:
✅ [EstimateForm] ✅ Form submission successful
✅ [EstimateForm] 🎯 Google Ads conversion tracked
```

---

### **ETAPA 5: Verificar no Google Ads**

```bash
# 1. Acesse: https://ads.google.com/
# 2. Clique em "Tools" (Ferramentas) → "Conversions"
# 3. Encontre sua conversão "Lead Submission" ou similar
# 4. Verifique status:

✅ Status: "Recording conversions"
✅ Tag: "Active"
✅ Recent conversions: 1 (ou mais, se testou várias vezes)

⚠️ Pode levar 24-48h para Google verificar completamente
```

---

## 🧪 TESTE DE VALIDAÇÃO

### **Script de Teste no Console do Browser**

Cole isto no Console (F12) quando estiver em https://flipcars.us:

```javascript
// Verificar se gtag está disponível
if (window.gtag) {
  console.log('✅ Google Ads gtag disponível');
  
  // Ver dataLayer
  console.log('📊 dataLayer:', window.dataLayer);
  
  // Disparar conversão de teste (NÃO conte como conversão real)
  window.gtag('event', 'conversion', {
    'send_to': 'AW-803837087/ZsJvCIOV-LkbEJ-ppv8C',
    'transaction_id': 'TEST-' + Date.now()
  });
  console.log('🎯 Conversão de teste disparada!');
} else {
  console.error('❌ gtag NÃO está disponível!');
  console.log('Verifique se variáveis de ambiente estão configuradas no Vercel');
}
```

**Resultado esperado:**
```
✅ Google Ads gtag disponível
📊 dataLayer: [...]
🎯 Conversão de teste disparada!
```

**Se der erro:**
```
❌ gtag NÃO está disponível!
```
→ Variáveis de ambiente NÃO estão configuradas no Vercel!

---

## 📋 CHECKLIST DE VERIFICAÇÃO

### **No Código (já feito ✅)**
- [x] GoogleAdsTag instalado em layout.tsx
- [x] trackConversion implementado
- [x] Conversão disparada após submit do formulário
- [x] Variáveis no .env.local

### **No Vercel (VERIFICAR ⚠️)**
- [ ] NEXT_PUBLIC_GOOGLE_ADS_ID configurado
- [ ] NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL configurado
- [ ] Ambas variáveis em Production, Preview, Development
- [ ] Redeploy feito após adicionar variáveis

### **Testes (FAZER 🧪)**
- [ ] Abrir site e verificar Console (F12)
- [ ] Scripts Google Ads carregando
- [ ] Preencher formulário completo
- [ ] Enviar formulário
- [ ] Verificar conversão disparada no Console
- [ ] Verificar no Google Ads após 1-2 horas

---

## 🎯 RESUMO DA SOLUÇÃO

**Problema:** Google Ads diz que tracking está incompleto  
**Causa Provável:** Variáveis de ambiente não configuradas no Vercel  
**Solução:**

```bash
1. Configure variáveis no Vercel Dashboard
   - NEXT_PUBLIC_GOOGLE_ADS_ID=AW-803837087
   - NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=ZsJvCIOV-LkbEJ-ppv8C

2. Faça redeploy (commit vazio ou manual)

3. Teste o formulário completo

4. Aguarde 24-48h para Google verificar

5. Verifique status no Google Ads → Tools → Conversions
```

---

## 📞 PRÓXIMAS AÇÕES

### **Imediato (AGORA):**
1. ✅ Verificar variáveis de ambiente no Vercel
2. ✅ Adicionar variáveis se não existirem
3. ✅ Fazer redeploy

### **Curto prazo (1-2 horas):**
4. 🧪 Testar formulário completo
5. 🧪 Verificar conversão no Console
6. 🧪 Verificar dataLayer

### **Médio prazo (24-48 horas):**
7. ✅ Verificar status no Google Ads
8. ✅ Confirmar conversões registradas

---

## 🔗 LINKS ÚTEIS

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Google Ads:** https://ads.google.com/
- **Conversions:** https://ads.google.com/ → Tools → Conversions
- **Tag Assistant:** https://tagassistant.google.com/

---

**Data:** 2025-11-13  
**Status:** 🔍 Diagnóstico completo  
**Próximo passo:** Verificar variáveis no Vercel e fazer redeploy
