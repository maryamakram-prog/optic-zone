'use client';

import { Suspense } from 'react';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';
import { useSearchParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import Link from 'next/link';

const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 – $100', min: 50, max: 100 },
  { label: '$100 – $200', min: 100, max: 200 },
  { label: '$200+', min: 200, max: Infinity },
];

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Eyeglasses', value: 'eyeglasses' },
  { label: 'Sunglasses', value: 'sunglasses' },
  { label: 'Contact Lenses', value: 'contact-lenses' },
  { label: 'Blue Light', value: 'blue-light' },
  { label: 'Kids', value: 'kids' },
  { label: 'Reading', value: 'reading' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const searchParamsCategory = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  const isSale = searchParams.get('isSale') === 'true';
  const isNew = searchParams.get('isNew') === 'true';
  const isBestSeller = searchParams.get('isBestSeller') === 'true';
  const searchParamsGender = searchParams.get('gender');
  const searchParamsType = searchParams.get('type');

  const { products, loading } = useStore();
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState(0);
  const [activeCategory, setActiveCategory] = useState(searchParamsCategory || '');
  const [showFilters, setShowFilters] = useState(false);

  const displayProducts = useMemo(() => {
    if (!products) return [];
    let result = [...products];

    // Category filter (URL param or local state)
    const cat = activeCategory || searchParamsCategory;
    if (cat) {
      result = result.filter(p => p.category === cat);
    }

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    }

    // Special tag filters from URL
    // Special tag filters from URL
    if (isSale) result = result.filter(p => p.badge === 'Sale' || p.isSale || p.originalPrice);
    if (isNew) result = result.filter(p => p.badge === 'New' || p.isNew);
    if (isBestSeller) result = result.filter(p => p.badge === 'Best Seller');
    if (searchParamsGender) result = result.filter(p => p.gender?.toLowerCase() === searchParamsGender.toLowerCase());
    if (searchParamsType) result = result.filter(p => p.type?.toLowerCase() === searchParamsType.toLowerCase());

    // Price range filter
    const range = PRICE_RANGES[priceRange];
    result = result.filter(p => {
      const price = Number(p.price) || 0;
      return price >= range.min && price <= range.max;
    });

    // Sort
    return result.sort((a, b) => {
      if (sortBy === 'newest') {
        const dateB = b.created_at ? new Date(b.created_at) : 0;
        const dateA = a.created_at ? new Date(a.created_at) : 0;
        return dateB - dateA;
      }
      if (sortBy === 'price-asc') return (Number(a.price) || 0) - (Number(b.price) || 0);
      if (sortBy === 'price-desc') return (Number(b.price) || 0) - (Number(a.price) || 0);
      if (sortBy === 'rating') return (Number(b.rating) || 0) - (Number(a.rating) || 0);
      return 0;
    });
  }, [products, searchParamsCategory, activeCategory, searchQuery, sortBy, priceRange, isSale, isNew, isBestSeller, searchParamsGender, searchParamsType]);

  const pageTitle = searchQuery
    ? `Search results for "${searchQuery}"`
    : isSale ? '🏷️ Sale — Up to 40% Off'
    : isNew ? '✨ New Arrivals'
    : isBestSeller ? '⭐ Best Sellers'
    : searchParamsCategory
      ? searchParamsCategory.replace(/-/g, ' ')
      : 'All Eyewear';

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center flex-col gap-3">
        <div className="w-10 h-10 border-3 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-text-muted font-medium">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className={`lg:w-60 shrink-0 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
        {/* Category Filter */}
        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
          <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-4">Category</h3>
          <div className="space-y-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  (activeCategory || '') === cat.value
                    ? 'bg-accent text-white font-semibold'
                    : 'text-charcoal-light hover:bg-ebd-blue-light hover:text-accent'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
          <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-4">Price Range</h3>
          <div className="space-y-1">
            {PRICE_RANGES.map((range, idx) => (
              <button
                key={idx}
                onClick={() => setPriceRange(idx)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  priceRange === idx
                    ? 'bg-accent text-white font-semibold'
                    : 'text-charcoal-light hover:bg-ebd-blue-light hover:text-accent'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Filters */}
        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
          <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-4">Browse</h3>
          <div className="space-y-1">
            {[
              { label: '🏷️ On Sale', href: '/products?isSale=true' },
              { label: '✨ New Arrivals', href: '/products?isNew=true' },
              { label: '⭐ Best Sellers', href: '/products?isBestSeller=true' },
              { label: '🕶️ Sunglasses', href: '/products?category=sunglasses' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal-light hover:bg-ebd-blue-light hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-charcoal capitalize">{pageTitle}</h1>
            <p className="text-sm text-text-muted mt-1">{displayProducts.length} product{displayProducts.length !== 1 ? 's' : ''} found</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-medium text-charcoal hover:bg-light-gray cursor-pointer transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
              Filters
            </button>
            {/* Sort */}
            <div className="flex items-center gap-2 flex-1 sm:flex-none">
              <label className="text-sm text-text-muted whitespace-nowrap">Sort:</label>
              <select
                className="flex-1 sm:flex-none px-3 py-2.5 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 cursor-pointer text-charcoal font-medium"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(activeCategory || isSale || isNew || isBestSeller || priceRange > 0) && (
          <div className="flex flex-wrap gap-2 mb-5">
            {activeCategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent text-xs font-semibold rounded-full border border-accent/20">
                {activeCategory}
                <button onClick={() => setActiveCategory('')} className="hover:text-accent-dark ml-0.5 cursor-pointer">×</button>
              </span>
            )}
            {priceRange > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent text-xs font-semibold rounded-full border border-accent/20">
                {PRICE_RANGES[priceRange].label}
                <button onClick={() => setPriceRange(0)} className="hover:text-accent-dark ml-0.5 cursor-pointer">×</button>
              </span>
            )}
            {isSale && <span className="px-3 py-1.5 bg-sale/10 text-sale text-xs font-semibold rounded-full border border-sale/20">On Sale</span>}
            {isNew && <span className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">New Arrivals</span>}
          </div>
        )}

        {/* Product Grid */}
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {displayProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-border">
            <span className="text-5xl block mb-4">🔍</span>
            <h3 className="text-xl font-bold text-charcoal mb-2">No products found</h3>
            <p className="text-text-muted mb-6">Try adjusting your filters or search term.</p>
            <Link href="/products" className="px-6 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-colors inline-block">
              View All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="bg-off-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={
          <div className="py-20 flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <ProductsContent />
        </Suspense>
      </div>
    </div>
  );
}
