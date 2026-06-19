'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import Link from 'next/link';


function GlassesIconMini({ color = '#a78bfa' }) {
  return (
    <svg viewBox="0 0 280 100" xmlns="http://www.w3.org/2000/svg" style={{ width: '80px', height: 'auto' }}>
      <ellipse cx="78" cy="50" rx="58" ry="40" fill="none" stroke={color} strokeWidth="6"/>
      <ellipse cx="202" cy="50" rx="58" ry="40" fill="none" stroke={color} strokeWidth="6"/>
      <path d="M136 46 Q140 38 144 46" stroke={color} strokeWidth="5" fill="none"/>
    </svg>
  );
}

export default function StandaloneCartPage() {
  const { items, removeItem, updateQty, subtotal, discount, shipping, tax, total, coupon, applyCoupon, removeCoupon } = useCart();
  const { coupons } = useStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState({ text: '', isError: false });

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

  if (items.length === 0) {
    return (
      <div className="">
        <div className="">
          <span className="">🛒</span>
          <h1 className="">Your Shopping Cart is Empty</h1>
          <p className="">Looks like you haven't added any premium frames to your cart yet.</p>
          <Link href="/products/eyeglasses" className="">
            Shop Eyeglasses
          </Link>
          <Link href="/products/sunglasses" className="">
            Shop Sunglasses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="">Shopping Cart</h1>

      <div className="">
        {/* Left Side: Cart Items Table */}
        <div className="">
          <div className="">
            <span className="">Product</span>
            <span className="">Price</span>
            <span className="">Quantity</span>
            <span className="">Total</span>
          </div>

          <div className="">
            {items.map(item => (
              <div key={item.id} className="">
                <div className="">
                  <div className="">
                    <GlassesIconMini color="#3b82f6" />
                  </div>
                  <div className="">
                    <span className="">{item.brand}</span>
                    <Link href={`/product/${item.id}`} className="">{item.name}</Link>
                    <span className="">Category: {item.category}</span>
                  </div>
                </div>

                <div className="">
                  ${item.price.toFixed(2)}
                </div>

                <div className="">
                  <div className="">
                    <button onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                  </div>
                  <button className="" onClick={() => removeItem(item.id)}>Remove</button>
                </div>

                <div className="">
                  ${(item.price * item.qty).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="">
            <Link href="/products/eyeglasses" className="">
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right Side: Summary Card */}
        <aside className="">
          <div className="">
            <h2 className="">Order Summary</h2>

            {/* Calculations */}
            <div className="">
              <div className="">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className={`${""} ${""}`}>
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>

              <div className="">
                <span>Estimated Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className={`${""} ${""}`}>
                <span>Total</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
            </div>

            {/* Coupon field */}
            <div className="">
              <h3 className="">Apply Coupon</h3>
              {!coupon ? (
                <form onSubmit={handleApplyCoupon} className="">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value)}
                    className=""
                  />
                  <button type="submit" className="">Apply</button>
                </form>
              ) : (
                <div className="">
                  <span>🏷️ <strong>{coupon.code}</strong> applied ({coupon.type === 'percent' ? `${coupon.value}%` : `$${coupon.value}`} off)</span>
                  <button onClick={handleRemoveCoupon} className="">Remove</button>
                </div>
              )}
              {couponMsg.text && (
                <p className={`${""} ${couponMsg.isError ? "" : ""}`}>
                  {couponMsg.text}
                </p>
              )}
            </div>

            <Link href="/checkout" className="">
              Proceed to Checkout →
            </Link>

            <div className="">
              <p className="">🔒 Secure SSL Checkout</p>
              <p className="">🛡️ 30-Day Money Back Guarantee</p>
              <p className="">👓 100% Prescription Accuracy Guarantee</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
