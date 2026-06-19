'use client';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';


export default function OrderConfirmationPage() {
  const { orders } = useStore();
  
  // Get the most recent order (we just added it)
  const recentOrder = orders[0];

  if (!recentOrder) {
    return (
      <div className="">
        <div className="">
          <h1 className="">No recent orders found</h1>
          <Link href="/" className="">Return to Shop</Link>
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
    <div className="">
      <div className="">
        <div className="">🎉</div>
        <h1 className="">Order Confirmed!</h1>
        <p className="">
          Thank you for your purchase, {recentOrder.customer.name.split(' ')[0]}! 
          We have received your order and will begin processing it right away.
        </p>

        {/* Timeline Visual Stepper */}
        <div className="">
          <div className={`${""} ${""}`}>
            <span className="">✓</span>
            <span className="">Order Placed</span>
          </div>
          <div className="" />
          <div className="">
            <span className="">2</span>
            <span className="">Processing</span>
          </div>
          <div className="" />
          <div className="">
            <span className="">3</span>
            <span className="">Shipped</span>
          </div>
          <div className="" />
          <div className="">
            <span className="">4</span>
            <span className="">Delivered</span>
          </div>
        </div>

        <div className="">
          <div className="">
            <span>Order Number:</span>
            <strong>{recentOrder.id}</strong>
          </div>
          <div className="">
            <span>Delivery Estimate:</span>
            <strong className="">🚚 {deliveryString}</strong>
          </div>
          <div className="">
            <span>Shipping To:</span>
            <strong>{recentOrder.customer.name}</strong>
          </div>
          <div className="">
            <span>Email:</span>
            <strong>{recentOrder.customer.email}</strong>
          </div>
          <div className="">
            <span>Total Amount:</span>
            <strong>${recentOrder.total.toFixed(2)}</strong>
          </div>
        </div>

        <div className="">
          <Link href={`/account/tracking?id=${recentOrder.id}`} className="">
            Track Your Order
          </Link>
          <Link href="/account/orders" className="">
            View My Orders
          </Link>
          <Link href="/" className="">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
