'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/context/StoreContext';
import { calculateDiscountedPrice } from '@/lib/discounts';

export default function LensPriceListPage() {
  const { lensDiscounts } = useStore();
  const [lenses, setLenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLenses() {
      try {
        const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
        if (isConfigured) {
          const { data, error } = await supabase.from('lenses').select('*').order('name');
          if (!error && data) {
            setLenses(data);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadLenses();
  }, []);

  if (loading) {
    return <div className="p-10 text-center">Loading Price List...</div>;
  }

  return (
    <div className="bg-white min-h-screen p-8 text-charcoal">
      {/* Print Button (hidden in print mode) */}
      <div className="mb-8 flex justify-end print:hidden">
        <button 
          onClick={() => window.print()}
          className="px-6 py-2 bg-charcoal text-white font-bold rounded-lg shadow-md hover:bg-black transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print PDF
        </button>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b-2 border-charcoal pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-white font-bold text-2xl">
            OZ
          </div>
          <div>
            <h1 className="text-3xl font-black font-heading tracking-tight">Optic Zone</h1>
            <p className="text-sm font-medium text-dark-gray">Official Lens Price List</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold">Date Generated:</p>
          <p className="text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Table */}
      {lenses.length > 0 ? (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-light-gray">
              <th className="p-3 border border-mid-gray/50 font-bold uppercase text-xs tracking-wider">Lens Name</th>
              <th className="p-3 border border-mid-gray/50 font-bold uppercase text-xs tracking-wider">Brand</th>
              <th className="p-3 border border-mid-gray/50 font-bold uppercase text-xs tracking-wider">Type</th>
              <th className="p-3 border border-mid-gray/50 font-bold uppercase text-xs tracking-wider">Original Price</th>
              <th className="p-3 border border-mid-gray/50 font-bold uppercase text-xs tracking-wider">Discount</th>
              <th className="p-3 border border-mid-gray/50 font-bold uppercase text-xs tracking-wider text-right">Final Price</th>
            </tr>
          </thead>
          <tbody>
            {lenses.map(lens => {
              const discount = lensDiscounts?.find(d => d.id === lens.lens_discount_id);
              const finalPrice = calculateDiscountedPrice(lens.price, discount);
              const isDiscounted = finalPrice < lens.price;

              return (
                <tr key={lens.id} className="hover:bg-off-white">
                  <td className="p-3 border border-mid-gray/50 font-semibold">{lens.name}</td>
                  <td className="p-3 border border-mid-gray/50 text-dark-gray">{lens.brand}</td>
                  <td className="p-3 border border-mid-gray/50 text-xs text-dark-gray uppercase tracking-wider">{lens.lens_type.replace('-', ' ')}</td>
                  <td className="p-3 border border-mid-gray/50 font-medium">Rs. {lens.price.toFixed(2)}</td>
                  <td className="p-3 border border-mid-gray/50 text-purple-700 font-bold">
                    {isDiscounted ? (
                      discount.discount_type === 'percentage' 
                        ? `${discount.discount_value}% OFF` 
                        : `Rs. ${discount.discount_value} OFF`
                    ) : (
                      <span className="text-mid-gray/50 font-normal">None</span>
                    )}
                  </td>
                  <td className="p-3 border border-mid-gray/50 text-right font-black text-lg">
                    Rs. {finalPrice.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-dark-gray py-10">No lenses available in the database.</p>
      )}

      {/* Footer */}
      <div className="mt-12 text-center text-xs text-dark-gray border-t border-mid-gray/50 pt-4">
        <p>Prices are subject to change without prior notice. Valid only on the date of printing.</p>
        <p>© {new Date().getFullYear()} Optic Zone. All rights reserved.</p>
      </div>

      {/* Print Styles injected locally */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
        }
      `}} />
    </div>
  );
}
