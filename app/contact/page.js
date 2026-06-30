export const metadata = {
  title: 'Contact Us — Optic Zone',
  description: 'Get in touch with the Optic Zone team for support, styling advice, or any other inquiries.',
};

export default function ContactPage() {
  return (
    <div className="relative pt-24 pb-20 min-h-screen overflow-hidden bg-gradient-to-br from-soft-white via-pastel-blue-light/20 to-pastel-lavender-light/10">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-pastel-blue/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[600px] h-[600px] bg-pastel-lavender/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-bold tracking-widest uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-soft"></span>
            Get in Touch
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-charcoal tracking-tight mb-4">
            How can we help?
          </h1>
          <p className="text-lg text-dark-gray/80 font-medium leading-relaxed">
            Whether you have a question about a frame, need help with a prescription, or just want styling advice, our team is ready to assist you.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Form Section */}
          <div className="lg:col-span-7">
            <div className="glass p-8 sm:p-12 rounded-[2rem] shadow-2xl shadow-charcoal/5 border border-white/60 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent to-pastel-blue opacity-80" />
              
              <h2 className="text-2xl font-bold font-heading text-charcoal mb-8 tracking-tight">Send us a Message</h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-charcoal/80 mb-2 pl-1">First Name</label>
                    <input 
                      type="text" 
                      placeholder="Jane"
                      className="w-full px-5 py-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-mid-gray/40 focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all outline-none text-charcoal placeholder-dark-gray/40 shadow-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-charcoal/80 mb-2 pl-1">Last Name</label>
                    <input 
                      type="text" 
                      placeholder="Doe"
                      className="w-full px-5 py-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-mid-gray/40 focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all outline-none text-charcoal placeholder-dark-gray/40 shadow-sm" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-charcoal/80 mb-2 pl-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="jane@example.com"
                    className="w-full px-5 py-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-mid-gray/40 focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all outline-none text-charcoal placeholder-dark-gray/40 shadow-sm" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-charcoal/80 mb-2 pl-1">Subject</label>
                  <div className="relative">
                    <select className="w-full px-5 py-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-mid-gray/40 focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all outline-none text-charcoal shadow-sm appearance-none cursor-pointer">
                      <option>Order Status</option>
                      <option>Product Inquiry</option>
                      <option>Returns & Exchanges</option>
                      <option>Prescription Help</option>
                      <option>Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-charcoal/50">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-charcoal/80 mb-2 pl-1">Message</label>
                  <textarea 
                    rows="4" 
                    placeholder="How can we help you today?"
                    className="w-full px-5 py-4 rounded-2xl bg-white/70 backdrop-blur-md border border-mid-gray/40 focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all outline-none text-charcoal placeholder-dark-gray/40 shadow-sm resize-none"
                  ></textarea>
                </div>
                
                <div className="pt-2">
                  <button type="button" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-charcoal text-white font-bold tracking-wide transition-all duration-300 hover:bg-accent hover:shadow-xl hover:shadow-accent/25 hover:-translate-y-1 overflow-hidden group relative">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Send Message
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Info Section */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-center">
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-white shadow-lg shadow-charcoal/5">
              <h3 className="text-xl font-bold font-heading text-charcoal mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">📍</span>
                Headquarters
              </h3>
              <p className="text-dark-gray font-medium leading-relaxed">
                123 Vision Street<br />
                Suite 400<br />
                Eyewear City, CA 90210
              </p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-white shadow-lg shadow-charcoal/5">
              <h3 className="text-xl font-bold font-heading text-charcoal mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">📞</span>
                Contact Info
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-dark-gray/50 uppercase tracking-wider mb-1">Phone</span>
                  <a href="tel:+15551234567" className="text-charcoal font-semibold hover:text-accent transition-colors">+1 (555) 123-4567</a>
                  <span className="text-sm text-dark-gray mt-0.5">Mon-Fri: 9am - 6pm EST</span>
                </div>
                <div className="flex flex-col pt-2">
                  <span className="text-xs font-bold text-dark-gray/50 uppercase tracking-wider mb-1">Email</span>
                  <a href="mailto:support@opticzone.com" className="text-charcoal font-semibold hover:text-accent transition-colors">support@opticzone.com</a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
