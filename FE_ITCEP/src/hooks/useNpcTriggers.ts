import { useEffect, useRef } from 'react'
import type { AIEventData } from '../contexts/AIContext'

export function useNewPlayerOnce(triggerEvent: (d: AIEventData) => Promise<void>, storageKey: string, payload: AIEventData) {
  useEffect(() => {
    if (!storageKey) return
    if (!localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, '1')
      triggerEvent(payload).catch(() => {})
    }
  }, [payload, storageKey, triggerEvent])
}

export function useIdleTrigger(
  triggerEvent: (d: AIEventData) => Promise<void>,
  payload: AIEventData,
  idleMs = 45_000,
) {
  const lastActivityRef = useRef(Date.now())
  const firedRef = useRef(false)

  useEffect(() => {
    const mark = () => {
      lastActivityRef.current = Date.now()
      firedRef.current = false
    }
    window.addEventListener('pointerdown', mark)
    window.addEventListener('keydown', mark)
    window.addEventListener('touchstart', mark)
    return () => {
      window.removeEventListener('pointerdown', mark)
      window.removeEventListener('keydown', mark)
      window.removeEventListener('touchstart', mark)
    }
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => {
      if (firedRef.current) return
      if (Date.now() - lastActivityRef.current >= idleMs) {
        firedRef.current = true
        triggerEvent(payload).catch(() => {})
      }
    }, 2000)
    return () => window.clearInterval(id)
  }, [idleMs, payload, triggerEvent])
}

export function useSpamClickTrigger(
  triggerEvent: (d: AIEventData) => Promise<void>,
  payload: AIEventData,
  windowMs = 10_000,
  threshold = 10,
) {
  const timesRef = useRef<number[]>([])
  const lastFireRef = useRef(0)

  useEffect(() => {
    const onPointerDown = () => {
      const now = Date.now()
      timesRef.current = [...timesRef.current.filter((t) => now - t <= windowMs), now]
      if (timesRef.current.length >= threshold && now - lastFireRef.current >= 10_000) {
        lastFireRef.current = now
        triggerEvent(payload).catch(() => {})
      }
    }
    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [payload, threshold, triggerEvent, windowMs])
}

