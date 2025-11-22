#!/usr/bin/env python3
"""
Análise rápida das colunas do Supabase vs Entidade TypeORM
"""

# Colunas esperadas na entidade TypeORM (lead.entity.ts)
ENTITY_COLUMNS = {
    'id',
    'reference_number',
    'name',
    'phone',
    'email',
    'preferred_language',
    'vehicle_year',
    'vehicle_make',
    'vehicle_model',
    'vehicle_color',
    'has_insurance',
    'insurance_provider',
    'claim_number',
    'accident_description',
    'accident_date',
    'is_drivable',
    'needs_tow',
    'needs_rental',
    'damage_photos',
    'ai_qualification_score',
    'ai_conversation_history',
    'last_ai_interaction',
    'assigned_ai_agent',
    'last_human_interaction',
    'status',
    'priority',
    'notes',
    'estimated_value',
    'source',
    'preferred_date',
    'preferred_time_slot',
    'created_at',
    'updated_at',
}

# Colunas do banco (obtidas do Supabase)
DB_COLUMNS = {
    'id',
    'reference_number',
    'name',
    'phone',
    'email',
    'preferred_language',
    'vehicle_year',
    'vehicle_make',
    'vehicle_model',
    'vehicle_color',
    'has_insurance',
    'insurance_provider',
    'claim_number',
    'accident_description',
    'accident_date',
    'is_drivable',
    'needs_tow',
    'needs_rental',
    'damage_photos',
    'ai_qualification_score',
    'ai_conversation_history',
    'last_ai_interaction',
    'assigned_ai_agent',
    'assigned_human_agent_id',  # EXTRA!
    'last_human_interaction',
    'status',
    'priority',
    'notes',
    'estimated_value',
    'source',
    'created_at',
    'updated_at',
    'preferred_date',
    'preferred_time_slot',
}

# Colunas extras no banco (não estão na entidade)
extra_in_db = DB_COLUMNS - ENTITY_COLUMNS

# Colunas faltando no banco (estão na entidade mas não no banco)
missing_in_db = ENTITY_COLUMNS - DB_COLUMNS

# Colunas em comum
common = ENTITY_COLUMNS & DB_COLUMNS

print("=" * 80)
print("🔍 ANÁLISE DE SCHEMA - FlipCars Leads Table")
print("=" * 80)
print()

if extra_in_db:
    print("❌ PROBLEMA ENCONTRADO!")
    print("=" * 80)
    print()
    print("🚨 COLUNAS EXTRAS NO BANCO (Não estão na entidade TypeORM)")
    print("-" * 80)
    print()
    for col in sorted(extra_in_db):
        print(f"   • {col}")
    print()
    print("⚠️  ESTAS COLUNAS ESTÃO CAUSANDO O ERRO 500!")
    print()
    print("💡 SOLUÇÃO: Executar no Supabase SQL Editor:")
    print("-" * 80)
    print()
    for col in sorted(extra_in_db):
        print(f"   ALTER TABLE leads DROP COLUMN IF EXISTS {col};")
    print()
else:
    print("✅ Não há colunas extras no banco")
    print()

if missing_in_db:
    print("⚠️  COLUNAS FALTANDO NO BANCO")
    print("-" * 80)
    for col in sorted(missing_in_db):
        print(f"   • {col}")
    print()
else:
    print("✅ Todas as colunas da entidade existem no banco")
    print()

print("📊 ESTATÍSTICAS")
print("-" * 80)
print(f"   • Colunas na entidade: {len(ENTITY_COLUMNS)}")
print(f"   • Colunas no banco: {len(DB_COLUMNS)}")
print(f"   • Colunas em comum: {len(common)}")
print(f"   • Colunas extras no banco: {len(extra_in_db)}")
print(f"   • Colunas faltando no banco: {len(missing_in_db)}")
print()

if extra_in_db:
    print("🎯 PRÓXIMOS PASSOS")
    print("=" * 80)
    print()
    print("1. Executar o comando SQL acima no Supabase SQL Editor")
    print()
    print("2. Reiniciar backend no Railway:")
    print("   https://railway.app")
    print()
    print("3. Testar endpoint:")
    print("   GET https://upbeat-dedication-production.up.railway.app/api/leads")
    print("   (deve retornar 200 OK)")
    print()
    print("4. Verificar admin dashboard:")
    print("   https://admin.flipcars.us")
    print("   (deve mostrar 33 leads)")
    print()

print("=" * 80)
