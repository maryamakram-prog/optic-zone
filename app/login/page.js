'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginUser } = useAuth();
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginUser(email, password)) {
      router.push('/account/profile');
    }
  };

  return (
    <div className="">
      <div className="">
        <h1 className="">Welcome Back</h1>
        <p className="">Sign in to your Optic Zone account</p>
        <form className="" onSubmit={handleSubmit}>
          <div className="">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              required 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              required 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="">Sign In</button>
        </form>
        <p className="">
          Don't have an account? <Link href="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
