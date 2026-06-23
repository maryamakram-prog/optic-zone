'use client';
import { createContext, useContext, useReducer, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { products as staticProducts, reviews as staticReviews } from '@/data/siteData';

const StoreContext = createContext(null);
const STORAGE_KEY = 'opticzone_wishlist_v1';
const RECENT_KEY = 'opticzone_recent_v1';

export function StoreProvider({ children }) {
  const [state, setState] = useState({
    products: [],
    orders: [],
    appointments: [],
    coupons: [],
    reviews: [],
    wishlist: [],
    recentlyViewed: [],
    loading: true,
  });

  useEffect(() => {
    // Load local storage items first (for guest wishlist/recently viewed)
    let localWishlist = [];
    let localRecent = [];
    if (typeof window !== 'undefined') {
      try { localWishlist = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch {}
      try { localRecent = JSON.parse(localStorage.getItem(RECENT_KEY)) || []; } catch {}
    }

    const fetchData = async () => {
      setState(prev => ({ ...prev, loading: true }));
      try {
        const [
          { data: products },
          { data: reviews },
          { data: coupons }
        ] = await Promise.all([
          supabase.from('products').select('*').order('id'),
          supabase.from('reviews').select('*').order('created_at', { ascending: false }),
          supabase.from('coupons').select('*')
        ]);

        // Check if user is logged in to fetch private data
        const { data: { session } } = await supabase.auth.getSession();
        let orders = [];
        let appointments = [];

        if (session) {
          const [
            { data: userOrders },
            { data: userAppointments }
          ] = await Promise.all([
            supabase.from('orders').select('*, order_items(*)').eq('user_id', session.user.id),
            supabase.from('appointments').select('*').eq('user_id', session.user.id)
          ]);
          orders = userOrders || [];
          appointments = userAppointments || [];
        }

        setState({
          products: (products && products.length > 0) ? products : staticProducts,
          orders,
          appointments,
          coupons: coupons || [],
          reviews: (reviews && reviews.length > 0) ? reviews : staticReviews,
          wishlist: localWishlist,
          recentlyViewed: localRecent,
          loading: false
        });
      } catch (err) {
        console.error('Error fetching from Supabase, using mock data fallback:', err);
        setState({
          products: staticProducts,
          orders: [],
          appointments: [],
          coupons: [],
          reviews: staticReviews,
          wishlist: localWishlist,
          recentlyViewed: localRecent,
          loading: false
        });
      }
    };

    fetchData();

    // Listen to auth changes to refetch orders/appointments
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        fetchData();
      }
    });

    return () => { subscription.unsubscribe(); };
  }, []);

  const customers = useMemo(() => {
    // In a real admin panel, this would be a separate secure fetch. 
    return [];
  }, [state.orders, state.appointments]);

  const toggleWishlist = (id) => {
    const inList = state.wishlist.includes(id);
    const newList = inList ? state.wishlist.filter(w => w !== id) : [...state.wishlist, id];
    setState(prev => ({ ...prev, wishlist: newList }));
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  };

  const addRecentlyViewed = (id) => {
    const filtered = state.recentlyViewed.filter(r => r !== id);
    const newList = [id, ...filtered].slice(0, 8);
    setState(prev => ({ ...prev, recentlyViewed: newList }));
    if (typeof window !== 'undefined') localStorage.setItem(RECENT_KEY, JSON.stringify(newList));
  };

  const addReview = async (review) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const payload = {
        ...review,
        user_id: session?.user?.id || null,
        created_at: new Date().toISOString()
      };
      const { data, error } = await supabase.from('reviews').insert([payload]).select();
      if (!error && data) {
        setState(prev => ({ ...prev, reviews: [data[0], ...prev.reviews] }));
      }
    } catch (e) { console.error(e); }
  };

  const value = {
    ...state,
    customers,
    toggleWishlist,
    addRecentlyViewed,
    addReview,
    addOrder: async (orderData) => {
      const isSupabaseConfigured = 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

      const localPayload = {
        id: `ord-${Math.random().toString(36).substring(2, 9)}`,
        created_at: new Date().toISOString(),
        status: 'pending',
        total_amount: orderData.total,
        shipping_address: orderData.customer.address,
        order_items: orderData.items.map(i => ({
          product_id: i.id,
          quantity: i.qty,
          price_at_time: i.price,
          products: { name: i.name, brand: i.brand }
        }))
      };

      if (!isSupabaseConfigured) {
        setState(prev => ({
          ...prev,
          orders: [localPayload, ...prev.orders]
        }));
        return { data: localPayload, error: null };
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const { data: newOrder, error: orderError } = await supabase
          .from('orders')
          .insert([{
            user_id: session?.user?.id || null,
            total_amount: orderData.total,
            status: 'pending',
            shipping_address: orderData.customer.address
          }])
          .select()
          .single();

        if (orderError) throw orderError;

        const orderItemsPayload = orderData.items.map(item => ({
          order_id: newOrder.id,
          product_id: item.id,
          quantity: item.qty,
          price_at_time: item.price
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItemsPayload);

        if (itemsError) throw itemsError;

        // Fetch full order with items
        const { data: fullOrder } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('id', newOrder.id)
          .single();

        setState(prev => ({
          ...prev,
          orders: [fullOrder || newOrder, ...prev.orders]
        }));

        return { data: fullOrder || newOrder, error: null };
      } catch (err) {
        console.error('Error inserting order:', err);
        setState(prev => ({
          ...prev,
          orders: [localPayload, ...prev.orders]
        }));
        return { data: localPayload, error: err };
      }
    },
    addProduct: async (product) => {
      const { data, error } = await supabase.from('products').insert([product]).select();
      if (!error && data) setState(prev => ({ ...prev, products: [...prev.products, data[0]] }));
      return { data, error };
    },
    updateProduct: async (id, updates) => {
      const { data, error } = await supabase.from('products').update(updates).eq('id', id).select();
      if (!error && data) setState(prev => ({ ...prev, products: prev.products.map(p => p.id === id ? data[0] : p) }));
      return { data, error };
    },
    deleteProduct: async (id) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) setState(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
      return { error };
    },
    updateOrderStatus: async (id, status) => {
      const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select();
      if (!error && data) setState(prev => ({ ...prev, orders: prev.orders.map(o => o.id === id ? data[0] : o) }));
      return { data, error };
    },
    addAppointment: async (appointment) => {
      const { data, error } = await supabase.from('appointments').insert([appointment]).select();
      if (!error && data) setState(prev => ({ ...prev, appointments: [...prev.appointments, data[0]] }));
      return { data, error };
    },
    updateAppointmentStatus: async (id, status) => {
      const { data, error } = await supabase.from('appointments').update({ status }).eq('id', id).select();
      if (!error && data) setState(prev => ({ ...prev, appointments: prev.appointments.map(a => a.id === id ? data[0] : a) }));
      return { data, error };
    },
    addCoupon: async () => {},
    updateCoupon: async () => {},
    deleteCoupon: async () => {},
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
