'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { registerUser } = useAuth();
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (registerUser({ name, email, password })) {
      router.push('/account/profile');
    }
  };

  return (
    <div className="">
      <div className="">
        <h1 className="">Create Account</h1>
        <p className="">Join Optic Zone today</p>
        <form className="" onSubmit={handleSubmit}>
          <div className="">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              required 
              placeholder="John Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
          <button type="submit" className="">Create Account</button>
        </form>
        <p className="">
          Already have an account? <Link href="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
