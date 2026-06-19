import Link from 'next/link';

export default function VirtualTryOn() {
  return (
    <section className="section-padding bg-gradient-to-br from-pastel-lavender-light/30 via-soft-white to-pastel-blue-light/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Visual */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-accent/10 to-pastel-blue/10 rounded-3xl p-10 border border-accent/10">
              {/* Camera illustration */}
              <div className="w-full aspect-[4/3] rounded-2xl bg-white/60 border-2 border-dashed border-accent/30 flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                  <svg className="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                  </svg>
                </div>
                <p className="text-sm text-dark-gray/60 font-medium">Point your camera or upload a photo</p>
                <div className="flex gap-3">
                  <button className="px-5 py-2 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent-dark transition-colors">
                    📷 Use Camera
                  </button>
                  <button className="px-5 py-2 rounded-xl bg-white text-charcoal text-xs font-semibold border border-mid-gray/50 hover:bg-light-gray transition-colors">
                    📁 Upload Photo
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-accent">Try Before You Buy</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-charcoal mt-2 mb-5">
              Virtual Try-On Experience
            </h2>
            <p className="text-dark-gray/70 leading-relaxed mb-6">
              Use our cutting-edge AR technology to see how frames look on your face before making a purchase. No guesswork — just confidence.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                'Real-time face tracking technology',
                'Works with thousands of frames',
                'Save & compare your favorites',
                'Share with friends for feedback',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="text-sm text-charcoal">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/virtual-try-on"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-accent to-accent-dark text-white font-semibold text-sm shadow-lg shadow-accent/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Try Glasses Now
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
