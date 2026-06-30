-- Fix broken/dog images for Contact Lenses

UPDATE public.products
SET 
  "imageUrl" = '/images/contact-lens.svg',
  "images" = '["/images/contact-lens.svg"]'::jsonb
WHERE category = 'contact-lenses';
