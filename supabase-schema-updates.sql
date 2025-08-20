-- Database Updates untuk Hero Section Optimization
-- Run this after the main schema to add enhancements

-- 1. Add missing columns for better hero section integration (only new columns)
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT 0;
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS hero_display_name VARCHAR(150);
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS hero_tagline TEXT;
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS player_count_display VARCHAR(20);
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS last_featured_at TIMESTAMP WITH TIME ZONE;

-- 2. Add indexes for hero section queries
CREATE INDEX IF NOT EXISTS idx_games_featured ON public.games(is_popular, featured_order, is_active);
CREATE INDEX IF NOT EXISTS idx_games_hero_rotation ON public.games(is_popular, last_featured_at, is_active);
CREATE INDEX IF NOT EXISTS idx_promotions_hero ON public.promotions(is_active, game_id, start_date, end_date);

-- 3. Add hero section specific settings
INSERT INTO public.system_settings (key, value, description, is_public) VALUES
('hero_rotation_interval', '4000', 'Hero section game rotation interval in milliseconds', false),
('hero_feature_rotation_interval', '3000', 'Hero section feature rotation interval in milliseconds', false),
('hero_stats_update_interval', '5000', 'Hero section live stats update interval in milliseconds', false),
('hero_max_games', '4', 'Maximum number of games to show in hero rotation', false),
('hero_show_live_stats', 'true', 'Enable live stats display in hero section', true),
('hero_show_esports_partners', 'true', 'Show esports partnership logos', true)
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- 4. Create view for hero section games (optimized query)
CREATE OR REPLACE VIEW public.hero_games AS
SELECT 
    g.*,
    COALESCE(g.hero_display_name, g.name) as display_name,
    COALESCE(g.player_count_display, '10M+') as players,
    COUNT(gp.id) as package_count,
    MIN(gp.price) as min_package_price,
    MAX(gp.price) as max_package_price,
    CASE 
        WHEN EXISTS(SELECT 1 FROM public.promotions p WHERE p.game_id = g.id AND p.is_active = true AND p.end_date > NOW()) 
        THEN true 
        ELSE false 
    END as has_active_promo,
    ARRAY_AGG(
        json_build_object(
            'id', gp.id,
            'name', gp.name,
            'amount', gp.amount,
            'price', gp.price,
            'original_price', gp.original_price,
            'discount_percentage', gp.discount_percentage,
            'is_popular', gp.is_popular,
            'sort_order', gp.sort_order
        ) ORDER BY gp.sort_order
    ) FILTER (WHERE gp.is_active = true) as packages
FROM public.games g
LEFT JOIN public.game_packages gp ON g.id = gp.game_id AND gp.is_active = true
WHERE g.is_active = true AND g.is_popular = true
GROUP BY g.id
ORDER BY g.featured_order ASC, g.rating DESC, g.review_count DESC
LIMIT 4;

-- 5. Create function to update hero game rotation
CREATE OR REPLACE FUNCTION public.update_hero_rotation()
RETURNS void AS $$
BEGIN
    -- Update last_featured_at for better rotation logic
    UPDATE public.games 
    SET last_featured_at = NOW()
    WHERE id IN (
        SELECT id FROM public.games 
        WHERE is_popular = true AND is_active = true 
        ORDER BY COALESCE(last_featured_at, '1970-01-01'::timestamp) ASC 
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql;

-- 6. Add RLS policies for hero section views
CREATE POLICY "Anyone can view hero games" ON public.games FOR SELECT USING (
    is_active = true AND (is_popular = true OR id IN (
        SELECT game_id FROM public.promotions 
        WHERE is_active = true AND end_date > NOW()
    ))
);

-- 7. Create materialized view for performance (optional, for high traffic)
CREATE MATERIALIZED VIEW IF NOT EXISTS public.hero_stats_cache AS
SELECT 
    'total_users' as stat_key,
    COALESCE((SELECT value FROM public.system_settings WHERE key = 'total_users'), '2100000') as stat_value,
    NOW() as last_updated
UNION ALL
SELECT 
    'success_rate' as stat_key,
    COALESCE((SELECT value FROM public.system_settings WHERE key = 'success_rate'), '99.94') as stat_value,
    NOW() as last_updated
UNION ALL
SELECT 
    'total_games' as stat_key,
    COUNT(*)::text as stat_value,
    NOW() as last_updated
FROM public.games WHERE is_active = true
UNION ALL
SELECT 
    'active_promotions' as stat_key,
    COUNT(*)::text as stat_value,
    NOW() as last_updated
FROM public.promotions WHERE is_active = true AND end_date > NOW();

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_hero_stats_cache_key ON public.hero_stats_cache(stat_key);

-- 8. Function to refresh hero stats cache
CREATE OR REPLACE FUNCTION public.refresh_hero_stats()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.hero_stats_cache;
END;
$$ LANGUAGE plpgsql;

-- 9. Add trigger to auto-update package counts
CREATE OR REPLACE FUNCTION public.update_game_package_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Update package count for the affected game
    UPDATE public.games 
    SET 
        package_count = (
            SELECT COUNT(*) 
            FROM public.game_packages 
            WHERE game_id = COALESCE(NEW.game_id, OLD.game_id) AND is_active = true
        ),
        min_price = (
            SELECT MIN(price) 
            FROM public.game_packages 
            WHERE game_id = COALESCE(NEW.game_id, OLD.game_id) AND is_active = true
        ),
        max_price = (
            SELECT MAX(price) 
            FROM public.game_packages 
            WHERE game_id = COALESCE(NEW.game_id, OLD.game_id) AND is_active = true
        ),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.game_id, OLD.game_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for package count updates
DROP TRIGGER IF EXISTS trigger_update_game_package_count ON public.game_packages;
CREATE TRIGGER trigger_update_game_package_count
    AFTER INSERT OR UPDATE OR DELETE ON public.game_packages
    FOR EACH ROW EXECUTE FUNCTION public.update_game_package_count();

-- 10. Add some sample hero-specific data
UPDATE public.games SET 
    hero_display_name = 'Mobile Legends',
    hero_tagline = 'MOBA Terpopuler Indonesia',
    player_count_display = '100M+',
    featured_order = 1
WHERE slug = 'mobile-legends';

UPDATE public.games SET 
    hero_display_name = 'Free Fire',
    hero_tagline = 'Battle Royale Terfavorit',
    player_count_display = '80M+',
    featured_order = 2
WHERE slug = 'free-fire';

UPDATE public.games SET 
    hero_display_name = 'PUBG Mobile',
    hero_tagline = 'Realistic Battle Royale',
    player_count_display = '50M+',
    featured_order = 3
WHERE slug = 'pubg-mobile';

UPDATE public.games SET 
    hero_display_name = 'Genshin Impact',
    hero_tagline = 'Open World RPG',
    player_count_display = '60M+',
    featured_order = 4
WHERE slug = 'genshin-impact';

-- 11. Add more system settings for hero section
INSERT INTO public.system_settings (key, value, description, is_public) VALUES
('platform_tagline', 'Platform Top-Up Gaming #1 Indonesia', 'Main tagline for hero section', true),
('hero_cta_primary', 'Mulai Top Up Sekarang', 'Primary CTA text for hero section', true),
('hero_cta_secondary', 'Cari Game Favorit', 'Secondary CTA text for hero section', true),
('esports_partners', '["EVOS Esports", "RRQ Team", "ONIC Esports", "Bigetron Alpha"]', 'List of esports partners for social proof', true),
('live_transaction_base', '15200', 'Base number for live transaction counter', false),
('avg_process_time_base', '28', 'Base average process time in seconds', false)
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- 12. Create function to get hero section data (single query optimization)
CREATE OR REPLACE FUNCTION public.get_hero_section_data()
RETURNS json AS $$
DECLARE
    result json;
BEGIN
    SELECT json_build_object(
        'games', (
            SELECT json_agg(
                json_build_object(
                    'id', id,
                    'name', name,
                    'slug', slug,
                    'display_name', display_name,
                    'category', category,
                    'players', players,
                    'rating', rating,
                    'review_count', review_count,
                    'processing_speed', processing_speed,
                    'has_active_promo', has_active_promo,
                    'packages', packages
                )
            )
            FROM public.hero_games
        ),
        'stats', (
            SELECT json_object_agg(stat_key, stat_value)
            FROM public.hero_stats_cache
        ),
        'settings', (
            SELECT json_object_agg(key, value)
            FROM public.system_settings
            WHERE is_public = true
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.get_hero_section_data() TO anon, authenticated;
GRANT SELECT ON public.hero_games TO anon, authenticated;
GRANT SELECT ON public.hero_stats_cache TO anon, authenticated;