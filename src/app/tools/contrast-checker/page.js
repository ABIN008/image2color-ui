"use client";
import { useState } from "react";
import JsonLd from "../../components/JsonLd";
export default function ContrastChecker() {
  const [fg, setFg] = useState("#111111");
  const [bg, setBg] = useState("#ffffff");

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  function luminance({ r, g, b }) {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function getContrastRatio(hex1, hex2) {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    if (!rgb1 || !rgb2) return null;
    const l1 = luminance(rgb1);
    const l2 = luminance(rgb2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return ((lighter + 0.05) / (darker + 0.05)).toFixed(2);
  }

  const ratio = getContrastRatio(fg, bg);
  const pass_aa_normal = ratio >= 4.5;
  const pass_aa_large = ratio >= 3;
  const pass_aaa_normal = ratio >= 7;
  const pass_aaa_large = ratio >= 4.5;

  const wcagRows = [
    { level: "AA", size: "Normal Text", required: "4.5:1", pass: pass_aa_normal },
    { level: "AA", size: "Large Text (18px+)", required: "3:1", pass: pass_aa_large },
    { level: "AAA", size: "Normal Text", required: "7:1", pass: pass_aaa_normal },
    { level: "AAA", size: "Large Text (18px+)", required: "4.5:1", pass: pass_aaa_large },
  ];

  const getRatioColor = () => {
    if (ratio >= 7) return "#16a34a";
    if (ratio >= 4.5) return "#ca8a04";
    if (ratio >= 3) return "#ea580c";
    return "#dc2626";
  };

  return (
    <>
      <style>{`
        .cc-page {
          max-width: 1280px;
          margin: 0 auto;
          padding: 24px 24px 60px;
          color: var(--tool-text);
          font-family: 'DM Sans', 'Segoe UI', Arial, sans-serif;
        }
        .cc-header { margin-bottom: 24px; }
        .cc-header h1 {
          font-size: clamp(1rem, 2vw, 1.25rem);
          font-weight: 700;
          margin: 0 0 4px;
          letter-spacing: -0.02em;
          color: var(--foreground);
        }
        .cc-header p {
          font-size: 0.85rem;
          color: #888;
          margin: 0;
        }
        .cc-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 16px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .cc-grid { grid-template-columns: 1fr; }
        }
        /* ── Card ── */
        .cc-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 12px;
          overflow: hidden;
        }
        .cc-card-header {
          padding: 12px 16px;
          border-bottom: 1px solid var(--card-border);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--label-color);
        }
        .cc-card-body { padding: 20px; }

        /* ── Color Inputs ── */
        .cc-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        @media (max-width: 500px) {
          .cc-inputs { grid-template-columns: 1fr; }
        }
        .cc-input-group label {
          display: block;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--label-color);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .cc-input-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border: 1px solid var(--card-border);
          border-radius: 8px;
          background: var(--url-input-bg);
          transition: border-color 0.15s;
        }
        .cc-input-row:focus-within {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
        .cc-swatch {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1.5px solid var(--card-border);
          cursor: pointer;
          flex-shrink: 0;
          padding: 0;
          background: none;
          overflow: hidden;
          position: relative;
        }
        .cc-swatch input[type="color"] {
          position: absolute;
          inset: -4px;
          width: calc(100% + 8px);
          height: calc(100% + 8px);
          border: none;
          cursor: pointer;
          padding: 0;
          opacity: 0;
        }
        .cc-hex-input {
          flex: 1;
          border: none;
          background: transparent;
          font-family: 'DM Mono', monospace;
          font-size: 0.9rem;
          color: var(--tool-text);
          outline: none;
          min-width: 0;
        }

        /* ── Preview ── */
        .cc-preview {
          border-radius: 10px;
          border: 1px solid var(--card-border);
          padding: 32px 24px;
          text-align: center;
          margin-bottom: 16px;
          transition: background 0.2s, color 0.2s;
        }
        .cc-preview-large {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 8px;
          line-height: 1.3;
        }
        .cc-preview-small {
          font-size: 0.9rem;
          margin: 0;
          opacity: 0.85;
        }

        /* ── Ratio Display ── */
        .cc-ratio-box {
          background: var(--tool-bg);
          border: 1px solid var(--card-border);
          border-radius: 10px;
          padding: 20px;
          text-align: center;
        }
        .cc-ratio-label {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--label-color);
          margin: 0 0 6px;
        }
        .cc-ratio-value {
          font-size: 2.8rem;
          font-weight: 800;
          margin: 0;
          font-family: 'DM Mono', monospace;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .cc-ratio-desc {
          font-size: 0.78rem;
          color: #888;
          margin: 6px 0 0;
        }

        /* ── WCAG Table ── */
        .cc-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }
        .cc-table thead tr {
          background: var(--tool-bg);
        }
        .cc-table th {
          padding: 10px 14px;
          text-align: left;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--label-color);
          border-bottom: 1px solid var(--card-border);
        }
        .cc-table td {
          padding: 12px 14px;
          border-bottom: 1px solid var(--card-border);
          color: var(--tool-text);
        }
        .cc-table tr:last-child td { border-bottom: none; }
        .cc-table tr:hover td { background: var(--tool-bg); }
        .cc-level-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          background: var(--badge-bg);
          color: var(--badge-text);
        }
        .cc-pass {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 0.78rem;
          font-weight: 600;
        }
        .cc-pass.pass { background: #d1fae5; color: #065f46; }
        .cc-pass.fail { background: #fee2e2; color: #991b1b; }
        [data-theme="dark"] .cc-pass.pass { background: #052e16; color: #4ade80; }
        [data-theme="dark"] .cc-pass.fail { background: #450a0a; color: #f87171; }

        /* ── SEO Section ── */
        .cc-seo {
          margin-top: 40px;
          max-width: 800px;
        }
        .cc-seo h2 {
          font-size: 1.15rem;
          font-weight: 700;
          margin: 32px 0 10px;
          color: var(--foreground);
        }
        .cc-seo p {
          line-height: 1.8;
          color: #666;
          margin: 0 0 16px;
          font-size: 0.95rem;
        }
        .cc-seo h3 {
          font-size: 0.95rem;
          font-weight: 600;
          margin: 20px 0 6px;
          color: var(--foreground);
        }
        [data-theme="dark"] .cc-seo p { color: #888; }
      `}</style>

      <div className="cc-page">

        {/* Header */}
        <div className="cc-header">
          <h1>
            <i className="fa-solid fa-circle-half-stroke" style={{ marginRight: 8, opacity: 0.7, fontSize: "0.95rem" }}></i>
            Color Contrast Checker
          </h1>
          <p>Enter two colors to check WCAG AA and AAA contrast ratios · Instant accessibility results</p>
        </div>

        <div className="cc-grid">

          {/* LEFT — Main Tool */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Color Inputs Card */}
            <div className="cc-card">
              <div className="cc-card-header">Pick Colors</div>
              <div className="cc-card-body">
                <div className="cc-inputs">
                  {/* Foreground */}
                  <div className="cc-input-group">
                    <label>Foreground (Text)</label>
                    <div className="cc-input-row">
                      <div className="cc-swatch" style={{ background: fg }}>
                        <input
                          type="color"
                          value={fg}
                          onChange={(e) => setFg(e.target.value)}
                          aria-label="Pick foreground color"
                        />
                      </div>
                      <input
                        className="cc-hex-input"
                        type="text"
                        value={fg}
                        onChange={(e) => setFg(e.target.value)}
                        maxLength={7}
                        spellCheck={false}
                      />
                    </div>
                  </div>
                  {/* Background */}
                  <div className="cc-input-group">
                    <label>Background</label>
                    <div className="cc-input-row">
                      <div className="cc-swatch" style={{ background: bg }}>
                        <input
                          type="color"
                          value={bg}
                          onChange={(e) => setBg(e.target.value)}
                          aria-label="Pick background color"
                        />
                      </div>
                      <input
                        className="cc-hex-input"
                        type="text"
                        value={bg}
                        onChange={(e) => setBg(e.target.value)}
                        maxLength={7}
                        spellCheck={false}
                      />
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="cc-preview" style={{ background: bg, color: fg }}>
                  <p className="cc-preview-large">Sample Heading Text</p>
                  <p className="cc-preview-small">
                    This is how your body text looks on this background color.
                  </p>
                </div>

              </div>
            </div>

            {/* WCAG Results Card */}
            <div className="cc-card">
              <div className="cc-card-header">WCAG Results</div>
              <div style={{ overflowX: "auto" }}>
                <table className="cc-table">
                  <thead>
                    <tr>
                      <th>Level</th>
                      <th>Text Size</th>
                      <th>Required</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wcagRows.map((row, i) => (
                      <tr key={i}>
                        <td><span className="cc-level-badge">{row.level}</span></td>
                        <td>{row.size}</td>
                        <td style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85rem" }}>{row.required}</td>
                        <td>
                          <span className={`cc-pass ${row.pass ? "pass" : "fail"}`}>
                            {row.pass ? "✓ Pass" : "✗ Fail"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* RIGHT — Ratio Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="cc-card">
              <div className="cc-card-header">Contrast Ratio</div>
              <div className="cc-card-body">
                <div className="cc-ratio-box">
                  <p className="cc-ratio-label">Ratio</p>
                  <p className="cc-ratio-value" style={{ color: getRatioColor() }}>
                    {ratio}:1
                  </p>
                  <p className="cc-ratio-desc">
                    {ratio >= 7
                      ? "Excellent — AAA compliant"
                      : ratio >= 4.5
                      ? "Good — AA compliant"
                      : ratio >= 3
                      ? "Partial — AA large text only"
                      : "Poor — fails WCAG"}
                  </p>
                </div>

                {/* Color swatches summary */}
                <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                  <div style={{
                    flex: 1, height: 48, borderRadius: 8,
                    background: fg,
                    border: "1px solid var(--card-border)"
                  }} title={`Foreground: ${fg}`} />
                  <div style={{
                    flex: 1, height: 48, borderRadius: 8,
                    background: bg,
                    border: "1px solid var(--card-border)"
                  }} title={`Background: ${bg}`} />
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                  <p style={{ flex: 1, textAlign: "center", fontSize: "0.72rem", color: "#888", margin: 0, fontFamily: "'DM Mono', monospace" }}>{fg}</p>
                  <p style={{ flex: 1, textAlign: "center", fontSize: "0.72rem", color: "#888", margin: 0, fontFamily: "'DM Mono', monospace" }}>{bg}</p>
                </div>
              </div>
            </div>

            {/* Quick tip card */}
            <div className="cc-card">
              <div className="cc-card-header">Quick Guide</div>
              <div className="cc-card-body" style={{ fontSize: "0.85rem", lineHeight: 1.8, color: "#888" }}>
                <p style={{ margin: "0 0 8px" }}>
                  <strong style={{ color: "var(--tool-text)" }}>AA Normal</strong> — 4.5:1 minimum for body text
                </p>
                <p style={{ margin: "0 0 8px" }}>
                  <strong style={{ color: "var(--tool-text)" }}>AA Large</strong> — 3:1 for 18px+ or bold 14px+
                </p>
                <p style={{ margin: "0 0 8px" }}>
                  <strong style={{ color: "var(--tool-text)" }}>AAA Normal</strong> — 7:1 enhanced compliance
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: "var(--tool-text)" }}>AAA Large</strong> — 4.5:1 enhanced large text
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* SEO Content */}
        <div className="cc-seo">
          <h2>What is WCAG Color Contrast?</h2>
          <p>
            WCAG (Web Content Accessibility Guidelines) defines minimum contrast ratios between
            text and background colors to ensure content is readable for people with visual
            impairments. Following these guidelines is required for legal accessibility compliance
            in many countries.
          </p>

          <h2>Frequently Asked Questions</h2>

          <h3>What is a good contrast ratio for websites?</h3>
          <p>
            For WCAG AA compliance — the standard required by most accessibility laws — normal
            text needs a ratio of at least 4.5:1 and large text needs 3:1. AAA compliance
            requires 7:1 for normal text.
          </p>

          <h3>What counts as large text in WCAG?</h3>
          <p>
            Large text is 18pt (24px) or larger for regular weight, or 14pt (18.67px) or
            larger for bold text.
          </p>

          <h3>What is the difference between WCAG AA and AAA?</h3>
          <p>
            AA is the standard compliance level required by most accessibility laws like ADA
            and EN 301 549. AAA is the enhanced level with stricter requirements, recommended
            for critical content like government or healthcare websites.
          </p>

          <h3>Is this contrast checker free?</h3>
          <p>
            Yes, completely free. No signup required. Enter your colors and get instant
            WCAG AA and AAA results. All calculations happen in your browser.
          </p>

          <h3>How do I fix a failing contrast ratio?</h3>
          <p>
            Darken your text color or lighten your background (or vice versa) until the ratio
            meets the required minimum. Even small adjustments to lightness can make a big
            difference to the contrast ratio.
          </p>
        </div>

      </div>

      <JsonLd data={{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Color Contrast Checker",
  "url": "https://www.img2color.com/tools/contrast-checker",
  "description": "Check WCAG AA and AAA color contrast ratios instantly. Free online accessibility contrast checker for designers and developers.",
  "applicationCategory": "DesignApplication",
  "operatingSystem": "Web",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "mainEntityOfPage": {
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a good contrast ratio for web accessibility?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For WCAG AA compliance, normal text needs a contrast ratio of at least 4.5:1 and large text needs 3:1. For AAA compliance, normal text needs 7:1 and large text needs 4.5:1."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between WCAG AA and AAA?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AA is the standard compliance level required by most accessibility laws. AAA is the enhanced level with stricter contrast requirements."
        }
      },
      {
        "@type": "Question",
        "name": "What counts as large text in WCAG?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Large text is 18pt (24px) or larger for regular weight, or 14pt (18.67px) or larger for bold text."
        }
      },
      {
        "@type": "Question",
        "name": "Is this contrast checker free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, completely free. No signup required. Just enter your foreground and background colors and get instant WCAG results."
        }
      }
    ]
  }
}} />
    </>
  );
}