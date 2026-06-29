'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const HERO_SLIDES = [
  {
    badge: '✨ New Arrivals 2026',
    headline: 'See the World\nIn Style',
    sub: 'Premium eyeglasses, sunglasses & contact lenses. Thousands of designer frames from $19.',
    cta: 'Shop Eyeglasses',
    ctaHref: '/products?category=eyeglasses',
    secondary: 'View Collection',
    secondaryHref: '/products?category=eyeglasses',
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=900&q=80',
    video: 'https://videos.pexels.com/video-files/5309381/5309381-uhd_2560_1440_25fps.mp4',
    bg: 'from-[#e8f1f9] to-[#f0f7ff]',
  },
  {
    badge: '☀️ Summer Collection',
    headline: 'Premium\nSunglasses',
    sub: 'Block UV rays in style. Polarized lenses and designer frames available.',
    cta: 'Shop Sunglasses',
    ctaHref: '/products?category=sunglasses',
    secondary: 'View Collection',
    secondaryHref: '/products?category=sunglasses',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900&q=80',
    bg: 'from-[#fff8e1] to-[#fff3cd]',
  },
  {
    badge: '🏷️ Limited Time Offer',
    headline: 'Buy 2 Get 1\nFree',
    sub: 'Mix and match from our entire collection. Free lenses included with every frame purchase.',
    cta: 'Shop the Sale',
    ctaHref: '/products?isSale=true',
    secondary: 'View All Frames',
    secondaryHref: '/products',
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=900&q=80',
    bg: 'from-[#e8f5e9] to-[#f1f8e9]',
  },
];

const TRUST_BADGES = [
  { icon: '🚚', text: 'Free Shipping', sub: 'Orders over $99' },
  { icon: '↩️', text: '30-Day Returns', sub: 'Hassle-free' },
  { icon: '🔒', text: 'Secure Checkout', sub: 'SSL Encrypted' },
  { icon: '👓', text: 'Rx Guaranteed', sub: '100% Accurate' },
];

export default function Hero() {
  const [slide, setSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setSlide(s => (s + 1) % HERO_SLIDES.length);
        setIsAnimating(false);
      }, 300);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const current = HERO_SLIDES[slide];

  return (
    <>
      {/* Hero Section */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${current.bg} transition-all duration-700`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center min-h-[520px] py-12 lg:py-16">
            
            {/* Left — Text */}
            <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 text-accent text-xs font-bold tracking-wider uppercase mb-5 shadow-sm border border-white">
                {current.badge}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-charcoal leading-tight mb-5 whitespace-pre-line">
                {current.headline}
              </h1>
              <p className="text-base text-dark-gray leading-relaxed max-w-md mb-8">
                {current.sub}
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Link
                  href={current.ctaHref}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-dark hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/25 transition-all duration-200"
                >
                  {current.cta}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href={current.secondaryHref}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-charcoal font-semibold text-sm border border-border hover:bg-light-gray hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  {current.secondary}
                </Link>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-6 pt-6 border-t border-white/60">
                {[
                  { value: '50K+', label: 'Happy Customers' },
                  { value: '2,000+', label: 'Frame Styles' },
                  { value: '4.9★', label: 'Average Rating' },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="text-xl font-black text-charcoal font-heading">{stat.value}</div>
                    <div className="text-xs text-text-muted mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Slide Dots */}
              <div className="flex gap-2 mt-8">
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setIsAnimating(true); setTimeout(() => { setSlide(i); setIsAnimating(false); }, 300); }}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${i === slide ? 'w-8 bg-accent' : 'w-2 bg-mid-gray hover:bg-dark-gray'}`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right — Image */}
            <div className="relative hidden md:block">
              <div className={`relative transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                {/* Main image / video */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white/30 border border-white/60 h-[420px]">
                  {current.video ? (
                    <video
                      src={current.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-[420px] object-cover"
                      poster={current.image}
                    />
                  ) : (
                    <img
                      src={current.image}
                      alt="Premium eyewear collection"
                      className="w-full h-[420px] object-cover"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=900&q=80'; }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                </div>



                {/* Floating badge — Offer */}
                <div className="absolute -top-4 -right-4 bg-accent rounded-2xl p-4 shadow-xl text-white" style={{ animationDelay: '2s' }}>
                  <div className="text-2xl font-black">40%</div>
                  <div className="text-xs font-semibold opacity-90">OFF Today</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Bar */}
      <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TRUST_BADGES.map((badge, i) => (
              <div key={i} className="flex items-center gap-2.5 py-1">
                <span className="text-xl">{badge.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-charcoal leading-tight">{badge.text}</div>
                  <div className="text-xs text-text-muted">{badge.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
