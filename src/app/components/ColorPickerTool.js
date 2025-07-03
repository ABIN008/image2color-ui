"use client";

import { useRef, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import ColorThief from "colorthief";

export default function ColorPickerTool() {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(
    "https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630"
  );
  const [hoverColor, setHoverColor] = useState(null);
  const [hoverColorRGB, setHoverColorRGB] = useState(null);
  const [hoverColorHSL, setHoverColorHSL] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [palette, setPalette] = useState([]);
  const [hasMounted, setHasMounted] = useState(false);

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

    const sampleSize = 4; // 15x15 = 4px around center
    const { x, y } = hoverPosition;

    const startX = Math.max(0, x - sampleSize);
    const startY = Math.max(0, y - sampleSize);
    const regionSize = sampleSize * 2 + 1;

    const imageData = ctxSrc.getImageData(
      startX,
      startY,
      regionSize,
      regionSize
    );

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

    // Grid lines
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

    // Red border on center pixel
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

    // Extract color from center pixel
    const centerPixelIndex = (centerY * imageData.width + centerX) * 4;
    const r = imageData.data[centerPixelIndex];
    const g = imageData.data[centerPixelIndex + 1];
    const b = imageData.data[centerPixelIndex + 2];

    const hex = `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    const rgb = `rgb(${r}, ${g}, ${b})`;
    const hsl = rgbToHsl(r, g, b);

    setHoverColor(hex);
    setHoverColorRGB(rgb);
    setHoverColorHSL(hsl);
  }, [hoverPosition]);

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
      const palette = thief.getPalette(img, 6);
      setPalette(palette);
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
    const { x, y } = getMousePos(e);
    setHoverPosition({ x, y });
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h, s, l;
    l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(
      l * 100
    )}%)`;
  };

  if (!hasMounted) return null;

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-7">
          <div
            {...getRootProps()}
            className="border p-4 mb-3 text-center bg-light rounded"
          >
            <input {...getInputProps()} />
            <p className="mb-0">🎯 Drag & drop an image or click to upload</p>
          </div>
          <img
            ref={imgRef}
            src={imgSrc}
            alt="Uploaded"
            style={{ display: "none" }}
            crossOrigin="anonymous"
            onLoad={drawImage}
          />
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            style={{
              width: "100%",
              border: "1px solid black",
              cursor: "crosshair",
            }}
          />
        </div>

        <div className="col-md-5 sticky-col">
          <h6>Preview Area</h6>
          <canvas
            id="preview-canvas"
            width={9 * 12}
            height={9 * 12}
            style={{
              border: "1px solid #000",
              marginBottom: "10px",
              imageRendering: "pixelated",
              padding: "2px",
            }}
          />

      
          <div className="card p-2 mb-3" style={{ maxWidth: 300 }}>
            <h6>Hover Color:</h6>

            <div className="d-flex align-items-center">
              {/* Left: Color Preview */}
              <div
                style={{
                  backgroundColor: hoverColor,
                  width: 70,
                  height: 90,
                  borderRadius: 8,
                  marginRight: 15,
                  border: "1px solid #ccc",
                }}
              ></div>

              {/* Right: Color Codes */}
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong>HEX:</strong>
                  <div className="d-flex align-items-center">
                    <span className="me-1">{hoverColor}</span>
                    <i
                      className="bi bi-clipboard"
                      style={{ cursor: "pointer" }}
                    ></i>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong>RGB:</strong>
                  <div className="d-flex align-items-center">
                    <span className="me-1">{hoverColorRGB}</span>
                    <i
                      className="bi bi-clipboard"
                      style={{ cursor: "pointer" }}
                    ></i>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <strong>HSL:</strong>
                  <div className="d-flex align-items-center">
                    <span className="me-1">{hoverColorHSL}</span>
                    <i
                      className="bi bi-clipboard"
                      style={{ cursor: "pointer" }}
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h6>Image Palette</h6>
          <div className="d-flex gap-2 flex-wrap">
            {palette.map((color, i) => {
              const hex = `#${color[0].toString(16).padStart(2, "0")}${color[1]
                .toString(16)
                .padStart(2, "0")}${color[2].toString(16).padStart(2, "0")}`;
              return (
                <div
                  key={i}
                  style={{ backgroundColor: hex, width: 40, height: 40 }}
                  className="border rounded"
                ></div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
