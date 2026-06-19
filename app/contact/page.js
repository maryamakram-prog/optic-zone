export const metadata = {
  title: 'Contact Us — Optic Zone',
  description: 'Get in touch with the Optic Zone team for support, styling advice, or any other inquiries.',
};

export default function ContactPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-accent">Get in Touch</span>
          <h1 className="text-4xl font-bold font-heading text-charcoal mt-2 mb-4">Contact Us</h1>
          <p className="text-dark-gray/70">
            Have a question about a frame? Need help with your prescription? We&apos;re here for you. Fill out the form below or reach out directly.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-black/5 border border-mid-gray/30">
            <h2 className="text-2xl font-bold font-heading text-charcoal mb-6">Send us a Message</h2>
            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-dark-gray mb-1.5">First Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl bg-light-gray border-transparent focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-gray mb-1.5">Last Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl bg-light-gray border-transparent focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-gray mb-1.5">Email Address</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl bg-light-gray border-transparent focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-gray mb-1.5">Subject</label>
                <select className="w-full px-4 py-3 rounded-xl bg-light-gray border-transparent focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all appearance-none">
                  <option>Order Status</option>
                  <option>Product Inquiry</option>
                  <option>Returns & Exchanges</option>
                  <option>Prescription Help</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-gray mb-1.5">Message</label>
                <textarea rows="5" className="w-full px-4 py-3 rounded-xl bg-light-gray border-transparent focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none"></textarea>
              </div>
              <button type="button" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent to-accent-dark text-white font-semibold text-sm shadow-lg shadow-accent/25 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                Send Message
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="space-y-8 lg:pl-8">
            <div>
              <h3 className="text-xl font-bold font-heading text-charcoal mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal">Headquarters</h4>
                    <p className="text-dark-gray/70 text-sm mt-1">123 Vision Street<br />Eyewear City, CA 90210</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal">Phone</h4>
                    <p className="text-dark-gray/70 text-sm mt-1">+1 (555) 123-4567<br />Mon-Fri: 9am - 6pm EST</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal">Email</h4>
                    <p className="text-dark-gray/70 text-sm mt-1">support@opticzone.com<br />wholesale@opticzone.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-64 bg-light-gray rounded-3xl overflow-hidden relative">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-dark-gray/50">
                <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                </svg>
                <span className="text-sm font-medium">Interactive Map</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
