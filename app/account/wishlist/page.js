'use client';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';

import Link from 'next/link';

export default function WishlistPage() {
  const { products, wishlist } = useStore();

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div>
      <h2 className="">My Wishlist</h2>
      
      {wishlistedProducts.length === 0 ? (
        <div className="emptyState">
          <span className="emptyIcon">❤️</span>
          <h3>Your wishlist is empty</h3>
          <p>Explore our premium collections to find frames that fit your style and face shape.</p>
          <div className="emptyActions">
            <Link href="/products/eyeglasses" className="btn btnPrimary">Shop Eyeglasses</Link>
            <Link href="/products/sunglasses" className="btn btnSecondary">Shop Sunglasses</Link>
          </div>
        </div>
      ) : (
        <div className="wishlistGrid">
          {wishlistedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <style jsx>{`
        .wishlistGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;
        }
        .emptyState {
          text-align: center;
          padding: 4rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .emptyIcon {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: inline-block;
          animation: pulse 2s infinite ease-in-out;
        }
        .emptyState h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          margin-bottom: 0.5rem;
          color: var(--text);
        }
        .emptyState p {
          color: var(--text-secondary);
          max-width: 400px;
          margin-bottom: 2rem;
          font-size: 0.95rem;
        }
        .emptyActions {
          display: flex;
          gap: 1rem;
        }
        .btn {
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }
        .btnPrimary {
          background: var(--primary);
          color: #fff;
        }
        .btnPrimary:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
        }
        .btnSecondary {
          background: var(--bg-secondary);
          color: var(--text);
          border: 1px solid var(--border);
        }
        .btnSecondary:hover {
          background: var(--border);
          transform: translateY(-2px);
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
