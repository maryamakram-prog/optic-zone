const fs = require('fs');
const content = fs.readFileSync('data/siteData.js', 'utf8');
const regex = /export const products = (\[[\s\S]*?\]);/;
const match = content.match(regex);
if (match) {
  const products = eval(match[1]);
  const found = products.filter(p => p.name.toLowerCase().includes('tom ford') || p.name.toLowerCase().includes('rectangle black'));
  console.log('Found in siteData:', found.map(p => p.name));
}

const seedSql = fs.readFileSync('supabase_seed_products.sql', 'utf8');
const lines = seedSql.split('\n');
const foundSql = lines.filter(l => l.toLowerCase().includes('tom ford') || l.toLowerCase().includes('rectangle black'));
console.log('Found in SQL:', foundSql);
