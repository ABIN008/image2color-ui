// app/layout.js
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata = {
  title: {
    default: "Image2Color — Extract Colors from Any Image Instantly",
    template: "%s | Image2Color",
  },
  description:
    "Upload an image and get color codes instantly. Extract HEX, RGB, HSL, CMYK color palettes from photos. Free image color picker — no signup needed.",
  keywords: [
    "image color picker",
    "color picker from image",
    "extract color from photo",
    "get color code from image",
    "color palette generator",
    "HEX color tool",
    "RGB color picker",
    "WCAG contrast checker",
    "CSS gradient generator",
    "color blindness simulator",
  ],
  authors: [{ name: "Image2Color" }],
  creator: "Image2Color",
  metadataBase: new URL("https://image2color.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Image2Color — Extract Color Codes from Any Image",
    description:
      "Free online tool to extract HEX, RGB, HSL and CMYK color codes from uploaded images. Generate palettes, check contrast, and more.",
    url: "https://image2color.com",
    siteName: "Image2Color",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Image2Color — Online Color Picker Tool",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image2Color — Free Color Picker from Image",
    description:
      "Pick colors from any image. Get HEX, RGB, HSL, CMYK instantly. Free online tool.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts — DM Sans (UI) + DM Mono (color values) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* JSON-LD Structured Data — helps Google understand this is a free web tool */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Image2Color",
              url: "https://image2color.com",
              description:
                "Free online color picker tool. Extract HEX, RGB, HSL, CMYK values from any image. Generate color palettes and check WCAG contrast ratios.",
              applicationCategory: "DesignApplication",
              operatingSystem: "Web",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              featureList: [
                "Image Color Picker",
                "Color Palette Extractor",
                "WCAG Contrast Checker",
                "HEX RGB HSL CMYK Converter",
                "CSS Gradient Generator",
                "Color Blindness Simulator",
              ],
            }),
          }}
        />
      </head>
      <body>
        <Navbar />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}