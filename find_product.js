const fs = require('fs');
const content = fs.readFileSync('data/siteData.js', 'utf8');
const regex = /export const products = (\[[\s\S]*?\]);/;
const match = content.match(regex);
if (match) {
  const products = eval(match[1]);
  const found = products.filter(p => p.name.toLowerCase().includes('compact foldables') || p.name.toLowerCase().includes('compact') || p.name.toLowerCase().includes('foldables'));
  console.log('Found:', found.map(p => p.name));
}
