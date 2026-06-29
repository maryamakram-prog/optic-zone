import { useState, useEffect } from 'react';
import Link from 'next/link';

const USAGE_OPTIONS = [
  { id: 'single_vision', title: 'Single Vision (Distance)', desc: 'General use lenses for common prescriptions and seeing things from distance.' },
  { id: 'reading', title: 'Reading', desc: 'Lenses that magnify to assist with reading.' },
  { id: 'non_prescription', title: 'Non-Prescription', desc: 'Basic lenses with no vision correction.' },
  { id: 'progressive', title: 'Bifocal & Progressive', desc: 'One pair of glasses corrects vision at near, middle, and far distances.' },
];

export default function UsageModal({ isOpen, onClose, onSelectUsage, product, totalPrice }) {
  const [isInsuranceUsed, setIsInsuranceUsed] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full sm:w-[500px] max-h-[90vh] bg-off-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up sm:animate-fade-in">
        
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-mid-gray/30 flex items-center justify-between z-10 shrink-0">
          <button onClick={onClose} className="text-accent font-semibold flex items-center gap-2 hover:opacity-70">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            <span className="truncate max-w-[200px] text-sm">Back to {product?.name || 'Product'}</span>
          </button>
          <button onClick={onClose} className="p-1 text-dark-gray hover:text-black">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {/* Content Scrollable Area */}
        <div className="p-6 overflow-y-auto flex-1">
          <h2 className="text-3xl font-bold font-heading text-charcoal mb-2">Choose your usage</h2>
          
          <Link href="/help/lens-usage" className="inline-flex items-center gap-1.5 text-accent text-sm font-semibold underline underline-offset-4 mb-6 hover:text-accent-dark">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            Learn about different lens usages
          </Link>

          <div className="space-y-3 mb-6">
            {USAGE_OPTIONS.map((opt) => (
              <button 
                key={opt.id}
                onClick={() => onSelectUsage(opt.id)}
                className="w-full text-left p-5 bg-white rounded-2xl shadow-sm border border-transparent hover:border-accent hover:shadow-md transition-all group"
              >
                <div className="font-bold text-charcoal text-lg mb-1 group-hover:text-accent transition-colors">{opt.title}</div>
                <div className="text-dark-gray leading-snug">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="bg-white border-t border-mid-gray/30 p-6 shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-charcoal font-medium">Use insurance benefits</span>
            <div 
              onClick={() => setIsInsuranceUsed(!isInsuranceUsed)}
              className={`w-12 h-6 rounded-full relative cursor-pointer border transition-colors ${isInsuranceUsed ? 'bg-accent border-accent' : 'bg-light-gray border-mid-gray/50'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-[1px] shadow-sm transition-transform ${isInsuranceUsed ? 'translate-x-[22px]' : 'translate-x-[1px]'}`}></div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-dark-gray font-medium text-lg">Subtotal:</span>
            <span className="text-charcoal font-black text-2xl">${(totalPrice || 0).toFixed(2)}</span>
          </div>
          
          <div className="text-center text-xs text-dark-gray flex flex-wrap items-center justify-center gap-1.5">
            4 interest-free payments of ${(totalPrice / 4 || 0).toFixed(2)} 
            <span className="bg-[#B2FCE4] text-black font-bold px-1.5 py-0.5 rounded text-[10px] ml-1">Afterpay</span>
            <span className="bg-[#FFA8C5] text-black font-bold px-1.5 py-0.5 rounded text-[10px]">Klarna</span>
            <span className="w-4 h-4 rounded-full border border-dark-gray flex items-center justify-center opacity-70">i</span>
          </div>
        </div>
      </div>
    </div>
  );
}
