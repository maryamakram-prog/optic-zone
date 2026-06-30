'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';



export default function CheckoutPage() {
  const { items, subtotal, discount, shipping, tax, total, coupon, clearCart } = useCart();
  const { addOrder } = useStore();
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    country: 'United States',
    city: '',
    address: '',
    postalCode: ''
  });

  // Derive saved addresses from user profile
  const savedAddresses = user?.address ? [{
    id: 'profile-address',
    label: 'Saved Address',
    firstName: user?.first_name || user?.name?.split(' ')[0] || '',
    lastName: user?.last_name || user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  }] : [];

  const [selectedAddressId, setSelectedAddressId] = useState('');


  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNum, setCardNum] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardBrand, setCardBrand] = useState('unknown');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Autofill address when dropdown changes
  const handleAddressChange = (addrId) => {
    setSelectedAddressId(addrId);
    if (!addrId) return; // Custom address
    const selected = savedAddresses.find(a => a.id === addrId);
    if (selected) {
      setForm(prev => ({
        ...prev,
        firstName: selected.firstName,
        lastName: selected.lastName,
        email: selected.email,
        phone: selected.phone,
        address: selected.address
      }));
    }
  };



  const handleCardNumChange = (val) => {
    // Format card number with spaces
    const clean = val.replace(/\D/g, '').slice(0, 16);
    const formatted = clean.match(/.{1,4}/g)?.join(' ') || '';
    setCardNum(formatted);

    // Basic Brand Detection
    if (clean.startsWith('4')) setCardBrand('visa');
    else if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[0-1]|2720)/.test(clean)) setCardBrand('mastercard');
    else if (clean.startsWith('34') || clean.startsWith('37')) setCardBrand('amex');
    else if (clean.startsWith('6011') || clean.startsWith('65')) setCardBrand('discover');
    else setCardBrand('unknown');
  };

  const handleExpiryChange = (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 3) {
      setCardExpiry(`${clean.slice(0, 2)}/${clean.slice(2)}`);
    } else {
      setCardExpiry(clean);
    }
  };

  const handleCvvChange = (val) => {
    setCardCvv(val.replace(/\D/g, '').slice(0, 4));
  };

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const customer = {
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        phone: form.phone,
        address: `${form.address}, ${form.city}, ${form.country} ${form.postalCode}`
      };

      const orderItems = items.map(i => ({
        id: i.id,
        name: i.name,
        brand: i.brand,
        price: i.price,
        qty: i.qty,
        imageUrl: i.imageUrl || i.image,
        prescription: i.prescription || null
      }));

      const newOrderPayload = {
        customer,
        items: orderItems,
        total,
        couponApplied: coupon ? coupon.code : null,
        paymentMethod,
        shippingCost: shipping,
        taxAmount: tax,
        subtotalAmount: subtotal
      };

      await addOrder(newOrderPayload);

      // Fire and forget email notification
      fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderDetails: newOrderPayload,
          customerEmail: customer.email,
          customerName: customer.name
        })
      }).catch(err => console.error("Email API failed:", err));

      clearCart();
      router.push('/order-confirmation');
    } catch (err) {
      console.error('Checkout error:', err);
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-20 bg-off-white min-h-[80vh] flex items-center justify-center">
        <div className="text-center p-10 bg-white rounded-3xl shadow-lg border border-border max-w-lg mx-4">
          <h1 className="text-3xl font-bold font-heading text-charcoal mb-4">Cart is Empty</h1>
          <p className="text-dark-gray mb-8">You need to add items to your cart before checking out.</p>
          <Link href="/products" className="px-8 py-3.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-all inline-block">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-off-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold font-heading text-charcoal mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Side: Shipping & Billing Form */}
          <form className="lg:w-2/3 bg-white p-8 rounded-3xl shadow-sm border border-mid-gray/30 space-y-10" onSubmit={handleSubmit} autoComplete="off">
            {user && savedAddresses.length > 0 && (
              <div>
                <h2 className="text-xl font-bold font-heading text-charcoal mb-4 border-b border-mid-gray/30 pb-2">Saved Addresses</h2>
                <div>
                  <label htmlFor="savedAddress" className="block text-sm font-semibold text-dark-gray mb-2">Select a saved address:</label>
                  <select
                    id="savedAddress"
                    value={selectedAddressId}
                    onChange={e => handleAddressChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-mid-gray focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">-- Enter Custom Address --</option>
                    {savedAddresses.map(addr => (
                      <option key={addr.id} value={addr.id}>
                        {addr.label} - {addr.address}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-4 border-b border-mid-gray/30 pb-2">1. Shipping & Billing Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-dark-gray mb-1">First Name</label>
                  <input name="firstName" required value={form.firstName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-mid-gray focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark-gray mb-1">Last Name</label>
                  <input name="lastName" required value={form.lastName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-mid-gray focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark-gray mb-1">Email Address</label>
                  <input type="email" name="email" required value={form.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-mid-gray focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark-gray mb-1">Phone Number</label>
                  <input type="tel" name="phone" required value={form.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-mid-gray focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark-gray mb-1">Country</label>
                  <input name="country" required value={form.country} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-mid-gray focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark-gray mb-1">City</label>
                  <input name="city" required value={form.city} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-mid-gray focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-dark-gray mb-1">Address</label>
                  <input name="address" required value={form.address} onChange={handleChange} autoComplete="off" className="w-full px-4 py-3 rounded-xl border border-mid-gray focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-dark-gray mb-1">Postal Code</label>
                  <input name="postalCode" required value={form.postalCode} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-mid-gray focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold font-heading text-charcoal mb-4 border-b border-mid-gray/30 pb-2">2. Payment Information</h2>
              <div className="flex gap-4 mb-6">
                <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'card' ? "border-accent bg-accent/5 text-accent font-semibold" : 'border-mid-gray hover:border-accent/50 text-dark-gray'}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="sr-only"
                  />
                  <span>Credit/Debit Card (Demo)</span>
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'cod' ? "border-accent bg-accent/5 text-accent font-semibold" : 'border-mid-gray hover:border-accent/50 text-dark-gray'}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="sr-only"
                  />
                  <span>Cash on Delivery (Demo)</span>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4 bg-light-gray/30 p-6 rounded-2xl border border-mid-gray/50">
                  <div>
                    <label className="block text-sm font-semibold text-dark-gray mb-1">Card Number</label>
                    <div className="relative">
                      <input
                        placeholder="0000 0000 0000 0000"
                        value={cardNum}
                        onChange={e => handleCardNumChange(e.target.value)}
                        required
                        className="w-full pl-4 pr-12 py-3 rounded-xl border border-mid-gray focus:outline-none focus:ring-2 focus:ring-accent font-mono"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-accent text-sm">
                        {cardBrand === 'visa' && <span>VISA</span>}
                        {cardBrand === 'mastercard' && <span>MC</span>}
                        {cardBrand === 'amex' && <span>AMEX</span>}
                        {cardBrand === 'discover' && <span>DISC</span>}
                        {cardBrand === 'unknown' && <span className="text-xl">💳</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-dark-gray mb-1">Expiry Date</label>
                      <input
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={e => handleExpiryChange(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-mid-gray focus:outline-none focus:ring-2 focus:ring-accent font-mono"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-dark-gray mb-1">CVV</label>
                      <input
                        placeholder="123"
                        value={cardCvv}
                        onChange={e => handleCvvChange(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-mid-gray focus:outline-none focus:ring-2 focus:ring-accent font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-accent to-pastel-blue text-white rounded-xl font-bold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing Payment...' : `Complete Secure Payment - $${total.toFixed(2)}`}
            </button>
          </form>

          {/* Right Side: Order Summary Panel */}
          <aside className="lg:w-1/3">
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-black/5 border border-mid-gray/30 sticky top-28">
              <h2 className="text-xl font-bold font-heading text-charcoal mb-6 border-b border-mid-gray/30 pb-4">Order Summary</h2>
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.cartItemId || item.id} className="flex gap-3 items-center text-sm mb-4 last:mb-0">
                    <div className="w-12 h-12 bg-light-gray rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                      {item.imageUrl || item.image ? (
                        <img 
                          src={item.imageUrl || item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                          loading="lazy"
                          decoding="async"
                          style={{ filter: item.category === 'contact-lenses' ? `hue-rotate(${(item.name.length * 27 + (typeof item.id === 'string' ? item.id.charCodeAt(0) : item.id) * 13) % 360}deg)` : 'none' }}
                          onError={(e) => { e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="%23f3f4f6"><rect width="100" height="100" fill="%23f3f4f6"/><path d="M20 40 Q35 25 50 40 Q65 25 80 40" stroke="%239ca3af" stroke-width="3" fill="none"/><circle cx="35" cy="55" r="15" stroke="%239ca3af" stroke-width="3" fill="none"/><circle cx="65" cy="55" r="15" stroke="%239ca3af" stroke-width="3" fill="none"/><path d="M42.5 55 L57.5 55" stroke="%239ca3af" stroke-width="3" fill="none"/></svg>'; }}
                        />
                      ) : (
                        <span className="text-xs">👓</span>
                      )}
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="font-semibold text-charcoal">{item.name} <span className="text-dark-gray">x{item.qty}</span></span>
                      {item.lensPackage && <span className="text-xs text-dark-gray">Lens: {item.lensPackage}</span>}
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="font-semibold text-charcoal">${(item.price * item.qty).toFixed(2)}</span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-xs text-dark-gray/50 line-through">${(item.originalPrice * item.qty).toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-mid-gray/30 text-sm">
                <div className="flex justify-between text-dark-gray">
                  <span>Subtotal</span>
                  <span className="font-semibold text-charcoal">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-dark-gray">
                  <span>Shipping</span>
                  <span className="font-semibold text-charcoal">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-dark-gray">
                  <span>Estimated Sales Tax (8%)</span>
                  <span className="font-semibold text-charcoal">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-mid-gray/30 mt-4">
                  <span className="text-lg font-bold text-charcoal">Total</span>
                  <span className="text-2xl font-black text-accent">${total.toFixed(2)}</span>
                </div>
              </div>

              {coupon && (
                <div className="mt-6 bg-green-50 px-4 py-3 rounded-xl border border-green-200">
                  <span className="text-sm text-green-700">🏷️ Applied Code: <strong>{coupon.code}</strong></span>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
