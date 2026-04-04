"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <>
      <style>{`
        .i2c-footer {
          background: #0f0f14;
          color: #aaa;
          font-family: 'DM Sans', 'Segoe UI', Arial, sans-serif;
          border-top: 1px solid #1e1e2e;
          padding: 48px 0 28px;
          margin-top: auto;
        }
        .footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr; }
          .footer-inner { padding: 0 16px; }
        }
        .footer-brand-name {
          font-size: 1.05rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.02em;
          margin-bottom: 10px;
        }
        .footer-brand-name span { color: #6366f1; }
        .footer-brand p {
          font-size: 0.85rem;
          line-height: 1.7;
          max-width: 280px;
          color: #666;
          margin: 0 0 18px;
        }
        .footer-site-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #1a1a2e;
          border: 1px solid #2a2a4a;
          border-radius: 7px;
          padding: 6px 12px;
          font-size: 0.78rem;
          color: #6366f1;
          text-decoration: none;
          transition: border-color 0.18s;
        }
        .footer-site-link:hover { border-color: #6366f1; color: #818cf8; }
        .footer-col h4 {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #444;
          margin: 0 0 14px;
        }
        .footer-col ul {
          list-style: none;
          padding: 0; margin: 0;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }
        .footer-col ul li a {
          font-size: 0.85rem;
          color: #666;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 7px;
          transition: color 0.15s;
        }
        .footer-col ul li a:hover { color: #fff; }
        .footer-col ul li a i { font-size: 0.72rem; opacity: 0.5; width: 14px; }
        .footer-bottom {
          border-top: 1px solid #1e1e2e;
          padding-top: 22px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .footer-bottom p { font-size: 0.8rem; color: #444; margin: 0; }
        .footer-bottom-links { display: flex; gap: 20px; }
        .footer-bottom-links a {
          font-size: 0.8rem;
          color: #444;
          text-decoration: none;
          transition: color 0.15s;
        }
        .footer-bottom-links a:hover { color: #aaa; }
      `}</style>

      <footer className="i2c-footer">
        <div className="footer-inner">
          <div className="footer-grid">

            {/* Brand */}
            <div className="footer-brand">
              <div className="footer-brand-name">Img<span>2</span>Color</div>
              <p>Free online color tools for designers and developers. Extract palettes, check contrast, generate gradients — all in your browser.</p>
              <a href="https://img2color.com" className="footer-site-link">
                <i className="fa-solid fa-globe"></i> img2color.com
              </a>
            </div>

            {/* Tools */}
            <div className="footer-col">
              <h4>Tools</h4>
              <ul>
                <li><Link href="/"><i className="fa-solid fa-eye-dropper"></i>Color Picker</Link></li>
                <li><Link href="/tools/contrast-checker"><i className="fa-solid fa-circle-half-stroke"></i>Contrast Checker</Link></li>
                <li><Link href="/tools/gradient-generator"><i className="fa-solid fa-wand-magic-sparkles"></i>Gradient Generator</Link></li>
                <li><Link href="/tools/css-converter"><i className="fa-solid fa-code"></i>CSS Converter</Link></li>
                <li><Link href="/tools/color-blindness"><i className="fa-solid fa-glasses"></i>Color Blindness</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><Link href="/about"><i className="fa-solid fa-circle-info"></i>About</Link></li>
                <li><Link href="/blog"><i className="fa-solid fa-pen-nib"></i>Blog</Link></li>
                <li><Link href="/privacy-policy"><i className="fa-solid fa-shield-halved"></i>Privacy Policy</Link></li>
                <li><Link href="/terms-of-service"><i className="fa-solid fa-file-lines"></i>Terms of Service</Link></li>
                <li><Link href="/contact"><i className="fa-solid fa-envelope"></i>Contact</Link></li>
              </ul>
            </div>

          </div>

          <div className="footer-bottom">
            <p>&copy; {year} <strong style={{ color: "#666" }}>img2Color</strong> · All rights reserved.</p>
            <div className="footer-bottom-links">
              <Link href="/privacy-policy">Privacy</Link>
              <Link href="/terms-of-service">Terms</Link>
              <Link href="/sitemap.xml">Sitemap</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}