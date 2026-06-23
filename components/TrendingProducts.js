'use client';

import { useStore } from '@/context/StoreContext';
import ProductCard from './ProductCard';
import { useRef } from 'react';

export default function TrendingProducts() {
  const { products } = useStore();
  const scrollRef = useRef(null);
  
  // Just use top rated or arbitrary for trending
  const trending = products ? [...products].filter(p => p.rating > 4.6).slice(0, 6) : [];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (trending.length === 0) return null;

  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-accent">Hot Right Now</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-charcoal mt-2">Trending Styles</h2>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-mid-gray/30 flex items-center justify-center text-dark-gray hover:bg-accent hover:text-white hover:border-accent transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-mid-gray/30 flex items-center justify-center text-dark-gray hover:bg-accent hover:text-white hover:border-accent transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 -mb-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {trending.map((product) => (
            <div key={product.id} className="min-w-[280px] sm:min-w-[300px] snap-start shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
