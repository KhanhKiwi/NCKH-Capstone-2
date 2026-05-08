import { useEffect, useRef, useState, useCallback } from 'react'
import { levelsService } from '../../../api/levels/levelsService'
import { progressService } from '../../../api/progress/progressService'
import { useNavigate } from 'react-router'
import confetti from 'canvas-confetti'
import GuideDialog from '../../../util/shared/GuideDialog'

export default function BatTrangLevel2({ onComplete, challengeMode }: { onComplete?: (result?: any) => void, challengeMode?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [state, setState] = useState<'idle'|'playing'|'paused'|'won'|'lost'>('idle')
  const [progress, setProgress] = useState(0) // 0..1
  const [timeLeft, setTimeLeft] = useState(60)
  const required = useRef(650)
  const work = useRef(0)
  const angleRef = useRef(0)
  const last = useRef<{x:number,y:number}|null>(null)
  const pullStarted = useRef(false)
  const pullStartPos = useRef<{x:number,y:number}|null>(null)
  const pullParallelLast = useRef<number | null>(null)
  const rodFollowTolerance = useRef(0.35) // fraction of baseR
  const rodAngle = useRef(-Math.PI/2) // fixed direction: upward from center
  const rodLenRef = useRef<number>(0)
  const rodTargetLen = useRef<number>(0)
  const rodAnimating = useRef(false)
  const rodVisible = useRef(false)
  const pullPenaltyApplied = useRef(false)
  const flashStart = useRef<number | null>(null)
  const navigate = useNavigate()
  const [topShift, setTopShift] = useState(0)

  // If this screen is embedded under the challenge runner, detect the runner header
  // and shift absolute-positioned elements so the game sits 20px below it.
  useEffect(()=>{
    function compute(){
      try{
        const headers = Array.from(document.querySelectorAll('h2'))
        const runnerHeader = headers.find(h => (h.textContent||'').includes('Chế độ Thử thách'))
        if (!runnerHeader) { setTopShift(0); return }
        const rect = runnerHeader.getBoundingClientRect()
        const desiredTop = rect.bottom + 20 + window.scrollY
        // header card normally uses top:28, game container top:120 — compute shift to apply
        const baseHeaderTop = 28
        const shift = Math.max(0, desiredTop - baseHeaderTop)
        setTopShift(shift)
      }catch(e){ setTopShift(0) }
    }
    compute()
    // sometimes the runner header isn't present immediately; recompute shortly after
    const t = window.setTimeout(()=>{
      try{ compute(); requestAnimationFrame(compute) }catch(e){}
    }, 120)
    window.addEventListener('resize', compute)
    window.addEventListener('scroll', compute)
    return ()=>{ window.clearTimeout(t); window.removeEventListener('resize', compute); window.removeEventListener('scroll', compute) }
  },[])
  const stateRef = useRef(state)
  const progressRef = useRef(progress)
  const pullTrail = useRef<Array<{x:number,y:number,t:number}>>([])
  const particles = useRef<Array<{x:number,y:number,vx:number,vy:number,life:number,maxLife:number,size:number,color:string}>>([])
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [starCount, setStarCount] = useState(3)
  const finishedRef = useRef(false)

  useEffect(()=>{ document.title = 'Bát Tràng — Level 2: Tạo hình' }, [])

  // keep refs synced so animation loop can read current values without restarting
  useEffect(()=>{ stateRef.current = state },[state])
  useEffect(()=>{ progressRef.current = progress },[progress])

  // animation loop independent of React state updates
  useEffect(()=>{
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')!

    function resize(){ c.width = c.clientWidth; c.height = c.clientHeight }
    resize(); window.addEventListener('resize', resize)

    let t = 0
    let rafId: number | null = null
    function frame(){
      t += 0.016
      const w = c.width, h = c.height
      ctx.clearRect(0,0,w,h)

      // background
      ctx.fillStyle = '#fff7ed'
      ctx.fillRect(0,0,w,h)

      // center coords and sizes
      const cx = w/2, cy = h/2
      // increase clay blob size by 20%
      const baseR = Math.min(w,h)*0.18 * 1.2

      // compute rotation angle (radians) independent of React state changes
      const angle = t * 0.9
      angleRef.current = angle

      // read current state from ref for jitter behavior
      const curState = stateRef.current

      // draw pull trail (fading)
      if (pullTrail.current.length > 1) {
        ctx.save()
        ctx.translate(cx, cy)
        ctx.lineCap = 'round'
        for (let i = 0; i < pullTrail.current.length - 1; i++) {
          const a = pullTrail.current[i]
          const b = pullTrail.current[i+1]
          const age = (performance.now() - a.t) / 800
          const alpha = Math.max(0, 1 - age)
          if (alpha <= 0) continue
          ctx.strokeStyle = `rgba(255,245,235,${alpha.toFixed(3)})`
          ctx.lineWidth = 10 * alpha
          ctx.beginPath()
          ctx.moveTo(a.x - cx, a.y - cy)
          ctx.lineTo(b.x - cx, b.y - cy)
          ctx.stroke()
        }
        ctx.restore()
      }

      // player clay blob (radial, rotated) with elastic offset while pulling
      ctx.save()
      let offsetX = 0, offsetY = 0
      if (pullStarted.current && pullStartPos.current && last.current) {
        const dx = last.current.x - pullStartPos.current.x
        const dy = last.current.y - pullStartPos.current.y
        offsetX = dx * 0.18
        offsetY = dy * 0.18
      }
      ctx.translate(cx + offsetX, cy + offsetY)
      ctx.rotate(angle)
      const jitter = curState === 'idle' ? Math.sin(t*1.8)*0.02 : 0
      const grad = ctx.createRadialGradient(-baseR*0.2, -baseR*0.25, baseR*0.06, 0, 0, baseR*1.6)
      grad.addColorStop(0,'#f6d8bb'); grad.addColorStop(0.5,'#d79a6a'); grad.addColorStop(1,'#98512b')
      ctx.fillStyle = grad
      ctx.beginPath(); ctx.ellipse(0, 0, baseR*(1+0.04*jitter), baseR*1.05, 0, 0, Math.PI*2); ctx.fill()
      ctx.restore()

      // draw fixed rod (pull tab) protruding from center — only when visible or animating
      if (rodVisible.current || rodAnimating.current) {
        // initialize animation targets once
        if (rodLenRef.current === 0 && rodTargetLen.current === 0) {
          rodLenRef.current = baseR * 0.9
          rodTargetLen.current = baseR * 0.9
        }
        // smooth lerp towards target length
        rodLenRef.current += (rodTargetLen.current - rodLenRef.current) * 0.18
        const rodLen = rodLenRef.current
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(rodAngle.current)
        // blurred, faded rod
        ctx.filter = 'blur(3px)'
        ctx.globalAlpha = 0.85
        ctx.lineWidth = 6
        ctx.strokeStyle = 'rgba(75,40,20,0.6)'
        ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(rodLen, 0); ctx.stroke()
        // faded knob at tip
        ctx.fillStyle = 'rgba(245,158,11,0.88)'
        ctx.beginPath(); ctx.arc(rodLen, 0, Math.max(8, baseR*0.06), 0, Math.PI*2); ctx.fill()
        ctx.filter = 'none'
        ctx.globalAlpha = 1
        ctx.restore()
      }

      // success flash ring (when player completes a pull)
      if (flashStart.current) {
        const elapsed = (performance.now() - flashStart.current) / 420
        if (elapsed < 1) {
          ctx.save()
          const r = baseR * (1 + 0.6 * elapsed)
          ctx.globalAlpha = 1 - elapsed
          ctx.lineWidth = 8 * (1 - elapsed)
          ctx.strokeStyle = 'rgba(255,255,255,0.9)'
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.stroke()
          ctx.restore()
        }
      }

      // update & draw particles
      if (particles.current.length) {
        ctx.save()
        for (let i = particles.current.length - 1; i >= 0; i--) {
          const p = particles.current[i]
          p.x += p.vx
          p.y += p.vy
          p.vy += 0.12
          p.life -= 1
          if (p.life <= 0) { particles.current.splice(i,1); continue }
          ctx.globalAlpha = Math.max(0, p.life / p.maxLife)
          ctx.fillStyle = p.color
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill()
        }
        ctx.restore()
      }

      // animation tick
      rafId = requestAnimationFrame(frame)
    }
    rafId = requestAnimationFrame(frame)
    return ()=>{ window.removeEventListener('resize', resize); if (rafId) cancelAnimationFrame(rafId) }
  },[])

  const spawnWork = useCallback((dx:number,dy:number)=>{
    const amt = Math.min(3.2, Math.hypot(dx,dy)*0.06)
    work.current = Math.min(1e6, work.current + amt)
    const pr = Math.min(1, work.current / required.current)
    setProgress(pr)
    if (pr >= 1) setState('won')
  },[])

  // add or subtract progress by fraction of required (e.g. 1/15 ≈ +6.67%)
  const addWorkFraction = useCallback((fraction:number)=>{
    work.current = Math.max(0, work.current + required.current * fraction)
    const pr = Math.min(1, work.current / required.current)
    setProgress(pr)
    if (pr >= 1) setState('won')
  }, [])

  useEffect(()=>{
    const c = canvasRef.current; if (!c) return
    function toLocal(e:PointerEvent){ const r=c.getBoundingClientRect(); return {x:e.clientX-r.left, y:e.clientY-r.top} }

    const down = (e:PointerEvent)=>{
      if (state !== 'playing') return
      const p = toLocal(e)
      c.setPointerCapture(e.pointerId)
      last.current = p
      // detect if started inside clay
      const w = c.width, h = c.height
      const cx = w/2, cy = h/2
      const baseR = Math.min(w,h)*0.18 * 1.2
      const d = Math.hypot(p.x-cx, p.y-cy)
      if (d <= baseR) {
        // start pulling; initialize parallel projection along rod
        pullStarted.current = true
        pullStartPos.current = p
        pullPenaltyApplied.current = false
        // compute initial parallel value along fixed rod direction
        const ang = rodAngle.current
        const ux = Math.cos(ang), uy = Math.sin(ang)
        const vx = p.x - cx, vy = p.y - cy
        const parallel = vx * ux + vy * uy
        pullParallelLast.current = parallel
      } else {
        pullStarted.current = false
        pullStartPos.current = null
        pullParallelLast.current = null
      }
    }

    const move = (e:PointerEvent)=>{
      if (state !== 'playing') return
      if (e.buttons === 0) return
      const p = toLocal(e)
      // update last for potential legacy behavior
      last.current = p
      if (pullStarted.current) {
        pullTrail.current.push({ x: p.x, y: p.y, t: performance.now() })
        // trim trail by time and length
        const now = performance.now()
        while (pullTrail.current.length && now - pullTrail.current[0].t > 900) pullTrail.current.shift()
        while (pullTrail.current.length > 80) pullTrail.current.shift()
        // compute projection along rod and perpendicular distance
        const w = c.width, h = c.height
        const cx = w/2, cy = h/2
        const baseR = Math.min(w,h)*0.18 * 1.2
        const ang = rodAngle.current
        const ux = Math.cos(ang), uy = Math.sin(ang)
        const vx = p.x - cx, vy = p.y - cy
        const parallel = vx * ux + vy * uy
        const perpX = vx - parallel * ux
        const perpY = vy - parallel * uy
        const perpDist = Math.hypot(perpX, perpY)
        const tol = rodFollowTolerance.current * baseR
        // compute signed delta along rod since last sample
        const deltaSigned = pullParallelLast.current != null ? (parallel - pullParallelLast.current) : 0
        if (perpDist <= tol && pullParallelLast.current != null) {
          if (deltaSigned > 2) {
            // correct forward movement along rod -> spawn incremental work
            spawnWork(deltaSigned, 0)
            pullParallelLast.current = parallel
          } else if (deltaSigned < -2) {
            // moving backwards along rod -> apply a single pull penalty (-1/15)
            if (!pullPenaltyApplied.current) {
              addWorkFraction(-1/15)
              pullPenaltyApplied.current = true
            }
            pullParallelLast.current = parallel
          }
        } else {
          // off-rod: apply a single pull penalty when straying far
          if (Math.abs(deltaSigned) > 1 && !pullPenaltyApplied.current) {
            addWorkFraction(-1/15)
            pullPenaltyApplied.current = true
            pullParallelLast.current = parallel
          }
        }
      }
    }

    const up = (e:PointerEvent)=>{
      try{ if (typeof c.releasePointerCapture === 'function') c.releasePointerCapture(e.pointerId) }catch{}
      const p = toLocal(e)
      if (pullStarted.current) {
        // compute if released sufficiently along rod direction and close enough
        const w = c.width, h = c.height
        const cx = w/2, cy = h/2
        const baseR = Math.min(w,h)*0.18 * 1.2
        const ang = rodAngle.current
        const ux = Math.cos(ang), uy = Math.sin(ang)
        const vx = p.x - cx, vy = p.y - cy
        const parallel = vx * ux + vy * uy
        const perpX = vx - parallel * ux
        const perpY = vy - parallel * uy
        const perpDist = Math.hypot(perpX, perpY)
        const tol = rodFollowTolerance.current * baseR
        // require release near the rod tip (limit to outer clay circle)
        const successThreshold = baseR * 0.9
        if (parallel >= successThreshold && perpDist <= tol) {
          // successful pull -> +1/15 progress (need 15 pulls)
          addWorkFraction(1/15)
          // brief flash animation
          flashStart.current = performance.now()
          setTimeout(()=>{ flashStart.current = null }, 420)
          // spawn particles at release point
          const palette = ['#FFEDD5','#F97316','#FDBA74','#FDE68A','#C2410C']
          const count = 18
          for (let i = 0; i < count; i++) {
            const ang = Math.random() * Math.PI * 2
            const sp = 2 + Math.random() * 4
            particles.current.push({ x: p.x, y: p.y, vx: Math.cos(ang)*sp, vy: Math.sin(ang)*sp - 1.8, life: 40 + Math.floor(Math.random()*30), maxLife: 40 + Math.floor(Math.random()*30), size: 2 + Math.random()*4, color: palette[Math.floor(Math.random()*palette.length)] })
          }
          // clear trail quickly
          setTimeout(()=>{ pullTrail.current = [] }, 140)
          // retract rod and spawn a new rod in a different direction
          rodTargetLen.current = 0
          rodAnimating.current = true
          setTimeout(()=>{
            // pick a new angle rotated by random 60..160 deg
            const delta = (Math.PI/180) * (60 + Math.random()*100)
            const sign = Math.random() < 0.5 ? -1 : 1
            rodAngle.current = rodAngle.current + sign * delta
            // restore length
            rodTargetLen.current = baseR * 0.9
            rodAnimating.current = false
          }, 420)
        }
      }
      pullStarted.current = false
      pullStartPos.current = null
      pullParallelLast.current = null
      pullPenaltyApplied.current = false
      last.current = null
    }

    c.addEventListener('pointerdown', down); c.addEventListener('pointermove', move); c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up)
    return ()=>{ c.removeEventListener('pointerdown', down); c.removeEventListener('pointermove', move); c.removeEventListener('pointerup', up); c.removeEventListener('pointercancel', up) }
  },[state])

  // confetti on win
  useEffect(()=>{
    if (state === 'won' && !challengeMode) {
      try { confetti({ particleCount: 120, spread: 70, origin: { y: 0.4 } }) } catch(e){}
    }
  },[state])

  // compute star rating when the player wins (user requested thresholds)
  useEffect(()=>{
    if (state !== 'won') return
    const s = timeLeft > 40 ? 3 : timeLeft > 20 ? 2 : 1
    setStarCount(s)
  },[state, timeLeft])

  // helper to finish level: save progress, unlock next, then notify parent or navigate
  const finishAndNotify = useCallback(async (triggeredByAuto = false) => {
    if (finishedRef.current) return
    finishedRef.current = true
    try{ localStorage.setItem('screen2_phase1_stars', String(starCount)); localStorage.setItem('screen2_phase1_result','won') }catch{}
    try {
      let userId: number | undefined
      try { const profile = await import('../../../api/services/authService').then(m => m.authService.getProfile()); userId = Number(profile?.user_id ?? profile?.id ?? profile?.userId) } catch { userId = undefined }
      const all = await levelsService.getByVillage(1, userId)
      if (Array.isArray(all)) {
        const current = all.find(x => Number(x.level_number ?? x.level_id ?? x.id) === 2)
        if (current) {
          const score = starCount === 3 ? 100 : starCount === 2 ? 70 : 40
          await progressService.saveProgress({ user_id: 1, level_id: Number(current.level_id ?? current.id), status: 'completed', score })
          try {
            const curNum = Number(current.level_number ?? current.level_id ?? current.id)
            const next = all.find(x => Number(x.level_number ?? x.level_id ?? x.id) === curNum + 1)
            if (next) {
              const nextId = Number(next.level_id ?? next.id)
              if (nextId) await progressService.unlockLevel(nextId)
            }
          } catch (er) { console.warn('unlock next level failed', er) }
        }
      }
    } catch (e) { console.warn('complete level failed', e) }
    setSummaryOpen(false)
    if (onComplete) return onComplete({ stars: starCount })
    if (!triggeredByAuto) navigate('/craft-selection?openName=B%C3%A1t%20Tr%C3%A0ng')
  }, [onComplete, starCount, navigate])

  // auto-finish when won and embedded in runner (onComplete present)
  useEffect(()=>{
    if (state === 'won' && onComplete) {
      if (challengeMode) {
        const id = setTimeout(()=>{ finishAndNotify(true) }, 300)
        return ()=> clearTimeout(id)
      }
      // small delay so confetti/animations show briefly
      const id = setTimeout(()=>{ finishAndNotify(true) }, 900)
      return ()=> clearTimeout(id)
    }
  },[state, onComplete, finishAndNotify, challengeMode])

  const start = ()=>{ work.current = 0; setProgress(0); required.current = 650; setTimeLeft(60); setState('playing'); rodVisible.current = true; rodLenRef.current = 0; rodTargetLen.current = 0; rodAngle.current = -Math.PI/2 }
  const pause = ()=> setState('paused')
  const resume = ()=> setState('playing')
  const reset = ()=>{ work.current = 0; setProgress(0); setTimeLeft(60); setState('idle'); rodVisible.current = false; rodTargetLen.current = 0; rodLenRef.current = 0 }

  // timer effect: runs only when `state` is 'playing'
  useEffect(()=>{
    if (state !== 'playing') return
    const id = setInterval(()=>{
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(id); setState('lost'); return 0 }
        return t-1
      })
    }, 1000)
    return ()=>clearInterval(id)
  },[state])

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-amber-50 to-white py-6">
      <div className="max-w-4xl mx-auto px-6 h-full flex flex-col">
        {/* Header card (top center) */}
        <div style={{position:'absolute',left:'50%',top:28 + topShift,transform:'translateX(-50%)',width:'min(920px,92%)',zIndex:40}}>
          <div style={{background:'linear-gradient(90deg,#fffaf0,#fff7ed)',borderRadius:18,padding:'18px 20px',boxShadow:'0 18px 48px rgba(0,0,0,0.12)',border:'1px solid rgba(201,166,107,0.12)',display:'flex',gap:16,alignItems:'center'}} className="fade-in-up">
            <div style={{width:56,height:56,borderRadius:12,background:'linear-gradient(135deg,#f59e0b,#d97706)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,boxShadow:'0 8px 22px rgba(213,125,42,0.18)'}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M12 2c2.5 0 4 1.5 4 3.5S14.5 9 12 9s-4-2-4-3.5S9.5 2 12 2z" fill="rgba(255,255,255,0.95)" />
                <path d="M4 12c0 4 3 8 8 8s8-4 8-8c0-1.2-.9-2-2-2H6c-1.1 0-2 .8-2 2z" fill="rgba(255,255,255,0.85)" />
              </svg>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:22,fontWeight:800,color:'#7a2f00',lineHeight:1.05}}>Level 2 — Tạo hình</div>
              <div style={{marginTop:6,color:'#8a6b4e'}}>Kéo và nắn đất để tạo hình — luyện tay để tạo bề mặt mịn và đẹp.</div>
            </div>
            <div style={{marginLeft:12}}>
              <span style={{display:'inline-block',background:'#fff3cd',color:'#92400e',padding:'8px 12px',borderRadius:999,fontWeight:700}}>Thực hành • Tương tác</span>
            </div>
          </div>
          <style>{`.fade-in-up { animation: fadeInUp 520ms cubic-bezier(.2,.9,.2,1) both } @keyframes fadeInUp { from { transform: translateY(8px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }`}</style>
        </div>

        <div style={{position:'absolute',left:'50%',top:120 + topShift,transform:'translateX(-50%)',width:900,maxWidth:'92%',height:600,borderRadius:20,background:'linear-gradient(135deg,#fffaf0,#fff7ed)',border:'10px solid #C9A66B',boxShadow:'0 30px 80px rgba(0,0,0,0.25)',zIndex:20}}>
          <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <canvas ref={canvasRef} style={{width:'100%',height:'100%',display:'block',borderRadius:12}} />
          </div>

          {/* time pill (visible) */}
          <div style={{position:'absolute',left:20,top:20,display:'flex',gap:12}}>
            <div style={{padding:'10px 14px',borderRadius:14,background: timeLeft <= 10 ? '#ef4444' : '#fff',boxShadow: timeLeft <= 10 ? '0 10px 30px rgba(239,68,68,0.18)' : '0 8px 24px rgba(0,0,0,0.06)', transition: 'all 220ms ease'}}>
              <div style={{fontSize:11,color: timeLeft <= 10 ? '#fff' : '#8a6b4e',fontWeight:700}}>Thời gian</div>
              <div style={{fontSize:15,fontWeight:800,color: timeLeft <= 10 ? '#fff' : '#000', animation: timeLeft <= 10 ? 'shake 700ms ease-in-out infinite' : undefined}}>{timeLeft}s</div>
            </div>
          </div>

          <div style={{position:'absolute',right:20,top:20}}>
            <div style={{display:'flex',gap:8,background:'rgba(255,255,255,0.96)',padding:8,borderRadius:14,boxShadow:'0 10px 30px rgba(0,0,0,0.05)'}}>
              <button
                onClick={() => { if (state === 'idle') start(); else if (state === 'playing') pause(); else if (state === 'paused') resume(); }}
                style={{padding:'10px 16px',background: '#f59e0b',color: 'white',borderRadius:12,fontWeight:800,border: 'none',transform: undefined,transition: 'transform 160ms ease, box-shadow 160ms ease',boxShadow: '0 6px 18px rgba(245,158,11,0.12)'}}
              >
                {state === 'idle' ? 'Bắt đầu' : state === 'playing' ? 'Tạm dừng' : 'Tiếp tục'}
              </button>
              <button onClick={reset} style={{padding:'8px 12px',borderRadius:10,border:'1px solid rgba(0,0,0,0.06)',background:'white'}}>Reset</button>
            </div>
          </div>

          <div className="absolute left-6 bottom-6 right-6">
            <div className="bg-white/90 p-3 rounded-md shadow flex items-center gap-4">
              <div className="text-sm font-medium text-amber-700">Tiến độ</div>
              <div className="flex-1 mx-2">
                <div className="w-full bg-amber-100/60 rounded-full h-4 overflow-hidden" style={{boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.06)'}}>
                  <div className="h-4 rounded-full" style={{width:`${Math.round(progress*100)}%`, background: 'linear-gradient(90deg,#f59e0b,#f97316,#10b981)', transition: 'width 300ms ease'}} />
                </div>
              </div>
              <div className="text-sm font-semibold text-amber-800" aria-live="polite">{Math.round(progress*100)}%</div>
            </div>
          </div>

          {state === 'won' && !challengeMode && (
            <div className="absolute inset-0 flex items-center justify-center z-80">
              <style>{`@keyframes popIn { from { transform: scale(.92); opacity: 0 } to { transform: scale(1); opacity: 1 } }`}</style>
              <div style={{width:360,background:'linear-gradient(180deg,#ffffff,#f8fff7)',padding:22,borderRadius:16,boxShadow:'0 30px 90px rgba(20,30,10,0.22)',textAlign:'center',animation:'popIn 320ms cubic-bezier(.2,.9,.2,1) both',border:'1px solid rgba(0,0,0,0.06)'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'center',marginBottom:12}}>
                  <div style={{width:72,height:72,borderRadius:999,display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(180deg,#fff7f0,#fffbf6)',boxShadow:'0 10px 30px rgba(245,158,11,0.12)',marginRight:12}}>
                    <span style={{fontSize:34}}>🏅</span>
                  </div>
                  <div style={{textAlign:'left'}}>
                    <h2 style={{margin:'0 0 6px',fontSize:22,color:'#6b3f1a'}}>Hoàn thành!</h2>
                    <div style={{color:'#7a5236'}}>Bạn đã tạo hình thành công.</div>
                  </div>
                </div>
                <div style={{display:'flex',gap:12,justifyContent:'center',marginTop:16}}>
                  <button onClick={() => {
                    if (challengeMode) {
                      finishAndNotify(false)
                      return
                    }
                    setSummaryOpen(true)
                  }} style={{padding:'10px 18px',background:'linear-gradient(90deg,#10b981,#06a86b)',color:'white',borderRadius:12,border:'none',fontWeight:800,boxShadow:'0 10px 30px rgba(16,185,129,0.18)'}}>Tổng kết</button>
                  <button onClick={reset} style={{padding:'10px 18px',background:'white',borderRadius:12,border:'1px solid rgba(0,0,0,0.06)',fontWeight:700}}>Chơi lại</button>
                </div>
              </div>
            </div>
          )}

          {summaryOpen && (
            <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:120}}>
              <div style={{width:440,background:'linear-gradient(180deg,#fffef8,#fff7f0)',padding:28,borderRadius:16,boxShadow:'0 40px 120px rgba(10,20,10,0.28)',textAlign:'center',animation:'popIn 320ms cubic-bezier(.2,.9,.2,1) both',border:'1px solid rgba(0,0,0,0.06)'}}>
                <h2 style={{margin:'0 0 8px',fontSize:22,color:'#6b3f1a'}}>Tổng kết</h2>
                <div style={{color:'#7a5236',marginBottom:14}}>Chúc mừng — bạn đã hoàn thành phần Tạo hình</div>
                <div style={{display:'flex',justifyContent:'center',gap:12,marginBottom:14}}>
                  {[1,2,3].map(i=> (
                    <span key={i} style={{fontSize:46, transform: i<=starCount ? 'scale(1.06)' : 'scale(.92)', transition:'transform 260ms cubic-bezier(.2,.9,.2,1)', color: i<=starCount ? '#6b3f1a' : '#e9dfd4'}} aria-hidden>
                      {i<=starCount ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <div style={{color:'#5b3a26',marginBottom:10}}>Tiến độ: <strong>{Math.round(progress*100)}%</strong></div>
                <div style={{color:'#5b3a26',marginBottom:18}}>Thời gian còn lại: <strong>{timeLeft}s</strong></div>
                <div style={{display:'flex',gap:12,justifyContent:'center'}}>
                  <button onClick={async ()=>{
                    try{ localStorage.setItem('screen2_phase1_stars', String(starCount)); localStorage.setItem('screen2_phase1_result','won') }catch{}
                    // save progress and map stars to score
                    try {
                      let userId: number | undefined
                      try { const profile = await import('../../../api/services/authService').then(m => m.authService.getProfile()); userId = Number(profile?.user_id ?? profile?.id ?? profile?.userId) } catch { userId = undefined }
                      const all = await levelsService.getByVillage(1, userId)
                      if (Array.isArray(all)) {
                        const current = all.find(x => Number(x.level_number ?? x.level_id ?? x.id) === 2)
                        if (current) {
                          const score = starCount === 3 ? 100 : starCount === 2 ? 70 : 40
                          await progressService.saveProgress({ user_id: 1, level_id: Number(current.level_id ?? current.id), status: 'completed', score })
                          try {
                            // attempt to unlock the next level (level_number + 1)
                            const curNum = Number(current.level_number ?? current.level_id ?? current.id)
                            const next = all.find(x => Number(x.level_number ?? x.level_id ?? x.id) === curNum + 1)
                            if (next) {
                              const nextId = Number(next.level_id ?? next.id)
                              if (nextId) await progressService.unlockLevel(nextId)
                            }
                          } catch (er) { console.warn('unlock next level failed', er) }
                        }
                      }
                    } catch (e) { console.warn('complete level failed', e) }
                    setSummaryOpen(false)
                    if (onComplete) return onComplete({ stars: starCount })
                    navigate('/craft-selection?openName=B%C3%A1t%20Tr%C3%A0ng')
                  }} style={{padding:'10px 18px',background:'linear-gradient(90deg,#10b981,#06a86b)',color:'white',borderRadius:12,border:'none',fontWeight:800}}>Hoàn tất</button>
                  <button onClick={()=>{ setSummaryOpen(false); reset(); }} style={{padding:'10px 18px',background:'white',borderRadius:12,border:'1px solid rgba(0,0,0,0.06)',fontWeight:700}}>Chơi lại</button>
                </div>
              </div>
            </div>
          )}

          {state === 'lost' && (
            <div className="absolute inset-0 flex items-center justify-center z-40">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-xl font-bold">Hết thời gian</h2>
                <p className="mt-2">Bạn đã hết thời gian — thử lại nhé.</p>
                <div className="mt-4 flex gap-2 justify-center">
                  <button onClick={start} className="px-4 py-2 bg-amber-500 text-white rounded">Thử lại</button>
                  <button onClick={() => navigate('/craft-selection?openName=B%C3%A1t%20Tr%C3%A0ng')} className="px-4 py-2 bg-white border rounded">Thoát</button>
                </div>
              </div>
            </div>
          )}

          {/* Guide dialog for Level 2 */}
          {!challengeMode && (
            <div style={{position:'absolute', right:40, top:96, zIndex:40, transition: 'transform 320ms ease'}}>
              <GuideDialog
                started={state === 'playing'}
                showRequireStart={false}
                win={state === 'won'}
                progress={Math.round(progress * 100)}
                onNext={() => { /* nothing for now */ }}
                phase="phase2"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
