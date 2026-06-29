'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/context/StoreContext';
import Link from 'next/link';

const LENS_TYPES = ['contact-daily', 'contact-monthly', 'contact-biweekly', 'contact-yearly', 'prescription-single', 'prescription-bifocal', 'prescription-progressive', 'prescription-blue-light'];

const BRANDS = ['Acuvue', 'Bausch & Lomb', 'CooperVision', 'Alcon', 'Ciba Vision', 'SynergEyes', 'Hydron', 'Proclear', 'Custom'];

const EMPTY_FORM = {
  name: '',
  brand: '',
  lens_type: '',
  power_range: '',
  base_curve: '',
  diameter: '',
  water_content: '',
  material: '',
  replacement_schedule: '',
  pack_size: '',
  price: '',
  original_price: '',
  description: '',
  image_url: '',
  in_stock: true,
  quantity: '',
  is_featured: false,
  color_available: false,
  uv_protection: false,
};

const LENS_TYPE_LABELS = {
  'contact-daily': '👁️ Daily Contact',
  'contact-monthly': '📅 Monthly Contact',
  'contact-biweekly': '📆 Bi-Weekly Contact',
  'contact-yearly': '🗓️ Yearly Contact',
  'prescription-single': '🔭 Prescription Single Vision',
  'prescription-bifocal': '🔍 Prescription Bifocal',
  'prescription-progressive': '🌊 Prescription Progressive',
  'prescription-blue-light': '💙 Blue Light Blocking',
};

const TYPE_COLORS = {
  'contact-daily': 'bg-blue-50 text-blue-700 border-blue-200',
  'contact-monthly': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'contact-biweekly': 'bg-purple-50 text-purple-700 border-purple-200',
  'contact-yearly': 'bg-violet-50 text-violet-700 border-violet-200',
  'prescription-single': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'prescription-bifocal': 'bg-teal-50 text-teal-700 border-teal-200',
  'prescription-progressive': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'prescription-blue-light': 'bg-sky-50 text-sky-700 border-sky-200',
};

const STATIC_LENSES = [
  {
    id: 'lens-001',
    name: 'MoistDaily Comfort+',
    brand: 'Acuvue',
    lens_type: 'contact-daily',
    power_range: '-0.50 to -12.00',
    base_curve: '8.5',
    diameter: '14.2',
    water_content: '58%',
    material: 'Etafilcon A',
    replacement_schedule: 'Daily',
    pack_size: '30 lenses',
    price: 39.99,
    original_price: 49.99,
    description: 'Ultra-comfort daily disposable lenses with LACREON® technology for all-day moisture.',
    image_url: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?w=400&q=80',
    in_stock: true,
    quantity: 200,
    is_featured: true,
    color_available: false,
    uv_protection: true,
  },
  {
    id: 'lens-002',
    name: 'UltraVision Monthly Pro',
    brand: 'Bausch & Lomb',
    lens_type: 'contact-monthly',
    power_range: '-1.00 to -10.00',
    base_curve: '8.6',
    diameter: '14.0',
    water_content: '36%',
    material: 'Lotrafilcon B',
    replacement_schedule: 'Monthly',
    pack_size: '6 lenses',
    price: 54.99,
    original_price: null,
    description: 'High-oxygen monthly lenses with SilHydrate technology for extended comfort.',
    image_url: 'https://images.unsplash.com/photo-1590611936760-eeb9bc5937db?w=400&q=80',
    in_stock: true,
    quantity: 150,
    is_featured: true,
    color_available: false,
    uv_protection: false,
  },
  {
    id: 'lens-003',
    name: 'ColorBlend Vividly',
    brand: 'Alcon',
    lens_type: 'contact-monthly',
    power_range: '0.00 to -8.00',
    base_curve: '8.5',
    diameter: '14.5',
    water_content: '55%',
    material: 'Phemfilcon A',
    replacement_schedule: 'Monthly',
    pack_size: '2 lenses',
    price: 29.99,
    original_price: 39.99,
    description: 'Stunning color contacts that transform your eye color with 3-in-1 color technology.',
    image_url: 'https://images.unsplash.com/photo-1573461160327-5c53f1ad7de3?w=400&q=80',
    in_stock: true,
    quantity: 80,
    is_featured: false,
    color_available: true,
    uv_protection: false,
  },
];

export default function AdminLensesPage() {
  const { lensDiscounts } = useStore();
  const [lenses, setLenses] = useState(STATIC_LENSES);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [useSupabase, setUseSupabase] = useState(false);

  // Try to load from Supabase if configured
  useEffect(() => {
    const isConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

    if (isConfigured) {
      setUseSupabase(true);
      loadLenses();
    }
  }, []);

  const loadLenses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lenses')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setLenses(data);
      }
    } catch (e) {
      // Use static fallback silently
    } finally {
      setLoading(false);
    }
  };

  const f = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const handleEdit = (lens) => {
    setFormData({ ...EMPTY_FORM, ...lens });
    setEditingId(lens.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this lens?')) return;

    if (useSupabase) {
      try {
        const { error } = await supabase.from('lenses').delete().eq('id', id);
        if (error) throw error;
      } catch (e) {
        setErrorMsg(`Failed to delete: ${e.message}`);
        return;
      }
    }

    setLenses(prev => prev.filter(l => l.id !== id));
    setSuccessMsg('Lens deleted successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      quantity: parseInt(formData.quantity) || 0,
      lens_discount_id: formData.lens_discount_id || null,
    };

    if (useSupabase) {
      try {
        if (editingId) {
          const { id, created_at, ...updates } = payload;
          const { data, error } = await supabase.from('lenses').update(updates).eq('id', editingId).select();
          if (error) throw error;
          if (data) setLenses(prev => prev.map(l => l.id === editingId ? data[0] : l));
        } else {
          const { id, ...newPayload } = payload;
          const { data, error } = await supabase.from('lenses').insert([newPayload]).select();
          if (error) throw error;
          if (data) setLenses(prev => [data[0], ...prev]);
        }
      } catch (e) {
        setErrorMsg(`Failed to save lens: ${e.message}`);
        return;
      }
    } else {
      // Local state management
      if (editingId) {
        setLenses(prev => prev.map(l => l.id === editingId ? { ...l, ...payload, id: editingId } : l));
      } else {
        const newLens = { ...payload, id: `lens-${Date.now()}`, created_at: new Date().toISOString() };
        setLenses(prev => [newLens, ...prev]);
      }
    }

    setSuccessMsg(editingId ? 'Lens updated successfully!' : 'Lens added successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
    setErrorMsg('');
    setShowForm(false);
    setFormData(EMPTY_FORM);
    setEditingId(null);
  };

  const filtered = lenses.filter(l => {
    const s = search.toLowerCase();
    const matchSearch =
      (l.name || '').toLowerCase().includes(s) ||
      (l.brand || '').toLowerCase().includes(s) ||
      (l.material || '').toLowerCase().includes(s);
    const matchType = typeFilter === '' || l.lens_type === typeFilter;
    return matchSearch && matchType;
  });

  const contactLensesCount = lenses.filter(l => l.lens_type?.startsWith('contact')).length;
  const prescriptionCount = lenses.filter(l => l.lens_type?.startsWith('prescription')).length;
  const inStockCount = lenses.filter(l => l.in_stock).length;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black font-heading text-charcoal tracking-tight">Lens Management</h1>
          <p className="text-sm text-dark-gray mt-1">Manage contact lenses & prescription lens catalog</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/lens-price-list"
            target="_blank"
            className="px-5 py-2.5 bg-white border border-mid-gray text-charcoal rounded-xl text-sm font-semibold hover:bg-light-gray transition-all shadow-sm cursor-pointer"
          >
            🖨️ Print Price List
          </Link>
          <button
            className="px-5 py-2.5 bg-charcoal text-white rounded-xl text-sm font-semibold hover:bg-black transition-all hover:-translate-y-0.5 shadow-md shadow-black/10 cursor-pointer"
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData(EMPTY_FORM);
            }}
          >
            {showForm ? '✕ Cancel' : '+ Add New Lens'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Lenses', val: lenses.length, icon: '👁️', color: 'text-blue-600 bg-blue-50 border-blue-200' },
          { label: 'Contact Lenses', val: contactLensesCount, icon: '💧', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
          { label: 'Prescription', val: prescriptionCount, icon: '🔭', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
          { label: 'In Stock', val: inStockCount, icon: '✅', color: 'text-green-600 bg-green-50 border-green-200' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-mid-gray/40 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-dark-gray/70 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-charcoal mt-1">{stat.val}</p>
            </div>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl border ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-semibold flex items-center justify-between animate-fade-in shadow-sm">
          <span className="flex items-center gap-2">🟢 {successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-green-600 hover:text-green-800 font-bold text-xs cursor-pointer">✕</button>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm font-semibold flex items-center justify-between animate-fade-in shadow-sm">
          <span className="flex items-center gap-2">🔴 {errorMsg}</span>
          <button onClick={() => setErrorMsg('')} className="text-red-600 hover:text-red-800 font-bold text-xs cursor-pointer">✕</button>
        </div>
      )}

      {/* DB Notice */}
      {!useSupabase && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm font-semibold flex items-start gap-3 animate-fade-in shadow-sm">
          <span className="text-lg">⚠️</span>
          <div>
            <p className="font-bold">Running in Local Mode</p>
            <p className="text-xs font-normal mt-0.5 text-amber-700">Lenses are stored in memory only. To persist lenses, run the <code className="bg-amber-100 px-1 rounded text-xs">CREATE TABLE lenses ...</code> SQL in your Supabase SQL Editor (see the SQL script below). Changes will be lost on page refresh.</p>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-mid-gray/40">
          <h2 className="text-xl font-bold font-heading text-charcoal mb-6 pb-2 border-b border-mid-gray/30">
            {editingId ? '✏️ Edit Lens' : '✨ Add New Lens'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-xs font-bold text-dark-gray/70 uppercase tracking-wider mb-3">Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                <FormField label="Lens Name *">
                  <input required className="input" value={formData.name} onChange={e => f('name', e.target.value)} placeholder="e.g. AquaComfort Plus Daily" />
                </FormField>
                <FormField label="Brand *">
                  <select required className="input" value={formData.brand} onChange={e => f('brand', e.target.value)}>
                    <option value="">Select Brand…</option>
                    {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </FormField>
                <FormField label="Lens Type *">
                  <select required className="input" value={formData.lens_type} onChange={e => f('lens_type', e.target.value)}>
                    <option value="">Select Type…</option>
                    <optgroup label="Contact Lenses">
                      <option value="contact-daily">Daily Contact</option>
                      <option value="contact-biweekly">Bi-Weekly Contact</option>
                      <option value="contact-monthly">Monthly Contact</option>
                      <option value="contact-yearly">Yearly Contact</option>
                    </optgroup>
                    <optgroup label="Prescription Lenses">
                      <option value="prescription-single">Single Vision</option>
                      <option value="prescription-bifocal">Bifocal</option>
                      <option value="prescription-progressive">Progressive</option>
                      <option value="prescription-blue-light">Blue Light Blocking</option>
                    </optgroup>
                  </select>
                </FormField>
                <FormField label="Price ($) *">
                  <input type="number" step="0.01" required className="input" value={formData.price} onChange={e => f('price', e.target.value)} placeholder="39.99" />
                </FormField>
                <FormField label="Original Price ($)">
                  <input type="number" step="0.01" className="input" value={formData.original_price} onChange={e => f('original_price', e.target.value)} placeholder="Leave blank if no discount" />
                </FormField>
                <FormField label="Pack Size">
                  <input className="input" value={formData.pack_size} onChange={e => f('pack_size', e.target.value)} placeholder="e.g. 30 lenses, 6 lenses" />
                </FormField>
                <FormField label="Assign Discount Campaign">
                  <select className="input" value={formData.lens_discount_id || ''} onChange={e => f('lens_discount_id', e.target.value || null)}>
                    <option value="">No Active Discount</option>
                    {lensDiscounts?.filter(d => d.is_active).map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.discount_type === 'percentage' ? `${d.discount_value}%` : `Rs. ${d.discount_value}`})</option>
                    ))}
                  </select>
                </FormField>
              </div>
            </div>

            {/* Technical Specs */}
            <div>
              <h3 className="text-xs font-bold text-dark-gray/70 uppercase tracking-wider mb-3">Technical Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                <FormField label="Power Range">
                  <input className="input" value={formData.power_range} onChange={e => f('power_range', e.target.value)} placeholder="e.g. -0.50 to -12.00" />
                </FormField>
                <FormField label="Base Curve (mm)">
                  <input className="input" value={formData.base_curve} onChange={e => f('base_curve', e.target.value)} placeholder="e.g. 8.5" />
                </FormField>
                <FormField label="Diameter (mm)">
                  <input className="input" value={formData.diameter} onChange={e => f('diameter', e.target.value)} placeholder="e.g. 14.2" />
                </FormField>
                <FormField label="Water Content">
                  <input className="input" value={formData.water_content} onChange={e => f('water_content', e.target.value)} placeholder="e.g. 58%" />
                </FormField>
                <FormField label="Material">
                  <input className="input" value={formData.material} onChange={e => f('material', e.target.value)} placeholder="e.g. Etafilcon A, Silicone Hydrogel" />
                </FormField>
                <FormField label="Replacement Schedule">
                  <input className="input" value={formData.replacement_schedule} onChange={e => f('replacement_schedule', e.target.value)} placeholder="e.g. Daily, Monthly" />
                </FormField>
              </div>
            </div>

            {/* Inventory & Image */}
            <div>
              <h3 className="text-xs font-bold text-dark-gray/70 uppercase tracking-wider mb-3">Inventory & Media</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                <FormField label="Stock Quantity">
                  <input type="number" className="input" value={formData.quantity} onChange={e => f('quantity', e.target.value)} placeholder="0" />
                </FormField>
                <FormField label="Image URL">
                  <input className="input" value={formData.image_url} onChange={e => f('image_url', e.target.value)} placeholder="https://example.com/lens.jpg" />
                </FormField>
              </div>
            </div>

            {/* Description */}
            <FormField label="Description">
              <textarea
                className="input min-h-[80px]"
                value={formData.description}
                onChange={e => f('description', e.target.value)}
                placeholder="Lens technology, comfort level, oxygen permeability, recommended for..."
              />
            </FormField>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-6">
              {[
                { key: 'in_stock', label: '✅ In Stock' },
                { key: 'is_featured', label: '⭐ Featured Product' },
                { key: 'color_available', label: '🎨 Color Variants Available' },
                { key: 'uv_protection', label: '☀️ UV Protection' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer font-semibold text-sm text-charcoal">
                  <input
                    type="checkbox"
                    checked={!!formData[key]}
                    onChange={e => f(key, e.target.checked)}
                    className="rounded text-accent focus:ring-accent"
                  />
                  {label}
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button type="submit" className="px-6 py-3 bg-accent hover:bg-accent-dark text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-accent/20 cursor-pointer">
                {editingId ? '💾 Update Lens' : '✨ Create Lens'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingId(null); setFormData(EMPTY_FORM); }}
                className="px-6 py-3 bg-light-gray hover:bg-mid-gray/60 text-charcoal font-bold rounded-xl text-sm transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-3xl border border-mid-gray/40 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-gray/60 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search by name, brand, material..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-light-gray/50 rounded-xl border border-mid-gray/30 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="flex-1 sm:flex-none px-4 py-2 bg-light-gray/50 rounded-xl border border-mid-gray/30 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 text-charcoal font-semibold"
            >
              <option value="">All Types</option>
              <optgroup label="Contact Lenses">
                <option value="contact-daily">Daily Contact</option>
                <option value="contact-biweekly">Bi-Weekly Contact</option>
                <option value="contact-monthly">Monthly Contact</option>
                <option value="contact-yearly">Yearly Contact</option>
              </optgroup>
              <optgroup label="Prescription Lenses">
                <option value="prescription-single">Single Vision</option>
                <option value="prescription-bifocal">Bifocal</option>
                <option value="prescription-progressive">Progressive</option>
                <option value="prescription-blue-light">Blue Light Blocking</option>
              </optgroup>
            </select>

            {/* View Toggle */}
            <div className="flex border border-mid-gray/30 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 text-xs font-bold transition-colors cursor-pointer ${viewMode === 'table' ? 'bg-charcoal text-white' : 'bg-light-gray/50 text-dark-gray hover:bg-light-gray'}`}
                title="Table view"
              >☰</button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-xs font-bold transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-charcoal text-white' : 'bg-light-gray/50 text-dark-gray hover:bg-light-gray'}`}
                title="Grid view"
              >⊞</button>
            </div>
          </div>
        </div>

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-dark-gray/70 border-b border-mid-gray/30 uppercase tracking-wider font-bold">
                  <th className="pb-3">Image</th>
                  <th className="pb-3">Name / Brand</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Specs</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Stock</th>
                  <th className="pb-3">Features</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mid-gray/30">
                {filtered.map(lens => (
                  <tr key={lens.id} className="hover:bg-soft-white/50 transition-colors">
                    <td className="py-4">
                      {lens.image_url ? (
                        <img
                          src={lens.image_url}
                          alt={lens.name}
                          className="w-12 h-12 object-cover rounded-xl border border-mid-gray/50 shadow-sm"
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xl">👁️</div>
                      )}
                    </td>
                    <td className="py-4">
                      <p className="font-bold text-charcoal max-w-[180px] truncate">{lens.name}</p>
                      <p className="text-xs text-dark-gray font-semibold mt-0.5">{lens.brand}</p>
                      {lens.pack_size && <p className="text-[10px] text-dark-gray/60 mt-0.5">{lens.pack_size}</p>}
                    </td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-block ${TYPE_COLORS[lens.lens_type] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        {LENS_TYPE_LABELS[lens.lens_type] || lens.lens_type}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="space-y-0.5 text-xs text-dark-gray">
                        {lens.power_range && <p>⚡ {lens.power_range}</p>}
                        {lens.base_curve && <p>↩ BC: {lens.base_curve}</p>}
                        {lens.water_content && <p>💧 {lens.water_content}</p>}
                      </div>
                    </td>
                    <td className="py-4">
                      <p className="font-bold text-charcoal">${Number(lens.price || 0).toFixed(2)}</p>
                      {lens.original_price && lens.original_price > lens.price && (
                        <p className="text-xs text-dark-gray/60 line-through">${Number(lens.original_price).toFixed(2)}</p>
                      )}
                    </td>
                    <td className="py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border inline-block w-fit ${lens.in_stock ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                          {lens.in_stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        {lens.quantity > 0 && (
                          <span className="text-[10px] text-dark-gray/70 font-semibold">Qty: {lens.quantity}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex flex-wrap gap-1">
                        {lens.is_featured && <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold rounded-full">⭐ Featured</span>}
                        {lens.uv_protection && <span className="px-2 py-0.5 bg-orange-50 border border-orange-200 text-orange-700 text-[10px] font-bold rounded-full">☀️ UV</span>}
                        {lens.color_available && <span className="px-2 py-0.5 bg-pink-50 border border-pink-200 text-pink-700 text-[10px] font-bold rounded-full">🎨 Colors</span>}
                        {lens.lens_discount_id && <span className="px-2 py-0.5 bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-bold rounded-full">Has Discount</span>}
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(lens)}
                          className="px-3 py-1.5 bg-light-gray hover:bg-mid-gray/70 text-charcoal text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(lens.id)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center text-dark-gray py-10">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl">👁️</span>
                        <p className="font-semibold">No lenses found matching your filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(lens => (
              <div key={lens.id} className="bg-soft-white/60 border border-mid-gray/30 rounded-2xl overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 group">
                <div className="relative h-40 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center overflow-hidden">
                  {lens.image_url ? (
                    <img
                      src={lens.image_url}
                      alt={lens.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <span className="text-5xl opacity-40">👁️</span>
                  )}
                  {/* Featured badge */}
                  {lens.is_featured && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 bg-amber-400 text-amber-900 text-[10px] font-black rounded-full shadow-sm">⭐ Featured</span>
                    </div>
                  )}
                  {/* Stock badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-0.5 text-[10px] font-black rounded-full shadow-sm ${lens.in_stock ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                      {lens.in_stock ? '✓ Stock' : '✗ Out'}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-charcoal text-sm leading-tight truncate">{lens.name}</h3>
                    <p className="text-xs text-dark-gray font-semibold mt-0.5">{lens.brand}</p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-block ${TYPE_COLORS[lens.lens_type] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                    {LENS_TYPE_LABELS[lens.lens_type] || lens.lens_type}
                  </span>

                  {(lens.pack_size || lens.replacement_schedule) && (
                    <div className="text-xs text-dark-gray/70 space-y-0.5">
                      {lens.pack_size && <p>📦 {lens.pack_size}</p>}
                      {lens.replacement_schedule && <p>🔄 {lens.replacement_schedule}</p>}
                      {lens.power_range && <p>⚡ {lens.power_range}</p>}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-charcoal">${Number(lens.price || 0).toFixed(2)}</p>
                      {lens.original_price && lens.original_price > lens.price && (
                        <p className="text-xs text-dark-gray/60 line-through">${Number(lens.original_price).toFixed(2)}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {lens.uv_protection && <span title="UV Protection" className="text-sm">☀️</span>}
                      {lens.color_available && <span title="Color variants" className="text-sm">🎨</span>}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleEdit(lens)}
                      className="flex-1 py-1.5 bg-light-gray hover:bg-mid-gray/70 text-charcoal text-xs font-bold rounded-lg transition-colors cursor-pointer text-center"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(lens.id)}
                      className="flex-1 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center text-dark-gray py-10">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-4xl">👁️</span>
                  <p className="font-semibold">No lenses found matching your filters.</p>
                </div>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-dark-gray/60 font-semibold text-right">
          Showing {filtered.length} of {lenses.length} total lenses
        </p>
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
