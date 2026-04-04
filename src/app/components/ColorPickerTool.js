"use client";

import { useRef, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
// NOTE: ColorThief import relies on it being installed and available, e.g., via a dynamic import or setup
import ColorThief from "colorthief"; 

export default function ColorPickerTool() {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const rightPanelRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(
    "https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630"
  );
  const [hoverColor, setHoverColor] = useState(null);
  const [hoverColorRGB, setHoverColorRGB] = useState(null);
  const [hoverColorHSL, setHoverColorHSL] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [palette, setPalette] = useState([]);
  const [hasMounted, setHasMounted] = useState(false);
  const [isColorLocked, setIsColorLocked] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [hoverColorExtra, setHoverColorExtra] = useState({
    rgba: null,
    cmyk: null,
    lab: null,
    pantone: null,
    name: null,
  });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !imgRef.current) return;

    const sourceCanvas = canvasRef.current;
    const previewCanvas = document.getElementById("preview-canvas");
    if (!previewCanvas) return;

    const ctxSrc = sourceCanvas.getContext("2d");
    const ctxPrev = previewCanvas.getContext("2d");

    const sampleSize = 4;
    const { x, y } = hoverPosition;

    const startX = Math.max(0, x - sampleSize);
    const startY = Math.max(0, y - sampleSize);
    const regionSize = sampleSize * 2 + 1;

    // Use try/catch for getImageData as cross-origin images might block it
    let imageData;
    try {
        imageData = ctxSrc.getImageData(startX, startY, regionSize, regionSize);
    } catch (error) {
        console.error("Could not get image data due to cross-origin restriction or canvas size.", error);
        return;
    }


    const zoomFactor = 12;
    const scaledWidth = imageData.width * zoomFactor;
    const scaledHeight = imageData.height * zoomFactor;

    previewCanvas.width = scaledWidth;
    previewCanvas.height = scaledHeight;

    const tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = imageData.width;
    tmpCanvas.height = imageData.height;
    tmpCanvas.getContext("2d").putImageData(imageData, 0, 0);

    ctxPrev.imageSmoothingEnabled = false;
    ctxPrev.clearRect(0, 0, scaledWidth, scaledHeight);
    ctxPrev.drawImage(tmpCanvas, 0, 0, scaledWidth, scaledHeight);

    ctxPrev.strokeStyle = "rgba(0, 0, 0, 0.2)";
    for (let i = 0; i <= imageData.width; i++) {
      ctxPrev.beginPath();
      ctxPrev.moveTo(i * zoomFactor, 0);
      ctxPrev.lineTo(i * zoomFactor, scaledHeight);
      ctxPrev.stroke();
    }
    for (let j = 0; j <= imageData.height; j++) {
      ctxPrev.beginPath();
      ctxPrev.moveTo(0, j * zoomFactor);
      ctxPrev.lineTo(scaledWidth, j * zoomFactor);
      ctxPrev.stroke();
    }

    const centerX = Math.floor(imageData.width / 2);
    const centerY = Math.floor(imageData.height / 2);
    ctxPrev.strokeStyle = "red";
    ctxPrev.lineWidth = 1;
    ctxPrev.strokeRect(
      centerX * zoomFactor + 0.5,
      centerY * zoomFactor + 0.5,
      zoomFactor - 1,
      zoomFactor - 1
    );

    const centerPixelIndex = (centerY * imageData.width + centerX) * 4;
    const r = imageData.data[centerPixelIndex];
    const g = imageData.data[centerPixelIndex + 1];
    const b = imageData.data[centerPixelIndex + 2];

    const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    const rgb = `rgb(${r}, ${g}, ${b})`;
    const hsl = rgbToHsl(r, g, b);

    setHoverColor(hex);
    setHoverColorRGB(rgb);
    setHoverColorHSL(hsl);

    const rgba = `rgba(${r}, ${g}, ${b}, 1)`;
    const cmyk = rgbToCmyk(r, g, b);
    const lab = rgbToLab(r, g, b);
    const name = getClosestColorName(r, g, b);
    const pantone = getApproxPantone(r, g, b);

    setHoverColorExtra({ rgba, cmyk, lab, pantone, name });
  }, [hoverPosition, imgSrc]); // Added imgSrc as a dependency to re-run on image change

  const onDrop = (acceptedFiles) => {
    const reader = new FileReader();
    reader.onload = () => setImgSrc(reader.result);
    reader.readAsDataURL(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  const drawImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imgRef.current;

    const maxWidth = 600;
    const maxHeight = 600;

    let drawWidth = img.naturalWidth;
    let drawHeight = img.naturalHeight;
    const aspectRatio = drawWidth / drawHeight;

    if (drawWidth > maxWidth || drawHeight > maxHeight) {
      if (aspectRatio > 1) {
        drawWidth = maxWidth;
        drawHeight = maxWidth / aspectRatio;
      } else {
        drawHeight = maxHeight;
        drawWidth = maxHeight * aspectRatio;
      }
    }

    canvas.width = drawWidth;
    canvas.height = drawHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, drawWidth, drawHeight);

    try {
      const thief = new ColorThief();
      // Ensure the image element is correctly loaded and accessible for ColorThief
      if (img.complete && img.naturalHeight !== 0) {
        const palette = thief.getPalette(img, 6);
        setPalette(palette);
      }
    } catch (err) {
      console.warn("Color palette extraction failed.", err);
    }
  };

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    return { x: Math.floor(x), y: Math.floor(y) };
  };

  const handleMouseMove = (e) => {
    if (isColorLocked) return;
    const { x, y } = getMousePos(e);
    setHoverPosition({ x, y });
  };

  const handleClick = (e) => {
    if (isColorLocked) {
      setIsColorLocked(false);
    } else {
      const { x, y } = getMousePos(e);
      setHoverPosition({ x, y });
      setIsColorLocked(true);
    }
  };

  // --- Utility Color Conversion Functions (No Change) ---

  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l;
    l = (max + min) / 2;
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
    let c = 1 - r / 255;
    let m = 1 - g / 255;
    let y = 1 - b / 255;
    let k = Math.min(c, m, y);
    c = ((c - k) / (1 - k)) * 100;
    m = ((m - k) / (1 - k)) * 100;
    y = ((y - k) / (1 - k)) * 100;
    k = k * 100;
    return `cmyk(${c.toFixed(0)}%, ${m.toFixed(0)}%, ${y.toFixed(0)}%, ${k.toFixed(0)}%)`;
  };

  const rgbToLab = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    [r, g, b] = [r, g, b].map((c) => c > 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92);
    const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    const y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
    const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
    const xyz = [x, y, z].map((v) => v > 0.008856 ? Math.cbrt(v) : 7.787 * v + 16 / 116);
    const [fx, fy, fz] = xyz;
    const L = 116 * fy - 16;
    const a = 500 * (fx - fy);
    const bVal = 200 * (fy - fz);
    return `Lab(${L.toFixed(1)}, ${a.toFixed(1)}, ${bVal.toFixed(1)})`;
  };

  const getClosestColorName = (r, g, b) => {
    const colors = {
      Red: [255, 0, 0], Green: [0, 128, 0], Blue: [0, 0, 255], Black: [0, 0, 0],
      White: [255, 255, 255], Gray: [128, 128, 128], Yellow: [255, 255, 0],
      Cyan: [0, 255, 255], Magenta: [255, 0, 255], Orange: [255, 165, 0],
      Purple: [128, 0, 128], Pink: [255, 192, 203], Brown: [165, 42, 42],
    };
    let closest = null, minDist = Infinity;
    for (const [name, [cr, cg, cb]] of Object.entries(colors)) {
      const dist = Math.sqrt((r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2);
      if (dist < minDist) { minDist = dist; closest = name; }
    }
    return closest;
  };

  const getApproxPantone = (r, g, b) => `PANTONE ${100 + ((r + g + b) % 900)}`;

  const downloadColorInfoAsJSON = () => {
    const now = new Date();
    const data = {
      id: `palette-${now.getTime()}`,
      imageName: imgSrc.split("/").pop().split("?")[0] || "unknown.jpg",
      colors: [
        { label: "HEX", value: hoverColor },
        { label: "RGB", value: hoverColorRGB },
        { label: "HSL", value: hoverColorHSL },
        { label: "RGBA", value: hoverColorExtra.rgba },
        { label: "CMYK", value: hoverColorExtra.cmyk },
        { label: "Lab", value: hoverColorExtra.lab },
        { label: "Pantone", value: hoverColorExtra.pantone },
        { label: "Name", value: hoverColorExtra.name },
      ],
      format: "multi",
      dateCreated: now.toISOString(),
      source: "image2color.com",
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "image2color-color-info.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  // --- Render ---

  if (!hasMounted) return null;

  return (
    // Removed unnecessary top padding here, as it's handled in layout.js, and removed minHeight
    <div style={{ paddingBottom: "20px" }}> 
      <div className="container-fluid px-4">
        <div className="row g-4">
          <div className="col-lg-7 col-md-12">
            <div {...getRootProps()} className="border p-4 mb-3 text-center bg-light rounded" style={{ cursor: "pointer" }}>
              <input {...getInputProps()} />
              <p className="mb-0">🎯 Drag & drop an image or click to upload</p>
            </div>
            <img 
              ref={imgRef} 
              src={imgSrc} 
              alt="Uploaded" 
              style={{ display: "none" }} 
              crossOrigin="anonymous" // Essential for loading cross-origin images to canvas
              onLoad={drawImage} 
            />
            <canvas
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onClick={handleClick}
              style={{
                width: "100%",
                maxWidth: "100%",
                height: "auto",
                cursor: isColorLocked ? "default" : "crosshair",
                border: isColorLocked ? "2px solid red" : "1px solid #ddd",
                borderRadius: "4px",
                display: "block",
              }}
            />
            <div className="mt-3 p-3 border rounded">
              <label htmlFor="urlInput" className="form-label mb-2">Paste Image URL:</label>
              <input
                id="urlInput"
                type="text"
                className="form-control"
                placeholder="https://example.com/image.jpg"
                value={imgSrc}
                onChange={(e) => setImgSrc(e.target.value)}
              />
            </div>
          </div>

          <div className="col-lg-5 col-md-12">
            {/* FIX: Adjusted sticky style. Top: 75px clears the Navbar. Removed hardcoded maxHeight */}
            {/* <div 
  ref={rightPanelRef} 
  style={{ 
    position: "sticky",
    top: "90px",
    overflow: "visible",
    paddingBottom: "20px"
  }}
> */}
<div ref={rightPanelRef}
    style={{
      marginBottom:"80px",
      position: "fixed",   // fixed instead of sticky
      top: "110px",         // navbar height
    // right: "15px",       // spacing from the right edge (adjust if needed)
      width: "30%",        // adjust to fit your layout (or use col widths)
      maxHeight: "calc(100vh - 90px)", // fill remaining viewport height
      overflowY: "auto",   // scroll inside panel if content exceeds viewport
      paddingBottom: "20px",
      zIndex: 1000,        // ensure it's above other content
    }}
  >

              <h6 className="mb-3">Preview Area</h6>
{/* /              <canvas id="preview-canvas" width={9 * 12} height={9 * 12} style={{ border: "1px solid #000", marginBottom: "20px", imageRendering: "pixelated", display: "block" }} /> */}

              <div className="card p-3 mb-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="m-0">Hover Color:</h6>
                  {isColorLocked && (
                    <button className="btn btn-sm btn-outline-dark" onClick={downloadColorInfoAsJSON} title="Download color info">
                      <i className="fa-solid fa-floppy-disk"></i>
                    </button>
                  )}
                </div>
                <div className="d-flex align-items-start gap-3">
                  {/* <div style={{ backgroundColor: hoverColor || "#000", width: 80, minHeight: showMore ? 200 : 100, borderRadius: 8, border: "1px solid #ccc", flexShrink: 0 }}></div> */}
                                <canvas id="preview-canvas" width={9 * 12} height={9 * 12} style={{ border: "1px solid #000", marginBottom: "20px", imageRendering: "pixelated", display: "block" }} />

                  <div className="flex-grow-1">
                    {[
                      { label: "HEX", value: hoverColor },
                      { label: "RGB", value: hoverColorRGB },
                      { label: "HSL", value: hoverColorHSL },
                      ...(showMore ? [
                        { label: "RGBA", value: hoverColorExtra.rgba },
                        { label: "CMYK", value: hoverColorExtra.cmyk },
                        { label: "Lab", value: hoverColorExtra.lab },
                        { label: "Pantone", value: hoverColorExtra.pantone },
                        { label: "Name", value: hoverColorExtra.name },
                      ] : []),
                    ].map((item) => (
                      <div key={item.label} className="d-flex align-items-center justify-content-between mb-2">
                        <strong style={{ minWidth: "70px", fontSize: "0.9em" }}>{item.label}:</strong>
                        <span className="flex-grow-1 mx-2" style={{ fontSize: "0.85em" }}>{item.value}</span>
                        <button className="btn btn-sm btn-light p-1" onClick={() => navigator.clipboard.writeText(item.value)} title={`Copy ${item.label}`} style={{ width: "30px", height: "30px" }}>
                          <i className="fa-regular fa-copy"></i>
                        </button>
                      </div>
                    ))}
                    <button className="btn btn-link btn-sm p-0 mt-2" onClick={() => setShowMore(!showMore)}>
                      {showMore ? "Show Less ▲" : "Show More ▼"}
                    </button>
                  </div>
                </div>
              </div>

              <h6 className="mb-3">Image Palette</h6>
              <div className="d-flex gap-2 flex-wrap">
                {palette.map((color, i) => {
                  const hex = `#${color[0].toString(16).padStart(2, "0")}${color[1].toString(16).padStart(2, "0")}${color[2].toString(16).padStart(2, "0")}`;
                  return <div key={i} style={{ backgroundColor: hex, width: 50, height: 50, borderRadius: 4, border: "1px solid #ddd" }} title={hex}></div>;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}