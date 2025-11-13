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
