const fs = require('fs');

const path = './data/siteData.js';
let content = fs.readFileSync(path, 'utf8');

let i = 0;
const colors = ['blue', 'purple', 'green', 'orange', 'teal'];

content = content.replace(/\/images\/contact-lens\.svg/g, () => {
  const c = colors[i % colors.length];
  i++;
  return `/images/contact-lens-${c}.svg`;
});

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed diverse images in siteData.js');
