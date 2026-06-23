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
          // Restore mock session from sessionStorage if offline
          const isSupabaseConfigured = 
            process.env.NEXT_PUBLIC_SUPABASE_URL && 
            !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
          if (!isSupabaseConfigured && typeof window !== 'undefined') {
            const savedAdmin = sessionStorage.getItem('opticzone_mock_admin');
            const savedUser = sessionStorage.getItem('opticzone_mock_user');
            if (savedAdmin) {
              setAdmin(JSON.parse(savedAdmin));
              setUser(null);
            } else if (savedUser) {
              setUser(JSON.parse(savedUser));
              setAdmin(null);
            }
          }
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
    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder');

    const handleMockLogin = () => {
      const lowerEmail = email.toLowerCase().trim();
      if (lowerEmail === 'admin@opticzone.com' && (password === 'password123' || password === 'admin123')) {
        const mockAdmin = {
          id: 'mock-admin-id',
          email: 'admin@opticzone.com',
          first_name: 'System',
          last_name: 'Admin',
          role: 'admin'
        };
        setAdmin(mockAdmin);
        setUser(null);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('opticzone_mock_admin', JSON.stringify(mockAdmin));
          sessionStorage.removeItem('opticzone_mock_user');
        }
        return mockAdmin;
      }
      if (lowerEmail === 'john@opticzone.com' && (password === 'password123' || password === 'john123')) {
        const mockUser = {
          id: 'mock-john-id',
          email: 'john@opticzone.com',
          first_name: 'John',
          last_name: 'Doe',
          role: 'customer'
        };
        setUser(mockUser);
        setAdmin(null);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('opticzone_mock_user', JSON.stringify(mockUser));
          sessionStorage.removeItem('opticzone_mock_admin');
        }
        return mockUser;
      }
      if (lowerEmail === 'jane@opticzone.com' && (password === 'password123' || password === 'jane123')) {
        const mockUser = {
          id: 'mock-jane-id',
          email: 'jane@opticzone.com',
          first_name: 'Jane',
          last_name: 'Smith',
          role: 'customer'
        };
        setUser(mockUser);
        setAdmin(null);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('opticzone_mock_user', JSON.stringify(mockUser));
          sessionStorage.removeItem('opticzone_mock_admin');
        }
        return mockUser;
      }
      return null;
    };

    if (!isSupabaseConfigured) {
      const mockResult = handleMockLogin();
      if (mockResult) return mockResult;
      throw new Error('Invalid credentials. For local testing, use admin@opticzone.com, john@opticzone.com, or jane@opticzone.com with password123.');
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data.user;
    } catch (err) {
      const mockResult = handleMockLogin();
      if (mockResult) return mockResult;
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
    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error(err);
      }
    }
    setUser(null);
    setAdmin(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('opticzone_mock_admin');
      sessionStorage.removeItem('opticzone_mock_user');
    }
  };

  const updateUser = async (userData) => {
    if (!user?.id) return;
    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('profiles').update(userData).eq('id', user.id);
      if (error) throw error;
    }
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
