-- Sample data for WMX TOPUP Gaming Platform
-- Run this after the main schema

-- Insert sample games
INSERT INTO public.games (name, slug, category, description, image_url, icon_url, background_url, developer, rating, review_count, is_popular, processing_speed, min_price, max_price) VALUES
('Mobile Legends: Bang Bang', 'mobile-legends', 'moba', 'Game MOBA terpopuler di Indonesia dengan gameplay 5v5 yang seru dan kompetitif.', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=50&h=50&fit=crop', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop', 'Moonton', 4.8, 125000, true, 'instant', 20000, 500000),

('PUBG Mobile', 'pubg-mobile', 'battle-royale', 'Battle royale terbaik dengan grafis realistis dan gameplay yang menantang.', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=50&h=50&fit=crop', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop', 'Tencent Games', 4.7, 98000, true, 'fast', 15000, 400000),

('Free Fire', 'free-fire', 'battle-royale', 'Battle royale dengan gameplay cepat dan grafis yang ringan untuk semua device.', 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=50&h=50&fit=crop', 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=400&fit=crop', 'Garena', 4.6, 87000, true, 'instant', 10000, 200000),

('Genshin Impact', 'genshin-impact', 'rpg', 'Open-world RPG dengan grafis anime yang memukau dan sistem gacha yang menarik.', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=50&h=50&fit=crop', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop', 'miHoYo', 4.9, 156000, true, 'fast', 16000, 499000),

('Arena of Valor', 'arena-of-valor', 'moba', 'MOBA dengan hero-hero unik dan gameplay yang balanced untuk kompetisi esports.', 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=50&h=50&fit=crop', 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=800&h=400&fit=crop', 'Tencent Games', 4.5, 45000, false, 'instant', 25000, 300000),

('Call of Duty Mobile', 'call-of-duty-mobile', 'fps', 'FPS terbaik di mobile dengan mode multiplayer dan battle royale yang seru.', 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=50&h=50&fit=crop', 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=400&fit=crop', 'Activision', 4.7, 72000, false, 'fast', 15000, 350000),

('Clash of Clans', 'clash-of-clans', 'strategy', 'Strategy game klasik dengan sistem clan dan war yang kompetitif.', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=50&h=50&fit=crop', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop', 'Supercell', 4.4, 89000, false, 'normal', 75000, 500000),

('Honkai Impact 3rd', 'honkai-impact-3rd', 'rpg', 'Action RPG dengan grafis 3D yang memukau dan sistem combat yang dinamis.', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=50&h=50&fit=crop', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop', 'miHoYo', 4.6, 34000, false, 'fast', 16000, 300000);

-- Insert game packages for Mobile Legends
INSERT INTO public.game_packages (game_id, name, amount, price, original_price, discount_percentage, is_popular, sort_order) 
SELECT id, '86 Diamonds', '86 Diamonds', 20000, 22000, 9, false, 1 FROM public.games WHERE slug = 'mobile-legends'
UNION ALL
SELECT id, '172 Diamonds', '172 Diamonds', 40000, 44000, 9, true, 2 FROM public.games WHERE slug = 'mobile-legends'
UNION ALL
SELECT id, '257 Diamonds', '257 Diamonds', 60000, 66000, 9, false, 3 FROM public.games WHERE slug = 'mobile-legends'
UNION ALL
SELECT id, '344 Diamonds', '344 Diamonds', 80000, 88000, 9, false, 4 FROM public.games WHERE slug = 'mobile-legends'
UNION ALL
SELECT id, '429 Diamonds', '429 Diamonds', 100000, 110000, 9, false, 5 FROM public.games WHERE slug = 'mobile-legends'
UNION ALL
SELECT id, '878 Diamonds', '878 Diamonds', 200000, 220000, 9, false, 6 FROM public.games WHERE slug = 'mobile-legends';

-- Insert game packages for PUBG Mobile
INSERT INTO public.game_packages (game_id, name, amount, price, original_price, discount_percentage, is_popular, sort_order) 
SELECT id, '60 UC', '60 UC', 15000, 16000, 6, false, 1 FROM public.games WHERE slug = 'pubg-mobile'
UNION ALL
SELECT id, '325 UC', '325 UC', 75000, 80000, 6, true, 2 FROM public.games WHERE slug = 'pubg-mobile'
UNION ALL
SELECT id, '660 UC', '660 UC', 150000, 160000, 6, false, 3 FROM public.games WHERE slug = 'pubg-mobile'
UNION ALL
SELECT id, '1800 UC', '1800 UC', 400000, 425000, 6, false, 4 FROM public.games WHERE slug = 'pubg-mobile';

-- Insert game packages for Free Fire
INSERT INTO public.game_packages (game_id, name, amount, price, original_price, discount_percentage, is_popular, sort_order) 
SELECT id, '70 Diamonds', '70 Diamonds', 10000, 11000, 9, false, 1 FROM public.games WHERE slug = 'free-fire'
UNION ALL
SELECT id, '140 Diamonds', '140 Diamonds', 20000, 22000, 9, true, 2 FROM public.games WHERE slug = 'free-fire'
UNION ALL
SELECT id, '355 Diamonds', '355 Diamonds', 50000, 55000, 9, false, 3 FROM public.games WHERE slug = 'free-fire'
UNION ALL
SELECT id, '720 Diamonds', '720 Diamonds', 100000, 110000, 9, false, 4 FROM public.games WHERE slug = 'free-fire';

-- Insert game packages for Genshin Impact
INSERT INTO public.game_packages (game_id, name, amount, price, original_price, discount_percentage, is_popular, sort_order) 
SELECT id, '60 Genesis Crystals', '60 Genesis Crystals', 16000, 16000, 0, false, 1 FROM public.games WHERE slug = 'genshin-impact'
UNION ALL
SELECT id, '300 Genesis Crystals', '300 Genesis Crystals', 79000, 79000, 0, true, 2 FROM public.games WHERE slug = 'genshin-impact'
UNION ALL
SELECT id, '980 Genesis Crystals', '980 Genesis Crystals', 249000, 249000, 0, false, 3 FROM public.games WHERE slug = 'genshin-impact'
UNION ALL
SELECT id, '1980 Genesis Crystals', '1980 Genesis Crystals', 499000, 499000, 0, false, 4 FROM public.games WHERE slug = 'genshin-impact';

-- Insert game packages for Arena of Valor
INSERT INTO public.game_packages (game_id, name, amount, price, original_price, discount_percentage, is_popular, sort_order) 
SELECT id, '90 Vouchers', '90 Vouchers', 25000, 27000, 7, false, 1 FROM public.games WHERE slug = 'arena-of-valor'
UNION ALL
SELECT id, '180 Vouchers', '180 Vouchers', 50000, 54000, 7, true, 2 FROM public.games WHERE slug = 'arena-of-valor'
UNION ALL
SELECT id, '450 Vouchers', '450 Vouchers', 125000, 135000, 7, false, 3 FROM public.games WHERE slug = 'arena-of-valor';

-- Insert game packages for Call of Duty Mobile
INSERT INTO public.game_packages (game_id, name, amount, price, original_price, discount_percentage, is_popular, sort_order) 
SELECT id, '80 CP', '80 CP', 15000, 15000, 0, false, 1 FROM public.games WHERE slug = 'call-of-duty-mobile'
UNION ALL
SELECT id, '400 CP', '400 CP', 75000, 75000, 0, true, 2 FROM public.games WHERE slug = 'call-of-duty-mobile'
UNION ALL
SELECT id, '800 CP', '800 CP', 150000, 150000, 0, false, 3 FROM public.games WHERE slug = 'call-of-duty-mobile';

-- Insert game packages for Clash of Clans
INSERT INTO public.game_packages (game_id, name, amount, price, original_price, discount_percentage, is_popular, sort_order) 
SELECT id, '500 Gems', '500 Gems', 75000, 80000, 6, false, 1 FROM public.games WHERE slug = 'clash-of-clans'
UNION ALL
SELECT id, '1200 Gems', '1200 Gems', 150000, 160000, 6, true, 2 FROM public.games WHERE slug = 'clash-of-clans'
UNION ALL
SELECT id, '2500 Gems', '2500 Gems', 300000, 320000, 6, false, 3 FROM public.games WHERE slug = 'clash-of-clans';

-- Insert game packages for Honkai Impact 3rd
INSERT INTO public.game_packages (game_id, name, amount, price, original_price, discount_percentage, is_popular, sort_order) 
SELECT id, '60 Crystals', '60 Crystals', 16000, 16000, 0, false, 1 FROM public.games WHERE slug = 'honkai-impact-3rd'
UNION ALL
SELECT id, '330 Crystals', '330 Crystals', 79000, 79000, 0, true, 2 FROM public.games WHERE slug = 'honkai-impact-3rd'
UNION ALL
SELECT id, '1090 Crystals', '1090 Crystals', 249000, 249000, 0, false, 3 FROM public.games WHERE slug = 'honkai-impact-3rd';

-- Insert sample promotions
INSERT INTO public.promotions (title, description, badge, discount_percentage, game_id, background_image, is_limited, start_date, end_date) 
SELECT 
    'Flash Sale 50% OFF',
    'Dapatkan diskon hingga 50% untuk semua paket Mobile Legends!',
    'FLASH SALE',
    50,
    id,
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop',
    true,
    NOW(),
    NOW() + INTERVAL '1 day'
FROM public.games WHERE slug = 'mobile-legends'
UNION ALL
SELECT 
    'Weekend Special',
    'Bonus 25% UC untuk setiap pembelian PUBG Mobile di weekend!',
    'WEEKEND',
    25,
    id,
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop',
    false,
    NOW(),
    NOW() + INTERVAL '3 days'
FROM public.games WHERE slug = 'pubg-mobile'
UNION ALL
SELECT 
    'Free Fire Fever',
    'Dapatkan bonus diamonds untuk setiap top up Free Fire!',
    'BONUS',
    15,
    id,
    'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=400&fit=crop',
    false,
    NOW(),
    NOW() + INTERVAL '7 days'
FROM public.games WHERE slug = 'free-fire';

-- Insert payment methods
INSERT INTO public.payment_methods (name, code, type, icon_url, fee_percentage, fee_fixed, min_amount, max_amount, sort_order) VALUES
('GoPay', 'gopay', 'ewallet', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=50&h=50&fit=crop', 0, 0, 10000, 2000000, 1),
('OVO', 'ovo', 'ewallet', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=50&h=50&fit=crop', 0, 0, 10000, 2000000, 2),
('DANA', 'dana', 'ewallet', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=50&h=50&fit=crop', 0, 0, 10000, 2000000, 3),
('ShopeePay', 'shopeepay', 'ewallet', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=50&h=50&fit=crop', 0, 0, 10000, 2000000, 4),
('Bank BCA', 'bca', 'bank', 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=50&h=50&fit=crop', 0, 6500, 10000, 50000000, 5),
('Bank Mandiri', 'mandiri', 'bank', 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=50&h=50&fit=crop', 0, 6500, 10000, 50000000, 6),
('Bank BRI', 'bri', 'bank', 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=50&h=50&fit=crop', 0, 6500, 10000, 50000000, 7),
('Bank BNI', 'bni', 'bank', 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=50&h=50&fit=crop', 0, 6500, 10000, 50000000, 8),
('Indomaret', 'indomaret', 'retail', 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=50&h=50&fit=crop', 0, 2500, 10000, 5000000, 9),
('Alfamart', 'alfamart', 'retail', 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=50&h=50&fit=crop', 0, 2500, 10000, 5000000, 10);

-- Insert system settings
INSERT INTO public.system_settings (key, value, description, is_public) VALUES
('site_name', 'WMX TOPUP', 'Nama website', true),
('site_description', 'Platform top up gaming terpercaya dengan proses instan dan harga terbaik', 'Deskripsi website', true),
('contact_whatsapp', '+6281234567890', 'Nomor WhatsApp customer service', true),
('contact_email', 'support@wmxtopup.com', 'Email customer service', true),
('maintenance_mode', 'false', 'Mode maintenance website', false),
('min_transaction_amount', '10000', 'Minimum amount untuk transaksi', false),
('max_transaction_amount', '50000000', 'Maximum amount untuk transaksi', false),
('default_processing_fee', '0', 'Fee default untuk processing', false),
('success_rate', '99.9', 'Success rate platform', true),
('total_games', '150', 'Total game yang tersedia', true),
('support_hours', '24/7', 'Jam operasional support', true);

-- Update package counts for games
UPDATE public.games 
SET package_count = (
    SELECT COUNT(*) 
    FROM public.game_packages 
    WHERE game_id = games.id AND is_active = true
);

-- Update min/max prices for games
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

-- Insert sample reviews (you'll need to create users first)
-- This is just the structure, actual reviews will be added after users register
/*
INSERT INTO public.reviews (user_id, game_id, rating, comment, is_verified, is_featured) VALUES
-- Add sample reviews here after creating test users
*/