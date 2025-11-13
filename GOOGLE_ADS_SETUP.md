# 🎯 GOOGLE ADS - CONFIGURAÇÃO DE CONVERSÕES

## ✅ O QUE JÁ ESTÁ PRONTO NO CÓDIGO:

1. ✅ Componente `GoogleAdsTag` - Tag global do Google Ads
2. ✅ Função `trackConversion` - Dispara conversão quando lead é enviado
3. ✅ Estrutura pronta para receber seus IDs

---

## 📋 PASSO A PASSO PARA VOCÊ:

### **1️⃣ CRIAR CONVERSÃO NO GOOGLE ADS**

1. Entre em: https://ads.google.com/
2. Vá em: **Ferramentas e configurações** (🔧 ícone de chave inglesa)
3. Clique em: **Medição** → **Conversões**
4. Clique no botão: **+ Nova ação de conversão**
5. Escolha: **Site**
6. Configure:
   ```
   Nome: Lead - Formulário Orçamento
   Categoria: Lead
   Valor: $50 (ou o valor que você considera por lead)
   Contagem: Uma (cada conversão)
   Janela de conversão: 30 dias
   ```
7. Clique em **Criar e continuar**

### **2️⃣ COPIAR OS CÓDIGOS**

Você receberá 2 informações importantes:

**Conversion ID** (exemplo):
```
AW-123456789
```

**Conversion Label** (exemplo):
```
AbC-D1e2F3g4H5i6
```

O código completo será algo como:
```
AW-123456789/AbC-D1e2F3g4H5i6
```

---

## 🔧 **3️⃣ INSTALAR O CONVERSION LABEL:**

✅ **JÁ INSTALADO**: Conversion ID `AW-803837087`

**FALTA APENAS**: Me passar o **Conversion Label** que você receberá ao criar a conversão no Google Ads.

Será algo como: `AbC-D1e2F3g4H5i6`

Assim que me passar, eu:
1. ✅ Adiciono no .env.local
2. ✅ Adiciono no Vercel (production)
3. ✅ Testo que está funcionando
4. ✅ Faço deploy

---

## 📊 **4️⃣ COMO VAI FUNCIONAR:**

```
Usuário preenche formulário
         ↓
    Envia dados
         ↓
  Lead criado no backend ✅
         ↓
🎯 Google Ads recebe conversão
         ↓
Aparece no seu painel do Google Ads
```

---

## 🎯 **CONVERSÕES QUE VAMOS RASTREAR:**

1. **Lead de Orçamento** (Body Shop)
2. **Lead de Mecânica** (Mechanic)
3. **Clique no botão WhatsApp** (opcional)
4. **Clique no botão Ligar** (opcional)

---

## 💡 **DICA IMPORTANTE:**

Após instalar, você pode testar fazendo um envio de teste do formulário. 
Depois, vá no Google Ads em **Conversões** e clique em **Ver detalhes** 
para confirmar que a conversão foi registrada (pode levar até 24h para aparecer).

---

## 🚀 **PRONTO PARA COMEÇAR?**

Assim que você me passar os IDs do Google Ads, eu implemento tudo e 
suas campanhas já estarão rastreando conversões corretamente!
