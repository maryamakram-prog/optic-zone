'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

function Stars({ rating, size = 16 }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= Math.floor(rating || 5) ? '#FBBF24' : 'none'} stroke="#FBBF24" strokeWidth="2">
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
        <linearGradient id={`fg-${color.replace('#','')}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color}/><stop offset="100%" stopColor={accent}/>
        </linearGradient>
        <linearGradient id={`lg-${color.replace('#','')}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.15"/><stop offset="100%" stopColor={accent} stopOpacity="0.05"/>
        </linearGradient>
      </defs>
      <ellipse cx="92" cy="65" rx="70" ry="50" fill={`url(#lg-${color.replace('#','')})`} stroke={`url(#fg-${color.replace('#','')})`} strokeWidth="5"/>
      <ellipse cx="248" cy="65" rx="70" ry="50" fill={`url(#lg-${color.replace('#','')})`} stroke={`url(#fg-${color.replace('#','')})`} strokeWidth="5"/>
      <path d="M162 60 Q170 48 178 60" stroke={`url(#fg-${color.replace('#','')})`} strokeWidth="4.5" fill="none" strokeLinecap="round"/>
      <line x1="22" y1="42" x2="4" y2="55" stroke={`url(#fg-${color.replace('#','')})`} strokeWidth="4" strokeLinecap="round"/>
      <line x1="318" y1="42" x2="336" y2="55" stroke={`url(#fg-${color.replace('#','')})`} strokeWidth="4" strokeLinecap="round"/>
    </svg>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const { products, reviews, toggleWishlist, wishlist, addRecentlyViewed, addReview, loading } = useStore();
  const { addItem } = useCart();
  const router = useRouter();
  const [selectedLens, setSelectedLens] = useState('standard');
  const [selectedColor, setSelectedColor] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', body: '', user: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [added, setAdded] = useState(false);

  const product = products?.find(p => p.id === parseInt(params.id));

  useEffect(() => {
    if (product) addRecentlyViewed(product.id);
  }, [product?.id]);

  if (loading) {
    return <div className="pt-32 pb-20 bg-soft-white min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  }

  if (!product) {
    return <div className="pt-32 pb-20 bg-soft-white min-h-screen flex items-center justify-center"><p className="text-xl font-bold">Product not found.</p></div>;
  }

  const productReviews = reviews?.filter(r => r.productId === product.id) || [];
  const lensPackage = LENS_PACKAGES.find(l => l.id === selectedLens);
  const totalPrice = product.price + (lensPackage?.price || 0);
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  const inWishlist = wishlist?.includes(product.id);
  const related = products?.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4) || [];

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
    <div className="pt-24 pb-20 bg-soft-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="text-sm text-dark-gray mb-8">
          <Link href="/" className="hover:text-accent">Home</Link> <span className="mx-2">/</span> 
          <Link href={`/products/${product.category}`} className="hover:text-accent capitalize">{product.category}</Link> <span className="mx-2">/</span> 
          <span className="text-charcoal font-medium">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 mb-20">
          
          {/* Gallery */}
          <div className="lg:w-1/2">
            <div className="relative aspect-[4/3] bg-white rounded-3xl border border-mid-gray/30 flex items-center justify-center p-8 mb-4 shadow-sm group">
              {product.image ? (
                 <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <div className="w-full transition-transform duration-500 group-hover:scale-105">
                  <GlassesIcon color={product.colors?.[selectedColor] || '#2563EB'} accent="#0ea5e9" />
                </div>
              )}
              
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isBestSeller && <span className="bg-accent text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg">Best Seller</span>}
                {discount > 0 && <span className="bg-red-500 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg">-{discount}% Off</span>}
                {product.isNew && <span className="bg-green-500 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg">New</span>}
              </div>
            </div>

            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center justify-center gap-4 mt-6">
                {product.colors.map((c, i) => (
                  <button 
                    key={i} 
                    className={`w-10 h-10 rounded-full border-2 transition-transform ${selectedColor === i ? "border-accent scale-110 shadow-md" : "border-transparent hover:scale-110"}`} 
                    onClick={() => setSelectedColor(i)} 
                    style={{ background: c }} 
                    aria-label={`Color ${i+1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="lg:w-1/2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-accent font-bold tracking-wider uppercase text-sm">{product.brand}</span>
              <button 
                className={`w-10 h-10 rounded-full flex items-center justify-center bg-white border shadow-sm transition-colors ${inWishlist ? "border-red-500 text-red-500" : "border-mid-gray/50 text-dark-gray hover:text-red-500"}`} 
                onClick={() => toggleWishlist(product.id)} 
                aria-label="Wishlist"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold font-heading text-charcoal leading-tight mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              <Stars rating={product.rating || 5} />
              <span className="font-bold text-charcoal">{product.rating || 5}</span>
              <span className="text-dark-gray text-sm underline cursor-pointer">({product.reviews || 0} reviews)</span>
            </div>

            <div className="flex items-end gap-3 mb-8">
              <span className="text-4xl font-black text-charcoal">${totalPrice}</span>
              {product.originalPrice > product.price && <span className="text-xl text-dark-gray/60 line-through mb-1">${product.originalPrice}</span>}
            </div>

            <p className="text-dark-gray leading-relaxed mb-8">{product.description}</p>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 py-6 border-y border-mid-gray/40 mb-8">
              {[
                ['Frame Color', product.frameColor],
                ['Lens Color', product.lensColor],
                ['Frame Shape', product.frameShape],
                ['Material', product.frameMaterial],
                ['Gender', product.gender],
              ].map(([k, v]) => v && (
                <div key={k} className="flex flex-col">
                  <span className="text-xs text-dark-gray/70 font-semibold uppercase tracking-wider">{k}</span>
                  <span className="text-charcoal font-medium capitalize mt-1">{v}</span>
                </div>
              ))}
            </div>

            {/* Lens package */}
            <div className="mb-8">
              <h3 className="font-bold text-charcoal mb-4">Select Lens Package</h3>
              <div className="space-y-3">
                {LENS_PACKAGES.map(pkg => (
                  <button 
                    key={pkg.id} 
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${selectedLens === pkg.id ? "border-accent bg-accent/5" : "border-mid-gray/30 hover:border-accent/50 bg-white"}`} 
                    onClick={() => setSelectedLens(pkg.id)}
                  >
                    <div>
                      <div className={`font-bold ${selectedLens === pkg.id ? "text-accent" : "text-charcoal"}`}>{pkg.label}</div>
                      <div className="text-sm text-dark-gray mt-1">{pkg.desc}</div>
                    </div>
                    <span className="font-semibold text-charcoal">{pkg.price === 0 ? 'Included' : `+$${pkg.price}`}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-6 mt-4 text-sm font-semibold text-accent">
                <Link href="/frame-size-guide" className="flex items-center gap-2 hover:text-accent-dark">📏 Frame Size Guide</Link>
                <Link href="/virtual-try-on" className="flex items-center gap-2 hover:text-accent-dark">📱 Virtual Try-On</Link>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${added ? "bg-green-500 text-white shadow-lg shadow-green-500/25" : "bg-white text-charcoal border-2 border-charcoal hover:bg-light-gray"}`} 
                onClick={handleAddToCart}
              >
                {added ? '✓ Added to Cart!' : 'Add to Cart'}
              </button>
              <button 
                className="flex-1 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-accent to-accent-dark text-white shadow-lg shadow-accent/25 hover:shadow-xl hover:-translate-y-0.5 transition-all" 
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>

            {/* Trust */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-dark-gray bg-white p-5 rounded-2xl border border-mid-gray/30">
              <span className="flex items-center gap-2">🚚 Free shipping over $99</span>
              <span className="flex items-center gap-2">↩️ 30-day returns</span>
              <span className="flex items-center gap-2">🔒 Secure checkout</span>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mb-20 pt-16 border-t border-mid-gray/40">
            <h2 className="text-3xl font-bold font-heading text-charcoal mb-8 text-center">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(p => (
                <Link key={p.id} href={`/product/${p.id}`} className="group bg-white rounded-2xl border border-mid-gray/30 overflow-hidden hover:shadow-lg transition-all">
                  <div className="aspect-square bg-light-gray flex items-center justify-center p-6">
                    {p.image ? (
                       <img src={p.image} alt={p.name} className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="transition-transform duration-500 group-hover:scale-105 w-full">
                        <GlassesIcon color={p.colors?.[0] || '#2563EB'} accent="#0ea5e9" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 text-center">
                    <div className="text-xs font-bold text-accent mb-1 uppercase tracking-wider">{p.brand}</div>
                    <div className="font-bold text-charcoal mb-2 truncate">{p.name}</div>
                    <div className="font-semibold">${p.price}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="pt-16 border-t border-mid-gray/40 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold font-heading text-charcoal">Customer Reviews ({productReviews.length})</h2>
            <button 
              className="px-6 py-2.5 bg-white border border-mid-gray text-charcoal font-semibold rounded-xl hover:bg-light-gray transition-colors" 
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              Write a Review
            </button>
          </div>

          {showReviewForm && (
            <form className="bg-white p-8 rounded-2xl border border-mid-gray/30 shadow-sm mb-10" onSubmit={handleReviewSubmit}>
              <h3 className="text-xl font-bold text-charcoal mb-6">Write your review</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <input className="px-4 py-3 bg-light-gray rounded-xl border-transparent focus:ring-2 focus:ring-accent focus:bg-white transition-all w-full" placeholder="Your Name" required value={reviewForm.user} onChange={e => setReviewForm({...reviewForm, user: e.target.value})} />
                <input className="px-4 py-3 bg-light-gray rounded-xl border-transparent focus:ring-2 focus:ring-accent focus:bg-white transition-all w-full" placeholder="Review Title" required value={reviewForm.title} onChange={e => setReviewForm({...reviewForm, title: e.target.value})} />
              </div>
              <div className="mb-6">
                <span className="block text-sm font-semibold text-charcoal mb-2">Rating</span>
                <div className="flex gap-4 flex-row-reverse justify-end">
                  {[5,4,3,2,1].map(r => (
                    <label key={r} className="cursor-pointer peer">
                      <input type="radio" name="rating" value={r} className="sr-only" checked={reviewForm.rating === r} onChange={() => setReviewForm({...reviewForm, rating: r})} />
                      <span className={`text-2xl ${reviewForm.rating >= r ? "text-gold" : "text-mid-gray hover:text-gold/50"}`}>★</span>
                    </label>
                  ))}
                </div>
              </div>
              <textarea className="w-full px-4 py-3 bg-light-gray rounded-xl border-transparent focus:ring-2 focus:ring-accent focus:bg-white transition-all mb-6" placeholder="Share your experience..." rows={4} required value={reviewForm.body} onChange={e => setReviewForm({...reviewForm, body: e.target.value})} />
              <button type="submit" className="px-8 py-3 bg-charcoal text-white font-semibold rounded-xl hover:bg-black transition-colors">Submit Review</button>
            </form>
          )}

          <div className="space-y-6">
            {productReviews.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border border-mid-gray/30">
                <p className="text-dark-gray">No reviews yet. Be the first to share your thoughts!</p>
              </div>
            ) : productReviews.map(r => (
              <div key={r.id} className="bg-white p-6 rounded-2xl border border-mid-gray/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Stars rating={r.rating} size={14} />
                    <span className="font-bold text-charcoal">{r.user || r.user_name}</span>
                    {r.verified && <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">✓ Verified Purchase</span>}
                  </div>
                  <span className="text-sm text-dark-gray mt-2 sm:mt-0">{new Date(r.created_at || r.date).toLocaleDateString()}</span>
                </div>
                <div className="font-bold text-charcoal mb-2 text-lg">{r.title}</div>
                <div className="text-dark-gray leading-relaxed">{r.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
