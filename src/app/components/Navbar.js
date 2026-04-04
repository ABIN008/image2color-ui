"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/images/logo/LOGO23.png"; // Make sure this path is correct

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      setDarkMode(false);
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    const theme = newMode ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark border-bottom border-3 fixed-top w-100 mb-5" >
      <div className="container-fluid px-4">
        <Link className="navbar-brand d-flex align-items-center" href="/">
           <Image
            src={logo} 
            alt="Logo"
            width={300} 
            height={50} 
            className="d-inline-block align-top"
          />
          {/* <Image src={logo} alt="Logo" width={50} height={50} className="d-inline-block align-top" />
          <span className="fw-bold fs-5 d-flex px-2 py-1 rounded-2 bg-dark ms-2" style={{ fontFamily: "Arial, sans-serif", letterSpacing: "0px" }}>
            <span style={{ color: "#ed5565" }}>i</span>
            <span style={{ color: "#FCF259" }}>m</span>
            <span style={{ color: "#5bc0de" }}>a</span>
            <span style={{ color: "#5cb85c" }}>g</span>
            <span style={{ color: "#B13BFF" }}>e</span>
            <span style={{ color: "#f0ad4e" }}>2</span>
            <span style={{ color: "#428bca" }}>C</span>
            <span style={{ color: "#7AE2CF" }}>o</span>
            <span style={{ color: "#FFFCFB" }}>l</span>
            <span style={{ color: "#d9534f" }}>o</span>
            <span style={{ color: "#A4DD00" }}>r</span>
            <span style={{ color: "#FF69B4" }}>.</span>
            <span style={{ color: "#00CED1" }}>c</span>
            <span style={{ color: "#FFD700" }}>o</span>
            <span style={{ color: "#8A2BE2" }}>m</span>
          </span> */}
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button className="btn nav-link text-white" onClick={toggleTheme} style={{ background: "none", border: "none" }}>
                <i className={`fa-solid ${darkMode ? "fa-moon" : "fa-sun"}`} style={{ fontSize: "1.2rem" }}></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}