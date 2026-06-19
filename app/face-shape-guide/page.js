'use client';
import { useState } from 'react';
import Link from 'next/link';

const FACE_SHAPES_DATA = {
  oval: {
    name: 'Oval',
    emoji: '🥚',
    desc: 'Your face is slightly longer than it is wide, with a forehead that is slightly wider than your jawline, and soft, curved features.',
    best: 'Almost any frame works! Rectangular, round, aviator, and square frames look exceptional.',
    avoid: 'Oversized frames that throw off your natural proportions.',
    link: '/products/eyeglasses'
  },
  round: {
    name: 'Round',
    emoji: '⭕',
    desc: 'Your face is roughly equal in length and width, with soft features, full cheeks, and a rounded, less defined jawline.',
    best: 'Angular and rectangular frames (like Wayfarer or square styles) to add structure, definition, and contrast.',
    avoid: 'Round or small frames which make your face look rounder.',
    link: '/products/eyeglasses'
  },
  square: {
    name: 'Square',
    emoji: '🟦',
    desc: 'Your face features a strong, defined jawline and a broad forehead. The width of your forehead, cheekbones, and jaw are nearly identical.',
    best: 'Round, oval, and aviator frames to soften your strong jawline and strong angular features.',
    avoid: 'Sharp rectangular or square frames that exaggerate your face\'s angles.',
    link: '/products/eyeglasses'
  },
  heart: {
    name: 'Heart',
    emoji: '❤️',
    desc: 'Your face is widest at the forehead and tapers down to a narrow, pointed chin. Cheekbones are typically high and defined.',
    best: 'Bottom-heavy frames, cat-eye styles, and round or oval shapes that balance the width of your forehead.',
    avoid: 'Top-heavy or heavily decorated frames that draw focus upwards.',
    link: '/products/eyeglasses'
  },
  diamond: {
    name: 'Diamond',
    emoji: '💎',
    desc: 'Your face is narrowest at both the forehead and jawline, with high, dramatic cheekbones acting as the widest point.',
    best: 'Cat-eye, oval, and rimless frames that highlight your eyes and soften your dramatic cheekbones.',
    avoid: 'Narrow frames that draw too much attention to your eye line.',
    link: '/products/eyeglasses'
  },
  oblong: {
    name: 'Oblong',
    emoji: '📏',
    desc: 'Your face is noticeably longer than it is wide, with a long, straight cheek line and sometimes a longer nose.',
    best: 'Wide, oversized, and tall rectangular frames that break up the length of your face and add horizontal width.',
    avoid: 'Small, narrow, or round frames that make your face appear longer.',
    link: '/products/eyeglasses'
  }
};

const QUIZ_QUESTIONS = [
  {
    id: 'widest',
    question: '1. What is the widest part of your face?',
    options: [
      { text: 'Forehead', value: 'forehead' },
      { text: 'Cheekbones', value: 'cheekbones' },
      { text: 'Jawline', value: 'jaw' },
      { text: 'Everything seems equal', value: 'equal' }
    ]
  },
  {
    id: 'jaw',
    question: '2. Which best describes the shape of your jaw?',
    options: [
      { text: 'Soft and rounded', value: 'round' },
      { text: 'Strong, square, or boxy', value: 'square' },
      { text: 'Pointy or tapered', value: 'pointy' }
    ]
  },
  {
    id: 'proportions',
    question: '3. What are the general proportions of your face?',
    options: [
      { text: 'My face is noticeably longer than it is wide', value: 'long' },
      { text: 'My face width and length are almost equal', value: 'equal' }
    ]
  }
];

export default function FaceShapeGuidePage() {
  const [quizAnswers, setQuizAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [quizResult, setQuizResult] = useState(null);

  const handleAnswerSelect = (questionId, value) => {
    const newAnswers = { ...quizAnswers, [questionId]: value };
    setQuizAnswers(newAnswers);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate face shape result
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (answers) => {
    const { widest, jaw, proportions } = answers;
    let shape = 'oval'; // default fallback

    if (proportions === 'long') {
      if (widest === 'forehead' && jaw === 'pointy') shape = 'heart';
      else if (widest === 'cheekbones' && jaw === 'pointy') shape = 'diamond';
      else if (widest === 'equal' && jaw === 'square') shape = 'oblong';
      else shape = 'oval';
    } else {
      // width and length equal
      if (jaw === 'square' || widest === 'jaw') shape = 'square';
      else if (jaw === 'round' || widest === 'cheekbones') shape = 'round';
      else if (widest === 'forehead' && jaw === 'pointy') shape = 'heart';
      else shape = 'oval';
    }

    setQuizResult(FACE_SHAPES_DATA[shape]);
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setCurrentStep(0);
    setQuizResult(null);
  };

  return (
    <div className="pageContainer">
      <header className="hero">
        <div className="heroContent">
          <h1>Find Your Face Shape</h1>
          <p>The key to finding the perfect frames is understanding your face shape. Take our quick, interactive styling quiz or explore shapes below.</p>
        </div>
      </header>

      <section className="quizSection">
        <div className="quizCard">
          {!quizResult ? (
            <div>
              <div className="quizHeader">
                <h3>Style Assistant Quiz</h3>
                <span className="stepIndicator">Question {currentStep + 1} of {QUIZ_QUESTIONS.length}</span>
              </div>
              <div className="progressBar">
                <div className="progressFill" style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }} />
              </div>
              <h4 className="questionText">{QUIZ_QUESTIONS[currentStep].question}</h4>
              <div className="optionsGrid">
                {QUIZ_QUESTIONS[currentStep].options.map(option => (
                  <button
                    key={option.value}
                    className="optionBtn"
                    onClick={() => handleAnswerSelect(QUIZ_QUESTIONS[currentStep].id, option.value)}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
              {currentStep > 0 && (
                <button className="backBtn" onClick={() => setCurrentStep(currentStep - 1)}>
                  ← Back to previous question
                </button>
              )}
            </div>
          ) : (
            <div className="resultContainer">
              <span className="resultEmoji">{quizResult.emoji}</span>
              <h3>Your Face Shape: {quizResult.name}</h3>
              <p className="resultDesc">{quizResult.desc}</p>
              <div className="recBox">
                <p><strong>👓 Recommended Styles:</strong> {quizResult.best}</p>
                <p><strong>⚠️ Styles to Avoid:</strong> {quizResult.avoid}</p>
              </div>
              <div className="resultActions">
                <Link href={quizResult.link} className="shopBtn">Shop {quizResult.name} Frames</Link>
                <button className="resetBtn" onClick={handleResetQuiz}>Retake Quiz</button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="gridSection">
        <h2>Explore Face Shapes</h2>
        <div className="shapesGrid">
          {Object.entries(FACE_SHAPES_DATA).map(([key, shape]) => (
            <div key={key} className="shapeCard">
              <div className="shapeCardHeader">
                <span className="cardEmoji">{shape.emoji}</span>
                <h3>{shape.name} Face</h3>
              </div>
              <p className="cardDesc">{shape.desc}</p>
              <div className="cardDetails">
                <div className="detailRow">
                  <strong>Best Fit:</strong>
                  <span>{shape.best}</span>
                </div>
                <div className="detailRow">
                  <strong>Avoid:</strong>
                  <span>{shape.avoid}</span>
                </div>
              </div>
              <Link href={shape.link} className="cardLink">Shop {shape.name} Frames →</Link>
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        .pageContainer {
          min-height: 100vh;
          background: var(--bg);
          padding-bottom: 5rem;
        }
        .hero {
          background: linear-gradient(135deg, var(--primary-subtle) 0%, #eff6ff 100%);
          padding: 5rem 2rem;
          text-align: center;
          margin-bottom: 3rem;
        }
        .heroContent {
          max-width: 800px;
          margin: 0 auto;
        }
        .hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: 3rem;
          color: var(--text);
          margin-bottom: 1rem;
        }
        .hero p {
          font-size: 1.15rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .quizSection {
          max-width: 700px;
          margin: 0 auto 5rem;
          padding: 0 1.5rem;
        }
        .quizCard {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: var(--shadow-md);
        }
        .quizHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .quizHeader h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          color: var(--text);
        }
        .stepIndicator {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .progressBar {
          height: 6px;
          background: var(--bg-tertiary);
          border-radius: 3px;
          margin-bottom: 2rem;
          overflow: hidden;
        }
        .progressFill {
          height: 100%;
          background: var(--primary);
          transition: width 0.3s ease;
        }
        .questionText {
          font-size: 1.3rem;
          margin-bottom: 1.5rem;
          color: var(--text);
        }
        .optionsGrid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        .optionBtn {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          padding: 1rem 1.5rem;
          border-radius: 10px;
          font-size: 1.05rem;
          text-align: left;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--text);
        }
        .optionBtn:hover {
          background: var(--primary-subtle);
          border-color: var(--primary-light);
          color: var(--primary-dark);
          transform: translateX(4px);
        }
        .backBtn {
          border: none;
          background: none;
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-top: 1.5rem;
          cursor: pointer;
          font-family: inherit;
        }
        .backBtn:hover {
          color: var(--text);
        }

        .resultContainer {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .resultEmoji {
          font-size: 4rem;
          margin-bottom: 1rem;
          display: inline-block;
          animation: bounce 1.5s infinite alternate ease-in-out;
        }
        .resultContainer h3 {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: var(--text);
        }
        .resultDesc {
          color: var(--text-secondary);
          font-size: 1.05rem;
          margin-bottom: 1.5rem;
          max-width: 500px;
          line-height: 1.6;
        }
        .recBox {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: left;
          width: 100%;
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .recBox p {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }
        .resultActions {
          display: flex;
          gap: 1rem;
          width: 100%;
        }
        .shopBtn {
          flex: 1;
          background: var(--primary);
          color: white;
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          font-size: 1rem;
          transition: background 0.2s;
        }
        .shopBtn:hover {
          background: var(--primary-dark);
        }
        .resetBtn {
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text-secondary);
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.2s;
        }
        .resetBtn:hover {
          background: var(--bg-secondary);
        }

        .gridSection {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .gridSection h2 {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          margin-bottom: 2rem;
          text-align: center;
          color: var(--text);
        }
        .shapesGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 2rem;
        }
        .shapeCard {
          border: 1px solid var(--border);
          background: var(--surface);
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .shapeCard:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }
        .shapeCardHeader {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .cardEmoji {
          font-size: 2.2rem;
        }
        .shapeCardHeader h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          color: var(--text);
        }
        .cardDesc {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          line-height: 1.5;
          flex: 1;
        }
        .cardDetails {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          border-top: 1px solid var(--border);
          padding-top: 1.25rem;
          margin-bottom: 1.5rem;
        }
        .detailRow {
          font-size: 0.9rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .detailRow strong {
          color: var(--text);
        }
        .detailRow span {
          color: var(--text-muted);
        }
        .cardLink {
          display: inline-block;
          font-weight: 700;
          color: var(--primary);
          text-decoration: none;
          font-size: 0.95rem;
          margin-top: auto;
        }
        .cardLink:hover {
          text-decoration: underline;
        }

        @keyframes bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-8px); }
        }
        @media (max-width: 600px) {
          .resultActions {
            flex-direction: column;
          }
          .hero h1 {
            font-size: 2.2rem;
          }
        }
      `}</style>
    </div>
  );
}
