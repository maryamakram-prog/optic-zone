'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { products as staticProducts, reviews as staticReviews } from '@/data/siteData';

const StoreContext = createContext(null);
const STORAGE_KEY = 'opticzone_wishlist_v1';
const RECENT_KEY = 'opticzone_recent_v1';
const SETTINGS_KEY = 'opticzone_settings_v1';

const staticCoupons = [
  { id: 1, code: 'WELCOME10', type: 'percent', value: 10, active: true },
  { id: 2, code: 'SUMMER20', type: 'percent', value: 20, active: true },
  { id: 3, code: 'OP15X', type: 'fixed', value: 15, active: true }
];

const staticCustomers = [
  { id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', email: 'john@opticzone.com', first_name: 'John', last_name: 'Doe', phone: '+1 (555) 123-4567', role: 'customer', address: '12 Oak Ave, Boston, United States' },
  { id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', email: 'jane@opticzone.com', first_name: 'Jane', last_name: 'Smith', phone: '+1 (555) 987-6543', role: 'customer', address: '500 Fifth Ave, Suite 210, New York, United States' },
  { id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', email: 'admin@opticzone.com', first_name: 'System', last_name: 'Admin', phone: '+1 (555) 000-1111', role: 'admin', address: 'Optic Zone Headquarters' }
];

const mapOrder = (o) => {
  if (!o) return null;
  return {
    ...o,
    total: o.total || Number(o.total_amount) || 0,
    date: o.date || o.created_at || new Date().toISOString(),
    customer: o.customer || {
      name: o.customer_name || 'Guest Customer',
      email: o.customer_email || '',
      phone: o.customer_phone || ''
    },
    order_items: (o.order_items || []).map(item => ({
      ...item,
      products: item.products || { name: item.name || 'Premium Frame', brand: item.brand || 'Optic Zone' }
    }))
  };
};

export function StoreProvider({ children }) {
  const [state, setState] = useState({
    products: [],
    orders: [],
    appointments: [],
    coupons: [],
    reviews: [],
    customers: [],
    wishlist: [],
    recentlyViewed: [],
    loading: true,
  });

  const [settings, setSettings] = useState({
    siteName: 'Optic Zone',
    supportEmail: 'support@opticzone.com',
    freeShippingThreshold: 99,
    taxRate: 8,
    primaryColor: 'default'
  });

  // Load settings on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedSettings = localStorage.getItem(SETTINGS_KEY);
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    }
  }, []);

  const updateSettings = (newSettings) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      if (typeof window !== 'undefined') {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  useEffect(() => {
    let localWishlist = [];
    let localRecent = [];
    if (typeof window !== 'undefined') {
      try { localWishlist = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch {}
      try { localRecent = JSON.parse(localStorage.getItem(RECENT_KEY)) || []; } catch {}
    }

    const fetchData = async () => {
      setState(prev => ({ ...prev, loading: true }));
      
      const isSupabaseConfigured = 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

      if (!isSupabaseConfigured) {
        setState({
          products: staticProducts,
          orders: [],
          appointments: [],
          coupons: staticCoupons,
          reviews: staticReviews,
          customers: staticCustomers,
          wishlist: localWishlist,
          recentlyViewed: localRecent,
          loading: false
        });
        return;
      }

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

        const { data: { session } } = await supabase.auth.getSession();
        let orders = [];
        let appointments = [];
        let customersList = [];

        if (session) {
          let role = 'customer';
          try {
            const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
            if (profile?.role) role = profile.role;
          } catch (e) {}

          const isAdmin = role === 'admin' || session.user.email === 'admin@opticzone.com';

          if (isAdmin) {
            const [
              { data: allOrders },
              { data: allAppointments },
              { data: allProfiles }
            ] = await Promise.all([
              supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }),
              supabase.from('appointments').select('*').order('appointment_date', { ascending: false }),
              supabase.from('profiles').select('*')
            ]);
            orders = allOrders || [];
            appointments = allAppointments || [];
            customersList = allProfiles || [];
          } else {
            const [
              { data: userOrders },
              { data: userAppointments }
            ] = await Promise.all([
              supabase.from('orders').select('*, order_items(*)').eq('user_id', session.user.id).order('created_at', { ascending: false }),
              supabase.from('appointments').select('*').eq('user_id', session.user.id).order('appointment_date', { ascending: false })
            ]);
            orders = userOrders || [];
            appointments = userAppointments || [];
            try {
              const { data: myProfile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
              if (myProfile) customersList = [myProfile];
            } catch {}
          }
        }

        setState({
          products: (products && products.length > 0) ? products : staticProducts,
          orders: (orders || []).map(mapOrder),
          appointments: appointments || [],
          coupons: (coupons && coupons.length > 0) ? coupons : staticCoupons,
          reviews: (reviews && reviews.length > 0) ? reviews : staticReviews,
          customers: (customersList && customersList.length > 0) ? customersList.map(c => ({
            ...c,
            name: c.first_name || c.last_name ? `${c.first_name || ''} ${c.last_name || ''}`.trim() : 'Unnamed User'
          })) : staticCustomers,
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
          coupons: staticCoupons,
          reviews: staticReviews,
          customers: staticCustomers,
          wishlist: localWishlist,
          recentlyViewed: localRecent,
          loading: false
        });
      }
    };

    fetchData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        fetchData();
      }
    });

    return () => { subscription.unsubscribe(); };
  }, []);

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
    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
      
    const payload = {
      ...review,
      id: Date.now(),
      created_at: new Date().toISOString()
    };

    if (!isSupabaseConfigured) {
      setState(prev => ({ ...prev, reviews: [payload, ...prev.reviews] }));
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const dbPayload = {
        ...review,
        user_id: session?.user?.id || null,
        created_at: new Date().toISOString()
      };
      const { data, error } = await supabase.from('reviews').insert([dbPayload]).select();
      if (!error && data) {
        setState(prev => ({ ...prev, reviews: [data[0], ...prev.reviews] }));
      }
    } catch (e) { console.error(e); }
  };

  const value = {
    ...state,
    settings,
    updateSettings,
    toggleWishlist,
    addRecentlyViewed,
    addReview,
    addOrder: async (orderData) => {
      const isSupabaseConfigured = 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

      const localId = `ord-${Math.random().toString(36).substring(2, 9)}`;
      const nowString = new Date().toISOString();
      
      const localPayload = {
        id: localId,
        user_id: null,
        total_amount: orderData.total,
        total: orderData.total,
        status: 'pending',
        shipping_address: orderData.customer.address,
        customer_name: orderData.customer.name,
        customer_email: orderData.customer.email,
        customer_phone: orderData.customer.phone,
        customer: orderData.customer,
        created_at: nowString,
        date: nowString,
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
        
        const orderInsertPayload = {
          user_id: session?.user?.id || null,
          total_amount: orderData.total,
          status: 'pending',
          shipping_address: orderData.customer.address,
          customer_name: orderData.customer.name,
          customer_email: orderData.customer.email,
          customer_phone: orderData.customer.phone
        };

        const { data: newOrder, error: orderError } = await supabase
          .from('orders')
          .insert([orderInsertPayload])
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

        const { data: fullOrder } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('id', newOrder.id)
          .single();

        const processedOrder = mapOrder(fullOrder || newOrder);

        setState(prev => ({
          ...prev,
          orders: [processedOrder, ...prev.orders]
        }));

        return { data: processedOrder, error: null };
      } catch (err) {
        console.error('Error inserting order:', err);
        // Fallback to local
        const guestPayload = { ...localPayload };
        setState(prev => ({
          ...prev,
          orders: [guestPayload, ...prev.orders]
        }));
        return { data: guestPayload, error: err };
      }
    },
    
    addProduct: async (product) => {
      const isSupabaseConfigured = 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

      if (!isSupabaseConfigured) {
        const newProduct = { id: Date.now(), ...product };
        setState(prev => ({ ...prev, products: [...prev.products, newProduct] }));
        return { data: [newProduct], error: null };
      }

      try {
        const { data, error } = await supabase.from('products').insert([product]).select();
        if (!error && data) {
          setState(prev => ({ ...prev, products: [...prev.products, data[0]] }));
        }
        return { data, error };
      } catch (err) {
        return { data: null, error: err };
      }
    },

    updateProduct: async (product) => {
      const isSupabaseConfigured = 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

      if (!isSupabaseConfigured) {
        setState(prev => ({
          ...prev,
          products: prev.products.map(p => p.id === product.id ? product : p)
        }));
        return { data: [product], error: null };
      }

      try {
        const { id, ...updates } = product;
        const { data, error } = await supabase.from('products').update(updates).eq('id', id).select();
        if (!error && data) {
          setState(prev => ({ ...prev, products: prev.products.map(p => p.id === id ? data[0] : p) }));
        }
        return { data, error };
      } catch (err) {
        return { data: null, error: err };
      }
    },

    deleteProduct: async (id) => {
      const isSupabaseConfigured = 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

      if (!isSupabaseConfigured) {
        setState(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
        return { error: null };
      }

      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (!error) {
          setState(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
        }
        return { error };
      } catch (err) {
        return { error: err };
      }
    },

    updateOrderStatus: async (id, status) => {
      const isSupabaseConfigured = 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

      if (!isSupabaseConfigured) {
        setState(prev => ({
          ...prev,
          orders: prev.orders.map(o => o.id === id ? { ...o, status } : o)
        }));
        return { data: null, error: null };
      }

      try {
        const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select();
        if (!error && data) {
          setState(prev => ({
            ...prev,
            orders: prev.orders.map(o => o.id === id ? mapOrder({ ...o, ...data[0] }) : o)
          }));
        }
        return { data, error };
      } catch (err) {
        return { data: null, error: err };
      }
    },

    addAppointment: async (appointment) => {
      const isSupabaseConfigured = 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

      if (!isSupabaseConfigured) {
        const newApt = { id: `apt-${Date.now()}`, ...appointment, status: 'pending' };
        setState(prev => ({ ...prev, appointments: [...prev.appointments, newApt] }));
        return { data: [newApt], error: null };
      }

      try {
        const { data, error } = await supabase.from('appointments').insert([appointment]).select();
        if (!error && data) {
          setState(prev => ({ ...prev, appointments: [...prev.appointments, data[0]] }));
        }
        return { data, error };
      } catch (err) {
        return { data: null, error: err };
      }
    },

    updateAppointmentStatus: async (id, status) => {
      const isSupabaseConfigured = 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

      if (!isSupabaseConfigured) {
        setState(prev => ({
          ...prev,
          appointments: prev.appointments.map(a => a.id === id ? { ...a, status } : a)
        }));
        return { data: null, error: null };
      }

      try {
        const { data, error } = await supabase.from('appointments').update({ status }).eq('id', id).select();
        if (!error && data) {
          setState(prev => ({ ...prev, appointments: prev.appointments.map(a => a.id === id ? data[0] : a) }));
        }
        return { data, error };
      } catch (err) {
        return { data: null, error: err };
      }
    },

    addCoupon: async (couponData) => {
      const isSupabaseConfigured = 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
      
      if (!isSupabaseConfigured) {
        const newCoupon = { id: Date.now(), ...couponData, active: true };
        setState(prev => ({ ...prev, coupons: [newCoupon, ...prev.coupons] }));
        return { data: newCoupon, error: null };
      }
      try {
        const { data, error } = await supabase.from('coupons').insert([couponData]).select();
        if (error) throw error;
        if (data) setState(prev => ({ ...prev, coupons: [data[0], ...prev.coupons] }));
        return { data: data[0], error: null };
      } catch (err) {
        console.error('Error adding coupon:', err);
        return { data: null, error: err };
      }
    },

    updateCoupon: async (id, updates) => {
      const isSupabaseConfigured = 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
      
      if (!isSupabaseConfigured) {
        setState(prev => ({
          ...prev,
          coupons: prev.coupons.map(c => c.id === id ? { ...c, ...updates } : c)
        }));
        return { error: null };
      }
      try {
        const { error } = await supabase.from('coupons').update(updates).eq('id', id);
        if (error) throw error;
        setState(prev => ({
          ...prev,
          coupons: prev.coupons.map(c => c.id === id ? { ...c, ...updates } : c)
        }));
        return { error: null };
      } catch (err) {
        console.error('Error updating coupon:', err);
        return { error: err };
      }
    },

    deleteCoupon: async (id) => {
      const isSupabaseConfigured = 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
      
      if (!isSupabaseConfigured) {
        setState(prev => ({
          ...prev,
          coupons: prev.coupons.filter(c => c.id !== id)
        }));
        return { error: null };
      }
      try {
        const { error } = await supabase.from('coupons').delete().eq('id', id);
        if (error) throw error;
        setState(prev => ({
          ...prev,
          coupons: prev.coupons.filter(c => c.id !== id)
        }));
        return { error: null };
      } catch (err) {
        console.error('Error deleting coupon:', err);
        return { error: err };
      }
    },

    updateProfileRole: async (profileId, role) => {
      const isSupabaseConfigured = 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
      
      if (!isSupabaseConfigured) {
        setState(prev => ({
          ...prev,
          customers: prev.customers.map(c => c.id === profileId ? { ...c, role } : c)
        }));
        return { error: null };
      }
      try {
        const { error } = await supabase.from('profiles').update({ role }).eq('id', profileId);
        if (error) throw error;
        setState(prev => ({
          ...prev,
          customers: prev.customers.map(c => c.id === profileId ? { ...c, role } : c)
        }));
        return { error: null };
      } catch (err) {
        console.error('Error updating profile role:', err);
        return { error: err };
      }
    },

    deleteProfile: async (profileId) => {
      const isSupabaseConfigured = 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
      
      if (!isSupabaseConfigured) {
        setState(prev => ({
          ...prev,
          customers: prev.customers.filter(c => c.id !== profileId)
        }));
        return { error: null };
      }
      try {
        const { error } = await supabase.from('profiles').delete().eq('id', profileId);
        if (error) throw error;
        setState(prev => ({
          ...prev,
          customers: prev.customers.filter(c => c.id !== profileId)
        }));
        return { error: null };
      } catch (err) {
        console.error('Error deleting profile:', err);
        return { error: err };
      }
    }
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
