import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Phase1 from './Phase1'
import Phase2 from './Phase2'
import Phase3 from './Phase3'
import Phase4 from './Phase4'
import { useAI } from '../../../contexts/AIContext'
import { useIdleTrigger, useSpamClickTrigger } from '../../../hooks/useNpcTriggers'

export default function Screen3() {
  const { triggerEvent } = useAI()
  const { pathname } = useLocation()

  const step =
    pathname.includes('phase4') ? 4 : pathname.includes('phase3') ? 3 : pathname.includes('phase2') ? 2 : 1

  useEffect(() => {
    const key = 'ai:new_player:level-3'
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, '1')
      triggerEvent({ event: 'new_player', level: 3, step: 1 }).catch(() => {})
    }
  }, [triggerEvent])

  useIdleTrigger(triggerEvent, { event: 'idle', level: 3, step }, 45_000)
  useSpamClickTrigger(triggerEvent, { event: 'spam_click', level: 3, step }, 10_000, 10)

  return (
    <>
      <button
        type="button"
        onClick={() => triggerEvent({ event: 'ask_info', level: 3, step }).catch(() => {})}
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
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

      <Routes>
        <Route index element={<Phase1 />} />
        <Route path="phase2" element={<Phase2 />} />
        <Route path="phase3" element={<Phase3 />} />
        <Route path="phase4" element={<Phase4 />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </>
  )
}

export { Phase1, Phase2, Phase3, Phase4 }
