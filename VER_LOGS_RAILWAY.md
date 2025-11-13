# 🔍 VER LOGS DO RAILWAY - Investigar Erro 500

## 🎯 OBJETIVO

Descobrir qual é o erro EXATO que está causando o 500 no endpoint `/api/leads`.

---

## 📋 PASSO A PASSO

### **1️⃣ Acessar Railway Dashboard**

URL: https://railway.app/dashboard

### **2️⃣ Selecionar Projeto FlipCars**

Encontre e clique no projeto

### **3️⃣ Clicar no Serviço Backend**

Nome: `upbeat-dedication` ou similar

### **4️⃣ Ir na Aba "Logs"**

Menu: **Deployments** → **View Logs**

Ou: **Logs** no menu lateral

### **5️⃣ Reproduzir o Erro**

**IMPORTANTE**: Deixe os logs abertos e visíveis

Depois, em outra aba/janela, faça login no admin:
- Acesse: https://admin.flipcars.us
- Login: admin@flipcars.us / admin123
- Clique em "Leads"

**Volte para os logs do Railway**

### **6️⃣ Procurar pelos Erros**

Nos logs, procure por:
- ❌ `Error:`
- ❌ `ERROR`
- ❌ `Exception`
- ❌ `QueryFailedError`
- ❌ `column`
- ❌ `relation`
- ❌ `does not exist`

### **7️⃣ Copiar o Erro Completo**

Copie/screenshot:
- A mensagem de erro
- O stack trace (linhas abaixo do erro)
- Qualquer menção a "preferred_date" ou "preferred_time_slot"

---

## 🔍 ERROS COMUNS QUE PODEM APARECER

### **Erro 1: Column does not exist**
```
QueryFailedError: column "preferred_date" does not exist
```
**Solução**: Banco ainda tem referência às colunas

### **Erro 2: Relation does not exist**
```
QueryFailedError: relation "migrations" does not exist
```
**Solução**: Problema com tabela de migrations

### **Erro 3: Connection error**
```
Error: connect ECONNREFUSED
```
**Solução**: Problema de conexão com Supabase

### **Erro 4: TypeORM error**
```
EntityMetadataNotFoundError
```
**Solução**: Problema de sincronização de entities

---

## 📸 O QUE ENVIAR

Me envie:
1. 📸 **Print dos logs** durante o acesso à página Leads
2. 📝 **Cópia do texto do erro** (se conseguir copiar)
3. 🔍 **Qualquer linha que mencione** "preferred", "leads", "query", "error"

---

## 💡 DICA

Use o **filtro** nos logs do Railway:
- Digite: `error` para filtrar apenas erros
- Ou: `leads` para ver apenas logs relacionados

---

## ⏰ QUANDO FAZER

**AGORA!** Precisamos ver os logs para saber exatamente o que está errado.

Sem os logs, estamos "adivinhando" o problema.

---

**Próximo passo**: Ver logs do Railway → Identificar erro exato → Corrigir definitivamente
