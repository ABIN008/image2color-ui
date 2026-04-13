"use client";
import { useState } from "react";
import JsonLd from "../../components/JsonLd";
export default function GradientGenerator() {
  const [type, setType] = useState("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState([
    { color: "#6366f1", position: 0 },
    { color: "#a855f7", position: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const gradientCSS =
    type === "linear"
      ? `linear-gradient(${angle}deg, ${stops.map((s) => `${s.color} ${s.position}%`).join(", ")})`
      : `radial-gradient(circle, ${stops.map((s) => `${s.color} ${s.position}%`).join(", ")})`;

  const fullCSS = `background: ${gradientCSS};`;

  const copyCSS = () => {
    navigator.clipboard.writeText(fullCSS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateStop = (index, key, value) => {
    const updated = [...stops];
    updated[index] = { ...updated[index], [key]: value };
    setStops(updated);
  };

  const addStop = () => {
    if (stops.length >= 5) return;
    setStops([...stops, { color: "#f472b6", position: 50 }]);
  };

  const removeStop = (index) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((_, i) => i !== index));
  };

  const presets = [
    { name: "Indigo Punch", stops: [{ color: "#6366f1", position: 0 }, { color: "#a855f7", position: 100 }], angle: 135, type: "linear" },
    { name: "Sunset", stops: [{ color: "#f97316", position: 0 }, { color: "#ec4899", position: 100 }], angle: 90, type: "linear" },
    { name: "Ocean", stops: [{ color: "#06b6d4", position: 0 }, { color: "#3b82f6", position: 100 }], angle: 135, type: "linear" },
    { name: "Forest", stops: [{ color: "#22c55e", position: 0 }, { color: "#14b8a6", position: 100 }], angle: 120, type: "linear" },
    { name: "Rose Gold", stops: [{ color: "#fda4af", position: 0 }, { color: "#fb923c", position: 100 }], angle: 45, type: "linear" },
    { name: "Midnight", stops: [{ color: "#1e1b4b", position: 0 }, { color: "#312e81", position: 50 }, { color: "#4f46e5", position: 100 }], angle: 135, type: "linear" },
    { name: "Radial Glow", stops: [{ color: "#a78bfa", position: 0 }, { color: "#1e1b4b", position: 100 }], angle: 135, type: "radial" },
    { name: "Candy", stops: [{ color: "#f0abfc", position: 0 }, { color: "#67e8f9", position: 100 }], angle: 90, type: "linear" },
  ];

  return (
    <>
      <style>{`
        .gg-page {
          max-width: 1280px;
          margin: 0 auto;
          padding: 24px 24px 60px;
          font-family: 'DM Sans', 'Segoe UI', Arial, sans-serif;
          color: var(--tool-text);
        }
        .gg-header { margin-bottom: 24px; }
        .gg-header h1 {
          font-size: clamp(1rem, 2vw, 1.25rem);
          font-weight: 700;
          margin: 0 0 4px;
          letter-spacing: -0.02em;
          color: var(--foreground);
        }
        .gg-header p { font-size: 0.85rem; color: #888; margin: 0; }

        .gg-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 16px;
          align-items: start;
        }
        @media (max-width: 900px) { .gg-grid { grid-template-columns: 1fr; } }

        .gg-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 12px;
          overflow: hidden;
        }
        .gg-card-header {
          padding: 12px 16px;
          border-bottom: 1px solid var(--card-border);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--label-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .gg-card-body { padding: 20px; }

        /* Preview */
        .gg-preview {
          width: 100%;
          height: 200px;
          border-radius: 10px;
          border: 1px solid var(--card-border);
          margin-bottom: 16px;
          transition: background 0.3s;
        }

        /* Type toggle */
        .gg-toggle {
          display: flex;
          gap: 6px;
          margin-bottom: 20px;
        }
        .gg-toggle-btn {
          flex: 1;
          padding: 8px;
          border-radius: 8px;
          border: 1.5px solid var(--card-border);
          background: var(--tool-bg);
          color: var(--tool-text);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .gg-toggle-btn.active {
          background: #6366f1;
          border-color: #6366f1;
          color: #fff;
        }

        /* Angle */
        .gg-label {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--label-color);
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .gg-range {
          width: 100%;
          accent-color: #6366f1;
          margin-bottom: 20px;
          cursor: pointer;
        }

        /* Color stops */
        .gg-stop-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid var(--card-border);
        }
        .gg-stop-row:last-of-type { border-bottom: none; }
        .gg-stop-swatch {
          width: 32px; height: 32px;
          border-radius: 6px;
          border: 1.5px solid var(--card-border);
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        .gg-stop-swatch input[type="color"] {
          position: absolute;
          inset: -4px;
          width: calc(100% + 8px);
          height: calc(100% + 8px);
          opacity: 0;
          cursor: pointer;
          border: none;
          padding: 0;
        }
        .gg-stop-hex {
          width: 90px;
          border: 1px solid var(--card-border);
          border-radius: 6px;
          background: var(--url-input-bg);
          color: var(--tool-text);
          font-family: 'DM Mono', monospace;
          font-size: 0.82rem;
          padding: 6px 8px;
          outline: none;
          flex-shrink: 0;
        }
        .gg-stop-hex:focus { border-color: #6366f1; }
        .gg-stop-pos {
          flex: 1;
          accent-color: #6366f1;
          cursor: pointer;
        }
        .gg-stop-pos-val {
          font-size: 0.78rem;
          font-family: 'DM Mono', monospace;
          color: var(--label-color);
          width: 32px;
          text-align: right;
          flex-shrink: 0;
        }
        .gg-remove-btn {
          width: 24px; height: 24px;
          border-radius: 6px;
          border: 1px solid var(--card-border);
          background: transparent;
          color: #888;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          flex-shrink: 0;
          transition: background 0.15s, color 0.15s;
        }
        .gg-remove-btn:hover { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }

        /* Add stop */
        .gg-add-btn {
          width: 100%;
          margin-top: 12px;
          padding: 8px;
          border-radius: 8px;
          border: 1.5px dashed var(--card-border);
          background: transparent;
          color: var(--label-color);
          font-size: 0.82rem;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .gg-add-btn:hover { border-color: #6366f1; color: #6366f1; }

        /* CSS output */
        .gg-code-box {
          background: var(--tool-bg);
          border: 1px solid var(--card-border);
          border-radius: 8px;
          padding: 14px;
          font-family: 'DM Mono', monospace;
          font-size: 0.82rem;
          color: var(--tool-text);
          word-break: break-all;
          line-height: 1.6;
          margin-bottom: 12px;
        }
        .gg-copy-btn {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1.5px solid var(--card-border);
          background: var(--tool-bg);
          color: var(--tool-text);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .gg-copy-btn:hover { border-color: #6366f1; color: #6366f1; }
        .gg-copy-btn.copied { background: #d1fae5; border-color: #6ee7b7; color: #065f46; }
        [data-theme="dark"] .gg-copy-btn.copied { background: #052e16; border-color: #166534; color: #4ade80; }

        /* Presets */
        .gg-presets {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .gg-preset-btn {
          height: 52px;
          border-radius: 8px;
          border: 1.5px solid transparent;
          cursor: pointer;
          transition: transform 0.15s, border-color 0.15s;
          position: relative;
          overflow: hidden;
        }
        .gg-preset-btn:hover { transform: scale(1.03); border-color: rgba(255,255,255,0.4); }
        .gg-preset-name {
          position: absolute;
          bottom: 5px;
          left: 8px;
          font-size: 0.68rem;
          font-weight: 600;
          color: #fff;
          text-shadow: 0 1px 3px rgba(0,0,0,0.4);
        }

        /* SEO */
        .gg-seo { margin-top: 40px; max-width: 800px; }
        .gg-seo h2 { font-size: 1.15rem; font-weight: 700; margin: 32px 0 10px; color: var(--foreground); }
        .gg-seo p { line-height: 1.8; color: #666; font-size: 0.95rem; margin: 0 0 16px; }
        .gg-seo h3 { font-size: 0.95rem; font-weight: 600; margin: 20px 0 6px; color: var(--foreground); }
        [data-theme="dark"] .gg-seo p { color: #888; }
      `}</style>

      <div className="gg-page">

        {/* Header */}
        <div className="gg-header">
          <h1>
            <i className="fa-solid fa-wand-magic-sparkles" style={{ marginRight: 8, opacity: 0.7, fontSize: "0.95rem" }}></i>
            CSS Gradient Generator
          </h1>
          <p>Create linear and radial CSS gradients visually · Copy code with one click</p>
        </div>

        <div className="gg-grid">

          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Preview Card */}
            <div className="gg-card">
              <div className="gg-card-header">Preview</div>
              <div className="gg-card-body">
                <div className="gg-preview" style={{ background: gradientCSS }} />

                {/* Type toggle */}
                <div className="gg-toggle">
                  <button
                    className={`gg-toggle-btn ${type === "linear" ? "active" : ""}`}
                    onClick={() => setType("linear")}
                  >
                    <i className="fa-solid fa-minus" style={{ marginRight: 6 }}></i>
                    Linear
                  </button>
                  <button
                    className={`gg-toggle-btn ${type === "radial" ? "active" : ""}`}
                    onClick={() => setType("radial")}
                  >
                    <i className="fa-regular fa-circle" style={{ marginRight: 6 }}></i>
                    Radial
                  </button>
                </div>

                {/* Angle (linear only) */}
                {type === "linear" && (
                  <div>
                    <div className="gg-label">
                      <span>Angle</span>
                      <span style={{ fontFamily: "'DM Mono', monospace" }}>{angle}°</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      value={angle}
                      onChange={(e) => setAngle(Number(e.target.value))}
                      className="gg-range"
                    />
                  </div>
                )}

                {/* Color Stops */}
                <div className="gg-label" style={{ marginBottom: 4 }}>
                  <span>Color Stops</span>
                </div>
                {stops.map((stop, i) => (
                  <div className="gg-stop-row" key={i}>
                    <div className="gg-stop-swatch" style={{ background: stop.color }}>
                      <input
                        type="color"
                        value={stop.color}
                        onChange={(e) => updateStop(i, "color", e.target.value)}
                      />
                    </div>
                    <input
                      className="gg-stop-hex"
                      type="text"
                      value={stop.color}
                      onChange={(e) => updateStop(i, "color", e.target.value)}
                      maxLength={7}
                      spellCheck={false}
                    />
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={stop.position}
                      onChange={(e) => updateStop(i, "position", Number(e.target.value))}
                      className="gg-stop-pos"
                    />
                    <span className="gg-stop-pos-val">{stop.position}%</span>
                    <button
                      className="gg-remove-btn"
                      onClick={() => removeStop(i)}
                      title="Remove stop"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                ))}
                {stops.length < 5 && (
                  <button className="gg-add-btn" onClick={addStop}>
                    <i className="fa-solid fa-plus" style={{ marginRight: 6 }}></i>
                    Add Color Stop
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* CSS Output */}
            <div className="gg-card">
              <div className="gg-card-header">CSS Code</div>
              <div className="gg-card-body">
                <div className="gg-code-box">{fullCSS}</div>
                <button
                  className={`gg-copy-btn ${copied ? "copied" : ""}`}
                  onClick={copyCSS}
                >
                  {copied ? (
                    <><i className="fa-solid fa-check"></i> Copied!</>
                  ) : (
                    <><i className="fa-regular fa-copy"></i> Copy CSS</>
                  )}
                </button>
              </div>
            </div>

            {/* Presets */}
            <div className="gg-card">
              <div className="gg-card-header">Presets</div>
              <div className="gg-card-body">
                <div className="gg-presets">
                  {presets.map((p) => {
                    const bg =
                      p.type === "linear"
                        ? `linear-gradient(${p.angle}deg, ${p.stops.map((s) => `${s.color} ${s.position}%`).join(", ")})`
                        : `radial-gradient(circle, ${p.stops.map((s) => `${s.color} ${s.position}%`).join(", ")})`;
                    return (
                      <button
                        key={p.name}
                        className="gg-preset-btn"
                        style={{ background: bg }}
                        onClick={() => {
                          setStops(p.stops);
                          setType(p.type);
                          if (p.angle) setAngle(p.angle);
                        }}
                        title={p.name}
                      >
                        <span className="gg-preset-name">{p.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SEO Content */}
        <div className="gg-seo">
          <h2>What is a CSS Gradient Generator?</h2>
          <p>
            A CSS gradient generator lets you create gradient backgrounds visually and
            instantly gives you the CSS code to use in your project. Instead of writing
            gradient syntax manually, you pick colors, adjust the angle and copy the code.
          </p>

          <h2>Frequently Asked Questions</h2>

          <h3>What is a linear gradient in CSS?</h3>
          <p>
            A linear gradient transitions between colors along a straight line at a given
            angle. For example, <code>linear-gradient(135deg, #6366f1, #a855f7)</code> creates
            a diagonal purple gradient.
          </p>

          <h3>What is a radial gradient in CSS?</h3>
          <p>
            A radial gradient transitions colors outward from a central point in a circular
            or elliptical shape, creating a glow or spotlight effect.
          </p>

          <h3>How many color stops can I add?</h3>
          <p>
            You can add up to 5 color stops. Each stop has a color and a position (0–100%)
            that controls where that color appears in the gradient.
          </p>

          <h3>Can I use this gradient in Tailwind CSS?</h3>
          <p>
            Yes. Copy the CSS value and use it as an inline style or add it to your
            Tailwind config as a custom background utility.
          </p>

          <h3>Is this gradient generator free?</h3>
          <p>
            Yes, completely free. No signup needed. Generate unlimited gradients and copy
            the CSS code instantly.
          </p>
        </div>

      </div>
      <JsonLd data={{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "CSS Gradient Generator",
  "url": "https://www.img2color.com/tools/gradient-generator",
  "description": "Generate beautiful CSS linear and radial gradients visually. Copy CSS code instantly. Free online gradient maker.",
  "applicationCategory": "DesignApplication",
  "operatingSystem": "Web",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "mainEntityOfPage": {
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a linear gradient in CSS?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A linear gradient transitions between colors along a straight line at a given angle using the linear-gradient() CSS function."
        }
      },
      {
        "@type": "Question",
        "name": "What is a radial gradient in CSS?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A radial gradient transitions colors outward from a central point in a circular or elliptical shape using the radial-gradient() CSS function."
        }
      },
      {
        "@type": "Question",
        "name": "How many color stops can I add?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can add up to 5 color stops. Each stop has a color and a position from 0 to 100% that controls where that color appears in the gradient."
        }
      },
      {
        "@type": "Question",
        "name": "Is this gradient generator free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, completely free. No signup needed. Generate unlimited gradients and copy the CSS code instantly."
        }
      }
    ]
  }
}} />
    </>
  );
}