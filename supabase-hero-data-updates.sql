-- Hero Section Data Updates
-- Enhanced sample data for better hero section display

-- 1. Update existing games with hero-specific information
UPDATE public.games SET 
    hero_display_name = 'Mobile Legends: Bang Bang',
    hero_tagline = 'MOBA Terpopuler di Indonesia dengan 100M+ Players',
    player_count_display = '100M+',
    featured_order = 1,
    description = 'Game MOBA terpopuler di Indonesia dengan gameplay 5v5 yang seru dan kompetitif. Bergabunglah dengan jutaan player dalam pertempuran epik!',
    rating = 4.8,
    review_count = 125000,
    is_popular = true,
    processing_speed = 'instant'
WHERE slug = 'mobile-legends';

UPDATE public.games SET 
    hero_display_name = 'Free Fire',
    hero_tagline = 'Battle Royale Terfavorit dengan 80M+ Players',
    player_count_display = '80M+',
    featured_order = 2,
    description = 'Battle royale dengan gameplay cepat dan grafis yang ringan untuk semua device. Survival of the fittest!',
    rating = 4.6,
    review_count = 87000,
    is_popular = true,
    processing_speed = 'instant'
WHERE slug = 'free-fire';

UPDATE public.games SET 
    hero_display_name = 'PUBG Mobile',
    hero_tagline = 'Realistic Battle Royale Experience',
    player_count_display = '50M+',
    featured_order = 3,
    description = 'Battle royale terbaik dengan grafis realistis dan gameplay yang menantang. Winner winner chicken dinner!',
    rating = 4.7,
    review_count = 98000,
    is_popular = true,
    processing_speed = 'fast'
WHERE slug = 'pubg-mobile';

UPDATE public.games SET 
    hero_display_name = 'Genshin Impact',
    hero_tagline = 'Open World RPG dengan Grafis Memukau',
    player_count_display = '60M+',
    featured_order = 4,
    description = 'Open-world RPG dengan grafis anime yang memukau dan sistem gacha yang menarik. Jelajahi dunia Teyvat!',
    rating = 4.9,
    review_count = 156000,
    is_popular = true,
    processing_speed = 'fast'
WHERE slug = 'genshin-impact';

-- 2. Add more popular games for hero rotation
UPDATE public.games SET 
    hero_display_name = 'Arena of Valor',
    hero_tagline = 'MOBA Esports dengan Hero Unik',
    player_count_display = '45M+',
    featured_order = 5,
    is_popular = true,
    processing_speed = 'instant'
WHERE slug = 'arena-of-valor';

UPDATE public.games SET 
    hero_display_name = 'Call of Duty Mobile',
    hero_tagline = 'FPS Terbaik di Mobile',
    player_count_display = '35M+',
    featured_order = 6,
    is_popular = false, -- Keep as backup
    processing_speed = 'fast'
WHERE slug = 'call-of-duty-mobile';

-- 3. Enhanced promotions for hero section
INSERT INTO public.promotions (title, description, badge, discount_percentage, game_id, background_image, is_limited, start_date, end_date, is_active) 
SELECT 
    'Hero Section Flash Sale',
    'Diskon spesial 25% untuk semua paket Mobile Legends! Terbatas untuk 100 pembeli pertama hari ini.',
    'FLASH SALE',
    25,
    id,
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop',
    true,
    NOW(),
    NOW() + INTERVAL '1 day',
    true
FROM public.games WHERE slug = 'mobile-legends'
ON CONFLICT DO NOTHING;

INSERT INTO public.promotions (title, description, badge, discount_percentage, game_id, background_image, is_limited, start_date, end_date, is_active) 
SELECT 
    'Weekend Bonus Free Fire',
    'Dapatkan bonus 20% diamonds untuk setiap pembelian Free Fire di weekend ini!',
    'WEEKEND BONUS',
    20,
    id,
    'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=400&fit=crop',
    false,
    NOW(),
    NOW() + INTERVAL '3 days',
    true
FROM public.games WHERE slug = 'free-fire'
ON CONFLICT DO NOTHING;

-- 4. Update system settings for hero section
INSERT INTO public.system_settings (key, value, description, is_public) VALUES
('total_users', '2100000', 'Total registered users for hero stats', true),
('daily_transactions', '15200', 'Average daily transactions', true),
('avg_process_time', '28', 'Average processing time in seconds', true),
('customer_satisfaction', '99.8', 'Customer satisfaction percentage', true),
('total_reviews', '50000', 'Total customer reviews', true),
('platform_rating', '4.9', 'Overall platform rating', true)
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- 5. Add more detailed package information
-- Update Mobile Legends packages with better descriptions
UPDATE public.game_packages SET 
    name = '86 Diamonds - Starter Pack',
    amount = '86 Diamonds'
WHERE game_id = (SELECT id FROM public.games WHERE slug = 'mobile-legends') 
AND amount = '86 Diamonds';

UPDATE public.game_packages SET 
    name = '172 Diamonds - Popular Choice',
    amount = '172 Diamonds',
    is_popular = true
WHERE game_id = (SELECT id FROM public.games WHERE slug = 'mobile-legends') 
AND amount = '172 Diamonds';

UPDATE public.game_packages SET 
    name = '257 Diamonds - Great Value',
    amount = '257 Diamonds'
WHERE game_id = (SELECT id FROM public.games WHERE slug = 'mobile-legends') 
AND amount = '257 Diamonds';

-- Update Free Fire packages
UPDATE public.game_packages SET 
    name = '70 Diamonds - Basic Pack',
    amount = '70 Diamonds'
WHERE game_id = (SELECT id FROM public.games WHERE slug = 'free-fire') 
AND amount = '70 Diamonds';

UPDATE public.game_packages SET 
    name = '140 Diamonds - Most Popular',
    amount = '140 Diamonds',
    is_popular = true
WHERE game_id = (SELECT id FROM public.games WHERE slug = 'free-fire') 
AND amount = '140 Diamonds';

-- 6. Add hero section specific metadata
INSERT INTO public.system_settings (key, value, description, is_public) VALUES
('hero_title_primary', 'Top Up Gaming', 'Primary title for hero section', true),
('hero_title_secondary', 'Terpercaya & Terdepan', 'Secondary title for hero section', true),
('hero_subtitle', 'Platform top-up gaming #1 di Indonesia dengan teknologi auto-processing, keamanan bank-grade, dan customer service 24/7. Melayani 150+ game dengan success rate 99.94%.', 'Hero section subtitle', true),
('hero_badge_primary', 'Live: 15.2K transaksi hari ini', 'Primary badge text', true),
('hero_badge_secondary', '#1 Platform Indonesia', 'Secondary badge text', true)
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- 7. Create sample user preferences for personalization
INSERT INTO public.user_preferences (user_id, favorite_genres, average_spending, preferred_play_time, notification_settings)
SELECT 
    id,
    ARRAY['moba', 'battle-royale']::game_category[],
    75000,
    'Malam (20:00-24:00)',
    '{"email": true, "push": true, "sms": false}'::jsonb
FROM public.profiles 
WHERE role = 'customer'
ON CONFLICT (user_id) DO UPDATE SET
    favorite_genres = EXCLUDED.favorite_genres,
    updated_at = NOW();

-- 8. Add sample reviews for social proof
INSERT INTO public.reviews (user_id, game_id, rating, comment, is_verified, is_featured) 
SELECT 
    p.id,
    g.id,
    5,
    'Top up cepat banget, langsung masuk ke akun. Recommended!',
    true,
    true
FROM public.profiles p
CROSS JOIN public.games g
WHERE p.role = 'customer' 
AND g.slug = 'mobile-legends'
AND NOT EXISTS (SELECT 1 FROM public.reviews r WHERE r.user_id = p.id AND r.game_id = g.id)
LIMIT 1;

INSERT INTO public.reviews (user_id, game_id, rating, comment, is_verified, is_featured) 
SELECT 
    p.id,
    g.id,
    5,
    'Pelayanan bagus, harga kompetitif. Sudah langganan di sini.',
    true,
    true
FROM public.profiles p
CROSS JOIN public.games g
WHERE p.role = 'customer' 
AND g.slug = 'free-fire'
AND NOT EXISTS (SELECT 1 FROM public.reviews r WHERE r.user_id = p.id AND r.game_id = g.id)
LIMIT 1;

-- 9. Refresh materialized views and update stats
SELECT public.refresh_hero_stats();

-- Update package counts for all games
UPDATE public.games 
SET package_count = (
    SELECT COUNT(*) 
    FROM public.game_packages 
    WHERE game_id = games.id AND is_active = true
);

-- Update min/max prices for all games
UPDATE public.games 
SET 
    min_price = (
        SELECT MIN(price) 
        FROM public.game_packages 
        WHERE game_id = games.id AND is_active = true
    ),
    max_price = (
        SELECT MAX(price) 
        FROM public.game_packages 
        WHERE game_id = games.id AND is_active = true
    );

-- 10. Add performance optimization
-- Analyze tables for better query performance
ANALYZE public.games;
ANALYZE public.game_packages;
ANALYZE public.promotions;
ANALYZE public.system_settings;

-- Create additional indexes for hero section queries
CREATE INDEX IF NOT EXISTS idx_games_hero_display ON public.games(is_popular, featured_order, rating DESC, review_count DESC) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_packages_hero ON public.game_packages(game_id, is_popular, sort_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_promotions_active_hero ON public.promotions(game_id, is_active, end_date) WHERE is_active = true;

-- Final verification query
SELECT 
    'Hero Section Data Summary' as summary,
    (SELECT COUNT(*) FROM public.games WHERE is_popular = true AND is_active = true) as popular_games,
    (SELECT COUNT(*) FROM public.promotions WHERE is_active = true AND end_date > NOW()) as active_promotions,
    (SELECT COUNT(*) FROM public.system_settings WHERE is_public = true) as public_settings,
    (SELECT COUNT(*) FROM public.game_packages WHERE is_active = true) as active_packages;