const fs = require('fs');

const path = './data/siteData.js';
let content = fs.readFileSync(path, 'utf8');

let i = 0;

// Replace the previous real-contact images with the new color-contact images
for (let j = 1; j <= 4; j++) {
  content = content.replace(new RegExp(`/images/real-contact-${j}\\.png`, 'g'), () => {
    const colorId = (i % 5) + 1;
    i++;
    return `/images/color-contact-${colorId}.png`;
  });
}

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed colored lenses in siteData.js');
