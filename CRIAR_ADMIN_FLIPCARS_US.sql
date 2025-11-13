-- ============================================================================
-- CRIAR USUÁRIO ADMIN: admin@flipcars.us
-- ============================================================================
-- 
-- Este script cria um usuário administrador com o email admin@flipcars.us
-- para permitir o login no Admin Dashboard
--
-- CREDENCIAIS:
--   Email: admin@flipcars.us
--   Senha: Admin@FlipCars2024!
--
-- ONDE EXECUTAR:
--   Supabase SQL Editor: https://supabase.com/dashboard/project/kvjvieekkudeqtnunqlb/sql
--
-- ============================================================================

-- 1. Verificar se o usuário já existe
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM users WHERE email = 'admin@flipcars.us') THEN
        RAISE NOTICE 'Usuário admin@flipcars.us já existe!';
    ELSE
        -- 2. Criar o usuário admin
        INSERT INTO users (
            id,
            name,
            email,
            password,
            phone,
            status,
            language,
            email_verified,
            created_at,
            updated_at
        ) VALUES (
            gen_random_uuid(),
            'Admin FlipCars US',
            'admin@flipcars.us',
            '$2b$10$sOp.Px5gY8th1v9Ngp33M.9Sm7A36U2sGsraUyoZL7uSFeQCgsBOa',  -- Hash da senha: Admin@FlipCars2024!
            '+1 (305) 555-0100',
            'active',
            'en',
            true,
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Usuário admin@flipcars.us criado com sucesso!';
    END IF;
END $$;

-- 3. Verificar o usuário criado
SELECT 
    id,
    name,
    email,
    phone,
    status,
    language,
    email_verified,
    created_at
FROM users
WHERE email = 'admin@flipcars.us';

-- ============================================================================
-- INSTRUÇÕES PÓS-CRIAÇÃO:
-- ============================================================================
-- 
-- 1. Execute este script no Supabase SQL Editor
-- 2. Aguarde a confirmação: "Usuário admin@flipcars.us criado com sucesso!"
-- 3. Vá para: https://admin.flipcars.us/login
-- 4. Faça login com:
--    - Email: admin@flipcars.us
--    - Senha: Admin@FlipCars2024!
-- 5. ✅ Pronto! Dashboard deve carregar os leads
--
-- ============================================================================
-- OBSERVAÇÃO:
-- ============================================================================
--
-- A senha está hasheada com bcrypt (hash: $2b$10$...)
-- Texto original da senha: Admin@FlipCars2024!
-- 
-- Para gerar novo hash (se precisar mudar a senha):
-- ```javascript
-- const bcrypt = require('bcrypt');
-- const hash = await bcrypt.hash('SuaSenhaAqui', 10);
-- console.log(hash);
-- ```
--
-- ============================================================================
