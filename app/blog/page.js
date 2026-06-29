import Link from 'next/link';

export const metadata = {
  title: 'Blog — Optic Zone',
  description: 'Read the latest trends, tips, and insights on eyewear, eye health, and fashion from Optic Zone.',
};

export default function BlogPage() {
  const featuredPost = {
    title: "Top 5 Eyewear Trends Taking Over 2026",
    excerpt: "From bold oversized acetates to ultra-minimalist rimless titanium, discover the styles that are defining the future of fashion eyewear this year.",
    date: "June 25, 2026",
    category: "Style",
    imageUrl: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=1200&q=80",
    slug: "#",
  };

  const posts = [
    {
      title: "How to Read Your Glasses Prescription",
      excerpt: "SPH, CYL, AXIS? Deciphering your eye doctor's prescription doesn't have to be confusing. Here is our complete guide.",
      date: "June 18, 2026",
      category: "Education",
      imageUrl: "https://images.unsplash.com/photo-1589828131362-7ce5b61b3658?w=600&q=80",
      slug: "#",
    },
    {
      title: "The Real Benefits of Blue Light Glasses",
      excerpt: "Do blue light blocking lenses actually reduce digital eye strain? We break down the science and benefits of wearing them daily.",
      date: "June 10, 2026",
      category: "Health",
      imageUrl: "https://images.unsplash.com/photo-1508344928928-7137b2f8e1fa?w=600&q=80",
      slug: "#",
    },
    {
      title: "Choosing the Perfect Frames for Your Face Shape",
      excerpt: "Round, square, oval, or heart? Find out which frame styles complement your unique facial features the best.",
      date: "May 28, 2026",
      category: "Style Guide",
      imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80",
      slug: "#",
    },
    {
      title: "Contact Lenses vs. Glasses: Which is Right For You?",
      excerpt: "Weighing the pros and cons of contacts versus traditional spectacles for everyday vision correction.",
      date: "May 15, 2026",
      category: "Advice",
      imageUrl: "https://images.unsplash.com/photo-1590611936760-eeb9bc5937db?w=600&q=80",
      slug: "#",
    },
    {
      title: "How We Design Our Signature Frames",
      excerpt: "Take an exclusive behind-the-scenes look at the craftsmanship and materials that go into every Optic Zone frame.",
      date: "May 2, 2026",
      category: "Behind the Scenes",
      imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
      slug: "#",
    },
    {
      title: "Summer Sunglasses Care Guide",
      excerpt: "Keep your shades scratch-free and pristine all summer long with these essential maintenance tips.",
      date: "April 20, 2026",
      category: "Care",
      imageUrl: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=600&q=80",
      slug: "#",
    },
  ];

  return (
    <div className="pt-24 bg-off-white min-h-screen pb-20">
      {/* Hero */}
      <section className="relative py-16 bg-white overflow-hidden border-b border-mid-gray/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold font-heading text-charcoal mb-4">The Optic Zone Blog</h1>
          <p className="text-lg text-dark-gray/70 max-w-2xl mx-auto">
            Insights, style guides, and eye health tips from our experts.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Featured Post */}
        <Link href={featuredPost.slug} className="group block mb-20">
          <div className="relative rounded-3xl overflow-hidden bg-white shadow-xl flex flex-col md:flex-row border border-mid-gray/30">
            <div className="md:w-1/2 relative h-72 md:h-auto overflow-hidden">
              <img 
                src={featuredPost.imageUrl} 
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                Featured
              </div>
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-light-gray/20">
              <div className="flex items-center gap-3 text-sm text-dark-gray/60 font-medium mb-4 uppercase tracking-wide">
                <span>{featuredPost.category}</span>
                <span>•</span>
                <span>{featuredPost.date}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-charcoal mb-6 group-hover:text-accent transition-colors leading-tight">
                {featuredPost.title}
              </h2>
              <p className="text-lg text-dark-gray/80 leading-relaxed mb-8">
                {featuredPost.excerpt}
              </p>
              <div className="inline-flex items-center gap-2 text-accent font-semibold group-hover:text-accent-dark transition-colors">
                Read Article
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        {/* Post Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.title} href={post.slug} className="group flex flex-col bg-white rounded-3xl border border-mid-gray/30 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
              <div className="relative h-56 overflow-hidden bg-light-gray">
                <img 
                  src={post.imageUrl} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between text-xs text-dark-gray/60 font-semibold mb-3 uppercase tracking-wide">
                  <span className="text-accent">{post.category}</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="text-xl font-bold font-heading text-charcoal mb-3 group-hover:text-accent transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-dark-gray/70 text-sm leading-relaxed mb-6 flex-1">
                  {post.excerpt}
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal group-hover:text-accent transition-colors mt-auto">
                  Read More
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="px-8 py-3.5 bg-white border border-mid-gray text-charcoal font-semibold rounded-xl hover:bg-light-gray transition-colors cursor-pointer">
            Load More Articles
          </button>
        </div>

      </div>
    </div>
  );
}
