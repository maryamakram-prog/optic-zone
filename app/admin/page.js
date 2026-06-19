'use client';
import { useStore } from '@/context/StoreContext';


export default function AdminDashboardPage() {
  const { products, orders, customers, appointments } = useStore();

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div>
      <h1 className="">Dashboard Summary</h1>
      
      <div className="">
        <div className="">
          <div className="">Total Revenue</div>
          <div className="">${totalRevenue.toFixed(2)}</div>
        </div>
        <div className="">
          <div className="">Total Orders</div>
          <div className="">{orders.length}</div>
        </div>
        <div className="">
          <div className="">Total Customers</div>
          <div className="">{customers.length}</div>
        </div>
        <div className="">
          <div className="">Total Products</div>
          <div className="">{products.length}</div>
        </div>
      </div>
      
      <h2 className="" style={{fontSize: '1.5rem', marginBottom: '1rem'}}>Recent Appointments</h2>
      <div className="">
        <table className="">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Service</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.slice(0, 5).map(apt => (
              <tr key={apt.id}>
                <td>{apt.id}</td>
                <td>{new Date(apt.date).toLocaleDateString()}</td>
                <td>{apt.firstName} {apt.lastName}</td>
                <td style={{textTransform: 'capitalize'}}>{apt.service.replace('-', ' ')}</td>
                <td>
                  <span className={`${""} ${styles[apt.status]}`}>{apt.status}</span>
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan="5" style={{textAlign: 'center'}}>No appointments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
