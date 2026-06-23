'use client';
import { useStore } from '@/context/StoreContext';
import { useState } from 'react';

export default function AdminCouponsPage() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState('percent');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!code.trim()) {
      setError('Coupon code is required.');
      return;
    }
    const valNum = parseFloat(value);
    if (isNaN(valNum) || valNum <= 0) {
      setError('Discount value must be a positive number.');
      return;
    }

    const payload = {
      code: code.trim().toUpperCase(),
      type,
      value: valNum,
      active: true
    };

    const res = await addCoupon(payload);
    if (res.error) {
      setError(res.error.message || 'Error creating coupon.');
    } else {
      setCode('');
      setValue('');
      setShowForm(false);
    }
  };

  const handleToggleActive = async (id, currentActive) => {
    await updateCoupon(id, { active: !currentActive });
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this coupon code?')) {
      await deleteCoupon(id);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black font-heading text-charcoal tracking-tight">Coupons & Discounts</h1>
          <p className="text-sm text-dark-gray mt-1">Configure active promotional codes and checkout price cuts</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 bg-charcoal hover:bg-black text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-black/10 hover:-translate-y-0.5 cursor-pointer"
        >
          {showForm ? 'Cancel' : '+ New Coupon Code'}
        </button>
      </div>

      {/* Coupon Form */}
      {showForm && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-mid-gray/40 max-w-xl">
          <h3 className="text-lg font-bold text-charcoal mb-4 border-b border-mid-gray/20 pb-2">🏷️ Generate Promo Code</h3>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-200 text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal/80 uppercase tracking-wider mb-2">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SAVE25"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="input uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-charcoal/80 uppercase tracking-wider mb-2">Discount Type *</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="input"
                >
                  <option value="percent">Percentage Off (%)</option>
                  <option value="fixed">Fixed Dollar Off ($)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal/80 uppercase tracking-wider mb-2">Discount Value *</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder={type === 'percent' ? 'e.g. 15 for 15%' : 'e.g. 20 for $20'}
                value={value}
                onChange={e => setValue(e.target.value)}
                className="input"
              />
            </div>

            <button 
              type="submit"
              className="px-5 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-accent/20 cursor-pointer"
            >
              Create Code
            </button>
          </form>
        </div>
      )}

      {/* Coupons Table */}
      <div className="bg-white p-6 rounded-3xl border border-mid-gray/40 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="text-xs text-dark-gray/70 border-b border-mid-gray/30 uppercase tracking-wider font-bold">
                <th className="pb-3 px-2">Promo Code</th>
                <th className="pb-3">Discount Details</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mid-gray/30">
              {coupons.map(c => (
                <tr key={c.id} className="hover:bg-soft-white/50 transition-colors">
                  <td className="py-4 px-2">
                    <strong className="text-charcoal font-mono text-sm tracking-wider bg-light-gray px-3 py-1.5 rounded-lg border border-mid-gray/30">
                      🏷️ {c.code}
                    </strong>
                  </td>
                  <td className="py-4">
                    <span className="font-bold text-charcoal">
                      {c.type === 'percent' ? `${c.value}% Off` : `$${c.value} Off`}
                    </span>
                    <span className="text-xs text-dark-gray block mt-0.5">Applied on order subtotal</span>
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => handleToggleActive(c.id, c.active)}
                      className={`px-3 py-1 text-xs font-bold rounded-full border transition-all cursor-pointer ${
                        c.active 
                          ? 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200' 
                          : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
                      }`}
                    >
                      {c.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="py-4 text-right pr-2">
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-dark-gray py-8">No coupons configured.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
