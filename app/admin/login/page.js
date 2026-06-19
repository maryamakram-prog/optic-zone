'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';


export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { loginAdmin } = useAuth();
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginAdmin(username, password)) {
      router.push('/admin');
    } else {
      alert("Invalid credentials. Try admin / admin");
    }
  };

  return (
    <div className="">
      <div className="">
        <h1 className="">Admin Login</h1>
        <p className="">Enter your credentials to access the dashboard</p>
        <form className="" onSubmit={handleSubmit}>
          <div className="">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              required 
              placeholder="admin" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          <button type="submit" className="">Login to Dashboard</button>
        </form>
      </div>
    </div>
  );
}
