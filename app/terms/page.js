'use client';


const TERMS = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing and using the Optic Zone website and purchasing our products, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services. We reserve the right to update these terms at any time, with changes taking effect upon posting.',
  },
  {
    title: '2. Products and Descriptions',
    body: 'We strive to display our products as accurately as possible. However, we do not guarantee that product descriptions, images, or colours are fully accurate. Frame colours may vary slightly due to monitor calibration. In the event a product is listed at an incorrect price due to an error, we reserve the right to cancel such orders.',
  },
  {
    title: '3. Ordering and Payment',
    body: 'Placing an order constitutes an offer to purchase. We reserve the right to accept or reject any order. Payment must be made in full at the time of order. We accept Visa, Mastercard, American Express, PayPal, and Apple Pay. All prices are inclusive of applicable taxes unless stated otherwise.',
  },
  {
    title: '4. Prescription Lenses',
    body: 'By submitting a prescription, you confirm that it was issued by a licensed optometrist and is current and valid. Optic Zone is not responsible for errors in prescriptions provided by customers. Prescription lenses are custom-made and are non-refundable unless defective. We offer a free redo within 30 days if the lenses do not match your prescription.',
  },
  {
    title: '5. Shipping',
    body: 'We will make reasonable efforts to ship your order within the stated processing times. Shipping timelines are estimates and not guarantees. Optic Zone is not liable for delays caused by carriers, customs, or other circumstances beyond our control. Risk of loss passes to you upon handoff to the carrier.',
  },
  {
    title: '6. Returns and Refunds',
    body: 'Returns are governed by our Returns Policy. Items must be returned unused and in original condition within 30 days of delivery. Refunds are issued to the original payment method within 5–7 business days of receiving the return.',
  },
  {
    title: '7. Intellectual Property',
    body: 'All content on this website, including text, images, logos, and design elements, is the intellectual property of Optic Zone or its licensors and is protected by copyright law. You may not reproduce, distribute, or create derivative works without our express written permission.',
  },
  {
    title: '8. Limitation of Liability',
    body: 'To the fullest extent permitted by law, Optic Zone shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our products or services. Our total liability for any claim shall not exceed the amount paid for the product in question.',
  },
  {
    title: '9. Governing Law',
    body: 'These terms are governed by the laws of the United Arab Emirates. Any disputes arising from these terms or your use of our services shall be resolved in the courts of Dubai, UAE.',
  },
  {
    title: '10. Contact',
    body: 'For any questions regarding these Terms and Conditions, please contact us at legal@opticzone.ae or via our Contact Us page.',
  },
];

export default function TermsPage() {
  return (
    <div className="">
      <div className="">
        <h1>Terms & Conditions</h1>
        <p>Last updated: June 2025</p>
      </div>

      <div className="">
        <p className="">
          Please read these Terms and Conditions carefully before using the Optic Zone website or placing any orders. These terms form a legally binding agreement between you and Optic Zone.
        </p>

        {TERMS.map(({ title, body }) => (
          <section key={title} className="">
            <h2>{title}</h2>
            <p>{body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
