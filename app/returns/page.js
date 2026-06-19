'use client';
import Link from 'next/link';


const STEPS = [
  { num: '1', title: 'Log In to Your Account', desc: 'Go to My Orders and find the item you wish to return.' },
  { num: '2', title: 'Request a Return', desc: 'Click "Return Item", select your reason, and submit. You\'ll receive a prepaid return label by email within 1 hour.' },
  { num: '3', title: 'Pack & Ship', desc: 'Place the item in its original packaging (if available) and drop it at any courier location.' },
  { num: '4', title: 'Refund Processed', desc: 'Once we receive and inspect the return, your refund is issued within 5–7 business days to your original payment method.' },
];

export default function ReturnsPage() {
  return (
    <div className="">
      <div className="">
        <h1>Returns & Refund Policy</h1>
        <p>Last updated: June 2025 · We believe in stress-free shopping.</p>
      </div>

      <div className="">
        <div className="">
          <span className="">✅</span>
          <div>
            <strong>30-Day Hassle-Free Returns</strong>
            <p>Changed your mind? No problem. Return any unworn, unaltered frame within 30 days of delivery for a full refund or exchange.</p>
          </div>
        </div>

        <section className="">
          <h2 className="">How to Return</h2>
          <div className="">
            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className="">
                <div className="">{num}</div>
                <div>
                  <strong>{title}</strong>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="">
          <div className="">
            <h3>✅ Eligible for Return</h3>
            <ul>
              <li>Unworn frames in original condition</li>
              <li>Items returned within 30 days</li>
              <li>Items with original packaging and tags</li>
              <li>Defective or manufacturer-faulty products</li>
            </ul>
          </div>
          <div className="">
            <h3>❌ Not Eligible for Return</h3>
            <ul>
              <li>Prescription lenses (unless defective)</li>
              <li>Items with signs of wear or alteration</li>
              <li>Returns requested after 30 days</li>
              <li>Gift cards and accessories (hygiene items)</li>
            </ul>
          </div>
        </div>

        <section className="">
          <h2>Prescription Lens Guarantee</h2>
          <p>Prescription lenses are custom-made to your Rx and are non-refundable. However, if your lenses are defective, the wrong prescription, or you&apos;re not satisfied with the optical clarity, we offer a <strong>free redo within 30 days</strong> of delivery — no questions asked.</p>
        </section>

        <section className="">
          <h2>Exchanges</h2>
          <p>We currently process exchanges as a return + re-order. Simply return your item and place a new order for the preferred item. To ensure you get the replacement quickly, place the new order before your return arrives.</p>
        </section>

        <section className="">
          <h2>Refund Timing</h2>
          <p>Refunds are processed within <strong>5–7 business days</strong> of receiving your returned item. The refund will appear on your original payment method. Please note that your bank may take an additional 2–3 business days to process it.</p>
        </section>

        <div className="">
          <h3>Need Help with a Return?</h3>
          <Link href="/contact" className="">Contact Support</Link>
        </div>
      </div>
    </div>
  );
}
