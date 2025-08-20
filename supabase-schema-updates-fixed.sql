-- Database Updates untuk Hero Section Optimization (Fixed Version)
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
    g.id,
    g.name,
    g.slug,
    g.category,
    g.description,
    g.image_url,
    g.icon_url,
    g.background_url,
    g.developer,
    g.rating,
    g.review_count,
    g.is_popular,
    g.is_active,
    g.processing_speed,
    g.min_price,
    g.max_price,
    g.package_count,
    g.total_sales,
    g.featured_order,
    COALESCE(g.hero_display_name, g.name) as display_name,
    g.hero_tagline,
    COALESCE(g.player_count_display, '10M+') as players,
    g.last_featured_at,
    g.created_at,
    g.updated_at,
    CASE 
        WHEN EXISTS(
            SELECT 1 FROM public.promotions p 
            WHERE p.game_id = g.id 
            AND p.is_active = true 
            AND p.end_date > NOW()
        ) 
        THEN true 
        ELSE false 
    END as has_active_promo
FROM public.games g
WHERE g.is_active = true AND g.is_popular = true
ORDER BY g.featured_order ASC, g.rating DESC, g.review_count DESC;

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

-- 6. Create function to get hero section packages
CREATE OR REPLACE FUNCTION public.get_hero_packages(game_uuid UUID)
RETURNS json AS $$
BEGIN
    RETURN (
        SELECT json_agg(
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
        )
        FROM public.game_packages gp
        WHERE gp.game_id = game_uuid AND gp.is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

-- Create unique index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_hero_stats_cache_key ON public.hero_stats_cache(stat_key);

-- 8. Function to refresh hero stats cache
CREATE OR REPLACE FUNCTION public.refresh_hero_stats()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.hero_stats_cache;
EXCEPTION
    WHEN OTHERS THEN
        -- If concurrent refresh fails, do regular refresh
        REFRESH MATERIALIZED VIEW public.hero_stats_cache;
END;
$$ LANGUAGE plpgsql;

-- 9. Update trigger for package counts (improved version)
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

-- Create trigger for package count updates (drop first to avoid conflicts)
DROP TRIGGER IF EXISTS trigger_update_game_package_count ON public.game_packages;
CREATE TRIGGER trigger_update_game_package_count
    AFTER INSERT OR UPDATE OR DELETE ON public.game_packages
    FOR EACH ROW EXECUTE FUNCTION public.update_game_package_count();

-- 10. Add more system settings for hero section
INSERT INTO public.system_settings (key, value, description, is_public) VALUES
('platform_tagline', 'Platform Top-Up Gaming #1 Indonesia', 'Main tagline for hero section', true),
('hero_cta_primary', 'Mulai Top Up Sekarang', 'Primary CTA text for hero section', true),
('hero_cta_secondary', 'Cari Game Favorit', 'Secondary CTA text for hero section', true),
('esports_partners', '["EVOS Esports", "RRQ Team", "ONIC Esports", "Bigetron Alpha"]', 'List of esports partners for social proof', true),
('live_transaction_base', '15200', 'Base number for live transaction counter', false),
('avg_process_time_base', '28', 'Base average process time in seconds', false),
('total_users', '2100000', 'Total registered users', true),
('daily_transactions', '15200', 'Average daily transactions', true),
('customer_satisfaction', '99.8', 'Customer satisfaction percentage', true)
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- 11. Create function to get complete hero section data
CREATE OR REPLACE FUNCTION public.get_hero_section_data()
RETURNS json AS $$
DECLARE
    result json;
BEGIN
    SELECT json_build_object(
        'games', (
            SELECT json_agg(
                json_build_object(
                    'id', hg.id,
                    'name', hg.name,
                    'slug', hg.slug,
                    'display_name', hg.display_name,
                    'category', hg.category,
                    'players', hg.players,
                    'rating', hg.rating,
                    'review_count', hg.review_count,
                    'processing_speed', hg.processing_speed,
                    'has_active_promo', hg.has_active_promo,
                    'min_price', hg.min_price,
                    'max_price', hg.max_price,
                    'packages', public.get_hero_packages(hg.id)
                )
            )
            FROM public.hero_games hg
            LIMIT 4
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

-- 12. Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.get_hero_section_data() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_hero_packages(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.refresh_hero_stats() TO anon, authenticated;
GRANT SELECT ON public.hero_games TO anon, authenticated;
GRANT SELECT ON public.hero_stats_cache TO anon, authenticated;

-- 13. Create additional performance indexes
CREATE INDEX IF NOT EXISTS idx_games_hero_display ON public.games(is_popular, featured_order, rating DESC, review_count DESC) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_packages_hero ON public.game_packages(game_id, is_popular, sort_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_promotions_active_hero ON public.promotions(game_id, is_active, end_date) WHERE is_active = true;

-- 14. Initial refresh of materialized view
SELECT public.refresh_hero_stats();

-- 15. Verification query
SELECT 
    'Hero Section Schema Update Complete' as status,
    (SELECT COUNT(*) FROM public.games WHERE is_popular = true AND is_active = true) as popular_games_count,
    (SELECT COUNT(*) FROM public.system_settings WHERE key LIKE 'hero_%') as hero_settings_count,
    (SELECT COUNT(*) FROM public.hero_stats_cache) as cached_stats_count;