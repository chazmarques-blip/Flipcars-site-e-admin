INSERT INTO users (id, name, email, password, role, is_active, created_at, updated_at)
VALUES (gen_random_uuid(), 'Admin FlipCars US', 'admin@flipcars.us', 
        '$2b$10$sOp.Px5gY8th1v9Ngp33M.9Sm7A36U2sGsraUyoZL7uSFeQCgsBOa',
        'admin', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;
