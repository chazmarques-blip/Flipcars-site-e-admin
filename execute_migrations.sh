#!/bin/bash

# ============================================
# Execute All Pending Migrations
# ============================================

echo "🔧 Executando Migrations no Supabase..."
echo ""

# Supabase connection details
SUPABASE_URL="https://nsvzqehytuqwfaerzmau.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zdnpxZWh5dHVxd2ZhZXJ6bWF1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMTEyMzkzMywiZXhwIjoyMDQ2Njk5OTMzfQ.5oMOO5VuGdRTM9F8Ye28kHLpgpxgMNGxcUixhwfY9pE"
DB_URL="postgresql://postgres.nsvzqehytuqwfaerzmau:gx76iL2xSJnNKlFx@aws-0-us-east-1.pooler.supabase.com:6543/postgres"

echo "📋 Migrations a executar:"
echo "  1. add_scheduling_fields_migration.sql (Adicionar campos no leads)"
echo "  2. create_appointments_table.sql (Criar tabela appointments)"
echo ""

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "❌ psql não encontrado!"
    echo "📖 Execute as migrations manualmente no Supabase Dashboard:"
    echo ""
    echo "1. Acesse: https://supabase.com/dashboard/project/nsvzqehytuqwfaerzmau/editor"
    echo "2. Vá em: SQL Editor"
    echo "3. Cole e execute o conteúdo de:"
    echo "   - add_scheduling_fields_migration.sql"
    echo "   - create_appointments_table.sql"
    echo ""
    echo "📄 Conteúdo dos arquivos:"
    echo ""
    echo "════════════════════════════════════════"
    echo "1. add_scheduling_fields_migration.sql"
    echo "════════════════════════════════════════"
    cat add_scheduling_fields_migration.sql
    echo ""
    echo "════════════════════════════════════════"
    echo "2. create_appointments_table.sql"
    echo "════════════════════════════════════════"
    cat create_appointments_table.sql
    echo ""
    exit 1
fi

# Execute migrations
echo "1️⃣ Executando: add_scheduling_fields_migration.sql"
PGPASSWORD="gx76iL2xSJnNKlFx" psql "$DB_URL" -f add_scheduling_fields_migration.sql
if [ $? -eq 0 ]; then
    echo "   ✅ Migration 1 concluída"
else
    echo "   ❌ Erro na Migration 1"
fi
echo ""

echo "2️⃣ Executando: create_appointments_table.sql"
PGPASSWORD="gx76iL2xSJnNKlFx" psql "$DB_URL" -f create_appointments_table.sql
if [ $? -eq 0 ]; then
    echo "   ✅ Migration 2 concluída"
else
    echo "   ❌ Erro na Migration 2"
fi
echo ""

echo "✅ Migrations concluídas!"
echo ""
echo "🧪 Testando conexão com appointments..."
echo ""

# Test query
TEST_QUERY="SELECT COUNT(*) as total FROM appointments;"
RESULT=$(PGPASSWORD="gx76iL2xSJnNKlFx" psql "$DB_URL" -t -c "$TEST_QUERY" 2>&1)

if [ $? -eq 0 ]; then
    echo "✅ Tabela appointments está acessível!"
    echo "📊 Total de registros: $RESULT"
else
    echo "❌ Erro ao acessar tabela appointments"
    echo "$RESULT"
fi

echo ""
echo "════════════════════════════════════════"
echo "✅ Processo concluído!"
echo "════════════════════════════════════════"
