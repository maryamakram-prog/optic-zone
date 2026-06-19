'use client';
import { useStore } from '@/context/StoreContext';
import { useState } from 'react';


const EMPTY_FORM = {
  name: '', brand: '', price: '', originalPrice: '', category: '',
  description: '', imageUrl: '', frameShape: '', frameMaterial: '',
  frameColor: '', lensColor: '', gender: '',
  isBestSeller: false, isSale: false, isNew: false,
};

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState('');

  const handleEdit = (product) => {
    setFormData({ ...EMPTY_FORM, ...product });
    setImagePreview(product.imageUrl || '');
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleImageUrlChange = (val) => {
    setFormData(prev => ({ ...prev, imageUrl: val }));
    setImagePreview(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
    };
    if (editingId) {
      updateProduct({ ...payload, id: editingId });
    } else {
      addProduct({ ...payload, rating: 5, reviews: 0 });
    }
    setShowForm(false);
    setFormData(EMPTY_FORM);
    setImagePreview('');
    setEditingId(null);
  };

  const f = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="" style={{ marginBottom: 0 }}>Product Management</h1>
        <button
          className=""
          style={{ background: 'var(--primary)' }}
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

      {showForm && (
        <div className="" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontFamily: 'Playfair Display, serif', color: 'var(--text)' }}>
            {editingId ? 'Edit Product' : 'New Product'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <FormField label="Product Name *">
                <input required style={inputStyle} value={formData.name} onChange={e => f('name', e.target.value)} placeholder="e.g. Classic Aviator" />
              </FormField>
              <FormField label="Brand *">
                <input required style={inputStyle} value={formData.brand} onChange={e => f('brand', e.target.value)} placeholder="e.g. RayBan" />
              </FormField>
              <FormField label="Sale Price ($) *">
                <input type="number" step="0.01" required style={inputStyle} value={formData.price} onChange={e => f('price', e.target.value)} placeholder="129.99" />
              </FormField>
              <FormField label="Original Price ($)">
                <input type="number" step="0.01" style={inputStyle} value={formData.originalPrice} onChange={e => f('originalPrice', e.target.value)} placeholder="Leave blank if no discount" />
              </FormField>
              <FormField label="Category *">
                <select required style={inputStyle} value={formData.category} onChange={e => f('category', e.target.value)}>
                  <option value="">Select…</option>
                  <option value="eyeglasses">Eyeglasses</option>
                  <option value="sunglasses">Sunglasses</option>
                  <option value="reading">Reading</option>
                  <option value="sport">Sport</option>
                  <option value="kids">Kids</option>
                </select>
              </FormField>
              <FormField label="Gender">
                <select style={inputStyle} value={formData.gender} onChange={e => f('gender', e.target.value)}>
                  <option value="">All</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="unisex">Unisex</option>
                  <option value="kids">Kids</option>
                </select>
              </FormField>
              <FormField label="Frame Shape">
                <input style={inputStyle} value={formData.frameShape} onChange={e => f('frameShape', e.target.value)} placeholder="e.g. Aviator, Round" />
              </FormField>
              <FormField label="Frame Material">
                <input style={inputStyle} value={formData.frameMaterial} onChange={e => f('frameMaterial', e.target.value)} placeholder="e.g. Acetate, Titanium" />
              </FormField>
              <FormField label="Frame Color">
                <input style={inputStyle} value={formData.frameColor} onChange={e => f('frameColor', e.target.value)} placeholder="e.g. Matte Black" />
              </FormField>
              <FormField label="Lens Color">
                <input style={inputStyle} value={formData.lensColor} onChange={e => f('lensColor', e.target.value)} placeholder="e.g. Green Mirror" />
              </FormField>
            </div>

            {/* Image URL */}
            <div style={{ marginBottom: '1rem' }}>
              <FormField label="Product Image URL">
                <input
                  style={inputStyle}
                  value={formData.imageUrl}
                  onChange={e => handleImageUrlChange(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </FormField>
              {imagePreview && (
                <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Image preview</span>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <FormField label="Description">
                <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={formData.description} onChange={e => f('description', e.target.value)} placeholder="Product description…" />
              </FormField>
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { key: 'isBestSeller', label: '🏆 Best Seller' },
                { key: 'isSale', label: '🔥 On Sale' },
                { key: 'isNew', label: '✨ New Arrival' },
              ].map(({ key, label }) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>
                  <input type="checkbox" checked={!!formData[key]} onChange={e => f(key, e.target.checked)} />
                  {label}
                </label>
              ))}
            </div>

            <button type="submit" className="" style={{ background: 'var(--primary)' }}>
              {editingId ? 'Update Product' : 'Create Product'}
            </button>
          </form>
        </div>
      )}

      <div className="">
        <table className="">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Price</th>
              <th>Badges</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }} onError={e => { e.target.style.display = 'none'; }} />
                  ) : (
                    <span style={{ fontSize: '1.5rem' }}>👓</span>
                  )}
                </td>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td>{p.brand}</td>
                <td style={{ textTransform: 'capitalize' }}>{p.category}</td>
                <td>
                  <strong>${p.price}</strong>
                  {p.originalPrice && p.originalPrice > p.price && (
                    <span style={{ color: 'var(--text-secondary)', textDecoration: 'line-through', fontSize: '0.82rem', marginLeft: '0.3rem' }}>${p.originalPrice}</span>
                  )}
                </td>
                <td style={{ fontSize: '0.8rem' }}>
                  {p.isBestSeller && <span style={{ background: '#fef3c7', color: '#92400e', padding: '0.15rem 0.5rem', borderRadius: '10px', marginRight: '0.3rem' }}>Best Seller</span>}
                  {p.isSale && <span style={{ background: '#fee2e2', color: '#991b1b', padding: '0.15rem 0.5rem', borderRadius: '10px', marginRight: '0.3rem' }}>Sale</span>}
                  {p.isNew && <span style={{ background: '#dcfce7', color: '#166534', padding: '0.15rem 0.5rem', borderRadius: '10px' }}>New</span>}
                </td>
                <td>
                  <button className={`${""} ${""}`} onClick={() => handleEdit(p)}>Edit</button>
                  <button className="" onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text)' }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.6rem 0.8rem',
  border: '1.5px solid var(--border)',
  borderRadius: '8px',
  fontFamily: 'inherit',
  fontSize: '0.9rem',
  color: 'var(--text)',
  background: 'var(--bg)',
  outline: 'none',
  boxSizing: 'border-box',
};
