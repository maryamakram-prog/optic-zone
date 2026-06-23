'use client';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function AdminCustomersPage() {
  const { customers, orders, updateProfileRole, deleteProfile } = useStore();
  const { admin } = useAuth();
  const [search, setSearch] = useState('');

  const handleRoleToggle = async (profileId, currentRole) => {
    if (profileId === admin?.id) {
      alert("You cannot demote yourself!");
      return;
    }
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    if (confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      await updateProfileRole(profileId, newRole);
    }
  };

  const handleDeleteProfile = async (profileId) => {
    if (profileId === admin?.id) {
      alert("You cannot delete your own account!");
      return;
    }
    if (confirm("Are you sure you want to delete this user profile? This action is irreversible.")) {
      await deleteProfile(profileId);
    }
  };

  const filteredCustomers = customers.filter(c => {
    const name = c.name || `${c.first_name || ''} ${c.last_name || ''}`;
    const email = c.email || '';
    return name.toLowerCase().includes(search.toLowerCase()) || 
           email.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black font-heading text-charcoal tracking-tight">User & Customer Management</h1>
        <p className="text-sm text-dark-gray mt-1">Manage user accounts, view purchase histories, and assign administrative roles</p>
      </div>

      {/* Search and Table */}
      <div className="bg-white p-6 rounded-3xl border border-mid-gray/40 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-gray/60 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-light-gray/50 rounded-xl border border-mid-gray/30 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
          <span className="text-xs font-bold text-dark-gray/70 uppercase">Registered: {customers.length} Accounts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="text-xs text-dark-gray/70 border-b border-mid-gray/30 uppercase tracking-wider font-bold">
                <th className="pb-3 px-2">Name</th>
                <th className="pb-3">Email Address</th>
                <th className="pb-3">Phone</th>
                <th className="pb-3">Orders</th>
                <th className="pb-3">Total Spend</th>
                <th className="pb-3">Access Level</th>
                <th className="pb-3 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mid-gray/30">
              {filteredCustomers.map(cust => {
                // Calculate total spend and orders from matching state
                const userOrders = orders.filter(o => 
                  o.user_id === cust.id || 
                  o.customer?.email?.toLowerCase() === cust.email?.toLowerCase()
                );
                const orderCount = userOrders.length;
                const totalSpent = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);

                const fullName = cust.name || `${cust.first_name || ''} ${cust.last_name || ''}`.trim() || 'Unnamed User';

                return (
                  <tr key={cust.id} className="hover:bg-soft-white/50 transition-colors">
                    <td className="py-4 px-2 font-bold text-charcoal">{fullName}</td>
                    <td className="py-4 font-mono text-xs text-charcoal">{cust.email}</td>
                    <td className="py-4 text-dark-gray">{cust.phone || 'N/A'}</td>
                    <td className="py-4 font-semibold text-charcoal">{orderCount}</td>
                    <td className="py-4 font-bold text-charcoal">${totalSpent.toFixed(2)}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider inline-block ${
                        cust.role === 'admin' 
                          ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {cust.role || 'customer'}
                      </span>
                    </td>
                    <td className="py-4 text-right pr-2">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleRoleToggle(cust.id, cust.role || 'customer')}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                            cust.role === 'admin' 
                              ? 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200' 
                              : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200'
                          }`}
                        >
                          {cust.role === 'admin' ? 'Demote' : 'Promote Admin'}
                        </button>
                        <button 
                          onClick={() => handleDeleteProfile(cust.id)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-dark-gray py-8">No matching accounts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
