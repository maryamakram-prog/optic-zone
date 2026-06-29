'use client';
import { createContext, useContext, useReducer, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

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
  const [activeUserId, setActiveUserId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const initCart = async () => {
      let localItems = [];
      try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) localItems = JSON.parse(stored);
      } catch (err) {}

      if (user) {
        // Try to fetch DB cart
        const { data: dbCart, error } = await supabase.from('carts').select('*').eq('user_id', user.id).single();
        let mergedItems = [];
        let cartIdToUse = dbCart?.id;

        if (dbCart) {
          mergedItems = [...(dbCart.items || [])];
          if (localItems.length > 0) {
            // Append local items
            mergedItems = [...mergedItems, ...localItems];
            await supabase.from('carts').update({ items: mergedItems }).eq('id', cartIdToUse);
            localStorage.removeItem(CART_STORAGE_KEY);
          }
        } else {
          // Create new cart for user
          const { data: newCart } = await supabase.from('carts').insert({ user_id: user.id, items: localItems }).select().single();
          if (newCart) {
            mergedItems = localItems;
            if (localItems.length > 0) localStorage.removeItem(CART_STORAGE_KEY);
          }
        }

        if (isMounted) {
          dispatch({ type: 'INIT', payload: mergedItems });
          setActiveUserId(user.id);
          setIsInitialized(true);
        }
      } else {
        // Guest user
        if (isMounted) {
          dispatch({ type: 'INIT', payload: localItems });
          setActiveUserId(null);
          setIsInitialized(true);
        }
      }
    };

    initCart();

    return () => { isMounted = false; };
  }, [user]);

  // Sync state changes back to DB or local storage
  useEffect(() => {
    if (!isInitialized) return;
    
    // Prevent syncing to DB until initCart has finished merging for this user
    if (user && activeUserId !== user.id) return;

    if (user) {
      // Sync to DB
      supabase.from('carts').update({ items: state.items }).eq('user_id', user.id).then();
    } else {
      // Prevent syncing guest cart if activeUserId hasn't reset to null yet
      if (activeUserId !== null) return;
      // Sync to local storage
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    }
  }, [state.items, isInitialized, user, activeUserId]);

  const addItem = product => dispatch({ type: 'ADD_ITEM', payload: product });
  const removeItem = cartItemId => dispatch({ type: 'REMOVE_ITEM', payload: cartItemId });
  const updateQty = (cartItemId, qty) => dispatch({ type: 'UPDATE_QTY', payload: { cartItemId, qty } });
  const updatePrescription = (cartItemId, prescription) => dispatch({ type: 'UPDATE_PRESCRIPTION', payload: { cartItemId, prescription } });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = state.items.reduce((sum, i) => sum + i.qty, 0);
  const shipping = subtotal >= 99 || subtotal === 0 ? 0 : 9.99;
  const tax = subtotal * 0.08;

  const calculateApplicableSubtotal = (c) => {
    if (c.applicable_product_id) {
      return state.items.filter(i => i.id === c.applicable_product_id).reduce((sum, i) => sum + i.price * i.qty, 0);
    }
    if (c.applicable_category) {
      return state.items.filter(i => (i.category || '').toLowerCase() === c.applicable_category.toLowerCase()).reduce((sum, i) => sum + i.price * i.qty, 0);
    }
    return subtotal;
  };

  let discount = 0;
  if (coupon) {
    const applicableSubtotal = calculateApplicableSubtotal(coupon);
    if (coupon.type === 'percent') discount = applicableSubtotal * (coupon.value / 100);
    else discount = Math.min(coupon.value, applicableSubtotal);
  }

  const total = Math.max(0, subtotal - discount + shipping + tax);

  const applyCoupon = (code, storeCoupons) => {
    const found = storeCoupons?.find(c => c.code.toUpperCase() === code.toUpperCase() && c.active);
    if (!found) return { success: false, message: 'Invalid or expired coupon code.' };
    
    const applicableSubtotal = calculateApplicableSubtotal(found);
    if (applicableSubtotal === 0) {
      return { success: false, message: 'This coupon is not applicable to any items in your cart.' };
    }
    
    if (subtotal < (found.minOrder || 0)) return { success: false, message: `Minimum order $${found.minOrder || 0} required.` };
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
