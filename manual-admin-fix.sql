-- MANUAL ADMIN FIX - Update Role untuk User Tertentu
-- Ganti EMAIL_USER dengan email user yang ingin dijadikan admin

-- =====================================================
-- 1. CEK USER YANG ADA
-- =====================================================

SELECT 'Current users and profiles:' as info;

SELECT 
    au.id,
    au.email,
    au.created_at as auth_created,
    p.role,
    p.username,
    p.full_name,
    p.is_verified,
    p.created_at as profile_created
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
ORDER BY au.created_at DESC;

-- =====================================================
-- 2. UPDATE ROLE UNTUK USER TERTENTU
-- =====================================================

-- GANTI 'admin@test.com' dengan email user yang ingin dijadikan admin
UPDATE profiles 
SET 
    role = 'admin',
    is_verified = true,
    updated_at = NOW()
WHERE id IN (
    SELECT id FROM auth.users 
    WHERE email ILIKE '%admin%' OR email ILIKE '%tsaga%'
);

-- =====================================================
-- 3. BUAT ADMIN USER JIKA BELUM ADA
-- =====================================================

-- Jika tidak ada user admin, buat manual profile admin
INSERT INTO profiles (
    id,
    username,
    full_name,
    role,
    is_verified,
    created_at,
    updated_at
) 
SELECT 
    au.id,
    SPLIT_PART(au.email, '@', 1),
    SPLIT_PART(au.email, '@', 1),
    'admin'::user_role,
    true,
    NOW(),
    NOW()
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL
AND (au.email ILIKE '%admin%' OR au.email ILIKE '%tsaga%')
ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    is_verified = true,
    updated_at = NOW();

-- =====================================================
-- 4. CEK HASIL UPDATE
-- =====================================================

SELECT 'Updated profiles:' as info;

SELECT 
    au.id,
    au.email,
    p.role,
    p.username,
    p.full_name,
    p.is_verified,
    p.updated_at
FROM auth.users au
JOIN profiles p ON au.id = p.id
WHERE p.role = 'admin'
ORDER BY p.updated_at DESC;

-- =====================================================
-- 5. TEST ADMIN FUNCTIONS
-- =====================================================

-- Test apakah admin functions bisa diakses
SELECT 'Testing admin functions:' as info;

-- Test get_admin_stats function
SELECT get_admin_stats() as admin_stats_test;

-- =====================================================
-- MANUAL ADMIN FIX COMPLETE
-- =====================================================

SELECT '✅ MANUAL ADMIN FIX APPLIED!' as message;
SELECT 'Check the results above and test in your app' as instruction;