-- Check leads with appointment scheduling data
SELECT 
  id,
  phone,
  email,
  preferred_date,
  preferred_time_slot,
  contact_preferences,
  created_at
FROM leads
WHERE preferred_date IS NOT NULL
ORDER BY preferred_date ASC
LIMIT 10;

-- Or see all leads (even without appointments)
SELECT 
  id,
  phone,
  email,
  preferred_date,
  preferred_time_slot,
  created_at
FROM leads
ORDER BY created_at DESC
LIMIT 10;
