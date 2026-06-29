-- Seed 18 diverse, high-quality products into the public.products table
INSERT INTO public.products (
  name, brand, price, category, gender, 
  "frameShape", "frameMaterial", "frameColor", "imageUrl", description, rating, reviews, "isBestSeller", "isSale", "isNew"
) VALUES
-- Eyeglasses
('Classic Wayfarer Clear', 'Ray-Ban', 129.99, 'eyeglasses', 'unisex', 'Wayfarer', 'Acetate', 'Black', 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80', 'Timeless wayfarer design with clear lenses for everyday wear.', 4.8, 124, true, false, false),
('Titanium Minimalist', 'Lindberg', 249.99, 'eyeglasses', 'unisex', 'Round', 'Titanium', 'Silver', 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=80', 'Ultra-lightweight titanium frames that you will forget you are wearing.', 4.9, 89, false, true, false),
('Retro Clubmaster', 'Oakley', 145.00, 'eyeglasses', 'men', 'Browline', 'Mixed', 'Tortoise', 'https://images.unsplash.com/photo-1513224502586-d1e602410265?w=800&q=80', 'Vintage-inspired browline frames for a sharp, sophisticated look.', 4.6, 56, false, false, false),

-- Sunglasses
('Polarized Aviator Pro', 'Ray-Ban', 189.99, 'sunglasses', 'unisex', 'Aviator', 'Metal', 'Gold', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80', 'Premium polarized lenses with a classic gold aviator frame.', 4.9, 312, false, true, false),
('Oversized Cat-Eye', 'Gucci', 320.00, 'sunglasses', 'women', 'Cat-Eye', 'Acetate', 'Black', 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800&q=80', 'Bold and glamorous oversized cat-eye sunglasses for maximum sun protection.', 4.7, 45, false, false, true),
('Matte Sport Wraps', 'Oakley', 165.00, 'sunglasses', 'men', 'Wrap', 'Plastic', 'Matte Black', 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=800&q=80', 'Secure wrap-around design for outdoor activities and driving.', 4.5, 78, false, false, false),
('Vintage Round Shades', 'Oliver Peoples', 210.50, 'sunglasses', 'unisex', 'Round', 'Metal', 'Bronze', 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=80', 'Retro round sunglasses with tinted lenses.', 4.8, 102, false, true, false),

-- Blue Light Glasses
('Screen Saver Pro', 'Felix Gray', 95.00, 'blue-light', 'unisex', 'Square', 'Acetate', 'Clear', 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&q=80', 'Advanced blue light blocking technology to reduce digital eye strain.', 4.9, 450, true, false, false),
('Digital Essential', 'Warby Parker', 115.00, 'blue-light', 'women', 'Round', 'Acetate', 'Pink Crystal', 'https://images.unsplash.com/photo-1582142407894-ec85a1260a46?w=800&q=80', 'Stylish protection against computer screens and artificial light.', 4.6, 88, false, false, false),
('Gamer Shield Optics', 'Gunnar', 75.99, 'blue-light', 'men', 'Rectangle', 'Plastic', 'Carbon', 'https://images.unsplash.com/photo-1555505019-8c3f1c4aba5f?w=800&q=80', 'High-performance eyewear designed specifically for marathon gaming sessions.', 4.7, 210, false, true, false),

-- Kids Glasses
('Indestructible Flex', 'Miraflex', 85.00, 'kids', 'kids', 'Oval', 'Silicone', 'Blue', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80', 'Flexible, unbreakable frames perfect for active toddlers and kids.', 4.9, 320, true, false, false),
('Playground Ready', 'Jonas Paul', 95.00, 'kids', 'kids', 'Square', 'Acetate', 'Red', 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80', 'Durable and stylish frames that kids actually want to wear.', 4.5, 65, false, false, false),

-- Sports Glasses
('Cycling Performance', 'Oakley', 195.00, 'sports', 'unisex', 'Shield', 'O-Matter', 'Neon Yellow', 'https://images.unsplash.com/photo-1560155016-bd4879ae8f21?w=800&q=80', 'Aerodynamic shield design with Prizm lenses for ultimate road visibility.', 4.8, 142, false, false, true),
('Swim Goggles Pro', 'Speedo', 35.00, 'sports', 'unisex', 'Goggle', 'Silicone', 'Clear/Blue', 'https://images.unsplash.com/photo-1518349619113-03114f06124a?w=800&q=80', 'Anti-fog, UV protection prescription-ready swim goggles.', 4.6, 95, false, false, false),

-- Contact Lenses
('Daily Disposables', 'Acuvue', 45.99, 'contact-lenses', 'unisex', 'N/A', 'Hydrogel', 'Clear', 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?w=800&q=80', 'Comfortable 1-day disposable lenses for fresh vision every morning.', 4.9, 1050, true, false, false),
('Monthly Astigmatism', 'Biofinity', 65.00, 'contact-lenses', 'unisex', 'N/A', 'Silicone Hydrogel', 'Clear', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80', 'Breathable monthly contacts designed specifically for astigmatism.', 4.7, 430, false, false, false),
('Color Enhancers', 'Air Optix', 55.00, 'contact-lenses', 'women', 'N/A', 'Hydrogel', 'Sterling Gray', 'https://images.unsplash.com/photo-1512496015851-a1cbf39ca883?w=800&q=80', 'Breathable color contact lenses to subtly enhance your natural eye color.', 4.4, 215, false, false, true),

-- Reading Glasses
('Executive Readers', 'Peepers', 25.00, 'reading', 'unisex', 'Rectangle', 'Acetate', 'Tortoise', 'https://images.unsplash.com/photo-1483412468200-72182dbbc544?w=800&q=80', 'Classic rectangular reading glasses perfect for the office.', 4.5, 310, false, false, false),
('Compact Foldables', 'Foster Grant', 30.00, 'reading', 'unisex', 'Round', 'Metal', 'Gunmetal', 'https://images.unsplash.com/photo-1590494165264-1ebe3602eb80?w=800&q=80', 'Ultra-compact reading glasses that fold up to fit in your pocket.', 4.8, 120, false, true, false);
