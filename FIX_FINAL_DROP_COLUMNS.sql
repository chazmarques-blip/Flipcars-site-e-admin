-- ========================================
-- FIX FINAL - Drop Columns Completely
-- ========================================
-- Execute este SQL NO SUPABASE para resolver definitivamente

-- PASSO 1: Drop colunas com CASCADE (remove dependências)
ALTER TABLE public.leads 
DROP COLUMN IF EXISTS preferred_time_slot CASCADE;

ALTER TABLE public.leads 
DROP COLUMN IF EXISTS preferred_date CASCADE;

-- PASSO 2: Verificar se há views que usam essas colunas
SELECT 
    table_name,
    view_definition
FROM information_schema.views
WHERE view_definition ILIKE '%preferred_date%'
   OR view_definition ILIKE '%preferred_time_slot%';

-- PASSO 3: Verificar triggers
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'leads';

-- PASSO 4: Confirmar remoção (DEVE retornar 0 linhas)
SELECT 
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'leads'
AND (column_name = 'preferred_date' OR column_name = 'preferred_time_slot');

-- PASSO 5: Testar SELECT básico
SELECT 
    id,
    reference_number,
    name,
    email,
    phone,
    status,
    created_at
FROM public.leads
LIMIT 5;

-- PASSO 6: Ver estrutura final da tabela
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'leads'
ORDER BY ordinal_position;
