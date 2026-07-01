const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env', 'utf8').split('\n').reduce((a, l) => {
  const [k, ...v] = l.split('=');
  if (k && v) a[k.trim()] = v.join('=').trim();
  return a;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const goodUrl1 = 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80';
const goodUrl2 = 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80';

async function fixImages() {
  const r1 = await supabase
    .from('products')
    .update({ 
      imageUrl: goodUrl1, 
      images: [goodUrl1, goodUrl1, 'https://images.unsplash.com/photo-1512686850893-96b0266e744d?w=600&q=80'] 
    })
    .eq('name', 'Tom Ford Classic Rectangle');
  console.log('Tom Ford update:', r1.error ? r1.error : 'Success');

  const r2 = await supabase
    .from('products')
    .update({ 
      imageUrl: goodUrl2, 
      images: [goodUrl2, 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=600&q=80', 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&q=80'] 
    })
    .eq('name', 'Maui Jim Elite Browline');
  console.log('Maui Jim update:', r2.error ? r2.error : 'Success');

  console.log('Successfully updated images in Supabase!');
}

fixImages();
