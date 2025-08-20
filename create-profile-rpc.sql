-- Create RPC function to get user profile
-- Run this in Supabase SQL Editor

CREATE OR REPLACE FUNCTION get_user_profile(user_uuid UUID)
RETURNS TABLE (
    id UUID,
    username VARCHAR,
    full_name TEXT,
    avatar_url TEXT,
    phone_number VARCHAR,
    role user_role,
    is_verified BOOLEAN,
    total_spent NUMERIC,
    total_transactions INTEGER,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.username,
        p.full_name,
        p.avatar_url,
        p.phone_number,
        p.role,
        p.is_verified,
        p.total_spent,
        p.total_transactions,
        p.created_at,
        p.updated_at
    FROM profiles p
    WHERE p.id = user_uuid;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_profile(UUID) TO authenticated;

-- Create function to check if user can access profiles
CREATE OR REPLACE FUNCTION check_profile_access()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if current user can read from profiles table
    PERFORM 1 FROM profiles WHERE id = auth.uid() LIMIT 1;
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION check_profile_access() TO authenticated;

-- Test the functions
SELECT get_user_profile('58a14e73-291e-4560-b47a-4051122de1d9');
SELECT check_profile_access();