import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

export default function Level3() {
  const [humidity, setHumidity] = useState(65);
  const [crackRisk, setCrackRisk] = useState(25);
  const [timeLeft, setTimeLeft] = useState(90);
  const [running, setRunning] = useState(false);
  const [selectedWeather, setSelectedWeather] = useState<
    "sun" | "cloud" | "rain"
  >("sun");
  const navigate = useNavigate();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // draw pot on canvas (responsive)
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d")!;
    // create small noise texture for surface detail (cached)
    let noiseCanvas: HTMLCanvasElement | null = null;
    const makeNoise = (size = 128) => {
      if (noiseCanvas) return noiseCanvas;
      noiseCanvas = document.createElement("canvas");
      noiseCanvas.width = size;
      noiseCanvas.height = size;
      const nctx = noiseCanvas.getContext("2d")!;
      const id = nctx.createImageData(size, size);
      for (let i = 0; i < id.data.length; i += 4) {
        const v = 200 + Math.floor((Math.random() - 0.5) * 40); // subtle variations
        id.data[i] = v;
        id.data[i + 1] = v;
        id.data[i + 2] = v;
        id.data[i + 3] = 18; // low alpha
      }
      nctx.putImageData(id, 0, 0);
      return noiseCanvas;
    };

    let raf = 0;
    let start = performance.now();
    // load background image to composite onto canvas (cover)
    const bgImage = new Image();
    bgImage.crossOrigin = "anonymous";
    bgImage.src = encodeURI("/images_making_ceramic/nền nắng.png");
    bgImage.crossOrigin = "anonymous";
    const render = (now: number) => {
      const rect = container.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // clear
      ctx.clearRect(0, 0, w, h);

      // draw background image (cover) if loaded
      if (bgImage && bgImage.complete && bgImage.naturalWidth) {
        const iw = bgImage.naturalWidth;
        const ih = bgImage.naturalHeight;
        const scale = Math.max(w / iw, h / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        const baseDx = Math.floor((w - dw) / 2);
        const baseDy = Math.floor((h - dh) / 2);
        ctx.drawImage(bgImage, baseDx, baseDy, dw, dh);
        // subtle dim to make pot stand out
        ctx.fillStyle = "rgba(0,0,0,0.04)";
        ctx.fillRect(0, 0, w, h);
      }

      // compute pot dimensions
      // make pot smaller and more proportional for realism
      const potW = Math.min(w * 0.22, 420);
      const potH = potW * 1.05;
      // pot bobbing for life
      const potBob = Math.sin((now - start) / 1200) * (potH * 0.01)
      const px = w / 2 - potW / 2
      // nudge pot a bit upward so it sits visually higher on the ground
      const py = h * 0.40 + potBob

      // compute pot center x for aligned drawing
      const centerX = px + potW * 0.5;

      // draw realistic pot (offscreen painter handles gradient, texture, rim, and shadow)
      drawRealisticPot(ctx, centerX, py, potW, potH, dpr);

      // draw a photorealistic ceramic pot using layered gradients, noise and subtle specular
      function drawRealisticPot(
  ctx: CanvasRenderingContext2D,
  cx: number,
  topY: number,
  potW: number,
  potH: number,
  dpr: number
) {
  const left = cx - potW / 2

  ctx.save()

  /* ===== 1. SHAPE MỀM + ĐÁY PHẲNG ===== */
  const path = new Path2D()

  // bắt đầu từ miệng trái
  path.moveTo(left + potW * 0.25, topY + potH * 0.08)

  // thân trái
  path.bezierCurveTo(
    left + potW * 0.1,
    topY + potH * 0.35,
    left + potW * 0.2,
    topY + potH * 0.75,
    left + potW * 0.4,
    topY + potH * 0.92
  )

  // ===== ĐÁY PHẲNG =====
  path.lineTo(left + potW * 0.6, topY + potH * 0.92)

  // thân phải
  path.bezierCurveTo(
    left + potW * 0.8,
    topY + potH * 0.75,
    left + potW * 0.9,
    topY + potH * 0.35,
    left + potW * 0.75,
    topY + potH * 0.08
  )

  path.closePath()
  ctx.clip(path)

  /* ===== 2. MÀU GỐM ===== */
  const base = ctx.createLinearGradient(left, topY, left, topY + potH)
  base.addColorStop(0, '#f5dcc0')
  base.addColorStop(0.5, '#c9895b')
  base.addColorStop(1, '#7a4526')
  ctx.fillStyle = base
  ctx.fillRect(left, topY, potW, potH)

  /* ===== 3. SHADING NGANG ===== */
  ctx.globalCompositeOperation = 'multiply'
  const shade = ctx.createLinearGradient(left, 0, left + potW, 0)
  shade.addColorStop(0, 'rgba(0,0,0,0.35)')
  shade.addColorStop(0.5, 'rgba(0,0,0,0)')
  shade.addColorStop(1, 'rgba(0,0,0,0.45)')
  ctx.fillStyle = shade
  ctx.fillRect(left, topY, potW, potH)

  /* ===== 4. HIGHLIGHT ===== */
  ctx.globalCompositeOperation = 'lighter'
  const light = ctx.createRadialGradient(
    cx - potW * 0.25,
    topY + potH * 0.35,
    0,
    cx,
    topY + potH * 0.35,
    potW * 0.6
  )
  light.addColorStop(0, 'rgba(255,255,255,0.5)')
  light.addColorStop(1, 'transparent')
  ctx.fillStyle = light
  ctx.fillRect(left, topY, potW, potH)

  ctx.globalCompositeOperation = 'source-over'

  /* ===== 5. HOA VĂN ===== */
  ctx.strokeStyle = 'rgba(80,40,20,0.5)'
  ctx.lineWidth = potW * 0.01

  const y = topY + potH * 0.4
  ctx.beginPath()
  for (let i = 0; i <= 30; i++) {
    const x = left + (i / 30) * potW
    const wave = Math.sin(i * 0.6) * potH * 0.02
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y + wave)
  }
  ctx.stroke()

  /* ===== 6. MIỆNG BÌNH ===== */
  ctx.fillStyle = '#5b3a29'
  ctx.beginPath()
  ctx.ellipse(cx, topY + potH * 0.08, potW * 0.32, potH * 0.06, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#ead8c0'
  ctx.beginPath()
  ctx.ellipse(cx, topY + potH * 0.06, potW * 0.26, potH * 0.045, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()

  /* ===== 7. VIỀN ĐÁY (RẤT QUAN TRỌNG) ===== */
  ctx.strokeStyle = 'rgba(60,30,20,0.6)'
  ctx.lineWidth = potW * 0.012
  ctx.beginPath()
  ctx.moveTo(left + potW * 0.4, topY + potH * 0.92)
  ctx.lineTo(left + potW * 0.6, topY + potH * 0.92)
  ctx.stroke()

  /* ===== 8. BÓNG ĐỔ ===== */
  ctx.save()
  ctx.fillStyle = 'rgba(0,0,0,0.35)'
  ctx.filter = 'blur(18px)'
  ctx.beginPath()
  ctx.ellipse(cx, topY + potH * 0.97, potW * 0.38, potH * 0.09, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

      drawRealisticPot(ctx, centerX, py, potW, potH, dpr);

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    const onResize = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(render);
    };
    window.addEventListener("resize", onResize);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff7ed] via-[#fff1e6] to-[#fff3f0] p-0">
      <div
        ref={containerRef}
        className="relative w-full h-screen overflow-hidden bg-center bg-cover"
      >
        {/* canvas for pot and shadow (full-bleed background composited) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-0"
          style={{ pointerEvents: "none" }}
        />

        {/* header (enhanced typography - high contrast) */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center z-40 w-full px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-[#1f2937] drop-shadow-lg">
            LEVEL 3: PHƠI KHÔ
          </h1>
          <p className="mt-2 text-base md:text-lg text-[#2b2b2b] opacity-95 max-w-2xl mx-auto drop-shadow-sm">
            Hong khô tự nhiên. Đảm bảo sản phẩm không nứt.
          </p>
        </div>

        {/* left stat cards */}
        <div className="absolute left-8 top-28 z-40 space-y-4 w-[300px]">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">Độ ẩm</div>
                <div className="text-2xl font-semibold text-[#1e3a8a]">
                  {humidity}%
                </div>
              </div>
              <div className="w-36">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 bg-gradient-to-r from-blue-400 to-blue-600"
                    style={{ width: `${humidity}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">Nguy cơ nứt</div>
                <div className="text-2xl font-semibold text-[#c2410c]">
                  {crackRisk}%
                </div>
              </div>
              <div className="w-36">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 bg-gradient-to-r from-orange-400 to-orange-600"
                    style={{ width: `${crackRisk}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/30 flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500">Thời gian còn lại</div>
              <div className="text-2xl font-semibold text-[#5b21b6]">
                {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
                {String(timeLeft % 60).padStart(2, "0")}
              </div>
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow">
              ⏱️
            </div>
          </div>
        </div>

        {/* right weather panel */}
        <div className="absolute right-8 top-28 z-40 w-44">
          <div className="bg-black/60 text-white rounded-xl p-3 shadow-lg">
            <div className="text-sm font-semibold mb-2">THỜI TIẾT</div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setHumidity((h) => Math.max(5, h - 8));
                  setSelectedWeather("sun");
                }}
                className={`w-full text-left px-3 py-2 rounded-md ${selectedWeather === "sun" ? "bg-yellow-500/20 ring-2 ring-yellow-400" : "bg-white/6"}`}
              >
                ☀️ Nắng
              </button>
              <button
                onClick={() => {
                  setHumidity((h) => Math.max(20, h - 2));
                  setSelectedWeather("cloud");
                }}
                className={`w-full text-left px-3 py-2 rounded-md ${selectedWeather === "cloud" ? "bg-yellow-500/10 ring-2 ring-yellow-300" : "bg-white/6"}`}
              >
                ☁️ Âm u
              </button>
              <button
                onClick={() => {
                  setHumidity((h) => Math.min(100, h + 12));
                  setSelectedWeather("rain");
                }}
                className={`w-full text-left px-3 py-2 rounded-md ${selectedWeather === "rain" ? "bg-blue-600/10 ring-2 ring-blue-300" : "bg-white/6"}`}
              >
                🌧️ Mưa
              </button>
            </div>
          </div>
        </div>

        {/* bottom controls removed (retry button relocated/removed) */}

        {/* top-right controls: start/pause next to exit */}
        <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
          {!running ? (
            <button
              onClick={() => setRunning(true)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg shadow"
            >
              Bắt đầu
            </button>
          ) : (
            <button
              onClick={() => setRunning(false)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow"
            >
              Tạm dừng
            </button>
          )}

          <button
            onClick={() => navigate("/craft-selection")}
            className="px-3 py-2 bg-white rounded-lg shadow"
          >
            Thoát
          </button>
        </div>
      </div>
    </div>
  );
}
