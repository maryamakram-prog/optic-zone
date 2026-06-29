CREATE TABLE IF NOT EXISTS public.lenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  lens_type TEXT NOT NULL,
  power_range TEXT,
  base_curve TEXT,
  diameter TEXT,
  water_content TEXT,
  material TEXT,
  replacement_schedule TEXT,
  pack_size TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  description TEXT,
  image_url TEXT,
  in_stock BOOLEAN DEFAULT TRUE,
  quantity INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  color_available BOOLEAN DEFAULT FALSE,
  uv_protection BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.lenses ENABLE ROW LEVEL SECURITY;

-- Public can read lenses
CREATE POLICY "lenses_public_read"
ON public.lenses FOR SELECT USING (true);

-- Only admins can modify lenses (handled at application level)
CREATE POLICY "lenses_admin_all"
ON public.lenses USING (true) WITH CHECK (true);
