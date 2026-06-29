-- Create the lens_discounts table
CREATE TABLE IF NOT EXISTS public.lens_discounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10, 2) NOT NULL,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.lens_discounts ENABLE ROW LEVEL SECURITY;

-- Policies for lens_discounts
DROP POLICY IF EXISTS "Allow public read of lens_discounts" ON public.lens_discounts;
CREATE POLICY "Allow public read of lens_discounts" ON public.lens_discounts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage lens_discounts" ON public.lens_discounts;
CREATE POLICY "Admins can manage lens_discounts" ON public.lens_discounts 
  FOR ALL USING (((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text);

-- Add discount_id to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS lens_discount_id UUID REFERENCES public.lens_discounts(id) ON DELETE SET NULL;

