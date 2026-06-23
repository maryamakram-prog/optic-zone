'use client';
import { useStore } from '@/context/StoreContext';


export default function AdminDashboardPage() {
  const { products, orders, customers, appointments } = useStore();

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold font-heading text-charcoal mb-8">Dashboard Summary</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-mid-gray/30">
          <div className="text-sm font-bold text-dark-gray/70 uppercase tracking-wider mb-2">Total Revenue</div>
          <div className="text-3xl font-bold text-accent">${totalRevenue.toFixed(2)}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-mid-gray/30">
          <div className="text-sm font-bold text-dark-gray/70 uppercase tracking-wider mb-2">Total Orders</div>
          <div className="text-3xl font-bold text-charcoal">{orders.length}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-mid-gray/30">
          <div className="text-sm font-bold text-dark-gray/70 uppercase tracking-wider mb-2">Total Customers</div>
          <div className="text-3xl font-bold text-charcoal">{customers.length}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-mid-gray/30">
          <div className="text-sm font-bold text-dark-gray/70 uppercase tracking-wider mb-2">Total Products</div>
          <div className="text-3xl font-bold text-charcoal">{products.length}</div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold font-heading text-charcoal mb-6">Recent Appointments</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-mid-gray/30 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-light-gray/50 border-b border-mid-gray/30">
              <th className="px-6 py-4 text-xs font-bold text-dark-gray/70 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-xs font-bold text-dark-gray/70 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-dark-gray/70 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-xs font-bold text-dark-gray/70 uppercase tracking-wider">Service</th>
              <th className="px-6 py-4 text-xs font-bold text-dark-gray/70 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mid-gray/30">
            {appointments.slice(0, 5).map(apt => (
              <tr key={apt.id} className="hover:bg-soft-white transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-charcoal">{apt.id}</td>
                <td className="px-6 py-4 text-sm text-dark-gray">{new Date(apt.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm font-medium text-charcoal">{apt.firstName} {apt.lastName}</td>
                <td className="px-6 py-4 text-sm text-dark-gray capitalize">{apt.service.replace('-', ' ')}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {apt.status}
                  </span>
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-dark-gray">No appointments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
