'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';


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

  const handleSubmit = (e) => {
    e.preventDefault();

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
      qty: i.qty
    }));

    addOrder({
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
    
    // Directing to confirmation page
    router.push('/order-confirmation');
  };

  return (
    <div className="">
      <h1 className="">Checkout</h1>

      <div className="">
        {/* Left Side: Shipping & Billing Form */}
        <form className="" onSubmit={handleSubmit}>
          {user && (
            <div className="">
              <h2 className="">Saved Addresses</h2>
              <div className="">
                <label htmlFor="savedAddress">Select a saved address:</label>
                <select
                  id="savedAddress"
                  value={selectedAddressId}
                  onChange={e => handleAddressChange(e.target.value)}
                  className=""
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

          <div className="">
            <h2 className="">1. Shipping & Billing Information</h2>
            <div className="">
              <div className="">
                <label>First Name</label>
                <input name="firstName" required value={form.firstName} onChange={handleChange} />
              </div>
              <div className="">
                <label>Last Name</label>
                <input name="lastName" required value={form.lastName} onChange={handleChange} />
              </div>
              <div className="">
                <label>Email Address</label>
                <input type="email" name="email" required value={form.email} onChange={handleChange} />
              </div>
              <div className="">
                <label>Phone Number</label>
                <input type="tel" name="phone" required value={form.phone} onChange={handleChange} />
              </div>
              <div className="">
                <label>Country</label>
                <input name="country" required value={form.country} onChange={handleChange} />
              </div>
              <div className="">
                <label>City</label>
                <input name="city" required value={form.city} onChange={handleChange} />
              </div>
              <div className="" style={{ gridColumn: '1 / -1' }}>
                <label>Address</label>
                <input name="address" required value={form.address} onChange={handleChange} />
              </div>
              <div className="">
                <label>Postal Code</label>
                <input name="postalCode" required value={form.postalCode} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="">
            <h2 className="">2. Payment Information</h2>
            <div className="">
              <label className={`${""} ${paymentMethod === 'card' ? "" : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                />
                <span className="">Credit/Debit Card (Demo)</span>
              </label>
              <label className={`${""} ${paymentMethod === 'cod' ? "" : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <span className="">Cash on Delivery (Demo)</span>
              </label>
            </div>

            {paymentMethod === 'card' && (
              <div className="">
                <div className="">
                  <label>Card Number</label>
                  <div className="">
                    <input
                      placeholder="0000 0000 0000 0000"
                      value={cardNum}
                      onChange={e => handleCardNumChange(e.target.value)}
                      required
                    />
                    <div className="">
                      {cardBrand === 'visa' && <span className="">VISA</span>}
                      {cardBrand === 'mastercard' && <span className="">MC</span>}
                      {cardBrand === 'amex' && <span className="">AMEX</span>}
                      {cardBrand === 'discover' && <span className="">DISC</span>}
                      {cardBrand === 'unknown' && <span className="">💳</span>}
                    </div>
                  </div>
                </div>
                <div className="">
                  <div className="">
                    <label>Expiry Date</label>
                    <input
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={e => handleExpiryChange(e.target.value)}
                      required
                    />
                  </div>
                  <div className="">
                    <label>CVV</label>
                    <input
                      placeholder="123"
                      value={cardCvv}
                      onChange={e => handleCvvChange(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button type="submit" className="">
            Complete Secure Payment - ${total.toFixed(2)}
          </button>
        </form>

        {/* Right Side: Order Summary Panel */}
        <aside className="">
          <div className="">
            <h2 className="">Order Summary</h2>
            <div className="">
              {items.map(item => (
                <div key={item.id} className="">
                  <div className="">
                    <span className="">{item.name}</span>
                    <span className="">x{item.qty}</span>
                  </div>
                  <span className="">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="">
              <div className="">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className={`${""} ${""}`}>
                  <span>Coupon Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="">
                <span>Estimated Sales Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className={`${""} ${""}`}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {coupon && (
              <div className="">
                <span>🏷️ Applied Code: <strong>{coupon.code}</strong></span>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
