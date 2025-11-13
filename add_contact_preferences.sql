-- Add contact_preferences column to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS contact_preferences jsonb DEFAULT NULL;

-- Add comment
COMMENT ON COLUMN leads.contact_preferences IS 'JSON object containing phone_call, whatsapp, and text_message preferences';
