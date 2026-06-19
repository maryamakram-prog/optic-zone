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
    <div className="">
      <aside className="">
        <div className="">
          <div className="">{user.name.charAt(0)}</div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
        <nav className="">
          <Link href="/account/profile" className="">Profile</Link>
          <Link href="/account/orders" className="">My Orders</Link>
          <Link href="/account/wishlist" className="">My Wishlist</Link>
          <Link href="/account/addresses" className="">Saved Addresses</Link>
          <Link href="/account/tracking" className="">Track Order</Link>
          <button className="" onClick={() => {
            logoutUser();
            router.push('/');
          }}>Logout</button>
        </nav>
      </aside>
      <main className="">
        {children}
      </main>
    </div>
  );
}
