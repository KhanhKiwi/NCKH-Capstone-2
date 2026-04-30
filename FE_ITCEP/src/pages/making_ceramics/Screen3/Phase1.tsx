import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { QUESTIONS_LEVEL3 as QUESTIONS } from '../../../util/question_ceramics/questions_level3'
import { progressService } from '../../../api/progress/progressService'
import type { Q } from '../../../util/question_ceramics/questions'
export default function BatTrangLevel3Screen3() {
  function shuffle<T>(arr: T[]) {
    const a = arr.slice()
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const t = a[i]
      a[i] = a[j]
      a[j] = t
    }
    return a
  }

  const [shuffledQuestions] = useState<Q[]>(() => QUESTIONS.map(q => ({ ...q, choices: shuffle(q.choices) })))
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [feedback, setFeedback] = useState<string | null>(null)
  const [shakeId, setShakeId] = useState<string | null>(null)
  const [correctId, setCorrectId] = useState<string | null>(null)
  const [confetti, setConfetti] = useState<number[]>([])
  const navigate = useNavigate()

  useEffect(() => { document.title = 'Bát Tràng — Level 3.1: Phơi khô (Trắc nghiệm)' }, [])

  // lock page scroll while this screen is mounted (prevent pull/scroll)
  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow
    const prevBodyOverflow = document.body.style.overflow
    const prevOverscroll = (document.documentElement.style as any).overscrollBehavior
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    try { (document.documentElement.style as any).overscrollBehavior = 'none' } catch (e) {}
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow
      document.body.style.overflow = prevBodyOverflow
      try { (document.documentElement.style as any).overscrollBehavior = prevOverscroll } catch (e) {}
    }
  }, [])

  const questions = shuffledQuestions
  const q = questions[index]

  function select(choiceId: string) {
    setAnswers(prev => ({ ...prev, [q.id]: choiceId }))
    if (q.correct === choiceId) {
      setFeedback('Đúng — lựa chọn phù hợp')
      setCorrectId(choiceId)
      setConfetti(Array.from({ length: 18 }, (_, i) => i))
      setTimeout(() => setConfetti([]), 1400)
      setTimeout(() => setCorrectId(null), 800)
    } else {
      setFeedback('Sai — vui lòng thử lại')
      setShakeId(choiceId)
      setTimeout(() => setShakeId(null), 600)
    }
  }

  async function next() {
    const selected = answers[q.id]
    if (!selected) {
      setFeedback('Vui lòng chọn một đáp án trước khi tiếp tục')
      return
    }
    if (selected !== q.correct) {
      setFeedback('Sai — vui lòng chọn lại')
      setShakeId(selected)
      setTimeout(() => setShakeId(null), 600)
      return
    }
    setFeedback(null)
    if (index < questions.length - 1) {
      const nextIdx = index + 1
      setIndex(nextIdx)
      return
    }

    try {
      await progressService.saveProgress({ user_id: 1, level_id: 2, status: 'unlocked', score: 0 })
      await progressService.saveProgress({ user_id: 1, level_id: 2, status: 'completed', score: 100 })
    } catch (e) { console.warn('progress save failed', e) }

    navigate('/bat-trang/level-3/phase2')
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-amber-50 to-white py-6">
      <div className="max-w-3xl mx-auto px-6 h-full flex flex-col">
        <header className="mb-8">
          <style>{`
            .fade-in-up { animation: fadeInUp 520ms cubic-bezier(.2,.9,.2,1) both }
            @keyframes fadeInUp { from { transform: translateY(8px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
          `}</style>
          <div className="fade-in-up bg-gradient-to-r from-amber-50 via-white to-white rounded-2xl p-6 sm:p-8 shadow-lg border border-amber-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-md">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M12 2c2.5 0 4 1.5 4 3.5S14.5 9 12 9s-4-2-4-3.5S9.5 2 12 2z" fill="rgba(255,255,255,0.95)" />
                    <path d="M4 12c0 4 3 8 8 8s8-4 8-8c0-1.2-.9-2-2-2H6c-1.1 0-2 .8-2 2z" fill="rgba(255,255,255,0.85)" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-900 leading-tight" style={{ textShadow: '0 6px 18px rgba(34,34,34,0.06)' }}>Level 3 — Màn 1: Phơi khô</h1>
                <p className="mt-1 text-sm sm:text-base text-amber-700 max-w-xl">5 câu về phơi khô và quản lý độ ẩm — hoàn thành để tiếp tục.</p>
              </div>
            </div>
          </div>
        </header>

        <main className="bg-white rounded-xl shadow border p-6 overflow-y-auto overflow-x-hidden relative flex-1">
          <style>{`
            .q-enter { animation: slideIn 420ms cubic-bezier(.2,.9,.2,1); }
            @keyframes slideIn { from { transform: translateY(8px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
            .choice-shake { animation: shake 560ms cubic-bezier(.2,.9,.2,1); }
            @keyframes shake { 0% { transform: translateX(0) } 20% { transform: translateX(-6px) } 40% { transform: translateX(6px) } 60% { transform: translateX(-4px) } 80% { transform: translateX(4px) } 100% { transform: translateX(0) } }
            .choice-correct { animation: pop 640ms cubic-bezier(.2,.9,.2,1); box-shadow: 0 10px 28px rgba(245,158,11,0.18); transform: translateY(-4px); border-color:#f59e0b }
            @keyframes pop { 0% { transform: scale(.9); opacity: 0 } 60% { transform: scale(1.08); opacity: 1 } 100% { transform: scale(1); opacity: 1 } }
            .confetti-piece { position: absolute; width: 8px; height: 12px; opacity: 0.95; transform-origin: center; border-radius: 2px; }
            @keyframes confettiFall { to { transform: translateY(260px) rotate(540deg); opacity: 0 } }
            .correct-badge { display:inline-flex; align-items:center; gap:8px; background:linear-gradient(90deg,#ecfccb,#bbf7d0); padding:6px 10px; border-radius:999px; color:#065f46; font-weight:600 }
          `}</style>

          <div className={`mb-4 q-enter`}>
            <div className="text-sm text-gray-700 font-semibold">Câu {index + 1} / {questions.length}</div>
            <div className="mt-2 text-lg">{q.question}</div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {q.choices.map(c => {
              const selected = answers[q.id] === c.id
              const isShake = shakeId === c.id
              const isCorrectAnim = correctId === c.id && q.correct === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => select(c.id)}
                  className={`text-left p-3 rounded-lg border flex items-center gap-3 ${selected ? 'bg-amber-100 border-amber-300' : 'bg-white hover:bg-amber-50'} ${isShake ? 'choice-shake' : ''} ${isCorrectAnim ? 'choice-correct' : ''}`}
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-50 text-2xl">{c.id === 'a' ? '🥣' : c.id === 'b' ? '🟤' : c.id === 'c' ? '🌾' : '🪨'}</div>
                  <div className="flex-1">
                    <div className="font-medium">{c.label}</div>
                    {c.hint && <div className="text-xs text-gray-500 mt-1">{c.hint}</div>}
                  </div>
                  {selected && q.correct === c.id && (
                    <div className="text-emerald-700 font-semibold">✓</div>
                  )}
                </button>
              )
            })}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600 flex items-center gap-3">
              {feedback && feedback.startsWith('Đúng') && <div className="correct-badge">🎉 <span>{feedback}</span></div>}
              {feedback && !feedback.startsWith('Đúng') && <div>{feedback}</div>}
            </div>
            <div className="flex gap-3">
              <Link to="/craft-selection?openName=B%C3%A1t%20Tr%C3%A0ng" className="px-4 py-2 bg-white border rounded">Thoát</Link>
               <button onClick={next} className="px-4 py-2 bg-amber-500 text-white rounded">{index < questions.length - 1 ? 'Tiếp' : 'Hoàn thành'}</button>
            </div>
          </div>

          {confetti.length > 0 && (
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, pointerEvents: 'none' }}>
              {confetti.map(i => {
                const left = 8 + Math.random() * 84
                const delay = Math.random() * 400
                const size = 6 + Math.random() * 10
                const color = ['#f97316','#f43f5e','#10b981','#60a5fa','#facc15'][i % 5]
                return (
                  <div
                    key={i}
                    className="confetti-piece"
                    style={{ left: `${left}%`, top: '-10px', width: `${size}px`, height: `${size+4}px`, background: color, animation: `confettiFall 1200ms cubic-bezier(.2,.8,.2,1) ${delay}ms both` }}
                  />
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
