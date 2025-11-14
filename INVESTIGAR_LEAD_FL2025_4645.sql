-- =====================================================
-- INVESTIGAÇÃO: Lead FL-2025-4645 não aparece no admin
-- =====================================================

-- 1. Verificar se o lead existe
SELECT 
  'Lead FL-2025-4645 EXISTS?' as check_type,
  COUNT(*) as count
FROM leads
WHERE "leadNumber" = 'FL-2025-4645';

-- 2. Se existe, mostrar todos os dados
SELECT 
  '=== LEAD DETAILS ===' as section,
  *
FROM leads
WHERE "leadNumber" = 'FL-2025-4645';

-- 3. Contar total de leads no banco
SELECT 
  '=== TOTAL LEADS IN DATABASE ===' as section,
  COUNT(*) as total_leads
FROM leads;

-- 4. Encontrar a posição do lead FL-2025-4645 na lista ordenada por createdAt DESC
WITH ranked_leads AS (
  SELECT 
    "leadNumber",
    nome,
    email,
    "createdAt",
    ROW_NUMBER() OVER (ORDER BY "createdAt" DESC) as position
  FROM leads
)
SELECT 
  '=== POSITION OF FL-2025-4645 ===' as section,
  *
FROM ranked_leads
WHERE "leadNumber" = 'FL-2025-4645';

-- 5. Mostrar os 10 leads mais recentes para comparação
SELECT 
  '=== TOP 10 MOST RECENT LEADS ===' as section,
  "leadNumber",
  nome,
  email,
  "createdAt",
  origem
FROM leads
ORDER BY "createdAt" DESC
LIMIT 10;

-- 6. Verificar se há algum filtro ou exclusão
SELECT 
  '=== LEADS WITH STATUS/FILTERS ===' as section,
  status,
  COUNT(*) as count
FROM leads
GROUP BY status
ORDER BY count DESC;

-- 7. Verificar último lead criado via "Formulário Público"
SELECT 
  '=== LATEST PUBLIC FORM LEADS ===' as section,
  "leadNumber",
  nome,
  email,
  "createdAt",
  origem
FROM leads
WHERE origem = 'Formulário Público' OR origem = 'website'
ORDER BY "createdAt" DESC
LIMIT 5;

-- 8. Procurar por nome contendo "Juan" ou "Felipe"
SELECT 
  '=== LEADS WITH NAME CONTAINING JUAN OR FELIPE ===' as section,
  "leadNumber",
  nome,
  email,
  telefone,
  "createdAt"
FROM leads
WHERE nome ILIKE '%Juan%' OR nome ILIKE '%Felipe%'
ORDER BY "createdAt" DESC
LIMIT 10;

-- 9. Verificar se existe problema com o campo leadNumber
SELECT 
  '=== CHECK leadNumber VARIATIONS ===' as section,
  "leadNumber"
FROM leads
WHERE "leadNumber" LIKE '%2025-4645%' OR "leadNumber" LIKE '%4645%'
ORDER BY "createdAt" DESC;

-- 10. Verificar campos relevantes da tabela
SELECT 
  '=== TABLE SCHEMA CHECK ===' as section,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'leads'
AND column_name IN ('leadNumber', 'createdAt', 'nome', 'email', 'status', 'origem')
ORDER BY column_name;
