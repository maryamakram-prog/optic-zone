'use client';
import { useStore } from '@/context/StoreContext';
import { useState } from 'react';

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useStore();
  const [siteName, setSiteName] = useState(settings?.siteName || 'Optic Zone');
  const [supportEmail, setSupportEmail] = useState(settings?.supportEmail || 'support@opticzone.com');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(settings?.freeShippingThreshold || 99);
  const [taxRate, setTaxRate] = useState(settings?.taxRate || 8);
  const [primaryColor, setPrimaryColor] = useState(settings?.primaryColor || 'default');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(false);
    updateSettings({
      siteName,
      supportEmail,
      freeShippingThreshold: parseFloat(freeShippingThreshold) || 0,
      taxRate: parseFloat(taxRate) || 0,
      primaryColor
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black font-heading text-charcoal tracking-tight">Website Settings</h1>
        <p className="text-sm text-dark-gray mt-1">Configure global store constants, thresholds, and brand layouts</p>
      </div>

      {saved && (
        <div className="p-4 bg-green-50 text-green-700 rounded-2xl border border-green-200 text-sm font-semibold text-center animate-pulse">
          ✅ Settings saved and updated globally!
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-mid-gray/40 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-charcoal mb-4 border-b border-mid-gray/20 pb-2">⚙️ Global Configuration</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-charcoal/80 uppercase tracking-wider">Storefront Name</label>
            <input 
              type="text"
              required
              value={siteName}
              onChange={e => setSiteName(e.target.value)}
              className="input text-sm"
              placeholder="e.g. Optic Zone"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-charcoal/80 uppercase tracking-wider">Support Email Address</label>
            <input 
              type="email"
              required
              value={supportEmail}
              onChange={e => setSupportEmail(e.target.value)}
              className="input text-sm"
              placeholder="support@opticzone.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-charcoal/80 uppercase tracking-wider">Free Shipping Threshold ($)</label>
            <input 
              type="number"
              required
              value={freeShippingThreshold}
              onChange={e => setFreeShippingThreshold(e.target.value)}
              className="input text-sm"
              placeholder="99"
            />
            <span className="text-[10px] text-dark-gray block mt-0.5">Orders above this threshold receive free shipping automatically.</span>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-charcoal/80 uppercase tracking-wider">Sales Tax Rate (%)</label>
            <input 
              type="number"
              step="0.1"
              required
              value={taxRate}
              onChange={e => setTaxRate(e.target.value)}
              className="input text-sm"
              placeholder="8"
            />
            <span className="text-[10px] text-dark-gray block mt-0.5">Applied at checkout page calculation.</span>
          </div>
        </div>

        <div className="space-y-1.5 border-t border-mid-gray/20 pt-6">
          <label className="block text-xs font-bold text-charcoal/80 uppercase tracking-wider mb-2">Primary Brand Theme</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: 'default', label: 'Default Violet (Premium)', class: 'bg-[#7C6DC8] border-[#7C6DC8]' },
              { id: 'sky', label: 'Ocean Sky Blue (Bright)', class: 'bg-[#3b82f6] border-[#3b82f6]' },
              { id: 'slate', label: 'Modern Graphite (Minimal)', class: 'bg-[#475569] border-[#475569]' }
            ].map(theme => (
              <label 
                key={theme.id}
                className={`p-4 rounded-2xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                  primaryColor === theme.id 
                    ? 'border-accent bg-accent/5 font-semibold text-charcoal' 
                    : 'border-mid-gray/40 hover:border-accent/40 text-dark-gray'
                }`}
              >
                <input 
                  type="radio" 
                  name="theme" 
                  value={theme.id}
                  checked={primaryColor === theme.id}
                  onChange={() => setPrimaryColor(theme.id)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full ${theme.class}`}></div>
                <span className="text-xs">{theme.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-mid-gray/20 pt-6">
          <button 
            type="submit"
            className="px-6 py-3.5 bg-accent hover:bg-accent-dark text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-accent/20 cursor-pointer"
          >
            Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
}
