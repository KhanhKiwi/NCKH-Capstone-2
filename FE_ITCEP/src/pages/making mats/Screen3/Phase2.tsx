import React, { useEffect, useRef, useState } from 'react'
import '../../../styles/Screen3/Phase2/game.css'
import TaskBadge from '../../../components/making_mats/Screen3/Phase2/TaskBadge'
import ColorSelector from '../../../components/making_mats/Screen3/Phase2/ColorSelector'
import Board from '../../../components/making_mats/Screen3/Phase2/Board'
import ProgressFooter from '../../../components/making_mats/Screen3/Phase2/ProgressFooter'

type Reed = {
  id: number
  x: number
  y: number
  baseX?: number
  width?: number
  height?: number
  speed: number
  rot?: number
  rotSpeed?: number
  swayAmp?: number
  swayFreq?: number
  swayPhase?: number
  caught?: boolean
}

export default function Phase2({ onExit }: { onExit?: () => void }){
  const containerRef = useRef<HTMLDivElement | null>(null)
  const paddleRef = useRef<HTMLDivElement | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [dragEnabled, setDragEnabled] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [paddleX, setPaddleX] = useState<number>(0)
  const [reeds, setReeds] = useState<Reed[]>([])
  const [caught, setCaught] = useState(0)
  const [missed, setMissed] = useState(0)
  const [running, setRunning] = useState(true)
  const [gameResult, setGameResult] = useState<null | 'won' | 'lost'>(null)
  const idRef = useRef(1)
  const rafRef = useRef<number | null>(null)
  const lastRef = useRef<number | null>(null)
  const selectedColorRef = useRef<string | null>(null)
  useEffect(() => { selectedColorRef.current = selectedColor }, [selectedColor])
  const countedIdsRef = useRef<Set<number>>(new Set())
  const swatchColors = ['#e74c3c','#f1c40f','#27ae60']
  const colorNames: Record<string,string> = { '#e74c3c':'đỏ', '#f1c40f':'vàng', '#27ae60':'xanh lá' }

  const [caughtCounts, setCaughtCounts] = useState<Record<string, number>>(() => {
    const obj: Record<string, number> = {}
    swatchColors.forEach(c => obj[c] = 0)
    return obj
  })
  const [caughtSegments, setCaughtSegments] = useState<string[]>([])
  const [hideSegmentsUntilCatch, setHideSegmentsUntilCatch] = useState(false)
  const [taskCounts, setTaskCounts] = useState<Record<string, number>>({
    '#e74c3c': 5,
    '#f1c40f': 3,
    '#27ae60': 2
  })

  function randomizeTaskCounts(total = 10){
    // random partition of `total` into 3 non-negative integers
    const a = Math.floor(Math.random() * (total + 1))
    const b = Math.floor(Math.random() * (total - a + 1))
    const c = total - a - b
    setTaskCounts({ [swatchColors[0]]: a, [swatchColors[1]]: b, [swatchColors[2]]: c })
  }
  // initialize randomized tasks on mount
  useEffect(() => { randomizeTaskCounts(10) }, [])

  function handleReset(){
    // randomize targets and clear progress
    randomizeTaskCounts(10)
    setReeds([])
    setCaught(0)
    setMissed(0)
    setIsPlaying(false)
    setRunning(true)
    setCaughtCounts(() => {
      const obj: Record<string, number> = {}
      swatchColors.forEach(c => obj[c] = 0)
      return obj
    })
    setCaughtSegments([])
    setHideSegmentsUntilCatch(true)
    countedIdsRef.current.clear()
  }
  function buildTaskSummary(){
    const parts: string[] = []
    for (const c of swatchColors){
      const n = taskCounts[c] || 0
      if (n > 0) parts.push(`${n} bó ${colorNames[c]}`)
    }
    if (parts.length === 0) return 'Chưa có nhiệm vụ'
    return `Nhiệm vụ: Nhuộm ${parts.join(', ')}`
  }
// Task counts fixed to total 10 by initial state; no randomization at mount.

  useEffect(() => {
    // spawn reeds every 700ms — only when game shown and running
    // spawn multiple reeds per tick for a continuous, effectively unlimited fall
    const t = setInterval(() => {
      if (!running || !isPlaying) return
      const container = containerRef.current
      if (!container) return
      const w = container.clientWidth
      // spawn 1-3 reeds each tick
      const spawnCount = 1 + Math.floor(Math.random() * 3)
      const newReeds: Reed[] = []
      for (let i = 0; i < spawnCount; i++){
        const id = idRef.current++
        const baseX = Math.random() * Math.max(0, w - 40)
          const width = 8 + Math.random() * 18
          const height = 20 + Math.random() * 56
          // slower fall: smaller speed range
          const speed = 18 + Math.random() * 60
          // small fixed tilt, no dynamic rotation or sway so reeds fall straight
          const rot = (Math.random() - 0.5) * 10
          const rotSpeed = 0
          const swayAmp = 0
          const swayFreq = 0
        const swayPhase = Math.random() * Math.PI * 2
          newReeds.push({ id, baseX, x: baseX, y: -80 - Math.random() * 60, width, height, speed, rot, rotSpeed, swayAmp, swayFreq, swayPhase })
      }
      setReeds(r => [...r, ...newReeds])
    }, 600)
    return () => clearInterval(t)
  }, [running, isPlaying])

  useEffect(() => {
    if (!isPlaying) return
    function step(now: number){
      if (lastRef.current == null) lastRef.current = now
      const dt = (now - lastRef.current) / 1000
      lastRef.current = now
      setReeds(prev => {
        const container = containerRef.current
        const paddle = paddleRef.current
        const newArr: Reed[] = []
        for (const r of prev){
          if (r.caught) continue
          const ny = r.y + r.speed * dt
          // compute sway offset and rotation
          const phase = (now / 1000) * (r.swayFreq || 1) + (r.swayPhase || 0)
          const offset = Math.sin(phase) * (r.swayAmp || 0)
          const newRot = (r.rot || 0) + (r.rotSpeed || 0) * dt
          const updated: Reed = { ...r, y: ny, x: (r.baseX || r.x) + offset, rot: newRot }
          // collision check
          if (container && paddle){
            const paddleRect = paddle.getBoundingClientRect()
            const contRect = container.getBoundingClientRect()
            const reedRectTop = contRect.top + ny
            const reedLeft = contRect.left + (updated.x || 0)
            const reedRight = reedLeft + (r.width || 18)
            const paddleTop = paddleRect.top
            const paddleLeft = paddleRect.left
            const paddleRight = paddleRect.right
            if (reedRectTop + 18 >= paddleTop && reedRectTop <= paddleTop + paddleRect.height){
              // overlap horizontally
              if (!(reedRight < paddleLeft || reedLeft > paddleRight)){
                // caught
                // prevent double-counting the same reed id
                if (!countedIdsRef.current.has(r.id)){
                  countedIdsRef.current.add(r.id)
                  setCaught(c => c + 1)
                  const sc = selectedColorRef.current
                  if (sc) {
                    setCaughtCounts(prev => ({ ...prev, [sc]: (prev[sc] || 0) + 1 }))
                    // push one entry per caught reed (chronological single-color entries)
                    setCaughtSegments(prevSegs => [...prevSegs, sc])
                    setHideSegmentsUntilCatch(false)
                  }
                }
                continue
              }
            }
          }
          // missed check
          if (container && updated.y > container.clientHeight + 40){
            setMissed(m => m + 1)
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
  }, [isPlaying])

  useEffect(() => {
    const MISS_THRESHOLD = 10
    if (missed >= MISS_THRESHOLD){
      endGame('lost')
    }
  }, [missed])

  useEffect(() => {
    const totalTasks = Object.values(taskCounts).reduce((s, v) => s + (v || 0), 0) || 0
    if (totalTasks > 0 && caughtSegments.length >= totalTasks){
      // ensure per-color targets are met
      let ok = true
      for (const c of swatchColors){
        const need = taskCounts[c] || 0
        const got = caughtCounts[c] || 0
        if (got < need) { ok = false; break }
      }
      if (ok) endGame('won')
      else endGame('lost')
    }
  }, [caughtSegments, taskCounts, caughtCounts])

  // pointer drag for paddle
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

  // stop dragging when pointer is released or cancelled (press-and-hold behaviour)
  useEffect(() => {
    const stop = () => setDragEnabled(false)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
    return () => {
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
    }
  }, [])

  function handleSelect(color: string){
    setSelectedColor(color)
    setDragEnabled(false)
    setHideSegmentsUntilCatch(true)
    // center paddle
    const cont = containerRef.current
    if (cont){ setPaddleX((cont.clientWidth - 80)/2) }
  }

  function enableDrag(){ if (selectedColor) setDragEnabled(true) }

  function startGame(){
    // prepare and start
    // prepare to start (do NOT randomize task targets here)
    setReeds([])
    setCaught(0)
    setMissed(0)
    setRunning(true)
    setGameResult(null)
    setIsPlaying(true)
    // clear caught progress but do NOT change taskCounts
    setCaughtCounts(() => {
      const obj: Record<string, number> = {}
      swatchColors.forEach(c => obj[c] = 0)
      return obj
    })
    setCaughtSegments([])
    setHideSegmentsUntilCatch(false)
    countedIdsRef.current.clear()
  }

  function replayGame(){
    // replay with same task targets
    setReeds([])
    setCaught(0)
    setMissed(0)
    setCaughtCounts(() => {
      const obj: Record<string, number> = {}
      swatchColors.forEach(c => obj[c] = 0)
      return obj
    })
    setCaughtSegments([])
    setHideSegmentsUntilCatch(true)
    countedIdsRef.current.clear()
    setGameResult(null)
    setRunning(true)
    setIsPlaying(true)
  }

  function endGame(result: 'won' | 'lost'){
    setGameResult(result)
    setIsPlaying(false)
    setRunning(false)
  }

  function handleBack(){
    // if parent provided onExit, call it, otherwise reset UI to selection state
    if (onExit) return onExit()
    setIsPlaying(false)
    setRunning(false)
    setSelectedColor(null)
    setReeds([])
    setCaught(0)
    setMissed(0)
    setCaughtSegments([])
    setCaughtCounts(() => {
      const obj: Record<string, number> = {}
      swatchColors.forEach(c => obj[c] = 0)
      return obj
    })
    countedIdsRef.current.clear()
    setGameResult(null)
  }

  const currentPercent = (() => {
    if (!selectedColor) return 0
    if (hideSegmentsUntilCatch) return 0
    const totalTasks = Object.values(taskCounts).reduce((s, v) => s + (v || 0), 0) || 1
    const totalCaught = caughtSegments.length
    return Math.min(100, Math.round((totalCaught / totalTasks) * 100))
  })()

  return (
    <div className="phase2-root">
      <div className="phase2-header">
        <p className="phase-instruction">Kéo các bó sợi cói đã chè vào màu tương ứng để tạo ra những màu sắc tự nhiên, phục vụ quá trình nhuộm theo mực thiên nhiên.</p>
        <TaskBadge text={selectedColor ? buildTaskSummary() : 'Hãy click vào ô màu để xem nhiệm vụ trò chơi'} />
      </div>

      {!selectedColor && (
        <ColorSelector swatchColors={swatchColors} selectedColor={selectedColor} onSelect={(c:string)=>{ handleSelect(c) }} />
      )}

      {selectedColor && (
        <Board
          containerRef={containerRef}
          reeds={reeds}
          paddleX={paddleX}
          paddleRef={paddleRef}
          selectedColor={selectedColor}
          dragEnabled={dragEnabled}
          onPaddlePointerDown={(e:any)=>{ e.preventDefault(); setDragEnabled(true); try { paddleRef.current?.setPointerCapture?.(e.pointerId) } catch {} }}
          onChangeColor={(c:string)=> setSelectedColor(c)}
        />
      )}

      <ProgressFooter
        selectedColor={selectedColor}
        isPlaying={isPlaying}
        currentPercent={currentPercent}
        hideSegmentsUntilCatch={hideSegmentsUntilCatch}
        caughtSegments={caughtSegments}
        startGame={startGame}
        replayGame={replayGame}
        handleBack={handleBack}
        gameResult={gameResult}
      />
    </div>
  )
}
