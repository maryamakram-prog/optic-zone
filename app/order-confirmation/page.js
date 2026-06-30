'use client';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

export default function OrderConfirmationPage() {
  const { orders } = useStore();
  
  // Get the most recent order (we just added it)
  const recentOrder = orders[0];

  if (!recentOrder) {
    return (
      <div className="py-20 bg-off-white min-h-[80vh] flex items-center justify-center">
        <div className="text-center p-10 bg-white rounded-3xl shadow-xl shadow-black/5 border border-mid-gray/30 mx-4 max-w-lg">
          <h1 className="text-3xl font-bold font-heading text-charcoal mb-4">No recent orders found</h1>
          <Link href="/" className="px-8 py-3.5 bg-gradient-to-r from-accent to-pastel-blue text-white font-semibold rounded-xl hover:shadow-lg transition-all inline-block">Return to Shop</Link>
        </div>
      </div>
    );
  }

  // Calculate estimated delivery date (5 days from date of purchase)
  const orderDate = new Date(recentOrder.date);
  const deliveryEstStart = new Date(orderDate);
  deliveryEstStart.setDate(orderDate.getDate() + 5);
  const deliveryEstEnd = new Date(orderDate);
  deliveryEstEnd.setDate(orderDate.getDate() + 7);

  const deliveryString = `${deliveryEstStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${deliveryEstEnd.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;

  return (
    <div className="py-8 bg-off-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-mid-gray/30 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent via-pastel-blue to-accent-dark"></div>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎉</span>
          </div>
          <h1 className="text-4xl font-bold font-heading text-charcoal mb-4">Order Confirmed!</h1>
          <p className="text-dark-gray leading-relaxed mb-10 max-w-lg mx-auto">
            Thank you for your purchase, <span className="font-semibold text-charcoal">{recentOrder.customer.name.split(' ')[0]}</span>! 
            We have received your order and will begin processing it right away.
          </p>

          {/* Timeline Visual Stepper */}
          <div className="flex items-center justify-between max-w-md mx-auto mb-12 relative">
            <div className="absolute top-4 left-0 w-full h-1 bg-light-gray -z-10 rounded-full"></div>
            <div className="absolute top-4 left-0 w-1/4 h-1 bg-accent -z-10 rounded-full"></div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center font-bold shadow-md shadow-accent/30">
                <span>✓</span>
              </div>
              <span className="text-xs font-semibold text-charcoal">Order Placed</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-white border-2 border-mid-gray text-dark-gray flex items-center justify-center font-bold">
                <span>2</span>
              </div>
              <span className="text-xs font-medium text-dark-gray">Processing</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-white border-2 border-mid-gray text-dark-gray flex items-center justify-center font-bold">
                <span>3</span>
              </div>
              <span className="text-xs font-medium text-dark-gray">Shipped</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-white border-2 border-mid-gray text-dark-gray flex items-center justify-center font-bold">
                <span>4</span>
              </div>
              <span className="text-xs font-medium text-dark-gray">Delivered</span>
            </div>
          </div>

          {/* Items List */}
          <div className="text-left mb-10 border border-mid-gray/30 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-light-gray/50 px-6 py-4 border-b border-mid-gray/30">
              <h3 className="font-bold text-charcoal">Purchased Items ({recentOrder.order_items?.length || 0})</h3>
            </div>
            <div className="divide-y divide-mid-gray/20">
              {recentOrder.order_items?.map((item, idx) => {
                // Ensure image works for local fallback or Supabase 'products' join
                const imageUrl = item.products?.image_url || item.image_url || '/placeholder.png';
                return (
                  <div key={idx} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-white">
                    <div className="w-20 h-20 shrink-0 bg-light-gray rounded-xl overflow-hidden border border-mid-gray/20">
                      <img 
                        src={imageUrl} 
                        alt={item.products?.name || item.name} 
                        className="w-full h-full object-cover" 
                        loading="lazy"
                        decoding="async"
                        style={{ filter: `hue-rotate(${((item.products?.name || item.name || '').length * 27 + (typeof (item.product_id || item.id) === 'string' ? (item.product_id || item.id).charCodeAt(0) : (item.product_id || item.id || 0)) * 13) % 360}deg)` }}
                        onError={(e) => { e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="%23f3f4f6"><rect width="100" height="100" fill="%23f3f4f6"/><path d="M20 40 Q35 25 50 40 Q65 25 80 40" stroke="%239ca3af" stroke-width="3" fill="none"/><circle cx="35" cy="55" r="15" stroke="%239ca3af" stroke-width="3" fill="none"/><circle cx="65" cy="55" r="15" stroke="%239ca3af" stroke-width="3" fill="none"/><path d="M42.5 55 L57.5 55" stroke="%239ca3af" stroke-width="3" fill="none"/></svg>'; }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-charcoal">{item.products?.name || item.name || 'Premium Frame'}</h4>
                      <p className="text-sm text-dark-gray mt-1">Brand: {item.products?.brand || item.brand || 'Optic Zone'}</p>
                      {item.prescription && (
                        <p className="text-xs text-accent mt-1 font-semibold flex items-center gap-1">
                          👓 Prescription Included ({item.prescription.type})
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-charcoal text-lg">${item.price_at_time?.toFixed(2)}</div>
                      <div className="text-sm text-dark-gray mt-1">Qty: {item.quantity}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-light-gray/50 rounded-2xl p-6 text-left space-y-4 mb-10 border border-mid-gray/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-mid-gray/30 gap-2">
              <span className="text-dark-gray text-sm">Order Number:</span>
              <strong className="text-charcoal font-mono">{recentOrder.id}</strong>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-mid-gray/30 gap-2">
              <span className="text-dark-gray text-sm">Delivery Estimate:</span>
              <strong className="text-accent font-semibold flex items-center gap-2">🚚 {deliveryString}</strong>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-mid-gray/30 gap-2">
              <span className="text-dark-gray text-sm">Shipping To:</span>
              <strong className="text-charcoal">{recentOrder.customer.name}</strong>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-mid-gray/30 gap-2">
              <span className="text-dark-gray text-sm">Delivery Address:</span>
              <strong className="text-charcoal text-right max-w-xs">{recentOrder.shipping_address || recentOrder.customer.address}</strong>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-mid-gray/30 gap-2">
              <span className="text-dark-gray text-sm">Email:</span>
              <strong className="text-charcoal">{recentOrder.customer.email}</strong>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-dark-gray text-sm">Total Amount:</span>
              <strong className="text-charcoal text-xl">${recentOrder.total?.toFixed(2) || '0.00'}</strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href={`/account/tracking?id=${recentOrder.id}`} className="px-6 py-3.5 bg-charcoal text-white rounded-xl font-semibold hover:bg-black transition-colors">
              Track Your Order
            </Link>
            <Link href="/products" className="px-6 py-3.5 bg-white text-charcoal border border-mid-gray rounded-xl font-semibold hover:bg-light-gray transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
