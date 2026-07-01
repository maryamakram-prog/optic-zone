const fs = require('fs');

const sqlToAppend = `
('Screen Savior Elite', 'Felix Gray', 110.00, 'blue-light', 'unisex', 'Square', 'Acetate', 'Clear', 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&q=80', 'Advanced blue light blocking technology for long work hours.', 4.8, 145, true, false, false),
('Digital Comfort Pro', 'Warby Parker', 95.00, 'blue-light', 'women', 'Round', 'Metal', 'Rose Gold', 'https://images.unsplash.com/photo-1582142407894-ec85a1260a46?w=800&q=80', 'Stylish protection against computer screens and artificial light.', 4.6, 88, false, false, true),
('Gamer Focus X', 'Oakley', 135.00, 'blue-light', 'men', 'Rectangle', 'TR90', 'Matte Black', 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=800&q=80', 'High-performance eyewear designed specifically for marathon gaming sessions.', 4.9, 320, false, true, false),
('Minimalist Blue Block', 'Zenni', 45.00, 'blue-light', 'unisex', 'Oval', 'Mixed', 'Tortoise', 'https://images.unsplash.com/photo-1508296695146-257a814050b4?w=800&q=80', 'Simple, effective, and affordable blue light blocking glasses.', 4.5, 65, false, false, false),
('Kids Screen Shield', 'Ray-Ban', 85.00, 'blue-light', 'kids', 'Round', 'Acetate', 'Blue', 'https://images.unsplash.com/photo-1518349619113-03114f06124a?w=800&q=80', 'Protect your childs eyes from harmful blue light emitted by tablets and computers.', 4.7, 110, false, false, false);
`;

let content = fs.readFileSync('supabase_seed_products.sql', 'utf8');
content = content.replace(/;\s*$/, ',\n' + sqlToAppend.trim() + ';\n');
fs.writeFileSync('supabase_seed_products.sql', content);
console.log('Successfully appended blue light products to supabase_seed_products.sql');
