-- ========================================
-- MANUAL MIGRATION: Add Service Fields to Leads
-- Execute this in Supabase SQL Editor
-- ========================================

-- Check if columns already exist before adding
DO $$ 
BEGIN
    -- Add service_type column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leads' AND column_name = 'service_type'
    ) THEN
        ALTER TABLE leads ADD COLUMN service_type VARCHAR(20) NULL;
        RAISE NOTICE 'Added service_type column';
    ELSE
        RAISE NOTICE 'service_type column already exists';
    END IF;

    -- Add warranty_company column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leads' AND column_name = 'warranty_company'
    ) THEN
        ALTER TABLE leads ADD COLUMN warranty_company VARCHAR(100) NULL;
        RAISE NOTICE 'Added warranty_company column';
    ELSE
        RAISE NOTICE 'warranty_company column already exists';
    END IF;

    -- Add selected_services column (JSONB array)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leads' AND column_name = 'selected_services'
    ) THEN
        ALTER TABLE leads ADD COLUMN selected_services JSONB NULL;
        RAISE NOTICE 'Added selected_services column';
    ELSE
        RAISE NOTICE 'selected_services column already exists';
    END IF;

    -- Add symptoms_description column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leads' AND column_name = 'symptoms_description'
    ) THEN
        ALTER TABLE leads ADD COLUMN symptoms_description TEXT NULL;
        RAISE NOTICE 'Added symptoms_description column';
    ELSE
        RAISE NOTICE 'symptoms_description column already exists';
    END IF;
END $$;

-- Verify the columns were added
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'leads'
    AND column_name IN ('service_type', 'warranty_company', 'selected_services', 'symptoms_description')
ORDER BY column_name;

-- Show success message
SELECT 'Migration completed successfully! All service fields added to leads table.' AS status;
