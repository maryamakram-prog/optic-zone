const fs = require('fs');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

// Parse .env manually
const envVars = fs.readFileSync('.env', 'utf8').split('\n').reduce((acc, line) => {
  const [key, ...value] = line.split('=');
  if (key && value) acc[key.trim()] = value.join('=').trim();
  return acc;
}, {});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
  'https://images.unsplash.com/photo-1574549839446-281b37b12d5f?w=600&q=80',
  'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=600&q=80'
];

function getRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function generatePrice(min, max) { return (Math.random() * (max - min) + min).toFixed(2); }

function generateProduct(category) {
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
    price = (parseFloat(originalPrice) * 0.8).toFixed(2);
  }

  const isSale = !!originalPrice;
  const isNew = Math.random() > 0.8;
  const isBestSeller = Math.random() > 0.8;
  
  return {
    id: crypto.randomUUID(),
    name,
    brand,
    price: parseFloat(price),
    category,
    imageUrl: imagesArr[0],
    description: `Experience the perfect blend of style and comfort with our ${name}. Crafted from premium materials to ensure durability and a lightweight feel for all-day wear.`,
    inStock: true,
    frameShape: shape,
    frameMaterial: material,
    frameColor: getRandom(frameColors),
    gender,
    isBestSeller,
    isSale,
    isNew,
    rating: parseFloat((Math.random() * (5 - 4) + 4).toFixed(1)),
    reviews: Math.floor(Math.random() * 500) + 10,
    is_hidden: false
  };
}

async function uploadToDB() {
  const products = [];
  for (let i = 0; i < 50; i++) products.push(generateProduct('eyeglasses'));
  for (let i = 0; i < 50; i++) products.push(generateProduct('sunglasses'));
  for (let i = 0; i < 50; i++) products.push(generateProduct('contact-lenses'));

  console.log('Inserting 150 products into Supabase (excluding "images" array for schema compatibility)...');
  
  // Insert in batches of 50
  for (let i = 0; i < products.length; i += 50) {
    const batch = products.slice(i, i + 50);
    const { data, error } = await supabase.from('products').insert(batch);
    if (error) {
      console.error('Error inserting batch:', error);
      return;
    }
  }
  
  console.log('✅ Successfully inserted 150 products into Supabase database!');
}

uploadToDB();
