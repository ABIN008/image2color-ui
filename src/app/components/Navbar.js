"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/images/logo/LOGO23.png"; // same path as your original

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Restore saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      setDarkMode(false);
      document.documentElement.setAttribute("data-theme", "light");
    }

    // Scroll shadow
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    const theme = newMode ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  return (
    <>
      <style>{`
        .i2c-navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 2000;
          height: 68px;
          background: var(--nav-bg, rgba(255,255,255,0.96));
          border-bottom: 1.5px solid var(--nav-border, #e8e8e8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transition: box-shadow 0.25s ease;
          font-family: 'DM Sans', 'Segoe UI', Arial, sans-serif;
        }
        .i2c-navbar.scrolled {
          box-shadow: 0 2px 20px rgba(0,0,0,0.07);
        }
        .nav-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .nav-logo { display: flex; align-items: center; text-decoration: none; flex-shrink: 0; }
        /* Desktop links */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 2px;
          list-style: none;
          margin: 0;
          padding: 0;
          flex: 1;
          justify-content: center;
        }
        .nav-links a {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 13px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--nav-link, #444);
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .nav-links a:hover {
          background: var(--nav-link-hover-bg, #f0f0f5);
          color: var(--nav-link-hover, #111);
        }
        .nav-badge {
          font-size: 0.62rem;
          font-weight: 700;
          padding: 2px 5px;
          border-radius: 4px;
          background: #22c55e;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          line-height: 1;
        }
        /* Right controls */
        .nav-controls { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .nav-divider { width: 1px; height: 22px; background: var(--nav-border, #e8e8e8); }
        /* Theme toggle button */
        .theme-btn {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px;
          border-radius: 9px;
          border: 1.5px solid var(--nav-border, #e8e8e8);
          background: transparent;
          color: var(--nav-link, #444);
          cursor: pointer;
          transition: background 0.15s;
          font-size: 0.95rem;
        }
        .theme-btn:hover { background: var(--nav-link-hover-bg, #f0f0f5); }
        /* Hamburger */
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 4px;
          width: 36px; height: 36px;
          align-items: center; justify-content: center;
          border: 1.5px solid var(--nav-border, #e8e8e8);
          border-radius: 9px;
          background: transparent;
          cursor: pointer;
        }
        .hamburger span {
          display: block;
          width: 17px; height: 2px;
          background: var(--nav-link, #444);
          border-radius: 2px;
          transition: transform 0.2s, opacity 0.2s;
        }
        /* Mobile menu */
        .mobile-menu {
          display: none;
          position: fixed;
          top: 68px; left: 0; right: 0;
          background: var(--nav-bg, rgba(255,255,255,0.98));
          border-bottom: 1.5px solid var(--nav-border, #e8e8e8);
          padding: 8px 24px 16px;
          z-index: 1999;
          backdrop-filter: blur(12px);
        }
        .mobile-menu.open { display: block; }
        .mobile-menu a {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 0;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--nav-link, #444);
          text-decoration: none;
          border-bottom: 1px solid var(--nav-border, #f0f0f0);
        }
        .mobile-menu a:last-child { border-bottom: none; }
        .mobile-menu a i { width: 16px; text-align: center; opacity: 0.6; }
        /* Breakpoints */
        @media (max-width: 900px) {
          .nav-links { display: none; }
          .nav-divider { display: none; }
          .hamburger { display: flex; }
        }
        @media (max-width: 480px) {
          .nav-inner { padding: 0 16px; }
          .mobile-menu { padding: 8px 16px 16px; }
        }
      `}</style>

      <nav className={`i2c-navbar${scrolled ? " scrolled" : ""}`} role="navigation" aria-label="Main navigation">
        <div className="nav-inner">

          {/* Logo */}
          <Link href="/" className="nav-logo" aria-label="Image2Color home">
            <Image
              src={logo}
              alt="Image2Color"
              width={200}
              height={36}
              priority
              style={{ objectFit: "contain", height: "auto" }}
            />
          </Link>

          {/* Desktop Nav Links */}
          <ul className="nav-links">
            <li>
              <Link href="/">
                <i className="fa-solid fa-eye-dropper" style={{ fontSize: "0.78rem", opacity: 0.7 }}></i>
                Color Picker
              </Link>
            </li>
            <li>
              <Link href="/tools/contrast-checker">
                <i className="fa-solid fa-circle-half-stroke" style={{ fontSize: "0.78rem", opacity: 0.7 }}></i>
                Contrast
              </Link>
            </li>
            <li>
              <Link href="/tools/gradient-generator">
                <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize: "0.78rem", opacity: 0.7 }}></i>
                Gradient
                <span className="nav-badge">New</span>
              </Link>
            </li>
            <li>
              <Link href="/tools/css-converter">
                <i className="fa-solid fa-code" style={{ fontSize: "0.78rem", opacity: 0.7 }}></i>
                Converter
              </Link>
            </li>
            <li>
              <Link href="/tools/color-blindness">
                <i className="fa-solid fa-glasses" style={{ fontSize: "0.78rem", opacity: 0.7 }}></i>
                Color Blindness
              </Link>
            </li>
          </ul>

          {/* Right controls */}
          <div className="nav-controls">
            <div className="nav-divider" aria-hidden="true"></div>
            <button
              className="theme-btn"
              onClick={toggleTheme}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              title={darkMode ? "Light mode" : "Dark mode"}
            >
              <i className={`fa-solid fa-${darkMode ? "moon" : "sun"}`}></i>
            </button>
            <button
              className="hamburger"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-label="Toggle navigation menu"
            >
              <span style={menuOpen ? { transform: "rotate(45deg) translate(4px, 4px)" } : {}} />
              <span style={menuOpen ? { opacity: 0 } : {}} />
              <span style={menuOpen ? { transform: "rotate(-45deg) translate(4px, -4px)" } : {}} />
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile dropdown */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`} aria-hidden={!menuOpen}>
        <Link href="/" onClick={() => setMenuOpen(false)}>
          <i className="fa-solid fa-eye-dropper"></i> Color Picker
        </Link>
        <Link href="/tools/contrast-checker" onClick={() => setMenuOpen(false)}>
          <i className="fa-solid fa-circle-half-stroke"></i> Contrast Checker
        </Link>
        <Link href="/tools/gradient-generator" onClick={() => setMenuOpen(false)}>
          <i className="fa-solid fa-wand-magic-sparkles"></i> Gradient Generator
          <span className="nav-badge" style={{ marginLeft: 4 }}>New</span>
        </Link>
        <Link href="/tools/css-converter" onClick={() => setMenuOpen(false)}>
          <i className="fa-solid fa-code"></i> CSS Converter
        </Link>
        <Link href="/tools/color-blindness" onClick={() => setMenuOpen(false)}>
          <i className="fa-solid fa-glasses"></i> Color Blindness
        </Link>
      </div>
    </>
  );
}