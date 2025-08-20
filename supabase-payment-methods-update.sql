-- Update payment methods with more complete data
-- This adds category, processing_time, logo_url, and description fields

-- First, add missing columns if they don't exist
ALTER TABLE public.payment_methods 
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'other',
ADD COLUMN IF NOT EXISTS processing_time VARCHAR(50) DEFAULT 'Instan',
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Update existing payment methods with categories and processing times
UPDATE public.payment_methods SET 
    category = 'ewallet',
    processing_time = 'Instan',
    is_popular = true,
    logo_url = icon_url
WHERE code IN ('gopay', 'ovo', 'dana', 'shopeepay');

UPDATE public.payment_methods SET 
    category = 'bank',
    processing_time = '1-5 menit',
    is_popular = false,
    logo_url = icon_url
WHERE code IN ('bca', 'mandiri', 'bri', 'bni');

UPDATE public.payment_methods SET 
    category = 'retail',
    processing_time = '1-10 menit',
    is_popular = false,
    logo_url = icon_url
WHERE code IN ('indomaret', 'alfamart');

-- Add more payment methods
INSERT INTO public.payment_methods (name, code, type, category, icon_url, logo_url, fee_percentage, fee_fixed, min_amount, max_amount, processing_time, is_popular, sort_order) VALUES
('LinkAja', 'linkaja', 'ewallet', 'ewallet', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=50&h=50&fit=crop', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=50&h=50&fit=crop', 0, 0, 10000, 2000000, 'Instan', false, 11),
('BCA Virtual Account', 'bca_va', 'virtual_account', 'virtual', 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=50&h=50&fit=crop', 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=50&h=50&fit=crop', 0, 4000, 10000, 50000000, '1-10 menit', false, 12),
('Mandiri Virtual Account', 'mandiri_va', 'virtual_account', 'virtual', 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=50&h=50&fit=crop', 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=50&h=50&fit=crop', 0, 4000, 10000, 50000000, '1-10 menit', false, 13),
('BNI Virtual Account', 'bni_va', 'virtual_account', 'virtual', 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=50&h=50&fit=crop', 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=50&h=50&fit=crop', 0, 4000, 10000, 50000000, '1-10 menit', false, 14),
('QRIS', 'qris', 'qris', 'qris', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=50&h=50&fit=crop', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=50&h=50&fit=crop', 0, 0, 10000, 2000000, 'Instan', true, 15);

-- Update descriptions for better UX
UPDATE public.payment_methods SET description = 
    CASE 
        WHEN category = 'ewallet' THEN 'Pembayaran instan tanpa biaya admin'
        WHEN category = 'bank' THEN 'Transfer bank dengan konfirmasi otomatis'
        WHEN category = 'virtual' THEN 'Virtual account dengan nomor unik'
        WHEN category = 'retail' THEN 'Bayar di toko retail terdekat'
        WHEN category = 'qris' THEN 'Scan QR code untuk pembayaran instan'
        ELSE 'Metode pembayaran lainnya'
    END;