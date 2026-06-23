'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'How do I know my frame size?',
    answer: 'You can check the inside of your current glasses arm for three numbers (e.g., 52-18-140). These represent the lens width, bridge width, and temple length in millimeters. Check out our Frame Size Guide for more details.',
  },
  {
    question: 'Can I use my vision insurance?',
    answer: 'Yes! We are an out-of-network provider for most vision insurance plans. We provide an itemized receipt after purchase that you can submit for reimbursement.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a 14-day Fit & Style guarantee. If you are not completely satisfied, you can return your glasses for a full refund or exchange, no questions asked.',
  },
  {
    question: 'How long does shipping take?',
    answer: 'Standard prescription glasses usually ship within 7-10 business days. Non-prescription sunglasses ship within 2-3 business days. Expedited shipping options are available at checkout.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="section-padding bg-soft-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-widest uppercase text-accent">Got Questions?</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-charcoal mt-2">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border border-mid-gray/30 rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'bg-white shadow-md' : 'bg-transparent hover:bg-white/50'}`}
            >
              <button
                className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              >
                <span className="font-semibold text-charcoal pr-4">{faq.question}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${openIndex === index ? 'bg-accent text-white rotate-180' : 'bg-light-gray text-dark-gray'}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="px-6 pb-5 text-dark-gray/80 leading-relaxed border-t border-mid-gray/10 mt-1 pt-4">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
