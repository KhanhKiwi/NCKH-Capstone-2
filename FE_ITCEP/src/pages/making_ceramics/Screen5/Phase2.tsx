import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import GuideDialog from '../../../util/shared/GuideDialog'

export default function BatTrangLevel5Phase1({ onComplete }: { onComplete?: (result?: any) => void }) {
  const navigate = useNavigate()

  const [temperature, setTemperature] = useState(900)
  const [timeLeft, setTimeLeft] = useState(3 * 60)
  const [quality, setQuality] = useState(100)
  const [running, setRunning] = useState(false)
  const [started, setStarted] = useState(false)
  const [isDraggingHandle, setIsDraggingHandle] = useState(false)
  const [showHandleHover, setShowHandleHover] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [starCount, setStarCount] = useState<number>(3)
  const [confetti, setConfetti] = useState<Array<{id:number; left:number; delay:number; color:string; rotate:number}>>([])

  const sliderRef = useRef<HTMLDivElement | null>(null)
  const potCanvasRef = useRef<HTMLCanvasElement | null>(null)

  const MIN = 900
  const MAX = 1250
  const IDEAL_MIN = 1050
  const IDEAL_MAX = 1150

  /* ===== TIME ===== */
  /* ===== TIME ===== */
  useEffect(() => {
    if (!running) return
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          // stop when reaches zero
          setRunning(false)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [running])

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
    // Increased pot layout (bigger) per request
    const cx = w / 2
    const cy = h * 0.55
    const potW = Math.min(w * 0.6, 700)
    const potH = potW * 1.12
    const topY = cy - potH * 0.5
    // draw base pot and get its path
    const potPath = drawRealisticPot(ctx, cx, topY, potW, potH)

    // if a decorated pot was saved from Level 4, draw it onto the pot area
    try {
      const saved = localStorage.getItem('batTrang_decorated_pot')
      if (saved) {
        const img = new Image()
        img.onload = () => {
          ctx.save()
          try {
            ctx.clip(potPath)
          } catch (e) {
            // clip may throw in some contexts; ignore and draw normally
          }
          const left = cx - potW / 2
          // draw saved image stretched to pot dimensions
          ctx.drawImage(img, 0, 0, img.width, img.height, left, topY, potW, potH)
          ctx.restore()
        }
        img.src = saved
      }
    } catch (e) {
      console.warn('load decorated pot failed', e)
    }
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
      // recalc using Level 4 layout
      const ncx = nw / 2
      const ncy = nh * 0.55
      const npotW = Math.min(nw * 0.6, 700)
      const npotH = npotW * 1.12
      const ntopY = ncy - npotH * 0.5
      const nPath = drawRealisticPot(ctx, ncx, ntopY, npotW, npotH)
      // redraw saved decoration if present
      try {
        const saved = localStorage.getItem('batTrang_decorated_pot')
        if (saved) {
          const img = new Image()
          img.onload = () => {
            ctx.save()
            try { ctx.clip(nPath) } catch {}
            const left = ncx - npotW / 2
            ctx.drawImage(img, 0, 0, img.width, img.height, left, ntopY, npotW, npotH)
            ctx.restore()
          }
          img.src = saved
        }
      } catch (e) { console.warn('load decorated pot failed', e) }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [potCanvasRef, temperature])

  useEffect(() => {
    const onUp = () => setIsDraggingHandle(false)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchend', onUp)
    }
  }, [])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const r = s % 60
    return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`
  }

  /* ===== QUALITY LOGIC ===== */
  // Removed immediate quality adjustments on temperature change to avoid
  // progress jumping while the player drags the temperature slider.
  // Quality is only updated by the periodic ideal-range bonus below.

    /* ===== PERIODIC QUALITY TICK ===== */
    // Every 5s while running+started: +10% if in ideal range, else -10%
    // Use a ref to avoid stale closures and ensure the tick reads the latest temperature
    const temperatureRef = useRef<number>(temperature)
    useEffect(() => { temperatureRef.current = temperature }, [temperature])

    useEffect(() => {
      if (!started || !running) return
      let cancelled = false

      const tick = () => {
        if (cancelled) return
        const t = temperatureRef.current
        setQuality((q) => {
          if (t >= IDEAL_MIN && t <= IDEAL_MAX) return Math.min(100, q + 10)
          return Math.max(0, q - 10)
        })
        // schedule next
        timer = window.setTimeout(tick, 5000)
      }

      // start first tick after 5s
      let timer = window.setTimeout(tick, 5000)
      return () => { cancelled = true; clearTimeout(timer) }
    }, [running, started])

    // when quality reaches 100 -> success
    useEffect(() => {
      if (!started) return
      if (summaryOpen) return
      if (quality >= 100 && !showSuccess) {
        setRunning(false)
        setShowSuccess(true)
        const stars = timeLeft > 60 ? 3 : timeLeft > 30 ? 2 : 1
        setStarCount(stars)
      }
    }, [quality, showSuccess, timeLeft, summaryOpen])

    // confetti: generate burst when showSuccess becomes true
    useEffect(() => {
      if (!showSuccess) {
        setConfetti([])
        return
      }
      const colors = ['#F97316','#F59E0B','#10B981','#06B6D4','#7C3AED','#EF4444']
      const pieces = Array.from({length:24}).map((_, i) => ({
        id: Date.now() + i,
        left: 30 + Math.random() * 40,
        delay: Math.floor(Math.random() * 300),
        color: colors[Math.floor(Math.random() * colors.length)],
        rotate: Math.floor(Math.random() * 360) - 180,
      }))
      setConfetti(pieces)
      const t = setTimeout(() => setConfetti([]), 1600)
      return () => clearTimeout(t)
    }, [showSuccess])

    /* ===== AUTO-NUDGE TEMPERATURE WHEN IDLE ===== */
    useEffect(() => {
      if (!started) return
      // don't run while dragging
      if (isDraggingHandle) return

      const id = setInterval(() => {
        // double-check inside interval in case drag started
        if (isDraggingHandle) return
        setTemperature((t) => {
          const step = Math.round(5 + Math.random() * 15) // 5-20°C
          const dir = Math.random() < 0.5 ? -1 : 1
          const next = Math.max(MIN, Math.min(MAX, t + dir * step))
          return next
        })
      }, 4000)

      return () => clearInterval(id)
    }, [started, isDraggingHandle])

  /* ===== DRAG SLIDER ===== */
  const handleDrag = (e: React.MouseEvent) => {
    if (!sliderRef.current) return
    if (!started) return

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

      {/* ===== HEADER (match Level 4 style) ===== */}
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
            LEVEL 5: NUNG GỐM
          </h1>
        </div>
      </div>
      <div className="confetti-layer" aria-hidden>
        <style>{`
          .confetti-layer{pointer-events:none;position:absolute;inset:0;z-index:70}
          .confetti-piece{position:absolute;top:55%;width:12px;height:18px;display:flex;align-items:center;justify-content:center;transform-origin:center;animation:confettiFall 1400ms cubic-bezier(.2,.9,.2,1) both}
          .confetti-inner{width:100%;height:100%;border-radius:2px}
          @keyframes confettiFall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(-420px) rotate(720deg);opacity:0}}
        `}</style>
        {confetti.map(p => (
          <div key={p.id} className="confetti-piece" style={{left:`${p.left}%`, animationDelay:`${p.delay}ms`}}>
            <div className="confetti-inner" style={{background:p.color, transform:`rotate(${p.rotate}deg)`}} />
          </div>
        ))}
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => {}} />
          <div className="relative z-50 max-w-lg w-full mx-auto">
            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-3xl shadow-2xl border-2 border-emerald-100 overflow-hidden" style={{animation:'popIn 320ms cubic-bezier(.2,.9,.2,1) both'}}>
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-emerald-500 to-[#34d399] text-white">
                <div className="bg-white/20 rounded-full p-3 flex items-center justify-center">
                  <div style={{width:40,height:40,display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <span style={{fontSize:22}}>🏅</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold">Hoàn thành!</h3>
                  <p className="text-sm opacity-90">Gốm đã nung xong — chúc mừng bạn.</p>
                </div>
              </div>

              <div className="p-6 bg-white">
                <p className="text-gray-700 text-center mb-6">Bạn đã hoàn thành quá trình nung. Xem tổng kết để nhận sao hoặc chơi lại.</p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => { setShowSuccess(false); setSummaryOpen(true); }}
                    className="px-5 py-2 rounded-2xl bg-white border border-gray-200 text-gray-700 hover:shadow-lg transition"
                  >
                    Tổng kết
                  </button>

                  <button
                    onClick={() => {
                      setShowSuccess(false)
                      setQuality(100)
                      setTimeLeft(3 * 60)
                      setRunning(false)
                      setStarted(false)
                    }}
                    className="px-5 py-2 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-lg"
                  >
                    Chơi lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {summaryOpen && (
        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:120}}>
          <div style={{width:440,background:'linear-gradient(180deg,#fffef8,#fff7f0)',padding:28,borderRadius:16,boxShadow:'0 40px 120px rgba(10,20,10,0.28)',textAlign:'center',animation:'popIn 320ms cubic-bezier(.2,.9,.2,1) both',border:'1px solid rgba(0,0,0,0.06)'}}>
            <h2 style={{margin:'0 0 8px',fontSize:22,color:'#6b3f1a'}}>Tổng kết</h2>
            <div style={{color:'#7a5236',marginBottom:14}}>chúc mừng bạn đã hoàn thành level 5</div>
            <div style={{display:'flex',justifyContent:'center',gap:12,marginBottom:14}}>
                {[1,2,3].map(i=> (
                  <span key={i} style={{fontSize:46, transform: i<=starCount ? 'scale(1.06)' : 'scale(.92)', transition:'transform 260ms cubic-bezier(.2,.9,.2,1)', color: i<=starCount ? '#6b3f1a' : '#e9dfd4'}} aria-hidden>
                    {i<=starCount ? '★' : '☆'}
                  </span>
                ))}
            </div>
            <div style={{color:'#5b3a26',marginBottom:10}}>Chất lượng cuối: <strong>{Math.round(quality)}%</strong></div>
            <div style={{color:'#5b3a26',marginBottom:18}}>Thời gian còn lại: <strong>{timeLeft}s</strong></div>
            <div style={{display:'flex',gap:12,justifyContent:'center'}}>
              <button onClick={async ()=>{
                try{ localStorage.setItem('level5_stars', String(starCount)); localStorage.setItem('level5_result','won') }catch{}
                try {
                  let userId: number | undefined
                  try { const profile = await import('../../../api/services/authService').then(m => m.authService.getProfile()); userId = Number(profile?.user_id ?? profile?.id ?? profile?.userId) } catch { userId = undefined }
                  const all = await import('../../../api/levels/levelsService').then(m => m.levelsService.getByVillage(1, userId))
                  if (Array.isArray(all)) {
                    const current = all.find(x => Number(x.level_number ?? x.level_id ?? x.id) === 5)
                    if (current) {
                      await import('../../../api/progress/progressService').then(m => m.progressService.saveProgress({ user_id: 1, level_id: Number(current.level_id ?? current.id), status: 'completed', score: 100 }))
                      try {
                        const currentNum = Number(current.level_number ?? current.level_id ?? current.id)
                        const next = all.find(x => Number(x.level_number ?? x.level_id ?? x.id) === (currentNum + 1))
                        if (next) {
                          const nextId = Number(next.level_id ?? next.id)
                          await import('../../../api/progress/progressService').then(m => m.progressService.unlockLevel(nextId))
                        }
                      } catch (e) {
                        console.warn('unlock next level failed', e)
                      }
                    }
                  }
                } catch (e) { console.warn('complete level failed', e) }

                setSummaryOpen(false);
                if (onComplete) {
                  try { onComplete({ stars: starCount }) } catch (e) {}
                  navigate('/challenge')
                  return
                }
                navigate('/craft-selection?openName=B%C3%A1t%20Tr%C3%A0ng');
              }} style={{padding:'10px 18px',background:'linear-gradient(90deg,#10b981,#06a86b)',color:'white',borderRadius:12,border:'none',fontWeight:800}}>Hoàn tất</button>
              <button onClick={()=>{ setSummaryOpen(false); setShowSuccess(false); setQuality(100); setTimeLeft(3 * 60); setRunning(false); setStarted(false); navigate('/craft-selection'); }} style={{padding:'10px 18px',background:'white',borderRadius:12,border:'1px solid rgba(0,0,0,0.06)',fontWeight:700,color:'#6b3f1a'}}>Thoát</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MAIN ===== */}
      <div className="grid grid-cols-12 gap-6 w-full max-w-[1200px] flex-1" style={{ marginTop: '120px' }}>

        {/* ===== LEFT ===== */}
        <div className="col-span-3 space-y-4">

          {/* Time */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 shadow-lg">
            <div className="flex items-baseline justify-between">
              <div className="text-xl font-bold text-gray-300">Thời gian</div>
              <div className="text-3xl text-blue-300 font-bold ml-4">{formatTime(timeLeft)}</div>
            </div>
          </div>

          {/* Quality */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between w-full">
              <div className="text-xl font-bold text-gray-300">Chất lượng</div>
              <div className="text-2xl text-green-400 font-bold">{Math.round(started ? quality : 100)}%</div>
            </div>

            <div className="mt-3 w-full">
              <div className="h-2 bg-gray-700 rounded w-full">
                <div
                  className="h-2 bg-green-400 rounded"
                  style={{ width: `${started ? quality : 100}%` }}
                />
              </div>
            </div>
            <div className="mt-4 w-full flex justify-center">
              <div className="flex items-center gap-3">
                {!running ? (
                  <button
                    onClick={() => { setQuality(0); setRunning(true); setStarted(true) }}
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
                  onClick={() => navigate(-1)}
                  className="px-3 py-2 bg-white text-gray-800 rounded-lg shadow"
                >
                  Thoát
                </button>
              </div>
            </div>
          </div>
          {/* Guide dialog for Level 5 (firing) */}
          <div style={{ marginTop: 10 }}>
            <GuideDialog
              started={started}
              showRequireStart={true}
              win={showSuccess}
              progress={Math.round(quality)}
              phase="phase5"
              onNext={() => {}}
              avatarFirst={true}
            />
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
        <div className="col-span-3 flex flex-col items-center pr-5">

          <div className="w-full flex justify-center">
            <div className="text-sm text-gray-200 mb-2 font-semibold">Điều chỉnh nhiệt độ</div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="w-full flex justify-center">
              <div className="mx-auto">
                <div
                  ref={sliderRef}
                  onMouseMove={(e) => { if (!started) return; if (e.buttons === 1) handleDrag(e) }}
                  onMouseDown={(e) => { if (!started) return; setIsDraggingHandle(true); handleDrag(e) }}
                  onMouseEnter={() => setShowHandleHover(true)}
                  onMouseLeave={() => setShowHandleHover(false)}
                  onTouchStart={(e: React.TouchEvent) => {
                    if (!started) return
                    const t = e.touches[0]
                    const rect = sliderRef.current!.getBoundingClientRect()
                    const y = t.clientY - rect.top
                    const percent = 1 - y / rect.height
                    const value = MIN + percent * (MAX - MIN)
                    setIsDraggingHandle(true)
                    setTemperature(Math.round(Math.max(MIN, Math.min(MAX, value))))
                  }}
                  onTouchMove={(e: React.TouchEvent) => {
                    if (!started) return
                    const t = e.touches[0]
                    const rect = sliderRef.current!.getBoundingClientRect()
                    const y = t.clientY - rect.top
                    const percent = 1 - y / rect.height
                    const value = MIN + percent * (MAX - MIN)
                    setTemperature(Math.round(Math.max(MIN, Math.min(MAX, value))))
                  }}
                  role="slider"
                  aria-valuemin={MIN}
                  aria-valuemax={MAX}
                  aria-valuenow={temperature}
                  className={`relative h-[460px] w-24 rounded-full shadow-2xl ${started ? 'cursor-pointer' : 'cursor-not-allowed opacity-80'} overflow-hidden flex items-center justify-center`}
                  style={{ background: 'linear-gradient(180deg,#FFF1D6 0%,#FFCF96 30%,#FF8A3D 100%)', boxShadow: 'inset 0 8px 30px rgba(0,0,0,0.25)' }}
                >
                  <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(0deg, rgba(255,255,255,0.06), rgba(255,255,255,0))' }} />

                  <div
                    className="absolute left-2 right-2 bg-emerald-400/25"
                    style={{
                      bottom: `${((IDEAL_MIN - MIN) / (MAX - MIN)) * 100}%`,
                      height: `${((IDEAL_MAX - IDEAL_MIN) / (MAX - MIN)) * 100}%`,
                      borderRadius: '999px',
                      filter: 'blur(6px)',
                    }}
                  />

                  <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-0.5 bg-white/10" />

                  <div
                    className="absolute flex items-center justify-center"
                    style={{
                      bottom: `${((temperature - MIN) / (MAX - MIN)) * 100}%`,
                      transform: 'translateY(50%)',
                      transition: isDraggingHandle ? 'none' : 'transform 160ms ease',
                    }}
                  >
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-2xl border-4 border-white/30">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-b from-orange-500 to-orange-400 flex items-center justify-center text-white font-extrabold text-sm">
                          {Math.round(temperature)}
                        </div>
                      </div>

                      <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 8px 28px rgba(255,140,50,0.35)', pointerEvents: 'none' }} />

                      {(isDraggingHandle || showHandleHover) && (
                        <div className="absolute -top-14 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/80 text-white text-xs font-semibold shadow-md">
                          {temperature}°C
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-200 mt-1 text-center">
              <span className="text-xl font-bold text-amber-50">{temperature}°C</span>
              <div className="text-xs text-gray-300">Lý tưởng: {IDEAL_MIN} - {IDEAL_MAX}</div>
            </div>
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
