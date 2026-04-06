import { createBrowserRouter } from 'react-router'
import { Navigate } from 'react-router-dom'
import CraftSelectionPage from '../pages/CraftSelectionPage'
import GamePage from '../pages/GamePage'
import Screen4 from '../pages/making mats/Screen4/Screen4'
import Screen2 from '../components/making_mats/Screen2'
import Screen3 from '../pages/making mats/Screen3'
import Screen5 from '../pages/making mats/Screen5'
import Screen6 from '../pages/making mats/Screen6'
import HomePage from '../pages/web-home/HomePage'
import BatTrangLevel0 from '../pages/making_ceramics/Screen0/screen0'
import BatTrangLevel1Screen1 from '../pages/making_ceramics/Screen1/Phase1'
import BatTrangLevel1Phase2 from '../pages/making_ceramics/Screen1/Phase2'
import VillageDetailPage from '../pages/VillageDetailPage'
import AdminPage from '../pages/admin/AdminPage'
import Screen1 from '../components/making_mats/Screen1'
import RootLayout from './RootLayout'
import { LoginPage } from '../components/log'

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // legacy/absolute phase paths redirect to their level-prefixed routes
      { path: 'phase2', element: <Navigate to="/level-3/phase2" replace /> },
      { path: 'phase3', element: <Navigate to="/level-3/phase3" replace /> },
      { path: 'phase4', element: <Navigate to="/level-3/phase4" replace /> },

      { index: true, Component: HomePage },
      { path: 'game', Component: GamePage },
      { path: 'craft-selection', Component: CraftSelectionPage },
      { path: 'level-1', Component: Screen1 },
      { path: 'level-2', Component: Screen2 },
      { path: 'level-3/*', Component: Screen3 },
      { path: 'level-4', Component: Screen4 },
      { path: 'level-5/*', Component: Screen5 },
      { path: 'level-6/*', Component: Screen6 },
      { path: 'village/:id', Component: VillageDetailPage },
      { path: 'bat-trang/level-1', Component: BatTrangLevel1Screen1 },
      { path: 'bat-trang/level-1/phase2', Component: BatTrangLevel1Phase2 },
      { path: 'bat-trang/level-0', Component: BatTrangLevel0 },
      { path: 'admin', Component: AdminPage },
    ],
  },
])

export default router
