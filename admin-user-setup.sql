-- Admin User Setup Script for WMX TOPUP
-- Run this script in Supabase SQL Editor to create/update admin users

-- First, let's check if we have any admin users
SELECT 
    p.id,
    p.username,
    p.full_name,
    p.role,
    au.email,
    p.created_at
FROM profiles p
JOIN auth.users au ON p.id = au.id
WHERE p.role = 'admin';

-- If no admin users exist, let's create one
-- Note: You need to first create the user through Supabase Auth UI or signup process
-- Then update their role to admin using this script

-- Example: Update existing user to admin role
-- Replace 'your-admin-email@example.com' with the actual admin email
UPDATE profiles 
SET 
    role = 'admin',
    is_verified = true,
    updated_at = NOW()
WHERE id = (
    SELECT id 
    FROM auth.users 
    WHERE email = 'your-admin-email@example.com'
);

-- Alternative: Update by user ID if you know it
-- UPDATE profiles 
-- SET 
--     role = 'admin',
--     is_verified = true,
--     updated_at = NOW()
-- WHERE id = 'your-user-id-here';

-- Create a test admin user profile if it doesn't exist
-- (This assumes the auth.user already exists)
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
    'admin',
    'System Administrator',
    'admin'::user_role,
    true,
    NOW(),
    NOW()
FROM auth.users au
WHERE au.email = 'admin@wmxtopup.com'
AND NOT EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = au.id
);

-- Verify the admin user was created/updated
SELECT 
    p.id,
    p.username,
    p.full_name,
    p.role,
    p.is_verified,
    au.email,
    au.email_confirmed_at,
    p.created_at
FROM profiles p
JOIN auth.users au ON p.id = au.id
WHERE p.role IN ('admin', 'moderator')
ORDER BY p.created_at DESC;

-- Grant admin permissions (if using RLS policies)
-- Make sure admin users can access all tables
-- This is just an example - adjust based on your RLS policies

-- Check current RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;