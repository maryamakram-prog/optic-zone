const fs = require('fs');
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

async function main() {
  console.log('Deleting "Gamer Shield Optics"...');
  const { data: gamerProducts, error: fetchErr } = await supabase
    .from('products')
    .select('id')
    .ilike('name', '%Gamer Shield Optics%');

  if (fetchErr) {
    console.error('Error fetching Gamer Shield Optics:', fetchErr);
  } else if (gamerProducts && gamerProducts.length > 0) {
    const ids = gamerProducts.map(p => p.id);
    const { error: delErr } = await supabase
      .from('products')
      .delete()
      .in('id', ids);
    if (delErr) {
      console.error('Error deleting:', delErr);
    } else {
      console.log('Successfully deleted Gamer Shield Optics.');
    }
  } else {
    console.log('No Gamer Shield Optics found in Supabase.');
  }

  const newBlueLightProducts = [
    {
      name: 'Screen Savior Elite',
      brand: 'Felix Gray',
      price: 110.00,
      category: 'blue-light',
      imageUrl: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&q=80',
        'https://images.unsplash.com/photo-1512686850893-96b0266e744d?w=600&q=80',
        'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80'
      ],
      description: 'Advanced blue light blocking technology for long work hours.',
      inStock: true,
      frameShape: 'square',
      frameMaterial: 'Acetate',
      frameColor: 'Clear',
      gender: 'unisex',
      isBestSeller: true,
      rating: 4.8,
      reviews: 145,
      is_hidden: false
    },
    {
      name: 'Digital Comfort Pro',
      brand: 'Warby Parker',
      price: 95.00,
      category: 'blue-light',
      imageUrl: 'https://images.unsplash.com/photo-1582142407894-ec85a1260a46?w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1582142407894-ec85a1260a46?w=600&q=80',
        'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=600&q=80',
        'https://images.unsplash.com/photo-1483412919093-03a22057d0d7?w=600&q=80'
      ],
      description: 'Stylish protection against computer screens and artificial light.',
      inStock: true,
      frameShape: 'round',
      frameMaterial: 'Metal',
      frameColor: 'Rose Gold',
      gender: 'women',
      isNew: true,
      rating: 4.6,
      reviews: 88,
      is_hidden: false
    },
    {
      name: 'Gamer Focus X',
      brand: 'Oakley',
      price: 135.00,
      category: 'blue-light',
      imageUrl: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&q=80',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
        'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600&q=80'
      ],
      description: 'High-performance eyewear designed specifically for marathon gaming sessions.',
      inStock: true,
      frameShape: 'rectangle',
      frameMaterial: 'TR90',
      frameColor: 'Matte Black',
      gender: 'men',
      isSale: true,
      originalPrice: 160.00,
      rating: 4.9,
      reviews: 320,
      is_hidden: false
    },
    {
      name: 'Minimalist Blue Block',
      brand: 'Zenni',
      price: 45.00,
      category: 'blue-light',
      imageUrl: 'https://images.unsplash.com/photo-1508296695146-257a814050b4?w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1508296695146-257a814050b4?w=600&q=80',
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80',
        'https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80'
      ],
      description: 'Simple, effective, and affordable blue light blocking glasses.',
      inStock: true,
      frameShape: 'oval',
      frameMaterial: 'Mixed',
      frameColor: 'Tortoise',
      gender: 'unisex',
      rating: 4.5,
      reviews: 65,
      is_hidden: false
    },
    {
      name: 'Kids Screen Shield',
      brand: 'Ray-Ban',
      price: 85.00,
      category: 'blue-light',
      imageUrl: 'https://images.unsplash.com/photo-1518349619113-03114f06124a?w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1518349619113-03114f06124a?w=600&q=80',
        'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80',
        'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=600&q=80'
      ],
      description: 'Protect your childs eyes from harmful blue light emitted by tablets and computers.',
      inStock: true,
      frameShape: 'round',
      frameMaterial: 'Acetate',
      frameColor: 'Blue',
      gender: 'kids',
      rating: 4.7,
      reviews: 110,
      is_hidden: false
    }
  ];

  console.log('Inserting new blue light products...');
  const { data: insertData, error: insertErr } = await supabase
    .from('products')
    .insert(newBlueLightProducts);

  if (insertErr) {
    console.error('Error inserting new blue light products:', insertErr);
  } else {
    console.log('Successfully inserted new blue light products.');
  }
}

main();
