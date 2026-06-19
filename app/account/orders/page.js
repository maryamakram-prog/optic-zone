'use client';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';


export default function OrdersPage() {
  const { user } = useAuth();
  const { orders } = useStore();
  
  // Get orders matching user email
  const userOrders = orders.filter(o => o.customer.email === user?.email);

  return (
    <div>
      <h2 className="">My Orders</h2>
      {userOrders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div className="orderList">
          {userOrders.map(order => (
            <div key={order.id} className="orderCard">
              <div className="orderHeader">
                <div>
                  <strong>Order ID:</strong> {order.id}
                </div>
                <div>
                  <span className={`status ${order.status}`}>{order.status}</span>
                </div>
              </div>
              <div className="orderDate">
                Placed on {new Date(order.date).toLocaleDateString()}
              </div>
              <div className="orderItems">
                {order.items.map((item, idx) => (
                  <div key={idx} className="orderItem">
                    <span>{item.qty}x {item.name} ({item.brand})</span>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="orderTotal">
                <strong>Total:</strong> ${order.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
      <style jsx>{`
        .orderList {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .orderCard {
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.5rem;
        }
        .orderHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }
        .orderDate {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }
        .orderItems {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border);
        }
        .orderItem {
          display: flex;
          justify-content: space-between;
          color: var(--text);
        }
        .orderTotal {
          text-align: right;
          font-size: 1.2rem;
          color: var(--primary);
        }
        .status {
          padding: 0.25rem 0.75rem;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        .status.completed { background: #d1fae5; color: #065f46; }
        .status.pending { background: #fef3c7; color: #92400e; }
        .status.processing { background: #dbeafe; color: #1e40af; }
        .status.cancelled { background: #fee2e2; color: #991b1b; }
      `}</style>
    </div>
  );
}
