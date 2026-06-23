'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const MENU_ITEMS = [
  { label: '📊 Dashboard', path: '/admin' },
  { label: '📦 Products', path: '/admin/products' },
  { label: '🛒 Orders', path: '/admin/orders' },
  { label: '👥 Users', path: '/admin/customers' },
  { label: '🏷️ Coupons', path: '/admin/coupons' },
  { label: '🖼️ Media Library', path: '/admin/media' },
  { label: '📅 Appointments', path: '/admin/appointments' },
  { label: '⚙️ Settings', path: '/admin/settings' },
];

export default function AdminLayout({ children }) {
  const { admin, logoutAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!admin && !pathname.includes('/admin/login')) {
      router.push('/admin/login');
    }
  }, [admin, router, pathname]);

  if (pathname.includes('/admin/login')) {
    return children;
  }

  if (!admin) return null;

  const handleLogout = () => {
    logoutAdmin();
    router.push('/');
  };

  const isLinkActive = (path) => {
    if (path === '/admin') return pathname === '/admin';
    return pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-soft-white flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <header className="md:hidden h-16 bg-charcoal text-white flex items-center justify-between px-6 fixed top-0 left-0 w-full z-40 border-b border-white/10 shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-xl">👓</span>
          <span className="font-heading font-black text-lg tracking-wider text-gradient">OPTIC ZONE</span>
        </div>
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white focus:outline-none p-1 text-2xl hover:text-accent transition-colors"
          aria-label="Toggle Menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 z-30 transition-opacity backdrop-blur-sm"
        />
      )}

      {/* Sidebar - Desktop and Mobile Drawer */}
      <aside className={`w-64 bg-charcoal text-white fixed top-0 bottom-0 left-0 z-40 border-r border-white/10 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
        mobileOpen ? 'translate-x-0 pt-16' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Sidebar Header (Hidden on Mobile Drawer if header is shown) */}
        <div className="p-6 border-b border-white/10 hidden md:block">
          <Link href="/" className="flex items-center gap-3 mb-2">
            <span className="text-2xl">👓</span>
            <span className="font-heading font-black text-xl tracking-wider bg-gradient-to-r from-accent to-pastel-blue bg-clip-text text-transparent">OPTIC ZONE</span>
          </Link>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-xs font-semibold text-white/60 tracking-wide uppercase">Admin Portal</p>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {MENU_ITEMS.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isLinkActive(item.path)
                  ? 'bg-gradient-to-r from-accent to-accent-dark text-white shadow-md shadow-accent/25'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 bg-black/10">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent">
              {admin.first_name?.[0] || 'A'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white truncate">{admin.first_name} {admin.last_name}</span>
              <span className="text-[10px] text-white/50 truncate">{admin.email}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 text-red-300 hover:text-red-100 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer"
          >
            🚪 Logout Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 md:pl-64 pt-16 md:pt-0">
        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
