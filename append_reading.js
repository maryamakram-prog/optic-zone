const fs = require('fs');

const generateReadingGlasses = () => {
  const products = [];
  const brands = ['Foster Grant', 'Peepers', 'ThinOptics', 'CliC', 'Readers.com', 'EyeBuyDirect', 'Zenni'];
  const frameShapes = ['Round', 'Square', 'Rectangle', 'Oval', 'Cat-Eye'];
  const frameColors = ['Black', 'Tortoise', 'Clear', 'Blue', 'Red', 'Gunmetal', 'Gold', 'Silver'];
  const materials = ['Acetate', 'Metal', 'TR90', 'Mixed'];
  
  const imagesPool = [
    'https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80',
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80',
    'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80',
    'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&q=80',
    'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=600&q=80'
  ];

  for (let i = 0; i < 25; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const shape = frameShapes[Math.floor(Math.random() * frameShapes.length)];
    const color = frameColors[Math.floor(Math.random() * frameColors.length)];
    const material = materials[Math.floor(Math.random() * materials.length)];
    
    // Choose 3 random images
    const images = [...imagesPool].sort(() => 0.5 - Math.random()).slice(0, 3);
    
    const price = Math.floor(Math.random() * 50) + 15 + 0.99; // 15.99 to 64.99
    
    products.push({
      id: `reading-${Date.now()}-${i}`,
      name: `${brand} ${color} ${shape} Reader ${i+1}`,
      brand: brand,
      price: price,
      originalPrice: price + 20,
      rating: (Math.random() * 1 + 4).toFixed(1), // 4.0 to 5.0
      reviews: Math.floor(Math.random() * 200) + 10,
      image: images[0],
      imageUrl: images[0],
      images: images,
      badge: Math.random() > 0.7 ? 'New' : null,
      category: 'reading',
      is_hidden: false,
      frameShape: shape.toLowerCase(),
      frameMaterial: material,
      frameColor: color,
      gender: Math.random() > 0.5 ? 'unisex' : (Math.random() > 0.5 ? 'men' : 'women'),
      isSale: Math.random() > 0.8,
      isNew: Math.random() > 0.8,
      description: `High-quality reading glasses featuring a comfortable ${material.toLowerCase()} frame and stylish ${shape.toLowerCase()} design. Perfect for everyday reading.`
    });
  }
  return products;
};

const content = fs.readFileSync('data/siteData.js', 'utf8');

// 1. Inject Category if missing
let newContent = content;
if (!newContent.includes("slug: 'reading'")) {
  const newCategory = `  {
    id: 7,
    name: 'Reading Glasses',
    slug: 'reading',
    image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80', 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80'],
    count: 25,
  },`;
  // find the end of the categories array
  newContent = newContent.replace(/];\s*export const products =/, `\n${newCategory}\n];\n\nexport const products =`);
}

// 2. Inject Products
const readingProducts = generateReadingGlasses();
const productsJSON = readingProducts.map(p => JSON.stringify(p, null, 2)).join(',\n  ');

newContent = newContent.replace(/export const products = \[/, `export const products = [\n  ${productsJSON},`);

fs.writeFileSync('data/siteData.js', newContent);
console.log('Appended 25 reading products and category to siteData.js');
