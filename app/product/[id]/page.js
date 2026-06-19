'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function Stars({ rating, size = 16 }) {
  return (
    <span className="">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= Math.floor(rating) ? '#FBBF24' : 'none'} stroke="#FBBF24" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </span>
  );
}

const LENS_PACKAGES = [
  { id: 'standard', label: 'Standard Clear', desc: 'Single vision, anti-scratch', price: 0 },
  { id: 'bluelight', label: 'Blue Light Blocking', desc: 'Reduces eye strain from screens', price: 29 },
  { id: 'prescription', label: 'Prescription', desc: 'Enter your Rx during checkout', price: 49 },
  { id: 'progressive', label: 'Progressive', desc: 'No-line bifocal lenses', price: 99 },
];

function GlassesIcon({ color = '#2563EB', accent = '#0ea5e9' }) {
  return (
    <svg viewBox="0 0 340 130" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id={`fg-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color}/><stop offset="100%" stopColor={accent}/>
        </linearGradient>
        <linearGradient id={`lg-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.15"/><stop offset="100%" stopColor={accent} stopOpacity="0.05"/>
        </linearGradient>
      </defs>
      <ellipse cx="92" cy="65" rx="70" ry="50" fill={`url(#lg-${color})`} stroke={`url(#fg-${color})`} strokeWidth="5"/>
      <ellipse cx="248" cy="65" rx="70" ry="50" fill={`url(#lg-${color})`} stroke={`url(#fg-${color})`} strokeWidth="5"/>
      <path d="M162 60 Q170 48 178 60" stroke={`url(#fg-${color})`} strokeWidth="4.5" fill="none" strokeLinecap="round"/>
      <line x1="22" y1="42" x2="4" y2="55" stroke={`url(#fg-${color})`} strokeWidth="4" strokeLinecap="round"/>
      <line x1="318" y1="42" x2="336" y2="55" stroke={`url(#fg-${color})`} strokeWidth="4" strokeLinecap="round"/>
    </svg>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const { products, reviews, toggleWishlist, wishlist, addRecentlyViewed, addReview } = useStore();
  const { addItem } = useCart();
  const router = useRouter();
  const [selectedLens, setSelectedLens] = useState('standard');
  const [selectedColor, setSelectedColor] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', body: '', user: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [added, setAdded] = useState(false);

  const product = products.find(p => p.id === parseInt(params.id));

  useEffect(() => {
    if (product) addRecentlyViewed(product.id);
  }, [product?.id]);

  if (!product) {
    return <div className=""><p>Product not found.</p></div>;
  }

  const productReviews = reviews.filter(r => r.productId === product.id);
  const lensPackage = LENS_PACKAGES.find(l => l.id === selectedLens);
  const totalPrice = product.price + (lensPackage?.price || 0);
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  const inWishlist = wishlist.includes(product.id);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addItem({ ...product, price: totalPrice, lensPackage: selectedLens });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem({ ...product, price: totalPrice, lensPackage: selectedLens });
    router.push('/checkout');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    addReview({ ...reviewForm, productId: product.id, verified: false });
    setReviewForm({ rating: 5, title: '', body: '', user: '' });
    setShowReviewForm(false);
  };

  return (
    <div className="">
      <div className="">
        <Link href="/">Home</Link> / <Link href={`/products/${product.category}`} style={{textTransform:'capitalize'}}>{product.category}</Link> / {product.name}
      </div>

      <div className="">
        {/* Gallery */}
        <div className="">
          <div className="">
            {product.isBestSeller && <span className="">Best Seller</span>}
            {product.isSale && discount > 0 && <span className="">-{discount}%</span>}
            {product.isNew && <span className="">New</span>}
            <div className="">
              <GlassesIcon color={product.colors?.[selectedColor] || '#2563EB'} accent="#0ea5e9" />
            </div>
          </div>
          <div className="">
            {(product.colors || []).map((c, i) => (
              <button key={i} className={`${""} ${selectedColor === i ? "" : ''}`} onClick={() => setSelectedColor(i)} style={{ background: c }} aria-label={`Color ${i+1}`}/>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="">
          <div className="">
            <span className="">{product.brand}</span>
            <button className={`${""} ${inWishlist ? "" : ''}`} onClick={() => toggleWishlist(product.id)} aria-label="Wishlist">
              <svg width="22" height="22" viewBox="0 0 24 24" fill={inWishlist ? 'var(--danger)' : 'none'} stroke={inWishlist ? 'var(--danger)' : 'currentColor'} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>

          <h1 className="">{product.name}</h1>

          <div className="">
            <Stars rating={product.rating} />
            <span className="">{product.rating}</span>
            <span className="">({product.reviews.toLocaleString()} reviews)</span>
          </div>

          <div className="">
            <span className="">${totalPrice}</span>
            {product.originalPrice > product.price && <span className="">${product.originalPrice}</span>}
            {discount > 0 && <span className="">Save {discount}%</span>}
          </div>

          <p className="">{product.description}</p>

          {/* Specs */}
          <div className="">
            {[
              ['Frame Color', product.frameColor],
              ['Lens Color', product.lensColor],
              ['Frame Shape', product.frameShape],
              ['Material', product.frameMaterial],
              ['Gender', product.gender],
            ].map(([k, v]) => v && (
              <div key={k} className="">
                <span className="">{k}</span>
                <span className="" style={{textTransform:'capitalize'}}>{v}</span>
              </div>
            ))}
          </div>

          {/* Lens package */}
          <div className="">
            <h3 className="">Lens Package</h3>
            <div className="">
              {LENS_PACKAGES.map(pkg => (
                <button key={pkg.id} className={`${""} ${selectedLens === pkg.id ? "" : ''}`} onClick={() => setSelectedLens(pkg.id)}>
                  <span className="">{pkg.label}</span>
                  <span className="">{pkg.desc}</span>
                  <span className="">{pkg.price === 0 ? 'Included' : `+$${pkg.price}`}</span>
                </button>
              ))}
            </div>
            <div className="">
              <Link href="/frame-size-guide">📏 Frame Size Guide</Link>
              <Link href="/face-shape-guide">😊 Face Shape Guide</Link>
            </div>
          </div>

          {/* CTA */}
          <div className="">
            <button className={`${""} ${added ? "" : ''}`} onClick={handleAddToCart}>
              {added ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>
            <button className="" onClick={handleBuyNow}>Buy Now</button>
          </div>

          {/* Trust */}
          <div className="">
            <span>🚚 Free shipping over $99</span>
            <span>↩️ 30-day returns</span>
            <span>🔒 Secure checkout</span>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="">
          <h2 className="">You May Also Like</h2>
          <div className="">
            {related.map(p => (
              <Link key={p.id} href={`/product/${p.id}`} className="">
                <div className=""><GlassesIcon color={p.colors?.[0] || '#2563EB'} accent="#0ea5e9" /></div>
                <div className="">{p.name}</div>
                <div className="">{p.brand}</div>
                <div className="">${p.price}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="">
        <div className="">
          <h2 className="">Customer Reviews ({productReviews.length})</h2>
          <button className="" onClick={() => setShowReviewForm(!showReviewForm)}>Write a Review</button>
        </div>

        {showReviewForm && (
          <form className="" onSubmit={handleReviewSubmit}>
            <div className="">
              <input className="" placeholder="Your name" required value={reviewForm.user} onChange={e => setReviewForm({...reviewForm, user: e.target.value})} />
              <input className="" placeholder="Review title" required value={reviewForm.title} onChange={e => setReviewForm({...reviewForm, title: e.target.value})} />
            </div>
            <div className="">
              {[5,4,3,2,1].map(r => (
                <label key={r} className="">
                  <input type="radio" name="rating" value={r} checked={reviewForm.rating === r} onChange={() => setReviewForm({...reviewForm, rating: r})} />
                  {'★'.repeat(r)}
                </label>
              ))}
            </div>
            <textarea className="" placeholder="Share your experience..." rows={4} required value={reviewForm.body} onChange={e => setReviewForm({...reviewForm, body: e.target.value})} />
            <button type="submit" className="">Submit Review</button>
          </form>
        )}

        <div className="">
          {productReviews.length === 0 ? (
            <p className="">No reviews yet. Be the first!</p>
          ) : productReviews.map(r => (
            <div key={r.id} className="">
              <div className="">
                <Stars rating={r.rating} size={14} />
                <span className="">{r.user}</span>
                {r.verified && <span className="">✓ Verified Purchase</span>}
                <span className="">{new Date(r.date).toLocaleDateString()}</span>
              </div>
              <div className="">{r.title}</div>
              <div className="">{r.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
