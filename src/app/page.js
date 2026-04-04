// app/page.js
import ColorPickerTool from "./components/ColorPickerTool";

// Per-page SEO metadata (overrides the default title in layout.js)
export const metadata = {
  title: "Free Image Color Picker — Extract HEX, RGB, HSL, CMYK from Any Photo",
  description:
    "Instantly pick any color from an image. Hover over pixels to get HEX, RGB, HSL, CMYK and Lab values. Extract a full color palette and export as CSS or PNG. Free, no signup.",
  alternates: {
    canonical: "https://image2color.com",
  },
};

export default function HomePage() {
  return (
    <>
      {/* 
        Small SEO header — visible to Google crawlers and screen readers
        but styled to stay secondary to the tool itself.
      */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "16px 24px 0",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            fontWeight: 700,
            margin: "0 0 4px",
            letterSpacing: "-0.02em",
            color: "var(--foreground)",
          }}
        >
          Image Color Picker
        </h1>
        <p
          style={{
            fontSize: "0.85rem",
            color: "#888",
            margin: 0,
          }}
        >
          Hover over the image to pick any color · Click to lock · Export palette as CSS or PNG
        </p>
      </div>

      <ColorPickerTool />
    </>
  );
}