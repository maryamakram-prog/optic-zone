'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';
import { supabase } from '@/lib/supabase';
import PrescriptionForm from '@/components/PrescriptionForm';
import Link from 'next/link';

const STATUS_STYLES = {
  completed: 'bg-green-50 text-green-700 border border-green-200',
  pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  processing: 'bg-blue-50 text-blue-700 border border-blue-200',
  cancelled: 'bg-red-50 text-red-700 border border-red-200',
};

export default function OrdersPage() {
  const { user } = useAuth();
  const { orders } = useStore();
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);
  const [selectedRxId, setSelectedRxId] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Get orders matching the logged-in user
  const userOrders = orders.filter(o =>
    o.customer?.email === user?.email ||
    o.user_id === user?.id
  );

  if (userOrders.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 shadow-sm border border-border text-center">
        <div className="w-20 h-20 rounded-full bg-ebd-blue-light flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">No Orders Yet</h2>
        <p className="text-dark-gray mb-6">You haven't placed any orders yet. Start shopping to see your orders here!</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-colors"
        >
          Browse Products →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-charcoal">My Orders</h2>
        <span className="text-sm text-text-muted font-medium">{userOrders.length} order{userOrders.length !== 1 ? 's' : ''}</span>
      </div>

      {userOrders.map(order => {
        const isExpanded = expandedOrderId === order.id;
        const statusStyle = STATUS_STYLES[order.status] || 'bg-gray-50 text-gray-700 border border-gray-200';

        return (
          <div key={order.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            {/* Order Header */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-xs font-bold text-text-muted bg-light-gray px-2.5 py-1 rounded-lg">
                    #{typeof order.id === 'string' ? order.id.substring(0, 12).toUpperCase() : order.id}
                  </span>
                  <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${statusStyle}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-text-muted">
                  Placed on {new Date(order.date || order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-text-muted font-medium">Order Total</p>
                  <p className="text-xl font-black text-accent">${(order.total || 0).toFixed(2)}</p>
                </div>
                <button
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                  className="px-4 py-2 rounded-xl border border-border text-sm font-semibold text-charcoal hover:bg-light-gray hover:border-mid-gray transition-all cursor-pointer whitespace-nowrap"
                >
                  {isExpanded ? '↑ Hide' : '↓ Details'}
                </button>
              </div>
            </div>

            {/* Order Items Preview (always visible) */}
            <div className="border-t border-border px-5 py-3 bg-off-white flex flex-wrap gap-2">
              {(order.items || order.order_items || []).slice(0, 3).map((item, idx) => (
                <span key={idx} className="text-xs font-medium text-charcoal-light bg-white border border-border px-3 py-1 rounded-full">
                  {item.name || item.products?.name || 'Frame'} ×{item.qty || item.quantity || 1}
                </span>
              ))}
              {(order.items || order.order_items || []).length > 3 && (
                <span className="text-xs font-medium text-text-muted px-3 py-1">
                  +{(order.items || order.order_items || []).length - 3} more
                </span>
              )}
            </div>

            {/* Expanded Order Details */}
            {isExpanded && (
              <div className="border-t border-border p-5 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Shipping Info */}
                  <div>
                    <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-3">Shipping Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Name</span>
                        <span className="font-semibold text-charcoal">{order.customer?.name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Email</span>
                        <span className="font-semibold text-charcoal text-right">{order.customer?.email || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Phone</span>
                        <span className="font-semibold text-charcoal">{order.customer?.phone || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Address</span>
                        <span className="font-semibold text-charcoal text-right max-w-[200px]">{order.shipping_address || order.customer?.address || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Items Detail */}
                  <div>
                    <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-3">
                      Ordered Items ({(order.items || order.order_items || []).length})
                    </h4>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {(order.items || order.order_items || []).map((item, idx) => (
                        <div key={idx} className="flex justify-between items-start gap-3 py-2.5 border-b border-border last:border-0">
                          <div className="flex flex-col gap-0.5 flex-1">
                            <span className="font-semibold text-charcoal text-sm">
                              {item.name || item.products?.name || 'Premium Frame'}
                            </span>
                            <span className="text-xs text-text-muted">
                              {item.brand || item.products?.brand || 'Optic Zone'} · Qty: {item.qty || item.quantity || 1}
                            </span>

                            {/* Prescription Info */}
                            {item.prescription && (
                              <div className="mt-2 p-2.5 bg-ebd-blue-light border border-pastel-blue rounded-xl text-xs space-y-1">
                                <span className="font-bold text-accent block">👓 Rx: {item.prescription.name}</span>
                                {item.prescription.type === 'manual' ? (
                                  <div className="text-[10px] text-dark-gray space-y-0.5">
                                    <p>OD: SPH {item.prescription.od_sph} | CYL {item.prescription.od_cyl} | AXIS {item.prescription.od_axis || '—'}</p>
                                    <p>OS: SPH {item.prescription.os_sph} | CYL {item.prescription.os_cyl} | AXIS {item.prescription.os_axis || '—'}</p>
                                    <p>PD: {item.prescription.pd} mm</p>
                                  </div>
                                ) : item.prescription.type === 'upload' ? (
                                  <a href={item.prescription.file_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-bold text-[10px]">
                                    View Uploaded Rx ↗
                                  </a>
                                ) : (
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-amber-600 font-bold text-[10px]">⚠️ Pending Upload</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedRxId(item.prescription.id);
                                        setIsRxModalOpen(true);
                                      }}
                                      className="px-2.5 py-1 bg-accent hover:bg-accent-dark text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                                    >
                                      Upload Now
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <span className="font-bold text-charcoal shrink-0 text-sm">
                            ${((item.price || item.price_at_time || 0) * (item.qty || item.quantity || 1)).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Totals */}
                <div className="mt-6 pt-4 border-t border-border flex flex-col sm:flex-row justify-end gap-4 text-sm">
                  <div className="space-y-1.5 sm:w-56">
                    <div className="flex justify-between text-text-muted">
                      <span>Status</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusStyle}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-charcoal text-base border-t border-border pt-2 mt-2">
                      <span>Total Paid</span>
                      <span className="text-accent text-lg">${(order.total || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <PrescriptionForm
        isOpen={isRxModalOpen}
        onClose={() => {
          setIsRxModalOpen(false);
          setSelectedRxId('');
        }}
        onSave={async (rxData) => {
          if (!selectedRxId) return;
          try {
            const { error } = await supabase
              .from('prescriptions')
              .update({
                type: rxData.type,
                name: rxData.name,
                od_sph: rxData.od_sph || null,
                od_cyl: rxData.od_cyl || null,
                od_axis: rxData.od_axis || null,
                od_add: rxData.od_add || null,
                os_sph: rxData.os_sph || null,
                os_cyl: rxData.os_cyl || null,
                os_axis: rxData.os_axis || null,
                os_add: rxData.os_add || null,
                pd: rxData.pd || null,
                notes: rxData.notes || null,
                file_url: rxData.file_url || null
              })
              .eq('id', selectedRxId);
            if (error) throw error;
            alert('Prescription uploaded successfully!');
            window.location.reload();
          } catch (e) {
            alert('Upload failed: ' + e.message);
          }
        }}
      />
    </div>
  );
}
