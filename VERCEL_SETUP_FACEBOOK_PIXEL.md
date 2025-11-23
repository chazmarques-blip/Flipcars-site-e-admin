# ⚠️ AÇÃO NECESSÁRIA: Configurar Facebook Pixel no Vercel

## 🎯 Pixel ID Configurado
**Pixel ID**: `2262253837597996`

---

## 📋 Passos para Configurar no Vercel

### 1. Acessar Dashboard do Vercel
🌐 **URL**: https://vercel.com/dashboard

### 2. Selecionar o Projeto FlipCars
- Clique no projeto `flipcars-site-e-admin` (ou nome similar)

### 3. Ir para Settings
- No menu lateral, clique em **Settings**

### 4. Adicionar Environment Variable
- No menu Settings, clique em **Environment Variables**
- Clique no botão **Add New**

### 5. Preencher os Dados

#### **Campo 1: Key (Nome da Variável)**
```
NEXT_PUBLIC_FACEBOOK_PIXEL_ID
```

#### **Campo 2: Value (Valor)**
```
2262253837597996
```

#### **Campo 3: Environment (Ambiente)**
Selecione todos:
- ✅ Production
- ✅ Preview
- ✅ Development

### 6. Salvar
- Clique em **Save**

### 7. Redeployar (Importante!)
Após adicionar a variável, você precisa fazer um novo deploy:
- Vá para a aba **Deployments**
- Clique nos 3 pontinhos (...) do último deployment
- Clique em **Redeploy**

**OU**

Faça um novo commit/push (o Vercel deployará automaticamente)

---

## ✅ Como Verificar se Funcionou

### 1. Aguardar Deploy (2-5 minutos)
O Vercel mostrará o status do deploy na dashboard

### 2. Acessar o Site em Produção
🌐 **URL**: https://flipcars.us (ou seu domínio)

### 3. Usar Facebook Pixel Helper
- Instale: https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc
- Abra o site flipcars.us
- Ícone do Pixel Helper deve ficar **AZUL** com número "1"
- Clique no ícone para ver detalhes do pixel

### 4. Verificar no Facebook Events Manager
1. Acesse: https://business.facebook.com/events_manager/
2. Clique em **Test Events** (menu lateral)
3. No campo "Test browser traffic", cole a URL: https://flipcars.us
4. Navegue no site e veja eventos aparecendo em tempo real:
   - ✅ PageView (automático)
   - ✅ CTAClick (ao clicar nos botões)
   - ✅ Contact (ao clicar em Call Now)
   - ✅ Lead (ao submeter formulário)

---

## 📊 Eventos Configurados

| Evento | Quando Dispara | Uso |
|--------|---------------|-----|
| **PageView** | Todas as páginas | Remarketing geral |
| **Lead** | Formulário submetido | Conversão principal |
| **Contact** | Botão "Call Now" | Interesse em contato |
| **CTAClick** | Botões CTAs principais | Engajamento |
| **PhoneClick** | Click no telefone | Tentativa de contato |

---

## 🎯 Próximos Passos (Marketing)

### 1. Criar Públicos Personalizados
- Visitantes do site (últimos 30 dias)
- Pessoas que clicaram em CTAs
- Pessoas que submeteram formulário
- Pessoas que tentaram contato via telefone

### 2. Configurar Campanhas de Remarketing
- Mostrar anúncios para visitantes que não converteram
- Ofertas especiais para quem clicou mas não preencheu
- Follow-up para quem preencheu formulário

### 3. Criar Lookalike Audiences
- Baseado em pessoas que converteram (Lead)
- Baseado em pessoas que entraram em contato
- Expandir alcance com perfis similares

### 4. Otimizar Campanhas
- Mudar objetivo de "Traffic" para "Conversions"
- Escolher evento "Lead" como otimização
- Facebook otimizará para pessoas com maior probabilidade de converter

---

## 🔧 Troubleshooting

### Pixel Helper não mostra nada (ícone cinza)
- ✅ Verificar se variável foi adicionada no Vercel
- ✅ Verificar se fez redeploy após adicionar variável
- ✅ Limpar cache do navegador (Ctrl+Shift+Delete)
- ✅ Testar em aba anônima

### Pixel Helper mostra erro
- ✅ Verificar se Pixel ID está correto: `2262253837597996`
- ✅ Verificar logs do console do navegador (F12)
- ✅ Verificar se o site carregou completamente

### Eventos não aparecem no Events Manager
- ✅ Aguardar 1-2 minutos (não é instantâneo)
- ✅ Verificar se está usando o Pixel ID correto no Test Events
- ✅ Verificar se o navegador não está bloqueando scripts (adblockers)

---

## 📞 Suporte

Se encontrar problemas, verifique:
1. Variável de ambiente está correta no Vercel
2. Deploy foi bem-sucedido
3. Site está carregando sem erros (F12 → Console)
4. Pixel Helper instalado e atualizado

---

**Data de Configuração**: 2025-11-23
**Pixel ID**: 2262253837597996
**Status**: ✅ Código deployado em produção | ⚠️ Aguardando configuração Vercel
