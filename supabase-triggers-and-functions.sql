-- WMX TOPUP - Triggers and Additional Functions
-- Run this AFTER the main setup script

-- =====================================================
-- 1. CREATE TRIGGER FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to update profile stats when transaction changes
CREATE OR REPLACE FUNCTION update_profile_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total_spent and total_transactions for completed transactions
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        UPDATE profiles 
        SET 
            total_spent = total_spent + NEW.total_amount,
            total_transactions = total_transactions + 1,
            updated_at = NOW()
        WHERE id = NEW.user_id;
    END IF;
    
    -- Reverse stats if transaction was completed but now failed/cancelled
    IF OLD.status = 'completed' AND NEW.status IN ('failed', 'cancelled') THEN
        UPDATE profiles 
        SET 
            total_spent = GREATEST(0, total_spent - OLD.total_amount),
            total_transactions = GREATEST(0, total_transactions - 1),
            updated_at = NOW()
        WHERE id = OLD.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to update game stats
CREATE OR REPLACE FUNCTION update_game_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update package count when game_packages change
    UPDATE games 
    SET 
        package_count = (
            SELECT COUNT(*) 
            FROM game_packages 
            WHERE game_id = COALESCE(NEW.game_id, OLD.game_id) 
            AND is_active = true
        ),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.game_id, OLD.game_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- =====================================================
-- 2. CREATE TRIGGERS
-- =====================================================

-- Triggers for updated_at columns
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_games_updated_at ON games;
CREATE TRIGGER update_games_updated_at 
    BEFORE UPDATE ON games 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_game_packages_updated_at ON game_packages;
CREATE TRIGGER update_game_packages_updated_at 
    BEFORE UPDATE ON game_packages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at 
    BEFORE UPDATE ON transactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_promotions_updated_at ON promotions;
CREATE TRIGGER update_promotions_updated_at 
    BEFORE UPDATE ON promotions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_system_settings_updated_at ON system_settings;
CREATE TRIGGER update_system_settings_updated_at 
    BEFORE UPDATE ON system_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for stats updates
DROP TRIGGER IF EXISTS update_profile_stats_trigger ON transactions;
CREATE TRIGGER update_profile_stats_trigger 
    AFTER UPDATE ON transactions 
    FOR EACH ROW EXECUTE FUNCTION update_profile_stats();

DROP TRIGGER IF EXISTS update_game_stats_trigger ON game_packages;
CREATE TRIGGER update_game_stats_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON game_packages 
    FOR EACH ROW EXECUTE FUNCTION update_game_stats();

-- =====================================================
-- 3. ADDITIONAL ADMIN FUNCTIONS
-- =====================================================

-- Function to get dashboard revenue data
CREATE OR REPLACE FUNCTION get_revenue_data(days_back INTEGER DEFAULT 30)
RETURNS TABLE (
    date DATE,
    revenue NUMERIC,
    transaction_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE(t.created_at) as date,
        COALESCE(SUM(t.total_amount), 0) as revenue,
        COUNT(*) as transaction_count
    FROM transactions t
    WHERE t.created_at >= CURRENT_DATE - INTERVAL '1 day' * days_back
    AND t.status = 'completed'
    GROUP BY DATE(t.created_at)
    ORDER BY DATE(t.created_at) DESC;
END;
$$;

-- Function to get top games by revenue
CREATE OR REPLACE FUNCTION get_top_games_by_revenue(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    game_id UUID,
    game_name VARCHAR,
    total_revenue NUMERIC,
    transaction_count BIGINT,
    percentage NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    total_revenue_all NUMERIC;
BEGIN
    -- Get total revenue for percentage calculation
    SELECT COALESCE(SUM(total_amount), 0) INTO total_revenue_all
    FROM transactions 
    WHERE status = 'completed';
    
    RETURN QUERY
    SELECT 
        g.id as game_id,
        g.name as game_name,
        COALESCE(SUM(t.total_amount), 0) as total_revenue,
        COUNT(t.id) as transaction_count,
        CASE 
            WHEN total_revenue_all > 0 THEN 
                ROUND((COALESCE(SUM(t.total_amount), 0) / total_revenue_all) * 100, 2)
            ELSE 0 
        END as percentage
    FROM games g
    LEFT JOIN transactions t ON g.id = t.game_id AND t.status = 'completed'
    WHERE g.is_active = true
    GROUP BY g.id, g.name
    ORDER BY total_revenue DESC
    LIMIT limit_count;
END;
$$;

-- Function to get user activity stats
CREATE OR REPLACE FUNCTION get_user_activity_stats()
RETURNS TABLE (
    total_users BIGINT,
    active_users BIGINT,
    verified_users BIGINT,
    admin_users BIGINT,
    new_users_today BIGINT,
    new_users_this_week BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE total_transactions > 0) as active_users,
        COUNT(*) FILTER (WHERE is_verified = true) as verified_users,
        COUNT(*) FILTER (WHERE role IN ('admin', 'moderator')) as admin_users,
        COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as new_users_today,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as new_users_this_week
    FROM profiles;
END;
$$;

-- Function to get transaction status breakdown
CREATE OR REPLACE FUNCTION get_transaction_status_breakdown()
RETURNS TABLE (
    status transaction_status,
    count BIGINT,
    total_amount NUMERIC,
    percentage NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    total_transactions BIGINT;
BEGIN
    -- Get total transaction count
    SELECT COUNT(*) INTO total_transactions FROM transactions;
    
    RETURN QUERY
    SELECT 
        t.status,
        COUNT(*) as count,
        COALESCE(SUM(t.total_amount), 0) as total_amount,
        CASE 
            WHEN total_transactions > 0 THEN 
                ROUND((COUNT(*)::NUMERIC / total_transactions) * 100, 2)
            ELSE 0 
        END as percentage
    FROM transactions t
    GROUP BY t.status
    ORDER BY count DESC;
END;
$$;

-- Drop existing function first to avoid conflicts
DROP FUNCTION IF EXISTS search_users(TEXT, user_role, INTEGER, INTEGER);

-- Function to search users (for admin panel)
CREATE OR REPLACE FUNCTION search_users(
    search_term TEXT DEFAULT '',
    role_filter user_role DEFAULT NULL,
    limit_count INTEGER DEFAULT 50,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    username VARCHAR,
    full_name TEXT,
    role user_role,
    is_verified BOOLEAN,
    total_spent NUMERIC,
    total_transactions INTEGER,
    created_at TIMESTAMPTZ,
    email VARCHAR
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
        p.role,
        p.is_verified,
        p.total_spent,
        p.total_transactions,
        p.created_at,
        au.email
    FROM profiles p
    JOIN auth.users au ON p.id = au.id
    WHERE 
        (search_term = '' OR 
         p.full_name ILIKE '%' || search_term || '%' OR 
         p.username ILIKE '%' || search_term || '%' OR 
         au.email ILIKE '%' || search_term || '%')
    AND (role_filter IS NULL OR p.role = role_filter)
    ORDER BY p.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$;

-- =====================================================
-- 4. GRANT PERMISSIONS ON NEW FUNCTIONS
-- =====================================================

GRANT EXECUTE ON FUNCTION get_revenue_data(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_top_games_by_revenue(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_activity_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_transaction_status_breakdown() TO authenticated;
GRANT EXECUTE ON FUNCTION search_users(TEXT, user_role, INTEGER, INTEGER) TO authenticated;

-- =====================================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_game_id ON transactions(game_id);
CREATE INDEX IF NOT EXISTS idx_games_is_active ON games(is_active);
CREATE INDEX IF NOT EXISTS idx_games_is_popular ON games(is_popular);
CREATE INDEX IF NOT EXISTS idx_game_packages_game_id ON game_packages(game_id);
CREATE INDEX IF NOT EXISTS idx_game_packages_is_active ON game_packages(is_active);

-- =====================================================
-- 6. TEST THE NEW FUNCTIONS
-- =====================================================

-- Test revenue data
SELECT * FROM get_revenue_data(7) LIMIT 5;

-- Test top games
SELECT * FROM get_top_games_by_revenue(5);

-- Test user activity stats
SELECT * FROM get_user_activity_stats();

-- Test transaction status breakdown
SELECT * FROM get_transaction_status_breakdown();

-- Test user search
SELECT * FROM search_users('admin', NULL, 10, 0);

-- =====================================================
-- TRIGGERS AND FUNCTIONS SETUP COMPLETE
-- =====================================================