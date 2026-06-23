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
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Fetch profile to get role and details
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (profile?.role === 'admin') {
          setAdmin(profile);
        } else {
          setUser(profile || session.user);
        }
      }
      setLoading(false);
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (profile?.role === 'admin') {
          setAdmin(profile);
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
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // The auth state listener will update user/admin state
    return data.user;
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
    await supabase.auth.signOut();
  };

  const updateUser = async (userData) => {
    if (!user?.id) return;
    const { error } = await supabase.from('profiles').update(userData).eq('id', user.id);
    if (error) throw error;
    setUser({ ...user, ...userData });
    return true;
  };

  const loginAdmin = async (email, password) => {
    // Admin login is the same under the hood, but we can verify role afterwards
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  };

  const logoutAdmin = async () => {
    await supabase.auth.signOut();
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
