import { useEffect } from 'react'
import { useLocation } from 'react-router'

export default function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    // instant for same-page anchors, smooth for normal navigation
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    } catch (e) {
      window.scrollTo(0, 0)
    }
  }, [location.pathname])

  return null
}
