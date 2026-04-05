export const metadata = {
  title: "Terms of Service",
  description: "Read the terms and conditions for using Img2Color. Free image color picker tool — governed by Indian law.",
  alternates: { canonical: "https://img2color.com/terms-of-service" },
};

const TERMS = [
  {
    num: "Section 1",
    icon: "✅",
    title: "Fair Use",
    body: "You agree to use Img2Color in a lawful and respectful manner. Do not misuse, reverse-engineer, or attempt to harm the service, its infrastructure, or other users in any way.",
    warning: null,
  },
  {
    num: "Section 2",
    icon: "🧠",
    title: "Intellectual Property",
    body: "All content on this site — including code, design, branding, and logos — is the property of Img2Color and protected by copyright and intellectual property laws.",
    warning: null,
  },
  {
    num: "Section 3",
    icon: "🖼️",
    title: "Uploaded Image Responsibility",
    body: "You are solely responsible for any images you process using our tool. Do not use images that are copyrighted without permission, illegal, offensive, or that violate any third-party rights.",
    warning: null,
  },
  {
    num: "Section 4",
    icon: "🚫",
    title: "No Warranties",
    body: `This service is provided "as is" without warranties of any kind. We do not guarantee the accuracy, performance, or continuous availability of the service. We are not liable for any loss or damage caused by use of this site.`,
    warning: "⚠️ Use of the tool is at your own risk.",
  },
  {
    num: "Section 5",
    icon: "🧩",
    title: "Third-Party Ads",
    body: "We may display ads from providers such as Google AdSense. We do not control the content of these external advertisements and are not responsible for their accuracy or conduct.",
    warning: null,
  },
  {
    num: "Section 6",
    icon: "⛔",
    title: "Termination",
    body: "We reserve the right to suspend or block access to the service if you violate these terms or misuse the platform in any way.",
    warning: null,
  },
  {
    num: "Section 7",
    icon: "✏️",
    title: "Changes to Terms",
    body: "These terms may be updated at any time. Changes will be reflected on this page with an updated date. Continued use of the site after changes are posted constitutes your acceptance of the new terms.",
    warning: null,
  },
  {
    num: "Section 8",
    icon: "⚖️",
    title: "Governing Law",
    body: "These terms shall be governed by the laws of India. Any disputes arising from these terms will be subject to the exclusive jurisdiction of Indian courts.",
    warning: null,
  },
];

export default function TermsOfService() {
  return (
    <>
      <style>{`
        .tos-page {
          font-family: 'DM Sans', 'Segoe UI', Arial, sans-serif;
          padding: 40px 24px 80px;
          max-width: 860px;
          margin: 0 auto;
          color: var(--foreground);
        }
        .tos-eyebrow {
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
        [data-theme="dark"] .tos-eyebrow {
          background: #1e1c3a;
          color: #a5b4fc;
        }
        .tos-title {
          font-size: clamp(1.5rem, 4vw, 2rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          margin: 0 0 10px;
        }
        .tos-subtitle {
          font-size: 0.9rem;
          color: #666;
          margin: 0;
          line-height: 1.6;
        }
        .tos-meta {
          display: flex;
          gap: 20px;
          margin-top: 14px;
          flex-wrap: wrap;
        }
        .tos-meta span { font-size: 0.78rem; color: #999; }
        .tos-toc {
          border: 1.5px solid var(--card-border, #e5e7eb);
          border-radius: 12px;
          padding: 18px 20px;
          margin: 28px 0 24px;
          background: var(--card-bg, #fff);
        }
        .tos-toc-label {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          color: #aaa;
          margin: 0 0 10px;
        }
        .tos-toc-links {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .tos-toc-chip {
          font-size: 0.78rem;
          color: #6366f1;
          background: #f0efff;
          border-radius: 6px;
          padding: 4px 10px;
          font-weight: 500;
        }
        [data-theme="dark"] .tos-toc-chip {
          background: #1e1c3a;
          color: #a5b4fc;
        }
        .tos-section {
          border: 1.5px solid var(--card-border, #e5e7eb);
          border-radius: 14px;
          padding: 22px 24px;
          margin-bottom: 16px;
          background: var(--card-bg, #fff);
        }
        .tos-num {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #6366f1;
          background: #f0efff;
          border-radius: 5px;
          padding: 3px 8px;
          display: inline-block;
          margin-bottom: 8px;
        }
        [data-theme="dark"] .tos-num {
          background: #1e1c3a;
          color: #a5b4fc;
        }
        .tos-sec-title {
          font-size: 0.95rem;
          font-weight: 700;
          margin: 0 0 10px;
        }
        .tos-body {
          font-size: 0.85rem;
          line-height: 1.8;
          color: #555;
          margin: 0;
        }
        [data-theme="dark"] .tos-body { color: #aaa; }
        .tos-warning {
          background: #fef3c7;
          border-radius: 9px;
          padding: 11px 14px;
          margin-top: 12px;
          font-size: 0.82rem;
          color: #92400e;
          font-weight: 500;
          display: flex;
          align-items: flex-start;
          gap: 7px;
        }
        [data-theme="dark"] .tos-warning {
          background: #2d1f00;
          color: #fbbf24;
        }
        .tos-contact {
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
        .tos-contact p { margin: 0; font-size: 0.88rem; color: #666; }
        .tos-contact strong { color: var(--foreground); }
        .tos-email-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #f0efff;
          border-radius: 7px;
          padding: 5px 11px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #4338ca;
          font-family: 'DM Mono', monospace;
          margin-top: 8px;
        }
        [data-theme="dark"] .tos-email-pill {
          background: #1e1c3a;
          color: #a5b4fc;
        }
        .tos-contact-btn {
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
        .tos-contact-btn:hover { background: #4f46e5; }
        @media (max-width: 480px) {
          .tos-page { padding: 28px 16px 60px; }
          .tos-section { padding: 18px 16px; }
        }
      `}</style>

      <div className="tos-page">
        {/* Hero */}
        <div>
          <div className="tos-eyebrow">📄 Legal</div>
          <h1 className="tos-title">Terms of Service</h1>
          <p className="tos-subtitle">
            By using Img2Color, you agree to these terms. They&rsquo;re plain English — no legalese.
          </p>
          <div className="tos-meta">
            <span>📅 Last updated: June 2025</span>
            <span>⚖️ Governed by Indian law</span>
          </div>
        </div>

        {/* Table of contents */}
        <div className="tos-toc">
          <p className="tos-toc-label">Contents</p>
          <div className="tos-toc-links">
            {TERMS.map((t) => (
              <span key={t.num} className="tos-toc-chip">
                {t.icon} {t.title}
              </span>
            ))}
          </div>
        </div>

        {/* Sections */}
        {TERMS.map((t) => (
          <div key={t.num} className="tos-section">
            <span className="tos-num">{t.num}</span>
            <h2 className="tos-sec-title">
              {t.icon} {t.title}
            </h2>
            <p className="tos-body">{t.body}</p>
            {t.warning && <div className="tos-warning">{t.warning}</div>}
          </div>
        ))}

        {/* Contact */}
        <div className="tos-contact">
          <div>
            <strong>Questions about these terms?</strong>
            <div className="tos-email-pill">📩 support@image2color.com</div>
          </div>
          <a className="tos-contact-btn" href="/contact">Contact Us →</a>
        </div>
      </div>
    </>
  );
}