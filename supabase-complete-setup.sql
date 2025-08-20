-- WMX TOPUP - Complete Database Setup for Fresh Supabase Project
-- This script creates everything from scratch for a new Supabase project
-- Run this in Supabase SQL Editor

-- =====================================================
-- 1. ENABLE REQUIRED EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 2. CREATE CUSTOM TYPES
-- =====================================================
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'admin', 'moderator');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE processing_speed AS ENUM ('instant', 'fast', 'normal');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE game_category AS ENUM ('moba', 'battle-royale', 'rpg', 'strategy', 'racing', 'sports', 'casual', 'fps', 'mmorpg');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;-- 
=====================================================
-- 3. CREATE MAIN TABLES
-- =====================================================

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    phone_number VARCHAR(20),
    date_of_birth DATE,
    role user_role DEFAULT 'customer',
    is_verified BOOLEAN DEFAULT FALSE,
    total_spent DECIMAL(12,2) DEFAULT 0,
    total_transactions INTEGER DEFAULT 0,
    favorite_games TEXT[] DEFAULT '{}',
    preferred_payment_methods TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Games table
CREATE TABLE IF NOT EXISTS public.games (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    category game_category NOT NULL,
    description TEXT,
    image_url TEXT,
    icon_url TEXT,
    background_url TEXT,
    developer VARCHAR(100),
    rating DECIMAL(2,1) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    processing_speed processing_speed DEFAULT 'fast',
    min_price DECIMAL(10,2),
    max_price DECIMAL(10,2),
    package_count INTEGER DEFAULT 0,
    total_sales INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    featured_order INTEGER DEFAULT 0,
    hero_display_name VARCHAR(200),
    hero_tagline TEXT,
    player_count_display VARCHAR(50),
    last_featured_at TIMESTAMP WITH TIME ZONE
);-- Game packages table
CREATE TABLE IF NOT EXISTS public.game_packages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    amount VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    discount_percentage INTEGER DEFAULT 0,
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    vip_service_code VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    game_id UUID REFERENCES public.games(id),
    package_id UUID REFERENCES public.game_packages(id),
    transaction_code VARCHAR(50) UNIQUE NOT NULL,
    player_id VARCHAR(100) NOT NULL,
    player_name VARCHAR(100),
    server_id VARCHAR(50),
    amount DECIMAL(10,2) NOT NULL,
    original_amount DECIMAL(10,2),
    discount_amount DECIMAL(10,2) DEFAULT 0,
    admin_fee DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    status transaction_status DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    vip_order_id VARCHAR(100),
    notes TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);-- Payment methods table
CREATE TABLE IF NOT EXISTS public.payment_methods (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL,
    icon_url TEXT,
    logo_url TEXT,
    fee_percentage DECIMAL(5,2) DEFAULT 0,
    fee_fixed DECIMAL(10,2) DEFAULT 0,
    min_amount DECIMAL(10,2) DEFAULT 0,
    max_amount DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    is_popular BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    category VARCHAR(50) DEFAULT 'other',
    processing_time VARCHAR(50) DEFAULT 'Instant',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promotions table
CREATE TABLE IF NOT EXISTS public.promotions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    badge VARCHAR(50),
    discount_percentage INTEGER,
    game_id UUID REFERENCES public.games(id),
    background_image TEXT,
    is_limited BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    game_id UUID REFERENCES public.games(id),
    transaction_id UUID REFERENCES public.transactions(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User favorites table
CREATE TABLE IF NOT EXISTS public.user_favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, game_id)
);

-- System settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    favorite_genres game_category[] DEFAULT '{}',
    average_spending DECIMAL(10,2) DEFAULT 0,
    preferred_play_time VARCHAR(50),
    notification_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);-
- =====================================================
-- 4. CREATE ADMIN USER FUNCTION
-- =====================================================

-- Function to create admin user after registration
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create profile for new user
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
        SPLIT_PART(NEW.email, '@', 1),
        SPLIT_PART(NEW.email, '@', 1),
        CASE 
            WHEN NEW.email ILIKE '%admin%' OR NEW.email ILIKE '%tsaga%' THEN 'admin'::user_role
            ELSE 'customer'::user_role
        END,
        true,
        NOW(),
        NOW()
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create profile when user registers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_admin_user();

-- =====================================================
-- 5. DISABLE RLS TEMPORARILY FOR SETUP
-- =====================================================
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.games DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_packages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences DISABLE ROW LEVEL SECURITY;--
 =====================================================
-- 6. INSERT SAMPLE GAMES DATA
-- =====================================================

-- Insert popular games
INSERT INTO public.games (id, name, slug, category, description, image_url, icon_url, developer, rating, is_popular, is_active, min_price, max_price, hero_display_name, hero_tagline, player_count_display) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Mobile Legends: Bang Bang', 'mobile-legends', 'moba', 'The most popular MOBA game in Southeast Asia with over 100 million players worldwide', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop', 'Moonton', 4.5, true, true, 15000, 500000, 'Mobile Legends', 'Become the Legend', '100M+ Players'),

('550e8400-e29b-41d4-a716-446655440002', 'Free Fire', 'free-fire', 'battle-royale', 'The ultimate survival shooter game designed for mobile. Each 10-minute game places you on a remote island', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop', 'Garena', 4.3, true, true, 10000, 300000, 'Free Fire', 'Survive Till The End', '80M+ Players'),

('550e8400-e29b-41d4-a716-446655440003', 'PUBG Mobile', 'pubg-mobile', 'battle-royale', 'Official PUBG on mobile. 100 players parachute onto a remote island to battle in a winner-takes-all showdown', 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=400&fit=crop', 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=100&h=100&fit=crop', 'Tencent Games', 4.4, true, true, 20000, 600000, 'PUBG Mobile', 'Winner Winner Chicken Dinner', '50M+ Players'),

('550e8400-e29b-41d4-a716-446655440004', 'Genshin Impact', 'genshin-impact', 'rpg', 'Step into Teyvat, a vast world teeming with life and flowing with elemental energy', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop', 'miHoYo', 4.6, true, true, 25000, 800000, 'Genshin Impact', 'A World of Adventure Awaits', '60M+ Players'),

('550e8400-e29b-41d4-a716-446655440005', 'Valorant', 'valorant', 'fps', 'A 5v5 character-based tactical FPS where precise gunplay meets unique agent abilities', 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=400&fit=crop', 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=100&h=100&fit=crop', 'Riot Games', 4.2, false, true, 30000, 400000, 'Valorant', 'Defy The Limits', '15M+ Players'),

('550e8400-e29b-41d4-a716-446655440006', 'Call of Duty Mobile', 'cod-mobile', 'fps', 'The definitive Call of Duty experience on mobile with legendary maps and game modes', 'https://images.unsplash.com/photo-1586182987320-4f376d39d787?w=800&h=400&fit=crop', 'https://images.unsplash.com/photo-1586182987320-4f376d39d787?w=100&h=100&fit=crop', 'Activision', 4.1, false, true, 15000, 350000, 'Call of Duty Mobile', 'Go Mobile Go Legendary', '35M+ Players')

ON CONFLICT (id) DO NOTHING;-- ==
===================================================
-- 7. INSERT GAME PACKAGES DATA
-- =====================================================

-- Mobile Legends packages
INSERT INTO public.game_packages (game_id, name, amount, price, original_price, is_popular, vip_service_code, sort_order) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Diamond 86', '86 Diamonds', 22000, 25000, false, 'ML86', 1),
('550e8400-e29b-41d4-a716-446655440001', 'Diamond 172', '172 Diamonds', 44000, 48000, false, 'ML172', 2),
('550e8400-e29b-41d4-a716-446655440001', 'Diamond 257', '257 Diamonds', 65000, 70000, true, 'ML257', 3),
('550e8400-e29b-41d4-a716-446655440001', 'Diamond 344', '344 Diamonds', 87000, 92000, false, 'ML344', 4),
('550e8400-e29b-41d4-a716-446655440001', 'Diamond 429', '429 Diamonds', 108000, 115000, true, 'ML429', 5),
('550e8400-e29b-41d4-a716-446655440001', 'Diamond 514', '514 Diamonds', 130000, 138000, false, 'ML514', 6),
('550e8400-e29b-41d4-a716-446655440001', 'Diamond 706', '706 Diamonds', 174000, 185000, true, 'ML706', 7),
('550e8400-e29b-41d4-a716-446655440001', 'Diamond 1412', '1412 Diamonds', 348000, 370000, false, 'ML1412', 8),

-- Free Fire packages
('550e8400-e29b-41d4-a716-446655440002', 'Diamond 70', '70 Diamonds', 10000, 12000, false, 'FF70', 1),
('550e8400-e29b-41d4-a716-446655440002', 'Diamond 140', '140 Diamonds', 20000, 23000, false, 'FF140', 2),
('550e8400-e29b-41d4-a716-446655440002', 'Diamond 355', '355 Diamonds', 50000, 55000, true, 'FF355', 3),
('550e8400-e29b-41d4-a716-446655440002', 'Diamond 720', '720 Diamonds', 100000, 110000, true, 'FF720', 4),
('550e8400-e29b-41d4-a716-446655440002', 'Diamond 1450', '1450 Diamonds', 200000, 220000, false, 'FF1450', 5),
('550e8400-e29b-41d4-a716-446655440002', 'Diamond 2180', '2180 Diamonds', 300000, 330000, false, 'FF2180', 6),

-- PUBG Mobile packages
('550e8400-e29b-41d4-a716-446655440003', 'UC 60', '60 UC', 15000, 18000, false, 'PUBG60', 1),
('550e8400-e29b-41d4-a716-446655440003', 'UC 325', '325 UC', 75000, 85000, true, 'PUBG325', 2),
('550e8400-e29b-41d4-a716-446655440003', 'UC 660', '660 UC', 150000, 170000, true, 'PUBG660', 3),
('550e8400-e29b-41d4-a716-446655440003', 'UC 1800', '1800 UC', 400000, 450000, false, 'PUBG1800', 4),
('550e8400-e29b-41d4-a716-446655440003', 'UC 3850', '3850 UC', 800000, 900000, false, 'PUBG3850', 5),

-- Genshin Impact packages
('550e8400-e29b-41d4-a716-446655440004', 'Genesis Crystal 60', '60 Genesis Crystals', 15000, 18000, false, 'GI60', 1),
('550e8400-e29b-41d4-a716-446655440004', 'Genesis Crystal 330', '330 Genesis Crystals', 75000, 85000, true, 'GI330', 2),
('550e8400-e29b-41d4-a716-446655440004', 'Genesis Crystal 1090', '1090 Genesis Crystals', 250000, 280000, true, 'GI1090', 3),
('550e8400-e29b-41d4-a716-446655440004', 'Genesis Crystal 2240', '2240 Genesis Crystals', 500000, 560000, false, 'GI2240', 4),

-- Valorant packages
('550e8400-e29b-41d4-a716-446655440005', 'VP 475', '475 VP', 50000, 55000, false, 'VAL475', 1),
('550e8400-e29b-41d4-a716-446655440005', 'VP 1000', '1000 VP', 100000, 110000, true, 'VAL1000', 2),
('550e8400-e29b-41d4-a716-446655440005', 'VP 2150', '2150 VP', 200000, 220000, true, 'VAL2150', 3),
('550e8400-e29b-41d4-a716-446655440005', 'VP 3650', '3650 VP', 350000, 385000, false, 'VAL3650', 4),

-- Call of Duty Mobile packages
('550e8400-e29b-41d4-a716-446655440006', 'CP 80', '80 CP', 15000, 18000, false, 'COD80', 1),
('550e8400-e29b-41d4-a716-446655440006', 'CP 400', '400 CP', 75000, 85000, true, 'COD400', 2),
('550e8400-e29b-41d4-a716-446655440006', 'CP 800', '800 CP', 150000, 170000, true, 'COD800', 3),
('550e8400-e29b-41d4-a716-446655440006', 'CP 2000', '2000 CP', 350000, 385000, false, 'COD2000', 4)

ON CONFLICT DO NOTHING;-- ===
==================================================
-- 8. INSERT PAYMENT METHODS DATA
-- =====================================================

INSERT INTO public.payment_methods (name, code, type, category, is_active, is_popular, processing_time, description, sort_order) VALUES
('QRIS', 'qris', 'qr_code', 'digital', true, true, 'Instant', 'Quick Response Code Indonesian Standard - Scan & Pay', 1),
('Bank Transfer', 'bank_transfer', 'bank', 'traditional', true, true, '1-3 minutes', 'Transfer via ATM, Mobile Banking, or Internet Banking', 2),
('OVO', 'ovo', 'ewallet', 'digital', true, true, 'Instant', 'Digital wallet by OVO - Pay with OVO Balance', 3),
('GoPay', 'gopay', 'ewallet', 'digital', true, true, 'Instant', 'Digital wallet by Gojek - Pay with GoPay Balance', 4),
('DANA', 'dana', 'ewallet', 'digital', true, false, 'Instant', 'Digital wallet by DANA - Pay with DANA Balance', 5),
('ShopeePay', 'shopeepay', 'ewallet', 'digital', true, false, 'Instant', 'Digital wallet by Shopee - Pay with ShopeePay Balance', 6),
('LinkAja', 'linkaja', 'ewallet', 'digital', true, false, 'Instant', 'Digital wallet by LinkAja - Pay with LinkAja Balance', 7),
('Credit Card', 'credit_card', 'card', 'traditional', true, false, 'Instant', 'Visa, Mastercard, JCB - International Cards Accepted', 8),
('Alfamart', 'alfamart', 'retail', 'offline', true, false, '15 minutes', 'Pay at Alfamart stores nationwide', 9),
('Indomaret', 'indomaret', 'retail', 'offline', true, false, '15 minutes', 'Pay at Indomaret stores nationwide', 10)

ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- 9. INSERT PROMOTIONS DATA
-- =====================================================

INSERT INTO public.promotions (title, description, badge, discount_percentage, game_id, is_active, start_date, end_date) VALUES
('Mobile Legends Flash Sale', 'Get 20% off on all Mobile Legends diamond packages', 'FLASH SALE', 20, '550e8400-e29b-41d4-a716-446655440001', true, NOW(), NOW() + INTERVAL '7 days'),
('Free Fire Weekend Deal', 'Special weekend discount for Free Fire diamonds', 'WEEKEND', 15, '550e8400-e29b-41d4-a716-446655440002', true, NOW(), NOW() + INTERVAL '3 days'),
('PUBG Mobile Bonus', 'Buy UC and get extra bonus UC', 'BONUS', 10, '550e8400-e29b-41d4-a716-446655440003', true, NOW(), NOW() + INTERVAL '14 days'),
('New User Discount', 'Special 25% discount for new users on first purchase', 'NEW USER', 25, NULL, true, NOW(), NOW() + INTERVAL '30 days')

ON CONFLICT DO NOTHING;-
- =====================================================
-- 10. INSERT SYSTEM SETTINGS
-- =====================================================

INSERT INTO public.system_settings (key, value, description, is_public) VALUES
('site_name', 'WMX TOPUP', 'Website name', true),
('site_description', 'Premium Gaming Top-Up Platform', 'Website description', true),
('maintenance_mode', 'false', 'Maintenance mode status', true),
('registration_enabled', 'true', 'User registration status', true),
('min_topup_amount', '10000', 'Minimum top-up amount in IDR', true),
('max_topup_amount', '5000000', 'Maximum top-up amount in IDR', true),
('vip_reseller_balance', '10000000', 'Current VIP Reseller balance', false),
('total_users', '0', 'Total registered users', false),
('total_transactions', '0', 'Total completed transactions', false),
('success_rate', '95.5', 'Transaction success rate percentage', false),
('support_email', 'support@wmxtopup.com', 'Customer support email', true),
('support_whatsapp', '+6281234567890', 'Customer support WhatsApp', true),
('auto_process_enabled', 'true', 'Auto process transactions', false),
('email_notifications', 'true', 'Send email notifications', false),
('sms_notifications', 'false', 'Send SMS notifications', false)

ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- =====================================================
-- 11. CREATE RPC FUNCTIONS FOR ADMIN PANEL
-- =====================================================

-- Function to get user profile
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
$$;-- Function to get admin dashboard stats
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_users', (SELECT COUNT(*) FROM profiles),
        'total_games', (SELECT COUNT(*) FROM games WHERE is_active = true),
        'total_transactions', (SELECT COUNT(*) FROM transactions),
        'total_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM transactions WHERE status = 'completed'),
        'today_transactions', (SELECT COUNT(*) FROM transactions WHERE DATE(created_at) = CURRENT_DATE),
        'today_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM transactions WHERE DATE(created_at) = CURRENT_DATE AND status = 'completed'),
        'success_rate', (
            SELECT CASE 
                WHEN COUNT(*) = 0 THEN 95.5 
                ELSE ROUND((COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / COUNT(*)) * 100, 2)
            END 
            FROM transactions
        ),
        'vip_balance', (SELECT COALESCE(value::NUMERIC, 10000000) FROM system_settings WHERE key = 'vip_reseller_balance'),
        'active_games', (SELECT COUNT(*) FROM games WHERE is_active = true),
        'popular_games', (SELECT COUNT(*) FROM games WHERE is_popular = true),
        'payment_methods', (SELECT COUNT(*) FROM payment_methods WHERE is_active = true)
    ) INTO result;
    
    RETURN result;
END;
$$;

-- Function to get revenue data for charts
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
    WITH date_series AS (
        SELECT generate_series(
            CURRENT_DATE - INTERVAL '1 day' * days_back,
            CURRENT_DATE,
            INTERVAL '1 day'
        )::DATE as date
    )
    SELECT 
        ds.date,
        COALESCE(SUM(t.total_amount), 0) as revenue,
        COUNT(t.id) as transaction_count
    FROM date_series ds
    LEFT JOIN transactions t ON DATE(t.created_at) = ds.date AND t.status = 'completed'
    GROUP BY ds.date
    ORDER BY ds.date DESC;
END;
$$;-- Fun
ction to get top games by revenue
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
    SELECT COALESCE(SUM(total_amount), 1) INTO total_revenue_all
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

-- Function to search users for admin panel
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
    email TEXT
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
$$;-- =======
==============================================
-- 12. CREATE TRIGGER FUNCTIONS
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

-- Function to update game package count
CREATE OR REPLACE FUNCTION update_game_package_count()
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
$$ language 'plpgsql';-
- =====================================================
-- 13. CREATE TRIGGERS
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

DROP TRIGGER IF EXISTS update_game_package_count_trigger ON game_packages;
CREATE TRIGGER update_game_package_count_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON game_packages 
    FOR EACH ROW EXECUTE FUNCTION update_game_package_count();-- =======
==============================================
-- 14. SETUP RLS POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin can access all profiles" ON profiles
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'moderator')
    )
);

-- Games and packages policies (public read)
CREATE POLICY "Anyone can read games" ON games
FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage games" ON games
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'moderator')
    )
);

CREATE POLICY "Anyone can read game packages" ON game_packages
FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage game packages" ON game_packages
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'moderator')
    )
);-- Transactions policies
CREATE POLICY "Users can read own transactions" ON transactions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own transactions" ON transactions
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can access all transactions" ON transactions
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'moderator')
    )
);

-- Payment methods policies (public read)
CREATE POLICY "Anyone can read payment methods" ON payment_methods
FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage payment methods" ON payment_methods
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'moderator')
    )
);

-- Promotions policies (public read)
CREATE POLICY "Anyone can read active promotions" ON promotions
FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage promotions" ON promotions
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'moderator')
    )
);

-- Reviews policies
CREATE POLICY "Anyone can read verified reviews" ON reviews
FOR SELECT USING (is_verified = true);

CREATE POLICY "Users can create own reviews" ON reviews
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON reviews
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage all reviews" ON reviews
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'moderator')
    )
);-
- User favorites policies
CREATE POLICY "Users can manage own favorites" ON user_favorites
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admin can access all favorites" ON user_favorites
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'moderator')
    )
);

-- System settings policies
CREATE POLICY "Anyone can read public settings" ON system_settings
FOR SELECT USING (is_public = true);

CREATE POLICY "Admin can access all settings" ON system_settings
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'moderator')
    )
);

-- User preferences policies
CREATE POLICY "Users can manage own preferences" ON user_preferences
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admin can access all preferences" ON user_preferences
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'moderator')
    )
);

-- =====================================================
-- 15. GRANT PERMISSIONS
-- =====================================================

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_user_profile(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_revenue_data(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_top_games_by_revenue(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION search_users(TEXT, user_role, INTEGER, INTEGER) TO authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;-- =======
==============================================
-- 16. CREATE PERFORMANCE INDEXES
-- =====================================================

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON profiles(is_verified);

CREATE INDEX IF NOT EXISTS idx_games_is_active ON games(is_active);
CREATE INDEX IF NOT EXISTS idx_games_is_popular ON games(is_popular);
CREATE INDEX IF NOT EXISTS idx_games_category ON games(category);
CREATE INDEX IF NOT EXISTS idx_games_slug ON games(slug);

CREATE INDEX IF NOT EXISTS idx_game_packages_game_id ON game_packages(game_id);
CREATE INDEX IF NOT EXISTS idx_game_packages_is_active ON game_packages(is_active);
CREATE INDEX IF NOT EXISTS idx_game_packages_is_popular ON game_packages(is_popular);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_game_id ON transactions(game_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_payment_method ON transactions(payment_method);

CREATE INDEX IF NOT EXISTS idx_payment_methods_is_active ON payment_methods(is_active);
CREATE INDEX IF NOT EXISTS idx_payment_methods_category ON payment_methods(category);

CREATE INDEX IF NOT EXISTS idx_promotions_is_active ON promotions(is_active);
CREATE INDEX IF NOT EXISTS idx_promotions_game_id ON promotions(game_id);
CREATE INDEX IF NOT EXISTS idx_promotions_end_date ON promotions(end_date);

CREATE INDEX IF NOT EXISTS idx_reviews_game_id ON reviews(game_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_is_verified ON reviews(is_verified);

CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_game_id ON user_favorites(game_id);

CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(key);
CREATE INDEX IF NOT EXISTS idx_system_settings_is_public ON system_settings(is_public);-- ====
=================================================
-- 17. UPDATE GAME PACKAGE COUNTS
-- =====================================================

-- Update package counts for all games
UPDATE games SET package_count = (
    SELECT COUNT(*) 
    FROM game_packages 
    WHERE game_id = games.id AND is_active = true
);

-- =====================================================
-- 18. VERIFICATION AND TESTING
-- =====================================================

-- Show database summary
SELECT 
    'DATABASE SETUP SUMMARY' as info,
    'Tables Created: 10' as tables,
    'Functions Created: 5' as functions,
    'Triggers Created: 8' as triggers,
    'RLS Policies Created: 20+' as policies,
    'Indexes Created: 20+' as indexes;

-- Show sample data counts
SELECT 'SAMPLE DATA SUMMARY' as info;
SELECT 'Games' as table_name, COUNT(*) as count FROM games
UNION ALL
SELECT 'Game Packages' as table_name, COUNT(*) as count FROM game_packages
UNION ALL
SELECT 'Payment Methods' as table_name, COUNT(*) as count FROM payment_methods
UNION ALL
SELECT 'Promotions' as table_name, COUNT(*) as count FROM promotions
UNION ALL
SELECT 'System Settings' as table_name, COUNT(*) as count FROM system_settings
UNION ALL
SELECT 'Profiles' as table_name, COUNT(*) as count FROM profiles;

-- Test admin stats function
SELECT 'ADMIN STATS TEST' as info;
SELECT get_admin_stats();

-- Show games with package counts
SELECT 'GAMES WITH PACKAGES' as info;
SELECT 
    g.name,
    g.category,
    g.package_count,
    g.is_popular,
    g.is_active
FROM games g
ORDER BY g.package_count DESC, g.name;

-- Show payment methods
SELECT 'PAYMENT METHODS' as info;
SELECT 
    name,
    code,
    type,
    category,
    is_popular,
    processing_time
FROM payment_methods
WHERE is_active = true
ORDER BY sort_order;-- ====
=================================================
-- 19. SETUP COMPLETE MESSAGE
-- =====================================================

SELECT 
    '🎉 WMX TOPUP DATABASE SETUP COMPLETE! 🎉' as message,
    'Your Supabase database is now ready for the admin panel' as status;

SELECT 
    '📋 NEXT STEPS:' as info,
    '1. Register a new user in your app' as step_1,
    '2. The user will automatically get admin role if email contains "admin" or "tsaga"' as step_2,
    '3. Login and access /admin to use the admin panel' as step_3,
    '4. All sample data is ready for testing' as step_4;

SELECT 
    '🔧 FEATURES ENABLED:' as info,
    '✅ Complete database structure' as feature_1,
    '✅ Auto-create admin profiles' as feature_2,
    '✅ Sample games and packages' as feature_3,
    '✅ Payment methods configured' as feature_4,
    '✅ RLS policies for security' as feature_5,
    '✅ Performance indexes' as feature_6,
    '✅ Admin panel functions' as feature_7,
    '✅ Auto-update triggers' as feature_8;

SELECT 
    '🎮 SAMPLE GAMES INCLUDED:' as info,
    'Mobile Legends, Free Fire, PUBG Mobile' as popular_games,
    'Genshin Impact, Valorant, COD Mobile' as other_games,
    'Total: 6 games with 30+ packages' as summary;

SELECT 
    '💳 PAYMENT METHODS:' as info,
    'QRIS, Bank Transfer, OVO, GoPay' as digital,
    'DANA, ShopeePay, LinkAja, Credit Card' as others,
    'Alfamart, Indomaret (offline)' as retail;

-- =====================================================
-- SETUP SCRIPT END
-- =====================================================
-- 
-- 🚀 Your WMX TOPUP database is now fully configured!
-- 
-- What was created:
-- - 10 database tables with relationships
-- - 6 sample games with 30+ packages
-- - 10 payment methods
-- - 4 promotional campaigns
-- - Complete RLS security policies
-- - Performance indexes
-- - Admin panel RPC functions
-- - Auto-update triggers
-- - System settings
-- 
-- How to use:
-- 1. Register a user in your app
-- 2. User with email containing "admin" or "tsaga" will get admin role
-- 3. Login and access /admin for the admin panel
-- 4. All features are ready to use!
-- 
-- =====================================================