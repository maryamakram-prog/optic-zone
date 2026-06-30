'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import GoogleSignInButton from '@/components/GoogleSignInButton';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { registerUser } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerUser(formData);
      router.push('/account');
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-soft-white via-pastel-blue-light/30 to-pastel-lavender-light/20 pt-24 pb-12 px-4">
      {/* Decorative Blobs */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-pastel-lavender/20 rounded-full blur-[100px] animate-pulse-soft" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-pastel-blue/20 rounded-full blur-[100px] animate-pulse-soft" />

      <div className="relative z-10 w-full max-w-lg animate-fade-in-up">
        <div className="glass p-10 sm:p-12 rounded-3xl shadow-2xl shadow-accent/10 border border-white/50 relative overflow-hidden">
          {/* subtle top highlight */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-pastel-blue mx-auto flex items-center justify-center mb-6 shadow-lg shadow-accent/20 rotate-3 hover:rotate-0 transition-transform">
              <span className="text-3xl block -rotate-3 hover:rotate-0 transition-transform">✨</span>
            </div>
            <h1 className="text-3xl font-bold font-heading text-charcoal mb-2 tracking-tight">Create an Account</h1>
            <p className="text-dark-gray/80 font-medium">Join Optic Zone for premium eyewear and exclusive offers.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm text-red-600 text-sm font-semibold rounded-xl border border-red-200/50 flex items-center gap-3 animate-fade-in">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="mb-6">
            <GoogleSignInButton label="Register with Google" />
          </div>

          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-gray/20"></div>
            </div>
            <div className="relative px-4 bg-white/70 backdrop-blur-md text-sm text-dark-gray/60 font-semibold rounded-full">
              OR CONTINUE WITH EMAIL
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="flex-1">
                <label htmlFor="firstName" className="block text-sm font-bold text-charcoal/90 mb-2 pl-1">First Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    id="firstName" 
                    required 
                    placeholder="John" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-5 py-3.5 rounded-xl bg-white/70 backdrop-blur-md border border-white/50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none text-charcoal placeholder-dark-gray/50 shadow-inner"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label htmlFor="lastName" className="block text-sm font-bold text-charcoal/90 mb-2 pl-1">Last Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    id="lastName" 
                    required 
                    placeholder="Doe" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-5 py-3.5 rounded-xl bg-white/70 backdrop-blur-md border border-white/50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none text-charcoal placeholder-dark-gray/50 shadow-inner"
                  />
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-charcoal/90 mb-2 pl-1">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  id="email" 
                  required 
                  placeholder="you@example.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-5 py-3.5 rounded-xl bg-white/70 backdrop-blur-md border border-white/50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none text-charcoal placeholder-dark-gray/50 shadow-inner"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-charcoal/90 mb-2 pl-1">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  id="password" 
                  required 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-5 py-3.5 rounded-xl bg-white/70 backdrop-blur-md border border-white/50 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none text-charcoal placeholder-dark-gray/50 shadow-inner"
                />
              </div>
              <p className="text-xs text-dark-gray/60 mt-2 pl-1 font-medium">Must be at least 6 characters long.</p>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full mt-4 py-4 rounded-xl text-white font-bold text-sm tracking-wide uppercase transition-all duration-300 relative overflow-hidden ${loading ? "bg-mid-gray cursor-not-allowed" : "bg-gradient-to-r from-accent to-accent-dark hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5"}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : 'Register'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-dark-gray/80">
            Already have an account?{' '}
            <Link href="/login" className="text-accent font-bold hover:text-accent-dark transition-colors border-b border-accent/30 hover:border-accent pb-0.5">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
