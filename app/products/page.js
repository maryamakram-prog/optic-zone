'use client';

import { Suspense } from 'react';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';
import { useSearchParams } from 'next/navigation';
import { useState, useMemo } from 'react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const searchParamsCategory = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  
  const { products, loading } = useStore();
  const [sortBy, setSortBy] = useState('featured');

  const displayProducts = useMemo(() => {
    if (!products) return [];
    let result = products;

    if (searchParamsCategory) {
      result = result.filter(p => p.category === searchParamsCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) || 
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    }

    // Clone the array before sorting to avoid mutating the original array
    const sorted = [...result];
    return sorted.sort((a, b) => {
      if (sortBy === 'newest') return (Number(b.id) || 0) - (Number(a.id) || 0);
      if (sortBy === 'price-asc') return (Number(a.price) || 0) - (Number(b.price) || 0);
      if (sortBy === 'price-desc') return (Number(b.price) || 0) - (Number(a.price) || 0);
      return 0; // featured
    });
  }, [products, searchParamsCategory, searchQuery, sortBy]);

  if (loading) {
    return <div className="pt-32 pb-20 bg-soft-white min-h-[50vh] flex items-center justify-center"><p>Loading products...</p></div>;
  }

  return (
    <>
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold font-heading text-charcoal mb-4 capitalize">
          {searchQuery ? `Search Results for "${searchQuery}"` : searchParamsCategory ? searchParamsCategory : 'All Products'}
        </h1>
        <p className="text-dark-gray/70 max-w-2xl mx-auto">
          Explore our wide range of premium eyewear carefully crafted to provide the best comfort and style.
        </p>
      </div>

      {/* Filters/Sort Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-mid-gray/30 mb-8">
        <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <span className="text-sm text-dark-gray/70 whitespace-nowrap font-medium">{displayProducts.length} Results</span>
        </div>
        <div className="w-full sm:w-auto mt-4 sm:mt-0 flex items-center justify-end">
          <label className="text-sm text-dark-gray mr-3">Sort by:</label>
          <select 
            className="px-4 py-2 text-sm bg-light-gray rounded-xl border-transparent focus:ring-2 focus:ring-accent/20 outline-none cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="featured">Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {displayProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-mid-gray/30">
          <span className="text-4xl block mb-4">🔍</span>
          <h3 className="text-xl font-bold text-charcoal mb-2">No products found</h3>
          <p className="text-dark-gray">We couldn't find any frames matching your search.</p>
        </div>
      )}
    </>
  );
}

export default function ProductsPage() {
  return (
    <div className="pt-24 pb-20 bg-soft-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="pt-32 pb-20 flex items-center justify-center"><p>Loading products...</p></div>}>
          <ProductsContent />
        </Suspense>
      </div>
    </div>
  );
}
