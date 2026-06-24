'use client';

import { useStore } from '@/context/StoreContext';
import ProductCard from './ProductCard';
import Link from 'next/link';

export default function NewArrivals() {
  const { products } = useStore();
  // Get latest 4 products
  const newArrivals = products 
    ? [...products].sort((a, b) => {
        const dateB = b.created_at ? new Date(b.created_at) : 0;
        const dateA = a.created_at ? new Date(a.created_at) : 0;
        return dateB - dateA;
      }).slice(0, 4)
    : [];

  return (
    <section className="section-padding bg-soft-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-accent">Fresh Drops</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-charcoal mt-2">New Arrivals</h2>
          </div>
          <Link
            href="/products?sort=newest"
            className="group flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-dark transition-colors"
          >
            View All
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
