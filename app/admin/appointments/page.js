'use client';
import { useStore } from '@/context/StoreContext';


export default function AdminAppointmentsPage() {
  const { appointments, updateAppointmentStatus } = useStore();

  return (
    <div>
      <h1 className="">Appointment Management</h1>
      <div className="">
        <table className="">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Service</th>
              <th>Message</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(apt => (
              <tr key={apt.id}>
                <td>{apt.id}</td>
                <td>{new Date(apt.date).toLocaleDateString()}</td>
                <td>
                  {apt.firstName} {apt.lastName}<br/>
                  <small>{apt.phone}</small>
                </td>
                <td style={{textTransform: 'capitalize'}}>{apt.service.replace('-', ' ')}</td>
                <td style={{maxWidth: '200px'}}>{apt.message}</td>
                <td>
                  <span className={`${""} ${styles[apt.status]}`}>{apt.status}</span>
                </td>
                <td>
                  <select 
                    className=""
                    value={apt.status}
                    onChange={(e) => updateAppointmentStatus(apt.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approve</option>
                    <option value="rejected">Reject</option>
                    <option value="completed">Complete</option>
                  </select>
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan="7" style={{textAlign: 'center'}}>No appointments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
