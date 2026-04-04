// export default function About() {
//   return (
//     <div className="container py-5">
//       <h1 className="mb-4">About Image2Color</h1>

//       <p>
//         <strong>Image2Color</strong> is a free online tool that allows you to
//         extract colors from any image. Whether you’re a designer, developer, or
//         creative enthusiast, our color picker helps you identify and copy color
//         values quickly and easily.
//       </p>

//       <p>
//         Just upload your image and hover or click on any area to get the exact
//         color in <strong>HEX</strong>, <strong>RGB</strong>, and{" "}
//         <strong>HSL</strong> formats. You’ll also get a suggested color palette,
//         helping you with inspiration or design decisions.
//       </p>

//       <h2 className="mt-4">Why Use Image2Color?</h2>
//       <ul>
//         <li>🎨 Extract colors from any image instantly</li>
//         <li>📷 Works with drag-and-drop or file upload</li>
//         <li>💡 Generates color palettes based on your image</li>
//         <li>🔎 View color details in HEX, RGB, and HSL</li>
//         <li>📋 Easily copy color codes to clipboard</li>
//         <li>🌙 Light/Dark mode support</li>
//         <li>🧠 Completely free to use</li>
//       </ul>

//       <h2 className="mt-4">Our Mission</h2>
//       <p>
//         Our goal is to simplify color selection and palette extraction for
//         everyone — from web developers and UI designers to photographers and
//         digital artists. We believe great design starts with the right colors,
//         and Image2Color helps you find them effortlessly.
//       </p>

//       <p className="mt-4">
//         Thank you for using Image2Color! If you have feedback or ideas, we’d
//         love to hear from you. 😊
//       </p>
//     </div>
//   );
// }


export default function AboutPage() {
  return (
    <div className="container py-5">
      <div className="bg-light p-4 rounded shadow-sm">
        <h1 className="mb-4 border-bottom pb-2">About Image2Color</h1>

        <p>
  <strong>Img2Color</strong> is a free, easy-to-use online color
  picker tool that allows you to extract color codes directly from any
  image. Whether you&apos;re a web developer, graphic designer, digital
  artist, or just color curious — this tool is made for you.
</p>

        <section className="mt-4">
          <h5>🎯 What You Can Do</h5>
          <ul>
            <li>Upload or drag & drop an image</li>
            <li>Click on any point to pick a color</li>
            <li>Instantly view HEX, RGB, and HSL values</li>
            <li>Copy colors with one click</li>
            <li>See suggested color palettes</li>
            <li>Enjoy light/dark theme support</li>
          </ul>
        </section>

        <section className="mt-4">
          <h5>🌈 Why Image2Color?</h5>
          <p>
            Colors matter in everything — branding, UI design, photography, even
            personal projects. Our mission is to simplify the way you pick and
            manage colors from images, helping you move faster and smarter with
            your visual work.
          </p>
        </section>

        <section className="mt-4">
          <h5>💡 Our Technology</h5>
          <p>
            The tool uses modern browser APIs and libraries like{" "}
            <code>ColorThief</code> to extract colors directly in your browser.
            No uploads are stored — it’s 100% private and secure.
          </p>
        </section>

        <section className="mt-4">
          <h5>🚀 Our Vision</h5>
          <p>
            We believe color tools should be simple, beautiful, and accessible
            to everyone. Image2Color is continuously evolving, and your feedback
            helps us improve!
          </p>
        </section>

        <p className="mt-4">
  💬 Have suggestions or bug reports? We&apos;d love to hear from you!
  Contact us anytime through our feedback page or social links.
</p>
      </div>
    </div>
  );
}

