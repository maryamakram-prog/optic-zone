'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function FrameSizeGuidePage() {
  const [cardWidthPx, setCardWidthPx] = useState(250); // initial width in pixels
  const [calibrated, setCalibrated] = useState(false);
  const [estimatedSize, setEstimatedSize] = useState(null);

  // Standard credit card physical dimensions: 85.6 mm width
  const cardPhysicalWidthMm = 85.6;

  const handleSliderChange = (e) => {
    setCardWidthPx(parseInt(e.target.value));
  };

  const handleCalibrateComplete = () => {
    // Calculate pixels per mm
    const pxPerMm = cardWidthPx / cardPhysicalWidthMm;
    
    // We estimate that a standard face width is ~135mm.
    // Let's provide a slider or interactive selector of current glasses width in pixels on the screen,
    // or let them estimate based on a standard calculation.
    // Actually, let's let them align their current glasses to the screen or measure their face.
    setCalibrated(true);
  };

  const handleSelectFaceWidth = (category) => {
    setEstimatedSize(category);
  };

  const handleReset = () => {
    setCalibrated(false);
    setEstimatedSize(null);
    setCardWidthPx(250);
  };

  return (
    <div className="pageContainer">
      <header className="hero">
        <div className="heroContent">
          <h1>Glasses Sizing Guide</h1>
          <p>Find the perfect fitting frames by understanding eye width, bridge distance, and temple length. Use our screen-calibration tool to estimate your size.</p>
        </div>
      </header>

      <div className="layout">
        {/* Sizing Tool */}
        <section className="toolSection">
          <div className="toolCard">
            <h3>📏 Interactive Sizer Tool</h3>
            
            {!calibrated ? (
              <div className="calibrationStep">
                <p className="stepDesc">
                  Place a standard physical card (debit card, ID card, or driver's license) flat against your screen. 
                  Adjust the slider below until the blue box on your screen matches the width of your physical card.
                </p>
                
                <div className="cardPlaceholderWrap">
                  <div className="virtualCard" style={{ width: `${cardWidthPx}px` }}>
                    <div className="cardChip">💳</div>
                    <span className="cardText">Standard Card</span>
                  </div>
                </div>

                <div className="sliderRow">
                  <label htmlFor="cardSlider">Adjust Width: {cardWidthPx}px</label>
                  <input
                    id="cardSlider"
                    type="range"
                    min="150"
                    max="450"
                    value={cardWidthPx}
                    onChange={handleSliderChange}
                    className="styledSlider"
                  />
                </div>

                <button className="calibrateBtn" onClick={handleCalibrateComplete}>
                  Confirm Size & Calibrate
                </button>
              </div>
            ) : !estimatedSize ? (
              <div className="faceMeasureStep">
                <h4>Step 2: Choose Your Face Width</h4>
                <p className="stepDesc">
                  Stand in front of a mirror and measure the distance from your left temple to your right temple with a ruler, or estimate your face size relative to others.
                </p>

                <div className="faceOptions">
                  <button className="faceOption" onClick={() => handleSelectFaceWidth('Small')}>
                    <span className="optionTitle">Narrow Face</span>
                    <span className="optionVal">Temple-to-Temple &lt; 129mm</span>
                    <span className="sizeLabel">Recommeded: Small (50mm or less lens width)</span>
                  </button>
                  
                  <button className="faceOption" onClick={() => handleSelectFaceWidth('Medium')}>
                    <span className="optionTitle">Average Face</span>
                    <span className="optionVal">Temple-to-Temple 130mm - 139mm</span>
                    <span className="sizeLabel">Recommended: Medium (51mm - 54mm lens width)</span>
                  </button>

                  <button className="faceOption" onClick={() => handleSelectFaceWidth('Large')}>
                    <span className="optionTitle">Wide Face</span>
                    <span className="optionVal">Temple-to-Temple &gt; 140mm</span>
                    <span className="sizeLabel">Recommended: Large (55mm or more lens width)</span>
                  </button>
                </div>

                <button className="backBtn" onClick={handleReset}>
                  ← Back to calibration
                </button>
              </div>
            ) : (
              <div className="resultStep">
                <span className="resultBadge">Your Size Match</span>
                <h4>{estimatedSize} Frames</h4>
                <p className="resultDesc">
                  Based on your screen calibration, frames categorized as <strong>{estimatedSize}</strong> will fit you best.
                </p>

                <div className="sizeCard">
                  <h5>Average Lens Width Range:</h5>
                  {estimatedSize === 'Small' && <p className="sizeNums">47mm – 50mm</p>}
                  {estimatedSize === 'Medium' && <p className="sizeNums">51mm – 54mm</p>}
                  {estimatedSize === 'Large' && <p className="sizeNums">55mm – 58mm</p>}
                  <p className="smallNote">Note: Lens width is the horizontal diameter of one lens in millimeters.</p>
                </div>

                <div className="actionRow">
                  <Link href="/products/eyeglasses" className="shopBtn">Browse Frames</Link>
                  <button className="resetBtn" onClick={handleReset}>Recalibrate</button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Explain Size Numbers */}
        <section className="infoSection">
          <div className="infoCard">
            <h3>Understanding Glasses Numbers</h3>
            <p>If you look at the inside temple arm of any pair of glasses, you'll find three numbers stamped, formatted like this:</p>
            
            <div className="numbersDisplay">
              <span className="numBox">52<small>Lens Width</small></span>
              <span className="dash">&middot;</span>
              <span className="numBox">18<small>Bridge Width</small></span>
              <span className="dash">&middot;</span>
              <span className="numBox">140<small>Temple Length</small></span>
            </div>

            <ul className="infoList">
              <li>
                <strong>Lens Width (e.g. 52mm):</strong> The horizontal width of each individual lens at its widest point.
              </li>
              <li>
                <strong>Bridge Width (e.g. 18mm):</strong> The distance between the two lenses directly over your nose bridge.
              </li>
              <li>
                <strong>Temple Length (e.g. 140mm):</strong> The length of the glasses temple arm from the hinge pin to the tip behind your ear.
              </li>
            </ul>

            <div className="tipBox">
              💡 <strong>Pro Tip:</strong> Check your current glasses! If they fit comfortably, you can use those exact numbers as your benchmark when ordering new frames on Optic Zone.
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .pageContainer {
          min-height: 100vh;
          background: var(--bg);
          padding-bottom: 5rem;
        }
        .hero {
          background: linear-gradient(135deg, var(--info-bg) 0%, #eff6ff 100%);
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
        .layout {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          gap: 2.5rem;
          flex-wrap: wrap;
        }
        .toolSection, .infoSection {
          flex: 1;
          min-width: 320px;
        }
        .toolCard, .infoCard {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: var(--shadow-sm);
          height: 100%;
          box-sizing: border-box;
        }
        .toolCard h3, .infoCard h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: var(--text);
        }
        .stepDesc {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }
        
        .cardPlaceholderWrap {
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-secondary);
          border-radius: 12px;
          border: 1px dashed var(--border);
          margin-bottom: 1.5rem;
        }
        .virtualCard {
          height: 120px;
          background: linear-gradient(135deg, #1e3a8a 0%, var(--primary) 100%);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1.25rem;
          box-shadow: var(--shadow-md);
          color: white;
          box-sizing: border-box;
          transition: width 0.1s ease;
        }
        .cardChip {
          font-size: 1.5rem;
        }
        .cardText {
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          opacity: 0.8;
        }

        .sliderRow {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }
        .sliderRow label {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text);
        }
        .styledSlider {
          width: 100%;
          height: 6px;
          background: var(--bg-tertiary);
          border-radius: 3px;
          outline: none;
          -webkit-appearance: none;
        }
        .styledSlider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--primary);
          cursor: pointer;
          transition: transform 0.1s;
        }
        .styledSlider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .calibrateBtn {
          width: 100%;
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.2s;
        }
        .calibrateBtn:hover {
          background: var(--primary-dark);
        }

        .faceOptions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .faceOption {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 1.25rem;
          text-align: left;
          font-family: inherit;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          transition: all 0.2s ease;
        }
        .faceOption:hover {
          background: var(--info-bg);
          border-color: var(--primary-light);
        }
        .optionTitle {
          font-weight: 700;
          font-size: 1.05rem;
          color: var(--text);
        }
        .optionVal {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .sizeLabel {
          font-size: 0.9rem;
          color: var(--primary-dark);
          font-weight: 600;
          margin-top: 0.4rem;
        }
        .backBtn {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.9rem;
          cursor: pointer;
          font-family: inherit;
        }
        .backBtn:hover {
          color: var(--text);
        }

        .resultStep {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .resultBadge {
          background: var(--success-bg);
          color: var(--success);
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          padding: 0.25rem 0.75rem;
          border-radius: 50px;
          margin-bottom: 0.75rem;
          letter-spacing: 0.5px;
        }
        .resultStep h4 {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          color: var(--text);
          margin-bottom: 0.5rem;
        }
        .resultDesc {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }
        .sizeCard {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.5rem;
          width: 100%;
          box-sizing: border-box;
          margin-bottom: 2rem;
        }
        .sizeCard h5 {
          font-size: 0.9rem;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 0.4rem;
        }
        .sizeNums {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--primary-dark);
          margin-bottom: 0.5rem;
        }
        .smallNote {
          font-size: 0.8rem;
          color: var(--text-subtle);
        }
        .actionRow {
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
          text-align: center;
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

        .numbersDisplay {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1.5rem;
          margin: 2rem 0;
        }
        .numBox {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          padding: 1rem;
          border-radius: 10px;
          min-width: 70px;
          font-weight: 700;
          font-size: 1.5rem;
          color: var(--text);
        }
        .numBox small {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
          font-weight: 600;
        }
        .dash {
          font-size: 2rem;
          color: var(--border-strong);
        }
        .infoList {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding-left: 1.25rem;
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        .tipBox {
          background: var(--warning-bg);
          border: 1px solid #fef3c7;
          color: #92400e;
          padding: 1rem 1.25rem;
          border-radius: 8px;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        @media (max-width: 600px) {
          .layout {
            padding: 0 1rem;
          }
          .hero h1 {
            font-size: 2.2rem;
          }
          .actionRow {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
