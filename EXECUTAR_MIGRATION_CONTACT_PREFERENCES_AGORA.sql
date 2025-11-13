-- ============================================================================
-- MIGRATION: Adicionar Coluna contact_preferences à Tabela leads
-- ============================================================================
-- 
-- Arquivo original: backend/src/database/migrations/1731538800000-AddContactPreferencesToLeads.ts
-- Data de criação: 13 de novembro de 2024
--
-- ONDE EXECUTAR:
--   Supabase SQL Editor: https://supabase.com/dashboard/project/kvjvieekkudeqtnunqlb/sql
--
-- ============================================================================

-- 1. Verificar se a coluna já existe (evitar erro se rodar 2x)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'leads' 
        AND column_name = 'contact_preferences'
    ) THEN
        -- 2. Adicionar a coluna contact_preferences
        ALTER TABLE "leads" 
        ADD COLUMN "contact_preferences" jsonb NULL;
        
        RAISE NOTICE 'Coluna contact_preferences adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna contact_preferences já existe!';
    END IF;
END $$;

-- 3. Verificar a estrutura da coluna
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'leads'
AND column_name = 'contact_preferences';

-- 4. Testar com um SELECT
SELECT 
    id,
    reference_number,
    contact_preferences
FROM leads
LIMIT 5;

-- ============================================================================
-- EXPLICAÇÃO DA COLUNA:
-- ============================================================================
--
-- contact_preferences armazena as preferências de contato do cliente em formato JSON:
--
-- Exemplo 1 (Phone Call + WhatsApp):
-- {
--   "phoneCall": true,
--   "whatsapp": true,
--   "textMessage": false
-- }
--
-- Exemplo 2 (Todas as opções):
-- {
--   "phoneCall": true,
--   "whatsapp": true,
--   "textMessage": true
-- }
--
-- Exemplo 3 (Nenhuma preferência):
-- null
--
-- ============================================================================
-- COMO SERÁ EXIBIDO NO ADMIN DASHBOARD:
-- ============================================================================
--
-- Na coluna "Preferred Contact", você verá ícones coloridos:
--
-- 🟡 Phone Call    - Fundo gold (#C89B3C), borda gold
-- ⚫ WhatsApp      - Fundo dark gray (#1f2937), borda gray
-- ⚪ Text Message  - Fundo light gray (#f3f4f6), texto gray
--
-- Quando hover (passar o mouse), aparece o tooltip com o nome.
--
-- ============================================================================
-- PÓS-MIGRATION:
-- ============================================================================
--
-- Depois de executar este SQL:
--
-- 1. ✅ Coluna contact_preferences estará disponível
-- 2. ✅ Backend conseguirá fazer SELECT sem erro
-- 3. ✅ Admin dashboard poderá carregar os leads
-- 4. ✅ Novos leads salvos pelo formulário público terão as preferências
--
-- ============================================================================
-- VERIFICAÇÃO:
-- ============================================================================
--
-- Para confirmar que a migration funcionou, execute:
--
-- curl -s 'https://kvjvieekkudeqtnunqlb.supabase.co/rest/v1/leads?select=id,contact_preferences&limit=1' \
--   -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2anZpZWVra3VkZXF0bnVucWxiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTc1MTY0OSwiZXhwIjoyMDc3MzI3NjQ5fQ.HdU6WH0JS-oNam1nkHvax6JQC3221VkFXpY1Ejz2x04"
--
-- ✅ Resultado esperado (SEM erro 42703):
-- [{"id":"...","contact_preferences":null}]
--
-- ❌ Se mostrar erro 42703, a migration não foi executada corretamente
--
-- ============================================================================
-- ROLLBACK (DESFAZER):
-- ============================================================================
--
-- Se precisar remover a coluna (não recomendado após dados em produção):
--
-- ALTER TABLE "leads" DROP COLUMN "contact_preferences";
--
-- ============================================================================
