'use client';
import { createContext, useContext, useReducer, useState, useEffect } from 'react';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'opticzone_cart_v1';

function cartReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return { ...state, items: action.payload || [] };
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(i => 
        i.id === action.payload.id && 
        i.lensPackage === action.payload.lensPackage &&
        JSON.stringify(i.prescription || null) === JSON.stringify(action.payload.prescription || null)
      );
      if (existingIndex > -1) {
        return { 
          ...state, 
          items: state.items.map((i, idx) => idx === existingIndex ? { ...i, qty: i.qty + 1 } : i) 
        };
      }
      const cartItemId = `${action.payload.id}-${action.payload.lensPackage || 'standard'}-${Math.random().toString(36).substring(2, 9)}`;
      return { ...state, items: [...state.items, { ...action.payload, cartItemId, qty: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.cartItemId !== action.payload) };
    case 'UPDATE_QTY': {
      if (action.payload.qty < 1) return { ...state, items: state.items.filter(i => i.cartItemId !== action.payload.cartItemId) };
      return { ...state, items: state.items.map(i => i.cartItemId === action.payload.cartItemId ? { ...i, qty: action.payload.qty } : i) };
    }
    case 'UPDATE_PRESCRIPTION': {
      return {
        ...state,
        items: state.items.map(i => i.cartItemId === action.payload.cartItemId ? { ...i, prescription: action.payload.prescription } : i)
      };
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
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        dispatch({ type: 'INIT', payload: JSON.parse(stored) });
      }
    } catch (err) {}
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    }
  }, [state.items, isInitialized]);

  const addItem = product => dispatch({ type: 'ADD_ITEM', payload: product });
  const removeItem = cartItemId => dispatch({ type: 'REMOVE_ITEM', payload: cartItemId });
  const updateQty = (cartItemId, qty) => dispatch({ type: 'UPDATE_QTY', payload: { cartItemId, qty } });
  const updatePrescription = (cartItemId, prescription) => dispatch({ type: 'UPDATE_PRESCRIPTION', payload: { cartItemId, prescription } });
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
      items: state.items, addItem, removeItem, updateQty, updatePrescription, clearCart,
      subtotal, total, count, shipping, tax, discount, coupon, applyCoupon, removeCoupon
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
