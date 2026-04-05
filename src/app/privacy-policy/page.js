export const metadata = {
  title: "Privacy Policy",
  description: "Learn how Img2Color handles your data. Your images are processed entirely in your browser — we never upload or store them.",
  alternates: { canonical: "https://img2color.com/privacy-policy" },
};

export default function PrivacyPolicy() {
  return (
    <>
      <style>{`
        .pp-page {
          font-family: 'DM Sans', 'Segoe UI', Arial, sans-serif;
          padding: 40px 24px 80px;
          max-width: 860px;
          margin: 0 auto;
          color: var(--foreground);
        }
        .pp-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          color: #6366f1;
          background: #f0efff;
          border-radius: 6px;
          padding: 4px 10px;
          margin-bottom: 14px;
        }
        [data-theme="dark"] .pp-eyebrow {
          background: #1e1c3a;
          color: #a5b4fc;
        }
        .pp-title {
          font-size: clamp(1.5rem, 4vw, 2rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          margin: 0 0 10px;
        }
        .pp-subtitle {
          font-size: 0.9rem;
          color: #666;
          margin: 0;
          line-height: 1.6;
        }
        .pp-meta {
          display: flex;
          gap: 20px;
          margin-top: 14px;
          flex-wrap: wrap;
        }
        .pp-meta span {
          font-size: 0.78rem;
          color: #999;
        }
        .pp-section {
          border: 1.5px solid var(--card-border, #e5e7eb);
          border-radius: 14px;
          padding: 22px 24px;
          margin-bottom: 16px;
          background: var(--card-bg, #fff);
        }
        .pp-sec-head {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
        }
        .pp-sec-icon {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: #f0efff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 15px;
        }
        [data-theme="dark"] .pp-sec-icon {
          background: #1e1c3a;
        }
        .pp-sec-title {
          font-size: 0.95rem;
          font-weight: 700;
          margin: 0;
          padding-top: 6px;
        }
        .pp-body {
          font-size: 0.85rem;
          line-height: 1.8;
          color: #555;
          margin: 0;
        }
        [data-theme="dark"] .pp-body {
          color: #aaa;
        }
        .pp-list {
          font-size: 0.85rem;
          line-height: 1.8;
          color: #555;
          margin: 0;
          padding-left: 18px;
        }
        [data-theme="dark"] .pp-list {
          color: #aaa;
        }
        .pp-list li { margin-bottom: 4px; }
        .pp-highlight {
          background: #f0efff;
          border-radius: 9px;
          padding: 12px 15px;
          margin-top: 12px;
          font-size: 0.82rem;
          color: #4338ca;
          font-weight: 500;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        [data-theme="dark"] .pp-highlight {
          background: #1e1c3a;
          color: #a5b4fc;
        }
        .pp-contact {
          border: 1.5px solid #6366f1;
          border-radius: 14px;
          padding: 22px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 28px;
        }
        .pp-contact p { margin: 0; font-size: 0.88rem; color: #666; }
        .pp-contact strong { color: var(--foreground); }
        .pp-contact-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #6366f1;
          color: #fff;
          font-size: 0.82rem;
          font-weight: 700;
          padding: 10px 20px;
          border-radius: 9px;
          text-decoration: none;
          transition: background 0.15s;
          white-space: nowrap;
        }
        .pp-contact-btn:hover { background: #4f46e5; }
        @media (max-width: 480px) {
          .pp-page { padding: 28px 16px 60px; }
          .pp-section { padding: 18px 16px; }
        }
      `}</style>

      <div className="pp-page">
        {/* Hero */}
        <div style={{ marginBottom: 36 }}>
          <div className="pp-eyebrow">🔒 Legal</div>
          <h1 className="pp-title">Privacy Policy</h1>
          <p className="pp-subtitle">How Img2Color handles your data — spoiler: we barely collect any.</p>
          <div className="pp-meta">
            <span>📅 Last updated: June 2025</span>
            <span>⏱ 2 min read</span>
          </div>
        </div>

        {/* Information We Collect */}
        <div className="pp-section">
          <div className="pp-sec-head">
            <div className="pp-sec-icon">📋</div>
            <h2 className="pp-sec-title">Information We Collect</h2>
          </div>
          <ul className="pp-list">
            <li>No personal data or account sign-up required to use any tool</li>
            <li>Anonymous, aggregated usage data via analytics (page views, session duration)</li>
            <li>Device type and browser for performance diagnostics only</li>
          </ul>
        </div>

        {/* Image Upload Handling */}
        <div className="pp-section">
          <div className="pp-sec-head">
            <div className="pp-sec-icon">🖼️</div>
            <h2 className="pp-sec-title">Image Upload Handling</h2>
          </div>
          <p className="pp-body">
            All color extraction happens entirely in your browser using the HTML5 Canvas API.
            Your images are never uploaded to, stored on, or transmitted to any of our servers.
          </p>
          <div className="pp-highlight">✅ Your images stay on your device. Always.</div>
        </div>

        {/* Cookies & Analytics */}
        <div className="pp-section">
          <div className="pp-sec-head">
            <div className="pp-sec-icon">🍪</div>
            <h2 className="pp-sec-title">Cookies &amp; Analytics</h2>
          </div>
          <p className="pp-body">
            We may use minimal cookies to improve site performance. Services such as Google Analytics
            may store anonymized cookie data for aggregate traffic analysis. No personally
            identifiable information is linked to these cookies.
          </p>
        </div>

        {/* Third-Party Advertising */}
        <div className="pp-section">
          <div className="pp-sec-head">
            <div className="pp-sec-icon">📢</div>
            <h2 className="pp-sec-title">Third-Party Advertising</h2>
          </div>
          <p className="pp-body">
            Img2Color may display contextual ads through providers such as Google AdSense.
            These services may use cookies to show relevant ads based on browsing behavior.
            We do not sell your data to advertisers.
          </p>
        </div>

        {/* Consent */}
        <div className="pp-section">
          <div className="pp-sec-head">
            <div className="pp-sec-icon">✔️</div>
            <h2 className="pp-sec-title">Your Consent &amp; Policy Updates</h2>
          </div>
          <p className="pp-body">
            By using Img2Color, you consent to this privacy policy. We may revise it periodically —
            any changes will be posted on this page with an updated date at the top.
          </p>
        </div>

        {/* Contact CTA */}
        <div className="pp-contact">
          <div>
            <strong>Questions about your privacy?</strong>
            <p>We&apos;re happy to answer — reach out any time.</p>
          </div>
          <a className="pp-contact-btn" href="/contact">Contact Us →</a>
        </div>
      </div>
    </>
  );
}