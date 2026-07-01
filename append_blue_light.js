const fs = require('fs');

const sqlToAppend = `

-- Added Blue Light Products with Multiple Images and Filtering Attributes
INSERT INTO public.products (
  id, name, brand, price, category, "imageUrl", images, description, "inStock", "frameShape", "frameMaterial", "frameColor", gender, "isBestSeller", "isSale", "isNew", rating, reviews, is_hidden
) VALUES (
  gen_random_uuid(), 
  'Screen Savior Elite', 
  'Felix Gray', 
  110.00, 
  'blue-light', 
  'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&q=80', 
  '["https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&q=80","https://images.unsplash.com/photo-1512686850893-96b0266e744d?w=600&q=80","https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80"]', 
  'Advanced blue light blocking technology for long work hours.', 
  true, 
  'square', 
  'Acetate', 
  'Clear', 
  'unisex', 
  true, 
  false, 
  false, 
  4.8, 
  145, 
  false
);

INSERT INTO public.products (
  id, name, brand, price, category, "imageUrl", images, description, "inStock", "frameShape", "frameMaterial", "frameColor", gender, "isBestSeller", "isSale", "isNew", rating, reviews, is_hidden
) VALUES (
  gen_random_uuid(), 
  'Digital Comfort Pro', 
  'Warby Parker', 
  95.00, 
  'blue-light', 
  'https://images.unsplash.com/photo-1582142407894-ec85a1260a46?w=600&q=80', 
  '["https://images.unsplash.com/photo-1582142407894-ec85a1260a46?w=600&q=80","https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=600&q=80","https://images.unsplash.com/photo-1483412919093-03a22057d0d7?w=600&q=80"]', 
  'Stylish protection against computer screens and artificial light.', 
  true, 
  'round', 
  'Metal', 
  'Rose Gold', 
  'women', 
  false, 
  false, 
  true, 
  4.6, 
  88, 
  false
);

INSERT INTO public.products (
  id, name, brand, price, category, "imageUrl", images, description, "inStock", "frameShape", "frameMaterial", "frameColor", gender, "isBestSeller", "isSale", "isNew", rating, reviews, is_hidden
) VALUES (
  gen_random_uuid(), 
  'Gamer Focus X', 
  'Oakley', 
  135.00, 
  'blue-light', 
  'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&q=80', 
  '["https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&q=80","https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80","https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600&q=80"]', 
  'High-performance eyewear designed specifically for marathon gaming sessions.', 
  true, 
  'rectangle', 
  'TR90', 
  'Matte Black', 
  'men', 
  false, 
  true, 
  false, 
  4.9, 
  320, 
  false
);

INSERT INTO public.products (
  id, name, brand, price, category, "imageUrl", images, description, "inStock", "frameShape", "frameMaterial", "frameColor", gender, "isBestSeller", "isSale", "isNew", rating, reviews, is_hidden
) VALUES (
  gen_random_uuid(), 
  'Minimalist Blue Block', 
  'Zenni', 
  45.00, 
  'blue-light', 
  'https://images.unsplash.com/photo-1508296695146-257a814050b4?w=600&q=80', 
  '["https://images.unsplash.com/photo-1508296695146-257a814050b4?w=600&q=80","https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80","https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80"]', 
  'Simple, effective, and affordable blue light blocking glasses.', 
  true, 
  'oval', 
  'Mixed', 
  'Tortoise', 
  'unisex', 
  false, 
  false, 
  false, 
  4.5, 
  65, 
  false
);

INSERT INTO public.products (
  id, name, brand, price, category, "imageUrl", images, description, "inStock", "frameShape", "frameMaterial", "frameColor", gender, "isBestSeller", "isSale", "isNew", rating, reviews, is_hidden
) VALUES (
  gen_random_uuid(), 
  'Kids Screen Shield', 
  'Ray-Ban', 
  85.00, 
  'blue-light', 
  'https://images.unsplash.com/photo-1518349619113-03114f06124a?w=600&q=80', 
  '["https://images.unsplash.com/photo-1518349619113-03114f06124a?w=600&q=80","https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80","https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=600&q=80"]', 
  'Protect your childs eyes from harmful blue light emitted by tablets and computers.', 
  true, 
  'round', 
  'Acetate', 
  'Blue', 
  'kids', 
  false, 
  false, 
  false, 
  4.7, 
  110, 
  false
);
`;

fs.appendFileSync('seed_products.sql', sqlToAppend);
console.log('Successfully appended blue light products to seed_products.sql');
