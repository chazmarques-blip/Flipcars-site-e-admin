# ⚡ QUICK START - FlipCars Lead Issue Fix

**PROBLEMA**: Admin dashboard não mostra leads (erro 500 em `/api/leads`)  
**CAUSA**: Schema mismatch entre TypeORM entity e tabela do Supabase  
**TEMPO ESTIMADO**: 10-15 minutos  

---

## 🎯 SOLUÇÃO RÁPIDA (3 Passos)

### 1️⃣ Obter Colunas do Banco

Acesse Supabase SQL Editor:
```
https://supabase.com/dashboard/project/nsvzqehytuqwfaerzmau
```

Execute:
```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'leads' 
ORDER BY ordinal_position;
```

**Copie TODOS os resultados** (todas as linhas, não só primeiras 10)

---

### 2️⃣ Identificar Coluna Problemática

**OPÇÃO A - Automática (Recomendado):**
```bash
cd /home/user/webapp
python3 compare_schema.py
```
- Cole os resultados do Supabase quando solicitado
- Pressione ENTER duas vezes
- Script mostrará qual coluna remover

**OPÇÃO B - Manual:**
- Abra `DIAGNOSTIC_GUIDE.md`
- Siga passos 1 a 3

---

### 3️⃣ Aplicar Fix

No Supabase SQL Editor, execute:
```sql
-- Exemplo: se script identificou 'customer_id' como coluna extra
ALTER TABLE leads DROP COLUMN IF EXISTS customer_id;

-- Repita para cada coluna extra identificada
```

Reinicie backend no Railway:
```
https://railway.app → Backend service → Restart
```

Teste:
```
https://upbeat-dedication-production.up.railway.app/api/leads
```

Deve retornar `200 OK` com array de leads.

---

## 📚 DOCUMENTAÇÃO COMPLETA

| Arquivo | Descrição |
|---------|-----------|
| `DIAGNOSTIC_GUIDE.md` | Guia passo a passo completo |
| `HANDOFF_DOCUMENT.md` | Contexto completo do problema |
| `SCHEMA_COMPARISON.md` | Lista de colunas esperadas |
| `SCHEMA_FIXES.sql` | Queries SQL prontas para usar |
| `SUPABASE_QUERIES.sql` | Queries de diagnóstico |
| `compare_schema.py` | Script de comparação automática |

---

## 🔗 LINKS IMPORTANTES

- **Admin Dashboard**: https://admin.flipcars.us
- **Backend API**: https://upbeat-dedication-production.up.railway.app/api
- **Supabase**: https://supabase.com/dashboard/project/nsvzqehytuqwfaerzmau
- **Railway**: https://railway.app

**Credenciais Admin**: `admin@flipcars.us` / `Admin123!`

---

## 🆘 AJUDA RÁPIDA

### Erro: "permission denied" no Supabase
- Use conta com role admin/owner

### Erro: Script Python não executa
```bash
chmod +x compare_schema.py
python3 compare_schema.py
```

### API ainda retorna 500 após fix
- Verificar logs do Railway
- Reiniciar backend novamente
- Executar query de teste no Supabase (ver `SCHEMA_FIXES.sql`)

### Admin dashboard não atualiza
- Limpar cache: Ctrl+Shift+R
- Tentar aba anônima
- Verificar console (F12)

---

## 🎓 COLUNAS SUSPEITAS

Baseado no histórico, estas colunas podem estar causando o problema:

🔴 **Alta probabilidade**:
- `customer_id` (comentada na entidade)
- `contact_preferences` (comentada na entidade)
- `vehicle_id` (comentada na entidade)
- `assigned_human_agent_id` (comentada na entidade)

🟢 **Baixa probabilidade**:
- `service_type` (já confirmada que NÃO existe)

---

## ✅ CHECKLIST DE RESOLUÇÃO

- [ ] Query do Supabase executada
- [ ] Resultados completos copiados
- [ ] Script de comparação rodado OU comparação manual feita
- [ ] Colunas extras identificadas
- [ ] ALTER TABLE executado no Supabase
- [ ] Backend reiniciado no Railway
- [ ] GET /api/leads retorna 200 OK
- [ ] Admin dashboard mostra 33 leads
- [ ] HANDOFF_DOCUMENT.md atualizado para status ✅ RESOLVED

---

**Última atualização**: 2025-11-22  
**Próximo passo**: Execute o passo 1 (obter colunas do Supabase)
