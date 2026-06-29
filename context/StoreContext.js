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
      products: item.products || { name: item.name || 'Premium Frame', brand: item.brand || 'Optic Zone' },
      prescription: item.prescription || item.prescriptions || null
    })),
    items: o.items || (o.order_items || []).map(item => ({
      id: item.product_id,
      name: item.products?.name || item.name || 'Premium Frame',
      brand: item.products?.brand || item.brand || 'Optic Zone',
      price: Number(item.price_at_time) || 0,
      qty: item.quantity,
      prescription: item.prescription || item.prescriptions || null
    }))
  };
};

export function StoreProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [dbSchemaErrors, setDbSchemaErrors] = useState([]);
  const [state, setState] = useState({
    products: [],
    orders: [],
    appointments: [],
    coupons: [],
    reviews: [],
    customers: [],
    wishlist: [],
    recentlyViewed: [],
    lensDiscounts: [],
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
        setIsAdmin(false);
        setState({
          products: staticProducts,
          orders: [],
          appointments: [],
          coupons: staticCoupons,
          reviews: staticReviews,
          customers: [],
          wishlist: localWishlist,
          recentlyViewed: localRecent,
          lensDiscounts: [],
          loading: false
        });
        return;
      }

      try {
        const [
          { data: products },
          { data: reviews },
          { data: coupons },
          { data: lensDiscounts }
        ] = await Promise.all([
          supabase.from('products').select('*').order('id'),
          supabase.from('reviews').select('*').order('created_at', { ascending: false }),
          supabase.from('coupons').select('*'),
          supabase.from('lens_discounts').select('*')
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

          const isUserAdmin = role === 'admin' || session.user.email === 'admin@opticzone.com';
          setIsAdmin(isUserAdmin);

          if (isUserAdmin) {
            const [
              { data: allOrders },
              { data: allAppointments },
              { data: allProfiles }
            ] = await Promise.all([
              supabase.from('orders').select('*, order_items(*, products(*), prescriptions(*))').order('created_at', { ascending: false }),
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
              supabase.from('orders').select('*, order_items(*, products(*), prescriptions(*))').eq('user_id', session.user.id).order('created_at', { ascending: false }),
              supabase.from('appointments').select('*').eq('user_id', session.user.id).order('appointment_date', { ascending: false })
            ]);
            orders = userOrders || [];
            appointments = userAppointments || [];
            try {
              const { data: myProfile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
              if (myProfile) customersList = [myProfile];
            } catch {}
          }
        } else {
          setIsAdmin(false);
        }

        // Check for schema mismatches
        const errors = [];
        try {
          const { error: rxError } = await supabase.from('prescriptions').select('id').limit(1);
          if (rxError && (rxError.message.includes('does not exist') || rxError.code === 'PGRST116' || rxError.message.includes('not find'))) {
            errors.push('Table "public.prescriptions" is missing. Please run supabase_update_to_uuid.sql in the Supabase SQL Editor.');
          }
        } catch (e) {
          errors.push('Table "public.prescriptions" is missing.');
        }

        try {
          const { error: hiddenError } = await supabase.from('products').select('is_hidden').limit(1);
          if (hiddenError && (hiddenError.message.includes('is_hidden') || hiddenError.message.includes('schema cache') || hiddenError.message.includes('does not exist') || hiddenError.message.includes('not find'))) {
            errors.push('Column "is_hidden" is missing from the "products" table. Please run supabase_update_to_uuid.sql in the Supabase SQL Editor.');
          }
        } catch (e) {
          errors.push('Column "is_hidden" is missing from table "products".');
        }

        if (products && products[0] && typeof products[0].id === 'number') {
          errors.push('Product ID column type is "integer" instead of "UUID". Please run supabase_update_to_uuid.sql in the Supabase SQL Editor.');
        }
        setDbSchemaErrors(errors);

        setState({
          products: (products && products.length > 0) ? products : staticProducts,
          orders: (orders || []).map(mapOrder),
          appointments: appointments || [],
          coupons: (coupons && coupons.length > 0) ? coupons : staticCoupons,
          reviews: (reviews && reviews.length > 0) ? reviews : staticReviews,
          customers: (customersList && customersList.length > 0) ? customersList.map(c => ({
            ...c,
            name: c.first_name || c.last_name ? `${c.first_name || ''} ${c.last_name || ''}`.trim() : 'Unnamed User'
          })) : [],
          wishlist: localWishlist,
          recentlyViewed: localRecent,
          lensDiscounts: lensDiscounts || [],
          loading: false
        });
      } catch (err) {
        console.error('Error fetching from Supabase, using mock data fallback:', err);
        setIsAdmin(false);
        setDbSchemaErrors([`Failed to query database: ${err.message || 'Database connection error'}. Falling back to offline mock data.`]);
        setState({
          products: staticProducts,
          orders: [],
          appointments: [],
          coupons: staticCoupons,
          reviews: staticReviews,
          customers: [],
          wishlist: localWishlist,
          recentlyViewed: localRecent,
          lensDiscounts: [],
          loading: false
        });
      }
    };

    fetchData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        fetchData();
      } else if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
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
      id: typeof window !== 'undefined' && window.crypto?.randomUUID ? window.crypto.randomUUID() : 'review-' + Date.now(),
      created_at: new Date().toISOString()
    };

    if (!isSupabaseConfigured) {
      setState(prev => ({ ...prev, reviews: [payload, ...prev.reviews] }));
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const dbPayload = {
        product_id: review.productId || review.product_id,
        user_id: session?.user?.id || null,
        user_name: review.user || review.user_name || 'Anonymous',
        rating: review.rating,
        title: review.title,
        body: review.body,
        verified: review.verified || false,
        created_at: new Date().toISOString()
      };
      const { data, error } = await supabase.from('reviews').insert([dbPayload]).select();
      if (!error && data) {
        setState(prev => ({ ...prev, reviews: [data[0], ...prev.reviews] }));
      }
    } catch (e) { console.error(e); }
  };

  const mappedProducts = state.products.map(p => {
    if (p.lens_discount_id && state.lensDiscounts) {
      const discount = state.lensDiscounts.find(ld => ld.id === p.lens_discount_id);
      if (discount) {
        return { ...p, lens_discount: discount };
      }
    }
    return p;
  });

  const visibleProducts = isAdmin ? mappedProducts : mappedProducts.filter(p => !p.is_hidden);

  const value = {
    ...state,
    products: visibleProducts,
    isAdmin,
    settings,
    dbSchemaErrors,
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
          products: { name: i.name, brand: i.brand, image_url: i.imageUrl || i.image },
          prescription: i.prescription || null
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
        
        // Save prescriptions first
        const itemsWithPrescription = [];
        for (const item of orderData.items) {
          let dbPrescriptionId = null;
          if (item.prescription) {
            const rxPayload = {
              user_id: session?.user?.id || null,
              type: item.prescription.type,
              name: item.prescription.name || 'Order Prescription',
              od_sph: item.prescription.od_sph || null,
              od_cyl: item.prescription.od_cyl || null,
              od_axis: item.prescription.od_axis || null,
              od_add: item.prescription.od_add || null,
              os_sph: item.prescription.os_sph || null,
              os_cyl: item.prescription.os_cyl || null,
              os_axis: item.prescription.os_axis || null,
              os_add: item.prescription.os_add || null,
              pd: item.prescription.pd || null,
              notes: item.prescription.notes || null,
              file_url: item.prescription.file_url || null,
              is_saved: false
            };

            const { data: newRx, error: rxError } = await supabase
              .from('prescriptions')
              .insert([rxPayload])
              .select()
              .single();

            if (rxError) {
              console.error('Error inserting prescription for order item:', rxError.message || JSON.stringify(rxError), rxError);
            } else if (newRx) {
              dbPrescriptionId = newRx.id;
            }
          }
          itemsWithPrescription.push({
            ...item,
            dbPrescriptionId
          });
        }

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

        const orderItemsPayload = itemsWithPrescription.map(item => ({
          order_id: newOrder.id,
          product_id: item.id,
          quantity: item.qty,
          price_at_time: item.price,
          prescription_id: item.dbPrescriptionId
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItemsPayload);

        if (itemsError) throw itemsError;

        const { data: fullOrder } = await supabase
          .from('orders')
          .select('*, order_items(*, products(*), prescriptions(*))')
          .eq('id', newOrder.id)
          .single();

        const processedOrder = mapOrder(fullOrder || newOrder);

        setState(prev => ({
          ...prev,
          orders: [processedOrder, ...prev.orders]
        }));

        return { data: processedOrder, error: null };
      } catch (err) {
        console.error('Error inserting order:', err.message || JSON.stringify(err), err);
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

      const { id, created_at, ...cleanProduct } = product;

      if (!isSupabaseConfigured) {
        const newProduct = { 
          id: typeof window !== 'undefined' && window.crypto?.randomUUID ? window.crypto.randomUUID() : 'local-' + Date.now(), 
          is_hidden: false,
          ...cleanProduct 
        };
        setState(prev => ({ ...prev, products: [...prev.products, newProduct] }));
        return { data: [newProduct], error: null };
      }

      try {
        const { data, error } = await supabase.from('products').insert([cleanProduct]).select();
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
        const { id, created_at, ...updates } = product;
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
