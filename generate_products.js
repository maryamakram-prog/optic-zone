const fs = require('fs');
const crypto = require('crypto');

// Data arrays for generation
const brands = ['Ray-Ban', 'Oakley', 'Gucci', 'Prada', 'Tom Ford', 'Persol', 'Oliver Peoples', 'Warby Parker', 'Zenni', 'Carrera', 'Maui Jim', 'Costa'];
const contactBrands = ['Acuvue', 'Biofinity', 'Dailies', 'Air Optix', 'Bausch + Lomb', 'Alcon', 'Coopervision'];

const adjectives = ['Classic', 'Modern', 'Retro', 'Vintage', 'Elite', 'Pro', 'Ultra', 'Essential', 'Premium', 'Minimalist', 'Bold', 'Sleek'];
const nouns = ['Aviator', 'Wayfarer', 'Clubmaster', 'Round', 'Square', 'Shield', 'Cat-Eye', 'Rectangle', 'Geometric', 'Browline'];

const frameShapes = ['round', 'square', 'aviator', 'cat-eye', 'rectangle', 'oval', 'geometric'];
const frameMaterials = ['Acetate', 'Metal', 'Titanium', 'TR90', 'Mixed', 'Wood'];
const frameColors = ['Black', 'Tortoise', 'Gold', 'Silver', 'Clear', 'Blue', 'Red', 'Green', 'Gunmetal', 'Rose Gold'];
const genders = ['men', 'women', 'kids', 'unisex'];
const contactTypes = ['daily', 'monthly', 'color', 'toric', 'multifocal'];

// Curated Unsplash images based on category
const eyeglassesImages = [
  'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80',
  'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=600&q=80',
  'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&q=80',
  'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80',
  'https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80',
  'https://images.unsplash.com/photo-1483412919093-03a22057d0d7?w=600&q=80',
  'https://images.unsplash.com/photo-1508296695146-257a814050b4?w=600&q=80',
  'https://images.unsplash.com/photo-1512686850893-96b0266e744d?w=600&q=80'
];

const sunglassesImages = [
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
  'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80',
  'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&q=80',
  'https://images.unsplash.com/photo-1589718465924-118833139369?w=600&q=80',
  'https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80',
  'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600&q=80',
  'https://images.unsplash.com/photo-1582142407894-ec85a1260a46?w=600&q=80'
];

const contactImages = [
  'https://images.unsplash.com/photo-1574549839446-281b37b12d5f?w=600&q=80',
  'https://images.unsplash.com/photo-1574549839446-281b37b12d5f?w=600&q=80', // Using generic clear for contacts as Unsplash lacks good contacts
  'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=600&q=80'
];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePrice(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

function generateProduct(category, id) {
  const isContact = category === 'contact-lenses';
  
  let name, brand, imagesArr, shape, material, gender, type;
  
  if (isContact) {
    brand = getRandom(contactBrands);
    type = getRandom(contactTypes);
    const packs = ['30 Pack', '90 Pack', '6 Pack'];
    name = `${brand} ${getRandom(adjectives)} ${type === 'daily' ? '1-Day' : 'Month'} (${getRandom(packs)})`;
    imagesArr = [getRandom(contactImages), getRandom(contactImages), getRandom(contactImages)];
    shape = null;
    material = 'Hydrogel';
    gender = 'unisex';
  } else {
    brand = getRandom(brands);
    name = `${brand} ${getRandom(adjectives)} ${getRandom(nouns)}`;
    imagesArr = category === 'eyeglasses' 
      ? [getRandom(eyeglassesImages), getRandom(eyeglassesImages), getRandom(eyeglassesImages)]
      : [getRandom(sunglassesImages), getRandom(sunglassesImages), getRandom(sunglassesImages)];
    shape = getRandom(frameShapes);
    material = getRandom(frameMaterials);
    gender = getRandom(genders);
    type = null;
  }

  const originalPrice = (Math.random() > 0.5) ? generatePrice(150, 300) : null;
  let price = generatePrice(50, 200);
  if (originalPrice && parseFloat(price) >= parseFloat(originalPrice)) {
    price = (parseFloat(originalPrice) * 0.8).toFixed(2); // Ensure sale price is lower
  }

  const isSale = !!originalPrice;
  const isNew = Math.random() > 0.8;
  const isBestSeller = Math.random() > 0.8;

  let badge = null;
  if (isSale) badge = 'Sale';
  else if (isNew) badge = 'New';
  else if (isBestSeller) badge = 'Best Seller';
  
  return {
    id: id || crypto.randomUUID(),
    name,
    brand,
    price: parseFloat(price),
    originalPrice: originalPrice ? parseFloat(originalPrice) : null,
    rating: (Math.random() * (5 - 4) + 4).toFixed(1),
    reviews: Math.floor(Math.random() * 500) + 10,
    image: imagesArr[0],
    imageUrl: imagesArr[0],
    images: imagesArr,
    badge,
    category,
    is_hidden: false,
    frameShape: shape,
    frameMaterial: material,
    frameColor: getRandom(frameColors),
    gender,
    type,
    isSale,
    isNew,
    isBestSeller,
    description: `Experience the perfect blend of style and comfort with our ${name}. Crafted from premium materials to ensure durability and a lightweight feel for all-day wear.`
  };
}

const products = [];

// Generate 50 of each
for (let i = 0; i < 50; i++) products.push(generateProduct('eyeglasses'));
for (let i = 0; i < 50; i++) products.push(generateProduct('sunglasses'));
for (let i = 0; i < 50; i++) products.push(generateProduct('contact-lenses'));

// 1. Generate SQL File
let sqlContent = `-- Generated 150 Products for Optic Zone\n\n`;

products.forEach(p => {
  const imagesJson = JSON.stringify(p.images).replace(/'/g, "''");
  
  sqlContent += `INSERT INTO public.products (
  id, name, brand, price, category, "imageUrl", images, description, "inStock", "frameShape", "frameMaterial", "frameColor", gender, "isBestSeller", "isSale", "isNew", rating, reviews, is_hidden
) VALUES (
  '${p.id}', 
  '${p.name.replace(/'/g, "''")}', 
  '${p.brand.replace(/'/g, "''")}', 
  ${p.price}, 
  '${p.category}', 
  '${p.imageUrl}', 
  '${imagesJson}', 
  '${p.description.replace(/'/g, "''")}', 
  true, 
  ${p.frameShape ? `'${p.frameShape}'` : 'NULL'}, 
  '${p.frameMaterial}', 
  '${p.frameColor}', 
  '${p.gender}', 
  ${p.isBestSeller}, 
  ${p.isSale}, 
  ${p.isNew}, 
  ${p.rating}, 
  ${p.reviews}, 
  false
);\n`;
});

fs.writeFileSync('seed_products.sql', sqlContent);
console.log('✅ Generated seed_products.sql (150 inserts)');

// 2. Update siteData.js mock file
let siteData = fs.readFileSync('data/siteData.js', 'utf8');
const exportRegex = /export const products = \[[\s\S]*?\];/;

const productsJsString = `export const products = ${JSON.stringify(products, null, 2)};`;

if (exportRegex.test(siteData)) {
  siteData = siteData.replace(exportRegex, productsJsString);
  fs.writeFileSync('data/siteData.js', siteData);
  console.log('✅ Updated data/siteData.js with 150 products');
} else {
  console.log('❌ Could not find "export const products" block in siteData.js to replace.');
}
