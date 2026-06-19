import ProductCard from './ProductCard';
import { products } from '@/data/siteData';
import Link from 'next/link';

export default function FeaturedProducts() {
  return (
    <section className="section-padding bg-gradient-to-b from-soft-white to-pastel-blue-light/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-accent">Curated Selection</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-charcoal mt-2">Best Selling Products</h2>
            <p className="text-dark-gray/70 mt-3 max-w-md">Handpicked favorites loved by thousands of customers worldwide</p>
          </div>
          <Link
            href="/products"
            className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-dark transition-colors group"
          >
            View All
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
