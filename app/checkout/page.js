'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const SAVED_ADDRESSES = [
  {
    id: 'addr-1',
    label: 'Home (Default)',
    firstName: 'Sarah',
    lastName: 'Mitchell',
    email: 'sarah.m@email.com',
    phone: '+1 (555) 234-5678',
    country: 'United States',
    city: 'Boston',
    address: '12 Oak Ave',
    postalCode: '02101'
  },
  {
    id: 'addr-2',
    label: 'Office',
    firstName: 'Sarah',
    lastName: 'Mitchell',
    email: 'sarah.m@email.com',
    phone: '+1 (555) 987-6543',
    country: 'United States',
    city: 'New York',
    address: '500 Fifth Ave, Suite 210',
    postalCode: '10110'
  }
];

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
    const selected = SAVED_ADDRESSES.find(a => a.id === addrId);
    if (selected) {
      setForm({
        firstName: selected.firstName,
        lastName: selected.lastName,
        email: selected.email,
        phone: selected.phone,
        country: selected.country,
        city: selected.city,
        address: selected.address,
        postalCode: selected.postalCode
      });
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
        prescription: i.prescription || null
      }));

      await addOrder({
        customer,
        items: orderItems,
        total,
        couponApplied: coupon ? coupon.code : null,
        paymentMethod,
        shippingCost: shipping,
        taxAmount: tax,
        subtotalAmount: subtotal
      });

      clearCart();
      router.push('/order-confirmation');
    } catch (err) {
      console.error('Checkout error:', err);
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-20 bg-soft-white min-h-[80vh] flex items-center justify-center">
        <div className="text-center p-10 bg-white rounded-3xl shadow-xl border border-mid-gray/30 max-w-lg mx-4">
          <h1 className="text-3xl font-bold font-heading text-charcoal mb-4">Cart is Empty</h1>
          <p className="text-dark-gray/80 mb-8">You need to add items to your cart before checking out.</p>
          <Link href="/products" className="px-8 py-3.5 bg-gradient-to-r from-accent to-pastel-blue text-white font-semibold rounded-xl hover:shadow-lg transition-all">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-soft-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold font-heading text-charcoal mb-10">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Side: Shipping & Billing Form */}
          <form className="lg:w-2/3 bg-white p-8 rounded-3xl shadow-sm border border-mid-gray/30 space-y-10" onSubmit={handleSubmit}>
            {user && (
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
                    {SAVED_ADDRESSES.map(addr => (
                      <option key={addr.id} value={addr.id}>
                        {addr.label} - {addr.address}, {addr.city}
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
                  <input name="address" required value={form.address} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-mid-gray focus:outline-none focus:ring-2 focus:ring-accent" />
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
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex flex-col">
                      <span className="font-semibold text-charcoal">{item.name} <span className="text-dark-gray">x{item.qty}</span></span>
                      {item.lensPackage && <span className="text-xs text-dark-gray">Lens: {item.lensPackage}</span>}
                    </div>
                    <span className="font-semibold text-charcoal">${(item.price * item.qty).toFixed(2)}</span>
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
