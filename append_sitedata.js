const fs = require('fs');

const siteDataPath = 'data/siteData.js';
let siteData = fs.readFileSync(siteDataPath, 'utf8');

const newProducts = [
  {
    id: "f83db5e9-80ba-4b71-9f9f-0c9f0b5d9b71",
    name: "Screen Savior Elite",
    brand: "Felix Gray",
    price: 110.00,
    originalPrice: null,
    rating: "4.8",
    reviews: 145,
    image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&q=80",
    imageUrl: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&q=80",
      "https://images.unsplash.com/photo-1512686850893-96b0266e744d?w=600&q=80",
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80"
    ],
    badge: "Best Seller",
    category: "blue-light",
    is_hidden: false,
    frameShape: "square",
    frameMaterial: "Acetate",
    frameColor: "Clear",
    gender: "unisex",
    type: null,
    isSale: false,
    isNew: false,
    isBestSeller: true,
    description: "Advanced blue light blocking technology for long work hours."
  },
  {
    id: "f83db5e9-80ba-4b71-9f9f-0c9f0b5d9b72",
    name: "Digital Comfort Pro",
    brand: "Warby Parker",
    price: 95.00,
    originalPrice: null,
    rating: "4.6",
    reviews: 88,
    image: "https://images.unsplash.com/photo-1582142407894-ec85a1260a46?w=600&q=80",
    imageUrl: "https://images.unsplash.com/photo-1582142407894-ec85a1260a46?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1582142407894-ec85a1260a46?w=600&q=80",
      "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=600&q=80",
      "https://images.unsplash.com/photo-1483412919093-03a22057d0d7?w=600&q=80"
    ],
    badge: "New",
    category: "blue-light",
    is_hidden: false,
    frameShape: "round",
    frameMaterial: "Metal",
    frameColor: "Rose Gold",
    gender: "women",
    type: null,
    isSale: false,
    isNew: true,
    isBestSeller: false,
    description: "Stylish protection against computer screens and artificial light."
  },
  {
    id: "f83db5e9-80ba-4b71-9f9f-0c9f0b5d9b73",
    name: "Gamer Focus X",
    brand: "Oakley",
    price: 135.00,
    originalPrice: 160.00,
    rating: "4.9",
    reviews: 320,
    image: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&q=80",
    imageUrl: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600&q=80"
    ],
    badge: "Sale",
    category: "blue-light",
    is_hidden: false,
    frameShape: "rectangle",
    frameMaterial: "TR90",
    frameColor: "Matte Black",
    gender: "men",
    type: null,
    isSale: true,
    isNew: false,
    isBestSeller: false,
    description: "High-performance eyewear designed specifically for marathon gaming sessions."
  },
  {
    id: "f83db5e9-80ba-4b71-9f9f-0c9f0b5d9b74",
    name: "Minimalist Blue Block",
    brand: "Zenni",
    price: 45.00,
    originalPrice: null,
    rating: "4.5",
    reviews: 65,
    image: "https://images.unsplash.com/photo-1508296695146-257a814050b4?w=600&q=80",
    imageUrl: "https://images.unsplash.com/photo-1508296695146-257a814050b4?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1508296695146-257a814050b4?w=600&q=80",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80",
      "https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80"
    ],
    badge: null,
    category: "blue-light",
    is_hidden: false,
    frameShape: "oval",
    frameMaterial: "Mixed",
    frameColor: "Tortoise",
    gender: "unisex",
    type: null,
    isSale: false,
    isNew: false,
    isBestSeller: false,
    description: "Simple, effective, and affordable blue light blocking glasses."
  },
  {
    id: "f83db5e9-80ba-4b71-9f9f-0c9f0b5d9b75",
    name: "Kids Screen Shield",
    brand: "Ray-Ban",
    price: 85.00,
    originalPrice: null,
    rating: "4.7",
    reviews: 110,
    image: "https://images.unsplash.com/photo-1518349619113-03114f06124a?w=600&q=80",
    imageUrl: "https://images.unsplash.com/photo-1518349619113-03114f06124a?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1518349619113-03114f06124a?w=600&q=80",
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80",
      "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=600&q=80"
    ],
    badge: null,
    category: "blue-light",
    is_hidden: false,
    frameShape: "round",
    frameMaterial: "Acetate",
    frameColor: "Blue",
    gender: "kids",
    type: null,
    isSale: false,
    isNew: false,
    isBestSeller: false,
    description: "Protect your childs eyes from harmful blue light emitted by tablets and computers."
  }
];

// We need to inject these new products into the export const products array
const regex = /export const products = \[([\s\S]*?)\];/;
const match = siteData.match(regex);
if (match) {
  let existingArrayBody = match[1].trim();
  if (existingArrayBody.endsWith(',')) {
    existingArrayBody = existingArrayBody.slice(0, -1);
  }
  
  const newProductsStr = JSON.stringify(newProducts, null, 2);
  const newProductsBody = newProductsStr.substring(1, newProductsStr.length - 1).trim();
  
  const updatedArrayStr = `export const products = [\n${existingArrayBody},\n${newProductsBody}\n];`;
  siteData = siteData.replace(regex, updatedArrayStr);
  fs.writeFileSync(siteDataPath, siteData);
  console.log('Successfully added blue light products to siteData.js');
} else {
  console.log('Could not find products array in siteData.js');
}
