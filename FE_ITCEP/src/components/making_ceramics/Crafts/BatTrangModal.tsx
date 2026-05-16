import { useEffect, useRef, useState } from 'react'
import { X, Lock } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { levelsService } from '../../../api/levels/levelsService'
import { progressService } from '../../../api/progress/progressService'
import { authService } from '../../../api/services/authService'

interface Level { id: number; level_number?: number; name: string; difficulty?: string; unlocked: boolean; completed: boolean; deleted_at?: string | null }

export default function BatTrangModal({ open = true, onClose }: { open?: boolean; onClose: () => void }) {
  const [levels, setLevels] = useState<Level[]>([])

  

  // Normalize levels: dedupe by id and ensure exactly one level 0.
  useEffect(() => {
    if (!levels) return
    const seen = new Set<number>()
    const deduped: Level[] = []
    for (const l of levels) {
      if (!seen.has(l.id)) {
        seen.add(l.id)
        deduped.push(l)
      }
    }
    // ensure level 0 exists at front
    if (!seen.has(0)) {
      deduped.unshift({ id: 0, name: 'Giới thiệu làng & hướng dẫn', unlocked: true, completed: false })
    } else {
      // if level 0 exists but not at index 0, move it to front
      const idx = deduped.findIndex(x => x.id === 0)
      if (idx > 0) {
        const [lvl0] = deduped.splice(idx, 1)
        deduped.unshift(lvl0)
      }
    }

    if (JSON.stringify(deduped) !== JSON.stringify(levels)) {
      setLevels(deduped)
    }
  }, [levels])

  useEffect(() => {
    // load levels from API (levels linked to village id 1 - Bát Tràng)
    let mounted = true
    ;(async () => {
      try {
        // attempt to include authenticated user's id so backend can return per-user `unlocked`
        let userId: number | undefined
        try {
          const profile = await authService.getProfile()
          userId = Number(profile?.user_id ?? profile?.id ?? profile?.userId)
        } catch {
          userId = undefined
        }
        let apiLevels: any[] = await levelsService.getByVillage(1, userId)
        console.debug('[BatTrangModal] apiLevels.length', apiLevels?.length)
        // fallback: if service returned none, try fetching all levels and filter by craft_id = 1
        if ((!apiLevels || apiLevels.length === 0)) {
          try {
            const all = await levelsService.getAll()
            if (Array.isArray(all) && all.length > 0) {
              apiLevels = all.filter((l: any) => {
                const craftId = l?.craft_id ?? (typeof l?.craft === 'number' ? l.craft : (l?.craft?.craft_id ?? l?.craft?.id ?? null))
                return Number(craftId ?? -1) === 1
              })
              console.debug('[BatTrangModal] fallback filtered levels from getAll, count=', apiLevels.length)
            }
          } catch (e) {
            console.warn('[BatTrangModal] fallback getAll failed', e)
          }
        }
        // map API levels to our UI Level shape

        console.debug('[BatTrangModal] apiLevels', apiLevels)
        const mapped: Level[] = (apiLevels || []).map((l) => {
          const idNum = Number(l.level_id ?? l.id)
          const levelNum = Number(l.level_number ?? l.levelNumber ?? (l.level_id ? (Number(l.level_id) - 1) : l.id))
          // prefer backend-provided `unlocked` boolean only; do not rely on client-side progress fetches
          const unlockedFromApi = Boolean(l.unlocked === true)
          return {
            id: idNum,
            level_number: Number(l.level_number ?? l.levelNumber ?? levelNum),
            name: l.name ?? `Cấp ${l.level_number ?? l.level_id ?? l.id}`,
            difficulty: l.difficulty ?? String(l.difficulty ?? ''),
              unlocked: unlockedFromApi,
              completed: false,
              deleted_at: l.deleted_at ?? null,
          }
        })
        console.debug('[BatTrangModal] mapped levels', mapped)

        // Use API and progress results only; do not use localStorage at all.
        try {
          // Use API-provided unlocked flag directly; do not synthesize from local progress
          const final = mapped.map(m => ({ ...m, unlocked: Boolean(m.unlocked), completed: Boolean(m.completed) }))
          if (mounted) setLevels(final)
          return
        } catch (err) {
          console.debug('[BatTrangModal] mapping failed', err)
        }

        if (mounted) setLevels(mapped)
      } catch (e) {
        // fallback: keep existing levels (empty) and do not auto-unlock
        if (mounted) {
          // keep whatever is already in state
        }
      }
    })()
    return () => { mounted = false }
  }, [])

  const pathRef = useRef<SVGPathElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [pathDrawn, setPathDrawn] = useState(false)
  const [nodePositions, setNodePositions] = useState<{ x: number; y: number }[]>([])
  const [nodeLengths, setNodeLengths] = useState<number[]>([])
  const pendingNavigationRef = useRef<string | null>(null)
  const navigate = useNavigate()

  // Draw path animation and compute node positions along path
  useEffect(() => {
    const p = pathRef.current
    const wrapper = wrapperRef.current
    if (!p || !wrapper) return

    const computePositions = () => {
      const activeLevels = levels.filter(l => l.id !== 0)
      const len = p.getTotalLength()
      const wrapperRect = wrapper.getBoundingClientRect()
      const svgEl = wrapper.querySelector('svg') as SVGSVGElement | null
      const svgRect = svgEl ? svgEl.getBoundingClientRect() : null

      // compute even-spaced points along the path for each active level (exclude id=0)
      const points = activeLevels.map((_, i) => {
        const t = (i + 1) / (activeLevels.length + 1)
        const pos = p.getPointAtLength(t * len)
        // Map SVG coords (viewBox 600x200) into actual svg pixel rect
        const svgWidth = svgRect ? svgRect.width : wrapper.clientWidth
        const svgHeight = svgRect ? svgRect.height : wrapper.clientHeight
        const px = (pos.x / 600) * svgWidth
        const py = (pos.y / 200) * svgHeight
        // Convert to wrapper-local coordinates (relative to wrapper top-left)
        const x = (svgRect ? svgRect.left : wrapperRect.left) - wrapperRect.left + px
        const y = (svgRect ? svgRect.top : wrapperRect.top) - wrapperRect.top + py
        return { x, y }
      })

      // compute lengths along the path for each node (used for focus/retract)
      const lengths = activeLevels.map((_, i) => ((i + 1) / (activeLevels.length + 1)) * len)
      setNodeLengths(lengths)

      setNodePositions(points)
    }

    // set up stroke animation
    const len = p.getTotalLength()
    p.style.strokeDasharray = String(len)
    p.style.strokeDashoffset = String(len)
    void p.getBoundingClientRect()
    p.style.transition = 'stroke-dashoffset 1.6s ease-in-out'
    const start = setTimeout(() => { p.style.strokeDashoffset = '0' }, 80)
    const onEnd = () => setPathDrawn(true)
    p.addEventListener('transitionend', onEnd)

    // transitionend handler for navigation after retract
    const onTransitionEndNav = (ev: TransitionEvent) => {
      if (ev.propertyName !== 'stroke-dashoffset') return
      if (pendingNavigationRef.current) {
        const url = pendingNavigationRef.current
        pendingNavigationRef.current = null
        // use SPA navigation so global audio isn't interrupted
        navigate(url)
      }
    }
    p.addEventListener('transitionend', onTransitionEndNav)

    computePositions()
    const onResize = () => computePositions()
    window.addEventListener('resize', onResize)

    return () => {
      clearTimeout(start)
      p.removeEventListener('transitionend', onEnd)
      p.removeEventListener('transitionend', onTransitionEndNav)
      window.removeEventListener('resize', onResize)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levels])

  return (
    <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6 ${open ? '' : 'hidden'}`}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-gray-100">
        <div className="p-6 bg-gradient-to-r from-amber-600 to-emerald-600 text-white relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-80 h-80 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/30 via-white/10 to-transparent opacity-30 rotate-12" />
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-3xl font-bold mb-1" >làng gốm Thanh Hà</h2>
          <p className="text-1xl font-bold text-white/90">Làng gốm – nơi đất và lửa tạo nên hồn quê</p>
          {/* debug buttons removed */}
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
          <div className="mb-6">
            <div ref={wrapperRef} className="w-full h-44 rounded-xl bg-gradient-to-r from-amber-50 to-white flex items-center justify-center relative overflow-visible">
              <svg viewBox="0 0 600 200" className="w-full h-full">
                <defs>
                  <linearGradient id="g1" x1="0" x2="1">
                    <stop offset="0%" stopColor="#b7843b" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
                  {/* subtle glow path behind */}
                  <path d="M40 150 C140 20, 260 20, 360 150 C430 230, 520 80, 560 150" stroke="#f59e0b" strokeWidth={14} fill="none" strokeLinecap="round" style={{ filter: 'blur(6px)', opacity: pathDrawn ? 0.22 : 0.06, transition: 'opacity 600ms ease' }} />
                  <path id="bat-path" ref={pathRef} d="M40 150 C140 20, 260 20, 360 150 C430 230, 520 80, 560 150" stroke="url(#g1)" strokeWidth={6} fill="none" strokeLinecap="round" className={pathDrawn ? 'drop-shadow-[0_6px_12px_rgba(245,158,11,0.12)]' : ''} />
                  {/* animated accent moving dot (follows path) */}
                  {pathDrawn && (
                    <circle r={6} fill="#f59e0b">
                      <animateMotion dur="4s" repeatCount="indefinite">
                        <mpath href="#bat-path" />
                      </animateMotion>
                    </circle>
                  )}
              </svg>

              {/* render nodes visually on top of path (exclude level id 0) */}
              {nodePositions.map((pos, i) => {
                const activeLevels = levels.filter(l => l.id !== 0)
                const lvl = activeLevels[i]
                return (
                  <div
                    key={i}
                    className="group"
                    style={{ position: 'absolute', left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)', pointerEvents: 'auto' }}
                  >
                    <div className="relative flex items-center justify-center">
                      <button
                        onClick={async () => {
                          const levelId = Number(lvl.id)
                          const levelNumber = Number(lvl.level_number ?? lvl.id)
                          // if locked, attempt to unlock via API (will redirect to login on 401)
                          if (!lvl?.unlocked) {
                            try {
                              await progressService.unlockLevel(levelId)
                              // update local state to reflect unlock so UI shows new state
                              setLevels(prev => prev.map(p => p.id === lvl.id ? { ...p, unlocked: true } : p))
                            } catch (err) {
                              console.error('Failed to unlock level', err)
                              return
                            }
                          }
                          // navigate to level by level_number (open phase0 first)
                          navigate(`/bat-trang/level-${levelNumber}/phase0`)
                        }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg text-white text-base font-bold transform transition-all duration-300 ${lvl?.unlocked ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 ring-4 ring-emerald-100/50' : 'bg-gray-300'}`}
                        aria-label={`Cấp ${lvl?.level_number ?? lvl?.id}`}
                        style={{ transitionDelay: `${i * 120}ms`, animation: pathDrawn ? `nodePop 540ms cubic-bezier(.2,.9,.2,1) ${i * 120}ms both` : 'none' }}
                      >
                        {lvl?.level_number ?? lvl?.id}
                      </button>

                      <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 mb-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 transform-gpu group-hover:translate-y-0 -translate-y-2">
                        <div className="bg-white rounded-xl px-4 py-3 shadow-2xl border border-gray-100 text-sm text-gray-800 whitespace-nowrap w-48">
                          <div className="font-semibold">Cấp {lvl?.level_number ?? lvl?.id}</div>
                            <div className="text-xs text-gray-500">{lvl?.difficulty ?? lvl?.name}</div>
                          {lvl?.unlocked ? (
                            <div className="mt-3 text-right">
                              <button
                                onClick={() => {
                                  // animate retract to this node, then navigate
                                  const p = pathRef.current
                                  const targetPath = `/bat-trang/level-${Number(lvl.level_number ?? lvl.id)}/phase0`
                                  if (!p) { navigate(targetPath); return }
                                  const total = p.getTotalLength()
                                  const nodeLen = nodeLengths[i] ?? ((i + 1) / (levels.filter(l => l.id !== 0).length + 1)) * total
                                  const targetOffset = Math.max(0, total - nodeLen)
                                  pendingNavigationRef.current = targetPath
                                  p.style.transition = 'stroke-dashoffset 700ms cubic-bezier(.2,.9,.2,1)'
                                  p.style.strokeDashoffset = String(targetOffset)
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-full text-xs font-semibold transition-colors"
                              >Chơi</button>
                            </div>
                          ) : (
                            <div className="mt-2 text-xs text-gray-500">Khoá</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* inline styles for animations */}
              <style>{`
                @keyframes nodePop {
                  0% { transform: scale(0.4); opacity: 0 }
                  60% { transform: scale(1.12); opacity: 1 }
                  100% { transform: scale(1); opacity: 1 }
                }
                @keyframes nodePulse {
                  0% { box-shadow: 0 6px 18px rgba(37,99,235,0.06) }
                  50% { box-shadow: 0 10px 26px rgba(37,99,235,0.12) }
                  100% { box-shadow: 0 6px 18px rgba(37,99,235,0.06) }
                }
                /* small subtle float for the accent dot */
                circle[ r ] { transform-origin: center; }
              `}</style>

              {/* label removed per request (use level 0 instead) */}
            </div>
          </div>

          {/* fallback list for accessibility and small screens */}
          <div className="space-y-4 mt-6 lg:hidden">
            {levels.filter(l => l.id !== 0).map((level) => (
              <div key={level.id} className={`flex items-center gap-4 p-4 rounded-xl border ${level.unlocked ? 'bg-gradient-to-r from-yellow-50 to-white border-amber-200' : 'bg-gray-50 border-gray-200 opacity-80'}`}>
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md ${level.unlocked ? 'bg-emerald-600 text-white' : 'bg-gray-300 text-white'}`}>
                  {level.unlocked ? <span className="text-lg font-bold">{level.level_number ?? level.id}</span> : <Lock className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className={`text-lg font-semibold ${level.unlocked ? 'text-gray-800' : 'text-gray-500'}`}>Cấp {level.level_number ?? level.id}</div>
                  <div className={`text-sm ${level.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>{level.difficulty ?? level.name}</div>
                </div>
                <div>
                  {level.unlocked ? (
                    <Link to={`/bat-trang/level-${Number(level.level_number ?? level.id)}/phase0`}>
                      <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors">Chơi ngay</button>
                    </Link>
                  ) : (
                    <div className="text-sm text-gray-500 px-4 py-2 rounded-full">Đã khóa</div>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">Hãy hoàn thành các màn chơi</p>
        </div>
      </div>
    </div>
  )
}
