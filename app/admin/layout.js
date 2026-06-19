'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';


export default function AdminLayout({ children }) {
  const { admin, logoutAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!admin && !pathname.includes('/admin/login')) {
      router.push('/admin/login');
    }
  }, [admin, router, pathname]);

  if (pathname.includes('/admin/login')) {
    return children;
  }

  if (!admin) return null;

  return (
    <div className="">
      <aside className="">
        <div className="">
          <h2>Optic Zone</h2>
          <p>Admin Dashboard</p>
        </div>
        <nav className="">
          <Link href="/admin" className={`${""} ${pathname === '/admin' ? "" : ''}`}>Dashboard</Link>
          <Link href="/admin/products" className={`${""} ${pathname.includes('/admin/products') ? "" : ''}`}>Products</Link>
          <Link href="/admin/orders" className={`${""} ${pathname.includes('/admin/orders') ? "" : ''}`}>Orders</Link>
          <Link href="/admin/customers" className={`${""} ${pathname.includes('/admin/customers') ? "" : ''}`}>Customers</Link>
          <Link href="/admin/appointments" className={`${""} ${pathname.includes('/admin/appointments') ? "" : ''}`}>Appointments</Link>
        </nav>
        <button className="" onClick={() => {
          logoutAdmin();
          router.push('/');
        }}>Logout Admin</button>
      </aside>
      <main className="">
        {children}
      </main>
    </div>
  );
}
