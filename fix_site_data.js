const fs = require('fs');

const path = './data/siteData.js';
let content = fs.readFileSync(path, 'utf8');

// The file exports `staticProducts`, `staticCoupons`, `staticReviews`.
// It's formatted as `export const staticProducts = [...]`.
// We can use a simple regex to replace the dog and broken image URLs with the SVG in the entire file.

const badImage1 = 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=600&q=80';
const badImage2 = 'https://images.unsplash.com/photo-1574549839446-281b37b12d5f?w=600&q=80';

// Also we should probably just replace ALL images for contact-lenses
// Actually, let's just do a string replace for these specific bad URLs to be safe.
content = content.replace(new RegExp(badImage1.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), '/images/contact-lens.svg');
content = content.replace(new RegExp(badImage2.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), '/images/contact-lens.svg');

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed bad images in siteData.js');
