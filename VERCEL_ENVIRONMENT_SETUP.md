# 🔧 Configuração de Environment Variables no Vercel - FlipCars

## 🚨 PROBLEMA DETECTADO
A variável `NEXT_PUBLIC_API_URL` já existe no Vercel, mas pode estar com valor errado ou não estar aplicada em todos os ambientes.

---

## ✅ SOLUÇÃO - Editar Variável Existente

### **Passo 1: Localizar a Variável Existente**
1. **Acesse:** https://vercel.com/charles-marques-projects/flipcars-site-e-admin/settings/environment-variables
2. **Procure por:** `NEXT_PUBLIC_API_URL` na lista de variáveis
3. **Você verá 3 ambientes possíveis:**
   - ✅ **Production** (https://flipcars.us)
   - ⚠️ **Preview** (branches de teste)
   - ⚠️ **Development** (local)

---

### **Passo 2: Editar a Variável (CRÍTICO!)**
1. **Clique no ícone de lápis** (✏️) ou **nos 3 pontinhos** (`...`) ao lado da variável `NEXT_PUBLIC_API_URL`
2. **Verifique o valor atual:**
   - ❌ **SE ESTIVER:** `/api` ou vazio → **ERRADO!**
   - ✅ **DEVE SER:** `https://upbeat-dedication-production.up.railway.app/api`

3. **Marque TODOS os ambientes:**
   - ✅ **Production**
   - ✅ **Preview**
   - ✅ **Development**

4. **Salve as alterações**

---

### **Passo 3: Forçar Redesploy**
1. **Vá para:** `Deployments` (aba superior)
2. **Clique nos 3 pontinhos** (`...`) do deploy mais recente (primeiro da lista)
3. **Clique em:** `Redeploy` → **Confirme**
4. **Aguarde:** 1-2 minutos até aparecer ✅ **"Ready"**

---

## 🔍 DIAGNÓSTICO - Se Precisar Investigar

### **Verificar Valor Atual da Variável no Vercel**
Na aba **Deployments** → Clique no deploy ativo → Procure por:
```
Environment Variables:
NEXT_PUBLIC_API_URL = ???
```

### **Valores Possíveis e Significado:**
| Valor Encontrado | Problema | Ação |
|------------------|----------|------|
| `/api` | Proxy local (não funciona em produção) | ✏️ Editar para URL Railway |
| (vazio) | Variável não configurada | ✏️ Editar para URL Railway |
| `https://upbeat-dedication-production.up.railway.app/api` | ✅ **CORRETO** | Se ainda não funciona, limpar cache |
| `http://...` (sem 's') | SSL incorreto | ✏️ Corrigir para `https://` |

---

## 🧪 TESTE APÓS CORREÇÃO

### **1. Limpar Cache do Navegador (OBRIGATÓRIO!)**
```
Chrome/Edge:
1. Ctrl + Shift + Delete
2. Marcar: "Cookies e outros dados do site" + "Imagens e arquivos em cache"
3. Período: "Todo o período"
4. Clicar: "Limpar dados"
5. Fechar TODAS as abas do flipcars.us
6. Reiniciar navegador
```

### **2. Testar em Aba Anônima**
```
1. Ctrl + Shift + N (Chrome) ou Ctrl + Shift + P (Firefox)
2. Acessar: https://flipcars.us
3. Abrir DevTools: F12
4. Ir para aba "Console"
5. Limpar console (ícone 🚫)
6. Clicar em: "Book Oil Change Now! Only $39.99 !!"
7. Preencher formulário e submeter
```

### **3. Verificar Console do Navegador**
**✅ SUCESSO - Deve aparecer:**
```javascript
[EstimateForm] 📤 Submitting estimate request...
[EstimateForm] ✅ Lead created successfully! Reference: FLIP-20251203-0012
```

**❌ ERRO - Se ainda aparecer:**
```javascript
❌ POST https://flipcars.us/api/public/leads 500
Network Error: Failed to fetch
```
→ **Significa:** Vercel ainda não atualizou. Aguarde mais 2 min ou force novo redeploy.

---

## 📊 CHECKLIST COMPLETO

- [ ] **1. Variável editada no Vercel** (`NEXT_PUBLIC_API_URL` com URL Railway correta)
- [ ] **2. Todos os ambientes marcados** (Production + Preview + Development)
- [ ] **3. Redeploy iniciado** (aguardar status "Ready")
- [ ] **4. Cache do navegador limpo** (Ctrl + Shift + Delete)
- [ ] **5. Teste em aba anônima** (Ctrl + Shift + N)
- [ ] **6. Formulário submetido** (deixar sintomas vazio)
- [ ] **7. Confirmação recebida** (página de sucesso + número de referência)
- [ ] **8. Email recebido** (verificar inbox/spam de `auto@flipcars.us`)

---

## 🔗 LINKS ÚTEIS

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Environment Variables:** https://vercel.com/charles-marques-projects/flipcars-site-e-admin/settings/environment-variables
- **Deployments:** https://vercel.com/charles-marques-projects/flipcars-site-e-admin/deployments
- **Site de Produção:** https://flipcars.us
- **Backend API:** https://upbeat-dedication-production.up.railway.app/api/health

---

## 🆘 TROUBLESHOOTING

### **Problema: Não consigo editar a variável**
**Solução:**
1. Deletar a variável existente
2. Criar uma nova com o valor correto
3. Marcar TODOS os ambientes
4. Salvar e redesploy

### **Problema: Redeploy não muda nada**
**Solução:**
1. Ir para: `Settings` → `Git`
2. Verificar branch conectado: deve ser `main`
3. Forçar novo redeploy com cache limpo

### **Problema: Console ainda mostra erro 500**
**Possíveis causas:**
1. Vercel não deployou ainda (aguardar 2-3 min)
2. Cache do navegador não foi limpo (tentar outro navegador)
3. Variável não foi salva (verificar novamente no Vercel)

---

## 🎯 OBJETIVO FINAL

Quando tudo estiver correto, o formulário em https://flipcars.us deve:
- ✅ Submeter sem erros
- ✅ Exibir página de confirmação
- ✅ Gerar número de referência `FLIP-YYYYMMDD-XXXX`
- ✅ Enviar email para `auto@flipcars.us` → cliente
- ✅ Versão de impressão (`Ctrl + P`) com mapa grande

---

**📝 Criado em:** 2024-12-03  
**🔗 Projeto:** FlipCars Auto Repair  
**👤 Autor:** Claude Code Assistant
