import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import Screen1P1 from '../making_ceramics/Screen1/Phase1'
import Screen1P2 from '../making_ceramics/Screen1/Phase2'
import Screen2P1 from '../making_ceramics/Screen2/Phase1'
import Screen3P1 from '../making_ceramics/Screen3/Phase1'
import Screen3P2 from '../making_ceramics/Screen3/Phase2'
import Screen4P1 from '../making_ceramics/Screen4/Phase1'
import Screen5P1 from '../making_ceramics/Screen5/Phase1'
import Screen5P2 from '../making_ceramics/Screen5/Phase2'
import { userChallengesService } from '../../api/userChallenges/userChallengesService'
import { levelsService } from '../../api/levels/levelsService'

const SEQUENCE = [
  //{ id: '1-1', comp: Screen1P1 },
  //{ id: '1-2', comp: Screen1P2 },
  //{ id: '2-1', comp: Screen2P1 },
  //{ id: '3-1', comp: Screen3P1 },
  //{ id: '3-2', comp: Screen3P2 },
 // { id: '4-1', comp: Screen4P1 },
  //{ id: '5-1', comp: Screen5P1 },
  { id: '5-2', comp: Screen5P2 },
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

export default function ChallengeMakingCere() {
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()
  const [timerResetKey, setTimerResetKey] = useState(0)

  // debug: log render and step changes so we can trace where the flow stops
  React.useEffect(() => {
    console.log('[challenge] current index ->', index, 'step ->', SEQUENCE[index]?.id)
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
        // infer craft id for ceramics (fallback to 1)
        const craftId = await userChallengesService.inferCraftIdForCeramics()

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
          if (!cancelled) console.log('[challenge] saved user challenge', { craft_id: craftId, time: elapsedSec })
        } else {
          console.log('[challenge] not saving slower/equal time', { craft_id: craftId, time: elapsedSec })
        }
      } catch (e) {
        console.warn('[challenge] failed saving user challenge', e)
      }
    })()
    return () => { cancelled = true }
  }, [index])

  const step = SEQUENCE[index]
  const finished = index >= SEQUENCE.length
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
              <div className="sub">Chúc mừng — bạn đã vượt qua toàn bộ chuỗi thử thách của làng Gốm. Hãy nhận sao và chia sẻ chiến thắng!</div>

              <div style={{textAlign:'center',marginTop:8,color:'#7a5a44'}}>Thời gian hoàn thành: <strong style={{color:'#3f2b20'}}>{formatElapsed(elapsedSec)}</strong></div>

              <div style={{height:12}} />

              <div className="action-row">
                <button className="btn-primary" onClick={() => { setIndex(0); setTimerResetKey(k=>k+1) }} aria-label="Chơi lại">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v2a5 5 0 1 0 5 5h2a7 7 0 1 1-7-7z" fill="white" opacity=".9"/></svg>
                  Chơi lại
                </button>

                <button className="btn-ghost" onClick={() => { navigate('/challenge') }} aria-label="Tổng kết">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18M8 12h8M6 18h12" stroke="#6b4b37" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Tổng kết
                </button>
              </div>
            </div>

            {/* dynamic confetti pieces */}
            {confettiPieces.map(p => (
              <div key={p.id} className="confetti-piece" style={{left:p.left, animationDelay:`${p.delay}ms`, background:p.color, transform:`rotate(${p.rotate}deg) scale(${p.scale})`}} />
            ))}

            {/* subtle sparkles around trophy */}
            <div style={{position:'absolute',right:40,top:20,width:12,height:12,borderRadius:12,background:'#FFE7B2',boxShadow:'0 6px 18px rgba(255,200,90,0.14)',animation:'spark 1200ms ease-in-out infinite'}} />
            <div style={{position:'absolute',left:40,top:8,width:8,height:8,borderRadius:8,background:'#D6EFFF',boxShadow:'0 6px 18px rgba(6,182,212,0.12)',animation:'spark 1000ms ease-in-out 300ms infinite'}} />
          </div>
        </div>
      </div>
    )
  }

  

  const Comp: any = step.comp


  const handleComplete = (result?: any) => {
    console.log('challenge level complete', { index, result })
    setIndex(i => i + 1)
  }

  class ErrorBoundary extends React.Component<any, { error: any }>{
    constructor(props: any){ super(props); this.state = { error: null } }
    static getDerivedStateFromError(err: any){ return { error: err } }
    componentDidCatch(err: any, info: any){ console.error('Challenge error', err, info) }
    render(){
      if (this.state.error) {
        return (
          <div style={{padding:40}}>
            <h3 style={{fontSize:18,fontWeight:700}}>Đã xảy ra lỗi trong chế độ Thử thách</h3>
            <pre style={{whiteSpace:'pre-wrap',marginTop:12,color:'#b33'}}>{String(this.state.error)}</pre>
            <div style={{marginTop:12}}>
              <button onClick={() => window.location.reload()} style={{marginRight:8}}>Tải lại</button>
              <button onClick={() => navigate('/craft-selection?openName=B%C3%A1t%20Tr%C3%A0ng')}>Quay lại</button>
            </div>
          </div>
        )
      }
      return this.props.children
    }
  }

  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(180deg,#fffaf0,#fff0eb)'}}>
      <div style={{padding:20}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <h2 style={{fontSize:20,fontWeight:700}}>Chế độ Thử thách — Làng Gốm (Bát Tràng)</h2>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={{fontSize:14,color:'#6b5a4a'}}>Màn {index + 1} / {SEQUENCE.length}</div>
            <TimerDisplay resetKey={timerResetKey} />
          </div>
        </div>
      </div>
      <ErrorBoundary>
        {/* key ensures remount when step changes; pass onComplete and a debug prop */}
        <Comp key={step.id} onComplete={(res: any) => { console.log('[challenge] onComplete from', step.id, res); handleComplete(res) }} debugId={step.id} challengeMode={true} />
      </ErrorBoundary>
    </div>
  )
}
