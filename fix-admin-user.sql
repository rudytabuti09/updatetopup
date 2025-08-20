-- Fix Admin User Script
-- Untuk user: tsagabbinary@gmail.com
-- User ID: 58a14e73-291e-4560-b47a-4051122de1d9

-- 1. Cek apakah user ada di auth.users
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at
FROM auth.users 
WHERE email = 'tsagabbinary@gmail.com';

-- 2. Cek apakah profile sudah ada
SELECT 
    id,
    username,
    full_name,
    role,
    is_verified,
    created_at
FROM profiles 
WHERE id = '58a14e73-291e-4560-b47a-4051122de1d9';

-- 3. Buat profile baru dengan role admin
INSERT INTO profiles (
    id,
    username,
    full_name,
    role,
    is_verified,
    total_spent,
    total_transactions,
    created_at,
    updated_at
) VALUES (
    '58a14e73-291e-4560-b47a-4051122de1d9',
    'admin_tsaga',
    'Admin Tsaga',
    'admin'::user_role,
    true,
    0,
    0,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    role = 'admin'::user_role,
    is_verified = true,
    updated_at = NOW();

-- 4. Verifikasi profile berhasil dibuat
SELECT 
    p.id,
    p.username,
    p.full_name,
    p.role,
    p.is_verified,
    au.email,
    p.created_at
FROM profiles p
JOIN auth.users au ON p.id = au.id
WHERE p.id = '58a14e73-291e-4560-b47a-4051122de1d9';

-- 5. Cek semua admin users
SELECT 
    p.id,
    p.username,
    p.full_name,
    p.role,
    p.is_verified,
    au.email
FROM profiles p
JOIN auth.users au ON p.id = au.id
WHERE p.role IN ('admin', 'moderator')
ORDER BY p.created_at DESC;