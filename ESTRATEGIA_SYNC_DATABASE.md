# 🛡️ ESTRATÉGIA DE SINCRONIZAÇÃO DATABASE ↔ BACKEND

## 📋 PROBLEMA QUE ENFRENTAMOS

Tivemos conflitos entre:
- Código backend (entities) referenciando campos que não existem
- Database schema não tendo essas colunas
- TypeORM falhando ao tentar buscar colunas inexistentes

**Resultado:** Erro 500 em produção

---

## 🎯 SOLUÇÃO: ABORDAGEM DE 3 CAMADAS

### **OPÇÃO 1: DATABASE FIRST (Recomendado para Produção)**

Sempre sincronize o banco ANTES do código.

**Vantagens:**
- ✅ Produção nunca quebra
- ✅ Rollback é fácil
- ✅ Dados preservados
- ✅ Zero downtime possível

**Processo:**
```
1. Criar Migration no código
2. Testar Migration localmente
3. Aplicar Migration em produção
4. DEPOIS fazer deploy do código
```

---

### **OPÇÃO 2: CODE FIRST (Recomendado para Desenvolvimento)**

Sincronize automaticamente com TypeORM sync.

**Vantagens:**
- ✅ Desenvolvimento rápido
- ✅ Menos erros de esquecimento
- ✅ TypeORM gerencia tudo

**Desvantagens:**
- ⚠️ PERIGOSO em produção
- ⚠️ Pode dropar dados
- ⚠️ Não tem controle fino

---

### **OPÇÃO 3: HÍBRIDA (MELHOR PARA FLIPCARS)**

Desenvolvimento com sync, Produção com migrations.

---

## 🔧 IMPLEMENTAÇÃO: ESTRATÉGIA HÍBRIDA

### 1️⃣ **AMBIENTE DE DESENVOLVIMENTO**

**Ative TypeORM Synchronize:**

```typescript
// backend/src/database/database.config.ts
export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    // ... outras configs
    
    // 🔥 SYNC AUTOMÁTICO APENAS EM DEV
    synchronize: !isProduction, // true em dev, false em prod
    
    // 🔥 MIGRATIONS APENAS EM PRODUÇÃO
    migrationsRun: isProduction,
    migrations: ['dist/database/migrations/**/*.js'],
  };
};
```

**Como usar:**
```bash
# Desenvolvimento local
NODE_ENV=development npm run start:dev
# TypeORM cria/atualiza tabelas automaticamente

# Produção
NODE_ENV=production npm run start:prod
# TypeORM usa apenas migrations
```

---

### 2️⃣ **WORKFLOW PARA ADICIONAR NOVOS CAMPOS**

#### **PASSO A PASSO SEGURO:**

```bash
# 1. Adicione o campo na Entity
# backend/src/database/entities/lead.entity.ts

@Column({ type: 'jsonb', nullable: true, name: 'contact_preferences' })
contactPreferences?: {
  phoneCall?: boolean;
  whatsapp?: boolean;
  textMessage?: boolean;
};

# 2. Adicione nos DTOs
# backend/src/modules/leads/dto/create-lead.dto.ts

@IsOptional()
contactPreferences?: {
  phoneCall?: boolean;
  whatsapp?: boolean;
  textMessage?: boolean;
};

# 3. TESTE LOCALMENTE (sync automático cria a coluna)
npm run start:dev

# 4. GERE A MIGRATION
npm run migration:generate -- -n AddContactPreferencesToLeads

# 5. REVISE A MIGRATION GERADA
# Verifique em: backend/src/database/migrations/

# 6. TESTE A MIGRATION LOCALMENTE
npm run migration:run

# 7. COMMIT E PUSH
git add .
git commit -m "feat: add contact_preferences to leads"
git push

# 8. NO RAILWAY: Execute migration ANTES do deploy
# Opção A: Via Railway CLI
railway run npm run migration:run

# Opção B: Script no package.json
"build:prod": "npm run migration:run && npm run build"
```

---

### 3️⃣ **CONFIGURAÇÃO ATUAL DO FLIPCARS**

#### **Verificar configuração atual:**

```bash
# Verificar se synchronize está habilitado
grep -r "synchronize" backend/src/database/
```

#### **Ajustar para estratégia híbrida:**

```typescript
// backend/src/database/database.module.ts ou similar

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  
  // 🔥 ESTRATÉGIA HÍBRIDA
  synchronize: process.env.NODE_ENV !== 'production',
  migrationsRun: process.env.NODE_ENV === 'production',
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  
  // 🔒 SEGURANÇA
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
  
  logging: process.env.NODE_ENV !== 'production',
};
```

---

### 4️⃣ **COMANDOS ÚTEIS PARA MIGRATIONS**

#### **Adicione ao package.json:**

```json
{
  "scripts": {
    "migration:generate": "typeorm-ts-node-commonjs migration:generate -d src/database/data-source.ts",
    "migration:create": "typeorm-ts-node-commonjs migration:create",
    "migration:run": "typeorm-ts-node-commonjs migration:run -d src/database/data-source.ts",
    "migration:revert": "typeorm-ts-node-commonjs migration:revert -d src/database/data-source.ts",
    "migration:show": "typeorm-ts-node-commonjs migration:show -d src/database/data-source.ts",
    
    "schema:drop": "typeorm-ts-node-commonjs schema:drop -d src/database/data-source.ts",
    "schema:sync": "typeorm-ts-node-commonjs schema:sync -d src/database/data-source.ts",
    "schema:log": "typeorm-ts-node-commonjs schema:log -d src/database/data-source.ts"
  }
}
```

---

### 5️⃣ **DATA SOURCE CONFIG**

#### **Criar arquivo: backend/src/database/data-source.ts**

```typescript
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false, // Sempre false para migrations
  logging: true,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
});
```

---

## 🚨 REGRAS DE OURO

### ✅ **SEMPRE FAÇA:**

1. **Teste localmente ANTES de produção**
   ```bash
   npm run migration:generate -- -n MyNewFeature
   npm run migration:run
   # Teste a aplicação
   npm run migration:revert # Se algo der errado
   ```

2. **Use nomes descritivos em migrations**
   ```
   ✅ AddContactPreferencesToLeads
   ✅ CreateCustomersTable
   ❌ Migration1234567890
   ```

3. **Revise migrations geradas**
   - TypeORM pode gerar código desnecessário
   - Sempre verifique antes de aplicar

4. **Commit migrations COM o código**
   ```bash
   git add backend/src/database/migrations/
   git add backend/src/**/*.entity.ts
   git commit -m "feat: add new field with migration"
   ```

5. **Documente mudanças complexas**
   - Adicione comentários na migration
   - Explique o "porquê" da mudança

---

### ❌ **NUNCA FAÇA:**

1. **Editar migrations já aplicadas**
   - Crie uma NOVA migration para correções

2. **Dropar colunas com dados importantes sem backup**
   ```typescript
   // ❌ PERIGOSO
   await queryRunner.dropColumn('leads', 'important_data');
   
   // ✅ SEGURO
   // 1. Crie backup primeiro
   // 2. Migre dados para nova coluna
   // 3. Então drop a coluna antiga
   ```

3. **Usar synchronize: true em produção**
   ```typescript
   // ❌ NUNCA
   synchronize: true
   
   // ✅ SEMPRE
   synchronize: process.env.NODE_ENV !== 'production'
   ```

4. **Deploy código ANTES da migration**
   ```bash
   # ❌ ORDEM ERRADA
   git push (Railway deploy código novo)
   npm run migration:run (Depois aplica migration)
   
   # ✅ ORDEM CERTA
   npm run migration:run (Railway CLI)
   git push (Depois deploy código)
   ```

5. **Ignorar erros de migration**
   - Se migration falhar, INVESTIGUE
   - Não force código para produção

---

## 🔄 CHECKLIST DE DEPLOYMENT SEGURO

### **Antes de qualquer mudança no schema:**

```
[ ] 1. Código + Migration criados e testados localmente
[ ] 2. Migration revisada e aprovada
[ ] 3. Backup do banco de dados criado
[ ] 4. Migration commitada no git
[ ] 5. Railway: Migration executada via CLI
[ ] 6. Railway: Verificar logs de sucesso
[ ] 7. Git push para deploy do código
[ ] 8. Railway: Verificar logs do deploy
[ ] 9. Testar endpoints manualmente
[ ] 10. Confirmar funcionamento em produção
```

---

## 🛠️ FERRAMENTAS AUXILIARES

### **1. Database Backup Automático**

```bash
# Criar script de backup
cat > backup-db.sh << 'SCRIPT'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > "backups/backup_${DATE}.sql"
echo "Backup criado: backup_${DATE}.sql"
SCRIPT

chmod +x backup-db.sh
```

### **2. Migration Validator**

```typescript
// scripts/validate-migration.ts
import { AppDataSource } from '../src/database/data-source';

async function validateMigration() {
  await AppDataSource.initialize();
  
  // Verificar pending migrations
  const pendingMigrations = await AppDataSource.showMigrations();
  console.log('Pending migrations:', pendingMigrations);
  
  await AppDataSource.destroy();
}

validateMigration();
```

### **3. Schema Diff Tool**

```bash
# Ver diferenças entre Entity e Database
npm run schema:log
```

---

## 📚 DOCUMENTAÇÃO PARA O TIME

### **Para desenvolvedores:**

```markdown
## Adicionando novo campo

1. Edite a Entity
2. Execute: npm run start:dev (sync automático em dev)
3. Teste localmente
4. Gere migration: npm run migration:generate -- -n NomeDoCampo
5. Revise a migration
6. Commit tudo junto
7. Avise o time antes do deploy
```

### **Para deploy em produção:**

```markdown
## Checklist de Deploy

1. Pull latest main
2. npm install
3. npm run migration:run (Railway CLI)
4. Verificar logs de sucesso
5. git push (trigger deploy)
6. Monitorar logs do Railway
7. Testar manualmente
```

---

## 🎯 RECOMENDAÇÃO FINAL PARA FLIPCARS

### **IMPLEMENTAR AGORA:**

1. ✅ Ajustar `synchronize` para híbrido (dev=true, prod=false)
2. ✅ Criar arquivo `data-source.ts`
3. ✅ Adicionar comandos de migration no `package.json`
4. ✅ Criar checklist de deployment
5. ✅ Documentar processo para o time

### **FAZER ANTES DE PRÓXIMAS MUDANÇAS:**

1. ✅ Backup do banco de dados
2. ✅ Testar migrations localmente
3. ✅ Seguir workflow documentado

---

## 📞 EM CASO DE EMERGÊNCIA

### **Se algo quebrar em produção:**

```bash
# 1. Reverter última migration
npm run migration:revert

# 2. Reverter deploy no Railway
# Via dashboard: Deployments → Rollback

# 3. Investigar logs
railway logs

# 4. Corrigir localmente
# 5. Testar novamente
# 6. Redeploy
```

---

**Data:** 2025-11-13  
**Autor:** GenSpark AI Assistant  
**Status:** ✅ Documentado e pronto para implementação
