"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import JsonLd from "../../components/JsonLd";
const TYPES = [
  {
    id: "normal",
    label: "Normal Vision",
    icon: "fa-eye",
    desc: "How most people see color",
    matrix: [1,0,0,0,0, 0,1,0,0,0, 0,0,1,0,0, 0,0,0,1,0],
  },
  {
    id: "deuteranopia",
    label: "Deuteranopia",
    icon: "fa-eye-slash",
    desc: "Green blindness · Most common",
    matrix: [0.625,0.375,0,0,0, 0.7,0.3,0,0,0, 0,0.3,0.7,0,0, 0,0,0,1,0],
  },
  {
    id: "protanopia",
    label: "Protanopia",
    icon: "fa-eye-slash",
    desc: "Red blindness",
    matrix: [0.567,0.433,0,0,0, 0.558,0.442,0,0,0, 0,0.242,0.758,0,0, 0,0,0,1,0],
  },
  {
    id: "tritanopia",
    label: "Tritanopia",
    icon: "fa-eye-slash",
    desc: "Blue blindness · Rare",
    matrix: [0.95,0.05,0,0,0, 0,0.433,0.567,0,0, 0,0.475,0.525,0,0, 0,0,0,1,0],
  },
  {
    id: "achromatopsia",
    label: "Achromatopsia",
    icon: "fa-circle-half-stroke",
    desc: "Complete color blindness",
    matrix: [0.299,0.587,0.114,0,0, 0.299,0.587,0.114,0,0, 0.299,0.587,0.114,0,0, 0,0,0,1,0],
  },
  {
    id: "deuteranomaly",
    label: "Deuteranomaly",
    icon: "fa-eye-slash",
    desc: "Reduced green sensitivity",
    matrix: [0.8,0.2,0,0,0, 0.258,0.742,0,0,0, 0,0.142,0.858,0,0, 0,0,0,1,0],
  },
];

function applyColorMatrix(imageData, matrix) {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    data[i]     = Math.min(255, Math.max(0, r * matrix[0]  + g * matrix[1]  + b * matrix[2]));
    data[i + 1] = Math.min(255, Math.max(0, r * matrix[5]  + g * matrix[6]  + b * matrix[7]));
    data[i + 2] = Math.min(255, Math.max(0, r * matrix[10] + g * matrix[11] + b * matrix[12]));
  }
  return imageData;
}

export default function ColorBlindness() {
  const [image, setImage] = useState(null);
  const [selected, setSelected] = useState("normal");
  const [dragging, setDragging] = useState(false);
  const canvasRef = useRef(null);
  const originalRef = useRef(null);
  const fileInputRef = useRef(null);

  const DEFAULT_IMAGE = "https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg";

  const loadImage = useCallback((src) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      originalRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setImage(src);
    };
    img.src = src;
  }, []);

  useEffect(() => { loadImage(DEFAULT_IMAGE); }, [loadImage]);

  useEffect(() => {
    if (!originalRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const type = TYPES.find((t) => t.id === selected);
    const copy = new ImageData(
      new Uint8ClampedArray(originalRef.current.data),
      originalRef.current.width,
      originalRef.current.height
    );
    const processed = applyColorMatrix(copy, type.matrix);
    canvas.width = processed.width;
    canvas.height = processed.height;
    ctx.putImageData(processed, 0, 0);
  }, [selected, image]);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => loadImage(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const selectedType = TYPES.find((t) => t.id === selected);

  return (
    <>
      <style>{`
        .cb-page {
          max-width: 1280px;
          margin: 0 auto;
          padding: 24px 24px 60px;
          font-family: 'DM Sans', 'Segoe UI', Arial, sans-serif;
          color: var(--tool-text);
        }
        .cb-header { margin-bottom: 24px; }
        .cb-header h1 {
          font-size: clamp(1rem, 2vw, 1.25rem);
          font-weight: 700;
          margin: 0 0 4px;
          letter-spacing: -0.02em;
          color: var(--foreground);
        }
        .cb-header p { font-size: 0.85rem; color: #888; margin: 0; }

        .cb-grid {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 16px;
          align-items: start;
        }
        @media (max-width: 900px) { .cb-grid { grid-template-columns: 1fr; } }

        .cb-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 12px;
          overflow: hidden;
        }
        .cb-card-header {
          padding: 12px 16px;
          border-bottom: 1px solid var(--card-border);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--label-color);
        }
        .cb-card-body { padding: 20px; }

        /* Dropzone */
        .cb-dropzone {
          border: 2px dashed var(--dz-border);
          border-radius: 10px;
          background: var(--dz-bg);
          padding: 28px 20px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          margin-bottom: 16px;
        }
        .cb-dropzone:hover, .cb-dropzone.dragging {
          border-color: #6366f1;
          background: var(--dz-hover);
        }
        .cb-dropzone-icon {
          font-size: 1.6rem;
          color: #6366f1;
          margin-bottom: 10px;
        }
        .cb-dropzone p {
          margin: 0;
          font-size: 0.88rem;
          color: var(--dz-text);
        }
        .cb-dropzone span {
          color: #6366f1;
          font-weight: 600;
          cursor: pointer;
        }

        /* Canvas */
        .cb-canvas-wrap {
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid var(--canvas-border);
          background: var(--tool-bg);
        }
        .cb-canvas-wrap canvas {
          width: 100%;
          height: auto;
          display: block;
        }

        /* Type selector */
        .cb-type-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .cb-type-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1.5px solid var(--card-border);
          background: var(--tool-bg);
          color: var(--tool-text);
          cursor: pointer;
          transition: all 0.15s;
          text-align: left;
          font-family: 'DM Sans', sans-serif;
          width: 100%;
        }
        .cb-type-btn:hover { border-color: #6366f1; background: var(--dz-hover); }
        .cb-type-btn.active {
          border-color: #6366f1;
          background: rgba(99,102,241,0.08);
        }
        .cb-type-icon {
          width: 28px; height: 28px;
          border-radius: 6px;
          background: var(--badge-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.78rem;
          color: #6366f1;
          flex-shrink: 0;
        }
        .cb-type-btn.active .cb-type-icon { background: #6366f1; color: #fff; }
        .cb-type-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--tool-text);
          display: block;
          line-height: 1.2;
        }
        .cb-type-desc {
          font-size: 0.72rem;
          color: #888;
          display: block;
        }

        /* Active label */
        .cb-active-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 20px;
          background: rgba(99,102,241,0.1);
          color: #6366f1;
          font-size: 0.78rem;
          font-weight: 600;
          margin-bottom: 12px;
        }

        /* SEO */
        .cb-seo { margin-top: 40px; max-width: 800px; }
        .cb-seo h2 { font-size: 1.15rem; font-weight: 700; margin: 32px 0 10px; color: var(--foreground); }
        .cb-seo p { line-height: 1.8; color: #666; font-size: 0.95rem; margin: 0 0 16px; }
        .cb-seo h3 { font-size: 0.95rem; font-weight: 600; margin: 20px 0 6px; color: var(--foreground); }
        [data-theme="dark"] .cb-seo p { color: #888; }
      `}</style>

      <div className="cb-page">

        {/* Header */}
        <div className="cb-header">
          <h1>
            <i className="fa-solid fa-glasses" style={{ marginRight: 8, opacity: 0.7, fontSize: "0.95rem" }}></i>
            Color Blindness Simulator
          </h1>
          <p>Upload an image and see how it looks to people with different types of color blindness</p>
        </div>

        <div className="cb-grid">

          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            <div className="cb-card">
              <div className="cb-card-header">Upload Image</div>
              <div className="cb-card-body">

                {/* Dropzone */}
                <div
                  className={`cb-dropzone ${dragging ? "dragging" : ""}`}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="cb-dropzone-icon">
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                  </div>
                  <p>
                    <span>Click to upload</span> or drag & drop
                  </p>
                  <p style={{ fontSize: "0.78rem", marginTop: 4 }}>PNG, JPG, WEBP supported</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleFile(e.target.files[0])}
                  />
                </div>

                {/* Active filter label */}
                <div className="cb-active-label">
                  <i className={`fa-solid ${selectedType.icon}`}></i>
                  {selectedType.label}
                </div>

                {/* Canvas */}
                <div className="cb-canvas-wrap">
                  <canvas ref={canvasRef} />
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT — Type Selector */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="cb-card">
              <div className="cb-card-header">Vision Type</div>
              <div className="cb-card-body">
                <div className="cb-type-list">
                  {TYPES.map((t) => (
                    <button
                      key={t.id}
                      className={`cb-type-btn ${selected === t.id ? "active" : ""}`}
                      onClick={() => setSelected(t.id)}
                    >
                      <div className="cb-type-icon">
                        <i className={`fa-solid ${t.icon}`}></i>
                      </div>
                      <div>
                        <span className="cb-type-name">{t.label}</span>
                        <span className="cb-type-desc">{t.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* SEO Content */}
        <div className="cb-seo">
          <h2>What is a Color Blindness Simulator?</h2>
          <p>
            A color blindness simulator shows you how your images and designs appear to
            people with different types of color vision deficiency. About 8% of men and
            0.5% of women have some form of color blindness. Testing your designs ensures
            they are accessible to everyone.
          </p>

          <h2>Frequently Asked Questions</h2>

          <h3>What is Deuteranopia?</h3>
          <p>
            Deuteranopia is the most common form of color blindness, affecting the ability
            to distinguish green. People with deuteranopia cannot perceive green light and
            often confuse red and green colors.
          </p>

          <h3>What is Protanopia?</h3>
          <p>
            Protanopia affects the red cone cells in the eye, making it difficult to
            distinguish red from green. Reds appear very dark and dull to people
            with protanopia.
          </p>

          <h3>What is Tritanopia?</h3>
          <p>
            Tritanopia is a rare form of color blindness affecting blue cone cells.
            People with tritanopia have difficulty distinguishing blue from green and
            yellow from red.
          </p>

          <h3>What is Achromatopsia?</h3>
          <p>
            Achromatopsia is complete color blindness where a person sees only in shades
            of grey. It is very rare and is often accompanied by light sensitivity.
          </p>

          <h3>How do I make my design accessible for color blind users?</h3>
          <p>
            Use sufficient contrast between elements, never rely on color alone to convey
            information, add labels or patterns alongside color coding, and test your
            design using this simulator before publishing.
          </p>

          <h3>Is this simulator free?</h3>
          <p>
            Yes, completely free. Upload any image and instantly preview all color
            blindness types. No signup needed and your image never leaves your browser.
          </p>
        </div>

      </div>
      <JsonLd data={{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Color Blindness Simulator",
  "url": "https://www.img2color.com/tools/color-blindness",
  "description": "Simulate how images look to people with color blindness. Test for Deuteranopia, Protanopia, Tritanopia and more. Free online simulator.",
  "applicationCategory": "DesignApplication",
  "operatingSystem": "Web",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "mainEntityOfPage": {
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Deuteranopia?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Deuteranopia is the most common form of color blindness, affecting the ability to distinguish green colors."
        }
      },
      {
        "@type": "Question",
        "name": "What is Protanopia?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Protanopia affects red cone cells, making it difficult to distinguish red from green. Reds appear very dark to people with protanopia."
        }
      },
      {
        "@type": "Question",
        "name": "How do I make my design accessible for color blind users?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Use sufficient contrast, never rely on color alone to convey information, add labels or patterns alongside color coding, and test your design using a color blindness simulator."
        }
      },
      {
        "@type": "Question",
        "name": "Is this simulator free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, completely free. Upload any image and instantly preview all color blindness types. No signup needed and your image never leaves your browser."
        }
      }
    ]
  }
}} />
    </>
  );
}