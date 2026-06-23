'use client';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

export default function OrderConfirmationPage() {
  const { orders } = useStore();
  
  // Get the most recent order (we just added it)
  const recentOrder = orders[0];

  if (!recentOrder) {
    return (
      <div className="pt-32 pb-20 bg-soft-white min-h-[80vh] flex items-center justify-center">
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
    <div className="pt-32 pb-20 bg-soft-white min-h-screen">
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
              <span className="text-dark-gray text-sm">Email:</span>
              <strong className="text-charcoal">{recentOrder.customer.email}</strong>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-dark-gray text-sm">Total Amount:</span>
              <strong className="text-charcoal text-xl">${recentOrder.total.toFixed(2)}</strong>
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
