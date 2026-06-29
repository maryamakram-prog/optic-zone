'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          let profile = null;
          try {
            const { data, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
            if (!error) profile = data;
          } catch (e) {
            console.error('Error fetching profile:', e);
          }

          const isUserAdmin = profile?.role === 'admin' || 
                              session.user.user_metadata?.role === 'admin' || 
                              session.user.email === 'admin@opticzone.com';

          if (isUserAdmin) {
            setAdmin(profile || {
              id: session.user.id,
              email: session.user.email,
              first_name: session.user.user_metadata?.first_name || 'System',
              last_name: session.user.user_metadata?.last_name || 'Admin',
              role: 'admin'
            });
            setUser(null);
          } else {
            setUser(profile || session.user);
            setAdmin(null);
          }
        } else {
          // No user logged in
          setUser(null);
          setAdmin(null);
        }
      } catch (err) {
        console.error('Error in initSession:', err);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        let profile = null;
        try {
          const { data, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
          if (!error) profile = data;
        } catch (e) {
          console.error('Error fetching profile:', e);
        }

        const isUserAdmin = profile?.role === 'admin' || 
                            session.user.user_metadata?.role === 'admin' || 
                            session.user.email === 'admin@opticzone.com';

        if (isUserAdmin) {
          setAdmin(profile || {
            id: session.user.id,
            email: session.user.email,
            first_name: session.user.user_metadata?.first_name || 'System',
            last_name: session.user.user_metadata?.last_name || 'Admin',
            role: 'admin'
          });
          setUser(null);
        } else {
          setUser(profile || session.user);
          setAdmin(null);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setAdmin(null);
      }
    });

    return () => { subscription.unsubscribe(); };
  }, []);

  const loginUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data.user;
    } catch (err) {
      throw err;
    }
  };

  const registerUser = async (userData) => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: 'customer'
        }
      }
    });
    if (error) throw error;
    return data.user;
  };

  const logoutUser = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error(err);
    }
    setUser(null);
    setAdmin(null);
  };

  const updateUser = async (userData) => {
    if (!user?.id) return;
    const { error } = await supabase.from('profiles').update(userData).eq('id', user.id);
    if (error) throw error;
    setUser({ ...user, ...userData });
    return true;
  };

  const loginAdmin = async (email, password) => {
    return loginUser(email, password);
  };

  const logoutAdmin = async () => {
    await logoutUser();
  };

  return (
    <AuthContext.Provider value={{
      user, admin, loading, loginUser, registerUser, logoutUser, updateUser, loginAdmin, logoutAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
