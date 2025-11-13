# ✅ COMO VERIFICAR SE GOOGLE ADS ESTÁ INSTALADO

## 🔍 MÉTODO 1: VIA CONSOLE DO NAVEGADOR

1. Acesse: https://flipcars.us
2. Pressione **F12** (abre DevTools)
3. Vá na aba **Console**
4. Digite: `dataLayer`
5. Pressione Enter

**✅ SE FUNCIONAR**: Você verá um array `[{...}]` com dados
**❌ SE NÃO FUNCIONAR**: Verá `undefined`

---

## 🔍 MÉTODO 2: VIA VIEW PAGE SOURCE

1. Acesse: https://flipcars.us
2. Clique com botão direito → **Ver código-fonte** (ou Ctrl+U)
3. Pressione **Ctrl+F** e busque por: `AW-803837087`

**✅ SE FUNCIONAR**: Você encontrará o código
**❌ SE NÃO FUNCIONAR**: Não encontrará

---

## 🔍 MÉTODO 3: VIA GOOGLE TAG ASSISTANT (MAIS FÁCIL!)

1. Instale a extensão: https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk
2. Acesse: https://flipcars.us
3. Clique no ícone da extensão
4. Deve aparecer: **Google Ads Conversion Tracking** com tag `AW-803837087`

---

## ⚠️ SE NÃO APARECER:

**Motivo 1**: Vercel não fez redeploy ainda
→ Solução: Fazer redeploy manual no Vercel

**Motivo 2**: Variáveis de ambiente não configuradas
→ Solução: Adicionar `NEXT_PUBLIC_GOOGLE_ADS_ID=AW-803837087` no Vercel

**Motivo 3**: Cache do navegador
→ Solução: Abrir em aba anônima (Ctrl+Shift+N)
