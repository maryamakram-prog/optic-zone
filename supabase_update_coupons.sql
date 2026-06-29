-- Add applicability columns to coupons table
ALTER TABLE public.coupons 
ADD COLUMN IF NOT EXISTS applicable_category TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS applicable_product_id UUID REFERENCES public.products(id) ON DELETE CASCADE DEFAULT NULL;

-- Update existing sample coupons to ensure they remain global
UPDATE public.coupons 
SET applicable_category = NULL, applicable_product_id = NULL 
WHERE applicable_category IS NOT NULL OR applicable_product_id IS NOT NULL;
