const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = fs.readFileSync('.env', 'utf8').split('\n').reduce((a, l) => {
  const [k, ...v] = l.split('=');
  if (k && v) a[k.trim()] = v.join('=').trim();
  return a;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const knownGood = [
  'https://images.unsplash.com/photo-1511499767150-a48a237f0083',
  'https://images.unsplash.com/photo-1577803645773-f96470509666',
  'https://images.unsplash.com/photo-1574258495973-f010dfbb5371',
  'https://images.unsplash.com/photo-1591076482161-42ce6da69f67',
  'https://images.unsplash.com/photo-1509695507497-903c140c43b0',
  'https://images.unsplash.com/photo-1512686850893-96b0266e744d',
  'https://images.unsplash.com/photo-1582142407894-ec85a1260a46'
];

function getRandomImages() {
  const shuffled = [...knownGood].sort(() => 0.5 - Math.random());
  return [
    shuffled[0] + '?w=600&q=80',
    shuffled[1] + '?w=600&q=80',
    shuffled[2] + '?w=600&q=80'
  ];
}

async function forceFix() {
  // 1. Fix siteData.js
  const content = fs.readFileSync('data/siteData.js', 'utf8');
  const match = content.match(/export const products = (\[[\s\S]*?\]);/);
  if (match) {
    const products = eval(match[1]);
    products.forEach(p => {
      const newImgs = getRandomImages();
      p.imageUrl = newImgs[0];
      p.image = newImgs[0];
      p.images = newImgs;
    });
    
    const productsJSON = products.map(p => JSON.stringify(p, null, 2)).join(',\n  ');
    const newContent = content.replace(/export const products = \[[\s\S]*?\];/, `export const products = [\n  ${productsJSON}\n];`);
    fs.writeFileSync('data/siteData.js', newContent);
    console.log('Fixed siteData.js');
  }

  // 2. Fix Database
  const { data: dbProducts } = await supabase.from('products').select('*');
  if (dbProducts) {
    for (const p of dbProducts) {
      const newImgs = getRandomImages();
      await supabase
        .from('products')
        .update({ imageUrl: newImgs[0], images: newImgs })
        .eq('id', p.id);
    }
    console.log(`Fixed ${dbProducts.length} products in Supabase.`);
  }
}

forceFix();
