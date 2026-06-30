const fs = require('fs');

const path = './data/siteData.js';
let content = fs.readFileSync(path, 'utf8');

let i = 0;

// Since we previously mapped to 1-5, we'll just randomly (or sequentially) update them to use 1-13.
for (let j = 1; j <= 5; j++) {
  // Let's just find occurrences of color-contact-1...5 and expand the randomness
  // Wait, the previous script replaced real-contact-1...4 with color-contact-1...5.
  // Now we have many instances of color-contact-X.png.
  // We can just find all instances of `/images/color-contact-\\d+\\.png` and replace with 1..13.
}

// Actually it's easier to just use regex:
content = content.replace(/\/images\/color-contact-\d+\.png/g, () => {
  const colorId = (i % 13) + 1;
  i++;
  return `/images/color-contact-${colorId}.png`;
});

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed 13 colored lenses in siteData.js');
