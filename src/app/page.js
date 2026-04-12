// app/page.js
import ColorPickerTool from "./components/ColorPickerTool";

export const metadata = {
  title: "Free Image Color Picker — Extract HEX, RGB, HSL, CMYK from Any Photo",
  description:
    "Instantly pick any color from an image. Hover over pixels to get HEX, RGB, HSL, CMYK and Lab values. Extract a full color palette and export as CSS or PNG. Free, no signup.",
  alternates: {
    canonical: "https://www.img2color.com",
  },
};

export default function HomePage() {
  return (
    <>
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

      {/* SEO Content Section */}
      <section
        style={{
          maxWidth: 800,
          margin: "40px auto",
          padding: "0 24px 60px",
          color: "var(--foreground)",
        }}
      >
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 12 }}>
          How to Pick a Color from an Image
        </h2>
        <ol style={{ lineHeight: 2, paddingLeft: 20 }}>
          <li>Upload any image or paste an image URL</li>
          <li>Hover over any pixel to see its color values instantly</li>
          <li>Click to lock the color and add it to your palette</li>
          <li>Export your palette as CSS variables or PNG</li>
        </ol>

        <h2
          style={{ fontSize: "1.3rem", fontWeight: 700, marginTop: 40, marginBottom: 16 }}
        >
          What is an Image Color Picker?
        </h2>
        <p style={{ lineHeight: 1.8, color: "#666" }}>
          An image color picker is a tool that lets you extract exact color codes from any
          photo or graphic. Instead of guessing a color, you simply hover over any pixel and
          instantly get its HEX, RGB, HSL, CMYK and Lab values. Designers use it to match
          brand colors, developers use it to get CSS values, and artists use it to build
          color palettes from reference images.
        </p>

        <h2
          style={{ fontSize: "1.3rem", fontWeight: 700, marginTop: 40, marginBottom: 16 }}
        >
          Frequently Asked Questions
        </h2>

        <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 6 }}>
          How do I get the HEX code from an image?
        </h3>
        <p style={{ lineHeight: 1.8, color: "#666", marginBottom: 24 }}>
          Upload your image to img2color, then hover over any pixel. The HEX code appears
          instantly in the color panel. Click to lock it and copy the value.
        </p>

        <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 6 }}>
          Is this color picker free?
        </h3>
        <p style={{ lineHeight: 1.8, color: "#666", marginBottom: 24 }}>
          Yes, completely free. No signup, no limits, no watermarks. All processing happens
          in your browser — your images are never uploaded to any server.
        </p>

        <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 6 }}>
          What color formats does it support?
        </h3>
        <p style={{ lineHeight: 1.8, color: "#666", marginBottom: 24 }}>
          img2color shows HEX, RGB, HSL, CMYK and Lab values for every color you pick.
          You can copy any format with one click.
        </p>

        <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 6 }}>
          Can I extract a full color palette from a photo?
        </h3>
        <p style={{ lineHeight: 1.8, color: "#666", marginBottom: 24 }}>
          Yes. Click multiple colors to build a palette, then export it as CSS variables
          or a PNG swatch file. Perfect for brand identity and design projects.
        </p>

        <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 6 }}>
          Does it work on mobile?
        </h3>
        <p style={{ lineHeight: 1.8, color: "#666", marginBottom: 24 }}>
          Yes, img2color works on all devices including phones and tablets — no app
          install needed. Just open the site and start picking colors.
        </p>

        <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 6 }}>
          Is my image data private?
        </h3>
        <p style={{ lineHeight: 1.8, color: "#666", marginBottom: 24 }}>
          Completely. All color extraction happens locally in your browser using
          JavaScript Canvas API. Your images are never sent to any server.
        </p>
      </section>
    </>
  );
}