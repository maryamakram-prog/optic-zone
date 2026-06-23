export const metadata = {
  title: 'About Us — Optic Zone',
  description: 'Learn about Optic Zone, our mission to deliver premium eyewear, and the team behind the brand.',
};

export default function AboutPage() {
  const values = [
    { icon: '💎', title: 'Quality First', desc: 'Only the finest materials and craftsmanship make it into our collection.' },
    { icon: '🌍', title: 'Sustainability', desc: 'Eco-friendly packaging and ethically sourced materials.' },
    { icon: '❤️', title: 'Customer Love', desc: 'We treat every customer like family, going above and beyond.' },
    { icon: '🔬', title: 'Innovation', desc: 'Cutting-edge lens technology for unmatched visual clarity.' },
  ];

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-pastel-blue-light/30 to-pastel-lavender-light/20 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <span className="text-xs font-semibold tracking-widest uppercase text-accent">Our Story</span>
          <h1 className="text-4xl sm:text-5xl font-bold font-heading text-charcoal mt-3 mb-6">About Optic Zone</h1>
          <p className="text-lg text-dark-gray/70 leading-relaxed max-w-2xl mx-auto">
            Founded in 2020, Optic Zone was born from a simple idea: premium eyewear shouldn&apos;t cost a fortune. We bridge the gap between luxury and affordability, delivering frames that look incredible and feel even better.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80"
                alt="Optic Zone store"
                className="w-full h-80 lg:h-96 object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold font-heading text-charcoal mb-5">Our Mission</h2>
              <p className="text-dark-gray/70 leading-relaxed mb-4">
                We believe that clear vision is a right, not a luxury. Our mission is to make stylish, high-quality eyewear accessible to everyone, while providing an unmatched shopping experience.
              </p>
              <p className="text-dark-gray/70 leading-relaxed mb-4">
                With over 2,000 premium frames from world-renowned designers and our own exclusive collections, we offer something for every face shape, style, and budget.
              </p>
              <div className="grid grid-cols-3 gap-6 mt-8">
                {[
                  { num: '50K+', label: 'Happy Customers' },
                  { num: '2000+', label: 'Frame Styles' },
                  { num: '15+', label: 'Countries' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-bold text-accent">{stat.num}</div>
                    <div className="text-xs text-dark-gray/60 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-soft-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading text-charcoal">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-7 border border-mid-gray/20 hover-lift text-center">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-bold font-heading text-charcoal mb-2">{v.title}</h3>
                <p className="text-sm text-dark-gray/60">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
