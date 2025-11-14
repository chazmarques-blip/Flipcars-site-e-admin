-- =====================================================
-- BUSCAR LEAD FL-2025-4645 - Query Corrigida
-- =====================================================
-- ATENÇÃO: PostgreSQL é case-sensitive com aspas duplas!
-- Use aspas duplas apenas se necessário

-- Query 1: Descobrir posição do lead (SEM aspas duplas)
WITH ranked_leads AS (
  SELECT 
    leadNumber,
    nome,
    createdAt,
    ROW_NUMBER() OVER (ORDER BY createdAt DESC) as position
  FROM leads
)
SELECT * FROM ranked_leads WHERE leadNumber = 'FL-2025-4645';

-- Query 2: Buscar diretamente (mais simples)
SELECT 
  leadNumber,
  nome,
  email,
  telefone,
  createdAt,
  status,
  origem
FROM leads
WHERE leadNumber = 'FL-2025-4645';

-- Query 3: Contar total de leads
SELECT COUNT(*) as total_leads FROM leads;

-- Query 4: Ver os 10 mais recentes
SELECT 
  leadNumber,
  nome,
  email,
  createdAt,
  origem
FROM leads
ORDER BY createdAt DESC
LIMIT 10;

-- Query 5: Procurar por nome (caso leadNumber não exista)
SELECT 
  leadNumber,
  nome,
  email,
  telefone,
  createdAt
FROM leads
WHERE nome ILIKE '%Juan%' OR nome ILIKE '%Felipe%'
ORDER BY createdAt DESC
LIMIT 5;
