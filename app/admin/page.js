'use client';
import { useStore } from '@/context/StoreContext';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { products, orders, customers, appointments } = useStore();

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  // Calculate category distribution
  const categoriesCount = products.reduce((acc, p) => {
    const cat = p.category || 'other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const catLabels = Object.keys(categoriesCount);
  const catValues = Object.values(categoriesCount);
  const maxCatVal = Math.max(...catValues, 1);

  // Demo Sales Trends over 7 Days
  const demoSales = [
    { date: 'Jun 17', revenue: 320 },
    { date: 'Jun 18', revenue: 540 },
    { date: 'Jun 19', revenue: 410 },
    { date: 'Jun 20', revenue: 890 },
    { date: 'Jun 21', revenue: 620 },
    { date: 'Jun 22', revenue: 1050 },
    { date: 'Today', revenue: Math.max(totalRevenue, 1200) }
  ];

  const maxRevenue = Math.max(...demoSales.map(s => s.revenue), 1000);

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black font-heading text-charcoal tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-dark-gray mt-1">Real-time storefront metrics and sales analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="px-5 py-2.5 bg-gradient-to-r from-accent to-pastel-blue text-white font-semibold rounded-xl text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
            + New Product
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', val: `$${totalRevenue.toFixed(2)}`, desc: 'Gross completed sales', icon: '💰', color: 'text-accent bg-accent/10 border-accent/20' },
          { label: 'Total Orders', val: orders.length, desc: `${pendingOrders} pending, ${completedOrders} done`, icon: '🛒', color: 'text-pastel-blue-dark bg-pastel-blue/15 border-pastel-blue/30' },
          { label: 'Registered Users', val: customers.length, desc: 'Store customers & admins', icon: '👥', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
          { label: 'Active Products', val: products.length, desc: 'Active listing catalog', icon: '📦', color: 'text-amber-600 bg-amber-50 border-amber-200' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-mid-gray/40 flex items-center justify-between hover-lift">
            <div className="space-y-1 min-w-0">
              <span className="text-xs font-bold text-dark-gray/70 uppercase tracking-wider block">{kpi.label}</span>
              <span className="text-2xl sm:text-3xl font-black text-charcoal block leading-none">{kpi.val}</span>
              <span className="text-xs text-dark-gray/70 truncate block">{kpi.desc}</span>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl border ${kpi.color} flex-shrink-0`}>
              {kpi.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Analytics SVG Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Trend SVG line chart */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-mid-gray/40 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-mid-gray/30 pb-4">
            <h3 className="text-lg font-bold text-charcoal">Weekly Sales Trend</h3>
            <span className="text-xs px-2.5 py-1 bg-accent/10 text-accent font-bold rounded-lg">Demo + Live</span>
          </div>
          
          {/* SVG Line Graph */}
          <div className="relative w-full h-64">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f3f5" strokeWidth="1" />
              <line x1="40" y1="70" x2="480" y2="70" stroke="#f1f3f5" strokeWidth="1" />
              <line x1="40" y1="120" x2="480" y2="120" stroke="#f1f3f5" strokeWidth="1" />
              <line x1="40" y1="170" x2="480" y2="170" stroke="#f1f3f5" strokeWidth="1" />

              {/* Line path */}
              <path
                d={`M ${demoSales.map((s, i) => `${40 + i * 70} ${170 - (s.revenue / maxRevenue) * 130}`).join(' L ')}`}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-[shimmer_2s_infinite]"
              />

              {/* Gradient area under line */}
              <path
                d={`M 40 170 L ${demoSales.map((s, i) => `${40 + i * 70} ${170 - (s.revenue / maxRevenue) * 130}`).join(' L ')} L ${40 + (demoSales.length - 1) * 70} 170 Z`}
                fill="url(#chartGrad)"
                opacity="0.15"
              />

              {/* Line Points */}
              {demoSales.map((s, i) => (
                <circle
                  key={i}
                  cx={40 + i * 70}
                  cy={170 - (s.revenue / maxRevenue) * 130}
                  r="5.5"
                  fill="white"
                  stroke="var(--color-accent)"
                  strokeWidth="2.5"
                  className="hover:scale-125 transition-transform cursor-pointer"
                />
              ))}

              {/* Y Axis Labels */}
              <text x="30" y="24" textAnchor="end" className="text-[9px] fill-dark-gray font-bold font-heading">${Math.round(maxRevenue)}</text>
              <text x="30" y="74" textAnchor="end" className="text-[9px] fill-dark-gray font-bold font-heading">${Math.round(maxRevenue * 0.66)}</text>
              <text x="30" y="124" textAnchor="end" className="text-[9px] fill-dark-gray font-bold font-heading">${Math.round(maxRevenue * 0.33)}</text>
              <text x="30" y="174" textAnchor="end" className="text-[9px] fill-dark-gray font-bold font-heading">$0</text>

              {/* X Axis Labels */}
              {demoSales.map((s, i) => (
                <text
                  key={i}
                  x={40 + i * 70}
                  y="190"
                  textAnchor="middle"
                  className="text-[9px] fill-dark-gray font-bold font-heading"
                >
                  {s.date}
                </text>
              ))}

              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent)" />
                  <stop offset="100%" stopColor="white" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Category Breakdown SVG Bar Chart */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-mid-gray/40 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-mid-gray/30 pb-4">
            <h3 className="text-lg font-bold text-charcoal">Categories</h3>
            <span className="text-[10px] text-dark-gray font-bold uppercase tracking-wider">Catalog Share</span>
          </div>

          <div className="space-y-4 pt-2">
            {catLabels.map((cat, i) => {
              const val = catValues[i];
              const pct = (val / products.length) * 100;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-charcoal">
                    <span className="capitalize">{cat}</span>
                    <span className="text-dark-gray">{val} pair ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2.5 bg-light-gray rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-accent to-pastel-blue rounded-full transition-all duration-1000"
                      style={{ width: `${(val / maxCatVal) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {catLabels.length === 0 && (
              <p className="text-center text-sm text-dark-gray py-10">No categories found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-mid-gray/40 shadow-sm">
          <div className="flex justify-between items-center border-b border-mid-gray/30 pb-4 mb-6">
            <h3 className="text-lg font-bold text-charcoal">Recent Store Orders</h3>
            <Link href="/admin/orders" className="text-xs text-accent hover:text-accent-dark font-bold underline transition-colors">
              Manage Orders →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-dark-gray/70 border-b border-mid-gray/30 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Total</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mid-gray/30">
                {orders.slice(0, 5).map(o => (
                  <tr key={o.id} className="hover:bg-soft-white/50 transition-colors">
                    <td className="py-3.5 font-mono text-xs font-semibold text-charcoal">{o.id.substring(0, 8)}...</td>
                    <td className="py-3.5 font-medium text-charcoal">{o.customer?.name || 'Guest'}</td>
                    <td className="py-3.5 font-bold text-charcoal">${(o.total || 0).toFixed(2)}</td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider inline-block ${
                        o.status === 'completed' ? 'bg-green-50 text-green-700 border border-green-200' :
                        o.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                        o.status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-200' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-dark-gray py-8">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-mid-gray/40 shadow-sm">
          <div className="flex justify-between items-center border-b border-mid-gray/30 pb-4 mb-6">
            <h3 className="text-lg font-bold text-charcoal">Upcoming Appointments</h3>
            <Link href="/admin/appointments" className="text-xs text-accent hover:text-accent-dark font-bold underline transition-colors">
              Manage Bookings →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-dark-gray/70 border-b border-mid-gray/30 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Patient</th>
                  <th className="pb-3 font-semibold">Service</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mid-gray/30">
                {appointments.slice(0, 5).map(apt => (
                  <tr key={apt.id} className="hover:bg-soft-white/50 transition-colors">
                    <td className="py-3.5 text-dark-gray text-xs font-semibold">{new Date(apt.appointment_date || apt.date).toLocaleDateString()}</td>
                    <td className="py-3.5 font-medium text-charcoal">{apt.firstName || apt.first_name} {apt.lastName || apt.last_name}</td>
                    <td className="py-3.5 text-dark-gray capitalize">{apt.service?.replace('-', ' ') || 'Checkup'}</td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider inline-block ${
                        apt.status === 'confirmed' ? 'bg-green-50 text-green-700 border border-green-200' :
                        apt.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                        'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-dark-gray py-8">No appointments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
