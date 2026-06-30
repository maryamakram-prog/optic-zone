'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';

const STATUS_STAGE = {
  cancelled: 0,
  pending: 1,
  processing: 2,
  shipped: 3,
  'out-for-delivery': 4,
  completed: 5,
};

const STATUS_STYLES = {
  completed:  'bg-green-50 text-green-700 border border-green-200',
  pending:    'bg-yellow-50 text-yellow-700 border border-yellow-200',
  processing: 'bg-blue-50 text-blue-700 border border-blue-200',
  shipped:    'bg-indigo-50 text-indigo-700 border border-indigo-200',
  cancelled:  'bg-red-50 text-red-700 border border-red-200',
};

const TIMELINE_STEPS = [
  { title: 'Order Placed',      icon: '🛒', desc: 'We have received your order and payment has been confirmed.' },
  { title: 'Processing',        icon: '⚙️', desc: 'Your frames are being prepared and lens package custom-fit.' },
  { title: 'Shipped',           icon: '📦', desc: 'Handed over to carrier (OpticExpress).' },
  { title: 'Out for Delivery',  icon: '🚚', desc: 'Courier is on the way to your delivery address.' },
  { title: 'Delivered',         icon: '✅', desc: 'Package delivered successfully. Enjoy your eyewear!' },
];

export default function OrderTrackingPage() {
  const { user } = useAuth();
  const { orders, loading } = useStore();
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [typedOrderId, setTypedOrderId]       = useState('');
  const [currentOrder, setCurrentOrder]       = useState(null);
  const [searchError, setSearchError]         = useState('');

  // Bug fix: safe optional chaining on customer.email
  const userOrders = orders.filter(o =>
    o.customer?.email === user?.email || o.user_id === user?.id
  );

  // Auto-select first order when data loads
  useEffect(() => {
    if (userOrders.length > 0 && !currentOrder) {
      setSelectedOrderId(userOrders[0].id);
      setCurrentOrder(userOrders[0]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders]);

  const handleDropdownChange = (e) => {
    const id = e.target.value;
    setSelectedOrderId(id);
    setSearchError('');
    if (id) {
      const found = orders.find(o => o.id === id);
      setCurrentOrder(found || null);
    } else {
      setCurrentOrder(null);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = typedOrderId.trim().toLowerCase();
    if (!q) return;

    // Match full ID or first 12 chars (how they're displayed in the UI)
    const found = orders.find(o =>
      String(o.id).toLowerCase() === q ||
      String(o.id).toLowerCase().startsWith(q)
    );

    if (found) {
      setCurrentOrder(found);
      setSelectedOrderId(found.id);
      setSearchError('');
      setTypedOrderId('');
    } else {
      setSearchError(`No order found with ID "${q}". Please check your order confirmation email.`);
      setCurrentOrder(null);
    }
  };

  // Bug fix: safe items access — normalize to the mapped `items` array or fall back to order_items
  const getOrderItems = (order) =>
    order?.items?.length ? order.items : (order?.order_items || []).map(item => ({
      id: item.product_id,
      name: item.products?.name || item.name || 'Premium Frame',
      brand: item.products?.brand || item.brand || 'Optic Zone',
      price: Number(item.price_at_time) || 0,
      qty: item.quantity || 1,
    }));

  const currentStage = currentOrder ? (STATUS_STAGE[currentOrder.status] ?? 1) : 0;

  // Bug fix: safe short ID — works with both UUID and ord-xxx formats
  const shortId = (id) => id ? String(id).substring(0, 12).toUpperCase() : '—';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-[3px] border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-charcoal">Track Your Order</h2>
        <p className="text-sm text-text-muted mt-1">Enter your order ID or select one of your recent orders below.</p>
      </div>

      {/* Search / Select */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-sm flex flex-wrap gap-6">
        {/* Dropdown for logged-in users with orders */}
        {userOrders.length > 0 && (
          <div className="flex-1 min-w-[220px] space-y-2">
            <label htmlFor="orderSelect" className="block text-sm font-semibold text-charcoal">
              Select one of your orders
            </label>
            <select
              id="orderSelect"
              value={selectedOrderId}
              onChange={handleDropdownChange}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-off-white text-charcoal text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all cursor-pointer"
            >
              <option value="">— Select an order —</option>
              {userOrders.map(o => (
                <option key={o.id} value={o.id}>
                  #{shortId(o.id)} — {new Date(o.date || o.created_at).toLocaleDateString()} — ${(o.total || 0).toFixed(2)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Manual order ID search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[220px] space-y-2">
          <label htmlFor="searchId" className="block text-sm font-semibold text-charcoal">
            {userOrders.length > 0 ? 'Or enter any Order ID' : 'Enter your Order ID'}
          </label>
          <div className="flex gap-2">
            <input
              id="searchId"
              type="text"
              placeholder="e.g. 550E8400-E29B..."
              value={typedOrderId}
              onChange={e => setTypedOrderId(e.target.value)}
              className="flex-1 px-3 py-2.5 rounded-xl border border-border bg-off-white text-charcoal placeholder-text-muted text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-dark transition-colors cursor-pointer whitespace-nowrap"
            >
              Track
            </button>
          </div>
        </form>
      </div>

      {/* Error */}
      {searchError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <span className="shrink-0 text-base">⚠️</span>
          <p>{searchError}</p>
        </div>
      )}

      {/* Tracking Card */}
      {currentOrder ? (
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="p-5 sm:p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <span className="font-mono text-xs font-bold text-text-muted bg-light-gray px-2.5 py-1 rounded-lg">
                  #{shortId(currentOrder.id)}
                </span>
                <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${STATUS_STYLES[currentOrder.status] || 'bg-gray-50 text-gray-700 border border-gray-200'}`}>
                  {currentOrder.status}
                </span>
              </div>
              <p className="text-sm text-text-muted">
                Placed on {new Date(currentOrder.date || currentOrder.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                &nbsp;·&nbsp;Carrier: <strong className="text-charcoal">OpticExpress</strong>
                &nbsp;·&nbsp;Tracking: <span className="font-mono font-semibold text-charcoal">OE-{shortId(currentOrder.id)}-US</span>
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-text-muted font-medium">Order Total</p>
              <p className="text-2xl font-black text-accent">${(currentOrder.total || 0).toFixed(2)}</p>
            </div>
          </div>

          {/* Cancelled Banner */}
          {currentOrder.status === 'cancelled' ? (
            <div className="m-5 sm:m-6 p-5 bg-red-50 border border-red-200 rounded-xl">
              <h4 className="font-bold text-red-700 mb-1">❌ This order has been cancelled</h4>
              <p className="text-sm text-red-600">Any applicable refund has been processed. Contact support if you have questions.</p>
            </div>
          ) : (
            /* Timeline */
            <div className="p-5 sm:p-6">
              <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-5">Delivery Timeline</h4>
              <div className="relative pl-10">
                {/* Vertical line */}
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border rounded-full" />
                {/* Progress line */}
                <div
                  className="absolute left-4 top-4 w-0.5 bg-accent rounded-full transition-all duration-700"
                  style={{ height: `${((Math.max(0, currentStage - 1)) / (TIMELINE_STEPS.length - 1)) * 100}%` }}
                />

                <div className="space-y-5">
                  {TIMELINE_STEPS.map((step, idx) => {
                    const stepNum = idx + 1;
                    const isCompleted = stepNum < currentStage;
                    const isCurrent   = stepNum === currentStage;
                    const isPending   = stepNum > currentStage;

                    return (
                      <div key={idx} className="flex gap-4 items-start">
                        {/* Dot */}
                        <div className={`
                          relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 -ml-10 text-sm font-bold transition-all duration-300
                          ${isCompleted ? 'bg-accent text-white shadow-md shadow-accent/30' : ''}
                          ${isCurrent   ? 'bg-accent text-white ring-4 ring-accent/20 scale-110 shadow-lg shadow-accent/30' : ''}
                          ${isPending   ? 'bg-light-gray text-text-muted border border-border' : ''}
                        `}>
                          {isCompleted ? '✓' : step.icon}
                        </div>

                        {/* Content */}
                        <div className={`flex-1 pb-1 rounded-xl p-3 transition-all duration-300 ${isCurrent ? 'bg-ebd-blue-light border border-accent/20' : 'bg-off-white border border-border'}`}>
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <h5 className={`text-sm font-bold ${isCurrent ? 'text-accent' : isCompleted ? 'text-charcoal' : 'text-text-muted'}`}>
                              {step.title}
                            </h5>
                            {isCurrent && (
                              <span className="text-[10px] font-bold bg-accent text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Current
                              </span>
                            )}
                          </div>
                          <p className={`text-xs leading-relaxed ${isCurrent ? 'text-accent/80' : 'text-text-muted'}`}>
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Order Items Summary */}
          <div className="border-t border-border p-5 sm:p-6">
            <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Items in This Order</h4>
            <div className="space-y-2.5">
              {getOrderItems(currentOrder).map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-border/60 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{item.name || 'Premium Frame'}</p>
                    <p className="text-xs text-text-muted">{item.brand || 'Optic Zone'} · Qty: {item.qty || item.quantity || 1}</p>
                  </div>
                  <span className="text-sm font-bold text-charcoal shrink-0">
                    ${((item.price || item.price_at_time || 0) * (item.qty || item.quantity || 1)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-border flex justify-between items-center">
              <span className="font-bold text-charcoal">Total Paid</span>
              <span className="text-xl font-black text-accent">${(currentOrder.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="bg-white rounded-2xl border border-border p-12 text-center shadow-sm">
          <div className="w-20 h-20 rounded-full bg-ebd-blue-light flex items-center justify-center mx-auto mb-5">
            <span className="text-4xl">📦</span>
          </div>
          <h3 className="text-xl font-bold text-charcoal mb-2">No order selected</h3>
          <p className="text-sm text-text-muted max-w-sm mx-auto">
            {userOrders.length > 0
              ? 'Select one of your orders from the dropdown above, or enter an Order ID to see delivery status.'
              : 'Enter your Order ID in the field above to track your package in real time.'}
          </p>
        </div>
      )}
    </div>
  );
}
