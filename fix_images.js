const fs = require('fs');
let content = fs.readFileSync('data/siteData.js', 'utf8');

const badUrl1 = 'https://images.unsplash.com/photo-1483412919093-03a22057d0d7?w=600&q=80';
const goodUrl1 = 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80';

const badUrl2 = 'https://images.unsplash.com/photo-1508296695146-257a814050b4?w=600&q=80';
const goodUrl2 = 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80';

// Also check for the 800w versions just in case
const badUrl1_800 = 'https://images.unsplash.com/photo-1483412919093-03a22057d0d7?w=800&q=80';
const goodUrl1_800 = 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80';

const badUrl2_800 = 'https://images.unsplash.com/photo-1508296695146-257a814050b4?w=800&q=80';
const goodUrl2_800 = 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=80';

content = content.split(badUrl1).join(goodUrl1);
content = content.split(badUrl2).join(goodUrl2);
content = content.split(badUrl1_800).join(goodUrl1_800);
content = content.split(badUrl2_800).join(goodUrl2_800);

fs.writeFileSync('data/siteData.js', content);
console.log('Replaced bad URLs with good URLs in siteData.js');
