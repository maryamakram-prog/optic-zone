'use client';


const SECTIONS = [
  {
    title: 'Information We Collect',
    body: [
      'Account Information: When you register, we collect your name, email address, and password (stored securely hashed).',
      'Order Information: Billing address, shipping address, payment method details (we do not store full card numbers), and order history.',
      'Prescription Data: If you purchase prescription lenses, we collect your optical prescription details to fulfil your order.',
      'Usage Data: Pages visited, products viewed, time spent on site, and interactions — collected via cookies and analytics tools to improve your experience.',
    ],
  },
  {
    title: 'How We Use Your Information',
    body: [
      'To process and fulfil your orders, including coordinating with our optical lab for prescription lenses.',
      'To send order confirmations, shipping updates, and customer service communications.',
      'To personalise your shopping experience, including product recommendations.',
      'To improve our website, services, and marketing through analytics.',
      'To send marketing emails (with your consent — you may opt out at any time).',
    ],
  },
  {
    title: 'Information Sharing',
    body: [
      'We do NOT sell your personal data to third parties.',
      'We share data only with trusted service providers (payment processors, shipping carriers, optical labs) who are bound by confidentiality agreements.',
      'We may disclose information if required by law or to protect our legal rights.',
    ],
  },
  {
    title: 'Cookies',
    body: [
      'We use essential cookies to keep you logged in and remember your cart. We also use analytics cookies to understand how customers use our site.',
      'You can manage cookie preferences via your browser settings. Disabling cookies may affect site functionality.',
    ],
  },
  {
    title: 'Data Security',
    body: [
      'All data is transmitted over SSL/TLS encryption. We implement industry-standard security measures to protect your information from unauthorized access, disclosure, or loss.',
      'Prescription data is stored with additional access controls and is only accessible to our optical lab and fulfillment team.',
    ],
  },
  {
    title: 'Your Rights',
    body: [
      'Access: Request a copy of the personal data we hold about you.',
      'Correction: Request corrections to inaccurate or incomplete data.',
      'Deletion: Request that we delete your account and personal data.',
      'Portability: Request your data in a machine-readable format.',
      'To exercise these rights, contact us at privacy@opticzone.ae.',
    ],
  },
  {
    title: 'Children\'s Privacy',
    body: [
      'Our services are not directed to children under 13. We do not knowingly collect personal data from children. If you believe we have inadvertently collected such data, please contact us immediately.',
    ],
  },
  {
    title: 'Changes to This Policy',
    body: [
      'We may update this policy periodically. We\'ll notify you of significant changes via email or a prominent notice on our website. Continued use of our services constitutes acceptance of the updated policy.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="">
      <div className="">
        <h1>Privacy Policy</h1>
        <p>Last updated: June 2025</p>
      </div>

      <div className="">
        <p className="">
          Optic Zone (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy. This policy explains what information we collect, how we use it, and your rights regarding your personal data.
        </p>

        {SECTIONS.map(({ title, body }) => (
          <section key={title} className="">
            <h2>{title}</h2>
            <ul>
              {body.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </section>
        ))}

        <div className="">
          <h3>Contact Us</h3>
          <p>For privacy-related questions or to exercise your rights, please email <a href="mailto:privacy@opticzone.ae">privacy@opticzone.ae</a>.</p>
        </div>
      </div>
    </div>
  );
}
