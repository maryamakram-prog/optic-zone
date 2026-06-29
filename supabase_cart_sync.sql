-- Add items JSONB to Carts table
ALTER TABLE public.carts ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb;
