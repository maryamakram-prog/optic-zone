'use client';
import { useStore } from '@/context/StoreContext';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const EMPTY_FORM = {
  name: '', brand: '', price: '', originalPrice: '', category: '',
  description: '', imageUrl: '', frameShape: '', frameMaterial: '',
  frameColor: '', lensColor: '', gender: '',
  isBestSeller: false, isSale: false, isNew: false,
  is_hidden: false,
};

export default function AdminProductsPage() {
  const { products, lensDiscounts, addProduct, updateProduct, deleteProduct } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleToggleVisibility = async (product) => {
    const updated = { ...product, is_hidden: !product.is_hidden };
    const res = await updateProduct(updated);
    if (res && res.error) {
      setErrorMsg(`Failed to update visibility: ${res.error.message || JSON.stringify(res.error)}`);
    } else {
      setSuccessMsg(`Product "${product.name}" is now ${updated.is_hidden ? 'hidden' : 'visible'}.`);
      setTimeout(() => setSuccessMsg(''), 4000);
      setErrorMsg('');
    }
  };

  const handleEdit = (product) => {
    setFormData({ ...EMPTY_FORM, ...product });
    setImagePreview(product.imageUrl || '');
    setEditingId(product.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const isSupabaseConfigured = 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

      if (!isSupabaseConfigured) {
        setErrorMsg('Supabase is not configured yet. Using local fallback file URL.');
        const mockUrl = URL.createObjectURL(file);
        setFormData(prev => ({ ...prev, imageUrl: mockUrl }));
        setImagePreview(mockUrl);
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data, error } = await supabase.storage
        .from('product_images')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('product_images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, imageUrl: publicUrl }));
      setImagePreview(publicUrl);
    } catch (err) {
      console.error('Upload Error:', err);
      setErrorMsg(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const res = await deleteProduct(id);
      if (res && res.error) {
        setErrorMsg(`Failed to delete product: ${res.error.message || JSON.stringify(res.error)}`);
      } else {
        setSuccessMsg('Product deleted successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
        setErrorMsg('');
      }
    }
  };

  const handleImageUrlChange = (val) => {
    setFormData(prev => ({ ...prev, imageUrl: val }));
    setImagePreview(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
    };
    
    let res;
    if (editingId) {
      res = await updateProduct({ ...payload, id: editingId });
    } else {
      res = await addProduct({ ...payload, rating: 5, reviews: 0 });
    }
    
    if (res && res.error) {
      console.error('Failed to save product:', res.error);
      setErrorMsg(`Failed to save product: ${res.error.message || JSON.stringify(res.error)}`);
      return;
    }
    
    setSuccessMsg(editingId ? 'Product updated successfully!' : 'Product created successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
    setErrorMsg('');
    setShowForm(false);
    setFormData(EMPTY_FORM);
    setImagePreview('');
    setEditingId(null);
  };

  const f = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.brand.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === '' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black font-heading text-charcoal tracking-tight">Product Management</h1>
          <p className="text-sm text-dark-gray mt-1">Catalog and inventory details</p>
        </div>
        <button
          className="px-5 py-2.5 bg-charcoal text-white rounded-xl text-sm font-semibold hover:bg-black transition-all hover:-translate-y-0.5 shadow-md shadow-black/10 cursor-pointer"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData(EMPTY_FORM);
            setImagePreview('');
          }}
        >
          {showForm ? 'Cancel' : '+ Add New Product'}
        </button>
      </div>

      {/* Success & Error Banners */}
      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-semibold flex items-center justify-between animate-fade-in shadow-sm">
          <span className="flex items-center gap-2">🟢 {successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-green-600 hover:text-green-800 font-bold text-xs">✕</button>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm font-semibold flex items-center justify-between animate-fade-in shadow-sm">
          <span className="flex items-center gap-2">🔴 {errorMsg}</span>
          <button onClick={() => setErrorMsg('')} className="text-red-600 hover:text-red-800 font-bold text-xs">✕</button>
        </div>
      )}

      {/* Edit/Add Form */}
      {showForm && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-mid-gray/40">
          <h2 className="text-xl font-bold font-heading text-charcoal mb-6 pb-2 border-b border-mid-gray/30">
            {editingId ? '✏️ Edit Product' : '✨ Add New Product'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <FormField label="Product Name *">
                <input required className="input" value={formData.name} onChange={e => f('name', e.target.value)} placeholder="e.g. Classic Aviator" />
              </FormField>
              <FormField label="Brand *">
                <input required className="input" value={formData.brand} onChange={e => f('brand', e.target.value)} placeholder="e.g. Ray-Ban" />
              </FormField>
              <FormField label="Price ($) *">
                <input type="number" step="0.01" required className="input" value={formData.price} onChange={e => f('price', e.target.value)} placeholder="129.99" />
              </FormField>
              <FormField label="Original Price ($)">
                <input type="number" step="0.01" className="input" value={formData.originalPrice} onChange={e => f('originalPrice', e.target.value)} placeholder="Leave blank if no discount" />
              </FormField>
              <FormField label="Category *">
                <select required className="input" value={formData.category} onChange={e => f('category', e.target.value)}>
                  <option value="">Select Category…</option>
                  <option value="eyeglasses">Eyeglasses</option>
                  <option value="sunglasses">Sunglasses</option>
                  <option value="blue-light">Blue Light Glasses</option>
                  <option value="reading">Reading</option>
                  <option value="sports">Sports</option>
                  <option value="kids">Kids</option>
                  <option value="contact-lenses">Contact Lenses</option>
                </select>
              </FormField>
              <FormField label="Gender">
                <select className="input" value={formData.gender} onChange={e => f('gender', e.target.value)}>
                  <option value="">All / Unisex</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                </select>
              </FormField>
              <FormField label="Frame Shape">
                <input className="input" value={formData.frameShape} onChange={e => f('frameShape', e.target.value)} placeholder="e.g. Aviator, Round" />
              </FormField>
              <FormField label="Frame Material">
                <input className="input" value={formData.frameMaterial} onChange={e => f('frameMaterial', e.target.value)} placeholder="e.g. Acetate, Titanium" />
              </FormField>
              <FormField label="Frame Color">
                <input className="input" value={formData.frameColor} onChange={e => f('frameColor', e.target.value)} placeholder="e.g. Matte Black" />
              </FormField>
              <FormField label="Assign Discount Campaign">
                <select className="input" value={formData.lens_discount_id || ''} onChange={e => f('lens_discount_id', e.target.value || null)}>
                  <option value="">No Active Discount</option>
                  {lensDiscounts?.filter(d => d.is_active).map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.discount_type === 'percentage' ? `${d.discount_value}%` : `$${d.discount_value}`})</option>
                  ))}
                </select>
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Product Image URL">
                <input
                  className="input"
                  value={formData.imageUrl}
                  onChange={e => handleImageUrlChange(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </FormField>
              <FormField label={uploading ? "Uploading..." : "Or Upload Image File"}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="input file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-accent/15 file:text-accent hover:file:bg-accent/25 cursor-pointer disabled:opacity-50"
                />
              </FormField>
            </div>

            {imagePreview && (
              <div className="flex items-center gap-4 bg-light-gray/30 p-4 rounded-2xl border border-mid-gray/30 w-fit">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-20 h-16 object-cover rounded-xl border border-mid-gray/50 shadow-sm"
                  onError={e => { e.target.style.display = 'none'; }}
                />
                <div>
                  <span className="text-xs font-bold text-charcoal block">Live Image Preview</span>
                  <button type="button" onClick={() => handleImageUrlChange('')} className="text-xs text-red-500 font-semibold hover:underline mt-1">Remove</button>
                </div>
              </div>
            )}

            <FormField label="Product Description">
              <textarea 
                className="input min-h-[80px]" 
                value={formData.description} 
                onChange={e => f('description', e.target.value)} 
                placeholder="Product characteristics, lens tech, dimensions..." 
              />
            </FormField>

            <div className="flex gap-6 flex-wrap">
              {[
                { key: 'isBestSeller', label: '🏆 Best Seller' },
                { key: 'isSale', label: '🔥 On Sale' },
                { key: 'isNew', label: '✨ New Arrival' },
                { key: 'is_hidden', label: '👁️ Hidden from Customer Site' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer font-semibold text-sm text-charcoal">
                  <input type="checkbox" checked={!!formData[key]} onChange={e => f(key, e.target.checked)} className="rounded text-accent focus:ring-accent" />
                  {label}
                </label>
              ))}
            </div>

            <button type="submit" className="px-6 py-3 bg-accent hover:bg-accent-dark text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-accent/20 cursor-pointer">
              {editingId ? 'Update Product' : 'Create Product'}
            </button>
          </form>
        </div>
      )}

      {/* Filters and List */}
      <div className="bg-white p-6 rounded-3xl border border-mid-gray/40 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-gray/60 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-light-gray/50 rounded-xl border border-mid-gray/30 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 bg-light-gray/50 rounded-xl border border-mid-gray/30 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 text-charcoal font-semibold"
          >
            <option value="">All Categories</option>
            <option value="eyeglasses">Eyeglasses</option>
            <option value="sunglasses">Sunglasses</option>
            <option value="reading">Reading</option>
            <option value="sport">Sport</option>
            <option value="kids">Kids</option>
            <option value="contact-lenses">Contact Lenses</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs text-dark-gray/70 border-b border-mid-gray/30 uppercase tracking-wider font-bold">
                <th className="pb-3">ID</th>
                <th className="pb-3">Image</th>
                <th className="pb-3">Name</th>
                <th className="pb-3">Brand</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mid-gray/30">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-soft-white/50 transition-colors">
                  <td className="py-4 font-semibold text-dark-gray max-w-[120px] truncate" title={p.id}>
                    <span className="font-mono text-xs bg-light-gray px-2 py-1 rounded-lg">
                      {typeof p.id === 'string' ? p.id.substring(0, 8) : p.id}
                    </span>
                  </td>
                  <td className="py-4">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="w-12 h-9 object-cover rounded-lg border border-mid-gray/50 shadow-sm" onError={e => { e.target.style.display = 'none'; }} />
                    ) : (
                      <span className="text-xl">👓</span>
                    )}
                  </td>
                  <td className="py-4 font-bold text-charcoal max-w-[200px] truncate">{p.name}</td>
                  <td className="py-4 font-semibold text-charcoal">{p.brand}</td>
                  <td className="py-4 text-dark-gray capitalize">{p.category}</td>
                  <td className="py-4 font-bold text-charcoal">
                    ${p.price.toFixed(2)}
                    {p.originalPrice && p.originalPrice > p.price && (
                      <span className="text-xs text-dark-gray/60 line-through ml-1.5">${p.originalPrice.toFixed(2)}</span>
                    )}
                  </td>
                  <td className="py-4">
                    <div className="flex flex-wrap gap-1">
                      {p.is_hidden && <span className="px-2 py-0.5 bg-gray-100 border border-gray-300 text-gray-700 text-[10px] font-bold rounded-full">Hidden</span>}
                      {!p.is_hidden && <span className="px-2 py-0.5 bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold rounded-full">Visible</span>}
                      {p.isBestSeller && <span className="px-2 py-0.5 bg-yellow-50 border border-yellow-200 text-yellow-700 text-[10px] font-bold rounded-full">Best Seller</span>}
                      {p.isSale && <span className="px-2 py-0.5 bg-red-50 border border-red-200 text-red-700 text-[10px] font-bold rounded-full">Sale</span>}
                      {p.isNew && <span className="px-2 py-0.5 bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold rounded-full">New</span>}
                      {p.lens_discount_id && <span className="px-2 py-0.5 bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-bold rounded-full">Has Discount</span>}
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${p.is_hidden ? "bg-green-50 hover:bg-green-100 text-green-600" : "bg-orange-50 hover:bg-orange-100 text-orange-600"}`}
                        onClick={() => handleToggleVisibility(p)}
                      >
                        {p.is_hidden ? 'Unhide' : 'Hide'}
                      </button>
                      <button 
                        className="px-3 py-1.5 bg-light-gray hover:bg-mid-gray/70 text-charcoal text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        onClick={() => handleEdit(p)}
                      >
                        Edit
                      </button>
                      <button 
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        onClick={() => handleDelete(p.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center text-dark-gray py-8">No products found matching filters.</td>
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
