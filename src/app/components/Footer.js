"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-4 text-center border-top mt-auto" style={{ backgroundColor: "#222", color: "#fff" }}>
      <div className="container">
        <p className="mb-2">&copy; {year} <strong>Image2Color</strong> · All rights reserved.</p>
        <div className="d-flex justify-content-center gap-4">
          <Link href="/about" className="text-white text-decoration-none">About</Link>
          <Link href="/privacy-policy" className="text-white text-decoration-none">Privacy</Link>
          <Link href="/terms-of-service" className="text-white text-decoration-none">Terms</Link>
        </div>
      </div>
    </footer>
  );
}