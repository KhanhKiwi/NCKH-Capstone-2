import { Outlet, useLocation } from 'react-router-dom'
import ScrollToTop from '../components/ScrollToTop'
import BackgroundMusic from '../components/BackgroundMusic/BackgroundMusic'
import { AIProvider } from '../contexts/AIContext'

export default function RootLayout() {
  const loc = useLocation()
  const isAdmin = loc.pathname.startsWith('/admin')

  return (
    <>
      <ScrollToTop />
      {/* render background music on non-admin pages only */}
      {!isAdmin && <BackgroundMusic />}
      <AIProvider>
        <Outlet />
      </AIProvider>
    </>
  )
}
