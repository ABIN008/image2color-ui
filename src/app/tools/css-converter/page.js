"use client";
import { useState } from "react";
import JsonLd from "../../components/JsonLd";
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  if (max === min) { h = 0; }
  else {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

function rgbToCmyk(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - r - k) / (1 - k)) * 100),
    m: Math.round(((1 - g - k) / (1 - k)) * 100),
    y: Math.round(((1 - b - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) };
}

export default function CssConverter() {
  const [hex, setHex] = useState("#6366f1");
  const [copied, setCopied] = useState("");

  const rgb = hexToRgb(hex) || { r: 0, g: 0, b: 0 };
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

  const formats = [
    { label: "HEX", value: hex.toUpperCase(), css: hex.toUpperCase() },
    { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, css: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: "RGBA", value: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`, css: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` },
    { label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, css: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: "HSLA", value: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)`, css: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)` },
    { label: "HSV", value: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`, css: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` },
    { label: "CMYK", value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`, css: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
    { label: "CSS Variable", value: `--color-primary: ${hex.toUpperCase()};`, css: `--color-primary: ${hex.toUpperCase()};` },
  ];

  const copyToClipboard = (value, label) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleHexInput = (val) => {
    setHex(val.startsWith("#") ? val : "#" + val);
  };

  return (
    <>
      <style>{`
        .cv-page {
          max-width: 1280px;
          margin: 0 auto;
          padding: 24px 24px 60px;
          font-family: 'DM Sans', 'Segoe UI', Arial, sans-serif;
          color: var(--tool-text);
        }
        .cv-header { margin-bottom: 24px; }
        .cv-header h1 {
          font-size: clamp(1rem, 2vw, 1.25rem);
          font-weight: 700;
          margin: 0 0 4px;
          letter-spacing: -0.02em;
          color: var(--foreground);
        }
        .cv-header p { font-size: 0.85rem; color: #888; margin: 0; }

        .cv-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 16px;
          align-items: start;
        }
        @media (max-width: 860px) { .cv-grid { grid-template-columns: 1fr; } }

        .cv-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 12px;
          overflow: hidden;
        }
        .cv-card-header {
          padding: 12px 16px;
          border-bottom: 1px solid var(--card-border);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--label-color);
        }
        .cv-card-body { padding: 20px; }

        /* Input row */
        .cv-input-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border: 1px solid var(--card-border);
          border-radius: 10px;
          background: var(--url-input-bg);
          margin-bottom: 20px;
          transition: border-color 0.15s;
        }
        .cv-input-row:focus-within {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
        .cv-swatch-btn {
          width: 36px; height: 36px;
          border-radius: 8px;
          border: 1.5px solid var(--card-border);
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        .cv-swatch-btn input[type="color"] {
          position: absolute;
          inset: -4px;
          width: calc(100% + 8px);
          height: calc(100% + 8px);
          opacity: 0;
          cursor: pointer;
          border: none;
          padding: 0;
        }
        .cv-hex-input {
          flex: 1;
          border: none;
          background: transparent;
          font-family: 'DM Mono', monospace;
          font-size: 1rem;
          font-weight: 600;
          color: var(--tool-text);
          outline: none;
        }

        /* Format rows */
        .cv-format-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid var(--card-border);
          gap: 12px;
        }
        .cv-format-row:last-child { border-bottom: none; }
        .cv-format-label {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--label-color);
          min-width: 80px;
          flex-shrink: 0;
        }
        .cv-format-value {
          flex: 1;
          font-family: 'DM Mono', monospace;
          font-size: 0.88rem;
          color: var(--tool-text);
          word-break: break-all;
        }
        .cv-copy-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 6px;
          border: 1px solid var(--card-border);
          background: var(--tool-bg);
          color: var(--tool-text);
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.15s, border-color 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .cv-copy-btn:hover {
          background: var(--nav-link-hover-bg);
          border-color: #6366f1;
          color: #6366f1;
        }
        .cv-copy-btn.copied {
          background: #d1fae5;
          border-color: #6ee7b7;
          color: #065f46;
        }
        [data-theme="dark"] .cv-copy-btn.copied {
          background: #052e16;
          border-color: #166534;
          color: #4ade80;
        }

        /* Preview panel */
        .cv-preview-swatch {
          width: 100%;
          height: 140px;
          border-radius: 10px;
          border: 1px solid var(--card-border);
          margin-bottom: 12px;
          transition: background 0.2s;
        }
        .cv-shade-row {
          display: flex;
          gap: 6px;
          margin-bottom: 16px;
        }
        .cv-shade {
          flex: 1;
          height: 32px;
          border-radius: 6px;
          border: 1px solid var(--card-border);
          cursor: pointer;
          transition: transform 0.1s;
        }
        .cv-shade:hover { transform: scaleY(1.1); }

        /* SEO */
        .cv-seo { margin-top: 40px; max-width: 800px; }
        .cv-seo h2 {
          font-size: 1.15rem;
          font-weight: 700;
          margin: 32px 0 10px;
          color: var(--foreground);
        }
        .cv-seo p {
          line-height: 1.8;
          color: #666;
          font-size: 0.95rem;
          margin: 0 0 16px;
        }
        .cv-seo h3 {
          font-size: 0.95rem;
          font-weight: 600;
          margin: 20px 0 6px;
          color: var(--foreground);
        }
        [data-theme="dark"] .cv-seo p { color: #888; }
      `}</style>

      <div className="cv-page">

        {/* Header */}
        <div className="cv-header">
          <h1>
            <i className="fa-solid fa-code" style={{ marginRight: 8, opacity: 0.7, fontSize: "0.95rem" }}></i>
            CSS Color Converter
          </h1>
          <p>Convert any color between HEX, RGB, HSL, HSV and CMYK · Click any value to copy</p>
        </div>

        <div className="cv-grid">

          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Input Card */}
            <div className="cv-card">
              <div className="cv-card-header">Enter a Color</div>
              <div className="cv-card-body">
                <div className="cv-input-row">
                  <div className="cv-swatch-btn" style={{ background: hex }}>
                    <input
                      type="color"
                      value={hex}
                      onChange={(e) => setHex(e.target.value)}
                      aria-label="Pick color"
                    />
                  </div>
                  <input
                    className="cv-hex-input"
                    type="text"
                    value={hex}
                    onChange={(e) => handleHexInput(e.target.value)}
                    placeholder="#6366f1"
                    maxLength={7}
                    spellCheck={false}
                  />
                </div>

                {/* Format list */}
                <div>
                  {formats.map((f) => (
                    <div className="cv-format-row" key={f.label}>
                      <span className="cv-format-label">{f.label}</span>
                      <span className="cv-format-value">{f.value}</span>
                      <button
                        className={`cv-copy-btn ${copied === f.label ? "copied" : ""}`}
                        onClick={() => copyToClipboard(f.css, f.label)}
                      >
                        {copied === f.label ? (
                          <><i className="fa-solid fa-check" style={{ fontSize: "0.72rem" }}></i> Copied</>
                        ) : (
                          <><i className="fa-regular fa-copy" style={{ fontSize: "0.72rem" }}></i> Copy</>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT — Preview */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="cv-card">
              <div className="cv-card-header">Preview</div>
              <div className="cv-card-body">

                {/* Main swatch */}
                <div className="cv-preview-swatch" style={{ background: hex }} />

                {/* Shades */}
                <p style={{ fontSize: "0.72rem", color: "var(--label-color)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 8px" }}>Shades</p>
                <div className="cv-shade-row">
                  {[90, 70, 50, 30, 10].map((l) => {
                    const shadeColor = `hsl(${hsl.h}, ${hsl.s}%, ${l}%)`;
                    return (
                      <div
                        key={l}
                        className="cv-shade"
                        style={{ background: shadeColor }}
                        title={shadeColor}
                        onClick={() => {
                          const rgb2 = hslToRgb(hsl.h, hsl.s, l);
                          setHex(rgbToHex(rgb2.r, rgb2.g, rgb2.b));
                        }}
                      />
                    );
                  })}
                </div>

                {/* Values summary */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                  {[
                    { label: "R", value: rgb.r },
                    { label: "G", value: rgb.g },
                    { label: "B", value: rgb.b },
                  ].map((c) => (
                    <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--label-color)", width: 14 }}>{c.label}</span>
                      <div style={{
                        flex: 1, height: 6, borderRadius: 3,
                        background: "var(--card-border)",
                        overflow: "hidden",
                      }}>
                        <div style={{
                          height: "100%",
                          width: `${(c.value / 255) * 100}%`,
                          background: hex,
                          borderRadius: 3,
                          transition: "width 0.2s",
                        }} />
                      </div>
                      <span style={{ fontSize: "0.78rem", fontFamily: "'DM Mono', monospace", color: "var(--tool-text)", width: 28, textAlign: "right" }}>{c.value}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* Quick tip */}
            <div className="cv-card">
              <div className="cv-card-header">Tip</div>
              <div className="cv-card-body" style={{ fontSize: "0.85rem", lineHeight: 1.8, color: "#888" }}>
                <p style={{ margin: 0 }}>
                  Click any shade above to switch to that color. Use the color picker icon or type any HEX value directly into the input.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* SEO Content */}
        <div className="cv-seo">
          <h2>What is a CSS Color Converter?</h2>
          <p>
            A CSS color converter transforms a color value from one format to another.
            Designers typically pick colors as HEX codes, but CSS supports RGB, HSL, and
            more. This tool instantly converts any color into every format you need with
            one click copy.
          </p>

          <h2>Frequently Asked Questions</h2>

          <h3>How do I convert HEX to RGB?</h3>
          <p>
            Enter your HEX code in the input above and the RGB value is calculated instantly.
            Click Copy next to the RGB row to copy it to your clipboard.
          </p>

          <h3>What is the difference between RGB and HSL?</h3>
          <p>
            RGB defines colors using red, green and blue channel values from 0 to 255. HSL
            defines colors using hue (0–360°), saturation and lightness percentages. HSL is
            often easier to work with when adjusting brightness or creating color variations.
          </p>

          <h3>What is CMYK used for?</h3>
          <p>
            CMYK (Cyan, Magenta, Yellow, Key/Black) is used in print design. If you are
            sending colors to a printer or working in InDesign or Illustrator for print,
            you will need CMYK values.
          </p>

          <h3>What is a CSS custom property (variable)?</h3>
          <p>
            CSS variables let you store color values once and reuse them throughout your
            stylesheet. The converter generates a ready-to-use CSS variable declaration
            you can paste directly into your <code>:root</code> block.
          </p>

          <h3>Is this converter free?</h3>
          <p>
            Yes, completely free with no signup needed. All conversions happen instantly
            in your browser.
          </p>
        </div>

      </div>

      <JsonLd data={{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "CSS Color Converter",
  "url": "https://www.img2color.com/tools/css-converter",
  "description": "Convert any color between HEX, RGB, HSL, HSV and CMYK formats instantly. Free online CSS color converter.",
  "applicationCategory": "DesignApplication",
  "operatingSystem": "Web",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "mainEntityOfPage": {
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I convert HEX to RGB?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Enter your HEX code in the input and the RGB value is calculated instantly. Click Copy next to the RGB row to copy it to your clipboard."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between RGB and HSL?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "RGB defines colors using red, green and blue channel values from 0 to 255. HSL defines colors using hue, saturation and lightness percentages."
        }
      },
      {
        "@type": "Question",
        "name": "What is CMYK used for?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "CMYK is used in print design. If you are sending colors to a printer or working in InDesign or Illustrator for print, you will need CMYK values."
        }
      },
      {
        "@type": "Question",
        "name": "Is this converter free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, completely free with no signup needed. All conversions happen instantly in your browser."
        }
      }
    ]
  }
}} />
    </>
  );
}