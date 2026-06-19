'use client';
import { useStore } from '@/context/StoreContext';


export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useStore();

  return (
    <div>
      <h1 className="">Order Management</h1>
      <div className="">
        <table className="">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
                <td>{order.customer.name}</td>
                <td>${order.total.toFixed(2)}</td>
                <td>
                  <span className={`${""} ${styles[order.status]}`}>{order.status}</span>
                </td>
                <td>
                  <select 
                    className=""
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" style={{textAlign: 'center'}}>No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
