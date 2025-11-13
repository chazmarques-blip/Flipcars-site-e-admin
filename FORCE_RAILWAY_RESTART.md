# 🔄 FORCE RAILWAY RESTART - Backend Cache

## 🔴 PROBLEMA

Colunas foram removidas do banco, mas backend ainda retorna erro 500.

**Causa**: TypeORM cache de schema ou conexão antiga.

---

## ✅ SOLUÇÃO: RESTART MANUAL

### **MÉTODO 1: Via Railway UI (RECOMENDADO)**

**Passo 1**: Acesse https://railway.app/dashboard

**Passo 2**: Selecione projeto **FlipCars**

**Passo 3**: Clique no serviço **backend** (upbeat-dedication)

**Passo 4**: Vá na aba **Settings**

**Passo 5**: Role até o final → Procure por **"Restart Service"** ou **"Restart"**

**Passo 6**: Clique em **"Restart"**

**Passo 7**: Aguarde 1-2 minutos

---

### **MÉTODO 2: Via Empty Commit (Alternativo)**

Se não encontrar botão de Restart:

```bash
cd /home/user/webapp
git commit --allow-empty -m "chore: force restart to clear TypeORM cache"
git push origin main
```

---

## ⏱️ APÓS RESTART

Aguarde 2 minutos e teste novamente:

```bash
# Fazer login
curl -X POST https://upbeat-dedication-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@flipcars.us","password":"admin123"}'

# Copiar accessToken e testar
curl "https://upbeat-dedication-production.up.railway.app/api/leads?page=1&limit=1" \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Resultado esperado**:
```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 1,
    "total": 0,
    "totalPages": 0
  }
}
```

---

## 📊 POR QUE ISSO ACONTECE?

TypeORM faz cache do schema das entities para melhor performance.

Quando você:
1. ✅ Remove colunas do banco
2. ✅ Atualiza código
3. ❌ Backend mantém cache antigo

**Solução**: Restart completo = limpa cache

---

## ✅ CHECKLIST

- [x] SQL executado (colunas removidas)
- [x] Código atualizado no GitHub
- [ ] **Restart do Railway** ← VOCÊ FAZ AGORA
- [ ] Testar API novamente
- [ ] Testar admin dashboard
