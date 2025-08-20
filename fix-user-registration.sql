-- FIX USER REGISTRATION - Perbaiki Trigger dan Function
-- Jalankan ini di Supabase SQL Editor

-- =====================================================
-- 1. CEK APAKAH ADA USER DI AUTH.USERS
-- =====================================================

SELECT 'Checking auth.users table...' as status;
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 5;

-- =====================================================
-- 2. CEK PROFILES TABLE
-- =====================================================

SELECT 'Checking profiles table...' as status;
SELECT COUNT(*) as profile_count FROM profiles;
SELECT * FROM profiles LIMIT 5;

-- =====================================================
-- 3. DROP DAN RECREATE TRIGGER FUNCTION
-- =====================================================

-- Drop existing trigger dan function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS create_admin_user() CASCADE;

-- Buat function baru yang lebih robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    new_username TEXT;
    new_full_name TEXT;
    new_role user_role;
BEGIN
    -- Generate username dan full_name
    new_username := COALESCE(SPLIT_PART(NEW.email, '@', 1), 'user_' || substr(NEW.id::text, 1, 8));
    new_full_name := COALESCE(SPLIT_PART(NEW.email, '@', 1), 'User');
    
    -- Tentukan role berdasarkan email
    IF NEW.email ILIKE '%admin%' OR NEW.email ILIKE '%tsaga%' THEN
        new_role := 'admin'::user_role;
    ELSE
        new_role := 'customer'::user_role;
    END IF;
    
    -- Insert ke profiles table
    INSERT INTO public.profiles (
        id,
        username,
        full_name,
        role,
        is_verified,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        new_username,
        new_full_name,
        new_role,
        true,
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO UPDATE SET
        username = EXCLUDED.username,
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        is_verified = EXCLUDED.is_verified,
        updated_at = NOW();
    
    RAISE NOTICE 'Profile created for user: % with email: % and role: %', NEW.id, NEW.email, new_role;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Failed to create profile for user % (email: %): %', NEW.id, NEW.email, SQLERRM;
        -- Jangan gagalkan user creation, tetap return NEW
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Buat trigger baru
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 4. MANUAL FIX - BUAT PROFILE UNTUK USER YANG SUDAH ADA
-- =====================================================

-- Insert profiles untuk user yang sudah signup tapi belum ada profilenya
INSERT INTO public.profiles (
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
    SPLIT_PART(au.email, '@', 1) as username,
    SPLIT_PART(au.email, '@', 1) as full_name,
    CASE 
        WHEN au.email ILIKE '%admin%' OR au.email ILIKE '%tsaga%' THEN 'admin'::user_role
        ELSE 'customer'::user_role
    END as role,
    true as is_verified,
    au.created_at,
    NOW() as updated_at
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- =====================================================
-- 5. TEST FUNCTION DENGAN USER DUMMY
-- =====================================================

-- Test apakah function bekerja (ini akan gagal karena user tidak ada, tapi kita bisa lihat errornya)
DO $$
DECLARE
    test_user_id UUID := '12345678-1234-1234-1234-123456789012';
    test_email TEXT := 'test@admin.com';
BEGIN
    RAISE NOTICE 'Testing function with dummy data...';
    -- Kita tidak bisa test langsung karena trigger hanya jalan saat INSERT ke auth.users
    RAISE NOTICE 'Function is ready for testing with real signup';
END $$;

-- =====================================================
-- 6. CEK HASIL
-- =====================================================

SELECT 'Checking results after fix...' as status;

-- Cek berapa user di auth.users
SELECT 'Users in auth.users:' as table_name, COUNT(*) as count FROM auth.users;

-- Cek berapa profile di profiles
SELECT 'Profiles in profiles:' as table_name, COUNT(*) as count FROM profiles;

-- Cek profile yang baru dibuat
SELECT 'Recent profiles:' as info;
SELECT p.id, p.username, p.full_name, p.role, email_from_auth.email, p.created_at 
FROM profiles p
JOIN (SELECT id, email FROM auth.users) email_from_auth ON p.id = email_from_auth.id
ORDER BY p.created_at DESC
LIMIT 5;

-- =====================================================
-- 7. GRANT PERMISSIONS
-- =====================================================

-- Pastikan permissions sudah benar
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, authenticated, anon;

-- =====================================================
-- 8. INSTRUKSI TESTING
-- =====================================================

SELECT '🔧 USER REGISTRATION FIX APPLIED!' as message;
SELECT 'Now try to signup with a new user to test' as instruction;
SELECT 'Use email with "admin" for admin role (e.g., admin@test.com)' as tip;
SELECT 'Check profiles table after signup to confirm it works' as verification;