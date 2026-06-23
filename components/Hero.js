'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-to-br from-soft-white via-pastel-blue-light/30 to-pastel-lavender-light/20">
      {/* Decorative blobs */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-pastel-blue/20 rounded-full blur-[120px] animate-pulse-soft" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-pastel-lavender/20 rounded-full blur-[100px] animate-pulse-soft" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold tracking-wider uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-soft" />
              New Collection 2026
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-heading text-charcoal leading-[1.1] mb-6">
              Find Your Perfect{' '}
              <span className="text-gradient">Vision Style</span>
            </h1>
            <p className="text-lg text-dark-gray/80 leading-relaxed max-w-lg mb-8">
              Discover premium eyewear crafted for comfort and style. From classic frames to cutting-edge designs, find the perfect pair that defines you.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-accent to-accent-dark text-white font-semibold text-sm shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                Shop Now
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/80 text-charcoal font-semibold text-sm border border-mid-gray/50 shadow-sm hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 mt-12 pt-8 border-t border-mid-gray/40">
              {[
                { value: '50K+', label: 'Happy Customers' },
                { value: '2000+', label: 'Premium Frames' },
                { value: '4.9', label: 'Average Rating' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold font-heading text-charcoal">{stat.value}</div>
                  <div className="text-xs text-dark-gray/60 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in hidden lg:block">
            <div className="relative z-10">
              <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-accent/10 border border-white/50">
                <img
                  src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80"
                  alt="Premium eyeglasses"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 glass rounded-2xl px-5 py-4 shadow-xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-charcoal">Free Shipping</div>
                    <div className="text-xs text-dark-gray">On orders over $99</div>
                  </div>
                </div>
              </div>
              {/* Floating card right */}
              <div className="absolute -top-4 -right-4 glass rounded-2xl px-5 py-4 shadow-xl animate-float" style={{ animationDelay: '2s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-charcoal">Top Rated</div>
                    <div className="text-xs text-dark-gray">4.9/5 Stars</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
