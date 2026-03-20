function FailureMessage() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(t);
  }, []);
  if (!visible) return null;
  return (
    <div className="knife-message" style={{background: 'linear-gradient(90deg,#fff4f4,#ffeaea)', color: '#b93b3b'}}>Thất bại! Hết thời gian.</div>
  );
}
import { useEffect, useRef, useState } from 'react'

import TopPanel from '../../../components/making_mats/Screen3/Phase1/TopPanel'
import CenterHint from '../../../components/making_mats/Screen3/Phase1/CenterHint'
import BoardCanvas from '../../../components/making_mats/Screen3/Phase1/BoardCanvas'
import Controls from '../../../components/making_mats/Screen3/Phase1/Controls'

import Phase2 from './Phase2'

export default function Game(){
  const [showPhase2, setShowPhase2] = useState(false)
  const [started, setStarted] = useState(false);
  const [showRequireStart, setShowRequireStart] = useState(false);
  // Hide the start message after 5s
  useEffect(() => {
    if (showRequireStart) {
      const t = setTimeout(() => setShowRequireStart(false), 5000);
      return () => clearTimeout(t);
    }
  }, [showRequireStart]);

  const trackRef = useRef<HTMLDivElement | null>(null)
  const moverRef = useRef<HTMLDivElement | null>(null)
  const bladeRef = useRef<HTMLDivElement | null>(null)

  const posRef = useRef<number>(0)
  const dirRef = useRef<number>(1)
  const speedRef = useRef<number>(0.25)
  const rafRef = useRef<number | null>(null)

  const [running, setRunning] = useState<boolean>(true)
  // moverWidth not needed; measured when required via ref
  const [segments, setSegments] = useState<Array<{ type: string; w: number }>>([])
  const [bladeUp, setBladeUp] = useState<boolean>(false)
  const SLICES_NEEDED = 15
  const [slicesMade, setSlicesMade] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(90)
  const [gameOver, setGameOver] = useState(false)
  const [win, setWin] = useState(false)


  useEffect(() => {
    function measure() {
      const el = moverRef.current
      if (!el) return
      const totalW = el.clientWidth
      // create narrow reed strips (~12px) across the mover so it appears full of reeds
      const targetStrip = 12
      const count = Math.max(1, Math.floor(totalW / targetStrip))
      const base = Math.floor(totalW / count)
      const segs: Array<{ type: string; w: number }> = Array.from({ length: count }, () => ({ type: 'wood', w: base }))
      const used = base * count
      if (used < totalW) {
        segs[segs.length - 1].w += totalW - used
      }
      setSegments(prev => prev.length === 0 ? segs : prev)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    let last = performance.now()
    function step(now: number) {
      const dt = (now - last) / 1000
      last = now
      if (running && trackRef.current && moverRef.current) {
        const trackW = trackRef.current.clientWidth
        const moverW = moverRef.current.clientWidth
        const max = Math.max(0, trackW - moverW)
        let p = posRef.current + dirRef.current * speedRef.current * dt
        if (p > 1) { p = 1; dirRef.current = -1 }
        if (p < 0) { p = 0; dirRef.current = 1 }
        posRef.current = p
        const px = p * max
        if (moverRef.current) moverRef.current.style.transform = `translateX(${px}px)`
      }
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [running])

  useEffect(() => {
    let t: any = null;
    if (started && !win) {
      t = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000);
    }
    return () => { if (t) clearInterval(t); };
  }, [started, win])

  useEffect(() => { if (secondsLeft <= 0 && slicesMade < SLICES_NEEDED) { setGameOver(true); setRunning(false) } }, [secondsLeft, slicesMade])
  useEffect(() => { if (slicesMade >= SLICES_NEEDED) { setWin(true); setRunning(false) } }, [slicesMade])

  function handleKnifeClick(){
    if (!started) { setShowRequireStart(true); return; }
    if (!moverRef.current || !bladeRef.current) return
    if (bladeUp) return
    if (gameOver || win) return

    setRunning(false)
    setBladeUp(true)

    setTimeout(() => {
      if (!moverRef.current || !bladeRef.current) { setBladeUp(false); setRunning(true); return }
      const moverRect = moverRef.current.getBoundingClientRect()
      const bladeRect = bladeRef.current.getBoundingClientRect()
      const bladeCenter = bladeRect.left + bladeRect.width / 2
      const sliceX = bladeCenter - moverRect.left

      let acc = 0
      for (let i = 0; i < segments.length; i++){
        const segObj = segments[i]
        if (segObj.type !== 'wood') { acc += segObj.w; continue }
        const seg = segObj.w
        if (sliceX >= acc && sliceX <= acc + seg){
          const leftW = Math.max(1, Math.round(sliceX - acc))
          const rightW = Math.max(1, Math.round(seg - leftW))
          const gap = 5
          setSegments(prev => {
            const next = prev.slice(0, i)
            next.push({ type: 'wood', w: leftW })
            next.push({ type: 'gap', w: gap })
            next.push({ type: 'wood', w: rightW })
            next.push(...prev.slice(i + 1))
            return next
          })
          setSlicesMade(n => n + 1)
          break
        }
        acc += seg
      }

      setTimeout(() => { setBladeUp(false); setRunning(true) }, 450)
    }, 260)
  }

  function restart(){
    const w = moverRef.current ? moverRef.current.clientWidth : 600
    setSegments([{ type: 'wood', w }])
    setSlicesMade(0)
    setSecondsLeft(90)
    setGameOver(false)
    setWin(false)
    setRunning(true)
    setStarted(false)
  }

  let offset = 0
  const pieces = segments.map((seg, idx) => { const left = offset; offset += seg.w; return { seg, left, idx } })




  // Tính tiến độ dựa trên slicesMade
  const progress = Math.min(100, Math.round((slicesMade / SLICES_NEEDED) * 100));

  return (
    showPhase2 ? <Phase2 onExit={() => setShowPhase2(false)} /> : (
    <div className="screen1 board-root page-wrap">
      <TopPanel progress={progress} secondsLeft={secondsLeft} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CenterHint />
          <button
            className="start-btn"
            style={{ background: started ? 'linear-gradient(180deg,#fff7ee,#fff0df)' : 'linear-gradient(90deg,#bff3c9,#eaffef)', color: '#125b44', boxShadow: '0 2px 8px #bff3c966', cursor: (started && !gameOver && !win) ? 'not-allowed' : 'pointer', opacity: (started && !gameOver && !win) ? 0.6 : 1, transition: 'all 0.2s' }}
            disabled={started && !gameOver && !win}
            onClick={() => {
              if (win) {
                // go to phase 2
                setShowPhase2(true)
                return
              }
              if (gameOver) {
                restart();
                setStarted(true);
                setShowRequireStart(false);
              } else {
                setStarted(true);
                setShowRequireStart(false);
              }
            }}
          >{win ? 'Giai đoạn tiếp theo' : 'Bắt đầu'}</button>
        </div>
      </div>
      <div style={{ position: 'relative', width: 'fit-content', margin: '0 auto', marginTop: 8 }}>
        <BoardCanvas
          pieces={pieces}
          trackRef={trackRef}
          moverRef={moverRef}
          bladeRef={bladeRef}
          bladeUp={bladeUp}
          onKnifeClick={handleKnifeClick}
          onSplit={() => {
            setSlicesMade((prev) => Math.min(prev + 1, SLICES_NEEDED));
          }}
          started={started}
          onRequireStart={() => setShowRequireStart(true)}
          gameOver={gameOver}
        />
        {win && (
          <div className="knife-message" style={{background: 'linear-gradient(90deg,#eaffef,#dfffe8)', color: '#1a7a4f'}}>Hoàn thành!</div>
        )}
        {gameOver && !win && (
          <FailureMessage />
        )}
        {showRequireStart && !started && !win && (
          <div className="knife-message">Hãy nhấn Bắt đầu!</div>
        )}
      </div>
      <Controls />
    </div>
    )
  )
}
