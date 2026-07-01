const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = fs.readFileSync('.env', 'utf8').split('\n').reduce((a, l) => {
  const [k, ...v] = l.split('=');
  if (k && v) a[k.trim()] = v.join('=').trim();
  return a;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const knownGood = [
  'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80',
  'https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80',
  'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80',
  'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&q=80',
  'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=600&q=80',
  'https://images.unsplash.com/photo-1512686850893-96b0266e744d?w=600&q=80',
  'https://images.unsplash.com/photo-1582142407894-ec85a1260a46?w=600&q=80'
];

async function validateAndFixImages() {
  const content = fs.readFileSync('data/siteData.js', 'utf8');
  const match = content.match(/export const products = (\[[\s\S]*?\]);/);
  if (!match) return;
  const products = eval(match[1]);

  const uniqueUrls = new Set();
  products.forEach(p => {
    if (p.imageUrl) uniqueUrls.add(p.imageUrl);
    if (p.image) uniqueUrls.add(p.image);
    if (p.images) p.images.forEach(img => uniqueUrls.add(img));
  });

  const brokenUrls = new Set();
  console.log(`Checking ${uniqueUrls.size} unique URLs from siteData...`);
  
  for (const url of uniqueUrls) {
    if (!url.startsWith('http')) continue;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.log('Broken URL found:', url, res.status);
        brokenUrls.add(url);
      }
    } catch (e) {
      console.log('Failed to fetch:', url, e.message);
      brokenUrls.add(url);
    }
  }

  // Also check database
  const { data: dbProducts } = await supabase.from('products').select('*');
  const dbBrokenProducts = [];
  
  if (dbProducts) {
    for (const p of dbProducts) {
      let isBroken = false;
      const urlsToCheck = [p.imageUrl, ...(p.images || [])].filter(Boolean);
      for (const url of urlsToCheck) {
        if (!url.startsWith('http')) continue;
        if (brokenUrls.has(url)) {
          isBroken = true;
          break;
        }
        if (!uniqueUrls.has(url)) {
          uniqueUrls.add(url);
          try {
            const res = await fetch(url);
            if (!res.ok) {
              console.log('Broken URL found in DB:', url, res.status);
              brokenUrls.add(url);
              isBroken = true;
            }
          } catch (e) {
            console.log('Failed to fetch in DB:', url, e.message);
            brokenUrls.add(url);
            isBroken = true;
          }
        }
      }
      if (isBroken) {
        dbBrokenProducts.push(p);
      }
    }
  }

  if (brokenUrls.size > 0 || dbBrokenProducts.length > 0) {
    // 1. Fix siteData.js
    let newContent = content;
    const replacements = new Map();
    
    brokenUrls.forEach(badUrl => {
      const goodUrl = knownGood[Math.floor(Math.random() * knownGood.length)];
      replacements.set(badUrl, goodUrl);
      newContent = newContent.split(badUrl).join(goodUrl);
      const bad800 = badUrl.replace('w=600', 'w=800');
      const good800 = goodUrl.replace('w=600', 'w=800');
      newContent = newContent.split(bad800).join(good800);
    });

    fs.writeFileSync('data/siteData.js', newContent);
    console.log(`Replaced ${brokenUrls.size} broken URLs in siteData.js`);

    // 2. Fix Database
    for (const p of dbBrokenProducts) {
      const newImageUrl = replacements.has(p.imageUrl) ? replacements.get(p.imageUrl) : p.imageUrl;
      const newImages = (p.images || []).map(img => replacements.has(img) ? replacements.get(img) : img);
      
      // fill up images array to 3 if it's missing
      while (newImages.length < 3) {
        newImages.push(knownGood[Math.floor(Math.random() * knownGood.length)]);
      }

      await supabase
        .from('products')
        .update({ imageUrl: newImageUrl, images: newImages })
        .eq('id', p.id);
      
      console.log(`Fixed images for DB product: ${p.name}`);
    }
    console.log('All DB products fixed!');
  } else {
    console.log('All images are working properly across siteData and Database!');
  }
}

validateAndFixImages();
