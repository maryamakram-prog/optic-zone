'use client';


export default function ShippingPage() {
  return (
    <div className="">
      <div className="">
        <h1>Shipping Policy</h1>
        <p>Last updated: June 2025</p>
      </div>
      <div className="">

        <div className="">
          {[
            { icon: '🚀', label: 'Express', time: '2–3 Business Days', price: '$9.99', note: 'Cut-off: 2pm local time' },
            { icon: '📦', label: 'Standard', time: '5–7 Business Days', price: '$4.99', note: 'Free on orders over $99' },
            { icon: '🌍', label: 'International', time: '7–14 Business Days', price: 'From $14.99', note: 'Duties may apply' },
          ].map(({ icon, label, time, price, note }) => (
            <div key={label} className="">
              <span className="">{icon}</span>
              <strong>{label}</strong>
              <span className="">{time}</span>
              <span className="">{price}</span>
              <span className="">{note}</span>
            </div>
          ))}
        </div>

        <div className="">
          <section>
            <h2>Processing Times</h2>
            <p>Orders placed before 2:00 PM (local time) on business days are processed the same day. Orders placed after 2:00 PM, on weekends, or on public holidays are processed the next business day.</p>
            <p>Orders that include prescription lenses require an additional <strong>3–5 business days</strong> for our certified optical lab to craft and verify your lenses before shipping.</p>
          </section>

          <section>
            <h2>Order Tracking</h2>
            <p>Once your order is dispatched, you will receive a shipping confirmation email with a tracking number. You can track your package in real-time via your account dashboard under <strong>My Orders → Track</strong>.</p>
          </section>

          <section>
            <h2>Delivery Address</h2>
            <p>Please ensure your delivery address is accurate and complete at checkout. Optic Zone is not responsible for packages delivered to incorrect addresses provided by the customer. Address changes after an order is placed may not always be possible.</p>
          </section>

          <section>
            <h2>International Shipping</h2>
            <p>We ship to 50+ countries. International customers are responsible for any import duties, taxes, or customs fees levied by their country. These fees are not included in our pricing and are collected by the local customs authority.</p>
          </section>

          <section>
            <h2>Lost or Stolen Packages</h2>
            <p>If your tracking shows &quot;Delivered&quot; but you haven&apos;t received your package, please first check with neighbours and your local post office. If the package is truly lost, contact us within 7 days of the delivery date and we will open an investigation with the carrier.</p>
          </section>

          <section>
            <h2>Free Shipping</h2>
            <p>Standard shipping is free on all domestic orders over <strong>$99</strong>. This offer applies automatically at checkout—no coupon code required.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
