-- OPTIC ZONE COMPLETE DATABASE SETUP & SEED
-- Copy this entire file and run it in the Supabase SQL Editor.

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ==========================================
-- 1. Create Tables
-- ==========================================

-- Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    address TEXT,
    role TEXT DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Products
CREATE TABLE IF NOT EXISTS public.products (
    id SERIAL PRIMARY KEY,
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Carts
CREATE TABLE IF NOT EXISTS public.carts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Cart Items
CREATE TABLE IF NOT EXISTS public.cart_items (
    id SERIAL PRIMARY KEY,
    cart_id UUID REFERENCES public.carts ON DELETE CASCADE NOT NULL,
    product_id INTEGER REFERENCES public.products ON DELETE CASCADE NOT NULL,
    quantity INTEGER DEFAULT 1 NOT NULL,
    UNIQUE(cart_id, product_id)
);

-- Orders
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE SET NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending',
    shipping_address TEXT,
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;

-- Order Items
CREATE TABLE IF NOT EXISTS public.order_items (
    id SERIAL PRIMARY KEY,
    order_id UUID REFERENCES public.orders ON DELETE CASCADE NOT NULL,
    product_id INTEGER REFERENCES public.products ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price_at_time DECIMAL(10, 2) NOT NULL
);

-- Appointments
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE SET NULL,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    service TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Newsletter Subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupons
CREATE TABLE IF NOT EXISTS public.coupons (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL DEFAULT 'percent', -- 'percent' or 'fixed'
    value DECIMAL(10, 2) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES public.products ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    user_name TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    body TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. Row Level Security & Policies
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage own cart" ON public.carts;
DROP POLICY IF EXISTS "Users can manage own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can delete orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public inserts" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Allow public read of coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins can manage coupons" ON public.coupons;

-- Apply policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users can manage own cart" ON public.carts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own cart items" ON public.cart_items FOR ALL USING (
  cart_id IN (SELECT id FROM public.carts WHERE user_id = auth.uid())
);

-- Orders Policies
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Anyone can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete orders" ON public.orders FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Allow public inserts" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);

-- Coupons Policies
CREATE POLICY "Allow public read of coupons" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Admins can manage coupons" ON public.coupons FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ==========================================
-- 3. Trigger for Automatic Profile Sync
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, role, created_at)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'customer'),
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 4. Storage Buckets configuration
-- ==========================================

INSERT INTO storage.buckets (id, name, public) 
VALUES ('product_images', 'product_images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Auth Uploads" ON storage.objects;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'product_images' );
CREATE POLICY "Auth Uploads" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'product_images' AND auth.role() = 'authenticated' );

-- ==========================================
-- 5. Seed Default Users
-- Password: password123
-- ==========================================

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, 
  email_confirmed_at, recovery_sent_at, last_sign_in_at, 
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
  confirmation_token, email_change, email_change_token_new, recovery_token
) 
VALUES 
-- Admin (admin@opticzone.com)
(
  '00000000-0000-0000-0000-000000000000',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'authenticated',
  'authenticated',
  'admin@opticzone.com',
  crypt('password123', gen_salt('bf')),
  now(), null, null,
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "System", "last_name": "Admin", "role": "admin"}',
  now(), now(), '', '', '', ''
),
-- Customer 1 (john@opticzone.com)
(
  '00000000-0000-0000-0000-000000000000',
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
  'authenticated',
  'authenticated',
  'john@opticzone.com',
  crypt('password123', gen_salt('bf')),
  now(), null, null,
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "John", "last_name": "Doe", "role": "customer"}',
  now(), now(), '', '', '', ''
),
-- Customer 2 (jane@opticzone.com)
(
  '00000000-0000-0000-0000-000000000000',
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
  'authenticated',
  'authenticated',
  'jane@opticzone.com',
  crypt('password123', gen_salt('bf')),
  now(), null, null,
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "Jane", "last_name": "Smith", "role": "customer"}',
  now(), now(), '', '', '', ''
)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 6. Seed Product Items
-- ==========================================

INSERT INTO public.products (id, name, brand, price, "originalPrice", category, "imageUrl", description, "isBestSeller", "isSale", "isNew", rating, reviews)
VALUES
(1, 'Classic Aviator Pro', 'Ray-Ban', 189.99, 249.99, 'sunglasses', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80', 'The iconic aviator silhouette with polarized UV400 protection. Lightweight metal frame.', true, true, false, 4.8, 342),
(2, 'Titanium Round Frame', 'Oakley', 159.99, null, 'eyeglasses', 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80', 'Ultra-lightweight titanium round frame. Perfect combination of durability and style.', false, false, true, 4.6, 218),
(3, 'Retro Cat Eye', 'Vogue', 129.99, 179.99, 'eyeglasses', 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=600&q=80', 'Vintage cat-eye frame in hand-polished acetate. Adds an elegant retro touch to any style.', false, true, false, 4.7, 156),
(4, 'Digital Shield Blue', 'Fossil', 99.99, null, 'blue-light', 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&q=80', 'Anti-fatigue reading glasses with lens technology protecting against harmful blue lights.', true, false, false, 4.9, 489),
(5, 'Luxury Wayfarer', 'Gucci', 219.99, 299.99, 'sunglasses', 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600&q=80', 'Premium Italian acetate Wayfarer frames featuring gradient lenses and CD temple logo details.', false, true, false, 4.5, 127),
(6, 'Minimalist Wire Frame', 'Prada', 139.99, null, 'eyeglasses', 'https://images.unsplash.com/photo-1513673054901-2b5f51551112?w=600&q=80', 'Minimalist silver wire glasses. Understated elegance with thin temple arms and adjustable pads.', false, false, false, 4.4, 93),
(7, 'Sport Flex Active', 'Nike', 169.99, null, 'sports', 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&q=80', 'Ventilated wrap sports sunglasses. Extremely stable fit for athletic performance.', false, false, true, 4.7, 201),
(8, 'Oversized Glamour', 'Versace', 199.99, 259.99, 'sunglasses', 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80', 'Oversized luxury sunglasses featuring bold accents and signature Versace details.', false, true, false, 4.6, 178),
(9, 'MoistDaily Hydration (30 Pack)', 'Acuvue', 39.99, 49.99, 'contact-lenses', 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?w=600&q=80', 'Daily disposable contacts providing comfort and hydration throughout the day.', false, false, false, 4.8, 124),
(10, 'UltraVision Monthly Comfort', 'Biofinity', 54.99, null, 'contact-lenses', 'https://images.unsplash.com/photo-1590611936760-eeb9bc5937db?w=600&q=80', 'Premium monthly silicone hydrogel contacts with high oxygen transmissibility.', true, false, false, 4.7, 86),
(11, 'Kids FlexiRound Durable', 'Polaroid', 69.99, 89.99, 'kids', 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&q=80', 'Flexible, hypoallergenic memory frames designed for active play without breaking.', false, false, true, 4.9, 95),
(12, 'SportJunior Anti-Slip', 'Nike', 79.99, null, 'kids', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80', 'Durable sports frames for kids with non-slip templates and elastic strap option.', false, true, false, 4.6, 43)
ON CONFLICT (id) DO NOTHING;

-- Seed sample coupons
INSERT INTO public.coupons (code, type, value, active)
VALUES 
('WELCOME10', 'percent', 10.00, true),
('SUMMER20', 'percent', 20.00, true),
('OP15X', 'fixed', 15.00, true)
ON CONFLICT (code) DO NOTHING;
