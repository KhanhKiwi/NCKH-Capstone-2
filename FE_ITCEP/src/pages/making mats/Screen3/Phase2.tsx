import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'
import '../../../styles/Screen3/Phase2/game.css'
import TaskBadge from '../../../components/making_mats/Screen3/Phase2/TaskBadge'
import ColorSelector from '../../../components/making_mats/Screen3/Phase2/ColorSelector'
import Board from '../../../components/making_mats/Screen3/Phase2/Board'
import ProgressFooter from '../../../components/making_mats/Screen3/Phase2/ProgressFooter'
import GuideDialog from '../../../util/shared/GuideDialog'

type Reed = {
  id: number
  x: number
  y: number
  baseX: number
  width: number
  height: number
  speed: number
  rot: number
  rotSpeed: number
  swayAmp: number
  swayFreq: number
  swayPhase: number
  caught?: boolean
}

export default function Phase2({ onExit }: { onExit?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const paddleRef = useRef<HTMLDivElement>(null)

  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [dragEnabled, setDragEnabled] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [paddleX, setPaddleX] = useState<number>(0)
  const [reeds, setReeds] = useState<Reed[]>([])
  const [, setCaught] = useState(0)
  const [running, setRunning] = useState(true)
  const [gameResult, setGameResult] = useState<null | 'won' | 'lost'>(null)
  const navigate = useNavigate()
  
  const idRef = useRef(1)
  const rafRef = useRef<number | null>(null)
  const lastRef = useRef<number | null>(null)
  const selectedColorRef = useRef<string | null>(null)
  const countedIdsRef = useRef<Set<number>>(new Set())
  const selectShouldCenterRef = useRef<boolean>(true)

  const swatchColors = useMemo(() => ['#e74c3c', '#f1c40f', '#27ae60'], [])
  
  const colorNames: Record<string, string> = useMemo(() => ({ 
    '#e74c3c': 'đỏ', 
    '#f1c40f': 'vàng', 
    '#27ae60': 'xanh lá' 
  }), [])

  const [taskCounts, setTaskCounts] = useState<Record<string, number>>(() => {
    const total = 10
    const a = Math.floor(Math.random() * (total + 1))
    const b = Math.floor(Math.random() * (total - a + 1))
    const c = total - a - b
    return { [swatchColors[0]]: a, [swatchColors[1]]: b, [swatchColors[2]]: c }
  })

  const [caughtCounts, setCaughtCounts] = useState<Record<string, number>>(() => {
    const obj: Record<string, number> = {}
    swatchColors.forEach(c => obj[c] = 0)
    return obj
  })
  
  const [caughtSegments, setCaughtSegments] = useState<string[]>([])
  const [hideSegmentsUntilCatch, setHideSegmentsUntilCatch] = useState(false)

  useEffect(() => { selectedColorRef.current = selectedColor }, [selectedColor])

  useEffect(() => {
    return () => { if (onExit) console.log('Cleaning up Phase 2'); }
  }, [onExit])

  const endGame = useCallback((result: 'won' | 'lost') => {
    setGameResult(result)
    setIsPlaying(false)
    setRunning(false)
    // persist stars for phase2: won => 3, lost => 0
    try {
      const stars = result === 'won' ? 3 : 0
      localStorage.setItem('phase2_stars', String(stars))
      localStorage.setItem('phase2_result', result)
    } catch (e) { }
  }, [])

  const randomizeTaskCounts = useCallback((total = 10) => {
    const a = Math.floor(Math.random() * (total + 1))
    const b = Math.floor(Math.random() * (total - a + 1))
    const c = total - a - b
    setTaskCounts({ [swatchColors[0]]: a, [swatchColors[1]]: b, [swatchColors[2]]: c })
  }, [swatchColors])

  const buildTaskSummary = useCallback(() => {
    const parts: string[] = []
    for (const c of swatchColors) {
      const n = taskCounts[c] || 0
      if (n > 0) parts.push(`${n} bó ${colorNames[c]}`)
    }
    return parts.length === 0 ? 'Chưa có nhiệm vụ' : `Nhiệm vụ: Nhuộm ${parts.join(', ')}`
  }, [swatchColors, taskCounts, colorNames])

  // --- GAME ENGINE ---

  useEffect(() => {
    const t = setInterval(() => {
      if (!running || !isPlaying) return
      const container = containerRef.current
      if (!container) return
      const w = container.clientWidth
      const spawnCount = 1 + Math.floor(Math.random() * 2)
      const newReeds: Reed[] = []
      for (let i = 0; i < spawnCount; i++) {
        const id = idRef.current++
        const baseX = Math.random() * Math.max(0, w - 40)
        newReeds.push({
          id, baseX, x: baseX, y: -80 - Math.random() * 60,
          width: 14, height: 90,
          speed: (20 + Math.random() * 60) * 0.7, rot: (Math.random() - 0.5) * 10,
          rotSpeed: 0, swayAmp: 0, swayFreq: 0, swayPhase: Math.random() * Math.PI * 2
        })
      }
      setReeds(r => [...r, ...newReeds])
    }, 800)
    return () => clearInterval(t)
  }, [running, isPlaying])

  useEffect(() => {
    if (!isPlaying) return
    function step(now: number) {
      if (lastRef.current == null) lastRef.current = now
      const dt = (now - lastRef.current) / 1000
      lastRef.current = now

      setReeds(prev => {
        const container = containerRef.current
        const paddle = paddleRef.current
        if (!container || !paddle) return prev
        
        const newArr: Reed[] = []
        const paddleRect = paddle.getBoundingClientRect()
        const contRect = container.getBoundingClientRect()

        for (const r of prev) {
          if (r.caught) continue
          const ny = r.y + r.speed * dt
          const updated: Reed = { ...r, y: ny }
          
          const reedRectTop = contRect.top + ny
          const reedLeft = contRect.left + updated.x
          const reedRight = reedLeft + updated.width
          
          if (reedRectTop + 18 >= paddleRect.top && reedRectTop <= paddleRect.top + paddleRect.height) {
            if (!(reedRight < paddleRect.left || reedLeft > paddleRect.right)) {
              if (!countedIdsRef.current.has(r.id)) {
                countedIdsRef.current.add(r.id)
                setCaught(c => c + 1)
                const sc = selectedColorRef.current
                if (sc) {
                  setCaughtCounts(p => ({ ...p, [sc]: (p[sc] || 0) + 1 }))
                  setCaughtSegments(ps => [...ps, sc])
                  setHideSegmentsUntilCatch(false)
                }
              }
              continue
            }
          }

          if (updated.y > container.clientHeight + 40) {
            // reed passed bottom — drop it without counting
            continue
          }
          newArr.push(updated)
        }
        return newArr
      })
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); lastRef.current = null }
  }, [isPlaying, endGame])

  useEffect(() => {
    if (!isPlaying || gameResult) return
    const totalTasks = Object.values(taskCounts).reduce((s, v) => s + (v || 0), 0)
    if (totalTasks > 0 && caughtSegments.length >= totalTasks) {
      const ok = swatchColors.every(c => (caughtCounts[c] || 0) >= (taskCounts[c] || 0))
      endGame(ok ? 'won' : 'lost')
    }
  }, [caughtSegments, taskCounts, caughtCounts, swatchColors, endGame, isPlaying, gameResult])

  // --- EVENT HANDLERS ---

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragEnabled) return
      const cont = containerRef.current
      const padd = paddleRef.current
      if (!cont || !padd) return
      const rect = cont.getBoundingClientRect()
      let x = e.clientX - rect.left - padd.clientWidth / 2
      x = Math.max(0, Math.min(x, cont.clientWidth - padd.clientWidth))
      setPaddleX(x)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [dragEnabled])

  useEffect(() => {
    const stop = () => setDragEnabled(false)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
    return () => {
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
    }
  }, [])

  function handleSelect(color: string, center = true) {
    selectShouldCenterRef.current = center
    setSelectedColor(color)
    setDragEnabled(false)
    setHideSegmentsUntilCatch(true)
    const cont = containerRef.current
    if (center && cont) setPaddleX((cont.clientWidth - 80) / 2)
  }

  // If handleSelect ran before Board mounted (containerRef null), ensure paddle centers
  useEffect(() => {
    if (!selectedColor) return
    if (!selectShouldCenterRef.current) return
    const cont = containerRef.current
    if (cont) {
      setPaddleX((cont.clientWidth - 80) / 2)
    }
  }, [selectedColor])

  // Keyboard shortcuts: z -> first color, x -> second, c -> third
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()

      if (k === 'z' && swatchColors[0]) handleSelect(swatchColors[0], false)
      else if (k === 'x' && swatchColors[1]) handleSelect(swatchColors[1], false)
      else if (k === 'c' && swatchColors[2]) handleSelect(swatchColors[2], false)
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [swatchColors, handleSelect])

  function startGame() {
    setReeds([]); setCaught(0); setRunning(true); setGameResult(null); setIsPlaying(true)
    setCaughtCounts(() => {
      const obj: Record<string, number> = {}
      swatchColors.forEach(c => obj[c] = 0)
      return obj
    })
    setCaughtSegments([]); setHideSegmentsUntilCatch(false); countedIdsRef.current.clear()
  }

  function handleBack() {
    setIsPlaying(false); setRunning(false); setSelectedColor(null); setReeds([]); setCaught(0)
    setCaughtSegments([]); setGameResult(null); countedIdsRef.current.clear()
  }

  const currentPercent = useMemo(() => {
    if (!selectedColor || hideSegmentsUntilCatch) return 0
    const totalTasks = Object.values(taskCounts).reduce((s, v) => s + (v || 0), 0) || 1
    return Math.min(100, Math.round((caughtSegments.length / totalTasks) * 100))
  }, [selectedColor, hideSegmentsUntilCatch, taskCounts, caughtSegments])

  return (
    <div className="phase2-root">
      <div style={{position:'absolute', right:40, top:96, zIndex:40, transition: 'transform 320ms ease', transform: gameResult === 'won' ? 'translateX(0)' : 'translateX(0)'}}>
        <GuideDialog
          started={isPlaying}
          showRequireStart={false}
          win={gameResult === 'won'}
          progress={currentPercent}
          onNext={() => navigate('/phase3')}
          phase="phase2"
          message={gameResult === 'won'
            ? 'Chúc mừng bạn đã chiến thắng — hãy vào Giai đoạn cuối nào!'
            : (!selectedColor ? 'Tiếp tục là trò nhuộm màu — hãy click vào ô màu bất kì để xem nhiệm vụ.' : undefined)
          }
        />
      </div>
      <div className="phase2-header">
        <div className="instruction-row">
          <p className="phase-instruction">Kéo các bó sợi cói đã chè vào màu tương ứng để tạo ra những <span className="beautiful-text">màu sắc tự nhiên</span></p>
          {/* missed indicator removed */}
        </div>
        <TaskBadge text={selectedColor ? buildTaskSummary() : 'Giai đoạn 2: Nhuộm màu'} />
      </div>

      {!selectedColor && (
        <ColorSelector swatchColors={swatchColors} selectedColor={selectedColor} onSelect={handleSelect} />
      )}

      {selectedColor && (
        <Board
          containerRef={containerRef as React.RefObject<HTMLDivElement>}
          reeds={reeds}
          paddleX={paddleX}
          paddleRef={paddleRef as React.RefObject<HTMLDivElement>}
          selectedColor={selectedColor}
          dragEnabled={dragEnabled}
          onPaddlePointerDown={(e: React.PointerEvent<HTMLDivElement>) => { 
            e.preventDefault()
            setDragEnabled(true)
            try { (e.target as HTMLElement).setPointerCapture(e.pointerId) } catch { /* ignore */ }
          }}
          onChangeColor={setSelectedColor}
        />
      )}

      <ProgressFooter
        selectedColor={selectedColor}
        isPlaying={isPlaying}
        currentPercent={currentPercent}
        hideSegmentsUntilCatch={hideSegmentsUntilCatch}
        caughtSegments={caughtSegments}
        startGame={startGame}
        replayGame={startGame}
        handleBack={handleBack}
        resetGame={() => randomizeTaskCounts(10)}
        gameResult={gameResult}
      />
      {/* Removed duplicate large CTA button — navigation handled in footer */}
    </div>
  )
}