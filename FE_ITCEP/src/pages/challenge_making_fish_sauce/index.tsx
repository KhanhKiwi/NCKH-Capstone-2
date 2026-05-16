import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import CatchFishGamePage from '../../components/Making_Fish_Sauce/Screen1/CatchFishGamePage'
import WashFishGamePage from '../../components/Making_Fish_Sauce/Screen2/WashFishGamePage'
import WashSaltGamePage from '../../components/Making_Fish_Sauce/Screen3/WashSaltGamePage'
import CloseJarFermentGamePage from '../../components/Making_Fish_Sauce/Screen4/CloseJarFermentGamePage'
import Screen5FinalExtraction from '../../components/Making_Fish_Sauce/Screen5/Screen5'
import Screen6EternalFragrance from '../../components/Making_Fish_Sauce/Screen6/Screen6'
import { userChallengesService } from '../../api/userChallenges/userChallengesService'
import { levelsService } from '../../api/levels/levelsService'
import { authService } from '../../api/services/authService'

const SEQUENCE = [
  { id: 'fish-sauce-1', comp: CatchFishGamePage, name: 'Bắt Cá' },
  { id: 'fish-sauce-2', comp: WashFishGamePage, name: 'Rửa Cá' },
  { id: 'fish-sauce-3', comp: WashSaltGamePage, name: 'Pha Muối' },
  { id: 'fish-sauce-4', comp: CloseJarFermentGamePage, name: 'Đóng Lu & Ủ Chứa' },
  { id: 'fish-sauce-5', comp: Screen5FinalExtraction, name: 'Di Sản Giọt Cuối' },
  { id: 'fish-sauce-6', comp: Screen6EternalFragrance, name: 'Vĩnh Cửu Hương' },
]

// Module-level TimerDisplay so it doesn't reset when the runner remounts.
function TimerDisplay({ resetKey }: { resetKey: number }){
  const initial = (typeof window !== 'undefined' && (window as any).__challengeElapsed) ? (window as any).__challengeElapsed : 0
  const [sec, setSec] = React.useState<number>(initial)
  React.useEffect(()=>{
    // reset when key changes
    setSec(0)
    try { if (typeof window !== 'undefined') (window as any).__challengeElapsed = 0 } catch {}
  }, [resetKey])
  React.useEffect(()=>{
    const id = window.setInterval(()=>{
      setSec(s => {
        const n = s + 1
        try { if (typeof window !== 'undefined') (window as any).__challengeElapsed = n } catch {}
        return n
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [])
  const mm = String(Math.floor(sec/60)).padStart(2,'0')
  const ss = String(sec%60).padStart(2,'0')
  return (
    <div style={{fontSize:14,fontWeight:700,color:'#6b5a4a',background:'rgba(255,255,255,0.6)',padding:'6px 10px',borderRadius:999}}>{mm}:{ss}</div>
  )
}

export default function ChallengeMakingFishSauce() {
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()
  const [timerResetKey, setTimerResetKey] = useState(0)
  const [isChecking, setIsChecking] = useState(true)
  const [canAccess, setCanAccess] = useState(false)

  // Check if user has completed all levels for village 8 (fish sauce)
  React.useEffect(() => {
    ;(async () => {
      try {
        let userId: number | undefined
        try {
          const profile = await authService.getProfile()
          userId = Number(profile?.user_id ?? profile?.id ?? profile?.userId)
        } catch {
          try {
            const token = localStorage.getItem('access_token')
            if (token) {
              const parts = token.split('.')
              if (parts.length >= 2) {
                const payload = JSON.parse(atob(parts[1]))
                userId = Number(payload?.user_id ?? payload?.sub ?? payload?.id)
              }
            }
          } catch (e) {}
        }

        if (!userId) {
          console.warn('[fish-sauce-challenge] no user id found')
          setIsChecking(false)
          return
        }

        const levels = await levelsService.getByVillage(8, userId)
        if (!Array.isArray(levels) || levels.length === 0) {
          console.warn('[fish-sauce-challenge] no levels found for village 8')
          setIsChecking(false)
          return
        }

        const nonIntro = levels.filter((x: any) => Number(x.level_id ?? x.id) !== 0)
        if (nonIntro.length === 0) {
          console.warn('[fish-sauce-challenge] no non-intro levels found')
          setIsChecking(false)
          return
        }

        const isCompleted = (lvl: any) => {
          const s = lvl?.progress?.status ?? lvl?.user_progress?.status ?? lvl?.userProgress?.status ?? lvl?.status
          if (s === 'completed') return true
          try {
            const raw = localStorage.getItem('local_progress') || '[]'
            const arr = JSON.parse(raw)
            const lvlId = Number(lvl.level_id ?? lvl.id)
            if (arr.find((e: any) => Number(e.level_id) === lvlId && e.status === 'completed')) return true
          } catch (e) {}
          return false
        }

        const allComplete = nonIntro.every(isCompleted)
        if (allComplete) {
          console.log('[fish-sauce-challenge] all levels completed, challenge is accessible')
          setCanAccess(true)
        } else {
          console.warn('[fish-sauce-challenge] not all levels completed, redirecting...')
          setTimeout(() => navigate('/challenge', { replace: true }), 1000)
        }
        setIsChecking(false)
      } catch (error) {
        console.error('[fish-sauce-challenge] progress check error', error)
        setIsChecking(false)
      }
    })()
  }, [navigate])

  // debug: log render and step changes
  React.useEffect(() => {
    console.log('[fish-sauce-challenge] current index ->', index, 'step ->', SEQUENCE[index]?.id)
  }, [index])

  // animations: confetti pieces and small particles when finished
  const [confettiPieces, setConfettiPieces] = useState<Array<{id:number; left:string; delay:number; color:string; rotate:number; scale:number}>>([])

  React.useEffect(() => {
    if (index >= SEQUENCE.length) {
      const colors = ['#F97316','#F59E0B','#10B981','#06B6D4','#7C3AED','#EF4444','#FDE68A']
      const pieces = Array.from({length:36}).map((_, i) => ({
        id: Date.now() + i,
        left: `${10 + Math.random() * 80}%`,
        delay: Math.floor(Math.random() * 600),
        color: colors[Math.floor(Math.random() * colors.length)],
        rotate: Math.floor(Math.random() * 720) - 360,
        scale: 0.7 + Math.random() * 0.9,
      }))
      setConfettiPieces(pieces)
      const t = setTimeout(() => setConfettiPieces([]), 3800)
      return () => clearTimeout(t)
    }
    setConfettiPieces([])
  }, [index])

  // when the challenge finishes, send result to backend (best-effort)
  React.useEffect(() => {
    if (! (index >= SEQUENCE.length)) return
    const elapsedSec = (typeof window !== 'undefined') ? Number((window as any).__challengeElapsed ?? 0) : 0
    let cancelled = false
    ;(async () => {
      try {
        // infer craft id for fish sauce (village_id = 8)
        const craftId = 8

        // get existing records for current user and check if we should save
        let shouldSave = true
        try {
          const my = await userChallengesService.getMyChallenges()
          if (Array.isArray(my) && my.length > 0) {
            const existing = my.find((r: any) => {
              const id = Number(r?.craft_id ?? r?.craft?.craft_id ?? r?.craft?.id ?? null)
              return id === Number(craftId)
            })
            if (existing && typeof existing.time !== 'undefined' && existing.time !== null) {
              const existingTime = Number(existing.time)
              const incoming = Number(elapsedSec)
              if (Number.isFinite(existingTime) && Number.isFinite(incoming)) {
                shouldSave = incoming < existingTime
              }
            }
          }
        } catch (e) {
          // if checking fails, fall back to attempting to save
          shouldSave = true
        }

        if (shouldSave) {
          await userChallengesService.saveChallenge({ craft_id: Number(craftId), time: Number(elapsedSec) })
          if (!cancelled) console.log('[fish-sauce-challenge] saved user challenge', { craft_id: craftId, time: elapsedSec })
        } else {
          console.log('[fish-sauce-challenge] not saving slower/equal time', { craft_id: craftId, time: elapsedSec })
        }
      } catch (e) {
        console.warn('[fish-sauce-challenge] failed saving user challenge', e)
      }
    })()
    return () => { cancelled = true }
  }, [index])

  const step = SEQUENCE[index]
  const finished = index >= SEQUENCE.length

  // Show loading while checking progress
  if (isChecking) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg,#fffaf0,#fff0eb)'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: 48, marginBottom: 20}}>⏳</div>
          <div style={{fontSize: 20, fontWeight: 600, color: '#3f2b20', marginBottom: 10}}>Kiểm tra tiến độ...</div>
          <div style={{fontSize: 14, color: '#7a5a44'}}>Vui lòng đợi</div>
        </div>
      </div>
    )
  }

  // Show blocked screen if user hasn't completed all levels
  if (!canAccess) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg,#fffaf0,#fff0eb)'}}>
        <div style={{textAlign: 'center', maxWidth: 400}}>
          <div style={{fontSize: 48, marginBottom: 20}}>🔒</div>
          <div style={{fontSize: 20, fontWeight: 600, color: '#3f2b20', marginBottom: 10}}>Chưa mở khóa Thử thách</div>
          <div style={{fontSize: 14, color: '#7a5a44', marginBottom: 20}}>Bạn hãy hoàn thành toàn bộ level của làng mắm Nam Ô để mở Thử thách.</div>
          <button 
            onClick={() => navigate('/challenge', { replace: true })}
            style={{padding: '12px 24px', background: 'linear-gradient(90deg, #13ce8a, #10b981)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer'}}
          >
            Quay Lại
          </button>
        </div>
      </div>
    )
  }

  if (finished) {
    const elapsedSec = (typeof window !== 'undefined') ? Number((window as any).__challengeElapsed ?? 0) : 0
    const formatElapsed = (s: number) => {
      const h = Math.floor(s / 3600)
      const m = Math.floor((s % 3600) / 60)
      const ss = s % 60
      if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`
      return `${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`
    }
    // finished all levels — show a polished completion screen
    return (
      <div style={{minHeight: '100vh', background: 'radial-gradient(1200px 600px at 50% 10%, #fffaf0, #fff0eb 25%, transparent 60%), linear-gradient(180deg,#fffaf0,#fff0eb)'}}>
        <div style={{padding:20}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <h2 style={{fontSize:24,fontWeight:800,color:'#3f2b20'}}>Chế độ Thử thách — Hoàn thành</h2>
            <div style={{fontSize:15,color:'#7a5a44'}}>Hoàn tất {SEQUENCE.length} màn</div>
          </div>
        </div>

        <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'68vh',padding:24}}>
          <div style={{position:'relative',width:'820px',maxWidth:'95%'}}>
            <style>{`
              .finish-card{background:linear-gradient(180deg,#fff,#fffaf5);padding:28px;border-radius:18px;box-shadow:0 40px 120px rgba(120,54,20,0.12);text-align:center;border:1px solid rgba(0,0,0,0.04)}
              .trophy{width:140px;height:140px;border-radius:999px;background:linear-gradient(90deg,#ffd86b,#ff7ab6);display:flex;align-items:center;justify-content:center;margin:-100px auto 12px;box-shadow:0 14px 40px rgba(157,81,224,0.14);transform:translateY(-6px)}
              .trophy-emoji{font-size:64px;filter:drop-shadow(0 8px 28px rgba(0,0,0,0.10))}
              .lead{font-size:32px;font-weight:900;color:#3b2416;line-height:1.05;margin-top:6px}
              .sub{color:#674d37;font-size:18px;margin-top:10px;margin-bottom:18px}
              .btn-primary{background:linear-gradient(90deg,#13ce8a,#10b981);color:white;padding:14px 26px;border-radius:999px;border:none;font-weight:900;font-size:16px;box-shadow:0 18px 44px rgba(16,185,129,0.18);display:inline-flex;align-items:center;gap:12px}
              .btn-primary svg{width:20px;height:20px;flex-shrink:0}
              .btn-ghost{background:linear-gradient(180deg,rgba(255,255,255,0.98),white);padding:12px 22px;border-radius:999px;border:1px solid rgba(0,0,0,0.06);font-weight:800;color:#5b3f2a;font-size:15px;display:inline-flex;align-items:center;gap:10px}
              .btn-ghost svg{width:18px;height:18px;flex-shrink:0}
              .action-row{display:flex;gap:16px;justify-content:center;margin-top:20px;align-items:center}
              .btn-primary:hover{transform:translateY(-6px) scale(1.04);box-shadow:0 22px 56px rgba(16,185,129,0.22)}
              .btn-ghost:hover{transform:translateY(-6px)}
              @keyframes floatUp {0%{transform:translateY(0)}50%{transform:translateY(-6px)}100%{transform:translateY(0)}}
              .trophy{animation:floatUp 2200ms ease-in-out infinite}
              .confetti-piece{position:absolute;top:8%;width:12px;height:20px;opacity:0;transform-origin:center;animation:confettiFall 1600ms cubic-bezier(.2,.9,.2,1) forwards}
              @keyframes confettiFall{0%{opacity:1;transform:translateY(0) rotate(0)}30%{transform:translateY(40px) rotate(90deg)}70%{transform:translateY(260px) rotate(360deg)}100%{opacity:0;transform:translateY(520px) rotate(720deg)}}

              /* trophy spark */
              @keyframes spark{0%{transform:scale(.9);opacity:0.85}50%{transform:scale(1.25);opacity:1}100%{transform:scale(.95);opacity:0.85}}

              /* title shimmer */
              .lead{position:relative;display:inline-block;background:linear-gradient(90deg,#5b4639,#8b6a53 40%, #5b4639);-webkit-background-clip:text;background-clip:text;color:transparent}
              .lead::after{content:'';position:absolute;left:-110%;top:0;right:-10%;bottom:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.65),transparent);transform:skewX(-20deg);animation:shine 2600ms linear infinite}
              @keyframes shine{0%{left:-120%}100%{left:140%}}

              /* button interactions */
              .btn-primary{transition:transform 220ms cubic-bezier(.2,.9,.2,1),box-shadow 220ms}
              .btn-primary:hover{transform:translateY(-6px) scale(1.03);box-shadow:0 18px 40px rgba(16,185,129,0.22)}
              .btn-primary:active{transform:translateY(-2px) scale(.99)}
              .btn-ghost{transition:transform 160ms}
              .btn-ghost:hover{transform:translateY(-4px)}
            `}</style>

            <div className="finish-card" style={{position:'relative',overflow:'visible'}}>
              <div className="trophy" aria-hidden>
                <div className="trophy-emoji">🏆</div>
              </div>

              <div className="lead">Bạn đã hoàn thành thử thách!</div>
              <div className="sub">Chúc mừng — bạn đã vượt qua toàn bộ chuỗi thử thách của làng Mắm Nam Ô. Hãy nhận sao và chia sẻ chiến thắng!</div>

              <div style={{textAlign:'center',marginTop:8,color:'#7a5a44'}}>Thời gian hoàn thành: <strong style={{color:'#3f2b20'}}>{formatElapsed(elapsedSec)}</strong></div>

              <div style={{height:12}} />

              <div className="action-row">
                <button className="btn-primary" onClick={() => { setIndex(0); setTimerResetKey(k=>k+1) }} aria-label="Chơi lại">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v2a5 5 0 1 0 5 5h2a7 7 0 1 1-7-7z" fill="white" opacity=".9"/></svg>
                  Chơi lại
                </button>
                <button className="btn-ghost" onClick={() => navigate('/challenge')} aria-label="Quay lại">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Quay lại
                </button>
              </div>
            </div>

            {confettiPieces.map((p) => (
              <div key={p.id} className="confetti-piece" style={{left:p.left,animationDelay:`${p.delay}ms`,backgroundColor:p.color,transform:`scale(${p.scale}) rotate(${p.rotate}deg)`}} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // In-progress runner view
  if (!step) return <div>Invalid step</div>

  const Component = step.comp
  const progress = ((index + 1) / SEQUENCE.length) * 100

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(180deg,#fffaf0 0%,#fff0eb 50%,#fffaf0)'}}>
      <div style={{padding:'12px 20px',background:'linear-gradient(90deg,#fff,#fffaf0)',borderBottom:'1px solid rgba(0,0,0,0.06)',display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,zIndex:1000}}>
        <h2 style={{fontSize:16,fontWeight:700,color:'#3f2b20',margin:0}}>
          Chế độ Thử thách: {step.name}
        </h2>
        <div style={{display:'flex',gap:16,alignItems:'center'}}>
          <div style={{fontSize:13,fontWeight:600,color:'#7a5a44'}}>
            Màn {index + 1}/{SEQUENCE.length}
          </div>
          <TimerDisplay resetKey={timerResetKey} />
        </div>
      </div>

      <div style={{background:'linear-gradient(90deg,rgba(200,150,100,0.04),rgba(180,130,80,0.04))',height:'6px'}}>
        <div style={{height:'100%',background:'linear-gradient(90deg,#d4a574,#b8904f)',width:`${progress}%`,transition:'width 200ms'}} />
      </div>

      <div style={{padding:'0',position:'relative'}}>
        <Component challengeMode={true} onComplete={() => setIndex(i => i + 1)} />
      </div>

      <button 
        onClick={() => setIndex(i => i + 1)}
        style={{
          position:'fixed',
          bottom:20,
          right:20,
          background:'linear-gradient(135deg,#b7843b,#8b6f47)',
          color:'white',
          border:'none',
          padding:'12px 20px',
          borderRadius:'8px',
          fontWeight:'700',
          cursor:'pointer',
          fontSize:14,
          zIndex:2000,
          boxShadow:'0 6px 20px rgba(0,0,0,0.15)',
          display: index < SEQUENCE.length - 1 ? 'block' : 'none'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.2)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)')}
      >
        Tiếp theo →
      </button>
    </div>
  )
}
