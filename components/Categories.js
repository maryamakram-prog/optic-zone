import Link from 'next/link';
import { categories } from '@/data/siteData';

export default function Categories() {
  return (
    <section className="section-padding bg-soft-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-widest uppercase text-accent">Browse Collection</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-charcoal mt-2">Featured Categories</h2>
          <p className="text-dark-gray/70 mt-3 max-w-md mx-auto">Explore our curated selection of premium eyewear for every lifestyle</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] hover-lift"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-sm font-heading">{cat.name}</h3>
                <p className="text-white/60 text-xs mt-0.5">{cat.count} Products</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
