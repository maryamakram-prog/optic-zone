const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Match "Rs. " or "Rs." or "Rs " or "Rs" followed by a space or number
  // It's safer to just replace "Rs. " with "$" and "Rs." with "$" and "Rs " with "$"
  let newContent = content.replace(/Rs\.\s*/g, '$').replace(/Rs\s*/g, '$');
  
  // Actually wait, 'Rs' might match words? No, it's case sensitive and we have spaces usually.
  // Better: replace /Rs\.\s?/g with '$' and /Rs\s/g with '$'
  // But let's only replace inside the specific files we found.
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated ' + filePath);
  }
}

const files = [
  'components/ProductCard.js',
  'app/product/[id]/page.js',
  'app/cart/page.js',
  'app/checkout/page.js',
  'app/admin/products/page.js',
  'app/admin/lens-price-list/page.js',
  'app/admin/lens-discounts/page.js',
  'app/admin/lenses/page.js',
  'app/account/orders/page.js'
];

files.forEach(f => {
  const fullPath = path.join(__dirname, f);
  if (fs.existsSync(fullPath)) {
    replaceInFile(fullPath);
  } else {
    console.log('Not found: ' + fullPath);
  }
});
