'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';


export default function AccountLayout({ children }) {
  const { user, logoutUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="pt-24 pb-20 bg-soft-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-mid-gray/30 mb-6 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-pastel-blue text-white flex items-center justify-center text-2xl font-bold font-heading mx-auto mb-4 shadow-lg shadow-accent/20">
                {user?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <h3 className="font-bold text-charcoal truncate">{user?.first_name} {user?.last_name}</h3>
              <p className="text-xs text-dark-gray/60 truncate mt-1">{user?.email}</p>
            </div>
            <nav className="bg-white p-4 rounded-3xl shadow-sm border border-mid-gray/30 flex flex-col space-y-1">
              <Link href="/account/profile" className="px-4 py-3 text-sm font-semibold text-charcoal hover:bg-pastel-blue-light/30 hover:text-accent rounded-xl transition-all">Profile</Link>
              <Link href="/account/orders" className="px-4 py-3 text-sm font-semibold text-charcoal hover:bg-pastel-blue-light/30 hover:text-accent rounded-xl transition-all">My Orders</Link>
              <Link href="/account/prescriptions" className="px-4 py-3 text-sm font-semibold text-charcoal hover:bg-pastel-blue-light/30 hover:text-accent rounded-xl transition-all">My Prescriptions</Link>
              <Link href="/account/wishlist" className="px-4 py-3 text-sm font-semibold text-charcoal hover:bg-pastel-blue-light/30 hover:text-accent rounded-xl transition-all">My Wishlist</Link>
              <Link href="/account/addresses" className="px-4 py-3 text-sm font-semibold text-charcoal hover:bg-pastel-blue-light/30 hover:text-accent rounded-xl transition-all">Saved Addresses</Link>
              <Link href="/account/tracking" className="px-4 py-3 text-sm font-semibold text-charcoal hover:bg-pastel-blue-light/30 hover:text-accent rounded-xl transition-all">Track Order</Link>
              <div className="my-2 border-t border-mid-gray/30" />
              <button className="px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 text-left rounded-xl transition-all" onClick={() => {
                logoutUser();
                router.push('/');
              }}>Logout</button>
            </nav>
          </aside>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
