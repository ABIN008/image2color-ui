// app/layout.js
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";

export const metadata = {
  title: "Image2Color - Extract Colors from Any Image Instantly",
  description:
    "Upload an image and get color codes instantly. Extract HEX, RGB, HSL color palettes from photos using our free image color picker.",
  keywords: [
    "image color picker",
    "color picker from image",
    "extract color from photo",
    "get color code from image",
    "color palette generator",
    "HEX color tool",
  ],
  openGraph: {
    title: "Image2Color - Extract Color Codes from Any Image",
    description:
      "Free online tool to extract HEX, RGB, and HSL color codes from uploaded images.",
    url: "https://image2color.com",
    siteName: "Image2Color",
    images: [
      {
        url: "/og-image.jpg", // Create a 1200x630 preview image
        width: 1200,
        height: 630,
        alt: "Image2Color - Online Color Picker Tool",
      },
    ],
    type: "website",
  },
  metadataBase: new URL("https://image2color.com"),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container  px-4" >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
