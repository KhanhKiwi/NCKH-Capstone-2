import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAI, type AIEventData } from '../../contexts/AIContext'
import { useIdleTrigger, useNewPlayerOnce, useSpamClickTrigger } from '../../hooks/useNpcTriggers'

function getLevelLabel(pathname: string) {
  if (pathname.startsWith('/level-1')) return 'Level 1 · Nghề làm chiếu'
  if (pathname.startsWith('/level-3')) return 'Level 3 · Làng nghề'
  if (pathname.startsWith('/level-4')) return 'Level 4 · Làng dệt chiếu Đinh Yên'
  if (pathname.startsWith('/level-5')) return 'Level 5 · Làng nghề'
  if (pathname.startsWith('/level-6')) return 'Level 6 · Làng nghề'
  return 'Màn chơi'
}

export function MakingMatsLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const { triggerEvent } = useAI()
  const level = pathname.startsWith('/level-1')
    ? 1
    : pathname.startsWith('/level-3')
      ? 3
      : pathname.startsWith('/level-4')
        ? 4
        : pathname.startsWith('/level-5')
          ? 5
          : pathname.startsWith('/level-6')
            ? 6
            : 0
  const step = pathname.includes('phase4') || pathname.includes('/success')
    ? 3
    : pathname.includes('phase3') || pathname.includes('/fail')
      ? 2
      : pathname.includes('phase2')
        ? 2
        : 1

  useNewPlayerOnce(
    triggerEvent,
    level ? `ai:new_player:level-${level}` : '',
    level ? { event: 'new_player', level, step: 1 } : ({ event: 'ask_info' } as AIEventData),
  )
  useIdleTrigger(triggerEvent, { event: 'idle', level, step }, 45_000)
  useSpamClickTrigger(triggerEvent, { event: 'spam_click', level, step }, 10_000, 10)

  useEffect(() => {
    document.title = getLevelLabel(pathname)
  }, [pathname])

  return (
    <div>
      <button
        type="button"
        onClick={() => triggerEvent({ event: 'ask_info', level, step }).catch(() => {})}
        style={{
          position: 'fixed',
          right: 16,
          bottom: 16,
          zIndex: 1400,
          borderRadius: 999,
          padding: '10px 14px',
          background: 'rgba(17, 24, 39, 0.75)',
          border: '1px solid rgba(250, 204, 21, 0.4)',
          color: '#fde68a',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        Trợ giúp
      </button>
      {children}
    </div>
  )
}
