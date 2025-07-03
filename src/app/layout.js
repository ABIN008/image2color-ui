import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata = {
  title: "Image Color Picker",
  description: "Pick colors from any image!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="container-fluid px-0">
        <Navbar />
        <main className="container py-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
