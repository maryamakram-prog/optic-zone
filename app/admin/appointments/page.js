'use client';
import { useStore } from '@/context/StoreContext';
import { useState } from 'react';

export default function AdminAppointmentsPage() {
  const { appointments, updateAppointmentStatus } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredAppointments = appointments.filter(apt => {
    const fullName = `${apt.firstName || apt.first_name || ''} ${apt.lastName || apt.last_name || ''}`;
    const service = apt.service || '';
    const phone = apt.phone || '';
    
    const matchesSearch = fullName.toLowerCase().includes(search.toLowerCase()) || 
                          service.toLowerCase().includes(search.toLowerCase()) ||
                          phone.includes(search);
    
    const matchesStatus = statusFilter === '' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black font-heading text-charcoal tracking-tight">Appointment Management</h1>
        <p className="text-sm text-dark-gray mt-1">Review patient bookings, consult types, and status logs</p>
      </div>

      {/* Main Panel */}
      <div className="bg-white p-6 rounded-3xl border border-mid-gray/40 shadow-sm space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-gray/60 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search by name, service, phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-light-gray/50 rounded-xl border border-mid-gray/30 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
          <div className="flex gap-2 flex-wrap w-full sm:w-auto">
            {['', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-charcoal border-charcoal text-white shadow-sm'
                    : 'bg-light-gray/40 border-mid-gray/40 text-dark-gray hover:bg-light-gray/80'
                }`}
              >
                {status === '' ? 'All' : status}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="text-xs text-dark-gray/70 border-b border-mid-gray/30 uppercase tracking-wider font-bold">
                <th className="pb-3 px-2">Date & Time</th>
                <th className="pb-3">Customer Details</th>
                <th className="pb-3">Requested Service</th>
                <th className="pb-3">Customer Note</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mid-gray/30">
              {filteredAppointments.map(apt => {
                const fullName = `${apt.firstName || apt.first_name || ''} ${apt.lastName || apt.last_name || ''}`.trim() || 'Guest User';
                const apptDate = apt.appointment_date || apt.date;
                return (
                  <tr key={apt.id} className="hover:bg-soft-white/50 transition-colors">
                    <td className="py-4 px-2">
                      <strong className="text-charcoal block">
                        {new Date(apptDate).toLocaleDateString()}
                      </strong>
                      <span className="text-xs text-dark-gray">
                        {new Date(apptDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-charcoal">{fullName}</span>
                        <span className="text-xs font-mono text-dark-gray">{apt.phone || 'No phone'}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="px-3 py-1 bg-light-gray rounded-xl text-xs font-semibold text-charcoal capitalize">
                        {apt.service?.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="py-4 max-w-[200px] truncate text-dark-gray/80" title={apt.message || ''}>
                      {apt.message || <em className="text-dark-gray/40">No message</em>}
                    </td>
                    <td className="py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider inline-block ${
                        apt.status === 'confirmed' || apt.status === 'approved' ? 'bg-green-50 text-green-700 border border-green-200' :
                        apt.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                        apt.status === 'cancelled' || apt.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-200' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-4 text-right pr-2">
                      <select 
                        className="px-2 py-1.5 bg-light-gray/70 border border-mid-gray/40 rounded-xl text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-accent font-semibold"
                        value={apt.status}
                        onChange={(e) => updateAppointmentStatus(apt.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirm</option>
                        <option value="rejected">Reject</option>
                        <option value="completed">Complete</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAppointments.length === 0 && (
          <p className="text-center text-sm text-dark-gray py-8">No appointments found matching filters.</p>
        )}
      </div>
    </div>
  );
}
