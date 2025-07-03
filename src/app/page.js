import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "../../src/app/components/Navbar";
import ColorPickerTool from "../../src/app/components/ColorPickerTool";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";
import Footer from "../../src/app/components/Footer"

export default function Home() {
  return (
    <div className={styles.page}>
      {/* <Navbar /> */}
      <main className={styles.main}>
        <ColorPickerTool />
      </main>
      {/* <footer >
        <Footer />
      </footer> */}
    </div>
  );
}
