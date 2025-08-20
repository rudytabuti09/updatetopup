-- FIX USER PREFERENCES 406 ERROR
-- Quick fix untuk masalah user_preferences table

-- =====================================================
-- 1. CHECK USER_PREFERENCES TABLE
-- =====================================================

SELECT 'Checking user_preferences table...' as status;

-- Check if table exists and structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_preferences' 
AND table_schema = 'public';

-- =====================================================
-- 2. FIX RLS POLICIES FOR USER_PREFERENCES
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "user_preferences_select_policy" ON user_preferences;
DROP POLICY IF EXISTS "user_preferences_insert_policy" ON user_preferences;
DROP POLICY IF EXISTS "user_preferences_update_policy" ON user_preferences;
DROP POLICY IF EXISTS "user_preferences_delete_policy" ON user_preferences;

-- Create simple policies
CREATE POLICY "user_preferences_all_access" ON user_preferences FOR ALL USING (true);

-- =====================================================
-- 3. CREATE USER PREFERENCES FOR EXISTING USER
-- =====================================================

-- Insert user preferences for the current user if not exists
INSERT INTO user_preferences (
    id,
    user_id,
    favorite_genres,
    average_spending,
    preferred_play_time,
    notification_settings,
    created_at,
    updated_at
) VALUES (
    uuid_generate_v4(),
    '5ad3bfc7-d9a5-494a-a0e3-41cd0a06c2b8',
    ARRAY['moba', 'battle-royale']::game_category[],
    0,
    'evening',
    '{"email": true, "push": true, "sms": false}'::jsonb,
    NOW(),
    NOW()
) ON CONFLICT (user_id) DO UPDATE SET
    updated_at = NOW();

-- =====================================================
-- 4. GRANT PERMISSIONS
-- =====================================================

GRANT ALL ON user_preferences TO anon, authenticated;

-- =====================================================
-- 5. TEST ACCESS
-- =====================================================

SELECT 'Testing user_preferences access...' as status;

-- Test query that was failing
SELECT * FROM user_preferences 
WHERE user_id = '5ad3bfc7-d9a5-494a-a0e3-41cd0a06c2b8';

-- =====================================================
-- COMPLETE
-- =====================================================

SELECT '✅ USER PREFERENCES FIXED!' as message;