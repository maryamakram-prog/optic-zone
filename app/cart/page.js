'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PrescriptionForm from '@/components/PrescriptionForm';

function GlassesIconMini({ color = '#a78bfa' }) {
  return (
    <svg viewBox="0 0 280 100" xmlns="http://www.w3.org/2000/svg" className="w-16 h-auto drop-shadow-md">
      <ellipse cx="78" cy="50" rx="58" ry="40" fill="none" stroke={color} strokeWidth="6"/>
      <ellipse cx="202" cy="50" rx="58" ry="40" fill="none" stroke={color} strokeWidth="6"/>
      <path d="M136 46 Q140 38 144 46" stroke={color} strokeWidth="5" fill="none"/>
    </svg>
  );
}

export default function StandaloneCartPage() {
  const router = useRouter();
  const { items, removeItem, updateQty, updatePrescription, subtotal, discount, shipping, tax, total, coupon, applyCoupon, removeCoupon } = useCart();
  const { coupons } = useStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState({ text: '', isError: false });
  const [mounted, setMounted] = useState(false);
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);
  const [selectedCartItemId, setSelectedCartItemId] = useState('');
  const [editingRx, setEditingRx] = useState(null);

  useEffect(() => setMounted(true), []);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput, coupons);
    if (res.success) {
      setCouponMsg({ text: res.message, isError: false });
      setCouponInput('');
    } else {
      setCouponMsg({ text: res.message, isError: true });
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponMsg({ text: 'Coupon removed.', isError: false });
  };

  if (!mounted) return null; // Avoid hydration mismatch

  if (items.length === 0) {
    return (
      <div className="py-20 bg-off-white min-h-[80vh] flex items-center justify-center">
        <div className="text-center p-10 bg-white rounded-3xl shadow-lg max-w-lg border border-border mx-4">
          <span className="text-6xl mb-6 block">🛒</span>
          <h1 className="text-3xl font-bold font-heading text-charcoal mb-4">Your Cart is Empty</h1>
          <p className="text-dark-gray mb-8 leading-relaxed">Looks like you haven't added any frames to your cart yet. Discover your perfect pair today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products?category=eyeglasses" className="px-8 py-3.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark hover:-translate-y-0.5 transition-all">
              Shop Eyeglasses
            </Link>
            <button onClick={() => router.back()} className="px-8 py-3.5 bg-white text-charcoal border border-border font-semibold rounded-xl hover:bg-light-gray transition-all cursor-pointer">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-off-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold font-heading text-charcoal mb-8">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Side: Cart Items Table */}
          <div className="lg:w-2/3 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-mid-gray/30">
            <div className="hidden sm:grid grid-cols-12 gap-4 pb-4 border-b border-mid-gray/40 text-sm font-semibold text-dark-gray uppercase tracking-wider">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            <div className="divide-y divide-mid-gray/30">
              {items.map(item => (
                <div key={item.cartItemId} className="py-6 flex flex-col sm:grid sm:grid-cols-12 gap-6 items-center">
                  <div className="col-span-6 flex items-center gap-6 w-full">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-light-gray/50 flex items-center justify-center p-2 flex-shrink-0">
                      {item.imageUrl || item.image ? (
                        <img 
                          src={item.imageUrl || item.image} 
                          alt={item.name} 
                          loading="lazy"
                          decoding="async"
                          style={{ filter: `hue-rotate(${(item.name.length * 27 + (typeof item.id === 'string' ? item.id.charCodeAt(0) : item.id) * 13) % 360}deg)` }}
                          onError={(e) => { e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="%23f3f4f6"><rect width="100" height="100" fill="%23f3f4f6"/><path d="M20 40 Q35 25 50 40 Q65 25 80 40" stroke="%239ca3af" stroke-width="3" fill="none"/><circle cx="35" cy="55" r="15" stroke="%239ca3af" stroke-width="3" fill="none"/><circle cx="65" cy="55" r="15" stroke="%239ca3af" stroke-width="3" fill="none"/><path d="M42.5 55 L57.5 55" stroke="%239ca3af" stroke-width="3" fill="none"/></svg>'; }}
                          className="w-full h-full object-cover rounded-xl" 
                        />
                      ) : (
                        <GlassesIconMini color="#3b82f6" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-accent tracking-wider uppercase mb-1">{item.brand}</span>
                      <Link href={`/product/${item.id}`} className="text-lg font-bold text-charcoal hover:text-accent transition-colors">
                        {item.name}
                      </Link>
                      <span className="text-sm text-dark-gray mt-1 capitalize">Category: {item.category}</span>
                      {item.lensPackage && (
                        <span className="text-xs text-dark-gray/70 mt-1">Lens: {item.lensPackage}</span>
                      )}
                      {item.lens_discount && item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded uppercase font-bold w-fit mt-1 block shadow-sm">
                          {item.lens_discount.discount_type === 'percentage' 
                            ? `${item.lens_discount.discount_value}% OFF` 
                            : `$${item.lens_discount.discount_value} OFF`}
                        </span>
                      )}

                      {/* Prescription indicator */}
                      {item.lensPackage === 'prescription' && (
                        <div className="mt-2.5 p-2.5 bg-blue-50/40 border border-blue-200/50 rounded-xl max-w-sm">
                          {item.prescription ? (
                            <div className="space-y-1">
                              <span className="text-xs text-green-700 font-bold flex items-center gap-1">
                                ✓ Rx Attached: {item.prescription.name || 'Prescription'}
                              </span>
                              <p className="text-[10px] text-dark-gray leading-normal">
                                {item.prescription.type === 'manual' 
                                  ? `OD SPH ${item.prescription.od_sph} / OS SPH ${item.prescription.os_sph} | PD ${item.prescription.pd}mm` 
                                  : item.prescription.type === 'upload' 
                                    ? 'Uploaded Document' 
                                    : 'Will upload after checkout'}
                              </p>
                              <button 
                                type="button"
                                onClick={() => {
                                  setSelectedCartItemId(item.cartItemId);
                                  setEditingRx(item.prescription);
                                  setIsRxModalOpen(true);
                                }}
                                className="text-[10px] text-accent hover:underline font-bold text-left block cursor-pointer"
                              >
                                Edit Rx Details
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <span className="text-xs text-red-500 font-bold flex items-center gap-1">
                                ⚠️ Missing Prescription
                              </span>
                              <p className="text-[10px] text-dark-gray">Lenses cannot be crafted without Rx details.</p>
                              <button 
                                type="button"
                                onClick={() => {
                                  setSelectedCartItemId(item.cartItemId);
                                  setEditingRx(null);
                                  setIsRxModalOpen(true);
                                }}
                                className="mt-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer inline-block"
                              >
                                Add Prescription
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2 text-center font-medium text-dark-gray hidden sm:block">
                    ${item.price.toFixed(2)}
                    {item.originalPrice && item.originalPrice > item.price && (
                      <div className="text-xs text-dark-gray/50 line-through">${item.originalPrice.toFixed(2)}</div>
                    )}
                  </div>

                  <div className="col-span-2 flex flex-col items-center justify-center w-full sm:w-auto">
                    <div className="flex items-center bg-light-gray rounded-xl border border-mid-gray/50 overflow-hidden">
                      <button onClick={() => updateQty(item.cartItemId, item.qty - 1)} className="px-3 py-1.5 hover:bg-white transition-colors text-charcoal font-medium">−</button>
                      <span className="w-8 text-center font-semibold text-charcoal">{item.qty}</span>
                      <button onClick={() => updateQty(item.cartItemId, item.qty + 1)} className="px-3 py-1.5 hover:bg-white transition-colors text-charcoal font-medium">+</button>
                    </div>
                    <button className="text-xs text-red-500 font-medium mt-3 hover:underline cursor-pointer" onClick={() => removeItem(item.cartItemId)}>Remove</button>
                  </div>

                  <div className="col-span-2 text-right font-bold text-charcoal text-lg w-full sm:w-auto flex justify-between sm:block">
                    <span className="sm:hidden text-dark-gray font-normal text-base">Total:</span>
                    ${(item.price * item.qty).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-mid-gray/40">
              <button onClick={() => router.back()} className="inline-flex items-center text-sm font-semibold text-accent hover:text-accent-dark transition-colors cursor-pointer">
                ← Continue Shopping
              </button>
            </div>
          </div>

          {/* Right Side: Summary Card */}
          <aside className="lg:w-1/3">
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-black/5 border border-mid-gray/30 sticky top-28">
              <h2 className="text-2xl font-bold font-heading text-charcoal mb-6 border-b border-mid-gray/30 pb-4">Order Summary</h2>

              {/* Calculations */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-dark-gray">
                  <span>Subtotal</span>
                  <span className="font-medium text-charcoal">${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-dark-gray">
                  <span>Shipping</span>
                  <span className="font-medium text-charcoal">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>

                <div className="flex justify-between text-dark-gray">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-medium text-charcoal">${tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-mid-gray/40 mt-4">
                  <span className="text-lg font-bold text-charcoal">Total</span>
                  <strong className="text-3xl font-black text-accent">${total.toFixed(2)}</strong>
                </div>
              </div>

              {/* Coupon field */}
              <div className="mb-8 p-5 bg-light-gray/50 rounded-2xl border border-mid-gray/50">
                <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal mb-3">Apply Coupon</h3>
                {!coupon ? (
                  <form onSubmit={handleApplyCoupon} className="relative flex items-center w-full">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value)}
                      className="w-full pl-4 pr-24 py-3 text-sm rounded-xl border border-mid-gray/50 focus:outline-none focus:ring-2 focus:ring-accent/50 bg-white text-charcoal placeholder-dark-gray/50"
                    />
                    <button 
                      type="submit" 
                      className="absolute right-1.5 px-4 py-1.5 bg-charcoal hover:bg-black text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 px-4 py-3 rounded-xl border border-green-200">
                    <span className="text-sm text-green-700">🏷️ <strong>{coupon.code}</strong> applied ({coupon.type === 'percent' ? `${coupon.value}%` : `$${coupon.value}`} off)</span>
                    <button onClick={handleRemoveCoupon} className="text-xs text-green-600 hover:text-green-800 font-bold underline">Remove</button>
                  </div>
                )}
                {couponMsg.text && (
                  <p className={`mt-3 text-xs font-semibold ${couponMsg.isError ? "text-red-500" : "text-green-600"}`}>
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {items.some(item => item.lensPackage === 'prescription' && !item.prescription) ? (
                <div className="space-y-3">
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-semibold leading-relaxed animate-pulse">
                    ⚠️ Prescription details required for one or more frames.
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      const firstMissing = items.find(item => item.lensPackage === 'prescription' && !item.prescription);
                      if (firstMissing) {
                        setSelectedCartItemId(firstMissing.cartItemId);
                        setEditingRx(null);
                        setIsRxModalOpen(true);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold text-lg shadow-md cursor-pointer transition-all"
                  >
                    Configure Prescription to Checkout →
                  </button>
                </div>
              ) : (
                <Link href="/checkout" className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-accent to-pastel-blue hover:to-accent-dark text-white rounded-xl font-bold text-lg shadow-lg shadow-accent/25 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                  Proceed to Checkout →
                </Link>
              )}

              <div className="mt-8 space-y-3 text-xs font-medium text-dark-gray/80">
                <p className="flex items-center gap-2"><span className="text-base">🔒</span> Secure SSL Checkout</p>
                <p className="flex items-center gap-2"><span className="text-base">🛡️</span> 30-Day Money Back Guarantee</p>
                <p className="flex items-center gap-2"><span className="text-base">👓</span> 100% Prescription Accuracy Guarantee</p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <PrescriptionForm
        isOpen={isRxModalOpen}
        onClose={() => {
          setIsRxModalOpen(false);
          setSelectedCartItemId('');
          setEditingRx(null);
        }}
        onSave={(rx) => {
          if (selectedCartItemId) {
            updatePrescription(selectedCartItemId, rx);
          }
        }}
        initialPrescription={editingRx}
      />
    </div>
  );
}
