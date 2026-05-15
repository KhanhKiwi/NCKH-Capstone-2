import { useEffect } from 'react'

export default function useRevealOnScroll(selector = '.reveal-on-scroll', options: IntersectionObserverInit = { threshold: 0.12 }) {
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      // fallback: reveal immediately
      const els = document.querySelectorAll(selector)
      els.forEach((el) => el.classList.add('is-revealed'))
      return
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target as Element
        if (entry.isIntersecting) {
          // add class when entering viewport
          el.classList.add('is-revealed')
        } else {
          // remove class when leaving so it can animate again on re-entry
          el.classList.remove('is-revealed')
        }
      })
    }, options)

    const els = Array.from(document.querySelectorAll(selector))
    els.forEach((el) => obs.observe(el))

    return () => {
      obs.disconnect()
    }
  }, [selector, JSON.stringify(options)])
}
