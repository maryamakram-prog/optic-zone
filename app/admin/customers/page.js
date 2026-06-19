'use client';
import { useStore } from '@/context/StoreContext';


export default function AdminCustomersPage() {
  const { customers } = useStore();

  return (
    <div>
      <h1 className="">Customer Management</h1>
      <div className="">
        <table className="">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Orders</th>
              <th>Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust, idx) => (
              <tr key={idx}>
                <td>{cust.name}</td>
                <td>{cust.email}</td>
                <td>{cust.phone}</td>
                <td>{cust.orders?.length || 0}</td>
                <td>${(cust.totalSpent || 0).toFixed(2)}</td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan="5" style={{textAlign: 'center'}}>No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
