'use client';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { calculateDiscountedPrice } from '@/lib/discounts';

const FALLBACK_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 100 100" fill="%23f3f4f6"><rect width="100" height="100" fill="%23f3f4f6"/><path d="M20 40 Q35 25 50 40 Q65 25 80 40" stroke="%239ca3af" stroke-width="3" fill="none"/><circle cx="35" cy="55" r="15" stroke="%239ca3af" stroke-width="3" fill="none"/><circle cx="65" cy="55" r="15" stroke="%239ca3af" stroke-width="3" fill="none"/><path d="M42.5 55 L57.5 55" stroke="%239ca3af" stroke-width="3" fill="none"/></svg>';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();
  const [imgSrc, setImgSrc] = useState(product.imageUrl || product.image || FALLBACK_IMAGE);
  const [imgLoading, setImgLoading] = useState(true);
  const imgRef = useRef(null);

  useEffect(() => {
    setImgSrc(product.imageUrl || product.image || FALLBACK_IMAGE);
    setImgLoading(true);
  }, [product.imageUrl, product.image]);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setImgLoading(false);
    }
  }, [imgSrc]);


  const badgeColors = {
    'Best Seller': 'bg-accent text-white',
    'New': 'bg-green-500 text-white',
    'Sale': 'bg-red-500 text-white',
  };

  const finalPrice = calculateDiscountedPrice(product.price, product.lens_discount);
  const isDiscounted = finalPrice < product.price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ ...product, imageUrl: product.imageUrl || product.image, price: finalPrice, originalPrice: product.price });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div 
      onClick={() => router.push(`/product/${String(product.id).substring(0, 8)}`)}
      className="group bg-white rounded-2xl border border-mid-gray/30 overflow-hidden hover-lift block cursor-pointer"
    >
      {/* Image */}
      <div 
        className="relative aspect-square overflow-hidden bg-light-gray flex items-center justify-center"
        onMouseEnter={() => {
          if (product.images && product.images.length > 1) {
            setImgSrc(product.images[1]);
          }
        }}
        onMouseLeave={() => {
          setImgSrc(product.imageUrl || product.image || FALLBACK_IMAGE);
        }}
      >
        {imgLoading && (
          <div className="absolute inset-0 bg-light-gray/40 animate-pulse flex items-center justify-center z-10">
            <div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img
          ref={imgRef}
          src={imgSrc}
          alt={product.name}
          onLoad={() => setImgLoading(false)}
          onError={() => {
            setImgSrc(FALLBACK_IMAGE);
            setImgLoading(false);
          }}
          style={{ filter: `hue-rotate(${((product.name || '').length * 27 + (typeof product.id === 'string' ? product.id.charCodeAt(0) : product.id || 0) * 13) % 360}deg)` }}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-108 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
          loading="lazy"
        />
        {product.badge && !isDiscounted && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${badgeColors[product.badge]}`}>
            {product.badge}
          </span>
        )}
        {isDiscounted && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-purple-600 text-white shadow-sm">
            {product.lens_discount.discount_type === 'percentage' 
              ? `${product.lens_discount.discount_value}% OFF` 
              : `$${product.lens_discount.discount_value} OFF`}
          </span>
        )}
        {/* Quick actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <button className="w-9 h-9 rounded-xl glass flex items-center justify-center text-charcoal hover:text-accent transition-colors" aria-label="Add to wishlist">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-charcoal text-sm font-heading group-hover:text-accent transition-colors truncate">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3.5 h-3.5 ${i < Math.floor(product.rating || 5) ? 'text-gold' : 'text-mid-gray'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-dark-gray/60">({product.reviews || 0})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-lg font-bold text-charcoal">
            {isDiscounted ? `$${finalPrice.toFixed(2)}` : `$${product.price.toFixed(2)}`}
          </span>
          {isDiscounted ? (
            <span className="text-sm text-dark-gray/50 line-through">${product.price.toFixed(2)}</span>
          ) : product.originalPrice && product.originalPrice > product.price ? (
            <span className="text-sm text-dark-gray/50 line-through">${product.originalPrice.toFixed(2)}</span>
          ) : null}
        </div>

        {/* Add to Cart */}
        <button 
          onClick={handleAddToCart}
          className="w-full mt-4 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-dark text-white text-sm font-semibold hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 relative overflow-hidden"
        >
          <span className={`block transition-all duration-300 ${showToast ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            Add to Cart
          </span>
          <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            Added! ✓
          </span>
        </button>
      </div>
    </div>
  );
}
