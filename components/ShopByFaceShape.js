'use client';

import Link from 'next/link';

const faceShapes = [
  { id: 'oval', name: 'Oval', icon: 'M12 2C8 2 5 6 5 12C5 18 8 22 12 22C16 22 19 18 19 12C19 6 16 2 12 2Z' },
  { id: 'round', name: 'Round', icon: 'M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z' },
  { id: 'square', name: 'Square', icon: 'M5 4C4.44772 4 4 4.44772 4 5V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V5C20 4.44772 19.5523 4 19 4H5Z' },
  { id: 'heart', name: 'Heart', icon: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' },
  { id: 'diamond', name: 'Diamond', icon: 'M12 2L2 12l10 10 10-10L12 2z' },
  { id: 'oblong', name: 'Oblong', icon: 'M8 2h8a4 4 0 014 4v12a4 4 0 01-4 4H8a4 4 0 01-4-4V6a4 4 0 014-4z' },
];

export default function ShopByFaceShape() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-widest uppercase text-accent">Personalized Fit</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-charcoal mt-2">Shop by Face Shape</h2>
          <p className="text-dark-gray/70 mt-3 max-w-md mx-auto">Find the frames that perfectly complement your unique features.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {faceShapes.map((shape) => (
            <Link
              key={shape.id}
              href={`/products?faceShape=${shape.id}`}
              className="group flex flex-col items-center p-6 bg-light-gray/30 rounded-2xl hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-accent/10"
            >
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-md">
                <svg className="w-8 h-8 text-accent/70 group-hover:text-accent" fill="currentColor" viewBox="0 0 24 24">
                  <path d={shape.icon} />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-charcoal group-hover:text-accent transition-colors">{shape.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
