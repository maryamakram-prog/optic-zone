'use client';
import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

// Detailed SVG Face Avatars to serve as models
function MaleModelSvg() {
  return (
    <svg viewBox="0 0 400 400" className="modelSvg">
      <defs>
        <radialGradient id="skin" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#f3d2c1"/>
          <stop offset="100%" stopColor="#dfa789"/>
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="140" fill="url(#skin)" />
      <path d="M110 180 Q100 170 95 185 M290 180 Q300 170 305 185" stroke="#a16244" strokeWidth="4" fill="none" /> {/* Ears */}
      <circle cx="160" cy="180" r="10" fill="#2c1a04" /> {/* Left Eye */}
      <circle cx="240" cy="180" r="10" fill="#2c1a04" /> {/* Right Eye */}
      <path d="M140 160 Q160 150 175 162 M260 160 Q240 150 225 162" stroke="#2c1a04" strokeWidth="6" fill="none" strokeLinecap="round" /> {/* Brows */}
      <path d="M195 180 L200 220 L185 225" stroke="#a16244" strokeWidth="4" fill="none" strokeLinecap="round" /> {/* Nose */}
      <path d="M165 260 Q200 280 235 260" stroke="#a16244" strokeWidth="5" fill="none" strokeLinecap="round" /> {/* Smile */}
      <path d="M90 100 Q200 30 310 100 Q320 120 305 130 Q200 65 95 130" fill="#2c1a04" /> {/* Hair */}
    </svg>
  );
}

function FemaleModelSvg() {
  return (
    <svg viewBox="0 0 400 400" className="modelSvg">
      <defs>
        <radialGradient id="skinFemale" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffd8be"/>
          <stop offset="100%" stopColor="#e0a37e"/>
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="130" fill="url(#skinFemale)" />
      <path d="M115 185 Q105 175 100 190 M285 185 Q295 175 300 190" stroke="#bd7b5c" strokeWidth="4" fill="none" /> {/* Ears */}
      <circle cx="165" cy="180" r="8" fill="#1e293b" /> {/* Left Eye */}
      <circle cx="235" cy="180" r="8" fill="#1e293b" /> {/* Right Eye */}
      <path d="M145 165 Q165 158 178 168 M255 165 Q235 158 222 168" stroke="#334155" strokeWidth="4" fill="none" strokeLinecap="round" /> {/* Brows */}
      <path d="M197 185 L200 220 L190 224" stroke="#bd7b5c" strokeWidth="3" fill="none" strokeLinecap="round" /> {/* Nose */}
      <path d="M170 255 Q200 278 230 255" stroke="#e11d48" strokeWidth="5" fill="none" strokeLinecap="round" /> {/* Lips */}
      <path d="M100 120 Q200 10 300 120 Q340 280 300 320 Q280 220 280 180 Q200 70 120 180 Q120 220 100 320" fill="#7c2d12" /> {/* Hair */}
    </svg>
  );
}

function GlassesOverlay({ color = '#2563EB', accent = '#0ea5e9' }) {
  return (
    <svg viewBox="0 0 340 130" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id={`ov-fg-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color}/>
          <stop offset="100%" stopColor={accent}/>
        </linearGradient>
        <linearGradient id={`ov-lg-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={accent} stopOpacity="0.1"/>
        </linearGradient>
      </defs>
      {/* Frame Outline Lenses */}
      <ellipse cx="92" cy="65" rx="68" ry="46" fill={`url(#ov-lg-${color})`} stroke={`url(#ov-fg-${color})`} strokeWidth="6"/>
      <ellipse cx="248" cy="65" rx="68" ry="46" fill={`url(#ov-lg-${color})`} stroke={`url(#ov-fg-${color})`} strokeWidth="6"/>
      {/* Bridge */}
      <path d="M160 58 Q170 46 180 58" stroke={`url(#ov-fg-${color})`} strokeWidth="5.5" fill="none" strokeLinecap="round"/>
      {/* Temples */}
      <line x1="24" y1="46" x2="4" y2="58" stroke={`url(#ov-fg-${color})`} strokeWidth="5" strokeLinecap="round"/>
      <line x1="316" y1="46" x2="336" y2="58" stroke={`url(#ov-fg-${color})`} strokeWidth="5" strokeLinecap="round"/>
      {/* Glare Reflection */}
      <ellipse cx="76" cy="50" rx="16" ry="8" fill="white" opacity="0.15" transform="rotate(-15 76 50)"/>
      <ellipse cx="232" cy="50" rx="16" ry="8" fill="white" opacity="0.15" transform="rotate(-15 232 50)"/>
    </svg>
  );
}

export default function VirtualTryOnPage() {
  const { products } = useStore();
  const { addItem } = useCart();

  // Try-On options
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mode, setMode] = useState('model'); // 'camera' | 'model' | 'upload'
  const [selectedModel, setSelectedModel] = useState('female'); // 'female' | 'male'
  const [uploadedImage, setUploadedImage] = useState(null);

  // Adjustment Controls
  const [scale, setScale] = useState(1.0);
  const [rotate, setRotate] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [offsetX, setOffsetX] = useState(0);

  // Video streams
  const [streamActive, setStreamActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Pre-load first product
  useEffect(() => {
    if (products && products.length > 0) {
      setSelectedProduct(products[0]);
    }
  }, [products]);

  // Clean up video stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      stopCamera(); // stop any current streams
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setStreamActive(true);
      setMode('camera');
    } catch (err) {
      alert('Camera access denied or unavailable. Please upload a photo or use a demo model.');
      setMode('model');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setStreamActive(false);
  };

  const handleModeChange = (newMode) => {
    if (newMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
      setMode(newMode);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        setMode('upload');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetAdjustments = () => {
    setScale(1.0);
    setRotate(0);
    setOffsetY(0);
    setOffsetX(0);
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      addItem(selectedProduct);
      alert(`${selectedProduct.name} has been added to your cart!`);
    }
  };

  // Capture image helper using HTML5 Canvas
  const handleCapture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');

    // Draw background (Webcam or Image)
    if (mode === 'camera' && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0, 640, 480);
    } else if (mode === 'upload' && uploadedImage) {
      const img = new Image();
      img.src = uploadedImage;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 640, 480);
        drawGlassesOverlay(ctx);
      };
      return;
    } else {
      // Draw model background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 640, 480);
      alert('Photo download is available for camera feed and uploaded photos.');
      return;
    }

    drawGlassesOverlay(ctx);
  };

  const drawGlassesOverlay = (ctx) => {
    // Standard drawing parameters for overlay glasses (approx center)
    const centerX = 320 + offsetX;
    const centerY = 210 + offsetY;
    const glassesWidth = 240 * scale;
    const glassesHeight = 92 * scale;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotate * Math.PI) / 180);

    // Draw simplistic visual representation of glasses onto canvas
    const drawColor = selectedProduct?.colors?.[0] || '#2563EB';

    ctx.strokeStyle = drawColor;
    ctx.lineWidth = 6 * scale;
    ctx.fillStyle = 'rgba(37, 99, 235, 0.1)';

    // Left Lens
    ctx.beginPath();
    ctx.ellipse(-60 * scale, 0, 50 * scale, 35 * scale, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();

    // Right Lens
    ctx.beginPath();
    ctx.ellipse(60 * scale, 0, 50 * scale, 35 * scale, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();

    // Bridge connection
    ctx.beginPath();
    ctx.arc(0, -5 * scale, 15 * scale, Math.PI, 2 * Math.PI);
    ctx.stroke();

    ctx.restore();

    // Trigger download
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `optic-zone-tryon-${selectedProduct?.id || 'glasses'}.png`;
    link.href = url;
    link.click();
  };

  const tryOnColor = selectedProduct?.colors?.[0] || '#2563EB';

  return (
    <div className="pageContainer">
      <header className="pageHeader">
        <h1>Virtual Try-On</h1>
        <p>Interactive virtual fitting room. Access your webcam, upload a photo, or choose one of our models to see how different frames fit.</p>
      </header>

      <div className="mainLayout">
        {/* Preview Panel */}
        <div className="previewCard">
          <div className="previewScreen">
            {/* Background elements */}
            {mode === 'camera' && (
              <video ref={videoRef} className="videoStream" playsInline muted />
            )}

            {mode === 'model' && (
              <div className="modelContainer">
                {selectedModel === 'female' ? <FemaleModelSvg /> : <MaleModelSvg />}
              </div>
            )}

            {mode === 'upload' && uploadedImage && (
              <img src={uploadedImage} alt="Uploaded portrait" className="uploadedImage" />
            )}

            {/* Glasses Overlay */}
            {selectedProduct && (
              <div
                className="glassesOverlayContainer"
                style={{
                  transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale}) rotate(${rotate}deg)`,
                  width: '320px',
                  height: '120px'
                }}
              >
                <GlassesOverlay color={tryOnColor} accent="#3b82f6" />
              </div>
            )}

            {/* Live Indicator Badge */}
            {mode === 'camera' && streamActive && <span className="liveBadge">● Live Camera</span>}
          </div>

          {/* Mode Select Tabs */}
          <div className="modeSelector">
            <button className={`tabBtn ${mode === 'camera' ? 'active' : ''}`} onClick={() => handleModeChange('camera')}>
              📷 Use Camera
            </button>
            <button className={`tabBtn ${mode === 'model' ? 'active' : ''}`} onClick={() => handleModeChange('model')}>
              👤 Try on Model
            </button>
            <button className={`tabBtn ${mode === 'upload' ? 'active' : ''}`} onClick={() => fileInputRef.current.click()}>
              📤 Upload Photo
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </div>

          {mode === 'model' && (
            <div className="modelSelectorRow">
              <span>Choose Model:</span>
              <button className={`modelBtn ${selectedModel === 'female' ? 'active' : ''}`} onClick={() => setSelectedModel('female')}>Female Model</button>
              <button className={`modelBtn ${selectedModel === 'male' ? 'active' : ''}`} onClick={() => setSelectedModel('male')}>Male Model</button>
            </div>
          )}
        </div>

        {/* Controls & Catalog Sidebar */}
        <div className="sidebarPanel">
          {/* Sizing & Position Adjusters */}
          <div className="controlCard">
            <h3>⚙️ Fit Adjustments</h3>
            <p className="controlSub">Drag the sliders to size and align the frames perfectly over your eyes.</p>
            
            <div className="sliderGroup">
              <div className="sliderLabel">
                <span>Frame Size (Scale)</span>
                <span>{Math.round(scale * 100)}%</span>
              </div>
              <input type="range" min="0.5" max="1.8" step="0.05" value={scale} onChange={e => setScale(parseFloat(e.target.value))} />
            </div>

            <div className="sliderGroup">
              <div className="sliderLabel">
                <span>Vertical Position (Y-Offset)</span>
                <span>{offsetY}px</span>
              </div>
              <input type="range" min="-150" max="150" value={offsetY} onChange={e => setOffsetY(parseInt(e.target.value))} />
            </div>

            <div className="sliderGroup">
              <div className="sliderLabel">
                <span>Horizontal Position (X-Offset)</span>
                <span>{offsetX}px</span>
              </div>
              <input type="range" min="-150" max="150" value={offsetX} onChange={e => setOffsetX(parseInt(e.target.value))} />
            </div>

            <div className="sliderGroup">
              <div className="sliderLabel">
                <span>Frame Rotation</span>
                <span>{rotate}°</span>
              </div>
              <input type="range" min="-30" max="30" value={rotate} onChange={e => setRotate(parseInt(e.target.value))} />
            </div>

            <div className="cardActions">
              <button className="resetControlsBtn" onClick={handleResetAdjustments}>Reset Alignment</button>
              {mode !== 'model' && (
                <button className="captureBtn" onClick={handleCapture}>📸 Save Photo</button>
              )}
            </div>
          </div>

          {/* Current Frame Details & CTA */}
          {selectedProduct && (
            <div className="productCtaCard">
              <div className="productHead">
                <span className="pBrand">{selectedProduct.brand}</span>
                <h4>{selectedProduct.name}</h4>
                <div className="pPricing">
                  <span className="pPrice">${selectedProduct.price}</span>
                  {selectedProduct.originalPrice > selectedProduct.price && (
                    <span className="pOriginalPrice">${selectedProduct.originalPrice}</span>
                  )}
                </div>
              </div>
              <div className="productDetailsRow">
                <span>Shape: <strong style={{textTransform:'capitalize'}}>{selectedProduct.frameShape}</strong></span>
                <span>Material: <strong style={{textTransform:'capitalize'}}>{selectedProduct.frameMaterial}</strong></span>
              </div>
              <div className="ctaActionButtons">
                <button className="addToCartCtaBtn" onClick={handleAddToCart}>Add to Cart</button>
                <Link href={`/product/${selectedProduct.id}`} className="viewDetailsLink">View Full Product Details →</Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Frame Catalog Grid Carousel */}
      <section className="catalogSection">
        <h3>Select Frames to Try On</h3>
        <div className="catalogCarousel">
          {products.map(p => (
            <button
              key={p.id}
              className={`catalogCard ${selectedProduct?.id === p.id ? 'active' : ''}`}
              onClick={() => setSelectedProduct(p)}
            >
              <div className="cardGlassesDisplay">
                <GlassesOverlay color={p.colors?.[0] || '#2563EB'} />
              </div>
              <div className="catalogCardMeta">
                <span className="cBrand">{p.brand}</span>
                <span className="cName">{p.name}</span>
                <span className="cPrice">${p.price}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <style jsx>{`
        .pageContainer {
          min-height: 100vh;
          background: var(--bg);
          padding: 3rem 2rem 5rem;
          max-width: 1280px;
          margin: 0 auto;
          box-sizing: border-box;
        }
        .pageHeader {
          margin-bottom: 2.5rem;
        }
        .pageHeader h1 {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          color: var(--text);
          margin-bottom: 0.5rem;
        }
        .pageHeader p {
          font-size: 1.05rem;
          color: var(--text-secondary);
          max-width: 800px;
          line-height: 1.6;
        }
        
        .mainLayout {
          display: flex;
          gap: 2.5rem;
          margin-bottom: 4rem;
          flex-wrap: wrap;
        }
        .previewCard {
          flex: 1.5;
          min-width: 320px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .previewScreen {
          aspect-ratio: 4 / 3;
          background: #0f172a;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border);
        }
        .videoStream, .uploadedImage, .modelContainer {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .modelContainer {
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .glassesOverlayContainer {
          position: absolute;
          z-index: 10;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.05s ease-out;
        }
        .liveBadge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: var(--danger);
          color: white;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          animation: blink 1.5s infinite alternate;
        }

        .modeSelector {
          display: flex;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          padding: 0.3rem;
          border-radius: 10px;
          gap: 0.2rem;
        }
        .tabBtn {
          flex: 1;
          border: none;
          background: none;
          padding: 0.6rem;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-secondary);
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.2s, color 0.2s;
        }
        .tabBtn.active {
          background: var(--surface);
          color: var(--primary-dark);
          box-shadow: var(--shadow-sm);
        }
        
        .modelSelectorRow {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .modelBtn {
          border: 1px solid var(--border);
          background: var(--surface);
          padding: 0.4rem 1rem;
          border-radius: 6px;
          font-family: inherit;
          font-weight: 600;
          cursor: pointer;
          color: var(--text-secondary);
        }
        .modelBtn.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .sidebarPanel {
          flex: 1;
          min-width: 320px;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .controlCard, .productCtaCard {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: var(--shadow-sm);
          box-sizing: border-box;
        }
        .controlCard h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          margin-bottom: 0.25rem;
          color: var(--text);
        }
        .controlSub {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }
        .sliderGroup {
          margin-bottom: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .sliderLabel {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .sliderGroup input[type="range"] {
          width: 100%;
          height: 6px;
          background: var(--bg-tertiary);
          border-radius: 3px;
          outline: none;
          -webkit-appearance: none;
        }
        .sliderGroup input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--primary);
          cursor: pointer;
        }

        .cardActions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        .resetControlsBtn {
          flex: 1;
          border: 1px solid var(--border);
          background: none;
          padding: 0.6rem;
          border-radius: 6px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          color: var(--text-secondary);
        }
        .resetControlsBtn:hover {
          background: var(--bg-secondary);
        }
        .captureBtn {
          flex: 1;
          background: var(--success);
          color: white;
          border: none;
          padding: 0.6rem;
          border-radius: 6px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
        }
        .captureBtn:hover {
          background: #059669;
        }

        .productHead {
          border-bottom: 1px solid var(--border);
          padding-bottom: 1rem;
          margin-bottom: 1rem;
        }
        .pBrand {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .productHead h4 {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          color: var(--text);
          margin-bottom: 0.4rem;
        }
        .pPricing {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .pPrice {
          font-weight: 700;
          font-size: 1.25rem;
          color: var(--text);
        }
        .pOriginalPrice {
          font-size: 0.95rem;
          text-decoration: line-through;
          color: var(--text-subtle);
        }
        .productDetailsRow {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }
        .ctaActionButtons {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }
        .addToCartCtaBtn {
          width: 100%;
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.8rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.2s;
        }
        .addToCartCtaBtn:hover {
          background: var(--primary-dark);
        }
        .viewDetailsLink {
          text-align: center;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--primary);
          text-decoration: none;
        }
        .viewDetailsLink:hover {
          text-decoration: underline;
        }

        .catalogSection {
          border-top: 1px solid var(--border);
          padding-top: 3rem;
        }
        .catalogSection h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          margin-bottom: 1.5rem;
          color: var(--text);
        }
        .catalogCarousel {
          display: flex;
          gap: 1.2rem;
          overflow-x: auto;
          padding-bottom: 1rem;
        }
        .catalogCard {
          flex: 0 0 200px;
          border: 1px solid var(--border);
          background: var(--surface);
          border-radius: 12px;
          padding: 1.25rem;
          text-align: left;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          font-family: inherit;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
        }
        .catalogCard:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }
        .catalogCard.active {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px var(--primary-subtle);
        }
        .cardGlassesDisplay {
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-secondary);
          border-radius: 8px;
        }
        .catalogCardMeta {
          display: flex;
          flex-direction: column;
        }
        .cBrand {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .cName {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 0.25rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cPrice {
          font-weight: 700;
          color: var(--primary);
          font-size: 0.95rem;
        }

        @keyframes blink {
          0% { opacity: 0.6; }
          100% { opacity: 1; }
        }
        @media (max-width: 768px) {
          .mainLayout {
            flex-direction: column;
          }
          .pageContainer {
            padding: 2rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}
