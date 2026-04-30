import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

const QUESTIONS = [
  {
    id: 1,
    q: 'Nhiệt độ nung ảnh hưởng lớn nhất đến điều nào sau đây?',
    options: ['Màu sắc men', 'Độ ẩm đất', 'Kích thước đất', 'Thời gian phơi'],
    a: 0,
  },
  {
    id: 2,
    q: 'Giai đoạn nung làm cho gốm trở nên:',
    options: ['Cứng hơn và bền hơn', 'Mềm và dẻo', 'Ẩm hơn', 'Nhẹ hơn'],
    a: 0,
  },
  {
    id: 3,
    q: 'Nếu nhiệt tăng quá nhanh, rủi ro chính là:',
    options: ['Nứt do sốc nhiệt', 'Men sáng bóng hơn', 'Gốm nhẹ hơn', 'Giảm thời gian nung'],
    a: 0,
  },
  {
    id: 4,
    q: 'Phạm vi nhiệt lý tưởng cho bài học này là:',
    options: ['900-1000°C', '1000-1050°C', '1050-1150°C', '1200-1300°C'],
    a: 2,
  },
  {
    id: 5,
    q: 'Giữ nhiệt trong vùng lý tưởng giúp:',
    options: ['Tăng chất lượng gốm', 'Giảm độ bền', 'Gây nứt', 'Làm gốm tan chảy'],
    a: 0,
  },
]

export default function BatTrangLevel5Phase0() {
  const navigate = useNavigate()
  type Q = { id: number; q: string; options: string[]; a: number }
  const shuffleArray = <T,>(arr: T[]) => {
    const a = arr.slice()
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = a[i]
      a[i] = a[j]
      a[j] = tmp
    }
    return a
  }

  const shuffleQuestion = (q: Q): Q => {
    const idx = q.options.map((_, i) => i)
    const shuffledIdx = shuffleArray(idx)
    const newOptions = shuffledIdx.map(i => q.options[i])
    const newA = shuffledIdx.findIndex(i => i === q.a)
    return { id: q.id, q: q.q, options: newOptions, a: newA }
  }

  const makeShuffledQuiz = () => shuffleArray(QUESTIONS.map(q => shuffleQuestion(q as Q)))

  const [quiz, setQuiz] = useState<Q[]>(() => makeShuffledQuiz())
  const [answers, setAnswers] = useState<Record<number, number | null>>({})
  const [submitted, setSubmitted] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [confetti, setConfetti] = useState<number[]>([])

  useEffect(() => {
    document.title = 'Bát Tràng — Level 5: Trắc nghiệm nung'
  }, [])

  const select = (id: number, idx: number) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [id]: idx }))
  }

  const handleSubmit = () => {
    const correct = quiz.reduce((acc, q) => {
      const sel = answers[q.id]
      return acc + (sel === q.a ? 1 : 0)
    }, 0)
    setCorrectCount(correct)
    setSubmitted(true)
    // trigger confetti if at least one correct
    if (correct > 0) {
      // create 24 confetti pieces
      setConfetti(Array.from({ length: 24 }, (_, i) => i))
      // clear after animation
      setTimeout(() => setConfetti([]), 3000)
    }
  }

  const handleContinue = () => {
    // only navigate if perfect score achieved -> go to firing phase (phase2)
    if (correctCount === quiz.length) {
      navigate('/bat-trang/level-5/phase2')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 flex items-center justify-center">
      <div className="max-w-3xl w-full px-6">
        <header className="relative rounded-2xl overflow-hidden bg-white shadow-xl border border-gray-100 mb-8 p-8">
          <h1 className="text-4xl font-extrabold mb-2">Level 5 — Trắc nghiệm: Nung gốm</h1>
          <p className="text-gray-700">Trả lời các câu hỏi ngắn sau để ôn lại kiến thức về nung trước khi vào lò.</p>
        </header>

        <main className="bg-white rounded-xl shadow border p-6 relative overflow-hidden">
          {/* Confetti layer */}
          {confetti.length > 0 && (
            <div className="pointer-events-none absolute inset-0 z-40">
              {confetti.map(i => (
                <span
                  key={i}
                  className="confetti"
                  style={{
                    left: `${10 + (i * 3) % 80}%`,
                    background: ['#F59E0B', '#10B981', '#EF4444', '#3B82F6'][i % 4],
                    transform: `translateY(-10vh) rotate(${i * 30}deg)`,
                    animationDelay: `${(i % 6) * 80}ms`,
                  }}
                />
              ))}
            </div>
          )}
          <ol className="space-y-6">
            {quiz.map((q, i) => (
              <li key={q.id} className="border p-4 rounded-lg">
                <div className="mb-3 font-semibold">{i + 1}. {q.q}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt, idx) => {
                      const sel = answers[q.id]
                      const isSelected = sel === idx
                      const showCorrect = submitted && q.a === idx
                      const wrongSelected = submitted && isSelected && sel !== q.a
                      return (
                        <div key={idx} className="relative">
                          <button
                            onClick={() => select(q.id, idx)}
                            className={`w-full text-left px-3 py-2 rounded-md border flex items-center justify-between ${isSelected ? 'bg-amber-100 border-amber-300' : 'bg-white'} ${showCorrect ? 'ring-2 ring-emerald-300 scale-up' : ''} ${wrongSelected ? 'bg-red-100 border-red-300 shake' : ''}`}
                          >
                            <span>{opt}</span>
                            <span className="ml-3">
                              {submitted && showCorrect && (
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-600">
                                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                              {submitted && wrongSelected && (
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-600">
                                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </span>
                          </button>
                        </div>
                      )
                    })}
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">{submitted ? `Đúng ${correctCount} / ${QUESTIONS.length}` : 'Chọn đáp án cho mỗi câu'}</div>
            <div className="flex gap-3">
              {!submitted ? (
                <button onClick={handleSubmit} className="px-4 py-2 bg-amber-500 text-white rounded-md">Nộp bài</button>
              ) : (
                <>
                  <button onClick={() => { setSubmitted(false); setAnswers({}); setCorrectCount(0); setQuiz(makeShuffledQuiz()) }} className="px-4 py-2 bg-white border rounded-md">Làm lại</button>
                  <button
                    onClick={handleContinue}
                    disabled={correctCount !== quiz.length}
                    className={`px-4 py-2 rounded-md ${correctCount === quiz.length ? 'bg-emerald-600 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                  >
                    Tiếp tục
                  </button>
                  {correctCount !== quiz.length && (
                    <div className="text-sm text-red-600 mt-2">Bạn phải trả lời đúng 5/5 mới được qua màn</div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// component-scoped styles for animations
const styles = `
.scale-up { animation: pop 420ms cubic-bezier(.2,.9,.3,1); }
.shake { animation: shake 650ms ease; }
.confetti { position: absolute; top: -10vh; width: 10px; height: 18px; border-radius: 2px; opacity: 0.95; transform-origin: center; animation: confetti-fall 2200ms cubic-bezier(.2,.8,.2,1) both; z-index:50 }

@keyframes pop {
  0% { transform: scale(.6); opacity: 0 }
  60% { transform: scale(1.15); opacity: 1 }
  100% { transform: scale(1); }
}

@keyframes shake {
  0% { transform: translateX(0) }
  20% { transform: translateX(-6px) }
  40% { transform: translateX(6px) }
  60% { transform: translateX(-4px) }
  80% { transform: translateX(4px) }
  100% { transform: translateX(0) }
}

@keyframes confetti-fall {
  0% { transform: translateY(-10vh) rotate(0deg); opacity: 1 }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0 }
}
`

// inject styles into document head once
if (typeof document !== 'undefined' && !document.getElementById('phase0-animations')) {
  const s = document.createElement('style')
  s.id = 'phase0-animations'
  s.innerHTML = styles
  document.head.appendChild(s)
}
