'use client';
import { createContext, useContext, useReducer, useState } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        return { ...state, items: state.items.map(i => i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i) };
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) };
    case 'UPDATE_QTY': {
      if (action.payload.qty < 1) return { ...state, items: state.items.filter(i => i.id !== action.payload.id) };
      return { ...state, items: state.items.map(i => i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i) };
    }
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [coupon, setCoupon] = useState(null); // { code, type, value }

  const addItem = product => dispatch({ type: 'ADD_ITEM', payload: product });
  const removeItem = id => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQty = (id, qty) => dispatch({ type: 'UPDATE_QTY', payload: { id, qty } });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = state.items.reduce((sum, i) => sum + i.qty, 0);
  const shipping = subtotal >= 99 || subtotal === 0 ? 0 : 9.99;
  const tax = subtotal * 0.08;

  let discount = 0;
  if (coupon) {
    if (coupon.type === 'percent') discount = subtotal * (coupon.value / 100);
    else discount = Math.min(coupon.value, subtotal);
  }

  const total = Math.max(0, subtotal - discount + shipping + tax);

  const applyCoupon = (code, storeCoupons) => {
    const found = storeCoupons?.find(c => c.code.toUpperCase() === code.toUpperCase() && c.active);
    if (!found) return { success: false, message: 'Invalid or expired coupon code.' };
    if (subtotal < found.minOrder) return { success: false, message: `Minimum order $${found.minOrder} required.` };
    setCoupon(found);
    return { success: true, message: `Coupon applied! You saved ${found.type === 'percent' ? found.value + '%' : '$' + found.value}` };
  };

  const removeCoupon = () => setCoupon(null);

  return (
    <CartContext.Provider value={{
      items: state.items, addItem, removeItem, updateQty, clearCart,
      subtotal, total, count, shipping, tax, discount, coupon, applyCoupon, removeCoupon,
      // backward compat
      total: total,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
