import { products, categories } from '@/data/siteData';
import ProductCard from '@/components/ProductCard';

export const metadata = {
  title: 'Shop All Products — Optic Zone',
  description: 'Browse our complete collection of premium eyewear, sunglasses, blue light glasses, and contact lenses.',
};

export default async function ProductsPage({ searchParams }) {
  const categorySlug = searchParams?.category;
  const currentCategory = categorySlug 
    ? categories.find(c => c.slug === categorySlug) 
    : null;

  const displayProducts = categorySlug 
    ? products.filter(p => p.category === categorySlug)
    : products;

  return (
    <div className="pt-24 pb-20 bg-soft-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold font-heading text-charcoal mb-4">
            {currentCategory ? currentCategory.name : 'All Products'}
          </h1>
          <p className="text-dark-gray/70 max-w-2xl mx-auto">
            Explore our wide range of premium eyewear carefully crafted to provide the best comfort and style.
          </p>
        </div>

        {/* Filters/Sort Bar (Mockup) */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-mid-gray/30 mb-8">
          <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <button className="px-4 py-2 text-sm font-medium bg-light-gray text-charcoal rounded-xl whitespace-nowrap">Filter</button>
            <div className="h-6 w-px bg-mid-gray hidden sm:block"></div>
            <span className="text-sm text-dark-gray/70 whitespace-nowrap">{displayProducts.length} Results</span>
          </div>
          <div className="w-full sm:w-auto mt-4 sm:mt-0 flex items-center justify-end">
            <label className="text-sm text-dark-gray mr-3">Sort by:</label>
            <select className="px-4 py-2 text-sm bg-light-gray rounded-xl border-transparent focus:ring-2 focus:ring-accent/20 outline-none cursor-pointer">
              <option>Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
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
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-charcoal mb-2">No products found</h3>
            <p className="text-dark-gray">Try selecting a different category or adjusting your filters.</p>
          </div>
        )}

      </div>
    </div>
  );
}
