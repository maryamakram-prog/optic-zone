'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';

const NAV_ITEMS = [
  {
    label: 'Eyeglasses',
    href: '/products?category=eyeglasses',
    mega: [
      { label: 'All Eyeglasses', href: '/products?category=eyeglasses' },
      { label: 'Men\'s Frames', href: '/products?category=eyeglasses&gender=men' },
      { label: 'Women\'s Frames', href: '/products?category=eyeglasses&gender=women' },
      { label: 'Kids\' Frames', href: '/products?category=kids' },
      { label: 'Blue Light Blocking', href: '/products?category=blue-light' },
      { label: 'Reading Glasses', href: '/products?category=reading' },
    ],
  },
  {
    label: 'Sunglasses',
    href: '/products?category=sunglasses',
    mega: [
      { label: 'All Sunglasses', href: '/products?category=sunglasses' },
      { label: 'Men\'s Sunglasses', href: '/products?category=sunglasses&gender=men' },
      { label: 'Women\'s Sunglasses', href: '/products?category=sunglasses&gender=women' },
      { label: 'Sports Sunglasses', href: '/products?category=sport' },
      { label: 'Polarized', href: '/products?category=sunglasses&tag=polarized' },
    ],
  },
  {
    label: 'Contact Lenses',
    href: '/products?category=contact-lenses',
    mega: [
      { label: 'All Contact Lenses', href: '/products?category=contact-lenses' },
      { label: 'Daily Contacts', href: '/products?category=contact-lenses&type=daily' },
      { label: 'Monthly Contacts', href: '/products?category=contact-lenses&type=monthly' },
      { label: 'Colored Contacts', href: '/products?category=contact-lenses&type=color' },
      { label: 'Toric Lenses', href: '/products?category=contact-lenses&type=toric' },
    ],
  },
  { label: 'Sale', href: '/products?isSale=true', badge: 'HOT' },
];

export default function Navbar() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);
  const [promoVisible, setPromoVisible] = useState(true);
  const [insuranceVisible, setInsuranceVisible] = useState(true);
  const [saleBannerVisible, setSaleBannerVisible] = useState(true);
  const menuTimeoutRef = useRef(null);
  const router = useRouter();
  const { count } = useCart();
  const { wishlist, products } = useStore();
  const { user, admin, logoutUser } = useAuth();
  const isLoggedIn = !!(user || admin);
  const accountHref = isLoggedIn ? '/account' : '/login';
  const accountLabel = isLoggedIn ? (user?.first_name || admin?.first_name || 'Account') : 'Sign In';

  const searchResults = searchQuery.trim().length > 1
    ? (products?.filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.brand || '').toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6) || [])
    : [];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuEnter = (label) => {
    clearTimeout(menuTimeoutRef.current);
    setActiveMenu(label);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => setActiveMenu(null), 150);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setSearchOpen(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <>

      {/* Main Header */}
      <header className={`sticky top-0 left-0 right-0 z-40 bg-white transition-all duration-200 ${isScrolled ? 'shadow-md' : 'border-b border-border'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-8 h-8 rounded-lg bg-ebd-blue flex items-center justify-center group-hover:bg-ebd-blue-dark transition-colors">
                <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <span className="text-lg font-bold text-charcoal tracking-tight leading-none block">OpticZone</span>
                <span className="text-[9px] text-text-muted tracking-widest uppercase leading-none">Premium Eyewear</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.mega ? handleMenuEnter(item.label) : null}
                  onMouseLeave={handleMenuLeave}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors duration-150 whitespace-nowrap ${
                      item.badge === 'HOT'
                        ? 'text-sale font-bold hover:bg-red-50'
                        : 'text-charcoal-light hover:text-accent hover:bg-ebd-blue-light'
                    }`}
                  >
                    {item.label}
                    {item.badge && (
                      <span className="text-[9px] font-black bg-sale text-white px-1.5 py-0.5 rounded-full leading-none">
                        {item.badge}
                      </span>
                    )}
                    {item.mega && (
                      <svg className="w-3.5 h-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>

                  {/* Mega Dropdown */}
                  {item.mega && activeMenu === item.label && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-52 bg-white rounded-xl shadow-xl border border-border animate-slide-down z-50 py-2"
                      onMouseEnter={() => handleMenuEnter(item.label)}
                      onMouseLeave={handleMenuLeave}
                    >
                      {item.mega.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block px-4 py-2 text-sm text-charcoal-light hover:bg-ebd-blue-light hover:text-accent transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Search Toggle */}
              <button
                onClick={() => { setSearchOpen(!searchOpen); setSearchQuery(''); }}
                className="p-2.5 rounded-lg text-dark-gray hover:text-accent hover:bg-ebd-blue-light transition-colors cursor-pointer"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>

              {/* Account */}
              <Link
                href={accountHref}
                className="p-2.5 rounded-lg text-dark-gray hover:text-accent hover:bg-ebd-blue-light transition-colors hidden sm:flex items-center gap-1.5"
                aria-label={accountLabel}
                title={accountLabel}
              >
                {isLoggedIn ? (
                  <div className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
                    {(user?.first_name || admin?.first_name || 'U').charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                )}
              </Link>

              {/* Wishlist */}
              <Link
                href="/account/wishlist"
                className="p-2.5 rounded-lg text-dark-gray hover:text-accent hover:bg-ebd-blue-light transition-colors relative hidden sm:flex"
                aria-label="Wishlist"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                {wishlist?.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-sale text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-accent text-white font-semibold text-sm hover:bg-accent-dark transition-colors cursor-pointer"
                aria-label="Cart"
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                </svg>
                <span className="hidden sm:inline">Cart</span>
                {count > 0 && (
                  <span className="w-5 h-5 bg-white text-accent text-[10px] font-bold rounded-full flex items-center justify-center">
                    {count}
                  </span>
                )}
              </Link>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 rounded-lg text-dark-gray hover:text-accent hover:bg-ebd-blue-light transition-colors cursor-pointer ml-1"
                aria-label="Menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="pb-3 animate-slide-down">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="Search by frame style, brand, or category..."
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-border bg-off-white text-charcoal placeholder-text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 text-sm transition-all"
                  autoFocus
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-charcoal transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-border overflow-hidden z-50">
                    <div className="px-4 py-2 border-b border-border bg-off-white">
                      <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">Products</span>
                    </div>
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                          router.push(`/product/${String(product.id).substring(0, 8)}`);
                        }}
                        className="w-full text-left flex items-center gap-3.5 px-4 py-3 hover:bg-ebd-blue-light transition-colors border-b border-light-gray last:border-0"
                      >
                        <div className="w-11 h-11 bg-light-gray rounded-lg overflow-hidden shrink-0">
                          {(product.imageUrl || product.image) ? (
                            <img
                              src={product.imageUrl || product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={e => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-text-muted">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-charcoal text-sm truncate">{product.name}</div>
                          <div className="text-xs text-text-muted capitalize mt-0.5">{product.brand || product.category} · ${product.price}</div>
                        </div>
                        <svg className="w-4 h-4 text-text-muted ml-auto shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setSearchOpen(false);
                        router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                        setSearchQuery('');
                      }}
                      className="w-full text-center py-3 text-sm font-semibold text-accent hover:bg-ebd-blue-light transition-colors"
                    >
                      View all results for "{searchQuery}" →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border animate-slide-down bg-white max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      item.badge === 'HOT' ? 'text-sale' : 'text-charcoal-light hover:bg-ebd-blue-light hover:text-accent'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {item.label}
                      {item.badge && (
                        <span className="text-[9px] font-black bg-sale text-white px-1.5 py-0.5 rounded-full">{item.badge}</span>
                      )}
                    </span>
                    {item.mega && (
                      <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </Link>
                  {item.mega && (
                    <div className="ml-4 mt-1 space-y-0.5">
                      {item.mega.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-4 py-2 text-sm text-text-muted hover:text-accent transition-colors rounded-lg"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-3 border-t border-border flex gap-3">
                <Link href="/account" onClick={() => setMobileOpen(false)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm font-medium text-charcoal-light hover:border-accent hover:text-accent transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" /></svg>
                  Account
                </Link>
                <Link href="/account/wishlist" onClick={() => setMobileOpen(false)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm font-medium text-charcoal-light hover:border-accent hover:text-accent transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                  Wishlist
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
