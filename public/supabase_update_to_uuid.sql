-- OPTIC ZONE DATABASE MIGRATION SCRIPT: INT -> UUID PRIMARY KEY
-- Run this in the Supabase SQL Editor to migrate the products table and related foreign keys.

-- 1. Disable constraints and drop tables to prevent reference issues
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.cart_items CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;

-- 2. Create the Products Table with UUID Primary Key and is_hidden Flag
CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    "originalPrice" DECIMAL(10, 2),
    category TEXT NOT NULL,
    "imageUrl" TEXT,
    description TEXT,
    "inStock" BOOLEAN DEFAULT TRUE,
    "frameShape" TEXT,
    "frameMaterial" TEXT,
    "frameColor" TEXT,
    "lensColor" TEXT,
    gender TEXT,
    "isBestSeller" BOOLEAN DEFAULT FALSE,
    "isSale" BOOLEAN DEFAULT FALSE,
    "isNew" BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3, 2) DEFAULT 5.0,
    reviews INTEGER DEFAULT 0,
    is_hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.5 Create Prescriptions Table
CREATE TABLE IF NOT EXISTS public.prescriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT DEFAULT 'My Prescription',
    type TEXT NOT NULL CHECK (type IN ('manual', 'upload', 'upload_later')),
    od_sph TEXT,
    od_cyl TEXT,
    od_axis TEXT,
    od_add TEXT,
    os_sph TEXT,
    os_cyl TEXT,
    os_axis TEXT,
    os_add TEXT,
    pd TEXT,
    notes TEXT,
    file_url TEXT,
    is_saved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Recreate Cart Items referencing UUID Products
CREATE TABLE public.cart_items (
    id SERIAL PRIMARY KEY,
    cart_id UUID REFERENCES public.carts ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products ON DELETE CASCADE NOT NULL,
    quantity INTEGER DEFAULT 1 NOT NULL,
    UNIQUE(cart_id, product_id)
);

-- 4. Recreate Order Items referencing UUID Products
CREATE TABLE public.order_items (
    id SERIAL PRIMARY KEY,
    order_id UUID REFERENCES public.orders ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price_at_time DECIMAL(10, 2) NOT NULL,
    prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE SET NULL
);

-- 5. Recreate Reviews referencing UUID Products
CREATE TABLE public.reviews (
    id SERIAL PRIMARY KEY,
    product_id UUID REFERENCES public.products ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    user_name TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    body TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- 7. Create Policies
DROP POLICY IF EXISTS "Allow public read of products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Allow public read of products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text);

DROP POLICY IF EXISTS "Users can manage own cart items" ON public.cart_items;
CREATE POLICY "Users can manage own cart items" ON public.cart_items FOR ALL USING (
  cart_id IN (SELECT id FROM public.carts WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can delete orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text);
CREATE POLICY "Anyone can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text);
CREATE POLICY "Admins can delete orders" ON public.orders FOR DELETE USING (((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text);

DROP POLICY IF EXISTS "Anyone can insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can manage order items" ON public.order_items;
CREATE POLICY "Anyone can insert order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view own order items" ON public.order_items FOR SELECT USING (
  order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()) OR
  ((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text
);
CREATE POLICY "Admins can manage order items" ON public.order_items FOR ALL USING (((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text);

DROP POLICY IF EXISTS "Allow public read of reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users and admins can manage reviews" ON public.reviews;
CREATE POLICY "Allow public read of reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert reviews" ON public.reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);
CREATE POLICY "Users and admins can manage reviews" ON public.reviews FOR ALL USING (
  auth.uid() = user_id OR 
  ((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text
);

-- Policies for Prescriptions
DROP POLICY IF EXISTS "Anyone can insert prescriptions" ON public.prescriptions;
DROP POLICY IF EXISTS "Users can view own prescriptions" ON public.prescriptions;
DROP POLICY IF EXISTS "Users can update own prescriptions" ON public.prescriptions;
DROP POLICY IF EXISTS "Users can delete own prescriptions" ON public.prescriptions;

CREATE POLICY "Anyone can insert prescriptions" ON public.prescriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own prescriptions" ON public.prescriptions FOR SELECT USING (auth.uid() = user_id OR ((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text);
CREATE POLICY "Users can update own prescriptions" ON public.prescriptions FOR UPDATE USING (auth.uid() = user_id OR ((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text);
CREATE POLICY "Users can delete own prescriptions" ON public.prescriptions FOR DELETE USING (auth.uid() = user_id OR ((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text);

-- 8. Storage Configuration (ensure buckets are present and have underscore)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product_images', 'product_images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('prescriptions', 'prescriptions', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Auth Uploads" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'product_images' );
CREATE POLICY "Auth Uploads" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'product_images' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Prescription Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Prescription Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Prescription Admin Manage" ON storage.objects;
CREATE POLICY "Prescription Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'prescriptions' );
CREATE POLICY "Prescription Public Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'prescriptions' );
CREATE POLICY "Prescription Admin Manage" ON storage.objects FOR ALL USING ( bucket_id = 'prescriptions' AND ((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text );

-- 9. Seed product items using predictable static UUID strings
INSERT INTO public.products (id, name, brand, price, "originalPrice", category, "imageUrl", description, "isBestSeller", "isSale", "isNew", rating, reviews, is_hidden)
VALUES
('a1111111-1111-1111-1111-111111111111', 'Classic Aviator Pro', 'Ray-Ban', 189.99, 249.99, 'sunglasses', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80', 'The iconic aviator silhouette with polarized UV400 protection. Lightweight metal frame.', true, true, false, 4.8, 342, false),
('a2222222-2222-2222-2222-222222222222', 'Titanium Round Frame', 'Oakley', 159.99, null, 'eyeglasses', 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80', 'Ultra-lightweight titanium round frame. Perfect combination of durability and style.', false, false, true, 4.6, 218, false),
('a3333333-3333-3333-3333-333333333333', 'Retro Cat Eye', 'Vogue', 129.99, 179.99, 'eyeglasses', 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=600&q=80', 'Vintage cat-eye frame in hand-polished acetate. Adds an elegant retro touch to any style.', false, true, false, 4.7, 156, false),
('a4444444-4444-4444-4444-444444444444', 'Digital Shield Blue', 'Fossil', 99.99, null, 'blue-light', 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&q=80', 'Anti-fatigue reading glasses with lens technology protecting against harmful blue lights.', true, false, false, 4.9, 489, false),
('a5555555-5555-5555-5555-555555555555', 'Luxury Wayfarer', 'Gucci', 219.99, 299.99, 'sunglasses', 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600&q=80', 'Premium Italian acetate Wayfarer frames featuring gradient lenses and CD temple logo details.', false, true, false, 4.5, 127, false),
('a6666666-6666-6666-6666-666666666666', 'Minimalist Wire Frame', 'Prada', 139.99, null, 'eyeglasses', 'https://images.unsplash.com/photo-1513673054901-2b5f51551112?w=600&q=80', 'Minimalist silver wire glasses. Understated elegance with thin temple arms and adjustable pads.', false, false, false, 4.4, 93, false),
('a7777777-7777-7777-7777-777777777777', 'Sport Flex Active', 'Nike', 169.99, null, 'sports', 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&q=80', 'Ventilated wrap sports sunglasses. Extremely stable fit for athletic performance.', false, false, true, 4.7, 201, false),
('a8888888-8888-8888-8888-888888888888', 'Oversized Glamour', 'Versace', 199.99, 259.99, 'sunglasses', 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80', 'Oversized luxury sunglasses featuring bold accents and signature Versace details.', false, true, false, 4.6, 178, false),
('a9999999-9999-9999-9999-999999999999', 'MoistDaily Hydration (30 Pack)', 'Acuvue', 39.99, 49.99, 'contact-lenses', 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?w=600&q=80', 'Daily disposable contacts providing comfort and hydration throughout the day.', false, false, false, 4.8, 124, false),
('b1010101-1010-1010-1010-101010101010', 'UltraVision Monthly Comfort', 'Biofinity', 54.99, null, 'contact-lenses', 'https://images.unsplash.com/photo-1590611936760-eeb9bc5937db?w=600&q=80', 'Premium monthly silicone hydrogel contacts with high oxygen transmissibility.', true, false, false, 4.7, 86, false),
('b1111111-1111-1111-1111-111111111111', 'Kids FlexiRound Durable', 'Polaroid', 69.99, 89.99, 'kids', 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&q=80', 'Flexible, hypoallergenic memory frames designed for active play without breaking.', false, false, true, 4.9, 95, false),
('b1212121-1212-1212-1212-121212121212', 'SportJunior Anti-Slip', 'Nike', 79.99, null, 'kids', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80', 'Durable sports frames for kids with non-slip templates and elastic strap option.', false, true, false, 4.6, 43, false)
ON CONFLICT (id) DO NOTHING;
