'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const EMPTY_FORM = {
  name: '',
  discount_type: 'percentage',
  discount_value: '',
  start_date: '',
  end_date: '',
  is_active: true,
};

const STATIC_DISCOUNTS = [
  {
    id: 'disc-001',
    name: 'Summer Mega Sale',
    discount_type: 'percentage',
    discount_value: 20,
    start_date: '',
    end_date: '',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'disc-002',
    name: 'Flat Rs. 500 Off',
    discount_type: 'fixed',
    discount_value: 500,
    start_date: '',
    end_date: '',
    is_active: true,
    created_at: new Date().toISOString()
  }
];

export default function AdminLensDiscountsPage() {
  const [discounts, setDiscounts] = useState(STATIC_DISCOUNTS);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [search, setSearch] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [useSupabase, setUseSupabase] = useState(false);

  useEffect(() => {
    const isConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

    if (isConfigured) {
      setUseSupabase(true);
      loadDiscounts();
    }
  }, []);

  const loadDiscounts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lens_discounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setDiscounts(data);
      }
    } catch (e) {
      // Use static fallback silently
    } finally {
      setLoading(false);
    }
  };

  const f = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const handleEdit = (discount) => {
    setFormData({ 
      ...EMPTY_FORM, 
      ...discount,
      start_date: discount.start_date ? discount.start_date.substring(0, 16) : '',
      end_date: discount.end_date ? discount.end_date.substring(0, 16) : '',
    });
    setEditingId(discount.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this discount? Any lenses linked to it will lose this discount.')) return;

    if (useSupabase) {
      try {
        const { error } = await supabase.from('lens_discounts').delete().eq('id', id);
        if (error) throw error;
      } catch (e) {
        setErrorMsg(`Failed to delete: ${e.message}`);
        return;
      }
    }

    setDiscounts(prev => prev.filter(d => d.id !== id));
    setSuccessMsg('Discount deleted successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      discount_value: parseFloat(formData.discount_value) || 0,
      start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
      end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
    };

    if (useSupabase) {
      try {
        if (editingId) {
          const { id, created_at, ...updates } = payload;
          const { data, error } = await supabase.from('lens_discounts').update(updates).eq('id', editingId).select();
          if (error) throw error;
          if (data) setDiscounts(prev => prev.map(d => d.id === editingId ? data[0] : d));
        } else {
          const { id, ...newPayload } = payload;
          const { data, error } = await supabase.from('lens_discounts').insert([newPayload]).select();
          if (error) throw error;
          if (data) setDiscounts(prev => [data[0], ...prev]);
        }
      } catch (e) {
        setErrorMsg(`Failed to save discount: ${e.message}`);
        return;
      }
    } else {
      if (editingId) {
        setDiscounts(prev => prev.map(d => d.id === editingId ? { ...d, ...payload, id: editingId } : d));
      } else {
        const newDiscount = { ...payload, id: `disc-${Date.now()}`, created_at: new Date().toISOString() };
        setDiscounts(prev => [newDiscount, ...prev]);
      }
    }

    setSuccessMsg(editingId ? 'Discount updated successfully!' : 'Discount created successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
    setErrorMsg('');
    setShowForm(false);
    setFormData(EMPTY_FORM);
    setEditingId(null);
  };

  const filtered = discounts.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black font-heading text-charcoal tracking-tight">Lens Discounts</h1>
          <p className="text-sm text-dark-gray mt-1">Manage global discounts and promotions for lenses</p>
        </div>
        <button
          className="px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent-dark transition-all hover:-translate-y-0.5 shadow-md cursor-pointer"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData(EMPTY_FORM);
          }}
        >
          {showForm ? '✕ Cancel' : '+ Create Discount'}
        </button>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-semibold flex items-center justify-between shadow-sm">
          <span>🟢 {successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-green-600 font-bold text-xs cursor-pointer">✕</button>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm font-semibold flex items-center justify-between shadow-sm">
          <span>🔴 {errorMsg}</span>
          <button onClick={() => setErrorMsg('')} className="text-red-600 font-bold text-xs cursor-pointer">✕</button>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-mid-gray/40">
          <h2 className="text-xl font-bold font-heading text-charcoal mb-6 pb-2 border-b border-mid-gray/30">
            {editingId ? '✏️ Edit Discount' : '✨ Create Discount Rule'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField label="Campaign Name *">
                <input required className="input" value={formData.name} onChange={e => f('name', e.target.value)} placeholder="e.g. Summer Mega Sale" />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Type *">
                  <select required className="input" value={formData.discount_type} onChange={e => f('discount_type', e.target.value)}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (Rs.)</option>
                  </select>
                </FormField>
                <FormField label="Value *">
                  <input type="number" step="0.01" required className="input" value={formData.discount_value} onChange={e => f('discount_value', e.target.value)} placeholder={formData.discount_type === 'percentage' ? '20' : '500'} />
                </FormField>
              </div>

              <FormField label="Start Date (Optional)">
                <input type="datetime-local" className="input" value={formData.start_date} onChange={e => f('start_date', e.target.value)} />
              </FormField>

              <FormField label="End Date (Optional)">
                <input type="datetime-local" className="input" value={formData.end_date} onChange={e => f('end_date', e.target.value)} />
              </FormField>
            </div>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-sm text-charcoal w-fit">
              <input
                type="checkbox"
                checked={!!formData.is_active}
                onChange={e => f('is_active', e.target.checked)}
                className="rounded text-accent focus:ring-accent"
              />
              ✅ Discount Active
            </label>

            <div className="flex gap-3">
              <button type="submit" className="px-6 py-3 bg-charcoal hover:bg-black text-white font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer">
                {editingId ? 'Save Changes' : 'Create Campaign'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="bg-white p-6 rounded-3xl border border-mid-gray/40 shadow-sm space-y-6">
        <div className="relative max-w-sm">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-gray/60 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search campaigns..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-light-gray/50 rounded-xl border border-mid-gray/30 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs text-dark-gray/70 border-b border-mid-gray/30 uppercase tracking-wider font-bold">
                <th className="pb-3">Campaign Name</th>
                <th className="pb-3">Discount</th>
                <th className="pb-3">Duration</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mid-gray/30">
              {filtered.map(disc => (
                <tr key={disc.id} className="hover:bg-soft-white/50 transition-colors">
                  <td className="py-4 font-bold text-charcoal">{disc.name}</td>
                  <td className="py-4">
                    <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold text-xs inline-block">
                      {disc.discount_type === 'percentage' ? `${disc.discount_value}% OFF` : `Rs. ${disc.discount_value} OFF`}
                    </span>
                  </td>
                  <td className="py-4 text-xs text-dark-gray space-y-1">
                    {disc.start_date || disc.end_date ? (
                      <>
                        {disc.start_date && <p>From: {new Date(disc.start_date).toLocaleString()}</p>}
                        {disc.end_date && <p>To: {new Date(disc.end_date).toLocaleString()}</p>}
                      </>
                    ) : (
                      <span className="italic">Ongoing (No limits)</span>
                    )}
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border inline-block ${disc.is_active ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                      {disc.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button onClick={() => handleEdit(disc)} className="px-3 py-1.5 bg-light-gray hover:bg-mid-gray/70 text-charcoal text-xs font-bold rounded-lg cursor-pointer mr-2">Edit</button>
                    <button onClick={() => handleDelete(disc.id)} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg cursor-pointer">Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-dark-gray">No discounts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-charcoal/80 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}
