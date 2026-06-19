'use client';

export default function ProductCard({ product }) {
  const badgeColors = {
    'Best Seller': 'bg-accent text-white',
    'New': 'bg-green-500 text-white',
    'Sale': 'bg-red-500 text-white',
  };

  return (
    <div className="group bg-white rounded-2xl border border-mid-gray/30 overflow-hidden hover-lift">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-light-gray">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
        />
        {product.badge && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${badgeColors[product.badge]}`}>
            {product.badge}
          </span>
        )}
        {/* Quick actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <button className="w-9 h-9 rounded-xl glass flex items-center justify-center text-charcoal hover:text-accent transition-colors" aria-label="Add to wishlist">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
          <button className="w-9 h-9 rounded-xl glass flex items-center justify-center text-charcoal hover:text-accent transition-colors" aria-label="Quick view">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
                className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'text-gold' : 'text-mid-gray'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-dark-gray/60">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-lg font-bold text-charcoal">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-dark-gray/50 line-through">${product.originalPrice}</span>
          )}
        </div>

        {/* Add to Cart */}
        <button className="w-full mt-4 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-dark text-white text-sm font-semibold hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
