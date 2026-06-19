import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { StoreProvider } from '@/context/StoreContext';
import { CartProvider } from '@/context/CartContext';

export const metadata = {
  title: 'Optic Zone — Premium Eyewear & Sunglasses',
  description: 'Discover premium eyeglasses, sunglasses, blue light glasses, and contact lenses at Optic Zone. Virtual try-on, free shipping, and expert vision care.',
  keywords: 'eyeglasses, sunglasses, prescription glasses, blue light glasses, contact lenses, optical frames, eyewear',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap"
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
