'use client';
import { useStore } from '@/context/StoreContext';
import { useState } from 'react';

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const filteredOrders = orders.filter(o => {
    const custName = o.customer?.name || '';
    const custEmail = o.customer?.email || '';
    const orderIdStr = o.id || '';
    const matchesSearch = custName.toLowerCase().includes(search.toLowerCase()) || 
                          custEmail.toLowerCase().includes(search.toLowerCase()) ||
                          orderIdStr.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === '' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black font-heading text-charcoal tracking-tight">Order Management</h1>
        <p className="text-sm text-dark-gray mt-1">Review store sales and update order dispatch status</p>
      </div>

      {/* Filters and List */}
      <div className="bg-white p-6 rounded-3xl border border-mid-gray/40 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-gray/60 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search by ID, name, email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-light-gray/50 rounded-xl border border-mid-gray/30 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
          <div className="flex gap-2 flex-wrap w-full sm:w-auto">
            {['', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-charcoal border-charcoal text-white shadow-sm'
                    : 'bg-light-gray/40 border-mid-gray/40 text-dark-gray hover:bg-light-gray/80'
                }`}
              >
                {status === '' ? 'All status' : status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="text-xs text-dark-gray/70 border-b border-mid-gray/30 uppercase tracking-wider font-bold">
                <th className="pb-3 px-2">Order ID</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Status Action</th>
                <th className="pb-3 text-right pr-2">Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mid-gray/35">
              {filteredOrders.map(order => {
                const isExpanded = expandedOrderId === order.id;
                return (
                  <tr key={order.id} className="hover:bg-soft-white/30 transition-colors">
                    <td className="py-4 px-2 font-mono text-xs font-semibold text-charcoal">
                      <button 
                        onClick={() => toggleExpand(order.id)}
                        className="text-accent hover:underline flex items-center gap-1.5 font-bold focus:outline-none cursor-pointer"
                      >
                        {isExpanded ? '▼' : '▶'} {order.id.substring(0, 8)}...
                      </button>
                    </td>
                    <td className="py-4 text-dark-gray text-xs font-semibold">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-charcoal text-sm">{order.customer?.name}</span>
                        <span className="text-xs text-dark-gray">{order.customer?.email}</span>
                      </div>
                    </td>
                    <td className="py-4 font-extrabold text-charcoal">${order.total.toFixed(2)}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider inline-block ${
                        order.status === 'delivered' ? 'bg-green-50 text-green-700 border border-green-200' :
                        order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                        order.status === 'confirmed' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                        order.status === 'shipped' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                        order.status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-200' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <select 
                        className="px-2 py-1.5 bg-light-gray/70 border border-mid-gray/40 rounded-xl text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-accent font-semibold"
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 text-right pr-2">
                      <button 
                        onClick={() => toggleExpand(order.id)}
                        className="px-3 py-1.5 bg-light-gray/60 hover:bg-mid-gray/60 text-charcoal text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        {isExpanded ? 'Hide Details' : `View (${order.order_items?.length || 0})`}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <p className="text-center text-sm text-dark-gray py-8">No orders found.</p>
        )}
      </div>

      {/* Expanded Order Drawer / Overlay */}
      {expandedOrderId && (() => {
        const order = orders.find(o => o.id === expandedOrderId);
        if (!order) return null;
        return (
          <div className="bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-mid-gray/40 shadow-xl space-y-6">
            <div className="flex justify-between items-center border-b border-mid-gray/30 pb-4">
              <h3 className="text-lg font-black font-heading text-charcoal">📄 Order Details & Delivery Docket</h3>
              <button 
                onClick={() => setExpandedOrderId(null)} 
                className="w-8 h-8 rounded-full bg-light-gray hover:bg-mid-gray flex items-center justify-center font-bold text-sm text-charcoal transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Shipping Address & Info */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-accent uppercase tracking-wider border-b border-mid-gray/20 pb-1">Customer & Shipping Information</h4>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between text-dark-gray"><span className="font-semibold">Full Name:</span> <strong className="text-charcoal">{order.customer?.name}</strong></p>
                  <p className="flex justify-between text-dark-gray"><span className="font-semibold">Email:</span> <strong className="text-charcoal font-mono">{order.customer?.email}</strong></p>
                  <p className="flex justify-between text-dark-gray"><span className="font-semibold">Phone:</span> <strong className="text-charcoal">{order.customer?.phone || 'N/A'}</strong></p>
                  <p className="flex justify-between text-dark-gray"><span className="font-semibold">Delivery Address:</span> <strong className="text-charcoal text-right max-w-[200px]">{order.shipping_address}</strong></p>
                  <p className="flex justify-between text-dark-gray"><span className="font-semibold">Order Date:</span> <strong className="text-charcoal">{new Date(order.date).toLocaleString()}</strong></p>
                  <p className="flex justify-between text-dark-gray"><span className="font-semibold">Payment Mode:</span> <strong className="text-charcoal uppercase">{order.paymentMethod || 'demo'}</strong></p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-accent uppercase tracking-wider border-b border-mid-gray/20 pb-1">Ordered Items ({order.order_items?.length || 0})</h4>
                <div className="divide-y divide-mid-gray/20 max-h-96 overflow-y-auto pr-2">
                  {order.order_items?.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex justify-between text-sm items-start gap-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-charcoal">{item.products?.name || item.name || 'Premium Frame'}</span>
                        <span className="text-xs text-dark-gray">Brand: {item.products?.brand || item.brand || 'Optic Zone'} | Qty: {item.quantity}</span>
                        
                        {item.prescription && (
                          <div className="mt-1.5 p-2.5 bg-light-gray/40 border border-mid-gray/25 rounded-xl text-xs max-w-md">
                            <span className="font-bold text-charcoal block mb-1">👓 Prescription: {item.prescription.name || 'Rx'}</span>
                            {item.prescription.type === 'manual' ? (
                              <div className="grid grid-cols-1 gap-1 text-[10px] text-dark-gray leading-normal">
                                <div><span className="font-semibold text-charcoal">OD (Right):</span> SPH {item.prescription.od_sph} | CYL {item.prescription.od_cyl} | AXIS {item.prescription.od_axis || '—'} | ADD {item.prescription.od_add || 'None'}</div>
                                <div><span className="font-semibold text-charcoal">OS (Left):</span> SPH {item.prescription.os_sph} | CYL {item.prescription.os_cyl} | AXIS {item.prescription.os_axis || '—'} | ADD {item.prescription.os_add || 'None'}</div>
                                <div><span className="font-semibold text-charcoal">PD:</span> {item.prescription.pd} mm</div>
                                {item.prescription.notes && <div className="italic text-dark-gray/80 mt-0.5">Notes: {item.prescription.notes}</div>}
                              </div>
                            ) : item.prescription.type === 'upload' ? (
                              <div className="text-[10px] text-dark-gray space-y-1">
                                <span>Uploaded Document.</span>
                                <a href={item.prescription.file_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-bold block mt-0.5">
                                  View / Download Rx File ↗
                                </a>
                              </div>
                            ) : (
                              <div className="text-[10px] text-amber-600 font-bold">
                                ⚠️ Pending User Upload (Skip & Upload Later)
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <span className="font-extrabold text-charcoal shrink-0">${(item.price_at_time * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  {(!order.order_items || order.order_items.length === 0) && (
                    <p className="text-xs text-dark-gray py-4 text-center">No item details saved for this order.</p>
                  )}
                </div>
                {(() => {
                  const itemSubtotal = order.order_items?.reduce((sum, item) => sum + (item.price_at_time * item.quantity), 0) || 0;
                  const estimatedShipping = itemSubtotal >= 99 || itemSubtotal === 0 ? 0 : 9.99;
                  const estimatedTax = itemSubtotal * 0.08;
                  const computedTotal = itemSubtotal + estimatedShipping + estimatedTax;
                  const estimatedDiscount = Math.max(0, computedTotal - order.total);
                  return (
                    <div className="pt-4 border-t border-mid-gray/30 space-y-1.5 text-sm">
                      <div className="flex justify-between text-dark-gray">
                        <span>Items Subtotal:</span>
                        <span className="font-semibold text-charcoal">${itemSubtotal.toFixed(2)}</span>
                      </div>
                      {estimatedDiscount > 0.01 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount Applied:</span>
                          <span className="font-semibold">-${estimatedDiscount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-dark-gray">
                        <span>Shipping:</span>
                        <span className="font-semibold text-charcoal">{estimatedShipping === 0 ? 'Free' : `$${estimatedShipping.toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between text-dark-gray">
                        <span>Estimated Tax (8%):</span>
                        <span className="font-semibold text-charcoal">${estimatedTax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-mid-gray/20">
                        <span className="font-bold text-charcoal text-base">Total Amount:</span>
                        <strong className="text-xl font-black text-accent">${order.total.toFixed(2)}</strong>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
