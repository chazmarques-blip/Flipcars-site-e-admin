# 🛡️ PROTOCOLO DE SEGURANÇA PARA DESENVOLVIMENTO

## ⚠️ REGRA DE OURO: NUNCA QUEBRAR O SISTEMA PRINCIPAL

---

## 🎯 PRINCÍPIOS FUNDAMENTAIS

### 1. **PROTEÇÃO DOS RECURSOS CRÍTICOS**

#### **Recursos que NUNCA podem falhar:**
- ✅ **Exibição de Leads** (admin dashboard)
- ✅ **Login/Autenticação**
- ✅ **API de Leads** (GET /api/leads)
- ✅ **Criação de Leads** (formulário público)
- ✅ **Banco de Dados** (conexão e queries básicas)

#### **Antes de QUALQUER mudança:**
```bash
# 1. SEMPRE testar localmente primeiro
cd backend && npm run build
cd frontend-admin && npm run build
cd frontend-public && npm run build

# 2. Se compilar OK, testar funcionalidade principal
curl http://localhost:3000/api/leads # Deve retornar leads

# 3. Só depois fazer commit
```

---

## 🔒 ESTRATÉGIA: FEATURE FLAGS

### **Como adicionar novos campos SEM quebrar:**

#### ❌ **ERRADO (o que fizemos antes):**
```typescript
// lead.entity.ts
@Column({ type: 'date', name: 'preferred_date' })
preferredDate: Date; // ← Se coluna não existe, TypeORM FALHA SILENCIOSAMENTE!
```

#### ✅ **CORRETO (com proteção):**
```typescript
// lead.entity.ts
@Column({ type: 'date', nullable: true, name: 'preferred_date' })
preferredDate?: Date; // ← nullable + optional = SEGURO

// OU melhor ainda: Feature Flag
const USE_SCHEDULING_FIELDS = process.env.ENABLE_SCHEDULING === 'true';

// Em runtime, checar antes de usar:
if (lead.preferredDate && USE_SCHEDULING_FIELDS) {
  // usar campo
}
```

---

## 📋 CHECKLIST OBRIGATÓRIO ANTES DE DEPLOY

### **Para Backend (NestJS/TypeORM):**

```bash
# ✅ 1. Compilação
cd backend
npm run build
# Se falhar: NÃO FAZER COMMIT!

# ✅ 2. Teste de Schema (verificar se entidade bate com DB)
npm run typeorm schema:log
# Verificar se não tem ALTER TABLE perigoso

# ✅ 3. Teste da API principal
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@flipcars.com","password":"admin123"}'
# Deve retornar token

# ✅ 4. Teste de Leads
curl http://localhost:3000/api/leads?page=1&limit=10 \
  -H "Authorization: Bearer TOKEN"
# Deve retornar 5 leads

# ✅ 5. Se TUDO funcionar localmente → commit
```

### **Para Frontend (Next.js):**

```bash
# ✅ 1. Compilação
cd frontend-admin
npm run build
# Se falhar: NÃO FAZER COMMIT!

# ✅ 2. Teste visual local
npm run dev
# Abrir http://localhost:3000/dashboard/leads
# CONFIRMAR que leads aparecem

# ✅ 3. Se funcionar → commit
```

---

## 🧪 AMBIENTE DE TESTES ISOLADO

### **Criar branch de testes:**
```bash
# SEMPRE desenvolver features novas em branch separada
git checkout -b feature/vin-scanner-safe
# Testar tudo aqui primeiro
# Só mergear para main quando CONFIRMAR que funciona
```

### **Variáveis de ambiente para testes:**
```env
# .env.test
ENABLE_VIN_SCANNER=false  # Feature flag OFF por padrão
ENABLE_SCHEDULING=false   # Feature flag OFF por padrão
ENABLE_NEW_FEATURES=false # Global feature flag
```

---

## 🔄 ROLLBACK RÁPIDO

### **Se algo der errado em produção:**

```bash
# 1. Identificar último commit funcionando
git log --oneline -10

# 2. Reverter para versão estável
git revert HEAD
git push origin main

# 3. OU criar hotfix direto
git checkout -b hotfix/restore-leads
# Fazer correção mínima
git commit -m "hotfix: restore leads display"
git push origin main
```

---

## 📊 MONITORAMENTO EM PRODUÇÃO

### **Sempre após deploy:**

```bash
# ✅ 1. Verificar logs do Railway
# Ver se há erros de TypeORM

# ✅ 2. Testar API de produção
curl https://upbeat-dedication-production.up.railway.app/api/leads?page=1&limit=10 \
  -H "Authorization: Bearer TOKEN"

# ✅ 3. Testar admin dashboard
# Abrir https://admin.flipcars.us/dashboard/leads
# CONFIRMAR que leads aparecem

# ✅ 4. Se falhar: ROLLBACK IMEDIATO
```

---

## 🏗️ ESTRATÉGIA DE MIGRAÇÃO SEGURA

### **Para adicionar novos campos ao banco:**

#### **Passo 1: Adicionar coluna no banco (SEM mudar código)**
```sql
-- Executar no Supabase
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS preferred_date DATE;

-- Verificar
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'leads' AND column_name = 'preferred_date';
```

#### **Passo 2: Aguardar 5 minutos, verificar que sistema não quebrou**

#### **Passo 3: Adicionar campo na entidade (com nullable)**
```typescript
@Column({ type: 'date', nullable: true, name: 'preferred_date' })
preferredDate?: Date;
```

#### **Passo 4: Testar localmente**

#### **Passo 5: Deploy backend**

#### **Passo 6: Verificar que leads ainda aparecem**

#### **Passo 7: Agora pode usar o campo no frontend**

---

## 🎯 PRIORIDADES DE TESTE

### **Ordem de importância:**

1. **🔴 CRÍTICO:** Exibição de Leads
   - `GET /api/leads` deve retornar dados
   - Dashboard deve mostrar lista
   - Deve ser testado SEMPRE

2. **🟠 IMPORTANTE:** Criação de Leads
   - Formulário público deve funcionar
   - `POST /api/leads` deve salvar
   - Testar após mudanças em entidades

3. **🟡 DESEJÁVEL:** Novas features
   - VIN Scanner
   - Agendamentos
   - Podem falhar sem quebrar o principal

---

## 📝 TEMPLATE DE COMMIT SEGURO

```bash
# ✅ Commit que adiciona feature SEM afetar principal
git commit -m "feat(optional): add VIN scanner feature

- Added VINScanner component (isolated)
- Feature flag: ENABLE_VIN_SCANNER
- Does NOT affect existing leads display
- Tested locally: ✅ Leads still visible
- Tested API: ✅ Returns 5 leads
- Safe to deploy"

# ❌ Commit que PODE quebrar (evitar!)
git commit -m "feat: changed lead entity"
# Falta informação! Pode quebrar!
```

---

## 🔧 FERRAMENTAS DE TESTE AUTOMATIZADO

### **Script de teste pré-commit:**

```bash
#!/bin/bash
# Salvar como: .git/hooks/pre-commit

echo "🧪 Running safety checks..."

# 1. Test backend build
cd backend && npm run build
if [ $? -ne 0 ]; then
    echo "❌ Backend build failed! Commit aborted."
    exit 1
fi

# 2. Test frontend build
cd ../frontend-admin && npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed! Commit aborted."
    exit 1
fi

echo "✅ All checks passed! Safe to commit."
exit 0
```

---

## 🚨 PLANO DE CONTINGÊNCIA

### **Se leads pararem de aparecer:**

1. **Imediatamente:** Reverter último commit
2. **Verificar:** Logs do Railway
3. **Testar:** API manualmente
4. **Identificar:** Qual mudança causou
5. **Corrigir:** Em branch separada
6. **Testar:** Localmente antes de deployar
7. **Deploy:** Só após confirmação

---

## 📈 MÉTRICAS DE SUCESSO

### **Após cada deploy, confirmar:**

- ✅ Leads aparecem no admin (manual check)
- ✅ API retorna 5 leads (curl test)
- ✅ Sem erros 500 no console
- ✅ Tempo de resposta < 2s
- ✅ Login funciona
- ✅ Formulário público funciona

---

## 🎓 LIÇÕES APRENDIDAS

### **❌ O que NÃO fazer:**

1. Adicionar campos obrigatórios sem migração
2. Mudar entidades sem testar build
3. Deploy sem verificar API
4. Commits grandes com várias mudanças
5. Confiar que "vai funcionar em produção"

### **✅ O que FAZER:**

1. Campos novos sempre `nullable: true`
2. Testar build localmente SEMPRE
3. Verificar API após cada mudança
4. Commits pequenos e focados
5. Testar localmente = testar em prod

---

## 🔐 RESUMO EXECUTIVO

### **3 REGRAS DE OURO:**

1. **🧪 TESTAR LOCAL ANTES**: Se não funciona no seu PC, não vai funcionar em produção
2. **🛡️ PROTEGER PRINCIPAIS**: Leads, Login, API nunca podem falhar
3. **🔄 ROLLBACK RÁPIDO**: Se quebrar, reverter imediatamente

### **WORKFLOW SEGURO:**

```
Nova Feature Idea
    ↓
Criar Branch
    ↓
Desenvolver + Testar LOCAL
    ↓
Build Success? → NÃO → Corrigir
    ↓ SIM
API Funciona? → NÃO → Corrigir
    ↓ SIM
Leads Aparecem? → NÃO → Corrigir
    ↓ SIM
Commit + Push
    ↓
Aguardar Deploy
    ↓
Testar em PROD
    ↓
Funciona? → NÃO → ROLLBACK IMEDIATO!
    ↓ SIM
✅ SUCESSO!
```

---

**🎯 OBJETIVO:** Zero downtime, zero quebras, 100% confiabilidade
