export const metadata = {
  title: 'Careers — Optic Zone',
  description: 'Join Optic Zone and help us revolutionize the eyewear industry. Explore open positions in engineering, optometry, design, and more.',
};

export default function CareersPage() {
  const benefits = [
    { icon: '🩺', title: 'Full Health Coverage', desc: 'Comprehensive medical, dental, and vision for you and your dependents.' },
    { icon: '🏡', title: 'Remote Flexibility', desc: 'Work from anywhere or join us in our beautiful downtown hub.' },
    { icon: '👓', title: 'Free Premium Eyewear', desc: 'Generous annual allowance for frames and custom lenses.' },
    { icon: '🚀', title: 'Growth Budget', desc: '$2,000 annual stipend for courses, conferences, and books.' },
  ];

  const jobs = [
    { department: 'Engineering', title: 'Senior Frontend Engineer', type: 'Full-time', location: 'Remote / US', link: '#' },
    { department: 'Clinical', title: 'Retail Optometrist', type: 'Full-time', location: 'New York, NY', link: '#' },
    { department: 'Marketing', title: 'Growth Marketing Manager', type: 'Full-time', location: 'Remote', link: '#' },
    { department: 'Design', title: 'Product Designer (UI/UX)', type: 'Full-time', location: 'Remote', link: '#' },
  ];

  return (
    <div className="pt-24 bg-off-white min-h-screen pb-20">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-pastel-blue-light/30 to-pastel-lavender-light/20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-400/5 rounded-full blur-[80px]" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <span className="text-xs font-semibold tracking-widest uppercase text-accent">Join Our Team</span>
          <h1 className="text-4xl sm:text-6xl font-bold font-heading text-charcoal mt-3 mb-6">See Your Future <br/>With Optic Zone</h1>
          <p className="text-lg text-dark-gray/80 leading-relaxed max-w-2xl mx-auto">
            We are a collective of visionaries, builders, and clinical experts working to make premium eyewear accessible to everyone. We&apos;d love for you to join us.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-heading text-charcoal mb-4">Perks & Benefits</h2>
            <p className="text-dark-gray/70 max-w-2xl mx-auto">We take care of our team so they can take care of our customers.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-white p-8 rounded-3xl shadow-sm border border-mid-gray/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-charcoal mb-2">{benefit.title}</h3>
                <p className="text-dark-gray/70 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-heading text-charcoal mb-4">Open Positions</h2>
            <p className="text-dark-gray/70">Find your perfect role below.</p>
          </div>
          <div className="space-y-4">
            {jobs.map((job) => (
              <a 
                key={job.title} 
                href={job.link}
                className="group block bg-off-white p-6 rounded-2xl border border-mid-gray/40 hover:border-accent hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-accent uppercase tracking-wider mb-2 block">{job.department}</span>
                    <h3 className="text-xl font-bold text-charcoal group-hover:text-accent transition-colors">{job.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-dark-gray/80 font-medium">
                      <span className="flex items-center gap-1">⏱️ {job.type}</span>
                      <span className="flex items-center gap-1">📍 {job.location}</span>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white text-accent group-hover:bg-accent group-hover:text-white transition-colors shadow-sm">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <div className="mt-12 text-center p-8 bg-light-gray rounded-3xl border border-mid-gray/30">
            <h3 className="text-lg font-bold text-charcoal mb-2">Don&apos;t see a fit?</h3>
            <p className="text-sm text-dark-gray/70 mb-4">We are always looking for talented individuals. Send your resume to careers@opticzone.com</p>
          </div>
        </div>
      </section>
    </div>
  );
}
