import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'

export default function BatTrangLevel5Phase1() {
  const navigate = useNavigate()

  const [temperature, setTemperature] = useState(1120)
  const [timeLeft, setTimeLeft] = useState(35 * 60)
  const [quality, setQuality] = useState(88)
  const [running, setRunning] = useState(true)

  const sliderRef = useRef<HTMLDivElement | null>(null)
  const potCanvasRef = useRef<HTMLCanvasElement | null>(null)

  const MIN = 900
  const MAX = 1250
  const IDEAL_MIN = 1050
  const IDEAL_MAX = 1150

  /* ===== TIME ===== */
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // draw pot into center canvas
  useEffect(() => {
    const canvas = potCanvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    const w = Math.floor(rect.width)
    const h = Math.floor(rect.height)
    canvas.width = Math.floor(w * dpr)
    canvas.height = Math.floor(h * dpr)
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    const ctx = canvas.getContext('2d')!
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0,0,w,h)
    const cx = w / 2
    const topY = h * 0.08
    const potW = Math.min(w * 0.8, 340)
    const potH = potW * 1.12
    drawRealisticPot(ctx, cx, topY, potW, potH)
    // redraw on resize
    const onResize = () => {
      const r = canvas.getBoundingClientRect()
      const nw = Math.floor(r.width)
      const nh = Math.floor(r.height)
      canvas.width = Math.floor(nw * dpr)
      canvas.height = Math.floor(nh * dpr)
      canvas.style.width = `${nw}px`
      canvas.style.height = `${nh}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0,0,nw,nh)
      const newW = Math.min(nw * 0.8, 340)
      drawRealisticPot(ctx, nw/2, nh * 0.08, newW, newW * 1.12)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [potCanvasRef, temperature])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const r = s % 60
    return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`
  }

  /* ===== QUALITY LOGIC ===== */
  useEffect(() => {
    const ideal = 1100
    const diff = Math.abs(temperature - ideal)

    setQuality((q) => {
      let next = q
      if (diff < 40) next += 0.15
      else if (diff < 100) next -= 0.05
      else next -= 0.25
      return Math.max(0, Math.min(100, next))
    })
  }, [temperature])

  /* ===== DRAG SLIDER ===== */
  const handleDrag = (e: React.MouseEvent) => {
    if (!sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const y = e.clientY - rect.top
    const percent = 1 - y / rect.height
    const value = MIN + percent * (MAX - MIN)

    setTemperature(Math.round(Math.max(MIN, Math.min(MAX, value))))
  }

  const bgUrl = encodeURI('/images_making_ceramic/ảnh nền nung.png')
  const asciiFallback = '/images_making_ceramic/oven-bg.png'

  return (
    <div style={{backgroundImage: `url('${bgUrl}'), url('${asciiFallback}')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', minHeight: '100vh'}} className="w-screen text-white flex flex-col items-center p-6">

      {/* ===== HEADER ===== */}
      <div className="px-8 py-4 rounded-2xl bg-gradient-to-b from-[#f5d7a1] to-[#c98a4a] shadow-2xl">
        <h1 className="text-3xl font-extrabold text-black text-center">
          LEVEL 5: NUNG GỐM
        </h1>
        <p className="text-center text-black/80 text-sm">
          Giữ nhiệt độ trong vùng lý tưởng để đạt chất lượng cao
        </p>
      </div>

      {/* ===== MAIN ===== */}
      <div className="grid grid-cols-12 gap-6 w-full max-w-[1200px] mt-6 flex-1">

        {/* ===== LEFT ===== */}
        <div className="col-span-3 space-y-4">

          {/* Temp */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 shadow-lg">
            <div className="text-sm text-gray-300">Nhiệt độ lò</div>
            <div className="text-4xl font-bold text-red-400">
              {temperature}°C
            </div>

            <div className="mt-2 h-2 bg-gray-700 rounded">
              <div
                className={`h-2 rounded ${
                  temperature >= IDEAL_MIN && temperature <= IDEAL_MAX
                    ? 'bg-green-400'
                    : 'bg-red-500'
                }`}
                style={{
                  width: `${((temperature - MIN) / (MAX - MIN)) * 100}%`,
                }}
              />
            </div>

            <div className="text-xs text-gray-400 mt-1">
              Lý tưởng: {IDEAL_MIN} - {IDEAL_MAX}
            </div>
          </div>

          {/* Time */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 shadow-lg">
            <div className="text-sm text-gray-300">Thời gian</div>
            <div className="text-3xl text-blue-300 font-bold">
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Quality */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 shadow-lg">
            <div className="flex justify-between">
              <div>
                <div className="text-sm text-gray-300">Chất lượng</div>
                <div className="text-2xl text-green-400 font-bold">
                  {Math.round(quality)}%
                </div>
              </div>

              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                {Math.round(quality)}
              </div>
            </div>

            <div className="mt-3 h-2 bg-gray-700 rounded">
              <div
                className="h-2 bg-green-400 rounded"
                style={{ width: `${quality}%` }}
              />
            </div>
          </div>
        </div>

        {/* ===== CENTER ===== */}
        <div className="col-span-6 flex items-center justify-center">

          <div className="relative">

            {/* glow */}
            <div className="absolute inset-0 bg-orange-500 blur-3xl opacity-30 rounded-full" />

                {/* pot canvas (bigger) */}
                <canvas ref={potCanvasRef} className="w-80 h-80 md:w-96 md:h-96 rounded shadow-2xl bg-transparent" />

            {/* fire glow */}
            <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-40 h-10 bg-orange-600 blur-xl opacity-70 rounded-full" />

          </div>
        </div>

        {/* ===== RIGHT SLIDER ===== */}
        <div className="col-span-3 flex flex-col items-center">

          <div
            ref={sliderRef}
            onMouseMove={(e) => e.buttons === 1 && handleDrag(e)}
            onMouseDown={handleDrag}
            className="relative h-[320px] w-20 rounded-full bg-gradient-to-b from-yellow-200 via-orange-400 to-red-800 flex items-center justify-center cursor-pointer shadow-inner"
          >
            {/* PERFECT ZONE */}
            <div
              className="absolute w-full bg-green-400/30"
              style={{
                bottom: `${((IDEAL_MIN - MIN) / (MAX - MIN)) * 100}%`,
                height: `${((IDEAL_MAX - IDEAL_MIN) / (MAX - MIN)) * 100}%`,
              }}
            />

            {/* HANDLE */}
            <div
              className="absolute w-14 h-14 bg-orange-400 rounded-full shadow-lg border-4 border-orange-200"
              style={{
                bottom: `${((temperature - MIN) / (MAX - MIN)) * 100}%`,
                transform: 'translateY(50%)',
              }}
            />
          </div>

          <div className="mt-4 text-sm text-gray-400">
            {temperature}°C
          </div>
        </div>
      </div>
    </div>
  )
}

// drawRealisticPot copied and adapted from Screen4
function drawRealisticPot(
  ctx: CanvasRenderingContext2D,
  cx: number,
  topY: number,
  potW: number,
  potH: number
): Path2D {
  const left = cx - potW / 2
  ctx.save()
  const path = new Path2D()
  path.moveTo(left + potW * 0.25, topY + potH * 0.08)
  path.bezierCurveTo(
    left + potW * 0.1,
    topY + potH * 0.35,
    left + potW * 0.2,
    topY + potH * 0.75,
    left + potW * 0.4,
    topY + potH * 0.92
  )
  path.lineTo(left + potW * 0.6, topY + potH * 0.92)
  path.bezierCurveTo(
    left + potW * 0.8,
    topY + potH * 0.75,
    left + potW * 0.9,
    topY + potH * 0.35,
    left + potW * 0.75,
    topY + potH * 0.08
  )
  path.closePath()
  ctx.save()
  ctx.clip(path)
  const base = ctx.createLinearGradient(left, topY, left, topY + potH)
  base.addColorStop(0, '#f5dcc0')
  base.addColorStop(0.5, '#c9895b')
  base.addColorStop(1, '#7a4526')
  ctx.fillStyle = base
  ctx.fillRect(left, topY, potW, potH)
  ctx.globalCompositeOperation = 'multiply'
  const shade = ctx.createLinearGradient(left, 0, left + potW, 0)
  shade.addColorStop(0, 'rgba(0,0,0,0.35)')
  shade.addColorStop(0.5, 'rgba(0,0,0,0)')
  shade.addColorStop(1, 'rgba(0,0,0,0.45)')
  ctx.fillStyle = shade
  ctx.fillRect(left, topY, potW, potH)
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
  ctx.fillStyle = '#5b3a29'
  ctx.beginPath()
  ctx.ellipse(cx, topY + potH * 0.08, potW * 0.32, potH * 0.06, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#ead8c0'
  ctx.beginPath()
  ctx.ellipse(cx, topY + potH * 0.06, potW * 0.26, potH * 0.045, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
  ctx.strokeStyle = 'rgba(60,30,20,0.6)'
  ctx.lineWidth = potW * 0.012
  ctx.beginPath()
  ctx.moveTo(left + potW * 0.4, topY + potH * 0.92)
  ctx.lineTo(left + potW * 0.6, topY + potH * 0.92)
  ctx.stroke()
  ctx.save()
  ctx.fillStyle = 'rgba(0,0,0,0.35)'
  ctx.filter = 'blur(8px)'
  ctx.beginPath()
  ctx.ellipse(cx, topY + potH * 0.97, potW * 0.38, potH * 0.09, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
  return path
}
