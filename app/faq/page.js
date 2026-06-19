'use client';
import { useState } from 'react';
import Link from 'next/link';


const FAQS = [
  {
    category: '🛒 Orders & Shipping',
    items: [
      { q: 'How long does shipping take?', a: 'Standard shipping takes 5–7 business days. Express shipping (2–3 days) is available at checkout. Orders with prescription lenses take an additional 3–5 business days for lab processing.' },
      { q: 'Do you ship internationally?', a: 'Yes! We ship to over 50 countries. International shipping typically takes 7–14 business days. Duties and taxes may apply and are the responsibility of the recipient.' },
      { q: 'Can I track my order?', a: 'Absolutely. Once your order ships, you\'ll receive a tracking number via email. You can also track it directly on your My Orders page in your account.' },
      { q: 'What if my order arrives damaged?', a: 'Please contact us within 48 hours of delivery with photos of the damage. We\'ll arrange a free replacement or full refund immediately.' },
    ],
  },
  {
    category: '👓 Prescription & Lenses',
    items: [
      { q: 'How do I enter my prescription?', a: 'After selecting prescription lenses in the product page, you\'ll be prompted to enter your Rx details (SPH, CYL, AXIS, ADD) during checkout. You can also email us a photo of your prescription.' },
      { q: 'What prescription strengths do you support?', a: 'We support single vision prescriptions from -12.00 to +8.00 SPH, and up to -6.00 CYL. Progressive lenses are available for near/far combinations up to ±8.00.' },
      { q: 'What is Pupillary Distance (PD) and how do I measure it?', a: 'PD is the distance between your pupils, critical for lens accuracy. You can measure it yourself with a ruler and mirror, or use our interactive PD Guide for a step-by-step walkthrough.' },
      { q: 'Do you offer blue light blocking lenses?', a: 'Yes. Our Blue Light Filter add-on is available for $29 and blocks up to 40% of harmful blue light from screens, reducing eye strain during long computer sessions.' },
    ],
  },
  {
    category: '↩️ Returns & Warranty',
    items: [
      { q: 'What is your return policy?', a: 'We offer a 30-day hassle-free return policy for unworn frames. Prescription lenses are non-refundable unless there\'s a manufacturing defect, but we offer a free redo within 30 days.' },
      { q: 'How do I start a return?', a: 'Go to My Orders in your account, find the order, and click "Return Item." Print the prepaid return label and drop it at any courier location. Refunds are processed within 5–7 business days.' },
      { q: 'Is there a warranty on frames?', a: 'Yes. All our frames come with a 1-year manufacturer\'s warranty covering defects in materials and craftsmanship. Accidental damage is not covered, but we offer a 50% discount on replacement frames.' },
    ],
  },
  {
    category: '👤 Account & Payment',
    items: [
      { q: 'Do I need an account to order?', a: 'No, you can checkout as a guest. However, creating an account lets you track orders, save addresses, manage your wishlist, and access exclusive member discounts.' },
      { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, American Express, PayPal, and Apple Pay. All payments are secured with 256-bit SSL encryption.' },
      { q: 'Can I use a coupon code?', a: 'Yes! Enter your coupon code in the promo code field at checkout. Codes cannot be combined with other offers unless specified.' },
    ],
  },
];

function AccordionItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${""} ${open ? "" : ''}`}>
      <button className="" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{q}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <div className="">{a}</div>}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="">
      <div className="">
        <h1>Frequently Asked Questions</h1>
        <p>Everything you need to know about Optic Zone. Can&apos;t find your answer? <Link href="/contact">Contact us</Link>.</p>
      </div>

      <div className="">
        {FAQS.map(({ category, items }) => (
          <section key={category} className="">
            <h2 className="">{category}</h2>
            <div className="">
              {items.map((item) => (
                <AccordionItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </section>
        ))}

        <div className="">
          <h3>Still have questions?</h3>
          <p>Our support team is available Monday–Saturday, 9am–7pm.</p>
          <Link href="/contact" className="">Contact Support</Link>
        </div>
      </div>
    </div>
  );
}
