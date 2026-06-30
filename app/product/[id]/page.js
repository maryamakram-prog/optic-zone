'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import Link from 'next/link';
import PrescriptionForm from '@/components/PrescriptionForm';
import UsageModal from '@/components/UsageModal';
import { calculateDiscountedPrice } from '@/lib/discounts';

const FALLBACK_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 100 100" fill="%23f3f4f6"><rect width="100" height="100" fill="%23f3f4f6"/><path d="M20 40 Q35 25 50 40 Q65 25 80 40" stroke="%239ca3af" stroke-width="3" fill="none"/><circle cx="35" cy="55" r="15" stroke="%239ca3af" stroke-width="3" fill="none"/><circle cx="65" cy="55" r="15" stroke="%239ca3af" stroke-width="3" fill="none"/><path d="M42.5 55 L57.5 55" stroke="%239ca3af" stroke-width="3" fill="none"/></svg>';

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
  const [prescription, setPrescription] = useState(null);
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);

  const product = products?.find(p => String(p.id).substring(0, 8) === String(params.id).substring(0, 8));
  const isContactLens = product?.category === 'contact-lenses';

  const galleryImages = product?.images?.length ? product.images : [product?.imageUrl || product?.image || FALLBACK_IMAGE];
  const [detailImgSrc, setDetailImgSrc] = useState(galleryImages[0]);
  const [detailImgLoading, setDetailImgLoading] = useState(true);
  const detailImgRef = useRef(null);

  useEffect(() => {
    if (product) {
      const initialImage = product?.images?.length ? product.images[0] : (product.imageUrl || product.image || FALLBACK_IMAGE);
      setDetailImgSrc(initialImage);
      setDetailImgLoading(true);
    }
  }, [product?.images, product?.imageUrl, product?.image]);

  useEffect(() => {
    if (detailImgRef.current && detailImgRef.current.complete) {
      setDetailImgLoading(false);
    }
  }, [detailImgSrc]);

  useEffect(() => {
    if (product) addRecentlyViewed(product.id);
  }, [product?.id]);

  if (loading) {
    return <div className="py-20 bg-off-white min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!product) {
    return <div className="py-20 bg-off-white min-h-screen flex items-center justify-center"><p className="text-xl font-bold">Product not found.</p></div>;
  }

  const productReviews = reviews?.filter(r => String(r.productId || r.product_id) === String(product.id)) || [];
  const lensPackage = LENS_PACKAGES.find(l => l.id === selectedLens);
  
  const finalBasePrice = calculateDiscountedPrice(product.price, product.lens_discount);
  const isDiscounted = finalBasePrice < product.price;
  const totalPrice = finalBasePrice + (lensPackage?.price || 0);
  const oldTotalPrice = product.price + (lensPackage?.price || 0);

  const discount = product.originalPrice && !isDiscounted ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleUsageSelect = (usageType) => {
    setIsUsageModalOpen(false);
    if (usageType === 'non_prescription') {
      setSelectedLens('standard');
      setPrescription(null);
      // Wait a tiny bit for state to update if needed, but synchronous works for cart context
      const itemPrice = finalBasePrice; 
      addItem({ 
        ...product, 
        imageUrl: product.imageUrl || product.image, 
        price: itemPrice, 
        originalPrice: product.price, 
        lensPackage: 'standard', 
        prescription: null 
      });
      router.push('/cart');
    } else {
      setSelectedLens('prescription');
      setIsRxModalOpen(true);
    }
  };
  
  const inWishlist = wishlist?.includes(product.id);
  const related = products?.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4) || [];

  const handleAddToCart = () => {
    if (selectedLens === 'prescription' && !prescription) {
      setIsRxModalOpen(true);
      return;
    }
    addItem({ ...product, imageUrl: product.imageUrl || product.image, price: totalPrice, originalPrice: product.price, lensPackage: selectedLens, prescription });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (selectedLens === 'prescription' && !prescription) {
      setIsRxModalOpen(true);
      return;
    }
    addItem({ ...product, imageUrl: product.imageUrl || product.image, price: totalPrice, originalPrice: product.price, lensPackage: selectedLens, prescription });
    router.push('/checkout');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    addReview({ ...reviewForm, productId: product.id, verified: false });
    setReviewForm({ rating: 5, title: '', body: '', user: '' });
    setShowReviewForm(false);
  };

  return (
    <div className="py-8 bg-off-white min-h-screen">
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
              {detailImgLoading && (product?.imageUrl || product?.image) && (
                <div className="absolute inset-0 bg-light-gray/40 animate-pulse flex items-center justify-center z-10 rounded-3xl">
                  <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {product?.imageUrl || product?.image ? (
                 <img 
                   ref={detailImgRef}
                   src={detailImgSrc} 
                   alt={product.name} 
                   onLoad={() => setDetailImgLoading(false)}
                   onError={() => {
                     setDetailImgSrc(FALLBACK_IMAGE);
                     setDetailImgLoading(false);
                   }}
                   style={{ filter: `hue-rotate(${((product.name || '').length * 27 + (typeof product.id === 'string' ? product.id.charCodeAt(0) : product.id || 0) * 13) % 360}deg)` }}
                   className={`w-full h-full object-cover rounded-2xl transition-all duration-300 ${detailImgLoading ? 'opacity-0' : 'opacity-100'}`} 
                 />
              ) : (
                <div className="w-full transition-transform duration-500 group-hover:scale-105">
                  <GlassesIcon color={product?.colors?.[selectedColor] || '#2563EB'} accent="#0ea5e9" />
                </div>
              )}
              
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isBestSeller && <span className="bg-accent text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg">Best Seller</span>}
                {isDiscounted && (
                  <span className="bg-purple-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg">
                    {product.lens_discount.discount_type === 'percentage' 
                      ? `${product.lens_discount.discount_value}% OFF` 
                      : `$${product.lens_discount.discount_value} OFF`}
                  </span>
                )}
                {discount > 0 && !isDiscounted && <span className="bg-red-500 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg">-{discount}% Off</span>}
                {product.isNew && <span className="bg-green-500 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg">New</span>}
              </div>
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2 custom-scrollbar">
                {galleryImages.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => {
                      if (detailImgSrc !== img) {
                        setDetailImgLoading(true);
                        setDetailImgSrc(img);
                      }
                    }}
                    className={`w-20 h-20 shrink-0 rounded-xl border-2 transition-all p-1 bg-white flex items-center justify-center ${detailImgSrc === img ? 'border-accent shadow-sm' : 'border-mid-gray/30 hover:border-accent/50'}`}
                  >
                    <img src={img} alt={`Thumbnail ${i+1}`} className="w-full h-full object-cover rounded-lg" style={{ filter: `hue-rotate(${((product.name || '').length * 27 + (typeof product.id === 'string' ? product.id.charCodeAt(0) : product.id || 0) * 13) % 360}deg)` }} />
                  </button>
                ))}
              </div>
            )}

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

            <h1 className="text-3xl sm:text-4xl font-bold font-heading text-charcoal leading-tight mb-2">{product.name}</h1>
            <p className="text-dark-gray text-lg mb-4">
              {product.category === 'contact-lenses' 
                ? 'Contact Lenses' 
                : `${product.frameShape || ''} ${product.frameColor || ''} Glasses`.trim()}
            </p>

            {/* Stars & Reviews */}
            <div className="flex items-center gap-2 mb-4">
              <Stars rating={product.rating || 5} />
              <span className="text-charcoal font-bold underline cursor-pointer underline-offset-4">{product.reviews || 0} Reviews</span>
            </div>

            {/* Promo Banner */}
            {product.category !== 'contact-lenses' && (
              <div className="bg-[#E5F5E9] text-green-800 font-bold px-3 py-1.5 rounded text-sm inline-flex items-center gap-4 mb-6">
                <span>65% Off Lenses with Frames</span>
                <span className="text-green-900 border-l border-green-300 pl-4">Code: SMARTLENS</span>
              </div>
            )}

            {/* Colors */}
            {product.category !== 'contact-lenses' && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-bold text-charcoal">Color:</span>
                <div className="flex gap-2">
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-[#CD9950] ring-2 ring-white ring-inset shadow-md"
                    style={{ background: product.frameColor?.toLowerCase().includes('black') ? '#1F2937' : product.frameColor?.toLowerCase().includes('gold') ? '#D4AF37' : product.frameColor?.toLowerCase().includes('silver') ? '#C0C0C0' : product.frameColor?.toLowerCase().includes('tortoise') ? '#8B4513' : product.frameColor?.toLowerCase().includes('clear') ? '#F3F4F6' : '#9CA3AF' }} 
                    aria-label={product.frameColor}
                  />
                </div>
                <span className="text-dark-gray text-sm">{product.frameColor || 'Shiny Black'}</span>
              </div>
            )}

            {/* Tags */}
            <div className="flex gap-2 mb-4">
              <span className="bg-[#FFF4E6] text-[#CD9950] font-semibold text-xs px-2 py-1 rounded">Free Shipping</span>
              {product.category !== 'contact-lenses' && (
                <span className="bg-[#E6F4FB] text-[#0EA5E9] font-semibold text-xs px-2 py-1 rounded">Premium Case</span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 mb-2">
              <span className="text-3xl font-black text-charcoal">${finalBasePrice.toFixed(2)}</span>
            </div>

            {/* Installments */}
            <div className="text-xs text-dark-gray flex flex-wrap items-center gap-1.5 mb-8">
              4 interest-free payments of ${(finalBasePrice / 4).toFixed(2)} 
              <span className="bg-[#B2FCE4] text-black font-bold px-1.5 py-0.5 rounded text-[10px] ml-1">Afterpay</span>
              <span className="bg-[#FFA8C5] text-black font-bold px-1.5 py-0.5 rounded text-[10px]">Klarna</span>
              <span className="w-4 h-4 rounded-full border border-dark-gray flex items-center justify-center opacity-70">i</span>
            </div>

            {/* Size */}
            {product.category !== 'contact-lenses' && (
              <div className="flex items-center justify-between py-4 border-t border-mid-gray/40">
                <div className="text-charcoal font-medium">Size: <span className="font-bold">Medium (50-22-150)</span></div>
                <Link href="/frame-size-guide" className="text-dark-gray underline text-sm hover:text-charcoal">Size Guide</Link>
              </div>
            )}

            {/* Lens Package Selector — frame products only */}
            {!isContactLens && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-charcoal font-bold">Choose Lens Package</span>
                  <Link href="/pd-guide" className="text-accent text-xs underline">What's included?</Link>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {LENS_PACKAGES.map(pkg => (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedLens(pkg.id)}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        selectedLens === pkg.id
                          ? 'border-accent bg-ebd-blue-light'
                          : 'border-mid-gray/30 hover:border-accent/50 bg-white'
                      }`}
                    >
                      <div>
                        <div className={`font-semibold text-sm ${selectedLens === pkg.id ? 'text-accent' : 'text-charcoal'}`}>{pkg.label}</div>
                        <div className="text-xs text-text-muted">{pkg.desc}</div>
                      </div>
                      <span className={`text-sm font-bold shrink-0 ml-3 ${selectedLens === pkg.id ? 'text-accent' : 'text-charcoal'}`}>
                        {pkg.price === 0 ? 'Free' : `+$${pkg.price}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Lens Info Strip */}
            {isContactLens && (
              <div className="mb-8 p-4 bg-ebd-blue-light rounded-xl border border-accent/20 space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-accent">👁️ Contact Lens Details</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between col-span-2 py-1 border-b border-accent/10">
                    <span className="text-text-muted">Pack Size</span>
                    <span className="font-semibold text-charcoal">{product.packSize || '30 lenses'}</span>
                  </div>
                  <div className="flex justify-between col-span-2 py-1 border-b border-accent/10">
                    <span className="text-text-muted">Replacement</span>
                    <span className="font-semibold text-charcoal">{product.replacement || 'Daily'}</span>
                  </div>
                  <div className="flex justify-between col-span-2 py-1">
                    <span className="text-text-muted">Water Content</span>
                    <span className="font-semibold text-charcoal">{product.waterContent || '55%'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mb-10">
              {isContactLens ? (
                // Contact lenses: simple add to cart, no lens selection needed
                <button
                  className="w-full py-4 bg-[#CD9950] hover:bg-[#b07b38] text-white font-bold text-lg rounded-md transition-colors"
                  onClick={() => {
                    addItem({ ...product, imageUrl: product.imageUrl || product.image, price: finalBasePrice, originalPrice: product.price, lensPackage: 'contacts', prescription: null });
                    setAdded(true);
                    setTimeout(() => setAdded(false), 2000);
                  }}
                >
                  {added ? '✓ Added to Cart!' : 'Add to Cart'}
                </button>
              ) : (
                <button
                  className="w-full py-4 bg-[#CD9950] hover:bg-[#b07b38] text-white font-bold text-lg rounded-md transition-colors"
                  onClick={() => setIsUsageModalOpen(true)}
                >
                  Select Lenses
                </button>
              )}
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
                  <div className="aspect-square bg-light-gray flex items-center justify-center p-6 relative overflow-hidden">
                    {p.imageUrl || p.image ? (
                       <img 
                         src={p.imageUrl || p.image} 
                         alt={p.name} 
                         onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                         className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105" 
                       />
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
      
      <PrescriptionForm 
        isOpen={isRxModalOpen} 
        onClose={() => setIsRxModalOpen(false)} 
        onSave={(rx) => {
          setPrescription(rx);
          setIsRxModalOpen(false);
          const itemPrice = finalBasePrice + 49; // Rx lens price
          addItem({ 
            ...product, 
            imageUrl: product.imageUrl || product.image, 
            price: itemPrice, 
            originalPrice: product.price, 
            lensPackage: 'prescription', 
            prescription: rx 
          });
          router.push('/cart');
        }} 
        initialPrescription={prescription} 
      />

      <UsageModal 
        isOpen={isUsageModalOpen}
        onClose={() => setIsUsageModalOpen(false)}
        onSelectUsage={handleUsageSelect}
        product={product}
        totalPrice={finalBasePrice}
      />
    </div>
  );
}
