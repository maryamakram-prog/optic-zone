'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';
import { supabase } from '@/lib/supabase';
import PrescriptionForm from '@/components/PrescriptionForm';

export default function OrdersPage() {
  const { user } = useAuth();
  const { orders } = useStore();
  
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);
  const [selectedRxId, setSelectedRxId] = useState('');
  
  // Get orders matching user email
  const userOrders = orders.filter(o => o.customer?.email === user?.email);

  return (
    <div>
      <h2 className="">My Orders</h2>
      {userOrders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div className="orderList">
          {userOrders.map(order => (
            <div key={order.id} className="orderCard">
              <div className="orderHeader">
                <div>
                  <strong>Order ID:</strong> {order.id}
                </div>
                <div>
                  <span className={`status ${order.status}`}>{order.status}</span>
                </div>
              </div>
              <div className="orderDate">
                Placed on {new Date(order.date).toLocaleDateString()}
              </div>
              <div className="orderItems">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-4 border-b border-mid-gray/25 last:border-0 last:pb-0 first:pt-0">
                    <div className="flex justify-between items-center text-sm font-semibold text-charcoal mb-2">
                      <span>{item.qty}x {item.name} ({item.brand})</span>
                      <span>${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                    {item.prescription && (
                      <div className="p-3 bg-light-gray/40 border border-mid-gray/30 rounded-xl text-xs max-w-lg space-y-1.5 mt-2">
                        <span className="font-bold text-charcoal block">👓 Prescription: {item.prescription.name}</span>
                        {item.prescription.type === 'manual' ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[10px] text-dark-gray leading-normal">
                            <div><span className="font-semibold text-charcoal">OD (Right):</span> SPH {item.prescription.od_sph} | CYL {item.prescription.od_cyl} | AXIS {item.prescription.od_axis || '—'} | ADD {item.prescription.od_add || 'None'}</div>
                            <div><span className="font-semibold text-charcoal">OS (Left):</span> SPH {item.prescription.os_sph} | CYL {item.prescription.os_cyl} | AXIS {item.prescription.os_axis || '—'} | ADD {item.prescription.os_add || 'None'}</div>
                            <div className="col-span-2"><span className="font-semibold text-charcoal">PD:</span> {item.prescription.pd} mm</div>
                          </div>
                        ) : item.prescription.type === 'upload' ? (
                          <div className="text-[10px] text-dark-gray flex justify-between items-center gap-4">
                            <span>Uploaded prescription document.</span>
                            <a href={item.prescription.file_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-bold shrink-0">
                              View/Download File ↗
                            </a>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <span className="text-[10px] text-amber-600 font-bold">⚠️ Pending Prescription Upload</span>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRxId(item.prescription.id);
                                setIsRxModalOpen(true);
                              }}
                              className="px-3 py-1.5 bg-accent hover:bg-accent-dark text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-sm w-full sm:w-auto text-center"
                            >
                              Upload Now
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="orderTotal">
                <strong>Total:</strong> ${order.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
      <style jsx>{`
        .orderList {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .orderCard {
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.5rem;
        }
        .orderHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }
        .orderDate {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }
        .orderItems {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border);
        }
        .orderItem {
          display: flex;
          justify-content: space-between;
          color: var(--text);
        }
        .orderTotal {
          text-align: right;
          font-size: 1.2rem;
          color: var(--primary);
        }
        .status {
          padding: 0.25rem 0.75rem;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        .status.completed { background: #d1fae5; color: #065f46; }
        .status.pending { background: #fef3c7; color: #92400e; }
        .status.processing { background: #dbeafe; color: #1e40af; }
        .status.cancelled { background: #fee2e2; color: #991b1b; }
      `}</style>

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
                type: rxData.type === 'upload_later' ? 'upload_later' : rxData.type,
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
