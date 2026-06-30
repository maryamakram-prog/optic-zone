import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { StoreProvider } from '@/context/StoreContext';
import { CartProvider } from '@/context/CartContext';

export const metadata = {
  title: 'Optic Zone — Eyeglasses, Sunglasses & Contact Lenses',
  description: 'Shop premium eyeglasses, sunglasses, contact lenses and more at Optic Zone. Free shipping on orders over $99.',
  keywords: 'eyeglasses, sunglasses, prescription glasses, blue light glasses, contact lenses, optical frames, eyewear',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* DNS prefetch to speed up first Supabase request */}
        <link rel="dns-prefetch" href="https://yudgudwxopooqlmvrujm.supabase.co" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <StoreProvider>
            <CartProvider>
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </CartProvider>
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
