const fs = require('fs');

const path = './data/siteData.js';
let content = fs.readFileSync(path, 'utf8');

let i = 0;
const colors = ['blue', 'purple', 'green', 'orange', 'teal'];

// Replace the previous SVGs with the new real photos
colors.forEach(color => {
  content = content.replace(new RegExp(`/images/contact-lens-${color}\\.svg`, 'g'), () => {
    const realImgId = (i % 4) + 1;
    i++;
    return `/images/real-contact-${realImgId}.png`;
  });
});

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed realistic images in siteData.js');
