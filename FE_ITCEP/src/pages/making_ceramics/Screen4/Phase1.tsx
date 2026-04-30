import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { levelsService } from '../../../api/levels/levelsService'
import { progressService } from '../../../api/progress/progressService'

export default function Level4() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const bgRef = useRef<HTMLImageElement | null>(null)
  const colorInputRef = useRef<HTMLInputElement | null>(null)
  const confettiRef = useRef<HTMLCanvasElement | null>(null)
  const [drawAnywhere, setDrawAnywhere] = useState(true)
  const [running, setRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(135) // 2:15 default as in mock
  const [started, setStarted] = useState(false)
  const [decorProgress, setDecorProgress] = useState(40)
  const [quality, setQuality] = useState(92)
  const [activeTool, setActiveTool] = useState<'none'|'pencil'|'brush'>('none')
  const [drawColor, setDrawColor] = useState('#ff4da6')
  const [showColorModal, setShowColorModal] = useState(false)
  const [tempColor, setTempColor] = useState<string>(drawColor)
  const [showFinishModal, setShowFinishModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [rating, setRating] = useState<number>(3)
  const isDrawingRef = useRef(false)
  const lastPointRef = useRef<{x:number,y:number}|null>(null)
  const potPathRef = useRef<Path2D | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // preload background image from public folder
    const bg = new Image()
    bg.src = '/images_making_ceramic/nền scrren4.png'
    // fallback: also try encoded URI (handles spaces/diacritics)
    bg.onerror = () => { bg.src = encodeURI('/images_making_ceramic/nền sáng tạo.png') }
    bgRef.current = bg

    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')!

    let raf = 0
    let start = performance.now()

    const render = (now: number) => {
      const rect = container.getBoundingClientRect()
      const w = Math.floor(rect.width)
      const h = Math.floor(rect.height)
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // background image (use creative background if loaded)
      const bgImg = bgRef.current
      if (bgImg && bgImg.complete) {
        try {
          ctx.drawImage(bgImg, 0, 0, w, h)
        } catch (e) {
          ctx.fillStyle = '#f6efe6'
          ctx.fillRect(0, 0, w, h)
        }
      } else {
        ctx.fillStyle = '#f6efe6'
        ctx.fillRect(0, 0, w, h)
      }

      // subtle vignette
      const grad = ctx.createRadialGradient(w/2, h/2, Math.min(w,h)*0.1, w/2, h/2, Math.max(w,h))
      grad.addColorStop(0, 'rgba(255,255,255,0)')
      grad.addColorStop(1, 'rgba(0,0,0,0.06)')
      ctx.fillStyle = grad
      ctx.fillRect(0,0,w,h)

      // draw a realistic pot in center (reuse Level3 pot renderer)
      const cx = w/2
      const cy = h*0.55
      // make pot even smaller for tighter composition
      const vw = Math.min(w*0.20, 320)
      const vh = vw * 1.05
      const potPath = drawRealisticPot(ctx, cx, cy - vh*0.45, vw, vh, dpr)
      potPathRef.current = potPath

      // small shadow (adjusted to match even smaller pot)
      ctx.save()
      ctx.globalAlpha = 0.16
      ctx.fillStyle = '#000'
      ctx.beginPath()
      ctx.ellipse(cx, cy + vh*0.45, vw*0.16, 12, 0, 0, Math.PI*2)
      ctx.fill()
      ctx.restore()

      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)
    const onResize = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(render)
    }
    window.addEventListener('resize', onResize)
    return () => { if (raf) cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(id); setRunning(false); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running])

  // small simulation: if running, slowly nudge progress (demo)
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setDecorProgress(p => Math.min(100, p + 1))
      setQuality(q => Math.min(100, q + 0.2))
    }, 2000)
    return () => clearInterval(id)
  }, [running])

  useEffect(() => {
    if (!showColorModal) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowColorModal(false)
      if (e.key === 'Enter') { setDrawColor(tempColor); setShowColorModal(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showColorModal, tempColor])

  // Confetti animation when finish modal opens
  useEffect(() => {
    if (!showFinishModal) {
      const c = confettiRef.current
      if (c) {
        const ctx = c.getContext('2d')
        ctx?.clearRect(0, 0, c.width, c.height)
      }
      return
    }
    const canvas = confettiRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')!
    let dpr = window.devicePixelRatio || 1
    const resize = () => {
      const r = container.getBoundingClientRect()
      canvas.width = Math.floor(r.width * dpr)
      canvas.height = Math.floor(r.height * dpr)
      canvas.style.width = `${r.width}px`
      canvas.style.height = `${r.height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    type P = { x: number; y: number; vx: number; vy: number; w: number; h: number; rot: number; vr: number; color: string; life: number }
    const colors = ['#FF7A00','#FFD166','#06D6A0','#4CC9F0','#9B5CFF','#FF4DA6']
    const particles: P[] = []
    const cx = canvas.width / dpr / 2
    const cy = canvas.height / dpr / 3
    const count = 120
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2) * (i / count) + (Math.random() - 0.5) * 0.6
      const speed = 2 + Math.random() * 6
      particles.push({
        x: cx + Math.cos(angle) * 8,
        y: cy + Math.sin(angle) * 8,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
        vy: Math.sin(angle) * speed - (2 + Math.random() * 2),
        w: 6 + Math.random() * 10,
        h: 6 + Math.random() * 10,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 100 + Math.random() * 60,
      })
    }

    let raf = 0
    const gravity = 0.12
    const friction = 0.995
    const startTime = performance.now()
    const duration = 2600

    function render(now: number) {
      const t = now - startTime
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let p of particles) {
        if (p.life <= 0) continue
        p.vy += gravity
        p.vx *= friction
        p.vy *= friction
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vr
        p.life -= 1

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      }

      // add some sparkles
      if (Math.random() < 0.08) {
        const s = 4 + Math.random() * 6
        const x = Math.random() * canvas.width / dpr
        const y = Math.random() * canvas.height / dpr * 0.5
        ctx.fillStyle = 'rgba(255,255,255,0.9)'
        ctx.beginPath()
        ctx.arc(x, y, s, 0, Math.PI * 2)
        ctx.fill()
      }

      if (t < duration) raf = requestAnimationFrame(render)
      else {
        // fade out particles gracefully
        let fade = 1
        const fadeStart = performance.now()
        function fadeRender() {
          const ft = (performance.now() - fadeStart) / 500
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.globalAlpha = Math.max(0, 1 - ft)
          for (let p of particles) {
            if (p.life <= 0) continue
            ctx.save()
            ctx.translate(p.x, p.y)
            ctx.rotate(p.rot)
            ctx.fillStyle = p.color
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
            ctx.restore()
          }
          ctx.globalAlpha = 1
          if (ft < 1) requestAnimationFrame(fadeRender)
          else ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
        fadeRender()
      }
    }

    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [showFinishModal])

  function drawRealisticPot(
    ctx: CanvasRenderingContext2D,
    cx: number,
    topY: number,
    potW: number,
    potH: number,
    dpr: number
  ): Path2D {
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
    return path
  }

  // Drawing overlay setup
  useEffect(()=>{
    const canvas = drawCanvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')!

    const setSize = () => {
      const rect = container.getBoundingClientRect()
      const w = Math.floor(rect.width)
      const h = Math.floor(rect.height)
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr,0,0,dpr,0,0)
    }
    setSize()
    const onResize = () => setSize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  },[])

  function getCanvasPoint(e: PointerEvent | React.PointerEvent | MouseEvent) {
    const canvas = drawCanvasRef.current
    if (!canvas) return {x:0,y:0}
    const rect = canvas.getBoundingClientRect()
    const clientX = 'clientX' in e ? (e as any).clientX : 0
    const clientY = 'clientY' in e ? (e as any).clientY : 0
    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  function clearDrawing() {
    const canvas = drawCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0,0,canvas.width,canvas.height)
  }

  function pointerDown(e: React.PointerEvent | React.MouseEvent) {
    if (activeTool === 'none') return
    const canvas = drawCanvasRef.current
    if (!canvas) return
    const p = getCanvasPoint(e as any)
    // only start when clicking inside pot unless drawAnywhere is enabled
    const potPath = potPathRef.current
    const bgCtx = canvasRef.current?.getContext('2d')
    const inside = potPath && bgCtx ? bgCtx.isPointInPath(potPath, p.x, p.y) : false
    console.debug('pointerDown', {x: p.x, y: p.y, inside, drawAnywhere})
    if (!drawAnywhere && !inside) return
    try { (canvas as any).setPointerCapture?.((e as any).pointerId) } catch {}
    isDrawingRef.current = true
    lastPointRef.current = p
  }

  function pointerMove(e: React.PointerEvent | React.MouseEvent) {
    const canvas = drawCanvasRef.current
    if (!canvas) return
    const p = getCanvasPoint(e as any)
    // show crosshair when tool active; if drawAnywhere is off, show not-allowed outside pot
    const potPath = potPathRef.current
    const bgCtx = canvasRef.current?.getContext('2d')
    const overPot = potPath && bgCtx ? bgCtx.isPointInPath(potPath, p.x, p.y) : false
    if (canvas) canvas.style.cursor = activeTool === 'none' ? 'default' : (drawAnywhere ? 'crosshair' : (overPot ? 'crosshair' : 'not-allowed'))
    console.debug('pointerMove', {x: p.x, y: p.y, overPot, isDrawing: isDrawingRef.current})
    if (!isDrawingRef.current) return
    const ctx = canvas.getContext('2d')!
    const last = lastPointRef.current
    if (!last) { lastPointRef.current = p; return }
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.lineWidth = activeTool === 'brush' ? 12 : 4
    ctx.strokeStyle = drawColor
    // clip to pot path so visible strokes stay on pot
    const pot = potPathRef.current
    if (pot) { ctx.save(); try { ctx.clip(pot) } catch {} }
    ctx.beginPath()
    ctx.moveTo(last.x, last.y)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    if (pot) ctx.restore()
    lastPointRef.current = p
  }

  function pointerUp(e: React.PointerEvent | React.MouseEvent) {
    const canvas = drawCanvasRef.current
    if (!canvas) return
    try { (canvas as any).releasePointerCapture?.((e as any).pointerId) } catch {}
    isDrawingRef.current = false
    lastPointRef.current = null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff7ed] via-[#fff1e6] to-[#fff3f0] p-0">
      <style>{`
        @keyframes overlayFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes modalPop { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .modal-overlay { animation: overlayFade 260ms ease both; }
        .modal-box { animation: modalPop 360ms cubic-bezier(.2,.9,.2,1) both; border-radius:18px; }
        .btn-accent { box-shadow: 0 10px 30px rgba(255,138,0,0.18); }
        .btn-accent:hover { transform: translateY(-3px); }
        .btn-soft:hover { transform: translateY(-2px); }
        .confetti-canvas { z-index: 80; pointer-events: none; }
      `}</style>
      <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-center bg-cover">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" style={{pointerEvents:'none'}} />
        <canvas
          ref={drawCanvasRef}
          className="absolute inset-0 w-full h-full z-10"
          style={{touchAction:'none', pointerEvents: running ? 'auto' : 'none'}}
          onPointerDown={pointerDown as any}
          onPointerMove={pointerMove as any}
          onPointerUp={pointerUp as any}
          onPointerCancel={pointerUp as any}
          onMouseDown={pointerDown as any}
          onMouseMove={pointerMove as any}
          onMouseUp={pointerUp as any}
        />

        <canvas ref={confettiRef} className="absolute inset-0 w-full h-full confetti-canvas" />

        {/* Left stat cards (match Level 3 styling) - responsive to avoid overlap with header */}
        <div className="absolute left-4 sm:left-8 top-28 md:top-32 lg:top-36 z-40 space-y-4 w-[320px] sm:w-[360px] max-w-[90vw]">
          <div className="stat-card flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">Thời gian còn lại</div>
                <div className="text-2xl font-semibold text-[#5b21b6]">{String(Math.floor(timeLeft/60)).padStart(2,'0')}:{String(timeLeft%60).padStart(2,'0')}</div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-white to-amber-50 rounded-full flex items-center justify-center shadow-lg border border-amber-100">
                <span className="text-3xl sm:text-4xl" aria-hidden>⏱️</span>
              </div>
            </div>

            {running && (
              <div className="mt-2 flex flex-row items-center gap-3">
                <button
                  onClick={() => { clearDrawing(); setActiveTool('pencil') }}
                  className="w-28 h-10 rounded-md bg-gradient-to-r from-amber-400 to-amber-500 text-white font-semibold shadow-md hover:translate-y-[-2px] transform transition"
                >
                  Vẽ lại
                </button>
                <button
                  onClick={() => { setRunning(false); setShowConfirmModal(true) }}
                  className="w-28 h-10 rounded-md bg-white/90 text-gray-800 border shadow hover:translate-y-[-2px] transform transition"
                >
                  Kết thúc
                </button>
              </div>
            )}
        </div>

        {/* Right tools (larger, styled, responsive) */}
        <div className="absolute right-4 sm:right-8 z-40 flex flex-col gap-3 items-center" style={{top: 'calc(9rem + 20px)'}}>
          <input ref={colorInputRef} type="color" className="hidden" onChange={(e)=> setDrawColor(e.target.value)} value={drawColor} />
          <button
            title="Palette"
            aria-label="Palette"
            onClick={() => { setTempColor(drawColor); setShowColorModal(true) }}
            className={`w-20 h-20 rounded-3xl bg-white/80 shadow flex items-center justify-center transform transition duration-200 hover:scale-105 ${activeTool === 'none' ? '' : ''}`}
            style={{backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)'}}
          >
            <span className="text-4xl sm:text-3xl">🎨</span>
          </button>

          <button
            title="Pencil"
            aria-label="Pencil"
            onClick={() => setActiveTool(activeTool === 'pencil' ? 'none' : 'pencil')}
            className={`w-20 h-20 rounded-3xl shadow flex items-center justify-center transform transition duration-200 hover:scale-105 ${activeTool === 'pencil' ? 'ring-4 ring-amber-300' : 'bg-white/70'}`}
            style={{backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)'}}
          >
            <span className="text-3xl">✏️</span>
          </button>

          <button
            title="Brush"
            aria-label="Brush"
            onClick={() => setActiveTool(activeTool === 'brush' ? 'none' : 'brush')}
            className={`w-20 h-20 rounded-3xl shadow flex items-center justify-center transform transition duration-200 hover:scale-105 ${activeTool === 'brush' ? 'ring-4 ring-amber-300' : 'bg-white/70'}`}
            style={{backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)'}}
          >
            <span className="text-3xl">🖌️</span>
          </button>

          {/* drawAnywhere enabled by default; toggle removed */}
        </div>

        {/* Top header (clean, gradient text — no border/background) */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center z-40 w-full px-4 pointer-events-none top-2 sm:top-4 md:top-8">
          <div className="inline-block py-2 px-6 sm:px-8" style={{background: 'transparent', paddingLeft: 'calc(1.5rem + 2.5px)', paddingRight: 'calc(1.5rem + 2.5px)'}}>
            <h1
              className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight leading-tight"
              style={{
                background: 'linear-gradient(90deg,#ffd86b,#ff7ab6,#9b5cff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 6px 18px rgba(0,0,0,0.28), 0 12px 40px rgba(157,81,224,0.12)'
              }}
            >
              LEVEL 4: TRANG TRÍ & TRÁNG MEN
            </h1>
          </div>
        </div>

        {/* Right-column controls (placed under tool icons) */}
        <div className="absolute right-4 sm:right-8 z-50 flex items-center gap-3" style={{top: '65%'}}>
          {!running ? (
            <button
              onClick={() => { setRunning(true); setStarted(true) }}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg shadow"
            >
              {started ? 'Tiếp tục' : 'Bắt đầu'}
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
            onClick={() => navigate('/craft-selection')}
            className="px-3 py-2 bg-white rounded-lg shadow"
          >
            Thoát
          </button>
        </div>

        {showColorModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowColorModal(false)} />
            <div className="relative bg-gradient-to-br from-white/95 to-white/80 rounded-2xl p-6 shadow-2xl w-full max-w-md mx-4 transform transition-all duration-200 scale-100">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Chọn màu</h3>
                  <p className="text-xs text-gray-500">Màu sẽ áp dụng cho cọ khi bạn bấm Xác nhận.</p>
                </div>
                <button onClick={() => setShowColorModal(false)} className="text-gray-400 hover:text-gray-700 ml-2">✕</button>
              </div>

              <div className="flex flex-col gap-3">
                <input
                  type="color"
                  value={tempColor}
                  onChange={(e) => setTempColor(e.target.value)}
                  className="w-full h-14 p-0 rounded-md overflow-hidden"
                  aria-label="Color swatch"
                />

                <input
                  type="text"
                  value={tempColor}
                  onChange={(e) => {
                    const v = e.target.value
                    if (/^#?[0-9a-fA-F]{3,6}$/.test(v)) setTempColor(v.startsWith('#') ? v : `#${v}`)
                    else setTempColor(v)
                  }}
                  className="w-full text-sm px-3 py-2 rounded-md border bg-white"
                  aria-label="Hex color"
                />
              </div>

              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => setShowColorModal(false)}
                  className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Thoát
                </button>
                <button
                  onClick={() => { setDrawColor(tempColor); setShowColorModal(false) }}
                  className="px-5 py-2 rounded-md bg-gradient-to-r from-emerald-400 to-emerald-600 text-white shadow-md hover:from-emerald-500 hover:to-emerald-700"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}

        {showConfirmModal && (
          <div className="fixed inset-0 z-65 flex items-center justify-center modal-overlay">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setShowConfirmModal(false); setRunning(true) }} />
            <div className="relative bg-white modal-box p-6 shadow-lg w-full max-w-sm mx-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Bạn có chắc chắn muốn kết thúc?</h4>
                  <p className="text-xs text-gray-500">Hành động này sẽ kết thúc giai đoạn hiện tại.</p>
                </div>
                <button onClick={() => { setShowConfirmModal(false); setRunning(true) }} className="text-gray-400 hover:text-gray-700 ml-2">✕</button>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => { setShowConfirmModal(false); setRunning(true) }}
                  className="px-4 py-2 rounded-md bg-white border text-gray-700 btn-soft"
                >
                  Tiếp tục
                </button>
                <button
                  onClick={() => { setShowConfirmModal(false); setShowFinishModal(true) }}
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-amber-400 to-amber-600 text-white btn-accent"
                >
                  Chắc chắn
                </button>
              </div>
            </div>
          </div>
        )}

        {showFinishModal && (
          <div className="fixed inset-0 z-70 flex items-center justify-center modal-overlay">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowFinishModal(false)} />
            <div className="relative bg-white modal-box p-6 shadow-2xl w-full max-w-lg mx-4 transform transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Chúc mừng!</h3>
                  <p className="text-sm text-gray-600">Bạn đã hoàn thành giai đoạn này.</p>
                </div>
                <button onClick={() => setShowFinishModal(false)} className="text-gray-400 hover:text-gray-700 ml-2 text-xl leading-none">✕</button>
              </div>

              <div className="mt-2">
                <p className="text-sm text-gray-700">Bạn vẽ rất đẹp — <strong>Xuất sắc!</strong></p>
                <p className="text-xs text-gray-500">Cảm ơn bạn đã trang trí bình thật tỉ mỉ và sáng tạo.</p>
                <div className="mt-3 flex items-center justify-center" aria-hidden>
                  <span className="text-5xl sm:text-6xl text-amber-400 mx-2">★</span>
                  <span className="text-5xl sm:text-6xl text-amber-400 mx-2">★</span>
                  <span className="text-5xl sm:text-6xl text-amber-400 mx-2">★</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    // reset level state and restart
                    setShowFinishModal(false)
                    clearDrawing()
                    setTimeLeft(135)
                    setDecorProgress(40)
                    setQuality(92)
                    setActiveTool('none')
                    setRunning(true)
                  }}
                  className="px-4 py-2 rounded-md bg-white border text-gray-700 btn-soft"
                >
                  Chơi lại
                </button>
                <div className="flex items-center gap-4">
                  <button
                    onClick={async () => {
                      // close modal first for UX
                      setShowFinishModal(false)

                      // Export the decorated pot (crop to pot area) so Level 5 can reuse it.
                      try {
                        const main = canvasRef.current
                        const overlay = drawCanvasRef.current
                        if (main && overlay) {
                          const rect = main.getBoundingClientRect()
                          const w = rect.width
                          const h = rect.height
                          const dpr = window.devicePixelRatio || 1

                          // same pot layout logic as render loop
                          const vw = Math.min(w * 0.20, 320)
                          const vh = vw * 1.05
                          const sx = Math.floor((w / 2 - vw / 2) * dpr)
                          const sy = Math.floor((h * 0.55 - vh * 0.45) * dpr)
                          const sw = Math.floor(vw * dpr)
                          const sh = Math.floor(vh * dpr)

                          // create offscreen canvas and draw only the pot (transparent background)
                          const tmp = document.createElement('canvas')
                          tmp.width = sw
                          tmp.height = sh
                          tmp.style.width = `${sw / dpr}px`
                          tmp.style.height = `${sh / dpr}px`
                          const tctx = tmp.getContext('2d')!
                          // ensure correct pixel density
                          tctx.setTransform(dpr, 0, 0, dpr, 0, 0)

                          // Re-render the pot shape into the temporary canvas so background stays transparent.
                          try {
                            // vw/vh are CSS pixels; drawRealisticPot expects those units.
                            drawRealisticPot(tctx, (sw / dpr) / 2, 0, vw, vh, dpr)
                          } catch (e) {
                            // fallback: if pot redraw fails, try copying from main canvas crop
                            tctx.clearRect(0, 0, sw, sh)
                            tctx.drawImage(main, sx, sy, sw, sh, 0, 0, sw, sh)
                          }

                          // draw only overlay (user decorations) from the overlay canvas into tmp
                          tctx.drawImage(overlay, sx, sy, sw, sh, 0, 0, sw, sh)
                          try {
                            const data = tmp.toDataURL('image/png')
                            localStorage.setItem('batTrang_decorated_pot', data)
                          } catch (e) {
                            console.warn('export decorated pot failed', e)
                          }
                        }
                      } catch (e) {
                        console.warn('capture error', e)
                      }

                      try {
                        // Attempt to map levels via API (village id 1 = Bát Tràng)
                        const lvls = await levelsService.getByVillage(1)
                        const getNum = (l: any) => Number(l?.level_number ?? l?.levelNumber ?? l?.level ?? l?.level_id ?? l?.id)
                        const current = lvls.find((l: any) => getNum(l) === 4)
                        const next = lvls.find((l: any) => getNum(l) === 5)

                        // save current progress if we can determine current level id
                        if (current) {
                          const currentId = Number(current.level_id ?? current.id)
                          try {
                            await progressService.saveProgress({ level_id: currentId, status: 'completed', score: Math.round((rating / 3) * 100) })
                          } catch (e) {
                            console.warn('saveProgress failed', e)
                          }
                        }

                        if (next) {
                          const nextId = Number(next.level_id ?? next.id)
                          try {
                            await progressService.unlockLevel(nextId)
                          } catch (e) {
                            console.warn('unlockLevel failed', e)
                          }
                        }

                        // always return to craft selection and open Bat Tràng modal
                        navigate('/craft-selection?openName=B%C3%A1t%20Tr%C3%A0ng')
                      } catch (err) {
                        console.error('finish handler error', err)
                        navigate('/craft-selection?openName=B%C3%A1t%20Tr%C3%A0ng')
                      }
                    }}
                    className="px-5 py-2 rounded-md bg-gradient-to-r from-amber-400 to-amber-600 text-white btn-accent"
                    style={{border:'1px solid rgba(255,160,38,0.12)'}}
                  >
                    Hoàn tất
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
