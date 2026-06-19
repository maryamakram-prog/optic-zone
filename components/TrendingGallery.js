import { trendingImages } from '@/data/siteData';

export default function TrendingGallery() {
  return (
    <section className="section-padding bg-soft-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-widest uppercase text-accent">Trending Now</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-charcoal mt-2">Trending Frames Gallery</h2>
          <p className="text-dark-gray/70 mt-3 max-w-md mx-auto">Explore the hottest styles dominating the eyewear scene right now</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {trendingImages.map((img, i) => (
            <div
              key={img.id}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer ${
                i === 0 || i === 5 ? 'md:row-span-2 aspect-[3/4] md:aspect-auto' : 'aspect-square'
              }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-all duration-500" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
