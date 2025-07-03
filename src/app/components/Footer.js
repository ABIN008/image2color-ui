"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer
      className="mt-5 py-4 text-center"
      style={{ backgroundColor: "#222", color: "#fff" }}
    >
      <div className="container">
        <p>
          &copy; {year} <strong>Image2Color</strong> · All rights reserved.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link href="/about">
            <span className="text-white">About</span>
          </Link>
          <Link href="/privacy-policy">
            <span className="text-white">Privacy</span>
          </Link>
          <Link href="/terms-of-service">
            <span className="text-white">Terms</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
