# 🚀 IMPLEMENTAÇÃO RÁPIDA - PROTEÇÃO CONTRA CONFLITOS DE SCHEMA

## ✅ O QUE JÁ TEMOS

Verificando configuração atual do FlipCars:

✅ **data-source.ts** existe e está configurado
✅ **synchronize: false** na configuração atual (seguro!)
✅ **TypeOrmModule.forRootAsync** no app.module.ts
✅ **Migrations existentes** em backend/src/database/migrations/

**Status:** ✅ Sistema JÁ está configurado corretamente para produção!

---

## 🛡️ O QUE FALTA IMPLEMENTAR

### 1. **Adicionar Scripts de Migration ao package.json**

```bash
cd /home/user/webapp/backend
```

Adicione estes scripts ao `package.json`:

```json
{
  "scripts": {
    "migration:create": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli migration:create",
    "migration:run": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli migration:run -d src/database/data-source.ts",
    "migration:revert": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli migration:revert -d src/database/data-source.ts",
    "migration:show": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli migration:show -d src/database/data-source.ts",
    "schema:sync": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli schema:sync -d src/database/data-source.ts",
    "schema:log": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli schema:log -d src/database/data-source.ts",
    "schema:drop": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli schema:drop -d src/database/data-source.ts"
  }
}
```

---

### 2. **Habilitar Sync em Desenvolvimento (Opcional)**

⚠️ **APENAS se você quiser desenvolvimento mais rápido**

Edite `backend/src/database/data-source.ts`:

```typescript
const buildDatabaseConfig = async (): Promise<DataSourceOptions> => {
  const baseConfig = {
    type: 'postgres' as const,
    entities: [join(__dirname, 'entities', '*.entity{.ts,.js}')],
    migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],
    
    // 🔥 ESTRATÉGIA HÍBRIDA: Sync em dev, Migrations em prod
    synchronize: process.env.NODE_ENV === 'development', // ← MUDAR ESTA LINHA
    
    // ✅ SEMPRE rodar migrations em produção
    migrationsRun: process.env.NODE_ENV === 'production',
    
    logging: process.env.DATABASE_LOGGING === 'true',
    subscribers: [],
  };
  
  // ... resto do código
};
```

**Vantagens:**
- ✅ Em desenvolvimento local, TypeORM sincroniza automaticamente
- ✅ Em produção, usa apenas migrations (seguro)

**Desvantagens:**
- ⚠️ Desenvolvedores devem lembrar de gerar migrations antes de commit

---

### 3. **Criar Script de Backup**

```bash
cat > /home/user/webapp/backup-database.sh << 'EOF'
#!/bin/bash

# Script de backup do banco de dados FlipCars
# Uso: ./backup-database.sh

set -e

# Configurações
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/flipcars_backup_${DATE}.sql"

# Criar diretório se não existir
mkdir -p "$BACKUP_DIR"

# Verificar se DATABASE_URL está configurado
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Erro: DATABASE_URL não está configurada"
  echo "Configure com: export DATABASE_URL='sua-url'"
  exit 1
fi

echo "📦 Criando backup do banco de dados..."
echo "📁 Arquivo: $BACKUP_FILE"

# Criar backup
pg_dump "$DATABASE_URL" > "$BACKUP_FILE"

# Comprimir backup
gzip "$BACKUP_FILE"

echo "✅ Backup criado com sucesso!"
echo "📁 Arquivo comprimido: ${BACKUP_FILE}.gz"
echo "📊 Tamanho: $(du -h "${BACKUP_FILE}.gz" | cut -f1)"

# Listar backups
echo ""
echo "📋 Backups disponíveis:"
ls -lh "$BACKUP_DIR"/*.sql.gz 2>/dev/null || echo "Nenhum backup anterior"

# Limpar backups antigos (manter apenas últimos 10)
echo ""
echo "🧹 Limpando backups antigos (mantendo últimos 10)..."
ls -t "$BACKUP_DIR"/*.sql.gz | tail -n +11 | xargs rm -f 2>/dev/null || true

echo ""
echo "✅ Processo concluído!"
EOF

chmod +x /home/user/webapp/backup-database.sh
```

**Uso:**
```bash
export DATABASE_URL='sua-url-supabase'
./backup-database.sh
```

---

### 4. **Criar Checklist de Deploy**

```bash
cat > /home/user/webapp/CHECKLIST_DEPLOY.md << 'EOF'
# ✅ CHECKLIST DE DEPLOY SEGURO - FLIPCARS

Use este checklist SEMPRE que for fazer mudanças no schema do banco.

## 📋 PRÉ-DEPLOY

- [ ] Código testado localmente
- [ ] Migration gerada (se houver mudança de schema)
- [ ] Migration revisada e aprovada
- [ ] Migration testada localmente
- [ ] Commit e push realizados
- [ ] Backup do banco criado (./backup-database.sh)

## 🚀 DEPLOY EM PRODUÇÃO

- [ ] Acesso ao Railway Dashboard aberto
- [ ] Logs do Railway abertos e monitorando
- [ ] Migration executada via Railway CLI (se aplicável)
- [ ] Verificar logs: migration executada com sucesso
- [ ] Deploy automático do código (git push)
- [ ] Verificar logs: build bem-sucedido
- [ ] Verificar logs: aplicação iniciou sem erros

## 🧪 PÓS-DEPLOY

- [ ] Teste manual dos endpoints críticos
- [ ] Verificar admin dashboard funciona
- [ ] Verificar formulário público funciona
- [ ] Verificar leads aparecem corretamente
- [ ] Monitorar logs por 5 minutos

## 🚨 SE ALGO DER ERRADO

- [ ] Consultar ESTRATEGIA_SYNC_DATABASE.md
- [ ] Verificar logs do erro exato
- [ ] Reverter migration se necessário
- [ ] Rollback deploy no Railway
- [ ] Restaurar backup se necessário

## 📝 APÓS DEPLOY

- [ ] Documentar mudanças em changelog
- [ ] Avisar equipe que deploy foi concluído
- [ ] Fechar issue/ticket relacionado

---

**Última atualização:** 2025-11-13
EOF
```

---

## 🎯 WORKFLOW RECOMENDADO

### **Para adicionar novo campo (Ex: contact_preferences)**

```bash
# 1. Criar branch
git checkout -b feature/add-contact-preferences

# 2. Adicionar campo na Entity
# Edite: backend/src/database/entities/lead.entity.ts
# Adicione:
@Column({ type: 'jsonb', nullable: true, name: 'contact_preferences' })
contactPreferences?: {
  phoneCall?: boolean;
  whatsapp?: boolean;
  textMessage?: boolean;
};

# 3. Adicionar nos DTOs necessários
# Edite: backend/src/modules/leads/dto/*.dto.ts

# 4. Gerar migration
cd backend
npm run migration:generate -- src/database/migrations/AddContactPreferencesToLeads

# 5. Revisar migration gerada
cat src/database/migrations/*AddContactPreferencesToLeads.ts

# 6. Testar localmente
npm run start:dev
# Teste a aplicação manualmente

# 7. Commit tudo
git add .
git commit -m "feat: add contact_preferences field to leads

- Added contactPreferences JSONB column to leads table
- Updated DTOs to include contactPreferences
- Generated and tested migration
- All tests passing"

# 8. Push e criar PR
git push origin feature/add-contact-preferences
# Criar PR no GitHub

# 9. Após aprovação: Merge to main

# 10. Deploy em produção
# 10.1. Criar backup
export DATABASE_URL='sua-url'
./backup-database.sh

# 10.2. Executar migration via Railway CLI
railway link  # Se ainda não linkado
railway run npm run migration:run

# 10.3. Verificar logs
railway logs

# 10.4. Deploy automático ocorre via git push
git push origin main

# 10.5. Monitorar
railway logs --follow
```

---

## 📚 DOCUMENTAÇÃO ADICIONAL

Consulte estes documentos para mais detalhes:

1. **ESTRATEGIA_SYNC_DATABASE.md** - Guia completo de estratégia
2. **CHECKLIST_DEPLOY.md** - Checklist de deploy seguro
3. **README do projeto** - Documentação geral

---

## 🆘 COMANDOS ÚTEIS

```bash
# Ver diferenças entre Entity e Database
cd backend && npm run schema:log

# Ver migrations pendentes
cd backend && npm run migration:show

# Executar migrations pendentes
cd backend && npm run migration:run

# Reverter última migration
cd backend && npm run migration:revert

# Criar backup do banco
./backup-database.sh

# Ver logs do Railway
railway logs

# Executar comando no Railway
railway run <comando>
```

---

**Status:** ✅ Documentação completa  
**Data:** 2025-11-13  
**Autor:** GenSpark AI Assistant
