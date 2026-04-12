// src/app/tools/contrast-checker/page.js
"use client";
import { useState } from "react";

export default function ContrastChecker() {
  const [fg, setFg] = useState("#000000");
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

  const badge = (pass) => (
    <span
      style={{
        padding: "4px 12px",
        borderRadius: 20,
        fontSize: "0.85rem",
        fontWeight: 600,
        background: pass ? "#d1fae5" : "#fee2e2",
        color: pass ? "#065f46" : "#991b1b",
      }}
    >
      {pass ? "✅ Pass" : "❌ Fail"}
    </span>
  );

  return (
    <>
      {/* Tool Section */}
      <div style={{ maxWidth: 700, margin: "40px auto", padding: "0 24px" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: 8 }}>
          Color Contrast Checker
        </h1>
        <p style={{ color: "#666", marginBottom: 32 }}>
          Check WCAG AA and AAA contrast ratios between two colors instantly.
        </p>

        {/* Color Inputs */}
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 32 }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>
              Foreground Color (Text)
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input
                type="color"
                value={fg}
                onChange={(e) => setFg(e.target.value)}
                style={{ width: 48, height: 48, border: "none", cursor: "pointer", borderRadius: 8 }}
              />
              <input
                type="text"
                value={fg}
                onChange={(e) => setFg(e.target.value)}
                style={{
                  padding: "10px 14px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  fontSize: "1rem",
                  width: 120,
                  fontFamily: "monospace",
                }}
              />
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>
              Background Color
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input
                type="color"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                style={{ width: 48, height: 48, border: "none", cursor: "pointer", borderRadius: 8 }}
              />
              <input
                type="text"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                style={{
                  padding: "10px 14px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  fontSize: "1rem",
                  width: 120,
                  fontFamily: "monospace",
                }}
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div
          style={{
            background: bg,
            color: fg,
            padding: "32px",
            borderRadius: 12,
            marginBottom: 32,
            textAlign: "center",
            border: "1px solid #eee",
          }}
        >
          <p style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
            Sample Text Preview
          </p>
          <p style={{ fontSize: "0.95rem", margin: "8px 0 0" }}>
            This is how your text looks on this background.
          </p>
        </div>

        {/* Contrast Ratio */}
        <div
          style={{
            background: "#f9fafb",
            borderRadius: 12,
            padding: "24px",
            marginBottom: 32,
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>Contrast Ratio</p>
          <p style={{ fontSize: "3rem", fontWeight: 800, margin: "8px 0", color: "#111" }}>
            {ratio}:1
          </p>
        </div>

        {/* WCAG Results */}
        <div style={{ borderRadius: 12, border: "1px solid #eee", overflow: "hidden", marginBottom: 48 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Level</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Text Size</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Required</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Result</th>
              </tr>
            </thead>
            <tbody>
              {[
                { level: "AA", size: "Normal Text", required: "4.5:1", pass: pass_aa_normal },
                { level: "AA", size: "Large Text", required: "3:1", pass: pass_aa_large },
                { level: "AAA", size: "Normal Text", required: "7:1", pass: pass_aaa_normal },
                { level: "AAA", size: "Large Text", required: "4.5:1", pass: pass_aaa_large },
              ].map((row, i) => (
                <tr key={i} style={{ borderTop: "1px solid #eee" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 600 }}>{row.level}</td>
                  <td style={{ padding: "12px 16px" }}>{row.size}</td>
                  <td style={{ padding: "12px 16px", fontFamily: "monospace" }}>{row.required}</td>
                  <td style={{ padding: "12px 16px" }}>{badge(row.pass)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SEO Content */}
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 12 }}>
          What is WCAG Color Contrast?
        </h2>
        <p style={{ lineHeight: 1.8, color: "#666", marginBottom: 24 }}>
          WCAG (Web Content Accessibility Guidelines) defines minimum contrast ratios between
          text and background colors to ensure content is readable for people with visual
          impairments. A ratio of 4.5:1 is required for normal text at AA level, and 7:1
          for AAA level.
        </p>

        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 16 }}>
          Frequently Asked Questions
        </h2>

        <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 6 }}>
          What is a good contrast ratio for web accessibility?
        </h3>
        <p style={{ lineHeight: 1.8, color: "#666", marginBottom: 20 }}>
          For WCAG AA compliance, normal text needs a contrast ratio of at least 4.5:1 and
          large text needs 3:1. For AAA compliance, normal text needs 7:1 and large text needs 4.5:1.
        </p>

        <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 6 }}>
          What is large text in WCAG?
        </h3>
        <p style={{ lineHeight: 1.8, color: "#666", marginBottom: 20 }}>
          Large text is defined as 18pt (24px) or larger for regular weight, or 14pt (18.67px)
          or larger for bold text.
        </p>

        <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 6 }}>
          What is the difference between WCAG AA and AAA?
        </h3>
        <p style={{ lineHeight: 1.8, color: "#666", marginBottom: 20 }}>
          AA is the standard compliance level required by most accessibility laws. AAA is the
          enhanced level with stricter contrast requirements, recommended for critical content
          like government or healthcare sites.
        </p>

        <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 6 }}>
          Is this contrast checker free?
        </h3>
        <p style={{ lineHeight: 1.8, color: "#666", marginBottom: 40 }}>
          Yes, completely free. No signup required. Just enter your foreground and background
          colors and get instant WCAG results.
        </p>
      </div>
    </>
  );
}