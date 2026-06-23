-- SQL Instructions for Supabase
-- Please run the following script in your Supabase SQL Editor.

-- 1. Create Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Allow public inserts into newsletter_subscribers (for anonymous subscriptions)
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" 
    ON public.newsletter_subscribers
    FOR INSERT 
    WITH CHECK (true);

-- 2. Create Product Images Bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product_images', 'product_images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to product_images bucket
CREATE POLICY "Public Access" 
    ON storage.objects FOR SELECT 
    USING ( bucket_id = 'product_images' );

-- Allow authenticated users to upload product images
CREATE POLICY "Auth Uploads" 
    ON storage.objects FOR INSERT 
    WITH CHECK ( bucket_id = 'product_images' AND auth.role() = 'authenticated' );

-- Enjoy!
