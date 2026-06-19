'use client';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';



export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [saved, setSaved] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSaved, setPwSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateUser(form);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePwSubmit = (e) => {
    e.preventDefault();
    setPwError('');
    if (pwForm.next.length < 6) { setPwError('Password must be at least 6 characters.'); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError('Passwords do not match.'); return; }
    setPwSaved(true);
    setPwForm({ current: '', next: '', confirm: '' });
    setTimeout(() => setPwSaved(false), 3000);
  };

  return (
    <div>
      <h2 className="">Profile Settings</h2>

      {/* Profile Info */}
      <div className="">
        <div className="">
          <h3>Personal Information</h3>
          {!editing && (
            <button className="" onClick={() => { setEditing(true); setForm({ name: user?.name || '', email: user?.email || '' }); }}>
              ✏️ Edit
            </button>
          )}
        </div>

        {saved && <div className="">✅ Profile updated successfully!</div>}

        {editing ? (
          <form onSubmit={handleSave} className="">
            <div className="">
              <label>Full Name</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
            </div>
            <div className="">
              <label>Email Address</label>
              <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
            </div>
            <div className="">
              <button type="submit" className="">Save Changes</button>
              <button type="button" className="" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <div className="">
            <div className="">
              <span className="">Full Name</span>
              <span className="">{user?.name || '—'}</span>
            </div>
            <div className="">
              <span className="">Email Address</span>
              <span className="">{user?.email || '—'}</span>
            </div>
            <div className="">
              <span className="">Member Since</span>
              <span className="">June 2025</span>
            </div>
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="">
        <div className="">
          <h3>Change Password</h3>
        </div>

        {pwError && <div className="">⚠️ {pwError}</div>}
        {pwSaved && <div className="">✅ Password changed successfully!</div>}

        <form onSubmit={handlePwSubmit} className="">
          <div className="">
            <label>Current Password</label>
            <input type="password" required value={pwForm.current} onChange={e => setPwForm({ ...pwForm, current: e.target.value })} placeholder="••••••••" />
          </div>
          <div className="">
            <div className="">
              <label>New Password</label>
              <input type="password" required value={pwForm.next} onChange={e => setPwForm({ ...pwForm, next: e.target.value })} placeholder="Min 6 characters" />
            </div>
            <div className="">
              <label>Confirm New Password</label>
              <input type="password" required value={pwForm.confirm} onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })} placeholder="Repeat new password" />
            </div>
          </div>
          <button type="submit" className="" style={{ width: 'fit-content' }}>Update Password</button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="">
        <h3>Danger Zone</h3>
        <p>Deleting your account will permanently remove all your data, orders, and saved information. This action cannot be undone.</p>
        <button className="" onClick={() => alert('For account deletion, please contact support@opticzone.ae')}>Delete Account</button>
      </div>
    </div>
  );
}
