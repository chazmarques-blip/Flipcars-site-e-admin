-- Update all leads with default contact preferences
UPDATE leads 
SET contact_preferences = '{"phoneCall": true, "whatsapp": true, "textMessage": true}'::jsonb
WHERE contact_preferences IS NULL;

-- Verify the update
SELECT 
  id, 
  name, 
  email, 
  contact_preferences
FROM leads
LIMIT 10;
