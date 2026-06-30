'use client';
import { createContext, useContext, useEffect, useState, useMemo } from 'react';
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

const getIsSupabaseConfigured = () =>
  !!(process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder'));

export function StoreProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [dbSchemaErrors] = useState([]);

  // ── Public state (loads immediately, no auth needed) ────────────────────
  const [publicState, setPublicState] = useState({
    products: [],
    coupons: [],
    reviews: [],
    lensDiscounts: [],
    publicLoading: true,
  });

  // ── User/admin state (loads after auth resolves) ─────────────────────────
  const [userState, setUserState] = useState({
    orders: [],
    appointments: [],
    customers: [],
    wishlist: [],
    recentlyViewed: [],
  });

  const [settings, setSettings] = useState({
    siteName: 'Optic Zone',
    supportEmail: 'support@opticzone.com',
    freeShippingThreshold: 99,
    taxRate: 8,
    primaryColor: 'default'
  });

  // Load settings and local-stored wishlist/recent on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedSettings = localStorage.getItem(SETTINGS_KEY);
        if (savedSettings) setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Error loading settings:', e);
      }
      let localWishlist = [];
      let localRecent = [];
      try { localWishlist = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch {}
      try { localRecent = JSON.parse(localStorage.getItem(RECENT_KEY)) || []; } catch {}
      setUserState(prev => ({ ...prev, wishlist: localWishlist, recentlyViewed: localRecent }));
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

  // ── PHASE 1: Fetch public data immediately (no auth needed) ──────────────
  useEffect(() => {
    const fetchPublicData = async () => {
      if (!getIsSupabaseConfigured()) {
        setPublicState({
          products: staticProducts,
          coupons: staticCoupons,
          reviews: staticReviews,
          lensDiscounts: [],
          publicLoading: false,
        });
        return;
      }

      // Fetch each table independently so a missing table (e.g. lens_discounts)
      // doesn't cause a Promise.all rejection that kills products/reviews/coupons.
      let products = null, reviews = null, coupons = null, lensDiscounts = [];

      try {
        const { data, error } = await supabase.from('products').select('*').order('id');
        if (!error) {
          products = data
            .filter(p => p.name !== 'Retro Clubmaster' && p.name !== 'Cycling Performance')
            .map(p => {
              if (typeof p.images === 'string') {
                try { p.images = JSON.parse(p.images); } catch(e) { p.images = []; }
              }
              if (p.category === 'contact-lenses') {
                // Use the 13 colored contact lens photos we generated
                const coloredImages = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];
                // Deterministic mapping based on length of name so it's consistent
                const imgIdx = (p.name.length + p.id.toString().charCodeAt(0)) % coloredImages.length;
                const contactImg = `/images/color-contact-${coloredImages[imgIdx]}.png`;
                
                // Add a unique hue rotation so EVERY single product looks like a completely different color
                p.hueRotate = (p.name.length * 27 + (typeof p.id === 'string' ? p.id.charCodeAt(0) : p.id) * 13) % 360;
                
                if (p.imageUrl && p.imageUrl.includes('unsplash')) {
                  p.imageUrl = contactImg;
                }
                if (p.images && Array.isArray(p.images)) {
                  p.images = p.images.map(img => (typeof img === 'string' && img.includes('unsplash')) ? contactImg : img);
                }
              }
              return p;
            });
        }
      } catch (e) { console.warn('products fetch failed:', e.message); }

      try {
        const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
        if (!error) reviews = data;
      } catch (e) { console.warn('reviews fetch failed:', e.message); }

      try {
        const { data, error } = await supabase.from('coupons').select('*');
        if (!error) coupons = data;
      } catch (e) { console.warn('coupons fetch failed:', e.message); }

      try {
        const { data, error } = await supabase.from('lens_discounts').select('*');
        if (!error && data) lensDiscounts = data;
        // If table doesn't exist, silently ignore — not critical for browsing
      } catch (e) { console.warn('lens_discounts table unavailable, skipping:', e.message); }

      setPublicState({
        products: (products && products.length > 0) ? products : staticProducts,
        coupons: (coupons && coupons.length > 0) ? coupons : staticCoupons,
        reviews: (reviews && reviews.length > 0) ? reviews : staticReviews,
        lensDiscounts,
        publicLoading: false,
      });
    };

    fetchPublicData();
  }, []);

  // ── PHASE 2: Fetch user/admin data after auth resolves ───────────────────
  const fetchUserData = async (session) => {
    if (!session || !getIsSupabaseConfigured()) {
      setIsAdmin(false);
      setUserState(prev => ({ ...prev, orders: [], appointments: [], customers: [] }));
      return;
    }

    try {
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
        setUserState(prev => ({
          ...prev,
          orders: (allOrders || []).map(mapOrder),
          appointments: allAppointments || [],
          customers: (allProfiles || []).map(c => ({
            ...c,
            name: c.first_name || c.last_name
              ? `${c.first_name || ''} ${c.last_name || ''}`.trim()
              : 'Unnamed User'
          })),
        }));
      } else {
        const [{ data: userOrders }, { data: userAppointments }] = await Promise.all([
          supabase.from('orders').select('*, order_items(*, products(*), prescriptions(*))').eq('user_id', session.user.id).order('created_at', { ascending: false }),
          supabase.from('appointments').select('*').eq('user_id', session.user.id).order('appointment_date', { ascending: false })
        ]);
        let myProfile = null;
        try {
          const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
          if (data) myProfile = data;
        } catch {}

        setUserState(prev => ({
          ...prev,
          orders: (userOrders || []).map(mapOrder),
          appointments: userAppointments || [],
          customers: myProfile
            ? [{ ...myProfile, name: `${myProfile.first_name || ''} ${myProfile.last_name || ''}`.trim() }]
            : [],
        }));
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setUserState(prev => ({ ...prev, orders: [], appointments: [], customers: [] }));
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!getIsSupabaseConfigured()) return;
      const { data: { session } } = await supabase.auth.getSession();
      await fetchUserData(session);
    };
    init();

    // Only re-fetch user-specific data on auth changes — NOT the full product catalog
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        await fetchUserData(session);
      } else if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
        setUserState(prev => ({ ...prev, orders: [], appointments: [], customers: [] }));
      }
    });

    return () => { subscription.unsubscribe(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Derived state with memoization ───────────────────────────────────────
  const mappedProducts = useMemo(() => {
    return publicState.products.map(p => {
      if (p.lens_discount_id && publicState.lensDiscounts) {
        const discount = publicState.lensDiscounts.find(ld => ld.id === p.lens_discount_id);
        if (discount) return { ...p, lens_discount: discount };
      }
      return p;
    });
  }, [publicState.products, publicState.lensDiscounts]);

  const visibleProducts = useMemo(() => {
    return isAdmin ? mappedProducts : mappedProducts.filter(p => !p.is_hidden);
  }, [mappedProducts, isAdmin]);

  const toggleWishlist = (id) => {
    const inList = userState.wishlist.includes(id);
    const newList = inList ? userState.wishlist.filter(w => w !== id) : [...userState.wishlist, id];
    setUserState(prev => ({ ...prev, wishlist: newList }));
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  };

  const addRecentlyViewed = (id) => {
    const filtered = userState.recentlyViewed.filter(r => r !== id);
    const newList = [id, ...filtered].slice(0, 8);
    setUserState(prev => ({ ...prev, recentlyViewed: newList }));
    if (typeof window !== 'undefined') localStorage.setItem(RECENT_KEY, JSON.stringify(newList));
  };

  const addReview = async (review) => {
    const payload = {
      ...review,
      id: typeof window !== 'undefined' && window.crypto?.randomUUID ? window.crypto.randomUUID() : 'review-' + Date.now(),
      created_at: new Date().toISOString()
    };

    if (!getIsSupabaseConfigured()) {
      setPublicState(prev => ({ ...prev, reviews: [payload, ...prev.reviews] }));
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
        setPublicState(prev => ({ ...prev, reviews: [data[0], ...prev.reviews] }));
      }
    } catch (e) { console.error(e); }
  };

  const value = {
    // Merge public + user state for backward compatibility
    products: visibleProducts,
    orders: userState.orders,
    appointments: userState.appointments,
    coupons: publicState.coupons,
    reviews: publicState.reviews,
    customers: userState.customers,
    wishlist: userState.wishlist,
    recentlyViewed: userState.recentlyViewed,
    lensDiscounts: publicState.lensDiscounts,
    loading: publicState.publicLoading,
    isAdmin,
    settings,
    dbSchemaErrors,
    updateSettings,
    toggleWishlist,
    addRecentlyViewed,
    addReview,

    addOrder: async (orderData) => {
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

      if (!getIsSupabaseConfigured()) {
        setUserState(prev => ({ ...prev, orders: [localPayload, ...prev.orders] }));
        return { data: localPayload, error: null };
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();

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
              .from('prescriptions').insert([rxPayload]).select().single();
            if (rxError) {
              console.error('Error inserting prescription:', rxError.message || JSON.stringify(rxError));
            } else if (newRx) {
              dbPrescriptionId = newRx.id;
            }
          }
          itemsWithPrescription.push({ ...item, dbPrescriptionId });
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
          .from('orders').insert([orderInsertPayload]).select().single();
        if (orderError) throw orderError;

        const orderItemsPayload = itemsWithPrescription.map(item => ({
          order_id: newOrder.id,
          product_id: item.id,
          quantity: item.qty,
          price_at_time: item.price,
          prescription_id: item.dbPrescriptionId
        }));

        const { error: itemsError } = await supabase.from('order_items').insert(orderItemsPayload);
        if (itemsError) throw itemsError;

        const { data: fullOrder } = await supabase
          .from('orders').select('*, order_items(*, products(*), prescriptions(*))').eq('id', newOrder.id).single();

        const processedOrder = mapOrder(fullOrder || newOrder);
        setUserState(prev => ({ ...prev, orders: [processedOrder, ...prev.orders] }));
        return { data: processedOrder, error: null };
      } catch (err) {
        console.error('Error inserting order:', err.message || JSON.stringify(err));
        const guestPayload = { ...localPayload };
        setUserState(prev => ({ ...prev, orders: [guestPayload, ...prev.orders] }));
        return { data: guestPayload, error: err };
      }
    },

    addProduct: async (product) => {
      const { id, created_at, ...cleanProduct } = product;

      if (!getIsSupabaseConfigured()) {
        const newProduct = {
          id: typeof window !== 'undefined' && window.crypto?.randomUUID ? window.crypto.randomUUID() : 'local-' + Date.now(),
          is_hidden: false,
          ...cleanProduct
        };
        setPublicState(prev => ({ ...prev, products: [...prev.products, newProduct] }));
        return { data: [newProduct], error: null };
      }

      try {
        const { data, error } = await supabase.from('products').insert([cleanProduct]).select();
        if (!error && data) {
          setPublicState(prev => ({ ...prev, products: [...prev.products, data[0]] }));
        }
        return { data, error };
      } catch (err) {
        return { data: null, error: err };
      }
    },

    updateProduct: async (product) => {
      if (!getIsSupabaseConfigured()) {
        setPublicState(prev => ({
          ...prev,
          products: prev.products.map(p => p.id === product.id ? product : p)
        }));
        return { data: [product], error: null };
      }

      try {
        const { id, created_at, ...updates } = product;
        const { data, error } = await supabase.from('products').update(updates).eq('id', id).select();
        if (!error && data) {
          setPublicState(prev => ({ ...prev, products: prev.products.map(p => p.id === id ? data[0] : p) }));
        }
        return { data, error };
      } catch (err) {
        return { data: null, error: err };
      }
    },

    deleteProduct: async (id) => {
      if (!getIsSupabaseConfigured()) {
        setPublicState(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
        return { error: null };
      }

      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (!error) {
          setPublicState(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
        }
        return { error };
      } catch (err) {
        return { error: err };
      }
    },

    updateOrderStatus: async (id, status) => {
      if (!getIsSupabaseConfigured()) {
        setUserState(prev => ({
          ...prev,
          orders: prev.orders.map(o => o.id === id ? { ...o, status } : o)
        }));
        return { data: null, error: null };
      }

      try {
        const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select();
        if (!error && data) {
          setUserState(prev => ({
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
      if (!getIsSupabaseConfigured()) {
        const newApt = { id: `apt-${Date.now()}`, ...appointment, status: 'pending' };
        setUserState(prev => ({ ...prev, appointments: [...prev.appointments, newApt] }));
        return { data: [newApt], error: null };
      }

      try {
        const { data, error } = await supabase.from('appointments').insert([appointment]).select();
        if (!error && data) {
          setUserState(prev => ({ ...prev, appointments: [...prev.appointments, data[0]] }));
        }
        return { data, error };
      } catch (err) {
        return { data: null, error: err };
      }
    },

    updateAppointmentStatus: async (id, status) => {
      if (!getIsSupabaseConfigured()) {
        setUserState(prev => ({
          ...prev,
          appointments: prev.appointments.map(a => a.id === id ? { ...a, status } : a)
        }));
        return { data: null, error: null };
      }

      try {
        const { data, error } = await supabase.from('appointments').update({ status }).eq('id', id).select();
        if (!error && data) {
          setUserState(prev => ({ ...prev, appointments: prev.appointments.map(a => a.id === id ? data[0] : a) }));
        }
        return { data, error };
      } catch (err) {
        return { data: null, error: err };
      }
    },

    addCoupon: async (couponData) => {
      if (!getIsSupabaseConfigured()) {
        const newCoupon = { id: Date.now(), ...couponData, active: true };
        setPublicState(prev => ({ ...prev, coupons: [newCoupon, ...prev.coupons] }));
        return { data: newCoupon, error: null };
      }
      try {
        const { data, error } = await supabase.from('coupons').insert([couponData]).select();
        if (error) throw error;
        if (data) setPublicState(prev => ({ ...prev, coupons: [data[0], ...prev.coupons] }));
        return { data: data[0], error: null };
      } catch (err) {
        console.error('Error adding coupon:', err);
        return { data: null, error: err };
      }
    },

    updateCoupon: async (id, updates) => {
      if (!getIsSupabaseConfigured()) {
        setPublicState(prev => ({
          ...prev,
          coupons: prev.coupons.map(c => c.id === id ? { ...c, ...updates } : c)
        }));
        return { error: null };
      }
      try {
        const { error } = await supabase.from('coupons').update(updates).eq('id', id);
        if (error) throw error;
        setPublicState(prev => ({
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
      if (!getIsSupabaseConfigured()) {
        setPublicState(prev => ({ ...prev, coupons: prev.coupons.filter(c => c.id !== id) }));
        return { error: null };
      }
      try {
        const { error } = await supabase.from('coupons').delete().eq('id', id);
        if (error) throw error;
        setPublicState(prev => ({ ...prev, coupons: prev.coupons.filter(c => c.id !== id) }));
        return { error: null };
      } catch (err) {
        console.error('Error deleting coupon:', err);
        return { error: err };
      }
    },

    updateProfileRole: async (profileId, role) => {
      if (!getIsSupabaseConfigured()) {
        setUserState(prev => ({
          ...prev,
          customers: prev.customers.map(c => c.id === profileId ? { ...c, role } : c)
        }));
        return { error: null };
      }
      try {
        const { error } = await supabase.from('profiles').update({ role }).eq('id', profileId);
        if (error) throw error;
        setUserState(prev => ({
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
      if (!getIsSupabaseConfigured()) {
        setUserState(prev => ({ ...prev, customers: prev.customers.filter(c => c.id !== profileId) }));
        return { error: null };
      }
      try {
        const { error } = await supabase.from('profiles').delete().eq('id', profileId);
        if (error) throw error;
        setUserState(prev => ({ ...prev, customers: prev.customers.filter(c => c.id !== profileId) }));
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
