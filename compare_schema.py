#!/usr/bin/env python3
"""
Schema Comparison Tool - FlipCars Lead Entity vs Database
Compara as colunas da entidade TypeORM com as colunas do banco de dados Supabase
"""

# Colunas esperadas na entidade TypeORM (lead.entity.ts)
ENTITY_COLUMNS = {
    'id': 'uuid',
    'reference_number': 'character varying',
    'name': 'character varying',
    'phone': 'character varying',
    'email': 'character varying',
    'preferred_language': 'character varying',
    'vehicle_year': 'character varying',
    'vehicle_make': 'character varying',
    'vehicle_model': 'character varying',
    'vehicle_color': 'character varying',
    'has_insurance': 'boolean',
    'insurance_provider': 'character varying',
    'claim_number': 'character varying',
    'accident_description': 'text',
    'accident_date': 'date',
    'is_drivable': 'boolean',
    'needs_tow': 'boolean',
    'needs_rental': 'boolean',
    'damage_photos': 'jsonb',
    'ai_qualification_score': 'integer',
    'ai_conversation_history': 'jsonb',
    'last_ai_interaction': 'timestamp without time zone',
    'assigned_ai_agent': 'character varying',
    'last_human_interaction': 'timestamp without time zone',
    'status': 'character varying',
    'priority': 'character varying',
    'notes': 'text',
    'estimated_value': 'numeric',
    'source': 'character varying',
    'preferred_date': 'date',
    'preferred_time_slot': 'character varying',
    'created_at': 'timestamp without time zone',
    'updated_at': 'timestamp without time zone',
}

def parse_supabase_results(results_text):
    """
    Parse os resultados do Supabase SQL Editor
    Formato esperado: column_name | data_type | is_nullable | column_default
    """
    db_columns = {}
    lines = results_text.strip().split('\n')
    
    for line in lines:
        # Ignorar linhas vazias ou cabeçalhos
        if not line.strip() or '---' in line or 'column_name' in line.lower():
            continue
            
        # Parse do formato: name | type | nullable | default
        parts = [p.strip() for p in line.split('|')]
        if len(parts) >= 2:
            column_name = parts[0]
            data_type = parts[1]
            db_columns[column_name] = data_type
    
    return db_columns

def compare_schemas(entity_cols, db_cols):
    """Compara as colunas da entidade com as colunas do banco"""
    
    entity_set = set(entity_cols.keys())
    db_set = set(db_cols.keys())
    
    # Colunas que existem na entidade mas NÃO no banco
    missing_in_db = entity_set - db_set
    
    # Colunas que existem no banco mas NÃO na entidade
    extra_in_db = db_set - entity_set
    
    # Colunas em comum
    common = entity_set & db_set
    
    return {
        'missing_in_db': sorted(missing_in_db),
        'extra_in_db': sorted(extra_in_db),
        'common': sorted(common),
    }

def print_report(comparison, db_cols):
    """Imprime relatório de comparação"""
    
    print("=" * 80)
    print("🔍 SCHEMA COMPARISON REPORT - FlipCars Leads Table")
    print("=" * 80)
    print()
    
    # Colunas extras no banco (PROBLEMA!)
    if comparison['extra_in_db']:
        print("❌ COLUNAS EXTRAS NO BANCO (Não estão na entidade TypeORM)")
        print("-" * 80)
        print("⚠️  ESTAS COLUNAS PODEM ESTAR CAUSANDO O ERRO 500!")
        print()
        for col in comparison['extra_in_db']:
            print(f"   • {col} ({db_cols.get(col, 'unknown type')})")
        print()
        print("💡 SOLUÇÃO: Remover estas colunas do banco OU adicionar na entidade")
        print()
    else:
        print("✅ Não há colunas extras no banco")
        print()
    
    # Colunas faltando no banco
    if comparison['missing_in_db']:
        print("⚠️  COLUNAS FALTANDO NO BANCO (Existem na entidade mas não no DB)")
        print("-" * 80)
        for col in comparison['missing_in_db']:
            print(f"   • {col}")
        print()
        print("💡 SOLUÇÃO: Criar migration para adicionar estas colunas")
        print()
    else:
        print("✅ Todas as colunas da entidade existem no banco")
        print()
    
    # Estatísticas
    print("📊 ESTATÍSTICAS")
    print("-" * 80)
    print(f"   • Colunas na entidade: {len(ENTITY_COLUMNS)}")
    print(f"   • Colunas no banco: {len(db_cols)}")
    print(f"   • Colunas em comum: {len(comparison['common'])}")
    print(f"   • Colunas extras no banco: {len(comparison['extra_in_db'])}")
    print(f"   • Colunas faltando no banco: {len(comparison['missing_in_db'])}")
    print()
    
    # Próximos passos
    print("🎯 PRÓXIMOS PASSOS")
    print("-" * 80)
    if comparison['extra_in_db']:
        print("1. Execute no Supabase SQL Editor:")
        print()
        for col in comparison['extra_in_db']:
            print(f"   ALTER TABLE leads DROP COLUMN IF EXISTS {col};")
        print()
        print("2. Reinicie o backend no Railway")
        print("3. Teste o endpoint: GET /api/leads")
        print("4. Verifique o admin dashboard")
    elif comparison['missing_in_db']:
        print("1. Criar migration para adicionar colunas faltando")
        print("2. Rodar migration no banco")
        print("3. Reiniciar backend")
    else:
        print("✅ Schema está sincronizado!")
        print("⚠️  Se erro 500 persiste, verificar logs do backend para outros erros")
    print()
    print("=" * 80)

def main():
    print("FlipCars Schema Comparison Tool")
    print("=" * 80)
    print()
    print("📋 Cole os resultados da query do Supabase:")
    print("   SELECT column_name, data_type, is_nullable, column_default")
    print("   FROM information_schema.columns")
    print("   WHERE table_name = 'leads'")
    print("   ORDER BY ordinal_position;")
    print()
    print("Cole TODAS as linhas e pressione ENTER duas vezes quando terminar:")
    print()
    
    # Ler múltiplas linhas até linha vazia
    lines = []
    while True:
        try:
            line = input()
            if not line:
                break
            lines.append(line)
        except EOFError:
            break
    
    if not lines:
        print("❌ Nenhum dado fornecido!")
        return
    
    results_text = '\n'.join(lines)
    
    # Parse e compare
    db_cols = parse_supabase_results(results_text)
    
    if not db_cols:
        print("❌ Não foi possível fazer parse dos resultados!")
        print("⚠️  Certifique-se de colar os resultados no formato correto")
        return
    
    comparison = compare_schemas(ENTITY_COLUMNS, db_cols)
    print_report(comparison, db_cols)

if __name__ == '__main__':
    main()
