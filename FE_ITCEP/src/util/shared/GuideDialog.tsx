import React from 'react'
import GuidePerson from './GuidePerson'
import Phase2Dialogues from '../shared_ceramics/phase2Dialogues'
import Phase3Dialogues from '../shared_ceramics/phase3Dialogues'
import Phase4Dialogues from '../shared_ceramics/phase4Dialogues'
import Phase5Dialogues from '../shared_ceramics/phase5Dialogues'
import { useEffect, useState } from 'react'

export default function GuideDialog({
  started,
  showRequireStart,
  win,
  progress,
  message: messageProp,
  phase,
  weather,
  event,
  onNext,
  avatarFirst
}: {
  started: boolean
  showRequireStart: boolean
  win: boolean
  progress: number
  message?: string
  phase?: string
  weather?: string
  event?: string
  onNext?: () => void
  avatarFirst?: boolean
}){
  const hintsByPhase: Record<string, string[]> = {
    phase1: [
      "Nhấn vào dao để chẻ sợi.",
      'Chọn thời điểm phù hợp để nhấn dao — quan sát chuyển động.',
      'Cố gắng chẻ đều tay để thu được nhiều lát hơn.',
      "Hoàn thành! Hãy bấm nút 'Giai đoạn tiếp theo' để qua màn tiếp theo."
    ],
    phase2: [
      'Hãy xem nhiệm vụ của bạn và chọn màu phù hợp',
      'Kéo cói vào đúng ô màu để hoàn thành nhiệm vụ.',
      'Tập trung theo dõi màu nhiệm vụ ở thanh bên; mỗi màu có số lượng cần đạt.',
      'Dùng thanh hứng (paddle) để bắt các bó cói — di chuyển nhanh/chậm theo nhịp rơi.',
      'Nếu lỡ bắt nhầm màu, bạn có thể thả hoặc thử bắt tiếp để cân bằng số lượng.',
      'Theo dõi thanh tiến độ phía dưới để biết còn bao nhiêu phần trăm.',
      "Hoàn thành! Hãy bấm nút 'Giai đoạn tiếp theo' để qua màn tiếp theo."
    ],
    phase3: [
      'Nhấn Bắt đầu để phơi cói — điều kiện thời tiết sẽ ảnh hưởng.',
      'Khi nắng, sợi sẽ khô nhanh hơn; mưa làm chậm tiến trình.',
      'Đưa cói ra/thu vào theo thời điểm để tối đa hoá tiến độ.',
      'Trời sắp nắng rồi',
      'Nếu trời chuyển nắng, hãy tận dụng để phơi thêm.',
      "Hoàn thành! Tiếp tục sang màn kế tiếp."
    ]
  }

  const phaseKey = phase || 'phase1'
  let message = messageProp ?? ''
  if (!messageProp) {
    if (phaseKey === 'phase2') {
      // Use Phase2Dialogues data for ceramics Phase 2
      if (!started) {
        message = showRequireStart ? "Nhấn 'Bắt đầu' để bắt đầu luyện nhão và làm mịn" : "Nhấn 'Bắt đầu' để chơi trò chơi"
      } else if (win) {
        message = Phase2Dialogues.end?.win || "Hoàn thành!"
      } else {
        // choose progress hint
        const p = Math.max(0, Math.min(100, Math.round(progress)))
        if (p < 25) message = Phase2Dialogues.progressHints?.low || ''
        else if (p < 60) message = Phase2Dialogues.progressHints?.mid || ''
        else if (p < 95) message = Phase2Dialogues.progressHints?.high || ''
        else message = Phase2Dialogues.progressHints?.complete || ''
        // fallback to first step if empty
        if (!message) message = (Phase2Dialogues.steps && Phase2Dialogues.steps[0]) || ''
      }
    } else if (phaseKey === 'phase3') {
      // Use Phase3Dialogues for ceramics Phase 3 (drying)
      if (!started) {
        message = showRequireStart ? "Nhấn 'Bắt đầu' để bắt đầu phơi gốm" : "Nhấn 'Bắt đầu' để chơi trò chơi"
      } else if (win) {
        message = Phase3Dialogues.end?.win || "Hoàn thành!"
      } else {
        const p = Math.max(0, Math.min(100, Math.round(progress)))
        if (p < 25) message = Phase3Dialogues.progressHints?.low || ''
        else if (p < 60) message = Phase3Dialogues.progressHints?.mid || ''
        else if (p < 95) message = Phase3Dialogues.progressHints?.high || ''
        else message = Phase3Dialogues.progressHints?.complete || ''
        if (!message) message = (Phase3Dialogues.steps && Phase3Dialogues.steps[0]) || ''
      }
    } else if (phaseKey === 'phase4') {
      // Use Phase4Dialogues for decoration phase
      if (!started) {
        message = showRequireStart ? "Nhấn 'Bắt đầu' để bắt đầu trang trí" : "Nhấn 'Bắt đầu' để chơi trò chơi"
      } else if (win) {
        message = Phase4Dialogues.end?.win || "Hoàn thành!"
      } else {
        const p = Math.max(0, Math.min(100, Math.round(progress)))
        if (p < 25) message = Phase4Dialogues.progressHints?.low || ''
        else if (p < 60) message = Phase4Dialogues.progressHints?.mid || ''
        else if (p < 95) message = Phase4Dialogues.progressHints?.high || ''
        else message = Phase4Dialogues.progressHints?.complete || ''
        if (!message) message = (Phase4Dialogues.steps && Phase4Dialogues.steps[0]) || ''
      }
    } else if (phaseKey === 'phase5') {
      // Use Phase5Dialogues for firing phase
      if (!started) {
        message = showRequireStart ? "Nhấn 'Bắt đầu' để bắt đầu nung" : "Nhấn 'Bắt đầu' để chơi trò chơi"
      } else if (win) {
        message = Phase5Dialogues.end?.win || "Hoàn thành!"
      } else {
        const p = Math.max(0, Math.min(100, Math.round(progress)))
        if (p < 25) message = Phase5Dialogues.progressHints?.low || ''
        else if (p < 60) message = Phase5Dialogues.progressHints?.mid || ''
        else if (p < 95) message = Phase5Dialogues.progressHints?.high || ''
        else message = Phase5Dialogues.progressHints?.complete || ''
        if (!message) message = (Phase5Dialogues.steps && Phase5Dialogues.steps[0]) || ''
      }
    } else {
      if (showRequireStart && !started) {
        message = "Hãy bấm 'Bắt đầu' để bắt đầu trò chơi, sau đó nhấn vào dao để chẻ sợi"
      } else if (!started) {
        message = "Nhấn 'Bắt đầu' để chơi trò chơi"
      } else if (win) {
        const finalHints = hintsByPhase[phaseKey] || hintsByPhase.phase1
        message = finalHints[finalHints.length - 1]
      } else {
        const hints = hintsByPhase[phaseKey] || hintsByPhase.phase1
        if (phaseKey === 'phase3' && typeof event === 'string') {
          if (event === 'started') {
            message = 'Bắt đầu phơi — hãy đưa cói ra khi trời nắng để tăng tiến độ.'
          } else if (event === 'soon_rain') {
            message = 'Trời sắp nắng — hãy chuẩn bị cói ra phơi.'
          } else if (event === 'raining') {
            message = 'Đang mưa — tạm dừng phơi và thu cói vào nơi an toàn.'
          } else if (event === 'soon_clear' || event === 'sun_coming' || event === 'soon_sunny') {
            message = 'Sắp hết mưa — có thể chuẩn bị phơi trở lại để tận dụng thời tiết.'
          }
        }

        if (!message) {
          if (phaseKey === 'phase3' && typeof weather === 'string') {
            if (weather === 'soon_rain' || weather === 'cloudy_soon') {
              message = 'Thời tiết có vẻ sắp nắng - hãy chuẩn bị cói để phơi.'
            } else if (weather === 'raining' || weather === 'rain') {
              message = 'Đang mưa — tạm dừng phơi và thu cói vào nơi an toàn.'
            } else if (weather === 'stopped' || weather === 'clear') {
              message = 'Hết mưa rồi — có thể phơi tiếp để tăng tiến độ.'
            } else if (weather === 'sunny') {
              message = 'Điều kiện tốt để phơi, hãy đưa cói ra.'
            }
          }
        }

        if (!message) {
          const hintCount = Math.max(1, hints.length - 1)
          const idx = Math.min(hintCount - 1, Math.floor((progress / 100) * hintCount))
          message = hints[idx]
        }
      }
    }
  }

  const [displayText, setDisplayText] = useState(message)
  const [visible, setVisible] = useState(true)

  // animate text change: fade out -> swap -> fade in
  useEffect(() => {
    if (message === displayText) return
    setVisible(false)
    const t1 = setTimeout(() => {
      setDisplayText(message)
      setVisible(true)
    }, 220)
    return () => clearTimeout(t1)
  }, [message, displayText])

  // styles
  const container: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    transform: 'translateX(0)',
    transition: 'transform 320ms cubic-bezier(.2,.9,.3,1), opacity 320ms ease',
    opacity: 1,
    marginTop: 14,
  }

  const bubbleBase: React.CSSProperties = {
    maxWidth: 360,
    background: 'linear-gradient(90deg, #ffffff, #f7fff7)',
    padding: '12px 18px',
    borderRadius: 999,
    boxShadow: '0 18px 40px rgba(6,120,60,0.06)',
    color: '#0b5b3f',
    fontWeight: 700,
    fontSize: 14,
    lineHeight: '1.2',
    border: '1px solid rgba(6,120,60,0.04)'
  }

  const bubbleAnim: React.CSSProperties = {
    transition: 'opacity 220ms ease, transform 260ms cubic-bezier(.2,.9,.2,1)',
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(-6px)'
  }

  const pulseWhenIdle: React.CSSProperties = !started ? { transform: 'scale(1.02)', boxShadow: '0 22px 60px rgba(6,120,60,0.08)', animation: 'pulse 1600ms ease-in-out infinite' } : {}

  const avatarWrap: React.CSSProperties = {
    width: 72,
    height: 72,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 320ms ease',
    // bob when started, gentle idle bounce when not started
    transform: started ? 'translateY(0)' : 'translateY(-4px)'
  }

  void onNext

  return (
    <div style={container}>
      <style>{`
        @keyframes pulse { 0% { transform: scale(1) } 50% { transform: scale(1.03) } 100% { transform: scale(1) } }
        @keyframes bob { 0% { transform: translateY(0) } 50% { transform: translateY(-6px) } 100% { transform: translateY(0) } }
      `}</style>
      {avatarFirst ? (
        <>
          <div style={{ ...avatarWrap }}>
            <div style={{ borderRadius: '50%', padding: 6, background: 'white', boxShadow: '0 8px 22px rgba(0,0,0,0.06)', animation: started ? 'bob 1400ms ease-in-out infinite' : 'bob 2400ms ease-in-out infinite' }}>
              <GuidePerson size={64} />
            </div>
          </div>
          <div style={{ ...bubbleBase, ...bubbleAnim, ...(!started ? { border: '1px solid rgba(6,120,60,0.06)' } : {}), ...( !started ? pulseWhenIdle : {} ) }}>
            {displayText}
          </div>
        </>
      ) : (
        <>
          <div style={{ ...bubbleBase, ...bubbleAnim, ...(!started ? { border: '1px solid rgba(6,120,60,0.06)' } : {}), ...( !started ? pulseWhenIdle : {} ) }}>
            {displayText}
          </div>
          <div style={{ ...avatarWrap }}>
            <div style={{ borderRadius: '50%', padding: 6, background: 'white', boxShadow: '0 8px 22px rgba(0,0,0,0.06)', animation: started ? 'bob 1400ms ease-in-out infinite' : 'bob 2400ms ease-in-out infinite' }}>
              <GuidePerson size={64} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
