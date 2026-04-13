export const metadata = {
  title: "Color Contrast Checker — WCAG AA & AAA Ratio Tool",
  description:
    "Check color contrast ratios instantly. Test foreground and background colors for WCAG AA and AAA accessibility compliance. Free online contrast checker.",
  alternates: {
    canonical: "https://www.img2color.com/tools/contrast-checker",
  },
};

export default function Layout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Color Contrast Checker",
            "url": "https://www.img2color.com/tools/contrast-checker",
            "description": "Check WCAG AA and AAA color contrast ratios instantly. Free online accessibility contrast checker.",
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
                    "text": "For WCAG AA compliance, normal text needs a contrast ratio of at least 4.5:1 and large text needs 3:1. For AAA, normal text needs 7:1."
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
                    "text": "Yes, completely free. No signup required. Just enter your colors and get instant WCAG results."
                  }
                }
              ]
            }
          })
        }}
      />
      {children}
    </>
  );
}