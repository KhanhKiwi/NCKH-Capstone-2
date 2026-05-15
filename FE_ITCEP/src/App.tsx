
import { RouterProvider } from 'react-router'
import { router } from './routes'
import './App.css'
import { useEffect } from 'react'
import { analyticsService } from './api/analytics/analyticsService'

function App() {
  useEffect(() => {
    try {
      const key = 'site_visit_counted_v1'
      if (!localStorage.getItem(key)) {
        // create a simple visit event
        analyticsService.createEvent({ event_type: 'visit', event_data: JSON.stringify({ ua: navigator.userAgent, path: window.location.pathname }) }).catch(() => {})
        localStorage.setItem(key, '1')
      }
    } catch (e) {
      // ignore errors
    }
  }, [])

  return <RouterProvider router={router} />
}

export default App