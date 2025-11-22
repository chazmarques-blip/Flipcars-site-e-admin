-- Add deleted_at column to leads table (safe - checks if exists first)

-- Check if column exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'leads' AND column_name = 'deleted_at'
    ) THEN
        -- Add the column
        ALTER TABLE leads ADD COLUMN deleted_at TIMESTAMP NULL;
        
        -- Add index for performance
        CREATE INDEX idx_leads_deleted_at ON leads (deleted_at);
        
        RAISE NOTICE 'Column deleted_at added successfully';
    ELSE
        RAISE NOTICE 'Column deleted_at already exists';
    END IF;
END $$;
