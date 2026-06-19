'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'opticzone_auth_v1';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const { user, admin } = JSON.parse(stored);
        if (user) setUser(user);
        if (admin) setAdmin(admin);
      }
    } catch {}
  }, []);

  const saveToStorage = (u, a) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: u, admin: a }));
    } catch {}
  };

  const loginUser = (email, password) => {
    // Mock login
    const mockUser = { id: 1, name: 'Demo Customer', email };
    setUser(mockUser);
    saveToStorage(mockUser, admin);
    return true;
  };

  const registerUser = (userData) => {
    // Mock register
    const newUser = { id: Date.now(), ...userData };
    setUser(newUser);
    saveToStorage(newUser, admin);
    return true;
  };

  const logoutUser = () => {
    setUser(null);
    saveToStorage(null, admin);
  };

  const updateUser = (userData) => {
    const updated = { ...user, ...userData };
    setUser(updated);
    saveToStorage(updated, admin);
    return true;
  };

  const loginAdmin = (username, password) => {
    // Mock admin login
    if (username === 'admin' && password === 'admin') {
      const mockAdmin = { id: 1, username };
      setAdmin(mockAdmin);
      saveToStorage(user, mockAdmin);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setAdmin(null);
    saveToStorage(user, null);
  };

  return (
    <AuthContext.Provider value={{
      user, admin, loginUser, registerUser, logoutUser, updateUser, loginAdmin, logoutAdmin
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
