'use client';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '' });
  const [pwForm, setPwForm] = useState({ next: '', confirm: '' });
  const [saved, setSaved] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSaved, setPwSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ 
        first_name: user.first_name || '', 
        last_name: user.last_name || '', 
        email: user.email || '' 
      });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ first_name: form.first_name, last_name: form.last_name });
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    setPwError('');
    if (pwForm.next.length < 6) { setPwError('Password must be at least 6 characters.'); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError('Passwords do not match.'); return; }
    
    try {
      const { error } = await supabase.auth.updateUser({ password: pwForm.next });
      if (error) throw error;
      setPwSaved(true);
      setPwForm({ next: '', confirm: '' });
      setTimeout(() => setPwSaved(false), 3000);
    } catch (err) {
      setPwError(err.message || 'Failed to update password.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="mb-10">
        <h2 className="text-4xl font-bold font-heading text-charcoal tracking-tight mb-2">Profile Settings</h2>
        <p className="text-dark-gray/80 font-medium">Manage your personal information and security preferences.</p>
      </div>

      {/* Profile Info */}
      <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-xl shadow-accent/5 border border-white/50 mb-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-accent/10 transition-all duration-300">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-accent to-pastel-blue opacity-50 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-mid-gray/30 gap-4">
          <div>
            <h3 className="text-2xl font-bold font-heading text-charcoal">Personal Information</h3>
            <p className="text-sm text-dark-gray/70 mt-1">Update your name and contact details.</p>
          </div>
          {!editing && (
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-accent/10 to-pastel-blue/10 hover:from-accent hover:to-pastel-blue hover:text-white text-accent font-bold rounded-xl transition-all duration-300 shadow-sm self-start sm:self-auto" onClick={() => setEditing(true)}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Profile
            </button>
          )}
        </div>

        {saved && (
          <div className="mb-8 p-5 bg-green-50/80 backdrop-blur-sm text-green-700 text-sm font-semibold rounded-2xl border border-green-200/50 flex items-center gap-3 animate-fade-in shadow-inner">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Profile updated successfully!</span>
          </div>
        )}

        {editing ? (
          <form onSubmit={handleSave} className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-charcoal/90 mb-2 pl-1">First Name</label>
                <input required value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} placeholder="Your first name" className="w-full px-5 py-3.5 rounded-xl bg-light-gray/50 border border-transparent focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none text-charcoal placeholder-dark-gray/50" />
              </div>
              <div>
                <label className="block text-sm font-bold text-charcoal/90 mb-2 pl-1">Last Name</label>
                <input required value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} placeholder="Your last name" className="w-full px-5 py-3.5 rounded-xl bg-light-gray/50 border border-transparent focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none text-charcoal placeholder-dark-gray/50" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-charcoal/90 mb-2 pl-1">Email Address <span className="font-normal text-dark-gray/60 ml-1">(Cannot be changed here)</span></label>
              <input type="email" disabled value={form.email} className="w-full px-5 py-3.5 rounded-xl bg-mid-gray/20 border border-transparent text-dark-gray cursor-not-allowed outline-none font-medium" />
            </div>
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button type="submit" className="px-8 py-3.5 bg-gradient-to-r from-accent to-accent-dark hover:shadow-lg hover:shadow-accent/30 hover:-translate-y-0.5 text-white font-bold tracking-wide rounded-xl transition-all duration-300">Save Changes</button>
              <button type="button" className="px-8 py-3.5 bg-white border border-mid-gray/50 hover:bg-light-gray text-charcoal font-bold rounded-xl transition-colors" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-10">
            <div className="flex flex-col bg-light-gray/30 p-5 rounded-2xl border border-mid-gray/20">
              <span className="text-xs font-bold text-dark-gray/60 uppercase tracking-widest mb-1 flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                First Name
              </span>
              <span className="text-charcoal font-bold text-xl">{user?.first_name || '—'}</span>
            </div>
            <div className="flex flex-col bg-light-gray/30 p-5 rounded-2xl border border-mid-gray/20">
              <span className="text-xs font-bold text-dark-gray/60 uppercase tracking-widest mb-1 flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Last Name
              </span>
              <span className="text-charcoal font-bold text-xl">{user?.last_name || '—'}</span>
            </div>
            <div className="flex flex-col sm:col-span-2 bg-light-gray/30 p-5 rounded-2xl border border-mid-gray/20">
              <span className="text-xs font-bold text-dark-gray/60 uppercase tracking-widest mb-1 flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                Email Address
              </span>
              <span className="text-charcoal font-bold text-xl">{user?.email || '—'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-xl shadow-accent/5 border border-white/50 mb-10 relative overflow-hidden group hover:shadow-2xl hover:shadow-accent/10 transition-all duration-300">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-dark-gray to-charcoal opacity-30 group-hover:opacity-60 transition-opacity" />
        
        <div className="mb-8 pb-6 border-b border-mid-gray/30">
          <h3 className="text-2xl font-bold font-heading text-charcoal">Security Settings</h3>
          <p className="text-sm text-dark-gray/70 mt-1">Ensure your account is using a long, random password to stay secure.</p>
        </div>

        {pwError && (
          <div className="mb-8 p-5 bg-red-50/80 backdrop-blur-sm text-red-600 text-sm font-semibold rounded-2xl border border-red-200/50 flex items-center gap-3 animate-fade-in shadow-inner">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{pwError}</span>
          </div>
        )}
        {pwSaved && (
          <div className="mb-8 p-5 bg-green-50/80 backdrop-blur-sm text-green-700 text-sm font-semibold rounded-2xl border border-green-200/50 flex items-center gap-3 animate-fade-in shadow-inner">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Password changed successfully!</span>
          </div>
        )}

        <form onSubmit={handlePwSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-charcoal/90 mb-2 pl-1">New Password</label>
              <input type="password" required value={pwForm.next} onChange={e => setPwForm({ ...pwForm, next: e.target.value })} placeholder="Min 6 characters" className="w-full px-5 py-3.5 rounded-xl bg-light-gray/50 border border-transparent focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none text-charcoal placeholder-dark-gray/50" />
            </div>
            <div>
              <label className="block text-sm font-bold text-charcoal/90 mb-2 pl-1">Confirm New Password</label>
              <input type="password" required value={pwForm.confirm} onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })} placeholder="Repeat new password" className="w-full px-5 py-3.5 rounded-xl bg-light-gray/50 border border-transparent focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none text-charcoal placeholder-dark-gray/50" />
            </div>
          </div>
          <button type="submit" className="px-8 py-3.5 bg-charcoal hover:bg-black text-white font-bold tracking-wide rounded-xl shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 mt-2">Update Password</button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-gradient-to-br from-red-50 to-white p-8 sm:p-10 rounded-3xl border border-red-100 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-red-100 rounded-full blur-[50px] opacity-50 pointer-events-none" />
        <h3 className="text-xl font-bold text-red-600 mb-3 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Danger Zone
        </h3>
        <p className="text-red-800/70 mb-6 text-sm font-medium leading-relaxed max-w-2xl">Deleting your account will permanently remove all your data, orders, and saved information from our servers. This action is irreversible.</p>
        <button className="px-6 py-3.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-transparent font-bold rounded-xl transition-all duration-300 shadow-sm" onClick={() => alert('For account deletion, please contact support@opticzone.ae')}>Permanently Delete Account</button>
      </div>
    </div>
  );
}
