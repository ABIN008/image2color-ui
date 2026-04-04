"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import ColorThief from "colorthief";

// ─── Utility Functions ──────────────────────────────────────────────────────

const rgbToHex = (r, g, b) =>
  `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

const rgbToHsl = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
};

const rgbToCmyk = (r, g, b) => {
  if (r === 0 && g === 0 && b === 0) return "cmyk(0%, 0%, 0%, 100%)";
  let c = 1 - r / 255, m = 1 - g / 255, y = 1 - b / 255;
  const k = Math.min(c, m, y);
  c = ((c - k) / (1 - k)) * 100;
  m = ((m - k) / (1 - k)) * 100;
  y = ((y - k) / (1 - k)) * 100;
  return `cmyk(${c.toFixed(0)}%, ${m.toFixed(0)}%, ${y.toFixed(0)}%, ${(k * 100).toFixed(0)}%)`;
};

const rgbToLab = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  [r, g, b] = [r, g, b].map((c) => c > 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92);
  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  const yv = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  const [fx, fy, fz] = [x, yv, z].map((v) => v > 0.008856 ? Math.cbrt(v) : 7.787 * v + 16 / 116);
  return `Lab(${(116 * fy - 16).toFixed(1)}, ${(500 * (fx - fy)).toFixed(1)}, ${(200 * (fy - fz)).toFixed(1)})`;
};

const getLuminance = (r, g, b) => {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

const getContrastRatio = (r, g, b) => {
  const L = getLuminance(r, g, b);
  return {
    onWhite: ((1.05) / (L + 0.05)).toFixed(2),
    onBlack: ((L + 0.05) / (0.05)).toFixed(2),
  };
};

const wcagGrade = (ratio) => {
  const r = parseFloat(ratio);
  if (r >= 7) return { label: "AAA", color: "#16a34a" };
  if (r >= 4.5) return { label: "AA", color: "#2563eb" };
  if (r >= 3) return { label: "AA Large", color: "#d97706" };
  return { label: "Fail", color: "#dc2626" };
};

const getColorName = (r, g, b) => {
  const named = {
    "Red": [220, 38, 38], "Crimson": [185, 28, 28], "Orange": [249, 115, 22],
    "Amber": [245, 158, 11], "Yellow": [234, 179, 8], "Lime": [132, 204, 22],
    "Green": [34, 197, 94], "Emerald": [16, 185, 129], "Teal": [20, 184, 166],
    "Cyan": [6, 182, 212], "Sky": [14, 165, 233], "Blue": [59, 130, 246],
    "Indigo": [99, 102, 241], "Violet": [139, 92, 246], "Purple": [168, 85, 247],
    "Fuchsia": [217, 70, 239], "Pink": [236, 72, 153], "Rose": [244, 63, 94],
    "Black": [0, 0, 0], "White": [255, 255, 255], "Gray": [107, 114, 128],
    "Slate": [100, 116, 139], "Stone": [120, 113, 108], "Brown": [120, 72, 42],
    "Tan": [210, 180, 140], "Navy": [30, 41, 98], "Olive": [107, 114, 28],
    "Coral": [255, 127, 80], "Gold": [212, 175, 55], "Silver": [192, 192, 192],
    "Maroon": [127, 29, 29], "Ivory": [255, 255, 240],
  };
  let closest = "Unknown", minDist = Infinity;
  for (const [name, [cr, cg, cb]] of Object.entries(named)) {
    const dist = Math.sqrt((r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2);
    if (dist < minDist) { minDist = dist; closest = name; }
  }
  return closest;
};

// ─── Component ─────────────────────────────────────────────────────────────

export default function ColorPickerTool() {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const rightPanelRef = useRef(null);

  const DEFAULT_IMG =
    "https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630";

  const [imgSrc, setImgSrc] = useState(DEFAULT_IMG);
  const [urlInput, setUrlInput] = useState(DEFAULT_IMG);
  const [hoverColor, setHoverColor] = useState(null);
  const [hoverColorRGB, setHoverColorRGB] = useState(null);
  const [hoverColorHSL, setHoverColorHSL] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [palette, setPalette] = useState([]);
  const [hasMounted, setHasMounted] = useState(false);
  const [isColorLocked, setIsColorLocked] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [copiedLabel, setCopiedLabel] = useState(null);
  const [toast, setToast] = useState(null);
  const [hoverColorExtra, setHoverColorExtra] = useState({
    rgba: null, cmyk: null, lab: null, name: null,
    contrastOnWhite: null, contrastOnBlack: null,
  });

  useEffect(() => { setHasMounted(true); }, []);

  // ── Pixel extraction on hover ────────────────────────────────────────────
  useEffect(() => {
    if (!canvasRef.current || !imgRef.current) return;
    const previewCanvas = document.getElementById("preview-canvas");
    if (!previewCanvas) return;

    const ctxSrc = canvasRef.current.getContext("2d");
    const ctxPrev = previewCanvas.getContext("2d");

    const sampleSize = 4;
    const { x, y } = hoverPosition;
    const startX = Math.max(0, x - sampleSize);
    const startY = Math.max(0, y - sampleSize);
    const regionSize = sampleSize * 2 + 1;

    let imageData;
    try {
      imageData = ctxSrc.getImageData(startX, startY, regionSize, regionSize);
    } catch (err) {
      console.error("Cross-origin restriction:", err);
      return;
    }

    // Draw zoom preview
    const zoomFactor = 12;
    const scaledW = imageData.width * zoomFactor;
    const scaledH = imageData.height * zoomFactor;
    previewCanvas.width = scaledW;
    previewCanvas.height = scaledH;

    const tmp = document.createElement("canvas");
    tmp.width = imageData.width;
    tmp.height = imageData.height;
    tmp.getContext("2d").putImageData(imageData, 0, 0);

    ctxPrev.imageSmoothingEnabled = false;
    ctxPrev.clearRect(0, 0, scaledW, scaledH);
    ctxPrev.drawImage(tmp, 0, 0, scaledW, scaledH);

    // Grid lines
    ctxPrev.strokeStyle = "rgba(0,0,0,0.12)";
    ctxPrev.lineWidth = 0.5;
    for (let i = 0; i <= imageData.width; i++) {
      ctxPrev.beginPath(); ctxPrev.moveTo(i * zoomFactor, 0); ctxPrev.lineTo(i * zoomFactor, scaledH); ctxPrev.stroke();
    }
    for (let j = 0; j <= imageData.height; j++) {
      ctxPrev.beginPath(); ctxPrev.moveTo(0, j * zoomFactor); ctxPrev.lineTo(scaledW, j * zoomFactor); ctxPrev.stroke();
    }

    // Center crosshair
    const cx = Math.floor(imageData.width / 2);
    const cy = Math.floor(imageData.height / 2);
    ctxPrev.strokeStyle = "#ef4444";
    ctxPrev.lineWidth = 1.5;
    ctxPrev.strokeRect(cx * zoomFactor + 1, cy * zoomFactor + 1, zoomFactor - 2, zoomFactor - 2);

    // Extract pixel color
    const idx = (cy * imageData.width + cx) * 4;
    const r = imageData.data[idx];
    const g = imageData.data[idx + 1];
    const b = imageData.data[idx + 2];

    setHoverColor(rgbToHex(r, g, b));
    setHoverColorRGB(`rgb(${r}, ${g}, ${b})`);
    setHoverColorHSL(rgbToHsl(r, g, b));

    const contrast = getContrastRatio(r, g, b);
    setHoverColorExtra({
      rgba: `rgba(${r}, ${g}, ${b}, 1)`,
      cmyk: rgbToCmyk(r, g, b),
      lab: rgbToLab(r, g, b),
      name: getColorName(r, g, b),
      contrastOnWhite: contrast.onWhite,
      contrastOnBlack: contrast.onBlack,
    });
  }, [hoverPosition, imgSrc]);

  // ── Dropzone ─────────────────────────────────────────────────────────────
  const onDrop = useCallback((acceptedFiles) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImgSrc(reader.result);
      setUrlInput("");
    };
    reader.readAsDataURL(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  // ── Draw image to canvas ─────────────────────────────────────────────────
  const drawImage = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    const maxW = 800, maxH = 600;
    let w = img.naturalWidth, h = img.naturalHeight;
    const ratio = w / h;
    if (w > maxW) { w = maxW; h = maxW / ratio; }
    if (h > maxH) { h = maxH; w = maxH * ratio; }
    canvas.width = w;
    canvas.height = h;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);

    try {
      const thief = new ColorThief();
      if (img.complete && img.naturalHeight !== 0) {
        setPalette(thief.getPalette(img, 6));
      }
    } catch (err) {
      console.warn("Palette extraction failed:", err);
    }
  };

  // ── Mouse handlers ───────────────────────────────────────────────────────
  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.floor((e.clientX - rect.left) * (canvas.width / rect.width)),
      y: Math.floor((e.clientY - rect.top) * (canvas.height / rect.height)),
    };
  };

  const handleMouseMove = (e) => {
    if (isColorLocked) return;
    setHoverPosition(getMousePos(e));
  };

  const handleClick = (e) => {
    if (isColorLocked) {
      setIsColorLocked(false);
    } else {
      setHoverPosition(getMousePos(e));
      setIsColorLocked(true);
    }
  };

  // ── Copy with feedback ───────────────────────────────────────────────────
  const handleCopy = (value, label) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    triggerToast(`${label} copied!`);
    setTimeout(() => setCopiedLabel(null), 2000);
  };

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // ── Export CSS ───────────────────────────────────────────────────────────
  const exportPaletteAsCSS = () => {
    if (!palette.length) return;
    const lines = palette.map((c, i) => `  --color-${i + 1}: ${rgbToHex(c[0], c[1], c[2])};`).join("\n");
    const blob = new Blob([`:root {\n${lines}\n}\n`], { type: "text/css" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "palette.css";
    a.click();
    triggerToast("Exported as CSS!");
  };

  // ── Export PNG ───────────────────────────────────────────────────────────
  const exportPaletteAsPNG = () => {
    if (!palette.length) return;
    const sw = 120, sh = 120;
    const c = document.createElement("canvas");
    c.width = sw * palette.length;
    c.height = sh;
    const ctx = c.getContext("2d");
    palette.forEach((col, i) => {
      const hex = rgbToHex(col[0], col[1], col[2]);
      ctx.fillStyle = hex;
      ctx.fillRect(i * sw, 0, sw, sh);
      ctx.fillStyle = getLuminance(col[0], col[1], col[2]) > 0.35 ? "#000" : "#fff";
      ctx.font = "bold 12px monospace";
      ctx.textAlign = "center";
      ctx.fillText(hex, i * sw + sw / 2, sh / 2 + 5);
    });
    const a = document.createElement("a");
    a.href = c.toDataURL("image/png");
    a.download = "image2color-palette.png";
    a.click();
    triggerToast("Exported as PNG!");
  };

  // ── Save JSON ────────────────────────────────────────────────────────────
  const downloadColorInfoAsJSON = () => {
    const data = {
      hex: hoverColor,
      rgb: hoverColorRGB,
      hsl: hoverColorHSL,
      rgba: hoverColorExtra.rgba,
      cmyk: hoverColorExtra.cmyk,
      lab: hoverColorExtra.lab,
      name: hoverColorExtra.name,
      contrast: {
        onWhite: `${hoverColorExtra.contrastOnWhite}:1`,
        onBlack: `${hoverColorExtra.contrastOnBlack}:1`,
      },
      source: "img2color.com",
      date: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "color-info.json";
    a.click();
    triggerToast("Color info saved!");
  };

  if (!hasMounted) return null;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        /* ── Layout ── */
        .i2c-tool {
          padding: 20px 0 60px;
          font-family: 'DM Sans', 'Segoe UI', Arial, sans-serif;
        }
        .tool-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 24px;
          align-items: start;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }
        @media (max-width: 1024px) {
          .tool-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .tool-grid { padding: 0 16px; }
        }

        /* ── Dropzone ── */
        .i2c-dropzone {
          border: 2px dashed var(--dz-border, #d1d5db);
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          background: var(--dz-bg, #fff);
          margin-bottom: 14px;
          font-size: 0.9rem;
          color: var(--dz-text, #6b7280);
        }
        .i2c-dropzone:hover, .i2c-dropzone.drag-active {
          border-color: #6366f1;
          background: var(--dz-hover, #f5f3ff);
          color: #6366f1;
        }

        /* ── Canvas wrapper ── */
        .canvas-wrap {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          border: 1.5px solid var(--canvas-border, #e5e7eb);
          background: #000;
          line-height: 0;
        }
        .canvas-wrap canvas {
          width: 100%;
          height: auto;
          display: block;
        }
        .lock-badge {
          position: absolute;
          top: 10px; left: 10px;
          background: rgba(239,68,68,0.88);
          color: #fff;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 4px 9px;
          border-radius: 6px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          backdrop-filter: blur(4px);
        }

        /* ── URL box ── */
        .url-box {
          margin-top: 14px;
          border: 1.5px solid var(--url-border, #e5e7eb);
          border-radius: 10px;
          padding: 14px 16px;
          background: var(--url-bg, #fff);
        }
        .url-box label {
          display: block;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--url-label, #888);
          margin-bottom: 7px;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }
        .url-input {
          width: 100%;
          border: 1.5px solid var(--url-border, #e5e7eb);
          border-radius: 7px;
          padding: 9px 12px;
          font-size: 0.82rem;
          color: var(--foreground, #111);
          background: var(--url-input-bg, #fafafa);
          outline: none;
          font-family: 'DM Mono', monospace;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }
        .url-input:focus { border-color: #6366f1; }
        .url-hint { margin-top: 6px; font-size: 0.74rem; color: #aaa; }

        /* ── Right panel ── */
        .right-panel {
          position: sticky;
          top: 80px;
          max-height: calc(100vh - 100px);
          overflow-y: auto;
          scrollbar-width: thin;
        }
        @media (max-width: 1024px) {
          .right-panel {
            position: static;
            max-height: none;
          }
        }

        /* ── Card ── */
        .i2c-card {
          border: 1.5px solid var(--card-border, #e5e7eb);
          border-radius: 14px;
          padding: 18px;
          background: var(--card-bg, #fff);
          margin-bottom: 18px;
        }
        .card-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }
        .card-label {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          color: #aaa;
          margin: 0;
        }

        /* ── Lock button ── */
        .lock-btn {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.76rem; font-weight: 600;
          padding: 5px 11px;
          border-radius: 7px;
          border: 1.5px solid var(--card-border, #e5e7eb);
          background: transparent;
          cursor: pointer;
          color: var(--foreground, #111);
          transition: border-color 0.15s, color 0.15s;
          font-family: inherit;
        }
        .lock-btn.active { border-color: #ef4444; color: #ef4444; }
        .lock-btn:hover:not(.active) { border-color: #6366f1; color: #6366f1; }

        /* ── Color display top ── */
        .color-top {
          display: flex;
          gap: 12px;
          margin-bottom: 14px;
          align-items: flex-start;
        }
        .preview-canvas-wrap {
          border: 1.5px solid var(--card-border, #e5e7eb);
          border-radius: 9px;
          overflow: hidden;
          flex-shrink: 0;
          line-height: 0;
        }
        .color-right { flex: 1; min-width: 0; }
        .color-name-pill {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 20px;
          margin-bottom: 7px;
          transition: background 0.15s;
        }
        .color-swatch {
          border-radius: 9px;
          border: 1.5px solid var(--card-border, #e5e7eb);
          height: 52px;
          transition: background 0.15s;
        }

        /* ── Color rows ── */
        .color-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 0;
          border-bottom: 1px solid var(--card-border, #f0f0f0);
        }
        .color-row:last-of-type { border-bottom: none; }
        .color-lbl {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #bbb;
          min-width: 48px;
          flex-shrink: 0;
        }
        .color-val {
          font-size: 0.8rem;
          font-family: 'DM Mono', 'Fira Code', monospace;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: var(--foreground, #111);
        }
        .copy-btn {
          width: 28px; height: 28px;
          border-radius: 7px;
          border: 1.5px solid var(--card-border, #e5e7eb);
          background: transparent;
          color: #bbb;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.72rem;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .copy-btn:hover { border-color: #6366f1; color: #6366f1; }
        .copy-btn.copied { border-color: #16a34a; color: #16a34a; }

        /* ── Show more ── */
        .show-more-btn {
          background: none; border: none;
          font-size: 0.78rem; font-weight: 600;
          color: #6366f1;
          cursor: pointer;
          padding: 8px 0 2px;
          display: flex; align-items: center; gap: 5px;
          font-family: inherit;
        }

        /* ── WCAG contrast ── */
        .contrast-row { display: flex; gap: 8px; margin-top: 12px; }
        .contrast-chip {
          flex: 1;
          border-radius: 9px;
          padding: 10px;
          border: 1.5px solid var(--card-border, #e5e7eb);
          text-align: center;
        }
        .contrast-ratio { font-size: 0.95rem; font-weight: 700; font-family: monospace; }
        .contrast-against { font-size: 0.68rem; color: #888; margin: 2px 0; }
        .wcag-pill {
          display: inline-block;
          font-size: 0.62rem; font-weight: 700;
          padding: 2px 6px; border-radius: 4px;
          color: #fff; text-transform: uppercase;
        }

        /* ── Save JSON btn ── */
        .save-json-btn {
          display: flex; align-items: center; justify-content: center; gap: 7px;
          width: 100%; margin-top: 12px;
          padding: 8px;
          border: 1.5px solid var(--card-border, #e5e7eb);
          border-radius: 9px;
          background: transparent;
          font-size: 0.8rem; font-weight: 600;
          cursor: pointer;
          color: var(--foreground, #111);
          transition: border-color 0.15s, color 0.15s;
          font-family: inherit;
        }
        .save-json-btn:hover { border-color: #6366f1; color: #6366f1; }

        /* ── Palette ── */
        .palette-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 7px;
          margin-bottom: 12px;
        }
        .palette-swatch {
          aspect-ratio: 1;
          border-radius: 9px;
          border: 1.5px solid var(--card-border, #e5e7eb);
          cursor: pointer;
          position: relative;
          overflow: visible;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .palette-swatch:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 14px rgba(0,0,0,0.18);
          z-index: 2;
        }
        .swatch-tip {
          position: absolute;
          bottom: calc(100% + 6px);
          left: 50%;
          transform: translateX(-50%);
          background: #111;
          color: #fff;
          font-size: 0.65rem;
          font-family: monospace;
          padding: 3px 6px;
          border-radius: 4px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s;
          z-index: 10;
        }
        .palette-swatch:hover .swatch-tip { opacity: 1; }

        /* ── Export buttons ── */
        .export-row {
          display: flex; gap: 8px;
        }
        .export-btn {
          flex: 1;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 8px 10px;
          border: 1.5px solid var(--card-border, #e5e7eb);
          border-radius: 8px;
          background: transparent;
          font-size: 0.78rem; font-weight: 600;
          cursor: pointer;
          color: var(--foreground, #111);
          transition: border-color 0.15s, color 0.15s;
          font-family: inherit;
          white-space: nowrap;
        }
        .export-btn:hover { border-color: #6366f1; color: #6366f1; }

        /* ── Toast ── */
        .i2c-toast {
          position: fixed;
          bottom: 28px; left: 50%;
          transform: translateX(-50%);
          background: #111;
          color: #fff;
          padding: 9px 20px;
          border-radius: 9px;
          font-size: 0.82rem;
          font-weight: 600;
          z-index: 9999;
          pointer-events: none;
          box-shadow: 0 4px 20px rgba(0,0,0,0.22);
          animation: toastIn 0.22s ease;
          white-space: nowrap;
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        [data-theme="dark"] .i2c-toast {
          background: #1e1e2e;
          border: 1px solid #2a2a3a;
        }
      `}</style>

      <div className="i2c-tool">
        <div className="tool-grid">

          {/* ── LEFT COLUMN ─────────────────────────── */}
          <div>
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`i2c-dropzone${isDragActive ? " drag-active" : ""}`}
            >
              <input {...getInputProps()} />
              <i className="fa-solid fa-arrow-up-from-bracket" style={{ marginRight: 8, color: "#6366f1" }}></i>
              {isDragActive
                ? "Drop the image here…"
                : "Drag & drop an image, or click to upload"}
            </div>

            {/* Hidden img for ColorThief */}
            <img
              ref={imgRef}
              src={imgSrc}
              alt="Source"
              crossOrigin="anonymous"
              onLoad={drawImage}
              style={{ display: "none" }}
            />

            {/* Main canvas */}
            <div className="canvas-wrap">
              <canvas
                ref={canvasRef}
                onMouseMove={handleMouseMove}
                onClick={handleClick}
                style={{ cursor: isColorLocked ? "default" : "crosshair" }}
              />
              {isColorLocked && (
                <div className="lock-badge">
                  <i className="fa-solid fa-lock" style={{ marginRight: 4 }}></i>Locked
                </div>
              )}
            </div>

            {/* URL input */}
            <div className="url-box">
              <label htmlFor="urlInput">Paste Image URL</label>
              <input
                id="urlInput"
                type="text"
                className="url-input"
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setImgSrc(urlInput);
                }}
              />
              <p className="url-hint">Press Enter to load</p>
            </div>
          </div>

          {/* ── RIGHT COLUMN ────────────────────────── */}
          <div className="right-panel" ref={rightPanelRef}>

            {/* ── Hover Color Card ── */}
            <div className="i2c-card">
              <div className="card-head">
                <p className="card-label">Hover Color</p>
                <button
                  className={`lock-btn${isColorLocked ? " active" : ""}`}
                  onClick={() => setIsColorLocked((v) => !v)}
                >
                  <i className={`fa-solid fa-${isColorLocked ? "lock-open" : "lock"}`}></i>
                  {isColorLocked ? "Unlock" : "Lock"}
                </button>
              </div>

              {/* Swatch + zoom preview */}
              <div className="color-top">
                <div className="preview-canvas-wrap">
                  <canvas
                    id="preview-canvas"
                    width={9 * 12}
                    height={9 * 12}
                    style={{ imageRendering: "pixelated", display: "block" }}
                  />
                </div>
                <div className="color-right">
                  {hoverColorExtra.name && (
                    <div
                      className="color-name-pill"
                      style={{
                        backgroundColor: hoverColor || "#f3f4f6",
                        color: hoverColor
                          ? (getLuminance(
                              parseInt(hoverColor.slice(1, 3), 16),
                              parseInt(hoverColor.slice(3, 5), 16),
                              parseInt(hoverColor.slice(5, 7), 16)
                            ) > 0.35 ? "#000" : "#fff")
                          : "#374151",
                      }}
                    >
                      {hoverColorExtra.name}
                    </div>
                  )}
                  <div
                    className="color-swatch"
                    style={{ backgroundColor: hoverColor || "var(--card-border, #e5e7eb)" }}
                  />
                </div>
              </div>

              {/* Color value rows */}
              {[
                { label: "HEX", value: hoverColor },
                { label: "RGB", value: hoverColorRGB },
                { label: "HSL", value: hoverColorHSL },
                ...(showMore
                  ? [
                      { label: "RGBA", value: hoverColorExtra.rgba },
                      { label: "CMYK", value: hoverColorExtra.cmyk },
                      { label: "Lab",  value: hoverColorExtra.lab },
                    ]
                  : []),
              ].map((item) => (
                <div key={item.label} className="color-row">
                  <span className="color-lbl">{item.label}</span>
                  <span className="color-val">{item.value || "—"}</span>
                  <button
                    className={`copy-btn${copiedLabel === item.label ? " copied" : ""}`}
                    onClick={() => handleCopy(item.value, item.label)}
                    title={`Copy ${item.label}`}
                  >
                    <i className={`fa-${copiedLabel === item.label ? "solid fa-check" : "regular fa-copy"}`}></i>
                  </button>
                </div>
              ))}

              <button className="show-more-btn" onClick={() => setShowMore((v) => !v)}>
                <i className={`fa-solid fa-chevron-${showMore ? "up" : "down"}`}></i>
                {showMore ? "Show Less" : "Show More"}
              </button>

              {/* WCAG Contrast */}
              {hoverColorExtra.contrastOnWhite && (
                <div className="contrast-row">
                  {[
                    { bg: "#fff", textColor: "#111", label: "On White", ratio: hoverColorExtra.contrastOnWhite },
                    { bg: "#111", textColor: "#fff", label: "On Black", ratio: hoverColorExtra.contrastOnBlack },
                  ].map(({ bg, textColor, label, ratio }) => {
                    const grade = wcagGrade(ratio);
                    return (
                      <div key={label} className="contrast-chip" style={{ backgroundColor: bg }}>
                        <div className="contrast-ratio" style={{ color: textColor }}>{ratio}:1</div>
                        <div className="contrast-against">{label}</div>
                        <div className="wcag-pill" style={{ backgroundColor: grade.color }}>{grade.label}</div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Save JSON */}
              {isColorLocked && hoverColor && (
                <button className="save-json-btn" onClick={downloadColorInfoAsJSON}>
                  <i className="fa-solid fa-floppy-disk"></i> Save Color Info (JSON)
                </button>
              )}
            </div>

            {/* ── Palette Card ── */}
            <div className="i2c-card">
              <div className="card-head">
                <p className="card-label">Image Palette</p>
              </div>
              <div className="palette-grid">
                {palette.map((color, i) => {
                  const hex = rgbToHex(color[0], color[1], color[2]);
                  return (
                    <div
                      key={i}
                      className="palette-swatch"
                      style={{ backgroundColor: hex }}
                      onClick={() => handleCopy(hex, `Palette ${i + 1}`)}
                      title={`Copy ${hex}`}
                    >
                      <div className="swatch-tip">{hex}</div>
                    </div>
                  );
                })}
              </div>
              <div className="export-row">
                <button className="export-btn" onClick={exportPaletteAsCSS}>
                  <i className="fa-solid fa-code"></i> Export CSS
                </button>
                <button className="export-btn" onClick={exportPaletteAsPNG}>
                  <i className="fa-solid fa-image"></i> Export PNG
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Toast notification */}
      {toast && <div className="i2c-toast">{toast}</div>}
    </>
  );
}