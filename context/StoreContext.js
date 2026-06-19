'use client';
import { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { products as initialProducts } from '@/data/products';

/* ─── Seed Data ─────────────────────────────────────────────────── */

const SEED_ORDERS = [
  {
    id: 'ORD-0001',
    customer: { name: 'Sarah Mitchell', email: 'sarah.m@email.com', phone: '+1 (555) 234-5678', address: '12 Oak Ave, Boston, MA 02101' },
    items: [{ id: 1, name: 'Aviator Classic', brand: 'Ray-Ban', price: 189, qty: 1 }],
    total: 189, status: 'completed', date: '2026-06-10T09:23:00Z',
  },
  {
    id: 'ORD-0002',
    customer: { name: 'James Keller', email: 'james.k@email.com', phone: '+1 (555) 876-5432', address: '5 Maple Dr, New York, NY 10001' },
    items: [{ id: 7, name: 'Monarch Cat-Eye', brand: 'Versace', price: 520, qty: 1 }, { id: 6, name: 'Reader Comfort', brand: 'Fossil', price: 89, qty: 2 }],
    total: 698, status: 'processing', date: '2026-06-15T14:05:00Z',
  },
  {
    id: 'ORD-0003',
    customer: { name: 'Amira Rodriguez', email: 'amira.r@email.com', phone: '+1 (555) 321-9876', address: '88 Birch Ln, Chicago, IL 60601' },
    items: [{ id: 5, name: 'SportShield X', brand: 'Oakley', price: 245, qty: 1 }],
    total: 245, status: 'pending', date: '2026-06-17T11:40:00Z',
  },
  {
    id: 'ORD-0004',
    customer: { name: 'David Chen', email: 'david.c@email.com', phone: '+1 (555) 654-3210', address: '3 Elm St, San Francisco, CA 94102' },
    items: [{ id: 3, name: 'Oxford Slim', brand: 'Gucci', price: 420, qty: 1 }, { id: 4, name: 'Titan Rimless', brand: 'Prada', price: 380, qty: 1 }],
    total: 800, status: 'cancelled', date: '2026-06-12T16:20:00Z',
  },
];

const SEED_APPOINTMENTS = [
  { id: 'APT-0001', firstName: 'Emma', lastName: 'Wilson', email: 'emma.w@email.com', phone: '+1 (555) 111-2222', service: 'eye-test', message: 'First time visitor.', status: 'pending', date: '2026-06-17T09:00:00Z' },
  { id: 'APT-0002', firstName: 'Carlos', lastName: 'Mendez', email: 'carlos.m@email.com', phone: '+1 (555) 333-4444', service: 'prescription', message: 'Need updated prescription.', status: 'approved', date: '2026-06-15T14:30:00Z' },
  { id: 'APT-0003', firstName: 'Priya', lastName: 'Sharma', email: 'priya.s@email.com', phone: '+1 (555) 555-6666', service: 'contact', message: '', status: 'completed', date: '2026-06-10T11:00:00Z' },
  { id: 'APT-0004', firstName: 'Lucas', lastName: 'Park', email: 'lucas.p@email.com', phone: '+1 (555) 777-8888', service: 'sunglasses', message: 'Looking for polarized sunglasses.', status: 'rejected', date: '2026-06-13T15:00:00Z' },
];

const SEED_COUPONS = [
  { id: 1, code: 'WELCOME10', type: 'percent', value: 10, minOrder: 0, maxUses: 1000, used: 42, expiry: '2026-12-31', active: true },
  { id: 2, code: 'SAVE20', type: 'fixed', value: 20, minOrder: 100, maxUses: 500, used: 118, expiry: '2026-09-30', active: true },
  { id: 3, code: 'SUMMER30', type: 'percent', value: 30, minOrder: 200, maxUses: 200, used: 200, expiry: '2026-08-31', active: false },
];

const SEED_REVIEWS = [
  { id: 1, productId: 1, user: 'Sarah M.', rating: 5, title: 'Perfect fit!', body: 'These glasses are exactly what I was looking for. Great quality and fast shipping!', date: '2026-06-08T10:00:00Z', verified: true },
  { id: 2, productId: 1, user: 'John D.', rating: 4, title: 'Stylish and durable', body: 'Love the look. Only minor issue is the nose pads could be softer.', date: '2026-06-01T09:00:00Z', verified: true },
  { id: 3, productId: 2, user: 'Amanda R.', rating: 5, title: 'Classic look', body: 'The Wayfarer never goes out of style. Excellent polarization.', date: '2026-05-28T12:00:00Z', verified: false },
  { id: 4, productId: 3, user: 'Michael T.', rating: 5, title: 'Luxury quality', body: 'You get what you pay for. Absolutely premium frames.', date: '2026-06-10T14:00:00Z', verified: true },
  { id: 5, productId: 5, user: 'Kyle W.', rating: 5, title: 'Best sport glasses', body: 'Used them for cycling and trail running. Zero issues. Prizm lenses are incredible.', date: '2026-06-05T08:00:00Z', verified: true },
];

/* ─── Reducer ────────────────────────────────────────────────────── */

function storeReducer(state, action) {
  switch (action.type) {
    // Products
    case 'ADD_PRODUCT':
      return { ...state, products: [{ ...action.payload, id: Date.now() }, ...state.products] };
    case 'UPDATE_PRODUCT':
      return { ...state, products: state.products.map(p => p.id === action.payload.id ? { ...p, ...action.payload } : p) };
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.payload) };

    // Orders
    case 'ADD_ORDER': {
      const newOrder = { ...action.payload, id: `ORD-${String(state.orders.length + 1).padStart(4, '0')}`, date: new Date().toISOString(), status: 'pending' };
      return { ...state, orders: [newOrder, ...state.orders] };
    }
    case 'UPDATE_ORDER_STATUS':
      return { ...state, orders: state.orders.map(o => o.id === action.payload.id ? { ...o, status: action.payload.status } : o) };

    // Appointments
    case 'ADD_APPOINTMENT': {
      const newApt = { ...action.payload, id: `APT-${String(state.appointments.length + 1).padStart(4, '0')}`, date: new Date().toISOString(), status: 'pending' };
      return { ...state, appointments: [newApt, ...state.appointments] };
    }
    case 'UPDATE_APPOINTMENT_STATUS':
      return { ...state, appointments: state.appointments.map(a => a.id === action.payload.id ? { ...a, status: action.payload.status } : a) };

    // Coupons
    case 'ADD_COUPON':
      return { ...state, coupons: [{ ...action.payload, id: Date.now(), used: 0 }, ...state.coupons] };
    case 'UPDATE_COUPON':
      return { ...state, coupons: state.coupons.map(c => c.id === action.payload.id ? { ...c, ...action.payload } : c) };
    case 'DELETE_COUPON':
      return { ...state, coupons: state.coupons.filter(c => c.id !== action.payload) };

    // Reviews
    case 'ADD_REVIEW':
      return { ...state, reviews: [{ ...action.payload, id: Date.now(), date: new Date().toISOString() }, ...state.reviews] };

    // Wishlist
    case 'TOGGLE_WISHLIST': {
      const id = action.payload;
      const inList = state.wishlist.includes(id);
      return { ...state, wishlist: inList ? state.wishlist.filter(w => w !== id) : [...state.wishlist, id] };
    }

    // Recently Viewed
    case 'ADD_RECENTLY_VIEWED': {
      const id = action.payload;
      const filtered = state.recentlyViewed.filter(r => r !== id);
      return { ...state, recentlyViewed: [id, ...filtered].slice(0, 8) };
    }

    default:
      return state;
  }
}

/* ─── Context ────────────────────────────────────────────────────── */

const StoreContext = createContext(null);
const STORAGE_KEY = 'opticzone_store_v2';

function loadFromStorage() {
  if (typeof window === 'undefined') return null;
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}

function saveToStorage(state) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

export function StoreProvider({ children }) {
  const saved = loadFromStorage();
  const [state, dispatch] = useReducer(storeReducer, {
    products: saved?.products ?? initialProducts,
    orders: saved?.orders ?? SEED_ORDERS,
    appointments: saved?.appointments ?? SEED_APPOINTMENTS,
    coupons: saved?.coupons ?? SEED_COUPONS,
    reviews: saved?.reviews ?? SEED_REVIEWS,
    wishlist: saved?.wishlist ?? [],
    recentlyViewed: saved?.recentlyViewed ?? [],
  });

  useEffect(() => { saveToStorage(state); }, [state]);

  const customers = useMemo(() => {
    const map = {};
    state.orders.forEach(o => {
      const key = o.customer.email;
      if (!map[key]) map[key] = { ...o.customer, orders: [], totalSpent: 0 };
      map[key].orders.push(o);
      map[key].totalSpent += o.total;
    });
    state.appointments.forEach(a => {
      const key = a.email;
      if (!map[key]) map[key] = { name: `${a.firstName} ${a.lastName}`, email: a.email, phone: a.phone, address: '', orders: [], totalSpent: 0 };
    });
    return Object.values(map);
  }, [state.orders, state.appointments]);

  const value = {
    products: state.products, orders: state.orders, appointments: state.appointments,
    coupons: state.coupons, reviews: state.reviews, wishlist: state.wishlist,
    recentlyViewed: state.recentlyViewed, customers,
    // Products
    addProduct: p => dispatch({ type: 'ADD_PRODUCT', payload: p }),
    updateProduct: p => dispatch({ type: 'UPDATE_PRODUCT', payload: p }),
    deleteProduct: id => dispatch({ type: 'DELETE_PRODUCT', payload: id }),
    // Orders
    addOrder: o => dispatch({ type: 'ADD_ORDER', payload: o }),
    updateOrderStatus: (id, status) => dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id, status } }),
    // Appointments
    addAppointment: a => dispatch({ type: 'ADD_APPOINTMENT', payload: a }),
    updateAppointmentStatus: (id, status) => dispatch({ type: 'UPDATE_APPOINTMENT_STATUS', payload: { id, status } }),
    // Coupons
    addCoupon: c => dispatch({ type: 'ADD_COUPON', payload: c }),
    updateCoupon: c => dispatch({ type: 'UPDATE_COUPON', payload: c }),
    deleteCoupon: id => dispatch({ type: 'DELETE_COUPON', payload: id }),
    // Reviews
    addReview: r => dispatch({ type: 'ADD_REVIEW', payload: r }),
    // Wishlist
    toggleWishlist: id => dispatch({ type: 'TOGGLE_WISHLIST', payload: id }),
    // Recently Viewed
    addRecentlyViewed: id => dispatch({ type: 'ADD_RECENTLY_VIEWED', payload: id }),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
