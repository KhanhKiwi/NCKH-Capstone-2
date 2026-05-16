import React, { useEffect, useRef, useState } from "react";
import GuideDialog from '../../../util/shared/GuideDialog'
import { useNavigate } from "react-router";
import { useAI } from '../../../contexts/AIContext'

export default function Level3({ onComplete, challengeMode }: { onComplete?: (result?: any) => void, challengeMode?: boolean }) {
  const [humidity, setHumidity] = useState(100);
  // crackRisk removed per design — keep minimal state
  const INITIAL_TIME = 180; // 20 minutes
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [running, setRunning] = useState(false);
  const [selectedWeather, setSelectedWeather] = useState<
    "sun" | "cloud" | "rain"
  >("sun");
  const [potVisible, setPotVisible] = useState<boolean>(true);
  const [weatherTimer, setWeatherTimer] = useState<number>(30);
  const INITIAL_WEATHER: "sun" | "cloud" | "rain" = "sun";
  // dryProgress was replaced by `humidity` (visible progress)
  const [showFail, setShowFail] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [summaryOpen, setSummaryOpen] = useState<boolean>(false);
  const [starCount, setStarCount] = useState<number>(3);
  const [confetti, setConfetti] = useState<Array<{id:number; left:number; delay:number; color:string; rotate:number}>>([]);
  const finishedRef = useRef<boolean>(false);
  const timeLeftRef = useRef<number>(timeLeft);
  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);
  const navigate = useNavigate();
  const { triggerEvent } = useAI();
  const loseCountRef = useRef(0);
  const loseFailManySentRef = useRef(false);
  const failTransitionHandledRef = useRef(false);
  const successTransitionHandledRef = useRef(false);

  useEffect(() => {
    if (!showFail) {
      failTransitionHandledRef.current = false;
      return;
    }
    if (failTransitionHandledRef.current) return;
    failTransitionHandledRef.current = true;
    loseCountRef.current += 1;
    triggerEvent({
      event: 'wrong_action',
      level: 3,
      step: 3,
      village_name: 'Bát Tràng',
    }).catch(() => {});
    if (loseCountRef.current >= 3 && !loseFailManySentRef.current) {
      loseFailManySentRef.current = true;
      triggerEvent({
        event: 'fail_many',
        fail_count: loseCountRef.current,
        level: 3,
        step: 3,
        village_name: 'Bát Tràng',
      }).catch(() => {});
    }
  }, [showFail, triggerEvent]);

  useEffect(() => {
    if (!showSuccess) {
      successTransitionHandledRef.current = false;
      return;
    }
    if (successTransitionHandledRef.current) return;
    successTransitionHandledRef.current = true;
    const t = timeLeftRef.current ?? 0;
    const stars = t > 60 ? 3 : t > 30 ? 2 : 1;
    triggerEvent({
      event: 'step_completed',
      level: 3,
      step: 3,
      village_name: 'Bát Tràng',
    }).catch(() => {});
    if (stars >= 3) {
      triggerEvent({
        event: 'high_score',
        level: 3,
        step: 3,
        village_name: 'Bát Tràng',
      }).catch(() => {});
      triggerEvent({
        event: 'perfect_step',
        level: 3,
        step: 3,
        village_name: 'Bát Tràng',
      }).catch(() => {});
    }
  }, [showSuccess, triggerEvent]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prevBgRef = useRef<HTMLImageElement | null>(null);
  const nextBgRef = useRef<HTMLImageElement | null>(null);
  const animStartRef = useRef<number>(0);
  const animDurationRef = useRef<number>(450); // ms
  const animActiveRef = useRef<boolean>(false);
  const potAlphaRef = useRef<number>(1);
  const potTargetRef = useRef<number>(1);
  const startedRef = useRef<boolean>(false);
  const [started, setStarted] = useState(false);

  // draw pot on canvas (responsive) — re-run when selectedWeather changes so background updates
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
    // map weather to background file
    const weatherToBg: Record<string, string> = {
      sun: "/images_making_ceramic/nền nắng.png",
      cloud: "/images_making_ceramic/nền âm u.png",
      rain: "/images_making_ceramic/nền mưa.png",
    };
    const bgPath = weatherToBg[selectedWeather] || "/images_making_ceramic/nền nắng.png";
    const newBg = new Image();
    newBg.crossOrigin = "anonymous";
    newBg.src = encodeURI(bgPath);
    nextBgRef.current = newBg;

    // if previous background exists and is different, start crossfade
    const prev = prevBgRef.current;
    if (prev && prev.src !== newBg.src) {
      animStartRef.current = performance.now();
      animActiveRef.current = false; // we will mark active when both images are ready
      // when new image loads we mark active
      newBg.onload = () => {
        animActiveRef.current = true;
      };
    } else {
      // no prev image or same image -> set as current immediately when loaded
      newBg.onload = () => {
        prevBgRef.current = newBg;
      };
    }
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

      // draw background image (cover) - support crossfade between prev and next
      const prevBg = prevBgRef.current;
      const nextBg = nextBgRef.current || newBg;
      const drawImageCover = (img: HTMLImageElement) => {
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        const scale = Math.max(w / iw, h / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        const baseDx = Math.floor((w - dw) / 2);
        const baseDy = Math.floor((h - dh) / 2);
        ctx.drawImage(img, baseDx, baseDy, dw, dh);
      };

      if (prevBg && nextBg && animActiveRef.current) {
        // compute progress
        const t = Math.min(1, (now - animStartRef.current) / animDurationRef.current);
        // draw prev with (1 - t)
        ctx.save();
        ctx.globalAlpha = 1 - t;
        if (prevBg.complete && prevBg.naturalWidth) drawImageCover(prevBg);
        ctx.restore();

        // draw next with t
        ctx.save();
        ctx.globalAlpha = t;
        if (nextBg.complete && nextBg.naturalWidth) drawImageCover(nextBg);
        ctx.restore();

        if (t >= 1) {
          // finish animation
          animActiveRef.current = false;
          prevBgRef.current = nextBg;
        }
      } else if (nextBg && nextBg.complete && nextBg.naturalWidth) {
        // no animation active - draw next directly
        drawImageCover(nextBg);
        // subtle dim to make pot stand out
        ctx.fillStyle = "rgba(0,0,0,0.04)";
        ctx.fillRect(0, 0, w, h);
        // ensure prevBg points to current
        prevBgRef.current = nextBg;
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

      // animate pot alpha toward target for smooth show/hide
      potTargetRef.current = potVisible ? 1 : 0;
      // simple eased interpolation
      potAlphaRef.current += (potTargetRef.current - potAlphaRef.current) * 0.14;
      // tiny clamp to avoid sub-pixel work
      if (Math.abs(potAlphaRef.current) < 0.0005) potAlphaRef.current = 0;
      if (Math.abs(1 - potAlphaRef.current) < 0.0005) potAlphaRef.current = 1;

      const potAlpha = potAlphaRef.current;
      if (potAlpha > 0) {
        ctx.save();
        ctx.globalAlpha = potAlpha;
        // subtle pop: when appearing, it rises from below and slightly scales
        const scale = 0.96 + 0.04 * potAlpha;
        const pyAnim = py + (1 - potAlpha) * potH * 0.9;
        drawRealisticPot(ctx, centerX, pyAnim, potW * scale, potH * scale, dpr);
        ctx.restore();
      }

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

      // legacy call removed: pot is now animated above

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
  }, [selectedWeather, potVisible]);

  // timer tick: decrement `timeLeft` each second while running
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // stop when reaches zero
          setRunning(false);
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  // every 5s adjust humidity (visible progress) based on weather
  // Only update when pot is out for drying (`potVisible === true`)
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setHumidity((prev) => {
        // if pot is not out, do not change progress
        if (!potVisible) return prev;

        if (selectedWeather === 'sun') {
          const next = Math.min(100, prev +50);
          if (next >= 100) {
            // success
            const t = timeLeftRef.current ?? 0;
            const stars = t > 60 ? 3 : t > 30 ? 2 : 1;
            setStarCount(stars);
            setShowSuccess(true);
            setRunning(false);
          }
          return next;
        }
        if (selectedWeather === 'cloud') {
          return prev; // no change
        }
        // rain
        const next = prev - 20;
        if (next <= 0) {
          // failure
          setShowFail(true);
          setRunning(false);
          return 0;
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(id);
  }, [running, selectedWeather, potVisible]);

  // confetti: generate burst when showSuccess becomes true
  useEffect(() => {
    if (!showSuccess || challengeMode) {
      setConfetti([]);
      return;
    }
    const colors = ['#F97316','#F59E0B','#10B981','#06B6D4','#7C3AED','#EF4444'];
    const pieces = Array.from({length:24}).map((_, i) => ({
      id: Date.now() + i,
      left: 40 + Math.random() * 20, // spread near center
      delay: Math.floor(Math.random() * 220),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: Math.floor(Math.random() * 360) - 180,
    }));
    setConfetti(pieces);
    const t = setTimeout(() => setConfetti([]), 1600);
    return () => clearTimeout(t);
  }, [showSuccess]);

  // helper to finish level: save progress, unlock next, then notify parent or navigate
  const finishAndNotify = React.useCallback(async (auto=false) => {
    if (finishedRef.current) return
    finishedRef.current = true
    try{ localStorage.setItem('level3_stars', String(starCount)); localStorage.setItem('level3_result','won') }catch{}
    try {
      let userId: number | undefined
      try { const profile = await import('../../../api/services/authService').then(m => m.authService.getProfile()); userId = Number(profile?.user_id ?? profile?.id ?? profile?.userId) } catch { userId = undefined }
      const all = await import('../../../api/levels/levelsService').then(m => m.levelsService.getByVillage(1, userId))
      if (Array.isArray(all)) {
        const current = all.find(x => Number(x.level_number ?? x.level_id ?? x.id) === 3)
        if (current) {
          await import('../../../api/progress/progressService').then(m => m.progressService.saveProgress({ user_id: 1, level_id: Number(current.level_id ?? current.id), status: 'completed', score: 100 }))
          try {
            const currentNum = Number(current.level_number ?? current.level_id ?? current.id)
            const next = all.find(x => Number(x.level_number ?? x.level_id ?? x.id) === (currentNum + 1))
            if (next) {
              const nextId = Number(next.level_id ?? next.id)
              await import('../../../api/progress/progressService').then(m => m.progressService.unlockLevel(nextId))
            }
          } catch (e) { console.warn('unlock next level failed', e) }
        }
      }
    } catch (e) { console.warn('complete level failed', e) }
    setSummaryOpen(false)
    if (onComplete) return onComplete({ stars: starCount })
    if (!auto) navigate('/craft-selection?openName=B%C3%A1t%20Tr%C3%A0ng')
  }, [onComplete, starCount, navigate])

  // Auto-open summary and notify parent when showSuccess occurs inside challenge runner
  useEffect(()=>{
    if (showSuccess && onComplete) {
      if (challengeMode) {
        const id = setTimeout(()=>{ finishAndNotify(true) }, 300)
        return ()=> clearTimeout(id)
      }
      setSummaryOpen(true)
      const id = setTimeout(()=>{ finishAndNotify(true) }, 900)
      return ()=> clearTimeout(id)
    }
  },[showSuccess, onComplete, finishAndNotify])

  // weather durations (seconds)
  const weatherDurations: Record<string, number> = {
    sun: 30,
    cloud: 15,
    rain: 10,
  };

  // reset weather timer when weather changes
  useEffect(() => {
    const dur = weatherDurations[selectedWeather] ?? 30;
    setWeatherTimer(dur);
  }, [selectedWeather]);

  // weather timer tick: decrement while running; auto-advance when reaches 0
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setWeatherTimer((prev) => {
        if (prev <= 1) {
          // advance to next weather
          const order: ("sun" | "cloud" | "rain")[] = ["sun", "cloud", "rain"];
          const idx = order.indexOf(selectedWeather);
          const next = order[(idx + 1) % order.length];
          setSelectedWeather(next);
          // will be reset by selectedWeather effect
          return weatherDurations[next];
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, selectedWeather]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff7ed] via-[#fff1e6] to-[#fff3f0] p-0">
      <div
        ref={containerRef}
        className="relative w-full h-screen overflow-hidden bg-center bg-cover"
      >

        {/* Guide dialog will be rendered inside the left stat column under the time card */}
        {/* Confetti layer */}
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
          
        </div>

        {/* left stat cards */}
        <div className="absolute left-8 top-28 z-40 space-y-4 w-[360px]">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">Độ ẩm</div>
                <div className="text-2xl font-semibold text-[#1e3a8a]">
                  {humidity}%
                </div>
              </div>
                  <div className="w-44">
                <div className="progress-wrap">
                  <div className="progress-track">
                    <div
                      className={`progress-fill ${humidity <= 20 ? 'low' : ''}`}
                      style={{ width: `${humidity}%` }}
                    />
                  </div>
                  {/* removed dry progress label as requested */}
                </div>
              </div>
            </div>
          </div>

          {/* Nguy cơ nứt removed — UI simplified */}

          <div className="stat-card flex items-center justify-between">
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
          {/* Guide dialog placed directly under the time card */}
          {!challengeMode && (
          <div style={{ marginTop: 8 }}>
            <GuideDialog
              started={started}
              showRequireStart={true}
              win={showSuccess}
              progress={Math.round(humidity)}
              phase="phase3"
              weather={selectedWeather}
              event={!started ? undefined : (selectedWeather === 'rain' ? 'raining' : (weatherTimer <= 5 ? 'soon_sunny' : 'started'))}
              onNext={() => {}}
              avatarFirst={true}
            />
          </div>
          )}
        </div>

        {/* right weather panel (redesigned) */}
        <div className="absolute right-8 top-28 z-40 w-80">
          <div className="weather-card text-white rounded-xl p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold">THỜI TIẾT</div>
              <div className={`weather-timer text-xs font-bold px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm ${weatherTimer <= 5 ? 'weather-timer-warning' : ''}`}>
                {String(Math.floor(weatherTimer / 60)).padStart(2, "0")}:{String(weatherTimer % 60).padStart(2, "0")}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button
                disabled
                aria-pressed={selectedWeather === "sun"}
                className={`weather-option ${selectedWeather === "sun" ? "selected" : ""} opacity-90 cursor-not-allowed`}
              >
                <div className="flex items-center gap-3">
                  <div className="weather-ico-svg sun" aria-hidden>
                    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <radialGradient id="g1" cx="50%" cy="35%">
                          <stop offset="0%" stopColor="#FFF9E3" />
                          <stop offset="100%" stopColor="#FFB84D" />
                        </radialGradient>
                      </defs>
                      <circle cx="22" cy="22" r="9" fill="url(#g1)" />
                      <g className="sun-rays" stroke="#FFB84D" strokeWidth="2" strokeLinecap="round">
                        <line x1="22" y1="2" x2="22" y2="10" />
                        <line x1="22" y1="34" x2="22" y2="42" />
                        <line x1="2" y1="22" x2="10" y2="22" />
                        <line x1="34" y1="22" x2="42" y2="22" />
                        <line x1="8" y1="8" x2="14" y2="14" />
                        <line x1="30" y1="30" x2="36" y2="36" />
                        <line x1="8" y1="36" x2="14" y2="30" />
                        <line x1="30" y1="14" x2="36" y2="8" />
                      </g>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Nắng</div>
                    <div className="text-xs text-gray-600">Giảm độ ẩm — nhanh khô</div>
                  </div>
                </div>
              </button>

              <button
                disabled
                aria-pressed={selectedWeather === "cloud"}
                className={`weather-option ${selectedWeather === "cloud" ? "selected" : ""} opacity-90 cursor-not-allowed`}
              >
                <div className="flex items-center gap-3">
                  <div className="weather-ico-svg cloud" aria-hidden>
                    <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 26c-3-6 4-13 11-10 6-3 14 2 12 9" fill="#E6EEF2" stroke="#BFCFD8" strokeWidth="1.5" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Âm u</div>
                    <div className="text-xs text-gray-600">Ổn định, hơi ẩm</div>
                  </div>
                </div>
              </button>

              <button
                disabled
                aria-pressed={selectedWeather === "rain"}
                className={`weather-option ${selectedWeather === "rain" ? "selected" : ""} opacity-90 cursor-not-allowed`}
              >
                <div className="flex items-center gap-3">
                  <div className="weather-ico-svg rain" aria-hidden>
                    <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 20c-3-6 4-11 11-8 6-3 14 1 12 8" fill="#DCEFF9" stroke="#9EC7DD" strokeWidth="1.4" />
                      <g className="drops" fill="#7DB7E6">
                        <rect x="14" y="28" width="2.6" height="6" rx="1" />
                        <rect x="22" y="30" width="2.6" height="6" rx="1" />
                        <rect x="30" y="27" width="2.6" height="6" rx="1" />
                      </g>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Mưa</div>
                    <div className="text-xs text-gray-600">Tăng độ ẩm — chậm khô</div>
                  </div>
                </div>
              </button>
            </div>
            {/* Pot toggle placed under weather options (visually under 'Mưa') */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setPotVisible((v) => !v)}
                aria-pressed={!potVisible}
                className={`flex items-center gap-3 px-4 py-2 rounded-full text-white font-semibold shadow-2xl transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-30 ${
                  potVisible
                    ? 'bg-gradient-to-r from-[#ff7b00] to-[#ffb86b] hover:scale-105 ring-0'
                    : 'bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] hover:scale-105 ring-0'
                }`}
              >
                <span className={`w-5 h-5 inline-flex ${potVisible ? '' : ''}`}>
                  {potVisible ? (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                      <path d="M12 2v7" stroke="white" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M5 11l7 7 7-7" stroke="white" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                      <path d="M12 22V15" stroke="white" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M19 13l-7-7-7 7" stroke="white" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>

                <span className="whitespace-nowrap">
                  {potVisible ? 'Đưa gốm vào' : 'Đưa gốm ra'}
                </span>
                <span className={`ml-1 w-2 h-2 rounded-full ${potVisible ? 'bg-white/30 animate-pulse' : 'bg-white/20'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* bottom controls removed (retry button relocated/removed) */}

        {/* top-right controls: start/pause next to exit */}
        <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
          {!running ? (
            <button
                onClick={() => {
                  // Only perform initial reset the first time the level is started.
                  if (!startedRef.current) {
                    setShowFail(false);
                    setHumidity(0);
                    setSelectedWeather(INITIAL_WEATHER);
                    setWeatherTimer(30);
                    startedRef.current = true;
                  }
                  setStarted(true);
                  setRunning(true);
                }}
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
            onClick={() => navigate("/craft-selection")}
            className="px-3 py-2 bg-white rounded-lg shadow"
          >
            Thoát
          </button>
        </div>
        {/* pot toggle moved into weather panel */}
        {showSuccess && !challengeMode && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-6">
            <style>{`@keyframes popIn { from { transform: scale(.92); opacity: 0 } to { transform: scale(1); opacity: 1 } } @keyframes floatUp { 0%{ transform: translateY(8px)} 50%{transform:translateY(0)} 100%{transform:translateY(6px)} }`}</style>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => {}} />
            <div className="relative z-50 max-w-lg w-full mx-auto">
              <div className="bg-gradient-to-br from-emerald-50 to-white rounded-3xl shadow-2xl border-2 border-emerald-100 overflow-hidden" style={{animation:'popIn 320ms cubic-bezier(.2,.9,.2,1) both'}}>
                <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-emerald-500 to-[#34d399] text-white">
                  <div className="bg-white/20 rounded-full p-3 flex items-center justify-center">
                    <div style={{width:40,height:40,display:'flex',alignItems:'center',justifyContent:'center',animation:'floatUp 1400ms ease-in-out infinite'}}>
                      <span style={{fontSize:22}}>🏅</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold">Hoàn thành!</h3>
                    <p className="text-sm opacity-90">Gốm đã khô hoàn toàn — chúc mừng bạn.</p>
                  </div>
                </div>

                <div className="p-6 bg-white">
                  <p className="text-gray-700 text-center mb-6">Bạn hoàn thành màn này. Xem tổng kết để nhận sao hoặc chơi lại.</p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => { if (challengeMode) { setShowSuccess(false); finishAndNotify(false); return } setShowSuccess(false); setSummaryOpen(true); }}
                      className="px-5 py-2 rounded-2xl bg-white border border-gray-200 text-gray-700 hover:shadow-lg transition"
                    >
                      Tổng kết
                    </button>

                      <button
                        onClick={() => {
                          setShowSuccess(false);
                          setHumidity(0);
                          setTimeLeft(INITIAL_TIME);
                          setSelectedWeather(INITIAL_WEATHER);
                          setWeatherTimer(30);
                          setRunning(false);
                          startedRef.current = false;
                          setStarted(false);
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
              <div style={{color:'#7a5236',marginBottom:14}}>chúc mừng bạn đã hoàn thành level 3</div>
              <div style={{display:'flex',justifyContent:'center',gap:12,marginBottom:14}}>
                  {[1,2,3].map(i=> (
                    <span key={i} style={{fontSize:46, transform: i<=starCount ? 'scale(1.06)' : 'scale(.92)', transition:'transform 260ms cubic-bezier(.2,.9,.2,1)', color: i<=starCount ? '#6b3f1a' : '#e9dfd4'}} aria-hidden>
                      {i<=starCount ? '★' : '☆'}
                    </span>
                  ))}
              </div>
              <div style={{color:'#5b3a26',marginBottom:10}}>Độ khô: <strong>{Math.round(humidity)}%</strong></div>
              <div style={{color:'#5b3a26',marginBottom:18}}>Thời gian còn lại: <strong>{timeLeft}s</strong></div>
              <div style={{display:'flex',gap:12,justifyContent:'center'}}>
                <button onClick={async ()=>{
                  try{ localStorage.setItem('level3_stars', String(starCount)); localStorage.setItem('level3_result','won') }catch{}
                  try {
                    let userId: number | undefined
                    try { const profile = await import('../../../api/services/authService').then(m => m.authService.getProfile()); userId = Number(profile?.user_id ?? profile?.id ?? profile?.userId) } catch { userId = undefined }
                    const all = await import('../../../api/levels/levelsService').then(m => m.levelsService.getByVillage(1, userId))
                    if (Array.isArray(all)) {
                      const current = all.find(x => Number(x.level_number ?? x.level_id ?? x.id) === 3)
                      if (current) {
                        await import('../../../api/progress/progressService').then(m => m.progressService.saveProgress({ user_id: 1, level_id: Number(current.level_id ?? current.id), status: 'completed', score: 100 }))
                        try {
                          // attempt to unlock the next level (level_number + 1)
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
                  if (onComplete) { try { onComplete({ stars: starCount }) } catch (e) {} ; if (challengeMode) return }
                  navigate('/craft-selection?openName=B%C3%A1t%20Tr%C3%A0ng');
                }} style={{padding:'10px 18px',background:'linear-gradient(90deg,#10b981,#06a86b)',color:'white',borderRadius:12,border:'none',fontWeight:800}}>Hoàn tất</button>
                <button onClick={()=>{ setSummaryOpen(false); setShowSuccess(false); setHumidity(0); setTimeLeft(INITIAL_TIME); setSelectedWeather(INITIAL_WEATHER); setWeatherTimer(30); startedRef.current = false; setStarted(false); navigate('/bat-trang/level-3'); }} style={{padding:'10px 18px',background:'white',borderRadius:12,border:'1px solid rgba(0,0,0,0.06)',fontWeight:700}}>Chơi lại</button>
              </div>
            </div>
          </div>
        )}

        {/* pot toggle moved into weather panel */}
        {showFail && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => {}} />
            <div className="relative z-50 max-w-lg w-full mx-auto">
              <div className="bg-gradient-to-br from-red-50 to-white rounded-3xl shadow-2xl border-2 border-red-100 overflow-hidden">
                <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-red-500 to-[#ff7b7b] text-white">
                  <div className="bg-white/20 rounded-full p-3 flex items-center justify-center">
                    <svg className="w-10 h-10 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2v7" stroke="white" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M5 11l7 7 7-7" stroke="white" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M3 3l18 18" stroke="rgba(255,255,255,0.25)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold">Thất bại</h3>
                    <p className="text-sm opacity-90">Gốm bị ướt quá mức — tiến độ đã giảm xuống 0.</p>
                  </div>
                </div>

                <div className="p-6 bg-white">
                  <p className="text-gray-700 text-center mb-6">Bạn có thể thử phơi lại hoặc thoát về danh sách làng nghề.</p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => {
                        triggerEvent({
                          event: 'retry_step',
                          level: 3,
                          step: 3,
                          village_name: 'Bát Tràng',
                        }).catch(() => {});
                        setHumidity(50);
                        setShowFail(false);
                        setTimeLeft(INITIAL_TIME);
                        setSelectedWeather(INITIAL_WEATHER);
                        setWeatherTimer(30);
                        setRunning(false);
                        startedRef.current = false;
                        setStarted(false);
                      }}
                      className="px-5 py-2 rounded-2xl bg-white border border-gray-200 text-gray-700 hover:shadow-lg transition"
                    >
                      Thử lại
                    </button>

                    <button
                      onClick={() => {
                        setHumidity(50);
                        setShowFail(false);
                        navigate('/craft-selection');
                      }}
                      className="px-5 py-2 rounded-2xl bg-red-600 text-white hover:bg-red-700 transition shadow-lg"
                    >
                      Thoát
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
