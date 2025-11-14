-- ============================================
-- SCRIPT DE DIAGNÓSTICO - LEADS NO BANCO DE DADOS
-- ============================================
-- Execute este script no PostgreSQL do Railway
-- para verificar os leads salvos no banco
-- ============================================

-- 1. CONTAR TOTAL DE LEADS
SELECT COUNT(*) as total_leads FROM leads;

-- 2. BUSCAR LEAD FL-2025-4645 ESPECÍFICO (Juan Felipe)
SELECT 
    id,
    reference_number,
    name,
    email,
    phone,
    vehicle_year,
    vehicle_make,
    vehicle_model,
    status,
    priority,
    created_at,
    updated_at
FROM leads
WHERE reference_number LIKE '%4645%'
   OR name LIKE '%Juan%'
   OR name LIKE '%Felipe%'
   OR email LIKE '%jufeliecn%'
ORDER BY created_at DESC;

-- 3. BUSCAR TODOS OS LEADS ORDENADOS POR DATA (MAIS RECENTES PRIMEIRO)
SELECT 
    id,
    reference_number,
    name,
    email,
    phone,
    vehicle_year,
    vehicle_make,
    vehicle_model,
    status,
    priority,
    created_at,
    updated_at
FROM leads
ORDER BY created_at DESC
LIMIT 10;

-- 4. VERIFICAR LEADS CRIADOS NAS ÚLTIMAS 24 HORAS
SELECT 
    reference_number,
    name,
    email,
    status,
    created_at
FROM leads
WHERE created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- 5. VERIFICAR LEADS CRIADOS NAS ÚLTIMAS 48 HORAS
SELECT 
    reference_number,
    name,
    email,
    status,
    created_at
FROM leads
WHERE created_at >= NOW() - INTERVAL '48 hours'
ORDER BY created_at DESC;

-- 6. VERIFICAR REFERÊNCIAS COM PADRÃO FL-2025
SELECT 
    reference_number,
    name,
    email,
    created_at
FROM leads
WHERE reference_number LIKE 'FL-2025%'
ORDER BY created_at DESC;

-- 7. VERIFICAR SE HÁ PROBLEMAS DE ENCODING NO NOME
SELECT 
    reference_number,
    name,
    LENGTH(name) as name_length,
    email,
    created_at
FROM leads
WHERE email LIKE '%jufeliecn%'
   OR phone LIKE '%407%'
ORDER BY created_at DESC;

-- 8. LISTAR TODAS AS REFERÊNCIAS DISPONÍVEIS (ÚLTIMAS 20)
SELECT reference_number, created_at
FROM leads
ORDER BY created_at DESC
LIMIT 20;

-- 9. VERIFICAR DADOS COMPLETOS DE UM LEAD ESPECÍFICO
SELECT *
FROM leads
WHERE reference_number = 'FL-2025-4645'
   OR name LIKE '%Juan Felipe%';
