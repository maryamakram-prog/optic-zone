'use client';
import { useState } from 'react';
import Link from 'next/link';


const STEPS = [
  {
    num: 1,
    title: 'Gather Your Tools',
    icon: '🪞',
    desc: 'You need a ruler with millimetre markings, a mirror (or friend to help), and good lighting.',
    tip: 'A credit card is 85.6mm wide — you can use it to calibrate your ruler on screen.',
  },
  {
    num: 2,
    title: 'Position the Ruler',
    icon: '📏',
    desc: 'Hold the ruler against your brow, just above your eyes. Look straight ahead in the mirror. Align the 0mm mark with the centre of your LEFT pupil.',
    tip: 'Keep the ruler as level as possible for accurate results.',
  },
  {
    num: 3,
    title: 'Read the Measurement',
    icon: '👁️',
    desc: 'Without moving the ruler, look at where the centre of your RIGHT pupil aligns. The number you read in millimetres is your binocular PD.',
    tip: 'Most adults have a PD between 54mm and 74mm. The average is 63mm.',
  },
  {
    num: 4,
    title: 'Measure Monocular PD (Optional)',
    icon: '🔬',
    desc: 'For more precise lenses (especially progressive), measure each eye separately. Close your right eye, align 0 with your nose bridge centre, then read where your left pupil falls. Repeat for the right.',
    tip: 'Monocular PDs are written as two numbers, e.g. 31.5 / 32.0.',
  },
];

const PD_TABLE = [
  { label: 'Extra Narrow', range: '54–57mm', fit: 'Petite / Children\'s frames' },
  { label: 'Narrow', range: '58–61mm', fit: 'Smaller adult frames' },
  { label: 'Average', range: '62–65mm', fit: 'Standard adult frames' },
  { label: 'Wide', range: '66–69mm', fit: 'Larger adult frames' },
  { label: 'Extra Wide', range: '70–74mm', fit: 'XL / Oversized frames' },
];

export default function PDGuidePage() {
  const [pd, setPd] = useState('');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const val = parseFloat(pd);
    if (!val || val < 40 || val > 85) { setResult('invalid'); return; }
    if (val <= 57) setResult(PD_TABLE[0]);
    else if (val <= 61) setResult(PD_TABLE[1]);
    else if (val <= 65) setResult(PD_TABLE[2]);
    else if (val <= 69) setResult(PD_TABLE[3]);
    else setResult(PD_TABLE[4]);
  };

  return (
    <div className="">
      <div className="">
        <span className="">Eye Care Guide</span>
        <h1>Pupillary Distance (PD) Guide</h1>
        <p>Your PD is the distance between your pupils in millimetres. It&apos;s essential for centering lenses perfectly in your frames for clear, comfortable vision.</p>
      </div>

      <div className="">

        {/* What is PD */}
        <section className="">
          <div className="">
            <h2>Why Does PD Matter?</h2>
            <p>Pupillary Distance (PD) tells the lab where to position the optical centre of each lens. If lenses are misaligned even by a few millimetres, it can cause eye strain, blurred vision, and headaches — especially with strong prescriptions.</p>
            <p>Your optometrist will often include your PD on your prescription. If they haven&apos;t, or if you don&apos;t have your prescription handy, you can easily measure it yourself at home in under 2 minutes.</p>
          </div>
          <div className="">
            <svg viewBox="0 0 300 140" xmlns="http://www.w3.org/2000/svg" className="">
              <circle cx="100" cy="70" r="38" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="3"/>
              <circle cx="100" cy="70" r="16" fill="#4f46e5" opacity="0.7"/>
              <circle cx="100" cy="70" r="6" fill="#1e1b4b"/>
              <circle cx="200" cy="70" r="38" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="3"/>
              <circle cx="200" cy="70" r="16" fill="#4f46e5" opacity="0.7"/>
              <circle cx="200" cy="70" r="6" fill="#1e1b4b"/>
              <line x1="100" y1="70" x2="200" y2="70" stroke="#ef4444" strokeWidth="2" strokeDasharray="5 3"/>
              <line x1="100" y1="80" x2="100" y2="90" stroke="#ef4444" strokeWidth="2"/>
              <line x1="200" y1="80" x2="200" y2="90" stroke="#ef4444" strokeWidth="2"/>
              <line x1="100" y1="85" x2="200" y2="85" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow)"/>
              <text x="150" y="120" textAnchor="middle" fill="#ef4444" fontSize="13" fontWeight="700">PD (mm)</text>
            </svg>
          </div>
        </section>

        {/* Steps */}
        <section>
          <h2 className="">How to Measure Your PD at Home</h2>
          <div className="">
            {STEPS.map(({ num, title, icon, desc, tip }) => (
              <div key={num} className="">
                <div className="">
                  <div className="">{num}</div>
                  <span className="">{icon}</span>
                  <h3>{title}</h3>
                </div>
                <p>{desc}</p>
                <div className="">💡 <em>{tip}</em></div>
              </div>
            ))}
          </div>
        </section>

        {/* Calculator */}
        <section className="">
          <h2>PD Calculator</h2>
          <p>Enter your measured PD to find out which frame widths suit you best.</p>
          <div className="">
            <input
              type="number"
              className=""
              placeholder="e.g. 63"
              value={pd}
              min={40}
              max={85}
              onChange={e => { setPd(e.target.value); setResult(null); }}
            />
            <span className="">mm</span>
            <button className="" onClick={calculate}>Find My Fit</button>
          </div>

          {result === 'invalid' && (
            <div className="">Please enter a valid PD between 40 and 85 mm.</div>
          )}

          {result && result !== 'invalid' && (
            <div className="">
              <div className="">{result.label}</div>
              <p>Your PD of <strong>{pd}mm</strong> is in the <strong>{result.range}</strong> range.</p>
              <p>Best fit: <strong>{result.fit}</strong></p>
              <Link href="/products/eyeglasses" className="">Shop Matching Frames →</Link>
            </div>
          )}
        </section>

        {/* Reference table */}
        <section>
          <h2 className="">PD Reference Chart</h2>
          <div className="">
            <table className="">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>PD Range</th>
                  <th>Frame Fit</th>
                </tr>
              </thead>
              <tbody>
                {PD_TABLE.map(({ label, range, fit }) => (
                  <tr key={label}>
                    <td><strong>{label}</strong></td>
                    <td>{range}</td>
                    <td>{fit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="">
          <h2 className="">Common Questions</h2>
          <div className="">
            {[
              { q: 'What if I have two different PD numbers?', a: 'Those are your monocular PDs (one per eye). They\'re more precise and better for progressive lenses. Enter each number separately in the prescription section at checkout.' },
              { q: 'Can I get my PD from my optometrist?', a: 'Yes! Your optometrist can measure it during an eye exam. Simply ask them to include it on your prescription printout.' },
              { q: 'What if I measure it wrong?', a: 'If your lenses feel off when they arrive, contact us within 30 days. We\'ll re-make the lenses free of charge if the issue is related to PD misalignment.' },
            ].map(({ q, a }) => (
              <div key={q} className="">
                <h4>{q}</h4>
                <p>{a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
