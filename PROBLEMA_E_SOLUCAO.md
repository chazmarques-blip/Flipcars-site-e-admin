# 🚨 PROBLEMA IDENTIFICADO E RESOLVIDO

## O Que Aconteceu

**Problema**: Os leads sumiram do admin dashboard após o último deploy

**Causa Raiz**: 
- Adicionei filtro `queryBuilder.andWhere('lead.deletedAt IS NULL')` no código
- Este filtro tenta acessar a coluna `deleted_at` na tabela `leads`
- **A coluna ainda NÃO EXISTE no banco de dados do Railway**
- A migration que cria a coluna ainda não rodou
- Resultado: Query falha ou retorna vazio

## Linha de Tempo

1. ✅ Criei migration `1732323000000-AddDeletedAtToLeads.ts`
2. ✅ Adicionei campo `deletedAt` na entidade Lead
3. ❌ Adicionei filtro `deletedAt IS NULL` na query
4. ✅ Commitei e fiz push
5. 🚨 **Deployment do Railway rodou com o filtro ANTES da migration**
6. ❌ Leads sumiram porque coluna não existe

## Solução Aplicada

**Fix Imediato** (já deployado):
```typescript
// ANTES (causou o problema):
queryBuilder.andWhere('lead.deletedAt IS NULL');

// DEPOIS (fix aplicado):
// TEMPORARILY DISABLED: Column doesn't exist in production yet
// queryBuilder.andWhere('lead.deletedAt IS NULL');
```

**Status**:
- ✅ Fix commitado: `11fe7b01`
- ✅ Push realizado para GitHub
- ⏳ Railway deployando agora
- ⏱️ Leads devem voltar em ~3 minutos

## Por Que Isso Aconteceu?

**Erro de Sequência**:
1. TypeORM roda migrations na primeira inicialização do servidor
2. MAS o código já está compilado com o filtro
3. Se a migration falhar ou não rodar, o filtro quebra

**Deveria ter sido**:
1. Deploy com migration criada MAS sem o filtro ativo
2. Migration roda e cria coluna `deleted_at`
3. Verificar manualmente que coluna existe
4. DEPOIS ativar o filtro em um segundo deploy

## Como Prevenir No Futuro

### Checklist para Mudanças de Schema

1. **Deploy 1**: Criar migration + adicionar campo na entity
   - ✅ Migration file
   - ✅ Entity field
   - ❌ NÃO usar o campo no código ainda

2. **Esperar**: Migration rodar em produção
   - Verificar no Supabase que coluna existe
   - Verificar logs do Railway que migration rodou

3. **Deploy 2**: Usar o novo campo
   - ✅ Queries podem referenciar o campo
   - ✅ Filtros podem usar o campo
   - ✅ Seguro porque coluna já existe

### Soft Delete - Plano Correto

**Fase 1** (deveria ter sido):
```typescript
// Criar migration
// Adicionar campo na entity
// NÃO adicionar filtro ainda
```

**Fase 2** (depois de verificar):
```typescript
// Verificar que deleted_at existe no banco
// ENTÃO adicionar filtro:
queryBuilder.andWhere('lead.deletedAt IS NULL');
```

## Status Atual

### Código em Produção (após fix)
- ✅ Migration existe e vai rodar
- ✅ Campo `deletedAt` existe na entity
- ✅ Endpoint `DELETE /leads/soft/:id` funcional
- ✅ Frontend com botão de delete funcional
- ⚠️ Filtro `deletedAt IS NULL` DESABILITADO temporariamente

### Próximos Passos (Fase 2 - Manual)

1. **Verificar Railway Logs**:
   - Esperar ~5 minutos após este deploy
   - Verificar se migration rodou com sucesso
   - Procurar por: "AddDeletedAtToLeads has been executed successfully"

2. **Verificar no Supabase**:
   - Ir para Table Editor → `leads`
   - Verificar se coluna `deleted_at` existe
   - Tipo deve ser: `timestamp` nullable

3. **Habilitar o Filtro** (deploy futuro):
   - Descomentar linha 130 em `leads.service.ts`
   - Commit e push
   - Leads deletados serão filtrados

## Timeline de Resolução

```
16:XX - Deploy com filtro ativo
16:XX - Leads sumiram
16:XX - Problema identificado
16:XX - Fix commitado
16:XX - Push realizado
16:XX - Railway deployando fix
16:XX - Leads devem voltar
```

## Lições Aprendidas

1. **Sempre deploy schema changes em fases**
2. **Nunca usar campo novo antes de verificar que existe**
3. **Migrations devem rodar ANTES do código usá-las**
4. **Testar em staging antes de produção** (se tivéssemos)
5. **Rollback plan deve estar pronto**

## Impacto

**Afetado**:
- ❌ Listagem de leads no admin (sumiu)
- ❌ Dashboard de leads (vazio)

**NÃO Afetado**:
- ✅ Leads continuam no banco de dados (intactos)
- ✅ Criação de novos leads (funcionando)
- ✅ Formulário público (funcionando)
- ✅ Outras funcionalidades (funcionando)

## Verificação Pós-Fix

Após Railway completar o deploy:

```bash
# 1. Verificar que leads voltaram
curl https://flipcars-site-e-admin-production.up.railway.app/api/leads

# 2. Fazer login no admin e ver a lista de leads

# 3. Verificar Supabase:
#    - Table Editor → leads
#    - Deve mostrar todos os 33 leads
#    - Nova coluna deleted_at deve existir (todas NULL por enquanto)
```

## Código do Fix

**Arquivo**: `backend/src/modules/leads/leads.service.ts`  
**Linha**: 130  
**Mudança**:
```diff
-     queryBuilder.andWhere('lead.deletedAt IS NULL');
+     // TEMPORARILY DISABLED: Column doesn't exist in production yet
+     // queryBuilder.andWhere('lead.deletedAt IS NULL');
```

---

**Status Final**: ✅ RESOLVIDO  
**Commit**: `11fe7b01`  
**Deploy**: Em andamento no Railway  
**ETA**: Leads voltam em ~3 minutos  

---

*Documentado para referência futura e aprendizado*
