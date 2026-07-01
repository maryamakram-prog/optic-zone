const fs = require('fs');
const content = fs.readFileSync('data/siteData.js', 'utf8');
const regex = /export const products = (\[[\s\S]*?\]);/;
const match = content.match(regex);
if (match) {
  const products = eval(match[1]);
  const withoutFilters = products.filter(p => !p.frameShape || !p.frameMaterial || !p.frameColor || !p.gender);
  
  const categories = {};
  withoutFilters.forEach(p => {
    categories[p.category] = (categories[p.category] || 0) + 1;
  });
  console.log('Missing filters by category:', categories);
}
