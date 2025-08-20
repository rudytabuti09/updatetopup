-- Check and Fix RLS Policies for WMX TOPUP
-- Run this in Supabase SQL Editor

-- 1. Check current RLS policies on profiles table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'profiles'
ORDER BY policyname;

-- 2. Check if RLS is enabled on profiles table
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'profiles';

-- 3. Check if user can access profiles table
SELECT 
    id,
    username,
    full_name,
    role,
    is_verified,
    created_at
FROM profiles 
WHERE id = '58a14e73-291e-4560-b47a-4051122de1d9';

-- 4. If no results above, let's check if the user exists in auth.users
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at
FROM auth.users 
WHERE id = '58a14e73-291e-4560-b47a-4051122de1d9';

-- 5. Create profile if it doesn't exist
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

-- 6. If RLS is blocking access, create permissive policies
-- Drop existing restrictive policies if they exist
DROP POLICY IF EXISTS "Users can only view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can only update own profile" ON profiles;

-- Create permissive policies for profiles table
CREATE POLICY "Enable read access for authenticated users" ON profiles
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON profiles
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users based on user_id" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- Allow admin users to access all profiles
CREATE POLICY "Admin can access all profiles" ON profiles
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'moderator')
    )
);

-- 7. Verify the profile was created/updated
SELECT 
    p.id,
    p.username,
    p.full_name,
    p.role,
    p.is_verified,
    au.email,
    p.created_at,
    p.updated_at
FROM profiles p
JOIN auth.users au ON p.id = au.id
WHERE p.id = '58a14e73-291e-4560-b47a-4051122de1d9';

-- 8. Test if current user can access their own profile
SELECT 
    id,
    username,
    full_name,
    role,
    is_verified
FROM profiles 
WHERE id = auth.uid();

-- 9. Check all admin users
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