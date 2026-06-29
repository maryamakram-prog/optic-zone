'use client';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

export default function AddressesPage() {
  const { user, updateUser } = useAuth();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setAddress(user.address || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUser({ address, phone });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to save address.');
    }
    setSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="mb-10">
        <h2 className="text-4xl font-bold font-heading text-charcoal tracking-tight mb-2">Saved Addresses</h2>
        <p className="text-dark-gray/80 font-medium">Manage your default shipping address.</p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-xl shadow-accent/5 border border-white/50">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-charcoal/90 mb-2 pl-1">Primary Shipping Address</label>
            <input 
              value={address} 
              onChange={e => setAddress(e.target.value)} 
              placeholder="e.g. 123 Main St, Springfield, IL 62701" 
              className="w-full px-5 py-3.5 rounded-xl bg-light-gray/50 border border-transparent focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none text-charcoal placeholder-dark-gray/50" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-charcoal/90 mb-2 pl-1">Phone Number</label>
            <input 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              placeholder="e.g. (555) 123-4567" 
              className="w-full px-5 py-3.5 rounded-xl bg-light-gray/50 border border-transparent focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none text-charcoal placeholder-dark-gray/50" 
            />
          </div>

          <div className="pt-4 border-t border-mid-gray/30 flex items-center justify-between">
            {saved ? (
              <span className="text-green-600 font-bold flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Address Saved!
              </span>
            ) : <span />}
            <button 
              type="submit" 
              disabled={saving}
              className="px-8 py-3.5 bg-gradient-to-r from-accent to-pastel-blue hover:from-accent-dark hover:to-accent text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
