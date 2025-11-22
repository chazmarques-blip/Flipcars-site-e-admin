# 🔍 SCHEMA COMPARISON TOOL

## 📊 Colunas Esperadas pela Entidade TypeORM

Baseado em `backend/src/database/entities/lead.entity.ts`:

```
✅ ACTIVE COLUMNS (currently in entity):
1. id - uuid (PK)
2. reference_number - varchar(50) UNIQUE
3. name - varchar(255)
4. phone - varchar(50)
5. email - varchar(255) NULLABLE
6. preferred_language - varchar(10) DEFAULT 'en'
7. vehicle_year - varchar(100) NULLABLE
8. vehicle_make - varchar(100) NULLABLE
9. vehicle_model - varchar(100) NULLABLE
10. vehicle_color - varchar(50) NULLABLE
11. has_insurance - boolean DEFAULT false
12. insurance_provider - varchar(100) NULLABLE
13. claim_number - varchar(100) NULLABLE
14. accident_description - text NULLABLE
15. accident_date - date NULLABLE
16. is_drivable - boolean DEFAULT true
17. needs_tow - boolean DEFAULT false
18. needs_rental - boolean DEFAULT false
19. damage_photos - jsonb DEFAULT '[]' NULLABLE
20. ai_qualification_score - integer NULLABLE
21. ai_conversation_history - jsonb DEFAULT '[]' NULLABLE
22. last_ai_interaction - timestamp NULLABLE
23. assigned_ai_agent - varchar(100) NULLABLE
24. last_human_interaction - timestamp NULLABLE
25. status - varchar(50) DEFAULT 'new'
26. priority - varchar(20) DEFAULT 'medium'
27. notes - text NULLABLE
28. estimated_value - decimal(10,2) NULLABLE
29. source - varchar(50) NULLABLE
30. preferred_date - date NULLABLE
31. preferred_time_slot - varchar(20) NULLABLE
32. created_at - timestamp
33. updated_at - timestamp

❌ DISABLED COLUMNS (commented out, should NOT exist in DB):
- customer_id (uuid)
- contact_preferences (jsonb)
- vehicle_id (uuid)
- assigned_human_agent_id (uuid)
```

## 🎯 Como Usar Este Documento

### Passo 1: Execute no Supabase SQL Editor
```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'leads' 
ORDER BY ordinal_position;
```

### Passo 2: Cole os resultados abaixo
```
[COLE AQUI OS RESULTADOS DO SUPABASE]
```

### Passo 3: Compare Manualmente
1. ✅ Verifique se todas as 33 colunas da entidade existem no banco
2. ❌ Identifique colunas que existem no BANCO mas NÃO na ENTIDADE
3. ⚠️ Identifique colunas que existem na ENTIDADE mas NÃO no BANCO

## 🚨 Suspeitas de Colunas Extras no Banco

Baseado no histórico, essas colunas podem estar no banco mas não na entidade:

1. **service_type** ⚠️ (Já confirmado que NÃO existe)
2. **customer_id** ❓ (Foi comentado na entidade)
3. **contact_preferences** ❓ (Foi comentado na entidade)
4. **vehicle_id** ❓ (Foi comentado na entidade)
5. **assigned_human_agent_id** ❓ (Foi comentado na entidade)

## 🔧 Soluções Possíveis

### Solução A: Adicionar Coluna à Entidade (se coluna é necessária)
```typescript
@Column({ type: 'varchar', nullable: true })
nomeColuna: string;
```

### Solução B: Remover Coluna do Banco (se coluna é legacy)
```sql
ALTER TABLE leads DROP COLUMN IF EXISTS nome_coluna;
```

### Solução C: Configurar TypeORM para Ignorar (temporário)
```typescript
// Em data-source.ts ou ormconfig.ts
{
  type: 'postgres',
  synchronize: false,
  // ...
}
```

## 📝 Anotações

_Escreva aqui suas descobertas durante a comparação_

---

**Criado em**: 2025-11-22
**Próximo passo**: Executar query no Supabase e colar resultados acima
